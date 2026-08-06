import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getTransactions } from "@/lib/repositories/transactions";

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const transactions = await getTransactions(supabase, user.id, { limit: 100, offset: 0 });
    return NextResponse.json(transactions);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to fetch transactions";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
