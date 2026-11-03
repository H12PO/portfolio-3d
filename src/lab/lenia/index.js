// ============================================================
//  LENIA : versions légères
//  mount()  : pour l'écran de la borne d'arcade (sans boutons) :
//             des démonstrations qui s'enchaînent (Orbium, aquarium,
//             Flow Lenia à plusieurs espèces, planeurs de SmoothLife).
//  apercu() : l'image de la page Projets, composée sur le processeur
//             avec des créatures du bestiaire (aucune simulation).
// ============================================================

import { creerMoteur, PALETTES } from './moteur'
import { REGLES, CREATURES, PLANEURS_SL } from './bestiaire'
import { preparer } from './modeles'

const N = 128
const DEMOS = ['orbium', 'aquarium', 'flow', 'smooth']
const PALETTES_BORNE = Object.keys(PALETTES).filter((p) => p !== 'encre')
const creature = (id) => CREATURES.find((c) => c.id === id)

// Une goutte de matière au hasard (Flow Lenia)
function goutte(r) {
  const D = 2 * r + 1
  const v = new Float32Array(D * D)
  for (let y = 0; y < D; y++) for (let x = 0; x < D; x++) if (Math.hypot(x - r, y - r) <= r) v[y * D + x] = Math.random()
  return { w: D, h: D, canaux: [v] }
}

/**
 * Contrat commun à tous les projets du labo.
 * @returns {{ pause, resume, input, unmount }}
 */
export function mount(canvas) {
  const mo = creerMoteur(canvas)
  if (mo.erreur) return { pause() {}, resume() {}, input() {}, unmount() {} }
  const m = mo.creerMonde(N)
  let demo = 0
  let palette = 0
  let raf = 0
  let impair = false
  let debut = performance.now()

  function lancer(i) {
    demo = (i + DEMOS.length) % DEMOS.length
    debut = performance.now()
    const id = DEMOS[demo]
    if (id === 'orbium') {
      mo.activerEspeces(m, false)
      mo.regler(m, REGLES.orbium)
      mo.effacer(m)
      for (let k = 0; k < 4; k++) {
        const p = preparer(creature('orbium').cellules, Math.random() * 2 * Math.PI)
        mo.poser(m, p, Math.random() * N, Math.random() * N)
      }
    } else if (id === 'aquarium') {
      mo.activerEspeces(m, false)
      mo.regler(m, { ...REGLES.aquarium, T: 2 })
      mo.effacer(m)
      for (const [c, x, y] of [['gyrans', 30, 30], ['limus', 95, 40], ['lithos', 40, 95], ['tardus', 96, 96]]) {
        const p = preparer(creature(c).cellules, Math.random() * 2 * Math.PI)
        mo.poser(m, p, x - p.w / 2, y - p.h / 2)
      }
    } else if (id === 'flow') {
      mo.activerEspeces(m, true)
      mo.regler(m, REGLES.flow_cellules)
      mo.effacer(m)
      for (const [x, y] of [[34, 34], [94, 34], [34, 94], [94, 94]]) {
        const h = Array.from({ length: 10 }, () => 0.05 + 0.95 * Math.random())
        mo.poser(m, goutte(14), x - 14, y - 14, h)
      }
    } else {
      mo.activerEspeces(m, false)
      // quatre planeurs lisses (motifs pris pour ra = 21), puis des rubans quand ils se croisent
      const ra = 12
      mo.regler(m, { ...REGLES.smooth_planeurs, ra })
      mo.effacer(m)
      for (const [x, y] of [[32, 32], [96, 32], [32, 96], [96, 96]]) {
        const p = preparer(PLANEURS_SL.lisse, Math.random() * 2 * Math.PI, ra / 21)
        mo.poser(m, p, x - p.w / 2, y - p.h / 2)
      }
    }
  }

  function image(t) {
    raf = requestAnimationFrame(image)
    if (t - debut > 40000) lancer(demo + 1)
    impair = !impair
    if (impair) mo.pas(m) // un pas toutes les deux images
    const [W, H] = mo.redimensionner()
    const s = Math.max(W, H)
    mo.dessiner(m, [(W - s) / 2, (H - s) / 2, s, s], { palette: PALETTES_BORNE[palette] })
  }

  lancer(0)
  const demarrer = () => { if (!raf) raf = requestAnimationFrame(image) }
  const arreter = () => { cancelAnimationFrame(raf); raf = 0 }
  demarrer()

  return {
    pause: arreter,
    resume: demarrer,
    // Borne d'arcade : A = couleurs suivantes, B = démonstration suivante
    input(bouton) {
      if (bouton === 'A') palette = (palette + 1) % PALETTES_BORNE.length
      if (bouton === 'B') lancer(demo + 1)
    },
    unmount() {
      arreter()
      mo.liberer(m)
      mo.detruire()
    },
  }
}

// Une image fixe : quelques créatures de l'aquarium et des Orbium, dessinées à la main
export function apercu(canvas) {
  const W = canvas.width
  const H = canvas.height
  const img = new ImageData(W, H)
  for (let i = 0; i < W * H; i++) img.data.set([9, 10, 15, 255], i * 4)
  const e = Math.max(1, Math.min(W, H) / 110)
  const poser = (id, fx, fy, angle, couleurs) => {
    const p = preparer(creature(id).cellules, angle, e)
    const x0 = Math.round(fx * W - p.w / 2)
    const y0 = Math.round(fy * H - p.h / 2)
    for (let y = 0; y < p.h; y++) {
      for (let x = 0; x < p.w; x++) {
        const X = x0 + x
        const Y = y0 + y
        if (X < 0 || Y < 0 || X >= W || Y >= H) continue
        const k = (Y * W + X) * 4
        const v = p.canaux.map((c) => c[y * p.w + x])
        const rgb = couleurs(v)
        for (let c = 0; c < 3; c++) img.data[k + c] = Math.max(img.data[k + c], Math.min(255, rgb[c]))
      }
    }
  }
  const rvb = (v) => v.map((a) => 255 * a ** 0.8)
  const lenia = (v) => PALETTES.lenia(v[0])
  poser('gyrans', 0.22, 0.35, 0.4, rvb)
  poser('limus', 0.5, 0.62, 2.1, rvb)
  poser('lithos', 0.8, 0.32, 0, rvb)
  poser('orbium', 0.24, 0.78, 1.2, lenia)
  poser('orbium', 0.78, 0.8, 4.0, lenia)
  canvas.getContext('2d').putImageData(img, 0, 0)
}
