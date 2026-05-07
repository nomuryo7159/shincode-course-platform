# Style & Conventions

## General
- TypeScript strict mode
- ESLint flat config (`eslint.config.mjs`)
- Tailwind CSS v4 for styling (no v3 config file)
- Server Components by default; `'use client'` only where needed

## Naming
- Files: kebab-case (e.g., `course-card.tsx`, `mark-complete-button.tsx`)
- Components: PascalCase
- Dynamic route params: camelCase in brackets (e.g., `[courseId]`)

## Patterns
- Server Actions in `app/actions/` with `'use server'` directive
- Supabase client created per-request (server) or singleton (browser)
- `params` is a Promise in Next.js 16 — must `await` before use
- Auth check on server side using `supabase.auth.getUser()`
