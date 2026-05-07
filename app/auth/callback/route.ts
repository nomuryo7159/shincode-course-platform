import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/";

  // Prevent open redirect: decode and validate that the path is a safe relative path
  const decoded = decodeURIComponent(next);
  const safeNext =
    decoded.startsWith("/") &&
    !decoded.startsWith("//") &&
    !decoded.startsWith("/\\")
      ? decoded
      : "/";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(`${origin}${safeNext}`);
    }
  }

  // Auth error - redirect to login
  return NextResponse.redirect(`${origin}/login`);
}
