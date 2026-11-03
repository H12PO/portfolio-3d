import { generateur } from '../commun/aleatoire.js'

// ============================================================
//  BOIDS : le moteur
//  Quatre modèles de vol collectif sur le même monde :
//    boids  : Reynolds (1987) — séparation, alignement, cohésion,
//             voisins dans un rayon (métrique) ou les k plus proches
//             (topologique, Ballerini et al. 2008) ; espèces,
//             prédateurs, obstacles et vent.
//    vicsek : Vicsek et al. (1995) — vitesse constante, on prend le
//             cap moyen de ses voisins, plus un bruit η.
//    couzin : Couzin et al. (2002) — zones de répulsion, d'orientation
//             et d'attraction ; meneurs informés (Couzin et al. 2005).
//    cucker : Cucker et Smale (2007) — chacun ajuste sa vitesse sur
//             celle des autres, d'autant moins qu'ils sont loin.
//  Monde en 2 ou 3 dimensions, refermé sur lui-même (tore), entre des
//  murs, ou ouvert (le groupe se déplace librement).
//  Tout est dans des tableaux typés ; une grille spatiale ramène la
//  recherche des voisins de O(N²) à O(N). Le moteur est pur : il
//  tourne dans un Web Worker (travail.js), dans les figures et en Node.
// ============================================================

export const MODELES = ['boids', 'vicsek', 'couzin', 'cucker']
export const MAX_ESPECES = 3
export const MAX_PREDATEURS = 5
export const MAX_OBSTACLES = 600
export const MAX_OISEAUX = 5000       // au-delà, l'explorateur ne suit plus sur la plupart des machines
export const MAX_CUCKER = 600         // Cucker-Smale : tout le monde regarde tout le monde (O(N²))
export const RELATIONS = ['melent', 'ignorent', 'evitent']

const RAD = Math.PI / 180
// Longueurs (Math.hypot est sûr mais lent : il évite les débordements, inutiles ici)
const h3 = (x, y, z) => Math.sqrt(x * x + y * y + z * z)
const h2 = (x, y) => Math.sqrt(x * x + y * y)

export const DEFAUTS = {
  modele: 'boids',
  dim: 2,                 // 2 ou 3
  n: 1500,
  densite: 0.5,           // individus par unité de surface (2D) : fixe la taille du monde
  densite3: 0.1,          // individus par unité de volume (3D)
  bords: 'tore',          // 'tore' | 'murs' | 'ouvert'

  // Boids (Reynolds) — unités : le rayon de perception vaut 1
  voisinage: 'metrique',  // 'metrique' | 'topologique'
  rayon: 1,               // rayon de perception (métrique)
  k: 7,                   // nombre de voisins suivis (topologique)
  vision: 270,            // champ de vision, en degrés (le reste est un angle mort, derrière)
  distSeparation: 0.6,    // en dessous, on s'écarte
  vmax: 0.06,             // vitesse maximale, par pas
  separation: [2.5, 2.5, 2.5],
  alignement: [1, 1, 1],
  cohesion: [0.6, 0.6, 0.6],
  vitesse: [1, 1, 1],     // facteur sur vmax, par espèce
  bruit: 0.1,             // poussée au hasard, en part de la force maximale

  especes: 1,
  parts: [1, 1, 1],
  relation: 'ignorent',   // entre espèces : 'melent' | 'ignorent' | 'evitent'

  predateurs: 0,
  peur: 3,                // rayon où un prédateur fait fuir
  vitessePredateur: 1.6,  // en part de vmax
  confusion: 0.5,         // chance qu'un prédateur perde sa cible au milieu de la foule

  vent: 0,                // en part de vmax
  capVent: 0,             // degrés
  rafales: 0,             // 0 : vent régulier, 1 : très irrégulier

  // Vicsek
  eta: 1,                 // amplitude du bruit, en radians (0 à 2π) : écart tiré dans [−η/2, η/2]
  v0: 0.03,
  vectoriel: false,       // bruit « vectoriel » (Grégoire et Chaté 2004) : ajouté à chaque interaction

  // Couzin — unités : la zone de répulsion a un rayon 1, un pas dure τ = 0,1 s
  zoo: 2,                 // largeur Δr_o de la zone d'orientation
  zoa: 12,                // largeur Δr_a de la zone d'attraction
  virage: 40,             // vitesse de virage maximale θ, en degrés par seconde
  vitesseCouzin: 3,       // s, en unités par seconde
  sigma: 0.05,            // bruit (radians)
  informes: 0,            // part d'individus qui connaissent une direction (Couzin et al. 2005)
  informes2: 0,           // une seconde minorité, qui préfère une autre direction
  ecart: 90,              // angle entre les deux directions préférées (degrés)
  poids: 0.5,             // ω : force de la préférence

  // Cucker-Smale
  beta: 0.3,
  K: 1,
}

// Réglages qui exigent de recréer le monde
export const REGLAGES_DE_DEPART = ['modele', 'dim', 'n', 'densite', 'densite3', 'bords', 'especes', 'parts', 'vectoriel']

const TAU = 0.1         // Couzin : durée d'un pas (s)
const DT_CS = 0.05      // Cucker-Smale : durée d'un pas
const CAPTURE = 0.25    // distance de capture d'un prédateur
const REPOS = 120       // pas de repos d'un prédateur après une capture
const HESITATION = 15  // pas de ralentissement d'un prédateur qui vient de changer de cible

/* ---------- Création ---------- */

function cote(p) {
  if (p.modele === 'couzin' || p.modele === 'cucker') return 0 // monde ouvert
  return p.dim === 3 ? Math.cbrt(p.n / p.densite3) : Math.sqrt(p.n / p.densite)
}

/** Côté du monde pour des réglages donnés (0 : monde ouvert). */
export const coteMonde = (r) => cote({ ...DEFAUTS, ...r })

function bordsDe(p) {
  if (p.modele === 'couzin' || p.modele === 'cucker') return 'ouvert'
  if (p.modele === 'vicsek') return 'tore'
  return p.bords === 'ouvert' ? 'tore' : p.bords
}

// Une direction au hasard, uniforme sur le cercle ou la sphère
function directionAuHasard(alea, D, out, o) {
  if (D === 2) {
    const a = alea() * 2 * Math.PI
    out[o] = Math.cos(a); out[o + 1] = Math.sin(a); out[o + 2] = 0
  } else {
    const z = 2 * alea() - 1
    const a = alea() * 2 * Math.PI
    const r = Math.sqrt(1 - z * z)
    out[o] = r * Math.cos(a); out[o + 1] = r * Math.sin(a); out[o + 2] = z
  }
}

const normal = (alea) => Math.sqrt(-2 * Math.log(1 - alea())) * Math.cos(2 * Math.PI * alea())

/**
 * Crée un monde.
 * @returns l'état complet : positions et vitesses (x, y, z par individu), espèces,
 *   prédateurs, obstacles, réglages p, horloge t, générateur alea.
 */
