// ============================================================
//  ÉPICYCLES DE FOURIER : les scénarios de l'explorateur
//  Un scénario = une forme, un nombre de cercles, un ordre (par
//  fréquence ou par taille), un lissage, un paramétrage (le temps de la
//  formule, ou une vitesse constante le long du tracé).
// ============================================================

export const REGLAGES = { M: 40, ordre: 'amplitude', lissage: 'aucun', param: 'vitesse', fermee: true }

export const SCENARIOS = [
  { id: 'dessin', forme: 'dessin', r: { M: 60, ordre: 'amplitude' } },
  { id: 'cercle', forme: 'cercle', r: { M: 1, param: 'formule', ordre: 'frequence' } },
  { id: 'ellipse', forme: 'ellipse', r: { M: 2, param: 'formule', ordre: 'frequence' } },
  { id: 'trefle', forme: 'trefle', r: { M: 2, param: 'formule' } },
  { id: 'spirographe', forme: 'spirographe', r: { M: 2, param: 'formule' } },
  { id: 'mars', forme: 'mars', r: { M: 2, param: 'formule' } },
  { id: 'coeur', forme: 'coeur', r: { M: 8, param: 'formule' } },
  { id: 'infini', forme: 'infini', r: { M: 6, param: 'formule', ordre: 'frequence' } },
  { id: 'poisson', forme: 'poisson', r: { M: 4, param: 'formule' } },
  { id: 'carre', forme: 'carre', r: { M: 10, ordre: 'frequence' } },
  { id: 'etoile', forme: 'etoile', r: { M: 12 } },
  { id: 'avion', forme: 'avion', r: { M: 30 } },
  { id: 'koch', forme: 'koch', r: { M: 80 } },
  { id: 'spirale', forme: 'spirale', r: { M: 60, ordre: 'frequence', fermee: false } },
]

export const scenario = (id) => SCENARIOS.find((s) => s.id === id) ?? SCENARIOS[0]
