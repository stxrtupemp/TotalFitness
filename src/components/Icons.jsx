/**
 * TotalFitness — Custom SVG icon set.
 * All icons use currentColor so they inherit the CSS text colour.
 * Default size 20×20. Accept: size, className, style.
 */

const base = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.6,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
}

// ── Fitness ───────────────────────────────────────────────────────────────────

export function IconBarbell({ size = 20, className, style }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} style={style} {...base}>
      <line x1="7" y1="12" x2="17" y2="12" />
      <rect x="4" y="9.5" width="2" height="5" rx="0.5" />
      <rect x="2.5" y="10.5" width="1.5" height="3" rx="0.5" />
      <rect x="18" y="9.5" width="2" height="5" rx="0.5" />
      <rect x="20" y="10.5" width="1.5" height="3" rx="0.5" />
      <line x1="7"  y1="9"  x2="7"  y2="15" strokeWidth="2" />
      <line x1="17" y1="9"  x2="17" y2="15" strokeWidth="2" />
    </svg>
  )
}

/** Large barbell used for empty-state illustration */
export function IconDumbbell({ size = 24, className, style }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} style={style} {...base} strokeWidth="1.4">
      <line x1="7" y1="12" x2="17" y2="12" />
      <rect x="4" y="9.5" width="2" height="5" rx="0.5" />
      <rect x="2.5" y="10.5" width="1.5" height="3" rx="0.5" />
      <rect x="18" y="9.5" width="2" height="5" rx="0.5" />
      <rect x="20" y="10.5" width="1.5" height="3" rx="0.5" />
      <line x1="7"  y1="9"  x2="7"  y2="15" strokeWidth="2" />
      <line x1="17" y1="9"  x2="17" y2="15" strokeWidth="2" />
    </svg>
  )
}

export function IconBike({ size = 20, className, style }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} style={style} {...base}>
      <circle cx="6"  cy="15" r="4" />
      <circle cx="18" cy="15" r="4" />
      <path d="M6 15 L10 7 L14 7" />
      <path d="M10 7 L18 15" />
      <line x1="14" y1="7" x2="16" y2="7" />
      <line x1="15" y1="7" x2="15" y2="5" />
      <line x1="9"  y1="7" x2="12" y2="7" />
    </svg>
  )
}

export function IconFlex({ size = 20, className, style }) {
  // Stylised flexed arm silhouette
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} style={style} {...base}>
      <path d="M12 3c-2 0-4 1.5-4 4 0 1.5.8 2.8 2 3.5L8 14c-.5 1 0 2 1 2.5l3 1.5 3-1.5c1-.5 1.5-1.5 1-2.5l-2-3.5c1.2-.7 2-2 2-3.5 0-2.5-2-4-4-4z" />
      <path d="M9 19l1.5 2h3L15 19" />
    </svg>
  )
}

// ── People ────────────────────────────────────────────────────────────────────

export function IconUsers({ size = 20, className, style }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} style={style} {...base}>
      <circle cx="12" cy="8" r="3" />
      <path d="M6 20c0-3.314 2.686-6 6-6s6 2.686 6 6" />
      <circle cx="5" cy="9" r="2.2" />
      <path d="M1 20c0-2.5 1.79-4.5 4-4.5" />
      <circle cx="19" cy="9" r="2.2" />
      <path d="M23 20c0-2.5-1.79-4.5-4-4.5" />
    </svg>
  )
}

// ── Devices ───────────────────────────────────────────────────────────────────

export function IconPhone({ size = 20, className, style }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} style={style} {...base}>
      <rect x="6" y="2" width="12" height="20" rx="2" />
      <line x1="12" y1="18" x2="12" y2="18" strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  )
}

// ── Nutrition ─────────────────────────────────────────────────────────────────

export function IconLeaf({ size = 20, className, style }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} style={style} {...base}>
      <path d="M12 3C6 3 3 8 3 13c0 4 3 7 7 7 5 0 9-4 9-9C19 5 15 3 12 3z" />
      <path d="M12 3c0 6-4 11-4 11" strokeWidth="1.2" />
      <line x1="8" y1="20" x2="12" y2="3" strokeWidth="1.2" />
    </svg>
  )
}

// ── Data / Analytics ──────────────────────────────────────────────────────────

