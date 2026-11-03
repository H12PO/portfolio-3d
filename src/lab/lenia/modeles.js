// ============================================================
//  LENIA : les modèles, sans carte graphique
//  Noyaux, fonctions de croissance, décodage des créatures,
//  rotation, mutations. Aucune dépendance au DOM : testable dans
//  Node, et partagé par le moteur, l'éditeur et les figures.
//
//  Quatre modèles :
//   - classique : un canal, un noyau en anneaux (Chan, 2019) ;
//   - etendu    : jusqu'à 3 canaux et 16 noyaux (Chan, 2020) ;
//   - smooth    : SmoothLife, disque et anneau (Rafler, 2011) ;
//   - flow      : Flow Lenia, la matière se conserve (Plantec et al., 2023).
//  Conventions des noyaux et croissances : celles du programme
//  LeniaND.py de Bert Chan (kn = 1 polynomial, 2 exponentiel…).
// ============================================================

export const MODELES = ['classique', 'etendu', 'smooth', 'flow']

/* ---------- Noyaux et croissances ---------- */

// Profil d'un anneau, r ∈ [0, 1]
export const COEURS = [
  (r) => (r <= 0 || r >= 1 ? 0 : (4 * r * (1 - r)) ** 4),            // 1 polynomial
  (r) => (r <= 0 || r >= 1 ? 0 : Math.exp(4 - 1 / (r * (1 - r)))),  // 2 exponentiel
  (r) => (r >= 0.25 && r <= 0.75 ? 1 : 0),                            // 3 marche
  (r) => (r >= 0.25 && r <= 0.75 ? 1 : 0) + (r < 0.25 ? 0.5 : 0),    // 4 jeu de la vie
]

// Croissance G(u) ∈ [−1, 1], u = potentiel
export const CROISSANCES = [
  (u, m, s) => Math.max(0, 1 - (u - m) ** 2 / (9 * s * s)) ** 4 * 2 - 1, // 1 polynomiale
  (u, m, s) => Math.exp(-((u - m) ** 2) / (2 * s * s)) * 2 - 1,         // 2 gaussienne
  (u, m, s) => (Math.abs(u - m) <= s ? 1 : -1),                         // 3 marche
]

// "1,1/3" → [1, 0.333…]
export function lireAnneaux(b) {
  if (Array.isArray(b)) return b
  return String(b).split(',').map((t) => {
    const [n, d] = t.split('/').map(Number)
    return d ? n / d : n
  })
}

// Valeur du noyau à la distance relative D (D = distance / rayon) : une suite d'anneaux
export function coquille(D, anneaux, kn = 1) {
  if (D >= 1 || D < 0) return 0
  const B = anneaux.length
  const Br = B * D
  const i = Math.min(Math.floor(Br), B - 1)
  return COEURS[kn - 1](Math.min(Br - i, 1)) * anneaux[i]
}

// Noyau de Flow Lenia : bosses gaussiennes, adouci au bord
export function noyauFlow(D, a, b, w) {
  let k = 0
  for (let i = 0; i < a.length; i++) k += b[i] * Math.exp(-((D - a[i]) ** 2) / w[i])
  return k * 0.5 * (Math.tanh(-(D - 1) * 5) + 1)
}

/**
 * Le noyau sur une grille N × N, centré en (0, 0) et replié (monde torique),
 * normalisé pour que la somme vaille 1. f(d) : valeur à la distance d en cases.
 */
export function grilleNoyau(N, f) {
  const k = new Float32Array(N * N)
  let somme = 0
  for (let y = 0; y < N; y++) {
    const dy = y < N / 2 ? y : y - N
    for (let x = 0; x < N; x++) {
      const dx = x < N / 2 ? x : x - N
      const v = f(Math.hypot(dx, dy))
      k[y * N + x] = v
      somme += v
    }
  }
  if (somme > 0) for (let i = 0; i < k.length; i++) k[i] /= somme
  return k
}

