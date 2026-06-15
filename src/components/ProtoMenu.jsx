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

// Which deployment are we viewing? Match the page host; on a domain alias, fall back to the newest production build.
function currentUrlOf(rows) {
  const host = typeof window !== 'undefined' ? window.location.hostname : ''
  const hostOf = u => { try { return new URL(u).hostname } catch { return '' } }
  const exact = rows.find(d => hostOf(d.url) === host)
  if (exact) return exact.url
  const prod = rows.filter(d => d.target === 'production').sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0))
  return prod[0]?.url
}

function ProtoRow({ p, active, onSelect }) {
  return (
    <div className="pmrow" data-on={active ? 1 : 0} onClick={() => onSelect(p.id)}>
      <div>
        <div className="t">{p.title}</div>
        <div className="d">{p.desc || p.slot || ''}</div>
      </div>
      <span className="vtag">v{p.version}</span>
    </div>
  )
}

const REPO_URL = 'https://github.com/czelmatyas/talk-to-europe-web'
function remixPrompt(branch) {
  return 'Clone ' + REPO_URL + ' and make me a new branch called NAME (replace NAME with your name) starting from the "' + branch + '" branch. Then install and run it, push the branch, and give me my Vercel preview link.'
}

function DeployRow({ d, current, copied, onRemix }) {
  return (
    <div className="pmrow deployrow" data-on={current ? 1 : 0}>
      <a className="dl" href={d.url} style={{ textDecoration: 'none', color: 'inherit', display: 'flex', flex: 1, minWidth: 0 }}>
        <div style={{ minWidth: 0 }}>
          <div className="t">{d.name}{d.target === 'production' && <span style={{ marginLeft: 8, fontSize: 10, fontWeight: 700, letterSpacing: .4, textTransform: 'uppercase', color: '#1a7f37' }}>production</span>}{current && <span style={{ marginLeft: 8, fontSize: 10, fontWeight: 700, letterSpacing: .4, textTransform: 'uppercase', color: '#1a73e8' }}>current</span>}</div>
          <div className="d">{fmt(d.date)}{d.sha ? ' · ' + d.sha : ''}</div>
        </div>
      </a>
      <button className="pmremix" onClick={() => onRemix(d)}>{copied ? 'Copied ✓' : 'Remix'}</button>
    </div>
  )
}

export default function ProtoMenu({ open, protos, activeId, onSelect, onClose, appVersion, frames = [], frame, setFrame, onOpenGradient, onRestart }) {
  const { rows, err } = useDeployments(open)
  const [expanded, setExpanded] = useState({})
  const [copied, setCopied] = useState('')
  function remix(d) {
    try { navigator.clipboard.writeText(remixPrompt(d.name)) } catch (e) { }
    setCopied(d.url); setTimeout(() => setCopied(''), 1900)
  }

  const deploys = rows || []
  const byPerson = {}
  deploys.forEach(d => { (byPerson[d.author] = byPerson[d.author] || []).push(d) })
  Object.values(byPerson).forEach(l => l.sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0)))

  const currentUrl = deploys.length ? currentUrlOf(deploys) : null
  const currentAuthor = deploys.find(d => d.url === currentUrl)?.author || 'You'
  const others = Object.keys(byPerson).filter(n => n !== currentAuthor)
    .sort((a, b) => new Date(byPerson[b][0]?.date || 0) - new Date(byPerson[a][0]?.date || 0))
  const people = [currentAuthor, ...others]

  return (
    <AnimatePresence>
      {open && [
        <motion.div key="back" className="pmback" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: .2 }} onClick={onClose} />,
        <motion.div key="sheet" className="pmsheet" initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} transition={{ type: 'spring', stiffness: 440, damping: 42 }}>
          <div className="pmtop">
            <h2>Versions</h2>
            <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
              <span className="v">app v{appVersion}</span>
              <button className="pmx" onClick={onClose}>×</button>
            </div>
          </div>

          {frames.length > 0 && <>
            <div className="pmgroup">Recording frame</div>
            <div className="pmframes">
              {frames.map(fr => <button key={fr.id} className="pmframe" data-on={fr.id === frame ? 1 : 0} onClick={() => setFrame(fr.id)}>{fr.label}</button>)}
            </div>
          </>}

          {onOpenGradient && <button className="pmmore" style={{ marginTop: 4 }} onClick={onOpenGradient}>Edit gradient style…</button>}
          {onRestart && <button className="pmmore" onClick={onRestart}>↻ Restart prototype</button>}

          {people.map(name => {
            const list = byPerson[name] || []
            const isCurrent = name === currentAuthor
            const isOpen = expanded[name]
            let shown = isOpen ? list : list.slice(0, TOP_N)
            if (currentUrl && !shown.some(d => d.url === currentUrl)) {
              const c = list.find(d => d.url === currentUrl)
              if (c) shown = [...shown, c]
            }
            return (
              <div key={name}>
                <div className="pmperson">
                  <span className="av" style={{ background: '#e7eefc', color: '#3b5bdb', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 600 }}>{name[0]?.toUpperCase()}</span>
                  <span className="nm">{name}{isCurrent && <span style={{ marginLeft: 8, fontSize: 10, fontWeight: 700, letterSpacing: .4, textTransform: 'uppercase', color: '#1a73e8' }}>you</span>}</span>
                  {list.length > 0 && <span className="cnt">{list.length} {list.length === 1 ? 'deploy' : 'deploys'}</span>}
                </div>

                {isCurrent && <div className="pmsub">Flows</div>}
                {isCurrent && protos.map(p => <ProtoRow key={p.id} p={p} active={p.id === activeId} onSelect={onSelect} />)}
                {(list.length > 0 || (isCurrent && (err || !rows))) && <div className="pmsub">History</div>}
                {isCurrent && err && <div className="d" style={{ padding: '2px 12px 8px', color: '#b4690e' }}>{err}</div>}
                {isCurrent && !rows && !err && <div className="d" style={{ padding: '2px 12px 8px' }}>Loading deployments…</div>}
                {shown.map((d, i) => <DeployRow key={d.url || i} d={d} current={d.url === currentUrl} copied={copied === d.url} onRemix={remix} />)}
                {list.length > TOP_N && (
                  <button className="pmmore" onClick={() => setExpanded(e => ({ ...e, [name]: !isOpen }))}>
                    {isOpen ? 'Show less' : `Load more (${list.length - TOP_N})`}
                  </button>
                )}
              </div>
            )
          })}

          <div className="pmhint">Long-press anywhere to reopen · tap a version to jump to it</div>
        </motion.div>
      ]}
    </AnimatePresence>
  )
}
