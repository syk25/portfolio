import createMiddleware from 'next-intl/middleware'
import { routing } from './i18n/routing'
import { NextRequest, NextResponse } from 'next/server'
import { verifyCookie, COOKIE_NAME } from './lib/session'

const handleI18n = createMiddleware(routing)

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  const authed = await verifyCookie(req.cookies.get(COOKIE_NAME)?.value)

  // API content routes
  if (pathname.startsWith('/api/content')) {
    if (!authed) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    return NextResponse.next()
  }

  // Admin pages
  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    if (!authed) return NextResponse.redirect(new URL('/admin/login', req.url))
    return NextResponse.next()
  }

  if (pathname === '/admin/login' && authed) {
    return NextResponse.redirect(new URL('/admin', req.url))
  }

  // Locale routing for everything else
  return handleI18n(req)
}

export const config = {
  matcher: ['/((?!_next|.*\\..*).*)'],
}
