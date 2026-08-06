"use client";

import React, { useState, useTransition } from "react";
import { X, Plus, Loader2, AlertCircle } from "lucide-react";
import { addTransactionAction } from "@/app/actions/transactions";

interface AddTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AddTransactionModal({ isOpen, onClose }: AddTransactionModalProps) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const type: "expense" | "income" | "transfer" = "expense";
  const [bucket, setBucket] = useState<"needs" | "wants" | "invested" | "income" | "other">("needs");
  const [cause, setCause] = useState<string>("");
  const [amount, setAmount] = useState<string>("");
  const [date, setDate] = useState<string>(new Date().toISOString().split("T")[0]);
  const [recipient, setRecipient] = useState<string>("");
  const [note, setNote] = useState<string>("");
  const [isLoan, setIsLoan] = useState<boolean>(false);
  const [loanType, setLoanType] = useState<"given" | "received">("given");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    const formData = new FormData();
    const finalType = isLoan ? "transfer" : type;
    const finalBucket = isLoan ? "other" : bucket;
    const rawNote = note.trim();
    const rawRecipient = recipient.trim();
    const rawCause = cause.trim();

    const finalNote = isLoan
      ? rawRecipient
        ? rawNote
          ? `To ${rawRecipient}: ${rawNote}`
          : `To ${rawRecipient}`
        : rawNote
      : rawNote;

    formData.append("type", finalType);
    formData.append("amount", amount);
    formData.append("bucket", finalBucket);
    if (!isLoan && rawCause) formData.append("cause", rawCause);
    formData.append("date", date);
    if (finalNote) formData.append("note", finalNote);
    formData.append("isLoan", isLoan ? "true" : "false");
    if (isLoan) {
      formData.append("loanType", loanType);
      if (rawRecipient) formData.append("recipient", rawRecipient);
    }

    startTransition(async () => {
      const res = await addTransactionAction(formData);
      if (res?.error) {
        setError(res.error);
      } else {
        // Reset form & close modal
        setAmount("");
        setCause("");
        setNote("");
        setRecipient("");
        setIsLoan(false);
        setLoanType("given");
        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent("transactionUpdated"));
        }
        onClose();
      }
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl border border-stone-200 w-full max-w-lg p-6 sm:p-8 space-y-6 relative">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-stone-100">
          <div>
            <h2 className="text-xl font-bold text-stone-900 tracking-tight">
              {isLoan ? "Add Friend Loan / Transfer" : "Add Transaction"}
            </h2>
            <p className="text-xs text-stone-500 font-medium">
              {isLoan ? "Record money given to or taken from a friend" : "Record spending, income, or transfers"}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="flex items-center gap-2.5 p-3.5 rounded-xl bg-red-50 text-red-700 text-xs font-medium border border-red-200">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Mark as Friend Loan Checkbox */}
          <div className="flex items-center p-3 rounded-xl bg-amber-50/60 border border-amber-200/60">
            <label className="flex items-center gap-2.5 cursor-pointer text-xs font-semibold text-amber-900 w-full">
              <input
                type="checkbox"
                checked={isLoan}
                onChange={(e) => setIsLoan(e.target.checked)}
                className="w-4 h-4 rounded-md text-amber-600 focus:ring-amber-500 border-amber-300 cursor-pointer"
              />
              <span>Mark as Friend Loan / Transfer</span>
            </label>
          </div>

          {/* Sub-Toggle for Friend Loan: Loan Given vs Loan Taken */}
          {isLoan && (
            <div className="grid grid-cols-2 gap-2 p-1 bg-amber-100/60 rounded-xl text-xs font-semibold">
              <button
                type="button"
                onClick={() => setLoanType("given")}
                className={`py-2 rounded-lg transition-all ${
                  loanType === "given"
                    ? "bg-emerald-600 text-white shadow-xs"
                    : "text-amber-900 hover:bg-amber-200/50"
                }`}
              >
                Loan Given (Lent)
              </button>
              <button
                type="button"
                onClick={() => setLoanType("received")}
                className={`py-2 rounded-lg transition-all ${
                  loanType === "received"
                    ? "bg-amber-600 text-white shadow-xs"
                    : "text-amber-900 hover:bg-amber-200/50"
                }`}
              >
                Loan Taken (Borrowed)
              </button>
            </div>
          )}

          {/* Amount Input */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-1.5">
              Amount (₹)
            </label>
            <input
              type="number"
              step="0.01"
              min="0.01"
              required
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-stone-200 bg-stone-50/50 text-stone-900 text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-stone-900 focus:bg-white transition-all placeholder:text-stone-300"
            />
          </div>

          {/* Bucket & Cause/Category (if Expense & not Loan) */}
          {!isLoan && type === "expense" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-1.5">
                  Budget Bucket
                </label>
                <select
                  value={bucket}
                  onChange={(e) => setBucket(e.target.value as "needs" | "wants" | "invested" | "income" | "other")}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 bg-stone-50/50 text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-stone-900 focus:bg-white transition-all"
                >
                  <option value="needs">Needs (50%)</option>
                  <option value="wants">Wants (30%)</option>
                  <option value="invested">Invested (20%)</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-1.5">
                  Cause / Category
                </label>
                <input
                  type="text"
                  placeholder="e.g. Swiggy, Groceries, Rent"
                  value={cause}
                  onChange={(e) => setCause(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 bg-stone-50/50 text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-stone-900 focus:bg-white transition-all placeholder:text-stone-400"
                />
              </div>
            </div>
          )}

          {/* Date & Recipient (if Loan) */}
          <div className={`grid grid-cols-1 ${isLoan ? "sm:grid-cols-2" : "grid-cols-1"} gap-4`}>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-1.5">
                Date
              </label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 bg-stone-50/50 text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-stone-900 focus:bg-white transition-all"
              />
            </div>

            {isLoan && (
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-1.5">
                  {loanType === "given" ? "Given to (Friend's Name)" : "Taken from (Friend's Name)"}
                </label>
                <input
                  type="text"
                  required
                  placeholder={loanType === "given" ? "e.g. Rahul, Priya, Alex" : "e.g. Alex, Sneha, Rohan"}
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 bg-stone-50/50 text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-stone-900 focus:bg-white transition-all placeholder:text-stone-400"
                />
              </div>
            )}
          </div>

          {/* Description / Note Input */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-1.5">
              Description
            </label>
            <input
              type="text"
              placeholder={isLoan ? "e.g., Dinner bill split, emergency cash" : "e.g., Dinner with friends, movie tickets"}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-stone-200 bg-stone-50/50 text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-stone-900 focus:bg-white transition-all placeholder:text-stone-400"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-stone-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-stone-600 hover:text-stone-900 text-sm font-medium transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="flex items-center gap-2 bg-stone-900 hover:bg-stone-800 text-white px-5 py-2.5 rounded-xl text-sm font-medium shadow-md shadow-stone-900/10 transition-all disabled:opacity-50 cursor-pointer"
            >
              {isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  Save {isLoan ? "Loan / Transfer" : "Transaction"}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
