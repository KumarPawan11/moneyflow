import React from "react";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/supabase/server";
import { getDashboardSummary } from "@/lib/repositories/dashboard";
import { getDisplayName } from "@/lib/utils";
import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";
import { SummaryCards } from "@/components/SummaryCards";
import { BudgetProgressCard } from "@/components/BudgetProgressCard";
import { LoansCard } from "@/components/LoansCard";
import { RecentTransactionsCard } from "@/components/RecentTransactionsCard";

export default async function DashboardPage() {
  const { supabase, user } = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const userName = getDisplayName(user);

  let summary = null;
  try {
    summary = await getDashboardSummary(supabase, user.id);
  } catch (err) {
    console.error("Failed to load dashboard summary:", err);
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#fafaf9] text-stone-900 font-sans antialiased">
      {/* Top Header & Navigation */}
      <Sidebar userName={userName} userEmail={user.email} />

      {/* Main Content Dashboard */}
      <main className="flex-1 p-4 sm:p-6 lg:p-10 max-w-7xl w-full mx-auto overflow-y-auto">
        <Header userName={userName} userEmail={user.email} isHomePage={true} />
        
        {/* Top Metric Cards */}
        <SummaryCards summary={summary} />

        {/* Middle Two-Column Grid: Budget Breakdown & Loans */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7">
            <BudgetProgressCard summary={summary} />
          </div>
          <div className="lg:col-span-5">
            <LoansCard summary={summary} maxItems={3} />
          </div>
        </div>

        {/* Recent Transactions List */}
        <RecentTransactionsCard transactions={summary?.recentTransactions} />
      </main>
    </div>
  );
}
