// ============================================================
//  RENDU — dessine un monde du moteur dans un <canvas>
//  La grille est peinte pixel par pixel dans un petit canvas hors écran
//  (1 pixel = 1 case), puis agrandie à l'écran sans lissage.
//  Deux thèmes (clair, sombre). Effets activables : surligneur,
//  quadrillage, carte des passages. Zoom et cadrage : lab/commun/camera.js.
// ============================================================

import { creerCamera } from '../commun/camera'

const hex = (h) => [1, 3, 5].map((k) => parseInt(h.slice(k, k + 2), 16))

export const THEMES = {
  clair: {
    bureau: '#EEF0F3',            // au-delà des bords de la feuille
    feuille: '#FFFFFF',
    grille: '196, 205, 217',
    encre: '#1B2340',
    encres: ['#1B2340', '#2D6FB5', '#C2872C', '#6B4EA0', '#B4495A', '#2B8C9A', '#98683D', '#5E7F2E', '#C35F9A', '#4F5D75', '#9A4630'],
    mur: '#9AA3B2',
    sig: '#1E7A50',               // vert signature : fourmi et surligneur
    contour: '#16181D',
    texte: '#16181D',
    passages: [[219, 231, 240], [143, 178, 210], [63, 103, 160], [27, 35, 64]],
  },
  sombre: {
    bureau: '#131519',
    feuille: '#181B21',
    grille: '62, 69, 82',
    encre: '#DCE1EA',
    encres: ['#DCE1EA', '#6FA8E8', '#E2A955', '#A88BE0', '#E07A8C', '#5CC1CF', '#C99A6A', '#9CC25A', '#E58BC0', '#9AA6BD', '#D9805F'],
    mur: '#4A5160',
    sig: '#33AD78',
    contour: '#E7E9EE',
    texte: '#E7E9EE',
    passages: [[34, 44, 58], [56, 88, 130], [116, 156, 204], [220, 228, 240]],
  },
}

const AUTRES_FOURMIS = { clair: ['#C2872C', '#2D6FB5', '#B4495A', '#6B4EA0', '#2B8C9A'], sombre: ['#E2A955', '#6FA8E8', '#E07A8C', '#A88BE0', '#5CC1CF'] }

const pack = (r, g, b, a = 255) => ((a << 24) | (b << 16) | (g << 8) | r) >>> 0

function melange(stops, t) {
  const x = Math.min(1, Math.max(0, t)) * (stops.length - 1)
  const k = Math.min(stops.length - 2, Math.floor(x))
  const f = x - k
  return stops[k].map((v, j) => Math.round(v + (stops[k + 1][j] - v) * f))
}

// Couleur RVB de chaque couleur de case (null = feuille vide)
export function palette(n, theme = 'clair') {
  const encres = THEMES[theme].encres
  return Array.from({ length: n }, (_, c) => (c === 0 ? null : hex(encres[(c - 1) % encres.length])))
}
export const couleurCss = (rvb, theme = 'clair') => (rvb ? `rgb(${rvb.join(',')})` : THEMES[theme].feuille)

