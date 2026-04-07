'use client'
import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'

type BlogPost    = { slug: string; title: string; date: string; excerpt: string; hidden: boolean }
type Project     = { slug: string; title: string; date: string; description: string; tags: string[]; hidden: boolean }
type Tab         = 'blog' | 'projects' | 'landing' | 'chatbot'
type SectionKey  = 'projects' | 'story' | 'social' | 'blog'
type SocialLink  = { icon: string; label: string; sub: string; href: string; hidden: boolean }
type StoryItem   = { title: string; body: string }
type ChipLink    = { label: string; href: string }

const SECTION_LABELS: Record<SectionKey, string> = {
  projects: 'Projects',
  story:    'My Story',
  social:   'Find Me',
  blog:     'Latest Thoughts',
}

const DEFAULT_SECTION_ORDER: SectionKey[] = ['projects', 'story', 'blog']

const DEFAULT_SOCIAL_LINKS: SocialLink[] = [
  { icon: 'yt', label: 'YouTube',  sub: 'My channel — thoughts on tech and life', href: 'https://youtube.com',  hidden: false },
  { icon: 'in', label: 'LinkedIn', sub: 'Professional background and experience',  href: 'https://linkedin.com', hidden: false },
  { icon: 'gh', label: 'GitHub',   sub: 'Open source and personal experiments',    href: 'https://github.com',   hidden: false },
]

