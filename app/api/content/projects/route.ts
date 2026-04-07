import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

const projectsDir = path.join(process.cwd(), 'content/projects')

function checkAuth(req: NextRequest) {
  return req.headers.get('x-admin-password') === process.env.ADMIN_PASSWORD
}

export async function GET() {
  const files = fs.readdirSync(projectsDir).filter(f => f.endsWith('.md'))
  const projects = files.map(file => {
    const slug = file.replace('.md', '')
    const raw = fs.readFileSync(path.join(projectsDir, file), 'utf8')
    const { data, content } = matter(raw)
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
  })
  return NextResponse.json(projects)
}

export async function POST(req: NextRequest) {
  if (!checkAuth(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { slug, title, description, date, tags, demo, github, content } = await req.json()
  if (!slug || !/^[a-z0-9-]+$/.test(slug))
    return NextResponse.json({ error: 'Invalid slug' }, { status: 400 })

  const filePath = path.join(projectsDir, `${slug}.md`)
  if (fs.existsSync(filePath))
    return NextResponse.json({ error: 'Slug already exists' }, { status: 409 })

  fs.writeFileSync(filePath, matter.stringify(content ?? '', { title, description, date, tags, demo, github }))
  return NextResponse.json({ slug }, { status: 201 })
}
