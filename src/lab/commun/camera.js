// ============================================================
//  CAMÉRA COMMUNE : zoom, déplacement, cadrage auto, quadrillage
//  Les coordonnées du monde sont en cases ; celles de l'écran en
//  pixels réels du canvas. zoom = pixels par case.
//  Un monde borné (largeur × hauteur) limite le dézoom à sa taille ;
//  un monde infini (largeur = Infinity) peut dézoomer très loin.
// ============================================================

export function creerCamera(canvas, { largeur, hauteur, zoomMaxCss = 48, cadrageMaxCss = 22 }) {
  const cam = { x: Number.isFinite(largeur) ? largeur / 2 : 0, y: Number.isFinite(hauteur) ? hauteur / 2 : 0, zoom: 20 }
  const monde = { largeur, hauteur }

  const css = () => canvas.width / (canvas.clientWidth || canvas.width) // pixels écran par pixel CSS
  const borne = () => Number.isFinite(monde.largeur)
  const zoomMin = () => (borne() ? Math.min(canvas.width / monde.largeur, canvas.height / monde.hauteur) * 0.85 : 2 ** -48)
  const zoomMax = () => zoomMaxCss * css()
  const borner = (z) => Math.min(zoomMax(), Math.max(zoomMin(), z))

  // Cadrage auto : garde la boîte { x0, y0, x1, y1 } à l'écran, en douceur
  function cadrer(boite, douceur = 0.07) {
    if (!boite) return
    const marge = 6 + 0.12 * Math.max(boite.x1 - boite.x0, boite.y1 - boite.y0)
    const bw = boite.x1 - boite.x0 + 1 + 2 * marge
    const bh = boite.y1 - boite.y0 + 1 + 2 * marge
    const z = Math.min(borner(Math.min(canvas.width / bw, canvas.height / bh)), cadrageMaxCss * css())
    const cx = (boite.x0 + boite.x1 + 1) / 2
    const cy = (boite.y0 + boite.y1 + 1) / 2
    cam.x += (cx - cam.x) * douceur
    cam.y += (cy - cam.y) * douceur
    cam.zoom = Math.exp(Math.log(cam.zoom) + (Math.log(z) - Math.log(cam.zoom)) * douceur)
  }

  // Cadrage immédiat (au chargement d'un motif, par exemple)
  function recentrer(boite) {
    if (!boite) return
    for (let k = 0; k < 200; k++) cadrer(boite, 0.2)
  }

  // Origine de la grille à l'écran : la case (x, y) commence au pixel (ox + x·z, oy + y·z)
  const origine = () => ({ ox: canvas.width / 2 - cam.x * cam.zoom, oy: canvas.height / 2 - cam.y * cam.zoom, z: cam.zoom })

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

  // Quadrillage : traits fins à chaque case quand on zoome, plus marqués toutes les 10 cases
  function quadriller(ctx, couleurGrille) {
    const { ox, oy, z } = origine()
    const zc = z / css()
    if (zc < 2) return
    const cw = canvas.width
    const ch = canvas.height
    const W = borne() ? monde.largeur : Infinity
    const H = borne() ? monde.hauteur : Infinity
    const x0 = Math.max(borne() ? 0 : -Infinity, Math.floor(-ox / z))
    const x1 = Math.min(W, Math.ceil((cw - ox) / z))
    const y0 = Math.max(borne() ? 0 : -Infinity, Math.floor(-oy / z))
    const y1 = Math.min(H, Math.ceil((ch - oy) / z))
    const haut = borne() ? Math.max(0, oy) : 0
    const bas = borne() ? Math.min(ch, oy + H * z) : ch
    const gauche = borne() ? Math.max(0, ox) : 0
    const droite = borne() ? Math.min(cw, ox + W * z) : cw
    const mod10 = (k) => ((k % 10) + 10) % 10

    const tracer = (filtre, alpha) => {
      ctx.strokeStyle = `rgba(${couleurGrille}, ${alpha})`
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
    if (zc >= 5) tracer((k) => mod10(k) !== 0, Math.min(1, (zc - 5) / 8) * 0.6)
    tracer((k) => mod10(k) === 0, Math.min(1, (zc - 2) / 4))
  }

  // Change la taille du monde (Infinity = sans bord)
  function redimensionner(l, h) {
    monde.largeur = l
    monde.hauteur = h
  }

  return { camera: cam, css, borner, cadrer, recentrer, origine, versCase, zoomer, deplacer, quadriller, redimensionner }
}
