'use client'
import { useState, useRef, useEffect } from 'react'

type Message = { role: 'user' | 'assistant'; content: string }

const DEFAULT_SUGGESTIONS = [
  'What projects have you built?',
  'What do you believe in?',
  "What's your background?",
]

export default function ChatBot() {
  const [open, setOpen]               = useState(false)
  const [messages, setMessages]       = useState<Message[]>([])
  const [input, setInput]             = useState('')
  const [loading, setLoading]         = useState(false)
  const [suggestions, setSuggestions] = useState<string[]>(DEFAULT_SUGGESTIONS)
  const bottomRef                     = useRef<HTMLDivElement>(null)
  const inputRef                      = useRef<HTMLInputElement>(null)

  useEffect(() => {
    fetch('/api/content/chatbot')
      .then(r => r.ok ? r.json() : null)
      .then(data => { if (data?.suggestions?.length) setSuggestions(data.suggestions) })
      .catch(() => {})
  }, [])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  useEffect(() => {
    if (open) inputRef.current?.focus()
  }, [open])

  async function send(text: string) {
    if (!text.trim() || loading) return
    setInput('')

    const next: Message[] = [...messages, { role: 'user', content: text }]
    setMessages(next)
    setLoading(true)

    try {
      const res = await fetch('/api/chat', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ messages: next }),
      })

      if (!res.body) throw new Error('No response body')

      const reader  = res.body.getReader()
      const decoder = new TextDecoder()

      setMessages(prev => [...prev, { role: 'assistant', content: '' }])

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        const chunk = decoder.decode(value)
        setMessages(prev => {
          const updated = [...prev]
          updated[updated.length - 1] = {
            role:    'assistant',
            content: updated[updated.length - 1].content + chunk,
          }
          return updated
        })
      }
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Something went wrong. Please try again.' }])
    } finally {
      setLoading(false)
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    send(input)
  }

  return (
    <div
      className="fixed bottom-6 z-50"
      style={{ right: 'max(calc((100vw - 800px) / 2 - 56px), 8px)' }}
    >
      <div className="relative">

      {/* Chat panel */}
      {open && (
        <div className="absolute bottom-14 right-0 w-80 flex flex-col bg-space-card border border-ocean-light/20 rounded-2xl shadow-2xl overflow-hidden"
          style={{ height: '460px' }}>

          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-ocean-light/10">
            <div>
              <p className="text-sm font-medium text-ink-primary">Ask me anything</p>
              <p className="text-[11px] text-ink-faint">About this portfolio</p>
            </div>
            <button onClick={() => setOpen(false)}
              className="text-ink-faint hover:text-ink-secondary transition-colors text-lg leading-none">
              ×
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-3">
            {messages.length === 0 && (
              <div className="flex flex-col gap-2 mt-2">
                <p className="text-xs text-ink-faint mb-1">Try asking:</p>
                {suggestions.map(s => (
                  <button key={s} onClick={() => send(s)}
                    className="text-left text-xs px-3 py-2 rounded-lg border border-ocean-light/15 text-ink-muted hover:border-ocean-light/35 hover:text-ink-secondary transition-colors">
                    {s}
                  </button>
                ))}
              </div>
            )}

            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] px-3 py-2 rounded-xl text-[13px] leading-relaxed whitespace-pre-wrap ${
                  m.role === 'user'
                    ? 'bg-star-gold text-[#100c00]'
                    : 'bg-space-surface border border-ocean-light/10 text-ink-secondary'
                }`}>
                  {m.content}
                  {m.role === 'assistant' && m.content === '' && (
                    <span className="inline-block w-1 h-3 bg-ocean-light/60 animate-pulse ml-0.5" />
                  )}
                </div>
              </div>
            ))}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <form onSubmit={handleSubmit}
            className="flex items-center gap-2 px-3 py-3 border-t border-ocean-light/10">
            <input
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Ask something…"
              disabled={loading}
              className="flex-1 bg-space-surface border border-ocean-light/15 rounded-lg px-3 py-2 text-sm text-ink-primary placeholder:text-ink-faint focus:outline-none focus:border-ocean-light/40 disabled:opacity-50"
            />
            <button type="submit" disabled={loading || !input.trim()}
              className="w-8 h-8 flex items-center justify-center rounded-lg bg-star-gold text-[#100c00] hover:bg-star-pale transition-colors disabled:opacity-40 flex-shrink-0 text-sm">
              ↑
            </button>
          </form>
        </div>
      )}

      {/* Toggle button */}
      <button
        onClick={() => setOpen(o => !o)}
        className="w-12 h-12 rounded-full bg-star-gold text-[#100c00] flex items-center justify-center shadow-lg hover:bg-star-pale transition-colors text-lg"
      >
        {open ? '×' : '◆'}
      </button>

      </div>
    </div>
  )
}
