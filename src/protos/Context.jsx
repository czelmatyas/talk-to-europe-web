import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import StarAvatar from '../components/StarAvatar.jsx'
import { COUNTRIES } from '../lib/palettes.js'

const Plus = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#5f6470" strokeWidth="2.2" strokeLinecap="round"><path d="M12 5v14M5 12h14" /></svg>
const Tick = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#5f6470" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 13l4 4L19 7" /></svg>
const CheckBlue = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1a56f0" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M5 13l4 4L19 7" /></svg>
const SearchIco = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#8a8d97" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="7" /><path d="M21 21l-4-4" /></svg>

export default function Context({ setPalette, resetPalette }) {
  const [val, setVal] = useState('')
  const [country, setCountry] = useState(null)
  const [modal, setModal] = useState(false)
  const [q, setQ] = useState('')
  function apply(c) { setCountry(c); setPalette(c[3][0], c[3][1], c[3][2]); setVal(''); setModal(false) }
  function clear() { setCountry(null); resetPalette() }
  const sugg = (() => {
    const s = val.trim().toLowerCase(); if (!s) return []
    const pre = COUNTRIES.filter(c => c[1].toLowerCase().indexOf(s) === 0)
    const inc = COUNTRIES.filter(c => c[1].toLowerCase().indexOf(s) > 0)
    return pre.concat(inc).slice(0, 3)
  })()
  const list = q.trim() ? COUNTRIES.filter(c => c[1].toLowerCase().includes(q.trim().toLowerCase())) : COUNTRIES
  return <>
    <div className="ctxwrap"><div className="ctxbar">
      <input className="ctxinput" value={val} onChange={e => setVal(e.target.value)} onKeyDown={e => { if (e.key === 'Enter' && sugg[0]) apply(sugg[0]) }} placeholder="" />
      <div className="ctxchips">
        <StarAvatar size={40} />
        <button className="add" onClick={() => setModal(true)}><Plus /></button>
        <span className="ctxchip"><Tick /> EU ID</span>
        <AnimatePresence>
          {sugg.map(c => <motion.button key={c[0]} className="ctxchip ghost" initial={{ opacity: 0, scale: .9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: .9 }} transition={{ type: 'spring', stiffness: 520, damping: 30 }} onClick={() => apply(c)}>{c[2]} {c[1]}</motion.button>)}
        </AnimatePresence>
        {country && <motion.span key={country[0]} className="ctxchip flagc" initial={{ opacity: 0, scale: .85 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: 'spring', stiffness: 520, damping: 28 }}>{country[2]} {country[1]} <button className="cx" onClick={clear}>✕</button></motion.span>}
      </div>
    </div></div>
    <AnimatePresence>
      {modal && [
        <motion.div key="b" className="cmback" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: .2 }} onClick={() => setModal(false)} />,
        <motion.div key="s" className="cmsheet" initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} transition={{ type: 'spring', stiffness: 440, damping: 42 }}>
          <div className="cmgrip" /><div className="cmtitle">Country</div>
          <div className="cmsearchwrap"><SearchIco /><input className="cmsearch" value={q} onChange={e => setQ(e.target.value)} placeholder="Search" /></div>
          <div className="cmlist">
            {list.map(c => <div key={c[0]} className={'cmrow' + (country && country[0] === c[0] ? ' sel' : '')} onClick={() => apply(c)}><span className="fl">{c[2]}</span>{c[1]}<span className="ck"><CheckBlue /></span></div>)}
          </div>
        </motion.div>
      ]}
    </AnimatePresence>
  </>
}