const DEFAULT_STORY_ITEMS: StoryItem[] = [
  { title: 'University',      body: 'Where I learned to think in systems and ask why before how.' },
  { title: 'Kenya',           body: 'Where I learned that technology only matters if it reaches real people.' },
  { title: 'What I believe',  body: "Warmth and rigor aren't opposites. The best solutions have both." },
  { title: 'Building toward', body: 'A world where good engineering quietly makes life better.' },
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
  const [storyItems,          setStoryItems]          = useState<StoryItem[]>(DEFAULT_STORY_ITEMS)
  const [chipLinks,           setChipLinks]           = useState<ChipLink[]>([])
  const [customInstructions,  setCustomInstructions]  = useState('')
  const [chatSuggestions,     setChatSuggestions]     = useState<string[]>(['What projects have you built?', "What do you believe in?", "What's your background?"])
  const [saving,              setSaving]              = useState(false)
  const [saved,               setSaved]               = useState(false)
  const [settingsLoaded,      setSettingsLoaded]      = useState(false)
  const [chatbotLoaded,       setChatbotLoaded]       = useState(false)

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
      setStoryItems(data.storyItems ?? DEFAULT_STORY_ITEMS)
      setChipLinks(data.chipLinks ?? [])
      setSettingsLoaded(true)
    }
  }, [])

  const fetchChatbot = useCallback(async () => {
    const res = await fetch('/api/content/chatbot')
    if (res.ok) {
      const data = await res.json()
      setCustomInstructions(data.customInstructions ?? '')
      if (data.suggestions?.length) setChatSuggestions(data.suggestions)
      setChatbotLoaded(true)
    }
  }, [])

  useEffect(() => { fetchContent() }, [fetchContent])
  useEffect(() => { fetchSettings() }, [fetchSettings])
  useEffect(() => { fetchChatbot() }, [fetchChatbot])

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

  async function saveLanding() {
    setSaving(true)
    const res = await fetch('/api/content/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ gnb, footer, subheader, heroSubtitle, description, sectionOrder, socialLinks, storyItems, chipLinks }),
    })
    setSaving(false)
    if (res.ok) {
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    }
  }

  async function saveChatbot() {
    setSaving(true)
    const res = await fetch('/api/content/chatbot', {
      method:  'PUT',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ customInstructions, suggestions: chatSuggestions }),
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
        {(['blog', 'projects', 'landing', 'chatbot'] as Tab[]).map(t => (
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

          {/* Hero Chips */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-ink-faint uppercase tracking-widest">Hero Chips</p>
                <p className="text-[11px] text-ink-faint mt-0.5">Shown as buttons next to "View Projects" in the hero.</p>
              </div>
              <button
                onClick={() => setChipLinks(prev => [...prev, { label: '', href: '' }])}
                className="text-xs px-3 py-1.5 border border-ocean-light/20 text-ink-muted rounded-lg hover:border-ocean-light/40 hover:text-ink-secondary transition-colors shrink-0"
              >
                + Add chip
              </button>
            </div>
            {chipLinks.length > 0 && (
              <div className="flex flex-col gap-2">
                {chipLinks.map((chip, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <input
                      value={chip.label}
                      onChange={e => setChipLinks(prev => prev.map((c, j) => j === i ? { ...c, label: e.target.value } : c))}
                      placeholder="Label"
                      className="w-32 shrink-0 bg-space-card border border-ocean-light/10 rounded-lg px-3 py-2 text-sm text-ink-secondary placeholder:text-ink-faint focus:outline-none focus:border-star-gold/40"
                    />
                    <input
                      value={chip.href}
                      onChange={e => setChipLinks(prev => prev.map((c, j) => j === i ? { ...c, href: e.target.value } : c))}
                      placeholder="URL or mailto: or tel:"
                      className="flex-1 bg-space-card border border-ocean-light/10 rounded-lg px-3 py-2 text-sm text-ink-secondary placeholder:text-ink-faint focus:outline-none focus:border-star-gold/40"
                    />
                    <button
                      onClick={() => setChipLinks(prev => prev.filter((_, j) => j !== i))}
                      className="text-xs px-3 py-2 border border-red-500/30 text-red-400/70 rounded-lg hover:border-red-500/50 hover:text-red-400 transition-colors shrink-0"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <hr className="border-ocean-dim/20" />

          {/* My Story */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <p className="text-xs text-ink-faint uppercase tracking-widest">My Story</p>
              <button
                onClick={() => setStoryItems(prev => [...prev, { title: '', body: '' }])}
                className="text-xs px-3 py-1.5 border border-ocean-light/20 text-ink-muted rounded-lg hover:border-ocean-light/40 hover:text-ink-secondary transition-colors"
              >
                + Add card
              </button>
            </div>
            <div className="flex flex-col gap-3">
              {storyItems.map((item, i) => (
                <div key={i} className="px-4 py-4 bg-space-card border border-ocean-light/10 rounded-xl flex flex-col gap-2">
                  <div className="flex items-center justify-between gap-2">
                    <input
                      value={item.title}
                      onChange={e => setStoryItems(prev => prev.map((s, j) => j === i ? { ...s, title: e.target.value } : s))}
                      placeholder="Title"
                      className="flex-1 bg-space-surface border border-ocean-light/15 rounded-lg px-3 py-2 text-sm text-ink-secondary placeholder:text-ink-faint focus:outline-none focus:border-star-gold/40"
                    />
                    <button
                      onClick={() => setStoryItems(prev => prev.filter((_, j) => j !== i))}
                      className="text-xs px-3 py-2 border border-red-500/30 text-red-400/70 rounded-lg hover:border-red-500/50 hover:text-red-400 transition-colors shrink-0"
                    >
                      Remove
                    </button>
                  </div>
                  <textarea
                    value={item.body}
                    onChange={e => setStoryItems(prev => prev.map((s, j) => j === i ? { ...s, body: e.target.value } : s))}
                    placeholder="Body"
                    rows={2}
                    className="w-full bg-space-surface border border-ocean-light/15 rounded-lg px-3 py-2 text-sm text-ink-secondary placeholder:text-ink-faint leading-relaxed resize-y focus:outline-none focus:border-star-gold/40"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={saveLanding}
              disabled={saving || !settingsLoaded}
              className="text-xs px-4 py-1.5 bg-star-gold text-[#100c00] font-medium rounded-lg hover:bg-star-pale transition-colors disabled:opacity-50"
            >
              {saving ? 'Saving…' : !settingsLoaded ? 'Loading…' : 'Save'}
            </button>
            {saved && <p className="text-xs text-star-gold">Saved</p>}
          </div>
        </div>
      )}

      {/* Chatbot tab */}
      {tab === 'chatbot' && (
        <div className="flex flex-col gap-8">

          {/* Custom Instructions */}
          <div className="flex flex-col gap-3">
            <div>
              <p className="text-xs text-ink-faint uppercase tracking-widest">Custom Instructions</p>
              <p className="text-[11px] text-ink-faint mt-0.5">Appended to the auto-built prompt. Tell the bot how to behave, what tone to use, what to avoid, etc.</p>
            </div>
            <textarea
              value={customInstructions}
              onChange={e => setCustomInstructions(e.target.value)}
              rows={8}
              placeholder={"e.g. Always be upbeat and enthusiastic. Mention that Seyoun is open to freelance work. Never discuss competitors."}
              className="w-full bg-space-card border border-ocean-light/10 rounded-xl px-4 py-3 text-sm text-ink-secondary leading-relaxed placeholder:text-ink-faint/50 resize-y focus:outline-none focus:border-star-gold/40"
            />
          </div>

          <hr className="border-ocean-dim/20" />

          {/* Suggestions */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-ink-faint uppercase tracking-widest">Suggestion Chips</p>
                <p className="text-[11px] text-ink-faint mt-0.5">Quick-reply buttons shown when the chat is empty.</p>
              </div>
              <button
                onClick={() => setChatSuggestions(prev => [...prev, ''])}
                className="text-xs px-3 py-1.5 border border-ocean-light/20 text-ink-muted rounded-lg hover:border-ocean-light/40 hover:text-ink-secondary transition-colors shrink-0"
              >
                + Add
              </button>
            </div>
            <div className="flex flex-col gap-2">
              {chatSuggestions.map((s, i) => (
                <div key={i} className="flex items-center gap-2">
                  <input
                    value={s}
                    onChange={e => setChatSuggestions(prev => prev.map((x, j) => j === i ? e.target.value : x))}
                    placeholder="Suggestion text…"
                    className="flex-1 bg-space-card border border-ocean-light/10 rounded-lg px-3 py-2 text-sm text-ink-secondary placeholder:text-ink-faint focus:outline-none focus:border-star-gold/40"
                  />
                  <button
                    onClick={() => setChatSuggestions(prev => prev.filter((_, j) => j !== i))}
                    className="text-xs px-3 py-2 border border-red-500/30 text-red-400/70 rounded-lg hover:border-red-500/50 hover:text-red-400 transition-colors shrink-0"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={saveChatbot}
              disabled={saving || !chatbotLoaded}
              className="text-xs px-4 py-1.5 bg-star-gold text-[#100c00] font-medium rounded-lg hover:bg-star-pale transition-colors disabled:opacity-50"
            >
              {saving ? 'Saving…' : !chatbotLoaded ? 'Loading…' : 'Save'}
            </button>
            {saved && <p className="text-xs text-star-gold">Saved</p>}
          </div>
        </div>
      )}

      {/* Content tabs (blog / projects) */}
      {tab !== 'landing' && tab !== 'chatbot' && (
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
