import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

// --- repo / deploy config (edit if the repo or Vercel scope changes) ---
const REPO = 'czelmatyas/talk-to-europe-web'
const PROJECT = 'talk-to-europe-web'
const SCOPE = 'matyas-9772s-projects'
const branchURL = name =>
  `https://${PROJECT}-git-${name.toLowerCase().replace(/[^a-z0-9-]+/g, '-').replace(/^-+|-+$/g, '')}-${SCOPE}.vercel.app`

const rise = { initial: { opacity: 0, y: 14 }, animate: { opacity: 1, y: 0 }, transition: { type: 'spring', stiffness: 420, damping: 34 } }
const lab = { fontSize: 11, letterSpacing: .5, textTransform: 'uppercase', color: 'rgba(255,255,255,.85)', margin: '4px 6px 12px', textShadow: '0 1px 8px rgba(8,12,40,.3)' }

function fmt(iso) {
  if (!iso) return ''
  return new Date(iso).toLocaleString(undefined, { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false })
}

export default function Versions() {
  const [rows, setRows] = useState(null)
  const [err, setErr] = useState('')

  useEffect(() => {
    let alive = true
    fetch(`https://api.github.com/repos/${REPO}/branches?per_page=100`)
      .then(r => { if (!r.ok) throw new Error(r.status === 403 ? 'GitHub rate limit hit — try again in a few minutes.' : 'GitHub error ' + r.status); return r.json() })
      .then(async list => {
        const enriched = await Promise.all(list.map(async b => {
          try {
            const c = await (await fetch(b.commit.url)).json()
            return { name: b.name, msg: (c.commit?.message || '').split('\n')[0], date: c.commit?.committer?.date || c.commit?.author?.date, author: c.author?.login || c.commit?.author?.name || c.commit?.committer?.name, avatar: c.author?.avatar_url }
          } catch { return { name: b.name } }
        }))
        enriched.sort((a, b) => (a.name === 'main' ? -1 : b.name === 'main' ? 1 : new Date(b.date || 0) - new Date(a.date || 0)))
        if (alive) setRows(enriched)
      })
      .catch(e => { if (alive) setErr(e.message) })
    return () => { alive = false }
  }, [])

  return <div className="scroll" style={{ padding: '18px 16px 30px' }}>
    <div style={lab}>Team versions · live</div>

    {err && <div className="dscard" style={{ color: '#b45309' }}>{err}</div>}
    {!rows && !err && <div className="dscard" style={{ color: '#80838e' }}>Loading branches…</div>}

    {rows && rows.map((r, i) => (
      <motion.a key={r.name} href={branchURL(r.name)} target="_blank" rel="noopener noreferrer"
        className="dscard" style={{ display: 'block', textDecoration: 'none', width: '100%', maxWidth: 'none' }}
        {...rise} transition={{ ...rise.transition, delay: Math.min(i * .04, .3) }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {r.avatar
            ? <img src={r.avatar} alt="" style={{ width: 36, height: 36, borderRadius: '50%', flex: '0 0 auto' }} />
            : <span style={{ width: 36, height: 36, borderRadius: '50%', background: '#e7eefc', color: '#1a56f0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600, flex: '0 0 auto' }}>{(r.author || r.name)[0]?.toUpperCase()}</span>}
          <div style={{ minWidth: 0, flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 16, fontWeight: 600, color: '#15171e', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.name}</span>
              {r.name === 'main' && <span style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: .4, textTransform: 'uppercase', color: '#1a7f37', background: '#e6f4ea', padding: '2px 7px', borderRadius: 999 }}>production</span>}
            </div>
            <div style={{ fontSize: 13.5, color: '#3c3f49', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginTop: 2 }}>
              {r.author || 'unknown'}{r.date ? ' · ' + fmt(r.date) : ''}
            </div>
            {r.msg && <div style={{ fontSize: 12.5, color: '#9a9da6', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginTop: 1 }}>{r.msg}</div>}
          </div>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#9a9da6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flex: '0 0 auto' }}><path d="M7 17L17 7M9 7h8v8" /></svg>
        </div>
      </motion.a>
    ))}

    {rows && <div style={{ textAlign: 'center', fontSize: 11.5, color: 'rgba(255,255,255,.7)', marginTop: 6, textShadow: '0 1px 8px rgba(8,12,40,.3)' }}>Pushes a branch → it shows up here. Tap to open the live version.</div>}
  </div>
}
