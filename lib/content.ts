import matter from 'gray-matter'
import { remark } from 'remark'
import remarkHtml from 'remark-html'
import { blobList, blobGet, blobFetch } from './blob'

export type Project = {
  slug:        string
  title:       string
  description: string
  date:        string
  tags:        string[]
  demo:        string
  github:      string
  content:     string
}

export type BlogPost = {
  slug:    string
  title:   string
  date:    string
  excerpt: string
  content: string
}

async function toHtml(md: string): Promise<string> {
  const result = await remark().use(remarkHtml).process(md)
  return result.toString()
}

export async function getProjects(): Promise<Project[]> {
  const blobs = await blobList('projects/')
  const projects = await Promise.all(blobs.map(async ({ pathname, url }) => {
    const raw = await blobFetch(url)
    const { data, content } = matter(raw)
    const slug = pathname.replace('projects/', '').replace('.md', '')
    return {
      slug,
      title:       data.title       ?? '',
      description: data.description ?? '',
      date:        data.date        ?? '',
      tags:        data.tags        ?? [],
      demo:        data.demo        ?? '',
      github:      data.github      ?? '',
      content:     await toHtml(content),
    }
  }))
  return projects.sort((a, b) => b.date.localeCompare(a.date))
}

export async function getProject(slug: string): Promise<Project | undefined> {
  const raw = await blobGet(`projects/${slug}.md`)
  if (!raw) return undefined
  const { data, content } = matter(raw)
  return {
    slug,
    title:       data.title       ?? '',
    description: data.description ?? '',
    date:        data.date        ?? '',
    tags:        data.tags        ?? [],
    demo:        data.demo        ?? '',
    github:      data.github      ?? '',
    content:     await toHtml(content),
  }
}

export async function getBlogPosts(): Promise<BlogPost[]> {
  const blobs = await blobList('blog/')
  const posts = await Promise.all(blobs.map(async ({ pathname, url }) => {
    const raw = await blobFetch(url)
    const { data, content } = matter(raw)
    const slug = pathname.replace('blog/', '').replace('.md', '')
    return {
      slug,
      title:   data.title   ?? '',
      date:    data.date    ?? '',
      excerpt: data.excerpt ?? '',
      content: await toHtml(content),
    }
  }))
  return posts.sort((a, b) => b.date.localeCompare(a.date))
}

export async function getBlogPost(slug: string): Promise<BlogPost | undefined> {
  const raw = await blobGet(`blog/${slug}.md`)
  if (!raw) return undefined
  const { data, content } = matter(raw)
  return {
    slug,
    title:   data.title   ?? '',
    date:    data.date    ?? '',
    excerpt: data.excerpt ?? '',
    content: await toHtml(content),
  }
}

export type LandingSettings = {
  gnb:          string
  footer:       string
  subheader:    string
  heroSubtitle: string
  description:  string
}

const DEFAULTS: LandingSettings = {
  gnb:          'Seyoun Kim ◆',
  footer:       'made with intention · not just code',
  subheader:    '◆ Backend · AI · Solutions · Sales',
  heroSubtitle: "Let's build a better world.",
  description:  "I want to make the world a little better, starting with what's around me. I build tools to improve educational experiences and solve real problems in my community. Recently, that meant building something for my local fitness center after they asked for help. It's a small step — but I believe these improvements compound.",
}

export async function getLandingSettings(): Promise<LandingSettings> {
  const raw = await blobGet('settings/landing.json')
  if (raw) {
    try {
      const parsed = JSON.parse(raw)
      return { ...DEFAULTS, ...parsed }
    } catch { /* fall through */ }
  }
  // Backward compat: check old hero-description.txt
  const desc = await blobGet('settings/hero-description.txt')
  return { ...DEFAULTS, ...(desc ? { description: desc.trim() } : {}) }
}

// Keep for any existing callers
export async function getHeroDescription(): Promise<string> {
  return (await getLandingSettings()).description
}
