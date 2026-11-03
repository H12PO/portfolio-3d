import { useEffect, useMemo, useRef, useState } from 'react'
import Graphique from '../commun/Graphique'
import { useLargeur } from '../commun/graphes'
import { generateur } from '../commun/aleatoire'
import { creerMonde, avancer, mesurer, regler } from './moteur'
import { imageDe } from './hote'
import { creerRendu2D } from './rendu2d'
import { DONNEES } from './donnees'

// ============================================================
//  BOIDS : les figures des onglets de lecture
//  regles        : les trois règles autour d'un oiseau
//  voisinage     : dans un rayon, ou les k plus proches
//  vicsekvivant  : un petit modèle de Vicsek, bruit réglable
//  transition    : polarisation selon le bruit, trois tailles (précalculé)
//  hysteresis    : bruit vectoriel, on monte puis on redescend (précalculé)
//  fluctuations  : fluctuations géantes du nombre (précalculé)
//  couzin        : le diagramme des états de Couzin (précalculé)
//  memoire       : l'hystérésis de Couzin, la mémoire collective (précalculé)
//  meneurs       : la part d'informés qu'il faut pour guider (précalculé)
//  conflit       : compromis ou choix (précalculé)
//  consensus     : des caps qui s'accordent sur un graphe qui change
//  cucker        : l'écart des vitesses selon β (précalculé)
//  predateur     : captures et effet de confusion (précalculé)
//  cout          : grille contre toutes les paires (mesuré)
//  grille        : la grille spatiale, en dessin
// ============================================================

const nouvelleGraine = () => 1 + Math.floor(Math.random() * 999999)
const COULEURS = ['var(--sig)', 'var(--serie-2)', '#E69F00', '#CC79A7']
const DEG = 180 / Math.PI

/* ---------- Une flèche SVG ---------- */

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

function Oiseau({ x, y, angle, taille = 9, couleur = '#e6e9ef', contour }) {
  const c = Math.cos(angle), s = Math.sin(angle)
  const p = (a, b) => `${x + a * c - b * s},${y + a * s + b * c}`
  return <path d={`M${p(taille, 0)} L${p(-taille * 0.6, taille * 0.5)} L${p(-taille * 0.6, -taille * 0.5)} Z`} fill={couleur} stroke={contour ?? 'none'} strokeWidth={1.5} />
}

/* ---------- Les trois règles ---------- */

const ECHELLE_REGLES = 95   // pixels par unité de longueur (rayon de perception = 1)

function voisinsAuHasard(graine) {
  const alea = generateur(graine)
  const liste = []
  while (liste.length < 9) {
    const r = 0.25 + alea() * 0.75
    const a = alea() * 2 * Math.PI
    const x = r * Math.cos(a), y = r * Math.sin(a)
    // l'angle mort : derrière l'oiseau (qui regarde vers la droite), on ne voit rien
    if (Math.abs(a - Math.PI) < Math.PI / 4) continue
    if (liste.some((v) => Math.hypot(v.x - x, v.y - y) < 0.18)) continue
    liste.push({ x, y, cap: -0.6 + alea() * 1.2 + (alea() < 0.2 ? 0.8 : 0) })
  }
  return liste
}

