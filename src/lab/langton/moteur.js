// ============================================================
//  MOTEUR — fourmis de Langton et turmites
//  Aucune dépendance au DOM : testable seul, réutilisé par la page
//  et par la borne d'arcade.
//
//  À chaque pas, chaque fourmi :
//    1. lit la couleur de sa case
//    2. consulte la table (état, couleur) → couleur à écrire, virage, nouvel état
//    3. écrit, tourne, change d'état
//    4. avance d'une case (ou fait demi-tour si un mur bloque)
// ============================================================

// Directions dans le sens horaire : 0 haut, 1 droite, 2 bas, 3 gauche
export const DX = [0, 1, 0, -1]
export const DY = [-1, 0, 1, 0]

// Virage en quarts de tour horaires
const VIRAGE = { N: 0, R: 1, U: 2, L: 3 }
// Notation des turmites de Golly / Ed Pegg Jr : 1 aucun, 2 droite, 4 demi-tour, 8 gauche
const CODE_GOLLY = { 1: 0, 2: 1, 4: 2, 8: 3 }

export const PERIODE_AUTOROUTE = 104

/* ---------- Règles ---------- */

// 2 à 12 lettres parmi L R N U
export const lettresValides = (s) => /^[LRNU]{2,12}$/i.test(s)

// 'RL' → une table à 1 état : la couleur c devient c + 1, virage donné par la lettre c
export function regleLettres(lettres) {
  const l = lettres.toUpperCase()
  const couleurs = l.length
  const table = new Int8Array(couleurs * 3)
  for (let c = 0; c < couleurs; c++) {
    table[c * 3] = (c + 1) % couleurs
    table[c * 3 + 1] = VIRAGE[l[c]]
    table[c * 3 + 2] = 0
  }
  return { type: 'lettres', nom: l, couleurs, etats: 1, table }
}

// '181181121010' (triplets écrire / virage / état suivant, état par état, couleur par couleur)
export function regleTurmite(code, couleurs = 2) {
  const chiffres = [...code].map(Number)
  const etats = chiffres.length / 3 / couleurs
  const table = new Int8Array(chiffres.length)
  for (let k = 0; k < chiffres.length; k += 3) {
    table[k] = chiffres[k]
    table[k + 1] = CODE_GOLLY[chiffres[k + 1]]
    table[k + 2] = chiffres[k + 2]
  }
  return { type: 'turmite', nom: code, couleurs, etats, table }
}

/* ---------- Monde ---------- */

export function creerMonde({ W = 512, H = 512, regle, bords = 'arret' }) {
  const N = W * H
  const monde = {
    W, H, regle, bords,
    couleur: new Uint8Array(N),
    mur: new Uint8Array(N),
    passages: new Uint32Array(N),
    dernier: new Uint32Array(N),  // pas du dernier passage (pour la traînée)
    fourmis: [],
    departs: [{ x: W >> 1, y: H >> 1, dir: 0 }], // rejoués par « Recommencer »
    pas: 0,
    maxPassages: 0,
    boite: null,      // rectangle touché (fourmis, traces, murs) : rendu et cadrage
    autoroute: null,  // pas où l'autoroute a été repérée (règle RL, 1re fourmi)
    suivi: [],
  }
  reinitialiser(monde)
  return monde
}

function etendre(m, x, y) {
  const b = m.boite
  if (!b) { m.boite = { x0: x, y0: y, x1: x, y1: y }; return }
  if (x < b.x0) b.x0 = x
  if (x > b.x1) b.x1 = x
  if (y < b.y0) b.y0 = y
  if (y > b.y1) b.y1 = y
}

// Remet la grille à zéro et replace les fourmis de départ. Les murs restent.
export function reinitialiser(m) {
  m.couleur.fill(0)
  m.passages.fill(0)
  m.dernier.fill(0)
  m.pas = 0
  m.maxPassages = 0
  m.autoroute = null
  m.suivi = []
  m.boite = null
  m.fourmis = m.departs.map((d) => ({ ...d, etat: 0 }))
  for (const f of m.fourmis) etendre(m, f.x, f.y)
  for (let i = 0; i < m.mur.length; i++) {
    if (m.mur[i]) etendre(m, i % m.W, (i / m.W) | 0)
  }
}

export function toutEffacer(m) {
  m.mur.fill(0)
  m.departs = [{ x: m.W >> 1, y: m.H >> 1, dir: 0 }]
  reinitialiser(m)
}

export function changerRegle(m, regle) {
  m.regle = regle
  reinitialiser(m)
}

const dedans = (m, x, y) => x >= 0 && y >= 0 && x < m.W && y < m.H

export function ajouterFourmi(m, x, y, dir = 0) {
  if (!dedans(m, x, y) || m.mur[y * m.W + x]) return
  m.departs.push({ x, y, dir })
  m.fourmis.push({ x, y, dir, etat: 0 })
  etendre(m, x, y)
}

export function poserMur(m, x, y) {
  if (!dedans(m, x, y)) return
  const i = y * m.W + x
  if (m.fourmis.some((f) => f.x === x && f.y === y)) return
  m.mur[i] = 1
  m.couleur[i] = 0
  etendre(m, x, y)
}

