// ============================================================
//  FRACTALES : les définitions communes
//  Le plan est repéré par (x, y), y vers le haut. Chaque fractale dit
//  comment un point (x, y) devient un nombre complexe (orientation
//  usuelle de ses images), où regarder au départ, et ses lieux célèbres.
//  Aucune dépendance au DOM : testable tel quel dans Node.
// ============================================================

// Étendue visible le long du plus petit côté de l'image, au zoom 1
export const ETENDUE = 3

// Les fractales de l'explorateur. famille : 'evasion' | 'newton' | 'lyapunov'
// (le Buddhabrot n'est montré qu'en image fixe, dans l'onglet Théorie : voir cpu.js)
export const FRACTALES = [
  { id: 'mandelbrot', famille: 'evasion', formule: 0, vue: { x: -0.6, y: 0, zoom: 1 }, julia: { x: 0, y: 0, zoom: 0.95 } },
  { id: 'burning', famille: 'evasion', formule: 1, vue: { x: -0.45, y: 0.5, zoom: 0.7 }, julia: { x: 0, y: 0, zoom: 0.85 } },
  { id: 'tricorn', famille: 'evasion', formule: 2, vue: { x: -0.2, y: 0, zoom: 0.75 }, julia: { x: 0, y: 0, zoom: 0.9 } },
  { id: 'multibrot', famille: 'evasion', formule: 3, vue: { x: 0, y: 0, zoom: 0.9 }, julia: { x: 0, y: 0, zoom: 0.9 } },
  { id: 'newton', famille: 'newton', vue: { x: 0, y: 0, zoom: 0.8 } },
  { id: 'lyapunov', famille: 'lyapunov', vue: { x: 3, y: 3, zoom: 1.5 } },
]

export const fractale = (id) => FRACTALES.find((f) => f.id === id) ?? FRACTALES[0]

// Le point (x, y) du plan → le nombre complexe c (ou z) [re, im]
//  - Burning Ship : axe imaginaire vers le bas, pour que le navire soit à l'endroit ;
//  - Lyapunov : (x, y) = (a, b), les deux taux de la suite logistique.
export function versComplexe(id, x, y) {
  if (id === 'burning') return [x, -y]
  return [x, y]
}
export function versPlan(id, re, im) {
  if (id === 'burning') return [re, -im]
  return [re, im]
}
// Signe de la partie imaginaire dans le shader (seules les fractales d'évasion l'utilisent)
export const sens = (id) => (id === 'burning' ? -1 : 1)

// Nombre d'itérations conseillé : il faut en faire plus à mesure qu'on zoome
export function iterationsAuto(id, zoom) {
  if (id === 'newton') return 60
  if (id === 'lyapunov') return 400
  const z = Math.max(1, zoom)
  return Math.round(Math.min(20000, 200 + 260 * Math.log10(z) + 6 * Math.log10(z) ** 2))
}

// Taille d'un pixel dans le plan
export const pasDe = (zoom, largeur, hauteur) => ETENDUE / (zoom * Math.min(largeur, hauteur))

// Zooms limites : au-delà, les nombres n'ont plus assez de chiffres
export const ZOOM_SIMPLE = 2e3     // précision simple (float32) suffisante jusque-là ; au-delà, perturbations
export const ZOOM_MAX_PROFOND = 1e12 // perturbations : la référence est calculée en 64 bits par JavaScript
export const ZOOM_MAX_SIMPLE = 3e4   // Multibrot, Newton, Lyapunov : 32 bits seulement
export const zoomMax = (id) => (id === 'lyapunov' || id === 'newton' || id === 'multibrot' ? ZOOM_MAX_SIMPLE : ZOOM_MAX_PROFOND)
// La carte graphique calcule-t-elle par perturbations à ce zoom ?
export const profond = (id, zoom) => zoom > ZOOM_SIMPLE && zoomMax(id) === ZOOM_MAX_PROFOND

/* ---------- Perturbations : l'orbite de référence ---------- */

// Le processeur calcule en 64 bits l'orbite d'un seul point, le centre de la vue.
// La carte graphique la lit dans une texture de ORBITE_LARGEUR valeurs par ligne.
export const ORBITE_LARGEUR = 2048

// Une orbite à partir de z0, rangée dans sortie à partir du rang debut ; renvoie sa longueur (au moins 2)
function suiteReference(formule, [x0, y0], [cx, cy], iter, sortie, debut) {
  let x = x0
  let y = y0
  sortie[2 * debut] = x
  sortie[2 * debut + 1] = y
  let n = 1
  for (let i = 0; i < iter; i++) {
    const xy = x * y
    const t = x * x - y * y + cx
    y = (formule === 1 ? 2 * Math.abs(xy) : formule === 2 ? -2 * xy : 2 * xy) + cy
    x = t
    sortie[2 * (debut + n)] = x
    sortie[2 * (debut + n) + 1] = y
    n++
    if (x * x + y * y > 1e6) break
  }
  return n
}

