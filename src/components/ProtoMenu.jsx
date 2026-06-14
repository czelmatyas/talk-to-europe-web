import { useState, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

const TOP_N = 3
const fmt = iso => iso ? new Date(iso).toLocaleString(undefined, { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false }) : ''

// Real deployment history via the serverless function (/api/deployments).
function useDeployments(open) {
  const [rows, setRows] = useState(null)
  const [err, setErr] = useState('')
  useEffect(() => {
    if (!open || rows || err) return
    let alive = true
    fetch('/api/deployments')
      .then(async r => {
        const ct = r.headers.get('content-type') || ''
        if (!ct.includes('application/json')) throw new Error('Deployment history loads on the live site (talk-to-europe-web.vercel.app).')
        const d = await r.json()
        if (d.error) throw new Error(d.error)
        return d.rows || []
      })
      .then(rs => { if (alive) setRows(rs) })
      .catch(e => { if (alive) setErr(e.message) })
    return () => { alive = false }
  }, [open, rows, err])
  return { rows, err }
}

function DeployRow({ d }) {
  return (
    <a className="pmrow" href={d.url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: 'inherit' }}>
      <div style={{ minWidth: 0 }}>
        <div className="t">{d.name}{d.target === 'production' && <span style={{ marginLeft: 8, fontSize: 10, fontWeight: 700, letterSpacing: .4, textTransform: 'uppercase', color: '#7ee0a3' }}>production</span>}</div>
        <div className="d">{fmt(d.date)}{d.sha ? ' · ' + d.sha : ''}</div>
      </div>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#aeb6ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7 17L17 7M9 7h8v8" /></svg>
    </a>
  )
}

function TeamDeployments({ rows, err }) {
  const [expanded, setExpanded] = useState({})
  if (err) return <div className="d" style={{ padding: '4px 12px 8px', color: '#caa86a' }}>{err}</div>
  if (!rows) return <div className="d" style={{ padding: '4px 12px 8px' }}>Loading deployments…</div>
  if (!rows.length) return <div className="d" style={{ padding: '4px 12px 8px' }}>No deployments yet.</div>

  const byPerson = {}
  rows.forEach(d => { (byPerson[d.author] = byPerson[d.author] || []).push(d) })
  Object.values(byPerson).forEach(list => list.sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0)))
  const people = Object.keys(byPerson).sort((a, b) =>
    new Date(byPerson[b][0]?.date || 0) - new Date(byPerson[a][0]?.date || 0))

  return people.map(name => {
    const list = byPerson[name]
    const open = expanded[name]
    const shown = open ? list : list.slice(0, TOP_N)
    return (
      <div key={name}>
        <div className="pmperson">
          <span className="av" style={{ background: '#2b3160', color: '#cdd2ec', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 600 }}>{name[0]?.toUpperCase()}</span>
          <span className="nm">{name}</span>
          <span className="cnt">{list.length} {list.length === 1 ? 'deploy' : 'deploys'}</span>
        </div>
        {shown.map((d, i) => <DeployRow key={d.url || i} d={d} />)}
        {list.length > TOP_N && (
          <button className="pmmore" onClick={() => setExpanded(e => ({ ...e, [name]: !open }))}>
            {open ? 'Show less' : `Load more (${list.length - TOP_N})`}
          </button>
        )}
      </div>
    )
  })
}

export default function ProtoMenu({ open, protos, activeId, onSelect, onClose, appVersion }) {
  const groups = {}, order = []
  protos.forEach(p => { const s = p.slot || 'Other'; if (!groups[s]) { groups[s] = []; order.push(s) } groups[s].push(p) })
  const { rows, err } = useDeployments(open)

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

          <div className="pmgroup">Team deployments · by person · live</div>
          <TeamDeployments rows={rows} err={err} />

          <div className="pmhint">Long-press anywhere to reopen · each deploy opens its frozen snapshot</div>
        </motion.div>
      ]}
    </AnimatePresence>
  )
}
