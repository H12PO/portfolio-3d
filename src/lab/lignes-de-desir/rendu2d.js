import { SOL } from './moteur.js'

// ============================================================
//  LIGNES DE DÉSIR : le dessin 2D (Canvas)
//  Le sol est peint dans une petite image d'un pixel par case (le
//  terrain, mis en cache, plus l'usure ou les phéromones de l'image),
//  agrandie avec lissage. Par-dessus : arbres, portes, marcheurs.
// ============================================================

export const FOND = '#0b0d12'
// pressés, ordinaires, flâneurs
export const COULEURS_TYPES = ['#E69F00', '#f1f3f7', '#56B4E9']
export const COULEUR_MARCHEUR = '#f7f3e8'
export const VUES = ['sol', 'types']

// Les matières, en RVB
const PALETTES = {
  herbe: { neuf: [62, 104, 58], use: [150, 128, 88], nu: [176, 150, 104], pave: [150, 152, 158], bati: [36, 40, 52], toit: [52, 58, 74], cloture: [222, 212, 186], arbre: [30, 62, 34] },
  sol: { neuf: [44, 52, 68], use: [92, 106, 132], nu: [120, 136, 164], pave: [58, 66, 84], bati: [20, 23, 31], toit: [30, 34, 46], cloture: [214, 200, 160], arbre: [30, 62, 34] },
  sable: { neuf: [64, 54, 40], use: [64, 54, 40], nu: [64, 54, 40], pave: [80, 70, 54], bati: [22, 20, 18], toit: [34, 30, 26], cloture: [200, 180, 140], arbre: [30, 62, 34] },
}

// Un léger grain, fixe pour chaque case : l'herbe n'est pas d'un vert uniforme
function grain(k) {
  let x = (k * 2654435761) >>> 0
  x ^= x >>> 15; x = Math.imul(x, 2246822507) >>> 0; x ^= x >>> 13
  return ((x & 255) / 255 - 0.5)
}

/**
 * Le peintre du sol : une image d'un pixel par case (terrain en cache,
 * plus l'usure ou les phéromones). Partagé par la 2D et la 3D (texture).
 */
export function creerPeintre() {
  let petit = null        // canvas d'un pixel par case
  let pctx = null
  let pixels = null       // ImageData du petit canvas
  let base = null         // couleurs du terrain sans usure (RVB par case), et si la case s'use
  let cle = ''            // version du sol en cache
  let sol = null
  let arbres = []

  function preparerSol(img) {
    if (!petit || petit.width !== img.W || petit.height !== img.H) {
      petit = typeof OffscreenCanvas !== 'undefined' ? new OffscreenCanvas(img.W, img.H) : Object.assign(document.createElement('canvas'), { width: img.W, height: img.H })
      pctx = petit.getContext('2d')
      pixels = pctx.createImageData(img.W, img.H)
    }
    const P = PALETTES[img.fond] ?? PALETTES.herbe
    const n = img.W * img.H
    base = new Float32Array(n * 4)
    for (let k = 0; k < n; k++) {
      const s = sol[k]
      const g = grain(k)
      let c
      if (s === SOL.PAVE) c = P.pave
      else if (s === SOL.BATI) {
        // un liseré plus clair au bord des bâtiments : on lit les toits
        const i = k % img.W, j = (k - i) / img.W
        const bord = (i > 0 && sol[k - 1] !== SOL.BATI) || (i < img.W - 1 && sol[k + 1] !== SOL.BATI) || (j > 0 && sol[k - img.W] !== SOL.BATI) || (j < img.H - 1 && sol[k + img.W] !== SOL.BATI)
        c = bord ? P.toit : P.bati
      } else if (s === SOL.CLOTURE) c = P.cloture
      else if (s === SOL.ARBRE) c = P.arbre
      else c = P.neuf
      const amp = s === SOL.HERBE ? 10 : s === SOL.PAVE ? 6 : 3
      base[4 * k] = c[0] + g * amp; base[4 * k + 1] = c[1] + g * amp; base[4 * k + 2] = c[2] + g * amp
      base[4 * k + 3] = s === SOL.HERBE ? 1 : 0     // seule l'herbe s'use
    }
  }

  /** Met l'image à jour ; renvoie le petit canvas (ou null si le sol n'est pas encore connu) */
  function peindre(img) {
    if (img.sol) { sol = img.sol; arbres = img.arbres ?? [] }
    if (!sol) return null
    const nouvelle = `${img.version}|${img.W}|${img.H}|${img.fond}`
    if (nouvelle !== cle) { cle = nouvelle; preparerSol(img) }
    const P = PALETTES[img.fond] ?? PALETTES.herbe
    const d = pixels.data
    const n = img.W * img.H
    const fourmis = img.modele === 'fourmis'
    for (let k = 0; k < n; k++) {
      let r = base[4 * k], g = base[4 * k + 1], b = base[4 * k + 2]
      if (fourmis) {
        // phéromones : vers le nid en bleu, vers la nourriture en orange
        const p1 = img.champ[k] / 255, p2 = img.champ2[k] / 255
        r += p1 * 40 + p2 * 230; g += p1 * 110 + p2 * 120; b += p1 * 230 + p2 * 30
      } else if (base[4 * k + 3]) {
        const u = img.champ[k] / 255
        // l'herbe jaunit, puis la terre apparaît
        const a = Math.min(1, u * 1.6), c2 = Math.max(0, u * 1.6 - 0.6)
        r = r + (P.use[0] - r) * a + (P.nu[0] - P.use[0]) * c2
        g = g + (P.use[1] - g) * a + (P.nu[1] - P.use[1]) * c2
        b = b + (P.use[2] - b) * a + (P.nu[2] - P.use[2]) * c2
      }
      d[4 * k] = r; d[4 * k + 1] = g; d[4 * k + 2] = b; d[4 * k + 3] = 255
    }
    pctx.putImageData(pixels, 0, 0)
    return petit
  }

  return { peindre, get sol() { return sol }, get arbres() { return arbres } }
}

