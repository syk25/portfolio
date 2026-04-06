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
  const starsRef = useRef<Star[]>([])
  const rafRef   = useRef<number>(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const makeStars = () => {
      starsRef.current = Array.from({ length: 160 }, () => {
        const baseOp = 0.12 + Math.random() * 0.28
        return {
          x:        Math.random() * canvas.width,
          y:        Math.random() * canvas.height,
          r:        Math.random() * 1.6 + 0.7,
          gold:     Math.random() < 0.08,
          baseOp,
          op:       baseOp,
          peakOp:   Math.min(0.72, baseOp * 2.8),
          phase:    'idle' as const,
          rotation: Math.random() * (Math.PI / 4),
        }
      })
    }

    // Draw a 4-pointed sparkle (✦ shape)
    const drawSparkle = (x: number, y: number, r: number, rotation: number) => {
      const inner = r * 0.08
      ctx.beginPath()
      for (let i = 0; i < 4; i++) {
        const a  = (i / 4) * Math.PI * 2 + rotation
        const ia = a + Math.PI / 4
        if (i === 0) {
          ctx.moveTo(x + Math.cos(a) * r,    y + Math.sin(a) * r)
        } else {
          ctx.lineTo(x + Math.cos(a) * r,    y + Math.sin(a) * r)
        }
        ctx.lineTo(x + Math.cos(ia) * inner, y + Math.sin(ia) * inner)
      }
      ctx.closePath()
    }

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      starsRef.current.forEach(s => {
        if (s.phase === 'brightening') {
          s.op += (s.peakOp - s.op) * 0.1
          if (Math.abs(s.op - s.peakOp) < 0.008) {
            s.op    = s.peakOp
            s.phase = 'dimming'
          }
        } else if (s.phase === 'dimming') {
          s.op += (s.baseOp - s.op) * 0.025
          if (Math.abs(s.op - s.baseOp) < 0.004) {
            s.op    = s.baseOp
            s.phase = 'idle'
          }
        }

        ctx.fillStyle = s.gold
          ? `rgba(240,192,96,${s.op})`
          : `rgba(200,220,248,${s.op})`

        drawSparkle(s.x, s.y, s.r, s.rotation)
        ctx.fill()
      })

      rafRef.current = requestAnimationFrame(render)
    }

    const triggerTwinkle = () => {
      starsRef.current.forEach(s => {
        if (s.phase === 'idle' && Math.random() < 0.25) {
          s.phase = 'brightening'
        }
      })
    }

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
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ opacity: 0.9 }}
    />
  )
}
