// ============================================================
//  ÉPICYCLES DE FOURIER : versions légères
//  mount()  : pour l'écran de la borne d'arcade : des formes qui
//             s'enchaînent ; à chaque tour, on ajoute des cercles.
//             A = montrer ou cacher les cercles, B = forme suivante.
//  apercu() : l'image de la page Projets, un cœur et ses cercles.
//  La page complète est dans page.jsx, sur le même moteur.
// ============================================================

import { preparer, approximation } from './moteur'
import { FORMES } from './formes'
import { creerRendu2D } from './rendu2d'

const DEMOS = ['coeur', 'avion', 'etoile', 'koch', 'mars', 'poisson', 'spirographe', 'carre']
const MARCHES = [1, 2, 3, 5, 8, 13, 21, 34, 60, 120]     // cercles ajoutés tour après tour
const PERIODE = 7                                        // secondes par tour

/**
 * Contrat commun à tous les projets du labo.
 * @returns {{ pause, resume, input, unmount }}
 */
export function mount(canvas) {
  const rendu = creerRendu2D(canvas)
  let demo = 0
  let marche = 0
  let cercles = true
  let prep = preparer(FORMES[DEMOS[0]], 'vitesse', 1024)
  let approx = approximation(prep.c, prep.ordres.amplitude, MARCHES[0])
  let t = 0
  let raf = 0
  let avant = 0

  function lancer(i) {
    demo = (i + DEMOS.length) % DEMOS.length
    prep = preparer(FORMES[DEMOS[demo]], 'vitesse', 1024)
    marche = 0
    approx = approximation(prep.c, prep.ordres.amplitude, MARCHES[0])
    t = 0
  }

  function image(now) {
    raf = requestAnimationFrame(image)
    const dt = avant ? Math.min(0.1, (now - avant) / 1000) : 0
    avant = now
    t += dt / PERIODE
    if (t >= 1) {
      t -= 1
      marche++
      if (marche >= MARCHES.length) lancer(demo + 1)
      else approx = approximation(prep.c, prep.ordres.amplitude, MARCHES[marche])
    }
    rendu.redimensionner()
    rendu.dessiner({ origine: prep.echantillons, approx, t, options: { cercles, courbe: false } })
  }

  const demarrer = () => { if (!raf) { avant = 0; raf = requestAnimationFrame(image) } }
  const arreter = () => { cancelAnimationFrame(raf); raf = 0 }
  demarrer()

  return {
    pause: arreter,
    resume: demarrer,
    input(bouton) {
      if (bouton === 'A') cercles = !cercles
      if (bouton === 'B') lancer(demo + 1)
    },
    unmount: arreter,
  }
}

// Une image fixe : le cœur, ses cercles, et le tracé déjà fait aux deux tiers
export function apercu(canvas) {
  const prep = preparer(FORMES.coeur, 'vitesse', 1024)
  const approx = approximation(prep.c, prep.ordres.amplitude, 24)
  const r = creerRendu2D(canvas)
  r.dessiner({ origine: prep.echantillons, approx, t: 0.68, options: { courbe: false } })
}
