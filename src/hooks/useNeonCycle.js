import { useEffect, useRef } from 'react'

const NEON_PALETTE = [
  { h: 75,  s: 100, l: 55 },   // Lima (default)
  { h: 185, s: 100, l: 48 },   // Cian eléctrico
  { h: 270, s: 100, l: 65 },   // Violeta neón
  { h: 330, s: 100, l: 58 },   // Magenta
  { h: 42,  s: 100, l: 52 },   // Ámbar
  { h: 205, s: 100, l: 55 },   // Azul eléctrico
]

// Interpola entre dos colores HSL
function lerpColor(from, to, t) {
  // Maneja el caso en que la diferencia de hue > 180 (camino corto)
  let dh = to.h - from.h
  if (dh > 180)  dh -= 360
  if (dh < -180) dh += 360
  return {
    h: from.h + dh * t,
    s: from.s + (to.s - from.s) * t,
    l: from.l + (to.l - from.l) * t,
  }
}

function applyColor({ h, s, l }) {
  const r = document.documentElement
  r.style.setProperty('--accent',      `hsl(${h.toFixed(1)}, ${s.toFixed(1)}%, ${l.toFixed(1)}%)`)
  r.style.setProperty('--accent-dim',  `hsla(${h.toFixed(1)}, ${s.toFixed(1)}%, ${l.toFixed(1)}%, 0.13)`)
  r.style.setProperty('--accent-glow', `hsla(${h.toFixed(1)}, ${s.toFixed(1)}%, ${l.toFixed(1)}%, 0.38)`)
}

export function useNeonCycle(holdMs = 9000, transitionMs = 1400) {
  const indexRef = useRef(0)
  const rafRef   = useRef(null)
  const timerRef = useRef(null)

  useEffect(() => {
    // Aplica color inicial
    applyColor(NEON_PALETTE[0])

    const startTransition = (fromColor, toColor) => {
      const start = performance.now()

      const step = (now) => {
        const elapsed = now - start
        const t = Math.min(elapsed / transitionMs, 1)
        // Ease in-out cubic
        const eased = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
        applyColor(lerpColor(fromColor, toColor, eased))
        if (t < 1) {
          rafRef.current = requestAnimationFrame(step)
        }
      }

      rafRef.current = requestAnimationFrame(step)
    }

    timerRef.current = setInterval(() => {
      const from = NEON_PALETTE[indexRef.current]
      indexRef.current = (indexRef.current + 1) % NEON_PALETTE.length
      const to = NEON_PALETTE[indexRef.current]
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      startTransition(from, to)
    }, holdMs)

    return () => {
      clearInterval(timerRef.current)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [holdMs, transitionMs])
}
