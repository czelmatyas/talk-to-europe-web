import { useRef, useEffect } from 'react'

const STARP = 'M0,-7L1.65,-2.27 6.66,-2.16 2.69,1.38 4.11,6.66 0,3.5 -4.11,6.66 -2.69,1.38 -6.66,-2.16 -1.65,-2.27Z'
const N = 12, TAU = Math.PI * 2

// The 12 EU stars as a free-standing ring (no clip) that breathes + pulses like a voice mascot.
export default function StarMascot({ size = 230 }) {
  const ref = useRef(null)
  useEffect(() => {
    const stars = ref.current.querySelectorAll('.ms')
    let raf = 0
    function tick(now) {
      const t = now / 1000
      // fake "voice envelope": slow swelling amplitude
      const env = 0.55 + 0.45 * (0.5 + 0.5 * Math.sin(t * 2.1)) * (0.6 + 0.4 * Math.sin(t * 0.8 + 1))
      const R = 32 + 3.5 * Math.sin(t * 1.7)
      const rot = t * 0.16
      for (let i = 0; i < N; i++) {
        const ph = (i / N) * TAU
        const pulse = 0.65 + 0.5 * Math.max(0, Math.sin(t * 2.6 - ph))   // travelling crest
        const k = (0.7 + 0.55 * env) * pulse
        const cx = 50 + R * Math.sin(ph + rot), cy = 50 - R * Math.cos(ph + rot)
        stars[i].setAttribute('transform', 'translate(' + cx.toFixed(2) + ',' + cy.toFixed(2) + ') scale(' + k.toFixed(3) + ')')
        stars[i].setAttribute('opacity', (0.7 + 0.3 * pulse).toFixed(3))
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [])
  const stars = []
  for (let i = 0; i < N; i++) stars.push(<g className="ms" key={i}><path d={STARP} transform="scale(1.25)" /></g>)
  return (
    <span className="starmascot" ref={ref} style={{ width: size, height: size }}>
      <svg viewBox="0 0 100 100">{stars}</svg>
    </span>
  )
}
