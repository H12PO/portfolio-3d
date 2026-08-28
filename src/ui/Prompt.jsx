import { useGameStore } from '../store/useGameStore'
import { useT } from '../i18n'

export default function Prompt() {
  const nearbyDoor = useGameStore((s) => s.nearbyDoor)
  const activeDoor = useGameStore((s) => s.activeDoor)
  const t = useT()

  if (!nearbyDoor || activeDoor) return null

  return (
    <div style={{
      position: 'absolute', bottom: '8%', left: '50%',
      transform: 'translateX(-50%)',
      padding: '10px 22px', borderRadius: 10,
      background: 'rgba(20,20,32,.85)', color: '#e8e8f0',
      font: '15px system-ui', letterSpacing: '.02em',
      pointerEvents: 'none',
    }}>
      {t(`doors.${nearbyDoor}.label`)} · {t('nav.interact')}
    </div>
  )
}