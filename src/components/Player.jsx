import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import useKeyboard from '../hooks/useKeyboard'
import { useGameStore } from '../store/useGameStore'
import { BOUNDS } from '../config/world'
import { DOORS, DOOR_Z, DOOR_RADIUS } from '../config/doors'

const SPEED = 4
const SMOOTHNESS = 4
const ARRIVAL_THRESHOLD = 0.15

export default function Player() {
    const ref = useRef()
    const keys = useKeyboard(() => useGameStore.getState().enterDoor())
    const direction = useRef(new THREE.Vector3())

    useFrame((state, delta) => {
    const pos = ref.current.position
    const store = useGameStore.getState()
    const { forward, backward, left, right } = keys.current

    // --- direction voulue -------------------------------------------------
    direction.current.set(
      (right ? 1 : 0) - (left ? 1 : 0),
      0,
      (backward ? 1 : 0) - (forward ? 1 : 0)
    )

    const usingKeyboard = direction.current.lengthSq() > 0

    if (usingKeyboard) {
      if (store.destination) store.setDestination(null)
      direction.current.normalize()
    } else if (store.destination) {
      const dx = THREE.MathUtils.clamp(store.destination.x, BOUNDS.minX, BOUNDS.maxX) - pos.x
      const dz = THREE.MathUtils.clamp(store.destination.z, BOUNDS.minZ, BOUNDS.maxZ) - pos.z

      if (dx * dx + dz * dz < ARRIVAL_THRESHOLD * ARRIVAL_THRESHOLD) {
        store.setDestination(null)
      } else {
        direction.current.set(dx, 0, dz).normalize()
      }
    }

    // --- déplacement ------------------------------------------------------
    if (direction.current.lengthSq() > 0) {
      pos.addScaledVector(direction.current, SPEED * delta)
      pos.x = THREE.MathUtils.clamp(pos.x, BOUNDS.minX, BOUNDS.maxX)
      pos.z = THREE.MathUtils.clamp(pos.z, BOUNDS.minZ, BOUNDS.maxZ)
    }

    // --- caméra en traveling ----------------------------------------------
    const camPos = state.camera.position
    const targetX = THREE.MathUtils.clamp(pos.x, BOUNDS.minX + 6, BOUNDS.maxX - 6)

    camPos.x = THREE.MathUtils.lerp(camPos.x, targetX, 1 - Math.exp(-SMOOTHNESS * delta))
    camPos.y = 4
    camPos.z = 12

    state.camera.lookAt(camPos.x, 1.5, 0)

    // --- porte la plus proche ---------------------------------------------
    let found = null
    for (const door of DOORS) {
      const dx = door.x - pos.x
      const dz = DOOR_Z - pos.z
      if (dx * dx + dz * dz < DOOR_RADIUS * DOOR_RADIUS) {
        found = door.id
        break
      }
    }
    store.setNearbyDoor(found)
    })

    return (
    <mesh ref={ref} position={[0, 0.6, 0]} castShadow>
      <capsuleGeometry args={[0.3, 0.6, 8, 16]} />
      <meshStandardMaterial color="#e8a33d" />
    </mesh>
    )
}