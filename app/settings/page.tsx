import React from "react";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/supabase/server";
import { getDisplayName } from "@/lib/utils";
import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";
import { LogoutButton } from "@/components/LogoutButton";
import { User, Mail } from "lucide-react";

export default async function SettingsPage() {
  const { user } = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const userName = getDisplayName(user);

  return (
    <div className="flex flex-col min-h-screen bg-[#fafaf9] text-stone-900 font-sans antialiased">
      <Sidebar userName={userName} userEmail={user.email} />

      <main className="flex-1 p-4 sm:p-6 lg:p-10 max-w-7xl w-full mx-auto overflow-y-auto">
        <Header userName={userName} userEmail={user.email} showActions={false} />

        <div className="mb-6">
          <h2 className="text-xl font-bold text-stone-900 tracking-tight">Account Settings</h2>
          <p className="text-sm text-stone-500 font-medium">Manage your personal profile and account details</p>
        </div>

        <div className="max-w-2xl bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-stone-200/80 space-y-6">
          <div className="flex items-center gap-4 pb-6 border-b border-stone-100">
            <div className="w-14 h-14 rounded-2xl bg-stone-900 text-white font-bold text-xl flex items-center justify-center shadow-md">
              {userName.charAt(0).toUpperCase()}
            </div>
            <div>
              <h3 className="text-lg font-bold text-stone-900">{userName}</h3>
              <p className="text-sm text-stone-500 font-medium">{user.email}</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-xl bg-stone-50 border border-stone-100">
              <div className="flex items-center gap-3">
                <User className="w-5 h-5 text-stone-500" />
                <div>
                  <p className="text-xs text-stone-400 font-medium">Display Name</p>
                  <p className="text-sm font-semibold text-stone-800">{userName}</p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 rounded-xl bg-stone-50 border border-stone-100">
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-stone-500" />
                <div>
                  <p className="text-xs text-stone-400 font-medium">Email Address</p>
                  <p className="text-sm font-semibold text-stone-800">{user.email}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Account Management & Logout Section */}
          <div className="pt-6 border-t border-stone-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h4 className="text-sm font-bold text-stone-900">Account Session</h4>
              <p className="text-xs text-stone-500 font-medium mt-0.5">
                Sign out of your active session on this device
              </p>
            </div>
            <LogoutButton />
          </div>
        </div>
      </main>
    </div>
  );
}