export function creerMonde(reglages = {}, graine = 1) {
  const p = { ...structuredClone(DEFAUTS), ...structuredClone(reglages) }
  p.n = Math.max(1, Math.min(p.n, p.modele === 'cucker' ? MAX_CUCKER : MAX_OISEAUX))
  p.especes = p.modele === 'boids' ? Math.max(1, Math.min(MAX_ESPECES, p.especes)) : 1
  const alea = generateur(graine)
  const N = p.n
  const D = p.dim === 3 ? 3 : 2
  const L = cote(p)
  const m = {
    p, alea, D, N, L,
    bords: bordsDe(p),
    t: 0,
    pas: 0,
    pos: new Float32Array(N * 3),
    vel: new Float32Array(N * 3),
    neuve: new Float32Array(N * 3),   // vitesses du pas suivant (mise à jour synchrone)
    espece: new Uint8Array(N),
    prefere: new Int8Array(N),        // Couzin 2005 : 0 = sans préférence, 1 ou 2 = informé
    peurs: new Float32Array(N),       // boids : 1 au moment de fuir, décroît ensuite (pour le dessin)
    pred: new Float32Array(MAX_PREDATEURS * 3),
    predVel: new Float32Array(MAX_PREDATEURS * 3),
    predCible: new Int32Array(MAX_PREDATEURS).fill(-1),
    predRepos: new Int32Array(MAX_PREDATEURS),
    predHesite: new Int32Array(MAX_PREDATEURS),
    captures: 0,
    obstacles: new Float32Array(MAX_OBSTACLES * 3),   // x, y, rayon
    nObstacles: 0,
    souris: { actif: false, x: 0, y: 0, z: 0 },
    g: null,
  }

  // Espèces : tirées selon leurs parts
  const parts = p.parts.slice(0, p.especes)
  const somme = parts.reduce((a, b) => a + b, 0) || 1
  for (let i = 0; i < N; i++) {
    let r = alea() * somme
    let s = 0
    while (s < p.especes - 1 && r >= parts[s]) { r -= parts[s]; s++ }
    m.espece[i] = s
  }

  // Positions et vitesses
  for (let i = 0; i < N; i++) {
    const o = 3 * i
    if (m.bords === 'ouvert') {
      // un groupe resserré au départ, au centre
      const rayon = p.modele === 'couzin' ? (D === 3 ? 1.5 * Math.cbrt(N) : 0.8 * Math.sqrt(N)) : 5
      do {
        m.pos[o] = (2 * alea() - 1) * rayon
        m.pos[o + 1] = (2 * alea() - 1) * rayon
        m.pos[o + 2] = D === 3 ? (2 * alea() - 1) * rayon : 0
      } while (m.pos[o] ** 2 + m.pos[o + 1] ** 2 + m.pos[o + 2] ** 2 > rayon * rayon)
    } else {
      m.pos[o] = alea() * L
      m.pos[o + 1] = alea() * L
      m.pos[o + 2] = D === 3 ? alea() * L : 0
    }
    directionAuHasard(alea, D, m.vel, o)
    const v = p.modele === 'vicsek' ? p.v0
      : p.modele === 'couzin' ? p.vitesseCouzin * TAU
        : p.modele === 'cucker' ? alea()
          : p.vmax * p.vitesse[m.espece[i]] * (0.5 + 0.5 * alea())
    m.vel[o] *= v; m.vel[o + 1] *= v; m.vel[o + 2] *= v
    // Cucker-Smale : des vitesses au hasard autour d'une dérive commune (la moyenne se conserve)
    if (p.modele === 'cucker') m.vel[o] += 0.6
  }

  // Prédateurs : au bord du monde
  for (let k = 0; k < MAX_PREDATEURS; k++) {
    m.pred[3 * k] = alea() * L
    m.pred[3 * k + 1] = alea() < 0.5 ? 0 : L * 0.999
    m.pred[3 * k + 2] = D === 3 ? alea() * L : 0
    directionAuHasard(alea, D, m.predVel, 3 * k)
  }

  repartirInformes(m)
  return m
}

// Couzin 2005 : les premiers individus (dans un ordre tiré au hasard) connaissent une direction
function repartirInformes(m) {
  const { p, N } = m
  m.prefere.fill(0)
  if (p.modele !== 'couzin') return
  const n1 = Math.round(p.informes * N)
  const n2 = Math.round(p.informes2 * N)
  const ordre = Array.from({ length: N }, (_, i) => i)
  const alea = generateur(1234)
  for (let i = N - 1; i > 0; i--) {
    const j = Math.floor(alea() * (i + 1))
    ;[ordre[i], ordre[j]] = [ordre[j], ordre[i]]
  }
  for (let k = 0; k < Math.min(N, n1 + n2); k++) m.prefere[ordre[k]] = k < n1 ? 1 : 2
}

// Les deux directions préférées : la première vers la droite (x), la seconde tournée de « ecart »
function directionsPreferees(p) {
  const a = (p.ecart * RAD) / 2
  return p.informes2 > 0
    ? [[Math.cos(a), Math.sin(a), 0], [Math.cos(a), -Math.sin(a), 0]]
    : [[1, 0, 0], [1, 0, 0]]
}

/** Change des réglages sans recréer le monde (ceux de départ exigent creerMonde). */
export function regler(m, changements) {
  Object.assign(m.p, structuredClone(changements))
  if ('informes' in changements || 'informes2' in changements) repartirInformes(m)
}

/* ---------- Grille spatiale ---------- */

// Range les individus par case (tri par comptage). Cases de côté ≥ portee.
function construireGrille(m, portee) {
  const { N, D, pos } = m
  let ox = 0, oy = 0, oz = 0, ex, ey, ez
  const tore = m.bords === 'tore'
  if (m.bords === 'ouvert') {
    let x0 = Infinity, y0 = Infinity, z0 = Infinity, x1 = -Infinity, y1 = -Infinity, z1 = -Infinity
    for (let i = 0; i < N; i++) {
      const o = 3 * i
      if (pos[o] < x0) x0 = pos[o]; if (pos[o] > x1) x1 = pos[o]
      if (pos[o + 1] < y0) y0 = pos[o + 1]; if (pos[o + 1] > y1) y1 = pos[o + 1]
      if (pos[o + 2] < z0) z0 = pos[o + 2]; if (pos[o + 2] > z1) z1 = pos[o + 2]
    }
    ox = x0; oy = y0; oz = z0
    ex = x1 - x0 + 1e-6; ey = y1 - y0 + 1e-6; ez = z1 - z0 + 1e-6
  } else {
    ex = ey = ez = m.L
  }
  // Pas plus de ~ 64² (2D) ou 32³ (3D) cases : un groupe très étalé garde une grille raisonnable
  const maxParAxe = D === 3 ? 32 : 128
  const nx = Math.max(1, Math.min(maxParAxe, Math.floor(ex / portee)))
  const ny = Math.max(1, Math.min(maxParAxe, Math.floor(ey / portee)))
  const nz = D === 3 ? Math.max(1, Math.min(maxParAxe, Math.floor(ez / portee))) : 1
  const nc = nx * ny * nz
  let g = m.g
  if (!g || g.debut.length < nc + 1 || g.idx.length !== N) {
    g = m.g = { debut: new Int32Array(nc + 1), idx: new Int32Array(N), cell: new Int32Array(N), curseur: new Int32Array(nc + 1), marque: new Int32Array(nc), requete: 0 }
  }
  Object.assign(g, { nx, ny, nz, nc, ox, oy, oz, cx: ex / nx, cy: ey / ny, cz: ez / nz, tore })
  const { debut, idx, cell, curseur } = g
  debut.fill(0, 0, nc + 1)
  for (let i = 0; i < N; i++) {
    const o = 3 * i
    let a = Math.floor((pos[o] - ox) / g.cx)
    let b = Math.floor((pos[o + 1] - oy) / g.cy)
    let c = D === 3 ? Math.floor((pos[o + 2] - oz) / g.cz) : 0
    a = a < 0 ? 0 : a >= nx ? nx - 1 : a
    b = b < 0 ? 0 : b >= ny ? ny - 1 : b
    c = c < 0 ? 0 : c >= nz ? nz - 1 : c
    const k = (c * ny + b) * nx + a
    cell[i] = k
    debut[k + 1]++
  }
  for (let k = 0; k < nc; k++) debut[k + 1] += debut[k]
  curseur.set(debut.subarray(0, nc + 1))
  for (let i = 0; i < N; i++) idx[curseur[cell[i]]++] = i
  if (g.tx !== nx || g.ty !== ny || g.tz !== nz || g.tTore !== tore) tableVoisines(g, D)
}

