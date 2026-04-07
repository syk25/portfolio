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

  const raw = await blobGet(`blog/${slug}.md`)
  if (!raw) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const { data, content } = matter(raw)
  return NextResponse.json({ slug, title: data.title ?? '', date: data.date ?? '', excerpt: data.excerpt ?? '', content })
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  if (!await checkAuth(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { slug } = await params
  if (!/^[a-z0-9-]+$/.test(slug)) return NextResponse.json({ error: 'Invalid slug' }, { status: 400 })

  const { title, date, excerpt, content } = await req.json()
  const existing = await blobGet(`blog/${slug}.md`)
  const hidden = existing ? matter(existing).data.hidden ?? false : false
  await blobPut(`blog/${slug}.md`, matter.stringify(content ?? '', { title, date, excerpt, ...(hidden ? { hidden } : {}) }))
  revalidatePath('/blog')
  revalidatePath(`/blog/${slug}`)
  return NextResponse.json({ slug })
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  if (!await checkAuth(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { slug } = await params
  if (!/^[a-z0-9-]+$/.test(slug)) return NextResponse.json({ error: 'Invalid slug' }, { status: 400 })

  try {
    const raw = await blobGet(`blog/${slug}.md`)
    if (!raw) return NextResponse.json({ error: 'Not found' }, { status: 404 })

    const { data, content } = matter(raw)
    const hidden = !(data.hidden ?? false)
    const { title, date, excerpt } = data
    await blobPut(`blog/${slug}.md`, matter.stringify(content, { title, date, excerpt, hidden }))
    revalidatePath('/blog')
    revalidatePath(`/blog/${slug}`)
    return NextResponse.json({ slug, hidden })
  } catch (err) {
    console.error('[PATCH /api/content/blog/[slug]]', err)
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  if (!await checkAuth(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { slug } = await params
  if (!/^[a-z0-9-]+$/.test(slug)) return NextResponse.json({ error: 'Invalid slug' }, { status: 400 })

  await blobDel(`blog/${slug}.md`)
  revalidatePath('/blog')
  revalidatePath(`/blog/${slug}`)
  return NextResponse.json({ slug })
}
