import { generateur } from '../commun/aleatoire.js'

// ============================================================
//  LIGNES DE DÉSIR : le moteur (pur, sans dessin, testable en Node)
//
//  Le sol est une grille de cases de h = 0,5 m : herbe, allée pavée,
//  bâtiment, clôture ou arbre. Sur l'herbe, un champ G (0 à 1) dit à
//  quel point elle est piétinée. Trois modèles :
//
//    helbing : marcheurs actifs (Helbing, Keltsch et Molnár, 1997).
//              Chacun va vers sa destination, mais les sentiers qu'il
//              voit (à la distance σ) l'attirent. Ses pas usent l'herbe,
//              l'herbe repousse : dG/dt = −G/T + I (1 − G) Σ δ(r − rα).
//    effort  : moindre effort. Chacun suit le chemin qui coûte le moins,
//              sachant que marcher sur un sentier ou une allée fatigue
//              moins (marche rapide, équation eikonale).
//    fourmis : fourrageuses qui marquent le sol de deux phéromones
//              (vers le nid, vers la nourriture) et suivent celle qui
//              les intéresse. Le double pont de Deneubourg et Goss.
//
//  Unités : mètres et secondes pour les marcheurs (un pas de calcul =
//  0,5 s) ; une journée compte JOUR pas de calcul.
// ============================================================

export const SOL = { HERBE: 0, PAVE: 1, BATI: 2, CLOTURE: 3, ARBRE: 4 }
export const MODELES = ['helbing', 'effort', 'fourmis']
export const TYPES = ['presse', 'ordinaire', 'flaneur']
export const DT = 0.5                 // secondes par pas (marcheurs)
export const JOUR = 1000              // pas de calcul par journée
export const MAX_MARCHEURS = 900
export const MAX_FOURMIS = 2000
export const MAX_PORTES = 16
const PERIODES = 3                    // matin, midi, soir

// Vitesse (m/s), sensibilité aux sentiers et bruit de chaque type de marcheur
export const PROFILS = {
  presse: { vitesse: 1.6, attrait: 0.45, bruit: 0.6 },
  ordinaire: { vitesse: 1.3, attrait: 1, bruit: 1 },
  flaneur: { vitesse: 0.9, attrait: 1.7, bruit: 1.8 },
}

export const DEFAUTS = {
  modele: 'helbing',
  // marcheurs
  attrait: 1.5,      // A : poids de l'attrait des sentiers face à la destination
  sigma: 3,          // σ : distance à laquelle on voit les sentiers (m)
  usure: 0.05,       // I : usure d'une case par pas de 0,65 m (part de ce qui reste d'herbe)
  repousse: 4,       // T : temps de repousse (jours)
  debit: 500,        // passages par jour
  parts: [0.25, 0.5, 0.25],   // pressés, ordinaires, flâneurs
  pointe: false,     // flux qui varient dans la journée (matin, midi, soir)
  bruit: 0.12,       // écart-type du bruit de direction (rad par pas, type ordinaire)
  effort: 0.25,      // moindre effort : marcher sur un sentier tout tracé coûte (1 − effort) fois ce que coûte l'herbe
  // fourmis
  fourmis: 500,
  evaporation: 0.002, // part de phéromone qui s'évapore à chaque pas
  diffusion: 0.15,    // part qui se répand aux cases voisines (tous les 4 pas)
  oubli: 0.002,       // β : le marquage faiblit avec le temps depuis le départ, exp(−β t)
  angleCapteur: 40,   // degrés
  virage: 25,         // degrés par pas, au plus
}

// Réglages qui demandent de recréer le monde
export const REGLAGES_DE_DEPART = ['modele', 'fourmis']

const RAD = Math.PI / 180
const INF = Infinity

/* ================================================================
   Terrain : description et construction
   ================================================================ */

/**
 * Un terrain vide (de l'herbe), de taille largeur × hauteur mètres.
 * Une porte : { x, y, nom, o: [3], d: [3], type } ; o et d donnent son
 * poids comme départ et comme destination, le matin, à midi et le soir.
 */
export function terrainVide(largeur, hauteur, h = 0.5) {
  const W = Math.round(largeur / h)
  const H = Math.round(hauteur / h)
  return { W, H, h, sol: new Uint8Array(W * H), fond: 'herbe', portes: [], zones: [], arbres: [] }
}

export const porte = (x, y, nom = '', poids = 1, type = 'porte') => ({
  x, y, nom, type,
  o: Array.isArray(poids) ? poids.slice() : [poids, poids, poids],
  d: Array.isArray(poids) ? poids.slice() : [poids, poids, poids],
})

/** Peint un rectangle (en mètres) d'un type de sol */
export function rectangle(t, type, x0, y0, x1, y1) {
  const { W, H, h, sol } = t
  const i0 = Math.max(0, Math.floor(Math.min(x0, x1) / h)), i1 = Math.min(W - 1, Math.ceil(Math.max(x0, x1) / h) - 1)
  const j0 = Math.max(0, Math.floor(Math.min(y0, y1) / h)), j1 = Math.min(H - 1, Math.ceil(Math.max(y0, y1) / h) - 1)
  for (let j = j0; j <= j1; j++) for (let i = i0; i <= i1; i++) sol[j * W + i] = type
}

/** Peint un disque (centre et rayon en mètres) */
export function disque(t, type, cx, cy, r) {
  const { W, H, h, sol } = t
  const i0 = Math.max(0, Math.floor((cx - r) / h)), i1 = Math.min(W - 1, Math.floor((cx + r) / h))
  const j0 = Math.max(0, Math.floor((cy - r) / h)), j1 = Math.min(H - 1, Math.floor((cy + r) / h))
  for (let j = j0; j <= j1; j++) {
    for (let i = i0; i <= i1; i++) {
      const dx = (i + 0.5) * h - cx, dy = (j + 0.5) * h - cy
      if (dx * dx + dy * dy <= r * r) sol[j * W + i] = type
    }
  }
}

