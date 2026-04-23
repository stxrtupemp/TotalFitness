import { useEffect, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { getAllUsers, updateSubscriptionAdmin } from '../lib/supabase'
import Footer from '../components/Footer'
import {
  NEON, CYAN, BG, SURFACE, BORDER, TEXT, MUTED,
  useWidth, Icon, NeonButton, GhostButton, GlassCard, Badge, StatCard,
} from '../components/UI'

const fmtDate = (d) => d ? new Date(d).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' }) : '—'

export default function Admin() {
  const navigate = useNavigate()
  const bp       = useWidth()
  const isMobile = bp === 'xs'

  const [users,   setUsers]   = useState([])
  const [loading, setLoading] = useState(true)
  const [search,  setSearch]  = useState('')
  const [tab,     setTab]     = useState('users')
  const [editId,  setEditId]  = useState(null)
  const [editData,setEditData]= useState({})
  const [saving,  setSaving]  = useState(false)
  const [toast,   setToast]   = useState(null)
  const [stats,   setStats]   = useState({ total: 0, active: 0, inactive: 0, revenue: '0.00' })

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3000)
  }

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const data = await getAllUsers()
      setUsers(data)
      const active   = data.filter(u => u.subscriptions?.[0]?.status === 'active').length
      const inactive = data.length - active
      const revenue  = data
        .filter(u => u.subscriptions?.[0]?.status === 'active')
        .reduce((acc, u) => acc + (u.subscriptions[0].plan === 'annual' ? 19.99 : 29.99), 0)
      setStats({ total: data.length, active, inactive, revenue: revenue.toFixed(2) })
    } catch {
      showToast('Error cargando usuarios.', 'error')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  const startEdit = (u) => {
    const sub = u.subscriptions?.[0]
    setEditId(u.id)
    setEditData({ plan: sub?.plan || '', status: sub?.status || 'inactive' })
  }

  const saveEdit = async (userId) => {
    setSaving(true)
    try {
      await updateSubscriptionAdmin(userId, { plan: editData.plan || null, status: editData.status })
      await load()
      setEditId(null)
      showToast('Usuario actualizado.')
    } catch {
      showToast('Error al guardar.', 'error')
    } finally {
      setSaving(false)
    }
  }

  const filtered  = users.filter(u => u.name?.toLowerCase().includes(search.toLowerCase()) || u.email?.toLowerCase().includes(search.toLowerCase()))
  const annualCnt = users.filter(u => u.subscriptions?.[0]?.plan === 'annual').length
  const monthlyCnt= users.filter(u => u.subscriptions?.[0]?.plan === 'monthly').length

  const thS = { color: MUTED, fontFamily: "'Inter', sans-serif", fontSize: '0.68rem', fontWeight: 600, letterSpacing: '0.09em', textTransform: 'uppercase', padding: '0.75rem 1rem', textAlign: 'left', borderBottom: `1px solid ${BORDER}`, whiteSpace: 'nowrap' }
  const tdS = { padding: '0.875rem 1rem', borderBottom: `1px solid ${BORDER}`, fontFamily: "'Inter', sans-serif", fontSize: '0.85rem', color: TEXT, verticalAlign: 'middle' }

  if (loading) {
    return (
      <div style={{ background: BG, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="spinner" style={{ width: 36, height: 36 }} />
      </div>
    )
  }

  return (
    <div style={{ background: BG, minHeight: '100vh', paddingTop: '64px', color: TEXT }}>
      {toast && (
        <div style={{ position: 'fixed', top: '80px', left: '50%', transform: 'translateX(-50%)', zIndex: 3000, background: toast.type === 'error' ? '#ff446618' : `${NEON}18`, border: `1px solid ${toast.type === 'error' ? '#ff446640' : NEON + '40'}`, color: toast.type === 'error' ? '#ff4466' : NEON, padding: '0.75rem 1.5rem', borderRadius: '8px', fontFamily: "'Inter', sans-serif", fontSize: '0.875rem', backdropFilter: 'blur(10px)', whiteSpace: 'nowrap' }}>
          {toast.msg}
        </div>
      )}

      <div style={{ maxWidth: '1300px', margin: '0 auto', padding: 'clamp(1.5rem,4vw,3rem) clamp(1.25rem,4vw,2rem)' }}>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: isMobile ? 'flex-start' : 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
          <div>
            <div style={{ color: MUTED, fontFamily: "'Inter', sans-serif", fontSize: '0.75rem', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '0.25rem' }}>Panel de administración</div>
            <h1 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 'clamp(1.75rem,5vw,2.5rem)', fontWeight: 900, color: TEXT, margin: 0 }}>
              <span style={{ color: NEON }}>TOTAL</span>FITNESS Admin
            </h1>
          </div>
          <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
            <GhostButton small onClick={() => navigate('/adminconfig')}>Configuración</GhostButton>
            <GhostButton small onClick={() => navigate('/')}>Ir a la web</GhostButton>
            <button onClick={load} style={{ background: 'none', border: `1px solid ${BORDER}`, borderRadius: '6px', padding: '0.4rem', color: MUTED, cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
              <Icon name="refresh" size={15} color={MUTED} />
            </button>
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: `repeat(${isMobile ? 2 : 4}, 1fr)`, gap: '0.875rem', marginBottom: '2rem' }}>
          <StatCard label="Ingresos mensuales" value={`${stats.revenue}€`} sub="MRR" />
          <StatCard label="Miembros activos"   value={stats.active}  sub={`de ${stats.total}`} color={CYAN} />
          <StatCard label="Plan anual"          value={annualCnt}     sub="Suscripciones"        color="#aa88ff" />
          <StatCard label="Plan mensual"        value={monthlyCnt}    sub="Suscripciones"        color="#ff6644" />
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', marginBottom: '1.5rem', borderBottom: `1px solid ${BORDER}` }}>
          {[['users','Usuarios'], ['revenue','Ingresos']].map(([id, label]) => (
            <button key={id} onClick={() => setTab(id)} style={{ background: 'none', border: 'none', borderBottom: `2px solid ${tab === id ? NEON : 'transparent'}`, color: tab === id ? NEON : MUTED, padding: '0.75rem 1.25rem', cursor: 'pointer', fontFamily: "'Barlow Condensed', sans-serif", fontSize: '0.95rem', fontWeight: 700, letterSpacing: '0.05em', transition: 'all 0.2s', marginBottom: '-1px' }}>{label}</button>
          ))}
        </div>

        {tab === 'users' && (
          <GlassCard style={{ padding: 0, overflow: 'hidden' }}>
            <div style={{ padding: '1rem 1.25rem', display: 'flex', gap: '0.875rem', alignItems: 'center', borderBottom: `1px solid ${BORDER}`, flexWrap: 'wrap' }}>
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar usuario..."
                style={{ flex: 1, minWidth: '160px', background: 'rgba(255,255,255,0.04)', border: `1px solid ${BORDER}`, borderRadius: '6px', padding: '0.55rem 0.875rem', color: TEXT, fontFamily: "'Inter', sans-serif", fontSize: '0.85rem', outline: 'none' }} />
              <Badge>{filtered.length} usuarios</Badge>
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '640px' }}>
                <thead>
                  <tr>
                    {['Usuario', 'Plan', 'Estado', 'Registrado', '€/mes', 'Acciones'].map(h => <th key={h} style={thS}>{h}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(u => {
                    const sub    = u.subscriptions?.[0]
                    const isEdit = editId === u.id
                    const rev    = sub?.status === 'active' ? (sub?.plan === 'annual' ? '19.99' : '29.99') : '0.00'
                    return (
                      <tr key={u.id}
                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                        style={{ transition: 'background 0.15s' }}>
                        <td style={tdS}>
                          <div style={{ fontWeight: 500 }}>{u.name || '—'}</div>
                          <div style={{ color: MUTED, fontSize: '0.72rem' }}>{u.email}</div>
                        </td>
                        <td style={tdS}>
                          {isEdit
                            ? <select value={editData.plan} onChange={e => setEditData(p => ({ ...p, plan: e.target.value, status: e.target.value ? 'active' : 'inactive' }))}
                                style={{ background: '#0d1219', border: `1px solid ${NEON}44`, borderRadius: '4px', padding: '0.3rem 0.5rem', color: TEXT, fontFamily: "'Inter', sans-serif", fontSize: '0.8rem', outline: 'none' }}>
                                <option value="">Sin plan</option>
                                <option value="monthly">Mensual</option>
                                <option value="annual">Anual</option>
                              </select>
                            : sub?.plan
                              ? <Badge color="green">{sub.plan === 'annual' ? 'Anual' : 'Mensual'}</Badge>
                              : <Badge color="red">Sin plan</Badge>
                          }
                        </td>
                        <td style={tdS}>
                          {isEdit
                            ? <select value={editData.status} onChange={e => setEditData(p => ({ ...p, status: e.target.value }))}
                                style={{ background: '#0d1219', border: `1px solid ${NEON}44`, borderRadius: '4px', padding: '0.3rem 0.5rem', color: TEXT, fontFamily: "'Inter', sans-serif", fontSize: '0.8rem', outline: 'none' }}>
                                <option value="active">Activo</option>
                                <option value="inactive">Inactivo</option>
                              </select>
                            : <Badge color={sub?.status === 'active' ? 'green' : 'red'}>{sub?.status === 'active' ? 'Activo' : 'Inactivo'}</Badge>
                          }
                        </td>
                        <td style={{ ...tdS, color: MUTED, fontSize: '0.78rem' }}>{fmtDate(u.created_at)}</td>
                        <td style={{ ...tdS, fontFamily: "'Barlow Condensed', sans-serif", color: NEON, fontWeight: 700 }}>{rev}€</td>
                        <td style={tdS}>
                          <div style={{ display: 'flex', gap: '0.4rem' }}>
                            {isEdit ? (
                              <>
                                <button onClick={() => saveEdit(u.id)} disabled={saving} style={{ background: `${NEON}18`, border: `1px solid ${NEON}44`, borderRadius: '4px', color: NEON, padding: '0.3rem 0.7rem', cursor: 'pointer', fontSize: '0.75rem', fontFamily: "'Inter', sans-serif", fontWeight: 600 }}>
                                  {saving ? '...' : 'Guardar'}
                                </button>
                                <button onClick={() => setEditId(null)} style={{ background: 'transparent', border: `1px solid ${BORDER}`, borderRadius: '4px', color: MUTED, padding: '0.3rem 0.6rem', cursor: 'pointer', fontSize: '0.75rem', fontFamily: "'Inter', sans-serif" }}>Cancelar</button>
                              </>
                            ) : (
                              <button onClick={() => startEdit(u)} style={{ background: 'transparent', border: `1px solid ${BORDER}`, borderRadius: '4px', color: MUTED, padding: '0.3rem 0.7rem', cursor: 'pointer', fontSize: '0.75rem', fontFamily: "'Inter', sans-serif" }}>Editar</button>
                            )}
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </GlassCard>
        )}

        {tab === 'revenue' && (
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '2fr 1fr', gap: '1.25rem' }}>
            <GlassCard style={{ padding: 'clamp(1.25rem,3vw,2rem)' }}>
              <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '1rem', fontWeight: 800, color: TEXT, marginBottom: '1.5rem' }}>Ingresos por mes (2026)</div>
              {(() => {
                const chartH = 130
                const months = ['E','F','M','A','M','J','J','A','S','O','N','D']
                const vals   = [62,78,85,91,110,128,135,142,138,155,168,175]
                const max    = 175
                const curMonth = new Date().getMonth()
                return (
                  <div style={{ display: 'flex', alignItems: 'flex-end', gap: '0.4rem' }}>
                    {vals.map((v, i) => {
                      const cur  = i === curMonth
                      const barH = Math.round((v / max) * chartH)
                      return (
                        <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.35rem' }}>
                          <div style={{ width: '100%', height: `${barH}px`, background: cur ? `linear-gradient(0deg, ${NEON}, ${NEON}77)` : 'rgba(255,255,255,0.09)', borderRadius: '2px 2px 0 0', boxShadow: cur ? `0 0 10px ${NEON}40` : 'none' }} />
                          <div style={{ color: cur ? NEON : MUTED, fontSize: '0.6rem', fontFamily: "'Inter', sans-serif" }}>{months[i]}</div>
                        </div>
                      )
                    })}
                  </div>
                )
              })()}
            </GlassCard>

            <GlassCard style={{ padding: 'clamp(1.25rem,3vw,2rem)' }}>
              <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '1rem', fontWeight: 800, color: TEXT, marginBottom: '1.5rem' }}>Distribución</div>
              {[
                { label: 'Plan Anual',   count: annualCnt,  color: NEON,      total: users.length },
                { label: 'Plan Mensual', count: monthlyCnt, color: CYAN,      total: users.length },
                { label: 'Sin plan',     count: users.filter(u => !u.subscriptions?.[0]?.plan).length, color: '#ff4466', total: users.length },
              ].map(({ label, count, color, total }) => {
                const pct = total > 0 ? Math.round((count / total) * 100) : 0
                return (
                  <div key={label} style={{ marginBottom: '1.1rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
                      <span style={{ color: MUTED, fontSize: '0.8rem', fontFamily: "'Inter', sans-serif" }}>{label}</span>
                      <span style={{ color, fontSize: '0.8rem', fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700 }}>{count} ({pct}%)</span>
                    </div>
                    <div style={{ height: '5px', background: BORDER, borderRadius: '3px', overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${pct}%`, background: color, borderRadius: '3px' }} />
                    </div>
                  </div>
                )
              })}
            </GlassCard>
          </div>
        )}
      </div>

      <Footer />
    </div>
  )
}
