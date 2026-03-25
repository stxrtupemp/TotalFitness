import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { signUp } from '../lib/supabase'
import './Auth.css'

export default function Register() {
  const navigate            = useNavigate()
  const [email, setEmail]   = useState('')
  const [pass, setPass]     = useState('')
  const [pass2, setPass2]   = useState('')
  const [error, setError]   = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (pass.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.')
      return
    }
    if (pass !== pass2) {
      setError('Las contraseñas no coinciden.')
      return
    }

    setLoading(true)
    try {
      await signUp(email, pass)
      setSuccess('¡Cuenta creada! Revisa tu email para confirmar la cuenta.')
      setTimeout(() => navigate('/login'), 3000)
    } catch (err) {
      setError(err.message || 'Error al crear la cuenta.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page page">
      <div className="auth-card animate-fade-up">
        <div className="auth-card__header">
          <Link to="/" className="auth-card__logo">TOTAL<span>FITNESS</span></Link>
          <h1 className="auth-card__title">Registro</h1>
          <p className="auth-card__sub">Crea tu cuenta y empieza hoy</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
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

          <div className="form-group">
            <label className="form-label">Contraseña</label>
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
            {loading ? <span className="spinner" /> : 'Crear cuenta'}
          </button>
        </form>

        <p className="auth-footer">
          ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
        </p>
      </div>
    </div>
  )
}
