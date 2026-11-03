// ============================================================
//  FRACTALES : le rendu de l'explorateur sur la carte graphique
//  - Pendant un mouvement : à chaque image, la plus grande résolution
//    qui tient dans le budget de temps (résolution dynamique), agrandie
//    avec lissage.
//  - À l'arrêt : la pleine résolution, bande par bande pour ne jamais
//    bloquer la carte graphique, puis des passages décalés d'une
//    fraction de pixel dont la moyenne efface les escaliers des bords
//    (anticrénelage progressif).
//  - Au-delà d'un zoom de 2 000 : perturbations. Le processeur calcule
//    en 64 bits l'orbite du centre ; chaque pixel n'en suit que l'écart.
//  - En incrustation, la Julia du point survolé. Export PNG par tuiles.
// ============================================================

import { creerGPU } from '../commun/gpu.js'
import { EVASION, NEWTON, LYAPUNOV, COULEUR, COPIE } from './shaders.js'
import { fractale, pasDe, sens, echantillonner, interieur, racines, POLYNOMES, lireSuite, profond, orbiteReference, ORBITE_LARGEUR } from './formules.js'

const fort = (v) => Math.fround(v)
const faible = (v) => Math.fround(v - Math.fround(v))
const centre = (x, y) => [fort(x), faible(x), fort(y), faible(y)]

const TYPES = { evasion: 0, newton: 1, lyapunov: 2 }
const LUMIERE = [Math.cos(Math.PI / 4), Math.sin(Math.PI / 4)]
const ECHELLES = [1, 1.25, 1.5, 2, 2.5, 3, 4, 5, 6, 8] // réductions possibles de l'aperçu

// Décalages des passages successifs, dans le pixel (suite de Halton 2, 3) ; le premier est au centre
const halton = (i, b) => {
  let f = 1
  let r = 0
  for (let k = i; k > 0; k = Math.floor(k / b)) {
    f /= b
    r += f * (k % b)
  }
  return r
}
const DECALAGES = Array.from({ length: 16 }, (_, k) => (k === 0 ? [0, 0] : [halton(k, 2) - 0.5, halton(k, 3) - 0.5]))

/**
 * @param canvas  le <canvas> de l'explorateur
 * @returns le moteur de rendu, ou { erreur } si la carte graphique ne convient pas
 */