/**
 * Les orbites de référence d'une vue (Mandelbrot, Burning Ship, Tricorn, et leurs Julia).
 * A part du centre (re, im) de la vue ; B part de 0, pour les changements de référence.
 * Pour Mandelbrot, z₀ = 0 : A et B sont la même orbite.
 * @returns { donnees: Float32Array (re, im), lignes, debutA, longA, debutB, longB }
 */
export function orbiteReference({ formule, julia = null, re, im, iter }, tampon = null) {
  const total = julia ? 2 * (iter + 1) : iter + 1
  const lignes = Math.ceil(total / ORBITE_LARGEUR)
  const taille = lignes * ORBITE_LARGEUR * 2
  const donnees = tampon && tampon.length >= taille ? tampon.subarray(0, taille) : new Float32Array(taille)
  if (!julia) {
    const lon = suiteReference(formule, [0, 0], [re, im], iter, donnees, 0)
    return { donnees, lignes, debutA: 0, longA: lon, debutB: 0, longB: lon }
  }
  const longA = suiteReference(formule, [re, im], julia, iter, donnees, 0)
  const longB = suiteReference(formule, [0, 0], julia, iter, donnees, longA)
  return { donnees, lignes, debutA: 0, longA, debutB: longA, longB }
}

/* ---------- Newton ---------- */

const cmul = (a, b) => [a[0] * b[0] - a[1] * b[1], a[0] * b[1] + a[1] * b[0]]
const cdiv = (a, b) => {
  const d = b[0] * b[0] + b[1] * b[1]
  return [(a[0] * b[0] + a[1] * b[1]) / d, (a[1] * b[0] - a[0] * b[1]) / d]
}

// Polynômes proposés, coefficients du degré 0 au plus haut (complexes [re, im])
export const POLYNOMES = {
  z3: [[-1, 0], [0, 0], [0, 0], [1, 0]],            // z³ − 1
  z4: [[-1, 0], [0, 0], [0, 0], [0, 0], [1, 0]],    // z⁴ − 1
  z5: [[-1, 0], [0, 0], [0, 0], [0, 0], [0, 0], [1, 0]], // z⁵ − 1
  cycle: [[2, 0], [-2, 0], [0, 0], [1, 0]],         // z³ − 2z + 2 : Newton peut tourner en rond entre 0 et 1
  z3z: [[0, 0], [-1, 0], [0, 0], [1, 0]],           // z³ − z
}

export function evaluer(coef, z) {
  let f = [0, 0]
  let d = [0, 0]
  for (let k = coef.length - 1; k >= 0; k--) {
    d = [cmul(d, z)[0] + f[0], cmul(d, z)[1] + f[1]]
    f = [cmul(f, z)[0] + coef[k][0], cmul(f, z)[1] + coef[k][1]]
  }
  return { f, d }
}

// Racines par la méthode de Durand-Kerner (toutes à la fois)
export function racines(coef) {
  const n = coef.length - 1
  const a = coef[n]
  const unitaire = coef.map((c) => cdiv(c, a))
  let r = Array.from({ length: n }, (_, k) => {
    const t = (2 * Math.PI * k) / n + 0.4
    return [0.9 * Math.cos(t), 0.9 * Math.sin(t)]
  })
  for (let it = 0; it < 500; it++) {
    r = r.map((ri, i) => {
      const { f } = evaluer(unitaire, ri)
      let den = [1, 0]
      r.forEach((rj, j) => { if (j !== i) den = cmul(den, [ri[0] - rj[0], ri[1] - rj[1]]) })
      const q = cdiv(f, den)
      return [ri[0] - q[0], ri[1] - q[1]]
    })
  }
  return r.map(([x, y]) => [Math.abs(x) < 1e-12 ? 0 : x, Math.abs(y) < 1e-12 ? 0 : y])
}

/* ---------- Lyapunov ---------- */

// « AABAB » → [0, 0, 1, 0, 1] ; null si la suite n'est pas faite de A et de B (1 à 24 lettres)
export function lireSuite(texte) {
  const s = String(texte).trim().toUpperCase()
  if (!/^[AB]{1,24}$/.test(s)) return null
  return [...s].map((l) => (l === 'A' ? 0 : 1))
}

/* ---------- Palettes ---------- */

