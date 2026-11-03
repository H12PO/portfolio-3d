import { chaine } from './moteur.js'

// ============================================================
//  ÉPICYCLES DE FOURIER : le dessin 2D (Canvas)
//  Le monde est le carré [−VUE, VUE]², centré dans le canvas. On y
//  dessine la forme d'origine (pâle), la courbe obtenue avec les
//  cercles gardés, la chaîne des cercles à l'instant t, et la pointe
//  qui trace.
// ============================================================

export const VUE = 1.3
export const FOND = '#0b0d12'
export const COULEURS = {
  origine: 'rgba(255, 255, 255, 0.2)',
  courbe: 'rgba(255, 179, 71, 0.28)',
  trace: '#ffb347',
  cercle: 'rgba(140, 170, 220, 0.32)',
  rayon: 'rgba(214, 226, 248, 0.75)',
  pointe: '#ffffff',
  dessin: '#7fd1ff',
}

export function creerRendu2D(canvas) {
  const ctx = canvas.getContext('2d')
  let t0 = { s: 1, ox: 0, oy: 0 }
  let tampon = null

  function redimensionner() {
    const e = Math.min(typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1, 2)
    const w = Math.max(1, Math.round(canvas.clientWidth * e))
    const h = Math.max(1, Math.round(canvas.clientHeight * e))
    if (canvas.width !== w || canvas.height !== h) { canvas.width = w; canvas.height = h }
  }

  function cadrer() {
    const w = canvas.width, h = canvas.height
    const s = (Math.min(w, h) / (2 * VUE)) * 0.96
    t0 = { s, ox: w / 2, oy: h / 2 }
  }
  const X = (x) => t0.ox + x * t0.s
  const Y = (y) => t0.oy + y * t0.s

  // une courbe fermée échantillonnée (x[], y[]) ; jusqu'à l'indice fin (non compris) si demandé
  function courbe(x, y, couleur, epais, fin = x.length, fermer = true) {
    const n = x.length
    if (!n) return
    ctx.strokeStyle = couleur
    ctx.lineWidth = epais
    ctx.lineJoin = 'round'
    ctx.lineCap = 'round'
    ctx.beginPath()
    ctx.moveTo(X(x[0]), Y(y[0]))
    for (let i = 1; i < fin; i++) ctx.lineTo(X(x[i]), Y(y[i]))
    if (fermer && fin >= n) ctx.lineTo(X(x[0]), Y(y[0]))
    ctx.stroke()
  }

  /**
   * @param scene { origine: {x, y}, approx, t, fermee, dessin: [[x, y]], options }
   *   options : { cercles, origine, courbe, trace, epais }
   */
  function dessiner(scene) {
    cadrer()
    const e = Math.min(typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1, 2)
    const o = { cercles: true, origine: true, courbe: true, trace: true, ...(scene.options ?? {}) }
    ctx.fillStyle = FOND
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // repère discret : deux axes passant par le centre
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)'
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(X(-VUE), Y(0)); ctx.lineTo(X(VUE), Y(0))
    ctx.moveTo(X(0), Y(-VUE)); ctx.lineTo(X(0), Y(VUE))
    ctx.stroke()

    if (scene.origine && o.origine) courbe(scene.origine.x, scene.origine.y, COULEURS.origine, 1.5 * e, scene.origine.x.length, scene.fermee !== false)

    const ap = scene.approx
    if (ap) {
      const { x, y } = ap.courbe
      const N = x.length
      if (o.courbe) courbe(x, y, COULEURS.courbe, 1.5 * e)
      const t = scene.t ?? 0
      if (o.trace) courbe(x, y, COULEURS.trace, (o.epais ?? 2.2) * e, Math.max(1, Math.floor(t * N) + 1), false)

      if (o.cercles && ap.cercles.length) {
        tampon = chaine(ap, t, tampon)
        const n = ap.cercles.length
        // cercles : du plus grand au plus petit ; on saute ceux qui feraient moins d'un demi-pixel
        ctx.strokeStyle = COULEURS.cercle
        ctx.lineWidth = 1 * e
        ctx.beginPath()
        for (let q = 0; q < n; q++) {
          const r = ap.cercles[q].r * t0.s
          if (r < 0.5) break
          const cx = X(tampon[2 * q]), cy = Y(tampon[2 * q + 1])
          ctx.moveTo(cx + r, cy)
          ctx.arc(cx, cy, r, 0, 2 * Math.PI)
        }
        ctx.stroke()
        // les rayons : la chaîne des vecteurs qui tournent
        ctx.strokeStyle = COULEURS.rayon
        ctx.lineWidth = 1.2 * e
        ctx.beginPath()
        ctx.moveTo(X(tampon[0]), Y(tampon[1]))
        for (let q = 1; q <= n; q++) ctx.lineTo(X(tampon[2 * q]), Y(tampon[2 * q + 1]))
        ctx.stroke()
        // la pointe
        ctx.fillStyle = COULEURS.pointe
        ctx.beginPath()
        ctx.arc(X(tampon[2 * n]), Y(tampon[2 * n + 1]), 3.2 * e, 0, 2 * Math.PI)
        ctx.fill()
      }
    }

    // un tracé en cours, à la souris
    if (scene.dessin?.length > 1) {
      ctx.strokeStyle = COULEURS.dessin
      ctx.lineWidth = 2.5 * e
      ctx.lineJoin = 'round'
      ctx.lineCap = 'round'
      ctx.beginPath()
      scene.dessin.forEach(([x, y], i) => (i ? ctx.lineTo(X(x), Y(y)) : ctx.moveTo(X(x), Y(y))))
      ctx.stroke()
    }
  }

  // Pixels du canvas → coordonnées du monde
  const versMonde = (px, py) => [(px - t0.ox) / t0.s, (py - t0.oy) / t0.s]

  return { redimensionner, dessiner, versMonde, cadrer }
}
