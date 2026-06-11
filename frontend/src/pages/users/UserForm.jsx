import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getUser, createUser, updateUser } from '../../api/users'
import Layout from '../../components/Layout'

export default function UserForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = Boolean(id)
  const [form, setForm] = useState({
    username:'', email:'', first_name:'', last_name:'',
    role:'viewer', department:'', phone_number:'',
    password:'', password2:'', is_active:true
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (isEdit) {
      getUser(id).then(r => {
        const u = r.data
        setForm(f => ({...f,
          username:u.username||'', email:u.email||'',
          first_name:u.first_name||'', last_name:u.last_name||'',
          role:u.role||'viewer', department:u.department||'',
          phone_number:u.phone_number||'', is_active:u.is_active??true
        }))
      })
    }
  }, [id])

  const set = (k,v) => setForm(f=>({...f,[k]:v}))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    if (!isEdit && form.password !== form.password2) {
      setError('Les mots de passe ne correspondent pas.')
      setLoading(false)
      return
    }
    const payload = {
      username:form.username, email:form.email,
      first_name:form.first_name, last_name:form.last_name,
      role:form.role, department:form.department,
      phone_number:form.phone_number,
    }
    if (!isEdit) { payload.password = form.password; payload.password2 = form.password2 }
    if (isEdit) { payload.is_active = form.is_active }
    try {
      if (isEdit) await updateUser(id, payload)
      else await createUser(payload)
      navigate('/users')
    } catch (err) {
      const data = err.response?.data
      if (data && typeof data === 'object') {
        setError(Object.entries(data).map(([k,v])=>`${k}: ${Array.isArray(v)?v.join(', '):v}`).join('\n'))
      } else { setError('Une erreur est survenue.') }
    } finally { setLoading(false) }
  }

  return (
    <Layout>
      <div style={s.wrap}>
        <div style={s.topbar}>
          <div>
            <h1 style={s.title}>{isEdit ? '✏️ Modifier Utilisateur' : '➕ Nouvel Utilisateur'}</h1>
            <p style={s.sub}>Aéroport Habib Bourguiba — Monastir</p>
          </div>
          <button style={s.backBtn} onClick={() => navigate('/users')}>← Retour</button>
        </div>
        <div style={s.card}>
          <form onSubmit={handleSubmit}>
            {error && <div style={s.errorBox}><pre style={{margin:0,fontFamily:'inherit',whiteSpace:'pre-wrap'}}>{error}</pre></div>}
            <div style={s.section}>Informations du compte</div>
            <div style={s.grid2}>
              <div style={s.field}>
                <label style={s.label}>Nom d'utilisateur *</label>
                <input value={form.username} onChange={e=>set('username',e.target.value)}
                  required disabled={isEdit} placeholder="ex: ahmed.tech"
                  style={isEdit?{opacity:0.5,cursor:'not-allowed'}:{}} />
              </div>
              <div style={s.field}>
                <label style={s.label}>Email</label>
                <input type="email" value={form.email} onChange={e=>set('email',e.target.value)} placeholder="ex: ahmed@mir.tn" />
              </div>
            </div>
            <div style={s.grid2}>
              <div style={s.field}>
                <label style={s.label}>Prénom</label>
                <input value={form.first_name} onChange={e=>set('first_name',e.target.value)} placeholder="Ahmed" />
              </div>
              <div style={s.field}>
                <label style={s.label}>Nom</label>
                <input value={form.last_name} onChange={e=>set('last_name',e.target.value)} placeholder="Ben Ali" />
              </div>
            </div>
            <div style={s.section}>Rôle & Département</div>
            <div style={s.grid2}>
              <div style={s.field}>
                <label style={s.label}>Rôle *</label>
                <select value={form.role} onChange={e=>set('role',e.target.value)}>
                  <option value="viewer">👁 Viewer</option>
                  <option value="technician">🔧 Technicien</option>
                  <option value="manager">📊 Manager</option>
                  <option value="admin">⚡ Admin</option>
                </select>
              </div>
              <div style={s.field}>
                <label style={s.label}>Département</label>
                <input value={form.department} onChange={e=>set('department',e.target.value)} placeholder="ex: IT, Opérations, Sécurité" />
              </div>
            </div>
            <div style={s.grid2}>
              <div style={s.field}>
                <label style={s.label}>Téléphone</label>
                <input value={form.phone_number} onChange={e=>set('phone_number',e.target.value)} placeholder="+216 XX XXX XXX" />
              </div>
              {isEdit && (
                <div style={s.field}>
                  <label style={s.label}>Statut</label>
                  <select value={form.is_active} onChange={e=>set('is_active',e.target.value==='true')}>
                    <option value="true">✅ Actif</option>
                    <option value="false">🚫 Inactif</option>
                  </select>
                </div>
              )}
            </div>
            {!isEdit && (
              <>
                <div style={s.section}>Mot de passe</div>
                <div style={s.grid2}>
                  <div style={s.field}>
                    <label style={s.label}>Mot de passe *</label>
                    <input type="password" value={form.password} onChange={e=>set('password',e.target.value)} required placeholder="Min. 8 caractères" />
                  </div>
                  <div style={s.field}>
                    <label style={s.label}>Confirmer *</label>
                    <input type="password" value={form.password2} onChange={e=>set('password2',e.target.value)} required placeholder="Répéter le mot de passe" />
                  </div>
                </div>
              </>
            )}
            <div style={s.actions}>
              <button type="button" style={s.cancelBtn} onClick={() => navigate('/users')}>Annuler</button>
              <button type="submit" style={s.submitBtn} disabled={loading}>
                {loading ? 'Enregistrement...' : isEdit ? 'Sauvegarder' : 'Créer l\'utilisateur'}
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
  field:{display:'flex',flexDirection:'column',gap:'6px'},
  label:{fontSize:'0.78rem',fontWeight:600,color:'#94a3b8',textTransform:'uppercase',letterSpacing:'0.05em'},
  actions:{display:'flex',justifyContent:'flex-end',gap:'1rem',marginTop:'2rem'},
  cancelBtn:{padding:'0.75rem 1.5rem',background:'rgba(255,255,255,0.05)',border:'1px solid rgba(255,255,255,0.1)',color:'#94a3b8',borderRadius:'10px',cursor:'pointer',fontWeight:600},
  submitBtn:{padding:'0.75rem 2rem',background:'linear-gradient(135deg,#6366f1,#8b5cf6)',color:'#fff',border:'none',borderRadius:'10px',cursor:'pointer',fontWeight:700,fontSize:'0.95rem',boxShadow:'0 0 20px rgba(99,102,241,0.4)'},
  errorBox:{background:'rgba(239,68,68,0.15)',border:'1px solid rgba(239,68,68,0.3)',color:'#fca5a5',padding:'0.75rem 1rem',borderRadius:'10px',marginBottom:'1rem',fontSize:'0.85rem'},
}
