import { useLayoutEffect, useRef, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useAuth } from '../context/AuthContext'
import { useSubscription } from '../hooks/useSubscription'
import { useSiteConfig, isVisible } from '../context/SiteConfigContext'
import {
  IconBolt, IconBarbell, IconLeaf, IconPhone, IconClock, IconUsers,
  IconTrophy, IconStar, IconCheck, IconFlex,
} from '../components/Icons'
import Footer from '../components/Footer'
import GymMap from '../components/GymMap'
import './Home.css'

gsap.registerPlugin(ScrollTrigger)

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
  { Icon: IconBolt,    title: 'Equipamiento de élite',    desc: 'Más de 200 máquinas de última generación para cada grupo muscular.' },
  { Icon: IconBarbell, title: 'Entrenadores certificados', desc: 'Profesionales titulados que diseñan tu plan de entrenamiento personalizado.' },
  { Icon: IconLeaf,    title: 'Nutrición integrada',       desc: 'Asesoramiento nutricional incluido en el plan premium anual.' },
  { Icon: IconPhone,   title: 'App TotalFitness',          desc: 'Reserva clases, controla tu progreso y gestiona tu suscripción.' },
  { Icon: IconClock,   title: 'Abierto 24/7',              desc: 'Entrena cuando quieras, sin horarios ni restricciones.' },
  { Icon: IconUsers,   title: '+50 clases semanales',      desc: 'Yoga, pilates, spinning, boxeo, CrossFit y mucho más.' },
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