export function IconChart({ size = 20, className, style }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} style={style} {...base}>
      <polyline points="3,3 3,20 21,20" />
      <rect x="6"  y="13" width="3" height="7" rx="0.5" />
      <rect x="11" y="8"  width="3" height="12" rx="0.5" />
      <rect x="16" y="4"  width="3" height="16" rx="0.5" />
    </svg>
  )
}

// ── Time ──────────────────────────────────────────────────────────────────────

export function IconClock({ size = 20, className, style }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} style={style} {...base}>
      <circle cx="12" cy="12" r="9" />
      <polyline points="12,7 12,12 15.5,14.5" />
    </svg>
  )
}

// ── Awards ────────────────────────────────────────────────────────────────────

export function IconTrophy({ size = 20, className, style }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} style={style} {...base}>
      <path d="M6 9H4a2 2 0 01-2-2V5h4" />
      <path d="M18 9h2a2 2 0 002-2V5h-4" />
      <rect x="6" y="2" width="12" height="12" rx="2" />
      <path d="M9 14c0 2 1 3 3 3s3-1 3-3" />
      <line x1="12" y1="17" x2="12" y2="20" />
      <line x1="8"  y1="20" x2="16" y2="20" />
    </svg>
  )
}

export function IconStar({ size = 16, className, style, filled = true }) {
  return (
    <svg
      width={size} height={size} viewBox="0 0 24 24"
      className={className} style={style}
      fill={filled ? 'currentColor' : 'none'}
      stroke="currentColor"
      strokeWidth={filled ? 0 : 1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
    </svg>
  )
}

// ── Power / Energy ────────────────────────────────────────────────────────────

export function IconBolt({ size = 20, className, style }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} style={style} {...base}>
      <polygon points="13,2 3,14 12,14 11,22 21,10 12,10" />
    </svg>
  )
}

// ── Location ──────────────────────────────────────────────────────────────────

export function IconPin({ size = 20, className, style }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} style={style} {...base}>
      <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0118 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  )
}

// ── Communication ─────────────────────────────────────────────────────────────

export function IconCall({ size = 20, className, style }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} style={style} {...base}>
      <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.37 9.8a19.79 19.79 0 01-3.07-8.67A2 2 0 012.28 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L6.91 9.91a16 16 0 006.18 6.18l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" />
    </svg>
  )
}

export function IconMail({ size = 20, className, style }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} style={style} {...base}>
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <polyline points="2,4 12,13 22,4" />
    </svg>
  )
}

// ── Transport ─────────────────────────────────────────────────────────────────

export function IconCar({ size = 20, className, style }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} style={style} {...base}>
      <path d="M5 11L6.5 6.5A2 2 0 018.4 5h7.2a2 2 0 011.9 1.5L19 11" />
      <rect x="2" y="11" width="20" height="7" rx="2" />
      <circle cx="7"  cy="18" r="2" />
      <circle cx="17" cy="18" r="2" />
      <line x1="9"  y1="18" x2="15" y2="18" />
    </svg>
  )
}

// ── UI Actions ────────────────────────────────────────────────────────────────

export function IconCheck({ size = 16, className, style }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} style={style} {...base} strokeWidth={2.2}>
      <polyline points="4,12 9,17 20,7" />
    </svg>
  )
}

export function IconLock({ size = 16, className, style }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} style={style} {...base}>
      <rect x="5" y="11" width="14" height="10" rx="2" />
      <path d="M8 11V7a4 4 0 018 0v4" />
    </svg>
  )
}

export function IconClose({ size = 16, className, style }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} style={style} {...base} strokeWidth={2}>
      <line x1="18" y1="6"  x2="6"  y2="18" />
      <line x1="6"  y1="6"  x2="18" y2="18" />
    </svg>
  )
}

export function IconRefresh({ size = 16, className, style }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} style={style} {...base}>
      <polyline points="23,4 23,11 16,11" />
      <polyline points="1,20 1,13 8,13" />
      <path d="M3.51 9a9 9 0 0114.85-3.36L23 11M1 13l4.64 5.36A9 9 0 0020.49 15" />
    </svg>
  )
}

export function IconShield({ size = 16, className, style }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} style={style} {...base}>
      <path d="M12 2L3 7v6c0 5.25 3.75 10.15 9 11.25C17.25 23.15 21 18.25 21 13V7z" />
      <polyline points="9,12 11,14 15,10" />
    </svg>
  )
}

export function IconMember({ size = 16, className, style }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} style={style} {...base}>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20c0-4 3.58-7 8-7s8 3 8 7" />
      <polyline points="9,8 11,10 15,6" />
    </svg>
  )
}
