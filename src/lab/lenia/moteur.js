// ============================================================
//  LENIA : le moteur sur la carte graphique
//  Un « monde » = un état (jusqu'à 3 canaux) sur une grille N × N
//  torique, une règle, et les textures de calcul. Le moteur peut
//  porter plusieurs mondes à la fois (les mutants côte à côte).
//
//  Un pas de Lenia :
//   1. FFT de l'état (deux canaux par texture) ;
//   2. pour chaque paire de noyaux : produit dans l'espace de Fourier,
//      FFT inverse → potentiels, croissance ajoutée au cumul ;
//   3. mise à jour (Lenia, SmoothLife) ou flux puis redistribution
//      de la matière (Flow Lenia).
// ============================================================

import { creerGPU } from '../commun/gpu.js'
import { FFT, COMPLEXES, PRODUIT, CUMUL, MISE_A_JOUR, SMOOTH, FLUX, REDISTRIBUTION, POSER, REDUCTION, COULEUR, AFFICHAGE } from './shaders.js'
import { grillesNoyaux } from './modeles.js'

/* ---------- Palettes ---------- */

const melange = (stops) => (t) => {
  for (let i = 1; i < stops.length; i++) {
    const [t1, c1] = stops[i]
    if (t <= t1) {
      const [t0, c0] = stops[i - 1]
      const k = (t - t0) / (t1 - t0 || 1)
      return c0.map((v, j) => v + (c1[j] - v) * k)
    }
  }
  return stops[stops.length - 1][1]
}

export const PALETTES = {
  lenia: melange([[0, [6, 8, 28]], [0.2, [24, 40, 120]], [0.42, [20, 140, 190]], [0.62, [90, 210, 140]], [0.8, [250, 220, 70]], [1, [255, 90, 40]]]),
  feu: melange([[0, [6, 4, 8]], [0.3, [110, 20, 30]], [0.6, [230, 90, 30]], [0.85, [255, 200, 80]], [1, [255, 250, 220]]]),
  glace: melange([[0, [4, 8, 14]], [0.35, [20, 60, 110]], [0.7, [90, 170, 220]], [1, [235, 250, 255]]]),
  encre: melange([[0, [246, 244, 238]], [0.5, [120, 120, 130]], [1, [10, 10, 16]]]),
}

const FOND = [0.035, 0.04, 0.06]

/**
 * @returns le moteur, ou { erreur: 'webgl2' | 'flottant' | 'shader', detail }
 */
