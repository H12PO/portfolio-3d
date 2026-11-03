// ============================================================
//  FRACTALES : versions légères
//  mount()  : pour l'écran de la borne d'arcade (sans boutons) :
//             une Julia qui se déforme lentement, c tournant autour
//             de l'ensemble de Mandelbrot.
//  apercu() : l'image affichée sur la page Projets, calculée sur le
//             processeur (pas besoin de la carte graphique).
//  La page du site, elle, est dans page.jsx.
// ============================================================

import { creerRendu } from './rendu'
import { rendreCPU } from './cpu.js'
import { LIEUX, PALETTES } from './formules.js'

const PALETTES_BORNE = Object.keys(PALETTES).filter((p) => p !== 'encre')

/**
 * Contrat commun à tous les projets du labo.
 * @param canvas  le <canvas> fourni (écran de la borne, ou page sans page.jsx)
 * @returns {{ pause, resume, input, unmount }}
 */
export function mount(canvas) {
  const rendu = creerRendu(canvas)
  if (rendu.erreur) return { pause() {}, resume() {}, input() {}, unmount() {} }
  let raf = 0
  let angle = 0
  let palette = 0
  let mode = 'julia' // 'julia' : la Julia qui se déforme ; 'plongee' : un zoom lent dans Mandelbrot
  let zoom = 1
  const cible = LIEUX.mandelbrot.find((l) => l.id === 'spirale')

  function image(t) {
    raf = requestAnimationFrame(image)
    const commun = { iter: 300, palette: PALETTES_BORNE[palette], densite: 1 / 24, decalage: (t * 0.00005) % 1, relief: true, bords: true }
    if (mode === 'julia') {
      angle += 0.0025
      const c = [0.7885 * Math.cos(angle), 0.7885 * Math.sin(angle)]
      rendu.image({ ...commun, id: 'mandelbrot', x: 0, y: 0, zoom: 0.95, julia: c }, t)
    } else {
      zoom *= 1.004
      if (zoom > 4e4) zoom = 1
      const k = 1 / Math.sqrt(zoom)
      rendu.image({ ...commun, id: 'mandelbrot', x: cible.x + (-0.6 - cible.x) * k, y: cible.y * (1 - k), zoom, iter: Math.round(300 + 200 * Math.log10(zoom)) }, t)
    }
  }

  const demarrer = () => { if (!raf) raf = requestAnimationFrame(image) }
  const arreter = () => { cancelAnimationFrame(raf); raf = 0 }
  demarrer()

  return {
    pause: arreter,
    resume: demarrer,
    // Borne d'arcade : A = palette suivante, B = passer de la Julia à la plongée
    input(bouton) {
      if (bouton === 'A') palette = (palette + 1) % PALETTES_BORNE.length
      if (bouton === 'B') {
        mode = mode === 'julia' ? 'plongee' : 'julia'
        zoom = 1
      }
    },
    unmount() {
      arreter()
      rendu.detruire()
    },
  }
}

// Une image fixe : la vallée des hippocampes, calculée sur le processeur
export function apercu(canvas) {
  const W = canvas.width
  const H = canvas.height
  const lieu = LIEUX.mandelbrot.find((l) => l.id === 'hippocampes')
  const px = rendreCPU({ id: 'mandelbrot', largeur: W, hauteur: H, x: lieu.x, y: lieu.y, zoom: lieu.zoom * 0.6, iter: 300, palette: 'ultra', densite: 2 })
  canvas.getContext('2d').putImageData(new ImageData(px, W, H), 0, 0)
}
