// ============================================================
//  FRACTALES : les calculs sur le processeur
//  Orbites, petites images des figures et de la page Projets,
//  période d'un cycle, π caché, bifurcations, précision simple
//  imitée. L'explorateur, lui, calcule sur la carte graphique.
//  Aucune dépendance au DOM : testable tel quel dans Node.
// ============================================================

import { versComplexe, pasDe, echantillonner, interieur, evaluer, racines, POLYNOMES, lireSuite } from './formules.js'

const R2 = 1e6 // rayon d'évasion² : grand, pour une coloration lissée sans marches

/* ---------- Une itération ---------- */

// z → f(z) + c pour les fractales d'évasion (formule : 0 Mandelbrot, 1 Burning Ship, 2 Tricorn, 3 Multibrot)
export function pas(formule, zr, zi, cr, ci, degre = 2) {
  if (formule === 1) { zr = Math.abs(zr); zi = Math.abs(zi) }
  if (formule === 3) {
    const r = Math.hypot(zr, zi)
    if (r === 0) return [cr, ci]
    const t = Math.atan2(zi, zr) * degre
    const rd = r ** degre
    return [rd * Math.cos(t) + cr, rd * Math.sin(t) + ci]
  }
  const nr = zr * zr - zi * zi + cr
  const ni = (formule === 2 ? -2 : 2) * zr * zi + ci
  return [nr, ni]
}

// Points de la cardioïde principale et du disque de période 2 : on sait qu'ils ne s'échappent pas
export function dansLeCoeur(cr, ci) {
  const q = (cr - 0.25) ** 2 + ci * ci
  if (q * (q + (cr - 0.25)) <= 0.25 * ci * ci) return true
  return (cr + 1) ** 2 + ci * ci <= 1 / 16
}

/**
 * Orbite d'un point : la liste des z_n, jusqu'à l'évasion ou maxIter.
 * Mandelbrot et cousines : z₀ = 0 et c le point ; Julia : z₀ le point et c fixé.
 * @returns { points: [[re, im]], echappe: n | null }
 */
export function orbite({ formule = 0, degre = 2, julia = null, re, im, maxIter = 500, rayon = 2 }) {
  let [zr, zi] = julia ? [re, im] : [0, 0]
  const [cr, ci] = julia ?? [re, im]
  const points = [[zr, zi]]
  for (let n = 1; n <= maxIter; n++) {
    ;[zr, zi] = pas(formule, zr, zi, cr, ci, degre)
    points.push([zr, zi])
    if (zr * zr + zi * zi > rayon * rayon) return { points, echappe: n }
  }
  return { points, echappe: null }
}

// Période du cycle qui attire l'orbite de 0 (Mandelbrot), ou null si elle s'échappe ou n'en trouve pas
export function periode(cr, ci, { maxIter = 4000, maxPeriode = 64 } = {}) {
  let zr = 0
  let zi = 0
  for (let n = 0; n < maxIter; n++) {
    ;[zr, zi] = [zr * zr - zi * zi + cr, 2 * zr * zi + ci]
    if (zr * zr + zi * zi > 4) return null
  }
  const r0 = zr
  const i0 = zi
  for (let p = 1; p <= maxPeriode; p++) {
    ;[zr, zi] = [zr * zr - zi * zi + cr, 2 * zr * zi + ci]
    if (Math.hypot(zr - r0, zi - i0) < 1e-9) return p
  }
  return null
}

/* ---------- Petites images (figures, page Projets) ---------- */

/**
 * Une image en couleurs, calculée point par point.
 * @param p { id, julia: [cr, ci] | null, degre, polynome, suite, x, y, zoom, iter, palette, densite, lisse, largeur, hauteur }
 * @returns Uint8ClampedArray RGBA, ligne du haut d'abord
 */
