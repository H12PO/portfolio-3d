import { useEffect, useMemo, useRef, useState } from 'react'
import Graphique from '../commun/Graphique'
import Crans from '../commun/Crans'
import { generateur } from '../commun/aleatoire'
import { preparer } from '../commun/graphes'
import { rendreCPU, buddhaCPU } from './cpu.js'

// ============================================================
//  FIGURES DES ONGLETS THÉORIE ET APPLICATIONS
//  Tout est calculé dans le navigateur : constructions de Cantor,
//  Koch et Sierpiński, jeu du chaos, comptage de boîtes, littoral
//  mesuré à la règle, relief aléatoire, agrégation limitée par
//  diffusion. Les couleurs viennent des variables CSS du thème.
// ============================================================

const couleur = (el, nom) => (el ? getComputedStyle(el).getPropertyValue(nom).trim() : '') || '#1E7A50'
const log = Math.log

// Droite des moindres carrés : [pente, ordonnée à l'origine]
function droite(points) {
  const n = points.length
  const mx = points.reduce((s, p) => s + p[0], 0) / n
  const my = points.reduce((s, p) => s + p[1], 0) / n
  let a = 0
  let b = 0
  for (const [x, y] of points) {
    a += (x - mx) * (y - my)
    b += (x - mx) ** 2
  }
  const pente = a / b
  return [pente, my - pente * mx]
}

// Un choix parmi quelques options, en boutons groupés
function Choix({ options, valeur, onChange, libelle }) {
  return (
    <div className="groupe fr-choix" role="group" aria-label={libelle}>
      {options.map(([id, nom]) => (
        <button key={id} aria-pressed={id === valeur} onClick={() => onChange(id)}>{nom}</button>
      ))}
    </div>
  )
}

/* ---------- Théorie 1 : Cantor, Koch, Sierpiński, étape par étape ---------- */

const CONSTRUCTIONS = {
  cantor: { N: 2, k: 3, max: 6 },
  koch: { N: 4, k: 3, max: 5 },
  sierpinski: { N: 3, k: 2, max: 7 },
}
const VW = 400
const VH = 340

function cantor(n) {
  const rangs = []
  let segs = [[20, 380]]
  for (let j = 0; j <= n; j++) {
    rangs.push(segs)
    segs = segs.flatMap(([a, b]) => {
      const t = (b - a) / 3
      return [[a, a + t], [b - t, b]]
    })
  }
  const h = Math.min(22, 260 / (n + 1))
  const y0 = (VH - (n + 1) * h * 1.6) / 2
  return rangs.flatMap((r, j) => r.map(([a, b]) => `M${a.toFixed(2)} ${(y0 + j * h * 1.6).toFixed(1)}h${Math.max(0.6, b - a).toFixed(2)}v${h.toFixed(1)}h${-Math.max(0.6, b - a).toFixed(2)}Z`)).join('')
}

function koch(n) {
  const s = 270
  const h = (s * Math.sqrt(3)) / 2
  const x0 = (VW - s) / 2
  const y0 = (VH - h * (4 / 3)) / 2 + h / 3
  let pts = [[x0, y0], [x0 + s, y0], [x0 + s / 2, y0 + h], [x0, y0]]
  const c = Math.cos(-Math.PI / 3)
  const sn = Math.sin(-Math.PI / 3)
  for (let j = 0; j < n; j++) {
    const suiv = [pts[0]]
    for (let i = 0; i + 1 < pts.length; i++) {
      const [ax, ay] = pts[i]
      const [bx, by] = pts[i + 1]
      const dx = (bx - ax) / 3
      const dy = (by - ay) / 3
      const p1 = [ax + dx, ay + dy]
      // le tiers du milieu devient une pointe tournée vers l'extérieur (rotation de −60°)
      const p2 = [p1[0] + dx * c - dy * sn, p1[1] + dx * sn + dy * c]
      suiv.push(p1, p2, [ax + 2 * dx, ay + 2 * dy], [bx, by])
    }
    pts = suiv
  }
  return `M${pts.map(([x, y]) => `${x.toFixed(2)} ${y.toFixed(2)}`).join('L')}Z`
}

