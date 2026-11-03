import { useEffect, useMemo, useRef, useState } from 'react'
import Graphique from '../commun/Graphique'
import { useLargeur } from '../commun/graphes'
import { generateur } from '../commun/aleatoire'
import { creerVille, avancer, mesurer, regler } from './moteur'
import { creerRendu, COULEURS_GROUPES } from './rendu'
import { DONNEES } from './donnees'

// ============================================================
//  SCHELLING : les figures des onglets de lecture
//  ligne        : le modèle linéaire de 1971, tour par tour
//  damier       : un petit damier vivant, tolérance réglable
//  balayage     : semblables et satisfaits selon la tolérance (précalculé)
//  bascule      : le modèle du voisinage borné, et ses équilibres
//  potentiel    : le potentiel de Grauwin et al. (2009), α et m réglables
//  temperature  : semblables selon le bruit T (précalculé)
//  grossissement: la densité d'interfaces au fil du temps (précalculé)
//  mesures      : cinq indices sur cinq arrangements
//  cout         : le coût d'un tour, scénario par scénario (mesuré)
// ============================================================

const nouvelleGraine = () => 1 + Math.floor(Math.random() * 999999)
const C1 = COULEURS_GROUPES[0]
const C2 = COULEURS_GROUPES[1]

/* ---------- Le modèle linéaire (Schelling, 1971) ---------- */

const N_LIGNE = 70
const PORTEE = 4

function ligneAuHasard(graine) {
  const alea = generateur(graine)
  const groupes = Array.from({ length: N_LIGNE }, (_, k) => (k < N_LIGNE / 2 ? 0 : 1))
  for (let k = N_LIGNE - 1; k > 0; k--) {
    const j = Math.floor(alea() * (k + 1))
    ;[groupes[k], groupes[j]] = [groupes[j], groupes[k]]
  }
  return groupes.map((g, id) => ({ id, g }))
}

// Content : au moins la moitié de ses voisins (4 de chaque côté, moins au bout de la ligne) lui ressemblent
function content(ligne, k, g = ligne[k].g) {
  let n = 0
  let meme = 0
  for (let j = Math.max(0, k - PORTEE); j <= Math.min(ligne.length - 1, k + PORTEE); j++) {
    if (j === k) continue
    n++
    if (ligne[j].g === g) meme++
  }
  return 2 * meme >= n
}

// Un tour : les mécontents bougent à tour de rôle, de gauche à droite, vers la place contentante la plus proche
function tourLigne(ligne) {
  let l = ligne.slice()
  let bouges = 0
  for (const { id } of ligne) {
    const k = l.findIndex((p) => p.id === id)
    if (content(l, k)) continue
    const p = l[k]
    const sans = l.filter((_, j) => j !== k)
    let meilleur = -1
    for (let d = 1; d < N_LIGNE && meilleur < 0; d++) {
      for (const pos of [k - d, k + d]) {
        if (pos < 0 || pos > sans.length) continue
        const essai = [...sans.slice(0, pos), p, ...sans.slice(pos)]
        if (content(essai, pos)) { meilleur = pos; break }
      }
    }
    if (meilleur >= 0) { l = [...sans.slice(0, meilleur), p, ...sans.slice(meilleur)]; bouges++ }
  }
  return { ligne: l, bouges }
}

function statsLigne(ligne) {
  let relations = 0
  let semblables = 0
  let mecontents = 0
  let paquets = 1
  ligne.forEach((p, k) => {
    if (k && ligne[k - 1].g !== p.g) paquets++
    if (!content(ligne, k)) mecontents++
    for (let j = Math.max(0, k - PORTEE); j <= Math.min(ligne.length - 1, k + PORTEE); j++) {
      if (j === k) continue
      relations++
      if (ligne[j].g === p.g) semblables++
    }
  })
  return { relations, semblables, mecontents, paquets }
}

