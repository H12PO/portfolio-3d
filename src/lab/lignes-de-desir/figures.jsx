import { useEffect, useMemo, useRef, useState } from 'react'
import Graphique from '../commun/Graphique'
import { useLargeur } from '../commun/graphes'
import { generateur } from '../commun/aleatoire'
import { marcheRapide } from './moteur'
import { ImagesFiche } from './fiches'
import { DONNEES } from './donnees'

// ============================================================
//  LIGNES DE DÉSIR : les figures des onglets de lecture
//  regle      : la direction d'un marcheur, entre son but et un sentier
//  usure      : combien de passages pour qu'un sentier tienne
//  potentiel  : un sentier vu à la distance σ (coupe)
//  regimes    : trois portes, trois attraits (images précalculées)
//  compromis  : longueur du réseau contre détour (précalculé)
//  steiner    : le point de Fermat, l'arbre de Steiner (à la souris)
//  choix      : la fonction de choix de Deneubourg, tirages en direct
//  pont       : le double pont, essai par essai (précalculé)
//  eikonale   : la marche rapide autour d'obstacles (à la souris)
//  flou       : trois flous en boîte valent une gaussienne
// ============================================================

const COULEURS = ['var(--sig)', 'var(--serie-2)', '#E69F00', '#CC79A7']
const nouvelleGraine = () => 1 + Math.floor(Math.random() * 999999)
const phi = (u) => Math.exp(-u * u / 2) / Math.sqrt(2 * Math.PI)
// fonction de répartition de la loi normale (approximation d'Abramowitz et Stegun)
function Phi(u) {
  const t = 1 / (1 + 0.2316419 * Math.abs(u))
  const p = 1 - phi(u) * t * (0.31938153 + t * (-0.356563782 + t * (1.781477937 + t * (-1.821255978 + t * 1.330274429))))
  return u >= 0 ? p : 1 - p
}

function Fleche({ x, y, dx, dy, couleur, epais = 2.5 }) {
  const n = Math.hypot(dx, dy)
  if (n < 1e-6) return null
  const ux = dx / n, uy = dy / n
  const tx = x + dx, ty = y + dy
  const t = 8
  return (
    <g stroke={couleur} fill={couleur}>
      <line x1={x} y1={y} x2={tx - ux * t * 0.6} y2={ty - uy * t * 0.6} strokeWidth={epais} strokeLinecap="round" />
      <path d={`M${tx},${ty} L${tx - ux * t - uy * t * 0.5},${ty - uy * t + ux * t * 0.5} L${tx - ux * t + uy * t * 0.5},${ty - uy * t - ux * t * 0.5} Z`} stroke="none" />
    </g>
  )
}

// Glisser un point dans un SVG (coordonnées du viewBox)
function useGlisser(svgRef, surDeplacement) {
  const actif = useRef(null)
  const point = (e) => {
    const svg = svgRef.current
    const r = svg.getBoundingClientRect()
    const vb = svg.viewBox.baseVal
    return [vb.x + ((e.clientX - r.left) / r.width) * vb.width, vb.y + ((e.clientY - r.top) / r.height) * vb.height]
  }
  return {
    debut: (cle) => (e) => { actif.current = cle; e.currentTarget.ownerSVGElement?.setPointerCapture?.(e.pointerId); e.preventDefault() },
    surSvg: {
      onPointerMove: (e) => { if (actif.current !== null) surDeplacement(actif.current, point(e)) },
      onPointerUp: () => { actif.current = null },
      onPointerCancel: () => { actif.current = null },
      onPointerDown: (e) => { if (actif.current === null && e.target === svgRef.current) surDeplacement('fond', point(e)) },
    },
  }
}

/* ---------- La règle : but, sentier, direction ---------- */

const SENTIER = (() => {
  // un sentier qui ne va pas tout à fait vers la porte : il passe plus haut
  const pts = []
  for (let k = 0; k <= 60; k++) {
    const t = k / 60
    pts.push([2 + 24 * t, 12.5 - 9 * Math.sin(Math.PI * t * 0.85) + 2 * t])
  }
  return pts
})()
const BUT = [26.5, 9.5]

function potentiel(x, y, sigma) {
  // le sentier vu à la distance σ : une somme de gaussiennes le long du tracé
  let v = 0
  for (const [px, py] of SENTIER) v += Math.exp(-((x - px) ** 2 + (y - py) ** 2) / (2 * sigma * sigma))
  return v / (SENTIER.length * 0.25)
}

