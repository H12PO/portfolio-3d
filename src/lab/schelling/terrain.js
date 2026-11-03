import { generateur } from '../commun/aleatoire.js'

// ============================================================
//  SCHELLING : le terrain
//  « grille » : le damier classique, refermé sur lui-même (tore),
//               partout habitable, sans lieu plus attirant qu'un autre.
//  « ville »  : une ville inventée, bornée : un centre, une rivière,
//               des parcs. L'attrait d'une case vient de sa distance
//               au centre, aux parcs et à l'eau.
// ============================================================

export const SOL = { HABITABLE: 0, EAU: 1, PARC: 2, MUR: 3 }

/**
 * @returns {{ sol: Uint8Array, attrait: Float32Array, tore: boolean }}
 *   attrait : entre 0 et 1, l'attrait « naturel » de chaque case
 */
export function genererTerrain(type, W, H, graine = 1) {
  const N = W * H
  const sol = new Uint8Array(N)
  const attrait = new Float32Array(N)
  if (type !== 'ville') return { sol, attrait, tore: true }

  const alea = generateur(graine * 7919 + 13)
  const idx = (x, y) => y * W + x

  // La rivière : une bande qui serpente du haut en bas, à droite du centre
  const phase = alea() * Math.PI * 2
  const riviere = (y) => W * (0.66 + 0.1 * Math.sin((2 * Math.PI * y) / H * 0.9 + phase))
  const demi = Math.max(1.2, W / 70)
  for (let y = 0; y < H; y++) {
    const xr = riviere(y)
    for (let x = 0; x < W; x++) if (Math.abs(x + 0.5 - xr) < demi) sol[idx(x, y)] = SOL.EAU
  }

  // Les parcs : quelques taches aux bords irréguliers, loin de l'eau
  const parcs = []
  const nbParcs = Math.max(3, Math.round(W / 22))
  for (let essai = 0; parcs.length < nbParcs && essai < 200; essai++) {
    const cx = 4 + alea() * (W - 8)
    const cy = 4 + alea() * (H - 8)
    const r = Math.max(2, W / 40) * (0.8 + alea() * 0.9)
    if (Math.abs(cx - riviere(cy)) < r + 3) continue
    if (parcs.some((p) => Math.hypot(p.x - cx, p.y - cy) < p.r + r + 6)) continue
    parcs.push({ x: cx, y: cy, r, bosse: alea() * 6 })
  }
  for (const p of parcs) {
    for (let y = Math.floor(p.y - p.r - 2); y <= p.y + p.r + 2; y++) {
      for (let x = Math.floor(p.x - p.r - 2); x <= p.x + p.r + 2; x++) {
        if (x < 0 || y < 0 || x >= W || y >= H) continue
        const a = Math.atan2(y - p.y, x - p.x)
        const bord = p.r * (1 + 0.18 * Math.sin(3 * a + p.bosse))
        if (Math.hypot(x + 0.5 - p.x, y + 0.5 - p.y) < bord && sol[idx(x, y)] === SOL.HABITABLE) sol[idx(x, y)] = SOL.PARC
      }
    }
  }

  // L'attrait : le centre d'abord, puis la proximité d'un parc ou de l'eau
  const cx = W * 0.42
  const cy = H * 0.48
  const sigma = W * 0.2
  const dParc = distances(sol, W, H, SOL.PARC)
  const dEau = distances(sol, W, H, SOL.EAU)
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const i = idx(x, y)
      const d2 = (x - cx) ** 2 + (y - cy) ** 2
      const a = 0.62 * Math.exp(-d2 / (2 * sigma * sigma)) + 0.3 * Math.exp(-dParc[i] / 3) + 0.18 * Math.exp(-dEau[i] / 3)
      attrait[i] = Math.min(1, a)
    }
  }
  return { sol, attrait, tore: false }
}

// Distance (en cases, métrique « 8 voisins ») de chaque case à la plus proche case de type t
function distances(sol, W, H, t) {
  const N = W * H
  const d = new Float32Array(N).fill(Infinity)
  const file = new Int32Array(N)
  let debut = 0
  let fin = 0
  for (let i = 0; i < N; i++) if (sol[i] === t) { d[i] = 0; file[fin++] = i }
  while (debut < fin) {
    const i = file[debut++]
    const x = i % W
    const y = (i - x) / W
    for (let dy = -1; dy <= 1; dy++) {
      for (let dx = -1; dx <= 1; dx++) {
        const X = x + dx
        const Y = y + dy
        if (X < 0 || Y < 0 || X >= W || Y >= H) continue
        const j = Y * W + X
        if (d[j] > d[i] + 1) { d[j] = d[i] + 1; file[fin++] = j }
      }
    }
  }
  return d
}
