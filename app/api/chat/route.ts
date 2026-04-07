import { NextRequest } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import matter from 'gray-matter'
import { blobGet, blobList } from '@/lib/blob'

const client = new Anthropic()

async function buildSystemPrompt(): Promise<string> {
  const aboutRaw = (await blobGet('about.md')) ?? ''
  const { data: aboutData, content: aboutContent } = matter(aboutRaw)

  const projectBlobs = await blobList('projects/')
  const projects = (await Promise.all(projectBlobs.map(async ({ url }) => {
    const res = await fetch(url, { cache: 'no-store' })
    const raw = await res.text()
    const { data, content } = matter(raw)
    return `### ${data.title}\nDate: ${data.date}\nTags: ${(data.tags ?? []).join(', ')}\n${content}`
  }))).join('\n\n---\n\n')

  const blogBlobs = await blobList('blog/')
  const posts = (await Promise.all(blogBlobs.map(async ({ url }) => {
    const res = await fetch(url, { cache: 'no-store' })
    const raw = await res.text()
    const { data, content } = matter(raw)
    return `### ${data.title}\nDate: ${data.date}\n${content}`
  }))).join('\n\n---\n\n')

  return `You are a portfolio assistant for ${aboutData.name ?? 'this person'}. \
Your job is to answer questions visitors have about them — their background, projects, writing, and skills.

Rules:
- Only answer based on the information provided below. Do not make things up.
- If a question cannot be answered from the provided content, say "I don't have that information — feel free to reach out directly at ${aboutData.email ?? 'their contact email'}."
- Keep answers concise, warm, and conversational. Avoid bullet-point dumps unless it genuinely helps.
- Do not answer questions unrelated to this person (e.g. general coding help, world events, etc.).

--- ABOUT ---
${aboutContent}
Roles: ${aboutData.roles ?? ''}

--- PROJECTS ---
${projects}

--- BLOG POSTS ---
${posts}`
}

export async function POST(req: NextRequest) {
  const { messages } = await req.json()

  const stream = client.messages.stream({
    model:      'claude-haiku-4-5-20251001',
    max_tokens: 1024,
    system:     await buildSystemPrompt(),
    messages,
  })

  const encoder = new TextEncoder()
  const readable = new ReadableStream({
    async start(controller) {
      for await (const chunk of stream) {
        if (chunk.type === 'content_block_delta' && chunk.delta.type === 'text_delta') {
          controller.enqueue(encoder.encode(chunk.delta.text))
        }
      }
      controller.close()
    },
  })

  return new Response(readable, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  })
}
