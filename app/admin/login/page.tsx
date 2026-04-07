'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [error, setError]       = useState('')
  const [loading, setLoading]   = useState(false)

  async function login(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const res = await fetch('/api/auth/login', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ password }),
    })
    if (res.ok) {
      router.push('/admin')
    } else {
      const data = await res.json()
      setError(data.error ?? 'Something went wrong.')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form onSubmit={login} className="bg-space-card border border-ocean-light/15 rounded-2xl p-8 w-full max-w-sm">
        <p className="text-star-gold text-xs tracking-widest uppercase mb-6">✦ Admin</p>
        <h1 className="text-xl font-medium text-ink-primary mb-6">Sign in</h1>
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          autoFocus
          className="w-full bg-space-surface border border-ocean-light/20 rounded-lg px-4 py-2.5 text-sm text-ink-primary placeholder:text-ink-faint focus:outline-none focus:border-ocean-light/50 mb-3"
        />
        {error && <p className="text-red-400 text-xs mb-3">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-star-gold text-[#100c00] text-sm font-medium py-2.5 rounded-lg hover:bg-star-pale transition-colors disabled:opacity-50"
        >
          {loading ? 'Signing in…' : 'Enter'}
        </button>
      </form>
    </div>
  )
}