// SmoothLife : disque intérieur (rayon ra/3) et anneau (ra/3 → ra), bords adoucis sur une case
export function noyauxSmooth(N, ra) {
  const ri = ra / 3
  const lisse = (d, R) => Math.min(1, Math.max(0, R + 0.5 - d))
  return [grilleNoyau(N, (d) => lisse(d, ri)), grilleNoyau(N, (d) => lisse(d, ra) - lisse(d, ri))]
}

// Fonction de transition de SmoothLife : s(n, m), n = anneau, m = disque
const sig1 = (x, a, al) => 1 / (1 + Math.exp(-(x - a) * 4 / al))
const sig2 = (x, a, b, al) => sig1(x, a, al) * (1 - sig1(x, b, al))
const sigm = (x, y, m, al) => x * (1 - sig1(m, 0.5, al)) + y * sig1(m, 0.5, al)
export function transitionSmooth(n, m, p) {
  return sig2(n, sigm(p.b1, p.d1, m, p.am), sigm(p.b2, p.d2, m, p.am), p.an)
}

/* ---------- Règles : forme commune ---------- */

/**
 * Une règle décrit tout ce qu'il faut pour simuler :
 *  classique / etendu : { modele, C, R, T, gn, noyaux: [{ r, b, kn, m, s, h, c0, c1 }] }
 *  smooth             : { modele, C: 1, ra, b1, b2, d1, d2, an, am, mode, dt, planeur?, escadrille? }
 *  flow               : { modele, C: 1, R, dt, noyaux: [{ r, m, s, h, a, b, w }] }
 */
export function grillesNoyaux(regle, N) {
  if (regle.modele === 'smooth') return noyauxSmooth(N, regle.ra)
  if (regle.modele === 'flow') {
    return regle.noyaux.map((k) => grilleNoyau(N, (d) => noyauFlow(d / ((regle.R + 15) * k.r), k.a, k.b, k.w)))
  }
  return regle.noyaux.map((k) => {
    const anneaux = lireAnneaux(k.b)
    return grilleNoyau(N, (d) => coquille(d / (regle.R * (k.r ?? 1)), anneaux, k.kn ?? 1))
  })
}

// Profil radial d'un noyau (pour l'éditeur), D ∈ [0, 1.1]
export function profilNoyau(regle, i = 0, n = 120) {
  const k = regle.noyaux?.[i]
  return Array.from({ length: n + 1 }, (_, j) => {
    const D = (j / n) * 1.1
    if (regle.modele === 'flow') return [D, noyauFlow(D, k.a, k.b, k.w)]
    return [D, coquille(D, lireAnneaux(k.b), k.kn ?? 1)]
  })
}

/* ---------- Créatures : décodage RLE de Bert Chan ---------- */

// '.' = 0, 'A'…'X' = 1…24, 'pA'… = 25…, valeurs sur 255
function valeur(c) {
  if (c === '.' || c === 'b') return 0
  if (c === 'o') return 255
  if (c.length === 1) return c.charCodeAt(0) - 64
  return (c.charCodeAt(0) - 112) * 24 + (c.charCodeAt(1) - 65 + 25)
}

/** Décode une chaîne RLE 2D en { w, h, v: Float32Array } (valeurs dans [0, 1]) */
export function decoder(rle) {
  const lignes = []
  let ligne = []
  let prefixe = ''
  let compte = ''
  for (const ch of rle.replace(/!$/, '') + '$') {
    if (ch >= '0' && ch <= '9') compte += ch
    else if ('pqrstuvwxy@'.includes(ch)) prefixe = ch
    else if (ch === '$') {
      lignes.push(ligne)
      for (let i = 1; i < (Number(compte) || 1); i++) lignes.push([])
      ligne = []
      compte = ''
    } else {
      const v = valeur(prefixe + ch) / 255
      for (let i = 0; i < (Number(compte) || 1); i++) ligne.push(v)
      prefixe = ''
      compte = ''
    }
  }
  const w = Math.max(...lignes.map((l) => l.length))
  const h = lignes.length
  const v = new Float32Array(w * h)
  lignes.forEach((l, y) => l.forEach((x, i) => { v[y * w + i] = x }))
  return { w, h, v }
}