/** Peint un trait d'épaisseur e (mètres) entre deux points */
export function trait(t, type, x0, y0, x1, y1, e) {
  const L = Math.hypot(x1 - x0, y1 - y0)
  const n = Math.max(1, Math.ceil(L / (t.h * 0.5)))
  for (let k = 0; k <= n; k++) disque(t, type, x0 + ((x1 - x0) * k) / n, y0 + ((y1 - y0) * k) / n, e / 2)
}

/** Un arbre : un disque infranchissable (le tronc et le pied), noté pour la 3D */
export function arbre(t, x, y, r = 1) {
  disque(t, SOL.ARBRE, x, y, r)
  t.arbres.push([x, y, r])
}

export const copieTerrain = (t) => ({
  ...t,
  sol: t.sol.slice(),
  portes: t.portes.map((p) => ({ ...p, o: p.o.slice(), d: p.d.slice() })),
  zones: t.zones.map((z) => ({ ...z })),
  arbres: t.arbres.map((a) => a.slice()),
})

const franchissable = (s) => s === SOL.HERBE || s === SOL.PAVE

/* ================================================================
   Monde
   ================================================================ */

export function creerMonde(terrain, reglages = {}, graine = 1) {
  const p = { ...structuredClone(DEFAUTS), ...structuredClone(reglages) }
  const t = copieTerrain(terrain)
  const { W, H } = t
  const n = W * H
  const m = {
    p, t, W, H, h: t.h, alea: generateur(graine),
    pas: 0,
    version: 1,                 // change à chaque modification du sol
    sale: false,                // des obstacles ont changé : distances à recalculer
    G: new Float32Array(n),     // usure de l'herbe (0 : intacte, 1 : terre nue)
    C: new Float32Array(n),     // confort : 1 sur une allée, G sur l'herbe, 0 sur un obstacle
    V: new Float32Array(n),     // potentiel des sentiers : le confort vu à la distance σ
    tmp: new Float32Array(n),
    tmp2: new Float32Array(n),
    sigmaV: -1, ageV: INF,      // le potentiel est recalculé de temps en temps
    // distances à chaque porte (marche rapide) : à vol d'oiseau autour des obstacles,
    // et « en effort » (modèle de moindre effort, recalculées au fil de l'eau)
    distances: [],
    visibles: [],               // pour chaque porte : les cases d'où on la voit (on y va alors tout droit)
    efforts: [],
    prochainEffort: 0,
    // marcheurs : x, y (m), vx, vy, type, destination, distance parcourue, distance au départ, âge
    mx: new Float32Array(MAX_MARCHEURS), my: new Float32Array(MAX_MARCHEURS),
    mvx: new Float32Array(MAX_MARCHEURS), mvy: new Float32Array(MAX_MARCHEURS),
    mtype: new Uint8Array(MAX_MARCHEURS), mdest: new Uint8Array(MAX_MARCHEURS),
    mparcours: new Float32Array(MAX_MARCHEURS), mdirect: new Float32Array(MAX_MARCHEURS),
    mage: new Int32Array(MAX_MARCHEURS), mconfort: new Float32Array(MAX_MARCHEURS),
    nm: 0,
    reste: 0,                   // fraction de marcheur à faire naître au pas suivant
    // fourmis
    P1: new Float32Array(n),    // phéromone « vers le nid » (posée en cherchant)
    P2: new Float32Array(n),    // phéromone « vers la nourriture » (posée en rentrant)
    fx: null, fy: null, fcap: null, fetat: null, fdepart: null, fzone: null,
    nf: 0,
    // bilans
    passages: 0, abandons: 0, livrees: 0,
    detours: [], conforts: [],  // derniers arrivés (fenêtre glissante)
    zonesComptes: [],           // fourmis : passages par zone (double pont)
    zonesRecents: [],
  }
  m.zonesComptes = t.zones.map(() => 0)
  if (p.modele === 'fourmis') initFourmis(m)
  preparer(m)
  return m
}

/** Après un changement du sol ou des portes : confort, distances, potentiel */
function preparer(m, geometrie = true) {
  const { W, H, t, G, C } = m
  for (let k = 0; k < W * H; k++) {
    const s = t.sol[k]
    if (s !== SOL.HERBE) G[k] = 0
    C[k] = s === SOL.PAVE ? 1 : s === SOL.HERBE ? G[k] : 0
  }
  if (geometrie) {
    // les distances ne changent que si les obstacles ou les portes changent
    m.distances = t.portes.map((po) => marcheRapide(W, H, coutUniforme(m), sourcesDe(m, po)))
    m.visibles = t.portes.map((po) => visibilite(m, po))
    m.efforts = m.p.modele === 'effort' ? t.portes.map((po) => marcheRapide(W, H, coutEffort(m), sourcesDe(m, po))) : []
    m.sale = false
  }
  m.ageV = INF
  // marcheurs dont la destination a disparu
  for (let i = m.nm - 1; i >= 0; i--) if (m.mdest[i] >= t.portes.length) retirer(m, i)
  m.version++
}

/** Après des retouches au pinceau : recalcule les distances, une seule fois */
export function rafraichir(m) {
  if (m.sale) preparer(m, true)
}

// Les cases d'où l'on voit une porte, sans obstacle entre les deux
function visibilite(m, po) {
  const { W, H, h, t } = m
  const vu = new Uint8Array(W * H)
  const u0 = po.x / h, v0 = po.y / h
  for (let j = 0; j < H; j++) {
    for (let i = 0; i < W; i++) {
      const k = j * W + i
      if (!franchissable(t.sol[k])) continue
      const du = i + 0.5 - u0, dv = j + 0.5 - v0
      const n = Math.ceil(Math.hypot(du, dv) * 1.5)
      let ok = true
      for (let q = 1; q < n; q++) {
        const u = u0 + (du * q) / n, v = v0 + (dv * q) / n
        const s = t.sol[Math.floor(v) * W + Math.floor(u)]
        if (s !== SOL.HERBE && s !== SOL.PAVE) { ok = false; break }
      }
      vu[k] = ok ? 1 : 0
    }
  }
  return vu
}

