import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import useKeyboard from '../hooks/useKeyboard'
import useDoorNavigation from '../hooks/useDoorNavigation'
import { useGameStore } from '../store/useGameStore'
import { clampToHall, isInsideHall } from '../config/world'
import {
  DOORS, DOOR_RADIUS, STAND_OFF, WALK_IN, BOARDING, LANDING,
} from '../config/doors'

const SPEED = 4
const SMOOTHNESS = 4
const ARRIVAL = 0.15
const TURN_SPEED = 10

/* ============================================================
   CAMÉRA À CRANS — 8 orientations, une par face de l'octogone
   ============================================================ */
const STEP = Math.PI / 4      // 45°
const CAM = {
  height: 2.5,
  distance: 13,
  minDist: 7,
  maxDist: 18,
  lookAtY: 2.0,
  wallMargin: 1.2,
  turnSpeed: 7,               // vitesse de la transition entre crans
}

const smoothstep = (x) => x * x * (3 - 2 * x)
const damp = (delta, k = SMOOTHNESS) => 1 - Math.exp(-k * delta)

export default function Player() {
  const ref = useRef()
  const enterDoor = useDoorNavigation()
  const keys = useKeyboard(enterDoor)

  const dir = useRef(new THREE.Vector3())
  const from = useRef(new THREE.Vector3())
  const sector = useRef(0)          // cran courant, entier
  const yaw = useRef(0)             // angle lissé, suit le cran
  const dist = useRef(CAM.distance)
  const camTarget = useRef(new THREE.Vector3())

  function placeCamera(state, pos, delta, k) {
    const sy = Math.sin(yaw.current)
    const cy = Math.cos(yaw.current)

    let d = dist.current
    while (d > CAM.minDist) {
      if (isInsideHall(pos.x + sy * d, pos.z + cy * d, CAM.wallMargin)) break
      d -= 0.5
    }

    camTarget.current.set(pos.x + sy * d, pos.y + CAM.height, pos.z + cy * d)
    state.camera.position.lerp(camTarget.current, damp(delta, k))
    state.camera.lookAt(pos.x, CAM.lookAtY, pos.z)
  }

  useFrame((state, delta) => {
    const pos = ref.current.position
    const store = useGameStore.getState()
    if (!store.started || store.topDown) return

    const cam = state.camera.position

    /* ---------- EMBARQUEMENT ---------- */
    if (store.boardingDoor) {
      const time = store.boardingTime
      if (time === 0) from.current.copy(pos)
      store.tickBoarding(delta)

      const d = DOORS.find((x) => x.id === store.boardingDoor)
      const p = THREE.MathUtils.clamp(
        (time - BOARDING.doorOpen) / (BOARDING.walkIn - BOARDING.doorOpen), 0, 1
      )
      const e = smoothstep(p)

      pos.x = THREE.MathUtils.lerp(from.current.x, d.x - d.nx * WALK_IN, e)
      pos.z = THREE.MathUtils.lerp(from.current.z, d.z - d.nz * WALK_IN, e)
      ref.current.rotation.y = Math.atan2(-d.nx, -d.nz)

      cam.x = THREE.MathUtils.lerp(cam.x, d.x + d.nx * 8, damp(delta, 3))
      cam.y = THREE.MathUtils.lerp(cam.y, 4, damp(delta, 2))
      cam.z = THREE.MathUtils.lerp(cam.z, d.z + d.nz * 8, damp(delta, 2))
      state.camera.lookAt(d.x, 1.6, d.z)
      return
    }

    /* ---------- DÉBARQUEMENT ---------- */
    if (store.landingDoor) {
      const time = store.landingTime
      const d = DOORS.find((x) => x.id === store.landingDoor)

      if (time === 0) {
        pos.set(d.x - d.nx * WALK_IN, 0.6, d.z - d.nz * WALK_IN)
        cam.set(d.x + d.nx * 8, 4, d.z + d.nz * 8)
        // le cran le plus proche de la normale de la porte
        sector.current = Math.round(Math.atan2(d.nx, d.nz) / STEP)
        yaw.current = sector.current * STEP
        dist.current = CAM.distance
      }
      store.tickLanding(delta)

      const p = THREE.MathUtils.clamp(
        (time - LANDING.routeChange) / (LANDING.walkOut - LANDING.routeChange), 0, 1
      )
      const e = smoothstep(p)

      pos.x = THREE.MathUtils.lerp(d.x - d.nx * WALK_IN, d.x + d.nx * STAND_OFF, e)
      pos.z = THREE.MathUtils.lerp(d.z - d.nz * WALK_IN, d.z + d.nz * STAND_OFF, e)
      ref.current.rotation.y = Math.atan2(d.nx, d.nz)

      placeCamera(state, pos, delta, 2.5)
      return
    }

    /* ---------- ROTATION PAR CRANS ---------- */
    if (keys.current.turn !== 0) {
      sector.current += keys.current.turn
      keys.current.turn = 0
    }

    // yaw rejoint le cran cible, par le plus court chemin
    const targetYaw = sector.current * STEP
    let dy = targetYaw - yaw.current
    while (dy >  Math.PI) dy -= Math.PI * 2
    while (dy < -Math.PI) dy += Math.PI * 2
    yaw.current += dy * damp(delta, CAM.turnSpeed)

    dist.current = THREE.MathUtils.clamp(
      dist.current + keys.current.zoomDelta, CAM.minDist, CAM.maxDist
    )
    keys.current.zoomDelta = 0

    /* ---------- DÉPLACEMENT, relatif au cran ---------- */
    const { forward, backward, left, right } = keys.current
    const f = (forward ? 1 : 0) - (backward ? 1 : 0)
    const r = (right ? 1 : 0) - (left ? 1 : 0)

    // on utilise le cran cible, pas le yaw lissé :
    // le déplacement ne dérive pas pendant la transition
    const sy = Math.sin(targetYaw)
    const cy = Math.cos(targetYaw)

    dir.current.set(-sy * f + cy * r, 0, -cy * f - sy * r)
    const usingKeyboard = dir.current.lengthSq() > 0

    if (usingKeyboard) {
      if (store.destination) store.setDestination(null)
      dir.current.normalize()
    } else if (store.destination) {
      const dx = store.destination.x - pos.x
      const dz = store.destination.z - pos.z
      if (dx * dx + dz * dz < ARRIVAL * ARRIVAL) {
        store.setDestination(null)
      } else {
        dir.current.set(dx, 0, dz).normalize()
      }
    }

    if (dir.current.lengthSq() > 0) {
      pos.addScaledVector(dir.current, SPEED * delta)
      clampToHall(pos)

      const target = Math.atan2(dir.current.x, dir.current.z)
      let diff = target - ref.current.rotation.y
      while (diff >  Math.PI) diff -= Math.PI * 2
      while (diff < -Math.PI) diff += Math.PI * 2
      ref.current.rotation.y += diff * damp(delta, TURN_SPEED)
    }

    placeCamera(state, pos, delta, SMOOTHNESS)

    /* ---------- PORTE LA PLUS PROCHE ---------- */
    let found = null
    for (const d of DOORS) {
      const dx = (d.x + d.nx * STAND_OFF) - pos.x
      const dz = (d.z + d.nz * STAND_OFF) - pos.z
      if (dx * dx + dz * dz < DOOR_RADIUS * DOOR_RADIUS) {
        found = d.id
        break
      }
    }
    store.setNearbyDoor(found)
  })

  return (
    <group ref={ref} position={[0, 0.6, 4]}>
      <mesh castShadow>
        <capsuleGeometry args={[0.3, 0.6, 8, 16]} />
        <meshStandardMaterial color="#e8a33d" />
      </mesh>
      <mesh position={[0, 0.1, 0.35]}>
        <boxGeometry args={[0.12, 0.12, 0.25]} />
        <meshStandardMaterial color="#2b3440" />
      </mesh>
    </group>
  )
}