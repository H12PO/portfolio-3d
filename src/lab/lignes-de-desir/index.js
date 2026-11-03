// ============================================================
//  LIGNES DE DÉSIR : versions légères
//  mount()  : pour l'écran de la borne d'arcade : des scénarios qui
//             s'enchaînent, sur le fil principal.
//             A = marcheurs colorés par type, B = scénario suivant.
//  apercu() : l'image de la page Projets, un square déjà sillonné.
//  La page complète est dans page.jsx, sur le même moteur.
// ============================================================

import { creerMonde, avancer, imageDe, JOUR } from './moteur'
import { creerRendu2D } from './rendu2d'
import { TERRAINS, scenario } from './scenarios'

const DEMOS = ['square', 'campus', 'quatre', 'aeroport', 'fourragement', 'pontInegal']

function monde(i, graine) {
  const s = scenario(DEMOS[i])
  return creerMonde(TERRAINS[s.terrain](), s.r, graine)
}

/**
 * Contrat commun à tous les projets du labo.
 * @returns {{ pause, resume, input, unmount }}
 */
export function mount(canvas) {
  const rendu = creerRendu2D(canvas)
  let demo = 0
  let types = false
  let m = monde(0, 1)
  let raf = 0
  let debut = performance.now()

  function lancer(i) {
    demo = (i + DEMOS.length) % DEMOS.length
    m = monde(demo, 1 + Math.floor(Math.random() * 1e6))
    debut = performance.now()
  }

  let tampons = {}
  function image(t) {
    raf = requestAnimationFrame(image)
    if (t - debut > 40000) lancer(demo + 1)
    avancer(m, m.p.modele === 'fourmis' ? 3 : 8)
    rendu.redimensionner()
    const img = imageDe(m, tampons, true)
    tampons = img
    rendu.dessiner(img, { vue: types ? 'types' : 'sol', noms: false })
  }

  const demarrer = () => { if (!raf) raf = requestAnimationFrame(image) }
  const arreter = () => { cancelAnimationFrame(raf); raf = 0 }
  demarrer()

  return {
    pause: arreter,
    resume: demarrer,
    input(bouton) {
      if (bouton === 'A') types = !types
      if (bouton === 'B') lancer(demo + 1)
    },
    unmount: arreter,
  }
}

// Une image fixe : le square après quelques jours de passages
export function apercu(canvas) {
  const s = scenario('square')
  const m = creerMonde(TERRAINS[s.terrain](), s.r, 7)
  avancer(m, 5 * JOUR)
  const r = creerRendu2D(canvas)
  r.dessiner(imageDe(m), { noms: false })
}
