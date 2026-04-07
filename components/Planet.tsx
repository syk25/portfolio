'use client'
import { useEffect, useRef } from 'react'

// Real NASA "Blue Marble" (Apollo 17) — public domain via Wikimedia Commons
const EARTH_URL =
  'https://upload.wikimedia.org/wikipedia/commons/thumb/9/97/The_Earth_seen_from_Apollo_17.jpg/1024px-The_Earth_seen_from_Apollo_17.jpg'

const PLANET_SIZE   = 750   // must match the width style below
const MAX_VISIBLE   = 100   // px of arc ever shown above viewport bottom
const SCROLL_RATE   = 0.20  // px of rise per px scrolled

export default function Planet() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const update = () => {
      // offset > 0  → planet pushed below viewport bottom (hidden)
      // floor keeps arc ≤ MAX_VISIBLE px tall, no matter how far user scrolls
      const offset = Math.max(
        PLANET_SIZE - MAX_VISIBLE,
        PLANET_SIZE - window.scrollY * SCROLL_RATE,
      )
      el.style.transform = `translateX(-50%) translateY(${offset}px)`
    }

    update()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    return () => {
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [])

  return (
    <div
      ref={ref}
      aria-hidden="true"
      style={{
        position:           'fixed',
        bottom:             0,
        left:               '50%',
        width:              '750px',
        aspectRatio:        '1 / 1',
        borderRadius:       '50%',
        pointerEvents:      'none',
        zIndex:             2,
        backgroundImage:    `url(${EARTH_URL})`,
        backgroundSize:     'cover',
        backgroundPosition: 'center center',
        boxShadow: [
          // Night-side shadow from bottom-right
          'inset -90px -65px 160px rgba(0,0,0,0.88)',
          // Lit-side micro-highlight
          'inset 24px 18px 70px rgba(255,255,255,0.04)',
          // Atmosphere glow
          '0 0 100px 40px rgba(60,140,210,0.13)',
          '0 0 220px 90px rgba(40,90,160,0.07)',
        ].join(', '),
      }}
    >
      {/* Atmosphere rim ring */}
      <div
        style={{
          position:      'absolute',
          inset:         '-4px',
          borderRadius:  '50%',
          boxShadow:     '0 0 22px 8px rgba(110,190,255,0.20)',
          pointerEvents: 'none',
        }}
      />
    </div>
  )
}
