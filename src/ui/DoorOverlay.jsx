import { useGameStore } from '../store/useGameStore'
import { DOORS } from '../config/doors'

export default function DoorOverlay() {
  const activeDoor = useGameStore((s) => s.activeDoor)
  const exitDoor = useGameStore((s) => s.exitDoor)

  if (!activeDoor) return null

  const door = DOORS.find((d) => d.id === activeDoor)

  return (
    <div style={{
      position: 'absolute', inset: 0,
      background: 'rgba(10,10,18,.94)', color: '#e8e8f0',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', gap: 24,
      font: '16px system-ui',
    }}>
      <p style={{ opacity: .5, letterSpacing: '.18em', fontSize: 13 }}>
        PORTE {door.gate}
      </p>
      <h1 style={{ fontSize: 44, fontWeight: 600 }}>{door.label}</h1>
      <p style={{ opacity: .6 }}>Contenu à venir en phase 2.</p>
      <button
        onClick={exitDoor}
        style={{
          marginTop: 12, padding: '10px 24px', borderRadius: 8,
          border: '1px solid rgba(255,255,255,.25)',
          background: 'transparent', color: 'inherit',
          font: 'inherit', cursor: 'pointer',
        }}
      >
        ← Retour au terminal
      </button>
    </div>
  )
}