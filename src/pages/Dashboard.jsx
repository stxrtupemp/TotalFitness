import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useSubscription } from '../hooks/useSubscription'
import { createSubscription, cancelSubscription } from '../lib/supabase'
import PaymentModal from '../components/PaymentModal'
import Footer from '../components/Footer'
import { IconBarbell, IconUsers, IconBike, IconPhone, IconLeaf, IconChart, IconDumbbell, IconCheck, IconLock } from '../components/Icons'
import './Dashboard.css'

const MOTIVATIONAL = [
  'Cada entrenamiento te acerca un paso más a tu mejor versión.',
  'La constancia supera al talento. Sigue adelante.',
  'Los resultados llegan a quienes no se rinden.',
  'Tu único competidor eres tú de ayer.',
  'El dolor de hoy es la fuerza de mañana.',
]

export default function Dashboard() {
  const { user, profile }  = useAuth()
  const { subscription, loading, refetch, isActive, daysLeft } = useSubscription(user?.id)
  const [showModal, setShowModal]   = useState(false)
  const [cancelling, setCancelling] = useState(false)
  const [toast, setToast]           = useState(null)

  const quote = MOTIVATIONAL[new Date().getDay() % MOTIVATIONAL.length]

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
    } catch {
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
    } catch {
      showToast('Error al cancelar.', 'error')
    } finally {
      setCancelling(false)
    }
  }

  const formatDate = (d) => d
    ? new Date(d).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })
    : '—'

  const progressPct = isActive && subscription
    ? Math.max(0, Math.min(100, (daysLeft / (subscription.plan === 'annual' ? 365 : 30)) * 100))
    : 0

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

      {/* ── Welcome Banner ── */}
      <div className="dash-banner">
        <div className="dash-banner__grid" aria-hidden />
        <div className="container dash-banner__inner">
          <div className="dash-banner__left animate-fade-up">
            <span className="dash-banner__eyebrow">Panel de usuario</span>
            <h1 className="dash-banner__title">Mi cuenta</h1>
            <p className="dash-banner__email">{user?.email}</p>
          </div>
          <div className="dash-banner__right animate-fade-up animate-fade-up-delay-1">
            <div className={`badge ${isActive ? 'badge-active' : 'badge-inactive'}`}>
              <span className={`badge-dot ${isActive ? 'badge-dot--active' : ''}`} />
              {isActive ? 'Suscripción activa' : 'Sin suscripción'}
            </div>
            {isActive && (
              <p className="dash-banner__quote">"{quote}"</p>
            )}
          </div>
        </div>
      </div>

      <div className="container dashboard__inner">
        <div className="dash-grid">

          {/* ── Subscription card ── */}
          <div className="card dash-sub animate-fade-up">
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
                  <span className="dash-sub__plan-label">Plan actual</span>
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
                    <div className="dash-sub__days-header">
                      <span className="dash-sub__days-label">Tiempo restante</span>
                      <span className="dash-sub__days-count">{daysLeft} días</span>
                    </div>
                    <div className="dash-sub__days-bar">
                      <div className="dash-sub__days-fill" style={{ width: `${progressPct}%` }} />
                    </div>
                  </div>
                )}

                <div className="dash-sub__actions">
                  {isActive ? (
                    <button className="btn btn-danger" onClick={handleCancel} disabled={cancelling}>
                      {cancelling ? <span className="spinner" /> : 'Cancelar suscripción'}
                    </button>
                  ) : (
                    <button className="btn btn-primary" onClick={() => setShowModal(true)}>
                      Renovar suscripción →
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div className="dash-sub__empty">
                <div className="dash-sub__empty-icon">
                  <IconDumbbell size={40} />
                </div>
                <p>No tienes ninguna suscripción activa.</p>
                <p className="dash-sub__empty-sub">Elige tu plan y empieza a entrenar hoy.</p>
                <button className="btn btn-primary" onClick={() => setShowModal(true)}>
                  Activar suscripción →
                </button>
              </div>
            )}
          </div>

          {/* ── Benefits card ── */}
          <div className="card dash-benefits animate-fade-up animate-fade-up-delay-1">
            <h2 className="dash-benefits__title">Accesos incluidos</h2>
            <ul className="dash-benefits__list">
              {[
                [<IconBarbell />, 'Zona de musculación',  isActive],
                [<IconUsers />,   'Clases grupales',       isActive],
                [<IconBike />,    'Sala de spinning',      isActive],
                [<IconPhone />,   'App TotalFitness',      isActive],
                [<IconLeaf />,    'Asesoría nutricional',  isActive && subscription?.plan === 'annual'],
                [<IconChart />,   'Análisis corporal',     isActive && subscription?.plan === 'annual'],
              ].map(([icon, label, enabled]) => (
                <li key={label} className={`dash-benefits__item ${enabled ? 'dash-benefits__item--enabled' : 'dash-benefits__item--locked'}`}>
                  <span className="dash-benefits__icon">{icon}</span>
                  <span className="dash-benefits__label">{label}</span>
                  <span className="dash-benefits__status">
                    {enabled ? <IconCheck /> : <IconLock />}
                  </span>
                </li>
              ))}
            </ul>
            {isActive && subscription?.plan === 'monthly' && (
              <p className="dash-benefits__upgrade-hint">
                Pasa al plan anual para desbloquear nutrición y análisis corporal.
              </p>
            )}
          </div>

          {/* ── Stats card ── */}
          <div className="card dash-stats animate-fade-up animate-fade-up-delay-2">
            <h2 className="dash-stats__title">Resumen</h2>
            <div className="dash-stats__grid">
              <div className="dash-stat-item">
                <span className="dash-stat-item__val" style={{ color: isActive ? 'var(--accent)' : 'var(--text)' }}>
                  {isActive ? daysLeft : '—'}
                </span>
                <span className="dash-stat-item__label">Días restantes</span>
              </div>
              <div className="dash-stat-item">
                <span className="dash-stat-item__val">
                  {subscription?.plan === 'annual' ? '19.99€' : subscription ? '29.99€' : '—'}
                </span>
                <span className="dash-stat-item__label">Precio/mes</span>
              </div>
              <div className="dash-stat-item">
                <span className="dash-stat-item__val">
                  {subscription?.plan === 'annual' ? 'Anual' : subscription ? 'Mensual' : '—'}
                </span>
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
