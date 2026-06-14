const STARP = 'M0,-7L1.65,-2.27 6.66,-2.16 2.69,1.38 4.11,6.66 0,3.5 -4.11,6.66 -2.69,1.38 -6.66,-2.16 -1.65,-2.27Z'

// One rounded black star on a transparent background.
export default function StarAvatar({ size = 40 }) {
  return (
    <span className="staravatar" style={{ width: size, height: size }}>
      <svg viewBox="0 0 100 100"><path className="s1" d={STARP} transform="translate(50,50) scale(5)" /></svg>
    </span>
  )
}
