// ============================================================
//  JEU DE LA VIE : moteur CPU par zones actives
//  La grille W × H est découpée en tuiles de 32 × 32 cases. À chaque
//  génération, on ne recalcule que les tuiles où quelque chose a changé
//  à la génération précédente, et leurs voisines : un planeur seul sur
//  une grande grille ne coûte presque rien.
//
//  États : 0 = vide, 1 = vivante, 2…C−1 = « en train de mourir »
//  (règles Generations comme Brian's Brain). Seules les cellules à 1
//  comptent comme voisines.
//
//  Deux chemins de calcul :
//  - règles à deux états (B/S) : 32 cases par entier de 32 bits, et le
//    comptage des voisines par additionneurs bit à bit (32 cases d'un coup) ;
//  - règles Generations : une case par octet.
//  Dans les deux cas, le tableau d'octets « etat » reste à jour : c'est
//  lui que lisent le rendu, l'analyse et l'export.
//
//  Aucune dépendance au DOM : testable tel quel dans Node.
// ============================================================

export const TUILE = 32
const LOG = 5
const JAMAIS = -1e9

/* ---------- Règles ---------- */

const chiffres = (s) => {
  const t = new Uint8Array(9)
  for (const c of s) t[Number(c)] = 1
  return t
}
const enTexte = (t) => [...t].map((v, k) => (v ? k : '')).join('')

export const texteRegle = (r) => `B${enTexte(r.naissance)}/S${enTexte(r.survie)}${r.etats > 2 ? `/C${r.etats}` : ''}`

/**
 * Lit une règle : « B3/S23 », « B36/S23 », « B2/S/C3 » (Generations),
 * ou l'ancienne notation « 23/3 », « /2/3 » (survie / naissance / états).
 * Renvoie null si la règle est invalide ou utilise B0 (non pris en charge).
 */
export function lireRegle(texte) {
  const s = String(texte).trim().toUpperCase().replace(/\s+/g, '')
  let b = null
  let sv = null
  let c = '2'
  if (/[BS]/.test(s)) {
    for (const morceau of s.split('/')) {
      const m = morceau.match(/^([BSCG])(\d*)$/)
      if (!m) return null
      if (m[1] === 'B') b = m[2]
      else if (m[1] === 'S') sv = m[2]
      else c = m[2] || '2'
    }
    if (b === null || sv === null) return null
  } else {
    const m = s.match(/^(\d*)\/(\d*)(?:\/(\d+))?$/)
    if (!m) return null
    ;[sv, b] = [m[1], m[2]]
    if (m[3]) c = m[3]
  }
  if (!/^[0-8]*$/.test(b) || !/^[0-8]*$/.test(sv) || b.includes('0')) return null
  const etats = Number(c)
  if (!Number.isInteger(etats) || etats < 2 || etats > 25) return null
  const r = { naissance: chiffres(b), survie: chiffres(sv), etats }
  return { ...r, texte: texteRegle(r) }
}

// Table de transition : etat suivant = table[etat * 9 + nombre de voisines vivantes]
function tableDe(r) {
  const t = new Uint8Array(r.etats * 9)
  for (let n = 0; n <= 8; n++) {
    t[n] = r.naissance[n] ? 1 : 0
    t[9 + n] = r.survie[n] ? 1 : r.etats > 2 ? 2 : 0
    for (let s = 2; s < r.etats; s++) t[s * 9 + n] = s + 1 < r.etats ? s + 1 : 0
  }
  return t
}

// Seul l'état 1 compte comme voisine (les cellules mourantes ne comptent pas)
const VIF = new Uint8Array(256)
VIF[1] = 1

// Pour le calcul par bits : les nombres de voisines qui font naître et survivre
const listes = (r) => ({
  naitre: [...r.naissance].flatMap((v, k) => (v ? [k] : [])),
  rester: [...r.survie].flatMap((v, k) => (v ? [k] : [])),
})

/* ---------- Création et remises à zéro ---------- */