export function creerRendu(canvas, monde) {
  const ctx = canvas.getContext('2d')
  let m = monde
  let off, octx, img, px
  let pal = null
  let palPour = ''
  const vue = creerCamera(canvas, { largeur: m.W, hauteur: m.H })
  const { css } = vue

  function preparer() {
    off = document.createElement('canvas')
    off.width = m.W
    off.height = m.H
    octx = off.getContext('2d')
    img = octx.createImageData(m.W, m.H)
    px = new Uint32Array(img.data.buffer)
    vider()
  }

  // À appeler après reinitialiser / changerRegle / toutEffacer
  function vider() {
    px.fill(0)
    octx.putImageData(img, 0, 0)
  }

  function peindreGrille(effets, pasParImage, th, nomTheme) {
    const b = m.boite
    if (!b) return
    const { W, couleur, mur, passages, dernier, pas } = m
    const cle = `${m.regle.couleurs}-${nomTheme}`
    if (palPour !== cle) { pal = palette(m.regle.couleurs, nomTheme); palPour = cle }
    const packs = pal.map((c) => (c ? pack(...c) : 0))
    const murPack = pack(...hex(th.mur))
    const sig = hex(th.sig)
    const carte = effets.passages
    const lmax = Math.log1p(m.maxPassages || 1)
    // Surligneur : les ~20 dernières images, qui s'estompent vite
    const duree = effets.surligneur ? Math.max(60, pasParImage * 20) : 0

    for (let y = b.y0; y <= b.y1; y++) {
      for (let i = y * W + b.x0, fin = y * W + b.x1; i <= fin; i++) {
        if (mur[i]) { px[i] = murPack; continue }
        const p = passages[i]
        if (!p) { px[i] = 0; continue }

        let rvb = carte ? melange(th.passages, Math.log1p(p) / lmax) : pal[couleur[i]]
        const age = duree ? pas - dernier[i] : Infinity
        if (age >= duree) { px[i] = carte ? pack(...rvb) : packs[couleur[i]]; continue }

        // Surligneur posé en transparence par-dessus la case
        // Assez léger pour que la fourmi, du même vert, reste bien visible par-dessus
        let f = 1 - age / duree
        f = f * f * 0.4
        if (!rvb) {
          px[i] = pack(...sig, Math.round(255 * f))
        } else {
          rvb = rvb.map((v, j) => Math.round(v + (sig[j] - v) * f))
          px[i] = pack(...rvb)
        }
      }
    }
    octx.putImageData(img, 0, 0, b.x0, b.y0, b.x1 - b.x0 + 1, b.y1 - b.y0 + 1)
  }

  function dessiner({ effets, pasParImage = 1, auto = true, marques = [], theme = 'clair' }) {
    const th = THEMES[theme]
    if (auto) vue.cadrer(m.boite)
    peindreGrille(effets, pasParImage, th, theme)

    const e = css()
    const cw = canvas.width
    const ch = canvas.height
    const { ox, oy, z } = vue.origine()

    ctx.setTransform(1, 0, 0, 1, 0, 0)
    ctx.globalAlpha = 1
    ctx.fillStyle = th.bureau
    ctx.fillRect(0, 0, cw, ch)
    ctx.fillStyle = th.feuille
    ctx.fillRect(ox, oy, m.W * z, m.H * z)

    if (effets.quadrillage) vue.quadriller(ctx, th.grille)

    ctx.imageSmoothingEnabled = false
    ctx.drawImage(off, ox, oy, m.W * z, m.H * z)

    // Fourmis : triangle orienté quand on zoome, point sinon, cerclé pour rester lisible
    const plusieurs = m.departs.length > 1
    m.fourmis.forEach((f, k) => {
      const sx = ox + (f.x + 0.5) * z
      const sy = oy + (f.y + 0.5) * z
      ctx.fillStyle = plusieurs && k > 0 ? AUTRES_FOURMIS[theme][(k - 1) % 5] : th.sig
      ctx.beginPath()
      if (z >= 9 * e) {
        const r = z * 0.46
        const a = (f.dir * Math.PI) / 2
        ctx.moveTo(sx + Math.sin(a) * r, sy - Math.cos(a) * r)
        ctx.lineTo(sx + Math.sin(a + 2.4) * r, sy - Math.cos(a + 2.4) * r)
        ctx.lineTo(sx + Math.sin(a - 2.4) * r, sy - Math.cos(a - 2.4) * r)
        ctx.closePath()
      } else {
        ctx.arc(sx, sy, Math.max(4 * e, z * 0.7), 0, Math.PI * 2)
      }
      // Liseré couleur papier, puis contour : la fourmi se détache de tout ce qui l'entoure
      ctx.lineJoin = 'round'
      ctx.strokeStyle = th.feuille
      ctx.lineWidth = 4.5 * e
      ctx.stroke()
      ctx.fill()
      ctx.strokeStyle = th.contour
      ctx.lineWidth = 1.5 * e
      ctx.stroke()
    })

    // Repères de la visite guidée
    for (const { x, y } of marques) {
      ctx.strokeStyle = th.sig
      ctx.lineWidth = 2 * e
      ctx.beginPath()
      ctx.arc(ox + (x + 0.5) * z, oy + (y + 0.5) * z, Math.max(24 * e, z * 4), 0, Math.PI * 2)
      ctx.stroke()
    }
  }

  const recentrer = () => vue.recentrer(m.boite)

  preparer()
  recentrer()

  return { dessiner, vider, versCase: vue.versCase, zoomer: vue.zoomer, deplacer: vue.deplacer, recentrer, camera: vue.camera }
}
