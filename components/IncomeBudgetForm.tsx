"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { upsertBudgetAction } from "@/app/actions/budgets";

interface IncomeBudgetFormProps {
  initialIncome?: number;
  initialNeedsRatio?: number;
  initialWantsRatio?: number;
  initialInvestedRatio?: number;
  month?: string;
  onSuccess?: () => void;
}

export function IncomeBudgetForm({
  initialIncome = 0,
  initialNeedsRatio = 50,
  initialWantsRatio = 30,
  initialInvestedRatio = 20,
  month,
  onSuccess,
}: IncomeBudgetFormProps) {
  const router = useRouter();
  const currentMonth = month || new Date().toISOString().slice(0, 7);

  const [income, setIncome] = useState<number | string>(
    initialIncome > 0 ? initialIncome : ""
  );
  const [needsRatio, setNeedsRatio] = useState<number | string>(initialNeedsRatio);
  const [wantsRatio, setWantsRatio] = useState<number | string>(initialWantsRatio);
  const [investedRatio, setInvestedRatio] = useState<number | string>(initialInvestedRatio);
  const [showCustomRatios, setShowCustomRatios] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const numericIncome = typeof income === "number" ? income : parseFloat(income) || 0;
  const numNeeds = typeof needsRatio === "number" ? needsRatio : parseFloat(needsRatio) || 0;
  const numWants = typeof wantsRatio === "number" ? wantsRatio : parseFloat(wantsRatio) || 0;
  const numInvested = typeof investedRatio === "number" ? investedRatio : parseFloat(investedRatio) || 0;

  // Calculate allocations based on income and ratios
  const needsAmount = Math.round((numericIncome * numNeeds) / 100);
  const wantsAmount = Math.round((numericIncome * numWants) / 100);
  const investedAmount = Math.round((numericIncome * numInvested) / 100);
  const totalRatio = Math.round(numNeeds + numWants + numInvested);

  const handleRatioInput = (
    setter: React.Dispatch<React.SetStateAction<number | string>>,
    rawValue: string
  ) => {
    setStatusMessage(null);
    if (rawValue === "") {
      setter("");
    } else {
      const parsed = parseFloat(rawValue);
      setter(isNaN(parsed) ? "" : parsed);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMessage(null);

    if (numericIncome < 0) {
      setStatusMessage({ type: "error", text: "Income amount cannot be negative." });
      return;
    }

    if (totalRatio !== 100) {
      setStatusMessage({
        type: "error",
        text: `Your total allocation is ${totalRatio}%. Total allocation must equal 100%.`,
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await upsertBudgetAction({
        month: currentMonth,
        targetAmount: numericIncome,
        needsRatio: numNeeds,
        wantsRatio: numWants,
        investedRatio: numInvested,
      });

      if (res.success) {
        setStatusMessage({ type: "success", text: "Budget successfully updated!" });
        router.refresh();
        if (onSuccess) onSuccess();
      } else {
        setStatusMessage({ type: "error", text: res.error || "Failed to update budget." });
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "An unexpected error occurred.";
      setStatusMessage({ type: "error", text: message });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleIncomeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStatusMessage(null);
    const val = e.target.value;
    if (val === "") {
      setIncome("");
    } else {
      const num = parseFloat(val);
      setIncome(isNaN(num) ? "" : num);
    }
  };

  return (
    <div className="bg-white border border-stone-200/80 rounded-2xl p-6 shadow-2xs">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Income Input */}
        <div>
          <label htmlFor="monthly-income-input" className="block text-xs font-semibold uppercase text-stone-600 tracking-wider mb-2">
            Monthly Income (₹)
          </label>
          <div className="relative rounded-xl shadow-2xs">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <span className="text-stone-400 text-lg font-semibold">₹</span>
            </div>
            <input
              id="monthly-income-input"
              type="number"
              min="0"
              step="1000"
              value={income}
              onChange={handleIncomeChange}
              placeholder="e.g. 100000"
              className="w-full pl-9 pr-4 py-3 bg-stone-50 border border-stone-200 rounded-xl text-stone-900 text-lg font-bold placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors"
              required
            />
          </div>
        </div>

        {/* Allocation Breakdown Header & Cards */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase text-stone-600 tracking-wider">
              Allocation Breakdown
            </span>
            <button
              type="button"
              onClick={() => setShowCustomRatios(!showCustomRatios)}
              className="text-xs font-medium text-emerald-600 hover:text-emerald-700 hover:underline transition-colors"
            >
              {showCustomRatios ? "Use 50/30/20 Default" : "Customize Ratios"}
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Needs Card */}
            <div className="bg-blue-50/60 border border-blue-100 rounded-xl p-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-xs font-semibold text-blue-800">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-blue-500" />
                    <span>Needs</span>
                  </div>
                  <span>{needsRatio}%</span>
                </div>
                <p className="text-2xl font-extrabold text-blue-950 mt-2 font-mono">
                  ₹{needsAmount.toLocaleString("en-IN")}
                </p>
              </div>
            </div>

            {/* Wants Card */}
            <div className="bg-amber-50/60 border border-amber-100 rounded-xl p-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-xs font-semibold text-amber-800">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-amber-500" />
                    <span>Wants</span>
                  </div>
                  <span>{wantsRatio}%</span>
                </div>
                <p className="text-2xl font-extrabold text-amber-950 mt-2 font-mono">
                  ₹{wantsAmount.toLocaleString("en-IN")}
                </p>
              </div>
            </div>

            {/* Investment Card */}
            <div className="bg-emerald-50/60 border border-emerald-100 rounded-xl p-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-xs font-semibold text-emerald-800">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span>Investment</span>
                  </div>
                  <span>{investedRatio}%</span>
                </div>
                <p className="text-2xl font-extrabold text-emerald-950 mt-2 font-mono">
                  ₹{investedAmount.toLocaleString("en-IN")}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Custom Ratios Form (If toggled) */}
        {showCustomRatios && (
          <div className="bg-stone-50 border border-stone-200/70 rounded-xl p-4 space-y-4">
            <div>
              <span className="text-xs font-semibold text-stone-700 uppercase tracking-wider">
                Customize Split Percentages
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2 sm:gap-3">
              <div>
                <label htmlFor="needs-ratio-input" className="block text-[10.5px] min-[375px]:text-[11px] sm:text-xs font-medium text-stone-600 mb-1 whitespace-nowrap tracking-tight">
                  Needs (%)
                </label>
                <input
                  id="needs-ratio-input"
                  type="number"
                  min="0"
                  max="100"
                  value={needsRatio}
                  onChange={(e) => handleRatioInput(setNeedsRatio, e.target.value)}
                  className="w-full px-2.5 sm:px-3 py-2 bg-white border border-stone-200 rounded-lg text-xs font-semibold text-stone-800 focus:outline-none focus:border-emerald-500"
                />
              </div>
              <div>
                <label htmlFor="wants-ratio-input" className="block text-[10.5px] min-[375px]:text-[11px] sm:text-xs font-medium text-stone-600 mb-1 whitespace-nowrap tracking-tight">
                  Wants (%)
                </label>
                <input
                  id="wants-ratio-input"
                  type="number"
                  min="0"
                  max="100"
                  value={wantsRatio}
                  onChange={(e) => handleRatioInput(setWantsRatio, e.target.value)}
                  className="w-full px-2.5 sm:px-3 py-2 bg-white border border-stone-200 rounded-lg text-xs font-semibold text-stone-800 focus:outline-none focus:border-emerald-500"
                />
              </div>
              <div>
                <label htmlFor="invested-ratio-input" className="block text-[10.5px] min-[375px]:text-[11px] sm:text-xs font-medium text-stone-600 mb-1 whitespace-nowrap tracking-tight">
                  Investment (%)
                </label>
                <input
                  id="invested-ratio-input"
                  type="number"
                  min="0"
                  max="100"
                  value={investedRatio}
                  onChange={(e) => handleRatioInput(setInvestedRatio, e.target.value)}
                  className="w-full px-2.5 sm:px-3 py-2 bg-white border border-stone-200 rounded-lg text-xs font-semibold text-stone-800 focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>
          </div>
        )}

        {/* Status Message */}
        {statusMessage && (
          <div
            className={`p-3 rounded-xl text-xs font-semibold ${
              statusMessage.type === "success"
                ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                : "bg-red-50 text-red-800 border border-red-200"
            }`}
          >
            {statusMessage.text}
          </div>
        )}

        {/* Submit Button */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-5 py-2.5 bg-stone-900 hover:bg-stone-800 active:bg-stone-950 text-white font-semibold text-xs rounded-xl shadow-2xs transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Saving Budget..." : "Save Budget & Allocation"}
          </button>
        </div>
      </form>
    </div>
  );
}
