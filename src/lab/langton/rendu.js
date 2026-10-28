// ============================================================
//  RENDU — une feuille de papier quadrillé posée sur le bureau
//  La grille est peinte pixel par pixel dans un petit canvas hors écran
//  (1 pixel = 1 case), puis agrandie à l'écran sans lissage.
//  Effets activables : surligneur, quadrillage, carte des passages.
// ============================================================

const BUREAU = '#10101a'             // autour de la feuille (fond du site)
const PAPIER = '#EEF1EC'
const QUADRILLAGE = '64, 104, 96'    // vert-gris, en rgba
const ENCRE = [26, 34, 56]           // #1A2238
const GRAPHITE = [91, 99, 107]       // murs
const SURLIGNEUR = [247, 216, 74]    // jaune fluo, posé en transparence
const FOURMI = '#E3262F'

// Encres des règles à plus de deux couleurs (la couleur 0 = papier)
const ENCRES = ['#1A2238', '#2D7F8C', '#C2872C', '#6B4EA0', '#3E8B57', '#3D63B5', '#98683D', '#BE4C86', '#2B9A9A', '#7C8C2E', '#9A4630']
// Carte des passages : de l'encre diluée à l'encre pure
const PASSAGES = [[214, 230, 236], [141, 181, 201], [63, 111, 154], [26, 34, 56]]
const AUTRES_FOURMIS = ['#E3262F', '#0E7C86', '#D98E04', '#7B3FA0', '#2E8B57', '#1F4FBF']

const hex = (h) => [1, 3, 5].map((k) => parseInt(h.slice(k, k + 2), 16))
const pack = (r, g, b, a = 255) => ((a << 24) | (b << 16) | (g << 8) | r) >>> 0

function melange(stops, t) {
  const x = Math.min(1, Math.max(0, t)) * (stops.length - 1)
  const k = Math.min(stops.length - 2, Math.floor(x))
  const f = x - k
  return stops[k].map((v, j) => Math.round(v + (stops[k + 1][j] - v) * f))
}

// Couleur RVB de chaque couleur de case (null = papier)
export function palette(n) {
  return Array.from({ length: n }, (_, c) => (c === 0 ? null : hex(ENCRES[(c - 1) % ENCRES.length])))
}
export const couleurCss = (rvb) => (rvb ? `rgb(${rvb.join(',')})` : PAPIER)
export const couleurFourmi = (k) => AUTRES_FOURMIS[k % AUTRES_FOURMIS.length]

