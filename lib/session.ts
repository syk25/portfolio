import crypto from 'crypto'

const COOKIE_NAME = 'admin_session'

export { COOKIE_NAME }

export function getExpectedToken(): string {
  const secret   = process.env.SESSION_SECRET ?? process.env.ADMIN_PASSWORD ?? 'fallback'
  const password = process.env.ADMIN_PASSWORD ?? ''
  return crypto.createHmac('sha256', secret).update(password).digest('hex')
}

export function verifyCookie(value: string | undefined): boolean {
  if (!value) return false
  const expected = getExpectedToken()
  if (value.length !== expected.length) return false
  try {
    return crypto.timingSafeEqual(Buffer.from(value, 'hex'), Buffer.from(expected, 'hex'))
  } catch {
    return false
  }
}
