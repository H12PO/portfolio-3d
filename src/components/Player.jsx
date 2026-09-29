import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import useInput from '../hooks/useInput'
import useDoorNavigation from '../hooks/useDoorNavigation'
import useInteraction from '../hooks/useInteraction'
import { useGameStore } from '../store/useGameStore'
import { clampToHall, clampToCouloir, isInsideHall, ENTREE } from '../config/world'
import { INTERACTIFS } from '../config/interactions'
import {
  DOORS, STAND_OFF, WALK_IN, BOARDING, LANDING,
} from '../config/doors'

const SPEED = 4
const SMOOTHNESS = 4
const ARRIVAL = 0.15
const TURN_SPEED = 10

/* ============================================================
   CAMÉRA — orientation fixe, suit le joueur en translation
   ============================================================ */
const CAM = {
  height: 2.5,
  distance: 13,
  minDist: 7,
  maxDist: 18,
  lookAtY: 2.0,
  wallMargin: 1.2,
}
/* Gabarit du joueur. Le chibi devra respecter cette hauteur totale ;
   son style vient des proportions, pas de la taille. */
const BODY_HEIGHT = 1.7
const BODY_RADIUS = 0.3
const BODY_Y = BODY_HEIGHT / 2                          // centre de la capsule
const CAPSULE_LEN = BODY_HEIGHT - 2 * BODY_RADIUS       // 1.10



/* Repère d'entrée → repère monde.
   La caméra regarde vers −Z, écran et monde coïncident : angle nul.
   Si son orientation change un jour, c'est la seule valeur à corriger. */
const INPUT_YAW = 0
const INPUT_COS = Math.cos(INPUT_YAW)
const INPUT_SIN = Math.sin(INPUT_YAW)


const smoothstep = (x) => x * x * (3 - 2 * x)
const damp = (delta, k = SMOOTHNESS) => 1 - Math.exp(-k * delta)

export default function Player() {
  const ref = useRef()
  useDoorNavigation()               // effets d'embarquement et de debarquement
  const interagir = useInteraction()
  const input = useInput(interagir)

  const dir = useRef(new THREE.Vector3())
  const from = useRef(new THREE.Vector3())
  const dist = useRef(CAM.distance)
  const camTarget = useRef(new THREE.Vector3())


  function placeCamera(state, pos, delta, k) {
    let d = dist.current
    while (d > CAM.minDist) {
      if (isInsideHall(pos.x, pos.z + d, CAM.wallMargin)) break
      d -= 0.5
    }

    camTarget.current.set(pos.x, pos.y + CAM.height, pos.z + d)
    state.camera.position.lerp(camTarget.current, damp(delta, k))
    state.camera.lookAt(pos.x, CAM.lookAtY, pos.z)
  }

  useFrame((state, delta) => {
    const pos = ref.current.position
    const store = useGameStore.getState()
    if (!store.started || store.mode !== 'play') return

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

      cam.x = THREE.MathUtils.lerp(cam.x, d.x + d.nx * 7, damp(delta, 3))
      cam.y = THREE.MathUtils.lerp(cam.y, 2.4, damp(delta, 2))
      cam.z = THREE.MathUtils.lerp(cam.z, d.z + d.nz * 7, damp(delta, 2))
      state.camera.lookAt(d.x, 1.6, d.z)
      return
    }

    /* ---------- DÉBARQUEMENT ---------- */
    if (store.landingDoor) {
      const time = store.landingTime
      const d = DOORS.find((x) => x.id === store.landingDoor)

      if (time === 0) {
        pos.set(d.x - d.nx * WALK_IN, BODY_Y, d.z - d.nz * WALK_IN)
        cam.set(d.x + d.nx * 7, 2.4, d.z + d.nz * 7)
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

        /* ---------- ZOOM ---------- */
    dist.current = THREE.MathUtils.clamp(
      dist.current + input.current.zoomDelta, CAM.minDist, CAM.maxDist
    )
    input.current.zoomDelta = 0

    /* ---------- DÉPLACEMENT ---------- */
    // dir n'est volontairement plus normalisé : sa longueur porte le
    // dosage de vitesse, ce qui rendra le joystick analogique gratuit.
    const enCouloir = store.phase === 'couloir'
    const move = input.current.move
    dir.current.set(
      move.x * INPUT_COS - move.z * INPUT_SIN,
      0,
      move.x * INPUT_SIN + move.z * INPUT_COS,
    )

    if (dir.current.lengthSq() > 1e-6) {
      pos.addScaledVector(dir.current, SPEED * delta)
      if (enCouloir) clampToCouloir(pos)
      else clampToHall(pos)

      const target = Math.atan2(dir.current.x, dir.current.z)
      let diff = target - ref.current.rotation.y
      while (diff >  Math.PI) diff -= Math.PI * 2
      while (diff < -Math.PI) diff += Math.PI * 2
      ref.current.rotation.y += diff * damp(delta, TURN_SPEED)
    }


        /* ---------- FRANCHISSEMENT DU POSTE ----------
       Un seul seuil desormais : clampToHall reprend la main ET
       le couloir se demonte. A cet instant la camera est a 15.5,
       le poste est a 16.5 donc deja derriere elle, et les joues
       ne depassent plus que de 50 cm devant : rien ne clignote. */
    if (enCouloir && pos.z < ENTREE.zVerrou) store.setPhase('hall')

    placeCamera(state, pos, delta, SMOOTHNESS)

    /* ---------- INTERACTIF LE PLUS PROCHE ---------- */
    // Le plus proche l'emporte, plutot que le premier trouve : utile
    // quand deux zones de detection se chevauchent.
    let found = null
    let best = Infinity
    for (const it of INTERACTIFS) {
      const dx = it.x - pos.x
      const dz = it.z - pos.z
      const d2 = dx * dx + dz * dz
      if (d2 < it.rayon * it.rayon && d2 < best) {
        best = d2
        found = it.id
      }
    }
    store.setNearby(found)
  })

  return (
    <group ref={ref} position={[0, BODY_Y, ENTREE.spawnZ]}>
      <mesh castShadow>
        <capsuleGeometry args={[BODY_RADIUS, CAPSULE_LEN, 8, 16]} />
        <meshStandardMaterial color="#e8a33d" />
      </mesh>
      <mesh position={[0, 0.55, 0.3]}>
        <boxGeometry args={[0.12, 0.12, 0.25]} />
        <meshStandardMaterial color="#2b3440" />
      </mesh>
    </group>
  )
}