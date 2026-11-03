import { lireRegle } from './moteur.js'

// Règles proposées dans les réglages (noms et descriptions dans textes.js).
// Notations vérifiées sur LifeWiki et Wikipédia (« Life-like cellular automaton »).
export const REGLES = [
  { id: 'life', texte: 'B3/S23' },
  { id: 'highlife', texte: 'B36/S23' },
  { id: 'daynight', texte: 'B3678/S34678' },
  { id: 'seeds', texte: 'B2/S' },
  { id: 'sansmort', texte: 'B3/S012345678' },
  { id: 'labyrinthe', texte: 'B3/S12345' },
  { id: 'replicateur', texte: 'B1357/S1357' },
  { id: 'brain', texte: 'B2/S/C3' },
  { id: 'starwars', texte: 'B2/S345/C4' },
].map((r) => ({ ...r, regle: lireRegle(r.texte) }))

export const LIFE = REGLES[0].regle
export const reglePreset = (texte) => REGLES.find((r) => r.regle.texte === texte)?.id ?? ''