export function FigureRegles({ txt }) {
  const [graine, setGraine] = useState(1987)
  const [regle, setRegle] = useState('tout')
  const voisins = useMemo(() => voisinsAuHasard(graine), [graine])
  const sep = 0.45
  // les trois directions voulues, comme dans le moteur
  const proches = voisins.filter((v) => Math.hypot(v.x, v.y) < sep)
  const S = proches.reduce((a, v) => { const d2 = v.x * v.x + v.y * v.y; return [a[0] - v.x / d2, a[1] - v.y / d2] }, [0, 0])
  const A = voisins.reduce((a, v) => [a[0] + Math.cos(v.cap), a[1] + Math.sin(v.cap)], [0, 0])
  const C = voisins.reduce((a, v) => [a[0] + v.x / voisins.length, a[1] + v.y / voisins.length], [0, 0])
  const unite = (v, l) => { const n = Math.hypot(v[0], v[1]); return n > 1e-9 ? [(v[0] / n) * l, (v[1] / n) * l] : [0, 0] }
  const L = 0.7
  const vS = unite(S, L), vA = unite(A, L), vC = unite(C, L)
  const W = 2 * 1.25 * ECHELLE_REGLES
  const X = (x) => W / 2 + x * ECHELLE_REGLES
  const Y = (y) => W / 2 - y * ECHELLE_REGLES
  const montrer = (r) => regle === 'tout' || regle === r
  const somme = [1.5 * vS[0] + vA[0] + 0.6 * vC[0], 1.5 * vS[1] + vA[1] + 0.6 * vC[1]]
  const vSomme = unite(somme, L)
  // le secteur de l'angle mort (derrière, 90°)
  const arc = (a) => `${X(Math.cos(a))},${Y(Math.sin(a))}`
  return (
    <figure className="figure figure--large">
      <figcaption className="figure-titre">{txt.titre}</figcaption>
      <svg viewBox={`0 0 ${W} ${W}`} className="bo-svg" style={{ maxWidth: 380 }} role="img" aria-label={txt.resume}>
        <rect width={W} height={W} rx="8" fill="#0b0d12" />
        <path d={`M${X(0)},${Y(0)} L${arc(Math.PI * 0.75)} A${ECHELLE_REGLES},${ECHELLE_REGLES} 0 0 1 ${arc(Math.PI * 1.25)} Z`} fill="rgba(255,255,255,0.05)" />
        <circle cx={X(0)} cy={Y(0)} r={ECHELLE_REGLES} fill="none" stroke="rgba(255,255,255,0.25)" strokeDasharray="4 5" />
        <circle cx={X(0)} cy={Y(0)} r={sep * ECHELLE_REGLES} fill="rgba(213,94,0,0.08)" stroke="rgba(213,94,0,0.6)" strokeDasharray="3 4" />
        {montrer('cohesion') && <circle cx={X(C[0])} cy={Y(C[1])} r="5" fill="none" stroke="#009E73" strokeWidth="2" />}
        {voisins.map((v, k) => (
          <Oiseau key={k} x={X(v.x)} y={Y(v.y)} angle={-v.cap} couleur={proches.includes(v) && montrer('separation') ? '#D55E00' : '#aab3c5'} />
        ))}
        <Oiseau x={X(0)} y={Y(0)} angle={0} taille={12} couleur="#ffffff" />
        {montrer('separation') && <Fleche x={X(0)} y={Y(0)} dx={vS[0] * ECHELLE_REGLES} dy={-vS[1] * ECHELLE_REGLES} couleur="#D55E00" />}
        {montrer('alignement') && <Fleche x={X(0)} y={Y(0)} dx={vA[0] * ECHELLE_REGLES} dy={-vA[1] * ECHELLE_REGLES} couleur="#56B4E9" />}
        {montrer('cohesion') && <Fleche x={X(0)} y={Y(0)} dx={vC[0] * ECHELLE_REGLES} dy={-vC[1] * ECHELLE_REGLES} couleur="#009E73" />}
        {regle === 'tout' && <Fleche x={X(0)} y={Y(0)} dx={vSomme[0] * ECHELLE_REGLES * 1.3} dy={-vSomme[1] * ECHELLE_REGLES * 1.3} couleur="#ffffff" epais={3.5} />}
      </svg>
      <div className="bo-commandes">
        <div className="groupe" role="group" aria-label={txt.regle}>
          {['separation', 'alignement', 'cohesion', 'tout'].map((r) => (
            <button key={r} aria-pressed={regle === r} onClick={() => setRegle(r)}>{txt.regles[r]}</button>
          ))}
        </div>
        <button className="btn" onClick={() => setGraine(nouvelleGraine())}>{txt.nouveau}</button>
      </div>
      <p className="bo-note">{txt.legendes[regle]}</p>
    </figure>
  )
}

/* ---------- Dans un rayon, ou les k plus proches ---------- */

function nuage(densite, graine) {
  const alea = generateur(graine)
  const cote = 6
  const n = Math.round(densite * cote * cote)
  const pts = []
  for (let k = 0; k < n; k++) pts.push([(alea() - 0.5) * cote, (alea() - 0.5) * cote])
  return pts
}