export function creerMonde({ W = 1024, H = 1024, regle = lireRegle('B3/S23'), bords = 'ferme' } = {}) {
  if (W % TUILE || H % TUILE) throw new Error('W et H doivent être des multiples de 32')
  const TW = W / TUILE
  const TH = H / TUILE
  const m = {
    W, H, TW, TH, regle, bords,
    table: tableDe(regle),
    listes: listes(regle),
    etat: new Uint8Array(W * H),
    bits: new Uint32Array(TW * H),               // ligne y, tuile tx : bit b = case (32·tx + b, y)
    bitsSuiv: new Uint32Array(TW * H),
    suivant: new Uint8Array(W * H),
    ne: new Int32Array(W * H).fill(JAMAIS),      // génération de naissance (effet « âge »)
    mort: new Int32Array(W * H).fill(JAMAIS),    // génération de la dernière mort (effet « traînées »)
    activite: new Uint16Array(W * H),            // nombre de naissances (carte d'activité)
    actives: new Uint8Array(TW * TH),            // tuiles à recalculer à la prochaine génération
    prochaines: new Uint8Array(TW * TH),
    occupe: new Uint16Array(TW * TH),            // cellules non vides par tuile
    modif: new Int32Array(TW * TH).fill(JAMAIS), // dernière génération où la tuile a changé
    sales: new Uint8Array(TW * TH).fill(1),      // tuiles à repeindre (lu et vidé par le rendu)
    gen: 0,
    population: 0,
    depart: null,                                // état à la génération 0, pour « Réinitialiser »
    boiteCache: null,
    boiteGen: -1,
  }
  return m
}

// Recalcule population, occupation et tuiles actives à partir de etat (après un changement global)
function recalculer(m) {
  const { W, TW, TH, etat, occupe, actives } = m
  occupe.fill(0)
  actives.fill(0)
  let pop = 0
  for (let ty = 0; ty < TH; ty++) {
    for (let tx = 0; tx < TW; tx++) {
      let n = 0
      for (let y = ty * TUILE, yf = y + TUILE; y < yf; y++) {
        for (let i = y * W + tx * TUILE, f = i + TUILE; i < f; i++) if (etat[i]) n++
      }
      occupe[ty * TW + tx] = n
      pop += n
    }
  }
  for (let t = 0; t < TW * TH; t++) if (occupe[t]) marquer(m, actives, t % TW, (t / TW) | 0)
  m.suivant.set(etat) // les deux tampons sont égaux partout : invariant des tuiles inactives
  const { bits } = m
  bits.fill(0)
  for (let i = 0; i < etat.length; i++) if (etat[i] === 1) bits[(i >> 5)] |= 1 << (i & 31)
  m.bitsSuiv.set(bits)
  m.population = pop
  m.sales.fill(1)
  m.boiteGen = -1
}

export function toutEffacer(m) {
  m.etat.fill(0)
  m.ne.fill(JAMAIS)
  m.mort.fill(JAMAIS)
  m.activite.fill(0)
  m.modif.fill(JAMAIS)
  m.gen = 0
  m.depart = null
  recalculer(m)
}

// Retour à la génération 0 : le motif tel qu'il était avant « Lancer »
export function reinitialiser(m) {
  if (!m.depart) return false
  m.etat.set(m.depart)
  m.ne.fill(JAMAIS)
  m.mort.fill(JAMAIS)
  m.activite.fill(0)
  m.modif.fill(JAMAIS)
  m.gen = 0
  recalculer(m)
  return true
}

export function changerRegle(m, regle) {
  m.regle = regle
  m.table = tableDe(regle)
  m.listes = listes(regle)
  // Les états « mourants » qui n'existent plus dans la nouvelle règle disparaissent
  const { etat } = m
  for (let i = 0; i < etat.length; i++) if (etat[i] >= regle.etats) etat[i] = 0
  if (m.depart) for (let i = 0; i < etat.length; i++) if (m.depart[i] >= regle.etats) m.depart[i] = 0
  recalculer(m)
}

export function changerBords(m, bords) {
  m.bords = bords
  recalculer(m)
}

/* ---------- Lecture et écriture de cases ---------- */

