/**
 * Custom SVG icon set for TotalFitness.
 * All icons use currentColor so they inherit from CSS.
 * Default size: 20×20. Pass size, className, or style as props.
 */

const base = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.6, strokeLinecap: 'round', strokeLinejoin: 'round' }

export function IconBarbell({ size = 20, className, style }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} style={style} {...base}>
      {/* Bar */}
      <line x1="7" y1="12" x2="17" y2="12" />
      {/* Left weights */}
      <rect x="3" y="9" width="2" height="6" rx="0.5" />
      <rect x="1" y="10" width="2" height="4" rx="0.5" />
      {/* Right weights */}
      <rect x="19" y="9" width="2" height="6" rx="0.5" />
      <rect x="21" y="10" width="2" height="4" rx="0.5" />
      {/* Collars */}
      <line x1="7" y1="9.5" x2="7" y2="14.5" strokeWidth="2" />
      <line x1="17" y1="9.5" x2="17" y2="14.5" strokeWidth="2" />
    </svg>
  )
}

export function IconUsers({ size = 20, className, style }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} style={style} {...base}>
      {/* Front person */}
      <circle cx="12" cy="8" r="3" />
      <path d="M6 20c0-3.314 2.686-6 6-6s6 2.686 6 6" />
      {/* Back person (left) */}
      <circle cx="5" cy="9" r="2.2" />
      <path d="M1 20c0-2.5 1.79-4.5 4-4.5" />
      {/* Back person (right) */}
      <circle cx="19" cy="9" r="2.2" />
      <path d="M23 20c0-2.5-1.79-4.5-4-4.5" />
    </svg>
  )
}

export function IconBike({ size = 20, className, style }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} style={style} {...base}>
      {/* Wheels */}
      <circle cx="6"  cy="15" r="4" />
      <circle cx="18" cy="15" r="4" />
      {/* Frame */}
      <path d="M6 15 L10 7 L14 7" />
      <path d="M10 7 L18 15" />
      <path d="M14 7 L16 11" />
      {/* Handlebar */}
      <line x1="14" y1="7" x2="16" y2="7" />
      <line x1="15" y1="7" x2="15" y2="5" />
      {/* Seat */}
      <line x1="9"  y1="7" x2="12" y2="7" />
    </svg>
  )
}

export function IconPhone({ size = 20, className, style }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} style={style} {...base}>
      <rect x="6" y="2" width="12" height="20" rx="2" />
      <line x1="12" y1="18" x2="12" y2="18" strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  )
}

export function IconLeaf({ size = 20, className, style }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} style={style} {...base}>
      {/* Leaf */}
      <path d="M12 3C6 3 3 8 3 13c0 4 3 7 7 7 5 0 9-4 9-9C19 5 15 3 12 3z" />
      {/* Vein */}
      <path d="M12 3c0 6-4 11-4 11" strokeWidth="1.2" />
      {/* Stem */}
      <line x1="8" y1="20" x2="12" y2="3" strokeWidth="1.2" />
    </svg>
  )
}

export function IconChart({ size = 20, className, style }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} style={style} {...base}>
      {/* Axes */}
      <polyline points="3,3 3,20 21,20" />
      {/* Bars */}
      <rect x="6"  y="13" width="3" height="7" rx="0.5" />
      <rect x="11" y="8"  width="3" height="12" rx="0.5" />
      <rect x="16" y="4"  width="3" height="16" rx="0.5" />
    </svg>
  )
}

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
      <path d="M8 11V7a4 4 0 0 1 8 0v4" />
    </svg>
  )
}

export function IconDumbbell({ size = 24, className, style }) {
  // Slightly larger version for empty-state hero illustration
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