export function FigureVoisinage({ txt, fmt }) {
  const [densite, setDensite] = useState(1.5)
  const [graine] = useState(8)
  const pts = useMemo(() => nuage(densite, graine), [densite, graine])
  const k = 7
  const R = 1
  const tries = pts.map((p) => [Math.hypot(p[0], p[1]), p]).sort((a, b) => a[0] - b[0]).filter((d) => d[0] > 1e-9)
  const metriques = tries.filter((d) => d[0] < R).length
  const rayonK = tries[k - 1]?.[0] ?? 0
  const E = 34
  const W = 6 * E
  const X = (x) => W / 2 + x * E
  const panneau = (mode) => (
    <svg viewBox={`0 0 ${W} ${W}`} className="bo-svg" role="img" aria-label={txt.resumes[mode]}>
      <rect width={W} height={W} rx="8" fill="#0b0d12" />
      <circle cx={X(0)} cy={X(0)} r={(mode === 'metrique' ? R : rayonK) * E} fill="rgba(51,173,120,0.12)" stroke="rgba(51,173,120,0.7)" strokeDasharray="4 4" />
      {tries.map(([d, p], i) => {
        const voisin = mode === 'metrique' ? d < R : i < k
        return <circle key={i} cx={X(p[0])} cy={X(p[1])} r={voisin ? 3.6 : 2.4} fill={voisin ? '#33AD78' : '#5c6475'} />
      })}
      <circle cx={X(0)} cy={X(0)} r="5" fill="#ffffff" />
    </svg>
  )
  return (
    <figure className="figure figure--large">
      <figcaption className="figure-titre">{txt.titre}</figcaption>
      <div className="bo-paire">
        <figure>{panneau('metrique')}<figcaption>{txt.metrique(fmt(metriques))}</figcaption></figure>
        <figure>{panneau('topologique')}<figcaption>{txt.topologique(k, fmt(rayonK, { maximumFractionDigits: 2 }))}</figcaption></figure>
      </div>
      <label className="bo-curseur">
        <span>{txt.densite}</span>
        <input type="range" min={0.3} max={4} step={0.1} value={densite} onChange={(e) => setDensite(Number(e.target.value))} />
        <output>{fmt(densite, { maximumFractionDigits: 1, minimumFractionDigits: 1 })}</output>
      </label>
      <p className="bo-note">{txt.note}</p>
    </figure>
  )
}

/* ---------- Un petit Vicsek vivant ---------- */

export function FigureVicsekvivant({ txt, fmt }) {
  const canvas = useRef(null)
  const zone = useRef(null)
  const monde = useRef(null)
  const [eta, setEta] = useState(1.5)
  const [enCours, setEnCours] = useState(true)
  const [phi, setPhi] = useState(null)
  const opts = useRef({ enCours: true, visible: false })

  useEffect(() => { opts.current.enCours = enCours }, [enCours])

  useEffect(() => {
    const rendu = creerRendu2D(canvas.current)
    monde.current = creerMonde({ modele: 'vicsek', n: 400, densite: 4, v0: 0.05, eta: 1.5 }, 1995)
    const obs = new IntersectionObserver((e) => { opts.current.visible = e.some((x) => x.isIntersecting) })
    obs.observe(zone.current)
    let raf = 0
    let derniere = 0
    const boucle = (t) => {
      raf = requestAnimationFrame(boucle)
      if (!opts.current.visible) return
      const m = monde.current
      if (opts.current.enCours) avancer(m, 2)
      rendu.redimensionner()
      rendu.dessiner(imageDe(m), { vue: 'cap' })
      if (t - derniere > 200) { derniere = t; setPhi(mesurer(m).polarisation) }
    }
    raf = requestAnimationFrame(boucle)
    return () => { cancelAnimationFrame(raf); obs.disconnect() }
  }, [])

  const changerEta = (x) => {
    setEta(x)
    if (monde.current) regler(monde.current, { eta: x })
  }
  const melanger = () => { monde.current = creerMonde({ modele: 'vicsek', n: 400, densite: 4, v0: 0.05, eta }, nouvelleGraine()) }
  const f2 = (x) => fmt(x, { maximumFractionDigits: 2, minimumFractionDigits: 2 })
  return (
    <figure className="figure figure--large" ref={zone}>
      <figcaption className="figure-titre">{txt.titre}</figcaption>
      <canvas ref={canvas} className="bo-figure-canvas" style={{ aspectRatio: '1', maxWidth: 420 }} aria-label={txt.resume} />
      <label className="bo-curseur">
        <span>{txt.eta}</span>
        <input type="range" min={0} max={6.28} step={0.02} value={eta} onChange={(e) => changerEta(Number(e.target.value))} />
        <output>{f2(eta)}</output>
      </label>
      <div className="bo-commandes">
        <button className="btn-principal" onClick={() => setEnCours(!enCours)}>{enCours ? txt.pause : txt.lancer}</button>
        <button className="btn" onClick={melanger}>{txt.nouveau}</button>
      </div>
      {phi !== null && <p className="bo-etat" aria-live="polite">{txt.etat(f2(phi))}</p>}
      <p className="bo-note">{txt.note}</p>
    </figure>
  )
}

/* ---------- Polarisation selon le bruit (précalculé) ---------- */