// Coordonnées → indice, en tenant compte des bords (null hors de la grille fermée)
function indice(m, x, y) {
  if (m.bords === 'tore') {
    x = ((x % m.W) + m.W) % m.W
    y = ((y % m.H) + m.H) % m.H
  } else if (x < 0 || y < 0 || x >= m.W || y >= m.H) {
    return null
  }
  return y * m.W + x
}

export const lire = (m, x, y) => {
  const i = indice(m, x, y)
  return i === null ? 0 : m.etat[i]
}

// Marque une tuile et ses 8 voisines dans un tableau de tuiles
function marquer(m, tab, tx, ty) {
  const { TW, TH } = m
  const tore = m.bords === 'tore'
  for (let dy = -1; dy <= 1; dy++) {
    let b = ty + dy
    if (b < 0 || b >= TH) {
      if (!tore) continue
      b = (b + TH) % TH
    }
    for (let dx = -1; dx <= 1; dx++) {
      let a = tx + dx
      if (a < 0 || a >= TW) {
        if (!tore) continue
        a = (a + TW) % TW
      }
      tab[b * TW + a] = 1
    }
  }
}

// Écrit une case (dessin, gomme, tampon). Renvoie true si elle a changé.
export function ecrire(m, x, y, valeur) {
  const i = indice(m, x, y)
  if (i === null) return false
  const ancien = m.etat[i]
  if (ancien === valeur) return false
  m.etat[i] = valeur
  if (valeur === 1) m.bits[i >> 5] |= 1 << (i & 31)
  else m.bits[i >> 5] &= ~(1 << (i & 31))
  const cx = i % m.W
  const cy = (i / m.W) | 0
  const tx = cx >> LOG
  const ty = cy >> LOG
  const t = ty * m.TW + tx
  // Une case posée avant le départ fait partie du motif initial : elle n'est pas « nouvelle »
  if (!ancien) { m.population++; m.occupe[t]++; m.ne[i] = m.gen === 0 ? JAMAIS : m.gen }
  if (!valeur) { m.population--; m.occupe[t]--; m.mort[i] = m.gen }
  marquer(m, m.actives, tx, ty)
  m.sales[t] = 1
  m.modif[t] = m.gen
  m.boiteGen = -1
  if (m.gen === 0) m.depart = null // le motif de départ a changé
  return true
}

// Pose une liste de cellules [[x, y, état]] décalée de (ox, oy) ; les cases vides du motif ne changent rien
export function placer(m, cellules, ox = 0, oy = 0) {
  for (const [x, y, s] of cellules) if (s) ecrire(m, ox + x, oy + y, Math.min(s, m.regle.etats - 1))
}

// Soupe aléatoire : un carré de côté « cote » au centre, chaque case vivante avec la probabilité « densite »
export function soupe(m, { cote = 128, densite = 0.5, alea = Math.random } = {}) {
  toutEffacer(m)
  const c = Math.min(cote, m.W, m.H)
  const x0 = (m.W - c) >> 1
  const y0 = (m.H - c) >> 1
  for (let y = y0; y < y0 + c; y++) {
    for (let x = x0; x < x0 + c; x++) if (alea() < densite) m.etat[y * m.W + x] = 1
  }
  recalculer(m)
}

/* ---------- Boîte englobante et extraction ---------- */

// Plus petite boîte { x0, y0, x1, y1 } contenant toutes les cases non vides (null si la grille est vide)
export function boite(m) {
  if (m.boiteGen === m.gen) return m.boiteCache
  const { W, TW, TH, etat, occupe } = m
  let tx0 = TW
  let tx1 = -1
  let ty0 = TH
  let ty1 = -1
  for (let ty = 0; ty < TH; ty++) {
    for (let tx = 0; tx < TW; tx++) {
      if (!occupe[ty * TW + tx]) continue
      if (tx < tx0) tx0 = tx
      if (tx > tx1) tx1 = tx
      if (ty < ty0) ty0 = ty
      if (ty > ty1) ty1 = ty
    }
  }
  let b = null
  if (tx1 >= 0) {
    // Affinage à la case près, en ne parcourant que les tuiles du bord de la boîte
    let x0 = Infinity
    let x1 = -1
    let y0 = Infinity
    let y1 = -1
    const parcourir = (tx, ty) => {
      if (!occupe[ty * TW + tx]) return
      for (let y = ty * TUILE; y < (ty + 1) * TUILE; y++) {
        for (let x = tx * TUILE; x < (tx + 1) * TUILE; x++) {
          if (!etat[y * W + x]) continue
          if (x < x0) x0 = x
          if (x > x1) x1 = x
          if (y < y0) y0 = y
          if (y > y1) y1 = y
        }
      }
    }
    for (let ty = ty0; ty <= ty1; ty++) {
      for (let tx = tx0; tx <= tx1; tx++) {
        if (tx === tx0 || tx === tx1 || ty === ty0 || ty === ty1) parcourir(tx, ty)
      }
    }
    b = { x0, y0, x1, y1 }
  }
  m.boiteCache = b
  m.boiteGen = m.gen
  return b
}