function direction(x, y, attrait, sigma) {
  const dx = BUT[0] - x, dy = BUT[1] - y
  const n = Math.hypot(dx, dy) || 1
  const ex = dx / n, ey = dy / n
  const e = 0.05
  let gx = ((potentiel(x + e, y, sigma) - potentiel(x - e, y, sigma)) / (2 * e)) * sigma * 0.3
  let gy = ((potentiel(x, y + e, sigma) - potentiel(x, y - e, sigma)) / (2 * e)) * sigma * 0.3
  const avant = gx * ex + gy * ey
  if (avant < 0) { gx -= avant * ex; gy -= avant * ey }
  const rx = ex + attrait * gx, ry = ey + attrait * gy
  const r = Math.hypot(rx, ry) || 1
  return { ex, ey, gx: attrait * gx, gy: attrait * gy, rx: rx / r, ry: ry / r }
}

export function FigureRegle({ txt, fmt }) {
  const [marcheur, setMarcheur] = useState([6, 10.5])
  const [attrait, setAttrait] = useState(2)
  const [sigma, setSigma] = useState(3)
  const svg = useRef(null)
  const S = 20                               // pixels par mètre
  const W = 29 * S, H = 15 * S
  const glisser = useGlisser(svg, (_, [px, py]) => setMarcheur([Math.min(28, Math.max(1, px / S)), Math.min(14.5, Math.max(0.5, py / S))]))
  const d = direction(marcheur[0], marcheur[1], attrait, sigma)
  // le chemin qu'il suivra, pas à pas (le sentier ne bouge pas ici)
  const chemin = useMemo(() => {
    let [x, y] = marcheur
    const pts = [[x, y]]
    for (let k = 0; k < 200 && Math.hypot(BUT[0] - x, BUT[1] - y) > 0.6; k++) {
      const q = direction(x, y, attrait, sigma)
      x += q.rx * 0.25; y += q.ry * 0.25
      pts.push([x, y])
    }
    return pts
  }, [marcheur, attrait, sigma])
  const L = 3.2 * S
  const f1 = (x) => fmt(x, { maximumFractionDigits: 1, minimumFractionDigits: 1 })
  return (
    <figure className="figure figure--large">
      <figcaption className="figure-titre">{txt.titre}</figcaption>
      <svg ref={svg} viewBox={`0 0 ${W} ${H}`} className="ld-svg" style={{ maxWidth: 640, touchAction: 'none' }} role="img" aria-label={txt.resume} {...glisser.surSvg}>
        <rect width={W} height={H} rx="8" fill="#2e4a2c" />
        <polyline points={SENTIER.map(([x, y]) => `${x * S},${y * S}`).join(' ')} fill="none" stroke="rgba(176,150,104,0.18)" strokeWidth={2 * sigma * S} strokeLinecap="round" strokeLinejoin="round" />
        <polyline points={SENTIER.map(([x, y]) => `${x * S},${y * S}`).join(' ')} fill="none" stroke="#a58b62" strokeWidth={1.4 * S} strokeLinecap="round" strokeLinejoin="round" />
        <polyline points={chemin.map(([x, y]) => `${x * S},${y * S}`).join(' ')} fill="none" stroke="rgba(255,255,255,0.75)" strokeWidth="2" strokeDasharray="2 5" strokeLinecap="round" />
        <rect x={BUT[0] * S - 8} y={BUT[1] * S - 8} width="16" height="16" fill="#ffd84a" stroke="#0b0d12" strokeWidth="2" />
        <text x={BUT[0] * S - 14} y={BUT[1] * S - 14} className="ld-svg-texte" textAnchor="end">{txt.but}</text>
        <Fleche x={marcheur[0] * S} y={marcheur[1] * S} dx={d.ex * L} dy={d.ey * L} couleur="#ffd84a" />
        <Fleche x={marcheur[0] * S} y={marcheur[1] * S} dx={d.gx * L} dy={d.gy * L} couleur="#E69F00" />
        <Fleche x={marcheur[0] * S} y={marcheur[1] * S} dx={d.rx * L * 1.2} dy={d.ry * L * 1.2} couleur="#ffffff" epais={3.5} />
        <circle cx={marcheur[0] * S} cy={marcheur[1] * S} r="9" fill="#f7f3e8" stroke="#0b0d12" strokeWidth="2" style={{ cursor: 'grab' }} onPointerDown={glisser.debut('m')} />
      </svg>
      <div className="ld-legende-fig">
        <span><i style={{ background: '#ffd84a' }} />{txt.versBut}</span>
        <span><i style={{ background: '#E69F00' }} />{txt.versSentier}</span>
        <span><i style={{ background: '#ffffff' }} />{txt.resultat}</span>
      </div>
      <label className="ld-curseur">
        <span>{txt.attrait}</span>
        <input type="range" min="0" max="6" step="0.1" value={attrait} onChange={(e) => setAttrait(Number(e.target.value))} />
        <output>{f1(attrait)}</output>
      </label>
      <label className="ld-curseur">
        <span>{txt.sigma}</span>
        <input type="range" min="1" max="6" step="0.25" value={sigma} onChange={(e) => setSigma(Number(e.target.value))} />
        <output>{txt.metres(f1(sigma))}</output>
      </label>
      <p className="ld-note">{txt.note}</p>
    </figure>
  )
}

