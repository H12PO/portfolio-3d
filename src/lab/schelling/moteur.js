import { generateur } from '../commun/aleatoire.js'
import { genererTerrain, SOL } from './terrain.js'

// ============================================================
//  SCHELLING : le moteur (pur, sans dessin, testable en Node)
//
//  Une ville = une grille de cases : habitables (occupées ou vides),
//  ou non (eau, parc, mur). Chaque habitant a un groupe, un revenu,
//  une date d'emménagement et quelques amis.
//
//  Un « tour » : chaque habitant est activé une fois en moyenne,
//  dans un ordre au hasard (mise à jour asynchrone). Activé, il compare
//  son logement à quelques logements vides tirés au hasard, garde le
//  meilleur, et déménage si le gain dépasse le coût du déménagement.
//  Avec du bruit (température T > 0), le choix devient flou : chaque
//  logement visité est retenu avec un poids e^(u / T), et le déménagement
//  se fait avec la probabilité 1 / (1 + e^(−gain / T)).
//
//  L'utilité d'un logement c pour l'habitant i :
//    satisfaction sociale (0 ou 1 : la part de voisins semblables au-dessus
//    de sa tolérance ; avec l'envie de mixité, une note entre 0 et 1 qui
//    culmine entre la tolérance et le plafond de semblables)
//    + poids de l'attrait × attrait(c)
//    + poids des amis × part de ses amis à moins de 6 cases de c.
//  Contraintes : le loyer (s'il compte), les logements sociaux
//  (réservés aux revenus modestes), les propriétaires qui refusent.
// ============================================================

export const MAX_GROUPES = 5
const K_AMIS = 4          // amis par habitant
const R_AMIS = 6          // « proche d'un ami » : à moins de 6 cases
const K_CANDIDATS = 16    // logements vides visités par un habitant insatisfait
const K_FLANEUR = 4       // … et par un habitant satisfait qui regarde ailleurs
const PENTE_MINORITE = 2.5 // envie de mixité : être en minorité pèse plus lourd…
const PENTE_MAJORITE = 1   // … qu'être trop entouré de semblables (Zhang, 2004)
const COUT_BASE = 0.04    // un déménagement coûte toujours un peu
const ANCIENNETE = 10     // tours pour être pleinement attaché à son quartier
const MARGE_LOYER = 0.08  // un habitant en place supporte un loyer un peu au-dessus de ses moyens
export const PLAFOND_SOCIAL = 0.4  // revenu maximal pour un logement social
const LOYER_SOCIAL = 0.05

/** Réglages par défaut : le damier classique de Schelling */
export const DEFAUTS = {
  terrain: 'grille',       // 'grille' | 'ville'
  taille: 100,             // côté, en cases
  groupes: 2,
  parts: [1, 1, 1, 1, 1],  // poids de chaque groupe (les premiers `groupes` comptent)
  vides: 0.1,              // part de logements vides
  tolerance: [0.34, 0.34, 0.34, 0.34, 0.34],  // part minimale de voisins semblables
  mixite: [1, 1, 1, 1, 1], // part maximale de voisins semblables (1 = pas d'envie de mixité)
  bruit: 0,                // température T
  attachement: 0,          // coût supplémentaire du déménagement après une longue installation
  renouvellement: 0,       // part des habitants qui quittent la ville à chaque tour
  arrivees: null,          // poids des groupes chez les nouveaux arrivants (null = comme `parts`)
  loyers: 0,               // force du marché du logement (0 : les loyers ne comptent pas)
  ecartRevenus: 0,         // écart de revenu entre groupes (le groupe 1 le plus aisé)
  attrait: 0,              // poids de l'attrait des lieux
  social: 0,               // part de logements sociaux
  socialRegroupe: false,   // regroupés en grands ensembles, ou dispersés
  discrimination: 0,       // part des propriétaires qui refusent le groupe visé
  cible: 1,                // groupe visé par la discrimination (indice)
  amis: 0,                 // poids des amis
  homophilie: 0.5,         // probabilité qu'un ami soit du même groupe
}

