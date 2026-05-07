# Codebase Structure

## Top-Level
- `app/` — Next.js App Router pages & server actions
- `components/` — Shared React components
- `lib/` — Utility libraries (Supabase clients, auth helpers)
- `public/` — Static assets

## App Directory
- `app/page.tsx` — Course list (home)
- `app/layout.tsx` — Root layout
- `app/login/` — Login page + login-form component
- `app/courses/[courseId]/` — Course detail
- `app/courses/[courseId]/lessons/[lessonId]/` — Lesson player
- `app/admin/` — Admin layout + pages (courses CRUD, users)
- `app/actions/` — Server Actions (auth, courses, sections, lessons, progress)
- `app/auth/callback/route.ts` — OAuth callback

## Components
- `header.tsx`, `footer.tsx` — Layout components
- `course-card.tsx` — Course card for listing
- `section-accordion.tsx` — Expandable section
- `lesson-sidebar.tsx` — Sidebar in lesson view
- `lesson-navigation.tsx` — Prev/Next navigation
- `mark-complete-button.tsx` — Progress tracking
- `youtube-player.tsx` — YouTube embed
- `user-menu.tsx` — User menu
- `admin-sidebar.tsx` — Admin navigation
- `admin/` — Admin-specific components (course-form, section-list, lesson-list, etc.)

## Lib
- `lib/supabase/client.ts` — Browser Supabase client
- `lib/supabase/server.ts` — Server Supabase client
- `lib/auth.ts` — Auth helpers
