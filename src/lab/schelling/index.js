// ============================================================
//  SCHELLING : versions légères
//  mount()  : pour l'écran de la borne d'arcade (sans boutons) :
//             des scénarios qui s'enchaînent, une ville de 64 × 64.
//  apercu() : l'image de la page Projets, une ville déjà séparée.
//  La page complète est dans page.jsx, sur le même moteur.
// ============================================================

import { creerVille, avancer } from './moteur'
import { creerRendu } from './rendu'
import { scenario } from './scenarios'

const DEMOS = ['damier', 'mixite', 'revenus', 'discrimination', 'bruit']
const VUES_BORNE = ['groupes', 'satisfaction', 'revenus']
const TAILLE = 64

const ville = (id, graine) => creerVille({ ...scenario(id).a, taille: TAILLE }, graine)

/**
 * Contrat commun à tous les projets du labo.
 * @returns {{ pause, resume, input, unmount }}
 */
export function mount(canvas) {
  const rendu = creerRendu(canvas)
  let demo = 0
  let vue = 0
  let v = ville(DEMOS[0], 1)
  let raf = 0
  let debut = performance.now()

  function lancer(i) {
    demo = (i + DEMOS.length) % DEMOS.length
    v = ville(DEMOS[demo], 1 + Math.floor(Math.random() * 1e6))
    debut = performance.now()
  }

  function image(t) {
    raf = requestAnimationFrame(image)
    if (t - debut > 30000) lancer(demo + 1)
    avancer(v, 0.1)
    rendu.dessiner([v], VUES_BORNE[vue])
  }

  const demarrer = () => { if (!raf) raf = requestAnimationFrame(image) }
  const arreter = () => { cancelAnimationFrame(raf); raf = 0 }
  demarrer()

  return {
    pause: arreter,
    resume: demarrer,
    // Borne d'arcade : A = vue suivante, B = scénario suivant
    input(bouton) {
      if (bouton === 'A') vue = (vue + 1) % VUES_BORNE.length
      if (bouton === 'B') lancer(demo + 1)
    },
    unmount: arreter,
  }
}

// Une image fixe : le damier de Schelling, déjà séparé en quartiers
export function apercu(canvas) {
  const v = creerVille({ tolerance: [0.45, 0.45], taille: 72 }, 7)
  avancer(v, 30)
  creerRendu(canvas).dessiner([v], 'groupes')
}
