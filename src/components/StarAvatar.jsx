import { useRef, useEffect } from 'react'

const STARP = 'M0,-7L1.65,-2.27 6.66,-2.16 2.69,1.38 4.11,6.66 0,3.5 -4.11,6.66 -2.69,1.38 -6.66,-2.16 -1.65,-2.27Z'
const N = 6, STEP = (Math.PI * 2) / N, R = 60, CY = 110, T = 1.6 // seconds per star-to-centre segment
const smooth = x => x * x * (3 - 2 * x) // ease-in-out → dwells (slows) at segment ends = when a star is centred

// EU flag avatar: gold stars orbiting on a blue field, masked to a circle.
export default function StarAvatar({ size = 36 }) {
  const ref = useRef(null)
  useEffect(() => {
    const stars = ref.current.querySelectorAll('.ring .s')
    let raf = 0
    function tick(now) {
      const lt = (now / 1000) / T, seg = Math.floor(lt), frac = lt - seg
      const base = (seg + smooth(frac)) * STEP
      for (let i = 0; i < stars.length; i++) {
        const a = base + i * STEP
        stars[i].setAttribute('transform', 'translate(' + (50 + R * Math.sin(a)).toFixed(2) + ',' + (CY - R * Math.cos(a)).toFixed(2) + ')')
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [])
  const stars = []
  for (let i = 0; i < N; i++) stars.push(<g className="s" key={i} transform="translate(50,50)"><path d={STARP} transform="scale(2.6)" /></g>)
  return (
    <span className="staravatar" style={{ width: size, height: size }}>
      <svg viewBox="0 0 100 100"><g className="ring">{stars}</g></svg>
    </span>
  )
}
