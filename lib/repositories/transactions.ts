import { SupabaseClient } from "@supabase/supabase-js";
import { Database, TransactionWithDetails } from "@/lib/supabase/types";
import { CreateTransactionInput, UpdateTransactionInput, GetTransactionsFilterInput } from "@/lib/validations/backend";
import { logServerAction } from "./logs";

export async function createTransaction(
  supabase: SupabaseClient<Database>,
  userId: string,
  input: CreateTransactionInput
): Promise<TransactionWithDetails> {
  const transactionData = {
    user_id: userId,
    account_id: input.accountId ?? null,
    category_id: input.categoryId ?? null,
    amount: input.amount,
    type: input.type,
    bucket: input.bucket,
    date: input.date ? new Date(input.date).toISOString() : new Date().toISOString(),
    note: input.note ?? null,
    status: input.status,
    is_loan: input.isLoan,
  };

  const { data, error } = await supabase
    .from("transactions")
    .insert(transactionData)
    .select("*, account:accounts(*), category:categories(*)")
    .single();

  if (error || !data) {
    throw new Error(`Failed to create transaction: ${error?.message || "Unknown error"}`);
  }

  // Update account balance if associated with an account
  if (input.accountId && input.status === "completed") {
    const balanceAdjustment = input.type === "income" ? input.amount : -input.amount;
    const { data: account } = await supabase
      .from("accounts")
      .select("balance")
      .eq("id", input.accountId)
      .eq("user_id", userId)
      .single();

    if (account) {
      await supabase
        .from("accounts")
        .update({ balance: Number(account.balance) + balanceAdjustment })
        .eq("id", input.accountId)
        .eq("user_id", userId);
    }
  }

  // Create associated loan_entries record if marked as friend loan
  if (input.isLoan) {
    const rawLoanType = (input as { loanType?: "given" | "received" }).loanType || "given";
    const rawRecipient = (input as { recipient?: string }).recipient;
    let personName = rawRecipient || "Friend";

    if (!rawRecipient && input.note) {
      const match = input.note.match(/^(?:Given to|Taken from|To)\s+([^:]+)/i);
      if (match && match[1]) {
        personName = match[1].trim();
      } else {
        personName = input.note.trim();
      }
    }

    await supabase.from("loan_entries").insert({
      user_id: userId,
      person_name: personName,
      amount: input.amount,
      type: rawLoanType,
      status: "pending",
      note: input.note ?? null,
      transaction_id: data.id,
    });
  }

  await logServerAction(supabase, userId, "transaction_created", { transactionId: data.id, amount: input.amount });

  return data as unknown as TransactionWithDetails;
}

export async function updateTransaction(
  supabase: SupabaseClient<Database>,
  userId: string,
  input: UpdateTransactionInput
): Promise<TransactionWithDetails> {
  // Fetch existing transaction first to compute balance adjustments if needed
  const { data: existing, error: fetchErr } = await supabase
    .from("transactions")
    .select("*")
    .eq("id", input.id)
    .eq("user_id", userId)
    .single();

  if (fetchErr || !existing) {
    throw new Error("Transaction not found or unauthorized");
  }

  const updateData: Database["public"]["Tables"]["transactions"]["Update"] = {};
  if (input.accountId !== undefined) updateData.account_id = input.accountId;
  if (input.categoryId !== undefined) updateData.category_id = input.categoryId;
  if (input.amount !== undefined) updateData.amount = input.amount;
  if (input.type !== undefined) updateData.type = input.type;
  if (input.bucket !== undefined) updateData.bucket = input.bucket;
  if (input.date !== undefined) updateData.date = new Date(input.date).toISOString();
  if (input.note !== undefined) updateData.note = input.note;
  if (input.status !== undefined) updateData.status = input.status;
  if (input.isLoan !== undefined) updateData.is_loan = input.isLoan;

  const { data, error } = await supabase
    .from("transactions")
    .update(updateData)
    .eq("id", input.id)
    .eq("user_id", userId)
    .select("*, account:accounts(*), category:categories(*)")
    .single();

  if (error || !data) {
    throw new Error(`Failed to update transaction: ${error?.message || "Unknown error"}`);
  }

  await logServerAction(supabase, userId, "transaction_updated", { transactionId: input.id });

  return data as unknown as TransactionWithDetails;
}

export async function deleteTransaction(
  supabase: SupabaseClient<Database>,
  userId: string,
  transactionId: string
): Promise<{ success: boolean }> {
  const { data: existing } = await supabase
    .from("transactions")
    .select("*")
    .eq("id", transactionId)
    .eq("user_id", userId)
    .single();

  if (!existing) {
    throw new Error("Transaction not found or unauthorized");
  }

  // Revert account balance if applicable
  if (existing.account_id && existing.status === "completed") {
    const revertAdjustment = existing.type === "income" ? -Number(existing.amount) : Number(existing.amount);
    const { data: account } = await supabase
      .from("accounts")
      .select("balance")
      .eq("id", existing.account_id)
      .eq("user_id", userId)
      .single();

    if (account) {
      await supabase
        .from("accounts")
        .update({ balance: Number(account.balance) + revertAdjustment })
        .eq("id", existing.account_id)
        .eq("user_id", userId);
    }
  }

  const { error } = await supabase
    .from("transactions")
    .delete()
    .eq("id", transactionId)
    .eq("user_id", userId);

  if (error) {
    throw new Error(`Failed to delete transaction: ${error.message}`);
  }

  await logServerAction(supabase, userId, "transaction_deleted", { transactionId });

  return { success: true };
}

export async function getTransactions(
  supabase: SupabaseClient<Database>,
  userId: string,
  filter?: GetTransactionsFilterInput
): Promise<TransactionWithDetails[]> {
  let query = supabase
    .from("transactions")
    .select("id, user_id, account_id, category_id, amount, type, bucket, date, note, status, is_loan, created_at, updated_at, account:accounts(id, name, type), category:categories(id, name, color, icon, type)")
    .eq("user_id", userId)
    .order("date", { ascending: false });

  if (filter?.month) {
    const startDate = `${filter.month}-01T00:00:00.000Z`;
    const [yearStr, monthStr] = filter.month.split("-");
    const year = parseInt(yearStr, 10);
    const month = parseInt(monthStr, 10);
    const endDate = new Date(Date.UTC(year, month, 0, 23, 59, 59, 999)).toISOString();

    query = query.gte("date", startDate).lte("date", endDate);
  }

  if (filter?.categoryId) {
    query = query.eq("category_id", filter.categoryId);
  }

  if (filter?.accountId) {
    query = query.eq("account_id", filter.accountId);
  }

  if (filter?.type) {
    query = query.eq("type", filter.type);
  }

  if (filter?.bucket) {
    query = query.eq("bucket", filter.bucket);
  }

  const limit = filter?.limit ?? 50;
  const offset = filter?.offset ?? 0;

  query = query.range(offset, offset + limit - 1);

  const { data, error } = await query;

  if (error) {
    throw new Error(`Failed to fetch transactions: ${error.message}`);
  }

  return (data || []) as unknown as TransactionWithDetails[];
}
