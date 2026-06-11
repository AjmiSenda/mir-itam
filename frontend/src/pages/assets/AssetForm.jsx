import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getAsset, createAsset, updateAsset, getCategories, getLocations } from '../../api/assets'
import { getUsers } from '../../api/users'
import Layout from '../../components/Layout'

export default function AssetForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = Boolean(id)
  const [form, setForm] = useState({
    name:'', serial_number:'', status:'active',
    category:'', location:'', assigned_to:'',
    purchase_date:'', warranty_expiry:'', purchase_price:'', notes:''
  })
  const [categories, setCategories] = useState([])
  const [locations, setLocations] = useState([])
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    Promise.all([getCategories(), getLocations(), getUsers()]).then(([c,l,u]) => {
      setCategories(c.data.results||c.data)
      setLocations(l.data.results||l.data)
      setUsers(u.data.results||u.data)
    })
    if (isEdit) {
      getAsset(id).then(r => {
        const a = r.data
        setForm({
          name:a.name||'', serial_number:a.serial_number||'',
          status:a.status||'active', category:a.category||'',
          location:a.location||'', assigned_to:a.assigned_to||'',
          purchase_date:a.purchase_date||'', warranty_expiry:a.warranty_expiry||'',
          purchase_price:a.purchase_price||'', notes:a.notes||''
        })
      })
    }
  }, [id])

  const set = (k,v) => setForm(f => ({...f,[k]:v}))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const payload = {...form}
    if (!payload.assigned_to) delete payload.assigned_to
    if (!payload.purchase_date) delete payload.purchase_date
    if (!payload.warranty_expiry) delete payload.warranty_expiry
    if (!payload.purchase_price) delete payload.purchase_price
    try {
      if (isEdit) await updateAsset(id, payload)
      else await createAsset(payload)
      navigate('/assets')
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
            <h1 style={s.title}>{isEdit ? '✏️ Modifier Asset' : '➕ Nouvel Asset'}</h1>
            <p style={s.sub}>Aéroport Habib Bourguiba — Monastir</p>
          </div>
          <button style={s.backBtn} onClick={() => navigate('/assets')}>← Retour</button>
        </div>
        <div style={s.card}>
          <form onSubmit={handleSubmit}>
            {error && <div style={s.errorBox}>{error}</div>}
            <div style={s.section}>Informations de base</div>
            <div style={s.grid2}>
              <div style={s.field}>
                <label style={s.label}>Nom de l'asset *</label>
                <input value={form.name} onChange={e=>set('name',e.target.value)} required placeholder="ex: Dell Latitude 5520" />
              </div>
              <div style={s.field}>
                <label style={s.label}>Numéro de série *</label>
                <input value={form.serial_number} onChange={e=>set('serial_number',e.target.value)} required placeholder="ex: SN-MIR-001" />
              </div>
            </div>
            <div style={s.grid2}>
              <div style={s.field}>
                <label style={s.label}>Statut *</label>
                <select value={form.status} onChange={e=>set('status',e.target.value)}>
                  <option value="active">Active</option>
                  <option value="maintenance">Maintenance</option>
                  <option value="retired">Retiré</option>
                  <option value="lost">Perdu</option>
                </select>
              </div>
              <div style={s.field}>
                <label style={s.label}>Assigné à</label>
                <select value={form.assigned_to} onChange={e=>set('assigned_to',e.target.value)}>
                  <option value="">— Non assigné —</option>
                  {users.map(u=><option key={u.id} value={u.id}>{u.username} ({u.role})</option>)}
                </select>
              </div>
            </div>
            <div style={s.section}>Localisation & Catégorie</div>
            <div style={s.grid2}>
              <div style={s.field}>
                <label style={s.label}>Catégorie *</label>
                <select value={form.category} onChange={e=>set('category',e.target.value)} required>
                  <option value="">— Sélectionner —</option>
                  {categories.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div style={s.field}>
                <label style={s.label}>Localisation *</label>
                <select value={form.location} onChange={e=>set('location',e.target.value)} required>
                  <option value="">— Sélectionner —</option>
                  {locations.map(l=><option key={l.id} value={l.id}>{l.name} — {l.terminal}</option>)}
                </select>
              </div>
            </div>
            <div style={s.section}>Financier & Garantie</div>
            <div style={s.grid3}>
              <div style={s.field}>
                <label style={s.label}>Date d'achat</label>
                <input type="date" value={form.purchase_date} onChange={e=>set('purchase_date',e.target.value)} />
              </div>
              <div style={s.field}>
                <label style={s.label}>Fin de garantie</label>
                <input type="date" value={form.warranty_expiry} onChange={e=>set('warranty_expiry',e.target.value)} />
              </div>
              <div style={s.field}>
                <label style={s.label}>Prix d'achat (TND)</label>
                <input type="number" step="0.01" value={form.purchase_price} onChange={e=>set('purchase_price',e.target.value)} placeholder="0.00" />
              </div>
            </div>
            <div style={s.section}>Notes</div>
            <textarea style={{width:'100%',height:'100px',resize:'vertical',padding:'0.75rem',background:'rgba(255,255,255,0.05)',border:'1px solid rgba(99,102,241,0.3)',borderRadius:'10px',color:'#e2e8f0',fontSize:'0.9rem',boxSizing:'border-box'}}
              value={form.notes} onChange={e=>set('notes',e.target.value)} placeholder="Notes supplémentaires..." />
            <div style={s.actions}>
              <button type="button" style={s.cancelBtn} onClick={() => navigate('/assets')}>Annuler</button>
              <button type="submit" style={s.submitBtn} disabled={loading}>
                {loading ? 'Enregistrement...' : isEdit ? 'Sauvegarder' : 'Créer l\'asset'}
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
  grid3:{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:'1rem',marginBottom:'1rem'},
  field:{display:'flex',flexDirection:'column',gap:'6px'},
  label:{fontSize:'0.78rem',fontWeight:600,color:'#94a3b8',textTransform:'uppercase',letterSpacing:'0.05em'},
  actions:{display:'flex',justifyContent:'flex-end',gap:'1rem',marginTop:'2rem'},
  cancelBtn:{padding:'0.75rem 1.5rem',background:'rgba(255,255,255,0.05)',border:'1px solid rgba(255,255,255,0.1)',color:'#94a3b8',borderRadius:'10px',cursor:'pointer',fontWeight:600},
  submitBtn:{padding:'0.75rem 2rem',background:'linear-gradient(135deg,#6366f1,#8b5cf6)',color:'#fff',border:'none',borderRadius:'10px',cursor:'pointer',fontWeight:700,fontSize:'0.95rem',boxShadow:'0 0 20px rgba(99,102,241,0.4)'},
  errorBox:{background:'rgba(239,68,68,0.15)',border:'1px solid rgba(239,68,68,0.3)',color:'#fca5a5',padding:'0.75rem 1rem',borderRadius:'10px',marginBottom:'1rem',fontSize:'0.85rem'},
}
