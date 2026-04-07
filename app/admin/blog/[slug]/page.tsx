'use client'
import { useState, useEffect, use } from 'react'
import { useRouter } from 'next/navigation'
import { getStoredPassword } from '@/lib/auth'

type Form = { slug: string; title: string; date: string; excerpt: string; content: string }
const empty = (): Form => ({ slug: '', title: '', date: '', excerpt: '', content: '' })

export default function BlogEditPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params)
  const isNew    = slug === 'new'
  const router   = useRouter()

  const [form, setForm]     = useState<Form>(empty())
  const [saving, setSaving] = useState(false)
  const [error, setError]   = useState('')
  const [loaded, setLoaded] = useState(isNew)
  useEffect(() => {
    if (isNew) return
    const pw = getStoredPassword()
    fetch(`/api/content/blog/${slug}`, { headers: { 'x-admin-password': pw } })
      .then(r => r.json())
      .then(data => {
        setForm({
          slug:    data.slug    ?? slug,
          title:   data.title   ?? '',
          date:    data.date    ?? '',
          excerpt: data.excerpt ?? '',
          content: data.content ?? '',
        })
        setLoaded(true)
      })
  }, [slug, isNew])


  async function save(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError('')
    const pw     = getStoredPassword()
    const url    = isNew ? '/api/content/blog' : `/api/content/blog/${slug}`
    const method = isNew ? 'POST' : 'PUT'
    const res    = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json', 'x-admin-password': pw },
      body: JSON.stringify(form),
    })
    if (res.ok) {
      router.push('/admin')
    } else {
      const data = await res.json()
      setError(data.error ?? 'Something went wrong')
    }
    setSaving(false)
  }

  if (!loaded) {
    return <div className="max-w-content mx-auto px-6 py-10 text-ink-faint text-sm">Loading…</div>
  }

  return (
    <div className="max-w-content mx-auto px-6 py-10">
      <div className="mb-8">
        <button onClick={() => router.push('/admin')} className="text-xs text-ink-faint hover:text-ink-secondary transition-colors mb-4 block">
          ← Back to list
        </button>
        <p className="text-star-gold text-xs tracking-widest uppercase mb-1">✦ Admin · Blog</p>
        <h1 className="text-2xl font-medium text-ink-primary">
          {isNew ? 'New post' : `Editing — ${slug}`}
        </h1>
      </div>

      <form onSubmit={save} className="flex flex-col gap-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {isNew && (
            <Field label="Slug" required>
              <input
                value={form.slug}
                onChange={e => setForm(f => ({ ...f, slug: e.target.value }))}
                placeholder="my-post-slug"
                pattern="[a-z0-9-]+"
                required
              />
            </Field>
          )}
          <Field label="Title" required>
            <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} required />
          </Field>
          <Field label="Date" required>
            <input
              value={form.date}
              onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
              placeholder="2026.04.07"
              required
            />
          </Field>
          <Field label="Excerpt" className="sm:col-span-2">
            <input value={form.excerpt} onChange={e => setForm(f => ({ ...f, excerpt: e.target.value }))} />
          </Field>
        </div>

        <div>
          <label className="block text-xs text-ink-faint mb-1.5">Content (Markdown)</label>
          <textarea
            value={form.content}
            onChange={e => setForm(f => ({ ...f, content: e.target.value }))}
            className="w-full bg-space-surface border border-ocean-light/20 rounded-lg px-3 py-2.5 text-sm font-mono text-ink-primary placeholder:text-ink-faint focus:outline-none focus:border-ocean-light/50 resize-none"
            style={{ minHeight: '300px', fieldSizing: 'content' } as React.CSSProperties}
          />
        </div>

        {error && <p className="text-red-400 text-xs">{error}</p>}

        <div className="flex gap-2 pt-2">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 bg-star-gold text-[#100c00] text-sm font-medium rounded-lg hover:bg-star-pale transition-colors disabled:opacity-50"
          >
            {saving ? 'Saving…' : 'Save'}
          </button>
          <button
            type="button"
            onClick={() => router.push('/admin')}
            className="px-6 py-2.5 border border-ocean-light/20 text-sm text-ink-muted rounded-lg hover:border-ocean-light/40 transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}

function Field({
  label, children, className = '', required = false,
}: {
  label: string; children: React.ReactElement; className?: string; required?: boolean
}) {
  const child = children as React.ReactElement<React.InputHTMLAttributes<HTMLInputElement> & React.TextareaHTMLAttributes<HTMLTextAreaElement>>
  const isTextarea = child.type === 'textarea'
  const baseClass = 'w-full bg-space-surface border border-ocean-light/20 rounded-lg px-3 py-2.5 text-sm text-ink-primary placeholder:text-ink-faint focus:outline-none focus:border-ocean-light/50'

  return (
    <div className={className}>
      <label className="block text-xs text-ink-faint mb-1.5">
        {label}{required && <span className="text-star-gold ml-0.5">*</span>}
      </label>
      {isTextarea
        ? <textarea {...(child.props as React.TextareaHTMLAttributes<HTMLTextAreaElement>)} className={`${baseClass} resize-y ${child.props.className ?? ''}`} />
        : <input   {...(child.props as React.InputHTMLAttributes<HTMLInputElement>)}         className={`${baseClass} ${child.props.className ?? ''}`} />
      }
    </div>
  )
}