/* ---------- L'usure : combien de passages pour qu'un sentier tienne ---------- */

export function FigureUsure({ txt, fmt }) {
  const [usure, setUsure] = useState(0.05)
  const f2 = (x) => fmt(x, { maximumFractionDigits: 2, minimumFractionDigits: 2 })
  const pct = (x) => fmt(x, { style: 'percent', maximumFractionDigits: 0 })
  // un jour : l'herbe repousse (facteur e^{-1/T}), puis n passages (chacun use la part I de ce qui reste)
  const equilibre = (n, T) => { const a = (1 - usure) ** n, b = Math.exp(-1 / T); return (1 - a) / (1 - a * b) }
  const ns = Array.from({ length: 41 }, (_, k) => k * 1.5)
  const series = [1, 4, 15].map((T, k) => ({ id: `T${T}`, nom: txt.serie(fmt(T)), points: ns.map((n) => [n, +equilibre(n, T).toFixed(4)]), couleur: COULEURS[k], trace: 'ligne' }))
  series.push({ id: 'seuil', nom: txt.seuil, points: [[0, 0.45], [60, 0.45]], couleur: 'var(--discret)', trace: 'ligne' })
  return (
    <>
      <Graphique
        titre={txt.titre}
        series={series}
        x={{ min: 0, max: 60, ticks: [0, 10, 20, 30, 40, 50, 60], titre: txt.axeX, format: (v) => fmt(v) }}
        y={{ min: 0, max: 1, ticks: [0, 0.25, 0.5, 0.75, 1], titre: txt.axeY, format: pct }}
        info={(x, vals) => txt.info(fmt(x, { maximumFractionDigits: 1 }), vals.filter((v) => v.serie.id !== 'seuil').map((v) => `${v.serie.nom} : ${pct(v.y)}`).join(' · '))}
        resume={txt.resume}
      />
      <label className="ld-curseur">
        <span>{txt.usure}</span>
        <input type="range" min="0.01" max="0.15" step="0.005" value={usure} onChange={(e) => setUsure(Number(e.target.value))} />
        <output>{f2(usure)}</output>
      </label>
      <p className="ld-note">{txt.note}</p>
    </>
  )
}

/* ---------- Le potentiel des sentiers, en coupe ---------- */

