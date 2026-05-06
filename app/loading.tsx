export default function Loading() {
  return (
    <div className="mx-auto max-w-[1340px] px-6 py-12">
      {/* Hero skeleton */}
      <div className="mb-12 h-48 animate-pulse rounded-2xl bg-gray-200" />

      {/* Title skeleton */}
      <div className="mb-6">
        <div className="h-7 w-40 animate-pulse rounded bg-gray-200" />
        <div className="mt-2 h-4 w-56 animate-pulse rounded bg-gray-200" />
      </div>

      {/* Cards grid skeleton */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="overflow-hidden rounded-lg border border-[var(--color-border)] bg-white"
          >
            <div className="aspect-video w-full animate-pulse bg-gray-200" />
            <div className="space-y-2.5 p-4">
              <div className="h-4 w-3/4 animate-pulse rounded bg-gray-200" />
              <div className="h-3 w-full animate-pulse rounded bg-gray-100" />
              <div className="h-3 w-24 animate-pulse rounded bg-gray-100" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
