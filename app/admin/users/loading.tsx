export default function Loading() {
  return (
    <div>
      <div className="h-8 w-40 animate-pulse rounded bg-gray-200" />
      <div className="mt-6 space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-12 w-full animate-pulse rounded bg-gray-100" />
        ))}
      </div>
    </div>
  )
}