// Pour chaque case, la liste de ses 3 × 3 (ou 3 × 3 × 3) voisines, sans doublon : calculée
// une fois tant que la grille garde ses dimensions (toujours, sur un tore ou entre des murs)
function tableVoisines(g, D) {
  const K = D === 3 ? 27 : 9
  if (!g.voisines || g.voisines.length < g.nc * K) g.voisines = new Int32Array(g.nc * K)
  if (!g.nbVois || g.nbVois.length < g.nc) g.nbVois = new Uint8Array(g.nc)
  g.K = K
  for (let k = 0; k < g.nc; k++) {
    nouvelleRequete(g)
    const n = casesAnneau(g, k, 0, D) + 0
    g.voisines[k * K] = CASES[0]
    const n1 = casesAnneau(g, k, 1, D)
    for (let c = 0; c < n1; c++) g.voisines[k * K + n + c] = CASES[c]
    g.nbVois[k] = n + n1
  }
  g.tx = g.nx; g.ty = g.ny; g.tz = g.nz; g.tTore = g.tore
}

// Tampons des voisins trouvés : indice, écart (dx, dy, dz) et distance²
let VI = new Int32Array(256)
let VX = new Float32Array(256)
let VY = new Float32Array(256)
let VZ = new Float32Array(256)
let VD = new Float32Array(256)
function agrandir(n) {
  if (n <= VI.length) return
  const t = Math.max(n, VI.length * 2)
  const copie = (a, T) => { const b = new T(t); b.set(a); return b }
  VI = copie(VI, Int32Array); VX = copie(VX, Float32Array); VY = copie(VY, Float32Array); VZ = copie(VZ, Float32Array); VD = copie(VD, Float32Array)
}

// Les cases d'une requête de voisinage. Une marque par case évite de visiter deux fois
// la même case (cela arrive sur un petit tore, quand l'anneau fait le tour du monde).
let CASES = new Int32Array(1024)
function nouvelleRequete(g) {
  g.requete++
  if (g.requete > 2e9) { g.marque.fill(0); g.requete = 1 }
}

// Les cases à distance r exactement (en nombre de cases) de la case k, pas encore vues
function casesAnneau(g, k, r, D) {
  const { nx, ny, nz, tore, marque, requete } = g
  const a0 = k % nx
  const b0 = Math.floor(k / nx) % ny
  const c0 = Math.floor(k / (nx * ny))
  const rz = D === 3 ? r : 0
  const cote = 2 * r + 1
  if (CASES.length < cote * cote * (2 * rz + 1)) CASES = new Int32Array(cote * cote * (2 * rz + 1))
  let n = 0
  for (let dc = -rz; dc <= rz; dc++) {
    let c = c0 + dc
    if (tore) c = ((c % nz) + nz) % nz; else if (c < 0 || c >= nz) continue
    for (let db = -r; db <= r; db++) {
      let b = b0 + db
      if (tore) b = ((b % ny) + ny) % ny; else if (b < 0 || b >= ny) continue
      const bord = Math.abs(dc) === r || Math.abs(db) === r
      for (let da = -r; da <= r; da += bord ? 1 : 2 * r || 1) {
        let a = a0 + da
        if (tore) a = ((a % nx) + nx) % nx; else if (a < 0 || a >= nx) continue
        const q = (c * ny + b) * nx + a
        if (marque[q] === requete) continue
        marque[q] = requete
        CASES[n++] = q
      }
    }
  }
  return n
}

const E = new Float32Array(3)

/**
 * Voisins de i à moins de R (sans i). Avec cosVision < 1, seulement ceux devant
 * (l'angle entre la vitesse de i et la direction du voisin ≤ vision / 2).
 * @returns le nombre de voisins, rangés dans VI, VX, VY, VZ, VD
 */
function voisinsMetriques(m, i, R, cosVision = -1) {
  const g = m.g
  const rC = Math.max(1, Math.ceil(R / Math.min(g.cx, g.cy, m.D === 3 ? g.cz : Infinity)))
  const R2 = R * R
  const o = 3 * i
  const { pos, vel } = m
  const vx = vel[o], vy = vel[o + 1], vz = vel[o + 2]
  const nv = h3(vx, vy, vz) || 1
  const x = pos[o], y = pos[o + 1], z = pos[o + 2]
  const tore = m.bords === 'tore'
  const L = m.L
  const h = L / 2
  let n = 0
  // cas courant : les cases font au moins R de côté, il suffit des voisines immédiates (table)
  const table = rC === 1
  if (!table) nouvelleRequete(g)
  const k0 = g.cell[i]
  for (let r = table ? 1 : 0; r <= rC; r++) {
   const nC = table ? g.nbVois[k0] : casesAnneau(g, k0, r, m.D)
   const base = k0 * g.K
   for (let c = 0; c < nC; c++) {
    const q = table ? g.voisines[base + c] : CASES[c]
    for (let s = g.debut[q]; s < g.debut[q + 1]; s++) {
      const j = g.idx[s]
      if (j === i) continue
      const q3 = 3 * j
      let dx = pos[q3] - x, dy = pos[q3 + 1] - y, dz = pos[q3 + 2] - z
      if (tore) {
        if (dx > h) dx -= L; else if (dx < -h) dx += L
        if (dy > h) dy -= L; else if (dy < -h) dy += L
        if (dz > h) dz -= L; else if (dz < -h) dz += L
      }
      const d2 = dx * dx + dy * dy + dz * dz
      if (d2 >= R2) continue
      if (cosVision > -1 && d2 > 0 && (dx * vx + dy * vy + dz * vz) < cosVision * nv * Math.sqrt(d2)) continue
      if (n >= VI.length) agrandir(n + 1)
      VI[n] = j; VX[n] = dx; VY[n] = dy; VZ[n] = dz; VD[n] = d2
      n++
    }
   }
  }
  return n
}

/**
 * Les k plus proches voisins de i (dans son champ de vision), cherchés par anneaux de cases.
 * @returns leur nombre (≤ k), rangés comme voisinsMetriques
 */
function voisinsTopologiques(m, i, k, cosVision = -1, portee = Infinity) {
  const g = m.g
  const o = 3 * i
  const { pos, vel } = m
  const vx = vel[o], vy = vel[o + 1], vz = vel[o + 2]
  const nv = h3(vx, vy, vz) || 1
  const x = pos[o], y = pos[o + 1], z = pos[o + 2]
  const tore = m.bords === 'tore'
  const L = m.L
  const h = L / 2
  const pas = Math.min(g.cx, g.cy, m.D === 3 ? g.cz : Infinity)
  const rMax = Math.min(Math.max(g.nx, g.ny, g.nz), Math.ceil(portee / pas))
  const P2 = portee * portee
  agrandir(k + 1)
  let n = 0
  let pire = Infinity   // distance² du k-ième voisin (dès qu'on en a k)
  nouvelleRequete(g)
  const k0 = g.cell[i]
  for (let r = 1; r <= rMax; r++) {
    // r = 1 : la case et ses voisines immédiates (table) ; ensuite, l'anneau r
    let nC
    if (r === 1) {
      nC = g.nbVois[k0]
      for (let c = 0; c < nC; c++) { CASES[c] = g.voisines[k0 * g.K + c]; g.marque[CASES[c]] = g.requete }
    } else nC = casesAnneau(g, k0, r, m.D)
    for (let c = 0; c < nC; c++) {
      const q = CASES[c]
      for (let s = g.debut[q]; s < g.debut[q + 1]; s++) {
        const j = g.idx[s]
        if (j === i) continue
        const q3 = 3 * j
        let dx = pos[q3] - x, dy = pos[q3 + 1] - y, dz = pos[q3 + 2] - z
        if (tore) {
          if (dx > h) dx -= L; else if (dx < -h) dx += L
          if (dy > h) dy -= L; else if (dy < -h) dy += L
          if (dz > h) dz -= L; else if (dz < -h) dz += L
        }
        const d2 = dx * dx + dy * dy + dz * dz
        if (d2 >= pire || d2 > P2) continue
        if (cosVision > -1 && d2 > 0 && (dx * vx + dy * vy + dz * vz) < cosVision * nv * Math.sqrt(d2)) continue
        // insertion triée
        let p = n < k ? n++ : k - 1
        while (p > 0 && VD[p - 1] > d2) {
          VI[p] = VI[p - 1]; VX[p] = VX[p - 1]; VY[p] = VY[p - 1]; VZ[p] = VZ[p - 1]; VD[p] = VD[p - 1]
          p--
        }
        VI[p] = j; VX[p] = dx; VY[p] = dy; VZ[p] = dz; VD[p] = d2
        if (n === k) pire = VD[k - 1]
      }
    }
    // tout ce qui reste est au-delà de r · pas : si on a déjà k voisins plus proches, c'est fini
    if (n === k && pire <= (r * pas) ** 2) break
  }
  return n
}

