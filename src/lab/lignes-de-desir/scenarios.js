import { SOL, terrainVide, porte, rectangle, disque, trait, arbre } from './moteur.js'

// ============================================================
//  LIGNES DE DÉSIR : les terrains et les scénarios
//  Un terrain est construit par une fonction (mètres, origine en haut
//  à gauche). Un scénario = un terrain + quelques réglages + la vitesse
//  de l'explorateur qui lui va. Les poids d'une porte : [matin, midi, soir],
//  comme départ (o) et comme destination (d) ; sans heures de pointe,
//  on prend leur moyenne.
// ============================================================

const { HERBE, PAVE, BATI, CLOTURE } = SOL

function p3(x, y, nom, o, d = o, type = 'porte') {
  const po = porte(x, y, nom, 1, type)
  po.o = Array.isArray(o) ? o.slice() : [o, o, o]
  po.d = Array.isArray(d) ? d.slice() : [d, d, d]
  return po
}

/* ---------- Le square : une pelouse bordée d'une allée, une fontaine, six entrées ---------- */
function square() {
  const t = terrainVide(70, 50)
  // haie tout autour, ouverte aux six entrées
  rectangle(t, CLOTURE, 0, 0, 70, 1); rectangle(t, CLOTURE, 0, 49, 70, 50)
  rectangle(t, CLOTURE, 0, 0, 1, 50); rectangle(t, CLOTURE, 69, 0, 70, 50)
  // l'allée de l'architecte : un tour et deux axes jusqu'à la fontaine
  rectangle(t, PAVE, 1, 1, 69, 3.5); rectangle(t, PAVE, 1, 46.5, 69, 49)
  rectangle(t, PAVE, 1, 1, 3.5, 49); rectangle(t, PAVE, 66.5, 1, 69, 49)
  rectangle(t, PAVE, 33.75, 3.5, 36.25, 46.5)
  disque(t, PAVE, 35, 25, 7)
  disque(t, BATI, 35, 25, 4.5)       // le bassin
  // entrées dans la haie
  for (const [x, y] of [[0, 0], [70, 0], [0, 50], [70, 50]]) rectangle(t, PAVE, x - 3, y - 3, x + 3, y + 3)
  rectangle(t, PAVE, 33.75, 0, 36.25, 1); rectangle(t, PAVE, 33.75, 49, 36.25, 50)
  rectangle(t, PAVE, 0, 23.75, 1, 26.25)
  for (const [x, y] of [[12, 12], [58, 12], [12, 38], [58, 38], [22, 30], [50, 20]]) arbre(t, x, y, 1.2)
  t.portes = [
    p3(2, 2, 'Nord-Ouest', 1), p3(68, 2, 'Nord-Est', 1.5),
    p3(2, 48, 'Sud-Ouest', 1), p3(68, 48, 'Sud-Est', 2.5),
    p3(35, 2, 'Nord', 1), p3(35, 48, 'Sud', 2),
    p3(1.5, 25, 'Ouest', 0.7),
  ]
  return t
}

/* ---------- Le campus : bâtiments, allées à angle droit, une gare ---------- */
function campus() {
  const t = terrainVide(110, 80)
  const batiments = [
    ['Bibliothèque', 10, 8, 38, 26], ['Amphis', 62, 6, 100, 24],
    ['Laboratoires', 8, 48, 40, 70], ['Cafétéria', 70, 52, 94, 70],
  ]
  for (const [, x0, y0, x1, y1] of batiments) rectangle(t, BATI, x0, y0, x1, y1)
  // les allées dessinées : une grille orthogonale qui longe les façades
  rectangle(t, PAVE, 0, 36, 110, 39.5)          // le grand axe est-ouest
  rectangle(t, PAVE, 50, 0, 53.5, 80)           // l'axe nord-sud
  rectangle(t, PAVE, 22, 26, 25, 36)            // bibliothèque → axe
  rectangle(t, PAVE, 80, 24, 83, 36)            // amphis → axe
  rectangle(t, PAVE, 22, 39.5, 25, 48)          // labos → axe
  rectangle(t, PAVE, 80, 39.5, 83, 52)          // cafétéria → axe
  rectangle(t, PAVE, 104, 72, 110, 80)          // le parvis de la gare
  rectangle(t, PAVE, 53.5, 72, 110, 75)
  for (const [x, y] of [[45, 14], [57, 30], [30, 31], [96, 32], [62, 46], [46, 60], [60, 66], [102, 46], [4, 30], [4, 44]]) arbre(t, x, y, 1.3)
  t.portes = [
    p3(23.5, 27, 'Bibliothèque', [0.3, 1, 1.2], [1, 0.8, 0.3]),
    p3(81.5, 25, 'Amphis', [0.3, 1.5, 1.5], [2.5, 0.6, 0.3]),
    p3(23.5, 47, 'Laboratoires', [0.3, 1, 1.2], [1.5, 0.8, 0.3]),
    p3(81.5, 51, 'Cafétéria', [0.2, 2, 0.4], [0.2, 2.5, 0.3]),
    p3(107, 77, 'Gare', [5, 0.3, 0.3], [0.2, 0.3, 5]),
    p3(1, 38, 'Parking', [2, 0.2, 0.2], [0.1, 0.2, 2]),
    p3(51.75, 1, 'Résidences', [1.5, 0.4, 0.4], [0.2, 0.4, 1.5]),
  ]
  return t
}

