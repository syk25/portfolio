import { NextRequest, NextResponse } from 'next/server'
import matter from 'gray-matter'
import { revalidatePath } from 'next/cache'
import { verifyCookie, COOKIE_NAME } from '@/lib/session'
import { blobList, blobGet, blobPut, blobFetch } from '@/lib/blob'

async function checkAuth(req: NextRequest) {
  return await verifyCookie(req.cookies.get(COOKIE_NAME)?.value)
}

export async function GET() {
  const blobs = await blobList('blog/')
  const posts = await Promise.all(blobs.map(async ({ pathname, url }) => {
    const raw = await blobFetch(url)
    const { data, content } = matter(raw)
    const slug = pathname.replace('blog/', '').replace('.md', '')
    return { slug, title: data.title ?? '', date: data.date ?? '', excerpt: data.excerpt ?? '', content }
  }))
  return NextResponse.json(posts)
}

export async function POST(req: NextRequest) {
  if (!await checkAuth(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { slug, title, date, excerpt, content } = await req.json()
  if (!slug || !/^[a-z0-9-]+$/.test(slug))
    return NextResponse.json({ error: 'Invalid slug' }, { status: 400 })

  const existing = await blobGet(`blog/${slug}.md`)
  if (existing) return NextResponse.json({ error: 'Slug already exists' }, { status: 409 })

  await blobPut(`blog/${slug}.md`, matter.stringify(content ?? '', { title, date, excerpt }))
  revalidatePath('/blog')
  return NextResponse.json({ slug }, { status: 201 })
}