// Les réglages qui demandent de recréer la ville
export const REGLAGES_DE_DEPART = ['terrain', 'taille', 'groupes', 'parts', 'vides', 'ecartRevenus', 'homophilie']

// Fonction de répartition de la loi normale (approximation d'Abramowitz et Stegun)
function phi(z) {
  const t = 1 / (1 + 0.2316419 * Math.abs(z))
  const d = 0.3989423 * Math.exp((-z * z) / 2)
  const q = d * t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))))
  return z > 0 ? 1 - q : q
}
// Tirage normal (Box-Muller)
const normal = (alea) => Math.sqrt(-2 * Math.log(alea() + 1e-12)) * Math.cos(2 * Math.PI * alea())

const normaliser = (poids, n) => {
  const p = poids.slice(0, n).map((x) => Math.max(0, x))
  const s = p.reduce((a, b) => a + b, 0)
  return s > 0 ? p.map((x) => x / s) : p.map(() => 1 / n)
}

/**
 * Crée une ville. Deux villes de même graine et de même terrain partent du même état :
 * c'est ce qui rend la comparaison côte à côte honnête.
 */
export function creerVille(reglages = {}, graine = 1) {
  const p = { ...DEFAUTS, ...reglages }
  const W = p.taille
  const H = p.taille
  const N = W * H
  const terrain = genererTerrain(p.terrain, W, H, graine)
  const alea = generateur(graine)
  const cap = N

  const v = {
    W, H, N, tore: terrain.tore, p, graine, alea,
    sol: terrain.sol,
    base: terrain.attrait,             // attrait du terrain
    peint: new Float32Array(N),        // attrait ajouté au pinceau
    attrait: new Float32Array(N),
    occ: new Int32Array(N).fill(-1),   // habitant de la case, ou −1
    social: new Uint8Array(N),
    refus: new Uint8Array(N),          // groupes refusés par le propriétaire (masque de bits)
    loyer: new Float32Array(N),
    vois: voisinage(W, H, terrain.tore),
    // tirages fixés une fois pour toutes : logements sociaux et propriétaires
    rangSocial: new Float32Array(N),
    rangRefus: null,
    // habitants
    groupe: new Uint8Array(cap),
    revenu: new Float32Array(cap),
    pos: new Int32Array(cap).fill(-1),
    depuis: new Float32Array(cap),
    uid: new Int32Array(cap),
    amis: new Int32Array(cap * K_AMIS).fill(-1),
    amisUid: new Int32Array(cap * K_AMIS),
    prochainUid: 1,
    agents: new Int32Array(cap), agIdx: new Int32Array(cap).fill(-1), pop: 0,
    libres: [],
    vacants: new Int32Array(N), vacIdx: new Int32Array(N).fill(-1), nVac: 0,
    popCible: 0,
    t: 0,
    reste: 0, resteDeparts: 0, resteLoyers: 0,
    compte: { demenagements: 0, forces: 0, activations: 0, departs: 0 },
    _sat: 0, _note: 0, _u: 0,
  }
  for (let i = cap - 1; i >= 0; i--) v.libres.push(i)
  for (let c = 0; c < N; c++) v.rangSocial[c] = alea()
  v.rangGrandsEnsembles = rangsGrandsEnsembles(v, generateur(graine * 31 + 7))
  v.rangRefus = champLisse(v, generateur(graine * 17 + 3))
  recalculerAttrait(v)
  appliquerReglesVille(v)

  // Les habitants, au hasard
  const parts = normaliser(p.parts, p.groupes)
  for (let c = 0; c < N; c++) {
    if (v.sol[c] !== SOL.HABITABLE) continue
    if (alea() < p.vides) { ajouterVacant(v, c); continue }
    const i = nouvelHabitant(v, tirerGroupe(parts, alea()))
    installer(v, i, c)
  }
  for (let k = 0; k < v.pop; k++) choisirAmis(v, v.agents[k])
  v.popCible = v.pop
  for (let c = 0; c < N; c++) majLoyer(v, c, 1)
  return v
}

