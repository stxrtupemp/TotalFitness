import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { signOut } from '../lib/supabase'
import { useNavigate } from 'react-router-dom'
import './Footer.css'

export default function Footer() {
  const { user, isAdmin } = useAuth()
  const navigate          = useNavigate()

  const handleSignOut = async () => {
    await signOut()
    navigate('/')
  }

  return (
    <footer className="footer">
      <div className="container footer__inner">

        {/* ── Brand ── */}
        <div className="footer__brand">
          <Link to="/" className="footer__logo">TOTAL<span>FITNESS</span></Link>
          <p className="footer__tagline">Forja tu mejor versión cada día.</p>
          <div className="footer__social">
            <a href="#" aria-label="Instagram" className="footer__social-link">IG</a>
            <a href="#" aria-label="Facebook"  className="footer__social-link">FB</a>
            <a href="#" aria-label="YouTube"   className="footer__social-link">YT</a>
            <a href="#" aria-label="TikTok"    className="footer__social-link">TK</a>
          </div>
        </div>

        {/* ── Navigation ── */}
        <nav className="footer__nav">
          <span className="footer__col-label">Navegación</span>
          <Link to="/">Inicio</Link>
          {user  && <Link to="/dashboard">Mi Cuenta</Link>}
          {isAdmin && <Link to="/admin">Panel Admin</Link>}
          {!user && <Link to="/login">Acceder</Link>}
          {!user && <Link to="/register">Registro</Link>}
        </nav>

        {/* ── Info ── */}
        <div className="footer__info">
          <span className="footer__col-label">Gimnasio</span>
          <p>Av. la Venta, S/N</p>
          <p>03190 Pilar de la Horadada</p>
          <p>Alicante, España</p>
          <a href="mailto:info@totalfitness.es" className="footer__link">info@totalfitness.es</a>
          <a href="tel:+34965000000" className="footer__link">+34 965 000 000</a>
        </div>

        {/* ── Hours ── */}
        <div className="footer__hours">
          <span className="footer__col-label">Horario</span>
          <div className="footer__hours-row">
            <span>Lun – Vie</span>
            <strong>06:00 – 23:00</strong>
          </div>
          <div className="footer__hours-row">
            <span>Sáb – Dom</span>
            <strong>08:00 – 21:00</strong>
          </div>
          <div className="footer__hours-row footer__hours-row--accent">
            <span>🕐 Gym 24/7</span>
            <strong>Acceso libre</strong>
          </div>
        </div>

      </div>

      {/* ── Bottom bar ── */}
      <div className="footer__bottom">
        <div className="container footer__bottom-inner">
          <p>© {new Date().getFullYear()} TotalFitness. Todos los derechos reservados.</p>
          <div className="footer__bottom-right">
            {user && (
              <span className="footer__user-badge">
                {isAdmin ? '⚡ Admin' : '✓ Miembro'}
              </span>
            )}
            {user && (
              <button className="footer__logout" onClick={handleSignOut}>
                Cerrar sesión
              </button>
            )}
          </div>
        </div>
      </div>
    </footer>
  )
}
