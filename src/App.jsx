import { useState, useRef, useMemo } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import GradientBackdrop from './components/GradientBackdrop.jsx'
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
  const s = "<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/><feColorMatrix type='saturate' values='0'/></filter><rect width='100%' height='100%' filter='url(#n)' opacity='0.12'/></svg>"
  return 'url("data:image/svg+xml,' + encodeURIComponent(s) + '")'
}

export default function App() {
  const [activeId, setActiveId] = useState(PROTOS[0].id)
  const [palette, setPaletteState] = useState(EU)
  const [menuOpen, setMenuOpen] = useState(false)
  const [toast, setToast] = useState('')
  const [frameId, setFrameId] = useState('agnostic')
  const grain = useMemo(noiseURL, [])
  const lp = useRef(null), pt = useRef({ x: 0, y: 0 })

  const setPalette = (t, m, g) => setPaletteState([t, m, g])
  const resetPalette = () => setPaletteState(EU)
  const active = PROTOS.find(p => p.id === activeId) || PROTOS[0]
  const Comp = active.Component
  const frame = FRAMES.find(f => f.id === frameId) || FRAMES[0]

  function down(e) {
    if (menuOpen) return
    if (e.target.closest && e.target.closest('input,textarea,button,a,.pmsheet,.cmsheet')) return
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
        <GradientBackdrop palette={palette} />
        <div className="grain" style={{ background: grain, backgroundSize: '200px 200px' }} />
        <AnimatePresence mode="wait">
          <motion.div key={activeId} className="col" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: .3 }}>
            <Comp setPalette={setPalette} resetPalette={resetPalette} />
          </motion.div>
        </AnimatePresence>
        <AnimatePresence>{toast && <motion.div key="t" className="toast" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>{toast}</motion.div>}</AnimatePresence>
      </div>
      <ProtoMenu open={menuOpen} protos={PROTOS} activeId={activeId} onSelect={select} onClose={() => setMenuOpen(false)} appVersion={APP_VERSION} frames={FRAMES} frame={frameId} setFrame={setFrameId} />
    </div>
  )
}
