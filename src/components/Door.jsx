import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Text } from '@react-three/drei'
import * as THREE from 'three'
import { useGameStore } from '../store/useGameStore'
import { useT } from '../i18n'
import { DOOR_Z, BOARDING, LANDING } from '../config/doors'

const WIDTH = 2.9
const HALF = WIDTH / 2
const HEIGHT = 3.1

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

  const color = isNear ? '#5aa9e6' : '#b9bec7'

  return (
    <group position={[x, 0, DOOR_Z]}>
      <mesh ref={leftRef} position={[-HALF / 2, HEIGHT / 2, 0]} castShadow>
        <boxGeometry args={[HALF, HEIGHT, 0.28]} />
        <meshStandardMaterial color={color} />
      </mesh>

      <mesh ref={rightRef} position={[HALF / 2, HEIGHT / 2, 0]} castShadow>
        <boxGeometry args={[HALF, HEIGHT, 0.28]} />
        <meshStandardMaterial color={color} />
      </mesh>


      <Text position={[0, 3.85, 0.4]} fontSize={0.3} color="#ffffff" anchorY="middle">
        {`${gate} — ${t(`doors.${id}.label`)}`}
      </Text>
    </group>
  )
}