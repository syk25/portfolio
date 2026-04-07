'use client'
import { useEffect, useRef } from 'react'

const SIZE = 420   // display diameter in CSS px

export default function Earth() {
  const wrapRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const wrap = wrapRef.current
    if (!wrap) return

    const onScroll = () => {
      wrap.style.transform = `translateY(${-window.scrollY * 0.45}px)`
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div
      ref={wrapRef}
      aria-hidden="true"
      style={{
        position:      'fixed',
        top:           '8vh',
        right:         '-60px',
        width:         `${SIZE}px`,
        height:        `${SIZE}px`,
        borderRadius:  '50%',
        overflow:      'hidden',
        pointerEvents: 'none',
        zIndex:        2,
        boxShadow: [
          '0 0 55px 20px rgba(60,140,210,0.16)',
          '0 0 110px 50px rgba(30,90,160,0.09)',
        ].join(', '),
      }}
    >
      <img
        src="/earth.jpg"
        alt=""
        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
      />
    </div>
  )
}