// Les 8 voisins de chaque case (−1 hors de la ville si elle n'est pas refermée)
function voisinage(W, H, tore) {
  const t = new Int32Array(W * H * 8)
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      let k = (y * W + x) * 8
      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          if (!dx && !dy) continue
          let X = x + dx
          let Y = y + dy
          if (tore) { X = (X + W) % W; Y = (Y + H) % H }
          t[k++] = X < 0 || Y < 0 || X >= W || Y >= H ? -1 : Y * W + X
        }
      }
    }
  }
  return t
}

// Propriétaires qui refusent : regroupés par quartiers. Un champ aléatoire lisse
// (une somme de bosses), ramené à des rangs uniformes entre 0 et 1 : les cases
// de rang < d refusent, et forment des zones d'un seul tenant.
function champLisse(v, alea) {
  const { W, H, N } = v
  const champ = new Float32Array(N)
  const bosses = Array.from({ length: 14 }, () => [alea() * W, alea() * H, (alea() < 0.5 ? -1 : 1), W * (0.07 + 0.08 * alea())])
  for (let c = 0; c < N; c++) {
    const x = c % W
    const y = (c - x) / W
    let s = 0
    for (const [bx, by, signe, r] of bosses) {
      let dx = Math.abs(x - bx)
      let dy = Math.abs(y - by)
      if (v.tore) { dx = Math.min(dx, W - dx); dy = Math.min(dy, H - dy) }
      s += signe * Math.exp(-(dx * dx + dy * dy) / (2 * r * r))
    }
    champ[c] = s + alea() * 0.02
  }
  const ordre = Array.from({ length: N }, (_, c) => c).sort((a, b) => champ[a] - champ[b])
  const rang = new Float32Array(N)
  ordre.forEach((c, k) => { rang[c] = (k + 0.5) / N })
  return rang
}

// Grands ensembles : quelques blocs compacts, plutôt loin du centre dans la ville
function rangsGrandsEnsembles(v, alea) {
  const { W, H, N } = v
  const centres = []
  for (let essai = 0; centres.length < 4 && essai < 400; essai++) {
    const x = alea() * W
    const y = alea() * H
    const c = Math.floor(y) * W + Math.floor(x)
    if (v.sol[c] !== SOL.HABITABLE) continue
    if (!v.tore && v.base[c] > 0.25) continue
    if (centres.some((q) => Math.hypot(q[0] - x, q[1] - y) < W / 4)) continue
    centres.push([x, y])
  }
  const r = new Float32Array(N)
  for (let c = 0; c < N; c++) {
    const x = c % W
    const y = (c - x) / W
    let d = Infinity
    for (const [cx, cy] of centres) {
      let dx = Math.abs(x + 0.5 - cx)
      let dy = Math.abs(y + 0.5 - cy)
      if (v.tore) { dx = Math.min(dx, W - dx); dy = Math.min(dy, H - dy) }
      d = Math.min(d, Math.max(dx, dy))
    }
    r[c] = d + alea() * 0.5
  }
  return r
}

/** Logements sociaux et discrimination : à recalculer quand ces réglages changent */
export function appliquerReglesVille(v) {
  const { p, N } = v
  // logements sociaux : les cases de plus petit rang, jusqu'à la part demandée
  v.social.fill(0)
  if (p.social > 0) {
    const rang = p.socialRegroupe ? v.rangGrandsEnsembles : v.rangSocial
    const habitables = []
    for (let c = 0; c < N; c++) if (v.sol[c] === SOL.HABITABLE) habitables.push(c)
    habitables.sort((a, b) => rang[a] - rang[b])
    const n = Math.round(habitables.length * p.social)
    for (let k = 0; k < n; k++) v.social[habitables[k]] = 1
  }
  // propriétaires : une part d'entre eux refuse le groupe visé
  const masque = p.cible < p.groupes ? 1 << p.cible : 0
  for (let c = 0; c < N; c++) v.refus[c] = v.rangRefus[c] < p.discrimination ? masque : 0
}

export function recalculerAttrait(v) {
  for (let c = 0; c < v.N; c++) v.attrait[c] = Math.min(1, v.base[c] + v.peint[c])
}