function sierpinski(n) {
  const s = 320
  const h = (s * Math.sqrt(3)) / 2
  let tri = [[[(VW - s) / 2, (VH + h) / 2], [(VW + s) / 2, (VH + h) / 2], [VW / 2, (VH - h) / 2]]]
  for (let j = 0; j < n; j++) {
    tri = tri.flatMap(([a, b, c]) => {
      const m = (p, q) => [(p[0] + q[0]) / 2, (p[1] + q[1]) / 2]
      const ab = m(a, b)
      const bc = m(b, c)
      const ca = m(c, a)
      return [[a, ab, ca], [ab, b, bc], [ca, bc, c]]
    })
  }
  return tri.map((t) => `M${t.map(([x, y]) => `${x.toFixed(2)} ${y.toFixed(2)}`).join('L')}Z`).join('')
}

export function FigureConstruction({ txt, fmt }) {
  const [forme, setForme] = useState('koch')
  const [n, setN] = useState(2)
  const { N, k, max } = CONSTRUCTIONS[forme]
  const m = Math.min(n, max)
  const chemin = useMemo(() => (forme === 'cantor' ? cantor(m) : forme === 'koch' ? koch(m) : sierpinski(m)), [forme, m])
  const morceaux = forme === 'koch' ? 3 * N ** m : N ** m
  const mesure = forme === 'cantor' ? (2 / 3) ** m : forme === 'koch' ? (4 / 3) ** m : (3 / 4) ** m
  const f = (v) => fmt(v, { maximumFractionDigits: 3 })

  return (
    <figure className="figure figure--large">
      <Choix options={Object.keys(CONSTRUCTIONS).map((id) => [id, txt.noms[id]])} valeur={forme} onChange={(id) => { setForme(id); setN(Math.min(n, CONSTRUCTIONS[id].max)) }} libelle={txt.choix} />
      <svg className="fr-construction" viewBox={`0 0 ${VW} ${VH}`} role="img" aria-label={`${txt.noms[forme]}, ${txt.etape} ${m}`}>
        <path d={chemin} className={forme === 'koch' ? 'fr-trait' : 'fr-plein'} />
      </svg>
      <Crans valeur={m} max={max} onChange={setN} libelle={txt.etape} texte={String(m)} />
      <figcaption>
        <p className="figure-etat">{txt.mesure[forme](fmt(morceaux), f(mesure))}</p>
        <p className="figure-etat">{txt.dimension(N, k, f(log(N) / log(k)))}</p>
        <p>{txt.legende[forme]}</p>
      </figcaption>
    </figure>
  )
}

/* ---------- Théorie 2 : compter les boîtes ---------- */

const R = 1024 // trame fine sur laquelle on compte

function trameKoch() {
  const t = new Uint8Array(R * R)
  let pts = [[0, 0], [1, 0]]
  const c = Math.cos(Math.PI / 3)
  const s = Math.sin(Math.PI / 3)
  for (let j = 0; j < 8; j++) {
    const suiv = [pts[0]]
    for (let i = 0; i + 1 < pts.length; i++) {
      const [ax, ay] = pts[i]
      const [bx, by] = pts[i + 1]
      const dx = (bx - ax) / 3
      const dy = (by - ay) / 3
      const p1 = [ax + dx, ay + dy]
      suiv.push(p1, [p1[0] + dx * c - dy * s, p1[1] + dx * s + dy * c], [ax + 2 * dx, ay + 2 * dy], [bx, by])
    }
    pts = suiv
  }
  for (let i = 0; i + 1 < pts.length; i++) {
    for (let u = 0; u < 1; u += 0.25) {
      const x = pts[i][0] + u * (pts[i + 1][0] - pts[i][0])
      const y = pts[i][1] + u * (pts[i + 1][1] - pts[i][1])
      t[Math.min(R - 1, Math.floor((0.35 + y) * (R - 1))) * R + Math.min(R - 1, Math.floor(x * (R - 1)))] = 1
    }
  }
  return t
}

function trameSierpinski() {
  const t = new Uint8Array(R * R)
  const coins = [[0, 0], [1, 0], [0.5, Math.sqrt(3) / 2]]
  const alea = generateur(3)
  let x = 0.3
  let y = 0.3
  for (let i = 0; i < 600000; i++) {
    const [cx, cy] = coins[Math.floor(alea() * 3)]
    x = (x + cx) / 2
    y = (y + cy) / 2
    if (i > 20) t[Math.floor((0.07 + y) * (R - 1)) * R + Math.floor(x * (R - 1))] = 1
  }
  return t
}

