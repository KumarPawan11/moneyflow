"use client";

import React from "react";
import Link from "next/link";
import {
  Sparkles,
  ArrowRight,
  Play,
  Wallet,
  PieChart,
  Handshake,
  MessageSquare,
  FlaskConical,
  Rocket,
  Lightbulb,
  Target,
  Shield,
  ArrowUpRight,
  ArrowDownRight,
  Home,
  ReceiptText,
  Plus,
  ShoppingBag,
  Menu,
  X,
  Lock,
  BarChart3,
} from "lucide-react";

interface LandingPageProps {
  isLoggedIn?: boolean;
}

/* --- REUSABLE SUB-COMPONENTS FOR HERO SECTION --- */

interface HeroTextProps {
  isLoggedIn: boolean;
  handleScrollToSection: (
    e: React.MouseEvent<HTMLAnchorElement>,
    targetId: string
  ) => void;
}

function HeroTextContent({ isLoggedIn, handleScrollToSection }: HeroTextProps) {
  return (
    <div className="flex flex-col items-start space-y-4 sm:space-y-6">
      {/* Badge */}
      <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white border border-stone-200/90 text-stone-700 text-xs font-medium shadow-2xs">
        <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
        <span>Smart. Simple. Personal.</span>
      </div>

      {/* Main Headline */}
      <h1 className="text-3xl sm:text-4xl lg:text-[2.75rem] xl:text-[3.25rem] font-bold tracking-tight text-stone-900 leading-[1.15]">
        <span className="block whitespace-nowrap">Understand your money.</span>
        <span className="block text-[#10b981] mt-1 font-bold">Build your freedom.</span>
      </h1>

      {/* Description */}
      <p className="text-base sm:text-lg text-stone-600 leading-relaxed max-w-xl">
        MoneyFlow helps you track expenses, set budgets, and get AI-powered insights so you can make smarter financial decisions.
      </p>

      {/* CTA Action Buttons */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto pt-1">
        <Link
          href={isLoggedIn ? "/dashboard" : "/signup"}
          className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3.5 rounded-xl bg-stone-900 text-white font-semibold text-sm sm:text-base hover:bg-stone-800 transition-all shadow-sm hover:shadow group"
        >
          {isLoggedIn ? "Go to Dashboard" : "Get started for free"}
          <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-0.5 transition-transform" />
        </Link>
        
        <a
          href="#how-it-works"
          onClick={(e) => handleScrollToSection(e, "how-it-works")}
          className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3.5 rounded-xl bg-white border border-stone-200/90 text-stone-900 font-semibold text-sm sm:text-base hover:bg-stone-50 transition-all shadow-2xs"
        >
          <Play className="w-3.5 h-3.5 mr-2 fill-stone-900 text-stone-900" />
          <span>See how it works</span>
        </a>
      </div>
    </div>
  );
}

function PhoneMockup({ isDesktop = false }: { isDesktop?: boolean }) {
  return (
    <div
      className={`relative rounded-[40px] lg:rounded-[44px] bg-stone-950 shadow-2xl border border-stone-800 z-10 mx-auto shrink-0 transition-all ${
        isDesktop
          ? "w-[214px] xl:w-[221px] p-[6px]"
          : "w-[166.4px] sm:w-[270px] lg:w-[285px] p-[4.8px] sm:p-2"
      }`}
    >
      {/* Phone Screen Canvas */}
      <div
        className={`bg-white rounded-[32px] lg:rounded-[36px] pt-2 pb-3 px-3.5 text-stone-900 overflow-hidden flex flex-col justify-between border border-stone-100 shadow-xs ${
          isDesktop ? "min-h-[441px] max-h-[458px]" : "min-h-[301px] max-h-[310px] sm:min-h-[470px] sm:max-h-[485px]"
        }`}
      >
        {/* iOS Status Bar with Dynamic Island */}
        <div className="relative flex items-center justify-between text-stone-950 px-1 pt-0.5 mb-2 z-30 h-5">
          <span className="text-[10px] font-bold tracking-tight leading-none z-30 pl-0.5">9:41</span>

          {/* Center Dynamic Island */}
          <div className="absolute left-1/2 -translate-x-1/2 top-0.5 w-[54px] h-[14px] bg-stone-950 rounded-full z-30 flex items-center justify-end px-1 shadow-xs">
            <div className="w-1.5 h-1.5 rounded-full bg-[#141416] ring-1 ring-stone-900/60 flex items-center justify-center">
              <div className="w-0.5 h-0.5 rounded-full bg-slate-800/80" />
            </div>
          </div>

          {/* Right Icons */}
          <div className="flex items-center gap-1 z-30 pr-0.5">
            <div className="flex items-end gap-[1px] h-2">
              <div className="w-[1.5px] h-[2px] bg-stone-950 rounded-[0.5px]" />
              <div className="w-[1.5px] h-[3.5px] bg-stone-950 rounded-[0.5px]" />
              <div className="w-[1.5px] h-[5px] bg-stone-950 rounded-[0.5px]" />
              <div className="w-[1.5px] h-[6.5px] bg-stone-950 rounded-[0.5px]" />
            </div>
            <svg className="w-2.5 h-2.5 fill-stone-950 shrink-0" viewBox="0 0 24 24">
              <path d="M12 18c-.8 0-1.5.7-1.5 1.5S11.2 21 12 21s1.5-.7 1.5-1.5S12.8 18 12 18zm-4.9-3.2c.4.4 1 .4 1.4 0 1.9-1.9 5.1-1.9 7 0 .4.4 1 .4 1.4 0s.4-1 0-1.4c-2.7-2.7-7.1-2.7-9.8 0-.4.4-.4 1 0 1.4zm-3.5-3.5c.4.4 1 .4 1.4 0 3.9-3.9 10.1-3.9 14 0 .4.4 1 .4 1.4 0s.4-1 0-1.4c-4.6-4.6-12.2-4.6-16.8 0-.4.4-.4 1 0 1.4z" />
            </svg>
            <div className="flex items-center gap-[0.5px]">
              <div className="w-[13px] h-[7px] rounded-[2px] border border-stone-950 p-[1px] flex items-center">
                <div className="w-full h-full bg-stone-950 rounded-[0.5px]" />
              </div>
            </div>
          </div>
        </div>

        {/* App Content inside Phone */}
        <div className="flex-1 flex flex-col justify-between text-left space-y-2">
          <div>
            {/* Header Greeting */}
            <div className="mb-2 px-0.5">
              <h2 className="text-xs sm:text-sm font-bold text-stone-900 tracking-tight flex items-center gap-1">
                <span>Hi, Pawan</span>
                <span>👋</span>
              </h2>
              <p className="text-[9.5px] sm:text-[10px] text-stone-400 font-medium">
                Here&apos;s your financial overview
              </p>
            </div>

            {/* Total Balance Card with Sparkline */}
            <div className="bg-white rounded-xl p-2.5 sm:p-3 mb-2.5 border border-stone-100 shadow-2xs relative overflow-hidden">
              <p className="text-[9px] sm:text-[9.5px] text-stone-400 font-semibold uppercase tracking-wider">Total Balance</p>
              <p className="text-lg sm:text-xl font-bold tracking-tight text-stone-900 mt-0.5">₹ 48,750.00</p>
              
              <div className="flex items-center justify-between mt-1.5">
                <p className="text-[9.5px] sm:text-[10px] text-emerald-600 font-semibold flex items-center gap-0.5">
                  <ArrowUpRight className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                  <span>12% vs last month</span>
                </p>

                <svg className="w-16 sm:w-20 h-5" viewBox="0 0 100 30" fill="none">
                  <path
                    d="M 0 25 Q 25 20, 50 15 T 80 5 T 100 2"
                    stroke="#22c55e"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    fill="none"
                  />
                </svg>
              </div>
            </div>

            {/* This Month Section */}
            <div className="mb-2.5">
              <div className="flex items-center justify-between mb-1 px-0.5">
                <h3 className="text-[11px] sm:text-[12px] font-bold text-stone-900">This Month</h3>
                <span className="text-[9.5px] sm:text-[10px] font-medium text-blue-600 cursor-pointer hover:underline">View all</span>
              </div>

              <div className="grid grid-cols-2 gap-1.5 sm:gap-2">
                <div className="bg-[#fafaf9] p-2 sm:p-2.5 rounded-lg border border-stone-200/60">
                  <div className="w-4 h-4 sm:w-4.5 sm:h-4.5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-0.5">
                    <ArrowUpRight className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                  </div>
                  <p className="text-[9px] sm:text-[9.5px] text-stone-400 font-medium">Income</p>
                  <p className="text-[10.5px] sm:text-[11.5px] font-bold text-stone-900">₹ 65,000</p>
                </div>

                <div className="bg-[#fafaf9] p-2 sm:p-2.5 rounded-lg border border-stone-200/60">
                  <div className="w-4 h-4 sm:w-4.5 sm:h-4.5 rounded-full bg-rose-100 text-rose-500 flex items-center justify-center mb-0.5">
                    <ArrowDownRight className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                  </div>
                  <p className="text-[9px] sm:text-[9.5px] text-stone-400 font-medium">Expenses</p>
                  <p className="text-[10.5px] sm:text-[11.5px] font-bold text-stone-900">₹ 32,250</p>
                </div>
              </div>
            </div>

            {/* Spending by Category */}
            <div className="bg-[#fafaf9] p-2.5 rounded-lg border border-stone-200/60">
              <h3 className="text-[10.5px] sm:text-[11.5px] font-bold text-stone-900 mb-1.5">Spending by Category</h3>
              
              <div className="flex items-center gap-2.5">
                <div className="relative w-12 sm:w-14 h-12 sm:h-14 shrink-0">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                    <path
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="#e2e8f0"
                      strokeWidth="4"
                    />
                    <path
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="#3b82f6"
                      strokeWidth="4"
                      strokeDasharray="40, 100"
                    />
                    <path
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="#10b981"
                      strokeWidth="4"
                      strokeDasharray="20, 100"
                      strokeDashoffset="-40"
                    />
                  </svg>
                </div>

                <div className="flex-1 space-y-0.5 text-[9px] sm:text-[10px]">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1 text-stone-600">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                      Food & Dining
                    </span>
                    <span className="font-semibold text-stone-900">40%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1 text-stone-600">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      Transport
                    </span>
                    <span className="font-semibold text-stone-900">20%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1 text-stone-600">
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                      Shopping
                    </span>
                    <span className="font-semibold text-stone-900">15%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Nav Bar inside Phone Screen */}
          <div className="pt-2 border-t border-stone-200/80 flex items-center justify-around text-[9px] text-stone-400">
            <div className="flex flex-col items-center text-stone-900 font-bold">
              <Home className="w-3.5 h-3.5" />
              <span className="text-[8px] mt-0.5">Home</span>
            </div>
            <div className="flex flex-col items-center">
              <ReceiptText className="w-3.5 h-3.5" />
              <span className="text-[8px] mt-0.5">Transactions</span>
            </div>
            <div className="w-6 h-6 rounded-full bg-stone-900 text-white flex items-center justify-center shadow-xs">
              <Plus className="w-3.5 h-3.5" />
            </div>
            <div className="flex flex-col items-center">
              <ShoppingBag className="w-3.5 h-3.5" />
              <span className="text-[8px] mt-0.5">Budget</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function AICard({ className = "" }: { className?: string }) {
  return (
    <div className={`bg-[#f0faf2] border border-[#d2f3db] p-3.5 sm:p-4 rounded-[20px] shadow-sm text-left ${className}`}>
      <div className="w-8 h-8 rounded-xl bg-[#e3f8e9] flex items-center justify-center text-[#1b6a38] mb-2 shadow-2xs">
        <Lightbulb className="w-4 h-4" />
      </div>
      <h3 className="text-xs sm:text-sm font-bold text-[#1b6a38] mb-1">AI Insights</h3>
      <p className="text-[10px] sm:text-[11px] text-stone-600 leading-snug">
        You spent 20% less
        <br />
        on food this week.
        <br />
        Great job!
      </p>
    </div>
  );
}

function SecureCard({ className = "" }: { className?: string }) {
  return (
    <div className={`bg-[#f0f5ff] border border-blue-100/90 p-3.5 sm:p-4 rounded-2xl shadow-sm text-left ${className}`}>
      <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-blue-100/90 flex items-center justify-center text-blue-600 mb-2 shadow-2xs">
        <Shield className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
      </div>
      <h3 className="text-xs sm:text-sm font-bold text-blue-900 mb-1">Secure</h3>
      <p className="text-[10px] sm:text-[11px] text-stone-600 leading-snug">
        Your data is 100%
        <br />
        private and secure.
      </p>
    </div>
  );
}

function BudgetCard({ className = "" }: { className?: string }) {
  return (
    <div className={`bg-[#f8f5ff] border border-purple-100/90 p-4 rounded-[20px] shadow-sm text-left flex flex-col justify-center items-start h-full ${className}`}>
      <div className="w-8 h-8 rounded-xl bg-purple-100/90 flex items-center justify-center text-purple-600 mb-2.5 shadow-2xs shrink-0">
        <Target className="w-4 h-4" />
      </div>
      <h3 className="text-xs sm:text-sm font-bold text-indigo-900 mb-1.5 leading-none">Budget</h3>
      <p className="text-[10px] sm:text-[11px] text-stone-600 leading-relaxed">
        You&apos;re on track!
        <br />
        80% of monthly
        <br />
        budget left.
      </p>
    </div>
  );
}

/* --- MAIN LANDING PAGE COMPONENT --- */

export function LandingPage({ isLoggedIn = false }: LandingPageProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [isScrolled, setIsScrolled] = React.useState(false);

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const handleScroll = () => {
        setIsScrolled(window.scrollY > 10);
      };
      window.addEventListener("scroll", handleScroll, { passive: true });
      return () => window.removeEventListener("scroll", handleScroll);
    }
  }, []);

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      if ("scrollRestoration" in window.history) {
        window.history.scrollRestoration = "manual";
      }
      window.scrollTo(0, 0);

      const handleBeforeUnload = () => {
        if ("scrollRestoration" in window.history) {
          window.history.scrollRestoration = "manual";
        }
        window.scrollTo(0, 0);
      };

      window.addEventListener("beforeunload", handleBeforeUnload);

      const timer = setTimeout(() => {
        window.scrollTo(0, 0);
      }, 0);

      return () => {
        window.removeEventListener("beforeunload", handleBeforeUnload);
        clearTimeout(timer);
      };
    }
  }, []);

  const scrollToTop = (e: React.MouseEvent) => {
    if (typeof window !== "undefined") {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
      if (window.location.hash) {
        window.history.pushState(null, "", "/");
      }
    }
  };

  const handleScrollToSection = (
    e: React.MouseEvent<HTMLAnchorElement>,
    targetId: string
  ) => {
    if (typeof window !== "undefined") {
      e.preventDefault();
      const element = document.getElementById(targetId);
      if (element) {
        const headerOffset = 80;
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth",
        });
        window.history.pushState(null, "", `#${targetId}`);
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#fafaf9] text-stone-900 font-sans antialiased selection:bg-emerald-100 selection:text-emerald-900 overflow-x-clip">
      {/* 1. Header / Navbar */}
      <header className={`sticky top-0 z-50 bg-[#fafaf9]/90 backdrop-blur-md border-b transition-all duration-200 ${
        isScrolled ? "border-stone-200/90 shadow-sm" : "border-stone-200/60"
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          {/* Brand Logo */}
          <Link href="/" onClick={scrollToTop} className="flex items-center gap-1.5 group">
            <div className="w-8 h-8 rounded-lg bg-stone-900 flex items-center justify-center text-white font-bold text-sm shadow-xs group-hover:scale-105 transition-transform">
              <Wallet className="w-4 h-4 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight text-stone-900 font-sans">
              Money<span className="text-emerald-500">Flow</span>
            </span>
          </Link>

          {/* Nav Links (Desktop) */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-stone-600">
            <a
              href="#what-you-can-do"
              onClick={(e) => handleScrollToSection(e, "what-you-can-do")}
              className="hover:text-stone-900 transition-colors"
            >
              What you can do
            </a>
            <a
              href="#how-it-works"
              onClick={(e) => handleScrollToSection(e, "how-it-works")}
              className="hover:text-stone-900 transition-colors"
            >
              How it works
            </a>
            <a
              href="#early-access"
              onClick={(e) => handleScrollToSection(e, "early-access")}
              className="hover:text-stone-900 transition-colors flex items-center gap-1.5"
            >
              <Rocket className="w-3.5 h-3.5 text-emerald-600" />
              <span>Early Access</span>
            </a>
          </nav>

          {/* Right Action CTA Buttons & Mobile Hamburger */}
          <div className="flex items-center gap-2 sm:gap-3">
            {isLoggedIn ? (
              <Link
                href="/dashboard"
                className="inline-flex items-center justify-center px-4 sm:px-5 py-2 rounded-lg bg-stone-900 text-white font-medium text-xs sm:text-sm hover:bg-stone-800 transition-all shadow-xs"
              >
                Dashboard
                <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 ml-1.5" />
              </Link>
            ) : (
              <>
                <Link
                  href="/login"
                  className="hidden md:inline-flex whitespace-nowrap shrink-0 text-xs sm:text-sm font-semibold text-stone-800 hover:text-stone-900 border border-stone-300 hover:border-stone-400 bg-white hover:bg-stone-50 px-3 sm:px-4 py-1.5 rounded-lg transition-all shadow-2xs"
                >
                  Log in
                </Link>
                <Link
                  href="/signup"
                  className="whitespace-nowrap shrink-0 inline-flex items-center justify-center px-3.5 sm:px-5 py-2 rounded-xl bg-stone-900 text-white font-medium text-xs sm:text-sm hover:bg-stone-800 transition-all shadow-xs"
                >
                  Get started
                </Link>
              </>
            )}

            {/* Mobile Hamburger Toggle Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-stone-900 hover:bg-stone-100 transition-colors cursor-pointer ml-1"
              aria-label="Toggle Navigation Menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Nav Drawer */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-stone-200/80 bg-[#fafaf9] px-4 pt-3 pb-5 space-y-3 shadow-lg">
            <nav className="flex flex-col space-y-2 text-sm font-medium text-stone-700">
              <a
                href="#what-you-can-do"
                onClick={(e) => {
                  handleScrollToSection(e, "what-you-can-do");
                  setIsMobileMenuOpen(false);
                }}
                className="px-3 py-2 rounded-lg hover:bg-stone-100 hover:text-stone-900 transition-colors"
              >
                What you can do
              </a>
              <a
                href="#how-it-works"
                onClick={(e) => {
                  handleScrollToSection(e, "how-it-works");
                  setIsMobileMenuOpen(false);
                }}
                className="px-3 py-2 rounded-lg hover:bg-stone-100 hover:text-stone-900 transition-colors"
              >
                How it works
              </a>
              <a
                href="#early-access"
                onClick={(e) => {
                  handleScrollToSection(e, "early-access");
                  setIsMobileMenuOpen(false);
                }}
                className="px-3 py-2 rounded-lg hover:bg-stone-100 hover:text-stone-900 transition-colors flex items-center gap-2"
              >
                <Rocket className="w-4 h-4 text-emerald-600" />
                <span>Early Access</span>
              </a>
              {!isLoggedIn && (
                <Link
                  href="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="px-3 py-2 rounded-lg bg-stone-100 font-semibold text-stone-900 hover:bg-stone-200 transition-colors mt-1"
                >
                  Log in
                </Link>
              )}
            </nav>
          </div>
        )}
      </header>

      {/* 2. Hero Section - Three Independent Responsive Layouts */}
      <section className="relative pt-6 pb-12 sm:pt-10 sm:pb-16 lg:pt-4 lg:pb-10 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* ========================================================= */}
          {/* LAYOUT 1: MOBILE (0–639px) - Independent Mobile Hero      */}
          {/* ========================================================= */}
          <div className="block sm:hidden space-y-7 text-left px-1">
            {/* 1. Small badge */}
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white border border-stone-200/90 text-stone-700 text-xs font-medium shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
              <span>Smart. Simple. Personal.</span>
            </div>

            {/* 2. Headline */}
            <h1 className="text-[1.75rem] min-[375px]:text-[1.95rem] min-[420px]:text-[2.15rem] font-bold tracking-tight text-stone-900 leading-[1.18]">
              <span className="block whitespace-nowrap">Understand your money.</span>
              <span className="block text-[#10b981] mt-0.5 font-bold whitespace-nowrap">Build your freedom.</span>
            </h1>

            {/* 3. Description */}
            <p className="text-sm text-stone-600 leading-relaxed">
              MoneyFlow helps you track expenses, set budgets, and get AI-powered insights so you can make smarter financial decisions.
            </p>

            {/* 4. Primary CTA & 5. Secondary CTA */}
            <div className="flex flex-col gap-2.5 pt-1 w-full">
              <Link
                href={isLoggedIn ? "/dashboard" : "/signup"}
                className="w-full inline-flex items-center justify-center px-5 py-3.5 rounded-xl bg-stone-900 text-white font-semibold text-sm hover:bg-stone-800 transition-all shadow-sm"
              >
                <span>{isLoggedIn ? "Go to Dashboard" : "Get started for free"}</span>
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>

              <a
                href="#how-it-works"
                onClick={(e) => handleScrollToSection(e, "how-it-works")}
                className="w-full inline-flex items-center justify-center px-5 py-3.5 rounded-xl bg-white border border-stone-200/90 text-stone-900 font-semibold text-sm hover:bg-stone-50 transition-all shadow-2xs"
              >
                <Play className="w-3.5 h-3.5 mr-2 fill-stone-900 text-stone-900" />
                <span>See how it works</span>
              </a>
            </div>

            {/* 6. Small trust text */}
            <p className="text-xs text-stone-500 text-center pt-1 font-medium">
              Built for people who want to understand their money.
            </p>

            {/* 7. iPhone Mockup with mobile floating cards (positioned beside phone) & dotted connectors */}
            <div className="relative pt-6 pb-4 flex flex-col items-center justify-center overflow-visible">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-emerald-100/50 rounded-full blur-3xl -z-10 pointer-events-none" />

              <div className="relative w-full max-w-[340px] mx-auto flex items-center justify-center">
                {/* Mobile Dotted Connector Lines */}
                <svg
                  className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-visible"
                  viewBox="0 0 340 440"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  {/* Curve 1: AI Insights (Top Left) -> Phone Bezel */}
                  <path
                    d="M 77 50 C 107 50, 125 75, 138 95"
                    stroke="#34d399"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeDasharray="3 4"
                    opacity="0.8"
                  />
                  {/* Curve 2: Secure (Bottom Left) -> Phone Bezel */}
                  <path
                    d="M 75 350 C 105 350, 125 320, 138 295"
                    stroke="#34d399"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeDasharray="3 4"
                    opacity="0.8"
                  />
                  {/* Curve 3: Budget (Middle Right) -> Phone Bezel */}
                  <path
                    d="M 265 190 C 240 190, 222 205, 202 215"
                    stroke="#34d399"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeDasharray="3 4"
                    opacity="0.8"
                  />
                </svg>

                {/* 1. Floating AI Insights Card: Top-Left beside phone */}
                <div className="absolute -top-2 left-[-22px] sm:-left-10 z-20 w-[125px] max-w-[125px] scale-[0.74] sm:scale-90 origin-top-left">
                  <AICard />
                </div>

                {/* 2. Floating Secure Card: Bottom-Left beside phone */}
                <div className="absolute bottom-10 -left-6 sm:-left-10 z-20 w-[125px] max-w-[125px] scale-[0.74] sm:scale-90 origin-bottom-left">
                  <SecureCard />
                </div>

                {/* 3. Floating Budget Card: Middle-Right beside phone */}
                <div className="absolute top-[32%] -right-6 sm:-right-10 z-20 w-[120px] max-w-[120px] scale-[0.74] sm:scale-90 origin-right">
                  <BudgetCard />
                </div>

                {/* Centered Phone Mockup */}
                <div className="relative flex items-center justify-center mx-auto">
                  <PhoneMockup />
                </div>
              </div>
            </div>

          </div>

          {/* ========================================================= */}
          {/* LAYOUT 2: TABLET (640px–1023px) - Independent 2-Column    */}
          {/* ========================================================= */}
          <div className="hidden sm:grid lg:hidden sm:grid-cols-12 gap-6 items-center min-h-[500px]">
            {/* Left Column: Hero Text Content */}
            <div className="sm:col-span-6">
              <HeroTextContent isLoggedIn={isLoggedIn} handleScrollToSection={handleScrollToSection} />
            </div>

            {/* Right Column: Phone on Right + Balanced Floating Cards */}
            <div className="sm:col-span-6 relative flex flex-col items-center justify-center py-4 overflow-visible">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[360px] h-[360px] bg-emerald-100/40 rounded-full blur-3xl -z-10 pointer-events-none" />

              <div className="relative w-full max-w-[340px] flex items-center justify-center">
                {/* 1. Floating AI Insights (Top Left around phone) */}
                <div className="absolute -top-3 -left-6 z-20 max-w-[140px]">
                  <AICard />
                </div>

                {/* 2. Floating Secure (Bottom Left around phone) */}
                <div className="absolute -bottom-3 -left-4 z-20 max-w-[140px]">
                  <SecureCard />
                </div>

                {/* 3. Floating Budget (Middle Right around phone) */}
                <div className="absolute top-1/3 -right-6 z-20 max-w-[140px]">
                  <BudgetCard />
                </div>

                {/* Phone Mockup in center of tablet column */}
                <PhoneMockup />
              </div>
            </div>
          </div>

          {/* ========================================================= */}
          {/* LAYOUT 3: DESKTOP (1024px+) - Recreated Reference Design   */}
          {/* ========================================================= */}
          <div className="hidden lg:grid lg:grid-cols-12 gap-8 lg:gap-12 items-center pt-2">
            {/* Left Column: Hero Text Content & Avatars */}
            <div className="lg:col-span-6 xl:col-span-5 pr-2">
              <HeroTextContent isLoggedIn={isLoggedIn} handleScrollToSection={handleScrollToSection} />
            </div>

            {/* Right Column: Scaled Phone Mockup (20-25% larger) + Reference Layout Floating Cards + SVG Dotted Connectors */}
            <div className="lg:col-span-6 xl:col-span-7 relative flex flex-col items-center justify-center overflow-visible min-h-[480px] lg:min-h-[480px] pl-4">
              
              {/* Background Ambient Glow */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[520px] xl:w-[580px] h-[520px] xl:h-[580px] bg-emerald-100/45 rounded-full blur-3xl -z-10 pointer-events-none" />

              <div className="relative w-full max-w-[680px] xl:max-w-[740px] flex items-center justify-center">
                
                {/* Subtle Curved Dotted Connector Lines behind phone & cards */}
                <svg
                  className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-visible"
                  viewBox="0 0 680 560"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  {/* Curve 1: AI Insights Card (Left Upper) -> Phone Left Upper Edge */}
                  <path
                    d="M 375 125 C 395 125, 415 150, 436 175"
                    stroke="#34d399"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeDasharray="4 5"
                    opacity="0.75"
                  />
                  {/* Curve 2: Secure Card (Left Lower) -> Phone Left Lower Edge */}
                  <path
                    d="M 360 400 C 380 400, 410 365, 436 335"
                    stroke="#34d399"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeDasharray="4 5"
                    opacity="0.75"
                  />
                  {/* Curve 3: Budget Card (Right Upper-Middle) -> Phone Right Upper-Middle Edge */}
                  <path
                    d="M 535 220 C 530 220, 527 230, 524 245"
                    stroke="#34d399"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeDasharray="4 5"
                    opacity="0.75"
                  />
                </svg>

                {/* 1. AI Insights Card: Shifted slightly to the left */}
                <div className="absolute top-10 left-[180px] xl:left-[210px] z-20 max-w-[170px]">
                  <AICard />
                </div>

                {/* 2. Secure Card: Positioned a little to the left */}
                <div className="absolute bottom-10 left-36 xl:left-44 z-20 max-w-[170px]">
                  <SecureCard />
                </div>

                {/* 3. Budget Card: Shifted a little to the left */}
                <div className="absolute top-24 right-32 xl:right-24 z-20 w-[124px] max-w-[124px] translate-x-24 lg:translate-x-32">
                  <BudgetCard />
                </div>

                {/* Desktop Scaled Focal Point Phone Mockup (Shifted right) */}
                <div className="relative flex items-center justify-center translate-x-24 lg:translate-x-32">
                  <PhoneMockup isDesktop={true} />
                </div>

              </div>

            </div>
          </div>

          {/* ========================================================= */}
          {/* BOTTOM FEATURE STRIP (Replaces old green security banner) */}
          {/* ========================================================= */}
          <div className="w-full max-w-6xl mx-auto mt-10 sm:mt-14 lg:mt-8 bg-white border border-stone-200/80 rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-sm hover:shadow-md transition-all">
            
            {/* 4 Feature Columns Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 divide-y sm:divide-y-0 sm:divide-x divide-stone-100">
              
              {/* Feature 1: Track everything */}
              <div className="pt-4 sm:pt-0 sm:px-2 first:pt-0 first:px-0 flex flex-col items-start">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3.5 shadow-2xs">
                  <Wallet className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-stone-900 mb-1">Track everything</h3>
                <p className="text-xs text-stone-500 leading-relaxed">
                  Add expenses in seconds and keep everything organized.
                </p>
              </div>

              {/* Feature 2: Set budgets */}
              <div className="pt-4 sm:pt-0 sm:px-6 flex flex-col items-start">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-3.5 shadow-2xs">
                  <BarChart3 className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-stone-900 mb-1">Set budgets</h3>
                <p className="text-xs text-stone-500 leading-relaxed">
                  Create budgets that actually help you spend better.
                </p>
              </div>

              {/* Feature 3: AI insights */}
              <div className="pt-4 sm:pt-0 sm:px-6 flex flex-col items-start">
                <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-3.5 shadow-2xs">
                  <Sparkles className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-stone-900 mb-1">AI insights</h3>
                <p className="text-xs text-stone-500 leading-relaxed">
                  Get smart insights to understand your spending habits.
                </p>
              </div>

              {/* Feature 4: Bank-level security */}
              <div className="pt-4 sm:pt-0 sm:px-6 flex flex-col items-start">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-3.5 shadow-2xs">
                  <Lock className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-stone-900 mb-1">Bank-level security</h3>
                <p className="text-xs text-stone-500 leading-relaxed">
                  Your data is encrypted and always protected.
                </p>
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* 3. "What you can do" Section */}
      <section id="what-you-can-do" className="py-12 md:py-28 bg-white border-b border-stone-200/60 scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Section Header */}
          <div className="text-center max-w-3xl lg:max-w-5xl xl:max-w-6xl mx-auto mb-16 space-y-4">
            <h2 className="text-xs font-bold tracking-wider text-emerald-600 uppercase">What you can do</h2>
            <p className="text-3xl sm:text-4xl lg:text-[32px] xl:text-[34px] font-bold text-stone-900 tracking-tight lg:whitespace-nowrap">
              Simple tools to understand and master your money
            </p>
            <p className="text-base lg:text-[15px] xl:text-base text-stone-600 lg:whitespace-nowrap">
              No complex financial jargon or endless spreadsheets. Just clear monthly visibility and actionable insights.
            </p>
          </div>

          {/* 4 Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            
            {/* Card 1: Track Everything */}
            <div className="bg-[#fafaf9] p-7 rounded-2xl border border-stone-200/80 hover:border-emerald-500/40 hover:shadow-md transition-all group flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Wallet className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-stone-900 mb-2">Track everything</h3>
                <p className="text-sm text-stone-600 leading-relaxed">
                  Add expenses in seconds and automatically categorize them into Needs, Wants, and Invested buckets.
                </p>
              </div>
            </div>

            {/* Card 2: Set Budgets */}
            <div className="bg-[#fafaf9] p-7 rounded-2xl border border-stone-200/80 hover:border-indigo-500/40 hover:shadow-md transition-all group flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <PieChart className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-stone-900 mb-2">Set budgets</h3>
                <p className="text-sm text-stone-600 leading-relaxed">
                  Create budgets that actually help you spend better with 50/30/20 target ratios or custom monthly goals.
                </p>
              </div>
            </div>

            {/* Card 3: AI Insights */}
            <div className="bg-[#fafaf9] p-7 rounded-2xl border border-stone-200/80 hover:border-amber-500/40 hover:shadow-md transition-all group flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Sparkles className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-stone-900 mb-2">AI insights</h3>
                <p className="text-sm text-stone-600 leading-relaxed">
                  Get smart monthly summaries, weekly spending trends, and instant overspend warnings for your Wants.
                </p>
              </div>
            </div>

            {/* Card 4: Track Loans */}
            <div className="bg-[#fafaf9] p-7 rounded-2xl border border-stone-200/80 hover:border-blue-500/40 hover:shadow-md transition-all group flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Handshake className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-stone-900 mb-2">Track loans</h3>
                <p className="text-sm text-stone-600 leading-relaxed">
                  Keep friend transfers and receivables separate so lent money doesn&apos;t pollute your normal monthly expenses.
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 4. "How it works" Section */}
      <section id="how-it-works" className="py-12 md:py-28 bg-[#fafaf9] scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <h2 className="text-xs font-bold tracking-wider text-emerald-600 uppercase">How it works</h2>
            <p className="text-3xl sm:text-4xl font-bold text-stone-900 tracking-tight">
              Three simple steps to financial clarity
            </p>
            <p className="text-base text-stone-600">
              Build positive financial habits with a clean monthly rhythm.
            </p>
          </div>

          {/* 3 Step Process */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Step 1 */}
            <div className="bg-white p-8 rounded-2xl border border-stone-200/80 shadow-xs relative">
              <span className="text-5xl font-extrabold text-stone-200 block mb-4">01</span>
              <h3 className="text-xl font-bold text-stone-900 mb-2">Set your target budget</h3>
              <p className="text-sm text-stone-600 leading-relaxed">
                Enter your expected monthly income and choose how much to allocate toward Needs, Wants, and Investments.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-white p-8 rounded-2xl border border-stone-200/80 shadow-xs relative">
              <span className="text-5xl font-extrabold text-emerald-200 block mb-4">02</span>
              <h3 className="text-xl font-bold text-stone-900 mb-2">Log transactions fast</h3>
              <p className="text-sm text-stone-600 leading-relaxed">
                Quickly add transactions as you spend or record money lent to friends with clean category tagging.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-white p-8 rounded-2xl border border-stone-200/80 shadow-xs relative">
              <span className="text-5xl font-extrabold text-indigo-200 block mb-4">03</span>
              <h3 className="text-xl font-bold text-stone-900 mb-2">Receive AI guidance</h3>
              <p className="text-sm text-stone-600 leading-relaxed">
                View your remaining budget, track your investment progress, and get gentle AI nudges when spending spikes.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* 5. Early Access / Prototype Banner Section */}
      <section id="early-access" className="py-12 md:py-16 bg-white border-t border-stone-200/60 scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-stone-900 to-stone-800 text-white rounded-3xl p-8 sm:p-12 shadow-xl text-center relative overflow-hidden">
            
            {/* Ambient Background Accents */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="max-w-2xl mx-auto space-y-6 relative z-10">
              {/* Badges */}
              <div className="inline-flex flex-wrap items-center justify-center gap-3 px-4 py-2 rounded-full bg-white/10 border border-white/15 text-xs font-semibold text-emerald-300">
                <span className="flex items-center gap-1.5">
                  <Rocket className="w-3.5 h-3.5 text-emerald-400" />
                  <span>🚀 Early Access</span>
                </span>
                <span>•</span>
                <span className="flex items-center gap-1.5">
                  <FlaskConical className="w-3.5 h-3.5 text-emerald-400" />
                  <span>🧪 Prototype</span>
                </span>
                <span>•</span>
                <span className="flex items-center gap-1.5">
                  <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
                  <span>💬 We&apos;d love your feedback</span>
                </span>
              </div>

              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
                Built for people who want to understand their money.
              </h2>

              <p className="text-stone-300 text-base leading-relaxed">
                MoneyFlow is currently in early access prototype testing. Try it out, explore the budget features, and help us shape the future of personal finance tracking!
              </p>

              <div className="pt-4">
                <Link
                  href={isLoggedIn ? "/dashboard" : "/signup"}
                  className="inline-flex items-center justify-center px-8 py-4 rounded-full bg-emerald-500 text-stone-950 font-bold text-base hover:bg-emerald-400 transition-all shadow-lg hover:shadow-emerald-500/20"
                >
                  {isLoggedIn ? "Go to Dashboard" : "Try Early Access Prototype"}
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 6. Footer */}
      <footer className="bg-[#fafaf9] py-12 border-t border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            
            {/* Logo & Tagline */}
            <div className="flex flex-col items-center md:items-start gap-2">
              <Link href="/" onClick={scrollToTop} className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-stone-900 flex items-center justify-center text-white font-bold text-xs">
                  <Wallet className="w-3.5 h-3.5 text-white" />
                </div>
                <span className="text-xl font-bold tracking-tight text-stone-900 font-sans">
                  Money<span className="text-emerald-500">Flow</span>
                </span>
              </Link>
              <p className="text-xs text-stone-500">
                Built for people who want to understand their money.
              </p>
            </div>

            {/* Copyright */}
            <div className="text-xs text-stone-400">
              © {new Date().getFullYear()} MoneyFlow. All rights reserved.
            </div>

          </div>
        </div>
      </footer>
    </div>
  );
}
