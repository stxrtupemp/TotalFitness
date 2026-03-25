import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useSubscription } from '../hooks/useSubscription'
import Footer from '../components/Footer'
import GymMap from '../components/GymMap'
import './Home.css'

// Promos visibles solo sin suscripción activa
const PROMOS_GUEST = [
  { tag: 'OFERTA LIMITADA', title: 'Primer mes gratis', desc: 'Regístrate antes del 31 de este mes y comienza sin coste. Cancela cuando quieras.', cta: 'Aprovecha ahora', accent: true },
  { tag: 'NOVEDAD',         title: 'Clases de HIIT Premium', desc: 'Nuevas sesiones de alta intensidad con entrenadores certificados. Máxima quema de grasa.', cta: 'Ver horarios' },
  { tag: 'PLAN ANUAL',      title: 'Ahorra un 33%', desc: 'Comprométete con tu objetivo. El plan anual incluye nutricionista y análisis corporal mensual.', cta: 'Ver plan anual' },
]

// Promos para miembros activos (sin descuentos de captación)
const PROMOS_MEMBER = [
  { tag: 'NOVEDAD',     title: 'Clases de HIIT Premium', desc: 'Nuevas sesiones de alta intensidad con entrenadores certificados. Máxima quema de grasa.', cta: 'Reservar clase' },
  { tag: 'PLAN ANUAL',  title: 'Mejora tu plan', desc: 'Pasa al plan anual y ahorra un 33%. Incluye nutricionista y análisis corporal mensual.', cta: 'Ver plan anual' },
  { tag: 'REFERIDOS',   title: 'Trae a un amigo', desc: 'Por cada amigo que traigas, obtén un mes gratis en tu próxima renovación.', cta: 'Saber más', accent: true },
]

const FEATURES = [
  { icon: '⚡', title: 'Equipamiento de élite',    desc: 'Más de 200 máquinas de última generación para cada grupo muscular.' },
  { icon: '🏋️', title: 'Entrenadores certificados', desc: 'Profesionales titulados que diseñan tu plan personalizado.' },
  { icon: '🥗', title: 'Nutrición integrada',       desc: 'Asesoramiento nutricional incluido en el plan premium.' },
  { icon: '📱', title: 'App TotalFitness',          desc: 'Reserva clases, controla tu progreso y accede a tu suscripción.' },
  { icon: '🕐', title: 'Abierto 24/7',              desc: 'Entrena cuando quieras, sin horarios restrictivos.' },
  { icon: '👥', title: '+ de 50 clases semanales',  desc: 'Yoga, pilates, spinning, boxeo, CrossFit y mucho más.' },
]

const TESTIMONIALS = [
  { name: 'Marta García', role: 'Miembro desde 2022', text: 'He perdido 18 kg en 8 meses. El equipo de TotalFitness cambió mi vida.' },
  { name: 'Carlos Ruiz',  role: 'Atleta amateur',     text: 'Las instalaciones son increíbles. Los entrenadores te exigen al máximo.' },
  { name: 'Ana López',    role: 'Plan anual',          text: 'El servicio de nutrición ha sido clave para alcanzar mis objetivos.' },
]

export default function Home() {
  const { user }          = useAuth()
  const { isActive, loading: subLoading } = useSubscription(user?.id)

  const hasActiveSub = user && isActive
  const promos       = hasActiveSub ? PROMOS_MEMBER : PROMOS_GUEST

  return (
    <div className="page home">

      {/* ── Hero ── */}
      <section className="hero">
        <div className="hero__grid-bg" aria-hidden />
        <div className="container hero__content">

          {/* Eyebrow condicional */}
          <span className="hero__eyebrow animate-fade-up">
            {hasActiveSub ? `Bienvenido/a de vuelta 💪` : 'El gimnasio que te transforma'}
          </span>

          <h1 className="hero__title animate-fade-up animate-fade-up-delay-1">
            ENTRENA.<br />SUPÉRATE.<br /><span>SIN LÍMITES.</span>
          </h1>

          <p className="hero__desc animate-fade-up animate-fade-up-delay-2">
            {hasActiveSub
              ? 'Tu suscripción está activa. Accede a todos tus beneficios y reserva tus clases.'
              : <>Instalaciones premium, entrenadores de élite y tecnología de punta.<br />Tu mejor versión comienza hoy.</>
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

          {/* Stats: solo sin suscripción activa */}
          {!hasActiveSub && (
            <div className="hero__stats animate-fade-up animate-fade-up-delay-4">
              <div className="hero__stat"><strong>+5.000</strong><span>miembros activos</span></div>
              <div className="hero__stat-divider" />
              <div className="hero__stat"><strong>12</strong><span>años de experiencia</span></div>
              <div className="hero__stat-divider" />
              <div className="hero__stat"><strong>4.9★</strong><span>valoración media</span></div>
            </div>
          )}

          {/* Badge miembro activo */}
          {hasActiveSub && !subLoading && (
            <div className="hero__member-badge animate-fade-up animate-fade-up-delay-4">
              <span className="badge badge-active">
                <span className="badge-dot badge-dot--active" />
                Suscripción activa
              </span>
            </div>
          )}
        </div>
      </section>

      {/* ── Promos ── */}
      <section className="section">
        <div className="container">
          <div className="section__head animate-fade-up">
            <span className="section__tag">
              {hasActiveSub ? 'Para miembros' : 'Promociones'}
            </span>
            <h2 className="section__title">
              {hasActiveSub ? 'Ventajas exclusivas' : 'Ofertas exclusivas'}
            </h2>
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

      {/* ── Features ── */}
      <section className="section section--dark">
        <div className="container">
          <div className="section__head animate-fade-up">
            <span className="section__tag">Por qué elegirnos</span>
            <h2 className="section__title">Todo lo que necesitas</h2>
          </div>
          <div className="features-grid">
            {FEATURES.map((f, i) => (
              <div key={i} className={`feature-card animate-fade-up animate-fade-up-delay-${(i % 3) + 1}`}>
                <span className="feature-card__icon">{f.icon}</span>
                <h3 className="feature-card__title">{f.title}</h3>
                <p className="feature-card__desc">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className="section">
        <div className="container">
          <div className="section__head animate-fade-up">
            <span className="section__tag">Testimonios</span>
            <h2 className="section__title">Historias reales</h2>
          </div>
          <div className="testimonials-grid">
            {TESTIMONIALS.map((t, i) => (
              <div key={i} className={`testimonial-card animate-fade-up animate-fade-up-delay-${i + 1}`}>
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

      {/* ── CTA — solo sin suscripción ── */}
      {!hasActiveSub && (
        <section className="cta-section">
          <div className="container cta-section__inner animate-fade-up">
            <h2 className="cta-section__title">¿Listo para empezar?</h2>
            <p>Únete hoy y transforma tu cuerpo y tu mente.</p>
            <Link to={user ? '/dashboard' : '/register'} className="btn btn-primary">
              {user ? 'Activar suscripción →' : 'Crear cuenta gratis →'}
            </Link>
          </div>
        </section>
      )}

      <GymMap />
      <Footer />
    </div>
  )
}
