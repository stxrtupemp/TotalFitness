import { useEffect, useRef, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useSubscription } from '../hooks/useSubscription'
import { useSiteConfig, isVisible } from '../context/SiteConfigContext'
import Footer from '../components/Footer'
import GymMap from '../components/GymMap'
import './Home.css'

// ── Data ──────────────────────────────────────────────────────────────────────

const PROMOS_GUEST = [
  { tag: 'OFERTA LIMITADA', title: 'Primer mes gratis',    desc: 'Regístrate antes del 31 de este mes y comienza sin coste. Cancela cuando quieras.', cta: 'Aprovecha ahora', accent: true },
  { tag: 'NOVEDAD',         title: 'Clases HIIT Premium',  desc: 'Nuevas sesiones de alta intensidad con entrenadores certificados. Máxima quema de grasa.', cta: 'Ver horarios' },
  { tag: 'PLAN ANUAL',      title: 'Ahorra un 33%',        desc: 'Comprométete con tu objetivo. El plan anual incluye nutricionista y análisis corporal mensual.', cta: 'Ver plan anual' },
]

const PROMOS_MEMBER = [
  { tag: 'NOVEDAD',    title: 'Clases HIIT Premium', desc: 'Nuevas sesiones de alta intensidad con entrenadores certificados. Máxima quema de grasa.',     cta: 'Reservar clase' },
  { tag: 'PLAN ANUAL', title: 'Mejora tu plan',      desc: 'Pasa al plan anual y ahorra un 33%. Incluye nutricionista y análisis corporal mensual.',          cta: 'Ver plan anual' },
  { tag: 'REFERIDOS',  title: 'Trae a un amigo',     desc: 'Por cada amigo que traigas, obtén un mes gratis en tu próxima renovación.',                      cta: 'Saber más', accent: true },
]

const FEATURES = [
  { icon: '⚡', title: 'Equipamiento de élite',    desc: 'Más de 200 máquinas de última generación para cada grupo muscular.' },
  { icon: '🏋️', title: 'Entrenadores certificados', desc: 'Profesionales titulados que diseñan tu plan de entrenamiento personalizado.' },
  { icon: '🥗', title: 'Nutrición integrada',       desc: 'Asesoramiento nutricional incluido en el plan premium anual.' },
  { icon: '📱', title: 'App TotalFitness',          desc: 'Reserva clases, controla tu progreso y gestiona tu suscripción.' },
  { icon: '🕐', title: 'Abierto 24/7',              desc: 'Entrena cuando quieras, sin horarios ni restricciones.' },
  { icon: '👥', title: '+50 clases semanales',      desc: 'Yoga, pilates, spinning, boxeo, CrossFit y mucho más.' },
]

const PLANS = [
  {
    id: 'monthly',
    label: 'Mensual',
    price: '29.99',
    period: '/mes',
    desc: 'Flexibilidad total. Sin compromisos a largo plazo.',
    features: ['Acceso completo a instalaciones', 'Clases grupales ilimitadas', 'Sala de spinning', 'App TotalFitness', 'Vestuarios y taquillas'],
    cta: 'Empezar mensual',
  },
  {
    id: 'annual',
    label: 'Anual',
    price: '19.99',
    period: '/mes',
    badge: 'AHORRA 33%',
    desc: 'El plan más completo. Para quienes van en serio.',
    features: ['Todo lo del plan mensual', 'Nutricionista personal', 'Análisis corporal mensual', 'Reservas prioritarias', 'Sesión de bienvenida con trainer'],
    cta: 'Empezar anual',
    highlight: true,
  },
]

const CLASSES = [
  { name: 'HIIT Express',   time: '07:00', days: ['L', 'X', 'V'], trainer: 'Carlos M.',   level: 'Intenso',  color: '#ff4444' },
  { name: 'Yoga Flow',      time: '09:30', days: ['L', 'M', 'J'], trainer: 'Laura G.',    level: 'Suave',    color: '#00e676' },
  { name: 'Spinning',       time: '18:00', days: ['L', 'M', 'X', 'J', 'V'], trainer: 'Iván R.', level: 'Moderado', color: 'var(--accent)' },
  { name: 'CrossFit WOD',   time: '19:00', days: ['M', 'J', 'S'], trainer: 'Sara P.',     level: 'Intenso',  color: '#ff4444' },
  { name: 'Pilates Core',   time: '10:00', days: ['X', 'V', 'S'], trainer: 'Marta V.',    level: 'Suave',    color: '#00e676' },
  { name: 'Boxeo Fitness',  time: '20:00', days: ['L', 'X', 'V'], trainer: 'Diego L.',    level: 'Moderado', color: '#ffb400' },
]

