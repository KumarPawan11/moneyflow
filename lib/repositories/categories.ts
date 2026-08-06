import { SupabaseClient } from "@supabase/supabase-js";
import { Database, CategoryRow } from "@/lib/supabase/types";
import { CreateCategoryInput } from "@/lib/validations/backend";
import { logServerAction } from "./logs";

export async function getCategories(
  supabase: SupabaseClient<Database>,
  userId: string
): Promise<CategoryRow[]> {
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .or(`user_id.is.null,user_id.eq.${userId}`)
    .order("name", { ascending: true });

  if (error) {
    throw new Error(`Failed to fetch categories: ${error.message}`);
  }

  return (data || []) as CategoryRow[];
}

export async function createCategory(
  supabase: SupabaseClient<Database>,
  userId: string,
  input: CreateCategoryInput
): Promise<CategoryRow> {
  const { data, error } = await supabase
    .from("categories")
    .insert({
      user_id: userId,
      name: input.name,
      type: input.type,
      color: input.color ?? null,
      icon: input.icon ?? null,
    })
    .select("*")
    .single();

  if (error || !data) {
    throw new Error(`Failed to create category: ${error?.message || "Unknown error"}`);
  }

  await logServerAction(supabase, userId, "category_created", { categoryId: data.id, name: input.name });

  return data as CategoryRow;
}
