import { TERMINAL, BACKDROP, PALETTE as C } from '../config/world'
import { DOORS, DOOR_Z } from '../config/doors'

const HALF_DOOR = 1.7

export default function Terminal() {
  const { length, wallZ, wallHeight, floorDepth, ceilingFront } = TERMINAL

  const glassSpans = []
  let cursor = -length / 2
  for (const door of DOORS) {
    const to = door.x - HALF_DOOR
    if (to - cursor > 0.6) glassSpans.push([cursor, to])
    cursor = door.x + HALF_DOOR
  }
  if (length / 2 - cursor > 0.6) glassSpans.push([cursor, length / 2])

  return (
    <group>
      {/* ============ SOL ============ */}
      <mesh rotation-x={-Math.PI / 2} position={[0, 0, wallZ + floorDepth / 2]} receiveShadow>
        <planeGeometry args={[length, floorDepth]} />
        <meshStandardMaterial color={C.floor} roughness={0.3} />
      </mesh>

      {/* ============ PLAFOND ============ */}
      <mesh position={[0, wallHeight, (wallZ + ceilingFront) / 2]} receiveShadow>
        <boxGeometry args={[length, 0.4, ceilingFront - wallZ]} />
        <meshStandardMaterial color={C.ceiling} />
      </mesh>

      {/* poutres — rythme du plafond, cote de référence : tous les 4 m */}
      {Array.from({ length: Math.floor(length / 4) }).map((_, i) => (
        <mesh
          key={`beam-${i}`}
          position={[-length / 2 + 2 + i * 4, wallHeight - 0.3, (wallZ + 4) / 2]}
        >
          <boxGeometry args={[0.28, 0.32, 9]} />
          <meshStandardMaterial color={C.structure} />
        </mesh>
      ))}

      {/* bandeau LED central */}
      <mesh position={[0, wallHeight - 0.24, 0]}>
        <boxGeometry args={[length - 3, 0.08, 0.6]} />
        <meshStandardMaterial color={C.led} emissive={C.led} emissiveIntensity={0.9} />
      </mesh>

      {/* ============ FAÇADE ============ */}
      <mesh position={[0, wallHeight - 0.5, wallZ]}>
        <boxGeometry args={[length, 1.0, 0.4]} />
        <meshStandardMaterial color={C.wall} />
      </mesh>

      {[-1, 1].map((side) => (
        <mesh key={side} position={[(side * length) / 2, wallHeight / 2, (wallZ + ceilingFront) / 2]}>
          <boxGeometry args={[0.4, wallHeight, ceilingFront - wallZ]} />
          <meshStandardMaterial color={C.wall} />
        </mesh>
      ))}

      {glassSpans.map(([from, to], i) => {
        const w = to - from
        const count = Math.max(1, Math.round(w / 3))
        return (
          <group key={`span-${i}`}>
            <mesh position={[(from + to) / 2, 2.05, wallZ]}>
              <boxGeometry args={[w, 4.1, 0.08]} />
              <meshStandardMaterial color={C.glass} transparent opacity={0.2} />
            </mesh>
            {Array.from({ length: count + 1 }).map((_, k) => (
              <mesh key={k} position={[from + (w / count) * k, 2.05, wallZ + 0.06]}>
                <boxGeometry args={[0.12, 4.1, 0.2]} />
                <meshStandardMaterial color={C.mullion} metalness={0.4} />
              </mesh>
            ))}
          </group>
        )
      })}

      {/* ============ PORTES ============ */}
      {DOORS.map((door) => (
        <group key={`frame-${door.id}`} position={[door.x, 0, DOOR_Z]}>
          {[-1.45, 1.45].map((x) => (
            <mesh key={x} position={[x, 1.4, 0]} castShadow>
              <boxGeometry args={[0.4, 2.8, 0.5]} />
              <meshStandardMaterial color={C.structure} />
            </mesh>
          ))}
          <mesh position={[0, 2.95, 0]} castShadow>
            <boxGeometry args={[3.3, 0.3, 0.5]} />
            <meshStandardMaterial color={C.structure} />
          </mesh>
          <mesh position={[0, 1.4, -0.3]}>
            <boxGeometry args={[2.6, 2.8, 0.06]} />
            <meshStandardMaterial color={C.wall} />
          </mesh>
          <mesh position={[0, 3.5, 0.3]} castShadow>
            <boxGeometry args={[3.4, 0.58, 0.08]} />
            <meshStandardMaterial color={C.sign} />
          </mesh>
        </group>
      ))}

      {/* ============ PLANS DE FOND (à remplacer en phase 7) ============ */}
      <mesh rotation-x={-Math.PI / 2} position={[0, -0.02, BACKDROP.near]}>
        <planeGeometry args={[120, 40]} />
        <meshStandardMaterial color={C.backNear} />
      </mesh>

      <mesh position={[0, 10, BACKDROP.mid]}>
        <planeGeometry args={[140, 26]} />
        <meshBasicMaterial color={C.backMid} />
      </mesh>

      <mesh position={[0, 18, BACKDROP.far]}>
        <planeGeometry args={[200, 50]} />
        <meshBasicMaterial color={C.backFar} />
      </mesh>
    </group>
  )
}