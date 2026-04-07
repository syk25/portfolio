'use client'
import { useEffect, useRef } from 'react'

interface Star {
  x: number
  y: number
  r: number
  gold: boolean
  baseOp: number
  op: number
  peakOp: number
  phase: 'idle' | 'brightening' | 'dimming'
  rotation: number
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
        // Three tiers so the sky looks real:
        // 65% small (1.2–2.8px), 25% medium (3–5px), 10% bright (5.5–9px)
        const tier = Math.random()
        const r = tier < 0.10
          ? Math.random() * 3.5 + 5.5   // bright: 5.5–9px
          : tier < 0.35
          ? Math.random() * 2.0 + 3.0   // medium: 3–5px
          : Math.random() * 1.6 + 1.2   // small: 1.2–2.8px

        const baseOp = tier < 0.10
          ? 0.55 + Math.random() * 0.35  // bright stars: 0.55–0.90
          : tier < 0.35
          ? 0.35 + Math.random() * 0.30  // medium: 0.35–0.65
          : 0.20 + Math.random() * 0.25  // small: 0.20–0.45

        return {
          x:        Math.random() * canvas.width,
          y:        Math.random() * canvas.height,
          r,
          gold:     Math.random() < 0.07,
          baseOp,
          op:       baseOp,
          peakOp:   Math.min(0.98, baseOp * 1.8),
          phase:    'idle' as const,
          rotation: Math.random() * (Math.PI / 4),
        }
      })
    }

    const drawSparkle = (x: number, y: number, r: number, rotation: number) => {
      const inner = r * 0.07
      ctx.beginPath()
      for (let i = 0; i < 4; i++) {
        const a  = (i / 4) * Math.PI * 2 + rotation
        const ia = a + Math.PI / 4
        if (i === 0) ctx.moveTo(x + Math.cos(a) * r,    y + Math.sin(a) * r)
        else         ctx.lineTo(x + Math.cos(a) * r,    y + Math.sin(a) * r)
        ctx.lineTo(x + Math.cos(ia) * inner, y + Math.sin(ia) * inner)
      }
      ctx.closePath()
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

        ctx.fillStyle = s.gold
          ? `rgba(240,200,90,${s.op})`
          : `rgba(215,232,255,${s.op})`

        drawSparkle(s.x, s.y, s.r, s.rotation)
        ctx.fill()
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