export function FigureLigne({ txt, fmt }) {
  const [etat, setEtat] = useState(() => ({ ligne: ligneAuHasard(1971), tours: 0, fini: false }))
  const s = statsLigne(etat.ligne)
  const unTour = () => setEtat((e) => {
    const r = tourLigne(e.ligne)
    return { ligne: r.ligne, tours: e.tours + 1, fini: r.bouges === 0 }
  })
  const jusquauBout = () => setEtat((e) => {
    let l = e.ligne
    let t = e.tours
    for (let k = 0; k < 20; k++) {
      const r = tourLigne(l)
      if (!r.bouges) break
      l = r.ligne
      t++
    }
    return { ligne: l, tours: t, fini: true }
  })
  return (
    <figure className="figure figure--large">
      <figcaption className="figure-titre">{txt.titre}</figcaption>
      <div className="sc-ligne-1d" role="img" aria-label={txt.resume(s.paquets, fmt(s.semblables / s.relations, { style: 'percent' }))}>
        {etat.ligne.map((p, k) => (
          <span key={p.id} style={{ background: p.g ? C2 : C1 }} data-mal={!content(etat.ligne, k)} />
        ))}
      </div>
      <p className="sc-etat">{txt.etat(etat.tours, s.mecontents, s.paquets, fmt(s.semblables / s.relations, { style: 'percent', maximumFractionDigits: 1 }))}</p>
      <div className="sc-commandes">
        <button className="btn" onClick={unTour} disabled={etat.fini}>{txt.unTour}</button>
        <button className="btn" onClick={jusquauBout} disabled={etat.fini}>{txt.bout}</button>
        <button className="btn" onClick={() => setEtat({ ligne: ligneAuHasard(nouvelleGraine()), tours: 0, fini: false })}>{txt.nouveau}</button>
      </div>
      <p className="sc-note">{txt.note}</p>
    </figure>
  )
}

/* ---------- Un petit damier vivant ---------- */

export function FigureDamier({ txt, fmt }) {
  const canvas = useRef(null)
  const ville = useRef(null)
  const [tau, setTau] = useState(0.34)
  const [vue, setVue] = useState('groupes')
  const [enCours, setEnCours] = useState(false)
  const [m, setM] = useState(null)
  const opts = useRef({ enCours: false, vue: 'groupes' })

  useEffect(() => { Object.assign(opts.current, { enCours, vue }) }, [enCours, vue])

  useEffect(() => {
    const rendu = creerRendu(canvas.current)
    ville.current = creerVille({ taille: 40, tolerance: [0.34, 0.34] }, 1971)
    let raf = 0
    let derniere = 0
    const boucle = (t) => {
      raf = requestAnimationFrame(boucle)
      const v = ville.current
      if (opts.current.enCours) avancer(v, 0.05)
      rendu.redimensionner()
      rendu.dessiner([v], opts.current.vue)
      if (t - derniere > 200) { derniere = t; setM(mesurer(v)) }
    }
    raf = requestAnimationFrame(boucle)
    return () => cancelAnimationFrame(raf)
  }, [])

  const changerTau = (x) => {
    setTau(x)
    if (ville.current) regler(ville.current, { tolerance: [x, x, x, x, x] })
  }
  const recommencer = () => {
    ville.current = creerVille({ taille: 40, tolerance: [tau, tau] }, nouvelleGraine())
    setEnCours(true)
  }
  const pct = (x) => fmt(x, { style: 'percent', maximumFractionDigits: 0 })

  return (
    <figure className="figure figure--large">
      <figcaption className="figure-titre">{txt.titre}</figcaption>
      <canvas ref={canvas} className="sc-figure-canvas" style={{ aspectRatio: '1', maxWidth: 420 }} aria-label={txt.resume} />
      <label className="sc-curseur">
        <span>{txt.tolerance}</span>
        <input type="range" min={0} max={0.9} step={0.01} value={tau} onChange={(e) => changerTau(Number(e.target.value))} />
        <output>{pct(tau)}</output>
      </label>
      <div className="sc-commandes">
        <button className="btn-principal" onClick={() => setEnCours(!enCours)}>{enCours ? txt.pause : txt.lancer}</button>
        <button className="btn" onClick={recommencer}>{txt.nouveau}</button>
        <div className="groupe" role="group" aria-label={txt.vue}>
          {['groupes', 'satisfaction'].map((v) => <button key={v} aria-pressed={vue === v} onClick={() => setVue(v)}>{txt.vues[v]}</button>)}
        </div>
      </div>
      {m && <p className="sc-etat" aria-live="polite">{txt.etat(fmt(m.t, { maximumFractionDigits: 0 }), pct(m.semblables), pct(m.satisfaits))}</p>}
    </figure>
  )
}

