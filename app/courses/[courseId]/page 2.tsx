import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import Link from "next/link"
import { SectionAccordion } from "@/components/section-accordion"

export default async function CourseDetailPage({
  params,
}: {
  params: Promise<{ courseId: string }>
}) {
  const { courseId } = await params
  const supabase = await createClient()

  const { data: course } = await supabase
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
  const {
    data: { user },
  } = await supabase.auth.getUser()

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

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="text-3xl font-bold">{course.title}</h1>
      {course.description && (
        <p className="mt-3 text-gray-600">{course.description}</p>
      )}

      <div className="mt-6 flex items-center gap-4">
        {firstLesson && (
          <Link
            href={`/courses/${courseId}/lessons/${firstLesson.id}`}
            className="rounded-md bg-gray-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-gray-700 transition-colors"
          >
            最初の動画を見る
          </Link>
        )}
        {user && totalLessons > 0 && (
          <span className="text-sm text-gray-600">
            {completedCount} / {totalLessons} 完了
          </span>
        )}
      </div>

      <div className="mt-8 space-y-4">
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
  )
}
