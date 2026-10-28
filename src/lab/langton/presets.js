// ============================================================
//  RÈGLES PRÊTES À L'EMPLOI
//  Lettres : comportements décrits sur la page Wikipédia « Langton's ant »
//  Turmites : collection de Golly, notation d'Ed Pegg Jr
// ============================================================

export const PRESETS_LETTRES = [
  { id: 'RL', lettres: 'RL' },
  { id: 'RLR', lettres: 'RLR' },
  { id: 'LLRR', lettres: 'LLRR' },
  { id: 'LRRRRRLLR', lettres: 'LRRRRRLLR' },
  { id: 'LLRRRLRLRLLR', lettres: 'LLRRRLRLRLLR' },
  { id: 'RRLLLRLLLRRR', lettres: 'RRLLLRLLLRRR' },
]

// Triplets (couleur à écrire, virage, état suivant) pour l'état 0 couleur 0,
// état 0 couleur 1, état 1 couleur 0, état 1 couleur 1
export const PRESETS_TURMITES = [
  { id: 'fibonacci', code: '181181121010' },
  { id: 'corde', code: '111180121010' },
  { id: 'art', code: '180121020081' },
  { id: 'vers', code: '121181121020' },
  { id: 'spirale', code: '021080181020' },
]