/* ---------- Obstacles ---------- */

// Les obstacles sont des disques (2D) ou des colonnes verticales (3D), indexés sur une grille grossière
function indexerObstacles(m) {
  const L = m.L || 1
  const n = Math.max(1, Math.min(64, Math.floor(L / 2)))
  const cases = Array.from({ length: n * n }, () => [])
  const marge = 1.5 * m.p.rayon
  for (let k = 0; k < m.nObstacles; k++) {
    const x = m.obstacles[3 * k], y = m.obstacles[3 * k + 1], r = m.obstacles[3 * k + 2] + marge
    const a0 = Math.floor(((x - r) / L) * n), a1 = Math.floor(((x + r) / L) * n)
    const b0 = Math.floor(((y - r) / L) * n), b1 = Math.floor(((y + r) / L) * n)
    for (let b = b0; b <= b1; b++) {
      for (let a = a0; a <= a1; a++) {
        const aa = ((a % n) + n) % n, bb = ((b % n) + n) % n
        cases[bb * n + aa].push(k)
      }
    }
  }
  m.indexObs = { n, cases: cases.map((l) => Int32Array.from(new Set(l))) }
}

/** Ajoute un obstacle (x, y : position dans le monde, au sol ; r : rayon). */
export function ajouterObstacle(m, x, y, r) {
  if (m.nObstacles >= MAX_OBSTACLES || m.bords === 'ouvert') return
  const o = 3 * m.nObstacles++
  m.obstacles[o] = x; m.obstacles[o + 1] = y; m.obstacles[o + 2] = r
  indexerObstacles(m)
}

/** Retire les obstacles qui touchent le disque (x, y, r). */
export function effacerObstacles(m, x, y, r) {
  let n = 0
  for (let k = 0; k < m.nObstacles; k++) {
    const ox = m.obstacles[3 * k], oy = m.obstacles[3 * k + 1], or = m.obstacles[3 * k + 2]
    if (h2(ox - x, oy - y) < or + r) continue
    m.obstacles[3 * n] = ox; m.obstacles[3 * n + 1] = oy; m.obstacles[3 * n + 2] = or
    n++
  }
  m.nObstacles = n
  indexerObstacles(m)
}

/** Remplace tous les obstacles (liste [x, y, r, x, y, r…]). */
export function poserObstacles(m, liste) {
  m.nObstacles = 0
  for (let k = 0; k + 2 < liste.length && m.nObstacles < MAX_OBSTACLES; k += 3) {
    const o = 3 * m.nObstacles++
    m.obstacles[o] = liste[k]; m.obstacles[o + 1] = liste[k + 1]; m.obstacles[o + 2] = liste[k + 2]
  }
  indexerObstacles(m)
}

/* ---------- Boids (Reynolds) ---------- */

// Ramène un vecteur à la longueur l (s'il n'est pas nul)
function longueur(v, l) {
  const n = h3(v[0], v[1], v[2])
  if (n > 1e-12) { v[0] *= l / n; v[1] *= l / n; v[2] *= l / n }
  return n
}
function limiter(v, l) {
  const n = h3(v[0], v[1], v[2])
  if (n > l) { v[0] *= l / n; v[1] *= l / n; v[2] *= l / n }
}
const A = new Float64Array(3)   // alignement
const C = new Float64Array(3)   // cohésion
const S = new Float64Array(3)   // séparation
const F = new Float64Array(3)   // fuite
const P = new Float64Array(3)   // pilotage total
const T3 = new Float64Array(3)

// Force de pilotage de Reynolds : « vitesse voulue moins vitesse actuelle », bornée
function pilotage(dir, vmax, fmax, vel, o, out) {
  if (longueur(dir, vmax) < 1e-12) { out[0] = out[1] = out[2] = 0; return }
  out[0] = dir[0] - vel[o]; out[1] = dir[1] - vel[o + 1]; out[2] = dir[2] - vel[o + 2]
  limiter(out, fmax)
}

