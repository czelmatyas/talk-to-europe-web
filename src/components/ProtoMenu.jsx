import { useState, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

// --- repo / deploy config (edit if the repo or Vercel scope changes) ---
const REPO = 'czelmatyas/talk-to-europe-web'
const PROJECT = 'talk-to-europe-web'
const SCOPE = 'matyas-9772s-projects'
const TOP_N = 3
const branchURL = name =>
  `https://${PROJECT}-git-${name.toLowerCase().replace(/[^a-z0-9-]+/g, '-').replace(/^-+|-+$/g, '')}-${SCOPE}.vercel.app`
const fmt = iso => iso ? new Date(iso).toLocaleString(undefined, { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false }) : ''

function useBranches(open) {
  const [rows, setRows] = useState(null)
  const [err, setErr] = useState('')
  useEffect(() => {
    if (!open || rows || err) return
    let alive = true
    fetch(`https://api.github.com/repos/${REPO}/branches?per_page=100`)
      .then(r => { if (!r.ok) throw new Error(r.status === 403 ? 'GitHub rate limit — try again shortly' : 'GitHub error ' + r.status); return r.json() })
      .then(async list => {
        const enriched = await Promise.all(list.map(async b => {
          try {
            const c = await (await fetch(b.commit.url)).json()
            return { name: b.name, date: c.commit?.committer?.date || c.commit?.author?.date, author: c.author?.login || c.commit?.author?.name || c.commit?.committer?.name || 'unknown', avatar: c.author?.avatar_url }
          } catch { return { name: b.name, author: 'unknown' } }
        }))
        if (alive) setRows(enriched)
      })
      .catch(e => { if (alive) setErr(e.message) })
    return () => { alive = false }
  }, [open, rows, err])
  return { rows, err }
}

function BranchRow({ b }) {
  return (
    <a className="pmrow" href={branchURL(b.name)} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: 'inherit' }}>
      <div>
        <div className="t">{b.name}{b.name === 'main' && <span style={{ marginLeft: 8, fontSize: 10, fontWeight: 700, letterSpacing: .4, textTransform: 'uppercase', color: '#7ee0a3' }}>production</span>}</div>
        <div className="d">{b.date ? fmt(b.date) : 'no commits yet'}</div>
      </div>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#aeb6ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7 17L17 7M9 7h8v8" /></svg>
    </a>
  )
}

function TeamVersions({ rows, err }) {
  const [expanded, setExpanded] = useState({})
  if (err) return <div className="d" style={{ padding: '4px 12px 8px', color: '#caa86a' }}>{err}</div>
  if (!rows) return <div className="d" style={{ padding: '4px 12px 8px' }}>Loading deployments…</div>

  // group by person, newest first within each, people ordered by most-recent activity
  const byPerson = {}
  rows.forEach(b => { (byPerson[b.author] = byPerson[b.author] || []).push(b) })
  Object.values(byPerson).forEach(list => list.sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0)))
  const people = Object.keys(byPerson).sort((a, b) =>
    new Date(byPerson[b][0]?.date || 0) - new Date(byPerson[a][0]?.date || 0))

  return people.map(name => {
    const list = byPerson[name]
    const open = expanded[name]
    const shown = open ? list : list.slice(0, TOP_N)
    const avatar = list.find(b => b.avatar)?.avatar
    return (
      <div key={name}>
        <div className="pmperson">
          {avatar ? <img className="av" src={avatar} alt="" /> : <span className="av" style={{ background: '#2b3160', color: '#cdd2ec', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 600 }}>{name[0]?.toUpperCase()}</span>}
          <span className="nm">{name}</span>
          <span className="cnt">{list.length} {list.length === 1 ? 'version' : 'versions'}</span>
        </div>
        {shown.map(b => <BranchRow key={b.name} b={b} />)}
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
  const { rows, err } = useBranches(open)

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
          <TeamVersions rows={rows} err={err} />

          <div className="pmhint">Long-press anywhere to reopen · deployments open in a new tab</div>
        </motion.div>
      ]}
    </AnimatePresence>
  )
}
