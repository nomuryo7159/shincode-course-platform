import { createClient } from "@/lib/supabase/server"
import { CourseCard } from "@/components/course-card"

export default async function Home() {
  const supabase = await createClient()

  const { data: courses } = await supabase
    .from("courses")
    .select(`
      *,
      sections (
        id,
        lessons (id)
      )
    `)
    .eq("is_published", true)
    .order("created_at", { ascending: false })

  const coursesWithCount = (courses ?? []).map((course) => {
    const lessonCount = course.sections?.reduce(
      (acc: number, section: { lessons: { id: string }[] }) =>
        acc + (section.lessons?.length ?? 0),
      0
    ) ?? 0
    return { ...course, lessonCount }
  })

  return (
    <div className="mx-auto max-w-[1340px] px-6 py-12">
      {/* Hero Section */}
      <div className="mb-12 rounded-2xl bg-gradient-to-r from-[#1c1d1f] to-[#3e4143] px-8 py-12 text-white md:px-12 md:py-16">
        <h1 className="text-3xl font-extrabold tracking-tight md:text-4xl">
          新しいスキルを身につけよう
        </h1>
        <p className="mt-3 max-w-lg text-base text-gray-300">
          プロの講師が教える実践的な動画講座で、あなたのキャリアを次のレベルへ。
        </p>
      </div>

      {/* Course Grid */}
      <div className="mb-6">
        <h2 className="text-2xl font-extrabold text-[var(--color-foreground)]">
          すべての講座
        </h2>
        <p className="mt-1 text-sm text-[var(--color-muted)]">
          {coursesWithCount.length} 件の講座が見つかりました
        </p>
      </div>

      {coursesWithCount.length === 0 ? (
        <div className="rounded-xl border border-dashed border-[var(--color-border)] py-20 text-center">
          <p className="text-lg font-medium text-[var(--color-muted)]">
            現在公開中の講座はありません
          </p>
          <p className="mt-1 text-sm text-[var(--color-muted)]">
            新しい講座が追加されるまでお待ちください
          </p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {coursesWithCount.map((course) => (
            <CourseCard
              key={course.id}
              id={course.id}
              title={course.title}
              description={course.description}
              thumbnailUrl={course.thumbnail_url}
              lessonCount={course.lessonCount}
            />
          ))}
        </div>
      )}
    </div>
  )
}
