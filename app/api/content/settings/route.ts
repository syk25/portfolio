import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { verifyCookie, COOKIE_NAME } from '@/lib/session'
import { getLandingSettings } from '@/lib/content'
import { blobPut } from '@/lib/blob'

async function checkAuth(req: NextRequest) {
  return await verifyCookie(req.cookies.get(COOKIE_NAME)?.value)
}

export async function GET() {
  const settings = await getLandingSettings()
  return NextResponse.json(settings)
}

export async function PUT(req: NextRequest) {
  if (!await checkAuth(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const current = await getLandingSettings()
  const merged = { ...current, ...body }

  await blobPut('settings/landing.json', JSON.stringify(merged))
  revalidatePath('/')
  revalidatePath('/projects')
  revalidatePath('/blog')
  return NextResponse.json({ ok: true })
}