export function FigurePotentiel({ txt, fmt }) {
  const [sigma, setSigma] = useState(3)
  const w = 1.5
  const xs = Array.from({ length: 161 }, (_, k) => -8 + k * 0.1)
  const f1 = (x) => fmt(x, { maximumFractionDigits: 1, minimumFractionDigits: 1 })
  const f2 = (x) => fmt(x, { maximumFractionDigits: 2, minimumFractionDigits: 2 })
  const G = xs.map((x) => [+x.toFixed(1), Math.abs(x) <= w / 2 ? 1 : 0])
  const V = xs.map((x) => [+x.toFixed(1), +(Phi((x + w / 2) / sigma) - Phi((x - w / 2) / sigma)).toFixed(4)])
  // attrait σ dV/dx : il pousse vers le sentier, des deux côtés
  const A = xs.map((x) => [+x.toFixed(1), +((phi((x + w / 2) / sigma) - phi((x - w / 2) / sigma)) * 2).toFixed(4)])
  return (
    <>
      <Graphique
        titre={txt.titre}
        series={[
          { id: 'G', nom: txt.G, points: G, couleur: '#a58b62', trace: 'ligne' },
          { id: 'V', nom: txt.V, points: V, couleur: COULEURS[0], trace: 'ligne' },
          { id: 'A', nom: txt.A, points: A, couleur: COULEURS[2], trace: 'ligne' },
        ]}
        x={{ min: -8, max: 8, ticks: [-8, -4, 0, 4, 8], titre: txt.axeX, format: (v) => fmt(v) }}
        y={{ min: -0.5, max: 1, ticks: [-0.5, 0, 0.5, 1], titre: txt.axeY, format: f1 }}
        info={(x, vals) => txt.info(f1(x), vals.map((v) => `${v.serie.nom} : ${f2(v.y)}`).join(' · '))}
        resume={txt.resume}
      />
      <label className="ld-curseur">
        <span>{txt.sigma}</span>
        <input type="range" min="0.5" max="6" step="0.25" value={sigma} onChange={(e) => setSigma(Number(e.target.value))} />
        <output>{txt.metres(f1(sigma))}</output>
      </label>
      <p className="ld-note">{txt.note}</p>
    </>
  )
}

/* ---------- Trois portes, trois attraits (images précalculées) ---------- */

export function FigureRegimes({ T, fmt }) {
  return <ImagesFiche id="trois" T={T} fmt={fmt} />
}

/* ---------- Longueur du réseau contre détour (précalculé) ---------- */

export function FigureCompromis({ txt, fmt }) {
  const d = DONNEES.regimes
  const L0 = d[0][1]
  const pct = (x) => fmt(x, { style: 'percent', maximumFractionDigits: 0 })
  const pct1 = (x) => fmt(x, { style: 'percent', maximumFractionDigits: 1 })
  const sim = d.map(([, L, det]) => [+(L / L0).toFixed(3), det])
  const R = DONNEES.reperesTrois
  return (
    <Graphique
      titre={txt.titre}
      series={[
        { id: 'sim', nom: txt.simulations, points: sim, couleur: COULEURS[0], trace: 'les deux' },
        { id: 'dir', nom: txt.directs, points: [[1, 0]], couleur: '#a58b62', trace: 'points' },
        { id: 'arb', nom: txt.arbre, points: [[R.arbre[0], R.arbre[1]]], couleur: COULEURS[3], trace: 'points' },
        { id: 'st', nom: txt.steiner, points: [[R.steiner[0], R.steiner[1]]], couleur: COULEURS[2], trace: 'points' },
      ]}
      x={{ min: 0.5, max: 1.05, ticks: [0.5, 0.6, 0.7, 0.8, 0.9, 1], titre: txt.axeX, format: pct }}
      y={{ min: 0, max: 0.35, ticks: [0, 0.1, 0.2, 0.3], titre: txt.axeY, format: pct }}
      info={(x, vals) => txt.info(pct(x), vals.map((v) => {
        const k = v.serie.id === 'sim' ? sim.findIndex((p) => p[0] === x) : -1
        return `${v.serie.nom}${k >= 0 ? ` (A = ${fmt(d[k][0])})` : ''} : ${pct1(v.y)}`
      }).join(' · '))}
      resume={txt.resume}
    />
  )
}

/* ---------- Le point de Fermat et l'arbre de Steiner ---------- */

// Point de Fermat : l'algorithme de Weiszfeld (moyenne pondérée par l'inverse des distances)
function fermat(P) {
  // si un angle du triangle dépasse 120°, le point est ce sommet
  for (let i = 0; i < 3; i++) {
    const a = P[i], b = P[(i + 1) % 3], c = P[(i + 2) % 3]
    const u = [b[0] - a[0], b[1] - a[1]], v = [c[0] - a[0], c[1] - a[1]]
    const cos = (u[0] * v[0] + u[1] * v[1]) / (Math.hypot(...u) * Math.hypot(...v))
    if (cos <= -0.5) return a.slice()
  }
  let x = (P[0][0] + P[1][0] + P[2][0]) / 3, y = (P[0][1] + P[1][1] + P[2][1]) / 3
  for (let k = 0; k < 200; k++) {
    let sx = 0, sy = 0, s = 0
    for (const p of P) { const d = Math.hypot(p[0] - x, p[1] - y) || 1e-9; sx += p[0] / d; sy += p[1] / d; s += 1 / d }
    x = sx / s; y = sy / s
  }
  return [x, y]
}

