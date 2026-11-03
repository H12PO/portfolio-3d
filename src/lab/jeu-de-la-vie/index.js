// ============================================================
//  JEU DE LA VIE : versions légères
//  mount()  : pour l'écran de la borne d'arcade (sans boutons)
//  apercu() : l'image réelle affichée sur la page Projets
//  La page du site, elle, est dans page.jsx, sur le même moteur.
// ============================================================

import { creerMonde, avancer, placer, soupe } from './moteur.js'
import { creerRendu } from './rendu'
import { motif } from './motifs.js'

/**
 * Contrat commun à tous les projets du labo.
 * @param canvas  le <canvas> fourni (écran de la borne, ou page sans page.jsx)
 * @param mode    'page' | 'arcade'
 * @returns {{ pause, resume, input, unmount }}
 */
export function mount(canvas, { mode = 'arcade', theme = 'sombre' } = {}) {
  const taille = mode === 'arcade' ? 160 : 320
  const monde = creerMonde({ W: taille, H: taille, bords: 'tore' })
  const rendu = creerRendu(canvas, monde)
  let raf = 0
  let calme = 0 // générations sans changement de population : la soupe s'est éteinte

  function nouvelleSoupe() {
    soupe(monde, { cote: taille, densite: 0.3 })
    rendu.recentrer({ x0: 0, y0: 0, x1: taille - 1, y1: taille - 1 })
    calme = 0
  }

  function image() {
    const avant = monde.population
    avancer(monde, 1)
    calme = monde.population === avant ? calme + 1 : 0
    if (calme > 300) nouvelleSoupe()
    rendu.dessiner({ effets: { age: true, trainees: true }, theme })
    raf = requestAnimationFrame(image)
  }

  const demarrer = () => { if (!raf) raf = requestAnimationFrame(image) }
  const arreter = () => { cancelAnimationFrame(raf); raf = 0 }

  nouvelleSoupe()
  demarrer()

  return {
    pause: arreter,
    resume: demarrer,
    // Borne d'arcade : A = lâcher un planeur au hasard, B = nouvelle soupe
    input(bouton) {
      if (bouton === 'A') {
        const p = motif('planeur')
        placer(monde, p.cellules, Math.floor(Math.random() * taille), Math.floor(Math.random() * taille))
      }
      if (bouton === 'B') nouvelleSoupe()
    },
    unmount: arreter,
  }
}

// Une image fixe : le canon de Gosper après 300 générations, avec son train de planeurs.
// Monde de 160 × 96 cases, aux proportions de la vignette de la page Projets.
export function apercu(canvas, { theme = 'clair' } = {}) {
  const monde = creerMonde({ W: 160, H: 96 })
  placer(monde, motif('gosper').cellules, 30, 6)
  avancer(monde, 300)
  const rendu = creerRendu(canvas, monde)
  rendu.recentrer({ x0: 26, y0: 4, x1: 126, y1: 88 })
  rendu.dessiner({ effets: { age: true }, theme })
}
