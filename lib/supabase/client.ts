import { createBrowserClient } from "@supabase/ssr";
import { getSupabaseEnv } from "./env";
import { Database } from "./types";

export function createClient() {
  const { supabaseUrl, supabaseAnonKey } = getSupabaseEnv();
  return createBrowserClient<Database>(supabaseUrl, supabaseAnonKey);
}