export function FigureSteiner({ txt, fmt }) {
  const [P, setP] = useState([[90, 50], [40, 240], [330, 230]])
  const svg = useRef(null)
  const W = 400, H = 280
  const glisser = useGlisser(svg, (k, [x, y]) => {
    if (k === 'fond') return
    setP((q) => q.map((p, i) => (i === k ? [Math.min(W - 10, Math.max(10, x)), Math.min(H - 10, Math.max(10, y))] : p)))
  })
  const F = fermat(P)
  const d = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1])
  const cotes = [d(P[0], P[1]), d(P[1], P[2]), d(P[2], P[0])]
  const direct = cotes[0] + cotes[1] + cotes[2]
  const arbre = direct - Math.max(...cotes)
  const steiner = d(P[0], F) + d(P[1], F) + d(P[2], F)
  // détour moyen par l'arbre de Steiner : chaque paire passe par le point de Fermat
  const paires = [[0, 1], [1, 2], [2, 0]]
  const detour = paires.reduce((s, [i, j]) => s + (d(P[i], F) + d(P[j], F)) / d(P[i], P[j]) - 1, 0) / 3
  const ech = 0.1   // mètres par unité du dessin : ici, 40 m de large
  const m = (x) => txt.metres(fmt(x * ech, { maximumFractionDigits: 1, minimumFractionDigits: 1 }))
  const pct = (x) => fmt(x, { style: 'percent', maximumFractionDigits: 0 })
  return (
    <figure className="figure figure--large">
      <figcaption className="figure-titre">{txt.titre}</figcaption>
      <svg ref={svg} viewBox={`0 0 ${W} ${H}`} className="ld-svg" style={{ maxWidth: 520, touchAction: 'none' }} role="img" aria-label={txt.resume} {...glisser.surSvg}>
        <rect width={W} height={H} rx="8" fill="#2e4a2c" />
        <polygon points={P.map((p) => p.join(',')).join(' ')} fill="none" stroke="rgba(255,255,255,0.35)" strokeDasharray="5 5" strokeWidth="2" />
        {P.map((p, k) => <line key={k} x1={p[0]} y1={p[1]} x2={F[0]} y2={F[1]} stroke="#b09668" strokeWidth="7" strokeLinecap="round" />)}
        <circle cx={F[0]} cy={F[1]} r="5" fill="#E69F00" />
        {P.map((p, k) => (
          <g key={k}>
            <rect x={p[0] - 9} y={p[1] - 9} width="18" height="18" fill="#ffd84a" stroke="#0b0d12" strokeWidth="2" style={{ cursor: 'grab' }} onPointerDown={glisser.debut(k)} />
            <text x={p[0]} y={p[1] - 14} className="ld-svg-texte" textAnchor="middle">{'ABC'[k]}</text>
          </g>
        ))}
      </svg>
      <table className="ld-tableau">
        <tbody>
          <tr><th scope="row">{txt.directs}</th><td>{m(direct)}</td><td>{txt.sansDetour}</td></tr>
          <tr><th scope="row">{txt.arbre}</th><td>{m(arbre)}</td><td>{txt.economie(pct(1 - arbre / direct))}</td></tr>
          <tr><th scope="row">{txt.steiner}</th><td>{m(steiner)}</td><td>{txt.economie(pct(1 - steiner / direct))} · {txt.detour(pct(detour))}</td></tr>
        </tbody>
      </table>
      <p className="ld-note">{txt.note}</p>
    </figure>
  )
}

/* ---------- La fonction de choix de Deneubourg ---------- */

function tirages(k, n, graine, essais = 16, fourmis = 1000) {
  const alea = generateur(graine)
  const runs = []
  for (let e = 0; e < essais; e++) {
    let A = 0, B = 0
    const pts = []
    for (let i = 1; i <= fourmis; i++) {
      const pa = (k + A) ** n / ((k + A) ** n + (k + B) ** n)
      if (alea() < pa) A++; else B++
      if (i % 10 === 0) pts.push(A / i)
    }
    runs.push(pts)
  }
  return runs
}

