import Link from "next/link"

type Section = {
  id: string
  title: string
  lessons: { id: string; title: string }[]
}

type LessonSidebarProps = {
  sections: Section[]
  courseId: string
  currentLessonId: string
}

export function LessonSidebar({
  sections,
  courseId,
  currentLessonId,
}: LessonSidebarProps) {
  let lessonIndex = 0

  return (
    <div className="h-full">
      <div className="sticky top-[4.25rem] max-h-[calc(100vh-4.25rem)] overflow-y-auto">
        <div className="border-b border-[var(--color-border)] bg-white px-4 py-3">
          <h2 className="text-sm font-bold text-[var(--color-foreground)]">
            コース内容
          </h2>
        </div>
        <div>
          {sections.map((section) => (
            <div key={section.id}>
              <div className="bg-[var(--color-surface)] px-4 py-2.5 border-b border-[var(--color-border)]">
                <p className="text-xs font-bold uppercase tracking-wide text-[var(--color-muted)]">
                  {section.title}
                </p>
              </div>
              <ul>
                {section.lessons.map((lesson) => {
                  lessonIndex++
                  const isCurrent = lesson.id === currentLessonId
                  return (
                    <li key={lesson.id}>
                      <Link
                        href={`/courses/${courseId}/lessons/${lesson.id}`}
                        className={`flex items-center gap-3 border-b border-[var(--color-border)] px-4 py-3 text-sm transition-colors ${
                          isCurrent
                            ? "bg-[var(--color-primary-light)] border-l-4 border-l-[var(--color-primary)]"
                            : "hover:bg-[var(--color-surface)]"
                        }`}
                      >
                        <span
                          className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-medium ${
                            isCurrent
                              ? "bg-[var(--color-primary)] text-white"
                              : "bg-gray-200 text-[var(--color-muted)]"
                          }`}
                        >
                          {lessonIndex}
                        </span>
                        <span
                          className={`line-clamp-2 ${
                            isCurrent
                              ? "font-bold text-[var(--color-primary)]"
                              : "text-[var(--color-foreground)]"
                          }`}
                        >
                          {lesson.title}
                        </span>
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
