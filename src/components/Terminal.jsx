import { TERMINAL, BACKDROP, PALETTE as C } from '../config/world'
import { DOORS, DOOR_Z } from '../config/doors'

const HALF_DOOR = 1.6

export default function Terminal() {
  const {
    length, wallZ, wallHeight,
    glassBase, glassTop, transomY, doorHeight, floorDepth,
  } = TERMINAL

  // segments de verrière pleine hauteur, entre les portes
  const spans = []
  let cursor = -length / 2
  for (const door of DOORS) {
    if (door.x - HALF_DOOR - cursor > 0.6) spans.push([cursor, door.x - HALF_DOOR])
    cursor = door.x + HALF_DOOR
  }
  if (length / 2 - cursor > 0.6) spans.push([cursor, length / 2])

  const glassH = glassTop - glassBase
  const glassY = (glassBase + glassTop) / 2

  return (
    <group>
      {/* ================= SOL ================= */}
      <mesh rotation-x={-Math.PI / 2} position={[0, 0, wallZ + floorDepth / 2]} receiveShadow>
        <planeGeometry args={[length, floorDepth]} />
        <meshStandardMaterial color={C.floor} roughness={0.3} />
      </mesh>

      {[-2.4, 2.4].map((z) => (
        <mesh key={z} rotation-x={-Math.PI / 2} position={[0, 0.012, z]}>
          <planeGeometry args={[length - 4, 0.12]} />
          <meshStandardMaterial color={C.floorLine} emissive={C.led} emissiveIntensity={0.5} />
        </mesh>
      ))}

      {/* ================= FAÇADE : ALLÈGE ET BANDEAU HAUT ================= */}
      <mesh position={[0, glassBase / 2, wallZ]} receiveShadow>
        <boxGeometry args={[length, glassBase, 0.45]} />
        <meshStandardMaterial color={C.structure} />
      </mesh>

      <mesh position={[0, (glassTop + wallHeight) / 2, wallZ]} receiveShadow>
        <boxGeometry args={[length, wallHeight - glassTop, 0.45]} />
        <meshStandardMaterial color={C.wall} />
      </mesh>

      {/* ================= VERRIÈRE ================= */}
      {spans.map(([from, to], i) => {
        const w = to - from
        const count = Math.max(1, Math.round(w / 3.2))

        return (
          <group key={`span-${i}`}>
            <mesh position={[(from + to) / 2, glassY, wallZ]}>
              <boxGeometry args={[w, glassH, 0.07]} />
              <meshStandardMaterial color={C.glass} transparent opacity={0.16} />
            </mesh>

            {/* meneaux verticaux */}
            {Array.from({ length: count + 1 }).map((_, k) => (
              <mesh key={k} position={[from + (w / count) * k, glassY, wallZ + 0.06]}>
                <boxGeometry args={[0.13, glassH, 0.2]} />
                <meshStandardMaterial color={C.mullion} metalness={0.4} />
              </mesh>
            ))}

            {/* traverse horizontale */}
            <mesh position={[(from + to) / 2, transomY, wallZ + 0.06]}>
              <boxGeometry args={[w, 0.13, 0.2]} />
              <meshStandardMaterial color={C.mullion} metalness={0.4} />
            </mesh>
          </group>
        )
      })}

      {/* ================= PORTES ================= */}
      {DOORS.map((door) => (
        <group key={`frame-${door.id}`} position={[door.x, 0, DOOR_Z]}>
          {/* verrière au-dessus de la porte */}
          <mesh position={[0, (doorHeight + glassTop) / 2, 0]}>
            <boxGeometry args={[HALF_DOOR * 2, glassTop - doorHeight, 0.07]} />
            <meshStandardMaterial color={C.glass} transparent opacity={0.16} />
          </mesh>

          {/* montants et linteau */}
          {[-1.5, 1.5].map((x) => (
            <mesh key={x} position={[x, doorHeight / 2, 0]} castShadow>
              <boxGeometry args={[0.32, doorHeight, 0.5]} />
              <meshStandardMaterial color={C.structure} />
            </mesh>
          ))}
          <mesh position={[0, doorHeight, 0]} castShadow>
            <boxGeometry args={[3.32, 0.28, 0.5]} />
            <meshStandardMaterial color={C.structure} />
          </mesh>

          {/* fond du sas */}
          <mesh position={[0, doorHeight / 2, -0.35]}>
            <boxGeometry args={[2.9, doorHeight, 0.06]} />
            <meshStandardMaterial color="#7d838c" />
          </mesh>

          {/* panneau de signalétique */}
          <mesh position={[0, 3.85, 0.32]} castShadow>
            <boxGeometry args={[3.5, 0.6, 0.08]} />
            <meshStandardMaterial color={C.sign} />
          </mesh>
        </group>
      ))}

      {/* ================= PLANS DE FOND (images en phase 7) ================= */}
      <mesh rotation-x={-Math.PI / 2} position={[0, -0.02, BACKDROP.near]}>
        <planeGeometry args={[140, 40]} />
        <meshStandardMaterial color={C.backNear} />
      </mesh>

      <mesh position={[0, 12, BACKDROP.mid]}>
        <planeGeometry args={[160, 30]} />
        <meshBasicMaterial color={C.backMid} />
      </mesh>

      <mesh position={[0, 20, BACKDROP.far]}>
        <planeGeometry args={[220, 60]} />
        <meshBasicMaterial color={C.backFar} />
      </mesh>
    </group>
  )
}