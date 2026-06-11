import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getUsers, deleteUser } from '../../api/users'
import { useAuth } from '../../context/AuthContext'
import Layout from '../../components/Layout'

const ROLE = {
  admin:      { bg:'rgba(139,92,246,0.2)', text:'#c4b5fd', border:'rgba(139,92,246,0.4)' },
  manager:    { bg:'rgba(59,130,246,0.2)', text:'#93c5fd', border:'rgba(59,130,246,0.4)' },
  technician: { bg:'rgba(16,185,129,0.2)', text:'#6ee7b7', border:'rgba(16,185,129,0.4)' },
  viewer:     { bg:'rgba(107,114,128,0.2)', text:'#9ca3af', border:'rgba(107,114,128,0.4)' },
}

export default function Users() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()
  const { user: me } = useAuth()

  const load = () => {
    setLoading(true)
    getUsers().then(r => { setUsers(r.data.results || r.data); setLoading(false) })
  }
  useEffect(() => { load() }, [])

  const handleDelete = async (id, username) => {
    if (id === me.id) return alert("Vous ne pouvez pas supprimer votre propre compte.")
    if (!window.confirm(`Supprimer l'utilisateur "${username}" ?`)) return
    await deleteUser(id)
    load()
  }

  const initials = u => ((u.first_name?.[0]||'')+(u.last_name?.[0]||''))||u.username[0].toUpperCase()

  return (
    <Layout>
      <div className="fade-in">
        <div style={s.topbar}>
          <div>
            <h1 style={s.title}>👥 Gestion des Utilisateurs</h1>
            <p style={s.sub}>{users.length} comptes enregistrés</p>
          </div>
          <button style={s.addBtn} onClick={() => navigate('/users/new')}>+ Nouvel Utilisateur</button>
        </div>

        {loading ? <div style={s.loading}>Chargement...</div> : (
          <div style={s.grid}>
            {users.map(u => {
              const r = ROLE[u.role] || ROLE.viewer
              return (
                <div key={u.id} style={s.card} className="slide-in">
                  <div style={s.cardTop}>
                    <div style={s.avatar}>{initials(u)}</div>
                    <div style={s.info}>
                      <div style={s.name}>{u.first_name && u.last_name ? `${u.first_name} ${u.last_name}` : u.username}</div>
                      <div style={s.username}>@{u.username}</div>
                    </div>
                    <span style={{...s.roleBadge, background:r.bg, color:r.text, border:`1px solid ${r.border}`}}>
                      {u.role}
                    </span>
                  </div>

                  <div style={s.divider} />

                  <div style={s.details}>
                    <div style={s.row}><span style={s.rowLabel}>Email</span><span style={s.rowVal}>{u.email||'—'}</span></div>
                    <div style={s.row}><span style={s.rowLabel}>Département</span><span style={s.rowVal}>{u.department||'—'}</span></div>
                    <div style={s.row}><span style={s.rowLabel}>Téléphone</span><span style={s.rowVal}>{u.phone_number||'—'}</span></div>
                    <div style={s.row}>
                      <span style={s.rowLabel}>Statut</span>
                      <span style={{color: u.is_active?'#10b981':'#ef4444', fontWeight:600, fontSize:'0.82rem'}}>
                        {u.is_active ? '✅ Actif' : '🚫 Inactif'}
                      </span>
                    </div>
                  </div>

                  <div style={s.actions}>
                    <button style={s.editBtn} onClick={() => navigate(`/users/${u.id}/edit`)}>✏️ Modifier</button>
                    {u.id !== me.id && (
                      <button style={s.delBtn} onClick={() => handleDelete(u.id, u.username)}>🗑 Supprimer</button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </Layout>
  )
}

const s = {
  topbar: { display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'1.5rem', flexWrap:'wrap', gap:'1rem' },
  title: { fontSize:'1.6rem', fontWeight:800, color:'#e2e8f0', margin:0 },
  sub: { color:'#6366f1', fontSize:'0.85rem', marginTop:'4px' },
  addBtn: { padding:'0.7rem 1.5rem', background:'linear-gradient(135deg,#6366f1,#8b5cf6)', color:'#fff', border:'none', borderRadius:'10px', cursor:'pointer', fontWeight:700, boxShadow:'0 0 20px rgba(99,102,241,0.4)', whiteSpace:'nowrap' },
  loading: { textAlign:'center', padding:'3rem', color:'#475569' },
  grid: { display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(300px, 1fr))', gap:'1rem' },
  card: { background:'rgba(255,255,255,0.03)', border:'1px solid rgba(99,102,241,0.2)', borderRadius:'16px', padding:'1.25rem', transition:'border-color 0.2s' },
  cardTop: { display:'flex', alignItems:'center', gap:'0.75rem', marginBottom:'1rem' },
  avatar: { width:'46px', height:'46px', borderRadius:'50%', background:'linear-gradient(135deg,#6366f1,#ec4899)', display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontSize:'1rem', fontWeight:800, flexShrink:0 },
  info: { flex:1, minWidth:0 },
  name: { fontSize:'0.95rem', fontWeight:700, color:'#e2e8f0', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' },
  username: { fontSize:'0.78rem', color:'#475569' },
  roleBadge: { padding:'4px 10px', borderRadius:'99px', fontSize:'0.75rem', fontWeight:700, flexShrink:0 },
  divider: { height:'1px', background:'rgba(99,102,241,0.15)', margin:'0.75rem 0' },
  details: { display:'flex', flexDirection:'column', gap:'0.4rem', marginBottom:'1rem' },
  row: { display:'flex', justifyContent:'space-between', fontSize:'0.82rem' },
  rowLabel: { color:'#475569' },
  rowVal: { color:'#94a3b8', fontWeight:500 },
  actions: { display:'flex', gap:'0.5rem' },
  editBtn: { flex:1, padding:'8px', background:'rgba(99,102,241,0.15)', border:'1px solid rgba(99,102,241,0.3)', borderRadius:'8px', color:'#a5b4fc', cursor:'pointer', fontSize:'0.82rem', fontWeight:600 },
  delBtn: { flex:1, padding:'8px', background:'rgba(239,68,68,0.15)', border:'1px solid rgba(239,68,68,0.3)', borderRadius:'8px', color:'#fca5a5', cursor:'pointer', fontSize:'0.82rem', fontWeight:600 },
}
