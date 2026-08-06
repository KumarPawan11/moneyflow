"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Utensils, Zap, ShoppingCart, Film, Tag, TrendingUp, DollarSign, ArrowUpRight, ArrowDownLeft } from "lucide-react";
import { TransactionWithDetails } from "@/lib/supabase/types";

interface RecentTransactionsCardProps {
  transactions?: TransactionWithDetails[];
  showHeader?: boolean;
}

export function RecentTransactionsCard({ transactions, showHeader = true }: RecentTransactionsCardProps) {
  const router = useRouter();
  const [prevTransactions, setPrevTransactions] = useState(transactions);
  const [txList, setTxList] = useState<TransactionWithDetails[]>(transactions || []);

  if (transactions !== prevTransactions) {
    setPrevTransactions(transactions);
    setTxList(transactions || []);
  }

  useEffect(() => {
    const handleTransactionUpdated = async () => {
      router.refresh();
      try {
        const res = await fetch("/api/transactions");
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data)) {
            setTxList(data);
          }
        }
      } catch (err) {
        console.error("Failed to refetch transactions:", err);
      }
    };

    if (typeof window !== "undefined") {
      window.addEventListener("transactionUpdated", handleTransactionUpdated);
    }

    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("transactionUpdated", handleTransactionUpdated);
      }
    };
  }, [router]);

  const getCategoryIcon = (categoryName?: string | null) => {
    if (!categoryName) return Tag;
    const name = categoryName.toLowerCase();
    if (name.includes("food") || name.includes("dining") || name.includes("zomato")) return Utensils;
    if (name.includes("utility") || name.includes("electricity") || name.includes("bill")) return Zap;
    if (name.includes("grocer") || name.includes("shopping")) return ShoppingCart;
    if (name.includes("subscript") || name.includes("netflix") || name.includes("film")) return Film;
    if (name.includes("stock") || name.includes("invest")) return TrendingUp;
    if (name.includes("salary") || name.includes("income")) return DollarSign;
    return Tag;
  };

  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;

      const day = d.getDate();
      const month = d.toLocaleString("en-US", { month: "short" });
      const year = d.getFullYear();

      const time = d.toLocaleString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });

      return `${day} ${month} ${year} at ${time}`;
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="bg-white border border-stone-200/70 rounded-2xl p-6 shadow-2xs mt-6">
      {/* Header */}
      {showHeader && (
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold font-serif text-stone-900">Recent transactions</h2>
          <Link href="/transactions" className="text-sm font-medium text-stone-500 hover:text-stone-800 transition-colors">
            View all
          </Link>
        </div>
      )}

      {/* Transaction List */}
      {txList.length > 0 ? (
        <div className="divide-y divide-stone-100 max-h-[420px] overflow-y-auto pr-1 sm:pr-2">
          {txList.map((item) => {
            const Icon = getCategoryIcon(item.category?.name);
            const isIncome = item.type === "income";
            const isWants = item.bucket === "wants";

            return (
              <div key={item.id} className="py-3.5 flex items-center justify-between first:pt-2 last:pb-0">
                <div className="flex items-center gap-3.5">
                  {/* Icon Box */}
                  <div className="w-10 h-10 rounded-xl bg-stone-100/80 flex items-center justify-center text-stone-600 flex-shrink-0">
                    <Icon className="w-4 h-4 stroke-[1.75]" />
                  </div>

                  <div>
                    <h4 className="text-sm font-bold text-stone-900">
                      {item.note || item.category?.name || "Transaction"}
                    </h4>
                    <p className="text-xs text-stone-400 mt-0.5">{formatDate(item.date)}</p>
                  </div>
                </div>

                {/* Right Side: Category Badge + Amount */}
                <div className="flex items-center gap-4 sm:gap-6">
                  <span
                    className={`text-xs font-semibold px-2.5 py-0.5 rounded-full capitalize ${
                      isIncome
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200/50"
                        : isWants
                        ? "bg-amber-50 text-amber-700 border border-amber-200/50"
                        : "bg-blue-50 text-blue-700 border border-blue-200/50"
                    }`}
                  >
                    {item.bucket || item.category?.type || "expense"}
                  </span>
                  <span
                    className={`text-sm font-bold min-w-[75px] text-right flex items-center justify-end gap-1 ${
                      isIncome ? "text-emerald-600" : "text-stone-900"
                    }`}
                  >
                    {isIncome ? (
                      <>
                        <ArrowDownLeft className="w-3.5 h-3.5 text-emerald-600" />
                        +₹{Number(item.amount).toLocaleString("en-IN")}
                      </>
                    ) : (
                      <>
                        <ArrowUpRight className="w-3.5 h-3.5 text-stone-400" />
                        -₹{Number(item.amount).toLocaleString("en-IN")}
                      </>
                    )}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="py-12 text-center border border-dashed border-stone-200 rounded-xl my-2">
          <p className="text-sm font-medium text-stone-600">No transactions yet. Add your first transaction to get started.</p>
        </div>
      )}
    </div>
  );
}
