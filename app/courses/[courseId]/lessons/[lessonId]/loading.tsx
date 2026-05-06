export default function Loading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      <div className="lg:flex lg:gap-6">
        <div className="flex-1 min-w-0">
          <div className="aspect-video w-full animate-pulse rounded-lg bg-gray-200" />
          <div className="mt-4 h-7 w-64 animate-pulse rounded bg-gray-200" />
          <div className="mt-2 h-4 w-32 animate-pulse rounded bg-gray-200" />
        </div>
        <div className="mt-6 lg:mt-0 lg:w-80 lg:shrink-0">
          <div className="h-96 animate-pulse rounded-lg border bg-gray-100" />
        </div>
      </div>
    </div>
  )
}
