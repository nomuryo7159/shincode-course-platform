import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import { CourseForm } from "@/components/admin/course-form"

export default async function EditCoursePage({
  params,
}: {
  params: Promise<{ courseId: string }>
}) {
  const { courseId } = await params
  const supabase = await createClient()

  const { data: course } = await supabase
    .from("courses")
    .select("*")
    .eq("id", courseId)
    .single()

  if (!course) {
    notFound()
  }

  return (
    <div>
      <h1 className="text-2xl font-bold">講座を編集</h1>
      <div className="mt-6">
        <CourseForm course={course} />
      </div>
    </div>
  )
}
