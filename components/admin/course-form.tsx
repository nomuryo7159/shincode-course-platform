"use client"

import { useActionState } from "react"
import { createCourse, updateCourse } from "@/app/actions/courses"
import type { Course } from "@/types"

type CourseFormProps = {
  course?: Course
}

export function CourseForm({ course }: CourseFormProps) {
  const action = course
    ? (_state: { error?: string } | null, formData: FormData) =>
        updateCourse(course.id, formData)
    : (_state: { error?: string } | null, formData: FormData) =>
        createCourse(formData)

  const [state, formAction, pending] = useActionState(action, null)

  return (
    <form action={formAction} className="max-w-lg space-y-4">
      {state?.error && (
        <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-600">
          {state.error}
        </p>
      )}

      <div>
        <label htmlFor="title" className="block text-sm font-medium">
          タイトル <span className="text-red-500">*</span>
        </label>
        <input
          id="title"
          name="title"
          type="text"
          defaultValue={course?.title ?? ""}
          required
          className="mt-1 w-full rounded-md border px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium">
          説明文
        </label>
        <textarea
          id="description"
          name="description"
          rows={4}
          defaultValue={course?.description ?? ""}
          className="mt-1 w-full rounded-md border px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>

      <div>
        <label htmlFor="thumbnail_url" className="block text-sm font-medium">
          サムネイル URL
        </label>
        <input
          id="thumbnail_url"
          name="thumbnail_url"
          type="url"
          defaultValue={course?.thumbnail_url ?? ""}
          className="mt-1 w-full rounded-md border px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>

      <div className="flex items-center gap-2">
        <input
          id="is_published"
          name="is_published"
          type="checkbox"
          value="true"
          defaultChecked={course?.is_published ?? false}
          className="h-4 w-4 rounded border-gray-300"
        />
        <label htmlFor="is_published" className="text-sm font-medium">
          公開する
        </label>
      </div>

      <button
        type="submit"
        disabled={pending}
        className="rounded-md bg-gray-900 px-4 py-2 text-sm text-white hover:bg-gray-700 transition-colors disabled:opacity-50 cursor-pointer"
      >
        {pending ? "保存中..." : course ? "更新する" : "作成する"}
      </button>
    </form>
  )
}