const tirerGroupe = (parts, u) => {
  let s = 0
  for (let g = 0; g < parts.length; g++) { s += parts[g]; if (u < s) return g }
  return parts.length - 1
}

// Revenu : une valeur entre 0 et 1 (un rang dans la population de départ),
// décalée vers le haut pour le groupe 1 et vers le bas pour le dernier
function tirerRevenu(v, g) {
  const G = v.p.groupes
  const decalage = G > 1 ? v.p.ecartRevenus * (1 - (2 * g) / (G - 1)) : 0
  return Math.min(0.999, Math.max(0.001, phi(normal(v.alea) + decalage)))
}

function nouvelHabitant(v, g) {
  const i = v.libres.pop()
  v.groupe[i] = g
  v.revenu[i] = tirerRevenu(v, g)
  v.uid[i] = v.prochainUid++
  v.depuis[i] = v.t
  for (let k = 0; k < K_AMIS; k++) v.amis[i * K_AMIS + k] = -1
  v.agIdx[i] = v.pop
  v.agents[v.pop++] = i
  return i
}

function retirerHabitant(v, i) {
  const c = v.pos[i]
  if (c >= 0) { v.occ[c] = -1; ajouterVacant(v, c) }
  v.pos[i] = -1
  const k = v.agIdx[i]
  const dernier = v.agents[--v.pop]
  v.agents[k] = dernier
  v.agIdx[dernier] = k
  v.agIdx[i] = -1
  v.uid[i] = 0
  v.libres.push(i)
}

function ajouterVacant(v, c) {
  if (v.vacIdx[c] >= 0) return
  v.vacIdx[c] = v.nVac
  v.vacants[v.nVac++] = c
}
function retirerVacant(v, c) {
  const k = v.vacIdx[c]
  if (k < 0) return
  const dernier = v.vacants[--v.nVac]
  v.vacants[k] = dernier
  v.vacIdx[dernier] = k
  v.vacIdx[c] = -1
}

function installer(v, i, c) {
  const ancien = v.pos[i]
  if (ancien >= 0) { v.occ[ancien] = -1; ajouterVacant(v, ancien) }
  retirerVacant(v, c)
  v.occ[c] = i
  v.pos[i] = c
  v.depuis[i] = v.t
}

// Amis : tirés au hasard, du même groupe avec la probabilité « homophilie »
function choisirAmis(v, i) {
  for (let k = 0; k < K_AMIS; k++) {
    if (v.pop < 2) break
    const memeGroupe = v.alea() < v.p.homophilie
    let j = -1
    for (let essai = 0; essai < 30; essai++) {
      const cand = v.agents[Math.floor(v.alea() * v.pop)]
      if (cand === i) continue
      if (memeGroupe === (v.groupe[cand] === v.groupe[i])) { j = cand; break }
      if (essai === 29) j = cand
    }
    v.amis[i * K_AMIS + k] = j
    v.amisUid[i * K_AMIS + k] = j >= 0 ? v.uid[j] : 0
  }
}

/* ---------- Utilité ---------- */

// Voisins occupés et voisins semblables de l'habitant i s'il habitait en c
function composition(v, i, c) {
  const g = v.groupe[i]
  let occ = 0
  let meme = 0
  const k0 = c * 8
  for (let k = 0; k < 8; k++) {
    const n = v.vois[k0 + k]
    if (n < 0) continue
    const a = v.occ[n]
    if (a < 0 || a === i) continue
    occ++
    if (v.groupe[a] === g) meme++
  }
  return occ * 16 + meme // deux petits entiers dans un seul nombre
}

