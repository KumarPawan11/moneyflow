import React from "react";

export default function TransactionsLoading() {
  return (
    <div className="flex flex-col min-h-screen bg-[#fafaf9] text-stone-900 font-sans antialiased animate-pulse">
      {/* Header Bar */}
      <div className="w-full bg-[#1a1917] h-14 px-4 sm:px-8 border-b border-[#292723] flex items-center justify-between">
        <div className="flex items-center gap-3.5">
          <div className="w-9 h-9 rounded-xl bg-[#252320]" />
          <div className="w-24 h-6 rounded bg-[#252320]" />
        </div>
      </div>

      <main className="flex-1 p-4 sm:p-6 lg:p-10 max-w-7xl w-full mx-auto space-y-6">
        <div className="space-y-2">
          <div className="w-40 h-7 rounded-lg bg-stone-300" />
          <div className="w-56 h-4 rounded bg-stone-200" />
        </div>

        {/* Transactions List Skeleton */}
        <div className="bg-white border border-stone-200/70 rounded-2xl p-6 space-y-4 shadow-2xs">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="flex items-center justify-between py-3.5 border-b border-stone-100 last:border-0">
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-stone-200" />
                <div className="space-y-1.5">
                  <div className="w-36 h-4 rounded bg-stone-200" />
                  <div className="w-24 h-3 rounded bg-stone-100" />
                </div>
              </div>
              <div className="w-24 h-5 rounded bg-stone-300" />
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
