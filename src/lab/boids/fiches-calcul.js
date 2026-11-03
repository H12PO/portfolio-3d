import { creerMonde, poserObstacles, coteMonde } from './moteur.js'
import { scenario, DECORS } from './scenarios.js'
import { PAR_OISEAU } from './hote.js'

// ============================================================
//  BOIDS : les images des fiches (onglet Comprendre)
//  IMAGES dit, pour chaque fiche, quelles images montrer : le scénario,
//  les réglages changés, le nombre de pas, la vue, la mesure affichée.
//  Les images sont calculées à l'avance dans Node.js avec le moteur de
//  l'explorateur (même graine), puis rangées dans fiches-images.js sous
//  une forme compacte : 4 octets par oiseau (position sur 11 + 11 bits,
//  direction sur 7 bits, couleur sur 3 bits). La page les décode et les
//  dessine aussitôt, sans rien recalculer.
// ============================================================

export const GRAINE = 11

// Pour chaque fiche : les images (scénario, réglages changés, nombre de pas), la vue, la mesure affichée
export const IMAGES = {
  reynolds: { images: [{ s: 'reynolds', pas: 0 }, { s: 'reynolds', pas: 1500 }], r: { n: 700 } },
  'sans-alignement': { images: [{ s: 'reynolds', pas: 1500, etiquette: 'avec' }, { s: 'sans-alignement', pas: 1500, etiquette: 'sans' }], r: { n: 700 }, vue: 'cap' },
  etourneaux: { images: [{ s: 'etourneaux', pas: 1200, r: { voisinage: 'metrique' }, etiquette: 'metrique' }, { s: 'etourneaux', pas: 1200, etiquette: 'topologique' }], r: { n: 1200 }, vue: 'peur' },
  faucons: { images: [{ s: 'faucons', pas: 0 }, { s: 'faucons', pas: 1500 }], r: { n: 900 }, vue: 'peur', mesure: 'captures' },
  foret: { images: [{ s: 'foret', pas: 0 }, { s: 'foret', pas: 1500 }], r: { n: 800 } },
  vent: { images: [{ s: 'reynolds', pas: 1500, etiquette: 'calme' }, { s: 'vent', pas: 1500, etiquette: 'vent' }], r: { n: 700 }, vue: 'cap' },
  especes: { images: [{ s: 'especes', pas: 1500, r: { relation: 'melent' }, etiquette: 'melent' }, { s: 'especes', pas: 1500, etiquette: 'evitent' }], r: { n: 900 } },
  vicsek: {
    images: [{ s: 'vicsek', pas: 2500, r: { eta: 1 }, etiquette: 'faible' }, { s: 'vicsek', pas: 2500, etiquette: 'moyen' }, { s: 'vicsek', pas: 2500, r: { eta: 5 }, etiquette: 'fort' }],
    r: { n: 600 }, vue: 'cap',
  },
  bandes: { images: [{ s: 'bandes', pas: 0 }, { s: 'bandes', pas: 2500 }], r: { n: 2048 } },
  couzin: {
    images: [{ s: 'essaim', pas: 800, etiquette: 'essaim' }, { s: 'tore', pas: 800, etiquette: 'tore' }, { s: 'migration', pas: 800, etiquette: 'migration' }],
    mesure: 'rotation',
  },
  meneurs: { images: [{ s: 'meneurs', pas: 0 }, { s: 'meneurs', pas: 1000 }], cap: true },
  conflit: { images: [{ s: 'conflit', pas: 1500, r: { ecart: 40 }, etiquette: 'petit' }, { s: 'conflit', pas: 1500, etiquette: 'grand' }], cap: true },
  cucker: { images: [{ s: 'cucker', pas: 1500, etiquette: 'faible' }, { s: 'cucker', pas: 1500, r: { beta: 1.5 }, etiquette: 'fort' }], r: { n: 150 }, mesure: 'dispersion', vue: 'cap' },
}

/** Le monde de départ d'une image de fiche (scénario, réglages de la fiche, puis ceux de l'image). */
export function mondeDe(img, reglagesFiche) {
  const s = scenario(img.s)
  const r = { ...s.r, ...(reglagesFiche ?? {}), ...(img.r ?? {}) }
  const m = creerMonde(r, GRAINE)
  if (s.obstacles) poserObstacles(m, DECORS[s.obstacles](coteMonde(r)))
  return m
}

