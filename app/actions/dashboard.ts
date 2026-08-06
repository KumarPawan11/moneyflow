"use server";

import { createClient } from "@/lib/supabase/server";
import { getDashboardSummary } from "@/lib/repositories/dashboard";
import { DashboardSummary } from "@/lib/supabase/types";
import { ActionResult } from "./transactions";

export async function getDashboardSummaryAction(
  month?: string
): Promise<ActionResult<DashboardSummary>> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authErr,
    } = await supabase.auth.getUser();

    if (authErr || !user) {
      return { success: false, error: "Unauthorized" };
    }

    const summary = await getDashboardSummary(supabase, user.id, month);
    return { success: true, data: summary };
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : "Failed to fetch dashboard summary";
    return { success: false, error: errorMessage };
  }
}
