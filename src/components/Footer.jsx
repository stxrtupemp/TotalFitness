import { useNavigate } from 'react-router-dom'
import { NEON, MUTED, TEXT, BORDER, useWidth, Icon } from './UI'

export default function Footer() {
  const navigate = useNavigate()
  const bp       = useWidth()
  const isMobile = bp === 'xs'

  return (
    <footer style={{ background: '#04060b', borderTop: `1px solid ${BORDER}`, padding: 'clamp(3rem,6vw,4rem) clamp(1.25rem,4vw,2rem) 2rem' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(2,1fr)', gap: '2.5rem', marginBottom: '2.5rem' }}>
          <div>
            <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '1.7rem', fontWeight: 800, marginBottom: '0.875rem' }}>
              <span style={{ color: NEON }}>TOTAL</span><span style={{ color: TEXT }}>FITNESS</span>
            </div>
            <p style={{ color: MUTED, fontSize: '0.85rem', lineHeight: 1.7, fontFamily: "'Inter', sans-serif", maxWidth: '260px' }}>El gimnasio más tecnológico de Pilar de la Horadada. Energía, rendimiento y resultados reales.</p>
            <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {[
                { icon: 'pin',   text: 'C/ Fitness 42, Pilar de la Horadada' },
                { icon: 'phone', text: '+34 966 123 456' },
                { icon: 'mail',  text: 'info@totalfitness.es' },
              ].map(({ icon, text }) => (
                <div key={text} style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <Icon name={icon} size={14} color={NEON} />
                  <span style={{ color: MUTED, fontSize: '0.8rem', fontFamily: "'Inter', sans-serif" }}>{text}</span>
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '1.5rem' }}>
            {[
              { title: 'Navegación', links: [['Inicio', '/'], ['Precios', '/pricing'], ['Clases', '/schedule']] },
              { title: 'Cuenta',     links: [['Entrar', '/login'], ['Registrarse', '/register'], ['Dashboard', '/dashboard']] },
              { title: 'Legal',      links: [['Privacidad', null], ['Términos', null], ['Cookies', null]] },
            ].map(col => (
              <div key={col.title}>
                <div style={{ color: TEXT, fontFamily: "'Inter', sans-serif", fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.875rem' }}>{col.title}</div>
                {col.links.map(([label, path]) => (
                  <div key={label} onClick={() => path && navigate(path)} style={{ color: MUTED, fontSize: '0.85rem', fontFamily: "'Inter', sans-serif", marginBottom: '0.55rem', cursor: path ? 'pointer' : 'default', transition: 'color 0.2s' }}
                    onMouseEnter={e => { if (path) e.currentTarget.style.color = TEXT }}
                    onMouseLeave={e => e.currentTarget.style.color = MUTED}
                  >{label}</div>
                ))}
              </div>
            ))}
          </div>
        </div>

        <div style={{ borderTop: `1px solid ${BORDER}`, paddingTop: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
          <span style={{ color: MUTED, fontSize: '0.75rem', fontFamily: "'Inter', sans-serif" }}>© 2026 TotalFitness · Pilar de la Horadada, Alicante</span>
          <span style={{ color: `${NEON}88`, fontSize: '0.72rem', fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: '0.12em' }}>ENERGÍA · TECNOLOGÍA · RENDIMIENTO</span>
        </div>
      </div>
    </footer>
  )
}