/* ---------- Codage compact ---------- */

const MARGE = 0.06            // on garde les oiseaux un peu hors du cadre (ils sont encore dessinés)
const BX = 2047, BA = 127     // 11 bits par coordonnée, 7 bits pour la direction
const arrondi = (x, k = 3) => +x.toFixed(k)

/**
 * Code une image (imageDe) pour une vue donnée.
 * @param encoder64 (octets) → texte base64 (Buffer dans Node)
 */
export function coder(img, vue, mesure, especes, encoder64) {
  const [x0, y0, , x1, y1] = img.boite
  const mx = (x1 - x0) * MARGE, my = (y1 - y0) * MARGE
  const ax = x0 - mx, ay = y0 - my, lx = x1 - x0 + 2 * mx, ly = y1 - y0 + 2 * my
  const mots = []
  for (let i = 0; i < img.N; i++) {
    const e = PAR_OISEAU * i
    const u = (img.etat[e] - ax) / lx, v = (img.etat[e + 1] - ay) / ly
    if (u < 0 || u > 1 || v < 0 || v > 1) continue
    const a = Math.atan2(img.etat[e + 4], img.etat[e + 3])
    const qa = Math.round(((a / (2 * Math.PI) + 1) % 1) * (BA + 1)) % (BA + 1)
    const p = img.etat[e + 7]
    const c = vue === 'peur' ? (p < 0.05 ? 0 : Math.min(4, 1 + Math.floor(p * 4))) : Math.min(7, img.etat[e + 6])
    mots.push((Math.round(u * BX) | (Math.round(v * BX) << 11) | (qa << 22) | (c << 29)) >>> 0)
  }
  const octets = new Uint8Array(new Uint32Array(mots).buffer)
  return {
    modele: img.modele, bords: img.bords, L: arrondi(img.L), especes,
    boite: [x0, y0, x1, y1].map((x) => arrondi(x)),
    obstacles: Array.from(img.obstacles, (x) => arrondi(x, 2)),
    pred: Array.from(img.pred, (x) => arrondi(x)),
    peur: img.peur,
    mesure: Object.fromEntries(['polarisation', 'rotation', 'groupes', 'captures', 'dispersion', 'cap'].map((k) => [k, arrondi(mesure[k])])),
    n: mots.length,
    oiseaux: encoder64(octets),
  }
}

/** Décode une image de fiche en une image que rendu2d.js sait dessiner. */
export function decoder(c, vue) {
  const brut = atob(c.oiseaux)
  const octets = new Uint8Array(brut.length)
  for (let k = 0; k < brut.length; k++) octets[k] = brut.charCodeAt(k)
  const mots = new Uint32Array(octets.buffer)
  const [x0, y0, x1, y1] = c.boite
  const mx = (x1 - x0) * MARGE, my = (y1 - y0) * MARGE
  const ax = x0 - mx, ay = y0 - my, lx = x1 - x0 + 2 * mx, ly = y1 - y0 + 2 * my
  const etat = new Float32Array(c.n * PAR_OISEAU)
  for (let i = 0; i < c.n; i++) {
    const w = mots[i]
    const e = PAR_OISEAU * i
    const a = (((w >>> 22) & BA) / (BA + 1)) * 2 * Math.PI
    const code = w >>> 29
    etat[e] = ax + ((w & BX) / BX) * lx
    etat[e + 1] = ay + (((w >>> 11) & BX) / BX) * ly
    etat[e + 3] = Math.cos(a)
    etat[e + 4] = Math.sin(a)
    if (vue === 'peur') etat[e + 7] = code ? (code - 1) / 4 + 0.1 : 0
    else etat[e + 6] = code
  }
  return {
    N: c.n, D: 2, L: c.L, bords: c.bords, modele: c.modele,
    boite: [x0, y0, 0, x1, y1, 0],
    etat,
    pred: Float32Array.from(c.pred),
    obstacles: Float32Array.from(c.obstacles),
    souris: null,
    peur: c.peur,
  }
}
