"use client";

import React, { useState } from "react";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { AddTransactionModal } from "./AddTransactionModal";

interface HeaderProps {
  userName?: string | null;
  userEmail?: string | null;
  isHomePage?: boolean;
  showActions?: boolean;
}

export function Header({
  userName,
  userEmail,
  isHomePage = false,
  showActions = true,
}: HeaderProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (!isHomePage && !showActions) {
    return null;
  }

  const displayName = userName || userEmail || "Dashboard";

  return (
    <>
      <header className={`flex flex-col sm:flex-row sm:items-center ${isHomePage ? "justify-between" : "justify-end"} gap-4 mb-8`}>
        {/* Greeting and User Name (Home Page Only) */}
        {isHomePage && (
          <div>
            <p className="text-sm text-stone-500 font-medium tracking-wide">Welcome back</p>
            <div className="flex items-center gap-2 mt-0.5">
              <h1 className="text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight">
                {displayName}
              </h1>
            </div>
          </div>
        )}

        {/* Actions */}
        {showActions && (
          <div className="flex items-center flex-wrap gap-3">
            {/* Month Selector */}
            <div className="flex items-center gap-2 bg-white border border-stone-200/80 rounded-full px-3.5 py-1.5 shadow-xs text-sm font-medium text-stone-800">
              <button className="text-stone-400 hover:text-stone-700 transition-colors p-0.5" aria-label="Previous month">
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="px-1 text-stone-800 font-medium">July 2026</span>
              <button className="text-stone-400 hover:text-stone-700 transition-colors p-0.5" aria-label="Next month">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Add Transaction Button */}
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-1.5 bg-stone-900 hover:bg-stone-800 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors shadow-xs hover:shadow-md cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add transaction</span>
            </button>
          </div>
        )}
      </header>

      {/* Add Transaction Modal */}
      <AddTransactionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}
