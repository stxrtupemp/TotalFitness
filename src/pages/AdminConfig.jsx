import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { setSiteConfig, setSiteConfigBatch } from '../lib/supabase'
import { useSiteConfig, isVisible, CONFIG_DEFAULTS } from '../context/SiteConfigContext'
import Footer from '../components/Footer'
import './AdminConfig.css'

// ── Section toggle definitions ────────────────────────────────────────────────
const SECTIONS = [
  { key: 'section_promos',       label: 'Promociones',   desc: 'Tarjetas de ofertas y ventajas para miembros' },
  { key: 'section_features',     label: 'Características', desc: 'Grid de 6 puntos fuertes del gimnasio' },
  { key: 'section_pricing',      label: 'Precios',        desc: 'Comparativa de planes Mensual / Anual' },
  { key: 'section_classes',      label: 'Clases',         desc: 'Horario semanal de clases' },
  { key: 'section_testimonials', label: 'Testimonios',    desc: 'Reseñas de miembros reales' },
  { key: 'section_cta',          label: 'CTA final',      desc: 'Bloque de llamada a la acción (solo visitantes)' },
  { key: 'section_map',          label: 'Mapa y contacto', desc: 'Mapa de Google Maps y detalles de ubicación' },
]

// ── Text field definitions ────────────────────────────────────────────────────
const TEXT_FIELDS = [
  { key: 'hero_eyebrow', label: 'Hero — etiqueta superior', placeholder: CONFIG_DEFAULTS.hero_eyebrow, multiline: false },
  { key: 'hero_title',   label: 'Hero — título principal',  placeholder: CONFIG_DEFAULTS.hero_title,   multiline: true,  rows: 3 },
  { key: 'hero_desc',    label: 'Hero — descripción',       placeholder: CONFIG_DEFAULTS.hero_desc,    multiline: true,  rows: 2 },
  { key: 'cta_title',    label: 'CTA — título',             placeholder: CONFIG_DEFAULTS.cta_title,    multiline: false },
  { key: 'cta_subtitle', label: 'CTA — subtítulo',          placeholder: CONFIG_DEFAULTS.cta_subtitle, multiline: false },
]

