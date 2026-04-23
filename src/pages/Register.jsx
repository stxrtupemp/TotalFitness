import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { signUp } from '../lib/supabase'
import { NEON, BG, MUTED, TEXT, BORDER, Input, NeonButton } from '../components/UI'

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

export default function Register() {
  const navigate = useNavigate()
  const [name, setName]     = useState('')
  const [email, setEmail]   = useState('')
  const [pass, setPass]     = useState('')
  const [pass2, setPass2]   = useState('')
  const [error, setError]   = useState('')
  const [loading, setLoading] = useState(false)

  const strength = pass.length === 0 ? 0 : pass.length < 6 ? 1 : pass.length < 10 ? 2 : 3
  const sColors  = ['', '#ff4466', '#ffaa00', '#00ff88']

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (pass !== pass2) { setError('Las contraseñas no coinciden.'); return }
    if (pass.length < 6) { setError('La contraseña debe tener al menos 6 caracteres.'); return }
    setLoading(true)
    try {
      await signUp(email, pass)
      navigate('/dashboard')
    } catch (err) {
      setError(err.message || 'Error al crear la cuenta. Inténtalo de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout title="Únete a la élite" sub="Crea tu cuenta — 7 días de prueba gratis">
      <form onSubmit={handleSubmit}>
        <Input label="Nombre completo" value={name} onChange={e => setName(e.target.value)} placeholder="Tu nombre" required />
        <Input label="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="tu@email.com" required />
        <Input label="Contraseña" type="password" value={pass} onChange={e => setPass(e.target.value)} placeholder="Mínimo 6 caracteres" required />
        {pass.length > 0 && (
          <div style={{ marginTop: '-0.6rem', marginBottom: '1.1rem' }}>
            <div style={{ display: 'flex', gap: '3px', marginBottom: '0.25rem' }}>
              {[1,2,3].map(i => <div key={i} style={{ flex: 1, height: '2px', borderRadius: '2px', background: i <= strength ? sColors[strength] : BORDER, transition: 'all 0.3s' }} />)}
            </div>
            <span style={{ color: sColors[strength], fontSize: '0.7rem', fontFamily: "'Inter', sans-serif" }}>{['','Débil','Media','Fuerte'][strength]}</span>
          </div>
        )}
        <Input label="Repetir contraseña" type="password" value={pass2} onChange={e => setPass2(e.target.value)} placeholder="Repite tu contraseña" required />
        {error && (
          <div style={{ color: '#ff4466', fontSize: '0.8rem', fontFamily: "'Inter', sans-serif", marginBottom: '1rem', background: '#ff446612', padding: '0.6rem 0.8rem', borderRadius: '6px', border: '1px solid #ff446630' }}>{error}</div>
        )}
        <NeonButton fullWidth type="submit" loading={loading}>{loading ? 'Creando cuenta...' : 'Crear cuenta gratis'}</NeonButton>
      </form>
      <div style={{ textAlign: 'center', marginTop: '1.5rem', color: MUTED, fontSize: '0.85rem', fontFamily: "'Inter', sans-serif" }}>
        ¿Ya tienes cuenta? <Link to="/login" style={{ color: NEON, textDecoration: 'none' }}>Entrar</Link>
      </div>
    </AuthLayout>
  )
}
