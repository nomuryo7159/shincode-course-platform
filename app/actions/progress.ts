"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function markLessonComplete(lessonId: string) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error("Unauthorized")
  }

  await supabase.from("progress").upsert(
    {
      user_id: user.id,
      lesson_id: lessonId,
      completed: true,
      completed_at: new Date().toISOString(),
    },
    { onConflict: "user_id,lesson_id" }
  )

  revalidatePath("/courses", "layout")
}

export async function markLessonIncomplete(lessonId: string) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error("Unauthorized")
  }

  await supabase
    .from("progress")
    .update({ completed: false, completed_at: null })
    .eq("user_id", user.id)
    .eq("lesson_id", lessonId)

  revalidatePath("/courses", "layout")
}
