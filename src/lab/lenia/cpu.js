// ============================================================
//  LENIA : un petit Lenia sur le processeur, pour les figures
//  FFT de Cooley-Tukey (radix 2, en place), convolution par la
//  transformée de Fourier, et un monde classique N × N (N = 64).
//  Aucune dépendance au DOM : testable dans Node.
// ============================================================

import { grillesNoyaux, CROISSANCES, preparer } from './modeles.js'

/* ---------- FFT ---------- */

// Transformée en place de (re, im), longueur puissance de 2 ; inverse non normalisée
export function fft(re, im, inverse = false) {
  const n = re.length
  for (let i = 1, j = 0; i < n; i++) {
    let bit = n >> 1
    for (; j & bit; bit >>= 1) j ^= bit
    j ^= bit
    if (i < j) {
      ;[re[i], re[j]] = [re[j], re[i]]
      ;[im[i], im[j]] = [im[j], im[i]]
    }
  }
  for (let taille = 2; taille <= n; taille <<= 1) {
    const angle = ((inverse ? 2 : -2) * Math.PI) / taille
    const wr = Math.cos(angle)
    const wi = Math.sin(angle)
    for (let debut = 0; debut < n; debut += taille) {
      let cr = 1
      let ci = 0
      for (let k = 0; k < taille / 2; k++) {
        const a = debut + k
        const b = a + taille / 2
        const tr = re[b] * cr - im[b] * ci
        const ti = re[b] * ci + im[b] * cr
        re[b] = re[a] - tr
        im[b] = im[a] - ti
        re[a] += tr
        im[a] += ti
        const t = cr * wr - ci * wi
        ci = cr * wi + ci * wr
        cr = t
      }
    }
  }
}

// FFT 2D d'un tableau N × N (lignes puis colonnes)
export function fft2d(re, im, N, inverse = false) {
  const lr = new Float64Array(N)
  const li = new Float64Array(N)
  for (let pass = 0; pass < 2; pass++) {
    for (let a = 0; a < N; a++) {
      for (let b = 0; b < N; b++) {
        const k = pass ? b * N + a : a * N + b
        lr[b] = re[k]
        li[b] = im[k]
      }
      fft(lr, li, inverse)
      for (let b = 0; b < N; b++) {
        const k = pass ? b * N + a : a * N + b
        re[k] = lr[b]
        im[k] = li[b]
      }
    }
  }
}

/* ---------- Convolution directe (pour le banc d'essai) ---------- */

export function convolutionDirecte(A, K, N, R) {
  const U = new Float64Array(N * N)
  for (let y = 0; y < N; y++) {
    for (let x = 0; x < N; x++) {
      let s = 0
      for (let dy = -R; dy <= R; dy++) {
        const yy = (y + dy + N) % N
        const ky = (dy + N) % N
        for (let dx = -R; dx <= R; dx++) s += A[yy * N + ((x + dx + N) % N)] * K[ky * N + ((dx + N) % N)]
      }
      U[y * N + x] = s
    }
  }
  return U
}

/* ---------- Un monde Lenia classique ---------- */

export function creerMiniLenia(N, regle) {
  const K = grillesNoyaux(regle, N)[0]
  const kr = Float64Array.from(K)
  const ki = new Float64Array(N * N)
  fft2d(kr, ki, N)
  const k = regle.noyaux[0]
  const g = CROISSANCES[(regle.gn ?? 1) - 1]
  const m = {
    N,
    A: new Float64Array(N * N),
    U: new Float64Array(N * N),
    G: new Float64Array(N * N),
    t: 0,
    poser(cellules, angle = 0, cx = N / 2, cy = N / 2) {
      const p = preparer(cellules, angle)
      for (let y = 0; y < p.h; y++) {
        for (let x = 0; x < p.w; x++) {
          const v = p.canaux[0][y * p.w + x]
          if (v <= 0) continue
          const X = (Math.round(cx - p.w / 2) + x + N) % N
          const Y = (Math.round(cy - p.h / 2) + y + N) % N
          m.A[Y * N + X] = Math.max(m.A[Y * N + X], v)
        }
      }
    },
    pas() {
      const re = Float64Array.from(m.A)
      const im = new Float64Array(N * N)
      fft2d(re, im, N)
      for (let i = 0; i < N * N; i++) {
        const r = re[i] * kr[i] - im[i] * ki[i]
        im[i] = re[i] * ki[i] + im[i] * kr[i]
        re[i] = r
      }
      fft2d(re, im, N, true)
      const dt = 1 / regle.T
      for (let i = 0; i < N * N; i++) {
        const u = re[i] / (N * N)
        m.U[i] = u
        m.G[i] = g(u, k.m, k.s)
        m.A[i] = Math.min(1, Math.max(0, m.A[i] + dt * m.G[i]))
      }
      m.t += dt
    },
    masse() {
      let s = 0
      for (const v of m.A) s += v
      return s
    },
  }
  return m
}