// Satisfaction sociale : 1 si la part de semblables f est dans [tolérance, plafond], 0 sinon.
// v._note reçoit l'utilité sociale : la même chose sans envie de mixité (le modèle de Schelling),
// une note graduelle avec (elle baisse vite sous la tolérance, doucement au-dessus du plafond).
function satisfaction(v, i, c) {
  const cm = composition(v, i, c)
  const occ = cm >> 4
  if (occ === 0) { v._note = 1; return 1 }
  const f = (cm & 15) / occ
  const g = v.groupe[i]
  const bas = v.p.tolerance[g]
  const haut = v.p.mixite[g]
  const ok = f >= bas - 1e-9 && f <= haut + 1e-9 ? 1 : 0
  if (haut >= 1) v._note = ok
  else if (ok) v._note = 1
  else v._note = Math.max(0, f < bas ? 1 - PENTE_MINORITE * (bas - f) : 1 - PENTE_MAJORITE * (f - haut))
  return ok
}

// Part des amis (encore en ville) à moins de R_AMIS cases de c
function amisProches(v, i, c) {
  const { W, H } = v
  const x = c % W
  const y = (c - x) / W
  let n = 0
  let proches = 0
  for (let k = 0; k < K_AMIS; k++) {
    const j = v.amis[i * K_AMIS + k]
    if (j < 0 || v.uid[j] !== v.amisUid[i * K_AMIS + k]) continue
    n++
    const cj = v.pos[j]
    const xj = cj % W
    const yj = (cj - xj) / W
    let dx = Math.abs(xj - x)
    let dy = Math.abs(yj - y)
    if (v.tore) { dx = Math.min(dx, W - dx); dy = Math.min(dy, H - dy) }
    if (dx <= R_AMIS && dy <= R_AMIS) proches++
  }
  return n ? proches / n : 0
}

/** Utilité du logement c pour l'habitant i ; v._sat reçoit la satisfaction sociale */
export function utilite(v, i, c) {
  const p = v.p
  v._sat = satisfaction(v, i, c)
  let u = v._note
  if (p.attrait > 0) u += p.attrait * v.attrait[c]
  if (p.amis > 0) u += p.amis * amisProches(v, i, c)
  return u
}

// Le logement c est-il possible pour i ? (entrant : un nouveau bail, soumis au propriétaire)
function accessible(v, i, c, entrant) {
  if (entrant && v.refus[c] & (1 << v.groupe[i])) return false
  if (v.p.loyers <= 0) return true
  if (v.social[c]) return v.revenu[i] <= PLAFOND_SOCIAL || !entrant
  return v.loyer[c] <= v.revenu[i] + (entrant ? 0 : MARGE_LOYER)
}

/** L'habitant i doit-il partir (loyer devenu trop cher) ? */
export const chasse = (v, i) => v.p.loyers > 0 && !accessible(v, i, v.pos[i], false)

/* ---------- Dynamique ---------- */

// Choisit un logement parmi k vides tirés au hasard : le meilleur (T = 0),
// ou un tirage pondéré par e^(u / T). Renvoie la case (ou −1) ; v._u reçoit son utilité.
const candidats = new Int32Array(K_CANDIDATS)
const notes = new Float64Array(K_CANDIDATS)
function visiter(v, i, k) {
  const T = v.p.bruit
  let n = 0
  let max = -Infinity
  for (let e = 0; e < k && v.nVac > 0; e++) {
    const c = v.vacants[Math.floor(v.alea() * v.nVac)]
    if (!accessible(v, i, c, true)) continue
    const u = utilite(v, i, c)
    candidats[n] = c
    notes[n++] = u
    if (u > max) max = u
  }
  if (!n) return -1
  let choix = 0
  if (T > 0) {
    let s = 0
    for (let e = 0; e < n; e++) { notes[e] = Math.exp((notes[e] - max) / T); s += notes[e] }
    let tirage = v.alea() * s
    while (choix < n - 1 && (tirage -= notes[choix]) > 0) choix++
    v._u = max + T * Math.log(notes[choix])
  } else {
    for (let e = 1; e < n; e++) if (notes[e] > notes[choix]) choix = e
    v._u = notes[choix]
  }
  return candidats[choix]
}

