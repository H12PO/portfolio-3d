import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Text } from '@react-three/drei'
import * as THREE from 'three'
import { useGameStore } from '../store/useGameStore'
import { useT } from '../i18n'
import { HALL, PALETTE as C } from '../config/world'
import { BOARDING, LANDING } from '../config/doors'

const smoothstep = (x) => x * x * (3 - 2 * x)

export default function Door({ id, gate, x, z, rotY }) {
  const isNear = useGameStore((s) => s.nearbyDoor === id)
  const leftRef = useRef()
  const rightRef = useRef()
  const t = useT()

  const W = HALL.doorWidth
  const H = HALL.doorHeight
  const HALF = W / 2

  useFrame(() => {
    const { boardingDoor, boardingTime, landingDoor, landingTime } =
      useGameStore.getState()

    let opening = 0
    if (boardingDoor === id) {
      opening = THREE.MathUtils.clamp(boardingTime / BOARDING.doorOpen, 0, 1)
    } else if (landingDoor === id) {
      const closing =
        (landingTime - LANDING.walkOut) / (LANDING.total - LANDING.walkOut)
      opening = 1 - THREE.MathUtils.clamp(closing, 0, 1)
    }

    const shift = smoothstep(opening) * HALF
    leftRef.current.position.x = -HALF / 2 - shift
    rightRef.current.position.x = HALF / 2 + shift
  })

  const color = isNear ? '#7fb8e0' : '#aeb4bd'

  return (
    <group position={[x, 0, z]} rotation-y={rotY}>
      {/* fond du sas — trou d'ombre, jamais coloré */}
      <mesh position={[0, H / 2, -0.6]}>
        <boxGeometry args={[W + 0.3, H, 0.06]} />
        <meshStandardMaterial color="#3a3f47" />
      </mesh>
      {[-1, 1].map((s) => (
        <mesh key={s} position={[s * (HALF + 0.15), H / 2, -0.3]}>
          <boxGeometry args={[0.06, H, 0.6]} />
          <meshStandardMaterial color="#4a5057" />
        </mesh>
      ))}

      {/* battants coulissants */}
      <mesh ref={leftRef} position={[-HALF / 2, H / 2, 0]} castShadow>
        <boxGeometry args={[HALF, H, 0.24]} />
        <meshStandardMaterial color={color} />
      </mesh>
      <mesh ref={rightRef} position={[HALF / 2, H / 2, 0]} castShadow>
        <boxGeometry args={[HALF, H, 0.24]} />
        <meshStandardMaterial color={color} />
      </mesh>

      {/* encadrement */}
      {[-(HALF + 0.2), HALF + 0.2].map((px) => (
        <mesh key={px} position={[px, H / 2, 0.05]} castShadow>
          <boxGeometry args={[0.34, H, 0.5]} />
          <meshStandardMaterial color={C.structure} />
        </mesh>
      ))}
      <mesh position={[0, H + 0.15, 0.05]} castShadow>
        <boxGeometry args={[W + 0.88, 0.3, 0.5]} />
        <meshStandardMaterial color={C.structure} />
      </mesh>

      {/* signalétique */}
      <mesh position={[0, H + 0.85, 0.28]} castShadow>
        <boxGeometry args={[W + 0.9, 0.56, 0.08]} />
        <meshStandardMaterial color={C.sign} />
      </mesh>
      <Text
        position={[0, H + 0.85, 0.34]}
        fontSize={0.27}
        color="#ffffff"
        anchorY="middle"
      >
        {`${gate} — ${t(`doors.${id}.label`)}`}
      </Text>
    </group>
  )
}