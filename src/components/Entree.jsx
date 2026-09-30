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

function Joue({ x, z1, z2 }) {
  return (
    <mesh position={[x, HALL.wallHeight / 2, (z1 + z2) / 2]} receiveShadow>
      <boxGeometry args={[0.45, HALL.wallHeight, Math.abs(z2 - z1)]} />
      <meshStandardMaterial color={C.wall} />
    </mesh>
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
  return (
    <group ref={grp}>
      <Joue x={-L} z1={zBouche} z2={zFond} />
      <Joue x={L} z1={zBouche} z2={zFond} />
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