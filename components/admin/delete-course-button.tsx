"use client"

import { useTransition } from "react"
import { deleteCourse } from "@/app/actions/courses"

type DeleteCourseButtonProps = {
  courseId: string
  courseTitle: string
}

export function DeleteCourseButton({
  courseId,
  courseTitle,
}: DeleteCourseButtonProps) {
  const [isPending, startTransition] = useTransition()

  const handleDelete = () => {
    const confirmed = window.confirm(
      `「${courseTitle}」を削除しますか？\n\n関連するセクション・動画もすべて削除されます。この操作は取り消せません。`
    )
    if (!confirmed) return

    startTransition(async () => {
      await deleteCourse(courseId)
    })
  }

  return (
    <button
      onClick={handleDelete}
      disabled={isPending}
      className="text-red-600 hover:underline disabled:opacity-50 cursor-pointer"
    >
      {isPending ? "削除中..." : "削除"}
    </button>
  )
}
