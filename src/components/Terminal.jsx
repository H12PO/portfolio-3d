import { useMemo } from 'react'
import { HALL, OUTLINE, WALLS, RECESSES, PALETTE as C } from '../config/world'
import Floor from './Floor'

/**
 * Un pan de mur, défini par ses deux sommets au sol.
 * Longueur, position et rotation sont déduites du tracé :
 * on ne décrit jamais une géométrie, seulement un contour.
 * `low` : mur d'alcôve, arrêté au plafond bas.
 */
function Wall({ a, b, glazed, low }) {
  const dx = b[0] - a[0]
  const dz = b[1] - a[1]
  const len = Math.hypot(dx, dz)
  if (len < 0.05) return null

  const midX = (a[0] + b[0]) / 2
  const midZ = (a[1] + b[1]) / 2
  const rotY = Math.atan2(dx, dz) + Math.PI / 2

  const {
    wallHeight, glassBase, glassTop, transomY, mullionGap, alcoveCeiling,
  } = HALL

  const glassH = glassTop - glassBase
  const glassY = (glassBase + glassTop) / 2
  const mullions = Math.max(1, Math.round(len / mullionGap))

  // hauteur du mur plein : abaissée dans les creux
  const h = low ? alcoveCeiling : wallHeight

  return (
    <group position={[midX, 0, midZ]} rotation-y={rotY}>
      {glazed ? (
        <>
          {/* allège */}
          <mesh position={[0, glassBase / 2, 0]} receiveShadow>
            <boxGeometry args={[len, glassBase, 0.45]} />
            <meshStandardMaterial color={C.structure} />
          </mesh>

          {/* linteau plein au-dessus du vitrage */}
          <mesh position={[0, (glassTop + wallHeight) / 2, 0]} receiveShadow>
            <boxGeometry args={[len, wallHeight - glassTop, 0.45]} />
            <meshStandardMaterial color={C.wall} />
          </mesh>

          {/* vitrage */}
          <mesh position={[0, glassY, 0]}>
            <boxGeometry args={[len, glassH, 0.07]} />
            <meshStandardMaterial color={C.glass} transparent opacity={0.16} />
          </mesh>

          {/* meneaux verticaux */}
          {Array.from({ length: mullions + 1 }).map((_, i) => (
            <mesh key={i} position={[-len / 2 + (len / mullions) * i, glassY, 0.06]}>
              <boxGeometry args={[0.13, glassH, 0.2]} />
              <meshStandardMaterial color={C.mullion} metalness={0.4} />
            </mesh>
          ))}

          {/* traverse horizontale */}
          <mesh position={[0, transomY, 0.06]}>
            <boxGeometry args={[len, 0.13, 0.2]} />
            <meshStandardMaterial color={C.mullion} metalness={0.4} />
          </mesh>
        </>
      ) : (
        <mesh position={[0, h / 2, 0]} receiveShadow>
          <boxGeometry args={[len, h, 0.45]} />
          <meshStandardMaterial color={C.wall} />
        </mesh>
      )}
    </group>
  )
}

/**
 * Un creux fermé : dalle de plafond bas, bandeau d'enseigne
 * au-dessus de l'ouverture, puis verrière jusqu'au linteau.
 */
function Recess({ minX, maxX, minZ, maxZ }) {
  const { alcoveCeiling: h, alcoveBanner: b, glassTop } = HALL

  const w = maxX - minX
  const d = maxZ - minZ
  const cx = (minX + maxX) / 2
  const cz = (minZ + maxZ) / 2

  return (
    <group>
      {/* dalle de plafond */}
      <mesh position={[cx, h, cz]} receiveShadow>
        <boxGeometry args={[w + 0.5, 0.3, d + 0.5]} />
        <meshStandardMaterial color={C.structure} />
      </mesh>

      {/* bandeau plein — support de l'enseigne }
      <mesh position={[cx, h + b / 2, maxZ]} castShadow>
        <boxGeometry args={[w + 0.5, b, 0.4]} />
        <meshStandardMaterial color={C.wall} />
      </mesh>

      {verrière au-dessus du bandeau }
      <mesh position={[cx, (h + b + glassTop) / 2, maxZ]}>
        <boxGeometry args={[w + 0.5, glassTop - h - b, 0.07]} />
        <meshStandardMaterial color={C.glass} transparent opacity={0.16} />
      </mesh>*/}
    </group>
  )
}

export default function Terminal() {
  const walls = useMemo(
    () => WALLS.map((w) => ({ ...w, a: OUTLINE[w.a], b: OUTLINE[w.b] })),
    []
  )

  return (
    <group>
      <Floor />

      {/* plan capteur d'ombres — le shader du sol n'en reçoit pas */}
      <mesh rotation-x={-Math.PI / 2} position={[0, 0.008, 0]} receiveShadow>
        <planeGeometry args={[HALL.floorSize, HALL.floorSize]} />
        <shadowMaterial opacity={0.2} />
      </mesh>

      {walls.map((w, i) => (
        <Wall key={w.name ?? i} {...w} />
      ))}

      {RECESSES.map((r) => (
        <Recess key={r.id} {...r} />
      ))}

      {/* ---- plans de fond, remplacés par des images en phase 7 ---- */}
      <mesh rotation-x={-Math.PI / 2} position={[0, -0.02, -26]}>
        <planeGeometry args={[180, 40]} />
        <meshStandardMaterial color={C.backNear} />
      </mesh>
      <mesh position={[0, 12, -42]}>
        <planeGeometry args={[200, 30]} />
        <meshBasicMaterial color={C.backMid} />
      </mesh>
      <mesh position={[0, 22, -70]}>
        <planeGeometry args={[260, 64]} />
        <meshBasicMaterial color={C.backFar} />
      </mesh>
    </group>
  )
}