// Dégradés cycliques : [position, couleur]. intérieur : couleur des points qui ne s'échappent pas.
export const PALETTES = {
  // La palette du shader « Mandelbrot - smooth » d'Inigo Quilez : 0,5 + 0,5 cos(2πt + (2,7 ; 3,2 ; 3,7))
  quilez: { interieur: '#000000', fonction: (t) => [2.7, 3.2, 3.7].map((d) => 0.5 + 0.5 * Math.cos(2 * Math.PI * t + d)) },
  // Une palette en cosinus, à la manière d'Inigo Quilez : 0,5 + 0,5 cos(3 + 2πt + (0 ; 0,6 ; 1))
  douce: { interieur: '#000000', fonction: (t) => [0, 0.6, 1].map((d) => 0.5 + 0.5 * Math.cos(3 + 2 * Math.PI * t + d)) },
  ultra: { interieur: '#000000', arrets: [[0, '#000764'], [0.16, '#206BCB'], [0.42, '#EDFFFF'], [0.6425, '#FFAA00'], [0.8575, '#000200'], [1, '#000764']] },
  jungle: { interieur: '#06100B', arrets: [[0, '#0B1711'], [0.3, '#1E7A50'], [0.5, '#33AD78'], [0.62, '#E8F5EC'], [0.8, '#1E7A50'], [1, '#0B1711']] },
  feu: { interieur: '#000000', arrets: [[0, '#140000'], [0.25, '#8A1C00'], [0.45, '#E2560F'], [0.6, '#FFB43A'], [0.7, '#FFF4C8'], [0.85, '#B8320A'], [1, '#140000']] },
  glace: { interieur: '#02040A', arrets: [[0, '#02040A'], [0.3, '#16345C'], [0.55, '#7FA7CF'], [0.7, '#F1F6FB'], [0.85, '#3B6EA5'], [1, '#02040A']] },
  encre: { interieur: '#1B2340', arrets: [[0, '#FFFFFF'], [0.5, '#1B2340'], [1, '#FFFFFF']] },
  spectre: { interieur: '#000000', arrets: [[0, '#FF0040'], [0.17, '#FF9900'], [0.33, '#E8FF00'], [0.5, '#00E87A'], [0.67, '#00A3FF'], [0.83, '#8A2BFF'], [1, '#FF0040']] },
}

const hex = (h) => [1, 3, 5].map((k) => parseInt(h.slice(k, k + 2), 16))

// 256 couleurs RGBA d'une palette, pour une texture 256 × 1
export function echantillonner(id) {
  const { arrets, fonction } = PALETTES[id] ?? PALETTES.ultra
  const out = new Uint8Array(256 * 4)
  for (let i = 0; i < 256; i++) {
    const t = i / 256
    if (fonction) {
      fonction(t).forEach((v, j) => { out[i * 4 + j] = Math.round(255 * v) })
      out[i * 4 + 3] = 255
      continue
    }
    let k = 0
    while (k < arrets.length - 2 && t > arrets[k + 1][0]) k++
    const [t0, c0] = arrets[k]
    const [t1, c1] = arrets[k + 1]
    const u = (t - t0) / (t1 - t0)
    const a = hex(c0)
    const b = hex(c1)
    for (let j = 0; j < 3; j++) out[i * 4 + j] = Math.round(a[j] + (b[j] - a[j]) * u)
    out[i * 4 + 3] = 255
  }
  return out
}

export const interieur = (id) => hex((PALETTES[id] ?? PALETTES.ultra).interieur)

/* ---------- Lieux célèbres (coordonnées du plan) ---------- */

export const LIEUX = {
  mandelbrot: [
    { id: 'ensemble', x: -0.6, y: 0, zoom: 1 },
    { id: 'hippocampes', x: -0.747, y: 0.11, zoom: 50 },
    { id: 'elephants', x: 0.2865, y: 0.0136, zoom: 140 },
    { id: 'antenne', x: -1.7548776662466927, y: 0, zoom: 90 },
    { id: 'spirale', x: -0.743643887037151, y: 0.13182590420533, zoom: 4.5e4 },
    // Un mini-Mandelbrot de période 124 (centre trouvé par la méthode de Newton) : zoom ×2,5 milliards
    { id: 'mini', x: -0.7436376531584421, y: 0.13180544221135695, zoom: 2.5e9 },
  ],
  julia: [
    { id: 'lapin', c: [-0.1225611668766536, 0.7448617666197442] },
    { id: 'dendrite', c: [0, 1] },
    { id: 'sanmarco', c: [-0.75, 0] },
    { id: 'siegel', c: [-0.3905408702184, -0.5867879073469] },
    { id: 'poussiere', c: [-0.75, 0.12] },
  ],
  burning: [
    { id: 'navire', x: -0.45, y: 0.5, zoom: 0.7 },
    { id: 'armada', x: -1.762, y: 0.028, zoom: 18 },
  ],
  newton: [
    { id: 'z3', polynome: 'z3' },
    { id: 'cycle', polynome: 'cycle' },
  ],
  lyapunov: [
    { id: 'ab', suite: 'AB', x: 3, y: 3, zoom: 1.5 },
    { id: 'b6a6', suite: 'BBBBBBAAAAAA', x: 3.6, y: 2.95, zoom: 3.3 },
  ],
}