function pasBoids(m) {
  const { p, N, D, pos, vel, neuve, espece } = m
  const R = p.rayon
  const topo = p.voisinage === 'topologique'
  const cosVision = p.vision >= 360 ? -1 : Math.cos((p.vision / 2) * RAD)
  construireGrille(m, R)
  const fmax = p.vmax * 0.05
  const nPred = p.predateurs
  const sep2 = p.distSeparation * p.distSeparation
  const alea = m.alea
  const relation = p.especes > 1 ? p.relation : 'melent'
  const vent = ventIci(m)

  for (let i = 0; i < N; i++) {
    const o = 3 * i
    const s = espece[i]
    const vmax = p.vmax * p.vitesse[s]
    const n = topo ? voisinsTopologiques(m, i, p.k, cosVision, 2.5 * R) : voisinsMetriques(m, i, R, cosVision)
    A[0] = A[1] = A[2] = 0; C[0] = C[1] = C[2] = 0; S[0] = S[1] = S[2] = 0; F[0] = F[1] = F[2] = 0
    let nA = 0
    let nS = 0
    let nF = 0
    for (let q = 0; q < n; q++) {
      const j = VI[q]
      const d2 = VD[q]
      const meme = relation === 'melent' || espece[j] === s
      if (d2 < sep2 && d2 > 1e-12) {
        // séparation : s'écarter, d'autant plus fort que le voisin est proche
        S[0] -= VX[q] / d2; S[1] -= VY[q] / d2; S[2] -= VZ[q] / d2
        nS++
      }
      if (meme) {
        const q3 = 3 * j
        A[0] += vel[q3]; A[1] += vel[q3 + 1]; A[2] += vel[q3 + 2]
        C[0] += VX[q]; C[1] += VY[q]; C[2] += VZ[q]
        nA++
      } else if (relation === 'evitent' && d2 > 1e-12) {
        F[0] -= VX[q] / Math.sqrt(d2); F[1] -= VY[q] / Math.sqrt(d2); F[2] -= VZ[q] / Math.sqrt(d2)
        nF++
      }
    }
    P[0] = P[1] = P[2] = 0
    if (nA > 0) {
      pilotage(A, vmax, fmax, vel, o, T3)
      P[0] += p.alignement[s] * T3[0]; P[1] += p.alignement[s] * T3[1]; P[2] += p.alignement[s] * T3[2]
      // cohésion : vers le centre des voisins (C est la somme des écarts)
      pilotage(C, vmax, fmax, vel, o, T3)
      P[0] += p.cohesion[s] * T3[0]; P[1] += p.cohesion[s] * T3[1]; P[2] += p.cohesion[s] * T3[2]
    }
    if (nS > 0) {
      pilotage(S, vmax, fmax, vel, o, T3)
      P[0] += p.separation[s] * T3[0]; P[1] += p.separation[s] * T3[1]; P[2] += p.separation[s] * T3[2]
    }
    if (nF > 0) {
      pilotage(F, vmax, fmax, vel, o, T3)
      P[0] += 1.5 * T3[0]; P[1] += 1.5 * T3[1]; P[2] += 1.5 * T3[2]
    }

    // Prédateurs (et la souris) : fuir, plus vite
    let panique = 0
    F[0] = F[1] = F[2] = 0
    for (let k = 0; k < nPred; k++) panique = Math.max(panique, fuirDe(m, o, m.pred[3 * k], m.pred[3 * k + 1], m.pred[3 * k + 2]))
    if (m.souris.actif) panique = Math.max(panique, fuirDe(m, o, m.souris.x, m.souris.y, m.souris.z))
    if (panique > 0) {
      pilotage(F, vmax * 1.5, fmax * 3, vel, o, T3)
      P[0] += 4 * T3[0]; P[1] += 4 * T3[1]; P[2] += 4 * T3[2]
      m.peurs[i] = Math.max(m.peurs[i], panique)
    } else {
      m.peurs[i] *= 0.96
    }

    // Obstacles : s'en détourner avant de les toucher
    if (m.nObstacles) eviterObstacles(m, i, vmax, fmax)

    // Murs : revenir vers l'intérieur
    if (m.bords === 'murs') {
      const marge = 2 * R
      for (let a = 0; a < D; a++) {
        const x = pos[o + a]
        if (x < marge) P[a] += fmax * 2 * (1 - x / marge)
        else if (x > m.L - marge) P[a] -= fmax * 2 * (1 - (m.L - x) / marge)
      }
    }

    // Bruit : une petite poussée au hasard
    if (p.bruit > 0) {
      P[0] += p.bruit * fmax * normal(alea)
      P[1] += p.bruit * fmax * normal(alea)
      if (D === 3) P[2] += p.bruit * fmax * normal(alea)
    }

    let vx = vel[o] + P[0], vy = vel[o + 1] + P[1], vz = D === 3 ? vel[o + 2] + P[2] : 0
    const v = h3(vx, vy, vz)
    const haut = vmax * (1 + 0.5 * Math.min(1, m.peurs[i]))
    const bas = vmax * 0.5
    if (v > haut) { vx *= haut / v; vy *= haut / v; vz *= haut / v } else if (v < bas && v > 1e-12) { vx *= bas / v; vy *= bas / v; vz *= bas / v }
    neuve[o] = vx; neuve[o + 1] = vy; neuve[o + 2] = vz
  }

  // Déplacement (avec le vent), puis prédateurs
  for (let i = 0; i < N; i++) {
    const o = 3 * i
    vel[o] = neuve[o]; vel[o + 1] = neuve[o + 1]; vel[o + 2] = neuve[o + 2]
    pos[o] += vel[o] + vent[0]
    pos[o + 1] += vel[o + 1] + vent[1]
    pos[o + 2] += vel[o + 2]
    ranger(m, o)
    if (m.nObstacles) sortirDesObstacles(m, o)
  }
  if (nPred) pasPredateurs(m)
}

// Ajoute à F la fuite devant un danger en (px, py, pz) ; renvoie la peur (0 : trop loin)
function fuirDe(m, o, px, py, pz) {
  const { pos } = m
  const peur = m.p.peur
  let dx = pos[o] - px, dy = pos[o + 1] - py, dz = pos[o + 2] - pz
  if (m.bords === 'tore') { const L = m.L; dx -= L * Math.round(dx / L); dy -= L * Math.round(dy / L); dz -= L * Math.round(dz / L) }
  const d = h3(dx, dy, dz)
  if (d >= peur || d < 1e-9) return 0
  const w = 1 - d / peur
  F[0] += (dx / d) * w; F[1] += (dy / d) * w; F[2] += (dz / d) * w
  return w
}

// Le vent du moment : régulier, ou avec des rafales qui changent de force et de direction
function ventIci(m) {
  const p = m.p
  if (p.vent <= 0) return [0, 0]
  const t = m.pas * 0.01
  const r = p.rafales
  const force = p.vent * p.vmax * (1 + r * (0.6 * Math.sin(t * 1.7) + 0.4 * Math.sin(t * 4.3 + 1)))
  const angle = p.capVent * RAD + r * 0.6 * Math.sin(t * 0.9 + 2)
  return [force * Math.cos(angle), force * Math.sin(angle)]
}

function eviterObstacles(m, i, vmax, fmax) {
  const { obstacles, pos, vel } = m
  const o = 3 * i
  const ix = m.indexObs
  const L = m.L
  const a = ((Math.floor((pos[o] / L) * ix.n) % ix.n) + ix.n) % ix.n
  const b = ((Math.floor((pos[o + 1] / L) * ix.n) % ix.n) + ix.n) % ix.n
  const liste = ix.cases[b * ix.n + a]
  if (!liste || !liste.length) return
  const marge = 1.5 * m.p.rayon
  F[0] = F[1] = F[2] = 0
  let fort = 0
  for (let q = 0; q < liste.length; q++) {
    const k = liste[q]
    let dx = pos[o] - obstacles[3 * k], dy = pos[o + 1] - obstacles[3 * k + 1]
    if (m.bords === 'tore') { dx -= L * Math.round(dx / L); dy -= L * Math.round(dy / L) }
    const d = h2(dx, dy)
    const libre = d - obstacles[3 * k + 2]
    if (libre >= marge || d < 1e-9) continue
    // ne compte que si l'on va vers l'obstacle
    const vers = -(dx * vel[o] + dy * vel[o + 1])
    if (vers <= 0 && libre > 0.3) continue
    const w = (1 - Math.max(0, libre) / marge) ** 2
    F[0] += (dx / d) * w; F[1] += (dy / d) * w
    fort = Math.max(fort, w)
  }
  if (fort > 0) {
    // s'écarter de côté plutôt que freiner : on garde la vitesse, on la tourne
    pilotage(F, vmax, fmax * 4, vel, o, T3)
    P[0] += 3 * T3[0]; P[1] += 3 * T3[1]
  }
}

function sortirDesObstacles(m, o) {
  const { obstacles, pos } = m
  const L = m.L
  const ix = m.indexObs
  const a = ((Math.floor((pos[o] / L) * ix.n) % ix.n) + ix.n) % ix.n
  const b = ((Math.floor((pos[o + 1] / L) * ix.n) % ix.n) + ix.n) % ix.n
  const liste = ix.cases[b * ix.n + a]
  if (!liste) return
  for (let q = 0; q < liste.length; q++) {
    const k = liste[q]
    let dx = pos[o] - obstacles[3 * k], dy = pos[o + 1] - obstacles[3 * k + 1]
    if (m.bords === 'tore') { dx -= L * Math.round(dx / L); dy -= L * Math.round(dy / L) }
    const d = h2(dx, dy)
    const r = obstacles[3 * k + 2]
    if (d < r && d > 1e-9) {
      pos[o] += (dx / d) * (r - d); pos[o + 1] += (dy / d) * (r - d)
      ranger(m, o)
    }
  }
}

// Remet une position dans le monde (tore : de l'autre côté ; murs : contre le mur)
function ranger(m, o) {
  if (m.bords === 'ouvert') return
  const L = m.L
  for (let a = 0; a < m.D; a++) {
    let x = m.pos[o + a]
    if (m.bords === 'tore') {
      if (x < 0) x += L * Math.ceil(-x / L)
      else if (x >= L) x -= L * Math.floor(x / L)
      if (x >= L) x = 0
    } else if (x < 0) { x = 0; m.vel[o + a] = Math.abs(m.vel[o + a]) } else if (x > L) { x = L; m.vel[o + a] = -Math.abs(m.vel[o + a]) }
    m.pos[o + a] = x
  }
}

