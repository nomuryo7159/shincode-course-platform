"use server"

import { requireAdmin } from "@/lib/auth"
import { revalidatePath } from "next/cache"

export async function createLesson(
  courseId: string,
  sectionId: string,
  formData: FormData
) {
  const { supabase } = await requireAdmin()

  const title = formData.get("title") as string
  const youtubeId = formData.get("youtube_id") as string

  if (!title?.trim()) {
    return { error: "タイトルは必須です" }
  }
  if (!youtubeId?.trim()) {
    return { error: "YouTube動画IDは必須です" }
  }

  // Get max position
  const { data: existing } = await supabase
    .from("lessons")
    .select("position")
    .eq("section_id", sectionId)
    .order("position", { ascending: false })
    .limit(1)

  const nextPosition = (existing?.[0]?.position ?? -1) + 1

  const { error } = await supabase.from("lessons").insert({
    section_id: sectionId,
    title: title.trim(),
    youtube_id: youtubeId.trim(),
    description: (formData.get("description") as string) || null,
    position: nextPosition,
  })

  if (error) {
    return { error: "作成に失敗しました" }
  }

  revalidatePath(`/admin/courses/${courseId}`)
  return { success: true }
}

export async function updateLesson(
  courseId: string,
  lessonId: string,
  formData: FormData
) {
  const { supabase } = await requireAdmin()

  const title = formData.get("title") as string
  const youtubeId = formData.get("youtube_id") as string

  if (!title?.trim()) {
    return { error: "タイトルは必須です" }
  }
  if (!youtubeId?.trim()) {
    return { error: "YouTube動画IDは必須です" }
  }

  await supabase
    .from("lessons")
    .update({
      title: title.trim(),
      youtube_id: youtubeId.trim(),
      description: (formData.get("description") as string) || null,
    })
    .eq("id", lessonId)

  revalidatePath(`/admin/courses/${courseId}`)
  return { success: true }
}

export async function deleteLesson(courseId: string, lessonId: string) {
  const { supabase } = await requireAdmin()

  await supabase.from("lessons").delete().eq("id", lessonId)

  revalidatePath(`/admin/courses/${courseId}`)
  return { success: true }
}

export async function moveLessonUp(
  courseId: string,
  sectionId: string,
  lessonId: string
) {
  const { supabase } = await requireAdmin()

  const { data: lessons } = await supabase
    .from("lessons")
    .select("id, position")
    .eq("section_id", sectionId)
    .order("position")

  if (!lessons) return

  const idx = lessons.findIndex((l) => l.id === lessonId)
  if (idx <= 0) return

  const current = lessons[idx]
  const prev = lessons[idx - 1]

  await Promise.all([
    supabase
      .from("lessons")
      .update({ position: prev.position })
      .eq("id", current.id),
    supabase
      .from("lessons")
      .update({ position: current.position })
      .eq("id", prev.id),
  ])

  revalidatePath(`/admin/courses/${courseId}`)
}

export async function moveLessonDown(
  courseId: string,
  sectionId: string,
  lessonId: string
) {
  const { supabase } = await requireAdmin()

  const { data: lessons } = await supabase
    .from("lessons")
    .select("id, position")
    .eq("section_id", sectionId)
    .order("position")

  if (!lessons) return

  const idx = lessons.findIndex((l) => l.id === lessonId)
  if (idx < 0 || idx >= lessons.length - 1) return

  const current = lessons[idx]
  const next = lessons[idx + 1]

  await Promise.all([
    supabase
      .from("lessons")
      .update({ position: next.position })
      .eq("id", current.id),
    supabase
      .from("lessons")
      .update({ position: current.position })
      .eq("id", next.id),
  ])

  revalidatePath(`/admin/courses/${courseId}`)
}