/**
 * Une créature prête à poser : canaux décodés, tournés d'un angle (radians),
 * mis à l'échelle (taille relative). @returns { w, h, canaux: [Float32Array] }
 */
export function preparer(cellules, angle = 0, echelle = 1) {
  const sources = (Array.isArray(cellules) ? cellules : [cellules]).map(decoder)
  const W0 = Math.max(...sources.map((s) => s.w))
  const H0 = Math.max(...sources.map((s) => s.h))
  const c = Math.cos(angle)
  const s = Math.sin(angle)
  const D = Math.ceil(Math.hypot(W0, H0) * echelle) + 2
  const canaux = sources.map((src) => {
    const out = new Float32Array(D * D)
    for (let y = 0; y < D; y++) {
      for (let x = 0; x < D; x++) {
        // point de la source qui arrive en (x, y) : rotation inverse autour des centres
        const dx = (x - D / 2 + 0.5) / echelle
        const dy = (y - D / 2 + 0.5) / echelle
        const sx = c * dx + s * dy + W0 / 2 - 0.5
        const sy = -s * dx + c * dy + H0 / 2 - 0.5
        const x0 = Math.floor(sx)
        const y0 = Math.floor(sy)
        const fx = sx - x0
        const fy = sy - y0
        const lire = (i, j) => (i < 0 || j < 0 || i >= src.w || j >= src.h ? 0 : src.v[j * src.w + i])
        out[y * D + x] = (lire(x0, y0) * (1 - fx) + lire(x0 + 1, y0) * fx) * (1 - fy) + (lire(x0, y0 + 1) * (1 - fx) + lire(x0 + 1, y0 + 1) * fx) * fy
      }
    }
    return out
  })
  return { w: D, h: D, canaux }
}

/* ---------- Mutations ---------- */

// Tirage normal (Box-Muller) à partir d'un générateur uniforme
const normal = (alea) => Math.sqrt(-2 * Math.log(alea() + 1e-12)) * Math.cos(2 * Math.PI * alea())
const borne = (v, a, b) => Math.min(b, Math.max(a, v))
const arrondi = (v, n = 4) => Math.round(v * 10 ** n) / 10 ** n

/**
 * Une règle voisine : chaque paramètre bouge un peu (force ≈ écart relatif typique).
 * Les créatures vivent sur des crêtes étroites : la plupart des mutants meurent ou explosent,
 * quelques-uns survivent autrement. C'est ce qu'on veut montrer.
 */
export function muter(regle, alea, force = 0.08) {
  const g = (v, f = force) => v * (1 + f * normal(alea))
  const r = structuredClone(regle)
  if (r.modele === 'smooth') {
    for (const k of ['b1', 'b2', 'd1', 'd2']) r[k] = arrondi(borne(r[k] + 0.02 * force * 10 * normal(alea) * 0.5, 0.05, 0.95))
    if (r.b1 > r.b2) [r.b1, r.b2] = [r.b2, r.b1]
    if (r.d1 > r.d2) [r.d1, r.d2] = [r.d2, r.d1]
    return r
  }
  for (const k of r.noyaux) {
    k.m = arrondi(borne(g(k.m), 0.01, 0.9))
    k.s = arrondi(borne(g(k.s, force * 1.5), 0.001, 0.4))
    if (k.h !== undefined) k.h = arrondi(borne(g(k.h, force * 2), 0.01, 1))
    if (r.modele !== 'flow' && typeof k.b !== 'undefined') {
      const b = lireAnneaux(k.b).map((v) => arrondi(borne(v + force * 1.5 * normal(alea), 0, 1), 3))
      if (Math.max(...b) === 0) b[0] = 1
      k.b = b
    }
  }
  return r
}

/* ---------- Divers ---------- */

export const TAILLES = [128, 256, 512]
