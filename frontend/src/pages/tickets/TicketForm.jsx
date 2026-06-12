import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getTicket, createTicket, updateTicket } from '../../api/tickets'
import { getAssets } from '../../api/assets'
import { getUsers } from '../../api/users'
import Layout from '../../components/Layout'

export default function TicketForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = Boolean(id)
  const [form, setForm] = useState({
    title:'', description:'', priority:'medium',
    status:'open', asset:'', assigned_technician:''
  })
  const [assets, setAssets] = useState([])
  const [technicians, setTechnicians] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    Promise.all([getAssets(), getUsers()]).then(([a,u]) => {
      setAssets(a.data.results||a.data)
      setTechnicians((u.data.results||u.data).filter(u=>['technician','admin','manager'].includes(u.role)))
    })
    if (isEdit) {
      getTicket(id).then(r => {
        const t = r.data
        setForm({
          title:t.title||'', description:t.description||'',
          priority:t.priority||'medium', status:t.status||'open',
          asset:t.asset||'', assigned_technician:t.assigned_technician||''
        })
      })
    }
  }, [id])

  const set = (k,v) => setForm(f=>({...f,[k]:v}))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const payload = {...form}
    if (!payload.assigned_technician) delete payload.assigned_technician
    try {
      if (isEdit) await updateTicket(id, payload)
      else await createTicket(payload)
      navigate('/tickets')
    } catch (err) {
      const data = err.response?.data
      setError(data ? JSON.stringify(data) : 'Une erreur est survenue.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Layout>
      <div style={s.wrap}>
        <div style={s.topbar}>
          <div>
            <h1 style={s.title}>{isEdit ? '✏️ Modifier Ticket' : '➕ Nouveau Ticket'}</h1>
            <p style={s.sub}>Aéroport Habib Bourguiba — Monastir</p>
          </div>
          <button style={s.backBtn} onClick={() => navigate('/tickets')}>← Retour</button>
        </div>
        <div style={s.card}>
          <form onSubmit={handleSubmit}>
            {error && <div style={s.errorBox}>{error}</div>}
            <div style={s.section}>Détails du ticket</div>
            <div style={s.field}>
              <label style={s.label}>Titre *</label>
              <input value={form.title} onChange={e=>set('title',e.target.value)} required placeholder="ex: Panne switch réseau Gate 1" />
            </div>
            <div style={s.field}>
              <label style={s.label}>Description</label>
              <textarea style={{width:'100%',height:'120px',resize:'vertical',padding:'0.75rem',background:'rgba(255,255,255,0.05)',border:'1px solid rgba(99,102,241,0.3)',borderRadius:'10px',color:'#e2e8f0',fontSize:'0.9rem',boxSizing:'border-box'}}
                value={form.description} onChange={e=>set('description',e.target.value)} placeholder="Décrivez le problème..." />
            </div>
            <div style={s.section}>Priorité & Statut</div>
            <div style={s.grid2}>
              <div style={s.field}>
                <label style={s.label}>Priorité *</label>
                <select value={form.priority} onChange={e=>set('priority',e.target.value)}>
                  <option value="low">🟢 Basse</option>
                  <option value="medium">🟡 Moyenne</option>
                  <option value="high">🔴 Haute</option>
                  <option value="critical">🚨 Critique</option>
                </select>
              </div>
              {isEdit && (
                <div style={s.field}>
                  <label style={s.label}>Statut</label>
                  <select value={form.status} onChange={e=>set('status',e.target.value)}>
                    <option value="open">Ouverteeee</option>
                    <option value="in_progress">En cours</option>
                    <option value="resolved">Résolu</option>
                    <option value="closed">Fermé</option>
                  </select>
                </div>
              )}
            </div>
            <div style={s.section}>Assignment</div>
            <div style={s.grid2}>
              <div style={s.field}>
                <label style={s.label}>Asset *</label>
                <select value={form.asset} onChange={e=>set('asset',e.target.value)} required>
                  <option value="">— Sélectionner un asset —</option>
                  {assets.map(a=><option key={a.id} value={a.id}>{a.name} ({a.serial_number})</option>)}
                </select>
              </div>
              <div style={s.field}>
                <label style={s.label}>Technicien assigné</label>
                <select value={form.assigned_technician} onChange={e=>set('assigned_technician',e.target.value)}>
                  <option value="">— Non assigné —</option>
                  {technicians.map(t=><option key={t.id} value={t.id}>{t.username} ({t.role})</option>)}
                </select>
              </div>
            </div>
            <div style={s.actions}>
              <button type="button" style={s.cancelBtn} onClick={() => navigate('/tickets')}>Annuler</button>
              <button type="submit" style={s.submitBtn} disabled={loading}>
                {loading ? 'Enregistrement...' : isEdit ? 'Sauvegarder' : 'Créer le ticket'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  )
}

const s = {
  wrap:{padding:'0'},
  topbar:{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:'1.5rem',flexWrap:'wrap',gap:'1rem'},
  title:{fontSize:'1.6rem',fontWeight:800,color:'#e2e8f0',margin:0},
  sub:{color:'#6366f1',fontSize:'0.85rem',marginTop:'4px'},
  backBtn:{padding:'0.6rem 1.2rem',background:'rgba(99,102,241,0.2)',border:'1px solid rgba(99,102,241,0.4)',color:'#a5b4fc',borderRadius:'10px',cursor:'pointer',fontWeight:600},
  card:{background:'rgba(255,255,255,0.03)',border:'1px solid rgba(99,102,241,0.2)',borderRadius:'16px',padding:'2rem'},
  section:{fontSize:'0.72rem',fontWeight:700,color:'#6366f1',textTransform:'uppercase',letterSpacing:'0.1em',marginBottom:'1rem',marginTop:'1.5rem',paddingBottom:'0.5rem',borderBottom:'1px solid rgba(99,102,241,0.2)'},
  grid2:{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'1rem',marginBottom:'1rem'},
  field:{display:'flex',flexDirection:'column',gap:'6px',marginBottom:'1rem'},
  label:{fontSize:'0.78rem',fontWeight:600,color:'#94a3b8',textTransform:'uppercase',letterSpacing:'0.05em'},
  actions:{display:'flex',justifyContent:'flex-end',gap:'1rem',marginTop:'2rem'},
  cancelBtn:{padding:'0.75rem 1.5rem',background:'rgba(255,255,255,0.05)',border:'1px solid rgba(255,255,255,0.1)',color:'#94a3b8',borderRadius:'10px',cursor:'pointer',fontWeight:600},
  submitBtn:{padding:'0.75rem 2rem',background:'linear-gradient(135deg,#6366f1,#8b5cf6)',color:'#fff',border:'none',borderRadius:'10px',cursor:'pointer',fontWeight:700,fontSize:'0.95rem',boxShadow:'0 0 20px rgba(99,102,241,0.4)'},
  errorBox:{background:'rgba(239,68,68,0.15)',border:'1px solid rgba(239,68,68,0.3)',color:'#fca5a5',padding:'0.75rem 1rem',borderRadius:'10px',marginBottom:'1rem',fontSize:'0.85rem'},
}