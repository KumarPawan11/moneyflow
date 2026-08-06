import { SupabaseClient } from "@supabase/supabase-js";
import { Database, AccountRow } from "@/lib/supabase/types";
import { CreateAccountInput } from "@/lib/validations/backend";
import { logServerAction } from "./logs";

export async function getAccounts(
  supabase: SupabaseClient<Database>,
  userId: string
): Promise<AccountRow[]> {
  const { data, error } = await supabase
    .from("accounts")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: true });

  if (error) {
    throw new Error(`Failed to fetch accounts: ${error.message}`);
  }

  return (data || []) as AccountRow[];
}

export async function createAccount(
  supabase: SupabaseClient<Database>,
  userId: string,
  input: CreateAccountInput
): Promise<AccountRow> {
  const { data, error } = await supabase
    .from("accounts")
    .insert({
      user_id: userId,
      name: input.name,
      type: input.type,
      balance: input.balance,
      currency: input.currency,
    })
    .select("*")
    .single();

  if (error || !data) {
    throw new Error(`Failed to create account: ${error?.message || "Unknown error"}`);
  }

  await logServerAction(supabase, userId, "account_created", { accountId: data.id, name: input.name });

  return data as AccountRow;
}
