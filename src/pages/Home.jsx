import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useSubscription } from '../hooks/useSubscription'
import { useSiteConfig, isVisible } from '../context/SiteConfigContext'
import { createSubscription } from '../lib/supabase'
import Footer from '../components/Footer'
import PaymentModal from '../components/PaymentModal'
import {
  NEON, CYAN, BG, SURFACE, BORDER, TEXT, MUTED,
  useWidth, Icon, NeonButton, GhostButton, GlassCard, Badge, SectionHeader,
} from '../components/UI'

// ── Schedule data ─────────────────────────────────────────────────────────────
const SCHEDULE = [
  [
    { time: '07:00', name: 'Spinning',   coach: 'Carlos M.', spots: 8,  color: NEON },
    { time: '09:30', name: 'HIIT Total', coach: 'Ana R.',    spots: 4,  color: '#ff6644' },
    { time: '11:00', name: 'Yoga Flow',  coach: 'Marta G.',  spots: 12, color: CYAN },
    { time: '18:30', name: 'CrossFit',   coach: 'David L.',  spots: 2,  color: '#ff4488' },
    { time: '20:00', name: 'Pilates',    coach: 'Laura S.',  spots: 10, color: '#aa88ff' },
  ],
  [
    { time: '08:00', name: 'Body Pump',       coach: 'Carlos M.', spots: 6,  color: NEON },
    { time: '10:00', name: 'Pilates',         coach: 'Laura S.',  spots: 15, color: '#aa88ff' },
    { time: '19:00', name: 'HIIT Express',    coach: 'Ana R.',    spots: 3,  color: '#ff6644' },
    { time: '21:00', name: 'Stretch & Roll',  coach: 'Marta G.',  spots: 20, color: CYAN },
  ],
  [
    { time: '07:30', name: 'Spinning',           coach: 'Pedro V.', spots: 10, color: NEON },
    { time: '09:00', name: 'CrossFit',           coach: 'David L.', spots: 5,  color: '#ff4488' },
    { time: '12:00', name: 'Yoga Restaurativo',  coach: 'Marta G.', spots: 18, color: CYAN },
    { time: '18:00', name: 'Body Combat',        coach: 'Ana R.',   spots: 7,  color: '#ff6644' },
  ],
  [
    { time: '08:00', name: 'HIIT Total', coach: 'Carlos M.', spots: 6, color: '#ff6644' },
    { time: '10:30', name: 'Body Pump',  coach: 'Pedro V.',  spots: 9, color: NEON },
    { time: '19:30', name: 'CrossFit',  coach: 'David L.',  spots: 4, color: '#ff4488' },
  ],
  [
    { time: '07:00', name: 'Spinning',    coach: 'Pedro V.',  spots: 12, color: NEON },
    { time: '09:30', name: 'Yoga Flow',   coach: 'Marta G.',  spots: 8,  color: CYAN },
    { time: '11:00', name: 'HIIT Total',  coach: 'Ana R.',    spots: 0,  color: '#ff6644' },
    { time: '18:00', name: 'Body Combat', coach: 'Carlos M.', spots: 5,  color: '#ff4488' },
    { time: '20:00', name: 'Pilates',     coach: 'Laura S.',  spots: 14, color: '#aa88ff' },
  ],
  [
    { time: '09:00', name: 'CrossFit Weekend', coach: 'David L.',  spots: 8,  color: '#ff4488' },
    { time: '11:00', name: 'Yoga Meditación',  coach: 'Marta G.',  spots: 20, color: CYAN },
    { time: '12:30', name: 'HIIT Express',     coach: 'Carlos M.', spots: 6,  color: '#ff6644' },
  ],
  [
    { time: '10:00', name: 'Yoga Suave',   coach: 'Laura S.', spots: 22, color: CYAN },
    { time: '12:00', name: 'Stretch Roll', coach: 'Marta G.', spots: 18, color: '#aa88ff' },
  ],
]