// Efface mur, couleur, passages et fourmis sur la case
export function gommer(m, x, y) {
  if (!dedans(m, x, y)) return
  const i = y * m.W + x
  m.mur[i] = 0
  m.couleur[i] = 0
  m.passages[i] = 0
  const ailleurs = (f) => f.x !== x || f.y !== y
  m.fourmis = m.fourmis.filter(ailleurs)
  m.departs = m.departs.filter(ailleurs)
}

/* ---------- Remonter le temps ---------- */

// Possible pour une règle à lettres, sans mur ni fourmi sortie : chaque pas se défait de façon unique
export const peutReculer = (m) =>
  m.regle.type === 'lettres' && m.pas > 0 && !m.mur.some((v) => v) && m.fourmis.length === m.departs.length

// Défait n pas. La fourmi revient d'où elle venait, la case retrouve sa couleur d'avant,
// et l'orientation se déduit de cette couleur : c'est ce qui rend la règle réversible.
export function reculer(m, n = 1) {
  const { W, H, couleur, passages, regle } = m
  const { table, couleurs } = regle
  for (let k = 0; k < n && m.pas > 0; k++) {
    for (let a = m.fourmis.length - 1; a >= 0; a--) {
      const f = m.fourmis[a]
      const px = (f.x - DX[f.dir] + W) % W
      const py = (f.y - DY[f.dir] + H) % H
      const i = py * W + px
      const avant = (couleur[i] - 1 + couleurs) % couleurs
      f.dir = (f.dir - table[avant * 3 + 1] + 4) & 3
      couleur[i] = avant
      if (passages[i]) passages[i]--
      f.x = px
      f.y = py
    }
    m.pas--
    if (m.autoroute !== null && m.pas < m.autoroute) { m.autoroute = null; m.suivi = [] }
  }
}

/* ---------- Mesures (onglet Théorie) ---------- */

// Fait tourner la règle RL sur une grande feuille vide et relève la trajectoire
export function mesurerLangton(pasMax = 20000, echantillon = 50) {
  const m = creerMonde({ W: 1024, H: 1024, regle: regleLettres('RL') })
  const x0 = m.fourmis[0].x
  const y0 = m.fourmis[0].y
  const pos = new Int16Array((pasMax + 1) * 2)
  const marquees = new Int32Array(pasMax + 1)   // cases marquées à chaque pas
  const dmax = new Float32Array(pasMax + 1)     // distance maximale atteinte
  const points = []
  let n = 0
  let loin = 0
  for (let s = 0; s <= pasMax; s++) {
    const f = m.fourmis[0]
    pos[2 * s] = f.x
    pos[2 * s + 1] = f.y
    const d = Math.hypot(f.x - x0, f.y - y0)
    loin = Math.max(loin, d)
    dmax[s] = loin
    marquees[s] = n
    if (s % echantillon === 0) points.push([s, d])
    if (s === pasMax) break
    n += m.couleur[f.y * m.W + f.x] ? -1 : 1
    avancer(m, 1)
  }
  // Premier pas à partir duquel le mouvement est exactement périodique (période 104)
  let debut = 0
  for (let s = pasMax - 105; s >= 0; s--) {
    const dx = pos[2 * (s + 1)] - pos[2 * s]
    const dy = pos[2 * (s + 1) + 1] - pos[2 * s + 1]
    const dx2 = pos[2 * (s + 105)] - pos[2 * (s + 104)]
    const dy2 = pos[2 * (s + 105) + 1] - pos[2 * (s + 104) + 1]
    if (dx !== dx2 || dy !== dy2) { debut = s + 1; break }
  }
  const cycle = [pos[2 * (debut + PERIODE_AUTOROUTE)] - pos[2 * debut], pos[2 * (debut + PERIODE_AUTOROUTE) + 1] - pos[2 * debut + 1]]
  // Pendant le chaos : exposant de croissance de la distance maximale,
  // pente de la droite des moindres carrés en échelle log-log (40 points espacés géométriquement)
  const [a, b] = [500, Math.min(debut - 100, pasMax)]
  const xs = []
  const ys = []
  for (let k = 0; k < 40; k++) {
    const t = Math.round(a * (b / a) ** (k / 39))
    xs.push(Math.log(t))
    ys.push(Math.log(dmax[t]))
  }
  const mx = xs.reduce((s, v) => s + v, 0) / xs.length
  const my = ys.reduce((s, v) => s + v, 0) / ys.length
  const sxy = xs.reduce((s, v, k) => s + (v - mx) * (ys[k] - my), 0)
  const sxx = xs.reduce((s, v) => s + (v - mx) ** 2, 0)
  const exposant = sxy / sxx
  const r2 = sxy ** 2 / (sxx * ys.reduce((s, v) => s + (v - my) ** 2, 0))
  return {
    points, debut, cycle, exposant, r2, intervalle: [a, b],
    marqueesAuDebut: marquees[debut], periode: PERIODE_AUTOROUTE,
  }
}

/* ---------- Expérience Monte Carlo : feuilles de départ aléatoires ---------- */

