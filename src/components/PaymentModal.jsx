import { useState } from 'react'
import { NEON, CYAN, BG, MUTED, TEXT, BORDER, Input, Modal, NeonButton, Icon } from './UI'

export default function PaymentModal({ open, onClose, plan, onSuccess }) {
  const [step, setStep]     = useState(1)
  const [cardNum, setCardNum] = useState('')
  const [expiry, setExpiry]   = useState('')
  const [cvv, setCvv]         = useState('')
  const [name, setName]       = useState('')
  const [loading, setLoading] = useState(false)

  const price = plan === 'annual' ? '19.99' : '29.99'
  const label = plan === 'annual' ? 'Plan Anual' : 'Plan Mensual'

  const fmtCard   = v => v.replace(/\D/g,'').slice(0,16).replace(/(.{4})/g,'$1 ').trim()
  const fmtExpiry = v => { const d = v.replace(/\D/g,'').slice(0,4); return d.length > 2 ? d.slice(0,2)+'/'+d.slice(2) : d }

  const pay = () => {
    setLoading(true)
    setTimeout(() => { setLoading(false); setStep(2) }, 1800)
  }

  const done = () => {
    onSuccess(plan)
    onClose()
    setStep(1)
    setCardNum(''); setExpiry(''); setCvv(''); setName('')
  }

  const valid = name && cardNum.length >= 19 && expiry.length >= 5 && cvv.length >= 3

  return (
    <Modal open={open} onClose={() => { onClose(); setStep(1) }} title={step === 2 ? 'Bienvenido a la élite' : `Activar ${label}`}>
      {step === 1 ? (
        <>
          <div style={{ background: `${NEON}0e`, border: `1px solid ${NEON}30`, borderRadius: '8px', padding: '1rem 1.25rem', marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ color: TEXT, fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: '1rem', letterSpacing: '0.05em' }}>{label.toUpperCase()}</div>
              {plan === 'annual' && <div style={{ color: MUTED, fontSize: '0.72rem', fontFamily: "'Inter', sans-serif", marginTop: '0.2rem' }}>Facturado anualmente · Ahorra 120€</div>}
            </div>
            <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '1.75rem', fontWeight: 800, color: NEON }}>{price}<span style={{ fontSize: '0.85rem', color: MUTED }}> €/mes</span></div>
          </div>
          <Input label="Titular de la tarjeta" value={name} onChange={e => setName(e.target.value)} placeholder="Nombre completo" />
          <Input label="Número de tarjeta" value={cardNum} onChange={e => setCardNum(fmtCard(e.target.value))} placeholder="1234 5678 9012 3456" />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <Input label="Caducidad" value={expiry} onChange={e => setExpiry(fmtExpiry(e.target.value))} placeholder="MM/AA" />
            <Input label="CVV" value={cvv} onChange={e => setCvv(e.target.value.replace(/\D/g,'').slice(0,3))} placeholder="123" />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: '0.5rem 0 1.5rem', color: MUTED, fontSize: '0.72rem', fontFamily: "'Inter', sans-serif" }}>
            <Icon name="lock" size={12} color={MUTED} />
            Pago 100% seguro · SSL · Cancela cuando quieras
          </div>
          <NeonButton fullWidth onClick={pay} loading={loading} disabled={!valid}>
            {loading ? 'Procesando...' : `Pagar ${price} €/mes`}
          </NeonButton>
        </>
      ) : (
        <div style={{ textAlign: 'center', padding: '1rem 0' }}>
          <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: `${NEON}15`, border: `1px solid ${NEON}44`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
            <Icon name="check" size={28} color={NEON} />
          </div>
          <p style={{ color: MUTED, fontFamily: "'Inter', sans-serif", marginBottom: '2rem', lineHeight: 1.6, fontSize: '0.9rem' }}>
            Tu suscripción <strong style={{ color: NEON }}>{label}</strong> está activa. Accede a todas las instalaciones y beneficios exclusivos.
          </p>
          <NeonButton fullWidth onClick={done}>Ir a mi dashboard</NeonButton>
        </div>
      )}
    </Modal>
  )
}
