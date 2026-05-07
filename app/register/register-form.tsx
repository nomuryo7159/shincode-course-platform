"use client";

import { useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";

export function RegisterForm() {
  const searchParams = useSearchParams();
  const next = searchParams.get("next") || "/";

  const handleRegister = async () => {
    const supabase = createClient();
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`,
      },
    });
  };

  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="rounded-xl border border-[var(--color-border)] bg-white p-8 shadow-sm">
          <div className="mb-6 text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--color-primary)]">
              <span className="text-lg font-bold text-white">C</span>
            </div>
            <h1 className="text-xl font-extrabold text-[var(--color-foreground)]">
              新規登録
            </h1>
            <p className="mt-1 text-sm text-[var(--color-muted)]">
              アカウントを作成して学習を始めましょう
            </p>
          </div>

          <button
            onClick={handleRegister}
            className="flex w-full items-center justify-center gap-3 rounded-md border-2 border-[var(--color-border)] bg-white px-4 py-3 text-sm font-bold text-[var(--color-foreground)] hover:bg-[var(--color-surface)] hover:border-[var(--color-muted)] transition-colors cursor-pointer"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            Googleで新規登録
          </button>

          <p className="mt-6 text-center text-xs text-[var(--color-muted)]">
            登録すると、すべての動画レッスンにアクセスできます
          </p>

          <p className="mt-4 text-center text-sm text-[var(--color-muted)]">
            すでにアカウントをお持ちですか？{" "}
            <Link
              href="/login"
              className="font-bold text-[var(--color-primary)] hover:underline"
            >
              ログイン
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
