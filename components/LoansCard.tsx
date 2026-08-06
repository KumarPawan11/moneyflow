"use client";

import React, { useState, useTransition } from "react";
import Link from "next/link";
import { Handshake, ArrowUpRight, ArrowDownLeft, Clock, CheckCircle2, Check, RotateCcw, Trash2, Loader2 } from "lucide-react";
import { DashboardSummary } from "@/lib/supabase/types";
import { markLoanAsPaidAction, deleteLoanEntryAction } from "@/app/actions/loans";

interface LoansCardProps {
  summary?: DashboardSummary | null;
  maxItems?: number;
}

export function LoansCard({ summary, maxItems }: LoansCardProps) {
  const [, startTransition] = useTransition();
  const [actionKey, setActionKey] = useState<string | null>(null);

  const activeCount = summary?.activeLoansCount ?? 0;
  const givenAmount = summary?.givenLoansAmount ?? 0;
  const takenAmount = summary?.takenLoansAmount ?? 0;
  const recentLoans = summary?.recentLoans || [];
  const displayLoans = maxItems ? recentLoans.slice(0, maxItems) : recentLoans;

  const handleMarkStatus = (loanId: string, newStatus: "pending" | "repaid") => {
    setActionKey(`status-${loanId}`);
    startTransition(async () => {
      await markLoanAsPaidAction(loanId, newStatus);
      setActionKey(null);
    });
  };

  const handleDelete = (loanId: string) => {
    setActionKey(`delete-${loanId}`);
    startTransition(async () => {
      await deleteLoanEntryAction(loanId);
      setActionKey(null);
    });
  };

  return (
    <div className="bg-white border border-stone-200/70 rounded-2xl p-6 shadow-2xs h-full flex flex-col justify-between">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Handshake className="w-5 h-5 text-emerald-600" />
            <h2 className="text-xl font-bold font-serif text-stone-900">Loans & Receivables</h2>
          </div>
          {maxItems !== undefined && (
            <Link href="/loans" className="text-xs font-semibold text-stone-500 hover:text-stone-900 transition-colors">
              View all →
            </Link>
          )}
        </div>

        {/* Active Loan Summary Header Banners (Given vs Taken) */}
        {activeCount > 0 && (
          <div className="grid grid-cols-2 gap-3 mb-4">
            {/* Money Given (Receivable) */}
            <div className="p-3 bg-emerald-50/80 rounded-xl border border-emerald-100/80">
              <div className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-emerald-900">
                <ArrowUpRight className="w-3.5 h-3.5 text-emerald-600" />
                <span>Given (To Get)</span>
              </div>
              <p className="text-base font-bold text-emerald-700 mt-1">
                ₹{givenAmount.toLocaleString("en-IN")}
              </p>
            </div>

            {/* Money Taken (Payable) */}
            <div className="p-3 bg-amber-50/80 rounded-xl border border-amber-100/80">
              <div className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-amber-900">
                <ArrowDownLeft className="w-3.5 h-3.5 text-amber-600" />
                <span>Taken (To Pay)</span>
              </div>
              <p className="text-base font-bold text-amber-700 mt-1">
                ₹{takenAmount.toLocaleString("en-IN")}
              </p>
            </div>
          </div>
        )}

        {/* Loan Entries List */}
        {displayLoans.length > 0 ? (
          <div className="space-y-2.5">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-stone-400 mb-2">
              Friend Loan Transactions
            </h4>
            {displayLoans.map((loan) => {
              const formattedDate = new Date(loan.created_at).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
              });
              const isGiven = loan.type === "given";
              const isPending = loan.status === "pending";

              const isStatusLoading = actionKey === `status-${loan.id}`;
              const isDeleteLoading = actionKey === `delete-${loan.id}`;
              const isItemBusy = isStatusLoading || isDeleteLoading;

              return (
                <React.Fragment key={loan.id}>
                  {/* DESKTOP / TABLET VIEW (hidden sm:flex) */}
                  <div className="hidden sm:flex items-center justify-between p-3 rounded-xl bg-stone-50/80 border border-stone-100 hover:bg-stone-100/70 transition-colors gap-2">
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                          isGiven ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        {isGiven ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownLeft className="w-4 h-4" />}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-sm font-semibold text-stone-900 truncate">{loan.person_name}</span>
                          <span
                            className={`text-[10px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-1 shrink-0 ${
                              isGiven
                                ? "bg-emerald-100 text-emerald-800 border border-emerald-200/60"
                                : "bg-amber-100 text-amber-800 border border-amber-200/60"
                            }`}
                          >
                            {isGiven ? "Given" : "Taken"}
                          </span>
                          {isPending ? (
                            <span className="text-[10px] text-amber-700 font-medium flex items-center gap-0.5 shrink-0">
                              <Clock className="w-2.5 h-2.5" /> Active
                            </span>
                          ) : (
                            <span className="text-[10px] text-emerald-700 font-medium flex items-center gap-0.5 shrink-0">
                              <CheckCircle2 className="w-2.5 h-2.5" /> Paid
                            </span>
                          )}
                        </div>
                        {loan.note && (
                          <p className="text-xs text-stone-500 truncate mt-0.5">{loan.note}</p>
                        )}
                      </div>
                    </div>

                    {/* Actions & Amount */}
                    <div className="flex items-center gap-2 shrink-0">
                      <div className="text-right mr-1">
                        <span className={`text-sm font-bold block ${isGiven ? "text-emerald-700" : "text-amber-700"}`}>
                          ₹{Number(loan.amount).toLocaleString("en-IN")}
                        </span>
                        <span className="text-[10px] text-stone-400 font-medium block">{formattedDate}</span>
                      </div>

                      {isPending ? (
                        <button
                          type="button"
                          onClick={() => handleMarkStatus(loan.id, "repaid")}
                          disabled={isItemBusy}
                          title="Mark as paid / settled"
                          className="px-2.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center gap-1 transition-all shadow-xs cursor-pointer disabled:opacity-50"
                        >
                          {isStatusLoading ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <Check className="w-3.5 h-3.5" />
                          )}
                          <span>Done</span>
                        </button>
                      ) : (
                        <div className="flex items-center gap-1">
                          <span className="px-2 py-1 rounded-lg bg-emerald-50 text-emerald-700 text-[11px] font-semibold border border-emerald-200/60">
                            Paid
                          </span>
                          <button
                            type="button"
                            onClick={() => handleMarkStatus(loan.id, "pending")}
                            disabled={isItemBusy}
                            title="Undo / Reopen loan"
                            className="px-2 py-1 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold flex items-center gap-1 transition-all border border-stone-200 cursor-pointer disabled:opacity-50"
                          >
                            {isStatusLoading ? (
                              <Loader2 className="w-3 h-3 animate-spin text-stone-600" />
                            ) : (
                              <RotateCcw className="w-3 h-3 text-stone-600" />
                            )}
                            <span>Undo</span>
                          </button>
                        </div>
                      )}

                      <button
                        type="button"
                        onClick={() => handleDelete(loan.id)}
                        disabled={isItemBusy}
                        title="Remove loan entry"
                        className="p-1.5 rounded-lg text-stone-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer disabled:opacity-50"
                      >
                        {isDeleteLoading ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin text-red-600" />
                        ) : (
                          <Trash2 className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* MOBILE VIEW (flex sm:hidden) */}
                  <div className="flex sm:hidden flex-col gap-2.5 p-3.5 rounded-xl bg-stone-50/80 border border-stone-100">
                    {/* Row 1: Icon, Person Name, Given/Taken badge, Delete button */}
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                            isGiven ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"
                          }`}
                        >
                          {isGiven ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownLeft className="w-4 h-4" />}
                        </div>
                        <span className="text-sm font-semibold text-stone-900 truncate">{loan.person_name}</span>
                        <span
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-1 shrink-0 ${
                            isGiven
                              ? "bg-emerald-100 text-emerald-800 border border-emerald-200/60"
                              : "bg-amber-100 text-amber-800 border border-amber-200/60"
                          }`}
                        >
                          {isGiven ? "Given" : "Taken"}
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleDelete(loan.id)}
                        disabled={isItemBusy}
                        title="Remove loan entry"
                        className="w-11 h-11 flex items-center justify-center rounded-lg text-stone-400 hover:text-red-600 active:bg-red-50 transition-colors cursor-pointer shrink-0 disabled:opacity-50"
                      >
                        {isDeleteLoading ? (
                          <Loader2 className="w-4 h-4 animate-spin text-red-600" />
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                      </button>
                    </div>

                    {/* Row 2: Amount & Date */}
                    <div className="flex items-baseline justify-between pt-0.5">
                      <span className={`text-base font-extrabold ${isGiven ? "text-emerald-700" : "text-amber-700"}`}>
                        ₹{Number(loan.amount).toLocaleString("en-IN")}
                      </span>
                      <span className="text-xs text-stone-400 font-medium">{formattedDate}</span>
                    </div>

                    {/* Note if present */}
                    {loan.note && (
                      <p className="text-xs text-stone-500 line-clamp-1">{loan.note}</p>
                    )}

                    {/* Row 3: Status Badge & Action Button */}
                    <div className="flex items-center justify-between pt-2 border-t border-stone-200/60 mt-0.5">
                      {isPending ? (
                        <>
                          <span className="text-xs text-amber-700 font-semibold flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" /> Active
                          </span>
                          <button
                            type="button"
                            onClick={() => handleMarkStatus(loan.id, "repaid")}
                            disabled={isItemBusy}
                            title="Mark as paid / settled"
                            className="px-4 py-2.5 min-h-[44px] rounded-xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white text-xs font-semibold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer disabled:opacity-50"
                          >
                            {isStatusLoading ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <Check className="w-4 h-4" />
                            )}
                            <span>Done</span>
                          </button>
                        </>
                      ) : (
                        <>
                          <span className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 text-xs font-semibold border border-emerald-200/60 flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Paid
                          </span>
                          <button
                            type="button"
                            onClick={() => handleMarkStatus(loan.id, "pending")}
                            disabled={isItemBusy}
                            title="Undo / Reopen loan"
                            className="px-4 py-2.5 min-h-[44px] rounded-xl bg-stone-100 hover:bg-stone-200 active:bg-stone-300 text-stone-700 text-xs font-semibold flex items-center gap-1.5 transition-all border border-stone-200 cursor-pointer disabled:opacity-50"
                          >
                            {isStatusLoading ? (
                              <Loader2 className="w-4 h-4 animate-spin text-stone-600" />
                            ) : (
                              <RotateCcw className="w-4 h-4 text-stone-600" />
                            )}
                            <span>Undo</span>
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </React.Fragment>
              );
            })}
          </div>
        ) : (
          <div className="py-8 text-center border border-dashed border-stone-200 rounded-xl my-2">
            <p className="text-sm font-medium text-stone-600">No active loans</p>
            <p className="text-xs text-stone-400 mt-1">
              Friend transfers tagged as loans will appear separately here.
            </p>
          </div>
        )}
      </div>

      <div className="pt-4 border-t border-stone-100 mt-4">
        <p className="text-xs text-stone-400 leading-relaxed">
          Loans given or received do not impact your regular Wants/Needs spending limits.
        </p>
      </div>
    </div>
  );
}
