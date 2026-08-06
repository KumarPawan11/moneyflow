import { SupabaseClient } from "@supabase/supabase-js";
import { Database, BudgetRow } from "@/lib/supabase/types";
import { UpsertBudgetInput } from "@/lib/validations/backend";
import { logServerAction } from "./logs";

export async function getBudgets(
  supabase: SupabaseClient<Database>,
  userId: string,
  month?: string
): Promise<BudgetRow[]> {
  const currentMonth = month || new Date().toISOString().slice(0, 7);

  const { data, error } = await supabase
    .from("budgets")
    .select("*")
    .eq("user_id", userId)
    .eq("month", currentMonth);

  if (error) {
    throw new Error(`Failed to fetch budgets: ${error.message}`);
  }

  return (data || []) as BudgetRow[];
}

export async function upsertBudget(
  supabase: SupabaseClient<Database>,
  userId: string,
  input: UpsertBudgetInput
): Promise<BudgetRow> {
  const { data: existing } = await supabase
    .from("budgets")
    .select("id")
    .eq("user_id", userId)
    .eq("month", input.month)
    .maybeSingle();

  let data: BudgetRow | null = null;
  let error: { message: string } | null = null;

  if (existing) {
    const res = await supabase
      .from("budgets")
      .update({
        target_amount: input.targetAmount,
        category_id: input.categoryId ?? null,
        needs_ratio: input.needsRatio,
        wants_ratio: input.wantsRatio,
        invested_ratio: input.investedRatio,
      })
      .eq("id", existing.id)
      .eq("user_id", userId)
      .select("*")
      .single();
    data = res.data as BudgetRow | null;
    error = res.error;
  } else {
    const res = await supabase
      .from("budgets")
      .insert({
        user_id: userId,
        month: input.month,
        target_amount: input.targetAmount,
        category_id: input.categoryId ?? null,
        needs_ratio: input.needsRatio,
        wants_ratio: input.wantsRatio,
        invested_ratio: input.investedRatio,
      })
      .select("*")
      .single();
    data = res.data as BudgetRow | null;
    error = res.error;
  }

  if (error || !data) {
    throw new Error(`Failed to save budget: ${error?.message || "Unknown error"}`);
  }

  await logServerAction(supabase, userId, "budget_created", { month: input.month, target: input.targetAmount });

  return data as BudgetRow;
}
