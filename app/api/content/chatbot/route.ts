import { NextRequest, NextResponse } from 'next/server'
import { verifyCookie, COOKIE_NAME } from '@/lib/session'
import { blobGet, blobPut } from '@/lib/blob'

const DEFAULT_SUGGESTIONS = [
  'What projects have you built?',
  'What do you believe in?',
  "What's your background?",
]

async function getChatbotSettings() {
  const raw = await blobGet('settings/chatbot.json')
  if (raw) {
    try {
      const parsed = JSON.parse(raw)
      return {
        customInstructions: parsed.customInstructions ?? '',
        suggestions:        parsed.suggestions        ?? DEFAULT_SUGGESTIONS,
      }
    } catch { /* fall through */ }
  }
  return { customInstructions: '', suggestions: DEFAULT_SUGGESTIONS }
}

export async function GET() {
  return NextResponse.json(await getChatbotSettings())
}

export async function PUT(req: NextRequest) {
  const ok = await verifyCookie(req.cookies.get(COOKIE_NAME)?.value)
  if (!ok) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { customInstructions, suggestions } = await req.json()
  await blobPut('settings/chatbot.json', JSON.stringify({ customInstructions, suggestions }))
  return NextResponse.json({ ok: true })
}