// Générateur pseudo-aléatoire reproductible (mulberry32)
export function generateur(graine) {
  let a = graine | 0
  return () => {
    a = (a + 0x6D2B79F5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

let historique = null

// Un essai : carré de côté « cote » autour de la fourmi, chaque case marquée avec la probabilité
// « densite ». On avance jusqu'à 10 cycles de 104 pas identiques, puis on cherche au pas près
// le début du mouvement périodique. Renvoie ce pas, ou null si le plafond est atteint.
export function essaiAutoroute(m, { cote, densite, alea, plafond = 400000 }) {
  const marge = 12 * PERIODE_AUTOROUTE
  if (!historique || historique.length < 2 * (plafond + marge)) historique = new Int16Array(2 * (plafond + marge))
  const h = historique
  reinitialiser(m)
  const c0 = (m.W >> 1) - (cote >> 1)
  const r0 = (m.H >> 1) - (cote >> 1)
  for (let y = r0; y < r0 + cote; y++) {
    for (let x = c0; x < c0 + cote; x++) if (alea() < densite) m.couleur[y * m.W + x] = 1
  }

  const P = PERIODE_AUTOROUTE
  let identiques = 0
  let s = 0
  for (; s < plafond + marge; s++) {
    const f = m.fourmis[0]
    if (!f) return null
    h[2 * s] = f.x
    h[2 * s + 1] = f.y
    if (s >= 2 * P && s % P === 0) {
      const dx = h[2 * s] - h[2 * (s - P)]
      const dy = h[2 * s + 1] - h[2 * (s - P) + 1]
      const dx2 = h[2 * (s - P)] - h[2 * (s - 2 * P)]
      const dy2 = h[2 * (s - P) + 1] - h[2 * (s - 2 * P) + 1]
      identiques = dx === dx2 && dy === dy2 && Math.abs(dx) === 2 && Math.abs(dy) === 2 ? identiques + 1 : 0
      if (identiques >= 10) break
    }
    if (s >= plafond) return null
    avancer(m, 1)
  }
  // Remonte depuis la fin : premier pas à partir duquel chaque déplacement se répète 104 pas plus tard
  for (let t = s - P - 1; t >= 0; t--) {
    const dx = h[2 * (t + 1)] - h[2 * t]
    const dy = h[2 * (t + 1) + 1] - h[2 * t + 1]
    const dx2 = h[2 * (t + P + 1)] - h[2 * (t + P)]
    const dy2 = h[2 * (t + P + 1) + 1] - h[2 * (t + P) + 1]
    if (dx !== dx2 || dy !== dy2) return t + 1
  }
  return 0
}

/* ---------- Simulation ---------- */

// Avance de n pas (chaque pas fait bouger toutes les fourmis une fois)
export function avancer(m, n = 1) {
  const { W, H, couleur, mur, passages, dernier, regle } = m
  const { table, couleurs } = regle
  const tore = m.bords === 'tore'
  const suivreAutoroute = regle.type === 'lettres' && regle.nom === 'RL' && m.departs.length === 1

  for (let k = 0; k < n; k++) {
    const fourmis = m.fourmis
    if (fourmis.length === 0) return
    let sorties = 0

    for (let a = 0; a < fourmis.length; a++) {
      const f = fourmis[a]
      const i = f.y * W + f.x
      const t = (f.etat * couleurs + (couleur[i] % couleurs)) * 3

      couleur[i] = table[t]
      f.dir = (f.dir + table[t + 1]) & 3
      f.etat = table[t + 2]

      const p = ++passages[i]
      if (p > m.maxPassages) m.maxPassages = p
      dernier[i] = m.pas

      let nx = f.x + DX[f.dir]
      let ny = f.y + DY[f.dir]
      if (nx < 0 || ny < 0 || nx >= W || ny >= H) {
        if (!tore) { f.sortie = true; sorties++; continue }
        nx = (nx + W) % W
        ny = (ny + H) % H
      }
      if (mur[ny * W + nx]) {
        f.dir = (f.dir + 2) & 3 // rebond : demi-tour sur place
        continue
      }
      f.x = nx
      f.y = ny
      etendre(m, nx, ny)
    }

    if (sorties) m.fourmis = fourmis.filter((f) => !f.sortie)
    m.pas++

    // Autoroute de la règle classique : même déplacement de (±2, ±2)
    // sur trois cycles de 104 pas consécutifs
    if (suivreAutoroute && m.autoroute === null && m.pas % PERIODE_AUTOROUTE === 0 && m.fourmis[0]) {
      const f = m.fourmis[0]
      m.suivi.push([f.x, f.y])
      if (m.suivi.length > 4) m.suivi.shift()
      if (m.suivi.length === 4) {
        const d = m.suivi.slice(1).map(([x, y], j) => [x - m.suivi[j][0], y - m.suivi[j][1]])
        const constant = d.every(([dx, dy]) => dx === d[0][0] && dy === d[0][1])
        if (constant && Math.abs(d[0][0]) === 2 && Math.abs(d[0][1]) === 2) {
          m.autoroute = m.pas - 3 * PERIODE_AUTOROUTE
        }
      }
    }
  }
}
