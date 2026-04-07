'use client'
import { useEffect, useRef } from 'react'

const SIZE = 400   // display diameter in CSS px

export default function Earth() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const wrapRef   = useRef<HTMLDivElement>(null)
  const rafRef    = useRef<number>(0)

  useEffect(() => {
    const canvas = canvasRef.current
    const wrap   = wrapRef.current
    if (!canvas || !wrap) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // HiDPI — keeps the globe crisp on retina screens
    const dpr = window.devicePixelRatio || 1
    canvas.width  = SIZE * dpr
    canvas.height = SIZE * dpr
    ctx.scale(dpr, dpr)

    // Move Earth upward as user scrolls (parallax — no fade)
    const onScroll = () => {
      wrap.style.transform = `translateY(${-window.scrollY * 0.45}px)`
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })

    // Load equirectangular texture and spin it
    const img = new Image()
    img.src = '/earth-equirect.jpg'

    let offsetX = 0

    const render = () => {
      ctx.clearRect(0, 0, SIZE, SIZE)

      // --- clip everything to a perfect circle ---
      ctx.save()
      ctx.beginPath()
      ctx.arc(SIZE / 2, SIZE / 2, SIZE / 2, 0, Math.PI * 2)
      ctx.clip()

      if (img.complete && img.naturalWidth > 0) {
        // Scale texture so its height == SIZE; width stays proportional (≈2×SIZE for 2:1 maps)
        const scale = SIZE / img.naturalHeight
        const dw    = img.naturalWidth * scale
        const x     = -(offsetX % dw)

        // Draw two copies side-by-side so the seam is always invisible
        ctx.drawImage(img, x,      0, dw, SIZE)
        ctx.drawImage(img, x + dw, 0, dw, SIZE)

        offsetX += 0.35   // ~38s per full revolution at 60 fps
      }

      // Night-side vignette — darkens the left-bottom rim so it reads as a sphere
      const shadow = ctx.createRadialGradient(
        SIZE * 0.62, SIZE * 0.38, SIZE * 0.05,
        SIZE * 0.50, SIZE * 0.50, SIZE * 0.50,
      )
      shadow.addColorStop(0,    'transparent')
      shadow.addColorStop(0.55, 'transparent')
      shadow.addColorStop(1,    'rgba(0,8,22,0.60)')
      ctx.fillStyle = shadow
      ctx.fillRect(0, 0, SIZE, SIZE)

      ctx.restore()
      // -------------------------------------------

      rafRef.current = requestAnimationFrame(render)
    }

    img.onload  = render
    img.onerror = render   // still start the loop even if image 404s

    return () => {
      cancelAnimationFrame(rafRef.current)
      window.removeEventListener('scroll', onScroll)
    }
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
        pointerEvents: 'none',
        zIndex:        2,
        // Atmosphere halo around the globe
        boxShadow: [
          '0 0 55px 20px rgba(60,140,210,0.16)',
          '0 0 110px 50px rgba(30,90,160,0.09)',
        ].join(', '),
      }}
    >
      <canvas
        ref={canvasRef}
        style={{ display: 'block', width: `${SIZE}px`, height: `${SIZE}px` }}
      />
    </div>
  )
}