/* ---------- Prédateurs ---------- */

function plusProche(m, x, y, z) {
  let meilleur = -1
  let dmin = Infinity
  for (let i = 0; i < m.N; i++) {
    const o = 3 * i
    let dx = m.pos[o] - x, dy = m.pos[o + 1] - y, dz = m.pos[o + 2] - z
    if (m.bords === 'tore') { const L = m.L; dx -= L * Math.round(dx / L); dy -= L * Math.round(dy / L); dz -= L * Math.round(dz / L) }
    const d = dx * dx + dy * dy + dz * dz
    if (d < dmin) { dmin = d; meilleur = i }
  }
  return meilleur
}

function pasPredateurs(m) {
  const { p, pred, predVel, D, alea } = m
  const vmax = p.vmax * p.vitessePredateur
  const fmax = p.vmax * 0.08
  for (let k = 0; k < p.predateurs; k++) {
    const o = 3 * k
    if (m.predRepos[k] > 0) {
      // repos après une capture : il plane, plus lentement
      m.predRepos[k]--
      m.predCible[k] = -1
      const v = h3(predVel[o], predVel[o + 1], predVel[o + 2]) || 1
      for (let a = 0; a < 3; a++) predVel[o + a] *= (p.vmax * 0.6) / v
    } else {
      // choisir (ou garder) une cible : la plus proche, revue tous les 20 pas
      if (m.predCible[k] < 0 || m.pas % 20 === k) m.predCible[k] = plusProche(m, pred[o], pred[o + 1], pred[o + 2])
      let c = m.predCible[k]
      // effet de confusion : plus la cible est entourée, plus il risque de la perdre pour une voisine,
      // et chaque changement de cible lui fait perdre un peu de temps (il hésite, il ralentit)
      if (c >= 0 && p.confusion > 0 && m.predHesite[k] === 0) {
        const n = voisinsMetriques(m, c, 1)
        if (n > 0 && alea() < 0.1 * p.confusion * (n / (n + 6))) {
          c = m.predCible[k] = VI[Math.floor(alea() * n)]
          m.predHesite[k] = HESITATION
        }
      }
      if (c >= 0) {
        ecartPredateur(m, k, c, E)
        const d = h3(E[0], E[1], E[2])
        if (d < CAPTURE) {
          // capture : l'oiseau réapparaît ailleurs, le prédateur se repose
          m.captures++
          const q = 3 * c
          m.pos[q] = alea() * m.L; m.pos[q + 1] = alea() * m.L; m.pos[q + 2] = D === 3 ? alea() * m.L : 0
          m.peurs[c] = 0
          m.predRepos[k] = REPOS
          m.predCible[k] = -1
        } else {
          const voulu = [E[0], E[1], E[2]]
          longueur(voulu, m.predHesite[k] > 0 ? vmax * 0.6 : vmax)
          for (let a = 0; a < 3; a++) T3[a] = voulu[a] - predVel[o + a]
          limiter(T3, fmax)
          for (let a = 0; a < 3; a++) predVel[o + a] += T3[a]
          const v = h3(predVel[o], predVel[o + 1], predVel[o + 2])
          if (v > vmax) for (let a = 0; a < 3; a++) predVel[o + a] *= vmax / v
          if (m.predHesite[k] > 0) m.predHesite[k]--
        }
      }
    }
    if (D === 2) predVel[o + 2] = 0
    pred[o] += predVel[o]; pred[o + 1] += predVel[o + 1]; pred[o + 2] += predVel[o + 2]
    const L = m.L
    for (let a = 0; a < D; a++) {
      if (m.bords === 'tore') pred[o + a] = ((pred[o + a] % L) + L) % L
      else if (pred[o + a] < 0 || pred[o + a] > L) { pred[o + a] = Math.min(L, Math.max(0, pred[o + a])); predVel[o + a] *= -1 }
    }
  }
}

function ecartPredateur(m, k, i, out) {
  let dx = m.pos[3 * i] - m.pred[3 * k], dy = m.pos[3 * i + 1] - m.pred[3 * k + 1], dz = m.pos[3 * i + 2] - m.pred[3 * k + 2]
  if (m.bords === 'tore') { const L = m.L; dx -= L * Math.round(dx / L); dy -= L * Math.round(dy / L); dz -= L * Math.round(dz / L) }
  out[0] = dx; out[1] = dy; out[2] = dz
}

/* ---------- Vicsek ---------- */

// Tourne le vecteur unité (x, y, z) d'un angle a autour d'un axe perpendiculaire tiré au hasard
function tournerAuHasard(alea, u, a) {
  // un vecteur perpendiculaire à u
  let px = -u[1], py = u[0], pz = 0
  if (Math.abs(u[2]) > 0.9) { px = 0; py = -u[2]; pz = u[1] }
  let n = h3(px, py, pz)
  px /= n; py /= n; pz /= n
  // second vecteur perpendiculaire, puis un axe au hasard dans ce plan
  const qx = u[1] * pz - u[2] * py, qy = u[2] * px - u[0] * pz, qz = u[0] * py - u[1] * px
  const phi = alea() * 2 * Math.PI
  const wx = Math.cos(phi) * px + Math.sin(phi) * qx
  const wy = Math.cos(phi) * py + Math.sin(phi) * qy
  const wz = Math.cos(phi) * pz + Math.sin(phi) * qz
  const c = Math.cos(a), s = Math.sin(a)
  u[0] = c * u[0] + s * wx; u[1] = c * u[1] + s * wy; u[2] = c * u[2] + s * wz
  n = h3(u[0], u[1], u[2]); u[0] /= n; u[1] /= n; u[2] /= n
}

function pasVicsek(m) {
  const { p, N, D, pos, vel, neuve, alea } = m
  construireGrille(m, 1)
  const v0 = p.v0
  // 1) on avance avec la vitesse actuelle (règle de 1995)
  for (let i = 0; i < N; i++) {
    const o = 3 * i
    pos[o] += vel[o]; pos[o + 1] += vel[o + 1]; pos[o + 2] += vel[o + 2]
  }
  // 2) le nouveau cap : la moyenne des caps voisins (soi compris), plus le bruit
  for (let i = 0; i < N; i++) {
    const o = 3 * i
    const n = voisinsMetriques(m, i, 1)
    let sx = vel[o], sy = vel[o + 1], sz = vel[o + 2]
    for (let q = 0; q < n; q++) {
      const j3 = 3 * VI[q]
      sx += vel[j3]; sy += vel[j3 + 1]; sz += vel[j3 + 2]
    }
    if (p.vectoriel) {
      // bruit vectoriel : un vecteur au hasard, de poids η·(nombre d'interactions), ajouté à la somme
      const u = [0, 0, 0]
      directionAuHasard(alea, D, u, 0)
      const w = (p.eta / (2 * Math.PI)) * (n + 1) * v0
      const w3 = [sx + w * u[0], sy + w * u[1], D === 3 ? sz + w * u[2] : 0]
      if (longueur(w3, v0) < 1e-12) directionAuHasard(alea, D, w3, 0)
      neuve[o] = w3[0]; neuve[o + 1] = w3[1]; neuve[o + 2] = w3[2]
    } else if (D === 2) {
      const a = Math.atan2(sy, sx) + p.eta * (alea() - 0.5)
      neuve[o] = v0 * Math.cos(a); neuve[o + 1] = v0 * Math.sin(a); neuve[o + 2] = 0
    } else {
      const u = [sx, sy, sz]
      if (longueur(u, 1) < 1e-12) directionAuHasard(alea, 3, u, 0)
      tournerAuHasard(alea, u, p.eta * (alea() - 0.5))
      neuve[o] = v0 * u[0]; neuve[o + 1] = v0 * u[1]; neuve[o + 2] = v0 * u[2]
    }
  }
  for (let i = 0; i < N; i++) {
    const o = 3 * i
    vel[o] = neuve[o]; vel[o + 1] = neuve[o + 1]; vel[o + 2] = neuve[o + 2]
    ranger(m, o)
  }
}