export function FigureTransition({ txt, fmt }) {
  const d = DONNEES.transition
  const f2 = (x) => fmt(x, { maximumFractionDigits: 2, minimumFractionDigits: 2 })
  const tailles = Object.keys(d)
  return (
    <Graphique
      titre={txt.titre}
      series={tailles.map((n, k) => ({ id: n, nom: txt.serie(fmt(Number(n))), points: d[n], couleur: COULEURS[k], trace: 'les deux' }))}
      x={{ min: 0, max: 5, ticks: [0, 1, 2, 3, 4, 5], titre: txt.axeX, format: (v) => fmt(v) }}
      y={{ min: 0, max: 1, ticks: [0, 0.25, 0.5, 0.75, 1], titre: txt.axeY, format: f2 }}
      reperes={[{ x: 2.9, texte: txt.repere }]}
      info={(x, vals) => txt.info(f2(x), vals.map((v) => `${v.serie.nom} : ${f2(v.y)}`).join(' · '))}
      resume={txt.resume}
      tableau={{ titre: txt.tableau, colonnes: [txt.axeX, ...tailles.map((n) => txt.serie(fmt(Number(n))))], lignes: d[tailles[0]].map((p, i) => [f2(p[0]), ...tailles.map((n) => f2(d[n][i][1]))]) }}
    />
  )
}

/* ---------- Hystérésis du bruit vectoriel (précalculé) ---------- */

export function FigureHysteresis({ txt, fmt }) {
  const d = DONNEES.hysteresis
  const f2 = (x) => fmt(x, { maximumFractionDigits: 2, minimumFractionDigits: 2 })
  const enRad = (l) => l.map(([x, y]) => [+(x * 2 * Math.PI).toFixed(3), y])
  const montee = enRad(d.montee)
  const descente = enRad(d.descente)
  const xs = montee.map((p) => p[0])
  return (
    <Graphique
      titre={txt.titre}
      series={[
        { id: 'm', nom: txt.montee, points: montee, couleur: COULEURS[0], trace: 'les deux' },
        { id: 'd', nom: txt.descente, points: descente, couleur: COULEURS[2], trace: 'les deux' },
      ]}
      x={{ min: Math.min(...xs), max: Math.max(...xs), ticks: [3.6, 3.8, 4, 4.2, 4.4].filter((v) => v >= Math.min(...xs) && v <= Math.max(...xs)), titre: txt.axeX, format: (v) => fmt(v, { maximumFractionDigits: 1, minimumFractionDigits: 1 }) }}
      y={{ min: 0, max: 1, ticks: [0, 0.25, 0.5, 0.75, 1], titre: txt.axeY, format: f2 }}
      info={(x, vals) => txt.info(f2(x), vals.map((v) => `${v.serie.nom} : ${f2(v.y)}`).join(' · '))}
      resume={txt.resume}
    />
  )
}

/* ---------- Fluctuations géantes du nombre (précalculé) ---------- */

export function FigureFluctuations({ txt, fmt }) {
  const d = DONNEES.fluctuations
  const log = (l) => l.map(([n, s]) => [+Math.log10(n).toFixed(3), +Math.log10(s).toFixed(3)])
  const ord = log(d.ordonne)
  const des = log(d.desordonne)
  const pente = (l) => (l[l.length - 1][1] - l[0][1]) / (l[l.length - 1][0] - l[0][0])
  const p10 = (v) => fmt(10 ** v, { maximumFractionDigits: v < 1 ? 1 : 0 })
  const f2 = (x) => fmt(x, { maximumFractionDigits: 2, minimumFractionDigits: 2 })
  return (
    <Graphique
      titre={txt.titre}
      series={[
        { id: 'o', nom: txt.ordonne(f2(pente(ord))), points: ord, couleur: COULEURS[0], trace: 'les deux' },
        { id: 'd', nom: txt.desordonne(f2(pente(des))), points: des, couleur: COULEURS[1], trace: 'les deux' },
      ]}
      x={{ min: 0, max: 3, ticks: [0, 1, 2, 3], titre: txt.axeX, format: p10 }}
      y={{ min: 0, max: 2.5, ticks: [0, 1, 2], titre: txt.axeY, format: p10 }}
      info={(x, vals) => txt.info(p10(x), vals.map((v) => `${v.serie.nom.split(' (')[0]} : ${fmt(10 ** v.y, { maximumFractionDigits: 1 })}`).join(' · '))}
      resume={txt.resume(f2(pente(ord)), f2(pente(des)))}
    />
  )
}

/* ---------- Le diagramme de Couzin (précalculé) ---------- */

const ETATS_COUZIN = ['essaim', 'tore', 'dynamique', 'parallele', 'fragmente']
const COULEURS_ETATS = { essaim: '#8f98aa', tore: '#CC79A7', dynamique: '#56B4E9', parallele: '#009E73', fragmente: '#3a3f4b' }
function etatCouzin(p, m, frag) {
  if (frag >= 2) return 'fragmente'
  if (m > 0.5) return 'tore'
  if (p < 0.5) return 'essaim'
  return p >= 0.9 ? 'parallele' : 'dynamique'
}

