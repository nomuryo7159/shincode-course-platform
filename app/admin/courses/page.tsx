import { createClient } from "@/lib/supabase/server"
import Link from "next/link"
import { PublishToggle } from "@/components/admin/publish-toggle"
import { DeleteCourseButton } from "@/components/admin/delete-course-button"

export default async function AdminCoursesPage() {
  const supabase = await createClient()
  const { data: courses } = await supabase
    .from("courses")
    .select("*")
    .order("created_at", { ascending: false })

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">講座管理</h1>
        <Link
          href="/admin/courses/new"
          className="rounded-md bg-gray-900 px-4 py-2 text-sm text-white hover:bg-gray-700 transition-colors"
        >
          新規作成
        </Link>
      </div>

      <div className="mt-6 overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="border-b text-gray-500">
            <tr>
              <th className="pb-3 font-medium">タイトル</th>
              <th className="pb-3 font-medium">公開</th>
              <th className="pb-3 font-medium">作成日</th>
              <th className="pb-3 font-medium">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {(courses ?? []).map((course) => (
              <tr key={course.id}>
                <td className="py-3">
                  <Link
                    href={`/admin/courses/${course.id}`}
                    className="font-medium hover:text-blue-600"
                  >
                    {course.title}
                  </Link>
                </td>
                <td className="py-3">
                  <PublishToggle
                    courseId={course.id}
                    isPublished={course.is_published}
                  />
                </td>
                <td className="py-3 text-gray-500">
                  {new Date(course.created_at).toLocaleDateString("ja-JP")}
                </td>
                <td className="py-3">
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/admin/courses/${course.id}`}
                      className="text-purple-600 hover:underline"
                    >
                      セクション
                    </Link>
                    <Link
                      href={`/admin/courses/${course.id}/edit`}
                      className="text-blue-600 hover:underline"
                    >
                      編集
                    </Link>
                    <DeleteCourseButton
                      courseId={course.id}
                      courseTitle={course.title}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {(courses ?? []).length === 0 && (
          <p className="py-8 text-center text-gray-500">
            講座がまだありません
          </p>
        )}
      </div>
    </div>
  )
}