function coutUniforme(m) {
  const { W, H, h, t } = m
  const c = m.tmp2
  for (let k = 0; k < W * H; k++) c[k] = franchissable(t.sol[k]) ? h : INF
  return c
}

function coutEffort(m) {
  const { W, H, h, t, C, p } = m
  const c = m.tmp2
  for (let k = 0; k < W * H; k++) c[k] = franchissable(t.sol[k]) ? h * (1 - p.effort * C[k]) : INF
  return c
}

// Les cases d'une porte : un petit disque de 1 m autour d'elle, franchissable
function sourcesDe(m, po) {
  const { W, H, h, t } = m
  const s = []
  const r = 1
  const i0 = Math.floor((po.x - r) / h), i1 = Math.floor((po.x + r) / h)
  const j0 = Math.floor((po.y - r) / h), j1 = Math.floor((po.y + r) / h)
  for (let j = Math.max(0, j0); j <= Math.min(H - 1, j1); j++) {
    for (let i = Math.max(0, i0); i <= Math.min(W - 1, i1); i++) {
      const k = j * W + i
      if (franchissable(t.sol[k]) && ((i + 0.5) * h - po.x) ** 2 + ((j + 0.5) * h - po.y) ** 2 <= r * r) s.push(k)
    }
  }
  if (!s.length) {
    // porte posée sur un obstacle : la case franchissable la plus proche
    let best = -1, bd = INF
    for (let k = 0; k < W * H; k++) {
      if (!franchissable(t.sol[k])) continue
      const d = (((k % W) + 0.5) * h - po.x) ** 2 + ((Math.floor(k / W) + 0.5) * h - po.y) ** 2
      if (d < bd) { bd = d; best = k }
    }
    if (best >= 0) s.push(best)
  }
  return s
}

/* ================================================================
   Marche rapide (Sethian, 1996) : le temps d'arrivée T d'un front qui
   part des sources et avance à la vitesse 1/coût. T est la distance la
   plus courte (pondérée par le coût) en contournant les obstacles :
   |∇T| = coût, l'équation eikonale.
   ================================================================ */

// Tas binaire (clé flottante, valeur entière), avec doublons : on ignore les entrées périmées
function creerTas(capacite) {
  let cles = new Float64Array(capacite), vals = new Int32Array(capacite), n = 0
  return {
    get taille() { return n },
    pousser(c, v) {
      if (n === cles.length) {
        const c2 = new Float64Array(n * 2); c2.set(cles); cles = c2
        const v2 = new Int32Array(n * 2); v2.set(vals); vals = v2
      }
      let i = n++
      while (i > 0) {
        const pa = (i - 1) >> 1
        if (cles[pa] <= c) break
        cles[i] = cles[pa]; vals[i] = vals[pa]; i = pa
      }
      cles[i] = c; vals[i] = v
    },
    // retire le minimum ; renvoie sa valeur (la clé est dans .cle)
    tirer() {
      const v = vals[0]
      this.cle = cles[0]
      const c = cles[--n], vv = vals[n]
      let i = 0
      for (;;) {
        let f = 2 * i + 1
        if (f >= n) break
        if (f + 1 < n && cles[f + 1] < cles[f]) f++
        if (cles[f] >= c) break
        cles[i] = cles[f]; vals[i] = vals[f]; i = f
      }
      cles[i] = c; vals[i] = vv
      return v
    },
    cle: 0,
  }
}

export function marcheRapide(W, H, cout, sources) {
  const T = new Float32Array(W * H).fill(INF)
  const fige = new Uint8Array(W * H)
  const tas = creerTas(4096)
  for (const k of sources) { T[k] = 0; tas.pousser(0, k) }
  const resoudre = (k) => {
    const i = k % W, j = (k - i) / W
    const c = cout[k]
    if (c === INF) return INF
    const a = Math.min(i > 0 ? T[k - 1] : INF, i < W - 1 ? T[k + 1] : INF)
    const b = Math.min(j > 0 ? T[k - W] : INF, j < H - 1 ? T[k + W] : INF)
    if (a === INF && b === INF) return INF
    if (a === INF || b === INF || Math.abs(a - b) >= c) return Math.min(a, b) + c
    return (a + b + Math.sqrt(2 * c * c - (a - b) * (a - b))) / 2
  }
  while (tas.taille) {
    const k = tas.tirer()
    // la première sortie d'une case est la bonne (sa plus petite clé) ; les suivantes sont périmées
    if (fige[k]) continue
    fige[k] = 1
    const i = k % W
    const voisins = [i > 0 ? k - 1 : -1, i < W - 1 ? k + 1 : -1, k >= W ? k - W : -1, k < W * (H - 1) ? k + W : -1]
    for (const v of voisins) {
      if (v < 0 || fige[v]) continue
      const tv = resoudre(v)
      if (tv < T[v]) { T[v] = tv; tas.pousser(tv, v) }
    }
  }
  return T
}

/* ================================================================
   Champs : échantillonnage, gradient, flou
   ================================================================ */

// Valeur bilinéaire du champ F au point (u, v) en coordonnées de cases (centre de la case i : i + 0,5)
function bilin(F, W, H, u, v) {
  u -= 0.5; v -= 0.5
  let i = Math.floor(u), j = Math.floor(v)
  const fx = u - i, fy = v - j
  if (i < 0) i = 0; if (j < 0) j = 0
  const i1 = Math.min(W - 1, i + 1), j1 = Math.min(H - 1, j + 1)
  if (i > W - 1) i = W - 1; if (j > H - 1) j = H - 1
  const a = F[j * W + i], b = F[j * W + i1], c = F[j1 * W + i], d = F[j1 * W + i1]
  return (a * (1 - fx) + b * fx) * (1 - fy) + (c * (1 - fx) + d * fx) * fy
}

