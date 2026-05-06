export type Profile = {
  id: string
  role: "student" | "admin"
  display_name: string | null
  avatar_url: string | null
  created_at: string
}

export type Course = {
  id: string
  title: string
  description: string | null
  thumbnail_url: string | null
  is_published: boolean
  created_at: string
  updated_at: string
}

export type Section = {
  id: string
  course_id: string
  title: string
  position: number
  created_at: string
}

export type Lesson = {
  id: string
  section_id: string
  title: string
  youtube_id: string
  description: string | null
  position: number
  created_at: string
}

export type Progress = {
  id: string
  user_id: string
  lesson_id: string
  completed: boolean
  completed_at: string | null
  created_at: string
}
