import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import StarAvatar from '../components/StarAvatar.jsx'
import { COUNTRIES } from '../lib/palettes.js'

// Merged flow: Home (ask anything) + Talk (the answer) + Context (your country) as one conversation.
const rise = { initial: { opacity: 0, y: 14 }, animate: { opacity: 1, y: 0 }, transition: { type: 'spring', stiffness: 420, damping: 34 } }
const Src = ({ children }) => <span className="srcchip"><svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="#2a3a8a" strokeWidth="2"><path d="M9 12l2 2 4-4" /><circle cx="12" cy="12" r="9" /></svg>{children}</span>
const Assist = () => <div className="assist"><span className="sq">✦</span> Talk to Europe</div>

const TrainCard = () => <motion.div className="dscard" {...rise}><span className="pct">25%</span><h3>Train delayed +95 min</h3><div className="dskv"><span>Route</span><span>Wien → München</span></div><div className="dskv"><span>Compensation</span><span>≈ €18</span></div><div className="dskv"><span>Deadline to claim</span><span>3 months</span></div><div className="btnrow"><button className="btnp">File claim</button><button className="btns">Alternatives</button></div><div className="srcs"><span className="lbl">Sources</span><Src>EUR-Lex</Src></div></motion.div>
const VerdictCard = () => <motion.div className="dscard" {...rise}><div className="warnhdr">⚠ Misleading — one real rule, one false claim</div><div className="verdict"><span className="vi tt">✓</span><div><b>True:</b> New petrol &amp; diesel car sales end in 2035.</div></div><div className="verdict"><span className="vi ff">✕</span><div><b>False:</b> Existing cars will be banned from the road.</div></div><div className="srcs"><Src>EUR-Lex</Src><Src>Your Europe</Src></div></motion.div>
const HealthCard = () => <motion.div className="dscard" {...rise}><h3>You’re covered with your EHIC</h3><p>Public care in any EU country at the same cost as locals. Carry your European Health Insurance Card — free from your insurer.</p><div className="btnrow"><button className="btnp">Check my card</button></div><div className="srcs"><Src>Your Europe</Src></div></motion.div>

const Plus = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#5f6470" strokeWidth="2.2" strokeLinecap="round"><path d="M12 5v14M5 12h14" /></svg>
const Tick = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#5f6470" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 13l4 4L19 7" /></svg>
const CheckBlue = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1a56f0" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M5 13l4 4L19 7" /></svg>
const SearchIco = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#8a8d97" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="7" /><path d="M21 21l-4-4" /></svg>
const SendIco = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round"><path d="M12 19V5M5 12l7-7 7 7" /></svg>
const MicIco = () => <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="3" width="6" height="11" rx="3" /><path d="M5 11a7 7 0 0 0 14 0M12 18v3" /></svg>

const CHIPS = ['My train was delayed', 'Is this true?', 'Health cover abroad', 'Working in another country']

