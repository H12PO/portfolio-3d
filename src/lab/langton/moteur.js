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
