import { useState, useEffect } from 'react'

// ── Design tokens ─────────────────────────────────────────────────────────────
export const NEON    = '#c2ff00'
export const CYAN    = '#00e5ff'
export const BG      = '#07090f'
export const SURFACE = 'rgba(255,255,255,0.04)'
export const BORDER  = 'rgba(255,255,255,0.08)'
export const TEXT    = '#e8eaf2'
export const MUTED   = 'rgba(232,234,242,0.45)'

// ── Responsive breakpoint hook ────────────────────────────────────────────────
export function useWidth() {
  const [w, setW] = useState(window.innerWidth)
  useEffect(() => {
    const fn = () => setW(window.innerWidth)
    window.addEventListener('resize', fn)
    return () => window.removeEventListener('resize', fn)
  }, [])
  if (w < 640)  return 'xs'
  if (w < 1024) return 'sm'
  return 'lg'
}

// ── Icon ──────────────────────────────────────────────────────────────────────
export function Icon({ name, size = 20, color = MUTED, filled = false, style: s }) {
  const paths = {
    zap:    'M13 2L3 14h9l-1 8 10-12h-9l1-8z',
    target: 'M12 2a10 10 0 100 20A10 10 0 0012 2zm0 4a6 6 0 110 12A6 6 0 0112 6zm0 4a2 2 0 100 4 2 2 0 000-4z',
    flame:  'M8.5 14.5A2.5 2.5 0 0011 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 01-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 002.5 2.5z',
    mobile: 'M5 2h14a2 2 0 012 2v16a2 2 0 01-2 2H5a2 2 0 01-2-2V4a2 2 0 012-2zm7 17a1 1 0 100-2 1 1 0 000 2z',
    waves:  'M2 12c.5-3 3-5 6-5s5.5 2 6 5c.5-3 3-5 6-5M2 19c.5-3 3-5 6-5s5.5 2 6 5',
    moon:   'M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z',
    chart:  'M18 20V10M12 20V4M6 20v-6',
    users:  'M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8zm11 0a4 4 0 10-8 0M23 21v-2a4 4 0 00-3-3.87',
    pin:    'M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5A2.5 2.5 0 1112 6a2.5 2.5 0 010 5z',
    clock:  'M12 2a10 10 0 100 20A10 10 0 0012 2zm.5 5v5.25l4.5 2.67-.75 1.23L11 13V7h1.5z',
    phone:  'M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81 19.79 19.79 0 01.02 1.17 2 2 0 012 .02h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z',
    mail:   'M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2zm16 2L12 13 4 6',
    check:  'M20 6L9 17l-5-5',
    x:      'M18 6L6 18M6 6l12 12',
    menu:   'M3 12h18M3 6h18M3 18h18',
    lock:   'M19 11H5a2 2 0 00-2 2v7a2 2 0 002 2h14a2 2 0 002-2v-7a2 2 0 00-2-2zM7 11V7a5 5 0 0110 0v4',
    star:   'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z',
    award:  'M12 2a5 5 0 110 10A5 5 0 0112 2zM8.21 13.89L7 23l5-3 5 3-1.21-9.12',
    edit:   'M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z',
    trash:  'M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6',
    save:   'M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2zM17 21v-8H7v8M7 3v5h8',
    key:    'M21 2l-2 2m-7.61 7.61a5.5 5.5 0 11-7.778 7.778 5.5 5.5 0 017.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4',
    refresh:'M23 4v6h-6M1 20v-6h6M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15',
  }
  const d = paths[name] || paths.zap
  return (
    <svg width={size} height={size} viewBox="0 0 24 24"
      fill={filled ? color : 'none'}
      stroke={color} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"
      style={{ flexShrink: 0, ...s }}>
      <path d={d} />
    </svg>
  )
}

// ── NeonButton ────────────────────────────────────────────────────────────────
export function NeonButton({ children, onClick, small, outline, fullWidth, disabled, loading, cyan, type = 'button' }) {
  const [hov, setHov] = useState(false)
  const color = cyan ? CYAN : NEON
  return (
    <button type={type} onClick={disabled ? undefined : onClick}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '0.45rem',
        padding: small ? '0.45rem 1.1rem' : '0.85rem 2rem',
        fontFamily: "'Barlow Condensed', sans-serif",
        fontSize: small ? '0.84rem' : '1rem',
        fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase',
        border: `1.5px solid ${color}`, borderRadius: '4px',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        width: fullWidth ? '100%' : 'auto',
        background: outline ? (hov ? `${color}18` : 'transparent') : (hov ? color : `${color}14`),
        color: (hov && !outline) ? BG : color,
        boxShadow: hov ? `0 0 18px ${color}50, 0 0 36px ${color}20` : 'none',
        transition: 'all 0.22s ease',
      }}>{loading ? 'Cargando...' : children}</button>
  )
}

// ── GhostButton ───────────────────────────────────────────────────────────────
export function GhostButton({ children, onClick, small, fullWidth, type = 'button' }) {
  const [hov, setHov] = useState(false)
  return (
    <button type={type} onClick={onClick} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        background: hov ? 'rgba(255,255,255,0.06)' : 'transparent',
        border: `1px solid ${BORDER}`, borderRadius: '4px',
        color: hov ? TEXT : MUTED,
        padding: small ? '0.4rem 1rem' : '0.82rem 1.8rem',
        fontFamily: "'Inter', sans-serif",
        fontSize: small ? '0.8rem' : '0.88rem',
        fontWeight: 500, letterSpacing: '0.04em',
        cursor: 'pointer', transition: 'all 0.2s',
        width: fullWidth ? '100%' : 'auto',
      }}>{children}</button>
  )
}

