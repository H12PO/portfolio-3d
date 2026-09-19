import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

import BagageMallette from '../bagages/BagageMallette'
import BagageSacADos from '../bagages/BagageSacADos'
import BagageSacMarin from '../bagages/BagageSacMarin'
import BagageSacVoyage from '../bagages/BagageSacVoyage'
import BagageValiseCabine from '../bagages/BagageValiseCabine'
import BagageValiseRigide from '../bagages/BagageValiseRigide'

/**
 * Pose de chaque modele sur le tapis.
 *   inclinaison : rotation autour de X. Une valise rigide voyage couchee
 *                 sur le dos, un sac souple reste pose.
 *   hauteur     : correction verticale, une valise couchee descend.
 */
const MODELES = [
  { C: BagageValiseRigide, inclinaison: -Math.PI / 2, hauteur: -0.14 },
  { C: BagageValiseCabine, inclinaison: -Math.PI / 2, hauteur: -0.11 },
  { C: BagageMallette,     inclinaison: 0, hauteur: 0 },
  { C: BagageSacVoyage,    inclinaison: 0, hauteur: 0 },
  { C: BagageSacMarin,     inclinaison: 0, hauteur: 0 },
  { C: BagageSacADos,      inclinaison: 0, hauteur: 0 },
]

// Douze teintes, choisies pour se lire a 13 m sans jurer avec le hall.
const TEINTES = [
  '#c0392b', '#e07a3f', '#d9a441', '#7d9a4a',
  '#3f7d6e', '#3d6b8f', '#4a4e8f', '#7a4a8f',
  '#b05a7a', '#8a6a4f', '#4a5460', '#d6cfc2',
]

// Un agent ne pose jamais un bagage parfaitement aligne. Six ecarts figes,
// pris a tour de role : rien qui change au hasard entre deux rendus.
const DEVIATIONS = [0.09, -0.21, 0.31, -0.06, 0.17, -0.13]

// Trace du tapis, en coordonnees LOCALES du carrousel.
const POINTS = [
  [-1.05, 0.45, -5.90],
  [-1.05, 0.45, -3.00],
  [-1.05, 0.45, -0.20],
  [-0.95, 0.45,  0.60],
  [-0.45, 0.45,  1.02],
  [ 0.40, 0.45,  1.05],
  [ 1.90, 0.45,  1.05],
]

const NB = 6         // bagages simultanes
const DUREE = 30      // secondes pour un tour complet

const _pos = new THREE.Vector3()
const _tan = new THREE.Vector3()

export default function CarrouselBagages() {
    const courbe = useMemo(() => {
    const c = new THREE.CatmullRomCurve3(POINTS.map((p) => new THREE.Vector3(...p)))
    c.arcLengthDivisions = 400        // echantillonnage fin : espacement regulier
    return c
  }, [])

  // Etat des bagages dans un ref, jamais dans un state : un setState a
  // chaque rebouclage remonterait les groupes et casserait les references
  // que useFrame utilise pour les deplacer.
  const lots = useRef(Array.from({ length: NB }, (_, i) => ({
    modele: i % MODELES.length,
    teinte: (i * 5) % TEINTES.length,
    ecart: i % DEVIATIONS.length,
  })))

  const refs = useRef([])
  const avance = useRef(Array.from({ length: NB }, (_, i) => i / NB))
  const cycle = useRef(0)

  useFrame((_, delta) => {
    for (let i = 0; i < refs.current.length; i++) {
      const g = refs.current[i]
      if (!g) continue
      const l = lots.current[i]

      let t = avance.current[i] + delta / DUREE
      let reboucle = false
      if (t > 1) { t -= 1; reboucle = true }
      avance.current[i] = t

      courbe.getPointAt(t, _pos)
      courbe.getTangentAt(t, _tan)
      g.position.copy(_pos)
      g.position.y -= MODELES[l.modele].hauteur
      g.rotation.y = Math.atan2(_tan.x, _tan.z) + DEVIATIONS[l.ecart]

      // Un bagage qui repasse l'entree change de couleur et d'angle.
      // La couleur est ecrite directement sur le materiau clone par
      // useTeinte, donc sans repasser par un rendu React.
      if (reboucle) {
        const n = (cycle.current += 1)
        l.teinte = (l.teinte + 5 + (n % 4)) % TEINTES.length
        l.ecart = (l.ecart + 1) % DEVIATIONS.length
        g.traverse((o) => {
          if (o.isMesh && o.material.name === 'M_Bagage_Coque') {
            o.material.color.set(TEINTES[l.teinte])
          }
        })
      }
    }
  })

  return (
    <group>
      {lots.current.map(({ modele, teinte }, i) => {
        const { C, inclinaison } = MODELES[modele]
        return (
          <group key={i} ref={(o) => (refs.current[i] = o)}>
            <C couleur={TEINTES[teinte]} rotation-x={inclinaison} />
          </group>
        )
      })}
    </group>
  )
}