/**
 * Direction de plus forte descente d'un champ de distances, au point (x, y) en mètres.
 * Écrit dans out[0..1] ; renvoie la distance locale (INF si la destination est inaccessible).
 */
function descente(m, D, x, y, out) {
  const { W, H, h } = m
  const u = x / h, v = y / h
  const i = Math.min(W - 1, Math.max(0, Math.floor(u))), j = Math.min(H - 1, Math.max(0, Math.floor(v)))
  const ici = D[j * W + i]
  if (ici === INF) { out[0] = 0; out[1] = 0; return INF }
  const e = 0.7
  const a = bilin(D, W, H, u + e, v), b = bilin(D, W, H, u - e, v)
  const c = bilin(D, W, H, u, v + e), d = bilin(D, W, H, u, v - e)
  if (a !== INF && b !== INF && c !== INF && d !== INF && Number.isFinite(a + b + c + d)) {
    const gx = a - b, gy = c - d
    const n = Math.hypot(gx, gy)
    if (n > 1e-9) { out[0] = -gx / n; out[1] = -gy / n; return bilin(D, W, H, u, v) }
  }
  // près d'un obstacle : la case voisine la plus proche du but
  let best = ici, bx = 0, by = 0
  for (let dj = -1; dj <= 1; dj++) {
    for (let di = -1; di <= 1; di++) {
      if (!di && !dj) continue
      const ii = i + di, jj = j + dj
      if (ii < 0 || jj < 0 || ii >= W || jj >= H) continue
      const val = D[jj * W + ii] + (di && dj ? 0.2 * h : 0)
      if (val < best) { best = val; bx = di; by = dj }
    }
  }
  if (!bx && !by) {
    // au fond de la cuvette : droit vers le centre de la case
    bx = (i + 0.5) - u; by = (j + 0.5) - v
  }
  const n = Math.hypot(bx, by) || 1
  out[0] = bx / n; out[1] = by / n
  return ici
}

/**
 * Flou d'à peu près gaussien (trois flous en boîte successifs, en x puis en y),
 * normalisé : la moyenne pondérée du confort autour de chaque case.
 */
export function flou(src, dst, tmp, W, H, sigma) {
  // largeur d'une boîte pour que trois boîtes donnent un écart-type σ (en cases)
  const r = Math.max(1, Math.round((Math.sqrt((12 * sigma * sigma) / 3 + 1) - 1) / 2))
  dst.set(src)
  for (let passe = 0; passe < 3; passe++) {
    boiteX(dst, tmp, W, H, r)
    boiteY(tmp, dst, W, H, r)
  }
}

function boiteX(s, d, W, H, r) {
  const inv = 1 / (2 * r + 1)
  for (let j = 0; j < H; j++) {
    const o = j * W
    let acc = 0
    // bords : on prolonge la première et la dernière valeur
    for (let k = -r; k <= r; k++) acc += s[o + Math.min(W - 1, Math.max(0, k))]
    for (let i = 0; i < W; i++) {
      d[o + i] = acc * inv
      acc += s[o + Math.min(W - 1, i + r + 1)] - s[o + Math.max(0, i - r)]
    }
  }
}

function boiteY(s, d, W, H, r) {
  const inv = 1 / (2 * r + 1)
  for (let i = 0; i < W; i++) {
    let acc = 0
    for (let k = -r; k <= r; k++) acc += s[Math.min(H - 1, Math.max(0, k)) * W + i]
    for (let j = 0; j < H; j++) {
      d[j * W + i] = acc * inv
      acc += s[Math.min(H - 1, j + r + 1) * W + i] - s[Math.max(0, j - r) * W + i]
    }
  }
}

/* ================================================================
   Marcheurs
   ================================================================ */

function retirer(m, i) {
  const k = --m.nm
  if (i === k) return
  m.mx[i] = m.mx[k]; m.my[i] = m.my[k]; m.mvx[i] = m.mvx[k]; m.mvy[i] = m.mvy[k]
  m.mtype[i] = m.mtype[k]; m.mdest[i] = m.mdest[k]; m.mparcours[i] = m.mparcours[k]
  m.mdirect[i] = m.mdirect[k]; m.mage[i] = m.mage[k]; m.mconfort[i] = m.mconfort[k]
}

/** Moment de la journée (0 à 1), période (0 matin, 1 midi, 2 soir) et intensité du flux */
export function horaire(m) {
  const f = (m.pas % JOUR) / JOUR
  if (!m.p.pointe) return { f, periode: -1, flux: 1 }
  const g = (c, l) => Math.exp(-(((f - c) / l) ** 2))
  // deux heures de pointe (matin, soir) et un midi plus calme, moyenne ≈ 1
  const flux = (0.25 + 1.7 * g(0.18, 0.06) + 0.9 * g(0.5, 0.07) + 1.7 * g(0.82, 0.06)) / 0.8
  return { f, periode: f < 0.36 ? 0 : f < 0.64 ? 1 : 2, flux }
}

function tirerPoids(alea, poids) {
  let s = 0
  for (const w of poids) s += w
  if (s <= 0) return -1
  let r = alea() * s
  for (let k = 0; k < poids.length; k++) { r -= poids[k]; if (r <= 0) return k }
  return poids.length - 1
}

