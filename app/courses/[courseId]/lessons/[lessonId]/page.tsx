import { createClient } from "@/lib/supabase/server";
import { notFound, redirect } from "next/navigation";
import { YouTubePlayer } from "@/components/youtube-player";
import { LessonSidebar } from "@/components/lesson-sidebar";
import { LessonNavigation } from "@/components/lesson-navigation";
import { MarkCompleteButton } from "@/components/mark-complete-button";
import type { Metadata } from "next";

async function getCourseWithLessons(courseId: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("courses")
    .select(
      `
      id,
      title,
      sections (
        id,
        title,
        position,
        lessons (
          id,
          title,
          youtube_id,
          position
        )
      )
    `,
    )
    .eq("id", courseId)
    .eq("is_published", true)
    .single();
  return data;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ courseId: string; lessonId: string }>;
}): Promise<Metadata> {
  const { courseId, lessonId } = await params;
  const course = await getCourseWithLessons(courseId);

  // Find lesson title from the already-fetched course data
  const lesson = course?.sections
    ?.flatMap((s: { lessons: { id: string; title: string }[] }) => s.lessons)
    .find((l: { id: string }) => l.id === lessonId);

  return {
    title: lesson ? `${lesson.title} | コースプラットフォーム` : "動画視聴",
  };
}

export default async function LessonPage({
  params,
}: {
  params: Promise<{ courseId: string; lessonId: string }>;
}) {
  const { courseId, lessonId } = await params;

  const supabase = await createClient();
  const [
    course,
    {
      data: { user },
    },
  ] = await Promise.all([
    getCourseWithLessons(courseId),
    supabase.auth.getUser(),
  ]);

  if (!course) {
    notFound();
  }

  // Flatten and sort all lessons
  const sections = (course.sections ?? []).sort(
    (a: { position: number }, b: { position: number }) =>
      a.position - b.position,
  );
  const allLessons = sections.flatMap(
    (section: {
      lessons: {
        id: string;
        title: string;
        youtube_id: string;
        position: number;
      }[];
    }) =>
      section.lessons.sort(
        (a: { position: number }, b: { position: number }) =>
          a.position - b.position,
      ),
  );

  const currentIndex = allLessons.findIndex(
    (l: { id: string }) => l.id === lessonId,
  );
  if (currentIndex === -1) {
    notFound();
  }

  const currentLesson = allLessons[currentIndex];
  const isFirstLesson = currentIndex === 0;

  // Access control: only first lesson is free
  if (!isFirstLesson && !user) {
    redirect(`/login?next=/courses/${courseId}/lessons/${lessonId}`);
  }

  // Get completion status
  let isCompleted = false;
  if (user) {
    const { data: progress } = await supabase
      .from("progress")
      .select("completed")
      .eq("user_id", user.id)
      .eq("lesson_id", lessonId)
      .single();
    isCompleted = progress?.completed ?? false;
  }

  const prevLesson = currentIndex > 0 ? allLessons[currentIndex - 1] : null;
  const nextLesson =
    currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null;

  return (
    <div className="bg-white">
      <div className="lg:flex">
        {/* Main content */}
        <div className="flex-1 min-w-0">
          {/* Video player - full width on top */}
          <div className="bg-black">
            <div className="mx-auto max-w-5xl">
              <YouTubePlayer
                youtubeId={currentLesson.youtube_id}
                title={currentLesson.title}
              />
            </div>
          </div>

          {/* Lesson info */}
          <div className="border-b border-[var(--color-border)] px-6 py-5">
            <div className="mx-auto max-w-5xl">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h1 className="text-xl font-extrabold text-[var(--color-foreground)]">
                    {currentLesson.title}
                  </h1>
                  <p className="mt-1 text-sm text-[var(--color-muted)]">
                    {course.title} ・ レッスン {currentIndex + 1} /{" "}
                    {allLessons.length}
                  </p>
                </div>
                {user && (
                  <MarkCompleteButton
                    lessonId={lessonId}
                    courseId={courseId}
                    isCompleted={isCompleted}
                  />
                )}
              </div>

              <LessonNavigation
                courseId={courseId}
                prevLesson={prevLesson}
                nextLesson={nextLesson}
              />
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="border-l border-[var(--color-border)] lg:w-[22rem] lg:shrink-0">
          <LessonSidebar
            sections={sections}
            courseId={courseId}
            currentLessonId={lessonId}
          />
        </div>
      </div>
    </div>
  );
}
