import React from "react";

export default function Loading() {
  return (
    <div className="flex flex-col min-h-screen bg-[#fafaf9] text-stone-900 font-sans antialiased animate-pulse">
      {/* Top Header skeleton */}
      <div className="w-full bg-[#1a1917] h-14 px-4 sm:px-8 border-b border-[#292723] flex items-center justify-between">
        <div className="flex items-center gap-3.5">
          <div className="w-9 h-9 rounded-xl bg-[#252320]" />
          <div className="w-24 h-6 rounded bg-[#252320]" />
        </div>
      </div>

      {/* Main Content Dashboard skeleton */}
      <main className="flex-1 p-4 sm:p-6 lg:p-10 max-w-7xl w-full mx-auto space-y-8">
        {/* Header Greeting & Actions Skeleton */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="w-28 h-4 rounded bg-stone-200" />
            <div className="w-48 h-8 rounded-lg bg-stone-300" />
          </div>
          <div className="flex items-center gap-3">
            <div className="w-32 h-9 rounded-full bg-stone-200" />
            <div className="w-36 h-9 rounded-xl bg-stone-300" />
          </div>
        </div>

        {/* Top Metric Cards Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white border border-stone-200/70 rounded-2xl p-5 shadow-2xs space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-24 h-4 rounded bg-stone-200" />
                <div className="w-8 h-8 rounded-xl bg-stone-100" />
              </div>
              <div className="w-36 h-8 rounded-lg bg-stone-300" />
              <div className="w-28 h-3 rounded bg-stone-100" />
            </div>
          ))}
        </div>

        {/* Middle Two-Column Grid Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 bg-white border border-stone-200/70 rounded-2xl p-6 h-64 space-y-4">
            <div className="w-36 h-6 rounded bg-stone-200" />
            <div className="w-full h-8 rounded bg-stone-100" />
            <div className="space-y-2 pt-4">
              <div className="w-full h-3 rounded bg-stone-200" />
              <div className="w-full h-3 rounded bg-stone-200" />
            </div>
          </div>
          <div className="lg:col-span-5 bg-white border border-stone-200/70 rounded-2xl p-6 h-64 space-y-4">
            <div className="w-36 h-6 rounded bg-stone-200" />
            <div className="w-full h-24 rounded-xl bg-stone-100" />
          </div>
        </div>

        {/* Recent Transactions List Skeleton */}
        <div className="bg-white border border-stone-200/70 rounded-2xl p-6 space-y-4">
          <div className="w-44 h-6 rounded bg-stone-200" />
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center justify-between py-3 border-b border-stone-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-stone-200" />
                <div className="space-y-1.5">
                  <div className="w-32 h-4 rounded bg-stone-200" />
                  <div className="w-20 h-3 rounded bg-stone-100" />
                </div>
              </div>
              <div className="w-20 h-5 rounded bg-stone-300" />
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