function naissances(m) {
  const { p, t, alea } = m
  const portes = t.portes
  if (portes.length < 2) return
  const { periode, flux } = horaire(m)
  const poids = (po, cle) => (periode < 0 ? (po[cle][0] + po[cle][1] + po[cle][2]) / 3 : po[cle][periode])
  m.reste += (p.debit / JOUR) * flux
  while (m.reste >= 1) {
    m.reste -= 1
    if (m.nm >= MAX_MARCHEURS) { m.reste = 0; break }
    const o = tirerPoids(alea, portes.map((po) => poids(po, 'o')))
    if (o < 0) break
    const d = tirerPoids(alea, portes.map((po, k) => (k === o ? 0 : poids(po, 'd'))))
    if (d < 0) continue
    const D = m.distances[d]
    const po = portes[o]
    // départ : un point franchissable au hasard près de la porte d'origine
    let x, y, essais = 0
    do {
      const a = alea() * 2 * Math.PI, r = Math.sqrt(alea()) * 1
      x = po.x + r * Math.cos(a); y = po.y + r * Math.sin(a)
    } while (essais++ < 10 && !libre(m, x, y))
    if (!libre(m, x, y)) continue
    const dist = bilinSur(m, D, x, y)
    if (!Number.isFinite(dist) || dist < 2) continue
    const i = m.nm++
    const type = tirerPoids(alea, p.parts)
    m.mx[i] = x; m.my[i] = y; m.mvx[i] = 0; m.mvy[i] = 0
    m.mtype[i] = Math.max(0, type); m.mdest[i] = d
    m.mparcours[i] = 0; m.mdirect[i] = dist; m.mage[i] = 0; m.mconfort[i] = 0
  }
}

function bilinSur(m, F, x, y) {
  const { W, H, h } = m
  const i = Math.min(W - 1, Math.max(0, Math.floor(x / h))), j = Math.min(H - 1, Math.max(0, Math.floor(y / h)))
  if (F[j * W + i] === INF) return INF
  const v = bilin(F, W, H, x / h, y / h)
  return Number.isFinite(v) ? v : F[j * W + i]
}

function libre(m, x, y) {
  const { W, H, h, t } = m
  const i = Math.floor(x / h), j = Math.floor(y / h)
  if (i < 0 || j < 0 || i >= W || j >= H) return false
  return franchissable(t.sol[j * W + i])
}

// Usure : les pas d'un marcheur sur l'herbe, répartis sur les quatre cases autour de lui
function pietiner(m, x, y, quantite) {
  const { W, H, h, t, G } = m
  const u = x / h - 0.5, v = y / h - 0.5
  const i = Math.floor(u), j = Math.floor(v)
  const fx = u - i, fy = v - j
  const coins = [[i, j, (1 - fx) * (1 - fy)], [i + 1, j, fx * (1 - fy)], [i, j + 1, (1 - fx) * fy], [i + 1, j + 1, fx * fy]]
  for (const [a, b, w] of coins) {
    if (a < 0 || b < 0 || a >= W || b >= H) continue
    const k = b * W + a
    if (t.sol[k] !== SOL.HERBE) continue
    G[k] += quantite * w * (1 - G[k])
  }
}

const dir = [0, 0]

function pasMarcheurs(m) {
  const { p, W, H, h, V, alea } = m
  const effort = p.modele === 'effort'
  const sigmaCases = p.sigma / h
  const pasRef = 1.3 * DT    // longueur d'un pas « ordinaire » : l'usure est donnée pour lui
  const profils = TYPES.map((k) => PROFILS[k])
  for (let i = m.nm - 1; i >= 0; i--) {
    const pr = profils[m.mtype[i]]
    const x = m.mx[i], y = m.my[i]
    const D = effort ? (m.efforts[m.mdest[i]] ?? m.distances[m.mdest[i]]) : m.distances[m.mdest[i]]
    let reste = descente(m, D, x, y, dir)
    // la porte est en vue : on y va tout droit (plus juste que la pente de la carte des distances)
    const vu = m.visibles[m.mdest[i]]
    if (!effort && vu && reste !== INF) {
      const kc = Math.min(H - 1, Math.floor(y / h)) * W + Math.min(W - 1, Math.floor(x / h))
      if (vu[kc]) {
        const po = m.t.portes[m.mdest[i]]
        const dx = po.x - x, dy = po.y - y
        const l = Math.hypot(dx, dy) || 1
        dir[0] = dx / l; dir[1] = dy / l
        reste = l
      }
    }
    const restant = bilinSur(m, m.distances[m.mdest[i]], x, y)
    if (reste === INF || !Number.isFinite(restant)) { retirer(m, i); m.abandons++; continue }
    // arrivé ?
    if (restant < 1.2) {
      m.passages++
      const detour = m.mdirect[i] > 4 ? Math.max(0, (m.mparcours[i] + restant) / m.mdirect[i] - 1) : 0
      m.detours.push(detour)
      m.conforts.push(m.mage[i] ? m.mconfort[i] / m.mage[i] : 0)
      if (m.detours.length > 120) { m.detours.shift(); m.conforts.shift() }
      retirer(m, i)
      continue
    }
    // trop long : il s'est perdu (pris dans un sentier qui ne mène pas chez lui)
    if (m.mage[i] > 40 + (6 * m.mdirect[i]) / (pr.vitesse * DT)) { retirer(m, i); m.abandons++; continue }

    let ex = dir[0], ey = dir[1]
    if (!effort && p.attrait > 0) {
      // attrait des sentiers : σ ∇V, sans dimension (V est une moyenne de confort entre 0 et 1)
      const u = x / h, v = y / h
      let gx = (bilin(V, W, H, u + 1, v) - bilin(V, W, H, u - 1, v)) * 0.5 * sigmaCases
      let gy = (bilin(V, W, H, u, v + 1) - bilin(V, W, H, u, v - 1)) * 0.5 * sigmaCases
      // on ne revient pas en arrière pour rejoindre un sentier : la part de l'attrait
      // qui tire à rebours de la destination est ignorée (il reste l'attrait de côté
      // et vers l'avant). Le marcheur avance donc toujours vers son but.
      const avant = gx * ex + gy * ey
      if (avant < 0) { gx -= avant * ex; gy -= avant * ey }
      const a = p.attrait * pr.attrait * 4
      ex += a * gx; ey += a * gy
    }
    // un peu de hasard dans la direction
    const bruit = p.bruit * pr.bruit
    if (bruit > 0) {
      const ang = bruit * (alea() + alea() + alea() - 1.5) * 1.414
      const c = Math.cos(ang), s = Math.sin(ang)
      const tx = ex * c - ey * s
      ey = ex * s + ey * c; ex = tx
    }
    const n = Math.hypot(ex, ey) || 1
    ex /= n; ey /= n
    // vitesse : relaxation vers la vitesse voulue (temps 1 s)
    const v0 = pr.vitesse * DT
    let vx = m.mvx[i] + (v0 * ex - m.mvx[i]) * 0.5
    let vy = m.mvy[i] + (v0 * ey - m.mvy[i]) * 0.5
    // obstacles : contre un mur, on oublie les sentiers et l'on vise le but ; puis on glisse le long
    let nx = x + vx, ny = y + vy
    if (!libre(m, nx, ny)) {
      vx = v0 * dir[0]; vy = v0 * dir[1]
      nx = x + vx; ny = y + vy
    }
    if (!libre(m, nx, ny)) {
      if (libre(m, nx, y)) { ny = y; vy = 0 } else if (libre(m, x, ny)) { nx = x; vx = 0 } else {
        nx = x; ny = y; vx = 0; vy = 0
        const a = alea() * 2 * Math.PI
        m.mvx[i] = 0.3 * v0 * Math.cos(a); m.mvy[i] = 0.3 * v0 * Math.sin(a)
      }
    }
    const l = Math.hypot(nx - x, ny - y)
    if (l > 0) {
      m.mvx[i] = vx; m.mvy[i] = vy
      m.mx[i] = nx; m.my[i] = ny
      m.mparcours[i] += l
      pietiner(m, nx, ny, p.usure * (l / pasRef))
    }
    m.mage[i]++
    const kk = Math.min(H - 1, Math.floor(ny / h)) * W + Math.min(W - 1, Math.floor(nx / h))
    if (m.C[kk] > 0.5) m.mconfort[i]++
  }
}

