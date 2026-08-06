import { SupabaseClient } from "@supabase/supabase-js";
import { Database, DashboardSummary, TransactionWithDetails } from "@/lib/supabase/types";

export async function getDashboardSummary(
  supabase: SupabaseClient<Database>,
  userId: string,
  targetMonth?: string
): Promise<DashboardSummary> {
  const month = targetMonth || new Date().toISOString().slice(0, 7);

  // 1. Fetch transactions, budget, and active loans concurrently
  const startDate = `${month}-01T00:00:00.000Z`;
  const [yearStr, monthStr] = month.split("-");
  const year = parseInt(yearStr, 10);
  const monthInt = parseInt(monthStr, 10);
  const endDate = new Date(Date.UTC(year, monthInt, 0, 23, 59, 59, 999)).toISOString();

  const [
    { data: transactions, error: txError },
    { data: allUserTransactions },
    { data: budgets },
    { data: loans },
  ] = await Promise.all([
    supabase
      .from("transactions")
      .select("id, user_id, account_id, category_id, amount, type, bucket, date, note, status, is_loan, created_at, updated_at, account:accounts(id, name, type), category:categories(id, name, color, icon, type)")
      .eq("user_id", userId)
      .gte("date", startDate)
      .lte("date", endDate)
      .order("date", { ascending: false }),
    supabase
      .from("transactions")
      .select("id, user_id, account_id, category_id, amount, type, bucket, date, note, status, is_loan, created_at, updated_at, account:accounts(id, name, type), category:categories(id, name, color, icon, type)")
      .eq("user_id", userId)
      .order("date", { ascending: false })
      .order("created_at", { ascending: false }),
    supabase
      .from("budgets")
      .select("*")
      .eq("user_id", userId)
      .eq("month", month),
    supabase
      .from("loan_entries")
      .select("id, user_id, person_name, amount, type, status, due_date, note, transaction_id, created_at, updated_at")
      .eq("user_id", userId)
      .order("created_at", { ascending: false }),
  ]);

  if (txError) {
    throw new Error(`Failed to fetch dashboard transactions: ${txError.message}`);
  }

  const budgetRecord = budgets && budgets.length > 0 ? budgets[0] : null;
  const budgetTarget = budgetRecord ? Number(budgetRecord.target_amount) : 0;
  const needsRatio = budgetRecord ? Number(budgetRecord.needs_ratio) : 50;
  const wantsRatio = budgetRecord ? Number(budgetRecord.wants_ratio) : 30;
  const investedRatio = budgetRecord ? Number(budgetRecord.invested_ratio) : 20;

  // 2. Compute totals
  let totalIncome = 0;
  let totalExpense = 0;
  let totalNeeds = 0;
  let totalWants = 0;
  let totalInvested = 0;

  const typedTxList = (transactions || []) as unknown as TransactionWithDetails[];

  typedTxList.forEach((tx) => {
    const amt = Number(tx.amount);
    if (tx.type === "income") {
      totalIncome += amt;
    } else if (tx.type === "expense") {
      totalExpense += amt;
      if (tx.bucket === "needs") {
        totalNeeds += amt;
      } else if (tx.bucket === "wants") {
        totalWants += amt;
      } else if (tx.bucket === "invested") {
        totalInvested += amt;
      }
    }
  });

  const budgetRemaining = Math.max(0, budgetTarget - totalExpense);
  const wantsLimit = (budgetTarget * wantsRatio) / 100;
  const wantsOverspent = wantsLimit > 0 && totalWants > wantsLimit;

  const pendingLoans = (loans || []).filter((l) => l.status === "pending");
  const activeLoansCount = pendingLoans.length;
  const activeLoansAmount = pendingLoans.reduce((acc, curr) => acc + Number(curr.amount), 0);

  const givenLoansAmount = pendingLoans
    .filter((l) => l.type === "given")
    .reduce((acc, curr) => acc + Number(curr.amount), 0);

  const takenLoansAmount = pendingLoans
    .filter((l) => l.type === "received")
    .reduce((acc, curr) => acc + Number(curr.amount), 0);

  // 5. Recent transactions (all user transactions ordered newest first) & Recent loans (top 5)
  const recentTransactions = (allUserTransactions || []) as unknown as TransactionWithDetails[];
  const recentLoans = (loans || []).slice(0, 5);

  return {
    month,
    totalIncome,
    totalExpense,
    totalNeeds,
    totalWants,
    totalInvested,
    budgetTarget,
    budgetRemaining,
    needsRatio,
    wantsRatio,
    investedRatio,
    wantsOverspent,
    recentTransactions,
    activeLoansCount,
    activeLoansAmount,
    givenLoansAmount,
    takenLoansAmount,
    recentLoans,
  };
}