export function rendreCPU(p) {
  const { id = 'mandelbrot', largeur: W, hauteur: H, x, y, zoom, palette = 'ultra', densite = 1 } = p
  const iter = p.iter ?? 300
  const pal = echantillonner(palette)
  const fond = interieur(palette)
  const px = new Uint8ClampedArray(W * H * 4)
  const h = pasDe(zoom, W, H)
  const formule = { mandelbrot: 0, burning: 1, tricorn: 2, multibrot: 3 }[id] ?? 0
  const coef = id === 'newton' ? POLYNOMES[p.polynome ?? 'z3'] : null
  const rac = coef ? racines(coef) : null
  const suite = id === 'lyapunov' ? lireSuite(p.suite ?? 'AB') : null

  const couleur = (i, t) => {
    const k = (((Math.floor(t * 256) % 256) + 256) % 256) * 4
    px[i] = pal[k]; px[i + 1] = pal[k + 1]; px[i + 2] = pal[k + 2]; px[i + 3] = 255
  }
  const noir = (i) => { px[i] = fond[0]; px[i + 1] = fond[1]; px[i + 2] = fond[2]; px[i + 3] = 255 }

  for (let j = 0; j < H; j++) {
    for (let k = 0; k < W; k++) {
      const i = (j * W + k) * 4
      const [re, im] = versComplexe(id, x + (k + 0.5 - W / 2) * h, y + (H / 2 - j - 0.5) * h)

      if (coef) {
        let z = [re, im]
        let n = 0
        let racine = -1
        for (; n < iter && racine < 0; n++) {
          const { f, d } = evaluer(coef, z)
          const den = d[0] * d[0] + d[1] * d[1]
          if (den === 0) break
          z = [z[0] - (f[0] * d[0] + f[1] * d[1]) / den, z[1] - (f[1] * d[0] - f[0] * d[1]) / den]
          racine = rac.findIndex((r) => (z[0] - r[0]) ** 2 + (z[1] - r[1]) ** 2 < 1e-6)
        }
        if (racine < 0) { noir(i); continue }
        const kk = Math.floor((racine / rac.length) * 256) * 4
        const lum = 0.35 + 0.65 * Math.exp(-n * 0.08 * densite)
        px[i] = pal[kk] * lum; px[i + 1] = pal[kk + 1] * lum; px[i + 2] = pal[kk + 2] * lum; px[i + 3] = 255
        continue
      }

      if (suite) {
        let v = 0.5
        let somme = 0
        for (let n = 0; n < 50 + iter; n++) {
          const r = suite[n % suite.length] ? im : re
          if (n >= 50) somme += Math.log(Math.abs(r * (1 - 2 * v)) + 1e-12)
          v = r * v * (1 - v)
        }
        const l = somme / iter
        if (l < 0) couleur(i, 0.5 + Math.min(0.48, -l * 0.35 * densite))
        else noir(i)
        continue
      }

      const julia = p.julia
      if (!julia && formule === 0 && dansLeCoeur(re, im)) { noir(i); continue }
      let [zr, zi] = julia ? [re, im] : [0, 0]
      const [cr, ci] = julia ?? [re, im]
      let n = 0
      for (; n < iter; n++) {
        ;[zr, zi] = pas(formule, zr, zi, cr, ci, p.degre ?? 2)
        if (zr * zr + zi * zi > R2) break
      }
      if (n >= iter) { noir(i); continue }
      // lisse : false → le nombre d'étapes brut, en bandes
      const nu = p.lisse === false ? n : n + 1 - Math.log(Math.log(Math.hypot(zr, zi))) / Math.log(formule === 3 ? p.degre ?? 2 : 2)
      couleur(i, (nu * densite) / 32)
    }
  }
  return px
}

/* ---------- Buddhabrot (petite version, pour les figures) ---------- */

// Densité des trajets des points qui s'échappent ; renvoie une image RGBA
export function buddhaCPU({ largeur: W, hauteur: H, x = 0, y = 0.45, zoom = 1, echantillons = 200000, maxIter = 300, minIter = 10, graine = 1 }) {
  const h = pasDe(zoom, W, H)
  const hist = new Float32Array(W * H)
  let a = graine >>> 0
  const alea = () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
  const orb = new Float64Array(2 * (maxIter + 1))
  for (let s = 0; s < echantillons; s++) {
    const cr = alea() * 4 - 2
    const ci = alea() * 4 - 2
    if (dansLeCoeur(cr, ci)) continue
    let zr = 0
    let zi = 0
    let n = 0
    for (; n < maxIter; n++) {
      ;[zr, zi] = [zr * zr - zi * zi + cr, 2 * zr * zi + ci]
      orb[2 * n] = zr
      orb[2 * n + 1] = zi
      if (zr * zr + zi * zi > 4) break
    }
    // les trajets trop courts ne dessinent qu'un voile uniforme : on les ignore
    if (n >= maxIter || n < minIter) continue
    for (let k = 0; k < n; k++) {
      // plan du bouddha : x = Im, y = −Re ; on compte aussi le reflet (symétrie de conjugaison)
      for (const s2 of [1, -1]) {
        const px = Math.floor((s2 * orb[2 * k + 1] - x) / h + W / 2)
        const py = Math.floor(H / 2 - (-orb[2 * k] - y) / h)
        if (px >= 0 && px < W && py >= 0 && py < H) hist[py * W + px]++
      }
    }
  }
  let max = 1
  for (const v of hist) if (v > max) max = v
  const pal = echantillonner('glace')
  const out = new Uint8ClampedArray(W * H * 4)
  for (let i = 0; i < W * H; i++) {
    const v = Math.sqrt(Math.log1p(hist[i]) / Math.log1p(max))
    const k = Math.min(255, Math.floor(v * 0.7 * 255)) * 4
    out[4 * i] = pal[k]; out[4 * i + 1] = pal[k + 1]; out[4 * i + 2] = pal[k + 2]; out[4 * i + 3] = 255
  }
  return out
}

