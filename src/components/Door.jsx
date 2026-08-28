import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Text } from '@react-three/drei'
import * as THREE from 'three'
import { useGameStore } from '../store/useGameStore'
import { useT } from '../i18n'
import { DOOR_Z, BOARDING, LANDING } from '../config/doors'

const WIDTH = 2.2
const HALF = WIDTH / 2

export default function Door({ id, gate, x }) {
  const isNear = useGameStore((s) => s.nearbyDoor === id)
  const leftRef = useRef()
  const rightRef = useRef()
  const t = useT()

    useFrame(() => {
    const { boardingDoor, boardingTime, landingDoor, landingTime } = useGameStore.getState()

    let opening = 0
    if (boardingDoor === id) {
      opening = THREE.MathUtils.clamp(boardingTime / BOARDING.doorOpen, 0, 1)
    } else if (landingDoor === id) {
      const closing = (landingTime - LANDING.walkOut) / (LANDING.total - LANDING.walkOut)
      opening = 1 - THREE.MathUtils.clamp(closing, 0, 1)
    }

    const eased = opening * opening * (3 - 2 * opening)
    const shift = eased * HALF

    leftRef.current.position.x = -HALF / 2 - shift
    rightRef.current.position.x = HALF / 2 + shift
  })

  const color = isNear ? '#4d8bd8' : '#3a3a4a'

  return (
    <group position={[x, 0, DOOR_Z]}>
      <mesh ref={leftRef} position={[-HALF / 2, 1.1, 0]} castShadow>
        <boxGeometry args={[HALF, 2.2, 0.3]} />
        <meshStandardMaterial color={color} />
      </mesh>

      <mesh ref={rightRef} position={[HALF / 2, 1.1, 0]} castShadow>
        <boxGeometry args={[HALF, 2.2, 0.3]} />
        <meshStandardMaterial color={color} />
      </mesh>

      {/* la passerelle derrière, visible quand la porte s'ouvre */}
      <mesh position={[0, 1.1, -1.5]}>
        <boxGeometry args={[WIDTH, 2.2, 3]} />
        <meshStandardMaterial color="#0d0d16" side={THREE.BackSide} />
      </mesh>

      <Text position={[0, 2.9, 0.2]} fontSize={0.32} color="#e8e8f0" anchorY="middle">
        {`${gate} — ${t(`doors.${id}.label`)}`}
      </Text>
    </group>
  )
}