"use client"

import { useState, useTransition, useRef } from "react"
import {
  createLesson,
  updateLesson,
  deleteLesson,
  moveLessonUp,
  moveLessonDown,
} from "@/app/actions/lessons"

type Lesson = {
  id: string
  title: string
  youtube_id: string
  description: string | null
  position: number
}

type AdminLessonListProps = {
  courseId: string
  sectionId: string
  lessons: Lesson[]
}

export function AdminLessonList({
  courseId,
  sectionId,
  lessons,
}: AdminLessonListProps) {
  const [isPending, startTransition] = useTransition()
  const [showForm, setShowForm] = useState(false)
  const formRef = useRef<HTMLFormElement>(null)

  const handleCreate = (formData: FormData) => {
    startTransition(async () => {
      const result = await createLesson(courseId, sectionId, formData)
      if (result?.success) {
        formRef.current?.reset()
        setShowForm(false)
      }
    })
  }

  const handleDelete = (lessonId: string, title: string) => {
    if (!window.confirm(`「${title}」を削除しますか？`)) return
    startTransition(async () => {
      await deleteLesson(courseId, lessonId)
    })
  }

  const handleMoveUp = (lessonId: string) => {
    startTransition(async () => {
      await moveLessonUp(courseId, sectionId, lessonId)
    })
  }

  const handleMoveDown = (lessonId: string) => {
    startTransition(async () => {
      await moveLessonDown(courseId, sectionId, lessonId)
    })
  }

  return (
    <div className="space-y-2">
      {lessons.length === 0 && !showForm && (
        <div className="rounded-md border border-dashed border-[var(--color-border)] py-6 text-center">
          <svg className="mx-auto h-6 w-6 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="mt-1 text-xs text-[var(--color-muted)]">レッスンがありません</p>
        </div>
      )}

      {lessons.map((lesson, idx) => (
        <LessonItem
          key={lesson.id}
          lesson={lesson}
          courseId={courseId}
          index={idx}
          isFirst={idx === 0}
          isLast={idx === lessons.length - 1}
          isPending={isPending}
          onDelete={() => handleDelete(lesson.id, lesson.title)}
          onMoveUp={() => handleMoveUp(lesson.id)}
          onMoveDown={() => handleMoveDown(lesson.id)}
        />
      ))}

      {showForm ? (
        <form ref={formRef} action={handleCreate} className="rounded-lg border border-[var(--color-primary)] bg-purple-50 p-4 space-y-3">
          <p className="text-sm font-bold text-[var(--color-primary)]">新しいレッスンを追加</p>
          <div className="grid gap-3 sm:grid-cols-2">
            <input
              name="title"
              type="text"
              placeholder="レッスンタイトル"
              required
              className="rounded-md border border-[var(--color-border)] bg-white px-3 py-2 text-sm focus:border-[var(--color-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]"
            />
            <input
              name="youtube_id"
              type="text"
              placeholder="YouTube動画ID (例: dQw4w9WgXcQ)"
              required
              className="rounded-md border border-[var(--color-border)] bg-white px-3 py-2 text-sm focus:border-[var(--color-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]"
            />
          </div>
          <input
            name="description"
            type="text"
            placeholder="説明文（任意）"
            className="w-full rounded-md border border-[var(--color-border)] bg-white px-3 py-2 text-sm focus:border-[var(--color-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]"
          />
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={isPending}
              className="rounded-md bg-[var(--color-primary)] px-4 py-2 text-sm font-bold text-white hover:bg-[var(--color-primary-hover)] disabled:opacity-50 cursor-pointer"
            >
              レッスンを追加
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="rounded-md border border-[var(--color-border)] px-4 py-2 text-sm hover:bg-[var(--color-surface)] cursor-pointer"
            >
              キャンセル
            </button>
          </div>
        </form>
      ) : (
        <button
          onClick={() => setShowForm(true)}
          className="inline-flex items-center gap-1.5 rounded-md border border-dashed border-[var(--color-border)] px-3 py-2 text-sm text-[var(--color-muted)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-colors cursor-pointer"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          レッスンを追加
        </button>
      )}
    </div>
  )
}

