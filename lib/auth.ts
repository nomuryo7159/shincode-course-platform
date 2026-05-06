import { createClient } from "@/lib/supabase/server"

/**
 * Verify the current user is authenticated and has admin role.
 * Returns the supabase client and user if authorized.
 * Throws an error if not authenticated or not admin.
 */
export async function requireAdmin() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error("Unauthorized")
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single()

  if (profile?.role !== "admin") {
    throw new Error("Forbidden")
  }

  return { supabase, user }
}
