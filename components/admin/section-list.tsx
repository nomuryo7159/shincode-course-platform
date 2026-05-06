"use client"

import { useState, useTransition, useRef } from "react"
import {
  createSection,
  updateSection,
  deleteSection,
  moveSectionUp,
  moveSectionDown,
} from "@/app/actions/sections"
import { AdminLessonList } from "./lesson-list"

type Lesson = {
  id: string
  title: string
  youtube_id: string
  description: string | null
  position: number
}

type Section = {
  id: string
  title: string
  position: number
  lessons: Lesson[]
}

type AdminSectionListProps = {
  courseId: string
  sections: Section[]
}

export function AdminSectionList({ courseId, sections }: AdminSectionListProps) {
  const [isPending, startTransition] = useTransition()
  const formRef = useRef<HTMLFormElement>(null)

  const handleCreate = (formData: FormData) => {
    startTransition(async () => {
      await createSection(courseId, formData)
      formRef.current?.reset()
    })
  }

  const handleDelete = (sectionId: string, title: string) => {
    if (!window.confirm(`「${title}」を削除しますか？\n配下のレッスンもすべて削除されます。`)) {
      return
    }
    startTransition(async () => {
      await deleteSection(courseId, sectionId)
    })
  }

  const handleMoveUp = (sectionId: string) => {
    startTransition(async () => {
      await moveSectionUp(courseId, sectionId)
    })
  }

  const handleMoveDown = (sectionId: string) => {
    startTransition(async () => {
      await moveSectionDown(courseId, sectionId)
    })
  }

  return (
    <div className="space-y-4">
      {/* Section heading */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-[var(--color-foreground)]">
          カリキュラム構成
        </h2>
        <span className="text-xs text-[var(--color-muted)]">
          {sections.length} セクション
        </span>
      </div>

      {/* Sections */}
      {sections.length === 0 && (
        <div className="rounded-lg border-2 border-dashed border-[var(--color-border)] py-12 text-center">
          <svg className="mx-auto h-10 w-10 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          <p className="mt-2 text-sm font-medium text-[var(--color-muted)]">
            セクションがありません
          </p>
          <p className="text-xs text-[var(--color-muted)]">
            下のフォームからセクションを追加してください
          </p>
        </div>
      )}

      {sections.map((section, idx) => (
        <SectionItem
          key={section.id}
          section={section}
          courseId={courseId}
          index={idx}
          isFirst={idx === 0}
          isLast={idx === sections.length - 1}
          isPending={isPending}
          onDelete={() => handleDelete(section.id, section.title)}
          onMoveUp={() => handleMoveUp(section.id)}
          onMoveDown={() => handleMoveDown(section.id)}
        />
      ))}

      {/* Add section form */}
      <div className="rounded-lg border-2 border-dashed border-[var(--color-border)] bg-[var(--color-surface)] p-4">
        <p className="mb-3 text-sm font-bold text-[var(--color-foreground)]">
          + 新しいセクションを追加
        </p>
        <form ref={formRef} action={handleCreate} className="flex gap-2">
          <input
            name="title"
            type="text"
            placeholder="例: 第4章: デプロイと公開"
            required
            className="flex-1 rounded-md border border-[var(--color-border)] bg-white px-3 py-2 text-sm focus:border-[var(--color-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]"
          />
          <button
            type="submit"
            disabled={isPending}
            className="rounded-md bg-[var(--color-primary)] px-5 py-2 text-sm font-bold text-white hover:bg-[var(--color-primary-hover)] transition-colors disabled:opacity-50 cursor-pointer"
          >
            追加
          </button>
        </form>
      </div>
    </div>
  )
}

function SectionItem({
  section,
  courseId,
  index,
  isFirst,
  isLast,
  isPending,
  onDelete,
  onMoveUp,
  onMoveDown,
}: {
  section: Section
  courseId: string
  index: number
  isFirst: boolean
  isLast: boolean
  isPending: boolean
  onDelete: () => void
  onMoveUp: () => void
  onMoveDown: () => void
}) {
  const [editMode, setEditMode] = useState(false)
  const [expanded, setExpanded] = useState(true)

  return (
    <div className="overflow-hidden rounded-lg border border-[var(--color-border)] bg-white shadow-sm">
      {/* Section header */}
      <div className="flex items-center gap-3 border-b border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3">
        {/* Expand/collapse toggle */}
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-[var(--color-muted)] hover:text-[var(--color-foreground)] cursor-pointer"
        >
          <svg
            className={`h-4 w-4 transition-transform ${expanded ? "rotate-90" : ""}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>

        {/* Section number badge */}
        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded bg-[var(--color-primary)] text-xs font-bold text-white">
          {index + 1}
        </span>

        {/* Title or edit form */}
        <div className="flex-1 min-w-0">
          {editMode ? (
            <EditSectionForm
              courseId={courseId}
              sectionId={section.id}
              currentTitle={section.title}
              onDone={() => setEditMode(false)}
            />
          ) : (
            <span className="font-semibold text-[var(--color-foreground)] truncate block">
              {section.title}
            </span>
          )}
        </div>

        {/* Lesson count */}
        <span className="shrink-0 text-xs text-[var(--color-muted)]">
          {section.lessons.length} レッスン
        </span>

        {/* Actions */}
        <div className="flex shrink-0 items-center gap-0.5 border-l border-[var(--color-border)] pl-3">
          {!isFirst && (
            <button
              onClick={onMoveUp}
              disabled={isPending}
              title="上に移動"
              className="rounded p-1.5 text-[var(--color-muted)] hover:bg-white hover:text-[var(--color-foreground)] disabled:opacity-30 cursor-pointer"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
              </svg>
            </button>
          )}
          {!isLast && (
            <button
              onClick={onMoveDown}
              disabled={isPending}
              title="下に移動"
              className="rounded p-1.5 text-[var(--color-muted)] hover:bg-white hover:text-[var(--color-foreground)] disabled:opacity-30 cursor-pointer"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          )}
          {!editMode && (
            <button
              onClick={() => setEditMode(true)}
              title="セクション名を編集"
              className="rounded p-1.5 text-[var(--color-muted)] hover:bg-white hover:text-blue-600 cursor-pointer"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
          )}
          <button
            onClick={onDelete}
            disabled={isPending}
            title="セクションを削除"
            className="rounded p-1.5 text-[var(--color-muted)] hover:bg-white hover:text-red-600 disabled:opacity-30 cursor-pointer"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>

      {/* Section content (lessons) */}
      {expanded && (
        <div className="p-4">
          <AdminLessonList
            courseId={courseId}
            sectionId={section.id}
            lessons={section.lessons.sort((a, b) => a.position - b.position)}
          />
        </div>
      )}
    </div>
  )
}

function EditSectionForm({
  courseId,
  sectionId,
  currentTitle,
  onDone,
}: {
  courseId: string
  sectionId: string
  currentTitle: string
  onDone: () => void
}) {
  const [isPending, startTransition] = useTransition()

  const handleSubmit = (formData: FormData) => {
    startTransition(async () => {
      await updateSection(courseId, sectionId, formData)
      onDone()
    })
  }

  return (
    <form action={handleSubmit} className="flex items-center gap-2">
      <input
        name="title"
        type="text"
        defaultValue={currentTitle}
        required
        autoFocus
        className="rounded-md border border-[var(--color-border)] px-2 py-1 text-sm font-semibold focus:border-[var(--color-primary)] focus:outline-none"
      />
      <button
        type="submit"
        disabled={isPending}
        className="rounded px-2 py-1 text-xs font-bold text-[var(--color-primary)] hover:bg-[var(--color-primary-light)] disabled:opacity-50 cursor-pointer"
      >
        保存
      </button>
      <button
        type="button"
        onClick={onDone}
        className="rounded px-2 py-1 text-xs text-[var(--color-muted)] hover:bg-[var(--color-surface)] cursor-pointer"
      >
        取消
      </button>
    </form>
  )
}