export function FigureCouzin({ txt, fmt }) {
  const g = DONNEES.couzin.grille
  const vals = [...new Set(g.map((c) => c[0]))].sort((a, b) => a - b)
  const [largeurRef, largeur] = useLargeur(520)
  const n = vals.length
  const marge = { g: 48, b: 40, h: 8, d: 8 }
  const W = Math.min(largeur, 520)
  const cote = (W - marge.g - marge.d) / n
  const H = marge.h + n * cote + marge.b
  const f2 = (x) => fmt(x, { maximumFractionDigits: 2, minimumFractionDigits: 2 })
  return (
    <figure className="figure figure--large">
      <figcaption className="figure-titre">{txt.titre}</figcaption>
      <div ref={largeurRef}>
        <svg viewBox={`0 0 ${W} ${H}`} className="bo-svg" style={{ maxWidth: 520 }} role="img" aria-label={txt.resume}>
          {g.map(([zoo, zoa, p, m, frag]) => {
            const i = vals.indexOf(zoo), j = vals.indexOf(zoa)
            const e = etatCouzin(p, m, frag)
            return (
              <rect key={`${zoo}-${zoa}`} x={marge.g + i * cote} y={marge.h + (n - 1 - j) * cote} width={cote - 1} height={cote - 1} fill={COULEURS_ETATS[e]}>
                <title>{txt.case(fmt(zoo), fmt(zoa), txt.etats[e], f2(p), f2(m))}</title>
              </rect>
            )
          })}
          {vals.map((v, i) => (
            <text key={`x${v}`} className="courbe-texte" x={marge.g + (i + 0.5) * cote} y={marge.h + n * cote + 16} textAnchor="middle">{fmt(v)}</text>
          ))}
          {vals.map((v, j) => (
            <text key={`y${v}`} className="courbe-texte" x={marge.g - 8} y={marge.h + (n - 1 - j + 0.5) * cote + 4} textAnchor="end">{fmt(v)}</text>
          ))}
          <text className="courbe-texte" x={W - marge.d} y={H - 4} textAnchor="end">{txt.axeX}</text>
          <text className="courbe-texte" x={2} y={marge.h + 10}>{txt.axeY}</text>
        </svg>
      </div>
      <ul className="legende-graphique">
        {ETATS_COUZIN.map((e) => <li key={e}><span style={{ background: COULEURS_ETATS[e] }} aria-hidden="true" />{txt.etats[e]}</li>)}
      </ul>
      <p className="bo-note">{txt.note}</p>
    </figure>
  )
}

/* ---------- La mémoire collective de Couzin (précalculé) ---------- */

export function FigureMemoire({ txt, fmt }) {
  const h = DONNEES.couzin.hyst
  const f2 = (x) => fmt(x, { maximumFractionDigits: 2, minimumFractionDigits: 2 })
  const serie = (l, k) => l.map((c) => [c[0], c[k]]).sort((a, b) => a[0] - b[0])
  return (
    <Graphique
      titre={txt.titre}
      series={[
        { id: 'pm', nom: txt.pMontee, points: serie(h.montee, 1), couleur: COULEURS[0], trace: 'les deux' },
        { id: 'pd', nom: txt.pDescente, points: serie(h.descente, 1), couleur: COULEURS[1], trace: 'les deux' },
        { id: 'mm', nom: txt.mMontee, points: serie(h.montee, 2), couleur: COULEURS[2], trace: 'les deux' },
        { id: 'md', nom: txt.mDescente, points: serie(h.descente, 2), couleur: COULEURS[3], trace: 'les deux' },
      ]}
      x={{ min: 1, max: 7, ticks: [1, 2, 3, 4, 5, 6, 7], titre: txt.axeX, format: (v) => fmt(v) }}
      y={{ min: 0, max: 1, ticks: [0, 0.25, 0.5, 0.75, 1], titre: txt.axeY, format: f2 }}
      info={(x, vals) => txt.info(fmt(x, { maximumFractionDigits: 2 }), vals.map((v) => `${v.serie.nom} : ${f2(v.y)}`).join(' · '))}
      resume={txt.resume}
    />
  )
}

/* ---------- Combien d'informés pour guider le groupe (précalculé) ---------- */

