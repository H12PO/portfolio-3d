// ============================================================
//  ÉPICYCLES DE FOURIER : les formes célèbres
//  Une forme est une formule t ∈ [0, 1) → [x, y] (son « temps » à elle),
//  ou une ligne brisée de points. Repère de l'écran : y vers le bas.
//  Toutes tiennent à peu près dans le carré [−1, 1]².
// ============================================================

const TAU = 2 * Math.PI
const cis = (a) => [Math.cos(a), Math.sin(a)]

// Un polygone régulier de n sommets, ou une étoile (rayons alternés R et r)
function polygone(n, rayons = [1], depart = -Math.PI / 2) {
  const m = n * rayons.length
  return Array.from({ length: m }, (_, i) => {
    const r = rayons[i % rayons.length]
    const [c, s] = cis(depart + (i / m) * TAU)
    return [r * c, r * s]
  })
}

// Le flocon de Koch : chaque côté est remplacé par quatre côtés trois fois plus courts
function koch(profondeur) {
  let pts = polygone(3, [1], -Math.PI / 2).reverse()
  for (let p = 0; p < profondeur; p++) {
    const neuf = []
    for (let i = 0; i < pts.length; i++) {
      const [ax, ay] = pts[i], [bx, by] = pts[(i + 1) % pts.length]
      const dx = (bx - ax) / 3, dy = (by - ay) / 3
      const p1 = [ax + dx, ay + dy], p3 = [ax + 2 * dx, ay + 2 * dy]
      // le sommet de la bosse : le tiers du milieu tourné de 60° vers l'extérieur
      const c = Math.cos(-Math.PI / 3), s = Math.sin(-Math.PI / 3)
      const p2 = [p1[0] + dx * c - dy * s, p1[1] + dx * s + dy * c]
      neuf.push([ax, ay], p1, p2, p3)
    }
    pts = neuf
  }
  return pts
}

// Un avion de ligne vu de dessus (générique) : le demi-contour, puis son miroir
function avion() {
  const demi = [
    [0, -1], [0.05, -0.93], [0.075, -0.8], [0.08, -0.2],
    [0.86, 0.12], [0.88, 0.2], [0.08, 0.1],
    [0.075, 0.62], [0.33, 0.8], [0.34, 0.87], [0.06, 0.84], [0.03, 0.97],
  ]
  return [...demi, ...demi.slice(1, -1).reverse().map(([x, y]) => [-x, y]), [-0.03, 0.97]].map(([x, y]) => [x * 1.05, y * 0.98])
}

// Une spirale ouverte : la fin ne rejoint pas le début (le phénomène de Gibbs)
function spirale() {
  const n = 600, tours = 2.5
  return Array.from({ length: n }, (_, i) => {
    const u = i / (n - 1)
    const a = u * tours * TAU
    const r = 0.12 + 0.85 * u
    return [r * Math.cos(a), r * Math.sin(a)]
  })
}

export const FORMES = {
  // une seule fréquence : un cercle
  cercle: { formule: (t) => cis(TAU * t) },
  // deux fréquences opposées (k = 1 et k = −1) : une ellipse
  ellipse: { formule: (t) => [1.1 * Math.cos(TAU * t), 0.55 * Math.sin(TAU * t)] },
  // r = cos 2θ : z = (e^{3iθ} + e^{−iθ}) / 2, deux cercles
  trefle: { formule: (t) => { const a = TAU * t, r = Math.cos(2 * a); return [r * Math.cos(a), r * Math.sin(a)] } },
  // spirographe (hypotrochoïde R = 5, r = 3, d = 5) : z = 2 e^{3·2iπt} + 5 e^{−2·2iπt}, deux cercles
  spirographe: { formule: (t) => { const a = TAU * t; return [(2 * Math.cos(3 * a) + 5 * Math.cos(2 * a)) / 7, (2 * Math.sin(3 * a) - 5 * Math.sin(2 * a)) / 7] } },
  // Mars vue de la Terre : 8 tours de Mars (rayon 1,524 ua) moins 15 tours de la Terre (1 ua)
  mars: { formule: (t) => { const a = TAU * t; return [(1.524 * Math.cos(8 * a) - Math.cos(15 * a)) / 2.6, (1.524 * Math.sin(8 * a) - Math.sin(15 * a)) / 2.6] } },
  // le cœur : x = 16 sin³ t, y = 13 cos t − 5 cos 2t − 2 cos 3t − cos 4t (un polynôme trigonométrique)
  coeur: { formule: (t) => { const a = TAU * t; return [(16 * Math.sin(a) ** 3) / 17, -(13 * Math.cos(a) - 5 * Math.cos(2 * a) - 2 * Math.cos(3 * a) - Math.cos(4 * a)) / 17 + 0.1] } },
  // la lemniscate de Bernoulli (∞) : une courbe analytique
  infini: { formule: (t) => { const a = TAU * t, d = 1 + Math.sin(a) ** 2; return [(1.2 * Math.cos(a)) / d, (1.2 * Math.sin(a) * Math.cos(a)) / d] } },
  // la « courbe du poisson »
  poisson: { formule: (t) => { const a = TAU * t; return [0.85 * (Math.cos(a) - Math.sin(a) ** 2 / Math.SQRT2) + 0.2, 0.85 * Math.cos(a) * Math.sin(a)] } },
  carre: { points: polygone(4, [1.25], -Math.PI / 4) },
  triangle: { points: polygone(3, [1.1], -Math.PI / 2).map(([x, y]) => [x, y + 0.2]) },
  etoile: { points: polygone(5, [1, 0.4]) },
  avion: { points: avion() },
  koch: { points: koch(4).map(([x, y]) => [x * 0.95, y * 0.95 + 0.08]) },
  spirale: { points: spirale(), fermee: false },
}

export const ORDRE_FORMES = ['cercle', 'ellipse', 'trefle', 'spirographe', 'mars', 'coeur', 'infini', 'poisson', 'carre', 'triangle', 'etoile', 'avion', 'koch', 'spirale']
