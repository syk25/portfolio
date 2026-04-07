import { NextRequest, NextResponse } from 'next/server'
import matter from 'gray-matter'
import { verifyCookie, COOKIE_NAME } from '@/lib/session'
import { blobList, blobGet, blobPut, blobFetch } from '@/lib/blob'

async function checkAuth(req: NextRequest) {
  return await verifyCookie(req.cookies.get(COOKIE_NAME)?.value)
}

export async function GET() {
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
      content,
    }
  }))
  return NextResponse.json(projects)
}

export async function POST(req: NextRequest) {
  if (!await checkAuth(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { slug, title, description, date, tags, demo, github, content } = await req.json()
  if (!slug || !/^[a-z0-9-]+$/.test(slug))
    return NextResponse.json({ error: 'Invalid slug' }, { status: 400 })

  const existing = await blobGet(`projects/${slug}.md`)
  if (existing) return NextResponse.json({ error: 'Slug already exists' }, { status: 409 })

  await blobPut(`projects/${slug}.md`, matter.stringify(content ?? '', { title, description, date, tags, demo, github }))
  return NextResponse.json({ slug }, { status: 201 })
}
