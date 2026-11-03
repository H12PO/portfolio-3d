import { SOL } from './terrain.js'
import { chasse, estSatisfait } from './moteur.js'

// ============================================================
//  SCHELLING : le dessin (Canvas 2D)
//  Une ville est peinte case par case dans une image (ImageData),
//  à une échelle entière : chaque case devient un carré de s × s
//  pixels, avec un joint d'un pixel quand la place le permet.
//  Vues : groupes, satisfaction, revenus, loyers, attrait.
// ============================================================

// Couleurs des groupes : palette d'Okabe et Ito, lisible par les daltoniens
export const COULEURS_GROUPES = ['#E69F00', '#56B4E9', '#009E73', '#CC79A7', '#F0E442']
export const COULEURS_SATISFACTION = { oui: '#56B4E9', non: '#D55E00', chasse: '#F0E442' }
export const VUES = ['groupes', 'satisfaction', 'revenus', 'loyers', 'attrait']
export const FOND = '#0d0f14'

// Rampe perceptive (inspirée de viridis), de 0 à 1
const RAMPE = ['#440154', '#3b528b', '#21918c', '#5ec962', '#fde725']

const rvb = (hex) => [1, 3, 5].map((k) => parseInt(hex.slice(k, k + 2), 16))
// Pixel RGBA pour une vue Uint32 (ordre des octets du processeur : petit-boutiste partout en pratique)
const pixel = ([r, g, b]) => ((255 << 24) | (b << 16) | (g << 8) | r) >>> 0

const P_GROUPES = COULEURS_GROUPES.map((c) => pixel(rvb(c)))
const P_SAT = [COULEURS_SATISFACTION.non, COULEURS_SATISFACTION.oui, COULEURS_SATISFACTION.chasse].map((c) => pixel(rvb(c)))
const P_FOND = pixel(rvb(FOND))
const P_VIDE = pixel(rvb('#1d2029'))
const P_VIDE_SOCIAL = pixel(rvb('#2e2747'))
const P_TROU = pixel(rvb('#0d0f14'))
const P_SOL = [0, pixel(rvb('#163a59')), pixel(rvb('#1d4a2f')), pixel(rvb('#4a4d56'))]
const LUT = (() => {
  const t = new Uint32Array(256)
  const pts = RAMPE.map(rvb)
  for (let k = 0; k < 256; k++) {
    const x = (k / 255) * (pts.length - 1)
    const a = Math.min(pts.length - 2, Math.floor(x))
    const f = x - a
    t[k] = pixel(pts[a].map((c, j) => Math.round(c + (pts[a + 1][j] - c) * f)))
  }
  return t
})()
const rampe = (x) => LUT[Math.max(0, Math.min(255, Math.round(x * 255)))]
export const couleurRampe = (x) => {
  const p = rampe(x)
  return `rgb(${p & 255}, ${(p >> 8) & 255}, ${(p >> 16) & 255})`
}

/** Couleur d'une case selon la vue */
function couleur(v, c, vue) {
  const s = v.sol[c]
  if (s !== SOL.HABITABLE) return P_SOL[s]
  const a = v.occ[c]
  if (vue === 'loyers') return v.p.loyers > 0 ? rampe(v.loyer[c]) : P_VIDE
  if (vue === 'attrait') return a >= 0 ? rampe(v.attrait[c]) : rampe(v.attrait[c] * 0.55)
  if (a < 0) return v.social[c] ? P_VIDE_SOCIAL : P_VIDE
  if (vue === 'revenus') return rampe(v.revenu[a])
  if (vue === 'satisfaction') {
    if (chasse(v, a)) return P_SAT[2]
    return P_SAT[estSatisfait(v, a)]
  }
  return P_GROUPES[v.groupe[a]]
}

/**
 * Prépare le dessin dans un canvas.
 * dessiner(villes, vue) peint une ville, ou deux côte à côte, et renvoie leurs cadres
 * [x, y, côté en pixels, échelle] pour retrouver la case sous le pointeur.
 */
export function creerRendu(canvas) {
  const ctx = canvas.getContext('2d')
  let image = null
  let mots = null

  function redimensionner() {
    const e = Math.min(window.devicePixelRatio || 1, 2)
    const w = Math.max(1, Math.round(canvas.clientWidth * e))
    const h = Math.max(1, Math.round(canvas.clientHeight * e))
    if (canvas.width !== w || canvas.height !== h) { canvas.width = w; canvas.height = h }
    return [w, h]
  }

  function cadres(n, W) {
    const [w, h] = [canvas.width, canvas.height]
    const marge = Math.round(Math.min(w, h) * 0.03)
    const largeur = n === 2 ? (w - 3 * marge) / 2 : w - 2 * marge
    const cote = Math.max(W, Math.min(largeur, h - 2 * marge))
    const s = Math.max(1, Math.floor(cote / W))
    const taille = s * W
    return Array.from({ length: n }, (_, k) => {
      const x0 = n === 2 ? marge + k * (largeur + marge) + (largeur - taille) / 2 : (w - taille) / 2
      return [Math.round(x0), Math.round((h - taille) / 2), taille, s]
    })
  }

  function peindre(v, vue, [x0, y0, taille, s]) {
    if (!image || image.width !== taille) {
      image = ctx.createImageData(taille, taille)
      mots = new Uint32Array(image.data.buffer)
    }
    const { W } = v
    const joint = s >= 4 ? 1 : 0
    const trou = s >= 6 ? Math.max(1, Math.round(s / 5)) : 0
    mots.fill(P_FOND)
    for (let c = 0; c < v.N; c++) {
      const x = c % W
      const y = (c - x) / W
      const col = couleur(v, c, vue)
      // les cases d'eau et de parc se touchent : pas de joint, pour dessiner des surfaces
      const j = v.sol[c] === SOL.HABITABLE ? joint : 0
      const base = y * s * taille + x * s
      for (let dy = 0; dy < s - j; dy++) mots.fill(col, base + dy * taille, base + dy * taille + s - j)
      // logement social occupé : un petit trou au centre de la case
      if (trou && v.social[c] && v.occ[c] >= 0 && (vue === 'groupes' || vue === 'revenus' || vue === 'satisfaction')) {
        const m = Math.floor((s - j - trou) / 2)
        for (let dy = 0; dy < trou; dy++) mots.fill(P_TROU, base + (m + dy) * taille + m, base + (m + dy) * taille + m + trou)
      }
    }
    ctx.putImageData(image, x0, y0)
  }

  /** villes : [a] ou [a, b] */
  function dessiner(villes, vue) {
    ctx.fillStyle = FOND
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    const cs = cadres(villes.length, villes[0].W)
    villes.forEach((v, k) => peindre(v, vue, cs[k]))
    return cs
  }

  return { redimensionner, dessiner }
}
