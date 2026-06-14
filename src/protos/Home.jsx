import { useState } from 'react'
import { motion } from 'framer-motion'

const rise = { initial: { opacity: 0, y: 14 }, animate: { opacity: 1, y: 0 }, transition: { type: 'spring', stiffness: 420, damping: 34 } }
const Src = ({ children }) => <span className="srcchip"><svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="#2a3a8a" strokeWidth="2"><path d="M9 12l2 2 4-4" /><circle cx="12" cy="12" r="9" /></svg>{children}</span>
const Assist = () => <div className="assist"><span className="sq">✦</span> Talk to Europe</div>

const TrainCard = () => <motion.div className="dscard" {...rise}><span className="pct">25%</span><h3>Train delayed +95 min</h3><div className="dskv"><span>Route</span><span>Wien → München</span></div><div className="dskv"><span>Compensation</span><span>≈ €18</span></div><div className="dskv"><span>Deadline to claim</span><span>3 months</span></div><div className="btnrow"><button className="btnp">File claim</button><button className="btns">Alternatives</button></div><div className="srcs"><span className="lbl">Sources</span><Src>EUR-Lex</Src></div></motion.div>
const VerdictCard = () => <motion.div className="dscard" {...rise}><div className="warnhdr">⚠ Misleading — one real rule, one false claim</div><div className="verdict"><span className="vi tt">✓</span><div><b>True:</b> New petrol &amp; diesel car sales end in 2035.</div></div><div className="verdict"><span className="vi ff">✕</span><div><b>False:</b> Existing cars will be banned from the road.</div></div><div className="srcs"><Src>EUR-Lex</Src><Src>Your Europe</Src></div></motion.div>
const HealthCard = () => <motion.div className="dscard" {...rise}><h3>You’re covered with your EHIC</h3><p>Public care in any EU country at the same cost as locals. Carry your European Health Insurance Card — free from your insurer.</p><div className="btnrow"><button className="btnp">Check my card</button></div><div className="srcs"><Src>Your Europe</Src></div></motion.div>

const CHIPS = ['My train was delayed', 'Is this true?', 'Health cover abroad', 'Working in another country']

export default function Home() {
  const [msgs, setMsgs] = useState([])
  const [val, setVal] = useState('')
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
    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', padding: '2px 16px 4px' }}>
      {CHIPS.map(c => <button key={c} onClick={() => send(c)} style={{ fontSize: 13.5, color: '#fff', background: 'rgba(255,255,255,.16)', backdropFilter: 'blur(10px)', border: 0, padding: '10px 14px', borderRadius: 15, cursor: 'pointer' }}>{c}</button>)}
    </div>
    <div className="composer"><div className="field"><input value={val} onChange={e => setVal(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') send() }} placeholder="Ask Europe a question…" /></div><button className="send" onClick={() => send()}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round"><path d="M12 19V5M5 12l7-7 7 7" /></svg></button></div>
  </>
}
