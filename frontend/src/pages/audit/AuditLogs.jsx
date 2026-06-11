import { useEffect, useState } from 'react'
import { getAuditLogs } from '../../api/audit'
import Layout from '../../components/Layout'

export default function AuditLogs() {
  const [logs, setLogs] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getAuditLogs().then(r => {
      setLogs(r.data.results || r.data)
      setLoading(false)
    })
  }, [])

  const actionColor = (a) => {
    if (a.includes('created')) return { bg:'rgba(16,185,129,0.15)', text:'#34d399' }
    if (a.includes('updated')) return { bg:'rgba(59,130,246,0.15)', text:'#60a5fa' }
    if (a.includes('deleted')) return { bg:'rgba(239,68,68,0.15)', text:'#f87171' }
    return { bg:'rgba(107,114,128,0.15)', text:'#9ca3af' }
  }

  return (
    <Layout>
      <div className="fade-in">
        <div style={s.topbar}>
          <div>
            <h1 style={s.title}>📋 Journal d'Audit</h1>
            <p style={s.sub}>{logs.length} entrées enregistrées</p>
          </div>
        </div>

        <div style={s.tableWrap}>
          {loading ? <div style={s.loading}>Chargement...</div> : (
            <table>
              <thead>
                <tr>
                  <th>Action</th><th>Utilisateur</th><th>Asset</th><th>Adresse IP</th><th>Horodatage</th>
                </tr>
              </thead>
              <tbody>
                {logs.length === 0 && <tr><td colSpan={5} style={s.empty}>Aucun log trouvé.</td></tr>}
                {logs.map(l => {
                  const ac = actionColor(l.action)
                  return (
                    <tr key={l.id}>
                      <td><span style={{...s.badge, background:ac.bg, color:ac.text}}>{l.action}</span></td>
                      <td style={{color:'#e2e8f0', fontWeight:500}}>{l.user_name}</td>
                      <td style={{color:'#94a3b8'}}>{l.asset_name || '—'}</td>
                      <td style={{fontFamily:'monospace', color:'#6366f1', fontSize:'0.82rem'}}>{l.ip_address || '—'}</td>
                      <td style={{color:'#475569', fontSize:'0.82rem'}}>{new Date(l.timestamp).toLocaleString('fr-TN')}</td>
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
  topbar: { display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'1.5rem' },
  title: { fontSize:'1.6rem', fontWeight:800, color:'#e2e8f0', margin:0 },
  sub: { color:'#6366f1', fontSize:'0.85rem', marginTop:'4px' },
  tableWrap: { background:'rgba(255,255,255,0.02)', border:'1px solid rgba(99,102,241,0.2)', borderRadius:'16px', overflow:'hidden' },
  loading: { padding:'3rem', textAlign:'center', color:'#475569' },
  empty: { padding:'3rem', textAlign:'center', color:'#475569' },
  badge: { padding:'4px 10px', borderRadius:'6px', fontSize:'0.78rem', fontWeight:600, fontFamily:'monospace' },
}
