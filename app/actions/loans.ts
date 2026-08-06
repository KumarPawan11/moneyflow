"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { updateLoanStatus, deleteLoanEntry } from "@/lib/repositories/loans";

export async function markLoanAsPaidAction(
  loanId: string,
  status: "repaid" | "closed" | "pending" = "repaid"
) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Unauthorized. Please sign in." };
  }

  try {
    await updateLoanStatus(supabase, user.id, loanId, status);

    revalidatePath("/", "layout");
    revalidatePath("/loans");
    revalidatePath("/transactions");

    return { success: true };
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : "Failed to update loan.";
    return { error: errorMessage };
  }
}

export async function deleteLoanEntryAction(loanId: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Unauthorized. Please sign in." };
  }

  try {
    await deleteLoanEntry(supabase, user.id, loanId);

    revalidatePath("/", "layout");
    revalidatePath("/loans");
    revalidatePath("/transactions");

    return { success: true };
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : "Failed to delete loan entry.";
    return { error: errorMessage };
  }
}
