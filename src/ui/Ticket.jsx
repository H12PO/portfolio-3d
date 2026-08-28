import { useGameStore } from '../store/useGameStore'
import { useT } from '../i18n'
import { DOORS, BOARDING, LANDING } from '../config/doors'

export default function Ticket() {
  const boardingDoor = useGameStore((s) => s.boardingDoor)
  const boardingTime = useGameStore((s) => s.boardingTime)
  const landingDoor = useGameStore((s) => s.landingDoor)
  const landingTime = useGameStore((s) => s.landingTime)
  const t = useT()

  const doorId = boardingDoor || landingDoor
  if (!doorId) return null

  const door = DOORS.find((d) => d.id === doorId)

  let slide, opacity

  if (boardingDoor) {
    const p = Math.min(boardingTime / BOARDING.total, 1)
    slide = p < 0.55 ? 100 - (p / 0.55) * 100 : 0
    opacity = p < 0.35 ? 0 : Math.min((p - 0.35) / 0.3, 1)
    } else {
    const time = landingTime

    if (time < LANDING.ticketIn) {
      const p = time / LANDING.ticketIn
      const eased = p * p * (3 - 2 * p)
      slide = -110 + eased * 110
      opacity = Math.min(p / 0.7, 1)
    } else {
      const p = (time - LANDING.ticketIn) / (LANDING.total - LANDING.ticketIn)
      const out = Math.max((p - 0.35) / 0.65, 0)
      const eased = out * out * (3 - 2 * out)
      slide = -eased * 130
      opacity = 1 - eased
    }
  }

  return (
    <div style={{
      position: 'absolute', inset: 0, zIndex: 20,
      pointerEvents: 'none', overflow: 'hidden',
    }}>
      <div style={{ position: 'absolute', inset: 0, background: '#0d0d16', opacity }} />

      <div style={{
        position: 'absolute', top: '50%', left: '50%',
        transform: `translate(-50%, -50%) translateX(${slide}vw) rotate(-2deg)`,
        width: 'min(420px, 82vw)',
        background: '#f4f0e6', color: '#1a1a22',
        borderRadius: 10, padding: '22px 26px',
        font: '14px system-ui',
        boxShadow: '0 24px 60px rgba(0,0,0,.5)',
      }}>
        <div style={{
          display: 'flex', justifyContent: 'space-between',
          fontSize: 11, letterSpacing: '.16em', opacity: .5,
        }}>
          <span>BOARDING PASS</span>
          <span>{door.gate}</span>
        </div>

        <p style={{ fontSize: 27, fontWeight: 600, margin: '14px 0 4px' }}>
          {t(`doors.${doorId}.label`)}
        </p>

        <div style={{
          marginTop: 18, paddingTop: 14,
          borderTop: '2px dashed rgba(0,0,0,.18)',
          display: 'flex', justifyContent: 'space-between',
          fontSize: 12, opacity: .6,
        }}>
          <span>{t('intro.name').toUpperCase()}</span>
          <span>{t('nav.gate').toUpperCase()} {door.gate}</span>
        </div>
      </div>
    </div>
  )
}