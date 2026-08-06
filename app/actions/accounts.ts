"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createAccountSchema, CreateAccountInput } from "@/lib/validations/backend";
import { getAccounts, createAccount } from "@/lib/repositories/accounts";
import { AccountRow } from "@/lib/supabase/types";
import { ActionResult } from "./transactions";

export async function getAccountsAction(): Promise<ActionResult<AccountRow[]>> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authErr,
    } = await supabase.auth.getUser();

    if (authErr || !user) {
      return { success: false, error: "Unauthorized" };
    }

    const result = await getAccounts(supabase, user.id);
    return { success: true, data: result };
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : "Failed to fetch accounts";
    return { success: false, error: errorMessage };
  }
}

export async function createAccountAction(
  rawInput: CreateAccountInput
): Promise<ActionResult<AccountRow>> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authErr,
    } = await supabase.auth.getUser();

    if (authErr || !user) {
      return { success: false, error: "Unauthorized" };
    }

    const validatedInput = createAccountSchema.parse(rawInput);
    const result = await createAccount(supabase, user.id, validatedInput);

    revalidatePath("/");
    return { success: true, data: result };
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : "Failed to create account";
    return { success: false, error: errorMessage };
  }
}
