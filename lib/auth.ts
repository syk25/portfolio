export const AUTH_KEY = 'admin_pw'

export function getStoredPassword(): string {
  if (typeof window === 'undefined') return ''
  return sessionStorage.getItem(AUTH_KEY) ?? ''
}

export function storePassword(pw: string) {
  sessionStorage.setItem(AUTH_KEY, pw)
}

export function clearPassword() {
  sessionStorage.removeItem(AUTH_KEY)
}
