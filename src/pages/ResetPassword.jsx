import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { resetPasswordForEmail, updatePassword, supabase } from '../lib/supabase'
import './Auth.css'

export default function ResetPassword() {
  const navigate = useNavigate()

  // Supabase sends a fragment (#access_token=...) after clicking the email link
  const [mode, setMode]       = useState('request') // 'request' | 'update'
  const [email, setEmail]     = useState('')
  const [pass, setPass]       = useState('')
  const [pass2, setPass2]     = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    // If there's an access_token in the URL fragment, Supabase has set the session
    const hash = window.location.hash
    if (hash.includes('access_token') || hash.includes('type=recovery')) {
      setMode('update')
    }

    // Also listen for the PASSWORD_RECOVERY auth event
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') setMode('update')
    })
    return () => subscription.unsubscribe()
  }, [])

  const handleRequest = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    if (!email.trim()) { setError('Introduce tu email.'); return }
    setLoading(true)
    try {
      await resetPasswordForEmail(email)
      setSuccess('Revisa tu email. Hemos enviado un enlace para restablecer tu contraseña.')
    } catch (err) {
      setError(err.message || 'Error al enviar el email. Inténtalo de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  const handleUpdate = async (e) => {
    e.preventDefault()
    setError('')
    if (pass.length < 6) { setError('La contraseña debe tener al menos 6 caracteres.'); return }
    if (pass !== pass2)  { setError('Las contraseñas no coinciden.'); return }
    setLoading(true)
    try {
      await updatePassword(pass)
      setSuccess('¡Contraseña actualizada! Redirigiendo...')
      setTimeout(() => navigate('/dashboard'), 2000)
    } catch (err) {
      setError(err.message || 'Error al actualizar la contraseña.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page page">
      <div className="auth-card animate-fade-up">
        <div className="auth-card__header">
          <Link to="/" className="auth-card__logo">TOTAL<span>FITNESS</span></Link>
          <h1 className="auth-card__title">
            {mode === 'request' ? 'Recuperar cuenta' : 'Nueva contraseña'}
          </h1>
          <p className="auth-card__sub">
            {mode === 'request'
              ? 'Te enviaremos un enlace a tu email'
              : 'Elige una nueva contraseña segura'
            }
          </p>
        </div>

        {mode === 'request' ? (
          <form className="auth-form" onSubmit={handleRequest}>
            <div className="form-group">
              <label className="form-label">Email</label>
              <input
                type="email"
                className="form-input"
                placeholder="tu@email.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </div>

            {error   && <p className="auth-error">{error}</p>}
            {success && <p className="auth-success">{success}</p>}

            <button type="submit" className="btn btn-primary auth-submit" disabled={loading || !!success}>
              {loading ? <span className="spinner" /> : 'Enviar enlace'}
            </button>
          </form>
        ) : (
          <form className="auth-form" onSubmit={handleUpdate}>
            <div className="form-group">
              <label className="form-label">Nueva contraseña</label>
              <input
                type="password"
                className="form-input"
                placeholder="Mínimo 6 caracteres"
                value={pass}
                onChange={e => setPass(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Confirmar contraseña</label>
              <input
                type="password"
                className="form-input"
                placeholder="Repite la contraseña"
                value={pass2}
                onChange={e => setPass2(e.target.value)}
                required
              />
            </div>

            {error   && <p className="auth-error">{error}</p>}
            {success && <p className="auth-success">{success}</p>}

            <button type="submit" className="btn btn-primary auth-submit" disabled={loading || !!success}>
              {loading ? <span className="spinner" /> : 'Actualizar contraseña'}
            </button>
          </form>
        )}

        <p className="auth-footer">
          <Link to="/login">← Volver a iniciar sesión</Link>
        </p>
      </div>
    </div>
  )
}
