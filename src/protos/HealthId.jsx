import DigitalHealthIdCard from '../components/DigitalHealthIdCard.jsx'
import StarAvatar from '../components/StarAvatar.jsx'

export default function HealthId() {
  return (
    <div className="scroll" style={{ padding: '0 16px 30px' }}>
      <div className="ttehead" style={{ padding: '18px 6px 10px' }}>
        <div className="assist">
          <StarAvatar size={22} />
          <span style={{ color: '#fff', fontSize: 13, fontWeight: 500 }}>Talk to Europe</span>
        </div>
      </div>

      {/* assistant message bubble */}
      <div className="eu bubble" style={{ marginBottom: 10 }}>
        Here's your European Health Insurance Card. It's valid across all EU and EEA countries.
      </div>

      <DigitalHealthIdCard
        holder={{
          firstName: 'Anna',
          lastName: 'Kovács',
          dob: '1987-04-23',
          personalId: '77 4815 8600 0 HU',
          cardNumber: 'HU770004815886',
          validUntil: '2027-12-31',
          country: 'Hungary',
          countryCode: 'HU',
        }}
        onShare={() => alert('Share flow — coming soon')}
        onDetails={() => alert('Coverage details — coming soon')}
      />
    </div>
  )
}