// L'herbe repousse : G décroît vers 0 avec le temps T ; le confort suit
function repousse(m, n) {
  const { W, H, G, C, t, p } = m
  const f = Math.exp(-n / (Math.max(0.05, p.repousse) * JOUR))
  for (let k = 0; k < W * H; k++) {
    if (t.sol[k] !== SOL.HERBE) continue
    G[k] *= f
    C[k] = G[k]
  }
}

/* ================================================================
   Fourmis
   ================================================================ */

function initFourmis(m) {
  const n = Math.min(MAX_FOURMIS, Math.round(m.p.fourmis))
  m.fx = new Float32Array(MAX_FOURMIS); m.fy = new Float32Array(MAX_FOURMIS)
  m.fcap = new Float32Array(MAX_FOURMIS); m.fetat = new Uint8Array(MAX_FOURMIS)
  m.fdepart = new Int32Array(MAX_FOURMIS); m.fzone = new Int8Array(MAX_FOURMIS)
  m.nf = 0
  const nids = m.t.portes.filter((po) => po.type === 'nid')
  if (!nids.length) return
  // elles sortent du nid peu à peu (voir pasFourmis) ; ici, on prépare la place
  m.aSortir = n
}

function sortir(m) {
  const nids = m.t.portes.filter((po) => po.type === 'nid')
  if (!nids.length || m.aSortir <= 0) return
  // quelques-unes par pas, pour ne pas partir toutes ensemble
  for (let k = 0; k < 3 && m.aSortir > 0 && m.nf < MAX_FOURMIS; k++) {
    const nid = nids[Math.floor(m.alea() * nids.length)]
    const i = m.nf++
    m.aSortir--
    m.fx[i] = nid.x / m.h; m.fy[i] = nid.y / m.h
    m.fcap[i] = m.alea() * 2 * Math.PI
    m.fetat[i] = 0; m.fdepart[i] = m.pas; m.fzone[i] = -1
  }
}

function libreCase(m, u, v) {
  const i = Math.floor(u), j = Math.floor(v)
  if (i < 0 || j < 0 || i >= m.W || j >= m.H) return false
  return franchissable(m.t.sol[j * m.W + i])
}

function sentir(m, F, u, v) {
  const i = Math.floor(u), j = Math.floor(v)
  if (i < 0 || j < 0 || i >= m.W || j >= m.H) return -1
  if (!franchissable(m.t.sol[j * m.W + i])) return -1
  return F[j * m.W + i]
}