// Le bord de la Julia du lapin de Douady : points de l'intérieur voisins de l'extérieur
function trameJulia() {
  const dedans = new Uint8Array(R * R)
  const [cr, ci] = [-0.122561, 0.744862]
  for (let j = 0; j < R; j++) {
    for (let i = 0; i < R; i++) {
      let x = -1.6 + (3.2 * i) / R
      let y = -1.6 + (3.2 * j) / R
      let k = 0
      for (; k < 250 && x * x + y * y < 4; k++) {
        const t = x * x - y * y + cr
        y = 2 * x * y + ci
        x = t
      }
      dedans[j * R + i] = k === 250 ? 1 : 0
    }
  }
  const t = new Uint8Array(R * R)
  for (let j = 1; j < R - 1; j++) {
    for (let i = 1; i < R - 1; i++) {
      const v = j * R + i
      if (dedans[v] && (!dedans[v - 1] || !dedans[v + 1] || !dedans[v - R] || !dedans[v + R])) t[v] = 1
    }
  }
  return t
}

const TRAMES = { koch: trameKoch, sierpinski: trameSierpinski, julia: trameJulia }
const EXACTES = { koch: log(4) / log(3), sierpinski: log(3) / log(2), julia: null }
const TAILLES = [2, 4, 8, 16, 32, 64, 128] // côté des boîtes, en points de la trame
const cacheTrames = {}

function compter(t, s) {
  const n = Math.ceil(R / s)
  const vu = new Uint8Array(n * n)
  let total = 0
  for (let j = 0; j < R; j++) {
    for (let i = 0; i < R; i++) {
      if (!t[j * R + i]) continue
      const b = Math.floor(j / s) * n + Math.floor(i / s)
      if (!vu[b]) { vu[b] = 1; total++ }
    }
  }
  return { total, vu, n }
}

export function FigureBoites({ txt, fmt }) {
  const [forme, setForme] = useState('koch')
  const [k, setK] = useState(3)
  const [mesure, setMesure] = useState(null) // { forme, comptes: [{ s, total, vu, n }] }
  const canvas = useRef(null)

  useEffect(() => {
    const id = setTimeout(() => {
      cacheTrames[forme] ??= TRAMES[forme]()
      const t = cacheTrames[forme]
      setMesure({ forme, trame: t, comptes: TAILLES.map((s) => ({ s, ...compter(t, s) })) })
    }, 30)
    return () => clearTimeout(id)
  }, [forme])

  const pret = mesure?.forme === forme
  useEffect(() => {
    if (!pret) return
    const { ctx, e } = preparer(canvas.current)
    const W = canvas.current.width
    const sig = couleur(canvas.current, '--sig')
    const texte = couleur(canvas.current, '--texte')
    ctx.clearRect(0, 0, W, W)
    const { trame, comptes } = mesure
    const c = comptes[k]
    const taille = (W / R) * c.s
    ctx.globalAlpha = 0.28
    ctx.fillStyle = sig
    for (let j = 0; j < c.n; j++) {
      for (let i = 0; i < c.n; i++) if (c.vu[j * c.n + i]) ctx.fillRect(i * taille, W - (j + 1) * taille, taille, taille)
    }
    ctx.globalAlpha = 1
    ctx.fillStyle = texte
    const p = Math.max(1, Math.round(e))
    for (let j = 0; j < R; j += 2) {
      for (let i = 0; i < R; i += 2) {
        if (trame[j * R + i] || trame[j * R + i + 1] || trame[(j + 1) * R + i] || trame[(j + 1) * R + i + 1]) ctx.fillRect((i * W) / R, W - ((j + 2) * W) / R, p, p)
      }
    }
    if (taille >= 4 * e) {
      ctx.strokeStyle = sig
      ctx.globalAlpha = 0.35
      ctx.lineWidth = 1
      ctx.beginPath()
      for (let i = 0; i <= c.n; i++) {
        ctx.moveTo(i * taille, 0)
        ctx.lineTo(i * taille, W)
        ctx.moveTo(0, W - i * taille)
        ctx.lineTo(W, W - i * taille)
      }
      ctx.stroke()
      ctx.globalAlpha = 1
    }
  }, [pret, mesure, k])

  const points = pret ? mesure.comptes.map((c) => [Math.log2(R / c.s), Math.log2(c.total)]) : []
  const ajust = points.length ? droite(points.slice(1, 6)) : [0, 0]
  const exacte = EXACTES[forme]
  const f2 = (v) => fmt(v, { maximumFractionDigits: 2, minimumFractionDigits: 2 })
  const f3 = (v) => fmt(v, { maximumFractionDigits: 3 })

  return (
    <figure className="figure figure--large">
      <Choix options={Object.keys(TRAMES).map((id) => [id, txt.noms[id]])} valeur={forme} onChange={setForme} libelle={txt.choix} />
      <div className="fr-boites">
        <div>
          <canvas ref={canvas} className="fr-boites-trame" role="img" aria-label={txt.label(txt.noms[forme])} />
          <Crans valeur={k} max={TAILLES.length - 1} onChange={setK} libelle={txt.taille} texte={`1/${R / TAILLES[k]}`} />
          <p className="figure-etat">{pret ? txt.compte(fmt(mesure.comptes[k].total), `1/${R / TAILLES[k]}`) : txt.calcul}</p>
        </div>
        <div>
          {pret && (
            <Graphique
              titre={txt.titreGraphe}
              hauteur={250}
              series={[
                { id: 'mesures', nom: txt.serie, points, couleur: 'var(--sig)', trace: 'points' },
                { id: 'droite', nom: txt.droite, points: [[2.5, ajust[1] + ajust[0] * 2.5], [9.5, ajust[1] + ajust[0] * 9.5]], couleur: 'var(--discret)', trace: 'ligne' },
              ]}
              x={{ min: 2.5, max: 9.5, ticks: [3, 4, 5, 6, 7, 8, 9], titre: txt.axeX, format: (v) => fmt(2 ** v) }}
              y={{ min: 0, max: 16, ticks: [0, 4, 8, 12, 16], titre: txt.axeY, format: (v) => fmt(2 ** v) }}
              info={(x, vals) => txt.info(fmt(2 ** x), fmt(Math.round(2 ** (vals.find((v) => v.serie.id === 'mesures')?.y ?? 0))))}
              resume={txt.resume(f2(ajust[0]))}
            />
          )}
          {pret && <p className="figure-etat">{txt.pente(f2(ajust[0]))}{exacte && ` · ${txt.exacte(f3(exacte))}`}</p>}
        </div>
      </div>
      <figcaption><p>{txt.legende}</p></figcaption>
    </figure>
  )
}

