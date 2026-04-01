import { createContext, useContext, useEffect, useState } from 'react'
import { getSiteConfig } from '../lib/supabase'

// ── Defaults (used while loading or if Supabase table is not yet seeded) ──────
export const CONFIG_DEFAULTS = {
  section_promos:       'true',
  section_features:     'true',
  section_pricing:      'true',
  section_classes:      'true',
  section_testimonials: 'true',
  section_cta:          'true',
  section_map:          'true',
  hero_eyebrow:         'El gimnasio que te transforma',
  hero_title:           'ENTRENA.\nSUPÉRATE.\nSIN LÍMITES.',
  hero_desc:            'Instalaciones premium, entrenadores de élite y tecnología de punta. Tu mejor versión comienza hoy.',
  cta_title:            '¿Listo para empezar?',
  cta_subtitle:         'Únete hoy y transforma tu cuerpo y tu mente. Sin excusas.',
}

const SiteConfigContext = createContext({
  config: CONFIG_DEFAULTS,
  loading: true,
  reload: () => {},
})

export function SiteConfigProvider({ children }) {
  const [config, setConfig]   = useState(CONFIG_DEFAULTS)
  const [loading, setLoading] = useState(true)

  const load = async () => {
    try {
      const data = await getSiteConfig()
      setConfig({ ...CONFIG_DEFAULTS, ...data })
    } catch {
      // silently fall back to defaults — site still works
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  return (
    <SiteConfigContext.Provider value={{ config, loading, reload: load }}>
      {children}
    </SiteConfigContext.Provider>
  )
}

export const useSiteConfig = () => useContext(SiteConfigContext)

// Helper: returns true unless explicitly set to 'false'
export const isVisible = (config, key) => config[key] !== 'false'
