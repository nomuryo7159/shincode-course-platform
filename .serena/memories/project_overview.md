# Project Overview

## Purpose
Udemy-like video course platform (MVP) using YouTube unlisted videos. No payment (Phase 2+). Auth via Supabase Auth (Google OAuth only).

## Tech Stack
- **Next.js 16** (App Router) / React 19 / TypeScript
- **Tailwind CSS v4** (via `@tailwindcss/postcss`)
- **Supabase** (PostgreSQL / Auth / RLS)
- **Deploy**: Vercel

## Content Model (3 levels)
Course → Section → Lesson (YouTube video)

## Database Tables (Supabase)
- profiles, courses, sections, lessons, progress (all UUID PKs, CASCADE deletes)

## Path Alias
`@/*` → project root
