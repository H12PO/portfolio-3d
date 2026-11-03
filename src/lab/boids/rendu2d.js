import { PAR_OISEAU } from './hote.js'

// ============================================================
//  BOIDS : le dessin en 2D (Canvas 2D)
//  Un oiseau = un petit triangle pointé dans le sens de sa vitesse.
//  Pour aller vite (jusqu'à 5 000 oiseaux), on range les oiseaux
//  par couleur et on remplit un seul chemin par couleur.
//  Vues : espèces (ou meneurs), cap (une teinte par direction), peur.
//  Monde ouvert (Couzin, Cucker-Smale) : la vue suit le groupe, et
//  un quadrillage discret montre qu'il avance.
// ============================================================

export const FOND = '#0b0d12'
export const COULEUR_SEUL = '#e6e9ef'
// Espèces : palette d'Okabe et Ito (lisible par les daltoniens)
export const COULEURS_ESPECES = ['#E69F00', '#56B4E9', '#009E73']
// Meneurs de Couzin : sans préférence, préférence 1, préférence 2
export const COULEURS_MENEURS = ['#8f98aa', '#E69F00', '#CC79A7']
export const COULEUR_PREDATEUR = '#ff453a'
export const VUES = ['especes', 'cap', 'peur']

// Cap : 12 teintes réparties sur le cercle (palette cyclique, claire sur fond sombre)
const N_CAPS = 12
export const COULEURS_CAP = Array.from({ length: N_CAPS }, (_, k) => `hsl(${Math.round((k * 360) / N_CAPS)}, 70%, 64%)`)
// Peur : du calme (gris bleuté) à la panique (orange vif)
export const COULEURS_PEUR = ['#aab3c5', '#e8c07a', '#f0a04b', '#f4762d', '#ff453a']

const MAX_SEAUX = 16

