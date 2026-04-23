import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useSubscription } from '../hooks/useSubscription'
import { createSubscription } from '../lib/supabase'
import Footer from '../components/Footer'
import PaymentModal from '../components/PaymentModal'
import {
  NEON, CYAN, BG, SURFACE, BORDER, TEXT, MUTED,
  useWidth, Icon, NeonButton, GhostButton, Badge, SectionHeader,
} from '../components/UI'

export default function Pricing() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { refetch } = useSubscription(user?.id)
  const bp       = useWidth()
  const isMobile = bp === 'xs'

  const [annual,      setAnnual]      = useState(true)
  const [paymentOpen, setPaymentOpen] = useState(false)
  const [paymentPlan, setPaymentPlan] = useState('monthly')

  const openPayment = (plan) => { setPaymentPlan(plan); setPaymentOpen(true) }

  const handlePaymentSuccess = async (plan) => {
    setPaymentOpen(false)
    if (user) {
      try { await createSubscription(user.id, plan); await refetch() } catch {}
    }
    navigate('/dashboard')
  }

  const plans = [
    {
      name: 'BÁSICO', price: annual ? '14.99' : '19.99', plan: 'basic',
      features: ['Acceso a instalaciones', 'Vestuarios premium', 'App TotalFitness', '2 clases grupales/semana'],
    },
    {
      name: 'ÉLITE', price: annual ? '19.99' : '29.99', featured: true,
      plan: annual ? 'annual' : 'monthly',
      features: ['Todo en Básico', 'Clases ilimitadas', 'Plan nutricional', '1 sesión PT/mes', 'Zona premium + spa', 'Acceso 24h'],
    },
    {
      name: 'PRO', price: annual ? '29.99' : '39.99', plan: 'pro',
      features: ['Todo en Élite', '4 sesiones PT/mes', 'Análisis corporal', 'Nutricionista online', 'Acceso multisede'],
    },
  ]
  const ordered = isMobile ? [plans[1], plans[0], plans[2]] : plans

  return (
    <div style={{ background: BG, minHeight: '100vh', paddingTop: '64px', color: TEXT }}>
      <section style={{ padding: 'clamp(3rem,6vw,5rem) clamp(1.25rem,4vw,2rem)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <SectionHeader tag="Planes y precios" title="Invierte en ti. Sin excusas." sub="Elige el plan que se adapta a tu ritmo. Cancela cuando quieras." center />

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.875rem', marginBottom: '2.5rem' }}>
            <span style={{ color: !annual ? TEXT : MUTED, fontSize: '0.875rem', fontFamily: "'Inter', sans-serif" }}>Mensual</span>
            <div onClick={() => setAnnual(p => !p)} style={{ width: '50px', height: '26px', borderRadius: '100px', background: annual ? `${NEON}28` : BORDER, border: `1px solid ${annual ? NEON + '55' : BORDER}`, cursor: 'pointer', position: 'relative', transition: 'all 0.3s', flexShrink: 0 }}>
              <div style={{ position: 'absolute', top: '3px', left: annual ? '24px' : '3px', width: '18px', height: '18px', borderRadius: '50%', background: annual ? NEON : MUTED, transition: 'all 0.3s', boxShadow: annual ? `0 0 6px ${NEON}` : 'none' }} />
            </div>
            <span style={{ color: annual ? TEXT : MUTED, fontSize: '0.875rem', fontFamily: "'Inter', sans-serif", display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              Anual <Badge color="green">Ahorra 30%</Badge>
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3,1fr)', gap: '1.25rem', alignItems: 'start' }}>
            {ordered.map((plan) => (
              <div key={plan.name} style={{
                background: plan.featured ? `linear-gradient(145deg, rgba(194,255,0,0.07), rgba(0,229,255,0.04))` : SURFACE,
                border: `1px solid ${plan.featured ? NEON + '50' : BORDER}`,
                borderRadius: '16px', padding: 'clamp(1.5rem,3vw,2rem)', position: 'relative',
                boxShadow: plan.featured ? `0 0 40px ${NEON}15, 0 20px 60px rgba(0,0,0,0.35)` : 'none',
              }}>
                {plan.featured && (
                  <div style={{ position: 'absolute', top: '-11px', left: '50%', transform: 'translateX(-50%)', background: NEON, color: BG, fontSize: '0.65rem', fontWeight: 800, letterSpacing: '0.1em', padding: '0.25rem 0.875rem', borderRadius: '100px', fontFamily: "'Barlow Condensed', sans-serif", textTransform: 'uppercase', whiteSpace: 'nowrap' }}>MÁS POPULAR</div>
                )}
                <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.2em', color: plan.featured ? NEON : MUTED, marginBottom: '0.875rem' }}>{plan.name}</div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.3rem', marginBottom: '0.2rem' }}>
                  <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 'clamp(2.2rem,5vw,3rem)', fontWeight: 900, color: TEXT }}>{plan.price}</span>
                  <span style={{ color: MUTED, fontSize: '0.82rem', fontFamily: "'Inter', sans-serif" }}>€/mes</span>
                </div>
                {annual && <div style={{ color: MUTED, fontSize: '0.72rem', fontFamily: "'Inter', sans-serif", marginBottom: '1.25rem' }}>Facturado anualmente</div>}
                <div style={{ borderTop: `1px solid ${BORDER}`, paddingTop: '1.25rem', marginBottom: '1.25rem' }}>
                  {plan.features.map(f => (
                    <div key={f} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem', marginBottom: '0.65rem' }}>
                      <Icon name="check" size={14} color={NEON} style={{ marginTop: '2px', flexShrink: 0 }} />
                      <span style={{ color: MUTED, fontSize: '0.85rem', fontFamily: "'Inter', sans-serif" }}>{f}</span>
                    </div>
                  ))}
                </div>
                {plan.featured
                  ? <NeonButton fullWidth onClick={() => openPayment(plan.plan)}>Activar Élite</NeonButton>
                  : <GhostButton fullWidth onClick={() => user ? openPayment(plan.plan) : navigate('/register')}>Empezar</GhostButton>
                }
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />

      <PaymentModal open={paymentOpen} onClose={() => setPaymentOpen(false)} plan={paymentPlan} onSuccess={handlePaymentSuccess} />
    </div>
  )
}
