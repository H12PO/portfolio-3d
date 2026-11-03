import { boite } from './moteur.js'

// ============================================================
//  DÉTECTION DES PÉRIODES (l'analyse automatique) : que devient le motif ?
//  (Fichier nommé « periodes.js » et pas « analyse.js » : les bloqueurs de
//  publicité bloquent les fichiers dont le nom évoque l'analyse d'audience.)
//  À chaque génération, on calcule une empreinte du motif recadré
//  sur sa boîte englobante. Si la même empreinte revient p générations
//  plus tard :
//    - au même endroit, p = 1 → nature morte (stable)
//    - au même endroit, p > 1 → oscillateur de période p
//    - décalé de (dx, dy)     → vaisseau de période p
//  Seulement pour les motifs assez petits (boîte ≤ 40 000 cases),
//  sinon l'analyse coûterait plus cher que la simulation.
// ============================================================

const AIRE_MAX = 40000
const MEMOIRE = 4096 // générations gardées en mémoire (périodes jusqu'à 4 096)

// Deux hachages 32 bits indépendants : une collision simultanée est négligeable
function empreinte(m, b) {
  const { W, etat } = m
  let h1 = 0x811c9dc5
  let h2 = 0x9747b28c
  for (let y = b.y0; y <= b.y1; y++) {
    for (let i = y * W + b.x0, f = y * W + b.x1; i <= f; i++) {
      const v = etat[i]
      h1 = Math.imul(h1 ^ v, 0x01000193)
      h2 = Math.imul(h2 ^ (v + 0x9e37), 0x5bd1e995)
      h2 ^= h2 >>> 13
    }
  }
  return `${b.x1 - b.x0}x${b.y1 - b.y0}:${h1 >>> 0}:${h2 >>> 0}`
}

const pgcd = (a, b) => (b ? pgcd(b, a % b) : a)

/**
 * Vitesse d'un vaisseau, à la manière des amateurs du jeu de la vie : c/4, c/2, 2c/5…
 * c (la « vitesse de la lumière ») = une case par génération.
 */
export function vitesse(dx, dy, periode) {
  const k = Math.max(Math.abs(dx), Math.abs(dy))
  const g = pgcd(k, periode)
  const num = k / g
  const den = periode / g
  const texte = `${num === 1 ? '' : num}c${den === 1 ? '' : `/${den}`}`
  const direction = dx === 0 || dy === 0 ? 'orthogonale' : Math.abs(dx) === Math.abs(dy) ? 'diagonale' : 'oblique'
  return { texte, direction }
}

export function creerAnalyse() {
  let vues = new Map() // empreinte → { gen, x0, y0 }
  let resultat = null

  return {
    // À appeler après chaque génération (et après un changement de la grille)
    suivre(m) {
      if (m.population === 0) {
        resultat = { type: 'vide', gen: m.gen }
        return resultat
      }
      const b = boite(m)
      if ((b.x1 - b.x0 + 1) * (b.y1 - b.y0 + 1) > AIRE_MAX) {
        resultat = { type: 'grand' }
        vues.clear()
        return resultat
      }
      const cle = empreinte(m, b)
      const avant = vues.get(cle)
      if (avant && avant.gen < m.gen) {
        const periode = m.gen - avant.gen
        const dx = b.x0 - avant.x0
        const dy = b.y0 - avant.y0
        if (!dx && !dy) resultat = periode === 1 ? { type: 'stable', depuis: avant.gen } : { type: 'oscillateur', periode, depuis: avant.gen }
        else resultat = { type: 'vaisseau', periode, dx, dy, ...vitesse(dx, dy, periode), depuis: avant.gen }
      } else if (!avant) {
        resultat = null // état jamais vu : le motif évolue encore
      }
      vues.set(cle, { gen: m.gen, x0: b.x0, y0: b.y0 })
      if (vues.size > MEMOIRE) vues = new Map([...vues].slice(-MEMOIRE / 2))
      return resultat
    },
    oublier() {
      vues = new Map()
      resultat = null
    },
    get resultat() { return resultat },
  }
}