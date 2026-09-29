import { useEffect, useMemo, useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useGameStore } from '../store/useGameStore'
import { BOUNDS, HALL, PALETTE as C, ENTREE } from '../config/world'
import { Wall } from './Terminal'

/* ---- CARRELAGE DU PARVIS ----
   Si le raccord a z = 9 se voit, ce sont ces trois valeurs qui
   se reglent : la taille du carreau d'abord, la teinte du joint
   ensuite. Rien d'autre n'a besoin de bouger. */
const CARREAU = 2
const C_CARREAU = '#f4f3f0'
const C_JOINT = '#dcdad5'

const FADE = 0.45          // duree du fondu du couloir, en secondes

/* ============================================================
   Dalle carrelee. Le repeat et l'offset sont calcules pour que
   la trame tombe sur les multiples de CARREAU en coordonnees
   MONDE, pas sur les bords du quad : la trame du parvis reste
   donc alignee sur celle du hall quelle que soit son emprise.
   ============================================================ */
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

/* ============================================================
   PARVIS — permanent. Sol plein de z = 9 a 27, ferme par des
   murs repris de Terminal : meme teinte, meme epaisseur, meme
   hauteur que ceux du hall.
   ============================================================ */
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

/* Joue du couloir. Meme boite que Wall, mais locale : il faut
   pouvoir toucher a son opacite, ce que Wall ne permet pas. */
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
   Au verrou la camera est ENCORE dans le couloir : le couper
   net ferait clignoter ses joues sur les bords du cadre. Le
   fondu est la seule sortie propre. Le groupe s'auto-detruit
   une fois l'opacite a zero.
   ============================================================ */
function Couloir() {
  const phase = useGameStore((s) => s.phase)
  const [monte, setMonte] = useState(true)
  const grp = useRef()
  const k = useRef(1)

  /* Les materiaux d'un GLB sont mis en cache par useGLTF : on les
     remet opaques au montage, sinon un rechargement a chaud les
     retrouverait a zero. */
  useEffect(() => {
    k.current = 1
    grp.current?.traverse((o) => {
      if (!o.isMesh) return
      for (const m of [].concat(o.material)) {
        m.transparent = false
        m.depthWrite = true
        m.opacity = 1
        m.needsUpdate = true
      }
    })
  }, [])

  useFrame((_, delta) => {
    if (!monte || phase !== 'hall' || !grp.current) return
    k.current = Math.max(0, k.current - delta / FADE)

    grp.current.traverse((o) => {
      if (!o.isMesh) return
      for (const m of [].concat(o.material)) {
        if (!m.transparent) {
          m.transparent = true
          m.depthWrite = false
          m.needsUpdate = true
        }
        m.opacity = k.current
      }
    })

    if (k.current <= 0) setMonte(false)
  })

  if (!monte) return null

  const { zBouche, zFond, demiLargeur: L } = ENTREE
  return (
    <group ref={grp}>
      <Joue x={-L} z1={zBouche} z2={zFond} />
      <Joue x={L} z1={zBouche} z2={zFond} />
      <Poste />
    </group>
  )
}

/* Si gen-props.sh n'a pas tourne sur securite/, commente les
   quatre imports et l'appel <Poste /> ci-dessus. */
import PortiqueDetection from './props/securite/PortiqueDetection'
import ScannerBagages from './props/securite/ScannerBagages'
import BureauControle from './props/securite/BureauControle'
import ChaiseControle from './props/securite/ChaiseControle'

function Poste() {
  return (
    <>
      <PortiqueDetection position={[0, 0, 16.5]} />
      <ScannerBagages   position={[2.0, 0, 17.6]} rotation-y={-Math.PI / 2} />
      <BureauControle   position={[-2.3, 0, 17.6]} rotation-y={Math.PI / 2} />
      <ChaiseControle   position={[-2.3, 0, 18.6]} rotation-y={Math.PI / 2} />
    </>
  )
}

/* ============================================================ */
export default function Entree() {
  return (
    <group>
      <Parvis />
      <Couloir />
    </group>
  )
}