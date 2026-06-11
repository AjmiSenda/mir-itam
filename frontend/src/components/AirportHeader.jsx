import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const NAV = [
  { to: '/', icon: '🏠', label: 'Dashboard' },
  { to: '/assets', icon: '📦', label: 'Assets', roles: ['admin','manager','technician','viewer'] },
  { to: '/tickets', icon: '🔧', label: 'Tickets', roles: ['admin','manager','technician'] },
  { to: '/audit', icon: '📋', label: 'Audit Logs', roles: ['admin','manager'] },
  { to: '/users', icon: '👥', label: 'Users', roles: ['admin','manager'] },
]

export default function AirportHeader() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = () => { logout(); navigate('/login') }
  const initials = ((user?.first_name?.[0]||'') + (user?.last_name?.[0]||'')) || user?.username?.[0]?.toUpperCase()
  const visibleNav = NAV.filter(n => !n.roles || n.roles.includes(user?.role))

  return (
    <header style={s.header}>
      {/* Animated planes */}
      <div style={{...s.plane, top:'18px', animationDuration:'12s', fontSize:'1.2rem'}}>✈</div>
      <div style={{...s.plane, top:'32px', animationDuration:'20s', animationDelay:'7s', fontSize:'0.8rem', opacity:0.3}}>✈</div>

      {/* LED Title */}
      <div style={s.titleWrap} onClick={() => navigate('/')}>
        <div style={s.ledBar} />
        <div style={s.airportName}>✈ Aéroport Habib Bourguiba</div>
        <div style={s.systemName}>MIR-ITAM · IT Asset Management</div>
        <div style={s.ledBar} />
      </div>

      {/* Nav */}
      <nav style={s.nav}>
        {visibleNav.map(n => (
          <button key={n.to}
            style={{...s.navBtn, ...(location.pathname === n.to ? s.navActive : {})}}
            onClick={() => navigate(n.to)}>
            <span>{n.icon}</span>
            <span style={s.navLabel}>{n.label}</span>
          </button>
        ))}
      </nav>

      {/* User + logout */}
      <div style={s.userArea}>
        <div style={s.avatar}>{initials}</div>
        <div style={s.userInfo}>
          <div style={s.userName}>{user?.username}</div>
          <div style={s.userRole}>{user?.role}</div>
        </div>
        <button style={s.logoutBtn} onClick={handleLogout} title="Logout">
          🚪 Logout
        </button>
      </div>
    </header>
  )
}

const s = {
  header: {
    position: 'sticky', top: 0, zIndex: 100,
    background: 'linear-gradient(135deg, #0f0c29, #302b63, #24243e)',
    borderBottom: '1px solid rgba(99,102,241,0.3)',
    boxShadow: '0 4px 30px rgba(99,102,241,0.2)',
    padding: '0 2rem',
    display: 'flex', alignItems: 'center', gap: '1.5rem',
    flexWrap: 'wrap', minHeight: '70px', overflow: 'hidden',
  },
  plane: {
    position: 'absolute', left: 0,
    animation: 'plane 12s linear infinite',
    pointerEvents: 'none', zIndex: 0,
  },
  titleWrap: {
    cursor: 'pointer', flexShrink: 0,
    display: 'flex', flexDirection: 'column', gap: '2px',
  },
  ledBar: {
    height: '2px', width: '100%',
    background: 'linear-gradient(90deg, #6366f1, #8b5cf6, #ec4899)',
    borderRadius: '1px',
    animation: 'ledBar 2s ease-in-out infinite',
  },
  airportName: {
    fontSize: '1rem', fontWeight: 800, color: '#a5b4fc',
    animation: 'led 2s ease-in-out infinite',
    letterSpacing: '0.05em',
  },
  systemName: {
    fontSize: '0.65rem', color: '#6366f1', fontWeight: 600,
    letterSpacing: '0.12em', textTransform: 'uppercase',
  },
  nav: { display: 'flex', gap: '4px', flex: 1, flexWrap: 'wrap' },
  navBtn: {
    display: 'flex', alignItems: 'center', gap: '6px',
    padding: '6px 12px', borderRadius: '8px',
    background: 'transparent', border: '1px solid transparent',
    color: '#94a3b8', cursor: 'pointer', fontSize: '0.82rem',
    fontWeight: 500, transition: 'all 0.2s', whiteSpace: 'nowrap',
  },
  navActive: {
    background: 'rgba(99,102,241,0.2)',
    border: '1px solid rgba(99,102,241,0.4)',
    color: '#a5b4fc',
    boxShadow: '0 0 10px rgba(99,102,241,0.2)',
  },
  navLabel: { fontSize: '0.82rem' },
  userArea: {
    display: 'flex', alignItems: 'center', gap: '10px',
    marginLeft: 'auto', flexShrink: 0,
  },
  avatar: {
    width: '36px', height: '36px', borderRadius: '50%',
    background: 'linear-gradient(135deg,#6366f1,#ec4899)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    color: '#fff', fontSize: '0.85rem', fontWeight: 700, flexShrink: 0,
  },
  userInfo: { display: 'flex', flexDirection: 'column' },
  userName: { fontSize: '0.82rem', fontWeight: 700, color: '#e2e8f0' },
  userRole: { fontSize: '0.7rem', color: '#6366f1', textTransform: 'capitalize' },
  logoutBtn: {
    padding: '6px 12px', background: 'rgba(239,68,68,0.15)',
    border: '1px solid rgba(239,68,68,0.3)', borderRadius: '8px',
    color: '#fca5a5', cursor: 'pointer', fontSize: '0.8rem',
    fontWeight: 600, transition: 'all 0.2s', whiteSpace: 'nowrap',
  },
}
