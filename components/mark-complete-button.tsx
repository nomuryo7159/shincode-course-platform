"use client";

import { useTransition } from "react";
import {
  markLessonComplete,
  markLessonIncomplete,
} from "@/app/actions/progress";

type MarkCompleteButtonProps = {
  lessonId: string;
  courseId: string;
  isCompleted: boolean;
};

export function MarkCompleteButton({
  lessonId,
  courseId,
  isCompleted,
}: MarkCompleteButtonProps) {
  const [isPending, startTransition] = useTransition();

  const handleClick = () => {
    startTransition(async () => {
      if (isCompleted) {
        await markLessonIncomplete(lessonId, courseId);
      } else {
        await markLessonComplete(lessonId, courseId);
      }
    });
  };

  return (
    <button
      onClick={handleClick}
      disabled={isPending}
      className={`flex items-center gap-2 rounded-md px-4 py-2.5 text-sm font-bold transition-all cursor-pointer disabled:opacity-50 ${
        isCompleted
          ? "border-2 border-[var(--color-primary)] bg-[var(--color-primary-light)] text-[var(--color-primary)] hover:bg-purple-100"
          : "border-2 border-[var(--color-border)] bg-white text-[var(--color-foreground)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]"
      }`}
    >
      {isCompleted ? (
        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
        </svg>
      ) : (
        <svg
          className="h-4 w-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 13l4 4L19 7"
          />
        </svg>
      )}
      {isPending ? "処理中..." : isCompleted ? "完了済み" : "完了にする"}
    </button>
  );
}