export function creerRendu(canvas) {
  const gpu = creerGPU(canvas)
  if (!gpu) return { erreur: 'webgl2' }
  if (!gpu.flottant) {
    gpu.detruire()
    return { erreur: 'flottant' }
  }
  const { gl } = gpu

  let progs
  try {
    progs = {
      simple: gpu.programme(EVASION),
      profond: gpu.programme(EVASION, ['PERTURBATION']),
      newton: gpu.programme(NEWTON),
      lyapunov: gpu.programme(LYAPUNOV),
      couleur: gpu.programme(COULEUR),
      copie: gpu.programme(COPIE),
    }
  } catch (e) {
    gpu.detruire()
    return { erreur: 'shader', detail: e.message }
  }

  /* ---------- Cibles ---------- */
  const etat = {
    W: 1,
    H: 1,
    donnees: gpu.cible(1, 1),                               // calcul (aperçu, ou passage en pleine résolution)
    apercu: gpu.cible(1, 1, { format: 'rgba8', lisse: true }), // aperçu coloré, agrandi avec lissage
    cumul: gpu.cible(1, 1, { format: 'rgba16f' }),         // moyenne des passages (anticrénelage)
    julia: gpu.cible(1, 1),                                 // incrustation
    orbite: { tex: gpu.texture(ORBITE_LARGEUR, 1, { format: 'rg32f' }), cle: '', info: null, tampon: null },
    signature: '',
    signatureCouleur: '',
    signatureJulia: '',
    apercuFait: false,
    aw: 1,
    ah: 1,
    echelle: 4,
    lignes: 0,      // lignes du passage en cours
    passages: 0,    // passages complets déjà dans la moyenne
    toucher: -1e9,
    budget: 3e7,    // itérations par image : ajusté selon la fluidité réelle
    derniereImage: 0,
    sale: true,
    palette: { id: '', tex: gpu.texture(256, 1, { lisse: true, repeter: true }) },
  }

  function redimensionner() {
    const e = Math.min(window.devicePixelRatio || 1, 2)
    // Un canvas hors de la page (écran de la borne) garde la taille qu'on lui a donnée
    const W = canvas.clientWidth ? Math.max(1, Math.round(canvas.clientWidth * e)) : canvas.width
    const H = canvas.clientHeight ? Math.max(1, Math.round(canvas.clientHeight * e)) : canvas.height
    if (W === etat.W && H === etat.H) return
    canvas.width = W
    canvas.height = H
    etat.W = W
    etat.H = H
    etat.donnees.redimensionner(W, H)
    etat.apercu.redimensionner(W, H)
    etat.cumul.redimensionner(W, H)
    etat.signature = ''
  }

  /* ---------- Les uniformes d'un calcul ---------- */

  const perturbations = (vue) => fractale(vue.id).famille === 'evasion' && profond(vue.id, vue.zoom)

  // L'orbite de référence du centre de la vue : recalculée seulement quand la vue change
  function preparerOrbite(p, vue) {
    const f = fractale(vue.id)
    const cle = [vue.id, vue.x, vue.y, p.iter, vue.julia?.join()].join('|')
    if (cle === etat.orbite.cle) return etat.orbite.info
    const o = orbiteReference({ formule: f.formule, julia: vue.julia ?? null, re: vue.x, im: vue.y * sens(vue.id), iter: p.iter }, etat.orbite.tampon)
    if (!etat.orbite.tampon || etat.orbite.tampon.length < o.donnees.length) etat.orbite.tampon = o.donnees
    gpu.remplir(etat.orbite.tex, ORBITE_LARGEUR, o.lignes, 'rg32f', o.donnees)
    etat.orbite.cle = cle
    etat.orbite.info = o
    return o
  }

  // Le coût d'un pixel au pire (tout l'intérieur va jusqu'au bout des itérations)
  const cout = (p) => {
    const f = fractale(p.id).famille
    if (f === 'newton') return p.iter * 6
    if (f === 'lyapunov') return p.iter * 1.2
    return p.iter * (perturbations(p) ? 2 : 1)
  }

  function uniformes(p, taille, pas, decal = [0, 0], vue = p) {
    const f = fractale(p.id)
    const r = vue.rotation ?? 0
    const base = { u_taille: taille, u_decal: decal, u_centre: centre(vue.x, vue.y), u_pas: pas, u_rotation: [Math.cos(r), Math.sin(r)], u_iter: p.iter }
    if (f.famille === 'newton') {
      const coef = POLYNOMES[p.polynome] ?? POLYNOMES.z3
      const rac = racines(coef)
      const c6 = Array.from({ length: 6 }, (_, k) => coef[k] ?? [0, 0])
      const r5 = Array.from({ length: 5 }, (_, k) => rac[k] ?? [1e9, 1e9])
      return { prog: progs.newton, valeurs: { ...base, u_coef: c6.flat(), u_degreP: coef.length - 1, u_racines: r5.flat(), u_nRacines: rac.length, u_relax: [p.relax ?? 1, 0] } }
    }
    if (f.famille === 'lyapunov') {
      const s = lireSuite(p.suite) ?? [0, 1]
      const s24 = Array.from({ length: 24 }, (_, k) => s[k] ?? 0)
      return { prog: progs.lyapunov, valeurs: { ...base, u_suite: s24, u_long: s.length } }
    }
    const vueComplete = { ...vue, id: vue.id ?? p.id }
    const o = perturbations(vueComplete) ? preparerOrbite(p, vueComplete) : null
    return {
      prog: o ? progs.profond : progs.simple,
      valeurs: {
        ...base,
        ...(o && { u_orbite: etat.orbite.tex, u_debutA: o.debutA, u_longA: o.longA, u_debutB: o.debutB, u_longB: o.longB }),
        u_sens: sens(p.id),
        u_formule: f.formule,
        u_julia: !!vue.julia,
        u_c: vue.julia ?? [0, 0],
        u_degre: p.degre ?? 2,
        u_lumiere: LUMIERE,
      },
    }
  }

  // Ce qui oblige à recalculer, et ce qui ne change que la couleur
  const signature = (p) => [p.id, p.x, p.y, p.zoom, p.rotation ?? 0, p.iter, p.julia?.join(), p.degre, p.polynome, p.relax, p.suite].join('|')
  const signatureCouleur = (p) => [p.palette, p.densite, p.decalage, p.echelle, p.bandes, p.relief, p.bords].join('|')

  // Nombre de passages pour l'anticrénelage : moins quand chaque passage coûte cher
  const passagesMax = (p) => (p.defile ? 1 : cout(p) > 4000 ? 4 : cout(p) > 1500 ? 8 : 16)

  /* ---------- Calcul et couleur ---------- */

  // Calcule les données dans la cible c, sur la zone w × h (aperçu) ou par bandes (y0 → y1)
  function calculer(c, p, pas, { w = c.w, h = c.h, y0 = 0, y1 = h, decal = [0, 0], vue = p } = {}) {
    const { prog, valeurs } = uniformes(p, [w, h], pas, decal, vue)
    gpu.dessiner(prog, valeurs, { vers: c, zone: { x: 0, y: 0, w, h }, coupe: { x: 0, y: y0, w, h: y1 - y0 } })
  }

  function preparerPalette(p) {
    if (etat.palette.id === p.palette) return
    gpu.remplir(etat.palette.tex, 256, 1, 'rgba8', echantillonner(p.palette))
    etat.palette.id = p.palette
  }

  // zoom : celui de l'image coloriée (l'incrustation Julia a le sien)
  function couleurs(p, type, zoom = p.zoom) {
    const fond = interieur(p.palette).map((v) => v / 255)
    const n = fractale(p.id).famille === 'newton' ? racines(POLYNOMES[p.polynome] ?? POLYNOMES.z3).length : 1
    return {
      u_palette: etat.palette.tex,
      u_type: type,
      u_densite: p.densite,
      u_decalage: p.decalage,
      u_echelle: { lineaire: 0, log: 1, zoom: 2 }[p.echelle] ?? 2,
      u_norme: 1 + Math.log2(Math.max(1, zoom)),
      u_bandes: !!p.bandes,
      u_relief: p.relief ? 0.85 : 0,
      u_bords: !!p.bords,
      u_interieur: fond,
      u_nRacines: n,
      u_zone: [1, 1],
    }
  }

  /**
   * Colorie les données d'une source (zone w × h) vers une cible ou l'écran.
   * cadre : où poser l'image ; poids : mélange avec ce qui est déjà là (moyenne).
   */
  function colorer(p, source, { w, h, vers = null, cadre = [0, 0, w, h], coupe = null, poids = null, zoom = p.zoom }) {
    const type = TYPES[fractale(p.id).famille] ?? 0
    gpu.dessiner(progs.couleur, { ...couleurs(p, type, zoom), u_donnees: source.tex, u_cadre: cadre, u_zone: [w / source.w, h / source.h] }, {
      vers,
      zone: vers ? { x: 0, y: 0, w, h } : null,
      coupe,
      poids,
    })
  }

  function copier(source, { w = source.w, h = source.h, cadre }) {
    gpu.dessiner(progs.copie, { u_image: source.tex, u_cadre: cadre, u_zone: [w / source.w, h / source.h] })
  }

  // Taille de l'incrustation Julia, en bas à droite
  const cadreJulia = () => {
    const e = Math.min(window.devicePixelRatio || 1, 2)
    const s = Math.round(Math.min(etat.W, etat.H) * 0.3)
    const m = Math.round(12 * e)
    return { x: etat.W - s - m, y: m, w: s, h: s }
  }

  // Réduction de l'aperçu : la plus petite qui tient dans le budget (coût moyen ≈ 25 % du pire)
  function choisirEchelle(p) {
    const besoin = Math.sqrt((etat.W * etat.H * cout(p) * 0.25) / etat.budget)
    return ECHELLES.find((s) => s >= besoin) ?? ECHELLES[ECHELLES.length - 1]
  }

  /**
   * Une image : un peu de calcul, puis l'assemblage à l'écran.
   * @param p  { id, x, y, zoom, rotation, iter, julia, degre, polynome, relax, suite,
   *             palette, densite, decalage, log, defile, relief, bords, apercuJulia }
   * @returns { progres: 0 → 1, affinage: 0 → 1, profond: calcul par perturbations }
   */
  function image(p, maintenant = performance.now()) {
    if (gl.isContextLost()) return { progres: 0, affinage: 0, profond: false }
    redimensionner()
    const { W, H } = etat
    const famille = fractale(p.id).famille
    const pas = pasDe(p.zoom, W, H)

    // Le budget suit la fluidité réelle : on en fait moins si les images ralentissent
    const dt = maintenant - etat.derniereImage
    etat.derniereImage = maintenant
    if (dt > 0 && dt < 500) etat.budget = Math.min(4e9, Math.max(2e6, etat.budget * (dt > 30 ? 0.8 : dt < 20 ? 1.15 : 1)))

    const sig = signature(p)
    if (sig !== etat.signature) {
      etat.signature = sig
      etat.sale = true
      etat.lignes = 0
      etat.passages = 0
      etat.apercuFait = false
    }
    const sc = signatureCouleur(p)
    const couleurChange = sc !== etat.signatureCouleur
    etat.signatureCouleur = sc
    if (couleurChange) etat.sale = true
    const bouge = maintenant - etat.toucher < 150

    preparerPalette(p)

    // Nouvelle couleur avant la pleine résolution : on recolore l'aperçu, ses données sont intactes
    if (couleurChange && etat.passages === 0 && etat.apercuFait && etat.lignes === 0) {
      colorer(p, etat.donnees, { w: etat.aw, h: etat.ah, vers: etat.apercu })
    }
    // Nouvelle couleur une fois l'image affinée : on repart du dernier passage calculé
    if (couleurChange && etat.passages > 0) {
      colorer(p, etat.donnees, { w: W, h: H, vers: etat.cumul })
      etat.passages = 1
      etat.lignes = 0
    }

    if (!etat.apercuFait) {
      const s = choisirEchelle(p)
      const aw = Math.min(W, Math.ceil(W / s))
      const ah = Math.min(H, Math.ceil(H / s))
      calculer(etat.donnees, p, pas * s, { w: aw, h: ah })
      colorer(p, etat.donnees, { w: aw, h: ah, vers: etat.apercu })
      Object.assign(etat, { apercuFait: true, aw, ah, echelle: s, sale: true })
    } else if (!bouge && etat.passages < passagesMax(p)) {
      // Un passage en pleine résolution, du haut vers le bas, autant de lignes que le budget le permet
      const n = Math.max(2, Math.min(H, Math.floor(etat.budget / (W * cout(p) * 0.4))))
      const y1 = H - etat.lignes
      const y0 = Math.max(0, y1 - n)
      calculer(etat.donnees, p, pas, { y0, y1, decal: DECALAGES[etat.passages % DECALAGES.length] })
      etat.lignes = H - y0
      if (etat.lignes >= H) {
        // Passage terminé : il rejoint la moyenne
        colorer(p, etat.donnees, { w: W, h: H, vers: etat.cumul, poids: 1 / (etat.passages + 1) })
        etat.passages++
        etat.lignes = 0
      }
      etat.sale = true
    }

    // Incrustation : la Julia du point survolé
    const avecJulia = famille === 'evasion' && !p.julia && p.apercuJulia
    if (avecJulia) {
      const cj = cadreJulia()
      const sj = `${p.id}|${p.apercuJulia.join()}|${p.degre}|${cj.w}|${p.iter}`
      if (sj !== etat.signatureJulia) {
        if (etat.julia.w !== cj.w) etat.julia.redimensionner(cj.w, cj.h)
        const vue = { id: p.id, x: 0, y: 0, zoom: 0.95, rotation: 0, julia: p.apercuJulia }
        calculer(etat.julia, { ...p, iter: Math.min(p.iter, 400) }, pasDe(0.95, cj.w, cj.h), { vue })
        etat.signatureJulia = sj
        etat.sale = true
      }
    }
    if (avecJulia !== etat.avecJulia) {
      etat.avecJulia = avecJulia
      etat.sale = true
    }

    if (etat.sale) {
      composer(p, avecJulia)
      etat.sale = false
    }
    const max = passagesMax(p)
    return {
      progres: etat.passages > 0 ? 1 : etat.lignes / H,
      affinage: Math.min(1, etat.passages / max),
      profond: perturbations(p),
    }
  }

  function composer(p, avecJulia) {
    const { W, H } = etat
    if (etat.passages > 0) {
      // L'image affinée
      copier(etat.cumul, { cadre: [0, 0, W, H] })
    } else {
      // L'aperçu agrandi avec lissage, et les lignes déjà calculées en pleine résolution
      const s = etat.echelle
      const lw = etat.aw * s
      const lh = etat.ah * s
      copier(etat.apercu, { w: etat.aw, h: etat.ah, cadre: [(W - lw) / 2, (H - lh) / 2, lw, lh] })
      if (etat.lignes > 0) colorer(p, etat.donnees, { w: W, h: H, coupe: { x: 0, y: H - etat.lignes, w: W, h: etat.lignes } })
    }
    if (avecJulia) {
      const cj = cadreJulia()
      colorer(p, etat.julia, { w: cj.w, h: cj.h, cadre: [cj.x, cj.y, cj.w, cj.h], coupe: cj, zoom: 0.95 })
    }
  }

  /* ---------- Export PNG, par tuiles, avec anticrénelage ---------- */

  const prochaineImage = () => new Promise((r) => requestAnimationFrame(r))

  /**
   * L'image actuelle, facteur fois plus grande. Rendue par tuiles de 1024 pixels,
   * chacune en 4 passages décalés (anticrénelage), et par bandes.
   * @returns Promise<Blob> (PNG)
   */
  async function exporter(p, facteur, onProgres = () => {}) {
    const max = Math.min(gl.getParameter(gl.MAX_VIEWPORT_DIMS)[0], 16384)
    const f = Math.max(1, Math.min(facteur, Math.floor(max / Math.max(etat.W, etat.H))))
    const EW = etat.W * f
    const EH = etat.H * f
    const toile = document.createElement('canvas')
    toile.width = EW
    toile.height = EH
    const ctx = toile.getContext('2d')
    preparerPalette(p)

    const T = 1024
    const donnees = gpu.cible(T, T)
    const tuile = gpu.cible(T, T, { format: 'rgba8' })
    const pas = pasDe(p.zoom, etat.W, etat.H) / f
    const total = Math.ceil(EW / T) * Math.ceil(EH / T) * 4
    let fait = 0
    for (let ty = 0; ty < EH; ty += T) {
      for (let tx = 0; tx < EW; tx += T) {
        const tw = Math.min(T, EW - tx)
        const th = Math.min(T, EH - ty)
        const bande = Math.max(4, Math.min(th, Math.floor(etat.budget / (tw * cout(p) * 0.4))))
        for (let k = 0; k < 4; k++) {
          const [jx, jy] = DECALAGES[k]
          const { prog, valeurs } = uniformes(p, [EW, EH], pas, [tx + jx, ty + jy])
          for (let y = 0; y < th; y += bande) {
            gpu.dessiner(prog, valeurs, { vers: donnees, zone: { x: 0, y: 0, w: T, h: T }, coupe: { x: 0, y, w: tw, h: Math.min(bande, th - y) } })
            await prochaineImage()
          }
          colorer(p, donnees, { w: T, h: T, vers: tuile, poids: 1 / (k + 1) })
          onProgres(++fait / total)
        }
        ctx.putImageData(retourner(gpu.lire(tuile, 0, 0, tw, th), tw, th), tx, EH - ty - th)
      }
    }
    return new Promise((r) => toile.toBlob(r, 'image/png'))
  }

  // WebGL lit les lignes du bas vers le haut ; une image se lit du haut vers le bas
  function retourner(px, w, h) {
    const out = new ImageData(w, h)
    for (let y = 0; y < h; y++) out.data.set(px.subarray((h - 1 - y) * w * 4, (h - y) * w * 4), y * w * 4)
    return out
  }

  return {
    image,
    exporter,
    cadreJulia,
    taille: () => [etat.W, etat.H],
    toucher: (t = performance.now()) => { etat.toucher = t },
    perdu: () => gl.isContextLost(),
    detruire: () => gpu.detruire(),
  }
}