/* ---------- π caché dans l'ensemble de Mandelbrot ---------- */

// Nombre d'itérations avant que |z| dépasse 2, pour un point c donné (sans limite pratique)
export function iterationsAvantEvasion(cr, ci, limite = 1e9) {
  let zr = 0
  let zi = 0
  for (let n = 1; n <= limite; n++) {
    const t = zr * zr - zi * zi + cr
    zi = 2 * zr * zi + ci
    zr = t
    if (zr * zr + zi * zi > 4) return n
  }
  return null
}

/* ---------- La route vers le chaos sur l'axe réel ---------- */

// Valeurs prises par z_n (n grand) pour c réel : le diagramme de bifurcation
export function attracteur(c, { avant = 600, garder = 120 } = {}) {
  let z = 0
  for (let n = 0; n < avant; n++) z = z * z + c
  const v = []
  for (let n = 0; n < garder; n++) {
    z = z * z + c
    if (!Number.isFinite(z) || Math.abs(z) > 2) return []
    v.push(z)
  }
  return v
}

// Centres des composantes de période 2^k sur l'axe réel (c tel que 0 revienne en 0 après 2^k pas),
// par la méthode de Newton. Leurs écarts successifs tendent vers la constante de Feigenbaum.
export function centresDoublement(kMax = 10) {
  const c = [0, -1]
  for (let k = 2; k <= kMax; k++) {
    const p = 2 ** k
    // départ : prolonger la suite géométrique des écarts
    let x = c[k - 1] + (c[k - 1] - c[k - 2]) / 4.669
    for (let it = 0; it < 100; it++) {
      let z = 0
      let dz = 0
      for (let n = 0; n < p; n++) {
        dz = 2 * z * dz + 1
        z = z * z + x
      }
      const dx = z / dz
      x -= dx
      if (Math.abs(dx) < 1e-16) break
    }
    c.push(x)
  }
  return c
}

/* ---------- Précision simple imitée (float32) ---------- */

const f = Math.fround

// La même image calculée avec des nombres de 32 bits, comme une carte graphique sans astuce :
// au-delà d'un certain zoom, des pixels voisins reçoivent exactement le même c.
export function rendreFloat32({ largeur: W, hauteur: H, x, y, zoom, iter = 400, palette = 'ultra', simple = true }) {
  const pal = echantillonner(palette)
  const fond = interieur(palette)
  const px = new Uint8ClampedArray(W * H * 4)
  const h = pasDe(zoom, W, H)
  const r = simple ? f : (v) => v
  const cx = r(x)
  const cy = r(y)
  for (let j = 0; j < H; j++) {
    for (let k = 0; k < W; k++) {
      const i = (j * W + k) * 4
      const cr = r(cx + r((k + 0.5 - W / 2) * h))
      const ci = r(cy + r((H / 2 - j - 0.5) * h))
      let zr = 0
      let zi = 0
      let n = 0
      for (; n < iter; n++) {
        const t = r(r(r(zr * zr) - r(zi * zi)) + cr)
        zi = r(r(2 * r(zr * zi)) + ci)
        zr = t
        if (zr * zr + zi * zi > 1e6) break
      }
      if (n >= iter) { px[i] = fond[0]; px[i + 1] = fond[1]; px[i + 2] = fond[2]; px[i + 3] = 255; continue }
      const nu = n + 1 - Math.log2(Math.log(Math.hypot(zr, zi)))
      const kk = (((Math.floor((nu / 32) * 256) % 256) + 256) % 256) * 4
      px[i] = pal[kk]; px[i + 1] = pal[kk + 1]; px[i + 2] = pal[kk + 2]; px[i + 3] = 255
    }
  }
  return px
}