export function FigureMeneurs({ txt, fmt }) {
  const d = DONNEES.meneurs
  const tailles = Object.keys(d)
  const pct = (x) => fmt(x, { style: 'percent', maximumFractionDigits: 1 })
  const deg = (x) => `${fmt(x, { maximumFractionDigits: 0 })}°`
  return (
    <Graphique
      titre={txt.titre}
      series={tailles.map((n, k) => ({ id: n, nom: txt.serie(fmt(Number(n))), points: d[n].map((c) => [c[0], c[2]]), couleur: COULEURS[k], trace: 'les deux' }))}
      x={{ min: 0, max: 0.2, ticks: [0, 0.05, 0.1, 0.15, 0.2], titre: txt.axeX, format: pct }}
      y={{ min: 0, max: 120, ticks: [0, 30, 60, 90, 120], titre: txt.axeY, format: deg }}
      info={(x, vals) => txt.info(pct(x), vals.map((v) => `${v.serie.nom} : ${deg(v.y)}`).join(' · '))}
      resume={txt.resume}
      tableau={{
        titre: txt.tableau,
        colonnes: [txt.axeX, ...tailles.map((n) => txt.serie(fmt(Number(n))))],
        lignes: d[tailles[0]].map((c, i) => [pct(c[0]), ...tailles.map((n) => `${deg(d[n][i][2])} (${fmt(d[n][i][1])})`)]),
      }}
    />
  )
}

/* ---------- Compromis ou choix (précalculé) ---------- */

export function FigureConflit({ txt, fmt }) {
  const d = DONNEES.conflit
  const ecarts = [...new Set(d.map((c) => c[0]))]
  const entier = (c) => c[2] >= 0.97   // part du plus grand groupe : personne (ou presque) n'est parti
  return (
    <Graphique
      titre={txt.titre}
      series={[
        { id: 'u', nom: txt.uni, points: d.filter(entier).map((c) => [c[0], c[1]]), couleur: COULEURS[0], trace: 'points' },
        { id: 's', nom: txt.scinde, points: d.filter((c) => !entier(c)).map((c) => [c[0], c[1]]), couleur: COULEURS[2], trace: 'points' },
        { id: 'h', nom: txt.pref1, points: ecarts.map((e) => [e, e / 2]), couleur: COULEURS[1], trace: 'ligne' },
        { id: 'b', nom: txt.pref2, points: ecarts.map((e) => [e, -e / 2]), couleur: COULEURS[3], trace: 'ligne' },
      ]}
      x={{ min: 0, max: 180, ticks: [0, 30, 60, 90, 120, 150, 180], titre: txt.axeX, format: (v) => `${fmt(v)}°` }}
      y={{ min: -150, max: 150, ticks: [-150, -90, -45, 0, 45, 90, 150], titre: txt.axeY, format: (v) => `${fmt(v)}°` }}
      info={(x) => txt.info(fmt(x), d.filter((c) => c[0] === x).map((c) => `${fmt(c[1])}°`).join(', '))}
      resume={txt.resume}
    />
  )
}

/* ---------- Des caps qui s'accordent (Jadbabaie, Lin et Morse) ---------- */

// 12 agents se déplacent ; à chaque pas, chacun prend la moyenne des caps de ses voisins (lui compris)
function simulerConsensus(mode, graine) {
  const alea = generateur(graine)
  const n = 12
  const L = 10
  const R = mode === 'deux' ? 2.2 : 2.6
  const pts = Array.from({ length: n }, (_, i) => {
    const groupe = mode === 'deux' ? (i < n / 2 ? 0 : 1) : 0
    return { x: alea() * (mode === 'deux' ? L / 3 : L) + groupe * (2 * L) / 3, y: alea() * L, cap: (alea() * 2 - 1) * 2.5, g: groupe }
  })
  const traces = pts.map(() => [])
  for (let t = 0; t <= 60; t++) {
    pts.forEach((p, i) => traces[i].push([t, +(p.cap * DEG).toFixed(1)]))
    const nouveaux = pts.map((p) => {
      let s = p.cap, k = 1
      for (const q of pts) {
        if (q === p) continue
        // deux groupes : ils ne se voient jamais (trop loin) ; un groupe : on se voit à moins de R
        if (Math.hypot(q.x - p.x, q.y - p.y) < R && q.g === p.g) { s += q.cap; k++ }
      }
      return s / k
    })
    pts.forEach((p, i) => {
      p.cap = nouveaux[i]
      // ils bougent au hasard dans leur zone : les voisinages changent sans cesse
      const zone = mode === 'deux' ? L / 3 : L
      p.x = Math.min(p.g * (2 * L) / 3 + zone, Math.max(p.g * (2 * L) / 3, p.x + (alea() - 0.5) * 1.6))
      p.y = Math.min(L, Math.max(0, p.y + (alea() - 0.5) * 1.6))
    })
  }
  return traces
}

