import { motion } from 'framer-motion'

const rise = { initial: { opacity: 0, y: 14 }, animate: { opacity: 1, y: 0 }, transition: { type: 'spring', stiffness: 420, damping: 34 } }

// A named-but-unbuilt narrative chapter. Establishes the flow in the menu; fill it in later.
function Placeholder({ title, desc, points }) {
  return (
    <div className="scroll" style={{ padding: '0 16px' }}>
      <div className="intro" style={{ margin: 'auto 0' }}>
        <div className="assist"><span className="sq">✦</span> Talk to Europe</div>
        <h1 style={{ marginTop: 8 }}>{title}</h1>
        <p>{desc}</p>
        <motion.div className="dscard" {...rise} style={{ marginTop: 18, width: '100%', maxWidth: 'none' }}>
          <div style={{ fontSize: 11, letterSpacing: .5, textTransform: 'uppercase', color: '#80838e', marginBottom: 2 }}>To build</div>
          {points.map((pt, i) => (
            <div key={i} style={{ fontSize: 14, color: '#3c3f49', padding: '10px 0', borderTop: i ? '1px solid #eef0f2' : 'none' }}>{pt}</div>
          ))}
        </motion.div>
      </div>
    </div>
  )
}

export const Wallet = () => <Placeholder
  title="Wallet"
  desc="Your European identity, held by you — shared only when it helps."
  points={['EUDI verify sheet — share only what a service needs', 'European footprint — years across systems, coordinated under EU rules', 'Consent + revoke: what was shared, with whom, when']} />

export const Trust = () => <Placeholder
  title="Trust"
  desc="Is this true? Every answer rests on a source you can check."
  points={['“Is this true?” fact-check verdict — true / misleading / false', 'Source chips that open the underlying regulation', 'Confidence and last-checked date']} />

export const PublicPersonal = () => <Placeholder
  title="Public / Personal"
  desc="Start in the open, continue privately — the same conversation, handed off."
  points={['Public answer with no account needed', 'Hand off to your phone / wallet to personalise', 'Clear line between what’s anonymous and what’s you']} />
