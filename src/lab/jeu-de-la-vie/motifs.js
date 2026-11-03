// ============================================================
//  MOTIFS : format RLE, transformations, bibliothèque
//  Le RLE (run length encoded) est le format standard des motifs
//  du jeu de la vie (LifeWiki, Golly) : « 3o » = trois cellules
//  vivantes, « 2b » = deux vides, « $ » = ligne suivante, « ! » = fin.
//  Les règles à plusieurs états utilisent « . » pour vide et A, B…
//  pour les états 1, 2…
// ============================================================

/**
 * Lit un motif au format RLE (ou au format texte « .O », dit plaintext).
 * Renvoie { nom, regle, largeur, hauteur, cellules: [[x, y, état]] } ou null.
 */
export function lireRLE(texte) {
  const lignes = String(texte).replace(/\r/g, '').split('\n')
  let nom = ''
  let regle = null
  let entete = null
  const corps = []
  for (const brute of lignes) {
    const l = brute.trim()
    if (!l) continue
    if (l.startsWith('#')) {
      if (/^#N\s/.test(l)) nom = l.slice(3).trim()
      continue
    }
    if (!entete && /^x\s*=/.test(l)) {
      entete = l
      const r = l.match(/rule\s*=\s*([^,\s]+)/i)
      if (r) regle = r[1]
      continue
    }
    if (l.startsWith('!') && !entete) {
      // commentaire du format plaintext (« !Name: Glider »)
      const n = l.match(/^!Name:\s*(.+)$/i)
      if (n) nom = n[1].trim()
      continue
    }
    corps.push(l)
  }
  if (!corps.length) return null

  // Format plaintext : des lignes de « . » et de « O »
  if (!entete && corps.every((l) => /^[.Oo*]+$/.test(l))) {
    const cellules = []
    corps.forEach((l, y) => [...l].forEach((c, x) => { if (c !== '.') cellules.push([x, y, 1]) }))
    return normaliser({ nom, regle, cellules })
  }

  const cellules = []
  let x = 0
  let y = 0
  let compte = ''
  const texteCorps = corps.join('')
  for (const c of texteCorps) {
    if (c >= '0' && c <= '9') { compte += c; continue }
    const n = compte ? Number(compte) : 1
    compte = ''
    if (c === '!') break
    if (c === '$') { y += n; x = 0; continue }
    if (c === 'b' || c === '.') { x += n; continue }
    let etat
    if (c === 'o') etat = 1
    else if (c >= 'A' && c <= 'X') etat = c.charCodeAt(0) - 64
    else if (/\s/.test(c)) continue
    else return null // caractère inconnu (états > 24 non pris en charge)
    for (let k = 0; k < n; k++) cellules.push([x + k, y, etat])
    x += n
  }
  if (compte) return null
  return normaliser({ nom, regle, cellules })
}

// Recadre les cellules pour que le coin haut-gauche soit (0, 0)
function normaliser({ nom, regle, cellules }) {
  if (!cellules.length) return { nom, regle, largeur: 0, hauteur: 0, cellules }
  let x0 = Infinity
  let y0 = Infinity
  let x1 = -Infinity
  let y1 = -Infinity
  for (const [x, y] of cellules) {
    x0 = Math.min(x0, x); y0 = Math.min(y0, y)
    x1 = Math.max(x1, x); y1 = Math.max(y1, y)
  }
  return {
    nom,
    regle,
    largeur: x1 - x0 + 1,
    hauteur: y1 - y0 + 1,
    cellules: cellules.map(([x, y, s]) => [x - x0, y - y0, s]),
  }
}

/**
 * Écrit un motif en RLE. etats > 2 : notation à plusieurs états (« . », A, B…).
 */
export function ecrireRLE({ cellules, regle = 'B3/S23', etats = 2, nom = '' }) {
  const m = normaliser({ nom, regle, cellules })
  const grille = Array.from({ length: m.hauteur }, () => new Uint8Array(m.largeur))
  for (const [x, y, s] of m.cellules) grille[y][x] = s
  const plusieurs = etats > 2
  const symbole = (s) => (s === 0 ? (plusieurs ? '.' : 'b') : plusieurs ? String.fromCharCode(64 + s) : 'o')

  const jetons = []
  let lignesVides = 0
  grille.forEach((ligne, y) => {
    // dernière case non vide de la ligne
    let fin = ligne.length - 1
    while (fin >= 0 && !ligne[fin]) fin--
    if (fin < 0) { lignesVides++; return }
    if (y > 0) jetons.push(`${lignesVides + 1 > 1 ? lignesVides + 1 : ''}$`)
    lignesVides = 0
    let x = 0
    while (x <= fin) {
      const s = ligne[x]
      let n = 1
      while (x + n <= fin && ligne[x + n] === s) n++
      jetons.push(`${n > 1 ? n : ''}${symbole(s)}`)
      x += n
    }
  })
  jetons.push('!')

  // Lignes de 70 caractères au plus, sans couper un jeton
  const lignes = []
  let courante = ''
  for (const j of jetons) {
    if (courante.length + j.length > 70) { lignes.push(courante); courante = '' }
    courante += j
  }
  if (courante) lignes.push(courante)
  const tete = nom ? `#N ${nom}\n` : ''
  return `${tete}x = ${m.largeur}, y = ${m.hauteur}, rule = ${regle}\n${lignes.join('\n')}\n`
}

/* ---------- Transformations (pour le tampon) ---------- */

// Quart de tour dans le sens horaire
export function tourner({ largeur, hauteur, cellules, ...reste }) {
  return { ...reste, largeur: hauteur, hauteur: largeur, cellules: cellules.map(([x, y, s]) => [hauteur - 1 - y, x, s]) }
}

// Miroir gauche-droite
export function retourner({ largeur, hauteur, cellules, ...reste }) {
  return { ...reste, largeur, hauteur, cellules: cellules.map(([x, y, s]) => [largeur - 1 - x, y, s]) }
}

/* ---------- Bibliothèque ---------- */
// Motifs classiques de la règle B3/S23. Chaque motif est vérifié par les tests du moteur
// (période, déplacement, durée de vie), pas seulement recopié.

export const GROUPES = ['stables', 'oscillateurs', 'vaisseaux', 'canons', 'mathusalems', 'croissance']

export const BIBLIOTHEQUE = [
  // Natures mortes
  { id: 'bloc', groupe: 'stables', rle: '2o$2o!' },
  { id: 'ruche', groupe: 'stables', rle: 'b2o$o2bo$b2o!' },
  { id: 'pain', groupe: 'stables', rle: 'b2o$o2bo$bobo$2bo!' },
  { id: 'bateau', groupe: 'stables', rle: '2o$obo$bo!' },
  { id: 'mangeur', groupe: 'stables', rle: '2o2b$obob$2bob$2b2o!' },

  // Oscillateurs
  { id: 'clignotant', groupe: 'oscillateurs', rle: '3o!' },
  { id: 'crapaud', groupe: 'oscillateurs', rle: 'b3o$3o!' },
  { id: 'balise', groupe: 'oscillateurs', rle: '2o$2o$2b2o$2b2o!' },
  { id: 'pulsar', groupe: 'oscillateurs', rle: '2b3o3b3o2b2$o4bobo4bo$o4bobo4bo$o4bobo4bo$2b3o3b3o2b2$2b3o3b3o2b$o4bobo4bo$o4bobo4bo$o4bobo4bo2$2b3o3b3o!' },
  { id: 'huit', groupe: 'oscillateurs', rle: '3o3b$3o3b$3o3b$3b3o$3b3o$3b3o!' },
  { id: 'pentadecathlon', groupe: 'oscillateurs', rle: '2bo4bo2b$2ob4ob2o$2bo4bo!' },

  // Vaisseaux
  { id: 'planeur', groupe: 'vaisseaux', rle: 'bo$2bo$3o!' },
  { id: 'lwss', groupe: 'vaisseaux', rle: 'bo2bo$o4b$o3bo$4o!' },
  { id: 'mwss', groupe: 'vaisseaux', rle: '3bo2b$bo3bo$o5b$o4bo$5o!' },
  { id: 'hwss', groupe: 'vaisseaux', rle: '3b2o2b$bo4bo$o6b$o5bo$6o!' },
  { id: 'copperhead', groupe: 'vaisseaux', rle: 'b2o2b2o$3b2o$3b2o$obo2bobo$o6bo2$o6bo$b2o2b2o$2b4o2$3b2o$3b2o!' },

  // Canons
  { id: 'gosper', groupe: 'canons', rle: '24bo11b$22bobo11b$12b2o6b2o12b2o$11bo3bo4b2o12b2o$2o8bo5bo3b2o14b$2o8bo3bob2o4bobo11b$10bo5bo7bo11b$11bo3bo20b$12b2o!' },

  // Mathusalems : petits motifs qui mettent très longtemps à se stabiliser
  { id: 'rpentomino', groupe: 'mathusalems', rle: 'b2o$2o$bo!' },
  { id: 'diehard', groupe: 'mathusalems', rle: '6bob$2o6b$bo3b3o!' },
  { id: 'gland', groupe: 'mathusalems', rle: 'bo5b$3bo3b$2o2b3o!' },

  // Croissance sans fin
  { id: 'ligne39', groupe: 'croissance', rle: '8ob5o3b3o6b7ob5o!' },
]

export const motif = (id) => {
  const m = BIBLIOTHEQUE.find((p) => p.id === id)
  return m ? { id, ...lireRLE(m.rle) } : null
}