// Un habitant activé : il visite quelques logements vides et déménage peut-être
function activer(v, i) {
  const p = v.p
  const c0 = v.pos[i]
  const force = chasse(v, i)
  const u0 = force ? -Infinity : utilite(v, i, c0)
  const satisfait = !force && v._sat === 1
  // Le modèle classique : sans bruit ni préférence continue, un habitant satisfait ne bouge pas
  if (satisfait && p.bruit <= 0 && p.attrait <= 0 && p.amis <= 0) return
  const meilleur = visiter(v, i, satisfait ? K_FLANEUR : K_CANDIDATS)
  const uMeilleur = v._u
  if (meilleur < 0) {
    // chassé par son loyer, et rien à sa portée : il quitte la ville
    if (force) { retirerHabitant(v, i); v.compte.forces++; v.compte.departs++ }
    return
  }
  const cout = COUT_BASE + p.attachement * Math.min(1, (v.t - v.depuis[i]) / ANCIENNETE)
  const gain = uMeilleur - cout - u0
  const accepte = p.bruit > 0 && gain !== Infinity
    ? v.alea() < 1 / (1 + Math.exp(-gain / p.bruit))
    : gain > 0
  if (!accepte) return
  installer(v, i, meilleur)
  v.compte.demenagements++
  if (force) v.compte.forces++
}

// Un nouvel arrivant choisit son logement parmi quelques vides
function accueillir(v) {
  const p = v.p
  const parts = normaliser(p.arrivees ?? p.parts, p.groupes)
  if (!v.libres.length || !v.nVac) return
  const i = nouvelHabitant(v, tirerGroupe(parts, v.alea()))
  const meilleur = visiter(v, i, K_CANDIDATS)
  if (meilleur < 0) { retirerHabitant(v, i); return }
  installer(v, i, meilleur)
  choisirAmis(v, i)
}

// Le loyer d'une case suit l'attrait du lieu et le revenu moyen du voisinage (5 × 5)
function majLoyer(v, c, vitesse) {
  const p = v.p
  if (v.sol[c] !== SOL.HABITABLE) { v.loyer[c] = 0; return }
  if (p.loyers <= 0) { v.loyer[c] = 0; return }
  if (v.social[c]) { v.loyer[c] = LOYER_SOCIAL * p.loyers; return }
  const { W, H } = v
  const x = c % W
  const y = (c - x) / W
  let s = 0
  let n = 0
  for (let dy = -2; dy <= 2; dy++) {
    let Y = y + dy
    if (v.tore) Y = (Y + H) % H
    else if (Y < 0 || Y >= H) continue
    for (let dx = -2; dx <= 2; dx++) {
      let X = x + dx
      if (v.tore) X = (X + W) % W
      else if (X < 0 || X >= W) continue
      const a = v.occ[Y * W + X]
      if (a >= 0) { s += v.revenu[a]; n++ }
    }
  }
  const moyen = n ? s / n : 0.5
  const cible = p.loyers * Math.min(0.98, Math.max(0.02, 0.22 + 0.5 * v.attrait[c] + 0.9 * (moyen - 0.5)))
  v.loyer[c] += vitesse * (cible - v.loyer[c])
}

/** Fait avancer la ville de `tours` tours (une fraction est possible : 0,05 tour…) */
export function avancer(v, tours) {
  const p = v.p
  // départs et arrivées
  if (p.renouvellement > 0) {
    v.resteDeparts += tours * p.renouvellement * v.pop
    while (v.resteDeparts >= 1 && v.pop > 0) {
      v.resteDeparts -= 1
      retirerHabitant(v, v.agents[Math.floor(v.alea() * v.pop)])
      v.compte.departs++
    }
  }
  // de nouveaux habitants comblent les départs (renouvellement ou loyers trop chers)
  const essais = 3 * (v.popCible - v.pop) + 10
  for (let e = 0; e < essais && v.pop < v.popCible; e++) accueillir(v)
  // activations
  v.reste += tours * v.pop
  const n = Math.floor(v.reste)
  v.reste -= n
  for (let k = 0; k < n && v.pop > 0; k++) {
    activer(v, v.agents[Math.floor(v.alea() * v.pop)])
    v.compte.activations++
  }
  // loyers : chaque case révisée une fois par tour en moyenne
  if (p.loyers > 0) {
    v.resteLoyers += tours * v.N
    const m = Math.floor(v.resteLoyers)
    v.resteLoyers -= m
    for (let k = 0; k < m; k++) majLoyer(v, Math.floor(v.alea() * v.N), 0.5)
  }
  v.t += tours
}

