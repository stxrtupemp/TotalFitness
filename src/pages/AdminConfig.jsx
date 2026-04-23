import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { setSiteConfig, setSiteConfigBatch } from '../lib/supabase'
import { useSiteConfig, isVisible, CONFIG_DEFAULTS } from '../context/SiteConfigContext'
import Footer from '../components/Footer'
import {
  NEON, BG, SURFACE, BORDER, TEXT, MUTED,
  useWidth, NeonButton, GhostButton, GlassCard, Badge,
} from '../components/UI'

const SECTIONS = [
  { key: 'section_features',     label: 'Beneficios del gimnasio',  desc: 'Grid de características principales' },
  { key: 'section_pricing',      label: 'Planes y precios',          desc: 'Comparativa de planes disponibles' },
  { key: 'section_classes',      label: 'Horario de clases',         desc: 'Calendario semanal de sesiones' },
  { key: 'section_testimonials', label: 'Testimonios',               desc: 'Reseñas de miembros reales' },
  { key: 'section_map',          label: 'Mapa / Ubicación',          desc: 'Ubicación y datos de contacto' },
  { key: 'section_cta',          label: 'CTA final',                  desc: 'Llamada a la acción (solo visitantes)' },
]

const TEXT_FIELDS = [
  { key: 'hero_title',   label: 'Hero — título principal',  rows: 3 },
  { key: 'hero_desc',    label: 'Hero — descripción',       rows: 2 },
  { key: 'cta_title',    label: 'CTA — título',             rows: 1 },
  { key: 'cta_subtitle', label: 'CTA — subtítulo',          rows: 1 },
]

