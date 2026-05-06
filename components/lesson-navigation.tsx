import Link from "next/link"

type LessonNavigationProps = {
  courseId: string
  prevLesson: { id: string; title: string } | null
  nextLesson: { id: string; title: string } | null
}

export function LessonNavigation({
  courseId,
  prevLesson,
  nextLesson,
}: LessonNavigationProps) {
  return (
    <div className="mt-5 flex items-center justify-between gap-4">
      {prevLesson ? (
        <Link
          href={`/courses/${courseId}/lessons/${prevLesson.id}`}
          className="flex items-center gap-2 rounded-md border border-[var(--color-border)] px-4 py-2.5 text-sm font-medium text-[var(--color-foreground)] hover:bg-[var(--color-surface)] transition-colors"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          前のレッスン
        </Link>
      ) : (
        <div />
      )}
      {nextLesson ? (
        <Link
          href={`/courses/${courseId}/lessons/${nextLesson.id}`}
          className="flex items-center gap-2 rounded-md bg-[var(--color-primary)] px-4 py-2.5 text-sm font-medium text-white hover:bg-[var(--color-primary-hover)] transition-colors"
        >
          次のレッスン
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      ) : (
        <div />
      )}
    </div>
  )
}
