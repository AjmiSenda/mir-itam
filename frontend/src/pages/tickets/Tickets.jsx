import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getTickets, deleteTicket } from '../../api/tickets'
import { useAuth } from '../../context/AuthContext'
import Layout from '../../components/Layout'

const PRI = {
  critical: { bar:'#ef4444', bg:'rgba(239,68,68,0.15)', text:'#f87171' },
  high:     { bar:'#f97316', bg:'rgba(249,115,22,0.15)', text:'#fb923c' },
  medium:   { bar:'#eab308', bg:'rgba(234,179,8,0.15)',  text:'#fbbf24' },
  low:      { bar:'#22c55e', bg:'rgba(34,197,94,0.15)',  text:'#4ade80' },
}
const STA = {
  open:        { bg:'rgba(239,68,68,0.15)',   text:'#f87171' },
  in_progress: { bg:'rgba(59,130,246,0.15)',  text:'#60a5fa' },
  resolved:    { bg:'rgba(16,185,129,0.15)',  text:'#34d399' },
  closed:      { bg:'rgba(107,114,128,0.15)', text:'#9ca3af' },
}

export default function Tickets() {
  const [tickets, setTickets] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('')
  const navigate = useNavigate()
  const { user } = useAuth()
  const canEdit = ['admin','manager','technician'].includes(user?.role)

  const load = () => {
    setLoading(true)
    getTickets({ status: filter || undefined }).then(r => {
      setTickets(r.data.results || r.data)
      setLoading(false)
    })
  }

  useEffect(() => { load() }, [filter])

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Supprimer "${title}" ?`)) return
    await deleteTicket(id)
    load()
  }

  return (
    <Layout>
      <div className="fade-in">
        <div style={s.topbar}>
          <div>
            <h1 style={s.title}>🔧 Tickets de Maintenance</h1>
            <p style={s.sub}>{tickets.length} tickets enregistrés</p>
          </div>
          {canEdit && (
            <button style={s.addBtn} onClick={() => navigate('/tickets/new')}>+ Nouveau Ticket</button>
          )}
        </div>

        <div style={s.filters}>
          {['','open','in_progress','resolved','closed'].map(f => (
            <button key={f} style={{...s.filterBtn, ...(filter===f ? s.filterActive : {})}}
              onClick={() => setFilter(f)}>
              {f || 'Tous'}{f==='in_progress'?'En cours':f.charAt(0).toUpperCase()+f.slice(1)}
            </button>
          ))}
        </div>

        {loading ? <div style={s.loading}>Chargement...</div> :
         tickets.length === 0 ? <div style={s.loading}>Aucun ticket trouvé.</div> : (
          <div style={s.list}>
            {tickets.map(t => {
              const p = PRI[t.priority] || PRI.medium
              const st = STA[t.status] || STA.open
              return (
                <div key={t.id} style={s.card} className="slide-in">
                  <div style={{...s.priBorder, background:p.bar}} />
                  <div style={s.cardBody}>
                    <div style={s.cardTop}>
                      <span style={s.cardTitle}>{t.title}</span>
                      <div style={{display:'flex', gap:'8px', alignItems:'center', flexWrap:'wrap'}}>
                        <span style={{...s.badge, background:p.bg, color:p.text}}>{t.priority}</span>
                        <span style={{...s.badge, background:st.bg, color:st.text}}>{t.status.replace('_',' ')}</span>
                        {canEdit && <>
                          <button style={s.editBtn} onClick={() => navigate(`/tickets/${t.id}/edit`)}>✏️</button>
                          <button style={s.delBtn} onClick={() => handleDelete(t.id, t.title)}>🗑</button>
                        </>}
                      </div>
                    </div>
                    {t.description && <p style={s.cardDesc}>{t.description}</p>}
                    <div style={s.cardMeta}>
                      <span>🖥 {t.asset_name || '—'}</span>
                      <span>👷 {t.technician_name || 'Non assigné'}</span>
                      <span>👤 {t.created_by_name}</span>
                      <span>📅 {new Date(t.created_at).toLocaleDateString('fr-TN')}</span>
                    </div>
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
  filters: { display:'flex', gap:'8px', marginBottom:'1.5rem', flexWrap:'wrap' },
  filterBtn: { padding:'6px 14px', background:'rgba(255,255,255,0.05)', border:'1px solid rgba(99,102,241,0.2)', borderRadius:'99px', color:'#64748b', cursor:'pointer', fontSize:'0.82rem', fontWeight:500 },
  filterActive: { background:'rgba(99,102,241,0.2)', border:'1px solid rgba(99,102,241,0.5)', color:'#a5b4fc' },
  loading: { textAlign:'center', padding:'3rem', color:'#475569' },
  list: { display:'flex', flexDirection:'column', gap:'0.75rem' },
  card: { background:'rgba(255,255,255,0.02)', border:'1px solid rgba(99,102,241,0.15)', borderRadius:'14px', display:'flex', overflow:'hidden', transition:'border-color 0.2s' },
  priBorder: { width:'4px', flexShrink:0 },
  cardBody: { flex:1, padding:'1.25rem' },
  cardTop: { display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'0.5rem', flexWrap:'wrap', gap:'8px' },
  cardTitle: { fontSize:'0.95rem', fontWeight:700, color:'#e2e8f0' },
  cardDesc: { fontSize:'0.82rem', color:'#64748b', marginBottom:'0.75rem' },
  cardMeta: { display:'flex', gap:'1rem', flexWrap:'wrap', fontSize:'0.78rem', color:'#475569' },
  badge: { padding:'3px 10px', borderRadius:'99px', fontSize:'0.75rem', fontWeight:600 },
  editBtn: { padding:'4px 8px', background:'rgba(99,102,241,0.15)', border:'1px solid rgba(99,102,241,0.3)', borderRadius:'6px', color:'#a5b4fc', cursor:'pointer', fontSize:'0.82rem' },
  delBtn: { padding:'4px 8px', background:'rgba(239,68,68,0.15)', border:'1px solid rgba(239,68,68,0.3)', borderRadius:'6px', color:'#fca5a5', cursor:'pointer', fontSize:'0.82rem' },
}
