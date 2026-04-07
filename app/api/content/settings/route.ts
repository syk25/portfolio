import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { verifyCookie, COOKIE_NAME } from '@/lib/session'
import { blobGet, blobPut } from '@/lib/blob'

async function checkAuth(req: NextRequest) {
  return await verifyCookie(req.cookies.get(COOKIE_NAME)?.value)
}

export async function GET() {
  const raw = await blobGet('settings/hero-description.txt')
  return NextResponse.json({ description: raw?.trim() ?? null })
}

export async function PUT(req: NextRequest) {
  if (!await checkAuth(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { description } = await req.json()
  if (typeof description !== 'string')
    return NextResponse.json({ error: 'Invalid body' }, { status: 400 })

  await blobPut('settings/hero-description.txt', description.trim())
  revalidatePath('/')
  return NextResponse.json({ ok: true })
}