// ── GlassCard ─────────────────────────────────────────────────────────────────
export function GlassCard({ children, style: extra, glow, onClick }) {
  const [hov, setHov] = useState(false)
  const gc = glow === 'cyan' ? CYAN : NEON
  return (
    <div onClick={onClick}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        background: SURFACE, borderRadius: '12px', padding: '2rem',
        border: `1px solid ${hov && glow ? gc + '50' : BORDER}`,
        backdropFilter: 'blur(10px)',
        boxShadow: hov && glow ? `0 0 28px ${gc}18` : 'none',
        transition: 'all 0.28s ease',
        cursor: onClick ? 'pointer' : 'default',
        ...extra,
      }}>{children}</div>
  )
}

// ── Badge ─────────────────────────────────────────────────────────────────────
export function Badge({ children, color }) {
  const c = color === 'green' ? '#00ff88' : color === 'red' ? '#ff4466' : color === 'cyan' ? CYAN : NEON
  return (
    <span style={{ background: `${c}18`, color: c, border: `1px solid ${c}44`, borderRadius: '100px', padding: '0.2rem 0.7rem', fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', fontFamily: "'Inter', sans-serif", whiteSpace: 'nowrap' }}>{children}</span>
  )
}

// ── StatCard ──────────────────────────────────────────────────────────────────
export function StatCard({ label, value, sub, color }) {
  const c = color || NEON
  return (
    <GlassCard glow style={{ textAlign: 'center', padding: '1.5rem' }}>
      <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 'clamp(1.8rem,4vw,2.6rem)', fontWeight: 800, color: c, lineHeight: 1 }}>{value}</div>
      <div style={{ color: TEXT, fontFamily: "'Inter', sans-serif", fontWeight: 600, fontSize: '0.82rem', marginTop: '0.4rem' }}>{label}</div>
      {sub && <div style={{ color: MUTED, fontSize: '0.72rem', marginTop: '0.2rem' }}>{sub}</div>}
    </GlassCard>
  )
}

// ── Input ─────────────────────────────────────────────────────────────────────
export function Input({ label, type = 'text', value, onChange, placeholder, required }) {
  const [focused, setFocused] = useState(false)
  return (
    <div style={{ marginBottom: '1.1rem' }}>
      {label && <label style={{ display: 'block', color: MUTED, fontSize: '0.72rem', fontWeight: 600, letterSpacing: '0.07em', textTransform: 'uppercase', marginBottom: '0.45rem', fontFamily: "'Inter', sans-serif" }}>{label}</label>}
      <input type={type} value={value} onChange={onChange} placeholder={placeholder} required={required}
        onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
        style={{ width: '100%', boxSizing: 'border-box', background: 'rgba(255,255,255,0.04)', border: `1px solid ${focused ? NEON + '80' : BORDER}`, borderRadius: '6px', padding: '0.8rem 1rem', color: TEXT, fontFamily: "'Inter', sans-serif", fontSize: '0.9rem', outline: 'none', boxShadow: focused ? `0 0 10px ${NEON}18` : 'none', transition: 'all 0.2s' }} />
    </div>
  )
}

// ── Modal ─────────────────────────────────────────────────────────────────────
export function Modal({ open, onClose, children, title, width }) {
  if (!open) return null
  return (
    <div onClick={e => e.target === e.currentTarget && onClose()} style={{ position: 'fixed', inset: 0, zIndex: 2000, background: 'rgba(7,9,15,0.88)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
      <div style={{ background: '#0d1219', border: `1px solid ${NEON}30`, borderRadius: '16px', padding: 'clamp(1.5rem,4vw,2.5rem)', width: width || '480px', maxWidth: '100%', maxHeight: '90vh', overflowY: 'auto', boxShadow: `0 0 60px ${NEON}12, 0 40px 80px rgba(0,0,0,0.6)`, position: 'relative' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
          <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '1.45rem', fontWeight: 800, color: TEXT, letterSpacing: '0.03em' }}>{title}</div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: MUTED, cursor: 'pointer', padding: '0.15rem', marginLeft: '1rem', display: 'flex' }}>
            <Icon name="x" size={18} color={MUTED} />
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}

// ── SectionHeader ─────────────────────────────────────────────────────────────
export function SectionHeader({ tag, title, sub, center }) {
  return (
    <div style={{ textAlign: center ? 'center' : 'left', marginBottom: 'clamp(2rem,4vw,3rem)' }}>
      {tag && <div style={{ color: NEON, fontFamily: "'Barlow Condensed', sans-serif", fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>{tag}</div>}
      <h2 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 'clamp(1.75rem,4vw,3rem)', fontWeight: 800, color: TEXT, margin: '0 0 1rem', lineHeight: 1.1 }}>{title}</h2>
      {sub && <p style={{ color: MUTED, fontSize: 'clamp(0.875rem,2vw,1rem)', maxWidth: '540px', margin: center ? '0 auto' : '0', lineHeight: 1.65, fontFamily: "'Inter', sans-serif" }}>{sub}</p>}
    </div>
  )
}