// ── Component ─────────────────────────────────────────────────────────────────
export default function Home() {
  const { user }          = useAuth()
  const { isActive, loading: subLoading } = useSubscription(user?.id)
  const { config }        = useSiteConfig()

  const hasActiveSub = user && isActive
  const promos       = hasActiveSub ? PROMOS_MEMBER : PROMOS_GUEST

  const heroTitleLines = (config.hero_title || '').split('\n').filter(Boolean)

  // Hero glow mouse tracking
  const heroRef = useRef(null)
  const handleHeroMouseMove = useCallback((e) => {
    const rect = heroRef.current?.getBoundingClientRect()
    if (!rect) return
    heroRef.current.style.setProperty('--gx', `${e.clientX - rect.left}px`)
    heroRef.current.style.setProperty('--gy', `${e.clientY - rect.top}px`)
  }, [])

  // ── Hero parallax (always, no data dependency) ────────────────────────────
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to('.hero__grid-bg', {
        yPercent: -18,
        ease: 'none',
        scrollTrigger: {
          trigger: '.hero',
          start: 'top top',
          end: 'bottom top',
          scrub: 1,
        },
      })
      gsap.to('.hero__glow-wrap', {
        y: -140,
        ease: 'none',
        scrollTrigger: {
          trigger: '.hero',
          start: 'top top',
          end: 'bottom top',
          scrub: 1.5,
        },
      })
    })
    return () => ctx.revert()
  }, [])

  // ── Scroll-triggered section animations ───────────────────────────────────
  useLayoutEffect(() => {
    if (subLoading) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const ctx = gsap.context(() => {
      // Section heads
      gsap.utils.toArray('.section__head').forEach(el => {
        gsap.fromTo(el,
          { opacity: 0, y: 42 },
          {
            opacity: 1, y: 0, duration: 0.8, ease: 'power3.out',
            scrollTrigger: { trigger: el, start: 'top 88%', once: true },
          }
        )
      })

      // Feature cards — stagger from grid
      const featureCards = gsap.utils.toArray('.feature-card')
      if (featureCards.length) {
        gsap.fromTo(featureCards,
          { opacity: 0, y: 50, scale: 0.95 },
          {
            opacity: 1, y: 0, scale: 1,
            duration: 0.65, stagger: 0.09, ease: 'power3.out',
            scrollTrigger: { trigger: '.features-grid', start: 'top 82%', once: true },
          }
        )
      }

      // Pricing cards — scale-back pop
      const pricingCards = gsap.utils.toArray('.pricing-card')
      if (pricingCards.length) {
        gsap.fromTo(pricingCards,
          { opacity: 0, y: 55, scale: 0.93 },
          {
            opacity: 1, y: 0, scale: 1,
            duration: 0.75, stagger: 0.18, ease: 'back.out(1.2)',
            scrollTrigger: { trigger: '.pricing-grid', start: 'top 80%', once: true },
          }
        )
      }

      // Schedule cards — quick cascade
      const scheduleCards = gsap.utils.toArray('.schedule-card')
      if (scheduleCards.length) {
        gsap.fromTo(scheduleCards,
          { opacity: 0, y: 35 },
          {
            opacity: 1, y: 0,
            duration: 0.55, stagger: 0.07, ease: 'power2.out',
            scrollTrigger: { trigger: '.schedule-grid', start: 'top 82%', once: true },
          }
        )
      }
      const scheduleCta = document.querySelector('.schedule-cta')
      if (scheduleCta) {
        gsap.fromTo(scheduleCta,
          { opacity: 0, y: 22 },
          {
            opacity: 1, y: 0, duration: 0.6, ease: 'power2.out',
            scrollTrigger: { trigger: scheduleCta, start: 'top 90%', once: true },
          }
        )
      }

      // Testimonial cards
      const testimonialCards = gsap.utils.toArray('.testimonial-card')
      if (testimonialCards.length) {
        gsap.fromTo(testimonialCards,
          { opacity: 0, y: 45, scale: 0.96 },
          {
            opacity: 1, y: 0, scale: 1,
            duration: 0.65, stagger: 0.14, ease: 'power3.out',
            scrollTrigger: { trigger: '.testimonials-grid', start: 'top 82%', once: true },
          }
        )
      }

      // CTA section
      const ctaInner = document.querySelector('.cta-section__inner')
      if (ctaInner) {
        gsap.fromTo(ctaInner,
          { opacity: 0, y: 38, scale: 0.96 },
          {
            opacity: 1, y: 0, scale: 1, duration: 0.85, ease: 'power3.out',
            scrollTrigger: { trigger: '.cta-section', start: 'top 78%', once: true },
          }
        )
      }

      // GymMap
      const gymmap = document.querySelector('.gymmap')
      if (gymmap) {
        gsap.fromTo(gymmap,
          { opacity: 0, y: 28 },
          {
            opacity: 1, y: 0, duration: 0.75, ease: 'power2.out',
            scrollTrigger: { trigger: gymmap, start: 'top 82%', once: true },
          }
        )
      }
    })

    return () => ctx.revert()
  }, [subLoading])

  return (
    <div className="page home">

      {/* ── Hero ── */}
      <section className="hero" ref={heroRef} onMouseMove={handleHeroMouseMove}>
        <div className="hero__grid-bg" aria-hidden />
        <div className="hero__glow-wrap" aria-hidden><div className="hero__glow" /></div>
        <div className="container hero__content">
          <div className="hero__left">
            <span className="hero__eyebrow animate-fade-up">
              {hasActiveSub
                ? <><IconFlex size={14} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '0.3em' }} />Bienvenido/a de vuelta</>
                : config.hero_eyebrow
              }
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
                  <span className="hero__panel-icon"><IconTrophy size={22} /></span>
                  <div>
                    <strong>Entrenadores certificados</strong>
                    <span>Planes 100% personalizados</span>
                  </div>
                </div>
                <div className="hero__panel-card hero__panel-card--accent">
                  <span className="hero__panel-icon"><IconBolt size={22} /></span>
                  <div>
                    <strong>Equipamiento de élite</strong>
                    <span>+200 máquinas modernas</span>
                  </div>
                </div>
                <div className="hero__panel-card">
                  <span className="hero__panel-icon"><IconClock size={22} /></span>
                  <div>
                    <strong>Abierto 24/7</strong>
                    <span>Sin horarios restrictivos</span>
                  </div>
                </div>
                <div className="hero__panel-card">
                  <span className="hero__panel-icon"><IconLeaf size={22} /></span>
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
        <section className="section">
          <div className="container">
            <div className="section__head">
              <span className="section__tag">{hasActiveSub ? 'Para miembros' : 'Promociones'}</span>
              <h2 className="section__title">{hasActiveSub ? 'Ventajas exclusivas' : 'Ofertas exclusivas'}</h2>
            </div>
            <div className="promos-grid">
              {promos.map((p, i) => (
                <div
                  key={i}
                  className={`promo-card animate-fade-up animate-fade-up-delay-${i + 1} ${p.accent ? 'promo-card--accent' : ''}`}
                >
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
        <section className="section section--dark">
          <div className="container">
            <div className="section__head">
              <span className="section__tag">Por qué elegirnos</span>
              <h2 className="section__title">Todo lo que necesitas</h2>
            </div>
            <div className="features-grid">
              {FEATURES.map((f, i) => (
                <div key={i} className="feature-card">
                  <span className="feature-card__icon"><f.Icon size={28} /></span>
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
        <section className="section pricing-section">
          <div className="container">
            <div className="section__head">
              <span className="section__tag">Precios</span>
              <h2 className="section__title">Elige tu plan</h2>
              <p className="section__subtitle">Sin permanencia en el mensual. El anual se factura en un único pago de 239.88€.</p>
            </div>
            <div className="pricing-grid">
              {PLANS.map((p, i) => (
                <div key={p.id} className={`pricing-card ${p.highlight ? 'pricing-card--highlight' : ''}`}>
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
                        <span className="pricing-card__check"><IconCheck size={14} /></span>
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
        <section className="section section--dark schedule-section">
          <div className="container">
            <div className="section__head">
              <span className="section__tag">Horarios</span>
              <h2 className="section__title">Clases semanales</h2>
              <p className="section__subtitle">Reserva tu plaza en la app o en recepción. Plazas limitadas.</p>
            </div>
            <div className="schedule-grid">
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
            <div className="schedule-cta">
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
        <section className="section">
          <div className="container">
            <div className="section__head">
              <span className="section__tag">Testimonios</span>
              <h2 className="section__title">Historias reales</h2>
            </div>
            <div className="testimonials-grid">
              {TESTIMONIALS.map((t, i) => (
                <div key={i} className="testimonial-card">
                  <div className="testimonial-card__stars">
                    {Array.from({ length: t.stars }, (_, i) => <IconStar key={i} size={14} />)}
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

      {/* ── CTA ── */}
      {!hasActiveSub && isVisible(config, 'section_cta') && (
        <section className="cta-section">
          <div className="container cta-section__inner">
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
