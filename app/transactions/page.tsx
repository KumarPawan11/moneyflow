import React from "react";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/supabase/server";
import { getTransactions } from "@/lib/repositories/transactions";
import { getDisplayName } from "@/lib/utils";
import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";
import { RecentTransactionsCard } from "@/components/RecentTransactionsCard";

import { TransactionWithDetails } from "@/lib/supabase/types";

export default async function TransactionsPage() {
  const { supabase, user } = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const userName = getDisplayName(user);
  let transactions: TransactionWithDetails[] = [];

  try {
    transactions = await getTransactions(supabase, user.id, { limit: 100, offset: 0 });
  } catch (err) {
    console.error("Failed to fetch transactions:", err);
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#fafaf9] text-stone-900 font-sans antialiased">
      <Sidebar userName={userName} userEmail={user.email} />

      <main className="flex-1 p-4 sm:p-6 lg:p-10 max-w-7xl w-full mx-auto overflow-y-auto">
        <Header userName={userName} userEmail={user.email} />

        <div className="mb-6">
          <h2 className="text-xl font-bold text-stone-900 tracking-tight">All Transactions</h2>
          <p className="text-sm text-stone-500 font-medium">Review your historical spending</p>
        </div>

        <RecentTransactionsCard transactions={transactions} showHeader={false} />
      </main>
    </div>
  );
}
