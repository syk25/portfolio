'use client'
import { useState, useEffect, use } from 'react'
import { useRouter } from 'next/navigation'
type Form = {
  slug: string; title: string; description: string; date: string
  tags: string; demo: string; github: string; content: string
}
const empty = (): Form => ({
  slug: '', title: '', description: '', date: '', tags: '', demo: '', github: '', content: '',
})

export default function ProjectEditPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params)
  const isNew    = slug === 'new'
  const router   = useRouter()

  const [form, setForm]     = useState<Form>(empty())
  const [saving, setSaving] = useState(false)
  const [error, setError]   = useState('')
  const [loaded, setLoaded] = useState(isNew)

  useEffect(() => {
    if (isNew) return
    fetch(`/api/content/projects/${slug}`)
      .then(r => r.json())
      .then(data => {
        setForm({
          slug:        data.slug        ?? slug,
          title:       data.title       ?? '',
          description: data.description ?? '',
          date:        data.date        ?? '',
          tags:        (data.tags ?? []).join(', '),
          demo:        data.demo        ?? '',
          github:      data.github      ?? '',
          content:     data.content     ?? '',
        })
        setLoaded(true)
      })
  }, [slug, isNew])

  async function save(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    const url    = isNew ? '/api/content/projects' : `/api/content/projects/${slug}`
    const method = isNew ? 'POST' : 'PUT'
    const body   = {
      slug:        form.slug,
      title:       form.title,
      description: form.description,
      date:        form.date,
      tags:        form.tags.split(',').map(t => t.trim()).filter(Boolean),
      demo:        form.demo,
      github:      form.github,
      content:     form.content,
    }

    if (!isNew) {
      // Optimistic: navigate away immediately, save happens in background
      router.push('/admin')
      fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
      return
    }

    setSaving(true)
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    if (res.ok) {
      router.push('/admin')
    } else {
      const text = await res.text()
      let msg = 'Something went wrong'
      try { msg = JSON.parse(text).error ?? msg } catch { /* non-JSON body */ }
      setError(msg)
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
        <p className="text-star-gold text-xs tracking-widest uppercase mb-1">◆ Admin · Projects</p>
        <h1 className="text-2xl font-medium text-ink-primary">
          {isNew ? 'New project' : `Editing — ${slug}`}
        </h1>
      </div>

      <form onSubmit={save} className="flex flex-col gap-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {isNew && (
            <Field label="Slug" required>
              <input
                value={form.slug}
                onChange={e => setForm(f => ({ ...f, slug: e.target.value }))}
                placeholder="my-project-slug"
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
              placeholder="2026.04 → ongoing"
              required
            />
          </Field>
          <Field label="Description" className="sm:col-span-2">
            <input value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
          </Field>
          <Field label="Tags (comma-separated)">
            <input
              value={form.tags}
              onChange={e => setForm(f => ({ ...f, tags: e.target.value }))}
              placeholder="Next.js, Python, PostgreSQL"
            />
          </Field>
          <Field label="Demo URL">
            <input value={form.demo} onChange={e => setForm(f => ({ ...f, demo: e.target.value }))} type="url" />
          </Field>
          <Field label="GitHub URL">
            <input value={form.github} onChange={e => setForm(f => ({ ...f, github: e.target.value }))} type="url" />
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
