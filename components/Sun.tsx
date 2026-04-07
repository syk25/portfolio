'use client'
import { useEffect, useRef } from 'react'

export default function Sun() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const update = () => {
      // Fade out as user scrolls past the hero
      const opacity = Math.max(0, 1 - window.scrollY / 480)
      el.style.opacity = String(opacity)
    }

    update()
    window.addEventListener('scroll', update, { passive: true })
    return () => window.removeEventListener('scroll', update)
  }, [])

  return (
    <div
      ref={ref}
      aria-hidden="true"
      style={{
        position:      'fixed',
        top:           '6%',
        right:         '-70px',
        width:         '320px',
        height:        '320px',
        borderRadius:  '50%',
        pointerEvents: 'none',
        zIndex:        2,
        // White-hot core → yellow → deep orange → transparent
        background: `radial-gradient(
          circle at 42% 42%,
          #ffffff        0%,
          #fff8d0        8%,
          #ffd54f       20%,
          #ff9800       38%,
          rgba(255,80,0,0.45) 58%,
          rgba(255,50,0,0.15) 72%,
          transparent   85%
        )`,
        // Corona glow
        boxShadow: [
          '0 0 60px 28px rgba(255,160,30,0.18)',
          '0 0 130px 65px rgba(255,100,0,0.10)',
          '0 0 220px 100px rgba(255,60,0,0.05)',
        ].join(', '),
        filter: 'blur(1.5px)',
      }}
    />
  )
}
