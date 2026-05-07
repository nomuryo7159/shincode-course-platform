# Security Reviewer Memory

## Project Overview

Video course platform (Udemy-like MVP). Supabase Auth (Google OAuth only). No payments yet.

## Key File Locations

- Auth lib: `/lib/auth.ts` - `requireAdmin()` helper (uses getUser + profiles.role check)
- Supabase server client: `/lib/supabase/server.ts`
- Supabase browser client: `/lib/supabase/client.ts`
- Middleware: `/middleware.ts` - token refresh only, no route protection
- Auth callback: `/app/auth/callback/route.ts`
- Server Actions: `/app/actions/{auth,courses,sections,lessons,progress}.ts`
- Admin layout guard: `/app/admin/layout.tsx`

## Auth Patterns (Confirmed)

- Server-side always uses `supabase.auth.getUser()` - CORRECT
- `requireAdmin()` in `/lib/auth.ts` used consistently across all admin Server Actions
- Admin layout (`/app/admin/layout.tsx`) independently checks auth + admin role before rendering
- Middleware only refreshes tokens, does NOT enforce route-level access control (by design)

## RLS Policies (Verified)

- All 5 tables have RLS enabled
- courses/sections/lessons: public SELECT on is_published=true, admin-only INSERT/UPDATE/DELETE
- progress: user owns their own rows (SELECT/INSERT/UPDATE/DELETE by auth.uid()=user_id), admin SELECT all
- profiles: authenticated users SELECT all rows (broad - see known issues), users UPDATE own row only

## Known Security Issues Found (2025-05-07 Review)

1. CRITICAL: `profiles_update_own` RLS policy has NO column restriction - authenticated users can UPDATE their own `role` to 'admin' via direct API call
2. HIGH: `NEXT_PUBLIC_SUPABASE_ANON_KEY` env var name used instead of documented `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` (minor naming, functionally same key type)
3. HIGH: `profiles_select_authenticated` allows ALL authenticated users to read ALL profiles (exposes emails/avatars of all users to any logged-in user)
4. MEDIUM: `youtube_id` stored in DB has no format validation - malformed IDs could cause iframe src injection
5. MEDIUM: `thumbnail_url` in courses has no URL validation beyond HTML `type="url"` - server action does not validate
6. MEDIUM: Server Actions for sections/lessons accept `courseId`/`sectionId` as plain strings with no UUID format validation
7. LOW: `get_users_for_admin` DB function is SECURITY DEFINER - correct pattern but exposes auth.users email data
8. LOW: `middleware.ts` uses `NEXT_PUBLIC_SUPABASE_ANON_KEY` - should be `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` per CLAUDE.md
9. LOW: iframe sandbox attribute missing on YouTube embed (YouTubePlayer component)
10. INFO: No `dangerouslySetInnerHTML` usage found - XSS via React rendering is safe

## DB Functions

- `get_users_for_admin`: SECURITY DEFINER, checks admin role internally before returning auth.users data
- `handle_new_user`: SECURITY DEFINER trigger on auth.users INSERT - creates profile with role='student'

## Trigger

- `on_auth_user_created` on `auth.users` - calls `handle_new_user()` to create profile

## Environment Variables

- Uses `NEXT_PUBLIC_SUPABASE_ANON_KEY` (old name) instead of `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` (new name per CLAUDE.md)
- No secrets leaked to client (no service role key in NEXT*PUBLIC*\*)