export function creerRendu2D(canvas) {
  const ctx = canvas.getContext('2d')
  let vue = null               // boîte montrée [x0, y0, x1, y1] (lissée en monde ouvert)
  let t = { s: 1, ox: 0, oy: 0, x0: 0, y0: 0 }
  let seaux = Array.from({ length: MAX_SEAUX }, () => new Int32Array(1024))
  const tailles = new Int32Array(MAX_SEAUX)

  function redimensionner() {
    const e = Math.min(window.devicePixelRatio || 1, 2)
    const w = Math.max(1, Math.round(canvas.clientWidth * e))
    const h = Math.max(1, Math.round(canvas.clientHeight * e))
    if (canvas.width !== w || canvas.height !== h) { canvas.width = w; canvas.height = h }
  }

  // Cadre : la boîte du monde, carrée, centrée, avec une petite marge
  function cadrer(img) {
    const b = img.boite
    const cible = [b[0], b[1], b[3], b[4]]
    if (!vue || img.bords !== 'ouvert') vue = cible
    else {
      // monde ouvert : la vue glisse doucement vers le groupe
      const k = 0.08
      vue = vue.map((v, i) => v + (cible[i] - v) * k)
    }
    const [x0, y0, x1, y1] = vue
    const w = canvas.width
    const h = canvas.height
    const marge = Math.round(Math.min(w, h) * 0.03)
    const s = Math.min((w - 2 * marge) / (x1 - x0 || 1), (h - 2 * marge) / (y1 - y0 || 1))
    t = { s, x0, y0, ox: (w - s * (x1 - x0)) / 2, oy: (h - s * (y1 - y0)) / 2 }
  }

  const X = (x) => t.ox + (x - t.x0) * t.s
  const Y = (y) => t.oy + (y - t.y0) * t.s

  function quadrillage() {
    // un pas « rond » d'environ 60 pixels
    const brut = 60 / t.s
    const p10 = 10 ** Math.floor(Math.log10(brut))
    const pas = [1, 2, 5, 10].map((k) => k * p10).find((v) => v >= brut) ?? brut
    const [x0, y0, x1, y1] = vue
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)'
    ctx.lineWidth = 1
    ctx.beginPath()
    for (let x = Math.ceil(x0 / pas) * pas; x <= x1; x += pas) { ctx.moveTo(X(x), Y(y0)); ctx.lineTo(X(x), Y(y1)) }
    for (let y = Math.ceil(y0 / pas) * pas; y <= y1; y += pas) { ctx.moveTo(X(x0), Y(y)); ctx.lineTo(X(x1), Y(y)) }
    ctx.stroke()
  }

  // Taille d'un oiseau à l'écran (pixels) selon le modèle
  function taillePixels(img) {
    const e = Math.min(window.devicePixelRatio || 1, 2)
    const unite = img.modele === 'couzin' ? 0.9 : img.modele === 'cucker' ? 0 : 0.42
    const brut = unite ? unite * t.s : 9 * e
    return Math.max(4.5 * e, Math.min(16 * e, brut))
  }

  /**
   * @param img   image reçue du simulateur
   * @param o     { vue: 'especes' | 'cap' | 'peur', traines: bool, especes: nombre }
   */
  function dessiner(img, o = {}) {
    const w = canvas.width
    const h = canvas.height
    cadrer(img)
    if (o.traines) {
      ctx.fillStyle = 'rgba(11, 13, 18, 0.2)'
      ctx.fillRect(0, 0, w, h)
    } else {
      ctx.fillStyle = FOND
      ctx.fillRect(0, 0, w, h)
    }

    if (img.bords === 'ouvert') quadrillage()
    else {
      ctx.strokeStyle = img.bords === 'murs' ? 'rgba(255, 255, 255, 0.28)' : 'rgba(255, 255, 255, 0.08)'
      ctx.lineWidth = 1
      ctx.strokeRect(X(0) + 0.5, Y(0) + 0.5, img.L * t.s, img.L * t.s)
    }

    // Obstacles
    if (img.obstacles.length) {
      ctx.fillStyle = '#262b36'
      ctx.strokeStyle = '#3d4352'
      ctx.lineWidth = 1
      ctx.beginPath()
      for (let k = 0; k < img.obstacles.length; k += 3) {
        const x = X(img.obstacles[k]), y = Y(img.obstacles[k + 1]), r = img.obstacles[k + 2] * t.s
        ctx.moveTo(x + r, y)
        ctx.arc(x, y, r, 0, 2 * Math.PI)
      }
      ctx.fill()
      ctx.stroke()
    }

    // Oiseaux, rangés par couleur
    const { N, etat } = img
    if (seaux[0].length < N) seaux = seaux.map(() => new Int32Array(N))
    tailles.fill(0)
    const vueC = o.vue ?? 'especes'
    let couleurs
    if (vueC === 'cap') couleurs = COULEURS_CAP
    else if (vueC === 'peur') couleurs = COULEURS_PEUR
    else if (img.modele === 'couzin') couleurs = COULEURS_MENEURS
    else couleurs = (o.especes ?? 1) > 1 ? COULEURS_ESPECES : [COULEUR_SEUL]
    for (let i = 0; i < N; i++) {
      const e = PAR_OISEAU * i
      let c
      if (vueC === 'cap') {
        const a = Math.atan2(etat[e + 4], etat[e + 3])
        c = Math.floor(((a / (2 * Math.PI) + 1) % 1) * N_CAPS) % N_CAPS
      } else if (vueC === 'peur') {
        const p = etat[e + 7]
        c = p < 0.05 ? 0 : Math.min(4, 1 + Math.floor(p * 4))
      } else {
        const k = etat[e + 6]
        c = img.modele === 'couzin' ? (k >= 3 ? k - 2 : 0) : Math.min(couleurs.length - 1, k)
      }
      seaux[c][tailles[c]++] = i
    }
    const lg = taillePixels(img)
    const la = lg * 0.42
    for (let c = 0; c < couleurs.length; c++) {
      if (!tailles[c]) continue
      ctx.fillStyle = couleurs[c]
      ctx.beginPath()
      const liste = seaux[c]
      for (let q = 0; q < tailles[c]; q++) {
        const e = PAR_OISEAU * liste[q]
        const x = X(etat[e]), y = Y(etat[e + 1])
        let dx = etat[e + 3], dy = etat[e + 4]
        const n = Math.sqrt(dx * dx + dy * dy) || 1
        dx /= n; dy /= n
        ctx.moveTo(x + dx * lg * 0.6, y + dy * lg * 0.6)
        ctx.lineTo(x - dx * lg * 0.4 - dy * la, y - dy * lg * 0.4 + dx * la)
        ctx.lineTo(x - dx * lg * 0.4 + dy * la, y - dy * lg * 0.4 - dx * la)
        ctx.closePath()
      }
      ctx.fill()
    }

    // Prédateurs (et leur rayon de peur), puis le danger sous la souris
    const nP = img.pred.length / 6
    if (nP) {
      const lp = lg * 2.2
      ctx.fillStyle = COULEUR_PREDATEUR
      ctx.strokeStyle = 'rgba(255, 69, 58, 0.25)'
      ctx.setLineDash([4, 5])
      for (let k = 0; k < nP; k++) {
        const x = X(img.pred[6 * k]), y = Y(img.pred[6 * k + 1])
        let dx = img.pred[6 * k + 3], dy = img.pred[6 * k + 4]
        const n = Math.sqrt(dx * dx + dy * dy) || 1
        dx /= n; dy /= n
        ctx.beginPath()
        ctx.arc(x, y, img.peur * t.s, 0, 2 * Math.PI)
        ctx.stroke()
        ctx.beginPath()
        ctx.moveTo(x + dx * lp * 0.6, y + dy * lp * 0.6)
        ctx.lineTo(x - dx * lp * 0.4 - dy * lp * 0.5, y - dy * lp * 0.4 + dx * lp * 0.5)
        ctx.lineTo(x - dx * lp * 0.15, y - dy * lp * 0.15)
        ctx.lineTo(x - dx * lp * 0.4 + dy * lp * 0.5, y - dy * lp * 0.4 - dx * lp * 0.5)
        ctx.closePath()
        ctx.fill()
      }
      ctx.setLineDash([])
    }
    if (img.souris) {
      ctx.strokeStyle = 'rgba(255, 69, 58, 0.7)'
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.arc(X(img.souris[0]), Y(img.souris[1]), img.peur * t.s, 0, 2 * Math.PI)
      ctx.stroke()
    }
  }

  // Pixels du canvas → coordonnées du monde
  const versMonde = (px, py) => [(px - t.ox) / t.s + t.x0, (py - t.oy) / t.s + t.y0]
  const echelle = () => t.s

  // Oublie la vue lissée (nouveau monde)
  const oublier = () => { vue = null }

  return { redimensionner, dessiner, versMonde, echelle, oublier }
}
