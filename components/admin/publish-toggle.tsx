"use client"

import { useTransition } from "react"
import { toggleCoursePublish } from "@/app/actions/courses"

type PublishToggleProps = {
  courseId: string
  isPublished: boolean
}

export function PublishToggle({ courseId, isPublished }: PublishToggleProps) {
  const [isPending, startTransition] = useTransition()

  const handleToggle = () => {
    startTransition(async () => {
      await toggleCoursePublish(courseId, !isPublished)
    })
  }

  return (
    <button
      onClick={handleToggle}
      disabled={isPending}
      className={`rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors cursor-pointer disabled:opacity-50 ${
        isPublished
          ? "bg-green-100 text-green-700"
          : "bg-gray-100 text-gray-600"
      }`}
    >
      {isPublished ? "公開" : "非公開"}
    </button>
  )
}
