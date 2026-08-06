"use client";

import React from "react";
import { AlertTriangle, CheckCircle2 } from "lucide-react";
import { DashboardSummary } from "@/lib/supabase/types";

interface SummaryCardsProps {
  summary?: DashboardSummary | null;
}

export function SummaryCards({ summary }: SummaryCardsProps) {
  const budgetTarget = summary?.budgetTarget ?? 0;
  const totalExpense = summary?.totalExpense ?? 0;
  const budgetRemaining = summary?.budgetTarget
    ? summary.budgetRemaining
    : Math.max(0, budgetTarget - totalExpense);

  const totalWants = summary?.totalWants ?? 0;
  const wantsRatio = summary?.wantsRatio ?? 30;
  const wantsLimit = (budgetTarget * wantsRatio) / 100;
  const wantsOverspent = summary?.wantsOverspent ?? (wantsLimit > 0 && totalWants > wantsLimit);
  const overspentAmount = wantsOverspent ? totalWants - wantsLimit : 0;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 mb-6">
      {/* Black Card: Remaining Budget & Total Spent */}
      <div className="lg:col-span-7 bg-[#1a1917] text-white rounded-2xl p-6 shadow-sm flex items-center justify-between">
        {/* Remaining Part */}
        <div className="flex-1 pr-4">
          <p className="text-xs font-semibold tracking-wider text-stone-400 uppercase">
            REMAINING THIS MONTH
          </p>
          <div className="flex items-baseline gap-1 mt-2">
            <span className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
              ₹{budgetRemaining.toLocaleString("en-IN")}
            </span>
          </div>
          <p className="text-xs text-stone-400 mt-1.5">
            of ₹{budgetTarget.toLocaleString("en-IN")} budgeted
          </p>
        </div>

        {/* Vertical Divider */}
        <div className="w-[1px] bg-[#2e2c28] self-stretch my-1" />

        {/* Spent Part */}
        <div className="flex-1 pl-6">
          <p className="text-xs font-medium text-stone-400">Spent so far</p>
          <p className="text-2xl sm:text-3xl font-bold tracking-tight text-white mt-2">
            ₹{totalExpense.toLocaleString("en-IN")}
          </p>
        </div>
      </div>

      {/* Warning / Status Card */}
      {wantsOverspent ? (
        <div className="lg:col-span-5 bg-[#fef2f2] border border-[#fecdd3]/70 rounded-2xl p-6 flex flex-col justify-center">
          <div className="flex items-start gap-2.5">
            <AlertTriangle className="w-4 h-4 text-[#991b1b] flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-sm font-semibold text-[#991b1b]">
                You&apos;re over on Wants this month
              </h3>
              <p className="text-xs text-[#b91c1c] mt-1.5 leading-relaxed">
                You&apos;ve spent ₹{overspentAmount.toLocaleString("en-IN")} more than planned for Wants limit (₹{wantsLimit.toLocaleString("en-IN")}). Consider easing up.
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="lg:col-span-5 bg-[#f0fdf4] border border-[#bbf7d0]/70 rounded-2xl p-6 flex flex-col justify-center">
          <div className="flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-[#166534] flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-sm font-semibold text-[#166534]">
                Budget status is healthy
              </h3>
              <p className="text-xs text-[#15803d] mt-1.5 leading-relaxed">
                Spending on Wants is within your allocated limit of ₹{wantsLimit.toLocaleString("en-IN")}. Great job staying on track!
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
