import { useEffect, useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { getAllUsers, updateSubscriptionAdmin, supabase } from '../lib/supabase'
import { IconRefresh } from '../components/Icons'
import Footer from '../components/Footer'
import './Admin.css'

const formatDate = (d) =>
  d ? new Date(d).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' }) : '—'

export default function Admin() {
  const [users, setUsers]         = useState([])
  const [loading, setLoading]     = useState(true)
  const [search, setSearch]       = useState('')
  const [filter, setFilter]       = useState('all')
  const [editing, setEditing]     = useState(null)   // userId being edited
  const [saving, setSaving]       = useState(false)
  const [toast, setToast]         = useState(null)
  const [editForm, setEditForm]   = useState({})
  const [stats, setStats]         = useState({ total: 0, active: 0, inactive: 0, revenue: 0 })

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
      const inactive = data.filter(u => !u.subscriptions?.[0] || u.subscriptions[0].status !== 'active').length
      const revenue  = data
        .filter(u => u.subscriptions?.[0]?.status === 'active')
        .reduce((acc, u) => acc + (u.subscriptions[0].plan === 'annual' ? 19.99 : 29.99), 0)
      setStats({ total: data.length, active, inactive, revenue: revenue.toFixed(2) })
    } catch (e) {
      showToast('Error cargando usuarios.', 'error')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  const startEdit = (user) => {
    const sub = user.subscriptions?.[0]
    setEditing(user.id)
    setEditForm({
      status:     sub?.status || 'inactive',
      plan:       sub?.plan || 'monthly',
      start_date: sub?.start_date ? sub.start_date.split('T')[0] : '',
      end_date:   sub?.end_date   ? sub.end_date.split('T')[0]   : '',
      role:       user.role || 'member',
    })
  }

  const saveEdit = async (user) => {
    setSaving(true)
    try {
      const sub = user.subscriptions?.[0]

      // Update role
      await supabase.from('profiles').update({ role: editForm.role }).eq('id', user.id)

      if (sub) {
        await updateSubscriptionAdmin(user.id, {
          status:     editForm.status,
          plan:       editForm.plan,
          start_date: editForm.start_date || null,
          end_date:   editForm.end_date   || null,
        })
      } else if (editForm.status === 'active') {
        const end = new Date()
        end.setMonth(end.getMonth() + (editForm.plan === 'annual' ? 12 : 1))
        await supabase.from('subscriptions').insert({
          user_id:    user.id,
          status:     'active',
          plan:       editForm.plan,
          start_date: new Date().toISOString(),
          end_date:   end.toISOString(),
        })
      }

      setEditing(null)
      await load()
      showToast('Usuario actualizado.')
    } catch (e) {
      showToast('Error al guardar.', 'error')
    } finally {
      setSaving(false)
    }
  }

  const deleteUser = async (userId) => {
    if (!window.confirm('¿Eliminar este usuario? Esta acción no se puede deshacer.')) return
    try {
      await supabase.from('subscriptions').delete().eq('user_id', userId)
      await supabase.from('profiles').delete().eq('id', userId)
      await supabase.auth.admin?.deleteUser(userId)
      await load()
      showToast('Usuario eliminado.')
    } catch {
      showToast('Error al eliminar el usuario.', 'error')
    }
  }

  const filtered = users.filter(u => {
    const matchSearch = u.email.toLowerCase().includes(search.toLowerCase())
    const sub = u.subscriptions?.[0]
    const matchFilter =
      filter === 'all'      ? true :
      filter === 'active'   ? sub?.status === 'active' :
      filter === 'inactive' ? (!sub || sub.status !== 'active') :
      filter === 'admin'    ? u.role === 'admin' : true
    return matchSearch && matchFilter
  })

  return (
    <div className="page admin">
      {toast && (
        <div className={`dash-toast dash-toast--${toast.type} animate-fade-up`}>
          {toast.msg}
        </div>
      )}

      <div className="container admin__inner">
        {/* Header */}
        <div className="admin-header animate-fade-up">
          <div>
            <span className="admin-header__eyebrow">Panel de administración</span>
            <h1 className="admin-header__title">Gestión de usuarios</h1>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <Link to="/adminconfig" className="btn btn-outline">⚙ Configurar Home</Link>
            <button className="btn btn-outline" onClick={load} disabled={loading}>
              {loading ? <span className="spinner" /> : <><IconRefresh size={15} /> Actualizar</>}
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="admin-stats animate-fade-up animate-fade-up-delay-1">
          {[
            { label: 'Total usuarios',      val: stats.total,    color: '' },
            { label: 'Suscrip. activas',    val: stats.active,   color: 'var(--success)' },
            { label: 'Sin suscripción',     val: stats.inactive, color: 'var(--danger)' },
            { label: 'Ingresos mensuales',  val: `${stats.revenue}€`, color: 'var(--accent)' },
          ].map(s => (
            <div key={s.label} className="admin-stat-card">
              <span className="admin-stat-card__val" style={{ color: s.color || 'var(--text)' }}>
                {s.val}
              </span>
              <span className="admin-stat-card__label">{s.label}</span>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="admin-filters animate-fade-up animate-fade-up-delay-2">
          <input
            className="form-input admin-search"
            placeholder="Buscar por email…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <div className="admin-filter-tabs">
            {[
              { key: 'all',      label: 'Todos' },
              { key: 'active',   label: 'Activos' },
              { key: 'inactive', label: 'Inactivos' },
              { key: 'admin',    label: 'Admins' },
            ].map(t => (
              <button
                key={t.key}
                className={`admin-filter-tab ${filter === t.key ? 'admin-filter-tab--active' : ''}`}
                onClick={() => setFilter(t.key)}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="admin-table-wrap animate-fade-up animate-fade-up-delay-3">
          {loading ? (
            <div className="admin-table-empty">
              <div className="spinner" style={{ width: 32, height: 32, borderTopColor: 'var(--accent)' }} />
            </div>
          ) : filtered.length === 0 ? (
            <div className="admin-table-empty">
              <p>No se encontraron usuarios.</p>
            </div>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Email</th>
                  <th>Rol</th>
                  <th>Plan</th>
                  <th>Estado</th>
                  <th>Vencimiento</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(u => {
                  const sub = u.subscriptions?.[0]
                  const isEditing = editing === u.id

                  return (
                    <tr key={u.id} className={isEditing ? 'admin-table__row--editing' : ''}>
                      <td className="admin-table__email">{u.email}</td>

                      {/* Role */}
                      <td>
                        {isEditing ? (
                          <select
                            className="form-input admin-select"
                            value={editForm.role}
                            onChange={e => setEditForm(f => ({ ...f, role: e.target.value }))}
                          >
                            <option value="member">member</option>
                            <option value="admin">admin</option>
                          </select>
                        ) : (
                          <span className={`admin-role ${u.role === 'admin' ? 'admin-role--admin' : ''}`}>
                            {u.role}
                          </span>
                        )}
                      </td>

                      {/* Plan */}
                      <td>
                        {isEditing ? (
                          <select
                            className="form-input admin-select"
                            value={editForm.plan}
                            onChange={e => setEditForm(f => ({ ...f, plan: e.target.value }))}
                          >
                            <option value="monthly">Mensual</option>
                            <option value="annual">Anual</option>
                          </select>
                        ) : (
                          <span className="admin-plan">
                            {sub?.plan === 'annual' ? 'Anual' : sub ? 'Mensual' : '—'}
                          </span>
                        )}
                      </td>

                      {/* Status */}
                      <td>
                        {isEditing ? (
                          <select
                            className="form-input admin-select"
                            value={editForm.status}
                            onChange={e => setEditForm(f => ({ ...f, status: e.target.value }))}
                          >
                            <option value="active">active</option>
                            <option value="inactive">inactive</option>
                          </select>
                        ) : (
                          <span className={`badge ${sub?.status === 'active' ? 'badge-active' : 'badge-inactive'}`}>
                            {sub?.status === 'active' ? 'Activa' : 'Inactiva'}
                          </span>
                        )}
                      </td>

                      {/* End date */}
                      <td>
                        {isEditing ? (
                          <input
                            type="date"
                            className="form-input admin-select"
                            value={editForm.end_date}
                            onChange={e => setEditForm(f => ({ ...f, end_date: e.target.value }))}
                          />
                        ) : (
                          <span className="admin-date">{formatDate(sub?.end_date)}</span>
                        )}
                      </td>

                      {/* Actions */}
                      <td>
                        <div className="admin-actions">
                          {isEditing ? (
                            <>
                              <button
                                className="btn btn-primary admin-btn"
                                onClick={() => saveEdit(u)}
                                disabled={saving}
                              >
                                {saving ? <span className="spinner" style={{ width: 14, height: 14 }} /> : 'Guardar'}
                              </button>
                              <button
                                className="btn btn-outline admin-btn"
                                onClick={() => setEditing(null)}
                              >
                                Cancelar
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                className="btn btn-outline admin-btn"
                                onClick={() => startEdit(u)}
                              >
                                Editar
                              </button>
                              <button
                                className="btn btn-danger admin-btn"
                                onClick={() => deleteUser(u.id)}
                              >
                                Eliminar
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          )}
        </div>

        <p className="admin-count">
          Mostrando {filtered.length} de {users.length} usuarios
        </p>
      </div>

      <Footer />
    </div>
  )
}