/** À appeler quand des réglages vivants changent (pas ceux de REGLAGES_DE_DEPART) */
export function regler(v, reglages) {
  const avant = v.p
  v.p = { ...v.p, ...reglages }
  if (avant.social !== v.p.social || avant.socialRegroupe !== v.p.socialRegroupe || avant.discrimination !== v.p.discrimination || avant.cible !== v.p.cible) {
    appliquerReglesVille(v)
  }
  if (avant.loyers !== v.p.loyers || avant.social !== v.p.social || avant.socialRegroupe !== v.p.socialRegroupe) {
    for (let c = 0; c < v.N; c++) majLoyer(v, c, 1)
  }
}

/* ---------- Mesures ---------- */

// Indice d'entropie de Theil (multigroupes), sur des quartiers carrés de b × b cases :
// 0 = chaque quartier a la composition de la ville, 1 = chaque quartier n'a qu'un groupe
function theil(comptes, nQuartiers, G) {
  const total = new Float64Array(G)
  let T = 0
  for (let q = 0; q < nQuartiers; q++) for (let g = 0; g < G; g++) { total[g] += comptes[q * G + g]; T += comptes[q * G + g] }
  if (!T) return 0
  const entropie = (n, t) => {
    let e = 0
    for (let g = 0; g < G; g++) { const x = n[g] / t; if (x > 0) e -= x * Math.log(x) }
    return e
  }
  const E = entropie(total, T)
  if (E <= 0) return 0
  let H = 0
  const n = new Float64Array(G)
  for (let q = 0; q < nQuartiers; q++) {
    let t = 0
    for (let g = 0; g < G; g++) { n[g] = comptes[q * G + g]; t += n[g] }
    if (t) H += (t / T) * (E - entropie(n, t))
  }
  return H / E
}

export const tailleQuartier = (W) => Math.max(5, Math.round(W / 12))

/** Les indicateurs de la ville (O(N)) */
export function mesurer(v) {
  const { W, H, p } = v
  const G = p.groupes
  const b = tailleQuartier(W)
  const qx = Math.ceil(W / b)
  const qy = Math.ceil(H / b)
  const nQ = qx * qy
  const comptes = new Float64Array(nQ * G)
  const comptesRevenu = new Float64Array(nQ * 5)
  const parGroupe = new Float64Array(G)
  const semblablesGroupe = new Float64Array(G)
  const avecVoisins = new Float64Array(G)
  // quintiles de revenu de la population présente
  const revenus = new Float32Array(v.pop)
  for (let k = 0; k < v.pop; k++) revenus[k] = v.revenu[v.agents[k]]
  revenus.sort()
  const seuils = [0.2, 0.4, 0.6, 0.8].map((q) => revenus[Math.floor(q * (v.pop - 1))] ?? q)
  let semblables = 0
  let nSemblables = 0
  let satisfaits = 0
  let chasses = 0
  let paires = 0
  let pairesMixtes = 0
  for (let k = 0; k < v.pop; k++) {
    const i = v.agents[k]
    const c = v.pos[i]
    const g = v.groupe[i]
    parGroupe[g]++
    const x = c % W
    const y = (c - x) / W
    const q = Math.floor(y / b) * qx + Math.floor(x / b)
    comptes[q * G + g]++
    let r = 0
    while (r < 4 && v.revenu[i] > seuils[r]) r++
    comptesRevenu[q * 5 + r]++
    const cm = composition(v, i, c)
    const occ = cm >> 4
    if (occ) {
      const f = (cm & 15) / occ
      semblables += f
      nSemblables++
      semblablesGroupe[g] += f
      avecVoisins[g]++
      paires += occ
      pairesMixtes += occ - (cm & 15)
    }
    const force = chasse(v, i)
    if (force) chasses++
    if (!force && satisfaction(v, i, c)) satisfaits++
  }
  const dt = Math.max(1e-9, v.t - (v._tMesure ?? 0))
  const m = {
    t: v.t,
    population: v.pop,
    semblables: nSemblables ? semblables / nSemblables : 0,
    semblablesGroupe: Array.from(semblablesGroupe, (s, g) => (avecVoisins[g] ? s / avecVoisins[g] : 0)),
    parGroupe: Array.from(parGroupe),
    satisfaits: v.pop ? satisfaits / v.pop : 0,
    chasses,
    theil: theil(comptes, nQ, G),
    theilRevenus: theil(comptesRevenu, nQ, 5),
    interfaces: paires ? pairesMixtes / paires : 0,
    // par habitant et par tour, depuis la mesure précédente
    demenagements: v.pop ? v.compte.demenagements / v.pop / dt : 0,
    forces: v.pop ? v.compte.forces / v.pop / dt : 0,
  }
  v.compte.demenagements = 0
  v.compte.forces = 0
  v._tMesure = v.t
  return m
}

