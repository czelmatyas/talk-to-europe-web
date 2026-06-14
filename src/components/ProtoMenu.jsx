import { AnimatePresence, motion } from 'framer-motion'

export default function ProtoMenu({ open, protos, activeId, onSelect, onClose, appVersion }) {
  const groups = {}, order = []
  protos.forEach(p => { const s = p.slot || 'Other'; if (!groups[s]) { groups[s] = []; order.push(s) } groups[s].push(p) })
  return (
    <AnimatePresence>
      {open && [
        <motion.div key="back" className="pmback" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: .2 }} onClick={onClose} />,
        <motion.div key="sheet" className="pmsheet" initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} transition={{ type: 'spring', stiffness: 440, damping: 42 }}>
          <div className="pmtop">
            <h2>Prototypes</h2>
            <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
              <span className="v">app v{appVersion} · {protos.length} protos</span>
              <button className="pmx" onClick={onClose}>×</button>
            </div>
          </div>
          {order.map(s => (
            <div key={s}>
              <div className="pmgroup">{s}</div>
              {groups[s].map(p => (
                <div key={p.id} className="pmrow" data-on={p.id === activeId ? 1 : 0} onClick={() => onSelect(p.id)}>
                  <div>
                    <div className="t">{p.title}</div>
                    <div className="d">{[p.author || '—', p.updated || ''].filter(Boolean).join(' · ')}</div>
                  </div>
                  <span className="vtag">v{p.version}</span>
                </div>
              ))}
            </div>
          ))}
          <div className="pmhint">Long-press anywhere to reopen · each proto is a file in /src/protos</div>
        </motion.div>
      ]}
    </AnimatePresence>
  )
}