/* ---------- Théorie 3 : le jeu du chaos ---------- */

// x' = a x + b y + e, y' = c x + d y + f, avec une probabilité
const SYSTEMES = {
  sierpinski: [[0.5, 0, 0, 0.5, 0, 0, 1 / 3], [0.5, 0, 0, 0.5, 0.5, 0, 1 / 3], [0.5, 0, 0, 0.5, 0.25, 0.433, 1 / 3]],
  fougere: [[0, 0, 0, 0.16, 0, 0, 0.01], [0.85, 0.04, -0.04, 0.85, 0, 1.6, 0.85], [0.2, -0.26, 0.23, 0.22, 0, 1.6, 0.07], [-0.15, 0.28, 0.26, 0.24, 0, 0.44, 0.07]],
  dragon: [[0.5, -0.5, 0.5, 0.5, 0, 0, 0.5], [-0.5, -0.5, 0.5, -0.5, 1, 0, 0.5]],
}
const POINTS_MAX = 160000

function appliquer(sys, alea, [x, y]) {
  let u = alea()
  let t = sys[sys.length - 1]
  for (const m of sys) {
    if (u < m[6]) { t = m; break }
    u -= m[6]
  }
  return [t[0] * x + t[1] * y + t[4], t[2] * x + t[3] * y + t[5]]
}