function pasFourmis(m) {
  const { p, alea, h, W } = m
  sortir(m)
  const portes = m.t.portes
  const nids = portes.filter((po) => po.type === 'nid')
  const sources = portes.filter((po) => po.type === 'nourriture')
  const a = p.angleCapteur * RAD
  const rot = p.virage * RAD
  const portee = 4          // cases : distance des capteurs
  const vitesse = 1         // case par pas
  const vueBut = 2.5 / h    // elle voit (ou sent) le nid ou la nourriture à 2,5 unités
  const arrivee = 1.2 / h
  for (let i = 0; i < m.nf; i++) {
    let u = m.fx[i], v = m.fy[i], c = m.fcap[i]
    const etat = m.fetat[i]
    const suivi = etat === 0 ? m.P2 : m.P1          // elle cherche : la piste de la nourriture ; elle rentre : celle du nid
    const buts = etat === 0 ? sources : nids
    // le but est-il en vue ?
    let vise = null
    for (const b of buts) {
      const bu = b.x / h, bv = b.y / h
      const d2 = (bu - u) ** 2 + (bv - v) ** 2
      if (d2 < vueBut * vueBut) { vise = [bu, bv, d2]; break }
    }
    if (vise) {
      if (vise[2] < arrivee * arrivee) {
        // arrivée : demi-tour, l'autre phéromone
        m.fetat[i] = 1 - etat
        m.fdepart[i] = m.pas
        c += Math.PI
        if (etat === 1) m.livrees++
      } else c = Math.atan2(vise[1] - v, vise[0] - u)
    } else {
      const g = sentir(m, suivi, u + portee * Math.cos(c - a), v + portee * Math.sin(c - a))
      const f = sentir(m, suivi, u + portee * Math.cos(c), v + portee * Math.sin(c))
      const d = sentir(m, suivi, u + portee * Math.cos(c + a), v + portee * Math.sin(c + a))
      if (f >= g && f >= d) {
        if (f < 0) c += (alea() < 0.5 ? -1 : 1) * rot * 2   // un mur devant
      } else if (g > d) c -= rot
      else if (d > g) c += rot
      else c += (alea() < 0.5 ? -1 : 1) * rot                 // égalité : au hasard
      c += (alea() - 0.5) * rot * 0.8                      // l'errance
    }
    const nu = u + vitesse * Math.cos(c), nv = v + vitesse * Math.sin(c)
    if (libreCase(m, nu, nv)) { u = nu; v = nv } else c += Math.PI * (0.5 + alea())
    m.fx[i] = u; m.fy[i] = v; m.fcap[i] = c
    // marquage : d'autant plus fort qu'elle a quitté le nid (ou la nourriture) récemment
    const k = Math.floor(v) * W + Math.floor(u)
    const q = Math.exp(-p.oubli * (m.pas - m.fdepart[i]))
    const F = m.fetat[i] === 0 ? m.P1 : m.P2
    if (q > F[k]) F[k] = q
    // passages par zone (double pont)
    if (m.t.zones.length) {
      let z = -1
      for (let q2 = 0; q2 < m.t.zones.length; q2++) {
        const Z = m.t.zones[q2]
        if (u * h >= Z.x0 && u * h <= Z.x1 && v * h >= Z.y0 && v * h <= Z.y1) { z = q2; break }
      }
      if (z >= 0 && z !== m.fzone[i]) {
        m.zonesComptes[z]++
        m.zonesRecents.push(z)
        if (m.zonesRecents.length > 200) m.zonesRecents.shift()
      }
      m.fzone[i] = z
    }
  }
  // le nid sent le nid : ses abords sont marqués en permanence
  for (const nid of nids) {
    const r = Math.ceil(1.5 / h), ci = Math.floor(nid.x / h), cj = Math.floor(nid.y / h)
    for (let dj = -r; dj <= r; dj++) {
      for (let di = -r; di <= r; di++) {
        const i = ci + di, j = cj + dj
        if (i < 0 || j < 0 || i >= m.W || j >= m.H || di * di + dj * dj > r * r) continue
        const k = j * W + i
        if (franchissable(m.t.sol[k])) m.P1[k] = 1
      }
    }
  }
  // évaporation à chaque pas, diffusion tous les 4 pas
  const e = 1 - p.evaporation
  const n = m.W * m.H
  for (let k = 0; k < n; k++) { m.P1[k] *= e; m.P2[k] *= e }
  if (m.pas % 4 === 0 && p.diffusion > 0) {
    diffuser(m, m.P1)
    diffuser(m, m.P2)
  }
}

function diffuser(m, F) {
  const { W, H, t, tmp } = m
  const d = m.p.diffusion
  for (let j = 0; j < H; j++) {
    for (let i = 0; i < W; i++) {
      const k = j * W + i
      if (!franchissable(t.sol[k])) { tmp[k] = 0; continue }
      let s = 0, nb = 0
      if (i > 0 && franchissable(t.sol[k - 1])) { s += F[k - 1]; nb++ }
      if (i < W - 1 && franchissable(t.sol[k + 1])) { s += F[k + 1]; nb++ }
      if (j > 0 && franchissable(t.sol[k - W])) { s += F[k - W]; nb++ }
      if (j < H - 1 && franchissable(t.sol[k + W])) { s += F[k + W]; nb++ }
      tmp[k] = nb ? (1 - d) * F[k] + (d * s) / nb : F[k]
    }
  }
  F.set(tmp)
}

/* ================================================================
   Avancer
   ================================================================ */

export function avancer(m, n = 1) {
  for (let k = 0; k < n; k++) {
    if (m.p.modele === 'fourmis') pasFourmis(m)
    else {
      // le potentiel des sentiers (flou du confort) n'est recalculé que tous les 8 pas
      if (m.p.modele === 'helbing' && (m.ageV >= 8 || m.sigmaV !== m.p.sigma)) {
        flou(m.C, m.V, m.tmp, m.W, m.H, m.p.sigma / m.h)
        m.ageV = 0
        m.sigmaV = m.p.sigma
      }
      m.ageV++
      // moindre effort : une carte des coûts refaite à tour de rôle, une porte tous les 25 pas
      if (m.p.modele === 'effort' && m.t.portes.length && m.pas % 25 === 0) {
        const q = m.prochainEffort % m.t.portes.length
        m.efforts[q] = marcheRapide(m.W, m.H, coutEffort(m), sourcesDe(m, m.t.portes[q]))
        m.prochainEffort++
      }
      naissances(m)
      pasMarcheurs(m)
      if (m.pas % 4 === 3) repousse(m, 4)
    }
    m.pas++
  }
}

/* ================================================================
   Réglages et modifications du terrain
   ================================================================ */

/** Change des réglages sans recréer le monde */
export function regler(m, changements) {
  const avant = m.p.modele
  Object.assign(m.p, structuredClone(changements))
  if ('effort' in changements && m.p.modele === 'effort') m.efforts = m.t.portes.map((po) => marcheRapide(m.W, m.H, coutEffort(m), sourcesDe(m, po)))
  if (m.p.modele !== avant) preparer(m)
}

/** Peint le sol : type de sol, centre (m), rayon (m) ; un trait si (x0, y0) est donné */
export function peindre(m, type, x, y, rayon, x0 = null, y0 = null) {
  const avant = m.t.sol.slice()
  if (x0 !== null) trait(m.t, type, x0, y0, x, y, rayon * 2)
  else disque(m.t, type, x, y, rayon)
  if (type === SOL.ARBRE) m.t.arbres.push([x, y, rayon])
  // un arbre effacé disparaît de la liste
  m.t.arbres = m.t.arbres.filter(([ax, ay]) => m.t.sol[Math.floor(ay / m.h) * m.W + Math.floor(ax / m.h)] === SOL.ARBRE)
  // un obstacle posé ou retiré change les distances : on les recalculera (rafraichir) ;
  // de l'herbe devenue allée (ou l'inverse) ne change que le confort, tout de suite
  let obstacles = false
  for (let k = 0; k < avant.length; k++) {
    if (avant[k] !== m.t.sol[k] && (!franchissable(avant[k]) || !franchissable(m.t.sol[k]))) { obstacles = true; break }
  }
  if (obstacles) m.sale = true
  preparer(m, false)
}

