import React from "react";
import { getCurrentUser } from "@/lib/supabase/server";
import { LandingPage } from "@/components/LandingPage";

export default async function Home() {
  const { user } = await getCurrentUser();

  return <LandingPage isLoggedIn={!!user} />;
}