// Cellules non vides d'une boîte, en coordonnées relatives à son coin : [[x, y, état]]
export function cellules(m, b = boite(m)) {
  const res = []
  if (!b) return res
  for (let y = b.y0; y <= b.y1; y++) {
    for (let x = b.x0; x <= b.x1; x++) {
      const s = m.etat[y * m.W + x]
      if (s) res.push([x - b.x0, y - b.y0, s])
    }
  }
  return res
}

/* ---------- Une génération ---------- */

function voisinesBord(etat, W, H, x, y, tore) {
  let n = 0
  for (let dy = -1; dy <= 1; dy++) {
    let yy = y + dy
    if (yy < 0 || yy >= H) {
      if (!tore) continue
      yy = (yy + H) % H
    }
    for (let dx = -1; dx <= 1; dx++) {
      if (!dx && !dy) continue
      let xx = x + dx
      if (xx < 0 || xx >= W) {
        if (!tore) continue
        xx = (xx + W) % W
      }
      n += VIF[etat[yy * W + xx]]
    }
  }
  return n
}

// Tuile loin des bords de la grille : aucune vérification de bord.
// Fenêtre glissante sur les sommes de colonnes (3 cases) : 3 lectures par case au lieu de 8.
// Renvoie le nombre de cases qui ont changé, et met à jour population et occupation.
function tuileInterieure(m, t, x0, y0, g, cpt) {
  const { W, etat, suivant, table, ne, mort, activite } = m
  let change = 0
  let pop = 0
  for (let y = y0, yf = y0 + TUILE; y < yf; y++) {
    const mi = y * W
    const hi = mi - W
    const bi = mi + W
    let a = VIF[etat[hi + x0 - 1]] + VIF[etat[mi + x0 - 1]] + VIF[etat[bi + x0 - 1]]
    let b = VIF[etat[hi + x0]] + VIF[etat[mi + x0]] + VIF[etat[bi + x0]]
    for (let x = x0, xf = x0 + TUILE; x < xf; x++) {
      const c = VIF[etat[hi + x + 1]] + VIF[etat[mi + x + 1]] + VIF[etat[bi + x + 1]]
      const i = mi + x
      const s = etat[i]
      const ns = table[s * 9 + a + b + c - VIF[s]]
      suivant[i] = ns
      if (ns !== s) {
        change++
        if (!s) {
          pop++
          ne[i] = g
          if (activite[i] < 65535) activite[i]++
        } else if (!ns) {
          pop--
          mort[i] = g
        }
      }
      a = b
      b = c
    }
  }
  cpt.pop += pop
  m.occupe[t] += pop
  return change
}

