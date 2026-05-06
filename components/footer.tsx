import Link from "next/link"

export function Footer() {
  return (
    <footer className="border-t border-[var(--color-border)] bg-[var(--color-foreground)]">
      <div className="mx-auto max-w-[1340px] px-6 py-10">
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
          <div>
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-md bg-[var(--color-primary)]">
                <span className="text-xs font-bold text-white">C</span>
              </div>
              <span className="text-base font-extrabold text-white">
                Vibe Coding Platform
              </span>
            </Link>
            <p className="mt-2 text-sm text-gray-400">
              オンライン動画学習プラットフォーム
            </p>
          </div>
          <p className="text-xs text-gray-500">
            &copy; {new Date().getFullYear()} CourseHub. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