export function FigureChoix({ txt, fmt }) {
  const [k, setK] = useState(20)
  const [n, setN] = useState(2)
  const [graine, setGraine] = useState(1990)
  const runs = useMemo(() => tirages(k, n, graine), [k, n, graine])
  const [ref, largeur] = useLargeur(560)
  const H = 220
  const m = { g: 40, d: 120, h: 10, b: 28 }
  const lc = largeur - m.g - m.d
  const sx = (i) => m.g + (i / (runs[0].length - 1)) * lc
  const sy = (v) => m.h + (1 - v) * (H - m.h - m.b)
  // histogramme des parts finales
  const bacs = new Array(10).fill(0)
  for (const r of runs) bacs[Math.min(9, Math.floor(r[r.length - 1] * 10))]++
  const maxBac = Math.max(...bacs)
  const pct = (x) => fmt(x, { style: 'percent', maximumFractionDigits: 0 })
  const f1 = (x) => fmt(x, { maximumFractionDigits: 1, minimumFractionDigits: 1 })
  return (
    <figure className="figure figure--large">
      <figcaption className="figure-titre">{txt.titre}</figcaption>
      <div ref={ref}>
        <svg viewBox={`0 0 ${largeur} ${H}`} className="ld-svg" role="img" aria-label={txt.resume}>
          {[0, 0.5, 1].map((v) => (
            <g key={v}>
              <line className="courbe-grille" x1={m.g} x2={m.g + lc} y1={sy(v)} y2={sy(v)} />
              <text className="courbe-texte" x={m.g - 6} y={sy(v) + 4} textAnchor="end">{pct(v)}</text>
            </g>
          ))}
          <text className="courbe-texte" x={m.g + lc} y={H - 8} textAnchor="end">{txt.axeX}</text>
          {runs.map((r, q) => (
            <polyline key={q} fill="none" stroke={q % 2 ? 'var(--sig)' : 'var(--serie-2)'} strokeWidth="1.3" opacity="0.8" points={r.map((v, i) => `${sx(i).toFixed(1)},${sy(v).toFixed(1)}`).join(' ')} />
          ))}
          {bacs.map((b, i) => (
            <rect key={i} x={m.g + lc + 16} y={sy((i + 1) / 10)} width={(b / Math.max(1, maxBac)) * (m.d - 26)} height={Math.max(1, (H - m.h - m.b) / 10 - 2)} fill="#E69F00" opacity="0.85" />
          ))}
          <text className="courbe-texte" x={m.g + lc + 16} y={H - 8}>{txt.finales}</text>
        </svg>
      </div>
      <label className="ld-curseur">
        <span>{txt.k}</span>
        <input type="range" min="1" max="60" step="1" value={k} onChange={(e) => setK(Number(e.target.value))} />
        <output>{fmt(k)}</output>
      </label>
      <label className="ld-curseur">
        <span>{txt.n}</span>
        <input type="range" min="0.5" max="4" step="0.5" value={n} onChange={(e) => setN(Number(e.target.value))} />
        <output>{f1(n)}</output>
      </label>
      <div className="ld-commandes"><button className="btn" onClick={() => setGraine(nouvelleGraine())}>{txt.nouveau}</button></div>
      <p className="ld-note">{txt.note}</p>
    </figure>
  )
}

/* ---------- Le double pont, essai par essai (précalculé) ---------- */

export function FigurePont({ txt, fmt }) {
  const d = DONNEES.pont
  const [ref, largeur] = useLargeur(560)
  const H = 200
  const marge = { g: 40, d: 10, h: 24, b: 28 }
  const demi = (largeur - marge.g - marge.d - 20) / 2
  const pct = (x) => fmt(x, { style: 'percent', maximumFractionDigits: 0 })
  const panneau = (cle, x0) => {
    const runs = d[cle]
    const sx = (i) => x0 + (i / (runs[0].length - 1)) * demi
    const sy = (v) => marge.h + (1 - v) * (H - marge.h - marge.b)
    return (
      <g key={cle}>
        <text className="courbe-texte" x={x0} y={14}>{txt.panneaux[cle]}</text>
        {[0, 0.5, 1].map((v) => <line key={v} className="courbe-grille" x1={x0} x2={x0 + demi} y1={sy(v)} y2={sy(v)} />)}
        {runs.map((r, q) => (
          <polyline key={q} fill="none" stroke={r[r.length - 1] > 0.5 ? 'var(--sig)' : '#E69F00'} strokeWidth="1.5" opacity="0.85" points={r.map((v, i) => `${sx(i).toFixed(1)},${sy(v).toFixed(1)}`).join(' ')} />
        ))}
        <text className="courbe-texte" x={x0 + demi} y={H - 8} textAnchor="end">{txt.axeX}</text>
      </g>
    )
  }
  const sy0 = (v) => marge.h + (1 - v) * (H - marge.h - marge.b)
  return (
    <figure className="figure figure--large">
      <figcaption className="figure-titre">{txt.titre}</figcaption>
      <div ref={ref}>
        <svg viewBox={`0 0 ${largeur} ${H}`} className="ld-svg" role="img" aria-label={txt.resume}>
          {[0, 0.5, 1].map((v) => <text key={v} className="courbe-texte" x={marge.g - 6} y={sy0(v) + 4} textAnchor="end">{pct(v)}</text>)}
          {panneau('pont', marge.g)}
          {panneau('pontInegal', marge.g + demi + 20)}
        </svg>
      </div>
      <p className="ld-note">{txt.note}</p>
    </figure>
  )
}

