'use client'
import { useEffect, useRef } from 'react'

// NASA full moon photo — public domain, stored locally in /public
const MOON_URL = '/moon.jpg'

const PLANET_SIZE   = 1100  // must match the width style below
const MAX_VISIBLE   = 200   // px of arc ever shown above viewport bottom
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
        width:              '1100px',
        aspectRatio:        '1 / 1',
        borderRadius:       '50%',
        pointerEvents:      'none',
        zIndex:             2,
        backgroundImage:    `url(${MOON_URL})`,
        backgroundSize:     'cover',
        backgroundPosition: 'center center',
      }}
    >
    </div>
  )
}
