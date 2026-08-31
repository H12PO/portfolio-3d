import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import useKeyboard from '../hooks/useKeyboard'
import useDoorNavigation from '../hooks/useDoorNavigation'
import { useGameStore } from '../store/useGameStore'
import { BOUNDS } from '../config/world'
import { DOORS, DOOR_Z, DOOR_RADIUS, BOARDING, LANDING } from '../config/doors'

const SPEED = 4
const SMOOTHNESS = 4
const ARRIVAL_THRESHOLD = 0.15

/* ============================================================
   RÉGLAGES DE CAMÉRA  ←  c'est ici qu'on ajuste le cadrage
   ============================================================ */
/* ============================================================
   CAMÉRA FIXÉE — ne plus modifier sans raison
   ============================================================ */
const CAM = {
  height: 5,
  distance: 16,
  lookAtY: 2.2,
  margin: 7,
}

const smoothstep = (x) => x * x * (3 - 2 * x)

export default function Player() {
  const ref = useRef()
  const enterDoor = useDoorNavigation()
  const keys = useKeyboard(enterDoor)
  const direction = useRef(new THREE.Vector3())
  const boardingStart = useRef(new THREE.Vector3())

  useFrame((state, delta) => {
    const pos = ref.current.position
    const store = useGameStore.getState()
    if (!store.started) return

    const camPos = state.camera.position

    /* ==========================================================
       1. EMBARQUEMENT — inchangé
       ========================================================== */
    if (store.boardingDoor) {
      const time = store.boardingTime
      if (time === 0) boardingStart.current.copy(pos)
      store.tickBoarding(delta)

      const door = DOORS.find((d) => d.id === store.boardingDoor)
      const walk = THREE.MathUtils.clamp(
        (time - BOARDING.doorOpen) / (BOARDING.walkIn - BOARDING.doorOpen), 0, 1
      )
      const eased = smoothstep(walk)

      pos.x = THREE.MathUtils.lerp(boardingStart.current.x, door.x, eased)
      pos.z = THREE.MathUtils.lerp(boardingStart.current.z, DOOR_Z - 1.2, eased)

      camPos.x = THREE.MathUtils.lerp(camPos.x, door.x, 1 - Math.exp(-3 * delta))
      camPos.y = THREE.MathUtils.lerp(camPos.y, 3.6, 1 - Math.exp(-2 * delta))
      camPos.z = THREE.MathUtils.lerp(camPos.z, 8, 1 - Math.exp(-2 * delta))
      state.camera.lookAt(door.x, 1.8, DOOR_Z)
      return
    }

    /* ==========================================================
       2. DÉBARQUEMENT — la caméra revient au cadrage normal
       ========================================================== */
    if (store.landingDoor) {
      const time = store.landingTime
      const door = DOORS.find((d) => d.id === store.landingDoor)

      if (time === 0) {
        pos.x = door.x
        pos.z = DOOR_Z - 1.2
        camPos.set(door.x, 3.6, 8)
      }
      store.tickLanding(delta)

      const walk = THREE.MathUtils.clamp(
        (time - LANDING.routeChange) / (LANDING.walkOut - LANDING.routeChange), 0, 1
      )
      const eased = smoothstep(walk)

      pos.x = door.x
      pos.z = THREE.MathUtils.lerp(DOOR_Z - 1.2, DOOR_Z + 1.8, eased)

      // ⬇️ MODIFIÉ : on revient vers CAM.height / CAM.distance
      camPos.x = THREE.MathUtils.lerp(camPos.x, door.x, 1 - Math.exp(-3 * delta))
      camPos.y = THREE.MathUtils.lerp(camPos.y, CAM.height, 1 - Math.exp(-2.5 * delta))
      camPos.z = THREE.MathUtils.lerp(camPos.z, CAM.distance, 1 - Math.exp(-2.5 * delta))
      state.camera.lookAt(camPos.x, CAM.lookAtY, 0)
      return
    }

    /* ==========================================================
       3. DÉPLACEMENT NORMAL — inchangé jusqu'à la caméra
       ========================================================== */
    const { forward, backward, left, right } = keys.current

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

    if (direction.current.lengthSq() > 0) {
      pos.addScaledVector(direction.current, SPEED * delta)
      pos.x = THREE.MathUtils.clamp(pos.x, BOUNDS.minX, BOUNDS.maxX)
      pos.z = THREE.MathUtils.clamp(pos.z, BOUNDS.minZ, BOUNDS.maxZ)
    }

    /* ==========================================================
       ⬇️⬇️⬇️  LES 4 LIGNES MODIFIÉES SONT ICI  ⬇️⬇️⬇️
       ========================================================== */
    const targetX = THREE.MathUtils.clamp(
      pos.x, BOUNDS.minX + CAM.margin, BOUNDS.maxX - CAM.margin
    )
    camPos.x = THREE.MathUtils.lerp(camPos.x, targetX, 1 - Math.exp(-SMOOTHNESS * delta))
    camPos.y = THREE.MathUtils.lerp(camPos.y, CAM.height, 1 - Math.exp(-SMOOTHNESS * delta))
    camPos.z = THREE.MathUtils.lerp(camPos.z, CAM.distance, 1 - Math.exp(-SMOOTHNESS * delta))
    state.camera.lookAt(camPos.x, CAM.lookAtY, 0)
    /* ========================================================== */

    /* ==========================================================
       4. DÉTECTION DE PORTE — inchangé
       ========================================================== */
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