/* ---------- Semblables et satisfaits selon la tolérance (précalculé) ---------- */

export function FigureBalayage({ txt, fmt }) {
  const pct = (x) => fmt(x, { style: 'percent', maximumFractionDigits: 0 })
  const d = DONNEES.balayage
  return (
    <Graphique
      titre={txt.titre}
      series={[
        { id: 's', nom: txt.semblables, points: d.map((r) => [r[0], r[1]]), couleur: 'var(--sig)', trace: 'les deux' },
        { id: 'a', nom: txt.satisfaits, points: d.map((r) => [r[0], r[2]]), couleur: 'var(--serie-2)', trace: 'les deux' },
      ]}
      x={{ min: 0, max: 0.9, ticks: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9], titre: txt.axeX, format: pct }}
      y={{ min: 0, max: 1, ticks: [0, 0.25, 0.5, 0.75, 1], titre: txt.axeY, format: pct }}
      reperes={[{ x: 1 / 3, texte: '1/3' }]}
      info={(x, vals) => `${txt.tolerance} ${pct(x)} · ${vals.map((v) => `${v.serie.nom} ${pct(v.y)}`).join(' · ')}`}
      resume={txt.resume}
      tableau={{ titre: txt.tableau, colonnes: [txt.tolerance, txt.semblables, txt.satisfaits, 'Theil'], lignes: d.map((r) => [pct(r[0]), pct(r[1]), pct(r[2]), fmt(r[3], { maximumFractionDigits: 2 })]) }}
    />
  )
}

/* ---------- Le voisinage borné (Schelling, 1971) ---------- */

const NG1 = 100

// Tolérance du n-ième plus tolérant (n = 1…N) : un rapport (autres / siens) qui décroît en ligne droite
const tolerance = (rmax, n, N) => rmax * (1 - (n - 1) / N)

// Trajectoire : une arrivée ou un départ de chaque groupe à chaque étape, jusqu'à l'équilibre
function trajectoire(w0, b0, rmax, NG2) {
  let w = Math.round(w0)
  let b = Math.round(b0)
  const pts = [[w, b]]
  for (let k = 0; k < 600; k++) {
    let change = false
    if (w < NG1 && b <= (w + 1) * tolerance(rmax, w + 1, NG1)) { w++; change = true } else if (w > 0 && b > w * tolerance(rmax, w, NG1)) { w--; change = true }
    if (b < NG2 && w <= (b + 1) * tolerance(rmax, b + 1, NG2)) { b++; change = true } else if (b > 0 && w > b * tolerance(rmax, b, NG2)) { b--; change = true }
    pts.push([w, b])
    if (!change) break
  }
  return pts
}

