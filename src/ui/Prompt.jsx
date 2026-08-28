import { useGameStore } from '../store/useGameStore'
import { DOORS } from '../config/doors'

export default function Prompt() {
  const nearbyDoor = useGameStore((s) => s.nearbyDoor)
  const activeDoor = useGameStore((s) => s.activeDoor)

  if (!nearbyDoor || activeDoor) return null

  const door = DOORS.find((d) => d.id === nearbyDoor)

  return (
    <div style={{
      position: 'absolute', bottom: '8%', left: '50%',
      transform: 'translateX(-50%)',
      padding: '10px 22px', borderRadius: 10,
      background: 'rgba(20,20,32,.85)', color: '#e8e8f0',
      font: '15px system-ui', letterSpacing: '.02em',
      pointerEvents: 'none',
    }}>
      Embarquement <strong>{door.gate}</strong> — {door.label} · appuyer sur <strong>E</strong>
    </div>
  )
}