export function FigureConsensus({ txt, fmt }) {
  const [mode, setMode] = useState('un')
  const [graine, setGraine] = useState(2003)
  const traces = useMemo(() => simulerConsensus(mode, graine), [mode, graine])
  const [ref, largeur] = useLargeur(560)
  const H = 220
  const m = { g: 44, d: 12, h: 12, b: 30 }
  const sx = (t) => m.g + (t / 60) * (largeur - m.g - m.d)
  const sy = (v) => m.h + ((150 - v) / 300) * (H - m.h - m.b)
  const finaux = traces.map((tr) => tr[tr.length - 1][1])
  return (
    <figure className="figure figure--large">
      <figcaption className="figure-titre">{txt.titre}</figcaption>
      <div className="courbe" ref={ref}>
        <svg viewBox={`0 0 ${largeur} ${H}`} role="img" aria-label={txt.resume(mode)}>
          {[-150, -75, 0, 75, 150].map((v) => (
            <g key={v}>
              <line className="courbe-grille" x1={m.g} x2={largeur - m.d} y1={sy(v)} y2={sy(v)} />
              <text className="courbe-texte" x={m.g - 6} y={sy(v) + 4} textAnchor="end">{`${fmt(v)}°`}</text>
            </g>
          ))}
          {[0, 20, 40, 60].map((t) => <text key={t} className="courbe-texte" x={sx(t)} y={H - 10} textAnchor="middle">{fmt(t)}</text>)}
          <text className="courbe-texte" x={largeur - m.d} y={H - 10} textAnchor="end">{txt.axeX}</text>
          {traces.map((tr, i) => (
            <path key={i} className="graphique-ligne" style={{ stroke: i < 6 || mode === 'un' ? 'var(--sig)' : 'var(--serie-2)', strokeWidth: 1.5 }} d={tr.map(([t, v], k) => `${k ? 'L' : 'M'}${sx(t).toFixed(1)},${sy(v).toFixed(1)}`).join('')} />
          ))}
        </svg>
      </div>
      <div className="bo-commandes">
        <div className="groupe" role="group" aria-label={txt.mode}>
          {['un', 'deux'].map((k) => <button key={k} aria-pressed={mode === k} onClick={() => setMode(k)}>{txt.modes[k]}</button>)}
        </div>
        <button className="btn" onClick={() => setGraine(nouvelleGraine())}>{txt.nouveau}</button>
      </div>
      <p className="bo-etat">{txt.etat(mode, finaux.map((v) => fmt(Math.round(v))))}</p>
    </figure>
  )
}

/* ---------- Cucker-Smale : l'écart des vitesses (précalculé) ---------- */

export function FigureCucker({ txt, fmt }) {
  const d = DONNEES.cucker
  const betas = Object.keys(d)
  const p10 = (v) => (v >= 0 ? fmt(10 ** v, { maximumFractionDigits: 0 }) : `10${String(v).replace('-', '⁻').replace(/\d/g, (c) => '⁰¹²³⁴⁵⁶⁷⁸⁹'[c])}`)
  return (
    <>
    <Graphique
      titre={txt.titre}
      series={betas.map((b, k) => ({ id: b, nom: txt.serie(fmt(Number(b))), points: d[b].map(([t, v]) => [t, Math.max(-6, Math.log10(v))]), couleur: COULEURS[k], trace: 'ligne' }))}
      x={{ min: 0, max: 300, ticks: [0, 50, 100, 150, 200, 250, 300], titre: txt.axeX, format: (v) => fmt(v) }}
      y={{ min: -6, max: 0.5, ticks: [-6, -4, -2, 0], titre: txt.axeY, format: p10 }}
      info={(x, vals) => txt.info(fmt(x), vals.map((v) => `${v.serie.nom} : ${(10 ** v.y).toExponential(1)}`).join(' · '))}
      resume={txt.resume}
    />
    <p className="bo-note">{txt.note}</p>
    </>
  )
}

/* ---------- Prédateurs et confusion (précalculé) ---------- */

export function FigurePredateur({ txt, fmt }) {
  const d = DONNEES.predateur
  const lg = (l) => l.map(([n, c]) => [+Math.log10(n).toFixed(3), c])
  const tous = [...d[0], ...d[1]].map((c) => c[1])
  const haut = Math.ceil(Math.max(...tous) / 5) * 5 || 5
  return (
    <Graphique
      titre={txt.titre}
      series={[
        { id: 'sans', nom: txt.sans, points: lg(d[0]), couleur: COULEURS[0], trace: 'les deux' },
        { id: 'avec', nom: txt.avec, points: lg(d[1]), couleur: COULEURS[2], trace: 'les deux' },
      ]}
      x={{ min: 1.4, max: 3.1, ticks: [Math.log10(30), 2, Math.log10(300), 3], titre: txt.axeX, format: (v) => fmt(Math.round(10 ** v / 10) * 10) }}
      y={{ min: 0, max: haut, ticks: Array.from({ length: 6 }, (_, k) => (k * haut) / 5), titre: txt.axeY, format: (v) => fmt(v, { maximumFractionDigits: 1 }) }}
      info={(x, vals) => txt.info(fmt(Math.round(10 ** x / 10) * 10), vals.map((v) => `${v.serie.nom} : ${fmt(v.y, { maximumFractionDigits: 1 })}`).join(' · '))}
      resume={txt.resume}
    />
  )
}

