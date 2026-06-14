import { AnimatePresence, motion } from 'framer-motion'
import { EU, COUNTRIES } from '../lib/palettes.js'

function Swatch({ tri, label, active, onClick }) {
  return (
    <button className={'geswatch' + (active ? ' on' : '')} onClick={onClick} title={label}
      style={{ background: `linear-gradient(135deg, ${tri[0]}, ${tri[1]} 55%, ${tri[2]})` }}>
      <span>{label}</span>
    </button>
  )
}

function Slider({ label, min, max, step, value, onChange, fmt }) {
  return (
    <div className="gerow">
      <div className="gelabel"><span>{label}</span><span className="geval">{fmt(value)}</span></div>
      <input type="range" min={min} max={max} step={step} value={value} onChange={e => onChange(parseFloat(e.target.value))} />
    </div>
  )
}

export default function GradientEditor({ open, onClose, palette, setPalette, resetPalette, grain, setGrain, motion: mo, setMotion, blur, setBlur }) {
  const isEU = palette[0] === EU[0] && palette[2] === EU[2]
  return (
    <AnimatePresence>
      {open && (
        <motion.div key="s" className="gesheet" initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', stiffness: 440, damping: 42 }}>
          <div className="pmtop"><h2>Gradient</h2><button className="pmx" onClick={onClose}>×</button></div>

          <div className="pmsub">Palette</div>
          <div className="geswatches">
            <Swatch tri={EU} label="EU" active={isEU} onClick={resetPalette} />
            {COUNTRIES.map(c => <Swatch key={c[0]} tri={c[3]} label={c[1]} active={!isEU && palette[0] === c[3][0] && palette[2] === c[3][2]} onClick={() => setPalette(c[3][0], c[3][1], c[3][2])} />)}
          </div>

          <div className="pmsub">Style</div>
          <Slider label="Grain" min={0} max={0.45} step={.01} value={grain} onChange={setGrain} fmt={v => Math.round(v * 100) + '%'} />
          <Slider label="Liveliness" min={0} max={2} step={.05} value={mo} onChange={setMotion} fmt={v => v.toFixed(2) + '×'} />
          <Slider label="Softness" min={.4} max={1.8} step={.05} value={blur} onChange={setBlur} fmt={v => v.toFixed(2) + '×'} />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
