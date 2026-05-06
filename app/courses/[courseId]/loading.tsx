export default function Loading() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <div className="h-9 w-64 animate-pulse rounded bg-gray-200" />
      <div className="mt-3 h-5 w-full max-w-lg animate-pulse rounded bg-gray-200" />
      <div className="mt-6 h-10 w-40 animate-pulse rounded bg-gray-200" />
      <div className="mt-8 space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="rounded-lg border bg-white p-4">
            <div className="h-5 w-48 animate-pulse rounded bg-gray-200" />
            <div className="mt-3 space-y-2">
              {Array.from({ length: 3 }).map((_, j) => (
                <div
                  key={j}
                  className="h-4 w-full animate-pulse rounded bg-gray-100"
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