const TESTIMONIALS = [
  { name: 'Sofía M.',  role: 'Plan Élite · 8 meses',  text: 'En 6 meses perdí 14 kg y gané una fuerza que nunca pensé que tendría. Los entrenadores son increíbles. TotalFitness cambió mi vida.' },
  { name: 'Marcos R.', role: 'Plan Pro · 14 meses',   text: 'Venía de otros gimnasios y la diferencia es abismal. El equipamiento, las clases, el ambiente. Todo está pensado para rendir al máximo.' },
  { name: 'Carmen V.', role: 'Plan Élite · 3 meses',  text: 'El dashboard es increíble. Puedo ver mi progreso, reservar clases y gestionar todo desde el móvil. Es como tener un entrenador personal en el bolsillo.' },
]

const BENEFITS = [
  { icon: 'zap',    title: 'Equipamiento de última generación', desc: 'Máquinas cardio y de fuerza con tecnología conectada. Entrena con datos en tiempo real.' },
  { icon: 'target', title: 'Entrenamiento personalizado',       desc: 'Planes adaptados a tus objetivos con seguimiento semanal por entrenadores certificados.' },
  { icon: 'flame',  title: 'Clases grupales intensas',          desc: 'HIIT, CrossFit, Yoga, Pilates, Spinning y más. 48 sesiones semanales para elegir.' },
  { icon: 'mobile', title: 'App y dashboard propio',            desc: 'Controla tu suscripción, reserva clases y sigue tu progreso desde cualquier dispositivo.' },
  { icon: 'waves',  title: 'Zona de recuperación',              desc: 'Sauna, jacuzzi y zona de stretching premium. Recuperación activa como parte del rendimiento.' },
  { icon: 'moon',   title: 'Horario extendido',                 desc: 'Abierto de 6:00 a 23:00 todos los días. Tu horario, tus reglas.' },
]

const DAYS = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom']

