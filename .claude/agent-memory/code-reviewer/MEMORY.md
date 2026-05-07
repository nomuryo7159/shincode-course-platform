# Code Reviewer Memory - shincode-course-platform

## Project Overview

- Next.js 16 (App Router) / React 19 / TypeScript / Tailwind CSS v4 / Supabase
- 3-tier content model: Course -> Section -> Lesson
- Auth: Supabase Auth (Google OAuth only)
- Deploy: Vercel

## Key File Paths

- Supabase clients: `lib/supabase/client.ts` (browser), `lib/supabase/server.ts` (server)
- Auth guard: `lib/auth.ts` (requireAdmin)
- Server Actions: `app/actions/{auth,courses,lessons,sections,progress}.ts`
- Types: `types/index.ts`

## Confirmed Patterns & Conventions

- `@/*` path alias used consistently throughout codebase
- Server Components use `async/await` directly for data fetching (no useEffect)
- `params` properly `await`-ed as Promise in all page components
- `supabase.auth.getUser()` used server-side (not `getSession()`) - correct
- `requireAdmin()` utility in `lib/auth.ts` used in all admin Server Actions
- `useTransition` used for Server Action pending state in Client Components
- `useActionState` used in `CourseForm` for error handling - correct pattern
- `revalidatePath` called after mutations - consistent
- `Promise.all` used for parallel data fetching in lesson/course detail pages

## Known Issues Found (First Full Review - 2026-05-07)

### Critical

1. `middleware.ts` is MISSING - auth token refresh does not work. `proxy.ts` exists but is never imported as middleware. Sessions will not be refreshed between requests.
2. `lib/supabase/client.ts` uses `NEXT_PUBLIC_SUPABASE_ANON_KEY` but CLAUDE.md specifies new Publishable Key format (`NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`)
3. `app/admin/users/page.tsx` uses `<img>` tag instead of Next.js `<Image>` for user avatars - minor security (no domain validation)

### Warning

4. `app/admin/courses/[courseId]/page.tsx` - Admin page fetches course WITHOUT `is_published` filter, but does NOT verify this is intentional admin-only view. Actually correct behavior (admin should see unpublished courses), but the lack of auth re-check (relies on layout) is a pattern to note.
5. `app/actions/progress.ts` - `markLessonComplete/Incomplete` throws `new Error("Unauthorized")` instead of returning `{ error: "..." }`. CLAUDE.md says expected errors should use return values with `useActionState`, not throw.
6. Position swap in `moveSectionUp/Down` and `moveLessonUp/Down` is done with two separate UPDATE queries (not atomic). If one fails, positions become inconsistent. Should use a DB transaction.
7. `components/admin/section-list.tsx` - `isPending` state is shared across ALL section operations (create, delete, move). If two operations are triggered rapidly, the pending state may be unreliable.
8. `app/actions/courses.ts` - `toggleCoursePublish` doesn't check/return the Supabase error, silently fails.
9. `app/actions/lessons.ts` - `deleteLesson` and `moveLessonUp/Down` don't return/handle Supabase errors.
10. `app/actions/sections.ts` - `updateSection`, `deleteSection`, `moveSectionUp/Down` don't return/handle Supabase errors.

### Info

11. Inline type assertions like `as string` for FormData values - no runtime validation beyond `trim()` check
12. `app/courses/[courseId]/page.tsx` calls `createClient()` twice (once in `getCourse()`, once in page component) - creates two Supabase instances per request
13. `app/courses/[courseId]/lessons/[lessonId]/page.tsx` also calls `getCourseWithLessons` (which calls `createClient()`) then calls `createClient()` again separately
14. Duplicate files exist: `page 2.tsx` files in courses/[courseId] and login directories - should be cleaned up
15. `proxy.ts` in project root is dead code (should be `middleware.ts`)

## Architecture Decisions Observed

- Admin auth protection done at layout level (`app/admin/layout.tsx`) using `getUser()` + profile check
- Server Actions all use `requireAdmin()` for double-protection (good security layering)
- YouTube player uses lazy-load pattern (thumbnail click -> iframe) for performance
- Progress tracking is manual (user clicks "complete" button)
- `LessonSidebar` is a Server Component (no `'use client'`) - correct, uses Link only
