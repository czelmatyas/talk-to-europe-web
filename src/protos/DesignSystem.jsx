import { useState } from 'react'

const lab = { fontSize: 11, letterSpacing: .5, textTransform: 'uppercase', color: 'rgba(255,255,255,.85)', margin: '18px 6px 8px', textShadow: '0 1px 8px rgba(8,12,40,.3)' }
const SEG = { eu: 'Across the EU, single-use plastic packaging must be reduced and clearly labelled under the Packaging Regulation.', hu: 'Hungary applies the EU rules and adds a national deposit-return scheme for bottles and cans from 2024.' }

export default function DesignSystem() {
  const [pref, setPref] = useState('unique')
  const [seg, setSeg] = useState('eu')
  return <div className="scroll" style={{ padding: '18px 16px 30px' }}>
    <div style={lab}>Answer as a tool</div>
    <div className="assist"><span className="sq">✦</span> Talk to Europe</div>
    <div className="dscard"><span className="pct">25%</span><h3>Train delayed +95 min</h3><div className="dskv"><span>Route</span><span>Wien → München</span></div><div className="dskv"><span>Compensation</span><span>≈ €18</span></div><div className="dskv"><span>Deadline to claim</span><span>3 months</span></div><div className="btnrow"><button className="btnp">File claim</button><button className="btns">Alternatives</button></div><div className="srcs"><span className="lbl">Sources</span><span className="srcchip"><i>1</i> EUR-Lex</span><span className="srcchip"><i>2</i> Your Europe</span></div></div>

    <div style={lab}>Preference card (Pulse)</div>
    <div className="dscard"><p style={{ fontSize: 16, color: '#15171e', marginTop: 0 }}>Mind if I ask — when you’re travelling, what’s your preference? This helps shape what shows up tomorrow.</p>
      <div className="pref">
        {[['family', 'Family-friendly hotels'], ['unique', 'One-of-a-kind experiences'], ['cheap', 'Affordable options']].map(([k, t]) =>
          <label key={k} data-on={pref === k ? 1 : 0} onClick={() => setPref(k)}><span className="rd">{pref === k ? '✓' : ''}</span>{t}</label>)}
        <div className="share">✎ Share anything…</div>
      </div>
    </div>

    <div style={lab}>Is this true? (fact-check)</div>
    <div className="dscard"><div className="warnhdr">⚠ Misleading — one real rule, one false claim</div><div className="verdict"><span className="vi tt">✓</span><div><b>True:</b> New petrol &amp; diesel car sales end in 2035.</div></div><div className="verdict"><span className="vi ff">✕</span><div><b>False:</b> Existing cars will be banned from the road.</div></div><div className="srcs"><span className="lbl">Checked against</span><span className="srcchip"><i>1</i> EUR-Lex</span></div></div>

    <div style={lab}>EU vs national — segmented</div>
    <div className="dscard"><div className="seg"><button data-on={seg === 'eu' ? 1 : 0} onClick={() => setSeg('eu')}>EU-wide</button><button data-on={seg === 'hu' ? 1 : 0} onClick={() => setSeg('hu')}>Hungary</button></div><p>{SEG[seg]}</p><div className="srcs"><span className="srcchip"><i>1</i> EUR-Lex</span></div></div>

    <div style={lab}>EUDI verify</div>
    <div className="dscard"><h3 style={{ fontSize: 16 }}>Talk to Europe is requesting</h3><div className="eudirow"><span>Nationality</span><span className="ok">✓</span></div><div className="eudirow"><span>Verified identity</span><span className="ok">✓</span></div><div className="eudirow"><span>EHIC status</span><span className="ok">✓</span></div><p style={{ fontSize: 12.5, color: '#80838e' }}>Only these are shared. Your full ID stays in your wallet.</p><div className="btnrow"><button className="btnp">Approve &amp; share</button></div></div>

    <div style={lab}>European footprint</div>
    <div className="dscard"><h3 style={{ fontSize: 16 }}>17 years across 3 systems</h3><div className="fbar"><i style={{ width: '48%', background: '#d98a8a' }} /><i style={{ width: '21%', background: '#9ec48f' }} /><i style={{ width: '31%', background: '#9a93c9' }} /></div><div className="frow">🇭🇺 Hungary <span className="yr">14 yr</span></div><div className="frow">🇩🇰 Denmark <span className="yr">6 yr</span></div><div className="frow">🇩🇪 Germany <span className="yr">9 yr</span></div><div className="callout">Coordinated under EU rules (Reg 883/2004), so none of it is lost.</div></div>
  </div>
}
