"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, ReceiptText, BarChart3, Handshake, Settings, Menu, X, User } from "lucide-react";

interface SidebarProps {
  userName?: string | null;
  userEmail?: string | null;
}

export function Sidebar({ userName, userEmail }: SidebarProps) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { label: "Home", icon: Home, href: "/dashboard" },
    { label: "Transactions", icon: ReceiptText, href: "/transactions" },
    { label: "Budget", icon: BarChart3, href: "/budget" },
    { label: "Loans", icon: Handshake, href: "/loans" },
    { label: "Settings", icon: Settings, href: "/settings" },
  ];

  return (
    <>
      {/* Top Header Navigation Bar */}
      <header className="w-full bg-[#1a1917] text-stone-300 px-4 sm:px-8 py-3.5 sticky top-0 z-40 flex items-center justify-between border-b border-[#292723] shadow-sm">
        {/* Left Side Group: Menu Button & MoneyFlow Logo Side-by-Side */}
        <div className="flex items-center gap-3.5">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 rounded-xl bg-[#252320] hover:bg-[#2c2a26] text-stone-200 hover:text-white border border-[#33302b] transition-colors cursor-pointer flex items-center justify-center"
            aria-label="Toggle Navigation Menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <Link href="/" className="flex items-center pl-1">
            <span className="text-2xl font-bold tracking-tight text-white font-sans">Money</span>
            <span className="text-2xl font-bold tracking-tight text-emerald-500 font-sans">Flow</span>
          </Link>
        </div>
      </header>

      {/* Left-Side Collapsible Drawer & Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex justify-start">
          {/* Backdrop Overlay */}
          <div
            className="fixed inset-0 bg-stone-900/60 backdrop-blur-xs transition-opacity"
            onClick={() => setIsOpen(false)}
          />

          {/* Left Sliding Drawer */}
          <div className="relative w-80 max-w-[85vw] bg-[#1a1917] text-stone-300 p-6 flex flex-col justify-between h-full shadow-2xl z-10 animate-in slide-in-from-left duration-200 border-r border-[#292723]">
            <div>
              {/* Drawer Header */}
              <div className="flex items-center justify-between pb-6 mb-6 border-b border-[#292723]">
                <Link href="/" onClick={() => setIsOpen(false)} className="flex items-center">
                  <span className="text-xl font-bold tracking-tight text-white font-sans">Money</span>
                  <span className="text-xl font-bold tracking-tight text-emerald-500 font-sans">Flow</span>
                </Link>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-[#252320] cursor-pointer"
                  aria-label="Close Menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Drawer Navigation Links */}
              <nav className="space-y-1.5">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const active =
                    pathname === item.href ||
                    (item.href !== "/" && pathname.startsWith(item.href));
                  return (
                    <Link
                      key={item.label}
                      href={item.href}
                      prefetch={true}
                      onClick={() => setIsOpen(false)}
                      className={`flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                        active
                          ? "bg-[#2c2a26] text-white shadow-xs"
                          : "text-stone-400 hover:text-stone-100 hover:bg-[#252320]"
                      }`}
                    >
                      <Icon className={`w-4 h-4 ${active ? "text-white" : "text-stone-400"}`} />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </nav>
            </div>

            {/* Footer User Profile Section */}
            {(userName || userEmail) && (
              <div className="px-3 pt-6 mt-6 border-t border-[#292723]">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-[#2c2a26] flex items-center justify-center text-stone-300 font-semibold text-sm border border-[#3a3732]">
                    <User className="w-4 h-4 text-stone-300" />
                  </div>
                  <div className="overflow-hidden">
                    <p className="text-xs text-stone-500 font-normal">Signed in as</p>
                    <p className="text-sm text-stone-200 font-semibold truncate" title={userName || userEmail || ""}>
                      {userName || userEmail}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
