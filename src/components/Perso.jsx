/* ============================================================
   Perso : le personnage animé (public/models/perso/perso.glb)

   Ce composant se débrouille seul :
   - il mesure sa propre vitesse d'une image à l'autre : Idle à
     l'arrêt, Marche quand il va doucement, Course au-delà. Rien
     à brancher dans Player.jsx, il suffit de le mettre dans le
     groupe qui se déplace ;
   - à l'arrêt, de temps en temps, il joue une variante d'Idle
     (téléphone, coucou) une seule fois, puis revient à l'Idle ;
   - la bouche passe en douceur d'une expression à l'autre :
     prop `expression` ("Sourire", "Neutre", "Triste",
     "Grand_Sourire", "Surpris"). Une variante peut imposer la
     sienne le temps qu'elle dure ;
   - il cache au chargement les zones de corps couvertes par un
     vêtement (propriété "masque" posée dans Blender).

   Origine aux pieds, regard vers +Z : même convention que la
   rotation de Player.jsx.
   ============================================================ */
import { useEffect, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGLTF, useAnimations } from '@react-three/drei'
import * as THREE from 'three'

const URL = '/models/perso/perso.glb'

const VITESSE_MARCHE = 1.5   // m/s : vitesses où les pieds ne glissent pas (script 05)
const VITESSE_COURSE = 4.0
const SEUIL_MARCHE = 0.2     // m/s : en dessous, il est à l'arrêt
// Marche -> Course au-dessus de 2.8 m/s, retour en dessous de 2.3 :
// l'écart évite de clignoter entre les deux autour du seuil.
const SEUIL_COURSE = [2.3, 2.8]
const FONDU = 0.25           // s : fondu entre deux animations

// Variantes d'Idle : jouées une fois, au hasard, pendant l'attente.
const VARIANTES = [
  { nom: 'Idle_Telephone', bouche: null },
  { nom: 'Idle_Coucou', bouche: 'Grand_Sourire' },
]
const ATTENTE = [6, 14]      // s d'Idle avant de tenter une variante
const CHANCE = 0.5           // probabilité de jouer une variante à chaque tentative

const alea = () => ATTENTE[0] + Math.random() * (ATTENTE[1] - ATTENTE[0])
const damp = (dt, k) => 1 - Math.exp(-k * dt)

export default function Perso({ expression = 'Sourire', ...props }) {
  const groupe = useRef()
  const { scene, animations } = useGLTF(URL)
  const { actions, mixer } = useAnimations(animations, groupe)

  const etat = useRef({
    courant: null,
    variante: null,
    attente: alea(),
    vitesse: 0,
    avant: new THREE.Vector3(),
    ici: new THREE.Vector3(),
    pret: false,
    bouche: null,
  })

  // --- Préparation : ombres, zones masquées, bouche
  useEffect(() => {
    const masques = new Set()
    scene.traverse((o) => {
      if (o.userData?.masque) o.userData.masque.split(',').forEach((n) => masques.add(n))
    })
    scene.traverse((o) => {
      if (o.isMesh) {
        o.castShadow = true
        o.receiveShadow = true
        o.frustumCulled = false   // un maillage skinné peut sortir de sa boîte en s'animant
      }
      if (masques.has(o.name)) o.visible = false
      if (o.name === 'VIS_Bouche' && o.morphTargetDictionary) etat.current.bouche = o
    })
  }, [scene])

  // --- Jouer une animation, en fondu depuis la précédente
  const jouer = (nom, boucle = true) => {
    const e = etat.current
    const a = actions[nom]
    if (!a || e.courant === nom) return
    a.reset()
    a.setLoop(boucle ? THREE.LoopRepeat : THREE.LoopOnce, boucle ? Infinity : 1)
    a.clampWhenFinished = !boucle
    a.fadeIn(FONDU).play()
    if (e.courant && actions[e.courant]) actions[e.courant].fadeOut(FONDU)
    e.courant = nom
  }

  // --- Fin d'une variante : retour à l'Idle
  useEffect(() => {
    const fin = (ev) => {
      const e = etat.current
      if (e.variante && ev.action === actions[e.variante.nom]) {
        e.variante = null
        jouer('Idle')
      }
    }
    mixer.addEventListener('finished', fin)
    return () => mixer.removeEventListener('finished', fin)
  }, [mixer, actions])

  useFrame((_, dt) => {
    const e = etat.current
    if (!groupe.current || !actions.Idle) return

    // vitesse horizontale mesurée sur la position réelle
    groupe.current.getWorldPosition(e.ici)
    if (!e.pret) {
      e.avant.copy(e.ici)
      e.pret = true
      jouer('Idle')
    }
    const dx = e.ici.x - e.avant.x
    const dz = e.ici.z - e.avant.z
    const v = Math.sqrt(dx * dx + dz * dz) / Math.max(dt, 1e-3)
    e.avant.copy(e.ici)
    e.vitesse = THREE.MathUtils.lerp(e.vitesse, v, damp(dt, 10))

    if (e.vitesse > SEUIL_MARCHE) {
      e.variante = null
      e.attente = alea()
      const court = e.courant === 'Course'
        ? e.vitesse > SEUIL_COURSE[0]
        : e.vitesse > SEUIL_COURSE[1]
      if (court && actions.Course) {
        jouer('Course')
        actions.Course.timeScale = e.vitesse / VITESSE_COURSE
      } else {
        jouer('Marche')
        actions.Marche.timeScale = e.vitesse / VITESSE_MARCHE
      }
    } else if (!e.variante) {
      jouer('Idle')
      e.attente -= dt
      if (e.attente <= 0) {
        e.attente = alea()
        if (Math.random() < CHANCE) {
          e.variante = VARIANTES[Math.floor(Math.random() * VARIANTES.length)]
          jouer(e.variante.nom, false)
        }
      }
    }

    // bouche : chaque expression glisse vers 1 (la cible) ou 0
    const b = e.bouche
    if (b) {
      const cible = e.variante?.bouche ?? expression
      for (const [nom, i] of Object.entries(b.morphTargetDictionary)) {
        const t = nom === cible ? 1 : 0
        b.morphTargetInfluences[i] = THREE.MathUtils.lerp(b.morphTargetInfluences[i], t, damp(dt, 12))
      }
    }
  })

  return (
    <group ref={groupe} {...props} dispose={null}>
      <primitive object={scene} />
    </group>
  )
}

useGLTF.preload(URL)