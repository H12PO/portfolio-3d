// ============================================================
//  FOURMI DE LANGTON — versions légères
//  mount()  : pour l'écran de la borne d'arcade (sans boutons)
//  apercu() : l'image réelle affichée sur la page Projets
//  La page du site, elle, est dans page.jsx, sur le même moteur.
// ============================================================

import { creerMonde, avancer, regleLettres, changerRegle } from './moteur'
import { creerRendu } from './rendu'
import { PRESETS_LETTRES } from './presets'

const SANS_EFFET = { surligneur: false, quadrillage: false, passages: false }

/**
 * Contrat commun à tous les projets du labo.
 * @param canvas  le <canvas> fourni (écran de la borne, ou page sans page.jsx)
 * @param mode    'page' | 'arcade'
 * @returns {{ pause, resume, input, unmount }}
 */
export function mount(canvas, { mode = 'arcade', theme = 'sombre' } = {}) {
  const taille = mode === 'arcade' ? 160 : 320
  const monde = creerMonde({ W: taille, H: taille, regle: regleLettres('RL'), bords: 'tore' })
  const rendu = creerRendu(canvas, monde)
  let preset = 0
  let raf = 0

  function image() {
    avancer(monde, Math.min(1000, 1 + Math.floor(monde.pas / 100)))
    rendu.dessiner({ effets: { ...SANS_EFFET, surligneur: true }, auto: true, theme })
    raf = requestAnimationFrame(image)
  }

  const demarrer = () => { if (!raf) raf = requestAnimationFrame(image) }
  const arreter = () => { cancelAnimationFrame(raf); raf = 0 }

  function suivante() {
    preset = (preset + 1) % PRESETS_LETTRES.length
    changerRegle(monde, regleLettres(PRESETS_LETTRES[preset].lettres))
    rendu.vider()
    rendu.recentrer()
  }

  demarrer()

  return {
    pause: arreter,
    resume: demarrer,
    // Borne d'arcade : A = pause / reprise, B = règle suivante
    input(bouton) {
      if (bouton === 'A') { if (raf) arreter(); else demarrer() }
      if (bouton === 'B') suivante()
    },
    unmount: arreter,
  }
}

// Une image fixe : la fourmi juste après le début de l'autoroute
export function apercu(canvas, { theme = 'clair' } = {}) {
  const monde = creerMonde({ W: 320, H: 220, regle: regleLettres('RL') })
  avancer(monde, 11800)
  const rendu = creerRendu(canvas, monde)
  rendu.recentrer()
  rendu.dessiner({ effets: SANS_EFFET, auto: false, theme })
}