/* ---------- Couzin ---------- */

function pasCouzin(m) {
  const { p, N, D, pos, vel, neuve, alea } = m
  const rr = 1
  const ro = rr + p.zoo
  const ra = ro + p.zoa
  construireGrille(m, Math.max(1, ra))
  const cosVision = p.vision >= 360 ? -1 : Math.cos((p.vision / 2) * RAD)
  const s = p.vitesseCouzin * TAU
  const tourMax = p.virage * RAD * TAU
  const [g1, g2] = directionsPreferees(p)
  const u = [0, 0, 0]
  const d = [0, 0, 0]
  for (let i = 0; i < N; i++) {
    const o = 3 * i
    const n = voisinsMetriques(m, i, ra, cosVision)
    let rx = 0, ry = 0, rz = 0, nr = 0
    let ox = 0, oy = 0, oz = 0, no = 0
    let ax = 0, ay = 0, az = 0, na = 0
    for (let q = 0; q < n; q++) {
      const dist = Math.sqrt(VD[q])
      if (dist < 1e-9) continue
      if (dist < rr) { rx -= VX[q] / dist; ry -= VY[q] / dist; rz -= VZ[q] / dist; nr++ } else if (dist < ro) {
        const j3 = 3 * VI[q]
        const vj = h3(vel[j3], vel[j3 + 1], vel[j3 + 2]) || 1
        ox += vel[j3] / vj; oy += vel[j3 + 1] / vj; oz += vel[j3 + 2] / vj; no++
      } else { ax += VX[q] / dist; ay += VY[q] / dist; az += VZ[q] / dist; na++ }
    }
    const vi = h3(vel[o], vel[o + 1], vel[o + 2]) || 1
    u[0] = vel[o] / vi; u[1] = vel[o + 1] / vi; u[2] = vel[o + 2] / vi
    if (nr > 0) { d[0] = rx; d[1] = ry; d[2] = rz } else if (no > 0 || na > 0) {
      // l'individu compte dans sa propre zone d'orientation
      if (no > 0) { ox += u[0]; oy += u[1]; oz += u[2] }
      const lo = h3(ox, oy, oz) || 1
      const la = h3(ax, ay, az) || 1
      if (no > 0 && na > 0) { d[0] = 0.5 * (ox / lo + ax / la); d[1] = 0.5 * (oy / lo + ay / la); d[2] = 0.5 * (oz / lo + az / la) } else if (no > 0) { d[0] = ox; d[1] = oy; d[2] = oz } else { d[0] = ax; d[1] = ay; d[2] = az }
    } else { d[0] = u[0]; d[1] = u[1]; d[2] = u[2] }
    if (longueur(d, 1) < 1e-12) { d[0] = u[0]; d[1] = u[1]; d[2] = u[2] }
    // meneurs informés : d' = (d̂ + ω g) / |d̂ + ω g| (d est déjà normé juste au-dessus)
    const pr = m.prefere[i]
    if (pr) {
      const g = pr === 1 ? g1 : g2
      d[0] += p.poids * g[0]; d[1] += p.poids * g[1]; d[2] += p.poids * g[2]
      if (D === 2) d[2] = 0
      longueur(d, 1)
    }
    // bruit : une rotation au hasard (écart-type σ)
    if (p.sigma > 0) {
      if (D === 2) {
        const a = Math.atan2(d[1], d[0]) + p.sigma * normal(alea)
        d[0] = Math.cos(a); d[1] = Math.sin(a)
      } else tournerAuHasard(alea, d, p.sigma * normal(alea))
    }
    // virage limité à θτ
    const cosA = Math.max(-1, Math.min(1, u[0] * d[0] + u[1] * d[1] + u[2] * d[2]))
    const angle = Math.acos(cosA)
    if (angle > tourMax) {
      let wx = d[0] - cosA * u[0], wy = d[1] - cosA * u[1], wz = d[2] - cosA * u[2]
      let lw = h3(wx, wy, wz)
      if (lw < 1e-9) {
        // demi-tour exact : un côté au hasard
        if (D === 2) { wx = -u[1]; wy = u[0]; wz = 0 } else { const t = [u[0], u[1], u[2]]; tournerAuHasard(alea, t, Math.PI / 2); wx = t[0]; wy = t[1]; wz = t[2] }
        lw = h3(wx, wy, wz)
      }
      wx /= lw; wy /= lw; wz /= lw
      const c = Math.cos(tourMax), sn = Math.sin(tourMax)
      d[0] = c * u[0] + sn * wx; d[1] = c * u[1] + sn * wy; d[2] = c * u[2] + sn * wz
    }
    if (D === 2) d[2] = 0
    longueur(d, s)
    neuve[o] = d[0]; neuve[o + 1] = d[1]; neuve[o + 2] = d[2]
  }
  for (let i = 0; i < N; i++) {
    const o = 3 * i
    vel[o] = neuve[o]; vel[o + 1] = neuve[o + 1]; vel[o + 2] = neuve[o + 2]
    pos[o] += vel[o]; pos[o + 1] += vel[o + 1]; pos[o + 2] += vel[o + 2]
  }
}

/* ---------- Cucker-Smale ---------- */

function pasCucker(m) {
  const { p, N, pos, vel, neuve } = m
  const beta = p.beta
  const K = p.K / N
  neuve.fill(0)
  // ψ(r) = (1 + r²)^(−β) est symétrique : on le calcule une fois par paire
  for (let i = 0; i < N; i++) {
    const o = 3 * i
    for (let j = i + 1; j < N; j++) {
      const q = 3 * j
      const dx = pos[q] - pos[o], dy = pos[q + 1] - pos[o + 1], dz = pos[q + 2] - pos[o + 2]
      const psi = Math.exp(-beta * Math.log1p(dx * dx + dy * dy + dz * dz))
      const ax = psi * (vel[q] - vel[o]), ay = psi * (vel[q + 1] - vel[o + 1]), az = psi * (vel[q + 2] - vel[o + 2])
      neuve[o] += ax; neuve[o + 1] += ay; neuve[o + 2] += az
      neuve[q] -= ax; neuve[q + 1] -= ay; neuve[q + 2] -= az
    }
  }
  for (let i = 0; i < N; i++) {
    const o = 3 * i
    vel[o] += DT_CS * K * neuve[o]; vel[o + 1] += DT_CS * K * neuve[o + 1]; vel[o + 2] += DT_CS * K * neuve[o + 2]
    pos[o] += DT_CS * vel[o]; pos[o + 1] += DT_CS * vel[o + 1]; pos[o + 2] += DT_CS * vel[o + 2]
  }
}

/* ---------- Avancer ---------- */

const PAS = { boids: pasBoids, vicsek: pasVicsek, couzin: pasCouzin, cucker: pasCucker }

/** Avance de n pas. */
export function avancer(m, n = 1) {
  const f = PAS[m.p.modele] ?? pasBoids
  for (let k = 0; k < n; k++) {
    f(m)
    m.pas++
    m.t += m.p.modele === 'couzin' ? TAU : m.p.modele === 'cucker' ? DT_CS : 1
  }
}

/* ---------- Mesures ---------- */