// Tuile au bord de la grille : voisines calculées case par case (bords fermés ou tore)
function tuileBord(m, t, x0, y0, g, cpt) {
  const { W, H, etat, suivant, table, ne, mort, activite } = m
  const tore = m.bords === 'tore'
  let change = 0
  let pop = 0
  for (let y = y0, yf = y0 + TUILE; y < yf; y++) {
    const ligne = y * W
    const interieurY = y > 0 && y < H - 1
    for (let x = x0, xf = x0 + TUILE; x < xf; x++) {
      const i = ligne + x
      let n
      if (interieurY && x > 0 && x < W - 1) {
        n = VIF[etat[i - W - 1]] + VIF[etat[i - W]] + VIF[etat[i - W + 1]]
          + VIF[etat[i - 1]] + VIF[etat[i + 1]]
          + VIF[etat[i + W - 1]] + VIF[etat[i + W]] + VIF[etat[i + W + 1]]
      } else {
        n = voisinesBord(etat, W, H, x, y, tore)
      }
      const s = etat[i]
      const ns = table[s * 9 + n]
      suivant[i] = ns
      if (ns !== s) {
        change++
        if (!s) {
          pop++
          ne[i] = g
          if (activite[i] < 65535) activite[i]++
        } else if (!ns) {
          pop--
          mort[i] = g
        }
      }
    }
  }
  cpt.pop += pop
  m.occupe[t] += pop
  return change
}

// Une génération par bits (règles à deux états). Les cases d'une même ligne de tuile
// tiennent dans un entier ; les 8 voisines sont 8 décalages de trois entiers.
function generationBits(m) {
  const { W, H, TW, TH, bits, bitsSuiv, actives, prochaines, etat, ne, mort, activite, occupe, modif, sales } = m
  const tore = m.bords === 'tore'
  const { naitre, rester } = m.listes
  const g = m.gen + 1
  let pop = 0

  for (let ty = 0; ty < TH; ty++) {
    for (let tx = 0; tx < TW; tx++) {
      const t = ty * TW + tx
      if (!actives[t]) continue
      const txg = tx > 0 ? tx - 1 : tore ? TW - 1 : -1
      const txd = tx < TW - 1 ? tx + 1 : tore ? 0 : -1
      let change = false
      let occ = 0
      for (let y = ty * TUILE, yf = y + TUILE; y < yf; y++) {
        const yh = y > 0 ? y - 1 : tore ? H - 1 : -1
        const yb = y < H - 1 ? y + 1 : tore ? 0 : -1
        const lc = y * TW
        const lh = yh * TW
        const lb = yb * TW
        const c = bits[lc + tx]
        const h = yh < 0 ? 0 : bits[lh + tx]
        const b = yb < 0 ? 0 : bits[lb + tx]
        const cg = txg < 0 ? 0 : bits[lc + txg]
        const cd = txd < 0 ? 0 : bits[lc + txd]
        const hg = yh < 0 || txg < 0 ? 0 : bits[lh + txg]
        const hd = yh < 0 || txd < 0 ? 0 : bits[lh + txd]
        const bg = yb < 0 || txg < 0 ? 0 : bits[lb + txg]
        const bd = yb < 0 || txd < 0 ? 0 : bits[lb + txd]
        // Les 8 voisines de chaque case : voisine ouest = bit b − 1, voisine est = bit b + 1
        const v1 = (h << 1) | (hg >>> 31)
        const v2 = h
        const v3 = (h >>> 1) | (hd << 31)
        const v4 = (c << 1) | (cg >>> 31)
        const v5 = (c >>> 1) | (cd << 31)
        const v6 = (b << 1) | (bg >>> 31)
        const v7 = b
        const v8 = (b >>> 1) | (bd << 31)
        // Compteur sur 4 plans de bits (0 à 8 voisines), une retenue à la fois
        let s0 = 0
        let s1 = 0
        let s2 = 0
        let s3 = 0
        let r0
        let r1
        let r2
        r0 = s0 & v1; s0 ^= v1; r1 = s1 & r0; s1 ^= r0; r2 = s2 & r1; s2 ^= r1; s3 |= r2
        r0 = s0 & v2; s0 ^= v2; r1 = s1 & r0; s1 ^= r0; r2 = s2 & r1; s2 ^= r1; s3 |= r2
        r0 = s0 & v3; s0 ^= v3; r1 = s1 & r0; s1 ^= r0; r2 = s2 & r1; s2 ^= r1; s3 |= r2
        r0 = s0 & v4; s0 ^= v4; r1 = s1 & r0; s1 ^= r0; r2 = s2 & r1; s2 ^= r1; s3 |= r2
        r0 = s0 & v5; s0 ^= v5; r1 = s1 & r0; s1 ^= r0; r2 = s2 & r1; s2 ^= r1; s3 |= r2
        r0 = s0 & v6; s0 ^= v6; r1 = s1 & r0; s1 ^= r0; r2 = s2 & r1; s2 ^= r1; s3 |= r2
        r0 = s0 & v7; s0 ^= v7; r1 = s1 & r0; s1 ^= r0; r2 = s2 & r1; s2 ^= r1; s3 |= r2
        r0 = s0 & v8; s0 ^= v8; r1 = s1 & r0; s1 ^= r0; r2 = s2 & r1; s2 ^= r1; s3 |= r2
        // Masque « exactement k voisines » pour chaque k de la règle
        let naissance = 0
        let survie = 0
        for (let j = 0; j < naitre.length; j++) {
          const k = naitre[j]
          naissance |= (k & 1 ? s0 : ~s0) & (k & 2 ? s1 : ~s1) & (k & 4 ? s2 : ~s2) & (k & 8 ? s3 : ~s3)
        }
        for (let j = 0; j < rester.length; j++) {
          const k = rester[j]
          survie |= (k & 1 ? s0 : ~s0) & (k & 2 ? s1 : ~s1) & (k & 4 ? s2 : ~s2) & (k & 8 ? s3 : ~s3)
        }
        const nouveau = (naissance & ~c) | (survie & c)
        bitsSuiv[y * TW + tx] = nouveau
        occ += popcount(nouveau)

        // Les cases qui changent : mise à jour des octets et des effets
        let diff = (nouveau ^ c) >>> 0
        if (diff) {
          change = true
          const base = y * W + tx * TUILE
          while (diff) {
            const bit = 31 - Math.clz32(diff)
            diff &= ~(1 << bit)
            const i = base + bit
            if ((nouveau >>> bit) & 1) {
              etat[i] = 1
              ne[i] = g
              if (activite[i] < 65535) activite[i]++
            } else {
              etat[i] = 0
              mort[i] = g
            }
          }
        }
      }
      pop += occ - occupe[t]
      occupe[t] = occ
      if (change) {
        modif[t] = g
        sales[t] = 1
        marquer(m, prochaines, tx, ty)
      }
    }
  }

  // Les tuiles non recalculées sont identiques dans les deux tampons de bits
  m.bits = bitsSuiv
  m.bitsSuiv = bits
  m.actives = prochaines
  m.prochaines = actives
  actives.fill(0)
  m.population += pop
  m.gen = g
}

