"use server"

import { requireAdmin } from "@/lib/auth"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export async function createCourse(formData: FormData) {
  const { supabase } = await requireAdmin()

  const title = formData.get("title") as string
  if (!title?.trim()) {
    return { error: "タイトルは必須です" }
  }

  const { data, error } = await supabase
    .from("courses")
    .insert({
      title: title.trim(),
      description: (formData.get("description") as string) || null,
      thumbnail_url: (formData.get("thumbnail_url") as string) || null,
      is_published: formData.get("is_published") === "true",
    })
    .select("id")
    .single()

  if (error) {
    return { error: "作成に失敗しました" }
  }

  revalidatePath("/admin/courses")
  redirect(`/admin/courses/${data.id}`)
}

export async function updateCourse(courseId: string, formData: FormData) {
  const { supabase } = await requireAdmin()

  const title = formData.get("title") as string
  if (!title?.trim()) {
    return { error: "タイトルは必須です" }
  }

  const { error } = await supabase
    .from("courses")
    .update({
      title: title.trim(),
      description: (formData.get("description") as string) || null,
      thumbnail_url: (formData.get("thumbnail_url") as string) || null,
      is_published: formData.get("is_published") === "true",
      updated_at: new Date().toISOString(),
    })
    .eq("id", courseId)

  if (error) {
    return { error: "更新に失敗しました" }
  }

  revalidatePath("/admin/courses")
  revalidatePath(`/admin/courses/${courseId}`)
  redirect("/admin/courses")
}

export async function deleteCourse(courseId: string) {
  const { supabase } = await requireAdmin()

  const { error } = await supabase.from("courses").delete().eq("id", courseId)

  if (error) {
    return { error: "削除に失敗しました" }
  }

  revalidatePath("/admin/courses")
  redirect("/admin/courses")
}

export async function toggleCoursePublish(courseId: string, isPublished: boolean) {
  const { supabase } = await requireAdmin()

  await supabase
    .from("courses")
    .update({ is_published: isPublished, updated_at: new Date().toISOString() })
    .eq("id", courseId)

  revalidatePath("/admin/courses")
}
