import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { resetPasswordForEmail, updatePassword, supabase } from '../lib/supabase'
import { NEON, BG, MUTED, TEXT, Input, NeonButton, Icon } from '../components/UI'

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

export default function ResetPassword() {
  const navigate = useNavigate()
  const [mode, setMode]         = useState('request') // 'request' | 'update' | 'sent'
  const [email, setEmail]       = useState('')
  const [newPass, setNewPass]   = useState('')
  const [newPass2, setNewPass2] = useState('')
  const [error, setError]       = useState('')
  const [loading, setLoading]   = useState(false)

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') setMode('update')
    })
    return () => subscription.unsubscribe()
  }, [])

  const handleRequest = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await resetPasswordForEmail(email)
      setMode('sent')
    } catch (err) {
      setError(err.message || 'Error al enviar el enlace.')
    } finally {
      setLoading(false)
    }
  }

  const handleUpdate = async (e) => {
    e.preventDefault()
    setError('')
    if (newPass !== newPass2) { setError('Las contraseñas no coinciden.'); return }
    if (newPass.length < 6)   { setError('Mínimo 6 caracteres.'); return }
    setLoading(true)
    try {
      await updatePassword(newPass)
      navigate('/dashboard')
    } catch (err) {
      setError(err.message || 'Error al actualizar la contraseña.')
    } finally {
      setLoading(false)
    }
  }

  if (mode === 'sent') {
    return (
      <AuthLayout title="Enlace enviado" sub="">
        <div style={{ textAlign: 'center', padding: '1rem 0' }}>
          <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: `${NEON}12`, border: `1px solid ${NEON}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem' }}>
            <Icon name="mail" size={24} color={NEON} />
          </div>
          <p style={{ color: TEXT, fontFamily: "'Barlow Condensed', sans-serif", fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.5rem' }}>Revisa tu bandeja</p>
          <p style={{ color: MUTED, fontFamily: "'Inter', sans-serif", fontSize: '0.875rem', lineHeight: 1.6, marginBottom: '2rem' }}>
            Hemos enviado un enlace a <strong style={{ color: NEON }}>{email}</strong>
          </p>
          <NeonButton fullWidth onClick={() => navigate('/login')}>Volver al login</NeonButton>
        </div>
        <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
          <Link to="/login" style={{ color: MUTED, fontSize: '0.82rem', fontFamily: "'Inter', sans-serif", textDecoration: 'none' }}>← Volver</Link>
        </div>
      </AuthLayout>
    )
  }

  if (mode === 'update') {
    return (
      <AuthLayout title="Nueva contraseña" sub="Introduce tu nueva contraseña">
        <form onSubmit={handleUpdate}>
          <Input label="Nueva contraseña" type="password" value={newPass} onChange={e => setNewPass(e.target.value)} placeholder="Mínimo 6 caracteres" required />
          <Input label="Confirmar contraseña" type="password" value={newPass2} onChange={e => setNewPass2(e.target.value)} placeholder="Repite la contraseña" required />
          {error && (
            <div style={{ color: '#ff4466', fontSize: '0.8rem', fontFamily: "'Inter', sans-serif", marginBottom: '1rem', background: '#ff446612', padding: '0.6rem 0.8rem', borderRadius: '6px', border: '1px solid #ff446630' }}>{error}</div>
          )}
          <NeonButton fullWidth type="submit" loading={loading}>{loading ? 'Guardando...' : 'Actualizar contraseña'}</NeonButton>
        </form>
      </AuthLayout>
    )
  }

  return (
    <AuthLayout title="Recuperar contraseña" sub="Te enviaremos un enlace de acceso">
      <form onSubmit={handleRequest}>
        <Input label="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="tu@email.com" required />
        {error && (
          <div style={{ color: '#ff4466', fontSize: '0.8rem', fontFamily: "'Inter', sans-serif", marginBottom: '1rem', background: '#ff446612', padding: '0.6rem 0.8rem', borderRadius: '6px', border: '1px solid #ff446630' }}>{error}</div>
        )}
        <NeonButton fullWidth type="submit" loading={loading} disabled={!email}>{loading ? 'Enviando...' : 'Enviar enlace'}</NeonButton>
      </form>
      <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
        <Link to="/login" style={{ color: MUTED, fontSize: '0.82rem', fontFamily: "'Inter', sans-serif", textDecoration: 'none' }}>← Volver</Link>
      </div>
    </AuthLayout>
  )
}
