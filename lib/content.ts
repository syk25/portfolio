import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { remark } from 'remark'
import remarkHtml from 'remark-html'

const projectsDir = path.join(process.cwd(), 'content/projects')
const blogDir     = path.join(process.cwd(), 'content/blog')

export type Project = {
  slug:        string
  title:       string
  description: string
  date:        string
  tags:        string[]
  demo?:       string
  github?:     string
  content:     string
}

export type BlogPost = {
  slug:    string
  title:   string
  date:    string
  excerpt: string
  content: string
}

async function toHtml(markdown: string) {
  const result = await remark().use(remarkHtml).process(markdown)
  return result.toString()
}

export async function getProjects(): Promise<Project[]> {
  const files = fs.readdirSync(projectsDir).filter(f => f.endsWith('.md'))
  const projects = await Promise.all(
    files.map(async file => {
      const slug    = file.replace('.md', '')
      const raw     = fs.readFileSync(path.join(projectsDir, file), 'utf8')
      const { data, content } = matter(raw)
      return {
        slug,
        title:       data.title       ?? slug,
        description: data.description ?? '',
        date:        data.date        ?? '',
        tags:        data.tags        ?? [],
        demo:        data.demo,
        github:      data.github,
        content:     await toHtml(content),
      } as Project
    })
  )
  return projects.sort((a, b) => (a.date < b.date ? 1 : -1))
}

export async function getProject(slug: string): Promise<Project | null> {
  try {
    const raw = fs.readFileSync(path.join(projectsDir, `${slug}.md`), 'utf8')
    const { data, content } = matter(raw)
    return {
      slug,
      title:       data.title       ?? slug,
      description: data.description ?? '',
      date:        data.date        ?? '',
      tags:        data.tags        ?? [],
      demo:        data.demo,
      github:      data.github,
      content:     await toHtml(content),
    }
  } catch {
    return null
  }
}

export async function getBlogPosts(): Promise<BlogPost[]> {
  const files = fs.readdirSync(blogDir).filter(f => f.endsWith('.md'))
  const posts = await Promise.all(
    files.map(async file => {
      const slug    = file.replace('.md', '')
      const raw     = fs.readFileSync(path.join(blogDir, file), 'utf8')
      const { data, content } = matter(raw)
      return {
        slug,
        title:   data.title   ?? slug,
        date:    data.date    ?? '',
        excerpt: data.excerpt ?? '',
        content: await toHtml(content),
      } as BlogPost
    })
  )
  return posts.sort((a, b) => (a.date < b.date ? 1 : -1))
}

export async function getBlogPost(slug: string): Promise<BlogPost | null> {
  try {
    const raw = fs.readFileSync(path.join(blogDir, `${slug}.md`), 'utf8')
    const { data, content } = matter(raw)
    return {
      slug,
      title:   data.title   ?? slug,
      date:    data.date    ?? '',
      excerpt: data.excerpt ?? '',
      content: await toHtml(content),
    }
  } catch {
    return null
  }
}
