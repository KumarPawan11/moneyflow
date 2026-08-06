import React from "react";

export default function BudgetLoading() {
  return (
    <div className="flex flex-col min-h-screen bg-[#fafaf9] text-stone-900 font-sans antialiased animate-pulse">
      <div className="w-full bg-[#1a1917] h-14 px-4 sm:px-8 border-b border-[#292723] flex items-center justify-between">
        <div className="flex items-center gap-3.5">
          <div className="w-9 h-9 rounded-xl bg-[#252320]" />
          <div className="w-24 h-6 rounded bg-[#252320]" />
        </div>
      </div>

      <main className="flex-1 p-4 sm:p-6 lg:p-10 max-w-7xl w-full mx-auto space-y-6">
        <div className="w-40 h-7 rounded-lg bg-stone-300" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 max-w-6xl">
          <div className="lg:col-span-7 bg-white border border-stone-200/70 rounded-2xl p-6 h-80 space-y-4 shadow-2xs">
            <div className="w-48 h-6 rounded bg-stone-200" />
            <div className="w-full h-12 rounded-xl bg-stone-100" />
            <div className="w-full h-12 rounded-xl bg-stone-100" />
          </div>
          <div className="lg:col-span-5 bg-white border border-stone-200/70 rounded-2xl p-6 h-80 space-y-4 shadow-2xs">
            <div className="w-40 h-6 rounded bg-stone-200" />
            <div className="w-full h-32 rounded-xl bg-stone-100" />
          </div>
        </div>
      </main>
    </div>
  );
}
