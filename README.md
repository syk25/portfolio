# Portfolio

Personal portfolio and blog built with Next.js, Tailwind CSS, and Markdown.

## Stack

- **Framework** — Next.js 15 (App Router)
- **Styling** — Tailwind CSS
- **Content** — Markdown files with gray-matter frontmatter
- **Deploy** — Vercel (free)

## Local Setup

```bash
# 1. Install dependencies
npm install

# 2. Run dev server
npm run dev

# 3. Open in browser
http://localhost:3000
```

## Project Structure

```
portfolio/
├── app/                        # Next.js App Router pages
│   ├── layout.tsx              # Root layout (nav, footer, stars)
│   ├── page.tsx                # Homepage
│   ├── not-found.tsx           # 404 page
│   ├── projects/
│   │   ├── page.tsx            # All projects
│   │   └── [slug]/page.tsx     # Project detail
│   └── blog/
│       ├── page.tsx            # All posts
│       └── [slug]/page.tsx     # Blog post detail
├── components/
│   ├── Nav.tsx                 # Navigation bar
│   ├── Stars.tsx               # Starfield background
│   ├── ProjectCard.tsx         # Project + Blog + Link cards
│   ├── BlogCard.tsx
│   └── LinkCard.tsx
├── lib/
│   └── content.ts              # Reads markdown files
└── content/
    ├── projects/               # Your project markdown files
    └── blog/                   # Your blog post markdown files
```

---

## Adding Content

### New Project

Create `content/projects/your-project-name.md`:

```markdown
---
title: "Your Project Title"
description: "One sentence description of the project."
date: "2026.03 → ongoing"
tags: ["Next.js", "Python", "PostgreSQL"]
demo: "https://your-live-demo.com"
github: "https://github.com/you/repo"
---

## The Problem

What problem were you solving and for whom?

## What I Built

What did you actually build?

## What I Learned

What was the key insight or challenge?

## Result

What was the outcome?
```

### New Blog Post

Create `content/blog/your-post-slug.md`:

```markdown
---
title: "Your Post Title"
date: "2026.04.06"
excerpt: "A one or two sentence summary shown in the post list."
---

Your full post content here in markdown...
```

---

## Customizing Your Info

### Personal details

Edit `app/page.tsx`:
- Your name in the hero
- Your intro description
- Your social links (YouTube, LinkedIn, GitHub URLs)

### Navigation logo

Edit `components/Nav.tsx` — change `your name` to your actual name.

### Color palette

All colors are defined in `tailwind.config.ts` under the `colors` key:
- `star.gold` — `#f0c060` — the warm accent
- `space.deep` — `#080e1a` — the background
- `ocean.*` — the blue surface/text hierarchy

---

## Deploying to Vercel

```bash
# 1. Push your code to GitHub
git init
git add .
git commit -m "initial portfolio"
git remote add origin https://github.com/you/portfolio.git
git push -u origin main

# 2. Go to vercel.com
# 3. Import your GitHub repo
# 4. Deploy — done. Vercel auto-deploys on every push.
```

### Custom domain

In Vercel dashboard → Settings → Domains → add your domain.

---

## Workflow

```
Write content in /content/**/*.md
        ↓
git add . && git commit -m "add new post"
        ↓
git push
        ↓
Vercel auto-deploys → site is live
```

No touching code. Just write and push.