export function FigureBascule({ txt, fmt }) {
  const [cadre, largeur] = useLargeur(640)
  const [rmax, setRmax] = useState(2)
  const [NG2, setNG2] = useState(50)
  const [depart, setDepart] = useState([60, 30])
  const L = Math.min(largeur, 640)
  const H = Math.round(L * 0.62)
  const M = { g: 44, d: 14, h: 14, b: 40 }
  const sx = (w) => M.g + (w / NG1) * (L - M.g - M.d)
  const sy = (b) => H - M.b - (b / NG2) * (H - M.h - M.b)
  // les deux courbes de tolérance, en nombres absolus
  const courbe1 = Array.from({ length: 101 }, (_, k) => [k, Math.min(NG2, k * tolerance(rmax, k, NG1))])
  const courbe2 = Array.from({ length: NG2 + 1 }, (_, k) => [Math.min(NG1, k * tolerance(rmax, k, NG2)), k])
  const traj = useMemo(() => trajectoire(depart[0], Math.min(depart[1], NG2), rmax, NG2), [depart, rmax, NG2])
  const fin = traj[traj.length - 1]
  const verdict = fin[0] === 0 ? txt.verdicts.groupe2 : fin[1] === 0 ? txt.verdicts.groupe1 : txt.verdicts.mixte(fin[0], fin[1])
  const chemin = (pts) => pts.map(([w, b], k) => `${k ? 'L' : 'M'}${sx(w).toFixed(1)},${sy(b).toFixed(1)}`).join('')
  const clic = (e) => {
    const r = e.currentTarget.getBoundingClientRect()
    const x = ((e.clientX - r.left) / r.width) * L
    const y = ((e.clientY - r.top) / r.height) * H
    const w = Math.round(((x - M.g) / (L - M.g - M.d)) * NG1)
    const b = Math.round(((H - M.b - y) / (H - M.h - M.b)) * NG2)
    if (w >= 0 && w <= NG1 && b >= 0 && b <= NG2) setDepart([w, b])
  }
  return (
    <figure className="figure figure--large">
      <figcaption className="figure-titre">{txt.titre}</figcaption>
      <div className="courbe" ref={cadre}>
        <svg viewBox={`0 0 ${L} ${H}`} role="img" aria-label={txt.resume(verdict)} onClick={clic} style={{ cursor: 'crosshair', maxWidth: L }}>
          <rect x={M.g} y={M.h} width={L - M.g - M.d} height={H - M.h - M.b} className="courbe-grille" fill="none" />
          {[0, 25, 50, 75, 100].map((w) => <text key={w} className="courbe-texte" x={sx(w)} y={H - M.b + 16} textAnchor="middle">{w}</text>)}
          {(NG2 === 50 ? [0, 25, 50] : [0, 25, 50, 75, 100]).map((b) => <text key={b} className="courbe-texte" x={M.g - 8} y={sy(b) + 4} textAnchor="end">{b}</text>)}
          <text className="courbe-texte" x={L - M.d} y={H - 6} textAnchor="end">{txt.axeX}</text>
          <text className="courbe-texte" x={M.g} y={M.h - 2}>{txt.axeY}</text>
          <path d={chemin(courbe1)} fill="none" stroke={C1} strokeWidth="2" />
          <path d={chemin(courbe2)} fill="none" stroke={C2} strokeWidth="2" />
          <path d={chemin(traj)} fill="none" stroke="var(--texte)" strokeWidth="1.6" strokeDasharray="4 3" />
          <circle cx={sx(depart[0])} cy={sy(depart[1])} r="5" fill="var(--surface)" stroke="var(--texte)" strokeWidth="1.6" />
          <circle cx={sx(fin[0])} cy={sy(fin[1])} r="5" fill="var(--texte)" />
        </svg>
      </div>
      <ul className="legende-graphique">
        <li><span style={{ background: C1 }} aria-hidden="true" />{txt.courbe1}</li>
        <li><span style={{ background: C2 }} aria-hidden="true" />{txt.courbe2}</li>
      </ul>
      <label className="sc-curseur">
        <span>{txt.rmax}</span>
        <input type="range" min={1} max={6} step={0.5} value={rmax} onChange={(e) => setRmax(Number(e.target.value))} />
        <output>{fmt(rmax, { maximumFractionDigits: 1 })} : 1</output>
      </label>
      <div className="sc-commandes">
        <span>{txt.taille2}</span>
        <div className="groupe" role="group" aria-label={txt.taille2}>
          {[50, 100].map((n) => <button key={n} aria-pressed={NG2 === n} onClick={() => setNG2(n)}>{n}</button>)}
        </div>
      </div>
      <p className="sc-etat" aria-live="polite">{txt.etat(depart[0], Math.min(depart[1], NG2), verdict)}</p>
      <p className="sc-note">{txt.note}</p>
    </figure>
  )
}

/* ---------- Le potentiel de Grauwin, Bertin, Lemoy et Jensen (2009) ---------- */

// Utilité d'un îlot selon sa densité ρ : maximale à ρ = 1/2, vaut m quand l'îlot est plein
const uIlot = (r, m) => (r <= 0.5 ? 2 * r : m + 2 * (1 - m) * (1 - r))
const integrale = (r, m) => (r <= 0.5 ? r * r : 0.25 + m * (r - 0.5) + 2 * (1 - m) * (r - (r * r) / 2 - 0.375))
const fIlot = (r, a, m) => a * r * uIlot(r, m) + (1 - a) * integrale(r, m)

