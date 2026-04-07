import { NextRequest, NextResponse } from 'next/server'
import { verifyCookie, COOKIE_NAME } from './lib/session'

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  const authed = verifyCookie(req.cookies.get(COOKIE_NAME)?.value)

  // API content routes — return 401 if not authenticated
  if (pathname.startsWith('/api/content')) {
    if (!authed) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    return NextResponse.next()
  }

  // Admin pages — redirect to login if not authenticated
  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    if (!authed) return NextResponse.redirect(new URL('/admin/login', req.url))
    return NextResponse.next()
  }

  // Already authenticated — skip login page
  if (pathname === '/admin/login' && authed) {
    return NextResponse.redirect(new URL('/admin', req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*', '/api/content/:path*'],
}