/* ---------- Pinceau ---------- */

export const OUTILS = ['habitant', 'vider', 'mur', 'parc', 'social', 'attrait']

/**
 * Peint un disque de rayon r autour de la case (x, y).
 * outil 'habitant' : un habitant du groupe g sur chaque case du disque (densité 90 %).
 */
export function peindre(v, outil, x, y, r, g = 0) {
  const { W, H } = v
  let attraitChange = false
  for (let dy = -r; dy <= r; dy++) {
    for (let dx = -r; dx <= r; dx++) {
      if (dx * dx + dy * dy > r * r + r) continue
      let X = x + dx
      let Y = y + dy
      if (v.tore) { X = (X + W) % W; Y = (Y + H) % H } else if (X < 0 || Y < 0 || X >= W || Y >= H) continue
      const c = Y * W + X
      const a = v.occ[c]
      if (outil === 'habitant') {
        if (v.sol[c] !== SOL.HABITABLE || v.alea() > 0.9) continue
        if (a >= 0) retirerHabitant(v, a)
        if (!v.libres.length) continue
        const i = nouvelHabitant(v, Math.min(g, v.p.groupes - 1))
        installer(v, i, c)
        choisirAmis(v, i)
      } else if (outil === 'vider') {
        if (a >= 0) retirerHabitant(v, a)
        if (v.sol[c] !== SOL.HABITABLE) { v.sol[c] = SOL.HABITABLE; ajouterVacant(v, c) }
        v.social[c] = 0
        if (v.peint[c]) { v.peint[c] = 0; attraitChange = true }
      } else if (outil === 'mur' || outil === 'parc') {
        if (a >= 0) retirerHabitant(v, a)
        retirerVacant(v, c)
        v.sol[c] = outil === 'mur' ? SOL.MUR : SOL.PARC
        v.social[c] = 0
        v.loyer[c] = 0
      } else if (outil === 'social') {
        if (v.sol[c] === SOL.HABITABLE) v.social[c] = 1
      }
    }
  }
  // Un parc ou un lieu attractif rend son voisinage plus attirant
  if (outil === 'parc' || outil === 'attrait') {
    const R = r + 6
    for (let dy = -R; dy <= R; dy++) {
      for (let dx = -R; dx <= R; dx++) {
        let X = x + dx
        let Y = y + dy
        if (v.tore) { X = (X + W) % W; Y = (Y + H) % H } else if (X < 0 || Y < 0 || X >= W || Y >= H) continue
        const d = Math.max(0, Math.hypot(dx, dy) - r)
        const c = Y * W + X
        v.peint[c] = Math.min(1, v.peint[c] + (outil === 'parc' ? 0.25 : 0.35) * Math.exp(-d / 3))
      }
    }
    attraitChange = true
  }
  if (attraitChange) recalculerAttrait(v)
  // les habitants peints ou retirés fixent la nouvelle population visée
  v.popCible = v.pop
}

/** L'habitant i est-il satisfait de la composition de son voisinage ? (1 ou 0) */
export const estSatisfait = (v, i) => satisfaction(v, i, v.pos[i])
