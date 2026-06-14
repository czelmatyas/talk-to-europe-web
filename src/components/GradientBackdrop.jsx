import { useRef, useEffect } from 'react'
import { shift, mix, rgba } from '../lib/colors.js'

export default function GradientBackdrop({ palette, motion = 1, blur = 1 }) {
  const cvRef = useRef(null)
  const cur = useRef({ top: palette[0], mid: palette[1], glow: palette[2] })
  const target = useRef(null)
  const motionR = useRef(motion), blurR = useRef(blur)

  useEffect(() => {
    target.current = {
      from: { ...cur.current },
      to: { top: palette[0], mid: palette[1], glow: palette[2] },
      t0: performance.now()
    }
  }, [palette[0], palette[1], palette[2]])

  useEffect(() => { motionR.current = motion }, [motion])
  useEffect(() => { blurR.current = blur }, [blur])

  useEffect(() => {
    const cv = cvRef.current, ctx = cv.getContext('2d')
    const off = document.createElement('canvas'), octx = off.getContext('2d')
    let dpr = 1, raf = 0
    const derive = p => ({ cool: shift(p.top, -17, 3), deep: shift(p.glow, 24, 0), warm: mix(p.top, p.glow, .42), baseTop: shift(p.top, 0, 7), baseBot: shift(p.mid, 0, -6) })
    function resize() {
      dpr = Math.min(1.7, window.devicePixelRatio || 1)
      const W = cv.clientWidth || window.innerWidth, H = cv.clientHeight || window.innerHeight
      cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr)
      off.width = Math.round(cv.width * 1.26); off.height = Math.round(cv.height * 1.26)
    }
    function eblob(c, W, H, x, y, sx, sy, col, a, f) {
      c.save(); c.translate(x / 100 * W, y / 100 * H); c.scale(sx / 100 * W, sy / 100 * H)
      const g = c.createRadialGradient(0, 0, 0, 0, 0, 1)
      g.addColorStop(0, rgba(col, a)); g.addColorStop(f, rgba(col, 0)); g.addColorStop(1, rgba(col, 0))
      c.fillStyle = g; c.beginPath(); c.arc(0, 0, 1, 0, 7); c.fill(); c.restore()
    }
    function frame(now) {
      const P = cur.current
      if (target.current) {
        const k = Math.min(1, (now - target.current.t0) / 900), e = k * k * (3 - 2 * k)
        P.top = mix(target.current.from.top, target.current.to.top, e)
        P.mid = mix(target.current.from.mid, target.current.to.mid, e)
        P.glow = mix(target.current.from.glow, target.current.to.glow, e)
        if (k >= 1) target.current = null
      }
      const m = motionR.current, D = derive(P), t = now / 1000, W = off.width, H = off.height
      // each blob drifts on its own faster path + a gentle size pulse → visibly lively
      const ax = 6 * m * Math.sin(t * 0.34), ay = 6 * m * Math.cos(t * 0.29)
      const bx = 6 * m * Math.cos(t * 0.26 + 1.7), by = 6 * m * Math.sin(t * 0.31 + 0.6)
      const cx = 6 * m * Math.sin(t * 0.28 + 3.1), cy = 6 * m * Math.cos(t * 0.37 + 2.2)
      const pul = (s, ph) => s + 4 * m * Math.sin(t * 0.45 + ph)
      const bg = octx.createLinearGradient(0, 0, 0, H)
      bg.addColorStop(0, D.baseTop); bg.addColorStop(.5, P.mid); bg.addColorStop(1, D.baseBot)
      octx.fillStyle = bg; octx.fillRect(0, 0, W, H)
      eblob(octx, W, H, 37 + ax, 58 + ay, pul(62, 0), pul(54, 1), D.warm, 0.40, .66)
      eblob(octx, W, H, 62 + bx, 76 + by, pul(70, 2), pul(58, 3), D.deep, 0.50, .68)
      eblob(octx, W, H, 76 + cx, 33 + cy, pul(54, 4), pul(46, 5), D.cool, 0.58, .62)
      eblob(octx, W, H, 27 + bx, 24 + ay, pul(58, 6), pul(48, 1.5), P.top, 0.72, .64)
      eblob(octx, W, H, 50 + ax * 0.7, 112 + cy * 0.5, pul(86, 2.5), pul(70, 3.5), P.glow, 0.92, .66)
      const bpx = Math.max(8, (cv.clientHeight || window.innerHeight) * 0.06) * blurR.current
      ctx.clearRect(0, 0, cv.width, cv.height)
      ctx.save(); ctx.filter = 'blur(' + bpx + 'px)'; ctx.drawImage(off, -(off.width - cv.width) / 2, -(off.height - cv.height) / 2); ctx.restore()
      raf = requestAnimationFrame(frame)
    }
    resize(); window.addEventListener('resize', resize)
    const ro = new ResizeObserver(resize); ro.observe(cv)
    raf = requestAnimationFrame(frame)
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize); ro.disconnect() }
  }, [])

  return <canvas ref={cvRef} className="backdrop" />
}
