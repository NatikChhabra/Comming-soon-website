import { useEffect, useRef } from 'react'

type Particle = {
  hx: number
  hy: number
  x: number
  y: number
  vx: number
  vy: number
  size: number
}

/**
 * Samples the word "NUMEN" into a point field, scatters it, then lets it
 * settle into formation with spring physics. Cursor proximity repels points
 * — the mark behaves like it is aware of you, never merely playing a loop.
 */
export function SignalMark() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let raf = 0
    let width = 0
    let height = 0
    let dpr = Math.min(window.devicePixelRatio || 1, 2)
    let particles: Particle[] = []
    const mouse = { x: -9999, y: -9999, active: false }
    let start = performance.now()

    function buildField() {
      width = canvas!.clientWidth
      height = canvas!.clientHeight
      canvas!.width = width * dpr
      canvas!.height = height * dpr

      const off = document.createElement('canvas')
      off.width = width
      off.height = height
      const octx = off.getContext('2d')!
      octx.clearRect(0, 0, width, height)
      const fontSize = Math.min(width * 0.16, 190)
      octx.font = `700 ${fontSize}px Inter, system-ui, sans-serif`
      octx.textAlign = 'center'
      octx.textBaseline = 'middle'
      octx.fillStyle = '#fff'
      octx.fillText('NUMEN', width / 2, height / 2)

      const data = octx.getImageData(0, 0, width, height).data
      const step = width < 640 ? 4 : 3
      const pts: Particle[] = []
      for (let y = 0; y < height; y += step) {
        for (let x = 0; x < width; x += step) {
          const alpha = data[(y * width + x) * 4 + 3]
          if (alpha > 120) {
            pts.push({
              hx: x,
              hy: y,
              x: Math.random() * width,
              y: Math.random() * height,
              vx: 0,
              vy: 0,
              size: Math.random() < 0.06 ? 2 : 1,
            })
          }
        }
      }
      particles = pts
    }

    function onMove(e: PointerEvent) {
      const r = canvas!.getBoundingClientRect()
      mouse.x = e.clientX - r.left
      mouse.y = e.clientY - r.top
      mouse.active = true
    }
    function onLeave() {
      mouse.active = false
    }

    function tick(now: number) {
      const t = now - start
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.clearRect(0, 0, width, height)

      const settle = Math.min(1, t / 1400)
      const spring = 0.06 + 0.02 * settle
      const drag = 0.82

      for (const p of particles) {
        const breathe = Math.sin(t / 1600 + p.hx * 0.01) * 1.1
        const tx = p.hx + breathe * (0.3 + settle * 0.7)
        const ty = p.hy + Math.cos(t / 1800 + p.hy * 0.01) * 0.6

        let ax = (tx - p.x) * spring
        let ay = (ty - p.y) * spring

        if (mouse.active) {
          const dx = p.x - mouse.x
          const dy = p.y - mouse.y
          const d2 = dx * dx + dy * dy
          const radius = 90
          if (d2 < radius * radius) {
            const d = Math.sqrt(d2) || 1
            const force = (1 - d / radius) * 3.2
            ax += (dx / d) * force
            ay += (dy / d) * force
          }
        }

        p.vx = (p.vx + ax) * drag
        p.vy = (p.vy + ay) * drag
        p.x += p.vx
        p.y += p.vy
      }

      ctx.fillStyle = 'rgba(244, 241, 234, 0.85)'
      for (const p of particles) {
        ctx.globalAlpha = settle
        ctx.fillRect(p.x, p.y, p.size, p.size)
      }

      // one accent particle sweep — a slow horizontal scan, the only colour on screen
      const scanY = (Math.sin(t / 5200) * 0.5 + 0.5) * height
      const grad = ctx.createLinearGradient(0, scanY - 40, 0, scanY + 40)
      grad.addColorStop(0, 'rgba(201,255,61,0)')
      grad.addColorStop(0.5, 'rgba(201,255,61,0.05)')
      grad.addColorStop(1, 'rgba(201,255,61,0)')
      ctx.fillStyle = grad
      ctx.fillRect(0, scanY - 40, width, 80)

      raf = requestAnimationFrame(tick)
    }

    buildField()
    raf = requestAnimationFrame(tick)
    window.addEventListener('resize', buildField)
    canvas.addEventListener('pointermove', onMove)
    canvas.addEventListener('pointerleave', onLeave)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', buildField)
      canvas.removeEventListener('pointermove', onMove)
      canvas.removeEventListener('pointerleave', onLeave)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-[46vh] min-h-[280px] max-h-[420px] touch-pan-y"
      aria-hidden="true"
    />
  )
}
