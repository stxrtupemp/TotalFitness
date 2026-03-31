import { useState, useEffect } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { signOut } from '../lib/supabase'
import './Navbar.css'

export default function Navbar() {
  const { user, isAdmin } = useAuth()
  const navigate          = useNavigate()
  const [open, setOpen]   = useState(false)
  const [scrolled, setScrolled] = useState(false)

  const close = () => setOpen(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close menu on resize to desktop
  useEffect(() => {
    const onResize = () => { if (window.innerWidth > 768) setOpen(false) }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  const handleSignOut = async () => {
    await signOut()
    navigate('/')
    close()
  }

  return (
    <nav className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`}>
      <div className="container navbar__inner">
        <Link to="/" className="navbar__logo" onClick={close}>
          TOTAL<span>FITNESS</span>
        </Link>

        <button
          className={`navbar__burger ${open ? 'navbar__burger--open' : ''}`}
          onClick={() => setOpen(o => !o)}
          aria-label="Menú"
          aria-expanded={open}
        >
          <span />
          <span />
          <span />
        </button>

        <div className={`navbar__links ${open ? 'navbar__links--open' : ''}`}>
          <NavLink to="/" end onClick={close}>Inicio</NavLink>

          {user && (
            <>
              <NavLink to="/dashboard" onClick={close}>Mi Cuenta</NavLink>
              {isAdmin && (
                <NavLink to="/admin" onClick={close} className="navbar__admin-link">
                  Admin
                </NavLink>
              )}
              <button className="btn btn-outline btn-sm" onClick={handleSignOut}>
                Cerrar sesión
              </button>
            </>
          )}

          {!user && (
            <>
              <NavLink to="/login" onClick={close}>Acceder</NavLink>
              <Link to="/register" className="btn btn-primary btn-sm" onClick={close}>
                Únete
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Mobile backdrop */}
      {open && <div className="navbar__backdrop" onClick={close} aria-hidden />}
    </nav>
  )
}
