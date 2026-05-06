"use server"

import { requireAdmin } from "@/lib/auth"
import { revalidatePath } from "next/cache"

export async function createSection(courseId: string, formData: FormData) {
  const { supabase } = await requireAdmin()

  const title = formData.get("title") as string
  if (!title?.trim()) {
    return { error: "タイトルは必須です" }
  }

  // Get max position
  const { data: existing } = await supabase
    .from("sections")
    .select("position")
    .eq("course_id", courseId)
    .order("position", { ascending: false })
    .limit(1)

  const nextPosition = (existing?.[0]?.position ?? -1) + 1

  const { error } = await supabase.from("sections").insert({
    course_id: courseId,
    title: title.trim(),
    position: nextPosition,
  })

  if (error) {
    return { error: "作成に失敗しました" }
  }

  revalidatePath(`/admin/courses/${courseId}`)
  return { success: true }
}

export async function updateSection(
  courseId: string,
  sectionId: string,
  formData: FormData
) {
  const { supabase } = await requireAdmin()

  const title = formData.get("title") as string
  if (!title?.trim()) {
    return { error: "タイトルは必須です" }
  }

  await supabase
    .from("sections")
    .update({ title: title.trim() })
    .eq("id", sectionId)

  revalidatePath(`/admin/courses/${courseId}`)
  return { success: true }
}

export async function deleteSection(courseId: string, sectionId: string) {
  const { supabase } = await requireAdmin()

  await supabase.from("sections").delete().eq("id", sectionId)

  revalidatePath(`/admin/courses/${courseId}`)
  return { success: true }
}

export async function moveSectionUp(courseId: string, sectionId: string) {
  const { supabase } = await requireAdmin()

  const { data: sections } = await supabase
    .from("sections")
    .select("id, position")
    .eq("course_id", courseId)
    .order("position")

  if (!sections) return

  const idx = sections.findIndex((s) => s.id === sectionId)
  if (idx <= 0) return

  const current = sections[idx]
  const prev = sections[idx - 1]

  await Promise.all([
    supabase
      .from("sections")
      .update({ position: prev.position })
      .eq("id", current.id),
    supabase
      .from("sections")
      .update({ position: current.position })
      .eq("id", prev.id),
  ])

  revalidatePath(`/admin/courses/${courseId}`)
}

export async function moveSectionDown(courseId: string, sectionId: string) {
  const { supabase } = await requireAdmin()

  const { data: sections } = await supabase
    .from("sections")
    .select("id, position")
    .eq("course_id", courseId)
    .order("position")

  if (!sections) return

  const idx = sections.findIndex((s) => s.id === sectionId)
  if (idx < 0 || idx >= sections.length - 1) return

  const current = sections[idx]
  const next = sections[idx + 1]

  await Promise.all([
    supabase
      .from("sections")
      .update({ position: next.position })
      .eq("id", current.id),
    supabase
      .from("sections")
      .update({ position: current.position })
      .eq("id", next.id),
  ])

  revalidatePath(`/admin/courses/${courseId}`)
}
