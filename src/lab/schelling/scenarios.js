// ============================================================
//  SCHELLING : les scénarios prêts à jouer
//  Chaque scénario règle une ville (a), et parfois une seconde (b)
//  pour la comparaison côte à côte : même départ, une seule
//  différence. Les chiffres en commentaire viennent du moteur
//  (grille 100 × 100, 150 tours, tests en Node).
//  Les textes (titre, ce qu'il faut regarder) sont dans textes.js.
// ============================================================

const sans = [0, 0, 0, 0, 0]
const tous = (x) => [x, x, x, x, x]

export const SCENARIOS = [
  // Le modèle de 1971 : un tiers de voisins semblables suffit (semblables : 50 % → 75 %)
  { id: 'damier', a: { tolerance: tous(0.34) } },
  // Deux tolérances proches, deux villes très différentes (57 % contre 74 % de semblables)
  { id: 'seuil', a: { tolerance: tous(0.25) }, b: { tolerance: tous(0.3) } },
  // Tout le monde veut exactement moitié-moitié… et la ville se sépare (88 % de semblables)
  { id: 'mixite', a: { tolerance: tous(0.5), mixite: tous(0.5), bruit: 0.1 } },
  // Un peu de hasard fait grossir les quartiers ; beaucoup les dissout (97 % contre 72 %)
  { id: 'bruit', a: { tolerance: tous(0.5), bruit: 0.05 }, b: { tolerance: tous(0.5), bruit: 1 } },
  // Aucune préférence de groupe : seulement des loyers et des revenus inégaux (66 % contre 50 %)
  {
    id: 'revenus', vue: 'groupes',
    a: { terrain: 'ville', tolerance: sans, loyers: 1, attrait: 0.5, ecartRevenus: 1 },
    b: { terrain: 'ville', tolerance: sans, loyers: 1, attrait: 0.5, ecartRevenus: 0 },
  },
  // Un centre attirant, des loyers qui montent, des départs forcés
  { id: 'gentrification', vue: 'loyers', a: { terrain: 'ville', tolerance: sans, loyers: 1, attrait: 0.9, ecartRevenus: 0.5, renouvellement: 0.02 } },
  // 20 % de logements sociaux, dispersés ou en grands ensembles
  {
    id: 'social', vue: 'revenus',
    a: { terrain: 'ville', tolerance: sans, loyers: 1, attrait: 0.5, ecartRevenus: 1, social: 0.2 },
    b: { terrain: 'ville', tolerance: sans, loyers: 1, attrait: 0.5, ecartRevenus: 1, social: 0.2, socialRegroupe: true },
  },
  // Personne n'a de préférence ; la moitié des propriétaires refuse un groupe (85 % contre 50 %)
  {
    id: 'discrimination',
    a: { tolerance: sans, renouvellement: 0.05, discrimination: 0.5 },
    b: { tolerance: sans, renouvellement: 0.05, discrimination: 0 },
  },
  // Des amis surtout du même groupe font grossir les quartiers (94 % contre 56 %)
  {
    id: 'amis',
    a: { tolerance: tous(0.2), amis: 1, homophilie: 0.9 },
    b: { tolerance: tous(0.2), amis: 0, homophilie: 0.9 },
  },
  // Avec du bruit, l'attachement au quartier fige la ville (95 % contre 78 %)
  {
    id: 'attachement',
    a: { tolerance: tous(0.34), bruit: 0.05, attachement: 0 },
    b: { tolerance: tous(0.34), bruit: 0.05, attachement: 1 },
  },
  // Les nouveaux arrivants sont surtout du second groupe : les quartiers basculent un à un
  { id: 'arrivees', a: { tolerance: tous(0.34), renouvellement: 0.03, arrivees: [1, 3, 1, 1, 1] } },
  // Trois grands groupes et une petite minorité : au hasard, 10 % de voisins semblables pour elle ; à la fin, 62 %
  { id: 'quatre', a: { groupes: 4, parts: [3, 3, 3, 1, 1], tolerance: tous(0.3) } },
]

export const scenario = (id) => SCENARIOS.find((s) => s.id === id) ?? SCENARIOS[0]