// ── Component ─────────────────────────────────────────────────────────────────
export default function AdminConfig() {
  const { config, reload } = useSiteConfig()

  const [toggling, setToggling] = useState(null)   // key being toggled
  const [texts, setTexts]       = useState({})
  const [saving, setSaving]     = useState(false)
  const [toast, setToast]       = useState(null)

  // Populate text fields when config loads
  useEffect(() => {
    const initial = {}
    TEXT_FIELDS.forEach(f => { initial[f.key] = config[f.key] ?? '' })
    setTexts(initial)
  }, [config])

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3200)
  }

  // ── Toggle a section on/off ─────────────────────────────────────────────────
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

  // ── Save text batch ─────────────────────────────────────────────────────────
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

  const handleResetTexts = () => {
    const defaults = {}
    TEXT_FIELDS.forEach(f => { defaults[f.key] = CONFIG_DEFAULTS[f.key] })
    setTexts(defaults)
  }

  return (
    <div className="page admin-config">
      {toast && (
        <div className={`dash-toast dash-toast--${toast.type} animate-fade-up`}>
          {toast.msg}
        </div>
      )}

      <div className="container admin-config__inner">

        {/* ── Header ── */}
        <div className="admin-header animate-fade-up">
          <div>
            <span className="admin-header__eyebrow">Panel de administración</span>
            <h1 className="admin-header__title">Configuración del sitio</h1>
          </div>
          <Link to="/admin" className="btn btn-outline">← Volver al panel</Link>
        </div>

        {/* ── Section Visibility ── */}
        <section className="cfg-block animate-fade-up animate-fade-up-delay-1">
          <div className="cfg-block__head">
            <h2 className="cfg-block__title">Visibilidad de secciones</h2>
            <p className="cfg-block__desc">
              Activa o desactiva cada sección de la página de inicio. Los cambios se aplican al instante.
            </p>
          </div>

          <div className="cfg-toggles">
            {SECTIONS.map(s => {
              const visible = isVisible(config, s.key)
              const busy    = toggling === s.key
              return (
                <div key={s.key} className={`cfg-toggle-row ${!visible ? 'cfg-toggle-row--hidden' : ''}`}>
                  <div className="cfg-toggle-info">
                    <span className="cfg-toggle-label">{s.label}</span>
                    <span className="cfg-toggle-desc">{s.desc}</span>
                  </div>
                  <button
                    className={`cfg-toggle-btn ${visible ? 'cfg-toggle-btn--on' : 'cfg-toggle-btn--off'}`}
                    onClick={() => handleToggle(s.key)}
                    disabled={busy}
                    aria-label={`${visible ? 'Ocultar' : 'Mostrar'} ${s.label}`}
                  >
                    {busy ? (
                      <span className="spinner" style={{ width: 14, height: 14 }} />
                    ) : (
                      <>
                        <span className="cfg-toggle-knob" />
                        <span className="cfg-toggle-text">{visible ? 'Visible' : 'Oculto'}</span>
                      </>
                    )}
                  </button>
                </div>
              )
            })}
          </div>
        </section>

        {/* ── Text Content ── */}
        <section className="cfg-block animate-fade-up animate-fade-up-delay-2">
          <div className="cfg-block__head">
            <h2 className="cfg-block__title">Textos editables</h2>
            <p className="cfg-block__desc">
              Modifica los textos principales de la página de inicio. Guarda todos los cambios a la vez.
            </p>
          </div>

          <div className="cfg-text-grid">
            {TEXT_FIELDS.map(f => (
              <div key={f.key} className="form-group cfg-text-field">
                <label className="form-label">{f.label}</label>
                {f.multiline ? (
                  <textarea
                    className="form-input cfg-textarea"
                    rows={f.rows ?? 2}
                    placeholder={f.placeholder}
                    value={texts[f.key] ?? ''}
                    onChange={e => setTexts(t => ({ ...t, [f.key]: e.target.value }))}
                  />
                ) : (
                  <input
                    type="text"
                    className="form-input"
                    placeholder={f.placeholder}
                    value={texts[f.key] ?? ''}
                    onChange={e => setTexts(t => ({ ...t, [f.key]: e.target.value }))}
                  />
                )}
              </div>
            ))}
          </div>

          <div className="cfg-text-actions">
            <button className="btn btn-ghost" onClick={handleResetTexts}>
              Restablecer por defecto
            </button>
            <button className="btn btn-primary" onClick={handleSaveTexts} disabled={saving}>
              {saving ? <><span className="spinner" /> Guardando…</> : 'Guardar textos'}
            </button>
          </div>
        </section>

        {/* ── SQL hint (collapsed note) ── */}
        <details className="cfg-sql-hint animate-fade-up animate-fade-up-delay-3">
          <summary>Configuración inicial de Supabase (SQL)</summary>
          <pre>{`create table if not exists site_config (
  key   text primary key,
  value text not null default ''
);
alter table site_config enable row level security;
create policy "public read" on site_config for select using (true);
create policy "admin write" on site_config for all
  using (exists (
    select 1 from profiles where id = auth.uid() and role = 'admin'
  ));

-- Seed:
insert into site_config (key, value) values
  ('section_promos','true'),('section_features','true'),
  ('section_pricing','true'),('section_classes','true'),
  ('section_testimonials','true'),('section_cta','true'),
  ('section_map','true'),
  ('hero_eyebrow','El gimnasio que te transforma'),
  ('hero_title','ENTRENA.\\nSUPÉRATE.\\nSIN LÍMITES.'),
  ('hero_desc','Instalaciones premium, entrenadores de élite y tecnología de punta. Tu mejor versión comienza hoy.'),
  ('cta_title','¿Listo para empezar?'),
  ('cta_subtitle','Únete hoy y transforma tu cuerpo y tu mente. Sin excusas.')
on conflict (key) do nothing;`}</pre>
        </details>

      </div>

      <Footer />
    </div>
  )
}