export function FigureChaos({ txt, fmt }) {
  const [systeme, setSysteme] = useState('fougere')
  const [essai, setEssai] = useState(0)
  const [n, setN] = useState(0)
  const canvas = useRef(null)

  useEffect(() => {
    const sys = SYSTEMES[systeme]
    const alea = generateur(11 + essai)
    // Les bornes de la figure : on les mesure sur les premiers points
    let p = [0.1, 0.1]
    let [x0, x1, y0, y1] = [Infinity, -Infinity, Infinity, -Infinity]
    for (let i = 0; i < 20000; i++) {
      p = appliquer(sys, alea, p)
      if (i < 50) continue
      x0 = Math.min(x0, p[0]); x1 = Math.max(x1, p[0]); y0 = Math.min(y0, p[1]); y1 = Math.max(y1, p[1])
    }
    const { ctx, e } = preparer(canvas.current)
    const W = canvas.current.width
    const H = canvas.current.height
    const ech = Math.min((W * 0.92) / (x1 - x0), (H * 0.92) / (y1 - y0))
    const ox = (W - (x1 - x0) * ech) / 2
    const oy = (H - (y1 - y0) * ech) / 2
    ctx.clearRect(0, 0, W, H)
    ctx.fillStyle = couleur(canvas.current, '--sig')
    const taille = Math.max(1, Math.round(e))
    let compte = 0
    let raf = 0
    p = [0.1, 0.1]
    const pas = () => {
      const lot = compte < 2000 ? 40 : 4000 // d'abord lentement, pour voir les points se poser
      for (let i = 0; i < lot; i++) {
        p = appliquer(sys, alea, p)
        // les tout premiers points ne sont pas encore sur la figure : on ne les dessine pas
        if (compte + i > 20) ctx.fillRect(ox + (p[0] - x0) * ech, H - oy - (p[1] - y0) * ech, taille, taille)
      }
      compte += lot
      setN(compte)
      if (compte < POINTS_MAX) raf = requestAnimationFrame(pas)
    }
    raf = requestAnimationFrame(pas)
    return () => cancelAnimationFrame(raf)
  }, [systeme, essai])

  return (
    <figure className="figure figure--large">
      <Choix options={Object.keys(SYSTEMES).map((id) => [id, txt.noms[id]])} valeur={systeme} onChange={setSysteme} libelle={txt.choix} />
      <canvas ref={canvas} className="fr-chaos" role="img" aria-label={txt.label(txt.noms[systeme])} />
      <div className="figure-actions">
        <button className="btn" onClick={() => setEssai(essai + 1)}>{txt.recommencer}</button>
        <span className="figure-etat">{txt.points(fmt(n))}</span>
      </div>
      <figcaption><p>{txt.regles[systeme]}</p></figcaption>
    </figure>
  )
}

/* ---------- Applications 1 : mesurer une côte à la règle ---------- */

// Une île : un octogone dont on déplace sans fin le milieu des côtés (déplacement du point milieu)
function ile(graine) {
  const alea = generateur(graine)
  const gauss = () => Math.sqrt(-2 * log(alea() + 1e-12)) * Math.cos(2 * Math.PI * alea())
  let pts = Array.from({ length: 8 }, (_, k) => {
    const a = (k / 8) * 2 * Math.PI
    const r = 0.38 + 0.08 * alea()
    return [0.5 + r * Math.cos(a), 0.5 + r * Math.sin(a)]
  })
  for (let j = 0; j < 10; j++) {
    const suiv = []
    for (let i = 0; i < pts.length; i++) {
      const [ax, ay] = pts[i]
      const [bx, by] = pts[(i + 1) % pts.length]
      // le milieu s'écarte d'une fraction fixe de la longueur du côté : la côte est aussi rugueuse à toutes les échelles
      const g = gauss() * 0.3
      suiv.push([ax, ay], [(ax + bx) / 2 - (by - ay) * g, (ay + by) / 2 + (bx - ax) * g])
    }
    pts = suiv
  }
  return pts
}

// La méthode du compas : on avance de point en point, à distance ε, le long de la côte
function arpenter(pts, eps) {
  const n = pts.length
  const pas = [pts[0]]
  let p = pts[0]
  let i = 0
  while (i < n) {
    let j = i + 1
    while (j <= n && Math.hypot(pts[j % n][0] - p[0], pts[j % n][1] - p[1]) < eps) j++
    if (j > n) break
    // le point exact à distance ε, sur le segment [j − 1, j]
    const a = pts[(j - 1) % n]
    const b = pts[j % n]
    const dx = b[0] - a[0]
    const dy = b[1] - a[1]
    const fx = a[0] - p[0]
    const fy = a[1] - p[1]
    const A = dx * dx + dy * dy
    const B = 2 * (fx * dx + fy * dy)
    const C = fx * fx + fy * fy - eps * eps
    const t = Math.min(1, Math.max(0, (-B + Math.sqrt(Math.max(0, B * B - 4 * A * C))) / (2 * A)))
    p = [a[0] + t * dx, a[1] + t * dy]
    pas.push(p)
    i = j - 1
  }
  const reste = Math.hypot(pts[0][0] - p[0], pts[0][1] - p[1])
  return { pas, longueur: (pas.length - 1) * eps + reste }
}