/** Pose une porte (ou retire celle qui est sous le doigt) */
export function basculerPorte(m, x, y, type = 'porte') {
  const portes = m.t.portes
  const rayon = 5 * m.h
  const k = portes.findIndex((po) => Math.hypot(po.x - x, po.y - y) < rayon)
  if (k >= 0) {
    portes.splice(k, 1)
    for (let i = m.nm - 1; i >= 0; i--) {
      if (m.mdest[i] === k) retirer(m, i)
      else if (m.mdest[i] > k) m.mdest[i]--
    }
  } else if (portes.length < MAX_PORTES) {
    const noms = new Set(portes.map((po) => po.nom))
    let c = 65
    while (noms.has(String.fromCharCode(c))) c++
    portes.push(porte(x, y, type === 'porte' ? String.fromCharCode(c) : '', 1, type))
  }
  preparer(m, true)
}

/** Change le poids d'une porte (comme départ et comme destination) */
export function poidsPorte(m, k, poids) {
  const po = m.t.portes[k]
  if (!po) return
  po.o = [poids, poids, poids]
  po.d = [poids, poids, poids]
}

/** L'architecte suit les lignes de désir : les sentiers bien marqués deviennent des allées */
export function paverSentiers(m, seuil = 0.55) {
  const { W, H, G, t } = m
  let n = 0
  for (let k = 0; k < W * H; k++) {
    if (t.sol[k] === SOL.HERBE && G[k] >= seuil) { t.sol[k] = SOL.PAVE; n++ }
  }
  preparer(m, false)
  return n
}

/** Herbe neuve partout */
export function effacerSentiers(m) {
  m.G.fill(0)
  m.P1.fill(0)
  m.P2.fill(0)
  preparer(m, false)
}

/* ================================================================
   Mesures
   ================================================================ */

const moyenne = (l) => (l.length ? l.reduce((a, b) => a + b, 0) / l.length : 0)

export function mesurer(m) {
  const { W, H, h, G, t } = m
  let pietine = 0, marque = 0
  for (let k = 0; k < W * H; k++) {
    if (t.sol[k] !== SOL.HERBE) continue
    if (G[k] > 0.15) pietine++
    if (G[k] > 0.45) marque++
  }
  const z = m.zonesRecents
  let partA = 0
  if (z.length) partA = z.filter((q) => q === 0).length / z.length
  let chargees = 0
  for (let i = 0; i < m.nf; i++) chargees += m.fetat[i]
  return {
    t: m.pas / JOUR,                        // en jours
    pietine: pietine * h * h,               // m² d'herbe abîmée
    sentiers: marque * h * h,               // m² de sentiers bien marqués
    detour: moyenne(m.detours),             // détour moyen des derniers arrivés (0,12 = 12 %)
    confort: moyenne(m.conforts),           // part du trajet sur un sentier ou une allée
    marcheurs: m.nm,
    passages: m.passages,
    abandons: m.abandons,
    livrees: m.livrees,
    chargees: m.nf ? chargees / m.nf : 0,
    partA,                                  // fourmis : part des passages récents par la zone A
  }
}

/* ================================================================
   Pour le dessin : l'état compact d'un monde
   ================================================================ */

/**
 * @param tampons { champ: Uint8Array(W·H), champ2, agents: Float32Array } à réutiliser
 * @param sol vrai pour joindre le sol (premier envoi, ou après une modification)
 */
export function imageDe(m, tampons = {}, avecSol = true) {
  const n = m.W * m.H
  const fourmis = m.p.modele === 'fourmis'
  const champ = tampons.champ?.length === n ? tampons.champ : new Uint8Array(n)
  const champ2 = tampons.champ2?.length === n ? tampons.champ2 : new Uint8Array(n)
  if (fourmis) {
    for (let k = 0; k < n; k++) {
      champ[k] = Math.min(255, Math.round(Math.sqrt(m.P1[k]) * 255))
      champ2[k] = Math.min(255, Math.round(Math.sqrt(m.P2[k]) * 255))
    }
  } else for (let k = 0; k < n; k++) champ[k] = Math.round(m.G[k] * 255)
  const na = fourmis ? m.nf : m.nm
  const agents = tampons.agents?.length >= na * 4 && tampons.agents.length <= na * 4 + 4096 ? tampons.agents : new Float32Array(Math.max(4, na * 4 + 1024))
  for (let i = 0; i < na; i++) {
    if (fourmis) {
      agents[4 * i] = m.fx[i] * m.h; agents[4 * i + 1] = m.fy[i] * m.h
      agents[4 * i + 2] = m.fetat[i]; agents[4 * i + 3] = m.fcap[i]
    } else {
      agents[4 * i] = m.mx[i]; agents[4 * i + 1] = m.my[i]
      agents[4 * i + 2] = m.mtype[i]; agents[4 * i + 3] = Math.atan2(m.mvy[i], m.mvx[i])
    }
  }
  const { f, periode } = horaire(m)
  return {
    W: m.W, H: m.H, h: m.h, version: m.version, modele: m.p.modele, fond: m.t.fond,
    sol: avecSol ? m.t.sol.slice() : null,
    arbres: avecSol ? m.t.arbres.map((a) => a.slice()) : null,
    portes: m.t.portes.map((po) => ({ x: po.x, y: po.y, nom: po.nom, type: po.type, poids: (po.o[0] + po.o[1] + po.o[2]) / 3 })),
    zones: m.t.zones,
    champ, champ2, agents, na,
    pas: m.pas, jour: m.pas / JOUR, heure: f, periode,
  }
}
