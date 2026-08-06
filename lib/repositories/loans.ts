import { SupabaseClient } from "@supabase/supabase-js";
import { Database, LoanEntryRow } from "@/lib/supabase/types";
import { logServerAction } from "./logs";

export async function updateLoanStatus(
  supabase: SupabaseClient<Database>,
  userId: string,
  loanId: string,
  status: "pending" | "repaid" | "closed"
): Promise<LoanEntryRow> {
  const { data, error } = await supabase
    .from("loan_entries")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", loanId)
    .eq("user_id", userId)
    .select("*")
    .single();

  if (error || !data) {
    throw new Error(`Failed to update loan status: ${error?.message || "Unknown error"}`);
  }

  await logServerAction(supabase, userId, "loan_status_updated", { loanId, status });
  return data;
}

export async function deleteLoanEntry(
  supabase: SupabaseClient<Database>,
  userId: string,
  loanId: string
): Promise<{ success: boolean }> {
  const { error } = await supabase
    .from("loan_entries")
    .delete()
    .eq("id", loanId)
    .eq("user_id", userId);

  if (error) {
    throw new Error(`Failed to delete loan entry: ${error.message}`);
  }

  await logServerAction(supabase, userId, "loan_entry_deleted", { loanId });
  return { success: true };
}
