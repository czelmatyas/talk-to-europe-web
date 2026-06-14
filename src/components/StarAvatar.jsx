import { useRef, useEffect } from 'react'

const STARP = 'M0,-7L1.65,-2.27 6.66,-2.16 2.69,1.38 4.11,6.66 0,3.5 -4.11,6.66 -2.69,1.38 -6.66,-2.16 -1.65,-2.27Z'

export default function StarAvatar({ size = 40 }) {
  const ref = useRef(null)
  useEffect(() => {
    const stars = ref.current.querySelectorAll('.ring .s')
    let raf = 0
    function tick(now) {
      const sp = now * 0.00026
      for (let i = 0; i < stars.length; i++) {
        const idx = +stars[i].dataset.i, a = sp + idx * 1.0471976
        stars[i].setAttribute('transform', 'translate(' + (50 + 60 * Math.sin(a)).toFixed(2) + ',' + (110 - 60 * Math.cos(a)).toFixed(2) + ')')
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [])
  const stars = []
  for (let i = 0; i < 6; i++) stars.push(<g className="s" data-i={i} key={i} transform="translate(50,50)"><path d={STARP} transform="scale(2.6)" /></g>)
  return (
    <span className="staravatar" ref={ref} style={{ width: size, height: size }}>
      <svg viewBox="0 0 100 100"><g className="ring">{stars}</g></svg>
    </span>
  )
}
