import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getAssets, deleteAsset } from '../../api/assets'
import { useAuth } from '../../context/AuthContext'
import Layout from '../../components/Layout'

const STATUS = {
  active:      { bg:'rgba(16,185,129,0.15)', text:'#10b981', dot:'#10b981' },
  maintenance: { bg:'rgba(245,158,11,0.15)', text:'#f59e0b', dot:'#f59e0b' },
  retired:     { bg:'rgba(107,114,128,0.15)', text:'#9ca3af', dot:'#9ca3af' },
  lost:        { bg:'rgba(239,68,68,0.15)',   text:'#ef4444', dot:'#ef4444' },
}

export default function Assets() {
  const [assets, setAssets] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState('')
  const navigate = useNavigate()
  const { user } = useAuth()
  const canEdit = ['admin','manager'].includes(user?.role)

  const load = () => {
    setLoading(true)
    getAssets({ search, status: statusFilter || undefined }).then(r => {
      setAssets(r.data.results || r.data)
      setLoading(false)
    })
  }

  useEffect(() => { load() }, [search, statusFilter])

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Supprimer "${name}" ?`)) return
    await deleteAsset(id)
    load()
  }

  return (
    <Layout>
      <div className="fade-in">
        <div style={s.topbar}>
          <div>
            <h1 style={s.title}>📦 Gestion des Assets</h1>
            <p style={s.sub}>{assets.length} équipements enregistrés</p>
          </div>
          {canEdit && (
            <button style={s.addBtn} onClick={() => navigate('/assets/new')}>+ Nouvel Asset</button>
          )}
        </div>

        <div style={s.filters}>
          <input style={s.search} placeholder="🔍 Rechercher par nom ou numéro de série..."
            value={search} onChange={e => setSearch(e.target.value)} />
          <select style={s.select} value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
            <option value="">Tous les statuts</option>
            <option value="active">Active</option>
            <option value="maintenance">Maintenance</option>
            <option value="retired">Retiré</option>
            <option value="lost">Perdu</option>
          </select>
        </div>

        <div style={s.tableWrap}>
          {loading ? (
            <div style={s.loading}>
              <div style={s.loadingDots}>
                <span style={{animationDelay:'0s'}}>●</span>
                <span style={{animationDelay:'0.3s'}}>●</span>
                <span style={{animationDelay:'0.6s'}}>●</span>
              </div>
              Chargement...
            </div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Nom</th><th>Série</th><th>Statut</th>
                  <th>Catégorie</th><th>Localisation</th><th>Assigné à</th>
                  {canEdit && <th>Actions</th>}
                </tr>
              </thead>
              <tbody>
                {assets.length === 0 && (
                  <tr><td colSpan={7} style={s.empty}>Aucun asset trouvé.</td></tr>
                )}
                {assets.map(a => {
                  const st = STATUS[a.status] || STATUS.retired
                  return (
                    <tr key={a.id}>
                      <td style={{fontWeight:600, color:'#e2e8f0'}}>{a.name}</td>
                      <td style={{fontFamily:'monospace', color:'#6366f1', fontSize:'0.82rem'}}>{a.serial_number}</td>
                      <td>
                        <span style={{...s.badge, background:st.bg, color:st.text}}>
                          <span style={{...s.dot, background:st.dot}} />{a.status}
                        </span>
                      </td>
                      <td>{a.category_name || '—'}</td>
                      <td>{a.location_name || '—'}</td>
                      <td>{a.assigned_to_name || <span style={{color:'#475569'}}>—</span>}</td>
                      {canEdit && (
                        <td>
                          <div style={{display:'flex', gap:'6px'}}>
                            <button style={s.editBtn} onClick={() => navigate(`/assets/${a.id}/edit`)}>✏️ Edit</button>
                            <button style={s.delBtn} onClick={() => handleDelete(a.id, a.name)}>🗑</button>
                          </div>
                        </td>
                      )}
                    </tr>
                  )
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </Layout>
  )
}

const s = {
  topbar: { display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'1.5rem', flexWrap:'wrap', gap:'1rem' },
  title: { fontSize:'1.6rem', fontWeight:800, color:'#e2e8f0', margin:0 },
  sub: { color:'#6366f1', fontSize:'0.85rem', marginTop:'4px' },
  addBtn: { padding:'0.7rem 1.5rem', background:'linear-gradient(135deg,#6366f1,#8b5cf6)', color:'#fff', border:'none', borderRadius:'10px', cursor:'pointer', fontWeight:700, fontSize:'0.9rem', boxShadow:'0 0 20px rgba(99,102,241,0.4)', whiteSpace:'nowrap' },
  filters: { display:'flex', gap:'1rem', marginBottom:'1.5rem', flexWrap:'wrap' },
  search: { flex:1, minWidth:'200px' },
  select: { width:'200px' },
  tableWrap: { background:'rgba(255,255,255,0.02)', border:'1px solid rgba(99,102,241,0.2)', borderRadius:'16px', overflow:'hidden' },
  loading: { padding:'3rem', textAlign:'center', color:'#475569', display:'flex', flexDirection:'column', alignItems:'center', gap:'1rem' },
  loadingDots: { display:'flex', gap:'8px', fontSize:'1.5rem', color:'#6366f1', animation:'dots 1s ease-in-out infinite' },
  empty: { padding:'3rem', textAlign:'center', color:'#475569' },
  badge: { display:'inline-flex', alignItems:'center', gap:'6px', padding:'4px 10px', borderRadius:'99px', fontSize:'0.78rem', fontWeight:600 },
  dot: { width:'6px', height:'6px', borderRadius:'50%', flexShrink:0 },
  editBtn: { padding:'4px 10px', background:'rgba(99,102,241,0.15)', border:'1px solid rgba(99,102,241,0.3)', borderRadius:'6px', color:'#a5b4fc', cursor:'pointer', fontSize:'0.78rem', whiteSpace:'nowrap' },
  delBtn: { padding:'4px 8px', background:'rgba(239,68,68,0.15)', border:'1px solid rgba(239,68,68,0.3)', borderRadius:'6px', color:'#fca5a5', cursor:'pointer', fontSize:'0.78rem' },
}