/**
 * Les indicateurs du vol :
 *   polarisation : |moyenne des directions| (0 : en tous sens, 1 : tous dans le même sens)
 *   rotation     : moment angulaire normalisé autour du centre (1 : un tore parfait)
 *   groupes      : nombre de groupes (individus reliés de proche en proche à moins d'un rayon)
 *   plusGrand    : part du plus grand groupe
 *   voisin       : distance moyenne au plus proche voisin
 *   dispersion   : écart-type des vitesses rapporté à la vitesse moyenne
 *   cap          : direction de la vitesse moyenne, vue de dessus (degrés ; 0 = vers la droite)
 *   captures     : nombre de captures depuis le départ
 */
/**
 * Les groupes : union de proche en proche, à la portée de perception
 * (1 pour Vicsek, r_o + r_a / 2 pour Couzin, 3 pour Cucker-Smale).
 * @returns racines (le représentant du groupe de chacun), le plus grand groupe,
 *   le nombre de groupes, et la somme des distances au plus proche voisin
 */
function trouverGroupes(m) {
  const { N } = m
  const portee = m.p.modele === 'couzin' ? 1 + m.p.zoo + m.p.zoa * 0.5 : m.p.modele === 'cucker' ? 3 : m.p.modele === 'vicsek' ? 1 : m.p.rayon
  construireGrille(m, portee)
  const parent = new Int32Array(N)
  for (let i = 0; i < N; i++) parent[i] = i
  const racine = (i) => { while (parent[i] !== i) { parent[i] = parent[parent[i]]; i = parent[i] } return i }
  let voisin = 0
  for (let i = 0; i < N; i++) {
    const n = voisinsMetriques(m, i, portee)
    let dmin = Infinity
    for (let q = 0; q < n; q++) {
      if (VD[q] < dmin) dmin = VD[q]
      const a = racine(i), b = racine(VI[q])
      if (a !== b) parent[a] = b
    }
    voisin += Number.isFinite(dmin) ? Math.sqrt(dmin) : portee
  }
  const racines = new Int32Array(N)
  const tailles = new Int32Array(N)
  for (let i = 0; i < N; i++) { racines[i] = racine(i); tailles[racines[i]]++ }
  let plus = 0, racinePlus = 0, nombre = 0
  for (let r = 0; r < N; r++) {
    if (tailles[r] > 0) nombre++
    if (tailles[r] > plus) { plus = tailles[r]; racinePlus = r }
  }
  return { racines, racinePlus, plus, nombre, voisin }
}

export function mesurer(m) {
  const { N, D, pos, vel } = m
  let sx = 0, sy = 0, sz = 0
  let mx = 0, my = 0, mz = 0, vmoy = 0
  for (let i = 0; i < N; i++) {
    const o = 3 * i
    const v = h3(vel[o], vel[o + 1], vel[o + 2]) || 1
    sx += vel[o] / v; sy += vel[o + 1] / v; sz += vel[o + 2] / v
    mx += vel[o]; my += vel[o + 1]; mz += vel[o + 2]
    vmoy += v
  }
  const polarisation = h3(sx, sy, sz) / N
  vmoy /= N
  mx /= N; my /= N; mz /= N
  let disp = 0
  for (let i = 0; i < N; i++) {
    const o = 3 * i
    disp += (vel[o] - mx) ** 2 + (vel[o + 1] - my) ** 2 + (vel[o + 2] - mz) ** 2
  }
  const dispersion = Math.sqrt(disp / N) / (vmoy || 1)

  const { racines, racinePlus, plus, nombre, voisin } = trouverGroupes(m)
  const racine = (i) => racines[i]

  // Direction du plus grand groupe : sa vitesse moyenne, vue de dessus
  let gx = 0, gy = 0
  for (let i = 0; i < N; i++) if (racines[i] === racinePlus) { gx += vel[3 * i]; gy += vel[3 * i + 1] }

  // Rotation : autour du centre du plus grand groupe (sur le tore, centre « circulaire »)
  let cx = 0, cy = 0, cz = 0
  if (m.bords === 'tore') {
    const L = m.L
    const ang = [[0, 0], [0, 0], [0, 0]]
    for (let i = 0; i < N; i++) {
      if (racine(i) !== racinePlus) continue
      for (let a = 0; a < 3; a++) {
        const t = (pos[3 * i + a] / L) * 2 * Math.PI
        ang[a][0] += Math.cos(t); ang[a][1] += Math.sin(t)
      }
    }
    const centre = ang.map(([c, s]) => ((Math.atan2(s, c) / (2 * Math.PI) + 1) % 1) * L)
    ;[cx, cy, cz] = centre
  } else {
    for (let i = 0; i < N; i++) {
      if (racine(i) !== racinePlus) continue
      cx += pos[3 * i]; cy += pos[3 * i + 1]; cz += pos[3 * i + 2]
    }
    cx /= plus; cy /= plus; cz /= plus
  }
  let rx = 0, ry = 0, rz = 0
  for (let i = 0; i < N; i++) {
    if (racine(i) !== racinePlus) continue
    const o = 3 * i
    let dx = pos[o] - cx, dy = pos[o + 1] - cy, dz = pos[o + 2] - cz
    if (m.bords === 'tore') { const L = m.L; dx -= L * Math.round(dx / L); dy -= L * Math.round(dy / L); dz -= L * Math.round(dz / L) }
    const d = h3(dx, dy, dz) || 1
    const v = h3(vel[o], vel[o + 1], vel[o + 2]) || 1
    const ux = dx / d, uy = dy / d, uz = dz / d
    const wx = vel[o] / v, wy = vel[o + 1] / v, wz = vel[o + 2] / v
    rx += uy * wz - uz * wy; ry += uz * wx - ux * wz; rz += ux * wy - uy * wx
  }
  const rotation = (D === 2 ? Math.abs(rz) : h3(rx, ry, rz)) / plus

  return {
    t: m.t,
    polarisation,
    rotation,
    groupes: nombre,
    plusGrand: plus / N,
    voisin: voisin / N,
    dispersion,
    cap: (Math.atan2(gy, gx) * 180) / Math.PI,   // direction du plus grand groupe, vue de dessus (degrés)
    captures: m.captures,
    centre: [cx, cy, cz],
  }
}

/**
 * La boîte à montrer : le monde entier (tore, murs), ou le groupe principal (monde ouvert).
 * @returns [x0, y0, z0, x1, y1, z1]
 */
export function boite(m) {
  if (m.bords !== 'ouvert') return [0, 0, 0, m.L, m.L, m.D === 3 ? m.L : 0]
  // monde ouvert. Couzin : on cadre le plus grand groupe ; ceux qui s'en détachent sortent du
  // cadre (ils sont partis) au lieu de forcer la vue à reculer sans fin. Cucker-Smale : on
  // cadre tout le monde (sauf les 2 % les plus éloignés), pour voir le groupe se disperser.
  const { N, pos } = m
  const tous = m.p.modele === 'cucker'
  const { racines, racinePlus, plus } = tous ? { racines: new Int32Array(N), racinePlus: 0, plus: N } : trouverGroupes(m)
  let cx = 0, cy = 0, cz = 0
  for (let i = 0; i < N; i++) {
    if (racines[i] !== racinePlus) continue
    cx += pos[3 * i]; cy += pos[3 * i + 1]; cz += pos[3 * i + 2]
  }
  cx /= plus; cy /= plus; cz /= plus
  const d = new Float32Array(plus)
  let k = 0
  for (let i = 0; i < N; i++) {
    if (racines[i] !== racinePlus) continue
    d[k++] = Math.max(Math.abs(pos[3 * i] - cx), Math.abs(pos[3 * i + 1] - cy), Math.abs(pos[3 * i + 2] - cz))
  }
  d.sort()
  const r = Math.max(5, d[Math.floor(0.98 * (plus - 1))] * 1.15)
  return [cx - r, cy - r, cz - (m.D === 3 ? r : 0), cx + r, cy + r, cz + (m.D === 3 ? r : 0)]
}
