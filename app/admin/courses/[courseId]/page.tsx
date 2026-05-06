import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import Link from "next/link"
import { AdminSectionList } from "@/components/admin/section-list"

export default async function AdminCourseDetailPage({
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
          youtube_id,
          description,
          position
        )
      )
    `)
    .eq("id", courseId)
    .single()

  if (!course) {
    notFound()
  }

  const sections = (course.sections ?? []).sort(
    (a: { position: number }, b: { position: number }) => a.position - b.position
  )

  const totalLessons = sections.reduce(
    (acc: number, s: { lessons: { id: string }[] }) => acc + (s.lessons?.length ?? 0),
    0
  )

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/admin/courses"
          className="inline-flex items-center gap-1 text-sm text-[var(--color-muted)] hover:text-[var(--color-foreground)] transition-colors"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          講座一覧に戻る
        </Link>
        <div className="mt-3 flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-extrabold text-[var(--color-foreground)]">
              {course.title}
            </h1>
            <div className="mt-2 flex items-center gap-4 text-sm text-[var(--color-muted)]">
              <span className="inline-flex items-center gap-1.5">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                {sections.length} セクション
              </span>
              <span className="inline-flex items-center gap-1.5">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {totalLessons} レッスン
              </span>
              <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-bold ${course.is_published ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"}`}>
                {course.is_published ? "公開中" : "非公開"}
              </span>
            </div>
          </div>
          <Link
            href={`/admin/courses/${courseId}/edit`}
            className="rounded-lg border border-[var(--color-border)] px-4 py-2 text-sm font-medium hover:bg-[var(--color-surface)] transition-colors"
          >
            講座情報を編集
          </Link>
        </div>
      </div>

      {/* Guide */}
      <div className="mb-6 rounded-lg border border-blue-200 bg-blue-50 px-4 py-3">
        <p className="text-sm text-blue-800">
          <span className="font-bold">使い方:</span>{" "}
          セクションを追加し、各セクション内にレッスン（動画）を追加してください。↑↓で順序を変更できます。
        </p>
      </div>

      {/* Section List */}
      <AdminSectionList courseId={courseId} sections={sections} />
    </div>
  )
}
