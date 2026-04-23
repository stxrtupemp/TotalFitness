import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { signIn } from '../lib/supabase'
import { NEON, CYAN, BG, MUTED, TEXT, BORDER, Input, NeonButton } from '../components/UI'

function AuthLayout({ children, title, sub }) {
  return (
    <div style={{ minHeight: '100vh', background: BG, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem 1.25rem' }}>
      <div style={{ position: 'fixed', inset: 0, background: `radial-gradient(ellipse 60% 50% at 50% 30%, rgba(194,255,0,0.045), transparent)`, pointerEvents: 'none' }} />
      <div style={{ width: '100%', maxWidth: '420px', position: 'relative' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <Link to="/" style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '1.7rem', fontWeight: 800, textDecoration: 'none', display: 'inline-block', marginBottom: '0.75rem' }}>
            <span style={{ color: NEON }}>TOTAL</span><span style={{ color: TEXT }}>FITNESS</span>
          </Link>
          <h1 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 'clamp(1.5rem,4vw,1.8rem)', fontWeight: 800, color: TEXT, margin: '0 0 0.4rem' }}>{title}</h1>
          {sub && <p style={{ color: MUTED, fontFamily: "'Inter', sans-serif", fontSize: '0.85rem' }}>{sub}</p>}
        </div>
        <div style={{ background: '#0d1219', border: `1px solid ${NEON}20`, borderRadius: '16px', padding: 'clamp(1.5rem,4vw,2.25rem)', boxShadow: '0 0 60px rgba(0,0,0,0.5)' }}>
          {children}
        </div>
      </div>
    </div>
  )
}

export default function Login() {
  const navigate = useNavigate()
  const [email, setEmail]   = useState('')
  const [pass, setPass]     = useState('')
  const [error, setError]   = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await signIn(email, pass)
      navigate('/dashboard')
    } catch {
      setError('Credenciales incorrectas. Inténtalo de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout title="Bienvenido de vuelta" sub="Accede a tu área personal">
      <form onSubmit={handleSubmit}>
        <Input label="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="tu@email.com" required />
        <Input label="Contraseña" type="password" value={pass} onChange={e => setPass(e.target.value)} placeholder="••••••••" required />
        {error && (
          <div style={{ color: '#ff4466', fontSize: '0.8rem', fontFamily: "'Inter', sans-serif", marginBottom: '1rem', background: '#ff446612', padding: '0.6rem 0.8rem', borderRadius: '6px', border: '1px solid #ff446630' }}>{error}</div>
        )}
        <div style={{ textAlign: 'right', marginBottom: '1.1rem' }}>
          <Link to="/reset-password" style={{ color: NEON, fontSize: '0.8rem', fontFamily: "'Inter', sans-serif", textDecoration: 'none' }}>¿Olvidaste tu contraseña?</Link>
        </div>
        <NeonButton fullWidth type="submit" loading={loading}>{loading ? 'Entrando...' : 'Entrar'}</NeonButton>
      </form>
      <div style={{ textAlign: 'center', marginTop: '1.5rem', color: MUTED, fontSize: '0.85rem', fontFamily: "'Inter', sans-serif" }}>
        ¿No tienes cuenta? <Link to="/register" style={{ color: NEON, textDecoration: 'none' }}>Regístrate</Link>
      </div>
    </AuthLayout>
  )
}
