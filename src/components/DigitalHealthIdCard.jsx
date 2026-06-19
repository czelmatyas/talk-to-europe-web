import { motion } from 'framer-motion'
import StarAvatar from './StarAvatar.jsx'

// EU flag star ring — 12 stars in a circle, purely decorative
function EuStars({ size = 40 }) {
  const stars = []
  const n = 12, r = size * 0.33
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2 - Math.PI / 2
    const x = size / 2 + r * Math.cos(a)
    const y = size / 2 + r * Math.sin(a)
    stars.push(
      <polygon key={i}
        points="0,-3.5 0.82,-1.14 3.33,-1.08 1.35,0.69 2.06,3.33 0,1.75 -2.06,3.33 -1.35,0.69 -3.33,-1.08 -0.82,-1.14"
        transform={`translate(${x},${y})`}
        fill="#FFD700"
      />
    )
  }
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {stars}
    </svg>
  )
}

const rise = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { type: 'spring', stiffness: 400, damping: 32 }
}

/**
 * DigitalHealthIdCard
 * Digital representation of the European Health Insurance Card (EHIC),
 * following the Talk to Europe visual language.
 *
 * Props:
 *  holder      – { firstName, lastName, dob, personalId, cardNumber, validUntil, country, countryCode }
 *  onShare     – called when "Share" is tapped
 *  onDetails   – called when "Details" is tapped
 */
export default function DigitalHealthIdCard({
  holder = {
    firstName: 'Anna',
    lastName: 'Kovács',
    dob: '1987-04-23',
    personalId: '77 4815 8600 0 HU',
    cardNumber: 'HU77000481588600',
    validUntil: '2027-12-31',
    country: 'Hungary',
    countryCode: 'HU',
  },
  onShare,
  onDetails,
}) {
  const fmtDate = iso => {
    const [y, m, d] = iso.split('-')
    return `${d}/${m}/${y}`
  }

  return (
    <motion.div {...rise} style={styles.root} data-node-id="1011:5179">

      {/* ── Card face ─────────────────────────────────────────── */}
      <div style={styles.card}>

        {/* top strip: EU identity */}
        <div style={styles.cardHeader}>
          <div style={styles.headerLeft}>
            <EuStars size={42} />
            <div>
              <div style={styles.euLabel}>EUROPEAN UNION</div>
              <div style={styles.cardTitle}>Health Insurance Card</div>
            </div>
          </div>
          <div style={styles.countryBadge}>{holder.countryCode}</div>
        </div>

        {/* holographic shimmer bar */}
        <div style={styles.shimmer} aria-hidden="true" />

        {/* data fields */}
        <div style={styles.fields}>
          <div style={styles.fieldRow}>
            <div style={styles.field}>
              <span style={styles.fieldLabel}>1. Surname</span>
              <span style={styles.fieldValue}>{holder.lastName.toUpperCase()}</span>
            </div>
            <div style={styles.field}>
              <span style={styles.fieldLabel}>2. Given names</span>
              <span style={styles.fieldValue}>{holder.firstName.toUpperCase()}</span>
            </div>
          </div>
          <div style={styles.fieldRow}>
            <div style={styles.field}>
              <span style={styles.fieldLabel}>3. Date of birth</span>
              <span style={styles.fieldValue}>{fmtDate(holder.dob)}</span>
            </div>
            <div style={styles.field}>
              <span style={styles.fieldLabel}>4. Personal ID</span>
              <span style={styles.fieldValue}>{holder.personalId}</span>
            </div>
          </div>
        </div>

        {/* card number + expiry */}
        <div style={styles.cardFooter}>
          <div style={styles.cardNumBlock}>
            <span style={styles.fieldLabel}>6. Card number</span>
            <span style={styles.cardNum}>{formatCardNum(holder.cardNumber)}</span>
          </div>
          <div style={{ textAlign: 'right' }}>
            <span style={styles.fieldLabel}>5. Valid until</span>
            <span style={{ ...styles.fieldValue, display: 'block', marginTop: 2 }}>
              {fmtDate(holder.validUntil)}
            </span>
          </div>
        </div>
      </div>

      {/* ── Info rows ─────────────────────────────────────────── */}
      <div style={styles.infoBox}>
        <div style={styles.infoRow}>
          <span style={styles.infoLabel}>Status</span>
          <span style={styles.statusChip}>
            <span style={styles.statusDot} />
            Active
          </span>
        </div>
        <div style={styles.infoRow}>
          <span style={styles.infoLabel}>Issuing country</span>
          <span style={styles.infoValue}>{holder.country}</span>
        </div>
        <div style={styles.infoRow}>
          <span style={styles.infoLabel}>Covers</span>
          <span style={styles.infoValue}>All EU + EEA states</span>
        </div>
      </div>

      {/* ── Actions ───────────────────────────────────────────── */}
      <div style={styles.actions}>
        <button style={styles.btnPrimary} onClick={onShare}>
          Share card
        </button>
        <button style={styles.btnSecondary} onClick={onDetails}>
          Rights &amp; coverage
        </button>
      </div>

      {/* ── Sources ───────────────────────────────────────────── */}
      <div style={styles.sources}>
        <span style={styles.srcLabel}>SOURCES</span>
        <span style={styles.srcChip}>EHIC Regulation</span>
        <span style={styles.srcChip}>Your Europe</span>
      </div>
    </motion.div>
  )
}