/* ---------- Expériences : trois ou quatre portes sur une pelouse nue ---------- */
function trois() {
  const t = terrainVide(60, 52)
  t.portes = [p3(30, 4, 'A', 1), p3(6, 46, 'B', 1), p3(54, 46, 'C', 1)]
  return t
}
function quatre() {
  const t = terrainVide(60, 52)
  t.portes = [p3(6, 6, 'A', 1), p3(54, 6, 'B', 1), p3(54, 46, 'C', 1), p3(6, 46, 'D', 1)]
  return t
}

/* ---------- Les fils de laine de Frei Otto : dix points sur un cercle ---------- */
function anneau() {
  const t = terrainVide(64, 64)
  const n = 10
  for (let k = 0; k < n; k++) {
    const a = (k / n) * 2 * Math.PI - Math.PI / 2
    t.portes.push(p3(32 + 27 * Math.cos(a), 32 + 27 * Math.sin(a), String.fromCharCode(65 + k), 1))
  }
  return t
}

/* ---------- Un parc où certaines entrées servent peu ---------- */
function parcInegal() {
  const t = terrainVide(70, 46)
  for (const [x, y] of [[20, 14], [50, 30], [35, 36]]) arbre(t, x, y, 1.4)
  t.portes = [
    p3(4, 23, 'Métro', 5), p3(66, 23, 'École', 5),
    p3(35, 3, 'Kiosque', 1), p3(66, 4, 'Banc', 0.4), p3(10, 43, 'Jeux', 0.6),
  ]
  return t
}

/* ---------- Le hall de l'aéroport ---------- */
function aeroport() {
  const t = terrainVide(100, 56)
  t.fond = 'sol'
  // murs du terminal, portes vitrées en bas, salles d'embarquement en haut
  rectangle(t, BATI, 0, 0, 100, 2); rectangle(t, BATI, 0, 54, 100, 56)
  rectangle(t, BATI, 0, 0, 2, 56); rectangle(t, BATI, 98, 0, 100, 56)
  for (const x of [20, 50, 80]) rectangle(t, HERBE, x - 3, 54, x + 3, 56)
  for (let k = 0; k < 6; k++) rectangle(t, HERBE, 9 + k * 16 - 2, 0, 9 + k * 16 + 2, 2)
  // banques d'enregistrement : trois îlots
  for (const x of [14, 42, 70]) rectangle(t, BATI, x, 40, x + 16, 43)
  // contrôle de sûreté : une barrière percée de quatre passages
  trait(t, CLOTURE, 2, 30, 98, 30, 0.6)
  for (const x of [20, 40, 60, 80]) rectangle(t, HERBE, x - 1.5, 29, x + 1.5, 31)
  // boutiques et café côté pistes
  rectangle(t, BATI, 34, 14, 46, 22); rectangle(t, BATI, 56, 14, 66, 22)
  // rangées de sièges devant les portes
  for (let k = 0; k < 6; k++) {
    const x = 9 + k * 16
    rectangle(t, BATI, x - 5, 7, x + 5, 8); rectangle(t, BATI, x - 5, 10, x + 5, 11)
  }
  t.portes = [
    p3(20, 54.5, 'Entrée 1', [3, 1.5, 1], [0.3, 0.6, 1.5]),
    p3(50, 54.5, 'Entrée 2', [4, 2, 1.5], [0.3, 0.8, 2]),
    p3(80, 54.5, 'Entrée 3', [3, 1.5, 1], [0.3, 0.6, 1.5]),
  ]
  for (let k = 0; k < 6; k++) t.portes.push(p3(9 + k * 16, 1.5, `Porte ${k + 1}`, [0.3, 0.6, 1], [1.5, 1, 0.6]))
  t.portes.push(p3(40, 23, 'Librairie', [0.4, 0.6, 0.6], [0.6, 0.8, 0.6]), p3(61, 23, 'Café', [0.6, 1.5, 0.6], [1, 2, 0.6]))
  return t
}

