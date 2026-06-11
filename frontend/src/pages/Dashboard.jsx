import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { getAssetStats } from '../api/assets'
import Layout from '../components/Layout'

const NAV_CARDS = [
  { to:'/assets', icon:'📦', label:'Assets', desc:'Manage all IT equipment', color:'#6366f1', roles:['admin','manager','technician','viewer'] },
  { to:'/tickets', icon:'🔧', label:'Maintenance', desc:'Track repair tickets', color:'#8b5cf6', roles:['admin','manager','technician'] },
  { to:'/audit', icon:'📋', label:'Audit Logs', desc:'View system activity', color:'#ec4899', roles:['admin','manager'] },
  { to:'/users', icon:'👥', label:'Users', desc:'Manage staff accounts', color:'#06b6d4', roles:['admin','manager'] },
]

export default function Dashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [stats, setStats] = useState(null)

  useEffect(() => {
    getAssetStats().then(r => setStats(r.data)).catch(() => {})
  }, [])

  const cards = NAV_CARDS.filter(c => !c.roles || c.roles.includes(user?.role))

  return (
    <Layout>
      <div style={s.wrap} className="fade-in">
        {/* Welcome */}
        <div style={s.welcome}>
          <div style={s.welcomeLeft}>
            <div style={s.welcomeIcon}>✈</div>
            <div>
              <h1 style={s.welcomeTitle}>Bienvenue, {user?.first_name || user?.username}</h1>
              <p style={s.welcomeSub}>Système de gestion des actifs IT · Aéroport Habib Bourguiba</p>
            </div>
          </div>
          <div style={s.timeDisplay}>
            <div style={s.timeLabel}>Monastir, Tunisie</div>
            <div style={s.timeClock}>{new Date().toLocaleTimeString('fr-TN', {hour:'2-digit',minute:'2-digit'})}</div>
            <div style={s.timeDate}>{new Date().toLocaleDateString('fr-TN', {weekday:'long', day:'numeric', month:'long'})}</div>
          </div>
        </div>

        {/* Stats */}
        {stats && (
          <div style={s.statsGrid}>
            <div style={{...s.statCard, borderColor:'rgba(99,102,241,0.4)'}}>
              <div style={s.statIcon}>📦</div>
              <div style={{...s.statNum, color:'#818cf8'}}>{stats.total_assets}</div>
              <div style={s.statLabel}>Total Assets</div>
              <div style={{...s.statBar, background:'rgba(99,102,241,0.3)'}} />
            </div>
            {stats.by_status?.map((b, i) => {
              const colors = { active:'#10b981', maintenance:'#f59e0b', retired:'#6b7280', lost:'#ef4444' }
              const icons = { active:'✅', maintenance:'🔧', retired:'📦', lost:'❌' }
              return (
                <div key={i} style={{...s.statCard, borderColor:`${colors[b.status]}40`}}>
                  <div style={s.statIcon}>{icons[b.status] || '📊'}</div>
                  <div style={{...s.statNum, color: colors[b.status] || '#818cf8'}}>{b.count}</div>
                  <div style={s.statLabel}>{b.status}</div>
                  <div style={{...s.statBar, background:`${colors[b.status]}30`}} />
                </div>
              )
            })}
          </div>
        )}

        {/* Nav cards */}
        <h2 style={s.sectionTitle}>🗂 Modules</h2>
        <div style={s.navGrid}>
          {cards.map(c => (
            <button key={c.to} style={{...s.navCard, '--accent': c.color}} onClick={() => navigate(c.to)}>
              <div style={{...s.navCardIcon, background:`${c.color}22`, border:`1px solid ${c.color}44`}}>
                <span style={{fontSize:'2rem'}}>{c.icon}</span>
              </div>
              <div style={s.navCardLabel}>{c.label}</div>
              <div style={s.navCardDesc}>{c.desc}</div>
              <div style={{...s.navCardArrow, color: c.color}}>→</div>
              <div style={{...s.navCardGlow, background: c.color}} />
            </button>
          ))}
        </div>

        {/* Expiring soon */}
        {stats?.expiring_soon?.length > 0 && (
          <div style={s.alertBox}>
            <div style={s.alertTitle}>⚠️ Warranty Expiring Soon</div>
            {stats.expiring_soon.map(a => (
              <div key={a.id} style={s.alertRow}>
                <span>{a.name}</span>
                <span style={s.alertDate}>{a.warranty_expiry}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  )
}

const s = {
  wrap: { display:'flex', flexDirection:'column', gap:'2rem' },
  welcome: { display:'flex', justifyContent:'space-between', alignItems:'center', background:'linear-gradient(135deg, rgba(99,102,241,0.15), rgba(139,92,246,0.1))', border:'1px solid rgba(99,102,241,0.3)', borderRadius:'20px', padding:'2rem', flexWrap:'wrap', gap:'1rem', animation:'glow 3s ease-in-out infinite' },
  welcomeLeft: { display:'flex', alignItems:'center', gap:'1rem' },
  welcomeIcon: { fontSize:'3rem', animation:'plane 8s linear infinite' },
  welcomeTitle: { fontSize:'1.6rem', fontWeight:800, color:'#e2e8f0', margin:0 },
  welcomeSub: { color:'#6366f1', fontSize:'0.85rem', marginTop:'4px' },
  timeDisplay: { textAlign:'right' },
  timeLabel: { fontSize:'0.75rem', color:'#475569', textTransform:'uppercase', letterSpacing:'0.1em' },
  timeClock: { fontSize:'2rem', fontWeight:800, color:'#a5b4fc', fontFamily:'monospace', animation:'led 2s ease-in-out infinite' },
  timeDate: { fontSize:'0.8rem', color:'#64748b', textTransform:'capitalize' },
  statsGrid: { display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(160px, 1fr))', gap:'1rem' },
  statCard: { background:'rgba(255,255,255,0.03)', border:'1px solid', borderRadius:'16px', padding:'1.5rem', textAlign:'center', position:'relative', overflow:'hidden', transition:'transform 0.2s', cursor:'default' },
  statIcon: { fontSize:'1.5rem', marginBottom:'0.5rem' },
  statNum: { fontSize:'2.5rem', fontWeight:800, lineHeight:1 },
  statLabel: { fontSize:'0.8rem', color:'#64748b', marginTop:'6px', textTransform:'capitalize' },
  statBar: { position:'absolute', bottom:0, left:0, right:0, height:'3px', borderRadius:'0 0 16px 16px' },
  sectionTitle: { fontSize:'1rem', fontWeight:700, color:'#6366f1', textTransform:'uppercase', letterSpacing:'0.1em' },
  navGrid: { display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(220px, 1fr))', gap:'1rem' },
  navCard: { background:'rgba(255,255,255,0.03)', border:'1px solid rgba(99,102,241,0.2)', borderRadius:'20px', padding:'1.75rem', display:'flex', flexDirection:'column', alignItems:'flex-start', gap:'0.5rem', cursor:'pointer', position:'relative', overflow:'hidden', transition:'all 0.3s', textAlign:'left' },
  navCardIcon: { width:'60px', height:'60px', borderRadius:'16px', display:'flex', alignItems:'center', justifyContent:'center', marginBottom:'0.5rem' },
  navCardLabel: { fontSize:'1.1rem', fontWeight:700, color:'#e2e8f0' },
  navCardDesc: { fontSize:'0.82rem', color:'#64748b' },
  navCardArrow: { fontSize:'1.5rem', marginTop:'auto', alignSelf:'flex-end' },
  navCardGlow: { position:'absolute', bottom:'-40px', right:'-40px', width:'100px', height:'100px', borderRadius:'50%', opacity:0.08, filter:'blur(20px)' },
  alertBox: { background:'rgba(239,68,68,0.1)', border:'1px solid rgba(239,68,68,0.3)', borderRadius:'16px', padding:'1.5rem' },
  alertTitle: { fontSize:'0.9rem', fontWeight:700, color:'#fca5a5', marginBottom:'1rem' },
  alertRow: { display:'flex', justifyContent:'space-between', padding:'0.5rem 0', borderBottom:'1px solid rgba(239,68,68,0.1)', fontSize:'0.85rem', color:'#cbd5e1' },
  alertDate: { color:'#f87171', fontWeight:600 },
}
