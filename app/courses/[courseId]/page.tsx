import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { SectionAccordion } from "@/components/section-accordion"
import type { Metadata } from "next"

async function getCourse(courseId: string) {
  const supabase = await createClient()
  const { data } = await supabase
    .from("courses")
    .select(`
      *,
      sections (
        id,
        title,
        position,
        lessons (
          id,
          title,
          position
        )
      )
    `)
    .eq("id", courseId)
    .eq("is_published", true)
    .single()
  return data
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ courseId: string }>
}): Promise<Metadata> {
  const { courseId } = await params
  const course = await getCourse(courseId)

  return {
    title: course ? `${course.title} | コースプラットフォーム` : "講座詳細",
    description: course?.description ?? undefined,
  }
}

export default async function CourseDetailPage({
  params,
}: {
  params: Promise<{ courseId: string }>
}) {
  const { courseId } = await params

  const supabase = await createClient()
  const [course, { data: { user } }] = await Promise.all([
    getCourse(courseId),
    supabase.auth.getUser(),
  ])

  if (!course) {
    notFound()
  }

  // Sort sections and lessons by position
  const sections = (course.sections ?? [])
    .sort((a: { position: number }, b: { position: number }) => a.position - b.position)
    .map((section: { id: string; title: string; position: number; lessons: { id: string; title: string; position: number }[] }) => ({
      ...section,
      lessons: (section.lessons ?? []).sort(
        (a: { position: number }, b: { position: number }) => a.position - b.position
      ),
    }))

  const totalLessons = sections.reduce(
    (acc: number, section: { lessons: { id: string }[] }) => acc + section.lessons.length,
    0
  )

  // Get progress for logged-in user
  let completedCount = 0
  let completedLessonIds: string[] = []
  if (user) {
    const lessonIds = sections.flatMap(
      (section: { lessons: { id: string }[] }) => section.lessons.map((l) => l.id)
    )
    if (lessonIds.length > 0) {
      const { data: progress } = await supabase
        .from("progress")
        .select("lesson_id")
        .eq("user_id", user.id)
        .eq("completed", true)
        .in("lesson_id", lessonIds)
      completedCount = progress?.length ?? 0
      completedLessonIds = progress?.map((p) => p.lesson_id) ?? []
    }
  }

  // Find first lesson for CTA button
  const firstLesson = sections[0]?.lessons[0]

  const progressPercent = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0

  return (
    <div>
      {/* Hero banner */}
      <div className="bg-[var(--color-foreground)] text-white">
        <div className="mx-auto max-w-[1340px] px-6 py-10 md:py-14">
          <div className="max-w-2xl">
            <h1 className="text-2xl font-extrabold tracking-tight md:text-3xl">
              {course.title}
            </h1>
            {course.description && (
              <p className="mt-3 text-base leading-relaxed text-gray-300">
                {course.description}
              </p>
            )}
            <div className="mt-5 flex flex-wrap items-center gap-4 text-sm text-gray-400">
              <span className="flex items-center gap-1.5">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {totalLessons} レッスン
              </span>
              <span className="flex items-center gap-1.5">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                {sections.length} セクション
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-[1340px] px-6 py-8">
        <div className="lg:flex lg:gap-8">
          {/* Main content */}
          <div className="flex-1">
            {/* Progress bar */}
            {user && totalLessons > 0 && (
              <div className="mb-6 rounded-lg border border-[var(--color-border)] bg-white p-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-bold text-[var(--color-foreground)]">学習の進捗</span>
                  <span className="text-[var(--color-muted)]">{completedCount} / {totalLessons} 完了 ({progressPercent}%)</span>
                </div>
                <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-gray-200">
                  <div
                    className="h-full rounded-full bg-[var(--color-primary)] transition-all"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>
            )}

            {/* Course content */}
            <div className="rounded-lg border border-[var(--color-border)] bg-white">
              <div className="border-b border-[var(--color-border)] px-5 py-4">
                <h2 className="text-lg font-bold">コース内容</h2>
                <p className="mt-0.5 text-xs text-[var(--color-muted)]">
                  {sections.length} セクション・{totalLessons} レッスン
                </p>
              </div>
              <div className="divide-y divide-[var(--color-border)]">
                {sections.map(
                  (section: {
                    id: string
                    title: string
                    lessons: { id: string; title: string }[]
                  }) => (
                    <SectionAccordion
                      key={section.id}
                      title={section.title}
                      lessons={section.lessons}
                      courseId={courseId}
                      completedLessonIds={completedLessonIds}
                    />
                  )
                )}
              </div>
            </div>
          </div>

          {/* Sidebar CTA */}
          <div className="mt-6 lg:mt-0 lg:w-80 lg:shrink-0">
            <div className="sticky top-20 rounded-lg border border-[var(--color-border)] bg-white p-5 shadow-sm">
              {course.thumbnail_url && (
                <div className="relative mb-4 aspect-video w-full overflow-hidden rounded-md">
                  <Image
                    src={course.thumbnail_url}
                    alt={course.title}
                    fill
                    sizes="320px"
                    className="object-cover"
                  />
                </div>
              )}
              {firstLesson && (
                <Link
                  href={`/courses/${courseId}/lessons/${firstLesson.id}`}
                  className="flex w-full items-center justify-center gap-2 rounded-md bg-[var(--color-primary)] px-5 py-3 text-sm font-bold text-white hover:bg-[var(--color-primary-hover)] transition-colors"
                >
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                  学習を始める
                </Link>
              )}
              <div className="mt-4 space-y-2 text-sm text-[var(--color-muted)]">
                <div className="flex items-center gap-2">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{totalLessons} 本の動画レッスン</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                  <span>モバイル対応</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  <span>自分のペースで学習</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
