// ============================================================
//  JEU DE LA VIE : rendu dans un <canvas>
//  La grille est peinte dans un canvas hors écran (1 pixel = 1 case),
//  puis agrandie sans lissage. Seules les tuiles qui ont changé sont
//  repeintes. Effets : âge des cellules, traînées des cellules mortes,
//  carte d'activité, quadrillage. Zoom et cadrage : lab/commun/camera.js.
// ============================================================

import { creerCamera } from '../commun/camera'
import { boite, TUILE } from './moteur.js'

const hex = (h) => [1, 3, 5].map((k) => parseInt(h.slice(k, k + 2), 16))
const pack = (r, g, b, a = 255) => ((a << 24) | (b << 16) | (g << 8) | r) >>> 0
const melange = (a, b, t) => a.map((v, k) => Math.round(v + (b[k] - v) * t))

export const THEMES = {
  clair: {
    bureau: '#EEF0F3',
    feuille: '#FFFFFF',
    grille: '196, 205, 217',
    encre: '#1B2340',
    sig: '#1E7A50',
    // Carte d'activité : une seule teinte, du plus clair au plus foncé
    activite: [[223, 239, 230], [140, 199, 166], [30, 122, 80], [10, 52, 33]],
  },
  sombre: {
    bureau: '#131519',
    feuille: '#181B21',
    grille: '62, 69, 82',
    encre: '#DCE1EA',
    sig: '#33AD78',
    activite: [[30, 52, 42], [33, 106, 74], [51, 173, 120], [178, 236, 206]],
  },
}

// Durée des effets d'âge et de traînée, en générations
export const FENETRE = 24

function rampe(stops, t) {
  const x = Math.min(1, Math.max(0, t)) * (stops.length - 1)
  const k = Math.min(stops.length - 2, Math.floor(x))
  return melange(stops[k], stops[k + 1], x - k)
}

