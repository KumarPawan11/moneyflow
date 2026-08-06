import { User } from "@supabase/supabase-js";

export function getDisplayName(user: User | null | undefined): string {
  if (!user) return "Guest";
  
  const fullName = user.user_metadata?.full_name;
  if (fullName && typeof fullName === "string" && fullName.trim().length > 0) {
    return fullName.trim();
  }

  if (user.email) {
    const emailName = user.email.split("@")[0];
    return emailName.charAt(0).toUpperCase() + emailName.slice(1);
  }

  return "User";
}