const REGLES = [0.32, 0.16, 0.08, 0.04, 0.02, 0.01, 0.005]
const LARGEUR_KM = 1000
const versSvg = ([x, y]) => `${(x * 400).toFixed(1)} ${(400 - y * 400).toFixed(1)}`

export function FigureLittoral({ txt, fmt }) {
  const [graine, setGraine] = useState(4)
  const [k, setK] = useState(1)
  const cote = useMemo(() => ile(graine), [graine])
  const mesures = useMemo(() => REGLES.map((e) => arpenter(cote, e)), [cote])
  const chemin = useMemo(() => `M${cote.map(versSvg).join('L')}Z`, [cote])
  const m = mesures[k]
  const regle = `M${m.pas.map(versSvg).join('L')}`
  const points = mesures.map((me, j) => [Math.log10(REGLES[j] * LARGEUR_KM), Math.log10(me.longueur * LARGEUR_KM)])
  const [pente] = droite(points.slice(2))
  const ys = points.map((q) => q[1])
  const y0 = Math.floor(Math.min(...ys) * 10) / 10 - 0.05
  const y1 = Math.ceil(Math.max(...ys) * 10) / 10 + 0.05
  const ticksY = Array.from({ length: Math.round((y1 - y0 - 0.1) * 10) + 1 }, (_, j) => Math.round((y0 + 0.05 + j * 0.1) * 10) / 10)
  const km = (v) => fmt(Math.round(v * LARGEUR_KM))

  return (
    <figure className="figure figure--large">
      <div className="fr-boites">
        <div>
          <svg className="fr-littoral" viewBox="-30 -30 460 460" role="img" aria-label={txt.label}>
            <path d={chemin} className="fr-cote" />
            <path d={regle} className="fr-regle" />
            {m.pas.length < 200 && m.pas.map(([x, y], j) => <circle key={j} cx={x * 400} cy={400 - y * 400} r="2.4" className="fr-regle-pt" />)}
          </svg>
          <Crans valeur={k} max={REGLES.length - 1} onChange={setK} libelle={txt.regle} texte={`${km(REGLES[k])} km`} />
          <p className="figure-etat">{txt.mesure(fmt(m.pas.length), km(m.longueur))}</p>
          <div className="figure-actions"><button className="btn" onClick={() => setGraine(graine + 1)}>{txt.autre}</button></div>
        </div>
        <div>
          <Graphique
            titre={txt.titreGraphe}
            hauteur={250}
            series={[{ id: 'l', nom: txt.serie, points, couleur: 'var(--sig)', trace: 'les deux' }]}
            x={{ min: 0.5, max: 2.6, ticks: [0.7, 1, 1.3, 1.7, 2, 2.3], titre: txt.axeX, format: (v) => fmt(Math.round(10 ** v)) }}
            y={{ min: y0, max: y1, ticks: ticksY, titre: txt.axeY, format: (v) => fmt(Math.round(10 ** v / 100) * 100) }}
            info={(x, vals) => vals.map((v) => txt.info(fmt(Math.round(10 ** x)), fmt(Math.round(10 ** v.y)))).join('')}
            resume={txt.resume(fmt(1 - pente, { maximumFractionDigits: 2 }))}
          />
          <p className="figure-etat">{txt.dimension(fmt(1 - pente, { maximumFractionDigits: 2, minimumFractionDigits: 2 }))}</p>
        </div>
      </div>
      <figcaption><p>{txt.legende}</p></figcaption>
    </figure>
  )
}

/* ---------- Applications 2 : un relief aléatoire, plus ou moins rugueux ---------- */

const NIVEAUX = 9 // 2⁹ + 1 points

function profil(graine, H) {
  const alea = generateur(graine)
  const gauss = () => Math.sqrt(-2 * log(alea() + 1e-12)) * Math.cos(2 * Math.PI * alea())
  const n = 2 ** NIVEAUX
  const y = new Float64Array(n + 1)
  y[0] = gauss() * 0.15
  y[n] = gauss() * 0.15
  // Mêmes tirages quelle que soit la rugosité : seul l'écart à chaque niveau change
  for (let j = 0, pas = n; j < NIVEAUX; j++, pas /= 2) {
    const ampl = 0.5 * 2 ** (-(j + 1) * H)
    for (let i = pas / 2; i < n; i += pas) y[i] = (y[i - pas / 2] + y[i + pas / 2]) / 2 + gauss() * ampl
  }
  return y
}

