"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { upsertBudgetSchema, UpsertBudgetInput } from "@/lib/validations/backend";
import { getBudgets, upsertBudget } from "@/lib/repositories/budgets";
import { BudgetRow } from "@/lib/supabase/types";
import { ActionResult } from "./transactions";

export async function getBudgetsAction(month?: string): Promise<ActionResult<BudgetRow[]>> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authErr,
    } = await supabase.auth.getUser();

    if (authErr || !user) {
      return { success: false, error: "Unauthorized" };
    }

    const result = await getBudgets(supabase, user.id, month);
    return { success: true, data: result };
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : "Failed to fetch budgets";
    return { success: false, error: errorMessage };
  }
}

export async function upsertBudgetAction(
  rawInput: UpsertBudgetInput
): Promise<ActionResult<BudgetRow>> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authErr,
    } = await supabase.auth.getUser();

    if (authErr || !user) {
      return { success: false, error: "Unauthorized" };
    }

    const validatedInput = upsertBudgetSchema.parse(rawInput);
    const result = await upsertBudget(supabase, user.id, validatedInput);

    revalidatePath("/");
    revalidatePath("/budget");
    return { success: true, data: result };
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : "Failed to save budget";
    return { success: false, error: errorMessage };
  }
}