export function creerRendu2D(canvas) {
  const ctx = canvas.getContext('2d')
  const peintre = creerPeintre()
  let t = { s: 1, ox: 0, oy: 0 }

  function redimensionner() {
    const e = Math.min(window.devicePixelRatio || 1, 2)
    const w = Math.max(1, Math.round(canvas.clientWidth * e))
    const h = Math.max(1, Math.round(canvas.clientHeight * e))
    if (canvas.width !== w || canvas.height !== h) { canvas.width = w; canvas.height = h }
  }

  function cadrer(img) {
    const w = canvas.width, h = canvas.height
    const marge = Math.round(Math.min(w, h) * 0.02)
    const s = Math.min((w - 2 * marge) / (img.W * img.h), (h - 2 * marge) / (img.H * img.h))
    t = { s, ox: (w - s * img.W * img.h) / 2, oy: (h - s * img.H * img.h) / 2 }
  }
  const X = (x) => t.ox + x * t.s
  const Y = (y) => t.oy + y * t.s

  /**
   * @param img image du simulateur (sol joint seulement s'il a changé : on garde le dernier)
   * @param o   { vue: 'sol' | 'types', noms: bool }
   */
  function dessiner(img, o = {}) {
    const petit = peintre.peindre(img)
    if (!petit) return
    cadrer(img)
    const fourmis = img.modele === 'fourmis'
    const arbres = peintre.arbres

    ctx.fillStyle = FOND
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    ctx.imageSmoothingEnabled = true
    ctx.imageSmoothingQuality = 'high'
    ctx.drawImage(petit, X(0), Y(0), img.W * img.h * t.s, img.H * img.h * t.s)

    // les houppiers des arbres
    if (arbres.length) {
      ctx.fillStyle = 'rgba(28, 58, 32, 0.92)'
      ctx.strokeStyle = 'rgba(120, 170, 110, 0.35)'
      ctx.lineWidth = 1
      ctx.beginPath()
      for (const [ax, ay, r] of arbres) {
        const R = Math.max(r * 2.6, 2.2) * t.s
        ctx.moveTo(X(ax) + R, Y(ay))
        ctx.arc(X(ax), Y(ay), R, 0, 2 * Math.PI)
      }
      ctx.fill()
      ctx.stroke()
    }

    // zones de comptage (double pont)
    if (img.zones?.length) {
      ctx.setLineDash([4, 4])
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.45)'
      ctx.fillStyle = 'rgba(255, 255, 255, 0.75)'
      ctx.font = `${Math.round(11 * Math.min(window.devicePixelRatio || 1, 2))}px system-ui, sans-serif`
      for (const z of img.zones) {
        ctx.strokeRect(X(z.x0), Y(z.y0), (z.x1 - z.x0) * t.s, (z.y1 - z.y0) * t.s)
        ctx.fillText(z.nom, X(z.x0) + 3, Y(z.y0) - 4)
      }
      ctx.setLineDash([])
    }

    // agents
    const e = Math.min(window.devicePixelRatio || 1, 2)
    const A = img.agents
    if (fourmis) {
      const r = Math.max(1.2 * e, 0.12 * t.s)
      ctx.fillStyle = '#1b0f0c'
      ctx.beginPath()
      for (let i = 0; i < img.na; i++) { const x = X(A[4 * i]), y = Y(A[4 * i + 1]); ctx.moveTo(x + r, y); ctx.arc(x, y, r, 0, 2 * Math.PI) }
      ctx.fill()
      ctx.fillStyle = '#ffd27a'
      ctx.beginPath()
      for (let i = 0; i < img.na; i++) {
        if (!A[4 * i + 2]) continue
        const c = A[4 * i + 3]
        const x = X(A[4 * i] + Math.cos(c) * 0.12), y = Y(A[4 * i + 1] + Math.sin(c) * 0.12)
        ctx.moveTo(x + r * 0.8, y); ctx.arc(x, y, r * 0.8, 0, 2 * Math.PI)
      }
      ctx.fill()
    } else {
      const r = Math.max(1.6 * e, 0.32 * t.s)
      const parType = o.vue === 'types'
      for (let ty = 0; ty < (parType ? 3 : 1); ty++) {
        ctx.fillStyle = parType ? COULEURS_TYPES[ty] : COULEUR_MARCHEUR
        ctx.beginPath()
        for (let i = 0; i < img.na; i++) {
          if (parType && A[4 * i + 2] !== ty) continue
          const x = X(A[4 * i]), y = Y(A[4 * i + 1])
          ctx.moveTo(x + r, y); ctx.arc(x, y, r, 0, 2 * Math.PI)
        }
        ctx.fill()
      }
    }

    // portes
    const taille = Math.max(5 * e, 0.9 * t.s)
    ctx.font = `600 ${Math.round(11 * e)}px system-ui, sans-serif`
    ctx.textBaseline = 'middle'
    for (const po of img.portes) {
      const x = X(po.x), y = Y(po.y)
      ctx.fillStyle = po.type === 'nid' ? '#7fb2ff' : po.type === 'nourriture' ? '#ffb347' : '#ffd84a'
      ctx.strokeStyle = 'rgba(11, 13, 18, 0.9)'
      ctx.lineWidth = 2 * e
      ctx.beginPath()
      if (po.type === 'porte') ctx.rect(x - taille / 2, y - taille / 2, taille, taille)
      else ctx.arc(x, y, taille * 0.75, 0, 2 * Math.PI)
      ctx.stroke(); ctx.fill()
      if (o.noms !== false && po.nom) {
        const droite = x < canvas.width * 0.7
        ctx.textAlign = droite ? 'left' : 'right'
        ctx.lineWidth = 3 * e
        ctx.strokeText(po.nom, x + (droite ? 1 : -1) * (taille * 0.9 + 3 * e), y)
        ctx.fillStyle = 'rgba(255, 255, 255, 0.92)'
        ctx.fillText(po.nom, x + (droite ? 1 : -1) * (taille * 0.9 + 3 * e), y)
      }
    }
  }

  // Pixels du canvas → mètres
  const versMonde = (px, py) => [(px - t.ox) / t.s, (py - t.oy) / t.s]
  const echelle = () => t.s

  return { redimensionner, dessiner, versMonde, echelle }
}
