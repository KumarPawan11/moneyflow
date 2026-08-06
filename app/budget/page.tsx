import React from "react";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/supabase/server";
import { getDashboardSummary } from "@/lib/repositories/dashboard";
import { getDisplayName } from "@/lib/utils";
import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";
import { BudgetProgressCard } from "@/components/BudgetProgressCard";
import { IncomeBudgetForm } from "@/components/IncomeBudgetForm";

export default async function BudgetPage() {
  const { supabase, user } = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const userName = getDisplayName(user);
  let summary = null;

  try {
    summary = await getDashboardSummary(supabase, user.id);
  } catch (err) {
    console.error("Failed to load budget summary:", err);
  }

  const currentMonth = summary?.month || new Date().toISOString().slice(0, 7);

  return (
    <div className="flex flex-col min-h-screen bg-[#fafaf9] text-stone-900 font-sans antialiased">
      <Sidebar userName={userName} userEmail={user.email} />

      <main className="flex-1 p-4 sm:p-6 lg:p-10 max-w-7xl w-full mx-auto overflow-y-auto">
        <Header userName={userName} userEmail={user.email} />

        <div className="mb-6">
          <h2 className="text-xl font-bold text-stone-900 tracking-tight">Budget & Goals</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 max-w-6xl">
          {/* Income & Budget Setup Form */}
          <div className="lg:col-span-7">
            <IncomeBudgetForm
              initialIncome={summary?.budgetTarget ?? 0}
              initialNeedsRatio={summary?.needsRatio ?? 50}
              initialWantsRatio={summary?.wantsRatio ?? 30}
              initialInvestedRatio={summary?.investedRatio ?? 20}
              month={currentMonth}
            />
          </div>

          {/* Budget Spending Progress Card */}
          <div className="lg:col-span-5">
            <BudgetProgressCard summary={summary} />
          </div>
        </div>
      </main>
    </div>
  );
}

