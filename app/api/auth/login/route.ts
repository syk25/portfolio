import { NextRequest, NextResponse } from 'next/server'
import { getExpectedToken, COOKIE_NAME } from '@/lib/session'

// In-memory rate limiter — good enough for a personal portfolio
const attempts = new Map<string, { count: number; resetAt: number }>()
const MAX_ATTEMPTS = 5
const WINDOW_MS    = 60_000 // 1 minute

function getIP(req: NextRequest): string {
  return req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown'
}

function isRateLimited(ip: string): boolean {
  const now   = Date.now()
  const entry = attempts.get(ip)
  if (!entry || now > entry.resetAt) {
    attempts.set(ip, { count: 1, resetAt: now + WINDOW_MS })
    return false
  }
  if (entry.count >= MAX_ATTEMPTS) return true
  entry.count++
  return false
}

export async function POST(req: NextRequest) {
  const ip = getIP(req)

  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: 'Too many attempts. Try again in a minute.' },
      { status: 429 },
    )
  }

  const { password } = await req.json()

  if (password !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: 'Incorrect password.' }, { status: 401 })
  }

  attempts.delete(ip) // clear on success

  const res = NextResponse.json({ ok: true })
  res.cookies.set(COOKIE_NAME, getExpectedToken(), {
    httpOnly: true,
    secure:   process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge:   60 * 60 * 24, // 24 hours
    path:     '/',
  })
  return res
}
