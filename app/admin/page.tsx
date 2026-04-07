'use client'
import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'

type BlogPost    = { slug: string; title: string; date: string; excerpt: string; hidden: boolean }
type Project     = { slug: string; title: string; date: string; description: string; tags: string[]; hidden: boolean }
type Tab         = 'blog' | 'projects' | 'landing'
type SectionKey  = 'projects' | 'story' | 'social' | 'blog'
type SocialLink  = { icon: string; label: string; sub: string; href: string; hidden: boolean }

const SECTION_LABELS: Record<SectionKey, string> = {
  projects: 'Projects',
  story:    'My Story',
  social:   'Find Me',
  blog:     'Latest Thoughts',
}

const DEFAULT_SECTION_ORDER: SectionKey[] = ['projects', 'story', 'social', 'blog']

const DEFAULT_SOCIAL_LINKS: SocialLink[] = [
  { icon: 'yt', label: 'YouTube',  sub: 'My channel — thoughts on tech and life', href: 'https://youtube.com',  hidden: false },
  { icon: 'in', label: 'LinkedIn', sub: 'Professional background and experience',  href: 'https://linkedin.com', hidden: false },
  { icon: 'gh', label: 'GitHub',   sub: 'Open source and personal experiments',    href: 'https://github.com',   hidden: false },
]

