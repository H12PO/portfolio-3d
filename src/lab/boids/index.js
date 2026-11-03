// ============================================================
//  BOIDS : versions légères
//  mount()  : pour l'écran de la borne d'arcade : des scénarios qui
//             s'enchaînent, sur le fil principal (petits groupes).
//             A = couleurs suivantes, B = scénario suivant.
//  apercu() : l'image de la page Projets, une nuée déjà formée.
//  La page complète est dans page.jsx, sur le même moteur.
// ============================================================

import { creerMonde, avancer, poserObstacles, coteMonde } from './moteur'
import { imageDe } from './hote'
import { creerRendu2D } from './rendu2d'
import { scenario, DECORS } from './scenarios'

const DEMOS = [
  ['reynolds', { n: 700 }],
  ['faucons', { n: 800 }],
  ['foret', { n: 700 }],
  ['especes', { n: 800 }],
  ['tore', {}],
  ['etourneaux', { n: 1200 }],
]
const VUES_BORNE = ['especes', 'cap', 'peur']

function monde(i, graine) {
  const [id, r] = DEMOS[i]
  const s = scenario(id)
  const reglages = { ...s.r, ...r }
  const m = creerMonde(reglages, graine)
  if (s.obstacles) poserObstacles(m, DECORS[s.obstacles](coteMonde(reglages)))
  return m
}

/**
 * Contrat commun à tous les projets du labo.
 * @returns {{ pause, resume, input, unmount }}
 */
export function mount(canvas) {
  const rendu = creerRendu2D(canvas)
  let demo = 0
  let vue = 0
  let m = monde(0, 1)
  let raf = 0
  let debut = performance.now()

  function lancer(i) {
    demo = (i + DEMOS.length) % DEMOS.length
    m = monde(demo, 1 + Math.floor(Math.random() * 1e6))
    rendu.oublier()
    debut = performance.now()
  }

  function image(t) {
    raf = requestAnimationFrame(image)
    if (t - debut > 30000) lancer(demo + 1)
    avancer(m, m.p.modele === 'couzin' ? 1 : 2)
    rendu.redimensionner()
    const v = VUES_BORNE[vue]
    rendu.dessiner(imageDe(m), { vue: v === 'peur' && m.p.modele !== 'boids' ? 'especes' : v, especes: m.p.especes, traines: true })
  }

  const demarrer = () => { if (!raf) raf = requestAnimationFrame(image) }
  const arreter = () => { cancelAnimationFrame(raf); raf = 0 }
  demarrer()

  return {
    pause: arreter,
    resume: demarrer,
    input(bouton) {
      if (bouton === 'A') vue = (vue + 1) % VUES_BORNE.length
      if (bouton === 'B') lancer(demo + 1)
    },
    unmount: arreter,
  }
}

// Une image fixe : une nuée déjà formée, colorée par direction de vol
export function apercu(canvas) {
  const m = creerMonde({ n: 600, densite: 0.6 }, 5)
  avancer(m, 900)
  const r = creerRendu2D(canvas)
  r.dessiner(imageDe(m), { vue: 'cap' })
}
