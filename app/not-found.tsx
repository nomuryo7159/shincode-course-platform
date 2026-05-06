import Link from "next/link"

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-6xl font-extrabold text-[var(--color-primary)]">404</h1>
        <h2 className="mt-3 text-xl font-bold text-[var(--color-foreground)]">
          ページが見つかりません
        </h2>
        <p className="mt-2 text-sm text-[var(--color-muted)]">
          お探しのページは存在しないか、移動された可能性があります。
        </p>
        <Link
          href="/"
          className="mt-6 inline-block rounded-md bg-[var(--color-primary)] px-5 py-2.5 text-sm font-bold text-white hover:bg-[var(--color-primary-hover)] transition-colors"
        >
          トップページに戻る
        </Link>
      </div>
    </div>
  )
}