/* ---------- La marche rapide autour d'obstacles ---------- */

const EIK = { W: 64, H: 40 }
const EIK_OBSTACLES = (() => {
  const o = new Uint8Array(EIK.W * EIK.H)
  const rect = (x0, y0, x1, y1) => { for (let j = y0; j < y1; j++) for (let i = x0; i < x1; i++) o[j * EIK.W + i] = 1 }
  rect(18, 6, 28, 22); rect(36, 18, 52, 26); rect(30, 32, 31, 40); rect(30, 0, 31, 12); rect(8, 28, 22, 31)
  return o
})()
const EIK_DEPARTS = [[3, 3], [3, 36], [60, 37], [60, 4], [34, 14]]

function descenteEik(T, x, y) {
  const pts = [[x, y]]
  for (let k = 0; k < 400; k++) {
    const i = Math.floor(x), j = Math.floor(y)
    const ici = T[j * EIK.W + i]
    if (!(ici > 0.8)) break
    let best = ici, bx = 0, by = 0
    for (let dj = -1; dj <= 1; dj++) {
      for (let di = -1; di <= 1; di++) {
        const ii = i + di, jj = j + dj
        if ((!di && !dj) || ii < 0 || jj < 0 || ii >= EIK.W || jj >= EIK.H) continue
        const v = T[jj * EIK.W + ii] + (di && dj ? 0.05 : 0)
        if (v < best) { best = v; bx = di; by = dj }
      }
    }
    if (!bx && !by) break
    const n = Math.hypot(bx, by)
    x += (bx / n) * 0.7; y += (by / n) * 0.7
    pts.push([x, y])
  }
  return pts
}