export function creerRendu(canvas, monde) {
  const ctx = canvas.getContext('2d')
  let m = monde
  let off, octx, img, px
  let pal = null
  let palPour = 0
  const cam = { x: m.W / 2, y: m.H / 2, zoom: 20 }

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

  const css = () => canvas.width / (canvas.clientWidth || canvas.width) // pixels écran par pixel CSS
  const zoomMin = () => Math.min(canvas.width / m.W, canvas.height / m.H) * 0.85
  const zoomMax = () => 48 * css()
  const borner = (z) => Math.min(zoomMax(), Math.max(zoomMin(), z))

  // Cadrage auto : garde toute la zone active à l'écran, en douceur
  function cadrer(douceur = 0.07) {
    const b = m.boite
    if (!b) return
    const marge = 6 + 0.12 * Math.max(b.x1 - b.x0, b.y1 - b.y0)
    const bw = b.x1 - b.x0 + 1 + 2 * marge
    const bh = b.y1 - b.y0 + 1 + 2 * marge
    const z = Math.min(borner(Math.min(canvas.width / bw, canvas.height / bh)), 22 * css())
    const cx = (b.x0 + b.x1 + 1) / 2
    const cy = (b.y0 + b.y1 + 1) / 2
    cam.x += (cx - cam.x) * douceur
    cam.y += (cy - cam.y) * douceur
    cam.zoom = Math.exp(Math.log(cam.zoom) + (Math.log(z) - Math.log(cam.zoom)) * douceur)
  }

  function peindreGrille(effets, pasParImage) {
    const b = m.boite
    if (!b) return
    const { W, couleur, mur, passages, dernier, pas } = m
    if (palPour !== m.regle.couleurs) { pal = palette(m.regle.couleurs); palPour = m.regle.couleurs }
    const packs = pal.map((c) => (c ? pack(...c) : 0))
    const murPack = pack(...GRAPHITE)
    const carte = effets.passages
    const lmax = Math.log1p(m.maxPassages || 1)
    // Surligneur : les ~20 dernières images, qui s'estompent vite
    const duree = effets.surligneur ? Math.max(60, pasParImage * 20) : 0

    for (let y = b.y0; y <= b.y1; y++) {
      for (let i = y * W + b.x0, fin = y * W + b.x1; i <= fin; i++) {
        if (mur[i]) { px[i] = murPack; continue }
        const p = passages[i]
        if (!p) { px[i] = 0; continue }

        let rvb = carte ? melange(PASSAGES, Math.log1p(p) / lmax) : pal[couleur[i]]
        const age = duree ? pas - dernier[i] : Infinity
        if (age >= duree) { px[i] = carte ? pack(...rvb) : packs[couleur[i]]; continue }

        // Surligneur posé en transparence : sur le papier il colore, sur l'encre il disparaît presque
        let f = 1 - age / duree
        f = f * f * 0.85
        if (!rvb) {
          px[i] = pack(...SURLIGNEUR, Math.round(255 * f))
        } else {
          rvb = rvb.map((v, j) => Math.round(v * (1 - f + (f * SURLIGNEUR[j]) / 255)))
          px[i] = pack(...rvb)
        }
      }
    }
    octx.putImageData(img, 0, 0, b.x0, b.y0, b.x1 - b.x0 + 1, b.y1 - b.y0 + 1)
  }

  // Quadrillage : traits fins à chaque case quand on zoome, traits plus marqués toutes les 10 cases
  function quadriller(ox, oy, z) {
    const zc = z / css()
    if (zc < 2) return
    const cw = canvas.width
    const ch = canvas.height
    const x0 = Math.max(0, Math.floor(-ox / z))
    const x1 = Math.min(m.W, Math.ceil((cw - ox) / z))
    const y0 = Math.max(0, Math.floor(-oy / z))
    const y1 = Math.min(m.H, Math.ceil((ch - oy) / z))
    const haut = Math.max(0, oy)
    const bas = Math.min(ch, oy + m.H * z)
    const gauche = Math.max(0, ox)
    const droite = Math.min(cw, ox + m.W * z)

    const tracer = (filtre, alpha) => {
      ctx.strokeStyle = `rgba(${QUADRILLAGE}, ${alpha})`
      ctx.beginPath()
      for (let x = x0; x <= x1; x++) {
        if (!filtre(x)) continue
        const sx = Math.round(ox + x * z) + 0.5
        ctx.moveTo(sx, haut)
        ctx.lineTo(sx, bas)
      }
      for (let y = y0; y <= y1; y++) {
        if (!filtre(y)) continue
        const sy = Math.round(oy + y * z) + 0.5
        ctx.moveTo(gauche, sy)
        ctx.lineTo(droite, sy)
      }
      ctx.stroke()
    }

    ctx.lineWidth = 1
    if (zc >= 5) tracer((k) => k % 10 !== 0, Math.min(1, (zc - 5) / 8) * 0.22)
    tracer((k) => k % 10 === 0, Math.min(1, (zc - 2) / 4) * 0.4)
  }

  function dessiner({ effets, pasParImage = 1, auto = true, marques = [] }) {
    if (auto) cadrer()
    peindreGrille(effets, pasParImage)

    const e = css()
    const cw = canvas.width
    const ch = canvas.height
    const z = cam.zoom
    const ox = cw / 2 - cam.x * z
    const oy = ch / 2 - cam.y * z

    ctx.setTransform(1, 0, 0, 1, 0, 0)
    ctx.globalAlpha = 1
    ctx.fillStyle = BUREAU
    ctx.fillRect(0, 0, cw, ch)

    // La feuille, avec une ombre portée sur le bureau
    ctx.save()
    ctx.shadowColor = 'rgba(0, 0, 0, .55)'
    ctx.shadowBlur = 28 * e
    ctx.shadowOffsetY = 6 * e
    ctx.fillStyle = PAPIER
    ctx.fillRect(ox, oy, m.W * z, m.H * z)
    ctx.restore()

    if (effets.quadrillage) quadriller(ox, oy, z)

    ctx.imageSmoothingEnabled = false
    ctx.drawImage(off, ox, oy, m.W * z, m.H * z)

    // Fourmis : triangle orienté quand on zoome, point sinon, cerné de papier pour rester lisible
    m.fourmis.forEach((f, k) => {
      const sx = ox + (f.x + 0.5) * z
      const sy = oy + (f.y + 0.5) * z
      ctx.fillStyle = m.departs.length > 1 ? couleurFourmi(k) : FOURMI
      ctx.strokeStyle = PAPIER
      ctx.lineWidth = 1.5 * e
      ctx.beginPath()
      if (z >= 9 * e) {
        const r = z * 0.44
        const a = (f.dir * Math.PI) / 2
        ctx.moveTo(sx + Math.sin(a) * r, sy - Math.cos(a) * r)
        ctx.lineTo(sx + Math.sin(a + 2.4) * r, sy - Math.cos(a + 2.4) * r)
        ctx.lineTo(sx + Math.sin(a - 2.4) * r, sy - Math.cos(a - 2.4) * r)
        ctx.closePath()
      } else {
        ctx.arc(sx, sy, Math.max(3.5 * e, z * 0.7), 0, Math.PI * 2)
      }
      ctx.fill()
      ctx.stroke()
    })

    // Repères de la visite guidée : un cercle au crayon rouge
    for (const { x, y } of marques) {
      ctx.strokeStyle = FOURMI
      ctx.lineWidth = 2 * e
      ctx.beginPath()
      ctx.arc(ox + (x + 0.5) * z, oy + (y + 0.5) * z, Math.max(24 * e, z * 4), 0, Math.PI * 2)
      ctx.stroke()
    }
  }

  // Coordonnées canvas (pixels) → case
  function versCase(sx, sy) {
    const z = cam.zoom
    return {
      x: Math.floor((sx - canvas.width / 2) / z + cam.x),
      y: Math.floor((sy - canvas.height / 2) / z + cam.y),
    }
  }

  // Zoom autour d'un point de l'écran (la case sous le curseur ne bouge pas)
  function zoomer(facteur, sx = canvas.width / 2, sy = canvas.height / 2) {
    const z0 = cam.zoom
    const z1 = borner(z0 * facteur)
    const wx = (sx - canvas.width / 2) / z0 + cam.x
    const wy = (sy - canvas.height / 2) / z0 + cam.y
    cam.zoom = z1
    cam.x = wx - (sx - canvas.width / 2) / z1
    cam.y = wy - (sy - canvas.height / 2) / z1
  }

  function deplacer(dx, dy) {
    cam.x -= dx / cam.zoom
    cam.y -= dy / cam.zoom
  }

  function recentrer() {
    for (let k = 0; k < 200; k++) cadrer(0.2)
  }

  function changerMonde(nouveau) {
    m = nouveau
    palPour = 0
    preparer()
  }

  preparer()
  recentrer()

  return { dessiner, vider, versCase, zoomer, deplacer, recentrer, changerMonde, camera: cam }
}
