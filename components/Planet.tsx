'use client'
import { useEffect, useRef } from 'react'

export default function Planet() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const SIZE = el.offsetWidth   // actual rendered size

    const onScroll = () => {
      // Planet is fully hidden at scroll=0, rises as user scrolls.
      // Offset: how many px the planet is translated below the viewport.
      // At scroll=0 → offset=SIZE (completely below viewport bottom).
      // Rate 0.28: every 100px scrolled raises planet ~28px.
      // Floor at SIZE*0.38 so planet never covers more than ~62% of its height.
      const offset = Math.max(
        SIZE * 0.38,
        SIZE - window.scrollY * 0.28,
      )
      el.style.transform = `translateX(-50%) translateY(${offset}px)`
    }

    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div
      ref={ref}
      aria-hidden="true"
      style={{
        position:      'fixed',
        bottom:        0,
        left:          '50%',
        width:         'clamp(520px, 85vw, 920px)',
        aspectRatio:   '1 / 1',
        borderRadius:  '50%',
        pointerEvents: 'none',
        zIndex:        2,
        // Earth — lit from upper-left, night side bottom-right
        background: `radial-gradient(
          ellipse at 36% 28%,
          #8fd4f0 0%,
          #5cb8de 7%,
          #4aa87a 17%,
          #38905e 26%,
          #2a7296 38%,
          #1a4d78 52%,
          #0e2d50 67%,
          #050f22 82%,
          #000000 100%
        )`,
        boxShadow: [
          // Night-side shadow (inset, from bottom-right)
          'inset -70px -50px 120px rgba(0,0,0,0.88)',
          // Subtle lit-side highlight
          'inset 18px 14px 50px rgba(255,255,255,0.04)',
          // Atmosphere halo
          '0 0 90px 35px rgba(60,130,200,0.10)',
          '0 0 180px 70px rgba(40,90,150,0.06)',
        ].join(', '),
      }}
    >
      {/* Thin atmosphere rim — slightly blurred ring */}
      <div
        style={{
          position:     'absolute',
          inset:        '-3px',
          borderRadius: '50%',
          boxShadow:    '0 0 18px 6px rgba(100,180,240,0.18)',
          pointerEvents:'none',
        }}
      />
    </div>
  )
}