export function creerRendu(canvas, monde) {
  const ctx = canvas.getContext('2d')
  const m = monde
  const vue = creerCamera(canvas, { largeur: m.W, hauteur: m.H, zoomMaxCss: 40, cadrageMaxCss: 16 })
  const { css } = vue

  const off = document.createElement('canvas')
  off.width = m.W
  off.height = m.H
  const octx = off.getContext('2d')
  const img = octx.createImageData(m.W, m.H)
  const px = new Uint32Array(img.data.buffer)

  let toutRepeindre = true
  let dernierReglage = ''
  let images = 0
  let derniereGen = 0
  let maxActivite = 1

  // Couleurs précalculées pour le thème et la règle en cours
  let couleurs = null
  function preparerCouleurs(theme) {
    const th = THEMES[theme]
    const encre = hex(th.encre)
    const feuille = hex(th.feuille)
    const sig = hex(th.sig)
    const C = m.regle.etats
    // États « mourants » des règles Generations : de l'encre vers le papier
    const etats = [0]
    for (let s = 1; s < C; s++) etats.push(pack(...melange(encre, feuille, s === 1 ? 0 : 0.3 + (0.5 * (s - 1)) / Math.max(1, C - 2))))
    // Âge : vert signature à la naissance, encre une fois installée
    const ages = Array.from({ length: FENETRE + 1 }, (_, a) => pack(...melange(sig, encre, Math.sqrt(a / FENETRE))))
    // Traînées : le vert signature en transparence, qui s'efface
    const trainees = Array.from({ length: FENETRE + 1 }, (_, a) => pack(...sig, Math.round(110 * (1 - a / FENETRE) ** 2)))
    const activite = Array.from({ length: 64 }, (_, k) => pack(...rampe(th.activite, k / 63)))
    couleurs = { etats, ages, trainees, activite }
  }

  function peindreTuile(t, effets, logMax) {
    const { W, TW, etat, ne, mort, activite, gen } = m
    const tx = t % TW
    const ty = (t / TW) | 0
    const { etats, ages, trainees, activite: rampeAct } = couleurs
    for (let y = ty * TUILE, yf = y + TUILE; y < yf; y++) {
      for (let i = y * W + tx * TUILE, f = i + TUILE; i < f; i++) {
        const s = etat[i]
        if (s) {
          if (s === 1 && effets.age) {
            const a = gen - ne[i]
            px[i] = ages[a < FENETRE ? a : FENETRE]
          } else {
            px[i] = etats[s]
          }
        } else if (effets.activite && activite[i]) {
          px[i] = rampeAct[Math.min(63, Math.round((63 * Math.log1p(activite[i])) / logMax))]
        } else if (effets.trainees && gen - mort[i] < FENETRE) {
          px[i] = trainees[gen - mort[i]]
        } else {
          px[i] = 0
        }
      }
    }
    octx.putImageData(img, 0, 0, tx * TUILE, ty * TUILE, TUILE, TUILE)
  }

  function peindre(effets, theme) {
    const reglage = `${theme}|${m.regle.texte}|${effets.age}|${effets.trainees}|${effets.activite}`
    if (reglage !== dernierReglage) {
      dernierReglage = reglage
      preparerCouleurs(theme)
      toutRepeindre = true
    }
    const { TW, TH, sales, modif, occupe, gen } = m
    // Retour en arrière (réinitialiser, tout effacer) : la carte d'activité repart de zéro
    if (gen < derniereGen) { maxActivite = 1; toutRepeindre = true }
    derniereGen = gen
    const temporel = effets.age || effets.trainees
    // La carte d'activité dépend du maximum, qui évolue : on la repeint en entier de temps en temps
    if (effets.activite && images % 30 === 0) toutRepeindre = true
    let logMax = 1
    if (effets.activite) {
      let max = 1
      const act = m.activite
      for (let t = 0; t < TW * TH; t++) {
        if (!sales[t] && !toutRepeindre) continue
        const tx = t % TW
        const ty = (t / TW) | 0
        for (let y = ty * TUILE; y < (ty + 1) * TUILE; y++) {
          for (let i = y * m.W + tx * TUILE, f = i + TUILE; i < f; i++) if (act[i] > max) max = act[i]
        }
      }
      maxActivite = Math.max(maxActivite, max)
      logMax = Math.log1p(maxActivite)
    }
    for (let t = 0; t < TW * TH; t++) {
      const recent = temporel && gen - modif[t] <= FENETRE + 1
      if (toutRepeindre ? occupe[t] || recent || sales[t] || effets.activite : sales[t] || recent) peindreTuile(t, effets, logMax)
      sales[t] = 0
    }
    if (toutRepeindre) {
      // tuiles vides et calmes : on efface d'un coup
      for (let t = 0; t < TW * TH; t++) {
        const recent = temporel && gen - modif[t] <= FENETRE + 1
        if (!occupe[t] && !recent && !effets.activite) {
          const tx = t % TW
          const ty = (t / TW) | 0
          for (let y = ty * TUILE; y < (ty + 1) * TUILE; y++) px.fill(0, y * m.W + tx * TUILE, y * m.W + tx * TUILE + TUILE)
        }
      }
      octx.putImageData(img, 0, 0)
    }
    toutRepeindre = false
  }

  /**
   * @param effets   { quadrillage, age, trainees, activite }
   * @param auto     cadrage automatique sur les cellules vivantes
   * @param cible    cadrage en douceur sur une boîte donnée (visite guidée)
   * @param fantome  aperçu du tampon : { cellules, x, y } (case du coin haut-gauche)
   */
  function dessiner({ effets = {}, auto = false, cible = null, theme = 'clair', fantome = null } = {}) {
    const th = THEMES[theme]
    images++
    if (cible) vue.cadrer(cible, 0.05)
    else if (auto) vue.cadrer(boite(m))
    peindre(effets, theme)

    const cw = canvas.width
    const ch = canvas.height
    const { ox, oy, z } = vue.origine()
    ctx.setTransform(1, 0, 0, 1, 0, 0)
    ctx.globalAlpha = 1
    ctx.fillStyle = th.bureau
    ctx.fillRect(0, 0, cw, ch)
    ctx.fillStyle = th.feuille
    ctx.fillRect(ox, oy, m.W * z, m.H * z)
    if (effets.quadrillage) vue.quadriller(ctx, th.grille)
    ctx.imageSmoothingEnabled = false
    ctx.drawImage(off, ox, oy, m.W * z, m.H * z)

    // Aperçu du tampon : le motif en transparence sous le pointeur
    if (fantome) {
      const e = css()
      const taille = Math.max(z, 1)
      ctx.fillStyle = th.sig
      ctx.globalAlpha = 0.45
      for (const [x, y] of fantome.cellules) ctx.fillRect(ox + (fantome.x + x) * z, oy + (fantome.y + y) * z, taille, taille)
      ctx.globalAlpha = 1
      const l = Math.max(...fantome.cellules.map((c) => c[0])) + 1
      const h = Math.max(...fantome.cellules.map((c) => c[1])) + 1
      ctx.strokeStyle = th.sig
      ctx.lineWidth = 1.5 * e
      ctx.strokeRect(ox + fantome.x * z - 0.5, oy + fantome.y * z - 0.5, l * z + 1, h * z + 1)
    }
  }

  /**
   * Vue Hashlife : l'univers infini d'un arbre de quadrants, à n'importe quelle échelle.
   * Quand on dézoome, chaque pixel montre la densité d'un bloc de 2^L × 2^L cases.
   */
  function dessinerHashlife(h, { theme = 'clair', quadrillage = true } = {}) {
    const th = THEMES[theme]
    const cw = canvas.width
    const ch = canvas.height
    const { ox, oy, z } = vue.origine()
    ctx.setTransform(1, 0, 0, 1, 0, 0)
    ctx.globalAlpha = 1
    ctx.fillStyle = th.feuille
    ctx.fillRect(0, 0, cw, ch)
    if (quadrillage) vue.quadriller(ctx, th.grille)
    const fenetre = { x0: Math.floor(-ox / z), y0: Math.floor(-oy / z), x1: Math.ceil((cw - ox) / z), y1: Math.ceil((ch - oy) / z) }
    const L = z >= 1 ? 0 : Math.ceil(Math.log2(1 / z))
    const t = 2 ** L
    const taille = Math.max(1, t * z)
    ctx.fillStyle = th.encre
    h.blocs(L, fenetre, (bx, by, densite) => {
      ctx.globalAlpha = L === 0 ? 1 : Math.min(1, 0.6 + densite * 4)
      ctx.fillRect(ox + bx * t * z, oy + by * t * z, taille, taille)
    })
    ctx.globalAlpha = 1
  }

  // Bascule entre la grille bornée (W × H) et le plan infini de Hashlife
  const modeInfini = (infini) => vue.redimensionner(infini ? Infinity : m.W, infini ? Infinity : m.H)

  // Centre la vue sur une boîte (motif posé, nouvelle soupe)
  const recentrer = (b = boite(m)) => {
    if (b) {
      vue.recentrer(b)
      toutRepeindre = true
    }
    else {
      vue.camera.x = m.W / 2
      vue.camera.y = m.H / 2
      vue.camera.zoom = vue.borner(12 * css())
    }
  }

  return {
    dessiner,
    dessinerHashlife,
    modeInfini,
    repeindre: () => { toutRepeindre = true },
    recentrer,
    versCase: vue.versCase,
    zoomer: vue.zoomer,
    deplacer: vue.deplacer,
    camera: vue.camera,
  }
}
