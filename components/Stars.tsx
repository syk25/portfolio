'use client'
import { useEffect, useRef } from 'react'

interface Star {
  x: number
  y: number
  r: number          // core radius
  gold: boolean
  baseOp: number
  op: number
  peakOp: number
  phase: 'idle' | 'brightening' | 'dimming'
}

export default function Stars() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const starsRef  = useRef<Star[]>([])
  const rafRef    = useRef<number>(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const makeStars = () => {
      starsRef.current = Array.from({ length: 180 }, () => {
        const tier = Math.random()
        // core radius tiers
        const r = tier < 0.10
          ? Math.random() * 1.6 + 2.4   // bright: 2.4–4px  (10%)
          : tier < 0.35
          ? Math.random() * 1.0 + 1.2   // medium: 1.2–2.2px (25%)
          : Math.random() * 0.7 + 0.5   // small: 0.5–1.2px  (65%)

        const baseOp = tier < 0.10
          ? 0.70 + Math.random() * 0.28
          : tier < 0.35
          ? 0.45 + Math.random() * 0.30
          : 0.25 + Math.random() * 0.30

        return {
          x:      Math.random() * canvas.width,
          y:      Math.random() * canvas.height,
          r,
          gold:   Math.random() < 0.07,
          baseOp,
          op:     baseOp,
          peakOp: Math.min(0.98, baseOp * 1.6),
          phase:  'idle' as const,
        }
      })
    }

    // Soft glowing circle — bright core fading to transparent halo.
    // This is how stars actually look: diffraction + atmosphere bloom.
    const drawStar = (s: Star) => {
      const glowR = s.r * 4.5   // halo extends ~4.5× the core
      const grad  = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, glowR)

      const color = s.gold ? '240,200,90' : '215,232,255'
      grad.addColorStop(0,    `rgba(${color},${s.op})`)
      grad.addColorStop(0.15, `rgba(${color},${s.op * 0.85})`)
      grad.addColorStop(0.45, `rgba(${color},${s.op * 0.30})`)
      grad.addColorStop(1,    `rgba(${color},0)`)

      ctx.beginPath()
      ctx.arc(s.x, s.y, glowR, 0, Math.PI * 2)
      ctx.fillStyle = grad
      ctx.fill()
    }

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      starsRef.current.forEach(s => {
        if (s.phase === 'brightening') {
          s.op += (s.peakOp - s.op) * 0.07
          if (Math.abs(s.op - s.peakOp) < 0.008) { s.op = s.peakOp; s.phase = 'dimming' }
        } else if (s.phase === 'dimming') {
          s.op += (s.baseOp - s.op) * 0.018
          if (Math.abs(s.op - s.baseOp) < 0.004) { s.op = s.baseOp; s.phase = 'idle' }
        }
        drawStar(s)
      })
      rafRef.current = requestAnimationFrame(render)
    }

    const triggerTwinkle = () => {
      starsRef.current.forEach(s => {
        if (s.phase === 'idle' && Math.random() < 0.18) s.phase = 'brightening'
      })
    }

    const twinkleInterval = setInterval(triggerTwinkle, 1600)

    const resize = () => {
      canvas.width  = window.innerWidth
      canvas.height = window.innerHeight
      makeStars()
    }

    resize()
    render()

    window.addEventListener('resize', resize)
    window.addEventListener('scroll', triggerTwinkle, { passive: true })

    return () => {
      window.removeEventListener('resize', resize)
      window.removeEventListener('scroll', triggerTwinkle)
      cancelAnimationFrame(rafRef.current)
      clearInterval(twinkleInterval)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
    />
  )
}