// Enveloppe concave (par-dessus) d'une courbe échantillonnée
function enveloppe(pts) {
  const h = []
  for (const p of pts) {
    while (h.length >= 2) {
      const [a, b] = [h[h.length - 2], h[h.length - 1]]
      if ((b[0] - a[0]) * (p[1] - a[1]) - (b[1] - a[1]) * (p[0] - a[0]) >= 0) h.pop()
      else break
    }
    h.push(p)
  }
  return h
}

export function FigurePotentiel({ txt, fmt }) {
  const [alpha, setAlpha] = useState(0)
  const [m, setM] = useState(0.5)
  const pts = Array.from({ length: 201 }, (_, k) => [k / 200, fIlot(k / 200, alpha, m)])
  const env = enveloppe(pts)
  // le segment de l'enveloppe au-dessus de ρ = 1/2
  let k = 0
  while (k < env.length - 2 && env[k + 1][0] < 0.5) k++
  const [a, b] = [env[k], env[k + 1]]
  const hEnv = a[1] + ((b[1] - a[1]) * (0.5 - a[0])) / Math.max(1e-9, b[0] - a[0])
  const separee = hEnv > fIlot(0.5, alpha, m) + 1e-6
  const alphaC = 1 / (3 - 2 * m)
  const ymin = Math.min(...pts.map((p) => p[1]))
  const ymax = Math.max(...pts.map((p) => p[1]))
  const marge = (ymax - ymin) * 0.1 + 1e-3
  const nombre = (x) => fmt(x, { maximumFractionDigits: 2 })
  return (
    <>
      <Graphique
        titre={txt.titre}
        series={[
          { id: 'f', nom: txt.potentiel, points: pts.filter((_, j) => j % 4 === 0), couleur: 'var(--sig)', trace: 'ligne' },
          { id: 'e', nom: txt.enveloppe, points: env.filter((p, j) => j === 0 || j === env.length - 1 || Math.abs(p[1] - fIlot(p[0], alpha, m)) < 1e-9 ? true : j % 4 === 0), couleur: 'var(--serie-2)', trace: 'ligne' },
        ]}
        x={{ min: 0, max: 1, ticks: [0, 0.25, 0.5, 0.75, 1], titre: txt.axeX, format: nombre }}
        y={{ min: ymin - marge, max: ymax + marge, ticks: [ymin, (ymin + ymax) / 2, ymax].map((v) => Math.round(v * 100) / 100), titre: txt.axeY, format: nombre }}
        reperes={[{ x: 0.5, texte: 'ρ₀ = 1/2' }]}
        info={(x, vals) => `ρ = ${nombre(x)} · ${vals.map((v) => `${v.serie.nom} ${fmt(v.y, { maximumFractionDigits: 3 })}`).join(' · ')}`}
        resume={txt.resume(separee)}
      />
      <label className="sc-curseur">
        <span>{txt.alpha}</span>
        <input type="range" min={0} max={1} step={0.01} value={alpha} onChange={(e) => setAlpha(Number(e.target.value))} />
        <output>{nombre(alpha)}</output>
      </label>
      <label className="sc-curseur">
        <span>{txt.m}</span>
        <input type="range" min={0} max={1} step={0.01} value={m} onChange={(e) => setM(Number(e.target.value))} />
        <output>{nombre(m)}</output>
      </label>
      <p className="sc-etat" aria-live="polite">
        {separee ? txt.separee(nombre(a[0]), nombre(b[0])) : txt.mixte}{' '}{txt.seuil(nombre(alphaC))}
      </p>
    </>
  )
}

/* ---------- Semblables selon le bruit (précalculé) ---------- */

