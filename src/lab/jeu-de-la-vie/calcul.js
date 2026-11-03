// ============================================================
//  JEU DE LA VIE : la logique des figures sur le calcul
//  Sans DOM : testable tel quel dans Node.
//  - une porte NON faite de deux canons de Gosper et d'un mangeur ;
//  - une machine à deux compteurs (machine de Minsky) ;
//  - le paramètre λ de Langton d'une règle B/S.
// ============================================================

import { creerMonde, avancer, placer, lire, ecrire } from './moteur.js'
import { motif } from './motifs.js'

/* ---------- Porte NON ---------- */

// Le canon de Gosper tire vers le sud-est ; son reflet tire vers le sud-ouest.
const CANON = motif('gosper').cellules
const REFLET = CANON.map(([x, y, s]) => [35 - x, y, s])

// Positions trouvées par une recherche systématique, sur ce moteur : les deux flots
// se croisent à angle droit, et deux planeurs qui se rencontrent s'annihilent sans débris.
// Vérifié sur près de 200 créneaux tirés au hasard : la sortie vaut toujours le contraire de l'entrée.
// Tout est décalé de O cases pour que la grille remplisse la vue, marges comprises.
const O = 16
export const PORTE = {
  W: 128,
  H: 96,
  canon: [O + 4, O + 4],       // le flot constant de 1
  entree: [O + 56, O + 4],     // le signal A, posé 4 générations avant le canon
  avance: 4,
  mangeur: [O + 67, O + 53],   // avale les planeurs qui sortent
  sonde: [O + 58, O + 44],     // centre de la case de lecture de la sortie (5 × 5)
  croisement: [O + 47.5, O + 33.5],
  vue: { x0: O + 2, y0: O + 2, x1: O + 95, y1: O + 60 },
}

const PERIODE = 30
const EMISSION = 70 // première génération où un planeur du signal est sorti, seul, sous son canon
const CHAUFFE = 2   // créneaux d'entrée forcés à 0 pendant que le canon se met en route

export function creerPorte() {
  const m = creerMonde({ W: PORTE.W, H: PORTE.H })
  const [ax, ay] = PORTE.entree
  placer(m, REFLET, ax, ay)
  const envoyes = []
  let tau = 0

  // Avance d'une génération. bitDe(k) donne le bit du créneau k de l'entrée.
  // Renvoie { k, entree, sortie } quand la sonde vient de lire un créneau, sinon null.
  function pas(bitDe) {
    if (tau === PORTE.avance) {
      placer(m, CANON, ...PORTE.canon)
      placer(m, motif('mangeur').cellules, ...PORTE.mangeur)
    }
    // Un 0 de l'entrée : on retire le planeur qui vient de sortir du canon du signal
    if (tau >= EMISSION && (tau - EMISSION) % PERIODE === 0) {
      const k = (tau - EMISSION) / PERIODE
      const bit = k < CHAUFFE ? 0 : bitDe(k) ? 1 : 0
      envoyes[k] = bit
      if (!bit) {
        for (let y = ay + 9; y <= ay + 17; y++) {
          for (let x = ax + 1; x <= ax + 17; x++) if (lire(m, x, y)) ecrire(m, x, y, 0)
        }
      }
    }
    avancer(m, 1)
    tau++
    // Lecture de la sortie, une fois par période, au moment où un planeur est en entier dans la sonde
    if (tau % PERIODE === 1) {
      const k = Math.floor((tau - EMISSION - 1) / PERIODE) - 3
      if (k >= CHAUFFE) {
        const [sx, sy] = PORTE.sonde
        let n = 0
        for (let y = sy - 2; y <= sy + 2; y++) for (let x = sx - 2; x <= sx + 2; x++) if (lire(m, x, y)) n++
        return { k, entree: envoyes[k], sortie: n > 0 ? 1 : 0 }
      }
    }
    return null
  }

  return { monde: m, pas }
}

/* ---------- Machine à deux compteurs ---------- */

// Deux instructions seulement : INC r (ajoute 1 au compteur r) et
// DEC r (si r = 0, saute ailleurs ; sinon retire 1). « fin » nomme l'arrêt.
export const PROGRAMMES = {
  doubler: {
    depart: { A: 3, B: 0 },
    code: [
      { op: 'dec', r: 'A', suite: 1, siZero: 'fin' },
      { op: 'inc', r: 'B', suite: 2 },
      { op: 'inc', r: 'B', suite: 0 },
    ],
  },
  parite: {
    depart: { A: 5, B: 0 },
    code: [
      { op: 'dec', r: 'A', suite: 1, siZero: 'pair' },
      { op: 'dec', r: 'A', suite: 0, siZero: 'impair' },
    ],
  },
}

export const etatInitial = (A, B = 0) => ({ pc: 0, A, B, fin: null, dernier: null, pas: 0 })

// Une instruction ; renvoie le nouvel état (l'ancien n'est pas modifié)
export function executer(etat, programme) {
  if (etat.fin) return etat
  const i = programme.code[etat.pc]
  const e = { ...etat, pas: etat.pas + 1 }
  if (i.op === 'inc') {
    e[i.r]++
    e.pc = i.suite
    e.dernier = { pc: etat.pc, op: 'inc', r: i.r }
  } else if (etat[i.r] === 0) {
    e.fin = i.siZero
    e.dernier = { pc: etat.pc, op: 'zero', r: i.r }
  } else {
    e[i.r]--
    e.pc = i.suite
    e.dernier = { pc: etat.pc, op: 'dec', r: i.r }
  }
  return e
}

/* ---------- Paramètre λ de Langton ---------- */

// Nombre de façons de choisir k voisines vivantes parmi 8
const CHOIX = [1, 8, 28, 56, 70, 56, 28, 8, 1]

// Fraction des 2^9 voisinages possibles (case + 8 voisines) qui donnent une case vivante
export function lambda(regle) {
  let n = 0
  for (let k = 0; k <= 8; k++) n += (regle.naissance[k] + regle.survie[k]) * CHOIX[k]
  return { n, d: 512, valeur: n / 512 }
}