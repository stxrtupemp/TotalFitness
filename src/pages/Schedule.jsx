import { useState } from 'react'
import Footer from '../components/Footer'
import {
  NEON, CYAN, BG, SURFACE, BORDER, TEXT, MUTED,
  Badge, SectionHeader,
} from '../components/UI'

const DAYS = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom']

const SCHEDULE = [
  [
    { time: '07:00', name: 'Spinning',   coach: 'Carlos M.', spots: 8,  color: NEON },
    { time: '09:30', name: 'HIIT Total', coach: 'Ana R.',    spots: 4,  color: '#ff6644' },
    { time: '11:00', name: 'Yoga Flow',  coach: 'Marta G.',  spots: 12, color: CYAN },
    { time: '18:30', name: 'CrossFit',   coach: 'David L.',  spots: 2,  color: '#ff4488' },
    { time: '20:00', name: 'Pilates',    coach: 'Laura S.',  spots: 10, color: '#aa88ff' },
  ],
  [
    { time: '08:00', name: 'Body Pump',      coach: 'Carlos M.', spots: 6,  color: NEON },
    { time: '10:00', name: 'Pilates',        coach: 'Laura S.',  spots: 15, color: '#aa88ff' },
    { time: '19:00', name: 'HIIT Express',   coach: 'Ana R.',    spots: 3,  color: '#ff6644' },
    { time: '21:00', name: 'Stretch & Roll', coach: 'Marta G.',  spots: 20, color: CYAN },
  ],
  [
    { time: '07:30', name: 'Spinning',          coach: 'Pedro V.', spots: 10, color: NEON },
    { time: '09:00', name: 'CrossFit',          coach: 'David L.', spots: 5,  color: '#ff4488' },
    { time: '12:00', name: 'Yoga Restaurativo', coach: 'Marta G.', spots: 18, color: CYAN },
    { time: '18:00', name: 'Body Combat',       coach: 'Ana R.',   spots: 7,  color: '#ff6644' },
  ],
  [
    { time: '08:00', name: 'HIIT Total', coach: 'Carlos M.', spots: 6, color: '#ff6644' },
    { time: '10:30', name: 'Body Pump',  coach: 'Pedro V.',  spots: 9, color: NEON },
    { time: '19:30', name: 'CrossFit',  coach: 'David L.',  spots: 4, color: '#ff4488' },
  ],
  [
    { time: '07:00', name: 'Spinning',    coach: 'Pedro V.',  spots: 12, color: NEON },
    { time: '09:30', name: 'Yoga Flow',   coach: 'Marta G.',  spots: 8,  color: CYAN },
    { time: '11:00', name: 'HIIT Total',  coach: 'Ana R.',    spots: 0,  color: '#ff6644' },
    { time: '18:00', name: 'Body Combat', coach: 'Carlos M.', spots: 5,  color: '#ff4488' },
    { time: '20:00', name: 'Pilates',     coach: 'Laura S.',  spots: 14, color: '#aa88ff' },
  ],
  [
    { time: '09:00', name: 'CrossFit Weekend', coach: 'David L.',  spots: 8,  color: '#ff4488' },
    { time: '11:00', name: 'Yoga Meditación',  coach: 'Marta G.',  spots: 20, color: CYAN },
    { time: '12:30', name: 'HIIT Express',     coach: 'Carlos M.', spots: 6,  color: '#ff6644' },
  ],
  [
    { time: '10:00', name: 'Yoga Suave',   coach: 'Laura S.', spots: 22, color: CYAN },
    { time: '12:00', name: 'Stretch Roll', coach: 'Marta G.', spots: 18, color: '#aa88ff' },
  ],
]

export default function Schedule() {
  const [activeDay, setActiveDay] = useState(0)

  return (
    <div style={{ background: BG, minHeight: '100vh', paddingTop: '64px', color: TEXT }}>
      <section style={{ maxWidth: '1200px', margin: '0 auto', padding: 'clamp(3rem,6vw,5rem) clamp(1.25rem,4vw,2rem)' }}>
        <SectionHeader tag="Horario de clases" title="48 sesiones semanales." sub="Reserva tu plaza en recepción o a través de la app." center />

        <div style={{ display: 'flex', gap: '0.4rem', justifyContent: 'center', marginBottom: '2rem', flexWrap: 'wrap' }}>
          {DAYS.map((d, i) => (
            <button key={d} onClick={() => setActiveDay(i)} style={{ padding: '0.45rem 1rem', borderRadius: '100px', background: activeDay === i ? NEON : SURFACE, border: `1px solid ${activeDay === i ? NEON : BORDER}`, color: activeDay === i ? BG : MUTED, fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: '0.88rem', letterSpacing: '0.05em', cursor: 'pointer', transition: 'all 0.2s', boxShadow: activeDay === i ? `0 0 12px ${NEON}40` : 'none' }}>{d}</button>
          ))}
        </div>

        <div style={{ display: 'grid', gap: '0.6rem' }}>
          {SCHEDULE[activeDay].map((cls, i) => (
            <div key={i} style={{ background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: '10px', padding: 'clamp(0.875rem,2vw,1.25rem) clamp(1rem,3vw,1.5rem)', display: 'flex', alignItems: 'center', gap: 'clamp(0.875rem,2vw,1.5rem)' }}>
              <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 'clamp(1.1rem,3vw,1.4rem)', fontWeight: 800, color: cls.color, minWidth: '60px', flexShrink: 0 }}>{cls.time}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 'clamp(0.95rem,2.5vw,1.1rem)', fontWeight: 700, color: TEXT }}>{cls.name}</div>
                <div style={{ color: MUTED, fontSize: '0.78rem', fontFamily: "'Inter', sans-serif" }}>con {cls.coach}</div>
              </div>
              <Badge color={cls.spots === 0 ? 'red' : cls.spots <= 4 ? 'cyan' : 'green'}>
                {cls.spots === 0 ? 'Completo' : `${cls.spots} plazas`}
              </Badge>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  )
}
