import AirportHeader from './AirportHeader'

export default function Layout({ children }) {
  return (
    <div style={s.wrap}>
      <AirportHeader />
      {/* Runway lights */}
      <div style={s.runway}>
        {[...Array(12)].map((_, i) => (
          <div key={i} style={{
            ...s.runwayDot,
            animationDelay: `${i * 0.15}s`,
          }} />
        ))}
      </div>
      <main style={s.main}>
        {children}
      </main>
      <footer style={s.footer}>
        <span>✈ Aéroport Habib Bourguiba — Monastir</span>
        <span style={s.footerDot}>•</span>
        <span>MIR-ITAM v1.0</span>
        <span style={s.footerDot}>•</span>
        <span>© 2026 Direction des Systèmes d'Information</span>
      </footer>
    </div>
  )
}

const s = {
  wrap: { minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#0a0a1a' },
  runway: {
    display: 'flex', gap: '0', justifyContent: 'center',
    padding: '4px 0', background: 'rgba(99,102,241,0.05)',
    borderBottom: '1px solid rgba(99,102,241,0.1)',
  },
  runwayDot: {
    width: '20px', height: '3px',
    background: 'linear-gradient(90deg, #6366f1, #8b5cf6)',
    margin: '0 6px', borderRadius: '2px',
    animation: 'runwayLight 1.5s ease-in-out infinite',
  },
  main: { flex: 1, padding: '2rem', width: '100%', maxWidth: '1400px', margin: '0 auto', alignSelf: 'stretch' },
  footer: {
    padding: '1rem 2rem', textAlign: 'center',
    background: 'rgba(0,0,0,0.3)', borderTop: '1px solid rgba(99,102,241,0.2)',
    fontSize: '0.75rem', color: '#475569', display: 'flex',
    justifyContent: 'center', gap: '0.75rem', flexWrap: 'wrap',
  },
  footerDot: { color: '#6366f1' },
}
