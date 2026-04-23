import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { signOut } from '../lib/supabase'
import { NEON, MUTED, TEXT, BORDER, BG, useWidth, Icon } from './UI'

function NeonButtonSmall({ children, onClick }) {
  const [hov, setHov] = useState(false)
  return (
    <button onClick={onClick} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        padding: '0.45rem 1.1rem',
        fontFamily: "'Barlow Condensed', sans-serif", fontSize: '0.84rem',
        fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase',
        border: `1.5px solid ${NEON}`, borderRadius: '4px',
        cursor: 'pointer',
        background: hov ? NEON : `${NEON}14`,
        color: hov ? BG : NEON,
        boxShadow: hov ? `0 0 18px ${NEON}50` : 'none',
        transition: 'all 0.22s ease',
      }}>{children}</button>
  )
}

export default function Navbar() {
  const { user, isAdmin } = useAuth()
  const navigate          = useNavigate()
  const location          = useLocation()
  const bp                = useWidth()
  const [scrolled, setScrolled]   = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const isMobile = bp === 'xs' || bp === 'sm'

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

  useEffect(() => { setMobileOpen(false) }, [location.pathname])

  const handleSignOut = async () => {
    await signOut()
    navigate('/')
  }

  const navLinks = [
    { to: '/',         label: 'Inicio' },
    { to: '/pricing',  label: 'Precios' },
    { to: '/schedule', label: 'Clases' },
  ]

  const isActive = (to) => to === '/' ? location.pathname === '/' : location.pathname.startsWith(to)

  return (
    <>
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
        height: '64px', padding: '0 clamp(1rem,4vw,2rem)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: (scrolled || mobileOpen) ? 'rgba(7,9,15,0.96)' : 'transparent',
        backdropFilter: (scrolled || mobileOpen) ? 'blur(20px)' : 'none',
        borderBottom: scrolled ? `1px solid ${BORDER}` : '1px solid transparent',
        transition: 'background 0.4s, border-color 0.4s',
      }}>
        <Link to="/" style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 'clamp(1.35rem,3vw,1.6rem)', fontWeight: 800, letterSpacing: '0.04em', userSelect: 'none', textDecoration: 'none' }}>
          <span style={{ color: NEON }}>TOTAL</span><span style={{ color: TEXT }}>FITNESS</span>
        </Link>

        {!isMobile && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '2.5rem' }}>
            {navLinks.map(({ to, label }) => (
              <Link key={to} to={to} style={{ color: isActive(to) ? NEON : MUTED, fontFamily: "'Inter', sans-serif", fontSize: '0.82rem', fontWeight: 500, letterSpacing: '0.05em', textTransform: 'uppercase', transition: 'color 0.2s', textDecoration: 'none' }}
                onMouseEnter={e => e.currentTarget.style.color = TEXT}
                onMouseLeave={e => e.currentTarget.style.color = isActive(to) ? NEON : MUTED}
              >{label}</Link>
            ))}
            {user ? (
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <NeonButtonSmall onClick={() => navigate(isAdmin ? '/admin' : '/dashboard')}>
                  {isAdmin ? 'Admin' : 'Mi panel'}
                </NeonButtonSmall>
                <span onClick={handleSignOut} style={{ color: MUTED, fontSize: '0.8rem', fontFamily: "'Inter', sans-serif", cursor: 'pointer', transition: 'color 0.2s' }}
                  onMouseEnter={e => e.currentTarget.style.color = TEXT}
                  onMouseLeave={e => e.currentTarget.style.color = MUTED}
                >Salir</span>
              </div>
            ) : (
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <Link to="/login" style={{ color: MUTED, fontSize: '0.82rem', fontFamily: "'Inter', sans-serif", fontWeight: 500, letterSpacing: '0.05em', textTransform: 'uppercase', transition: 'color 0.2s', textDecoration: 'none' }}
                  onMouseEnter={e => e.currentTarget.style.color = TEXT}
                  onMouseLeave={e => e.currentTarget.style.color = MUTED}
                >Entrar</Link>
                <NeonButtonSmall onClick={() => navigate('/register')}>Unirme</NeonButtonSmall>
              </div>
            )}
          </div>
        )}

        {isMobile && (
          <button onClick={() => setMobileOpen(p => !p)} style={{ background: 'none', border: `1px solid ${BORDER}`, borderRadius: '6px', padding: '0.4rem', color: TEXT, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon name={mobileOpen ? 'x' : 'menu'} size={20} color={TEXT} />
          </button>
        )}
      </nav>

      {isMobile && mobileOpen && (
        <div style={{ position: 'fixed', top: '64px', left: 0, right: 0, bottom: 0, zIndex: 999, background: 'rgba(7,9,15,0.98)', backdropFilter: 'blur(20px)', display: 'flex', flexDirection: 'column', padding: '2.5rem 2rem', gap: '0.5rem', overflowY: 'auto' }}>
          {navLinks.map(({ to, label }) => (
            <Link key={to} to={to} style={{ background: isActive(to) ? `${NEON}10` : 'none', border: `1px solid ${isActive(to) ? NEON + '44' : BORDER}`, borderRadius: '10px', padding: '1rem 1.25rem', color: isActive(to) ? NEON : TEXT, fontFamily: "'Barlow Condensed', sans-serif", fontSize: '1.25rem', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', cursor: 'pointer', textAlign: 'left', textDecoration: 'none', display: 'block' }}>{label}</Link>
          ))}
          <div style={{ height: '1px', background: BORDER, margin: '0.75rem 0' }} />
          {user ? (
            <>
              <Link to={isAdmin ? '/admin' : '/dashboard'} style={{ background: `${NEON}15`, border: `1px solid ${NEON}55`, borderRadius: '10px', padding: '1rem 1.25rem', color: NEON, fontFamily: "'Barlow Condensed', sans-serif", fontSize: '1.25rem', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', cursor: 'pointer', textAlign: 'left', textDecoration: 'none', display: 'block' }}>
                {isAdmin ? 'Panel admin' : 'Mi panel'}
              </Link>
              <button onClick={handleSignOut} style={{ background: 'none', border: `1px solid ${BORDER}`, borderRadius: '10px', padding: '1rem 1.25rem', color: MUTED, fontFamily: "'Barlow Condensed', sans-serif", fontSize: '1.1rem', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', cursor: 'pointer', textAlign: 'left' }}>Cerrar sesión</button>
            </>
          ) : (
            <>
              <Link to="/register" style={{ background: `${NEON}15`, border: `1px solid ${NEON}55`, borderRadius: '10px', padding: '1rem 1.25rem', color: NEON, fontFamily: "'Barlow Condensed', sans-serif", fontSize: '1.25rem', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', cursor: 'pointer', textAlign: 'left', textDecoration: 'none', display: 'block' }}>Unirme</Link>
              <Link to="/login" style={{ background: 'none', border: `1px solid ${BORDER}`, borderRadius: '10px', padding: '1rem 1.25rem', color: TEXT, fontFamily: "'Barlow Condensed', sans-serif", fontSize: '1.1rem', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', cursor: 'pointer', textAlign: 'left', textDecoration: 'none', display: 'block' }}>Entrar</Link>
            </>
          )}
        </div>
      )}
    </>
  )
}
