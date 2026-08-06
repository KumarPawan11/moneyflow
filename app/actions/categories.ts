"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createCategorySchema, CreateCategoryInput } from "@/lib/validations/backend";
import { getCategories, createCategory } from "@/lib/repositories/categories";
import { CategoryRow } from "@/lib/supabase/types";
import { ActionResult } from "./transactions";

export async function getCategoriesAction(): Promise<ActionResult<CategoryRow[]>> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authErr,
    } = await supabase.auth.getUser();

    if (authErr || !user) {
      return { success: false, error: "Unauthorized" };
    }

    const result = await getCategories(supabase, user.id);
    return { success: true, data: result };
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : "Failed to fetch categories";
    return { success: false, error: errorMessage };
  }
}

export async function createCategoryAction(
  rawInput: CreateCategoryInput
): Promise<ActionResult<CategoryRow>> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authErr,
    } = await supabase.auth.getUser();

    if (authErr || !user) {
      return { success: false, error: "Unauthorized" };
    }

    const validatedInput = createCategorySchema.parse(rawInput);
    const result = await createCategory(supabase, user.id, validatedInput);

    revalidatePath("/");
    return { success: true, data: result };
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : "Failed to create category";
    return { success: false, error: errorMessage };
  }
}
