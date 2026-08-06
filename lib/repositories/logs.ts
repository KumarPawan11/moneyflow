import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "@/lib/supabase/types";

export async function logServerAction(
  supabase: SupabaseClient<Database>,
  userId: string | null,
  action: string,
  metadata?: Record<string, unknown>
) {
  try {
    await supabase.from("logs").insert({
      user_id: userId,
      action,
      metadata: metadata ? (metadata as Database["public"]["Tables"]["logs"]["Insert"]["metadata"]) : null,
    });
  } catch (err) {
    console.error("Failed to log server action:", err);
  }
}