export default function Talk({ setPalette, resetPalette }) {
  const [msgs, setMsgs] = useState([])
  const [val, setVal] = useState('')
  const [country, setCountry] = useState(null)
  const [modal, setModal] = useState(false)
  const [q, setQ] = useState('')
  const [voice, setVoice] = useState(false)

  function reply(text) {
    const t = text.toLowerCase()
    setTimeout(() => {
      let kind = 'gist'
      if (/train|delay|late|refund|compensat/.test(t)) kind = 'train'
      else if (/true|fake|real|petrol|ban|disinfo|rumou?r/.test(t)) kind = 'verdict'
      else if (/health|ehic|doctor|sick|abroad|hospital|insur/.test(t)) kind = 'health'
      setMsgs(m => [...m, { role: 'eu', kind }])
    }, 620)
  }
  function send(text) { text = (text || val).trim(); if (!text) return; setMsgs(m => [...m, { role: 'me', text }]); setVal(''); reply(text) }
  function applyCountry(c) { setCountry(c); setPalette(c[3][0], c[3][1], c[3][2]); setModal(false); setQ('') }
  function clearCountry() { setCountry(null); resetPalette() }
  function endVoice(commit) { setVoice(false); if (commit) { const t = 'My train from Vienna was 90 minutes late.'; setMsgs(m => [...m, { role: 'me', text: t }]); reply(t) } }
  const list = q.trim() ? COUNTRIES.filter(c => c[1].toLowerCase().includes(q.trim().toLowerCase())) : COUNTRIES
  const started = msgs.length > 0

  return <>
    <div className="ttehead"><div className="brand">Talk to Europe</div></div>
    <div className="scroll">
      {!started && <div className="intro"><h1>Ask Europe anything.</h1><p>Your rights, your options, what the EU actually does — in plain language.</p></div>}
      {msgs.map((m, i) => m.role === 'me'
        ? <motion.div key={i} className="bubble me" {...rise}>{m.text}</motion.div>
        : <div key={i}>
            <Assist />
            {m.kind === 'train' ? <TrainCard /> : m.kind === 'verdict' ? <VerdictCard /> : m.kind === 'health' ? <HealthCard /> :
              <motion.div className="bubble eu" {...rise}>Here’s the gist, with the source it rests on. <Src>Your Europe</Src></motion.div>}
          </div>
      )}
    </div>

    {!started && <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', padding: '2px 16px 4px' }}>
      {CHIPS.map(c => <button key={c} onClick={() => send(c)} style={{ fontSize: 13.5, color: '#fff', background: 'rgba(255,255,255,.16)', backdropFilter: 'blur(10px)', border: 0, padding: '10px 14px', borderRadius: 15, cursor: 'pointer' }}>{c}</button>)}
    </div>}

    <div style={{ padding: '8px 16px 18px' }}>
      <div className="ctxbar">
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <input className="ctxinput" style={{ fontSize: 18, height: 'auto', margin: 0, flex: 1 }} value={val} onChange={e => setVal(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') send() }} placeholder="Ask Europe a question…" />
          {val.trim()
            ? <button className="send" onClick={() => send()}><SendIco /></button>
            : <button className="send" onClick={() => setVoice(true)} aria-label="Talk by voice"><MicIco /></button>}
        </div>
        <div className="ctxchips" style={{ marginTop: 14 }}>
          <StarAvatar size={40} />
          <button className="add" onClick={() => setModal(true)}><Plus /></button>
          <span className="ctxchip"><Tick /> EU ID</span>
          {country && <motion.span key={country[0]} className="ctxchip flagc" initial={{ opacity: 0, scale: .85 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: 'spring', stiffness: 520, damping: 28 }}>{country[2]} {country[1]} <button className="cx" onClick={clearCountry}>✕</button></motion.span>}
        </div>
      </div>
    </div>

    <AnimatePresence>
      {modal && [
        <motion.div key="b" className="cmback" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: .2 }} onClick={() => setModal(false)} />,
        <motion.div key="s" className="cmsheet" initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} transition={{ type: 'spring', stiffness: 440, damping: 42 }}>
          <div className="cmgrip" /><div className="cmtitle">Your country</div>
          <div className="cmsearchwrap"><SearchIco /><input className="cmsearch" value={q} onChange={e => setQ(e.target.value)} placeholder="Search" /></div>
          <div className="cmlist">
            {list.map(c => <div key={c[0]} className={'cmrow' + (country && country[0] === c[0] ? ' sel' : '')} onClick={() => applyCountry(c)}><span className="fl">{c[2]}</span>{c[1]}<span className="ck"><CheckBlue /></span></div>)}
          </div>
        </motion.div>
      ]}
    </AnimatePresence>

    <AnimatePresence>
      {voice && (
        <motion.div key="voice" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: .25 }}
          style={{ position: 'absolute', inset: 0, zIndex: 70, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 30, background: 'rgba(20,24,45,.26)', backdropFilter: 'blur(26px) saturate(150%)', WebkitBackdropFilter: 'blur(26px) saturate(150%)' }}>
          <motion.div initial={{ scale: .8, opacity: 0 }} animate={{ scale: [1, 1.06, 1], opacity: 1 }} transition={{ scale: { duration: 2.4, repeat: Infinity, ease: 'easeInOut' }, opacity: { duration: .3 } }} style={{ borderRadius: '50%', boxShadow: '0 0 90px 24px rgba(255,255,255,.22)' }}>
            <StarAvatar size={132} />
          </motion.div>
          <div style={{ display: 'flex', gap: 7, alignItems: 'center', height: 44 }}>
            {[0, 1, 2, 3, 4].map(i => <motion.span key={i} animate={{ height: [14, 38, 14] }} transition={{ duration: .9, repeat: Infinity, ease: 'easeInOut', delay: i * .13 }} style={{ display: 'block', width: 7, borderRadius: 4, background: '#fff', opacity: .92 }} />)}
          </div>
          <div style={{ color: '#fff', fontSize: 17, fontWeight: 500, textShadow: '0 1px 12px rgba(8,12,40,.4)' }}>Listening…</div>
          <div style={{ display: 'flex', gap: 16, marginTop: 4 }}>
            <button onClick={() => endVoice(false)} style={{ width: 58, height: 58, borderRadius: '50%', border: 0, background: 'rgba(255,255,255,.18)', backdropFilter: 'blur(10px)', color: '#fff', fontSize: 22, cursor: 'pointer' }}>✕</button>
            <button onClick={() => endVoice(true)} style={{ width: 58, height: 58, borderRadius: '50%', border: 0, background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="23" height="23" viewBox="0 0 24 24" fill="none" stroke="#15171e" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M5 13l4 4L19 7" /></svg>
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  </>
}
