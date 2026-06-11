import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ username: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(t)
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      await login(form.username, form.password)
      navigate('/')
    } catch {
      setError('Identifiants invalides. Veuillez réessayer.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={s.bg}>
      {/* Animated planes */}
      <div style={{...s.plane, top:'15%', animationDuration:'14s', fontSize:'1.5rem'}}>✈</div>
      <div style={{...s.plane, top:'60%', animationDuration:'22s', animationDelay:'8s', fontSize:'0.9rem', opacity:0.2}}>✈</div>
      <div style={{...s.plane, top:'35%', animationDuration:'18s', animationDelay:'4s', fontSize:'1.1rem', opacity:0.15}}>✈</div>

      {/* Runway lights */}
      <div style={s.runwayBottom}>
        {[...Array(20)].map((_,i) => (
          <div key={i} style={{...s.runwayLight, animationDelay:`${i*0.12}s`}} />
        ))}
      </div>

      <div style={s.card}>
        {/* LED Header */}
        <div style={s.ledTop} />
        <div style={s.logoWrap}>
          <div style={s.planeIcon}>✈</div>
          <div style={s.airportName}>Aéroport Habib Bourguiba</div>
          <div style={s.city}>Monastir — Tunisie · IATA: MIR</div>
          <div style={s.system}>IT Asset Management System</div>
        </div>
        <div style={s.ledTop} />

        {/* Clock */}
        <div style={s.clock}>
          <div style={s.clockTime}>{time.toLocaleTimeString('fr-TN')}</div>
          <div style={s.clockDate}>{time.toLocaleDateString('fr-TN', {weekday:'long', day:'numeric', month:'long', year:'numeric'})}</div>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={s.fieldWrap}>
            <label style={s.label}>👤 Nom d'utilisateur</label>
            <input style={s.input} placeholder="Entrez votre identifiant"
              value={form.username} onChange={e => setForm({...form, username: e.target.value})} required />
          </div>
          <div style={s.fieldWrap}>
            <label style={s.label}>🔒 Mot de passe</label>
            <input style={s.input} type="password" placeholder="••••••••"
              value={form.password} onChange={e => setForm({...form, password: e.target.value})} required />
          </div>
          {error && <div style={s.error}>{error}</div>}
          <button style={s.btn} type="submit" disabled={loading}>
            {loading ? (
              <span>Connexion en cours<span style={{animation:'dots 1s infinite'}}>...</span></span>
            ) : '🚀 Se Connecter'}
          </button>
        </form>

        <div style={s.footer}>
          Direction des Systèmes d'Information · © 2026
        </div>
      </div>
    </div>
  )
}

const s = {
  bg: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    padding: '1rem', position: 'relative', overflow: 'hidden',
  },
  plane: { position:'absolute', left:0, animation:'plane 14s linear infinite', pointerEvents:'none', zIndex:0 },
  runwayBottom: { position:'absolute', bottom:'20px', left:0, right:0, display:'flex', justifyContent:'center', gap:'12px' },
  runwayLight: { width:'24px', height:'4px', background:'linear-gradient(90deg,#6366f1,#8b5cf6)', borderRadius:'2px', animation:'runwayLight 1.2s ease-in-out infinite' },
  card: {
    position: 'relative', zIndex: 1,
    background: 'rgba(255,255,255,0.05)',
    backdropFilter: 'blur(20px)',
    border: '1px solid rgba(99,102,241,0.3)',
    borderRadius: '24px', padding: '2.5rem',
    width: '100%', maxWidth: '440px',
    boxShadow: '0 0 60px rgba(99,102,241,0.2), inset 0 1px 0 rgba(255,255,255,0.1)',
  },
  ledTop: {
    height: '3px', borderRadius: '2px', marginBottom: '1.5rem',
    background: 'linear-gradient(90deg, #6366f1, #8b5cf6, #ec4899, #8b5cf6, #6366f1)',
    animation: 'ledBar 2s ease-in-out infinite',
  },
  logoWrap: { textAlign: 'center', marginBottom: '1.5rem' },
  planeIcon: { fontSize: '2.5rem', animation: 'led 2s ease-in-out infinite', display: 'block', marginBottom: '0.5rem' },
  airportName: { fontSize: '1.2rem', fontWeight: 800, color: '#a5b4fc', animation: 'led 2s ease-in-out infinite', letterSpacing: '0.03em' },
  city: { fontSize: '0.75rem', color: '#6366f1', marginTop: '4px', letterSpacing: '0.1em', textTransform: 'uppercase' },
  system: { fontSize: '0.7rem', color: '#475569', marginTop: '4px', textTransform: 'uppercase', letterSpacing: '0.08em' },
  clock: { textAlign: 'center', marginBottom: '1.5rem', padding: '1rem', background: 'rgba(99,102,241,0.1)', borderRadius: '12px', border: '1px solid rgba(99,102,241,0.2)' },
  clockTime: { fontSize: '1.8rem', fontWeight: 800, color: '#818cf8', fontFamily: 'monospace', animation: 'led 2s ease-in-out infinite' },
  clockDate: { fontSize: '0.75rem', color: '#475569', marginTop: '4px', textTransform: 'capitalize' },
  fieldWrap: { marginBottom: '1rem' },
  label: { display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#6366f1', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' },
  input: { background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(99,102,241,0.3)', borderRadius: '10px', padding: '0.75rem 1rem', color: '#e2e8f0', fontSize: '0.9rem', width: '100%', boxSizing: 'border-box' },
  error: { background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)', color: '#fca5a5', padding: '0.75rem 1rem', borderRadius: '10px', marginBottom: '1rem', fontSize: '0.85rem', textAlign: 'center' },
  btn: { width: '100%', padding: '0.9rem', background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', color: '#fff', border: 'none', borderRadius: '10px', fontSize: '1rem', fontWeight: 700, cursor: 'pointer', boxShadow: '0 0 30px rgba(99,102,241,0.4)', marginTop: '0.5rem', transition: 'opacity 0.2s' },
  footer: { textAlign: 'center', color: '#2d3748', fontSize: '0.72rem', marginTop: '1.5rem' },
}