export function FigureEikonale({ txt, fmt }) {
  const toile = useRef(null)
  const [cible, setCible] = useState([46, 10])
  const T = useMemo(() => {
    const c = new Float32Array(EIK.W * EIK.H)
    for (let k = 0; k < c.length; k++) c[k] = EIK_OBSTACLES[k] ? Infinity : 1
    return marcheRapide(EIK.W, EIK.H, c, [Math.floor(cible[1]) * EIK.W + Math.floor(cible[0])])
  }, [cible])
  const max = useMemo(() => { let v = 0; for (const t of T) if (Number.isFinite(t) && t > v) v = t; return v }, [T])
  useEffect(() => {
    const c = toile.current
    const e = Math.min(window.devicePixelRatio || 1, 2)
    c.width = Math.round(c.clientWidth * e); c.height = Math.round(c.clientWidth * e * (EIK.H / EIK.W))
    const ctx = c.getContext('2d')
    const s = c.width / EIK.W
    for (let j = 0; j < EIK.H; j++) {
      for (let i = 0; i < EIK.W; i++) {
        const t = T[j * EIK.W + i]
        if (!Number.isFinite(t)) { ctx.fillStyle = '#20242e'; ctx.fillRect(i * s, j * s, s + 0.5, s + 0.5); continue }
        // bandes de 5 cases : on lit les fronts successifs
        const bande = Math.floor(t / 5) % 2
        const l = 30 + 34 * (1 - t / max)
        ctx.fillStyle = `hsl(${200 - 160 * (t / max)}, 45%, ${l + bande * 5}%)`
        ctx.fillRect(i * s, j * s, s + 0.5, s + 0.5)
      }
    }
    ctx.lineWidth = 2 * e
    ctx.strokeStyle = 'rgba(255,255,255,0.9)'
    ctx.fillStyle = '#ffffff'
    for (const [x0, y0] of EIK_DEPARTS) {
      const pts = descenteEik(T, x0 + 0.5, y0 + 0.5)
      ctx.beginPath()
      pts.forEach(([x, y], k) => (k ? ctx.lineTo(x * s, y * s) : ctx.moveTo(x * s, y * s)))
      ctx.stroke()
      ctx.beginPath(); ctx.arc((x0 + 0.5) * s, (y0 + 0.5) * s, 3.5 * e, 0, 2 * Math.PI); ctx.fill()
    }
    ctx.fillStyle = '#ffd84a'
    ctx.strokeStyle = '#0b0d12'
    ctx.fillRect((cible[0] - 0.9) * s, (cible[1] - 0.9) * s, 1.8 * s, 1.8 * s)
    ctx.strokeRect((cible[0] - 0.9) * s, (cible[1] - 0.9) * s, 1.8 * s, 1.8 * s)
  }, [T, max, cible])
  const clic = (e) => {
    const r = e.currentTarget.getBoundingClientRect()
    const x = ((e.clientX - r.left) / r.width) * EIK.W, y = ((e.clientY - r.top) / r.height) * EIK.H
    const k = Math.floor(y) * EIK.W + Math.floor(x)
    if (!EIK_OBSTACLES[k]) setCible([Math.floor(x) + 0.5, Math.floor(y) + 0.5])
  }
  return (
    <figure className="figure figure--large">
      <figcaption className="figure-titre">{txt.titre}</figcaption>
      <canvas ref={toile} className="ld-figure-canvas" style={{ aspectRatio: `${EIK.W} / ${EIK.H}`, maxWidth: 640, cursor: 'crosshair' }} onPointerDown={clic} aria-label={txt.resume} />
      <p className="ld-note">{txt.note(fmt(Math.round(max)))}</p>
    </figure>
  )
}

/* ---------- Trois flous en boîte valent une gaussienne ---------- */

export function FigureFlou({ txt, fmt }) {
  const sigma = 4
  const r = Math.max(1, Math.round((Math.sqrt((12 * sigma * sigma) / 3 + 1) - 1) / 2))
  const N = 41, c = 20
  const boite = (f) => {
    const g = new Array(N).fill(0)
    for (let i = 0; i < N; i++) { let s = 0; for (let k = -r; k <= r; k++) s += f[Math.min(N - 1, Math.max(0, i + k))]; g[i] = s / (2 * r + 1) }
    return g
  }
  let f = new Array(N).fill(0)
  f[c] = 1
  const passes = []
  for (let p = 0; p < 3; p++) { f = boite(f); passes.push(f) }
  // écart-type réel après trois boîtes de largeur 2r + 1
  const s3 = Math.sqrt(3 * (((2 * r + 1) ** 2 - 1) / 12))
  const gauss = Array.from({ length: N }, (_, i) => Math.exp(-((i - c) ** 2) / (2 * s3 * s3)) / (s3 * Math.sqrt(2 * Math.PI)))
  const pts = (l) => l.map((v, i) => [i - c, +v.toFixed(4)])
  const f3 = (x) => fmt(x, { maximumFractionDigits: 3, minimumFractionDigits: 3 })
  return (
    <Graphique
      titre={txt.titre}
      series={[
        { id: '1', nom: txt.passes(1), points: pts(passes[0]), couleur: COULEURS[1], trace: 'ligne' },
        { id: '2', nom: txt.passes(2), points: pts(passes[1]), couleur: COULEURS[3], trace: 'ligne' },
        { id: '3', nom: txt.passes(3), points: pts(passes[2]), couleur: COULEURS[0], trace: 'les deux' },
        { id: 'g', nom: txt.gauss, points: pts(gauss), couleur: COULEURS[2], trace: 'ligne' },
      ]}
      x={{ min: -20, max: 20, ticks: [-20, -10, 0, 10, 20], titre: txt.axeX, format: (v) => fmt(v) }}
      y={{ min: 0, max: 0.12, ticks: [0, 0.04, 0.08, 0.12], titre: txt.axeY, format: (v) => fmt(v, { maximumFractionDigits: 2 }) }}
      info={(x, vals) => txt.info(fmt(x), vals.map((v) => `${v.serie.nom} : ${f3(v.y)}`).join(' · '))}
      resume={txt.resume}
    />
  )
}