const TESTIMONIALS = [
  { name: 'Marta García', role: 'Miembro desde 2022', text: 'He perdido 18 kg en 8 meses. El equipo de TotalFitness cambió mi vida por completo.', stars: 5 },
  { name: 'Carlos Ruiz',  role: 'Atleta amateur',     text: 'Las instalaciones son increíbles y los entrenadores te exigen lo máximo. Imposible no mejorar.', stars: 5 },
  { name: 'Ana López',    role: 'Plan anual',          text: 'El servicio de nutrición ha sido clave para alcanzar mis objetivos. Totalmente recomendable.', stars: 5 },
]

const DAYS_SHORT = ['L', 'M', 'X', 'J', 'V', 'S', 'D']

// ── Scroll-reveal hook ────────────────────────────────────────────────────────
function useReveal() {
  const ref = useRef(null)
  useEffect(() => {
    const container = ref.current
    if (!container) return
    const els = container.querySelectorAll('.reveal')
    if (els.length === 0) return

    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed')
            obs.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    )
    els.forEach(el => obs.observe(el))
    return () => obs.disconnect()
  }, [])
  return ref
}

// ── Component ─────────────────────────────────────────────────────────────────
export default function Home() {
  const { user }          = useAuth()
  const { isActive, loading: subLoading } = useSubscription(user?.id)
  const { config }        = useSiteConfig()

  const hasActiveSub = user && isActive
  const promos       = hasActiveSub ? PROMOS_MEMBER : PROMOS_GUEST

  // Parse hero title lines — last line gets accent colour
  const heroTitleLines = (config.hero_title || '').split('\n').filter(Boolean)

  // Hero glow mouse tracking
  const heroRef = useRef(null)
  const handleHeroMouseMove = useCallback((e) => {
    const rect = heroRef.current?.getBoundingClientRect()
    if (!rect) return
    heroRef.current.style.setProperty('--gx', `${e.clientX - rect.left}px`)
    heroRef.current.style.setProperty('--gy', `${e.clientY - rect.top}px`)
  }, [])

  // Reveal refs
  const refPromos  = useReveal()
  const refFeats   = useReveal()
  const refPricing = useReveal()
  const refClasses = useReveal()
  const refTestim  = useReveal()
  const refCta     = useReveal()

  return (
    <div className="page home">

      {/* ── Hero ── */}
      <section className="hero" ref={heroRef} onMouseMove={handleHeroMouseMove}>
        <div className="hero__grid-bg" aria-hidden />
        <div className="hero__glow" aria-hidden />
        <div className="container hero__content">
          <div className="hero__left">
            <span className="hero__eyebrow animate-fade-up">
              {hasActiveSub ? 'Bienvenido/a de vuelta 💪' : config.hero_eyebrow}
            </span>

            <h1 className="hero__title animate-fade-up animate-fade-up-delay-1">
              {heroTitleLines.map((line, i) =>
                i < heroTitleLines.length - 1
                  ? <span key={i}>{line}<br /></span>
                  : <span key={i} className="hero__title-last">{line}</span>
              )}
            </h1>

            <p className="hero__desc animate-fade-up animate-fade-up-delay-2">
              {hasActiveSub
                ? 'Tu suscripción está activa. Accede a todos tus beneficios y reserva tus clases.'
                : config.hero_desc
              }
            </p>

            <div className="hero__actions animate-fade-up animate-fade-up-delay-3">
              {user ? (
                <Link to="/dashboard" className="btn btn-primary">
                  {hasActiveSub ? 'Ir a mi cuenta →' : 'Activar suscripción →'}
                </Link>
              ) : (
                <>
                  <Link to="/register" className="btn btn-primary">Empieza gratis</Link>
                  <Link to="/login"    className="btn btn-outline">Iniciar sesión</Link>
                </>
              )}
            </div>

            {!hasActiveSub && (
              <div className="hero__stats animate-fade-up animate-fade-up-delay-4">
                <div className="hero__stat"><strong>+5.000</strong><span>miembros activos</span></div>
                <div className="hero__stat-divider" />
                <div className="hero__stat"><strong>12</strong><span>años de experiencia</span></div>
                <div className="hero__stat-divider" />
                <div className="hero__stat"><strong>4.9★</strong><span>valoración media</span></div>
              </div>
            )}

            {hasActiveSub && !subLoading && (
              <div className="hero__member-badge animate-fade-up animate-fade-up-delay-4">
                <span className="badge badge-active">
                  <span className="badge-dot badge-dot--active" />
                  Suscripción activa
                </span>
              </div>
            )}
          </div>

          {/* Right side visual panel */}
          {!hasActiveSub && (
            <div className="hero__right animate-fade-up animate-fade-up-delay-3">
              <div className="hero__panel">
                <div className="hero__panel-card">
                  <span className="hero__panel-icon">🏆</span>
                  <div>
                    <strong>Entrenadores certificados</strong>
                    <span>Planes 100% personalizados</span>
                  </div>
                </div>
                <div className="hero__panel-card hero__panel-card--accent">
                  <span className="hero__panel-icon">⚡</span>
                  <div>
                    <strong>Equipamiento de élite</strong>
                    <span>+200 máquinas modernas</span>
                  </div>
                </div>
                <div className="hero__panel-card">
                  <span className="hero__panel-icon">🕐</span>
                  <div>
                    <strong>Abierto 24/7</strong>
                    <span>Sin horarios restrictivos</span>
                  </div>
                </div>
                <div className="hero__panel-card">
                  <span className="hero__panel-icon">🥗</span>
                  <div>
                    <strong>Nutrición integrada</strong>
                    <span>Plan anual incluido</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ── Promos ── */}
      {isVisible(config, 'section_promos') && (
        <section className="section" ref={refPromos}>
          <div className="container reveal">
            <div className="section__head">
              <span className="section__tag">{hasActiveSub ? 'Para miembros' : 'Promociones'}</span>
              <h2 className="section__title">{hasActiveSub ? 'Ventajas exclusivas' : 'Ofertas exclusivas'}</h2>
            </div>
            <div className="promos-grid">
              {promos.map((p, i) => (
                <div key={i} className={`promo-card reveal reveal-delay-${i + 1} ${p.accent ? 'promo-card--accent' : ''}`}>
                  <span className="promo-card__tag">{p.tag}</span>
                  <h3 className="promo-card__title">{p.title}</h3>
                  <p className="promo-card__desc">{p.desc}</p>
                  <Link
                    to={user ? '/dashboard' : '/register'}
                    className={`btn ${p.accent ? 'btn-primary' : 'btn-outline'}`}
                    style={{ marginTop: 'auto', alignSelf: 'flex-start' }}
                  >
                    {p.cta} →
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Features ── */}
      {isVisible(config, 'section_features') && (
        <section className="section section--dark" ref={refFeats}>
          <div className="container">
            <div className="section__head reveal">
              <span className="section__tag">Por qué elegirnos</span>
              <h2 className="section__title">Todo lo que necesitas</h2>
            </div>
            <div className="features-grid">
              {FEATURES.map((f, i) => (
                <div key={i} className={`feature-card reveal reveal-delay-${(i % 3) + 1}`}>
                  <span className="feature-card__icon">{f.icon}</span>
                  <h3 className="feature-card__title">{f.title}</h3>
                  <p className="feature-card__desc">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Pricing ── */}
      {!hasActiveSub && isVisible(config, 'section_pricing') && (
        <section className="section pricing-section" ref={refPricing}>
          <div className="container">
            <div className="section__head reveal">
              <span className="section__tag">Precios</span>
              <h2 className="section__title">Elige tu plan</h2>
              <p className="section__subtitle">Sin permanencia en el mensual. El anual se factura en un único pago de 239.88€.</p>
            </div>
            <div className="pricing-grid">
              {PLANS.map((p, i) => (
                <div key={p.id} className={`pricing-card reveal reveal-delay-${i + 1} ${p.highlight ? 'pricing-card--highlight' : ''}`}>
                  {p.badge && <span className="pricing-card__badge">{p.badge}</span>}
                  <div className="pricing-card__head">
                    <span className="pricing-card__label">{p.label}</span>
                    <div className="pricing-card__price">
                      <span className="pricing-card__amount">{p.price}€</span>
                      <span className="pricing-card__period">{p.period}</span>
                    </div>
                    <p className="pricing-card__desc">{p.desc}</p>
                  </div>
                  <ul className="pricing-card__features">
                    {p.features.map(f => (
                      <li key={f}>
                        <span className="pricing-card__check">✓</span>
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Link
                    to={user ? '/dashboard' : '/register'}
                    className={`btn ${p.highlight ? 'btn-primary' : 'btn-outline'}`}
                    style={{ width: '100%', justifyContent: 'center' }}
                  >
                    {p.cta} →
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Class Schedule ── */}
      {isVisible(config, 'section_classes') && (
        <section className="section section--dark schedule-section" ref={refClasses}>
          <div className="container">
            <div className="section__head reveal">
              <span className="section__tag">Horarios</span>
              <h2 className="section__title">Clases semanales</h2>
              <p className="section__subtitle">Reserva tu plaza en la app o en recepción. Plazas limitadas.</p>
            </div>
            <div className="schedule-grid reveal reveal-delay-1">
              {CLASSES.map((cls, i) => (
                <div key={i} className="schedule-card">
                  <div className="schedule-card__header" style={{ borderLeftColor: cls.color }}>
                    <div>
                      <h3 className="schedule-card__name">{cls.name}</h3>
                      <span className="schedule-card__trainer">{cls.trainer}</span>
                    </div>
                    <div className="schedule-card__time">{cls.time}</div>
                  </div>
                  <div className="schedule-card__body">
                    <div className="schedule-card__days">
                      {DAYS_SHORT.map(d => (
                        <span
                          key={d}
                          className={`schedule-day ${cls.days.includes(d) ? 'schedule-day--active' : ''}`}
                          style={cls.days.includes(d) ? { background: cls.color, color: cls.color === '#ff4444' || cls.color === '#ffb400' ? '#fff' : '#000', borderColor: cls.color } : {}}
                        >
                          {d}
                        </span>
                      ))}
                    </div>
                    <span className="schedule-card__level" style={{ color: cls.color }}>{cls.level}</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="schedule-cta reveal reveal-delay-2">
              <p>¿Quieres ver el horario completo o reservar plaza?</p>
              <Link to={user ? '/dashboard' : '/register'} className="btn btn-outline">
                {user ? 'Ir a mi cuenta →' : 'Únete y reserva →'}
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ── Testimonials ── */}
      {isVisible(config, 'section_testimonials') && (
        <section className="section" ref={refTestim}>
          <div className="container">
            <div className="section__head reveal">
              <span className="section__tag">Testimonios</span>
              <h2 className="section__title">Historias reales</h2>
            </div>
            <div className="testimonials-grid">
              {TESTIMONIALS.map((t, i) => (
                <div key={i} className={`testimonial-card reveal reveal-delay-${i + 1}`}>
                  <div className="testimonial-card__stars">
                    {'★'.repeat(t.stars)}
                  </div>
                  <p className="testimonial-card__text">"{t.text}"</p>
                  <div className="testimonial-card__author">
                    <div className="testimonial-card__avatar">{t.name[0]}</div>
                    <div>
                      <strong>{t.name}</strong>
                      <span>{t.role}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── CTA — solo sin suscripción ── */}
      {!hasActiveSub && isVisible(config, 'section_cta') && (
        <section className="cta-section" ref={refCta}>
          <div className="container cta-section__inner reveal">
            <h2 className="cta-section__title">{config.cta_title}</h2>
            <p>{config.cta_subtitle}</p>
            <Link to={user ? '/dashboard' : '/register'} className="btn btn-primary cta-section__btn">
              {user ? 'Activar suscripción →' : 'Crear cuenta gratis →'}
            </Link>
          </div>
        </section>
      )}

      {/* ── Map ── */}
      {isVisible(config, 'section_map') && <GymMap />}

      <Footer />
    </div>
  )
}
