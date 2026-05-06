"use client"

import { useState } from "react"
import Link from "next/link"

type SectionAccordionProps = {
  title: string
  lessons: { id: string; title: string }[]
  courseId: string
  completedLessonIds: string[]
}

export function SectionAccordion({
  title,
  lessons,
  courseId,
  completedLessonIds,
}: SectionAccordionProps) {
  const [open, setOpen] = useState(true)
  const completedInSection = lessons.filter((l) =>
    completedLessonIds.includes(l.id)
  ).length

  return (
    <div>
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between bg-[var(--color-surface)] px-5 py-3.5 text-left hover:bg-gray-100 transition-colors cursor-pointer"
      >
        <div className="flex items-center gap-3">
          <svg
            className={`h-4 w-4 text-[var(--color-muted)] transition-transform ${open ? "rotate-90" : ""}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          <span className="text-sm font-bold text-[var(--color-foreground)]">
            {title}
          </span>
        </div>
        <span className="text-xs text-[var(--color-muted)]">
          {completedInSection}/{lessons.length} 完了
        </span>
      </button>
      {open && (
        <ul>
          {lessons.map((lesson, idx) => {
            const isCompleted = completedLessonIds.includes(lesson.id)
            return (
              <li key={lesson.id}>
                <Link
                  href={`/courses/${courseId}/lessons/${lesson.id}`}
                  className="flex items-center gap-3 border-t border-[var(--color-border)] px-5 py-3 text-sm hover:bg-[var(--color-surface)] transition-colors"
                >
                  {isCompleted ? (
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[var(--color-primary)] text-[10px] text-white">
                      ✓
                    </span>
                  ) : (
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 border-[var(--color-border)] text-[10px] text-[var(--color-muted)]">
                      {idx + 1}
                    </span>
                  )}
                  <span
                    className={
                      isCompleted
                        ? "text-[var(--color-muted)]"
                        : "text-[var(--color-foreground)]"
                    }
                  >
                    {lesson.title}
                  </span>
                </Link>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
