"use client";

import React from "react";
import { DashboardSummary } from "@/lib/supabase/types";

interface BudgetProgressCardProps {
  summary?: DashboardSummary | null;
}

export function BudgetProgressCard({ summary }: BudgetProgressCardProps) {
  const budgetTarget = summary?.budgetTarget ?? 0;
  const needsRatio = summary?.needsRatio ?? 50;
  const wantsRatio = summary?.wantsRatio ?? 30;
  const investedRatio = summary?.investedRatio ?? 20;

  const totalNeeds = summary?.totalNeeds ?? 0;
  const totalWants = summary?.totalWants ?? 0;
  const totalInvested = summary?.totalInvested ?? 0;

  const targetNeeds = (budgetTarget * needsRatio) / 100;
  const targetWants = (budgetTarget * wantsRatio) / 100;
  const targetInvested = (budgetTarget * investedRatio) / 100;

  const needsPct = targetNeeds > 0 ? Math.min(100, (totalNeeds / targetNeeds) * 100) : 0;
  const wantsPct = targetWants > 0 ? Math.min(100, (totalWants / targetWants) * 100) : 0;
  const investedPct = targetInvested > 0 ? Math.min(100, (totalInvested / targetInvested) * 100) : 0;

  const categories = [
    {
      name: "Needs",
      color: "bg-[#3b82f6]",
      spent: totalNeeds,
      target: targetNeeds,
      percentage: needsPct,
    },
    {
      name: "Wants",
      color: "bg-[#c2410c]",
      spent: totalWants,
      target: targetWants,
      percentage: wantsPct,
    },
    {
      name: "Invested",
      color: "bg-[#16a34a]",
      spent: totalInvested,
      target: targetInvested,
      percentage: investedPct,
    },
  ];

  return (
    <div className="bg-white border border-stone-200/70 rounded-2xl p-6 shadow-2xs flex flex-col justify-between h-full">
      <div>
        {/* Card Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold font-serif text-stone-900">Where it&apos;s going</h2>
        </div>

        {/* Category List */}
        <div className="space-y-6">
          {categories.map((cat) => (
            <div key={cat.name} className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2.5">
                  <span className={`w-2.5 h-2.5 rounded-full ${cat.color}`} />
                  <span className="font-semibold text-stone-800">{cat.name}</span>
                </div>
                <span className="font-medium text-stone-500 text-xs sm:text-sm">
                  ₹{cat.spent.toLocaleString("en-IN")} / ₹{cat.target.toLocaleString("en-IN")}
                </span>
              </div>
              <div className="h-2 w-full bg-stone-100 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${cat.color}`}
                  style={{ width: `${cat.percentage}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