export function FigureTemperature({ txt, fmt }) {
  const pct = (x) => fmt(x, { style: 'percent', maximumFractionDigits: 0 })
  const d = DONNEES.temperature
  const ticks = [0, 0.05, 0.2, 0.5, 1, 2, 3]
  return (
    <Graphique
      titre={txt.titre}
      series={[{ id: 's', nom: txt.semblables, points: d.map((r) => [Math.sqrt(r[0]), r[1]]), couleur: 'var(--sig)', trace: 'les deux' }]}
      x={{ min: 0, max: Math.sqrt(3), ticks: ticks.map(Math.sqrt), titre: txt.axeX, format: (x) => fmt(Math.round(x * x * 100) / 100) }}
      y={{ min: 0.5, max: 1, ticks: [0.5, 0.625, 0.75, 0.875, 1], titre: txt.axeY, format: pct }}
      info={(x, vals) => `T = ${fmt(Math.round(x * x * 100) / 100)} · ${pct(vals[0].y)}`}
      resume={txt.resume}
      tableau={{ titre: txt.tableau, colonnes: ['T', txt.semblables, 'Theil'], lignes: d.map((r) => [fmt(r[0]), pct(r[1]), fmt(r[2], { maximumFractionDigits: 2 })]) }}
    />
  )
}

/* ---------- La densité d'interfaces au fil du temps (précalculé) ---------- */

export function FigureGrossissement({ txt, fmt }) {
  const { froid, tiede } = DONNEES.grossissement
  const lg = (p) => [Math.log10(p[0]), Math.log10(p[1])]
  const puissance = (x) => fmt(10 ** x, { maximumSignificantDigits: 2 })
  return (
    <Graphique
      titre={txt.titre}
      series={[
        { id: 'f', nom: txt.froid, points: froid.map(lg), couleur: 'var(--serie-2)', trace: 'ligne' },
        { id: 't', nom: txt.tiede, points: tiede.map(lg), couleur: 'var(--sig)', trace: 'ligne' },
      ]}
      x={{ min: Math.log10(0.25), max: 3, ticks: [0, 1, 2, 3], titre: txt.axeX, format: puissance }}
      y={{ min: -2, max: 0, ticks: [-2, -1.5, -1, -0.5, 0], titre: txt.axeY, format: puissance }}
      info={(x, vals) => `${txt.tours} ${puissance(x)} · ${vals.map((v) => `${v.serie.nom} ${puissance(v.y)}`).join(' · ')}`}
      resume={txt.resume}
    />
  )
}

/* ---------- Cinq indices sur cinq arrangements ---------- */

const N_M = 24
const ARRANGEMENTS = ['hasard', 'echiquier', 'bandes1', 'bandes3', 'moities']

function arranger(nom) {
  const alea = generateur(12)
  return Array.from({ length: N_M * N_M }, (_, c) => {
    const x = c % N_M
    const y = (c - x) / N_M
    if (nom === 'hasard') return alea() < 0.5 ? 0 : 1
    if (nom === 'echiquier') return (x + y) % 2
    if (nom === 'bandes1') return x % 2
    if (nom === 'bandes3') return Math.floor(x / 3) % 2
    return x < N_M / 2 ? 0 : 1
  })
}

// Les indices : dissimilarité D et entropie de Theil H sur des quartiers de q × q,
// isolement du groupe 2, voisins semblables (8 voisins, damier refermé), densité d'interfaces (4 voisins)
function indices(g, q) {
  const nq = N_M / q
  const quartiers = Array.from({ length: nq * nq }, () => [0, 0])
  g.forEach((v, c) => {
    const x = c % N_M
    const y = (c - x) / N_M
    quartiers[Math.floor(y / q) * nq + Math.floor(x / q)][v]++
  })
  const A = g.filter((v) => v === 0).length
  const B = g.length - A
  let D = 0
  let iso = 0
  for (const [a, b] of quartiers) {
    D += Math.abs(a / A - b / B) / 2
    iso += (b / B) * (b / (a + b))
  }
  const ent = (p) => (p > 0 && p < 1 ? -p * Math.log(p) - (1 - p) * Math.log(1 - p) : 0)
  const E = ent(A / g.length)
  let H = 0
  for (const [a, b] of quartiers) H += ((a + b) / g.length) * (E - ent(a / (a + b)))
  let semb = 0
  let inter = 0
  g.forEach((v, c) => {
    const x = c % N_M
    const y = (c - x) / N_M
    let s = 0
    for (let dy = -1; dy <= 1; dy++) {
      for (let dx = -1; dx <= 1; dx++) {
        if (!dx && !dy) continue
        if (g[((y + dy + N_M) % N_M) * N_M + ((x + dx + N_M) % N_M)] === v) s++
      }
    }
    semb += s / 8
    if (g[y * N_M + ((x + 1) % N_M)] !== v) inter++
    if (g[((y + 1) % N_M) * N_M + x] !== v) inter++
  })
  return { D, H: H / E, iso, semb: semb / g.length, inter: inter / (2 * g.length) }
}

