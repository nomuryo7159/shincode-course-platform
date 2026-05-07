import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { UserMenu } from "./user-menu";

export async function Header() {
  const { user, isAdmin } = await getCurrentUser();

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--color-border)] bg-white shadow-sm">
      <div className="mx-auto flex h-[4.25rem] max-w-[1340px] items-center justify-between px-6">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-[var(--color-primary)]">
              <span className="text-sm font-bold text-white">C</span>
            </div>
            <span className="text-lg font-extrabold tracking-tight text-[var(--color-foreground)]">
              Vibe Coding Platform
            </span>
          </Link>
          <nav className="hidden items-center gap-1 md:flex">
            <Link
              href="/"
              className="rounded-md px-3 py-2 text-sm font-medium text-[var(--color-muted)] hover:text-[var(--color-foreground)] hover:bg-[var(--color-surface)] transition-colors"
            >
              講座を探す
            </Link>
            {isAdmin && (
              <Link
                href="/admin"
                className="rounded-md px-3 py-2 text-sm font-medium text-[var(--color-muted)] hover:text-[var(--color-foreground)] hover:bg-[var(--color-surface)] transition-colors"
              >
                管理画面
              </Link>
            )}
          </nav>
        </div>

        <div className="flex items-center gap-3">
          {user ? (
            <UserMenu
              email={user.email ?? ""}
              avatarUrl={user.user_metadata?.avatar_url}
            />
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="rounded-md border border-[var(--color-foreground)] px-4 py-2 text-sm font-bold text-[var(--color-foreground)] hover:bg-[var(--color-surface)] transition-colors"
              >
                ログイン
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
