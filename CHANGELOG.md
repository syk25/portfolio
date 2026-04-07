# Changelog

All notable changes to this project are documented here.

---

## [Unreleased]

## 2026-04-07 (latest)

### Changed
- Admin editor refactored: editing now opens on a dedicated page (`/admin/blog/[slug]`, `/admin/projects/[slug]`) instead of an inline form above the list
- Content textarea auto-expands as you type — no inner scrollbar, no fixed row height
- Fixed scroll-jump on Enter key: `autoResize` now preserves `window.scrollY` around the `height: auto` collapse step
- Admin password stored in `sessionStorage` so it persists across page navigations within the session

---

### Added
- Floating chatbot (✦ button, bottom-right) powered by Claude Haiku via Anthropic API
- `/api/chat` route — streams responses, system prompt built from `content/about.md`, all projects, and all blog posts
- `content/about.md` — fill this in with your real bio, skills, and contact email; the chatbot reads it automatically
- `ANTHROPIC_API_KEY` added to `.env.local`

---

## 2026-04-07

### Added
- Admin dashboard at `/admin` — password-protected CRUD UI for blog posts and projects
- API routes under `/api/content/blog` and `/api/content/projects` — create, read, update, delete markdown files on disk
- `.env.local` with `ADMIN_PASSWORD` for simple auth (change the default value before deploying)

### Changed
- Max content width: `720px` → `800px`
- Font sizes bumped throughout (10–13px ranges raised to 12–16px)
- Prose font size: `15px` → `16px`
- Fixed mobile layout: all `grid-cols-2` grids now use `grid-cols-1 sm:grid-cols-2`

## 2026-04-06

### Fixed
- Reduced max content width from `1100px` to `720px` for a tighter, more readable layout
- Increased GNB (nav) link font size from `text-xs` (12px) to `text-sm` (14px)