function LessonItem({
  lesson,
  courseId,
  index,
  isFirst,
  isLast,
  isPending,
  onDelete,
  onMoveUp,
  onMoveDown,
}: {
  lesson: Lesson
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
  const [isUpdating, startTransition] = useTransition()

  const handleUpdate = (formData: FormData) => {
    startTransition(async () => {
      await updateLesson(courseId, lesson.id, formData)
      setEditMode(false)
    })
  }

  if (editMode) {
    return (
      <form action={handleUpdate} className="rounded-lg border border-blue-300 bg-blue-50 p-4 space-y-3">
        <p className="text-sm font-bold text-blue-700">レッスンを編集</p>
        <div className="grid gap-3 sm:grid-cols-2">
          <input
            name="title"
            type="text"
            defaultValue={lesson.title}
            required
            className="rounded-md border border-[var(--color-border)] bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          <input
            name="youtube_id"
            type="text"
            defaultValue={lesson.youtube_id}
            required
            className="rounded-md border border-[var(--color-border)] bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
        <input
          name="description"
          type="text"
          defaultValue={lesson.description ?? ""}
          placeholder="説明文（任意）"
          className="w-full rounded-md border border-[var(--color-border)] bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
        <div className="flex gap-2">
          <button
            type="submit"
            disabled={isUpdating}
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-bold text-white hover:bg-blue-700 disabled:opacity-50 cursor-pointer"
          >
            保存
          </button>
          <button
            type="button"
            onClick={() => setEditMode(false)}
            className="rounded-md border border-[var(--color-border)] px-4 py-2 text-sm hover:bg-[var(--color-surface)] cursor-pointer"
          >
            キャンセル
          </button>
        </div>
      </form>
    )
  }

  return (
    <div className="group flex items-center gap-3 rounded-md border border-[var(--color-border)] bg-white px-3 py-2.5 hover:border-[var(--color-primary)] hover:shadow-sm transition-all">
      {/* Lesson number */}
      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gray-100 text-xs font-bold text-[var(--color-muted)]">
        {index + 1}
      </span>

      {/* Play icon */}
      <svg className="h-4 w-4 shrink-0 text-[var(--color-muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>

      {/* Title & meta */}
      <div className="flex-1 min-w-0">
        <p className="truncate text-sm font-medium text-[var(--color-foreground)]">
          {lesson.title}
        </p>
        <p className="text-xs text-[var(--color-muted)]">
          ID: {lesson.youtube_id}
        </p>
      </div>

      {/* Actions (visible on hover) */}
      <div className="flex shrink-0 items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
        {!isFirst && (
          <button
            onClick={onMoveUp}
            disabled={isPending}
            title="上に移動"
            className="rounded p-1 text-[var(--color-muted)] hover:bg-[var(--color-surface)] hover:text-[var(--color-foreground)] disabled:opacity-30 cursor-pointer"
          >
            <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
            </svg>
          </button>
        )}
        {!isLast && (
          <button
            onClick={onMoveDown}
            disabled={isPending}
            title="下に移動"
            className="rounded p-1 text-[var(--color-muted)] hover:bg-[var(--color-surface)] hover:text-[var(--color-foreground)] disabled:opacity-30 cursor-pointer"
          >
            <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        )}
        <button
          onClick={() => setEditMode(true)}
          title="編集"
          className="rounded p-1 text-[var(--color-muted)] hover:bg-[var(--color-surface)] hover:text-blue-600 cursor-pointer"
        >
          <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        </button>
        <button
          onClick={onDelete}
          disabled={isPending}
          title="削除"
          className="rounded p-1 text-[var(--color-muted)] hover:bg-[var(--color-surface)] hover:text-red-600 disabled:opacity-30 cursor-pointer"
        >
          <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    </div>
  )
}