export default function AdminPage() {
  const router = useRouter()
  const [tab, setTab]           = useState<Tab>('blog')
  const [posts, setPosts]       = useState<BlogPost[]>([])
  const [projects, setProjects] = useState<Project[]>([])

  // Landing page settings
  const [gnb,          setGnb]          = useState('')
  const [footer,       setFooter]       = useState('')
  const [subheader,    setSubheader]    = useState('')
  const [heroSubtitle, setHeroSubtitle] = useState('')
  const [description,  setDescription]  = useState('')
  const [sectionOrder, setSectionOrder] = useState<SectionKey[]>(DEFAULT_SECTION_ORDER)
  const [socialLinks,  setSocialLinks]  = useState<SocialLink[]>(DEFAULT_SOCIAL_LINKS)
  const [saving,       setSaving]       = useState(false)
  const [saved,        setSaved]        = useState(false)

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
      setHeroSubtitle(data.heroSubtitle ?? '')
      setDescription(data.description ?? '')
      setSectionOrder(data.sectionOrder ?? DEFAULT_SECTION_ORDER)
      setSocialLinks(data.socialLinks ?? DEFAULT_SOCIAL_LINKS)
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

  async function toggleHidden(type: 'blog' | 'projects', slug: string) {
    const url = type === 'blog' ? `/api/content/blog/${slug}` : `/api/content/projects/${slug}`
    const res = await fetch(url, { method: 'PATCH' })
    if (res.ok) await fetchContent()
  }

  function moveSection(index: number, dir: -1 | 1) {
    const next = [...sectionOrder]
    const swap = index + dir
    if (swap < 0 || swap >= next.length) return
    ;[next[index], next[swap]] = [next[swap], next[index]]
    setSectionOrder(next)
  }

  function updateSocialLink(index: number, field: keyof SocialLink, value: string | boolean) {
    setSocialLinks(prev => prev.map((l, i) => i === index ? { ...l, [field]: value } : l))
  }

  async function saveLanding() {
    setSaving(true)
    const res = await fetch('/api/content/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ gnb, footer, subheader, heroSubtitle, description, sectionOrder, socialLinks }),
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
          <p className="text-star-gold text-xs tracking-widest uppercase mb-1">◆ Admin</p>
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
        <div className="flex flex-col gap-8">

          {/* Text fields */}
          <div className="flex flex-col gap-5">
            <p className="text-xs text-ink-faint uppercase tracking-widest">Text Content</p>
            {[
              { label: 'GNB',           value: gnb,          set: setGnb,          rows: 1 },
              { label: 'Footer',        value: footer,       set: setFooter,       rows: 1 },
              { label: 'Subheader',     value: subheader,    set: setSubheader,    rows: 1 },
              { label: 'Hero Subtitle', value: heroSubtitle, set: setHeroSubtitle, rows: 1 },
              { label: 'Description',   value: description,  set: setDescription,  rows: 4 },
            ].map(({ label, value, set, rows }) => (
              <div key={label}>
                <p className="text-xs text-ink-faint mb-2">{label}</p>
                <textarea
                  value={value}
                  onChange={e => set(e.target.value)}
                  rows={rows}
                  className="w-full bg-space-card border border-ocean-light/10 rounded-xl px-4 py-3 text-sm text-ink-secondary leading-relaxed resize-y focus:outline-none focus:border-star-gold/40"
                />
              </div>
            ))}
          </div>

          <hr className="border-ocean-dim/20" />

          {/* Section order */}
          <div className="flex flex-col gap-3">
            <p className="text-xs text-ink-faint uppercase tracking-widest">Section Order</p>
            <div className="flex flex-col gap-2">
              {sectionOrder.map((key, i) => (
                <div key={key} className="flex items-center justify-between px-4 py-3 bg-space-card border border-ocean-light/10 rounded-xl">
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-ink-faint w-4">{i + 1}</span>
                    <p className="text-sm text-ink-secondary">{SECTION_LABELS[key]}</p>
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={() => moveSection(i, -1)}
                      disabled={i === 0}
                      className="w-7 h-7 flex items-center justify-center rounded-lg border border-ocean-light/20 text-ink-muted hover:border-ocean-light/40 hover:text-ink-secondary transition-colors disabled:opacity-25 disabled:cursor-not-allowed text-xs"
                    >
                      ↑
                    </button>
                    <button
                      onClick={() => moveSection(i, 1)}
                      disabled={i === sectionOrder.length - 1}
                      className="w-7 h-7 flex items-center justify-center rounded-lg border border-ocean-light/20 text-ink-muted hover:border-ocean-light/40 hover:text-ink-secondary transition-colors disabled:opacity-25 disabled:cursor-not-allowed text-xs"
                    >
                      ↓
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <hr className="border-ocean-dim/20" />

          {/* Find Me links */}
          <div className="flex flex-col gap-3">
            <p className="text-xs text-ink-faint uppercase tracking-widest">Find Me Links</p>
            <div className="flex flex-col gap-3">
              {socialLinks.map((link, i) => (
                <div
                  key={link.icon}
                  className={`px-4 py-4 bg-space-card border border-ocean-light/10 rounded-xl flex flex-col gap-3 transition-opacity ${link.hidden ? 'opacity-50' : ''}`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono px-2 py-0.5 rounded bg-ocean-light/10 text-ink-faint">{link.icon}</span>
                      {link.hidden && <span className="text-[10px] px-1.5 py-0.5 rounded bg-ocean-light/10 text-ink-faint">hidden</span>}
                    </div>
                    <button
                      onClick={() => updateSocialLink(i, 'hidden', !link.hidden)}
                      className="text-xs px-3 py-1.5 border border-ocean-light/20 text-ink-muted rounded-lg hover:border-ocean-light/40 hover:text-ink-secondary transition-colors"
                    >
                      {link.hidden ? 'Show' : 'Hide'}
                    </button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {[
                      { field: 'label', placeholder: 'Label' },
                      { field: 'sub',   placeholder: 'Subtitle' },
                      { field: 'href',  placeholder: 'URL' },
                    ].map(({ field, placeholder }) => (
                      <input
                        key={field}
                        value={link[field as keyof SocialLink] as string}
                        onChange={e => updateSocialLink(i, field as keyof SocialLink, e.target.value)}
                        placeholder={placeholder}
                        className="bg-space-surface border border-ocean-light/15 rounded-lg px-3 py-2 text-sm text-ink-secondary placeholder:text-ink-faint focus:outline-none focus:border-star-gold/40"
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

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
          <div className="flex justify-between items-center mb-3">
            <p className="text-xs text-ink-faint">{items.length} {tab === 'blog' ? 'posts' : 'projects'}</p>
            <button
              onClick={() => router.push(`/admin/${tab}/new`)}
              className="text-xs px-4 py-1.5 bg-star-gold text-[#100c00] font-medium rounded-lg hover:bg-star-pale transition-colors"
            >
              + New
            </button>
          </div>

          <div className="flex flex-col gap-2">
            {items.map(item => (
              <div
                key={item.slug}
                className={`flex items-center justify-between px-4 py-3 bg-space-card border rounded-xl transition-opacity ${
                  item.hidden ? 'border-ocean-light/5 opacity-50' : 'border-ocean-light/10'
                }`}
              >
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-ink-secondary">{item.title || item.slug}</p>
                    {item.hidden && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-ocean-light/10 text-ink-faint">hidden</span>
                    )}
                  </div>
                  <p className="text-xs text-ink-faint mt-0.5">{item.slug} · {item.date}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => toggleHidden(tab as 'blog' | 'projects', item.slug)}
                    className="text-xs px-3 py-1.5 border border-ocean-light/20 text-ink-muted rounded-lg hover:border-ocean-light/40 hover:text-ink-secondary transition-colors"
                  >
                    {item.hidden ? 'Show' : 'Hide'}
                  </button>
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