// ── Hero canvas ───────────────────────────────────────────────────────────────
function HeroCanvas({ isMobile }) {
  const canvasRef = useRef()
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let raf
    const count = isMobile ? 30 : 60
    const particles = Array.from({ length: count }, () => ({
      x: Math.random(), y: Math.random(),
      vx: (Math.random() - 0.5) * 0.0006, vy: (Math.random() - 0.5) * 0.0006,
      r: Math.random() * 1.5 + 0.5, a: Math.random() * Math.PI * 2,
    }))
    const resize = () => { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight }
    resize()
    window.addEventListener('resize', resize)
    const draw = () => {
      const W = canvas.width, H = canvas.height
      ctx.clearRect(0, 0, W, H)
      particles.forEach(p => {
        p.x += p.vx; p.y += p.vy; p.a += 0.008
        if (p.x < 0) p.x = 1; if (p.x > 1) p.x = 0
        if (p.y < 0) p.y = 1; if (p.y > 1) p.y = 0
        const alpha = (Math.sin(p.a) * 0.4 + 0.5) * 0.7
        ctx.beginPath(); ctx.arc(p.x * W, p.y * H, p.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(194,255,0,${alpha})`; ctx.fill()
      })
      particles.forEach((a, i) => {
        particles.slice(i + 1).forEach(b => {
          const dx = (a.x - b.x) * W, dy = (a.y - b.y) * H
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < 90) {
            ctx.beginPath(); ctx.moveTo(a.x * W, a.y * H); ctx.lineTo(b.x * W, b.y * H)
            ctx.strokeStyle = `rgba(194,255,0,${(1 - dist / 90) * 0.1})`; ctx.lineWidth = 0.5; ctx.stroke()
          }
        })
      })
      raf = requestAnimationFrame(draw)
    }
    draw()
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize) }
  }, [isMobile])
  return <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }} />
}

// ── Main component ─────────────────────────────────────────────────────────────
export default function Home() {
  const navigate   = useNavigate()
  const { user }   = useAuth()
  const { isActive, refetch } = useSubscription(user?.id)
  const { config } = useSiteConfig()
  const bp         = useWidth()
  const isMobile   = bp === 'xs'

  const [paymentOpen, setPaymentOpen] = useState(false)
  const [paymentPlan, setPaymentPlan] = useState('monthly')
  const [activeDay, setActiveDay]     = useState(0)
  const [pricingAnnual, setPricingAnnual] = useState(true)

  const openPayment = (plan) => { setPaymentPlan(plan); setPaymentOpen(true) }

  const handlePaymentSuccess = async (plan) => {
    setPaymentOpen(false)
    if (user) {
      try { await createSubscription(user.id, plan); await refetch() } catch {}
    }
    navigate('/dashboard')
  }

  const stats = [
    { val: '2.400+', label: 'Miembros' },
    { val: '48',     label: 'Clases/semana' },
    { val: '12',     label: 'Entrenadores' },
    { val: '4.9',    label: 'Valoración' },
  ]

  const plans = [
    {
      name: 'BÁSICO', price: pricingAnnual ? '14.99' : '19.99', plan: 'basic',
      features: ['Acceso a instalaciones', 'Vestuarios premium', 'App TotalFitness', '2 clases grupales/semana'],
    },
    {
      name: 'ÉLITE', price: pricingAnnual ? '19.99' : '29.99', featured: true,
      plan: pricingAnnual ? 'annual' : 'monthly',
      features: ['Todo en Básico', 'Clases ilimitadas', 'Plan nutricional', '1 sesión PT/mes', 'Zona premium + spa', 'Acceso 24h'],
    },
    {
      name: 'PRO', price: pricingAnnual ? '29.99' : '39.99', plan: 'pro',
      features: ['Todo en Élite', '4 sesiones PT/mes', 'Análisis corporal', 'Nutricionista online', 'Acceso multisede'],
    },
  ]
  const orderedPlans = isMobile ? [plans[1], plans[0], plans[2]] : plans

  return (
    <div style={{ background: BG, minHeight: '100vh', color: TEXT }}>

      {/* ── Hero ── */}
      <section style={{ position: 'relative', minHeight: '100vh', display: 'flex', alignItems: 'center', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(ellipse 80% 60% at 50% 40%, rgba(194,255,0,0.055) 0%, transparent 70%), radial-gradient(ellipse 50% 40% at 80% 70%, rgba(0,229,255,0.045) 0%, transparent 60%), ${BG}` }} />
        <HeroCanvas isMobile={isMobile} />

        <div style={{ position: 'relative', maxWidth: '1200px', margin: '0 auto', padding: `${isMobile ? '7rem' : '9rem'} clamp(1.25rem,4vw,2rem) 4rem`, width: '100%' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: `${NEON}12`, border: `1px solid ${NEON}30`, borderRadius: '100px', padding: '0.3rem 0.875rem', marginBottom: '1.75rem' }}>
            <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: NEON, boxShadow: `0 0 6px ${NEON}`, display: 'inline-block', flexShrink: 0 }} />
            <span style={{ color: NEON, fontSize: '0.72rem', fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase' }}>Pilar de la Horadada · Alicante</span>
          </div>

          <h1 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 'clamp(2.8rem,8vw,5.5rem)', fontWeight: 900, lineHeight: 1.0, letterSpacing: '-0.01em', margin: '0 0 1.5rem', color: TEXT, maxWidth: '700px' }}>
            {isActive ? (
              <>BIENVENIDO<br /><span style={{ color: NEON, textShadow: `0 0 40px ${NEON}55` }}>DE VUELTA.</span></>
            ) : (
              <>TRANSFORMA<br /><span style={{ color: NEON, textShadow: `0 0 40px ${NEON}55, 0 0 80px ${NEON}25` }}>TU CUERPO.</span><br />DOMINA TU<br /><span style={{ color: CYAN, textShadow: `0 0 40px ${CYAN}55` }}>ENERGÍA.</span></>
            )}
          </h1>

          <p style={{ color: MUTED, fontSize: 'clamp(0.9rem,2vw,1.05rem)', lineHeight: 1.7, maxWidth: '480px', marginBottom: '2.5rem', fontFamily: "'Inter', sans-serif" }}>
            {isActive
              ? 'Tu suscripción está activa. Accede a todos tus beneficios y reserva tus clases.'
              : 'El gimnasio más tecnológico de la Costa Blanca. Equipamiento de élite, entrenadores certificados y una experiencia diseñada para llevarte al límite.'
            }
          </p>

          <div style={{ display: 'flex', gap: '0.875rem', flexWrap: 'wrap', alignItems: 'center' }}>
            {user ? (
              <NeonButton onClick={() => navigate('/dashboard')}>
                {isActive ? 'Ir a mi cuenta' : 'Activar suscripción'}
              </NeonButton>
            ) : (
              <>
                <NeonButton onClick={() => navigate('/register')}>Empezar ahora</NeonButton>
                <GhostButton onClick={() => navigate('/schedule')}>Ver clases</GhostButton>
              </>
            )}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: `repeat(${isMobile ? 2 : 4}, 1fr)`, gap: isMobile ? '1.25rem' : '2.5rem', marginTop: '3.5rem', maxWidth: isMobile ? '300px' : '600px' }}>
            {stats.map(({ val, label }) => (
              <div key={label}>
                <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 'clamp(1.5rem,4vw,2rem)', fontWeight: 800, color: NEON, lineHeight: 1 }}>{val}</div>
                <div style={{ color: MUTED, fontSize: '0.72rem', fontFamily: "'Inter', sans-serif", marginTop: '0.2rem' }}>{label}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '180px', background: `linear-gradient(transparent, ${BG})`, pointerEvents: 'none' }} />
      </section>

      {/* ── Benefits ── */}
      {isVisible(config, 'section_features') && (
        <section style={{ maxWidth: '1200px', margin: '0 auto', padding: 'clamp(3rem,6vw,5rem) clamp(1.25rem,4vw,2rem)' }}>
          <SectionHeader tag="Por qué TotalFitness" title="Todo lo que necesitas para dominar" sub="Un ecosistema completo diseñado para maximizar tu rendimiento y tu experiencia." center />
          <div style={{ display: 'grid', gridTemplateColumns: `repeat(${bp === 'xs' ? 1 : bp === 'sm' ? 2 : 3}, 1fr)`, gap: '1.25rem' }}>
            {BENEFITS.map((item, i) => (
              <GlassCard key={i} glow style={{ padding: '1.75rem' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: `${NEON}12`, border: `1px solid ${NEON}25`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.1rem' }}>
                  <Icon name={item.icon} size={18} color={NEON} />
                </div>
                <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '1.05rem', fontWeight: 700, color: TEXT, marginBottom: '0.5rem', letterSpacing: '0.02em' }}>{item.title}</div>
                <div style={{ color: MUTED, fontSize: '0.85rem', lineHeight: 1.6, fontFamily: "'Inter', sans-serif" }}>{item.desc}</div>
              </GlassCard>
            ))}
          </div>
        </section>
      )}

      {/* ── Pricing ── */}
      {!isActive && isVisible(config, 'section_pricing') && (
        <section style={{ padding: 'clamp(3rem,6vw,5rem) clamp(1.25rem,4vw,2rem)', background: `linear-gradient(180deg, ${BG} 0%, #050710 100%)` }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <SectionHeader tag="Planes y precios" title="Invierte en ti. Sin excusas." sub="Elige el plan que se adapta a tu ritmo. Cancela cuando quieras." center />

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.875rem', marginBottom: '2.5rem' }}>
              <span style={{ color: !pricingAnnual ? TEXT : MUTED, fontSize: '0.875rem', fontFamily: "'Inter', sans-serif" }}>Mensual</span>
              <div onClick={() => setPricingAnnual(p => !p)} style={{ width: '50px', height: '26px', borderRadius: '100px', background: pricingAnnual ? `${NEON}28` : BORDER, border: `1px solid ${pricingAnnual ? NEON + '55' : BORDER}`, cursor: 'pointer', position: 'relative', transition: 'all 0.3s', flexShrink: 0 }}>
                <div style={{ position: 'absolute', top: '3px', left: pricingAnnual ? '24px' : '3px', width: '18px', height: '18px', borderRadius: '50%', background: pricingAnnual ? NEON : MUTED, transition: 'all 0.3s', boxShadow: pricingAnnual ? `0 0 6px ${NEON}` : 'none' }} />
              </div>
              <span style={{ color: pricingAnnual ? TEXT : MUTED, fontSize: '0.875rem', fontFamily: "'Inter', sans-serif", display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                Anual <Badge color="green">Ahorra 30%</Badge>
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3,1fr)', gap: '1.25rem', alignItems: 'start' }}>
              {orderedPlans.map((plan) => (
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
                  {pricingAnnual && <div style={{ color: MUTED, fontSize: '0.72rem', fontFamily: "'Inter', sans-serif", marginBottom: '1.25rem' }}>Facturado anualmente</div>}
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
      )}

      {/* ── Schedule ── */}
      {isVisible(config, 'section_classes') && (
        <section style={{ maxWidth: '1200px', margin: '0 auto', padding: 'clamp(3rem,6vw,5rem) clamp(1.25rem,4vw,2rem)' }}>
          <SectionHeader tag="Horario de clases" title="48 sesiones semanales." center />
          <div style={{ display: 'flex', gap: '0.4rem', justifyContent: 'center', marginBottom: '2rem', flexWrap: 'wrap' }}>
            {DAYS.map((d, i) => (
              <button key={d} onClick={() => setActiveDay(i)} style={{ padding: '0.45rem 1rem', borderRadius: '100px', background: activeDay === i ? NEON : SURFACE, border: `1px solid ${activeDay === i ? NEON : BORDER}`, color: activeDay === i ? BG : MUTED, fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: '0.88rem', letterSpacing: '0.05em', cursor: 'pointer', transition: 'all 0.2s', boxShadow: activeDay === i ? `0 0 12px ${NEON}40` : 'none' }}>{d}</button>
            ))}
          </div>
          <div style={{ display: 'grid', gap: '0.6rem' }}>
            {SCHEDULE[activeDay].map((cls, i) => (
              <div key={i} style={{ background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: '10px', padding: 'clamp(0.875rem,2vw,1.25rem) clamp(1rem,3vw,1.5rem)', display: 'flex', alignItems: 'center', gap: 'clamp(0.875rem,2vw,1.5rem)' }}>
                <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 'clamp(1.1rem,3vw,1.4rem)', fontWeight: 800, color: cls.color, minWidth: '60px', flexShrink: 0 }}>{cls.time}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 'clamp(0.95rem,2.5vw,1.1rem)', fontWeight: 700, color: TEXT }}>{cls.name}</div>
                  <div style={{ color: MUTED, fontSize: '0.78rem', fontFamily: "'Inter', sans-serif" }}>con {cls.coach}</div>
                </div>
                <Badge color={cls.spots === 0 ? 'red' : cls.spots <= 4 ? 'cyan' : 'green'}>
                  {cls.spots === 0 ? 'Completo' : `${cls.spots} plazas`}
                </Badge>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── Testimonials ── */}
      {isVisible(config, 'section_testimonials') && (
        <section style={{ padding: 'clamp(3rem,6vw,5rem) clamp(1.25rem,4vw,2rem)', background: `linear-gradient(180deg, ${BG} 0%, #050710 50%, ${BG} 100%)` }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <SectionHeader tag="Testimonios" title="Lo que dicen los que ya llegaron." center />
            <div style={{ display: 'grid', gridTemplateColumns: `repeat(${bp === 'xs' ? 1 : bp === 'sm' ? 2 : 3}, 1fr)`, gap: '1.25rem' }}>
              {TESTIMONIALS.map((t, i) => (
                <GlassCard key={i} glow style={{ padding: '1.75rem' }}>
                  <div style={{ display: 'flex', gap: '0.2rem', marginBottom: '1rem' }}>
                    {Array.from({ length: 5 }).map((_, j) => (
                      <Icon key={j} name="star" size={14} color={NEON} filled />
                    ))}
                  </div>
                  <p style={{ color: TEXT, fontFamily: "'Inter', sans-serif", fontSize: '0.875rem', lineHeight: 1.7, marginBottom: '1.5rem', fontStyle: 'italic' }}>"{t.text}"</p>
                  <div style={{ borderTop: `1px solid ${BORDER}`, paddingTop: '1rem' }}>
                    <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, color: TEXT, fontSize: '1rem' }}>{t.name}</div>
                    <div style={{ color: MUTED, fontSize: '0.72rem', fontFamily: "'Inter', sans-serif" }}>{t.role}</div>
                  </div>
                </GlassCard>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Map ── */}
      {isVisible(config, 'section_map') && (
        <section style={{ maxWidth: '1200px', margin: '0 auto', padding: 'clamp(3rem,6vw,5rem) clamp(1.25rem,4vw,2rem)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 'clamp(2rem,5vw,4rem)', alignItems: 'center' }}>
            <div>
              <SectionHeader tag="Ubicación" title="Ven a conocernos." sub="En el corazón de Pilar de la Horadada. Acceso fácil y aparcamiento gratuito." />
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
                {[
                  { icon: 'pin',   text: 'C/ Fitness 42, Pilar de la Horadada, 03190 Alicante' },
                  { icon: 'clock', text: 'Lun–Vie: 06:00–23:00 · Sáb–Dom: 08:00–21:00' },
                  { icon: 'phone', text: '+34 966 123 456' },
                  { icon: 'mail',  text: 'info@totalfitness.es' },
                ].map(({ icon, text }) => (
                  <div key={text} style={{ display: 'flex', gap: '0.875rem', alignItems: 'flex-start' }}>
                    <div style={{ width: '32px', height: '32px', borderRadius: '6px', background: `${NEON}12`, border: `1px solid ${NEON}25`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Icon name={icon} size={14} color={NEON} />
                    </div>
                    <span style={{ color: MUTED, fontFamily: "'Inter', sans-serif", fontSize: '0.875rem', lineHeight: 1.5, paddingTop: '0.3rem' }}>{text}</span>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: '12px', height: 'clamp(240px,40vw,340px)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', position: 'relative' }}>
              <svg width="100%" height="100%" style={{ position: 'absolute', inset: 0, opacity: 0.18 }}>
                <defs><pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M 40 0 L 0 0 0 40" fill="none" stroke={NEON} strokeWidth="0.5" /></pattern></defs>
                <rect width="100%" height="100%" fill="url(#grid)" />
              </svg>
              <div style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: `${NEON}15`, border: `1px solid ${NEON}44`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.75rem' }}>
                  <Icon name="pin" size={22} color={NEON} />
                </div>
                <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, color: NEON, fontSize: '1rem', letterSpacing: '0.1em' }}>TOTALFITNESS</div>
                <div style={{ color: MUTED, fontSize: '0.78rem', fontFamily: "'Inter', sans-serif" }}>Pilar de la Horadada</div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── CTA ── */}
      {!isActive && isVisible(config, 'section_cta') && (
        <section style={{ padding: 'clamp(2rem,5vw,4rem) clamp(1.25rem,4vw,2rem)' }}>
          <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
            <div style={{ background: `linear-gradient(135deg, rgba(194,255,0,0.07), rgba(0,229,255,0.05))`, border: `1px solid ${NEON}30`, borderRadius: '20px', padding: 'clamp(2.5rem,5vw,4rem) clamp(1.5rem,4vw,3rem)', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: '-50px', right: '-50px', width: '180px', height: '180px', borderRadius: '50%', background: `radial-gradient(circle, ${NEON}12, transparent 70%)`, pointerEvents: 'none' }} />
              <h2 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 'clamp(1.8rem,5vw,3.5rem)', fontWeight: 900, color: TEXT, margin: '0 0 1rem', lineHeight: 1.1 }}>
                TU MEJOR VERSIÓN<br /><span style={{ color: NEON }}>EMPIEZA HOY.</span>
              </h2>
              <p style={{ color: MUTED, fontFamily: "'Inter', sans-serif", maxWidth: '380px', margin: '0 auto 2.25rem', lineHeight: 1.65, fontSize: '0.9rem' }}>
                Únete a 2.400 miembros que ya transformaron su vida. Sin permanencia mínima.
              </p>
              <div style={{ display: 'flex', gap: '0.875rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                <NeonButton onClick={() => user ? openPayment('annual') : navigate('/register')}>7 días gratis — empieza ahora</NeonButton>
                <GhostButton onClick={() => navigate('/pricing')}>Ver planes</GhostButton>
              </div>
            </div>
          </div>
        </section>
      )}

      <Footer />

      <PaymentModal
        open={paymentOpen}
        onClose={() => setPaymentOpen(false)}
        plan={paymentPlan}
        onSuccess={handlePaymentSuccess}
      />
    </div>
  )
}
