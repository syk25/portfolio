import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

const projectsDir = path.join(process.cwd(), 'content/projects')

function checkAuth(req: NextRequest) {
  return req.headers.get('x-admin-password') === process.env.ADMIN_PASSWORD
}

function safePath(slug: string) {
  if (!/^[a-z0-9-]+$/.test(slug)) return null
  return path.join(projectsDir, `${slug}.md`)
}

export async function GET(_req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const filePath = safePath(slug)
  if (!filePath || !fs.existsSync(filePath))
    return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const raw = fs.readFileSync(filePath, 'utf8')
  const { data, content } = matter(raw)
  return NextResponse.json({
    slug,
    title:       data.title       ?? '',
    description: data.description ?? '',
    date:        data.date        ?? '',
    tags:        data.tags        ?? [],
    demo:        data.demo        ?? '',
    github:      data.github      ?? '',
    content,
  })
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  if (!checkAuth(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { slug } = await params
  const filePath = safePath(slug)
  if (!filePath || !fs.existsSync(filePath))
    return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const { title, description, date, tags, demo, github, content } = await req.json()
  fs.writeFileSync(filePath, matter.stringify(content ?? '', { title, description, date, tags, demo, github }))
  return NextResponse.json({ slug })
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  if (!checkAuth(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { slug } = await params
  const filePath = safePath(slug)
  if (!filePath || !fs.existsSync(filePath))
    return NextResponse.json({ error: 'Not found' }, { status: 404 })

  fs.unlinkSync(filePath)
  return NextResponse.json({ slug })
}
