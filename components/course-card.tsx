import Link from "next/link"
import Image from "next/image"

type CourseCardProps = {
  id: string
  title: string
  description: string | null
  thumbnailUrl: string | null
  lessonCount: number
}

export function CourseCard({
  id,
  title,
  description,
  thumbnailUrl,
  lessonCount,
}: CourseCardProps) {
  return (
    <Link
      href={`/courses/${id}`}
      className="group flex flex-col overflow-hidden rounded-lg border border-[var(--color-border)] bg-white transition-all hover:shadow-lg hover:-translate-y-0.5"
    >
      <div className="relative aspect-video w-full overflow-hidden bg-gray-200">
        {thumbnailUrl ? (
          <Image
            src={thumbnailUrl}
            alt={title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1340px) 33vw, 25vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[var(--color-primary-light)] to-purple-100">
            <svg
              className="h-12 w-12 text-[var(--color-primary)] opacity-50"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col p-4">
        <h3 className="text-[0.95rem] font-bold leading-tight text-[var(--color-foreground)] line-clamp-2">
          {title}
        </h3>
        {description && (
          <p className="mt-1.5 text-xs leading-relaxed text-[var(--color-muted)] line-clamp-2">
            {description}
          </p>
        )}
        <div className="mt-auto pt-3">
          <div className="flex items-center gap-1.5 text-xs text-[var(--color-muted)]">
            <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{lessonCount} レッスン</span>
          </div>
        </div>
      </div>
    </Link>
  )
}