export function FigureMesures({ txt, fmt }) {
  const canvas = useRef(null)
  const [nom, setNom] = useState('bandes3')
  const [q, setQ] = useState(6)
  const g = useMemo(() => arranger(nom), [nom])
  const r = indices(g, q)
  useEffect(() => {
    const cv = canvas.current
    const s = 12
    cv.width = N_M * s
    cv.height = N_M * s
    const ctx = cv.getContext('2d')
    g.forEach((v, c) => {
      const x = c % N_M
      const y = (c - x) / N_M
      ctx.fillStyle = v ? C2 : C1
      ctx.fillRect(x * s, y * s, s - 1, s - 1)
    })
    ctx.strokeStyle = 'rgba(255, 255, 255, .85)'
    ctx.lineWidth = 2
    for (let k = 0; k <= N_M; k += q) {
      ctx.beginPath(); ctx.moveTo(k * s - 0.5, 0); ctx.lineTo(k * s - 0.5, cv.height); ctx.stroke()
      ctx.beginPath(); ctx.moveTo(0, k * s - 0.5); ctx.lineTo(cv.width, k * s - 0.5); ctx.stroke()
    }
  }, [g, q])
  const n2 = (x) => fmt(x, { maximumFractionDigits: 2, minimumFractionDigits: 2 })
  return (
    <figure className="figure figure--large">
      <figcaption className="figure-titre">{txt.titre}</figcaption>
      <div className="sc-commandes">
        <div className="groupe" role="group" aria-label={txt.arrangement}>
          {ARRANGEMENTS.map((a) => <button key={a} aria-pressed={nom === a} onClick={() => setNom(a)}>{txt.arrangements[a]}</button>)}
        </div>
        <div className="groupe" role="group" aria-label={txt.quartier}>
          {[2, 3, 6, 12].map((k) => <button key={k} aria-pressed={q === k} onClick={() => setQ(k)}>{txt.quartiers(k)}</button>)}
        </div>
      </div>
      <div className="sc-paire">
        <canvas ref={canvas} className="sc-figure-canvas" style={{ aspectRatio: '1' }} aria-label={txt.resume(txt.arrangements[nom], txt.quartiers(q))} />
        <table className="sc-tableau">
          <tbody>
            <tr><th scope="row">{txt.noms.D}</th><td>{n2(r.D)}</td></tr>
            <tr><th scope="row">{txt.noms.H}</th><td>{n2(r.H)}</td></tr>
            <tr><th scope="row">{txt.noms.iso}</th><td>{n2(r.iso)}</td></tr>
            <tr><th scope="row">{txt.noms.semb}</th><td>{n2(r.semb)}</td></tr>
            <tr><th scope="row">{txt.noms.inter}</th><td>{n2(r.inter)}</td></tr>
          </tbody>
        </table>
      </div>
      <p className="sc-note">{txt.note}</p>
    </figure>
  )
}

/* ---------- Le coût d'un tour (mesuré en Node, 100 × 100) ---------- */

export function FigureCout({ txt, T, fmt }) {
  return (
    <figure className="figure figure--large">
      <figcaption className="figure-titre">{txt.titre}</figcaption>
      <table className="sc-tableau">
        <thead><tr><th scope="col">{txt.scenario}</th><th scope="col">{txt.villeA}</th><th scope="col">{txt.villeB}</th></tr></thead>
        <tbody>
          {DONNEES.cout.map(([id, a, b]) => (
            <tr key={id}>
              <th scope="row">{T.scenarios[id].titre}</th>
              <td>{fmt(a, { maximumFractionDigits: 1 })} ms</td>
              <td>{b === null ? '–' : `${fmt(b, { maximumFractionDigits: 1 })} ms`}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="sc-note">{txt.note}</p>
    </figure>
  )
}
