import { cache } from "react";
import { createClient } from "@/lib/supabase/server";

/**
 * Request-scoped cached auth check.
 * Returns user and profile role, or null if not authenticated.
 * Safe to call multiple times per request without extra DB queries.
 */
export const getCurrentUser = cache(async () => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { user: null, isAdmin: false };
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  return { user, isAdmin: profile?.role === "admin" };
});

/**
 * Verify the current user is authenticated and has admin role.
 * Returns the supabase client and user if authorized.
 * Throws an error if not authenticated or not admin.
 */
export async function requireAdmin() {
  const supabase = await createClient();
  const { user, isAdmin } = await getCurrentUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  if (!isAdmin) {
    throw new Error("Forbidden");
  }

  return { supabase, user };
}