export function FigureRelief({ txt, fmt }) {
  const [graine, setGraine] = useState(7)
  const [h, setH] = useState(0.5)
  const y = useMemo(() => profil(graine, h), [graine, h])
  let min = Infinity
  let max = -Infinity
  for (const v of y) { min = Math.min(min, v); max = Math.max(max, v) }
  const n = y.length - 1
  const sy = (v) => 205 - ((v - min) / Math.max(1e-9, max - min)) * 160
  const ligne = Array.from(y, (v, i) => `${((i / n) * 600).toFixed(1)} ${sy(v).toFixed(1)}`).join('L')
  const f = (v) => fmt(v, { maximumFractionDigits: 1, minimumFractionDigits: 1 })

  return (
    <figure className="figure figure--large">
      <svg className="fr-relief" viewBox="0 0 600 220" role="img" aria-label={txt.label(f(h), f(2 - h))}>
        <path d={`M0 220L${ligne}L600 220Z`} className="fr-relief-sol" />
        <path d={`M${ligne}`} className="fr-relief-crete" />
      </svg>
      <label className="saut-curseur fr-curseur">
        <span>{txt.rugosite}</span>
        <input type="range" min="0.1" max="0.9" step="0.1" value={h} onChange={(e) => setH(Number(e.target.value))} />
        <output>{txt.valeurs(f(h), f(2 - h))}</output>
      </label>
      <div className="figure-actions"><button className="btn" onClick={() => setGraine(graine + 1)}>{txt.autre}</button></div>
      <figcaption><p>{txt.legende}</p></figcaption>
    </figure>
  )
}

/* ---------- Applications 3 : l'agrégation limitée par diffusion ---------- */

const G = 241 // côté de la grille
const PARTICULES_MAX = 4000

export function FigureAgregation({ txt, fmt }) {
  const [essai, setEssai] = useState(0)
  const [etat, setEtat] = useState({ n: 1, d: null })
  const canvas = useRef(null)

  useEffect(() => {
    const grille = new Uint8Array(G * G)
    const c = (G - 1) / 2
    grille[c * G + c] = 1
    const alea = generateur(5 + essai)
    const { ctx } = preparer(canvas.current)
    const W = canvas.current.width
    const k = W / G
    ctx.clearRect(0, 0, W, W)
    const sig = couleur(canvas.current, '--sig')
    const texte = couleur(canvas.current, '--texte')
    ctx.fillStyle = texte
    ctx.fillRect(c * k, c * k, k, k)
    const fixes = [[c, c]]
    let rayon = 1
    let raf = 0

    // Dimension de masse : N(r) ≈ r^D, sur les rayons intermédiaires
    const dimension = () => {
      const pts = []
      for (let r = 4; r <= rayon * 0.6; r *= 1.25) {
        let m = 0
        for (const [x, y] of fixes) if ((x - c) ** 2 + (y - c) ** 2 <= r * r) m++
        pts.push([log(r), log(m)])
      }
      return pts.length >= 3 ? droite(pts)[0] : null
    }

    const pas = () => {
      const debut = performance.now()
      while (performance.now() - debut < 10 && fixes.length < PARTICULES_MAX && rayon < c - 4) {
        // Une particule part d'un cercle autour de l'amas et marche au hasard
        const a = alea() * 2 * Math.PI
        let x = Math.round(c + (rayon + 4) * Math.cos(a))
        let y = Math.round(c + (rayon + 4) * Math.sin(a))
        const loin = (rayon + 12) ** 2 * 4
        for (;;) {
          const u = alea()
          if (u < 0.25) x++
          else if (u < 0.5) x--
          else if (u < 0.75) y++
          else y--
          const d2 = (x - c) ** 2 + (y - c) ** 2
          if (d2 > loin || x < 1 || y < 1 || x > G - 2 || y > G - 2) {
            const b = alea() * 2 * Math.PI
            x = Math.round(c + (rayon + 4) * Math.cos(b))
            y = Math.round(c + (rayon + 4) * Math.sin(b))
            continue
          }
          const i = y * G + x
          if (grille[i - 1] || grille[i + 1] || grille[i - G] || grille[i + G]) {
            grille[i] = 1
            fixes.push([x, y])
            rayon = Math.max(rayon, Math.sqrt(d2))
            ctx.fillStyle = fixes.length % 2 ? sig : texte
            ctx.fillRect(x * k, y * k, k, k)
            break
          }
        }
      }
      const fini = fixes.length >= PARTICULES_MAX || rayon >= c - 4
      setEtat({ n: fixes.length, d: fixes.length > 300 && (fini || fixes.length % 10 < 3) ? dimension() : null })
      if (!fini) raf = requestAnimationFrame(pas)
    }
    raf = requestAnimationFrame(pas)
    return () => cancelAnimationFrame(raf)
  }, [essai])

  return (
    <figure className="figure figure--large">
      <canvas ref={canvas} className="fr-agregation" role="img" aria-label={txt.label} />
      <div className="figure-actions">
        <button className="btn" onClick={() => setEssai(essai + 1)}>{txt.recommencer}</button>
        <span className="figure-etat">{txt.particules(fmt(etat.n))}{etat.d && ` · ${txt.dimension(fmt(etat.d, { maximumFractionDigits: 2, minimumFractionDigits: 2 }))}`}</span>
      </div>
      <figcaption><p>{txt.legende}</p></figcaption>
    </figure>
  )
}

