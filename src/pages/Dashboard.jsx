import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useSubscription } from '../hooks/useSubscription'
import { createSubscription, cancelSubscription } from '../lib/supabase'
import PaymentModal from '../components/PaymentModal'
import Footer from '../components/Footer'
import './Dashboard.css'

export default function Dashboard() {
  const { user, profile }                   = useAuth()
  const { subscription, loading, refetch, isActive, daysLeft } = useSubscription(user?.id)
  const [showModal, setShowModal]           = useState(false)
  const [cancelling, setCancelling]         = useState(false)
  const [toast, setToast]                   = useState(null)

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3500)
  }

  const handlePaymentSuccess = async (plan) => {
    setShowModal(false)
    try {
      await createSubscription(user.id, plan)
      await refetch()
      showToast('¡Suscripción activada correctamente!')
    } catch (e) {
      showToast('Error al activar la suscripción.', 'error')
    }
  }

  const handleCancel = async () => {
    if (!window.confirm('¿Estás seguro de que quieres cancelar tu suscripción?')) return
    setCancelling(true)
    try {
      await cancelSubscription(user.id)
      await refetch()
      showToast('Suscripción cancelada.')
    } catch (e) {
      showToast('Error al cancelar.', 'error')
    } finally {
      setCancelling(false)
    }
  }

  const handleRenew = async () => {
    setShowModal(true)
  }

  const formatDate = (d) => d
    ? new Date(d).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })
    : '—'

  if (loading) {
    return (
      <div className="page dash-loading">
        <div className="spinner" style={{ width: 36, height: 36, borderTopColor: 'var(--accent)' }} />
      </div>
    )
  }

  return (
    <div className="page dashboard">
      {toast && (
        <div className={`dash-toast dash-toast--${toast.type} animate-fade-up`}>
          {toast.msg}
        </div>
      )}

      <div className="container dashboard__inner">
        {/* Header */}
        <div className="dash-header animate-fade-up">
          <div>
            <span className="dash-header__eyebrow">Panel de usuario</span>
            <h1 className="dash-header__title">Mi cuenta</h1>
            <p className="dash-header__email">{user?.email}</p>
          </div>
          <div className={`badge ${isActive ? 'badge-active' : 'badge-inactive'}`} style={{ alignSelf: 'flex-start' }}>
            <span className={`badge-dot ${isActive ? 'badge-dot--active' : ''}`} />
            {isActive ? 'Suscripción activa' : 'Sin suscripción'}
          </div>
        </div>

        <div className="dash-grid">
          {/* Subscription card */}
          <div className="card dash-sub animate-fade-up animate-fade-up-delay-1">
            <div className="dash-sub__head">
              <h2 className="dash-sub__title">Suscripción</h2>
              {subscription && (
                <span className={`badge ${subscription.status === 'active' ? 'badge-active' : 'badge-inactive'}`}>
                  {subscription.status === 'active' ? 'Activa' : 'Inactiva'}
                </span>
              )}
            </div>

            {subscription ? (
              <div className="dash-sub__info">
                <div className="dash-sub__plan">
                  <span className="dash-sub__plan-label">Plan</span>
                  <span className="dash-sub__plan-value">
                    {subscription.plan === 'annual' ? 'Anual' : 'Mensual'}
                  </span>
                </div>

                <div className="dash-sub__dates">
                  <div className="dash-sub__date-item">
                    <span>Inicio</span>
                    <strong>{formatDate(subscription.start_date)}</strong>
                  </div>
                  <div className="dash-sub__date-item">
                    <span>Vencimiento</span>
                    <strong>{formatDate(subscription.end_date)}</strong>
                  </div>
                </div>

                {isActive && (
                  <div className="dash-sub__days">
                    <div className="dash-sub__days-bar">
                      <div
                        className="dash-sub__days-fill"
                        style={{ width: `${Math.min(100, (daysLeft / (subscription.plan === 'annual' ? 365 : 30)) * 100)}%` }}
                      />
                    </div>
                    <span>{daysLeft} días restantes</span>
                  </div>
                )}

                <div className="dash-sub__actions">
                  {isActive ? (
                    <button className="btn btn-danger" onClick={handleCancel} disabled={cancelling}>
                      {cancelling ? <span className="spinner" /> : 'Cancelar suscripción'}
                    </button>
                  ) : (
                    <button className="btn btn-primary" onClick={handleRenew}>
                      Renovar suscripción →
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div className="dash-sub__empty">
                <p>No tienes ninguna suscripción activa.</p>
                <button className="btn btn-primary" onClick={() => setShowModal(true)}>
                  Activar suscripción →
                </button>
              </div>
            )}
          </div>

          {/* Benefits card */}
          <div className="card dash-benefits animate-fade-up animate-fade-up-delay-2">
            <h2 className="dash-benefits__title">Accesos incluidos</h2>
            <ul className="dash-benefits__list">
              {[
                ['🏋️', 'Zona de musculación', isActive],
                ['🧘', 'Clases grupales',      isActive],
                ['🚴', 'Sala de spinning',     isActive],
                ['🥗', 'Asesoría nutricional', isActive && subscription?.plan === 'annual'],
                ['📊', 'Análisis corporal',    isActive && subscription?.plan === 'annual'],
                ['📱', 'App TotalFitness',     isActive],
              ].map(([icon, label, enabled]) => (
                <li key={label} className={`dash-benefits__item ${enabled ? '' : 'dash-benefits__item--locked'}`}>
                  <span className="dash-benefits__icon">{icon}</span>
                  <span>{label}</span>
                  <span className="dash-benefits__status">{enabled ? '✓' : '🔒'}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Stats card */}
          <div className="card dash-stats animate-fade-up animate-fade-up-delay-3">
            <h2 className="dash-stats__title">Resumen</h2>
            <div className="dash-stats__grid">
              <div className="dash-stat-item">
                <span className="dash-stat-item__val">{isActive ? daysLeft : '—'}</span>
                <span className="dash-stat-item__label">Días restantes</span>
              </div>
              <div className="dash-stat-item">
                <span className="dash-stat-item__val">{subscription?.plan === 'annual' ? '19.99€' : subscription ? '29.99€' : '—'}</span>
                <span className="dash-stat-item__label">Precio/mes</span>
              </div>
              <div className="dash-stat-item">
                <span className="dash-stat-item__val">{subscription?.plan === 'annual' ? 'Anual' : subscription ? 'Mensual' : '—'}</span>
                <span className="dash-stat-item__label">Tipo de plan</span>
              </div>
              <div className="dash-stat-item">
                <span className="dash-stat-item__val" style={{ color: isActive ? 'var(--success)' : 'var(--danger)' }}>
                  {isActive ? 'Activa' : 'Inactiva'}
                </span>
                <span className="dash-stat-item__label">Estado</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />

      {showModal && (
        <PaymentModal
          onClose={() => setShowModal(false)}
          onSuccess={handlePaymentSuccess}
        />
      )}
    </div>
  )
}
