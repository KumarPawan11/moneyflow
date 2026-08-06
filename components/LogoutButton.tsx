"use client";

import React, { useTransition } from "react";
import { LogOut, Loader2 } from "lucide-react";
import { logout } from "@/app/auth/actions";

export function LogoutButton() {
  const [isPending, startTransition] = useTransition();

  const handleLogout = () => {
    startTransition(async () => {
      await logout();
    });
  };

  return (
    <button
      onClick={handleLogout}
      disabled={isPending}
      className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 font-medium text-sm border border-red-200/80 transition-colors disabled:opacity-50 cursor-pointer shadow-xs"
      title="Sign out of your account"
    >
      {isPending ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin text-red-600" />
          <span>Signing out...</span>
        </>
      ) : (
        <>
          <LogOut className="w-4 h-4 text-red-600" />
          <span>Sign out of account</span>
        </>
      )}
    </button>
  );
}