/* ---------- Théorie : les autres fractales, en vignettes ---------- */

const VIGNETTES = {
  burning: { id: 'burning', largeur: 240, hauteur: 160, x: -0.45, y: 0.5, zoom: 0.75, iter: 300, densite: 4 },
  tricorn: { id: 'tricorn', largeur: 240, hauteur: 160, x: -0.2, y: 0, zoom: 0.75, iter: 200, densite: 4 },
  multibrot: { id: 'multibrot', degre: 4, largeur: 240, hauteur: 160, x: 0, y: 0, zoom: 0.9, iter: 200, densite: 4 },
  newton: { id: 'newton', polynome: 'z3', largeur: 240, hauteur: 160, x: 0, y: 0, zoom: 0.8, iter: 60, palette: 'spectre' },
  newtonZoom: { id: 'newton', polynome: 'z3', largeur: 240, hauteur: 160, x: -0.5, y: 0.0, zoom: 6, iter: 80, palette: 'spectre' },
  cycle: { id: 'newton', polynome: 'cycle', largeur: 240, hauteur: 160, x: 0, y: 0, zoom: 1.2, iter: 80, palette: 'spectre' },
  lyapunov: { id: 'lyapunov', suite: 'AB', largeur: 240, hauteur: 160, x: 3, y: 3, zoom: 1.5, iter: 200 },
  lyapunovB: { id: 'lyapunov', suite: 'BBBBBBAAAAAA', largeur: 240, hauteur: 160, x: 3.6, y: 2.95, zoom: 3.3, iter: 200 },
  buddha: { id: 'buddha', largeur: 240, hauteur: 160, x: 0, y: 0.45, zoom: 1, echantillons: 250000, maxIter: 300 },
  nebula: { id: 'buddha', largeur: 240, hauteur: 160, x: 0, y: 0.45, zoom: 1, echantillons: 250000, maxIter: 40 },
}

export function FigureVignettes({ ids, txt, onOuvrir }) {
  const refs = useRef([])
  useEffect(() => {
    let k = 0
    let t = 0
    const suivant = () => {
      const v = VIGNETTES[ids[k]]
      const c = refs.current[k]
      if (c && v) {
        c.width = v.largeur
        c.height = v.hauteur
        c.getContext('2d').putImageData(new ImageData(v.id === 'buddha' ? buddhaCPU(v) : rendreCPU(v), v.largeur, v.hauteur), 0, 0)
      }
      k++
      if (k < ids.length) t = setTimeout(suivant, 0)
    }
    t = setTimeout(suivant, 30)
    return () => clearTimeout(t)
  }, [ids])
  return (
    <div className="fr-galerie fr-vignettes">
      {ids.map((id, k) => (
        <figure key={id}>
          <canvas ref={(el) => { refs.current[k] = el }} width="240" height="160" role="img" aria-label={txt.noms[id]} />
          <figcaption>
            <strong>{txt.noms[id]}</strong>
            {txt.formules[id] && <code>{txt.formules[id]}</code>}
            {onOuvrir && txt.formules[id] && <button className="btn" onClick={() => onOuvrir(VIGNETTES[id].id)}>{txt.ouvrir}</button>}
          </figcaption>
        </figure>
      ))}
    </div>
  )
}