// ── helpers ────────────────────────────────────────────────────
function formatCardNum(n) {
  return n.replace(/(.{4})/g, '$1 ').trim()
}

// ── styles ─────────────────────────────────────────────────────
const styles = {
  root: {
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
    width: '100%',
  },

  // Physical card face
  card: {
    background: 'linear-gradient(140deg, #1a3a8f 0%, #2455c8 45%, #1565c0 70%, #0d47a1 100%)',
    borderRadius: 20,
    padding: '18px 20px 16px',
    color: '#fff',
    boxShadow: '0 12px 32px -8px rgba(13,71,161,.55), 0 2px 8px rgba(0,0,0,.18)',
    position: 'relative',
    overflow: 'hidden',
  },

  cardHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },

  headerLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
  },

  euLabel: {
    fontSize: 9,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    opacity: 0.75,
    fontWeight: 600,
    lineHeight: 1,
    marginBottom: 2,
  },

  cardTitle: {
    fontSize: 13,
    fontWeight: 700,
    letterSpacing: 0.2,
    lineHeight: 1,
  },

  countryBadge: {
    background: 'rgba(255,255,255,0.15)',
    border: '1px solid rgba(255,255,255,0.3)',
    borderRadius: 8,
    padding: '5px 10px',
    fontSize: 13,
    fontWeight: 700,
    letterSpacing: 1,
    backdropFilter: 'blur(8px)',
  },

  // rainbow holographic shimmer bar
  shimmer: {
    height: 3,
    borderRadius: 2,
    marginBottom: 16,
    background: 'linear-gradient(90deg, #FFD700, #FF6B9D, #C084FC, #60A5FA, #34D399, #FFD700)',
    opacity: 0.6,
  },

  fields: {
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
    marginBottom: 18,
  },

  fieldRow: {
    display: 'flex',
    gap: 20,
  },

  field: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: 2,
  },

  fieldLabel: {
    fontSize: 9.5,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
    opacity: 0.6,
    fontWeight: 500,
  },

  fieldValue: {
    fontSize: 13.5,
    fontWeight: 600,
    letterSpacing: 0.3,
  },

  cardFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    borderTop: '1px solid rgba(255,255,255,0.18)',
    paddingTop: 14,
  },

  cardNumBlock: {
    display: 'flex',
    flexDirection: 'column',
    gap: 2,
  },

  cardNum: {
    fontSize: 14,
    fontWeight: 700,
    letterSpacing: 2,
    fontVariantNumeric: 'tabular-nums',
    marginTop: 2,
  },

  // Info rows (white surface card)
  infoBox: {
    background: '#fff',
    borderRadius: 16,
    padding: '4px 16px',
    boxShadow: '0 6px 20px -4px rgba(20,22,40,.10)',
  },

  infoRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '11px 0',
    borderTop: '1px solid #eef0f2',
    fontSize: 14,
  },

  infoLabel: {
    color: '#80838e',
    fontSize: 14,
  },

  infoValue: {
    fontWeight: 500,
    color: '#141414',
    fontSize: 14,
  },

  statusChip: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
    background: '#e6f5e7',
    color: '#2f7d32',
    fontSize: 13,
    fontWeight: 600,
    padding: '4px 10px',
    borderRadius: 999,
  },

  statusDot: {
    width: 6,
    height: 6,
    borderRadius: '50%',
    background: '#2f7d32',
  },

  // Buttons
  actions: {
    display: 'flex',
    gap: 9,
  },

  btnPrimary: {
    flex: 1,
    background: '#c5d7fc',
    color: '#0a55c2',
    border: 0,
    fontSize: 15,
    fontWeight: 600,
    padding: '13px',
    borderRadius: 12,
    cursor: 'pointer',
    boxShadow: '0 1px 0 rgba(10,85,194,.4)',
    fontFamily: 'inherit',
  },

  btnSecondary: {
    flex: 1,
    background: '#f5f5f5',
    color: '#141414',
    border: 0,
    fontSize: 15,
    fontWeight: 600,
    padding: '13px',
    borderRadius: 12,
    cursor: 'pointer',
    fontFamily: 'inherit',
  },

  // Sources
  sources: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    flexWrap: 'wrap',
    background: '#e6f5e7',
    borderRadius: 25,
    padding: '6px 8px 6px 10px',
    alignSelf: 'flex-start',
  },

  srcLabel: {
    fontSize: 10,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    color: 'rgba(47,125,50,0.7)',
    fontWeight: 600,
  },

  srcChip: {
    fontSize: 11,
    color: 'rgba(47,125,50,0.85)',
    background: '#fbfefb',
    padding: '5px 9px',
    borderRadius: 25,
    fontWeight: 500,
  },
}
