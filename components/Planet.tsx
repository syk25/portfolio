'use client'
import { useEffect, useRef } from 'react'

// NASA full moon photo — public domain, stored locally in /public
const MOON_URL = '/moon.jpg'

const PLANET_SIZE = 1100  // must match the width style below
const MAX_VISIBLE = 200   // px of arc shown at full scroll

export default function Planet() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const update = () => {
      // Use scroll percentage so the effect works regardless of page height.
      // 0% scroll → fully hidden; 100% scroll → MAX_VISIBLE px arc visible.
      const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight)
      const pct = Math.min(1, window.scrollY / maxScroll)
      const offset = PLANET_SIZE - pct * MAX_VISIBLE
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
