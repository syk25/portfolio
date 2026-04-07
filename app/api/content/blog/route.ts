import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

const blogDir = path.join(process.cwd(), 'content/blog')

function checkAuth(req: NextRequest) {
  return req.headers.get('x-admin-password') === process.env.ADMIN_PASSWORD
}

export async function GET() {
  const files = fs.readdirSync(blogDir).filter(f => f.endsWith('.md'))
  const posts = files.map(file => {
    const slug = file.replace('.md', '')
    const raw = fs.readFileSync(path.join(blogDir, file), 'utf8')
    const { data, content } = matter(raw)
    return { slug, title: data.title ?? '', date: data.date ?? '', excerpt: data.excerpt ?? '', content }
  })
  return NextResponse.json(posts)
}

export async function POST(req: NextRequest) {
  if (!checkAuth(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { slug, title, date, excerpt, content } = await req.json()
  if (!slug || !/^[a-z0-9-]+$/.test(slug))
    return NextResponse.json({ error: 'Invalid slug' }, { status: 400 })

  const filePath = path.join(blogDir, `${slug}.md`)
  if (fs.existsSync(filePath))
    return NextResponse.json({ error: 'Slug already exists' }, { status: 409 })

  fs.writeFileSync(filePath, matter.stringify(content ?? '', { title, date, excerpt }))
  return NextResponse.json({ slug }, { status: 201 })
}
