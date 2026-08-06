import React from "react";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/supabase/server";
import { getDashboardSummary } from "@/lib/repositories/dashboard";
import { getDisplayName } from "@/lib/utils";
import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";
import { LoansCard } from "@/components/LoansCard";

export default async function LoansPage() {
  const { supabase, user } = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const userName = getDisplayName(user);
  let summary = null;

  try {
    summary = await getDashboardSummary(supabase, user.id);
  } catch (err) {
    console.error("Failed to load loans summary:", err);
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#fafaf9] text-stone-900 font-sans antialiased">
      <Sidebar userName={userName} userEmail={user.email} />

      <main className="flex-1 p-4 sm:p-6 lg:p-10 max-w-7xl w-full mx-auto overflow-y-auto">
        <Header userName={userName} userEmail={user.email} />

        <div className="mb-6">
          <h2 className="text-xl font-bold text-stone-900 tracking-tight">Loans & Receivables</h2>
          <p className="text-sm text-stone-500 font-medium">Track money lent to or borrowed from friends separately from regular spending</p>
        </div>

        <div className="max-w-3xl">
          <LoansCard summary={summary} />
        </div>
      </main>
    </div>
  );
}
