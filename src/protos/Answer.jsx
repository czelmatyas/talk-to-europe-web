import { motion } from 'framer-motion'

const rise = { initial: { opacity: 0, y: 14 }, animate: { opacity: 1, y: 0 }, transition: { type: 'spring', stiffness: 420, damping: 34 } }

export default function Answer() {
  return <>
    <div className="ttehead"><div className="brand">Talk to Europe</div></div>
    <div className="scroll">
      <motion.div className="bubble me" {...rise}>My train from Vienna to Munich was 75 minutes late.</motion.div>
      <div className="assist"><span className="sq">✦</span> Talk to Europe</div>
      <motion.div className="dscard" {...rise} transition={{ ...rise.transition, delay: .15 }}>
        <span className="pct">25%</span><h3>You’re owed compensation</h3>
        <div className="dskv"><span>Route</span><span>Wien → München</span></div>
        <div className="dskv"><span>Your fare</span><span>€72</span></div>
        <div className="dskv"><span>Owed to you</span><span>≈ €18</span></div>
        <div className="btnrow"><button className="btnp">File claim</button><button className="btns">Alternatives</button></div>
        <div className="srcs"><span className="lbl">Sources</span><span className="srcchip"><i>1</i> EUR-Lex · Reg 2021/782</span></div>
      </motion.div>
      <motion.div className="bubble eu" {...rise} transition={{ ...rise.transition, delay: .3 }}>I’ve pre-filled the claim with your journey. Want me to add your bank details from your wallet?</motion.div>
    </div>
    <div className="composer"><div className="field"><input placeholder="Ask a follow-up…" /></div><button className="send"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round"><path d="M12 19V5M5 12l7-7 7 7" /></svg></button></div>
  </>
}
