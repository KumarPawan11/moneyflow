"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createTransaction } from "@/lib/repositories/transactions";
import { getCategories } from "@/lib/repositories/categories";
import { createTransactionSchema } from "@/lib/validations/backend";

export type ActionResult<T = unknown> =
  | { success: true; data: T }
  | { success: false; error: string };

export async function addTransactionAction(formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Unauthorized. Please sign in." };
  }

  const type = (formData.get("type") as "income" | "expense" | "transfer") || "expense";
  const amountRaw = formData.get("amount") as string;
  let categoryId = (formData.get("categoryId") as string) || null;
  const causeRaw = (formData.get("cause") as string) || (formData.get("categoryName") as string) || null;
  const bucket = (formData.get("bucket") as "needs" | "wants" | "invested" | "income" | "other") || "needs";
  const dateRaw = (formData.get("date") as string) || new Date().toISOString().split("T")[0];
  const note = (formData.get("note") as string) || null;
  const isLoan = formData.get("isLoan") === "true";
  const loanType = (formData.get("loanType") as "given" | "received") || "given";
  const recipient = (formData.get("recipient") as string) || null;

  let finalDateIso = dateRaw;
  const now = new Date();
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateRaw)) {
    const todayStr = now.toISOString().split("T")[0];
    if (dateRaw === todayStr) {
      finalDateIso = now.toISOString();
    } else {
      const [y, m, d] = dateRaw.split("-").map(Number);
      const combined = new Date(y, m - 1, d, now.getHours(), now.getMinutes(), now.getSeconds());
      finalDateIso = combined.toISOString();
    }
  }

  const amount = parseFloat(amountRaw);
  if (isNaN(amount) || amount <= 0) {
    return { error: "Please enter a valid positive amount." };
  }

  // Resolve free-text cause into a category ID
  if (!categoryId && causeRaw && causeRaw.trim()) {
    const trimmedCause = causeRaw.trim();
    try {
      const categories = await getCategories(supabase, user.id);
      const existing = categories.find(
        (c) => c.name.toLowerCase() === trimmedCause.toLowerCase()
      );

      if (existing) {
        categoryId = existing.id;
      } else {
        const categoryType =
          type === "income"
            ? "income"
            : bucket === "needs" || bucket === "wants" || bucket === "invested"
            ? bucket
            : "custom";

        const { createCategory } = await import("@/lib/repositories/categories");
        const created = await createCategory(supabase, user.id, {
          name: trimmedCause,
          type: categoryType,
        });
        categoryId = created.id;
      }
    } catch (err) {
      console.error("Failed to auto-create category for cause:", err);
    }
  }

  try {
    const parseResult = createTransactionSchema.parse({
      amount,
      type,
      bucket,
      categoryId: categoryId || undefined,
      date: finalDateIso,
      note: note || undefined,
      status: "completed",
      isLoan,
    });

    await createTransaction(supabase, user.id, {
      ...parseResult,
      loanType,
      recipient: recipient || undefined,
    } as unknown as typeof parseResult);

    revalidatePath("/", "layout");
    revalidatePath("/transactions");
    revalidatePath("/budget");
    revalidatePath("/loans");

    return { success: true };
  } catch (err: unknown) {
    if (err && typeof err === "object" && "issues" in err && Array.isArray((err as { issues: unknown[] }).issues)) {
      const firstIssue = (err as { issues: { message: string }[] }).issues[0];
      return { error: firstIssue?.message || "Invalid transaction input." };
    }
    const errorMessage = err instanceof Error ? err.message : "Failed to add transaction.";
    return { error: errorMessage };
  }
}

export async function fetchCategoriesAction() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return [];

  try {
    return await getCategories(supabase, user.id);
  } catch {
    return [];
  }
}
