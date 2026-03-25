import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { signOut } from '../lib/supabase'
import './Navbar.css'

export default function Navbar() {
  const { user, isAdmin } = useAuth()
  const navigate          = useNavigate()
  const [open, setOpen]   = useState(false)

  const close = () => setOpen(false)

  const handleSignOut = async () => {
    await signOut()
    navigate('/')
    close()
  }

  return (
    <nav className="navbar">
      <div className="container navbar__inner">
        <Link to="/" className="navbar__logo" onClick={close}>
          TOTAL<span>FITNESS</span>
        </Link>

        <button className="navbar__burger" onClick={() => setOpen(o => !o)} aria-label="Menú">
          <span className={open ? 'open' : ''} />
          <span className={open ? 'open' : ''} />
          <span className={open ? 'open' : ''} />
        </button>

        <div className={`navbar__links ${open ? 'navbar__links--open' : ''}`}>
          <NavLink to="/" end onClick={close}>Inicio</NavLink>

          {/* Autenticado */}
          {user && (
            <>
              <NavLink to="/dashboard" onClick={close}>Mi Cuenta</NavLink>
              {isAdmin && <NavLink to="/admin" onClick={close} className="navbar__admin-link">Admin</NavLink>}
              <button className="btn btn-outline btn-sm" onClick={handleSignOut}>Cerrar sesión</button>
            </>
          )}

          {/* No autenticado */}
          {!user && (
            <>
              <NavLink to="/login" onClick={close}>Acceder</NavLink>
              <Link to="/register" className="btn btn-primary btn-sm" onClick={close}>Únete</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
