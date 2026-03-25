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
        {/* Brand */}
        <div className="footer__brand">
          <Link to="/" className="footer__logo">TOTAL<span>FITNESS</span></Link>
          <p>Forja tu mejor versión cada día.</p>
        </div>

        {/* Navegación condicional */}
        <nav className="footer__nav">
          <span className="footer__nav-label">Navegación</span>
          <Link to="/">Inicio</Link>
          {user && <Link to="/dashboard">Mi Cuenta</Link>}
          {isAdmin && <Link to="/admin">Panel Admin</Link>}
          {!user && <Link to="/login">Acceder</Link>}
          {!user && <Link to="/register">Registro</Link>}
        </nav>

        {/* Info */}
        <div className="footer__info">
          <span className="footer__nav-label">Gimnasio</span>
          <p>Av. la Venta, S/N</p>
          <p>03190 Pilar de la Horadada, Alicante</p>
          <p>info@totalfitness.es</p>
          <p>+34 965 000 000</p>
        </div>

        {/* Horario */}
        <div className="footer__hours">
          <span className="footer__nav-label">Horario</span>
          <p>Lun – Vie: 06:00 – 23:00</p>
          <p>Sáb – Dom: 08:00 – 21:00</p>
          {user && (
            <button className="footer__logout" onClick={handleSignOut}>
              Cerrar sesión
            </button>
          )}
        </div>

        {/* Bottom */}
        <div className="footer__bottom">
          <p>© {new Date().getFullYear()} TotalFitness. Todos los derechos reservados.</p>
          {user && (
            <span className="footer__user-badge">
              {isAdmin ? '⚡ Admin' : '✓ Miembro activo'}
            </span>
          )}
        </div>
      </div>
    </footer>
  )
}
