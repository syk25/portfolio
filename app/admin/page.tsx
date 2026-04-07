'use client'
import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { getStoredPassword, storePassword, clearPassword } from '@/lib/auth'

type BlogPost = { slug: string; title: string; date: string; excerpt: string }
type Project  = { slug: string; title: string; date: string; description: string; tags: string[] }
type Tab = 'blog' | 'projects'

export default function AdminPage() {
  const router = useRouter()
  const [password, setPassword]   = useState('')
  const [authed, setAuthed]       = useState(false)
  const [authError, setAuthError] = useState(false)
  const [tab, setTab]             = useState<Tab>('blog')
  const [posts, setPosts]         = useState<BlogPost[]>([])
  const [projects, setProjects]   = useState<Project[]>([])

  const fetchContent = useCallback(async (pw: string) => {
    const [blogRes, projRes] = await Promise.all([
      fetch('/api/content/blog',     { headers: { 'x-admin-password': pw } }),
      fetch('/api/content/projects', { headers: { 'x-admin-password': pw } }),
    ])
    if (blogRes.ok) setPosts(await blogRes.json())
    if (projRes.ok) setProjects(await projRes.json())
  }, [])

  // Auto-login if password is in sessionStorage
  useEffect(() => {
    const stored = getStoredPassword()
    if (!stored) return
    fetch('/api/content/blog', { headers: { 'x-admin-password': stored } })
      .then(res => {
        if (res.ok) {
          setAuthed(true)
          fetchContent(stored)
        } else {
          clearPassword()
        }
      })
  }, [fetchContent])

  async function login(e: React.FormEvent) {
    e.preventDefault()
    const res = await fetch('/api/content/blog', { headers: { 'x-admin-password': password } })
    if (res.ok) {
      storePassword(password)
      setAuthed(true)
      setAuthError(false)
      await fetchContent(password)
    } else {
      setAuthError(true)
    }
  }

  function signOut() {
    clearPassword()
    setAuthed(false)
    setPassword('')
  }

  async function remove(type: Tab, slug: string, title: string) {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return
    const pw  = getStoredPassword()
    const url = type === 'blog' ? `/api/content/blog/${slug}` : `/api/content/projects/${slug}`
    const res = await fetch(url, { method: 'DELETE', headers: { 'x-admin-password': pw } })
    if (res.ok) await fetchContent(pw)
  }

  if (!authed) {
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
            className="w-full bg-space-surface border border-ocean-light/20 rounded-lg px-4 py-2.5 text-sm text-ink-primary placeholder:text-ink-faint focus:outline-none focus:border-ocean-light/50 mb-3"
          />
          {authError && <p className="text-red-400 text-xs mb-3">Incorrect password.</p>}
          <button
            type="submit"
            className="w-full bg-star-gold text-[#100c00] text-sm font-medium py-2.5 rounded-lg hover:bg-star-pale transition-colors"
          >
            Enter
          </button>
        </form>
      </div>
    )
  }

  const items = tab === 'blog' ? posts : projects

  return (
    <div className="max-w-content mx-auto px-6 py-10">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <p className="text-star-gold text-xs tracking-widest uppercase mb-1">✦ Admin</p>
          <h1 className="text-2xl font-medium text-ink-primary">Content Manager</h1>
        </div>
        <button onClick={signOut} className="text-xs text-ink-faint hover:text-ink-secondary transition-colors">
          Sign out
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 bg-space-surface border border-ocean-light/10 rounded-lg p-1 w-fit">
        {(['blog', 'projects'] as Tab[]).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-1.5 rounded-md text-sm transition-colors capitalize ${
              tab === t ? 'bg-star-gold text-[#100c00] font-medium' : 'text-ink-muted hover:text-ink-secondary'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* List header */}
      <div className="flex justify-between items-center mb-3">
        <p className="text-xs text-ink-faint">{items.length} {tab === 'blog' ? 'posts' : 'projects'}</p>
        <button
          onClick={() => router.push(`/admin/${tab}/new`)}
          className="text-xs px-4 py-1.5 bg-star-gold text-[#100c00] font-medium rounded-lg hover:bg-star-pale transition-colors"
        >
          + New
        </button>
      </div>

      {/* List */}
      <div className="flex flex-col gap-2">
        {items.map(item => (
          <div
            key={item.slug}
            className="flex items-center justify-between px-4 py-3 bg-space-card border border-ocean-light/10 rounded-xl"
          >
            <div>
              <p className="text-sm font-medium text-ink-secondary">{item.title || item.slug}</p>
              <p className="text-xs text-ink-faint mt-0.5">{item.slug} · {item.date}</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => router.push(`/admin/${tab}/${item.slug}`)}
                className="text-xs px-3 py-1.5 border border-ocean-light/20 text-ink-muted rounded-lg hover:border-ocean-light/40 hover:text-ink-secondary transition-colors"
              >
                Edit
              </button>
              <button
                onClick={() => remove(tab, item.slug, item.title)}
                className="text-xs px-3 py-1.5 border border-red-500/30 text-red-400/70 rounded-lg hover:border-red-500/50 hover:text-red-400 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
        {items.length === 0 && (
          <p className="text-sm text-ink-faint text-center py-10">No {tab === 'blog' ? 'posts' : 'projects'} yet.</p>
        )}
      </div>
    </div>
  )
}
