'use client'
import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'

type BlogPost = { slug: string; title: string; date: string; excerpt: string }
type Project  = { slug: string; title: string; date: string; description: string; tags: string[] }
type Tab = 'blog' | 'projects' | 'landing'

export default function AdminPage() {
  const router = useRouter()
  const [tab, setTab]           = useState<Tab>('blog')
  const [posts, setPosts]       = useState<BlogPost[]>([])
  const [projects, setProjects] = useState<Project[]>([])

  // Landing page settings
  const [gnb,         setGnb]         = useState('')
  const [footer,      setFooter]      = useState('')
  const [subheader,   setSubheader]   = useState('')
  const [description, setDescription] = useState('')
  const [saving,      setSaving]      = useState(false)
  const [saved,       setSaved]       = useState(false)

  const fetchContent = useCallback(async () => {
    const [blogRes, projRes] = await Promise.all([
      fetch('/api/content/blog'),
      fetch('/api/content/projects'),
    ])
    if (blogRes.ok) setPosts(await blogRes.json())
    if (projRes.ok) setProjects(await projRes.json())
  }, [])

  const fetchSettings = useCallback(async () => {
    const res = await fetch('/api/content/settings')
    if (res.ok) {
      const data = await res.json()
      setGnb(data.gnb ?? '')
      setFooter(data.footer ?? '')
      setSubheader(data.subheader ?? '')
      setDescription(data.description ?? '')
    }
  }, [])

  useEffect(() => { fetchContent() }, [fetchContent])
  useEffect(() => { fetchSettings() }, [fetchSettings])

  async function signOut() {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/admin/login')
  }

  async function remove(type: 'blog' | 'projects', slug: string, title: string) {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return
    const url = type === 'blog' ? `/api/content/blog/${slug}` : `/api/content/projects/${slug}`
    const res = await fetch(url, { method: 'DELETE' })
    if (res.ok) await fetchContent()
  }

  async function saveLanding() {
    setSaving(true)
    const res = await fetch('/api/content/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ gnb, footer, subheader, description }),
    })
    setSaving(false)
    if (res.ok) {
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    }
  }

  const items = tab === 'blog' ? posts : tab === 'projects' ? projects : []

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
        {(['blog', 'projects', 'landing'] as Tab[]).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-1.5 rounded-md text-sm transition-colors capitalize ${
              tab === t ? 'bg-star-gold text-[#100c00] font-medium' : 'text-ink-muted hover:text-ink-secondary'
            }`}
          >
            {t === 'landing' ? 'Landing Page' : t}
          </button>
        ))}
      </div>

      {/* Landing page tab */}
      {tab === 'landing' && (
        <div className="flex flex-col gap-5">
          {[
            { label: 'GNB',         value: gnb,         set: setGnb,         rows: 1 },
            { label: 'Footer',      value: footer,      set: setFooter,      rows: 1 },
            { label: 'Subheader',   value: subheader,   set: setSubheader,   rows: 1 },
            { label: 'Description', value: description, set: setDescription, rows: 4 },
          ].map(({ label, value, set, rows }) => (
            <div key={label}>
              <p className="text-xs text-ink-faint uppercase tracking-widest mb-2">{label}</p>
              <textarea
                value={value}
                onChange={e => set(e.target.value)}
                rows={rows}
                className="w-full bg-space-card border border-ocean-light/10 rounded-xl px-4 py-3 text-sm text-ink-secondary leading-relaxed resize-y focus:outline-none focus:border-star-gold/40"
              />
            </div>
          ))}
          <div className="flex items-center gap-3">
            <button
              onClick={saveLanding}
              disabled={saving}
              className="text-xs px-4 py-1.5 bg-star-gold text-[#100c00] font-medium rounded-lg hover:bg-star-pale transition-colors disabled:opacity-50"
            >
              {saving ? 'Saving…' : 'Save'}
            </button>
            {saved && <p className="text-xs text-star-gold">Saved</p>}
          </div>
        </div>
      )}

      {/* Content tabs (blog / projects) */}
      {tab !== 'landing' && (
        <>
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
                    onClick={() => remove(tab as 'blog' | 'projects', item.slug, item.title)}
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
        </>
      )}
    </div>
  )
}
