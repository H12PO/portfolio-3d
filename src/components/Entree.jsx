import { useMemo, useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useGameStore } from '../store/useGameStore'
import { BOUNDS, HALL, PALETTE as C, ENTREE } from '../config/world'
import { Wall } from './Terminal'
import Props from './Props'


const CARREAU = 2
const C_CARREAU = '#f4f3f0'
const C_JOINT = '#dcdad5'
const FADE = 0.45

function Dalle({ x1, z1, x2, z2 }) {
  const map = useMemo(() => {
    const px = 256
    const cv = document.createElement('canvas')
    cv.width = cv.height = px
    const g = cv.getContext('2d')
    g.fillStyle = C_JOINT
    g.fillRect(0, 0, px, px)
    const j = Math.round(px * 0.022)
    g.fillStyle = C_CARREAU
    g.fillRect(j, j, px - 2 * j, px - 2 * j)

    const t = new THREE.CanvasTexture(cv)
    t.wrapS = t.wrapT = THREE.RepeatWrapping
    t.colorSpace = THREE.SRGBColorSpace
    t.anisotropy = 8
    t.repeat.set((x2 - x1) / CARREAU, (z2 - z1) / CARREAU)
    t.offset.set(x1 / CARREAU, -z2 / CARREAU)
    return t
  }, [x1, z1, x2, z2])

  return (
    <mesh position={[(x1 + x2) / 2, 0, (z1 + z2) / 2]}
          rotation-x={-Math.PI / 2} receiveShadow>
      <planeGeometry args={[x2 - x1, z2 - z1]} />
      <meshStandardMaterial map={map} />
    </mesh>
  )
}

function Parvis() {
  const { minX, maxX } = BOUNDS
  const { zBouche, zFond } = ENTREE
  return (
    <>
      <Dalle x1={minX} x2={maxX} z1={zBouche} z2={zFond} />
      <Wall a={[minX, zBouche]} b={[minX, zFond]} />
      <Wall a={[maxX, zBouche]} b={[maxX, zFond]} />
      <Wall a={[minX, zFond]} b={[maxX, zFond]} />
    </>
  )
}

const H_CLOISON = 2.2
const EP_CLOISON = 0.25
const C_RAIL = '#2f5d8a'

/* Cloison de contrôle, definie par ses deux extremites au sol,
   exactement comme Wall. Trois volumes au lieu d'un : la main
   courante et la plinthe cassent l'aplat et donnent l'echelle. */
function Cloison({ a, b }) {
  const dx = b[0] - a[0]
  const dz = b[1] - a[1]
  const len = Math.hypot(dx, dz)
  if (len < 0.05) return null

  const rotY = Math.atan2(dx, dz) + Math.PI / 2

  return (
    <group position={[(a[0] + b[0]) / 2, 0, (a[1] + b[1]) / 2]} rotation-y={rotY}>
      <mesh position={[0, H_CLOISON / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[len, H_CLOISON, EP_CLOISON]} />
        <meshStandardMaterial color={C.wall} />
      </mesh>

      <mesh position={[0, H_CLOISON + 0.04, 0]} castShadow>
        <boxGeometry args={[len, 0.08, EP_CLOISON + 0.09]} />
        <meshStandardMaterial color={C_RAIL} metalness={0.2} roughness={0.5} />
      </mesh>

      <mesh position={[0, 0.06, 0]} receiveShadow>
        <boxGeometry args={[len, 0.12, EP_CLOISON + 0.04]} />
        <meshStandardMaterial color={C.structure} />
      </mesh>
    </group>
  )
}
/* Poteau d'angle. Volontairement plus haut et plus epais que la
   cloison : il n'a plus rien a raccorder, donc plus rien ne peut
   mal se raccorder. */
function PoteauCloison({ x, z }) {
  const s = EP_CLOISON + 0.10
  const h = H_CLOISON + 0.18
  return (
    <group position={[x, 0, z]}>
      <mesh position={[0, h / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[s, h, s]} />
        <meshStandardMaterial color={C.wall} />
      </mesh>
      <mesh position={[0, h + 0.05, 0]} castShadow>
        <boxGeometry args={[s + 0.06, 0.1, s + 0.06]} />
        <meshStandardMaterial color={C_RAIL} metalness={0.2} roughness={0.5} />
      </mesh>
    </group>
  )
}
/* ============================================================
   COULOIR — se demonte lui-meme, en fondu.
   Au premier frame du fondu on CLONE les materiaux : ceux d'un
   GLB sont partages par useGLTF entre toutes les instances du
   meme fichier. Sans ce clone, faire fondre une barriere du
   couloir ferait disparaitre celles du hall, definitivement.
   ============================================================ */
function Couloir() {
  const phase = useGameStore((s) => s.phase)
  const [monte, setMonte] = useState(true)
  const grp = useRef()
  const k = useRef(1)
  const clone = useRef(false)

  useFrame((_, delta) => {
    if (!monte || phase !== 'hall' || !grp.current) return

    if (!clone.current) {
      clone.current = true
      grp.current.traverse((o) => {
        if (!o.isMesh) return
        o.material = Array.isArray(o.material)
          ? o.material.map((m) => m.clone())
          : o.material.clone()
        for (const m of [].concat(o.material)) {
          m.transparent = true
          m.depthWrite = false
        }
      })
    }

    k.current = Math.max(0, k.current - delta / FADE)
    grp.current.traverse((o) => {
      if (o.isMesh) for (const m of [].concat(o.material)) m.opacity = k.current
    })

    if (k.current <= 0) {
      grp.current.traverse((o) => {
        if (o.isMesh) for (const m of [].concat(o.material)) m.dispose()
      })
      setMonte(false)
    }
  })

    if (!monte) return null

  const { zBouche, zFond, demiLargeur: L } = ENTREE
  const { minX, maxX } = BOUNDS
  const zFront = zBouche + 0.5        // 9.5

  return (
    <group ref={grp}>
      {/* les deux joues, raccordees a la ligne de front */}
      <Cloison a={[-L, zFront]} b={[-L, zFond]} />
      <Cloison a={[L, zFront]} b={[L, zFond]} />
      <Cloison a={[minX, zFront]} b={[-L, zFront]} />
      <Cloison a={[L, zFront]} b={[maxX, zFront]} />

      <PoteauCloison x={-L} z={zFront} />
      <PoteauCloison x={L} z={zFront} />

      <Props zone="couloir" />
    </group>
  )

}

export default function Entree() {
  return (
    <group>
      <Parvis />
      <Couloir />
    </group>
  )
}