function popcount(v) {
  v -= (v >>> 1) & 0x55555555
  v = (v & 0x33333333) + ((v >>> 2) & 0x33333333)
  return (Math.imul((v + (v >>> 4)) & 0x0f0f0f0f, 0x01010101) >>> 24)
}

function generation(m) {
  const { TW, TH, actives, prochaines, modif, sales } = m
  const g = m.gen + 1
  const cpt = { pop: 0 }

  for (let ty = 0; ty < TH; ty++) {
    for (let tx = 0; tx < TW; tx++) {
      const t = ty * TW + tx
      if (!actives[t]) continue
      const bord = tx === 0 || ty === 0 || tx === TW - 1 || ty === TH - 1
      const change = bord
        ? tuileBord(m, t, tx * TUILE, ty * TUILE, g, cpt)
        : tuileInterieure(m, t, tx * TUILE, ty * TUILE, g, cpt)
      if (change) {
        modif[t] = g
        sales[t] = 1
        marquer(m, prochaines, tx, ty)
      }
    }
  }

  // Échange des tampons : les tuiles non recalculées sont identiques dans les deux
  const { etat, suivant } = m
  m.etat = suivant
  m.suivant = etat
  m.actives = prochaines
  m.prochaines = actives
  actives.fill(0)
  m.population += cpt.pop
  m.gen = g
}

// Avance de n générations
export function avancer(m, n = 1) {
  if (m.gen === 0 && !m.depart && n > 0) m.depart = m.etat.slice()
  const pas = m.regle.etats === 2 ? generationBits : generation
  for (let k = 0; k < n; k++) pas(m)
}

// Nombre de tuiles actives (pour la barre d'état et les tests)
export const tuilesActives = (m) => m.actives.reduce((s, v) => s + v, 0)
