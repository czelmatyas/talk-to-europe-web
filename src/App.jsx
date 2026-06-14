import { useState, useRef, useMemo } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import GradientBackdrop from './components/GradientBackdrop.jsx'
import ProtoMenu from './components/ProtoMenu.jsx'
import PROTOS from './protos/index.js'
import { EU } from './lib/palettes.js'

const APP_VERSION = '1.0.0'
function noiseURL() {
  const s = "<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/><feColorMatrix type='saturate' values='0'/></filter><rect width='100%' height='100%' filter='url(#n)' opacity='0.12'/></svg>"
  return 'url("data:image/svg+xml,' + encodeURIComponent(s) + '")'
}

export default function App() {
  const [activeId, setActiveId] = useState(PROTOS[0].id)
  const [palette, setPaletteState] = useState(EU)
  const [menuOpen, setMenuOpen] = useState(false)
  const [toast, setToast] = useState('')
  const grain = useMemo(noiseURL, [])
  const lp = useRef(null), pt = useRef({ x: 0, y: 0 })

  const setPalette = (t, m, g) => setPaletteState([t, m, g])
  const resetPalette = () => setPaletteState(EU)
  const active = PROTOS.find(p => p.id === activeId) || PROTOS[0]
  const Comp = active.Component

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

  return (
    <div onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={up} style={{ height: '100%' }}>
      <GradientBackdrop palette={palette} />
      <div className="grain" style={{ background: grain, backgroundSize: '200px 200px' }} />
      <div className="shell">
        <AnimatePresence mode="wait">
          <motion.div key={activeId} className="col" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: .3 }}>
            <Comp setPalette={setPalette} resetPalette={resetPalette} />
          </motion.div>
        </AnimatePresence>
      </div>
      <ProtoMenu open={menuOpen} protos={PROTOS} activeId={activeId} onSelect={select} onClose={() => setMenuOpen(false)} appVersion={APP_VERSION} />
      <AnimatePresence>{toast && <motion.div key="t" className="toast" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>{toast}</motion.div>}</AnimatePresence>
    </div>
  )
}
