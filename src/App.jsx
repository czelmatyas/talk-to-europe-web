import { useState, useRef, useMemo, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import GradientBackdrop from './components/GradientBackdrop.jsx'
import GradientEditor from './components/GradientEditor.jsx'
import ProtoMenu from './components/ProtoMenu.jsx'
import PROTOS from './protos/index.js'
import { EU } from './lib/palettes.js'

const APP_VERSION = '1.0.0'

// Recording frames — lock the stage to a medium's proportion. panel = how wide the UI sits inside it.
const FRAMES = [
  { id: 'agnostic', label: 'Agnostic', ar: null, panel: null },
  { id: 'desktop', label: 'Desktop', ar: 16 / 10, panel: 'min(560px, 58%)' },
  { id: 'tv', label: 'TV', ar: 16 / 9, panel: 'min(560px, 52%)' },
  { id: 'mobile', label: 'Mobile', ar: 9 / 19.5, panel: '92%' },
  { id: 'citylight', label: 'Citylight', ar: 9 / 16, panel: '90%' },
  { id: 'watch', label: 'Watch', ar: 0.82, panel: '94%' }
]

function noiseURL() {
  const s = "<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/><feColorMatrix type='saturate' values='0'/></filter><rect width='100%' height='100%' filter='url(#n)'/></svg>"
  return 'url("data:image/svg+xml,' + encodeURIComponent(s) + '")'
}

export default function App() {
  const [activeId, setActiveId] = useState(PROTOS[0].id)
  const [palette, setPaletteState] = useState(EU)
  const [menuOpen, setMenuOpen] = useState(false)
  const [toast, setToast] = useState('')
  const [frameId, setFrameId] = useState('agnostic')
  const [grainAmt, setGrainAmt] = useState(0.12)
  const [gMotion, setGMotion] = useState(1)
  const [gBlur, setGBlur] = useState(1)
  const [gradientOpen, setGradientOpen] = useState(false)
  const [edgeRun, setEdgeRun] = useState(0)
  const [resetKey, setResetKey] = useState(0)
  const grainURL = useMemo(noiseURL, [])
  const lp = useRef(null), pt = useRef({ x: 0, y: 0 })
  const firstPal = useRef(true)

  // run the edge sweep whenever the palette (country layer) changes — skip the first paint
  useEffect(() => {
    if (firstPal.current) { firstPal.current = false; return }
    setEdgeRun(k => k + 1)
  }, [palette[0], palette[1], palette[2]])

  function restart() { setMenuOpen(false); setResetKey(k => k + 1); resetPalette() }

  const setPalette = (t, m, g) => setPaletteState([t, m, g])
  const resetPalette = () => setPaletteState(EU)
  const active = PROTOS.find(p => p.id === activeId) || PROTOS[0]
  const Comp = active.Component
  const frame = FRAMES.find(f => f.id === frameId) || FRAMES[0]

  function down(e) {
    if (menuOpen || gradientOpen) return
    if (e.target.closest && e.target.closest('input,textarea,button,a,.pmsheet,.cmsheet,.gesheet')) return
    pt.current = { x: e.clientX, y: e.clientY }
    lp.current = setTimeout(() => setMenuOpen(true), 600)
  }
  function move(e) { if (!lp.current) return; if (Math.abs(e.clientX - pt.current.x) > 12 || Math.abs(e.clientY - pt.current.y) > 12) { clearTimeout(lp.current); lp.current = null } }
  function up() { if (lp.current) { clearTimeout(lp.current); lp.current = null } }
  function select(id) {
    setMenuOpen(false); setActiveId(id)
    const p = PROTOS.find(x => x.id === id)
    setPaletteState(p.palette || EU)
    setToast(p.title + ' · v' + p.version); setTimeout(() => setToast(''), 1600)
  }

  const frameStyle = {}
  if (frame.ar) frameStyle['--ar'] = frame.ar
  if (frame.panel) frameStyle['--panel'] = frame.panel

  return (
    <div className="mat" onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={up}>
      <div className="frame" data-fixed={frame.ar ? '1' : undefined} style={frameStyle}>
        <GradientBackdrop palette={palette} motion={gMotion} blur={gBlur} />
        <div className="grain" style={{ background: grainURL, backgroundSize: '200px 200px', opacity: grainAmt }} />
        <AnimatePresence mode="wait">
          <motion.div key={activeId + '-' + resetKey} className="col" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: .3 }}>
            <Comp setPalette={setPalette} resetPalette={resetPalette} />
          </motion.div>
        </AnimatePresence>
        {edgeRun > 0 && (
          <svg className="edgerun" key={edgeRun} viewBox="0 0 100 100" preserveAspectRatio="none">
            <defs>
              <linearGradient id="esg" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stopColor="#7de3ff" /><stop offset="0.5" stopColor="#b39dff" /><stop offset="1" stopColor="#ff9ecb" />
              </linearGradient>
            </defs>
            <rect x="0.6" y="0.6" width="98.8" height="98.8" rx="1.5" fill="none" stroke="url(#esg)" strokeWidth="3.5" pathLength="100" strokeDasharray="26 74" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
          </svg>
        )}
        <AnimatePresence>{toast && <motion.div key="t" className="toast" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>{toast}</motion.div>}</AnimatePresence>
      </div>
      <ProtoMenu open={menuOpen} protos={PROTOS} activeId={activeId} onSelect={select} onClose={() => setMenuOpen(false)} appVersion={APP_VERSION} frames={FRAMES} frame={frameId} setFrame={setFrameId} onOpenGradient={() => { setMenuOpen(false); setGradientOpen(true) }} onRestart={restart} />
      <GradientEditor open={gradientOpen} onClose={() => setGradientOpen(false)} palette={palette} setPalette={setPalette} resetPalette={resetPalette} grain={grainAmt} setGrain={setGrainAmt} motion={gMotion} setMotion={setGMotion} blur={gBlur} setBlur={setGBlur} />
    </div>
  )
}