/* ---------- Le coût d'un pas (mesuré) ---------- */

export function FigureCout({ txt, fmt }) {
  const d = DONNEES.cout
  const lg = (l) => l.map(([n, ms]) => [+Math.log10(n).toFixed(3), +Math.log10(ms).toFixed(3)])
  const p10 = (v) => fmt(10 ** v, { maximumFractionDigits: v < 0 ? 2 : 0 })
  return (
    <Graphique
      titre={txt.titre}
      series={[
        { id: 'g', nom: txt.grille, points: lg(d.grille), couleur: COULEURS[0], trace: 'les deux' },
        { id: 'n', nom: txt.naif, points: lg(d.naif), couleur: COULEURS[2], trace: 'les deux' },
      ]}
      x={{ min: 2.3, max: 4.3, ticks: [Math.log10(250), 3, Math.log10(4000), 4], titre: txt.axeX, format: (v) => fmt(Math.round(10 ** v)) }}
      y={{ min: -1, max: 4, ticks: [-1, 0, 1, 2, 3, 4], titre: txt.axeY, format: p10 }}
      info={(x, vals) => txt.info(fmt(Math.round(10 ** x)), vals.map((v) => `${v.serie.nom} : ${fmt(10 ** v.y, { maximumFractionDigits: 1 })} ms`).join(' · '))}
      resume={txt.resume}
    />
  )
}

/* ---------- La grille spatiale (dessin) ---------- */

export function FigureGrille({ txt, fmt }) {
  const [graine, setGraine] = useState(42)
  const pts = useMemo(() => {
    const alea = generateur(graine)
    return Array.from({ length: 70 }, () => [alea() * 8, alea() * 6])
  }, [graine])
  const E = 52
  const focal = [4.4, 3.3]
  const cx = Math.floor(focal[0]), cy = Math.floor(focal[1])
  const dansCases = (p) => Math.abs(Math.floor(p[0]) - cx) <= 1 && Math.abs(Math.floor(p[1]) - cy) <= 1
  const candidats = pts.filter(dansCases)
  const voisins = candidats.filter((p) => Math.hypot(p[0] - focal[0], p[1] - focal[1]) < 1)
  return (
    <figure className="figure figure--large">
      <figcaption className="figure-titre">{txt.titre}</figcaption>
      <svg viewBox={`0 0 ${8 * E} ${6 * E}`} className="bo-svg" style={{ maxWidth: 480 }} role="img" aria-label={txt.resume}>
        <rect width={8 * E} height={6 * E} fill="#0b0d12" rx="8" />
        <rect x={(cx - 1) * E} y={(cy - 1) * E} width={3 * E} height={3 * E} fill="rgba(51,173,120,0.10)" />
        {Array.from({ length: 9 }, (_, k) => <line key={`v${k}`} x1={k * E} x2={k * E} y1={0} y2={6 * E} stroke="rgba(255,255,255,0.12)" />)}
        {Array.from({ length: 7 }, (_, k) => <line key={`h${k}`} x1={0} x2={8 * E} y1={k * E} y2={k * E} stroke="rgba(255,255,255,0.12)" />)}
        <circle cx={focal[0] * E} cy={focal[1] * E} r={E} fill="none" stroke="#33AD78" strokeDasharray="4 4" />
        {pts.map((p, k) => {
          const v = voisins.includes(p)
          const c = candidats.includes(p)
          return <circle key={k} cx={p[0] * E} cy={p[1] * E} r={v ? 4 : 3} fill={v ? '#33AD78' : c ? '#aab3c5' : '#4a5160'} />
        })}
        <circle cx={focal[0] * E} cy={focal[1] * E} r="5.5" fill="#ffffff" />
      </svg>
      <div className="bo-commandes">
        <button className="btn" onClick={() => setGraine(nouvelleGraine())}>{txt.nouveau}</button>
      </div>
      <p className="bo-etat">{txt.etat(fmt(pts.length), fmt(candidats.length), fmt(voisins.length))}</p>
    </figure>
  )
}
