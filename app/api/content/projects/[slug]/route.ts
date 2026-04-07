import { NextRequest, NextResponse } from 'next/server'
import matter from 'gray-matter'
import { revalidatePath } from 'next/cache'
import { verifyCookie, COOKIE_NAME } from '@/lib/session'
import { blobGet, blobPut, blobDel } from '@/lib/blob'

async function checkAuth(req: NextRequest) {
  return await verifyCookie(req.cookies.get(COOKIE_NAME)?.value)
}

export async function GET(_req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  if (!/^[a-z0-9-]+$/.test(slug)) return NextResponse.json({ error: 'Invalid slug' }, { status: 400 })

  const raw = await blobGet(`projects/${slug}.md`)
  if (!raw) return NextResponse.json({ error: 'Not found' }, { status: 404 })

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
  if (!await checkAuth(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { slug } = await params
  if (!/^[a-z0-9-]+$/.test(slug)) return NextResponse.json({ error: 'Invalid slug' }, { status: 400 })

  const { title, description, date, tags, demo, github, content } = await req.json()
  const existing = await blobGet(`projects/${slug}.md`)
  const hidden = existing ? matter(existing).data.hidden ?? false : false
  await blobPut(`projects/${slug}.md`, matter.stringify(content ?? '', { title, description, date, tags, demo, github, ...(hidden ? { hidden } : {}) }))
  revalidatePath('/projects')
  revalidatePath(`/projects/${slug}`)
  return NextResponse.json({ slug })
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  if (!await checkAuth(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { slug } = await params
  if (!/^[a-z0-9-]+$/.test(slug)) return NextResponse.json({ error: 'Invalid slug' }, { status: 400 })

  const raw = await blobGet(`projects/${slug}.md`)
  if (!raw) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const { data, content } = matter(raw)
  const hidden = !(data.hidden ?? false)
  await blobPut(`projects/${slug}.md`, matter.stringify(content, { ...data, hidden }))
  revalidatePath('/projects')
  revalidatePath(`/projects/${slug}`)
  return NextResponse.json({ slug, hidden })
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  if (!await checkAuth(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { slug } = await params
  if (!/^[a-z0-9-]+$/.test(slug)) return NextResponse.json({ error: 'Invalid slug' }, { status: 400 })

  await blobDel(`projects/${slug}.md`)
  revalidatePath('/projects')
  revalidatePath(`/projects/${slug}`)
  return NextResponse.json({ slug })
}
