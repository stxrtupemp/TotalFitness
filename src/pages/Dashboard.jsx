import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useSubscription } from '../hooks/useSubscription'
import { createSubscription, cancelSubscription } from '../lib/supabase'
import Footer from '../components/Footer'
import PaymentModal from '../components/PaymentModal'
import {
  NEON, CYAN, BG, SURFACE, BORDER, TEXT, MUTED,
  useWidth, Icon, NeonButton, GhostButton, GlassCard, Badge, StatCard, Modal,
} from '../components/UI'

const RECENT_CLASSES = [
  { name: 'Spinning',   date: 'Hoy, 07:00',  coach: 'Carlos M.', cal: 480, color: NEON },
  { name: 'HIIT Total', date: 'Ayer, 09:30',  coach: 'Ana R.',    cal: 620, color: '#ff6644' },
  { name: 'Yoga Flow',  date: 'Lun, 11:00',   coach: 'Marta G.', cal: 220, color: CYAN },
]

const UPCOMING_CLASSES = [
  { name: 'CrossFit',  date: 'Mañana, 18:30',    coach: 'David L.',  color: '#ff4488' },
  { name: 'Spinning',  date: 'Miércoles, 07:00', coach: 'Carlos M.', color: NEON },
  { name: 'Yoga Flow', date: 'Viernes, 09:30',   coach: 'Marta G.',  color: CYAN },
]