export function creerMoteur(canvas) {
  const gpu = creerGPU(canvas)
  if (!gpu) return { erreur: 'webgl2' }
  // La FFT a besoin de vrais nombres de 32 bits : en 16 bits, les convolutions se brouillent
  if (gpu.flottant !== '32') {
    gpu.detruire()
    return { erreur: 'flottant' }
  }
  const { gl } = gpu

  let progs
  try {
    progs = {
      fft: gpu.programme(FFT),
      complexes: gpu.programme(COMPLEXES),
      produit: gpu.programme(PRODUIT),
      cumul: gpu.programme(CUMUL),
      maj: gpu.programme(MISE_A_JOUR),
      smooth: gpu.programme(SMOOTH),
      flux: gpu.programme(FLUX),
      redis: gpu.programme(REDISTRIBUTION),
      poser: gpu.programme(POSER),
      reduction: gpu.programme(REDUCTION),
      couleur: gpu.programme(COULEUR),
      affichage: gpu.programme(AFFICHAGE),
    }
  } catch (e) {
    gpu.detruire()
    return { erreur: 'shader', detail: e.message }
  }

  const paletteTex = gpu.texture(256, 1, { lisse: true })
  let paletteId = ''
  function choisirPalette(id) {
    if (id === paletteId) return
    const f = PALETTES[id] ?? PALETTES.lenia
    const px = new Uint8Array(256 * 4)
    for (let i = 0; i < 256; i++) {
      const c = f(i / 255)
      px.set([c[0], c[1], c[2], 255], i * 4)
    }
    gpu.remplir(paletteTex, 256, 1, 'rgba8', px)
    paletteId = id
  }
  choisirPalette('lenia')

  const vider = (c) => {
    gl.bindFramebuffer(gl.FRAMEBUFFER, c.fbo)
    gl.viewport(0, 0, c.w, c.h)
    gl.clearColor(0, 0, 0, 0)
    gl.clear(gl.COLOR_BUFFER_BIT)
    gl.bindFramebuffer(gl.FRAMEBUFFER, null)
  }

  // Une texture de données flottante, réutilisée (motifs, noyaux, soupes)
  const charger = (tex, w, h, donnees) => gpu.remplir(tex, w, h, 'flottant', donnees)

  /**
   * Un monde N × N. Toutes ses textures lui appartiennent ; plusieurs mondes partagent les programmes.
   */
  function creerMonde(N) {
    const c = () => gpu.cible(N, N)
    const m = {
      N,
      etapes: Math.log2(N),
      etat: [c(), c()],
      fa: [c(), c()],                 // brouillons de la FFT
      cplx: c(),
      spectre0: c(),
      spectre1: c(),
      prod: c(),
      pot: c(),
      cumul: [c(), c()],
      flux: null,
      poids: null,                    // Flow Lenia à plusieurs espèces : 3 textures × 2
      noyaux: [],                     // spectres des noyaux, deux par texture
      image: gpu.cible(N, N, { format: 'rgba8', lisse: true }),
      motif: gpu.texture(1, 1, { format: 'flottant' }),
      reduc: [],
      regle: null,
      paires: [],
      especes: false,
      t: 0,                           // temps simulé
      pas: 0,
    }
    for (let n = N / 4; n >= 1; n = Math.floor(n / 4)) m.reduc.push(gpu.cible(Math.max(1, n), Math.max(1, n)))
    if (m.reduc[m.reduc.length - 1].w !== 1) m.reduc.push(gpu.cible(1, 1))
    return m
  }

  /* ---------- FFT 2D ---------- */

  // src : texture ; vers : cible où écrire le résultat (≠ brouillons). signe −1 directe, +1 inverse.
  function fft2d(m, src, vers, signe) {
    const total = 2 * m.etapes
    let entree = src
    for (let i = 0; i < total; i++) {
      const vertical = i >= m.etapes
      const sortie = i === total - 1 ? vers : m.fa[i % 2]
      gpu.dessiner(progs.fft, { u_entree: entree, u_N: m.N, u_etape: vertical ? i - m.etapes : i, u_vertical: vertical, u_signe: signe }, { vers: sortie })
      entree = sortie.tex
    }
  }

  /* ---------- Règle ---------- */

  function regler(m, regle) {
    m.regle = regle
    const N = m.N
    const grilles = grillesNoyaux(regle, N)
    // Les noyaux par paires : (a, b) dans une même texture
    const paires = []
    for (let i = 0; i < grilles.length; i += 2) paires.push([i, i + 1 < grilles.length ? i + 1 : -1])
    while (m.noyaux.length < paires.length) m.noyaux.push(gpu.cible(N, N))
    const tmp = gpu.texture(N, N, { format: 'flottant' })
    const donnees = new Float32Array(N * N * 4)
    paires.forEach(([a, b], j) => {
      donnees.fill(0)
      for (let k = 0; k < N * N; k++) {
        donnees[k * 4] = grilles[a][k]
        if (b >= 0) donnees[k * 4 + 2] = grilles[b][k]
      }
      charger(tmp, N, N, donnees)
      fft2d(m, tmp, m.noyaux[j], -1)
    })
    gl.deleteTexture(tmp)
    m.paires = paires
    if (regle.modele === 'flow' && !m.flux) m.flux = gpu.cible(N, N)
  }

  /* ---------- Un pas de temps ---------- */

  function pas(m) {
    const r = m.regle
    if (!r) return
    const N = m.N
    const norme = 1 / (N * N)

    // 1. Spectre de l'état
    gpu.dessiner(progs.complexes, { u_etat: m.etat[0].tex, u_canaux: [0, r.C > 1 ? 1 : -1] }, { vers: m.cplx })
    fft2d(m, m.cplx.tex, m.spectre0, -1)
    if (r.C > 2) {
      gpu.dessiner(progs.complexes, { u_etat: m.etat[0].tex, u_canaux: [2, -1] }, { vers: m.cplx })
      fft2d(m, m.cplx.tex, m.spectre1, -1)
    }

    // 2. Potentiels et croissance, paire par paire
    const noyaux = r.modele === 'smooth' ? [] : r.noyaux
    if (r.modele !== 'smooth') vider(m.cumul[0])
    m.paires.forEach(([a, b], j) => {
      // SmoothLife n'a pas de liste de noyaux (disque et anneau fixes) : paramètres vides
      const ka = noyaux[a] ?? {}
      const kb = (b >= 0 ? noyaux[b] : ka) ?? {}
      gpu.dessiner(progs.produit, {
        u_spectre0: m.spectre0.tex,
        u_spectre1: m.spectre1.tex,
        u_noyaux: m.noyaux[j].tex,
        u_source: [ka.c0 ?? 0, kb.c0 ?? 0],
      }, { vers: m.prod })
      fft2d(m, m.prod.tex, m.pot, 1)
      if (r.modele === 'smooth') return
      const flow = r.modele === 'flow'
      gpu.dessiner(progs.cumul, {
        u_cumul: m.cumul[0].tex,
        u_potentiel: m.pot.tex,
        u_norme: norme,
        u_nb: b >= 0 ? 2 : 1,
        u_m: [ka.m, kb.m],
        u_s: [ka.s, kb.s],
        u_h: [ka.h ?? 1, kb.h ?? 1],
        u_cible: [ka.c1 ?? 0, kb.c1 ?? 0],
        u_type: flow ? 2 : r.gn ?? 1,
        u_poidsLocaux: flow && m.especes,
        u_poids: m.especes ? m.poids[Math.floor(a / 4)][0].tex : m.cumul[0].tex,
        u_rang: [a % 4, Math.max(0, b) % 4],
      }, { vers: m.cumul[1] })
      m.cumul.reverse()
    })

    // 3. Nouvel état
    if (r.modele === 'smooth') {
      const mode = r.mode ?? 0
      gpu.dessiner(progs.smooth, {
        u_etat: m.etat[0].tex,
        u_potentiel: m.pot.tex,
        u_norme: norme,
        u_mode: mode,
        u_dt: r.dt ?? 0.1,
        u_b1: r.b1, u_b2: r.b2, u_d1: r.d1, u_d2: r.d2, u_an: r.an, u_am: r.am,
      }, { vers: m.etat[1] })
      m.t += mode > 0 ? r.dt : 1
    } else if (r.modele === 'flow') {
      const sigma = 0.65
      const portee = 3
      gpu.dessiner(progs.flux, { u_etat: m.etat[0].tex, u_cumul: m.cumul[0].tex, u_N: N, u_dt: r.dt, u_theta: 1, u_max: portee - sigma }, { vers: m.flux })
      const graine = Math.random() * 1000
      const commun = { u_etat: m.etat[0].tex, u_flux: m.flux.tex, u_N: N, u_sigma: sigma, u_portee: portee, u_graine: graine }
      gpu.dessiner(progs.redis, { ...commun, u_modePoids: false, u_poids: m.etat[0].tex }, { vers: m.etat[1] })
      if (m.especes) {
        for (const p of m.poids) {
          gpu.dessiner(progs.redis, { ...commun, u_modePoids: true, u_poids: p[0].tex }, { vers: p[1] })
          p.reverse()
        }
      }
      m.t += r.dt
    } else {
      const sommeH = [0, 0, 0]
      for (const k of r.noyaux) sommeH[k.c1 ?? 0] += k.h ?? 1
      gpu.dessiner(progs.maj, { u_etat: m.etat[0].tex, u_cumul: m.cumul[0].tex, u_dt: 1 / r.T, u_sommeH: sommeH }, { vers: m.etat[1] })
      m.t += 1 / r.T
    }
    m.etat.reverse()
    m.pas++
  }

  /* ---------- Contenu du monde ---------- */

  function effacer(m) {
    vider(m.etat[0])
    vider(m.etat[1])
    if (m.poids) for (const p of m.poids) { vider(p[0]); vider(p[1]) }
    m.t = 0
    m.pas = 0
  }

  // Flow Lenia à plusieurs espèces : chaque case porte ses poids h (jusqu'à 12 noyaux)
  function activerEspeces(m, oui) {
    m.especes = oui
    if (oui && !m.poids) m.poids = [0, 1, 2].map(() => [gpu.cible(m.N, m.N), gpu.cible(m.N, m.N)])
  }

  /**
   * Pose un motif { w, h, canaux } avec son coin bas gauche en (x, y) (cases du monde).
   * especeH : pour Flow Lenia à plusieurs espèces, les poids h de l'espèce posée.
   */
  function poser(m, motif, x, y, especeH = null) {
    const { w, h, canaux } = motif
    const donnees = new Float32Array(w * h * 4)
    for (let j = 0; j < h; j++) {
      for (let i = 0; i < w; i++) {
        // les motifs se lisent de haut en bas ; la texture, de bas en haut
        const k = ((h - 1 - j) * w + i) * 4
        for (let c = 0; c < Math.min(3, canaux.length); c++) donnees[k + c] = canaux[c][j * w + i]
        donnees[k + 3] = 1
      }
    }
    charger(m.motif, w, h, donnees)
    const coin = [Math.round(x), Math.round(y)]
    gpu.dessiner(progs.poser, { u_etat: m.etat[0].tex, u_motif: m.motif, u_coin: coin, u_taille: [w, h], u_N: m.N, u_modePoids: false, u_valeur: [0, 0, 0, 0] }, { vers: m.etat[1] })
    m.etat.reverse()
    if (m.especes && especeH) {
      m.poids.forEach((p, i) => {
        const v = [0, 1, 2, 3].map((k) => especeH[i * 4 + k] ?? 0)
        gpu.dessiner(progs.poser, { u_etat: p[0].tex, u_motif: m.motif, u_coin: coin, u_taille: [w, h], u_N: m.N, u_modePoids: true, u_valeur: v }, { vers: p[1] })
        p.reverse()
      })
    }
  }

  // Remplace tout l'état par un tableau RGBA (soupe au hasard)
  function remplacer(m, donnees) {
    charger(m.etat[0].tex, m.N, m.N, donnees)
  }

  /* ---------- Mesures : masse de chaque canal ---------- */

  const lu = new Float32Array(4)
  function mesurer(m) {
    let src = m.etat[0].tex
    let taille = [m.N, m.N]
    for (const c of m.reduc) {
      gpu.dessiner(progs.reduction, { u_entree: src, u_taille: taille }, { vers: c })
      src = c.tex
      taille = [c.w, c.h]
    }
    const fin = m.reduc[m.reduc.length - 1]
    gl.bindFramebuffer(gl.FRAMEBUFFER, fin.fbo)
    gl.readPixels(0, 0, 1, 1, gl.RGBA, gl.FLOAT, lu)
    gl.bindFramebuffer(gl.FRAMEBUFFER, null)
    return { masse: lu[0] + lu[1] + lu[2], canaux: [lu[0], lu[1], lu[2]] }
  }

  /* ---------- Affichage ---------- */

  /**
   * Dessine un monde dans le cadre [x, y, w, h] du canvas (pixels, origine en bas à gauche).
   * vue : 'etat' | 'potentiel' | 'croissance' (les deux dernières pour Lenia classique)
   */
  function dessiner(m, cadre, { vue = 'etat', palette = 'lenia', effacerFond = true } = {}) {
    const r = m.regle
    choisirPalette(palette)
    const rendu = !r ? 0 : r.modele === 'etendu' && r.C > 1 ? 1 : r.modele === 'flow' ? (m.especes ? 3 : 2) : 0
    const k = r?.noyaux?.[0] ?? {}
    const classique = r?.modele === 'classique'
    gpu.dessiner(progs.couleur, {
      u_etat: m.etat[0].tex,
      u_potentiel: m.pot.tex,
      u_poids: m.especes ? m.poids[0][0].tex : m.etat[0].tex,
      u_palette: paletteTex,
      u_vue: classique && vue === 'potentiel' ? 1 : classique && vue === 'croissance' ? 2 : 0,
      u_rendu: rendu,
      u_norme: 1 / (m.N * m.N),
      u_m: k.m ?? 0.15,
      u_s: k.s ?? 0.015,
      u_type: r?.gn ?? 1,
      u_gainU: 1 / Math.max(0.05, (k.m ?? 0.15) * 2),
    }, { vers: m.image })
    if (effacerFond) {
      gl.bindFramebuffer(gl.FRAMEBUFFER, null)
      gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight)
      gl.clearColor(...FOND, 1)
      gl.clear(gl.COLOR_BUFFER_BIT)
    }
    const [x, y, w, h] = cadre
    gpu.dessiner(progs.affichage, { u_image: m.image.tex, u_cadre: cadre, u_fond: FOND }, {
      coupe: { x: Math.max(0, Math.floor(x)), y: Math.max(0, Math.floor(y)), w: Math.ceil(w), h: Math.ceil(h) },
    })
  }

  // Adapte la taille du canvas à son affichage (écrans haute densité compris)
  function redimensionner() {
    const e = Math.min(window.devicePixelRatio || 1, 2)
    const W = canvas.clientWidth ? Math.max(1, Math.round(canvas.clientWidth * e)) : canvas.width
    const H = canvas.clientHeight ? Math.max(1, Math.round(canvas.clientHeight * e)) : canvas.height
    if (canvas.width !== W) canvas.width = W
    if (canvas.height !== H) canvas.height = H
    return [W, H]
  }

  // Les textures d'un monde qu'on abandonne (taille changée, mutants fermés)
  function liberer(m) {
    const cibles = [...m.etat, ...m.fa, m.cplx, m.spectre0, m.spectre1, m.prod, m.pot, ...m.cumul, m.image, ...m.noyaux, ...m.reduc]
    if (m.flux) cibles.push(m.flux)
    if (m.poids) for (const p of m.poids) cibles.push(...p)
    for (const c of cibles) {
      gl.deleteTexture(c.tex)
      gl.deleteFramebuffer(c.fbo)
    }
    gl.deleteTexture(m.motif)
  }

  return {
    gl,
    creerMonde,
    regler,
    pas,
    effacer,
    activerEspeces,
    poser,
    remplacer,
    mesurer,
    dessiner,
    redimensionner,
    liberer,
    perdu: () => gl.isContextLost(),
    detruire: () => gpu.detruire(),
  }
}