/* ---------- Une pelouse libre, pour dessiner ---------- */
function libre() {
  const t = terrainVide(70, 50)
  t.portes = [p3(6, 25, 'A', 1), p3(64, 25, 'B', 1)]
  return t
}

/* ---------- Fourmis : le double pont (branches égales ou inégales), et un fourragement libre ---------- */
function doublePont(inegal) {
  // en centimètres : un nid en bas, de la nourriture en haut, deux branches entre les deux
  const t = terrainVide(40, 50, 0.25)
  t.fond = 'sable'
  rectangle(t, BATI, 0, 0, 40, 50)
  rectangle(t, HERBE, 14, 41, 26, 49)           // le nid
  rectangle(t, HERBE, 14, 1, 26, 9)             // la nourriture
  rectangle(t, HERBE, 18.5, 35, 21.5, 41)       // couloir du nid
  rectangle(t, HERBE, 18.5, 9, 21.5, 15)        // couloir de la nourriture
  // les deux branches : un losange, ou une branche qui fait un détour
  const e = 2.6
  trait(t, HERBE, 20, 35, 10, 25, e); trait(t, HERBE, 10, 25, 20, 15, e)
  if (inegal) {
    trait(t, HERBE, 20, 35, 26, 29, e); trait(t, HERBE, 26, 29, 37, 29, e)
    trait(t, HERBE, 37, 29, 37, 21, e); trait(t, HERBE, 37, 21, 26, 21, e); trait(t, HERBE, 26, 21, 20, 15, e)
  } else {
    trait(t, HERBE, 20, 35, 30, 25, e); trait(t, HERBE, 30, 25, 20, 15, e)
  }
  t.portes = [p3(20, 46, 'Nid', 1, 1, 'nid'), p3(20, 4, 'Nourriture', 1, 1, 'nourriture')]
  // les zones de comptage : branche de gauche (A), branche de droite (B)
  t.zones = [{ nom: 'A', x0: 8, y0: 23, x1: 13, y1: 27 }, { nom: 'B', x0: inegal ? 33 : 27, y0: inegal ? 23 : 23, x1: inegal ? 39 : 32, y1: 27 }]
  return t
}

function fourragement() {
  const t = terrainVide(50, 40, 0.25)
  t.fond = 'sable'
  for (const [x, y, r] of [[18, 14, 2.5], [33, 26, 3], [30, 10, 1.6], [12, 28, 2], [40, 16, 1.4]]) disque(t, BATI, x, y, r)
  t.portes = [
    p3(25, 20, 'Nid', 1, 1, 'nid'),
    p3(6, 5, 'Graines', 1, 1, 'nourriture'), p3(45, 6, 'Miettes', 1, 1, 'nourriture'), p3(44, 35, 'Pucerons', 1, 1, 'nourriture'),
  ]
  return t
}

export const TERRAINS = {
  square, campus, trois, quatre, anneau, parcInegal, aeroport, libre,
  pont: () => doublePont(false), pontInegal: () => doublePont(true), fourragement,
}

export const SCENARIOS = [
  { id: 'square', terrain: 'square', r: { debit: 900, repousse: 6 }, vitesse: 4 },
  { id: 'campus', terrain: 'campus', r: { debit: 700 }, vitesse: 4 },
  { id: 'trois', terrain: 'trois', r: { attrait: 4 }, vitesse: 4 },
  { id: 'quatre', terrain: 'quatre', r: { attrait: 3 }, vitesse: 4 },
  { id: 'anneau', terrain: 'anneau', r: { attrait: 2, debit: 900 }, vitesse: 4 },
  { id: 'repousse', terrain: 'parcInegal', r: { repousse: 1.5, debit: 400 }, vitesse: 4 },
  { id: 'types', terrain: 'square', r: { parts: [0.5, 0, 0.5], debit: 900, repousse: 6 }, vitesse: 4, vue: 'types' },
  { id: 'pointe', terrain: 'campus', r: { pointe: true, debit: 800 }, vitesse: 4 },
  { id: 'aeroport', terrain: 'aeroport', r: { attrait: 0.8, repousse: 1, debit: 1200, pointe: true }, vitesse: 4 },
  { id: 'effort', terrain: 'campus', r: { modele: 'effort', effort: 0.25, debit: 700 }, vitesse: 4 },
  { id: 'pont', terrain: 'pont', r: { modele: 'fourmis' }, vitesse: 4 },
  { id: 'pontInegal', terrain: 'pontInegal', r: { modele: 'fourmis' }, vitesse: 4 },
  { id: 'fourragement', terrain: 'fourragement', r: { modele: 'fourmis', fourmis: 700 }, vitesse: 4 },
  { id: 'libre', terrain: 'libre', r: {}, vitesse: 4 },
]

export const scenario = (id) => SCENARIOS.find((s) => s.id === id) ?? SCENARIOS[0]
