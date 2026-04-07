export const COOKIE_NAME = 'admin_session'

async function hmac(secret: string, data: string): Promise<string> {
  const enc = new TextEncoder()
  const key = await crypto.subtle.importKey(
    'raw', enc.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false, ['sign'],
  )
  const sig = await crypto.subtle.sign('HMAC', key, enc.encode(data))
  return Array.from(new Uint8Array(sig))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('')
}

export async function getExpectedToken(): Promise<string> {
  const secret   = process.env.SESSION_SECRET ?? process.env.ADMIN_PASSWORD ?? 'fallback'
  const password = process.env.ADMIN_PASSWORD ?? ''
  return hmac(secret, password)
}

export async function verifyCookie(value: string | undefined): Promise<boolean> {
  if (!value) return false
  const expected = await getExpectedToken()
  if (value.length !== expected.length) return false
  // Constant-time comparison without Node crypto
  let diff = 0
  for (let i = 0; i < expected.length; i++) {
    diff |= value.charCodeAt(i) ^ expected.charCodeAt(i)
  }
  return diff === 0
}
