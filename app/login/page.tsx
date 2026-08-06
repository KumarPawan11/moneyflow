"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { login } from "@/app/auth/actions";
import { Wallet, ArrowRight, AlertCircle, CheckCircle2, Loader2, Eye, EyeOff } from "lucide-react";

function LoginForm() {
  const searchParams = useSearchParams();
  const queryMessage = searchParams.get("message");
  const queryError = searchParams.get("error");

  const [error, setError] = useState<string | null>(queryError);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData(event.currentTarget);
    const res = await login(formData);

    if (res?.error) {
      setError(res.error);
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-md space-y-8 bg-white p-8 sm:p-10 rounded-2xl shadow-xl shadow-stone-200/50 border border-stone-200/80 transition-all">
      {/* App Logo & Title Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-stone-900 text-white shadow-md shadow-stone-900/10 mb-2">
          <Wallet className="w-7 h-7" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-stone-900">
          Welcome back
        </h1>
        <p className="text-sm text-stone-500 font-medium">
          Sign in to manage your money with money<span className="text-emerald-500 font-semibold">flow</span>.
        </p>
      </div>

      {/* Success Message Alert */}
      {queryMessage && (
        <div className="flex items-center gap-3 p-4 rounded-xl bg-emerald-50 text-emerald-800 text-sm font-medium border border-emerald-200/80 animate-in fade-in slide-in-from-top-1">
          <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-600" />
          <span>{queryMessage}</span>
        </div>
      )}

      {/* Error Alert */}
      {error && (
        <div className="flex items-center gap-3 p-4 rounded-xl bg-red-50 text-red-700 text-sm font-medium border border-red-200/80 animate-in fade-in slide-in-from-top-1">
          <AlertCircle className="w-5 h-5 shrink-0 text-red-600" />
          <span>{error}</span>
        </div>
      )}

      {/* Login Form */}
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label
            htmlFor="email"
            className="block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-2"
          >
            Email Address
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder="you@example.com"
            className="w-full px-4 py-3 rounded-xl border border-stone-200 bg-stone-50/50 text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-stone-900 focus:bg-white transition-all placeholder:text-stone-400"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label
              htmlFor="password"
              className="block text-xs font-semibold uppercase tracking-wider text-stone-600"
            >
              Password
            </label>
            <Link
              href="/forgot-password"
              className="text-xs font-semibold text-stone-600 hover:text-stone-900 underline underline-offset-2 transition-colors"
            >
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              required
              autoComplete="current-password"
              placeholder="••••••••"
              className="w-full pl-4 pr-11 py-3 rounded-xl border border-stone-200 bg-stone-50/50 text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-stone-900 focus:bg-white transition-all placeholder:text-stone-400"
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-0 top-0 bottom-0 px-3.5 flex items-center justify-center text-stone-400 hover:text-stone-700 active:text-stone-900 transition-colors focus:outline-none rounded-r-xl cursor-pointer"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 px-4 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-medium text-sm flex items-center justify-center gap-2 shadow-lg shadow-stone-900/10 hover:shadow-stone-900/20 active:scale-[0.99] transition-all disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Signing in...
            </>
          ) : (
            <>
              Sign in
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>

      {/* Toggle to Signup */}
      <div className="text-center pt-2 border-t border-stone-100">
        <p className="text-sm text-stone-500 font-medium">
          Don&apos;t have an account?{" "}
          <Link
            href="/signup"
            className="font-semibold text-stone-900 hover:underline underline-offset-4"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fafaf9] px-4 py-12 text-stone-900 font-sans">
      <Suspense fallback={<div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-xl border border-stone-200" />}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