export default function Dashboard() {
  const navigate    = useNavigate()
  const { user, profile } = useAuth()
  const { subscription, loading, refetch, isActive, daysLeft } = useSubscription(user?.id)
  const bp          = useWidth()
  const isMobile    = bp === 'xs'

  const [activeTab,      setActiveTab]      = useState('overview')
  const [paymentOpen,    setPaymentOpen]    = useState(false)
  const [paymentPlan,    setPaymentPlan]    = useState('monthly')
  const [cancelConfirm,  setCancelConfirm]  = useState(false)
  const [cancelling,     setCancelling]     = useState(false)
  const [toast,          setToast]          = useState(null)

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3500)
  }

  const openPayment = (plan) => { setPaymentPlan(plan); setPaymentOpen(true) }

  const handlePaymentSuccess = async (plan) => {
    setPaymentOpen(false)
    try {
      await createSubscription(user.id, plan)
      await refetch()
      showToast('¡Suscripción activada correctamente!')
    } catch {
      showToast('Error al activar la suscripción.', 'error')
    }
  }

  const handleCancel = async () => {
    setCancelling(true)
    try {
      await cancelSubscription(user.id)
      await refetch()
      setCancelConfirm(false)
      showToast('Suscripción cancelada.')
    } catch {
      showToast('Error al cancelar.', 'error')
    } finally {
      setCancelling(false)
    }
  }

  const plan      = subscription?.plan
  const planLabel = plan === 'annual' ? 'Plan Anual' : plan === 'monthly' ? 'Plan Élite Mensual' : null
  const progressPct = isActive && subscription
    ? Math.max(0, Math.min(100, (daysLeft / (plan === 'annual' ? 365 : 30)) * 100))
    : 0

  const benefits = [
    { feat: 'Acceso a instalaciones',    unlocked: isActive },
    { feat: 'Clases grupales ilimitadas', unlocked: isActive },
    { feat: 'App y dashboard',            unlocked: true },
    { feat: 'Zona premium + spa',         unlocked: plan === 'annual' },
    { feat: 'Sesiones PT',                unlocked: plan === 'annual' },
    { feat: 'Nutricionista online',       unlocked: false },
  ]

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

      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: 'clamp(1.5rem,4vw,3rem) clamp(1.25rem,4vw,2rem)' }}>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: isMobile ? 'flex-start' : 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
          <div>
            <div style={{ color: MUTED, fontFamily: "'Inter', sans-serif", fontSize: '0.78rem', letterSpacing: '0.07em', textTransform: 'uppercase', marginBottom: '0.3rem' }}>Panel personal</div>
            <h1 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 'clamp(1.75rem,5vw,2.5rem)', fontWeight: 900, color: TEXT, margin: 0 }}>
              Hola, <span style={{ color: NEON }}>{profile?.name || user?.email?.split('@')[0] || 'Atleta'}</span>
            </h1>
          </div>
          <Badge color={isActive ? 'green' : 'red'}>{isActive ? 'Suscripción activa' : 'Sin plan'}</Badge>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 0, marginBottom: '2rem', borderBottom: `1px solid ${BORDER}`, overflowX: 'auto' }}>
          {[['overview','Resumen'], ['classes','Clases'], ['progress','Progreso']].map(([id, label]) => (
            <button key={id} onClick={() => setActiveTab(id)} style={{ background: 'none', border: 'none', borderBottom: `2px solid ${activeTab === id ? NEON : 'transparent'}`, color: activeTab === id ? NEON : MUTED, padding: '0.75rem 1.25rem', cursor: 'pointer', fontFamily: "'Barlow Condensed', sans-serif", fontSize: '0.95rem', fontWeight: 700, letterSpacing: '0.05em', transition: 'all 0.2s', marginBottom: '-1px', whiteSpace: 'nowrap' }}>{label}</button>
          ))}
        </div>

        {/* Overview tab */}
        {activeTab === 'overview' && (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: `repeat(${isMobile ? 2 : 4}, 1fr)`, gap: '0.875rem', marginBottom: '1.5rem' }}>
              <StatCard label="Clases este mes"   value="12" sub="+3 vs anterior" />
              <StatCard label="Días activo"        value="47" sub="Desde tu registro"   color={CYAN} />
              <StatCard label="Calorías quemadas"  value="18k" sub="Estimado"           color="#ff6644" />
              <StatCard label="Racha actual"        value="6d" sub="Días consecutivos"  color="#aa88ff" />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '1.25rem', marginBottom: '1.5rem' }}>
              <GlassCard glow style={{ padding: 'clamp(1.25rem,3vw,2rem)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
                  <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: TEXT }}>Suscripción</div>
                  <Badge color={isActive ? 'green' : 'red'}>{isActive ? 'Activa' : 'Inactiva'}</Badge>
                </div>
                {isActive ? (
                  <>
                    <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 'clamp(1.4rem,4vw,2rem)', fontWeight: 900, color: NEON, marginBottom: '0.2rem' }}>{planLabel}</div>
                    <div style={{ color: MUTED, fontFamily: "'Inter', sans-serif", fontSize: '0.82rem', marginBottom: '1.25rem' }}>Renueva en {daysLeft} días</div>
                    <div style={{ marginBottom: '1.5rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                        <span style={{ color: MUTED, fontSize: '0.72rem', fontFamily: "'Inter', sans-serif" }}>Período actual</span>
                        <span style={{ color: NEON, fontSize: '0.72rem', fontFamily: "'Inter', sans-serif", fontWeight: 600 }}>{daysLeft} días restantes</span>
                      </div>
                      <div style={{ height: '4px', background: BORDER, borderRadius: '2px', overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${progressPct}%`, background: `linear-gradient(90deg, ${NEON}, ${CYAN})`, borderRadius: '2px' }} />
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                      <GhostButton small onClick={() => setCancelConfirm(true)}>Cancelar</GhostButton>
                      <NeonButton small onClick={() => openPayment(plan === 'annual' ? 'annual' : 'monthly')}>Renovar</NeonButton>
                    </div>
                  </>
                ) : (
                  <>
                    <p style={{ color: MUTED, fontFamily: "'Inter', sans-serif", fontSize: '0.875rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>No tienes ningún plan activo. Actívalo para desbloquear todas las funcionalidades.</p>
                    <NeonButton onClick={() => openPayment('monthly')}>Activar plan</NeonButton>
                  </>
                )}
              </GlassCard>

              <GlassCard glow="cyan" style={{ padding: 'clamp(1.25rem,3vw,2rem)' }}>
                <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: TEXT, marginBottom: '1.25rem' }}>Beneficios</div>
                {benefits.map(({ feat, unlocked }) => (
                  <div key={feat} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.7rem' }}>
                    <Icon name={unlocked ? 'check' : 'lock'} size={14} color={unlocked ? NEON : BORDER} />
                    <span style={{ color: unlocked ? TEXT : MUTED, fontFamily: "'Inter', sans-serif", fontSize: '0.85rem', flex: 1 }}>{feat}</span>
                    {!unlocked && isActive && <Badge color="cyan">Upgrade</Badge>}
                  </div>
                ))}
              </GlassCard>
            </div>

            <GlassCard style={{ padding: 'clamp(1.25rem,3vw,2rem)' }}>
              <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '0.9rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: TEXT, marginBottom: '1.25rem' }}>Últimas clases</div>
              <div style={{ display: 'grid', gap: '0.6rem' }}>
                {RECENT_CLASSES.map((cls, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.875rem', background: 'rgba(255,255,255,0.02)', borderRadius: '8px', border: `1px solid ${BORDER}` }}>
                    <div style={{ width: '6px', height: '36px', borderRadius: '3px', background: cls.color, flexShrink: 0 }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, color: TEXT, fontSize: '1rem' }}>{cls.name}</div>
                      <div style={{ color: MUTED, fontSize: '0.72rem', fontFamily: "'Inter', sans-serif" }}>{cls.date} · {cls.coach}</div>
                    </div>
                    <Badge color="green">{cls.cal} kcal</Badge>
                  </div>
                ))}
              </div>
            </GlassCard>
          </>
        )}

        {/* Classes tab */}
        {activeTab === 'classes' && (
          <GlassCard style={{ padding: 'clamp(1.25rem,3vw,2rem)' }}>
            <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '1rem', fontWeight: 800, color: TEXT, marginBottom: '1.5rem' }}>Próximas clases reservadas</div>
            {isActive ? (
              <div style={{ display: 'grid', gap: '0.875rem' }}>
                {UPCOMING_CLASSES.map((cls, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.1rem', background: 'rgba(255,255,255,0.02)', borderRadius: '10px', border: `1px solid ${BORDER}`, flexWrap: isMobile ? 'wrap' : 'nowrap' }}>
                    <div style={{ width: '4px', height: '44px', borderRadius: '2px', background: cls.color, flexShrink: 0 }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: '1.05rem', color: TEXT }}>{cls.name}</div>
                      <div style={{ color: MUTED, fontSize: '0.78rem', fontFamily: "'Inter', sans-serif" }}>{cls.date} · {cls.coach}</div>
                    </div>
                    <GhostButton small>Cancelar reserva</GhostButton>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '3rem 1rem', color: MUTED, fontFamily: "'Inter', sans-serif" }}>
                <Icon name="lock" size={32} color={BORDER} style={{ margin: '0 auto 1rem', display: 'block' }} />
                <p style={{ marginBottom: '1.5rem', fontSize: '0.9rem' }}>Activa un plan para reservar clases</p>
                <NeonButton onClick={() => openPayment('monthly')}>Activar plan</NeonButton>
              </div>
            )}
          </GlassCard>
        )}

        {/* Progress tab */}
        {activeTab === 'progress' && (
          <GlassCard style={{ padding: 'clamp(1.25rem,3vw,2rem)' }}>
            <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '1rem', fontWeight: 800, color: TEXT, marginBottom: '1.5rem' }}>Actividad semanal</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: '0.4rem', marginBottom: '0.875rem' }}>
              {['L','M','X','J','V','S','D'].map((d, i) => {
                const active = [true,false,true,true,false,true,false][i]
                const pct    = [80,0,60,100,0,45,0][i]
                return (
                  <div key={i} style={{ textAlign: 'center' }}>
                    <div style={{ color: MUTED, fontSize: '0.65rem', fontFamily: "'Inter', sans-serif", marginBottom: '0.4rem' }}>{d}</div>
                    <div style={{ height: 'clamp(40px,8vw,60px)', background: BORDER, borderRadius: '4px', overflow: 'hidden', position: 'relative' }}>
                      {active && <div style={{ position: 'absolute', bottom: 0, width: '100%', height: `${pct}%`, background: `linear-gradient(0deg, ${NEON}88, ${NEON}33)` }} />}
                    </div>
                  </div>
                )
              })}
            </div>
            <div style={{ color: MUTED, fontSize: '0.78rem', fontFamily: "'Inter', sans-serif" }}>Esta semana: 4 clases completadas</div>
          </GlassCard>
        )}
      </div>

      <Footer />

      <PaymentModal open={paymentOpen} onClose={() => setPaymentOpen(false)} plan={paymentPlan} onSuccess={handlePaymentSuccess} />

      <Modal open={cancelConfirm} onClose={() => setCancelConfirm(false)} title="Cancelar suscripción">
        <p style={{ color: MUTED, fontFamily: "'Inter', sans-serif", fontSize: '0.875rem', lineHeight: 1.6, marginBottom: '2rem' }}>Perderás acceso a todas las clases e instalaciones al finalizar tu período actual.</p>
        <div style={{ display: 'flex', gap: '0.875rem' }}>
          <GhostButton onClick={() => setCancelConfirm(false)}>Volver</GhostButton>
          <button onClick={handleCancel} disabled={cancelling} style={{ flex: 1, background: '#ff446612', border: '1px solid #ff446640', borderRadius: '4px', color: '#ff4466', fontFamily: "'Barlow Condensed', sans-serif", fontSize: '0.95rem', fontWeight: 700, letterSpacing: '0.08em', padding: '0.8rem', cursor: 'pointer' }}>
            {cancelling ? 'Cancelando...' : 'Cancelar suscripción'}
          </button>
        </div>
      </Modal>
    </div>
  )
}