export default function AdminConfig() {
  const navigate          = useNavigate()
  const { config, reload }= useSiteConfig()
  const bp                = useWidth()
  const isMobile          = bp === 'xs'

  const [toggling, setToggling] = useState(null)
  const [texts,    setTexts]    = useState({})
  const [saving,   setSaving]   = useState(false)
  const [toast,    setToast]    = useState(null)

  useEffect(() => {
    const init = {}
    TEXT_FIELDS.forEach(f => { init[f.key] = config[f.key] ?? '' })
    setTexts(init)
  }, [config])

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3200)
  }

  const handleToggle = async (key) => {
    const next = isVisible(config, key) ? 'false' : 'true'
    setToggling(key)
    try {
      await setSiteConfig(key, next)
      await reload()
      showToast(`Sección ${next === 'true' ? 'visible' : 'oculta'}.`)
    } catch {
      showToast('Error al guardar.', 'error')
    } finally {
      setToggling(null)
    }
  }

  const handleSaveTexts = async () => {
    setSaving(true)
    try {
      await setSiteConfigBatch(texts)
      await reload()
      showToast('Textos guardados correctamente.')
    } catch {
      showToast('Error al guardar los textos.', 'error')
    } finally {
      setSaving(false)
    }
  }

  const Block = ({ title, children }) => (
    <GlassCard style={{ padding: 'clamp(1.25rem,3vw,2rem)', marginBottom: '1.25rem' }}>
      <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: NEON, marginBottom: '1.25rem' }}>{title}</div>
      {children}
    </GlassCard>
  )

  const ToggleRow = ({ label, desc, k }) => {
    const on = isVisible(config, k)
    return (
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', gap: '1rem' }}>
        <div>
          <div style={{ color: TEXT, fontFamily: "'Inter', sans-serif", fontSize: '0.875rem', fontWeight: 500 }}>{label}</div>
          {desc && <div style={{ color: MUTED, fontSize: '0.75rem', fontFamily: "'Inter', sans-serif", marginTop: '0.1rem' }}>{desc}</div>}
        </div>
        <div onClick={() => !toggling && handleToggle(k)} style={{ width: '42px', height: '22px', borderRadius: '100px', background: on ? `${NEON}28` : BORDER, border: `1px solid ${on ? NEON + '50' : BORDER}`, cursor: toggling ? 'wait' : 'pointer', position: 'relative', transition: 'all 0.3s', flexShrink: 0 }}>
          <div style={{ position: 'absolute', top: '3px', left: on ? '21px' : '3px', width: '14px', height: '14px', borderRadius: '50%', background: on ? NEON : MUTED, transition: 'all 0.3s' }} />
        </div>
      </div>
    )
  }

  const FieldRow = ({ label, k, rows }) => (
    <div style={{ marginBottom: '1.1rem' }}>
      <label style={{ display: 'block', color: MUTED, fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.07em', textTransform: 'uppercase', marginBottom: '0.4rem', fontFamily: "'Inter', sans-serif" }}>{label}</label>
      {rows > 1
        ? <textarea value={texts[k] || ''} onChange={e => setTexts(p => ({ ...p, [k]: e.target.value }))} rows={rows}
            style={{ width: '100%', boxSizing: 'border-box', background: 'rgba(255,255,255,0.04)', border: `1px solid ${BORDER}`, borderRadius: '6px', padding: '0.75rem 0.875rem', color: TEXT, fontFamily: "'Inter', sans-serif", fontSize: '0.875rem', outline: 'none', resize: 'vertical' }} />
        : <input type="text" value={texts[k] || ''} onChange={e => setTexts(p => ({ ...p, [k]: e.target.value }))}
            style={{ width: '100%', boxSizing: 'border-box', background: 'rgba(255,255,255,0.04)', border: `1px solid ${BORDER}`, borderRadius: '6px', padding: '0.75rem 0.875rem', color: TEXT, fontFamily: "'Inter', sans-serif", fontSize: '0.875rem', outline: 'none' }} />
      }
    </div>
  )

  return (
    <div style={{ background: BG, minHeight: '100vh', paddingTop: '64px', color: TEXT }}>
      {toast && (
        <div style={{ position: 'fixed', top: '80px', left: '50%', transform: 'translateX(-50%)', zIndex: 3000, background: toast.type === 'error' ? '#ff446618' : `${NEON}18`, border: `1px solid ${toast.type === 'error' ? '#ff446640' : NEON + '40'}`, color: toast.type === 'error' ? '#ff4466' : NEON, padding: '0.75rem 1.5rem', borderRadius: '8px', fontFamily: "'Inter', sans-serif", fontSize: '0.875rem', backdropFilter: 'blur(10px)', whiteSpace: 'nowrap' }}>
          {toast.msg}
        </div>
      )}

      <div style={{ maxWidth: '900px', margin: '0 auto', padding: 'clamp(1.5rem,4vw,3rem) clamp(1.25rem,4vw,2rem)' }}>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: isMobile ? 'flex-start' : 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
          <div>
            <div style={{ color: MUTED, fontFamily: "'Inter', sans-serif", fontSize: '0.75rem', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '0.25rem' }}>Configuración web</div>
            <h1 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 'clamp(1.75rem,5vw,2.5rem)', fontWeight: 900, color: TEXT, margin: 0 }}>Admin <span style={{ color: NEON }}>Config</span></h1>
          </div>
          <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center', flexWrap: 'wrap' }}>
            <GhostButton small onClick={() => navigate('/admin')}>← Volver</GhostButton>
          </div>
        </div>

        <Block title="Secciones visibles">
          {SECTIONS.map(({ key, label, desc }) => (
            <ToggleRow key={key} label={label} desc={desc} k={key} />
          ))}
        </Block>

        <Block title="Textos del hero y CTA">
          {TEXT_FIELDS.map(({ key, label, rows }) => (
            <FieldRow key={key} label={label} k={key} rows={rows} />
          ))}
          <div style={{ display: 'flex', gap: '0.875rem', justifyContent: 'flex-end', flexWrap: 'wrap', marginTop: '0.5rem' }}>
            <GhostButton onClick={() => {
              const defaults = {}
              TEXT_FIELDS.forEach(f => { defaults[f.key] = CONFIG_DEFAULTS[f.key] })
              setTexts(defaults)
            }}>Restaurar</GhostButton>
            <NeonButton onClick={handleSaveTexts} loading={saving}>{saving ? 'Guardando...' : 'Guardar textos'}</NeonButton>
          </div>
        </Block>

      </div>

      <Footer />
    </div>
  )
}
