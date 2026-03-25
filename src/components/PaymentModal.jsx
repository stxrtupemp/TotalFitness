import { useState } from 'react'
import './PaymentModal.css'

const PLANS = [
  { id: 'monthly', label: 'Mensual', price: '29.99', period: 'mes', features: ['Acceso completo', 'Clases grupales', 'App móvil'] },
  { id: 'annual',  label: 'Anual',   price: '19.99', period: 'mes', badge: 'AHORRA 33%', features: ['Todo lo del mensual', 'Nutricionista', 'Análisis corporal', 'Prioridad reservas'] },
]

export default function PaymentModal({ onClose, onSuccess }) {
  const [plan, setPlan]       = useState('monthly')
  const [step, setStep]       = useState('plan') // plan | payment | processing | done
  const [card, setCard]       = useState({ number: '', expiry: '', cvv: '', name: '' })
  const [errors, setErrors]   = useState({})

  const validate = () => {
    const e = {}
    if (card.number.replace(/\s/g, '').length !== 16) e.number  = 'Número inválido'
    if (!/^\d{2}\/\d{2}$/.test(card.expiry))          e.expiry  = 'Formato MM/AA'
    if (card.cvv.length < 3)                           e.cvv     = 'CVV inválido'
    if (!card.name.trim())                             e.name    = 'Introduce tu nombre'
    return e
  }

  const handlePay = () => {
    const e = validate()
    if (Object.keys(e).length) { setErrors(e); return }
    setStep('processing')
    setTimeout(() => { setStep('done') }, 2200)
  }

  const formatCard = (v) =>
    v.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim()

  const formatExpiry = (v) => {
    const d = v.replace(/\D/g, '').slice(0, 4)
    return d.length >= 3 ? `${d.slice(0, 2)}/${d.slice(2)}` : d
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <button className="modal__close" onClick={onClose}>✕</button>

        {/* ── Plan selection ── */}
        {step === 'plan' && (
          <>
            <h2 className="modal__title">Elige tu plan</h2>
            <div className="modal__plans">
              {PLANS.map(p => (
                <button
                  key={p.id}
                  className={`plan-card ${plan === p.id ? 'plan-card--active' : ''}`}
                  onClick={() => setPlan(p.id)}
                >
                  {p.badge && <span className="plan-card__badge">{p.badge}</span>}
                  <div className="plan-card__label">{p.label}</div>
                  <div className="plan-card__price">
                    <span className="plan-card__amount">{p.price}€</span>
                    <span className="plan-card__period">/{p.period}</span>
                  </div>
                  <ul className="plan-card__features">
                    {p.features.map(f => <li key={f}>✓ {f}</li>)}
                  </ul>
                </button>
              ))}
            </div>
            <button className="btn btn-primary" style={{ width: '100%', marginTop: '1.5rem' }} onClick={() => setStep('payment')}>
              Continuar →
            </button>
          </>
        )}

        {/* ── Payment form ── */}
        {step === 'payment' && (
          <>
            <h2 className="modal__title">Datos de pago</h2>
            <p className="modal__subtitle">Simulación — no se realizan cargos reales</p>

            <div className="payment-form">
              <div className="form-group">
                <label className="form-label">Titular</label>
                <input className={`form-input ${errors.name ? 'form-input--error' : ''}`}
                  placeholder="Nombre Apellido"
                  value={card.name}
                  onChange={e => { setCard(c => ({ ...c, name: e.target.value })); setErrors(er => ({ ...er, name: '' })) }}
                />
                {errors.name && <span className="form-error">{errors.name}</span>}
              </div>

              <div className="form-group">
                <label className="form-label">Número de tarjeta</label>
                <input className={`form-input ${errors.number ? 'form-input--error' : ''}`}
                  placeholder="1234 5678 9012 3456"
                  value={card.number}
                  onChange={e => { setCard(c => ({ ...c, number: formatCard(e.target.value) })); setErrors(er => ({ ...er, number: '' })) }}
                />
                {errors.number && <span className="form-error">{errors.number}</span>}
              </div>

              <div className="payment-form__row">
                <div className="form-group">
                  <label className="form-label">Caducidad</label>
                  <input className={`form-input ${errors.expiry ? 'form-input--error' : ''}`}
                    placeholder="MM/AA"
                    value={card.expiry}
                    onChange={e => { setCard(c => ({ ...c, expiry: formatExpiry(e.target.value) })); setErrors(er => ({ ...er, expiry: '' })) }}
                  />
                  {errors.expiry && <span className="form-error">{errors.expiry}</span>}
                </div>
                <div className="form-group">
                  <label className="form-label">CVV</label>
                  <input className={`form-input ${errors.cvv ? 'form-input--error' : ''}`}
                    placeholder="123"
                    maxLength={4}
                    value={card.cvv}
                    onChange={e => { setCard(c => ({ ...c, cvv: e.target.value.replace(/\D/g, '') })); setErrors(er => ({ ...er, cvv: '' })) }}
                  />
                  {errors.cvv && <span className="form-error">{errors.cvv}</span>}
                </div>
              </div>

              <div className="payment-actions">
                <button className="btn btn-ghost" onClick={() => setStep('plan')}>← Volver</button>
                <button className="btn btn-primary" onClick={handlePay}>
                  Pagar {plan === 'monthly' ? '29.99€' : '239.88€'}
                </button>
              </div>
            </div>
          </>
        )}

        {/* ── Processing ── */}
        {step === 'processing' && (
          <div className="modal__state">
            <div className="modal__spinner" />
            <p>Procesando pago...</p>
          </div>
        )}

        {/* ── Done ── */}
        {step === 'done' && (
          <div className="modal__state">
            <div className="modal__checkmark">✓</div>
            <h2>¡Suscripción activada!</h2>
            <p>Bienvenido/a a TotalFitness. Tu plan <strong>{plan === 'monthly' ? 'Mensual' : 'Anual'}</strong> ya está activo.</p>
            <button className="btn btn-primary" style={{ marginTop: '1.5rem' }} onClick={() => onSuccess(plan)}>
              Ir a mi cuenta
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
