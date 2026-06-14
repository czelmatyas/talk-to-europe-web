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
      const rot = t * 0.28               // gentle circular movement
      const breathe = 1 + 0.05 * Math.sin(t * 1.5)  // slight pulse
      const R = 32
      for (let i = 0; i < N; i++) {
        const ph = (i / N) * TAU + rot
        const cx = 50 + R * Math.sin(ph), cy = 50 - R * Math.cos(ph)
        stars[i].setAttribute('transform', 'translate(' + cx.toFixed(2) + ',' + cy.toFixed(2) + ') scale(' + breathe.toFixed(3) + ')')
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
