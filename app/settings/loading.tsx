import React from "react";

export default function SettingsLoading() {
  return (
    <div className="flex flex-col min-h-screen bg-[#fafaf9] text-stone-900 font-sans antialiased animate-pulse">
      <div className="w-full bg-[#1a1917] h-14 px-4 sm:px-8 border-b border-[#292723] flex items-center justify-between">
        <div className="flex items-center gap-3.5">
          <div className="w-9 h-9 rounded-xl bg-[#252320]" />
          <div className="w-24 h-6 rounded bg-[#252320]" />
        </div>
      </div>

      <main className="flex-1 p-4 sm:p-6 lg:p-10 max-w-7xl w-full mx-auto space-y-6">
        <div className="space-y-2">
          <div className="w-48 h-7 rounded-lg bg-stone-300" />
          <div className="w-64 h-4 rounded bg-stone-200" />
        </div>

        <div className="max-w-2xl bg-white border border-stone-200/80 rounded-2xl p-6 sm:p-8 space-y-6 shadow-2xs">
          <div className="flex items-center gap-4 pb-6 border-b border-stone-100">
            <div className="w-14 h-14 rounded-2xl bg-stone-300" />
            <div className="space-y-2">
              <div className="w-36 h-5 rounded bg-stone-300" />
              <div className="w-48 h-4 rounded bg-stone-200" />
            </div>
          </div>
          <div className="space-y-4">
            <div className="w-full h-16 rounded-xl bg-stone-100" />
            <div className="w-full h-16 rounded-xl bg-stone-100" />
          </div>
        </div>
      </main>
    </div>
  );
}
