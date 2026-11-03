import { useEffect, useMemo, useRef, useState } from 'react'
import Graphique from '../commun/Graphique'
import { preparer, decroissance, pente, courbeErreur, coefficients, reechantillonner, descripteur, distanceDescripteurs } from './moteur'
import { FORMES } from './formes'
import { Barres } from './Spectre'

// ============================================================
//  ÉPICYCLES DE FOURIER : les figures des onglets de lecture
//  deuxcercles  : deux vecteurs qui tournent (ellipse, trèfle, Mars…)
//  creneau      : le créneau et ses sommes partielles (Gibbs)
//  noyaux       : les noyaux de Dirichlet et de Fejér
//  decroissance : régularité et décroissance des coefficients
//  parametrage  : le même cœur, deux façons de le parcourir
//  symetrie     : symétrie de rotation et fréquences permises
//  repliement   : échantillonner trop peu (le repliement)
//  papillon     : la FFT en papillons, et ce qu'elle économise
//  compression  : garder les plus grands cercles
//  ptolemee     : Mars vue du Soleil et vue de la Terre
//  descripteurs : reconnaître une forme dessinée
//  Tout est calculé dans la page, à la volée.
// ============================================================

const COULEURS = ['var(--sig)', 'var(--serie-2)', '#E69F00', '#CC79A7', '#56B4E9']
const TAU = 2 * Math.PI
const p10 = (fmt) => (v) => fmt(10 ** v, { maximumSignificantDigits: 2 })
const puissance = (v) => `10${String(v).replace('-', '⁻').replace(/\d/g, (d) => '⁰¹²³⁴⁵⁶⁷⁸⁹'[d])}`

function Curseur({ libelle, valeur, min, max, pas, onChange, texte }) {
  return (
    <label className="fo-curseur">
      <span>{libelle}</span>
      <input type="range" min={min} max={max} step={pas} value={valeur} onChange={(e) => onChange(Number(e.target.value))} />
      <output>{texte}</output>
    </label>
  )
}

function Choix({ valeurs, valeur, onChange, noms, libelle }) {
  return (
    <div className="groupe" role="group" aria-label={libelle}>
      {valeurs.map((v) => <button key={v} aria-pressed={valeur === v} onClick={() => onChange(v)}>{noms[v]}</button>)}
    </div>
  )
}

/* ---------- Deux vecteurs qui tournent ---------- */

const PRESETS = {
  ellipse: [1, 0.75, -1, 0.35],
  trefle: [3, 0.5, -1, 0.5],
  spirographe: [3, 0.29, -2, 0.71],
  mars: [8, 0.59, 15, -0.39],
}

export function FigureDeuxcercles({ txt, fmt }) {
  const [p, setP] = useState(PRESETS.ellipse)
  const [t, setT] = useState(0.1)
  const [k1, r1, k2, r2] = p
  const S = 110, W = 300
  const z = (u) => [r1 * Math.cos(TAU * k1 * u) + r2 * Math.cos(TAU * k2 * u), r1 * Math.sin(TAU * k1 * u) + r2 * Math.sin(TAU * k2 * u)]
  const pts = Array.from({ length: 721 }, (_, i) => z(i / 720))
  const a = [r1 * Math.cos(TAU * k1 * t), r1 * Math.sin(TAU * k1 * t)]
  const b = z(t)
  const X = (x) => W / 2 + x * S, Y = (y) => W / 2 + y * S
  const f2 = (x) => fmt(x, { maximumFractionDigits: 2, minimumFractionDigits: 2 })
  const regler = (i, v) => setP((q) => q.map((x, j) => (j === i ? v : x)))
  const preset = Object.keys(PRESETS).find((k) => PRESETS[k].every((v, i) => v === p[i])) ?? null
  return (
    <figure className="figure figure--large">
      <figcaption className="figure-titre">{txt.titre}</figcaption>
      <svg viewBox={`0 0 ${W} ${W}`} className="fo-svg fo-svg--carre" role="img" aria-label={txt.resume}>
        <rect width={W} height={W} rx="8" fill="#0b0d12" />
        <polyline points={pts.map(([x, y]) => `${X(x).toFixed(1)},${Y(y).toFixed(1)}`).join(' ')} fill="none" stroke="#ffb347" strokeWidth="1.8" opacity="0.9" />
        <circle cx={X(0)} cy={Y(0)} r={Math.abs(r1) * S} fill="none" stroke="rgba(140,170,220,.45)" />
        <circle cx={X(a[0])} cy={Y(a[1])} r={Math.abs(r2) * S} fill="none" stroke="rgba(140,170,220,.45)" />
        <polyline points={`${X(0)},${Y(0)} ${X(a[0])},${Y(a[1])} ${X(b[0])},${Y(b[1])}`} fill="none" stroke="#d6e2f8" strokeWidth="1.6" />
        <circle cx={X(b[0])} cy={Y(b[1])} r="4" fill="#fff" />
      </svg>
      <div className="fo-commandes">
        <Choix valeurs={Object.keys(PRESETS)} valeur={preset} onChange={(k) => setP(PRESETS[k])} noms={txt.presets} libelle={txt.titre} />
      </div>
      <Curseur libelle={txt.k1} valeur={k1} min={-16} max={16} pas={1} onChange={(v) => regler(0, v)} texte={fmt(k1)} />
      <Curseur libelle={txt.r1} valeur={r1} min={-1} max={1} pas={0.01} onChange={(v) => regler(1, v)} texte={f2(r1)} />
      <Curseur libelle={txt.k2} valeur={k2} min={-16} max={16} pas={1} onChange={(v) => regler(2, v)} texte={fmt(k2)} />
      <Curseur libelle={txt.r2} valeur={r2} min={-1} max={1} pas={0.01} onChange={(v) => regler(3, v)} texte={f2(r2)} />
      <Curseur libelle={txt.temps} valeur={t} min={0} max={1} pas={0.005} onChange={setT} texte={fmt(t, { style: 'percent', maximumFractionDigits: 0 })} />
      <p className="fo-note">{txt.note}</p>
    </figure>
  )
}

/* ---------- Le créneau et le phénomène de Gibbs ---------- */

function sommeCreneau(K, lissage, x) {
  // f(x) = signe(sin x) = (4/π) Σ_{k impair} sin(kx)/k
  let s = 0
  for (let k = 1; k <= K; k += 2) {
    let w = 1
    if (lissage === 'fejer') w = 1 - k / (K + 1)
    else if (lissage === 'lanczos') { const u = (Math.PI * k) / (K + 1); w = Math.sin(u) / u }
    s += (w * Math.sin(k * x)) / k
  }
  return (4 / Math.PI) * s
}

export function FigureCreneau({ txt, fmt }) {
  const [K, setK] = useState(19)
  const [lissage, setLissage] = useState('aucun')
  const xs = Array.from({ length: 721 }, (_, i) => -Math.PI + (i / 720) * TAU)
  const f = xs.map((x) => [+x.toFixed(4), x === 0 || Math.abs(x) === Math.PI ? 0 : Math.sign(Math.sin(x))])
  const S = xs.map((x) => [+x.toFixed(4), +sommeCreneau(K, lissage, x).toFixed(4)])
  // le dépassement : le maximum juste après le saut, mesuré finement
  let max = -Infinity
  for (let i = 1; i <= 2000; i++) max = Math.max(max, sommeCreneau(K, lissage, (i / 2000) * (3 * Math.PI / (K + 1))))
  const dep = (max - 1) / 2
  const f2 = (x) => fmt(x, { maximumFractionDigits: 2, minimumFractionDigits: 2 })
  return (
    <>
      <Graphique
        titre={txt.titre}
        series={[
          { id: 'f', nom: txt.serieF, points: f, couleur: 'var(--discret)', trace: 'ligne' },
          { id: 's', nom: txt.serieS(fmt(K)), points: S, couleur: 'var(--sig)', trace: 'ligne' },
        ]}
        x={{ min: -Math.PI, max: Math.PI, ticks: [-Math.PI, -Math.PI / 2, 0, Math.PI / 2, Math.PI], titre: txt.axeX, format: (v) => (Math.abs(v) < 1e-9 ? '0' : `${v < 0 ? '−' : ''}${Math.abs(v) > 2 ? 'π' : 'π/2'}`) }}
        y={{ min: -1.4, max: 1.4, ticks: [-1, -0.5, 0, 0.5, 1], titre: txt.axeY, format: (v) => fmt(v) }}
        info={(x, vals) => txt.info(f2(x), vals.map((v) => `${v.serie.nom} : ${f2(v.y)}`).join(' · '))}
        resume={txt.resume}
      />
      <Curseur libelle={txt.K} valeur={K} min={1} max={201} pas={2} onChange={setK} texte={fmt(K)} />
      <div className="fo-commandes">
        <Choix valeurs={['aucun', 'fejer', 'lanczos']} valeur={lissage} onChange={setLissage} noms={txt.lissages} libelle={txt.lissage} />
      </div>
      <p className="fo-etat">{txt.depassement(fmt(dep, { style: 'percent', maximumFractionDigits: 2, minimumFractionDigits: 2 }))}</p>
      <p className="fo-note">{txt.note}</p>
    </>
  )
}

/* ---------- Noyaux de Dirichlet et de Fejér ---------- */

export function FigureNoyaux({ txt, fmt }) {
  const [K, setK] = useState(8)
  const xs = Array.from({ length: 801 }, (_, i) => -Math.PI + (i / 800) * TAU)
  const D = (x) => (Math.abs(Math.sin(x / 2)) < 1e-9 ? 2 * K + 1 : Math.sin((K + 0.5) * x) / Math.sin(x / 2))
  const Fj = (x) => (Math.abs(Math.sin(x / 2)) < 1e-9 ? K + 1 : (Math.sin(((K + 1) * x) / 2) / Math.sin(x / 2)) ** 2 / (K + 1))
  const haut = 2 * K + 1
  const f1 = (x) => fmt(x, { maximumFractionDigits: 1 })
  return (
    <>
      <Graphique
        titre={txt.titre}
        series={[
          { id: 'd', nom: txt.dirichlet, points: xs.map((x) => [+x.toFixed(4), +D(x).toFixed(3)]), couleur: 'var(--sig)', trace: 'ligne' },
          { id: 'f', nom: txt.fejer, points: xs.map((x) => [+x.toFixed(4), +Fj(x).toFixed(3)]), couleur: '#E69F00', trace: 'ligne' },
        ]}
        x={{ min: -Math.PI, max: Math.PI, ticks: [-Math.PI, 0, Math.PI], titre: txt.axeX, format: (v) => (Math.abs(v) < 1e-9 ? '0' : v < 0 ? '−π' : 'π') }}
        y={{ min: -0.3 * haut, max: haut * 1.05, ticks: [0, Math.round(haut / 2), haut], titre: txt.axeY, format: (v) => fmt(v) }}
        info={(x, vals) => txt.info(f1(x), vals.map((v) => `${v.serie.nom} : ${f1(v.y)}`).join(' · '))}
        resume={txt.resume}
      />
      <Curseur libelle={txt.K} valeur={K} min={1} max={30} pas={1} onChange={setK} texte={fmt(K)} />
      <p className="fo-note">{txt.note}</p>
    </>
  )
}

/* ---------- Régularité et décroissance ---------- */

const DECROISSANCE = ['infini', 'coeur', 'carre', 'koch', 'spirale']

export function FigureDecroissance({ txt, fmt }) {
  const series = useMemo(() => DECROISSANCE.map((id, q) => {
    const forme = FORMES[id]
    const p = preparer(forme, 'vitesse', 2048)
    const d = decroissance(p.c, 512).filter(([, a]) => a > 1e-7)
    const pt = pente(d.slice(2))
    return {
      id,
      nom: txt.serie(txt.noms[id], pt > -6 ? fmt(pt, { maximumFractionDigits: 1, minimumFractionDigits: 1 }) : null),
      points: d.map(([k, a]) => [+Math.log10(k).toFixed(4), +Math.log10(a).toFixed(4)]),
      couleur: COULEURS[q],
      trace: 'les deux',
    }
  }), [txt, fmt])
  const f = p10(fmt)
  return (
    <>
      <Graphique
        titre={txt.titre}
        series={series}
        x={{ min: 0, max: 2.6, ticks: [0, 1, 2], titre: txt.axeX, format: f }}
        y={{ min: -7, max: 0, ticks: [-6, -4, -2, 0], titre: txt.axeY, format: (v) => (v === 0 ? '1' : puissance(v)) }}
        info={(x, vals) => txt.info(f(x), vals.map((v) => `${v.serie.nom.split(' (')[0]} : ${fmt(10 ** v.y, { maximumSignificantDigits: 2 })}`).join(' · '))}
        resume={txt.resume}
      />
      <p className="fo-note">{txt.note}</p>
    </>
  )
}

/* ---------- Le paramétrage : le même cœur, deux vitesses ---------- */

export function FigureParametrage({ txt, fmt }) {
  const series = useMemo(() => ['formule', 'vitesse'].map((param, q) => {
    const p = preparer(FORMES.coeur, param, 2048)
    const valeurs = []
    for (let m = 1; m <= 400; m = Math.max(m + 1, Math.round(m * 1.15))) valeurs.push(m)
    return {
      id: param,
      nom: txt.series[param],
      points: courbeErreur(p.c, p.ordres.amplitude, valeurs).map(([m, e]) => [+Math.log10(m).toFixed(4), +Math.log10(Math.max(1e-6, e)).toFixed(4)]),
      couleur: COULEURS[q === 0 ? 0 : 2],
      trace: 'les deux',
    }
  }), [txt])
  const f = p10(fmt)
  const pct = (v) => fmt(10 ** v, { style: 'percent', maximumSignificantDigits: 2 })
  return (
    <>
      <Graphique
        titre={txt.titre}
        series={series}
        x={{ min: 0, max: Math.log10(400), ticks: [0, 1, 2], titre: txt.axeX, format: f }}
        y={{ min: -6, max: 0, ticks: [-6, -4, -2, 0], titre: txt.axeY, format: (v) => (v === 0 ? '100 %' : puissance(v)) }}
        info={(x, vals) => txt.info(f(x), vals.map((v) => `${v.serie.nom} : ${pct(v.y)}`).join(' · '))}
        resume={txt.resume}
      />
      <p className="fo-note">{txt.note}</p>
    </>
  )
}

/* ---------- Symétrie de rotation ---------- */

const SYMETRIES = { triangle: 3, carre: 4, etoile: 5 }

export function FigureSymetrie({ txt, T, fmt }) {
  const [forme, setForme] = useState('etoile')
  const m = SYMETRIES[forme]
  const c = useMemo(() => preparer(FORMES[forme], 'vitesse', 2048).c, [forme])
  const gardes = useMemo(() => new Set(), [])
  const couleur = (k) => ((((k - 1) % m) + m) % m === 0 ? 'var(--sig)' : 'var(--discret)')
  return (
    <figure className="figure figure--large">
      <figcaption className="figure-titre">{txt.titre}</figcaption>
      <div className="fo-commandes">
        <Choix valeurs={Object.keys(SYMETRIES)} valeur={forme} onChange={setForme} noms={txt.formes} libelle={txt.titre} />
      </div>
      <Barres c={c} gardes={gardes} T={T} fmt={fmt} kv={24} hauteur={170} couleur={couleur} />
      <p className="fo-note">{txt.note(fmt(m))}</p>
    </figure>
  )
}

/* ---------- Le repliement ---------- */

export function FigureRepliement({ txt, fmt }) {
  const [k, setK] = useState(9)
  const N = 8
  const apparent = ((((k + N / 2) % N) + N) % N) - N / 2
  const W = 300, R = 110, c0 = W / 2
  const pos = (u) => [c0 + R * Math.cos(-Math.PI / 2 + TAU * u), c0 + R * Math.sin(-Math.PI / 2 + TAU * u)]
  // la vraie trajectoire entre deux échantillons, et les échantillons
  const vrai = Array.from({ length: 401 }, (_, i) => pos((k * i) / (400 * N)))
  const ech = Array.from({ length: N }, (_, n) => pos((k * n) / N))
  return (
    <figure className="figure figure--large">
      <figcaption className="figure-titre">{txt.titre}</figcaption>
      <svg viewBox={`0 0 ${W} ${W}`} className="fo-svg fo-svg--carre" role="img" aria-label={txt.resume}>
        <rect width={W} height={W} rx="8" fill="#0b0d12" />
        <circle cx={c0} cy={c0} r={R} fill="none" stroke="rgba(140,170,220,.35)" />
        <polyline points={vrai.map((p) => p.map((v) => v.toFixed(1)).join(',')).join(' ')} fill="none" stroke="rgba(255,179,71,.5)" strokeWidth="1.5" />
        {ech.map(([x, y], n) => (
          <g key={n}>
            <circle cx={x} cy={y} r="9" fill="#ffb347" />
            <text x={x} y={y + 4} textAnchor="middle" className="fo-svg-texte fo-svg-texte--sombre">{n}</text>
          </g>
        ))}
      </svg>
      <Curseur libelle={txt.k} valeur={k} min={-12} max={12} pas={1} onChange={setK} texte={fmt(k)} />
      <p className="fo-etat">{txt.etat(fmt(k), fmt(apparent))}</p>
      <p className="fo-note">{txt.note}</p>
    </figure>
  )
}

/* ---------- La FFT en papillons ---------- */

export function FigurePapillon({ txt, fmt }) {
  const N = 8, etapes = 3
  const W = 520, H = 250, mg = 36, md = 36
  const col = (s) => mg + (s / etapes) * (W - mg - md)
  const lig = (i) => 20 + (i / (N - 1)) * (H - 40)
  const inv = (i) => parseInt(i.toString(2).padStart(3, '0').split('').reverse().join(''), 2)
  const traits = []
  for (let s = 0; s < etapes; s++) {
    const demi = 1 << s, taille = demi << 1
    for (let debut = 0; debut < N; debut += taille) {
      for (let k = 0; k < demi; k++) {
        const p = debut + k, q = p + demi
        traits.push([s, p, p], [s, q, q], [s, p, q], [s, q, p])
      }
    }
  }
  const tailles = [8, 1024, 2048, 1048576]
  return (
    <figure className="figure figure--large">
      <figcaption className="figure-titre">{txt.titre}</figcaption>
      <svg viewBox={`0 0 ${W} ${H}`} className="fo-svg" style={{ maxWidth: 560 }} role="img" aria-label={txt.resume}>
        {traits.map(([s, a, b], i) => (
          <line key={i} x1={col(s)} y1={lig(a)} x2={col(s + 1)} y2={lig(b)} stroke={a === b ? 'var(--discret)' : 'var(--sig)'} strokeWidth="1.3" opacity={a === b ? 0.6 : 0.9} />
        ))}
        {Array.from({ length: N }, (_, i) => (
          <g key={i}>
            <text x={col(0) - 8} y={lig(i) + 4} textAnchor="end" className="courbe-texte">{`z${inv(i)}`}</text>
            <text x={col(etapes) + 8} y={lig(i) + 4} className="courbe-texte">{`c${i}`}</text>
            {Array.from({ length: etapes + 1 }, (_, s) => <circle key={s} cx={col(s)} cy={lig(i)} r="3" fill="var(--texte)" />)}
          </g>
        ))}
      </svg>
      <table className="fo-tableau">
        <thead><tr><th scope="col">N</th><th scope="col">{txt.naive}</th><th scope="col">{txt.rapide}</th></tr></thead>
        <tbody>
          {tailles.map((n) => (
            <tr key={n}><td>{fmt(n)}</td><td>{fmt(n * n)}</td><td>{fmt((n / 2) * Math.log2(n))}</td></tr>
          ))}
        </tbody>
      </table>
      <p className="fo-note">{txt.note}</p>
    </figure>
  )
}

/* ---------- Compression : garder les plus grands cercles ---------- */

export function FigureCompression({ txt, fmt }) {
  const series = useMemo(() => {
    const p = preparer(FORMES.avion, 'vitesse', 2048)
    const valeurs = []
    for (let m = 1; m <= 1000; m = Math.max(m + 1, Math.round(m * 1.15))) valeurs.push(m)
    return ['frequence', 'amplitude'].map((o, q) => ({
      id: o,
      nom: txt.ordres[o],
      points: courbeErreur(p.c, p.ordres[o], valeurs).map(([m, e]) => [+Math.log10(m).toFixed(4), +Math.log10(Math.max(1e-4, e)).toFixed(4)]),
      couleur: q ? '#E69F00' : 'var(--sig)',
      trace: 'ligne',
    }))
  }, [txt])
  const f = p10(fmt)
  const pct = (v) => fmt(10 ** v, { style: 'percent', maximumSignificantDigits: 2 })
  return (
    <>
      <Graphique
        titre={txt.titre}
        series={series}
        x={{ min: 0, max: 3, ticks: [0, 1, 2, 3], titre: txt.axeX, format: f }}
        y={{ min: -3, max: 0, ticks: [-3, -2, -1, 0], titre: txt.axeY, format: (v) => fmt(10 ** v, { style: 'percent', maximumSignificantDigits: 1 }) }}
        info={(x, vals) => txt.info(f(x), vals.map((v) => `${v.serie.nom} : ${pct(v.y)}`).join(' · '))}
        resume={txt.resume}
      />
      <p className="fo-note">{txt.note}</p>
    </>
  )
}

/* ---------- Ptolémée : Mars vue du Soleil et vue de la Terre ---------- */

const ANNEE_MARS = 686.98, ANNEE_TERRE = 365.25, A_MARS = 1.524

export function FigurePtolemee({ txt, fmt }) {
  const [jour, setJour] = useState(300)
  const W = 520, H = 260, S = 52
  const terre = (d) => [Math.cos((TAU * d) / ANNEE_TERRE), Math.sin((TAU * d) / ANNEE_TERRE)]
  const mars = (d) => [A_MARS * Math.cos((TAU * d) / ANNEE_MARS), A_MARS * Math.sin((TAU * d) / ANNEE_MARS)]
  const geo = (d) => { const a = mars(d), b = terre(d); return [a[0] - b[0], a[1] - b[1]] }
  const jours = Array.from({ length: 601 }, (_, i) => (i / 600) * 2 * 780)
  const cg = [W * 0.25, H / 2], cd = [W * 0.75, H / 2]
  const P = (c, [x, y], s = S) => [c[0] + x * s, c[1] - y * s]
  const s2 = 40
  const T0 = terre(jour), M0 = mars(jour), G0 = geo(jour)
  const ligne = (pts) => pts.map((p) => p.map((v) => v.toFixed(1)).join(',')).join(' ')
  return (
    <figure className="figure figure--large">
      <figcaption className="figure-titre">{txt.titre}</figcaption>
      <svg viewBox={`0 0 ${W} ${H}`} className="fo-svg" style={{ maxWidth: 640 }} role="img" aria-label={txt.resume}>
        <rect width={W} height={H} rx="8" fill="#0b0d12" />
        {/* vue du Soleil */}
        <text x={cg[0]} y={18} textAnchor="middle" className="fo-svg-texte">{txt.helio}</text>
        <circle cx={cg[0]} cy={cg[1]} r={S} fill="none" stroke="rgba(127,209,255,.35)" />
        <circle cx={cg[0]} cy={cg[1]} r={A_MARS * S} fill="none" stroke="rgba(255,120,90,.35)" />
        <circle cx={cg[0]} cy={cg[1]} r="7" fill="#ffd84a" />
        <line x1={P(cg, T0)[0]} y1={P(cg, T0)[1]} x2={P(cg, M0)[0]} y2={P(cg, M0)[1]} stroke="rgba(255,255,255,.5)" strokeDasharray="3 4" />
        <circle cx={P(cg, T0)[0]} cy={P(cg, T0)[1]} r="5" fill="#7fd1ff" />
        <circle cx={P(cg, M0)[0]} cy={P(cg, M0)[1]} r="5" fill="#ff785a" />
        {/* vue de la Terre */}
        <text x={cd[0]} y={18} textAnchor="middle" className="fo-svg-texte">{txt.geo}</text>
        <polyline points={ligne(jours.map((d) => P(cd, geo(d), s2)))} fill="none" stroke="rgba(255,120,90,.55)" strokeWidth="1.4" />
        <circle cx={cd[0]} cy={cd[1]} r={A_MARS * s2} fill="none" stroke="rgba(255,255,255,.12)" strokeDasharray="4 4" />
        <line x1={cd[0]} y1={cd[1]} x2={P(cd, G0, s2)[0]} y2={P(cd, G0, s2)[1]} stroke="rgba(255,255,255,.5)" strokeDasharray="3 4" />
        <circle cx={cd[0]} cy={cd[1]} r="5" fill="#7fd1ff" />
        <circle cx={P(cd, G0, s2)[0]} cy={P(cd, G0, s2)[1]} r="5" fill="#ff785a" />
      </svg>
      <div className="fo-legende-fig">
        <span><i style={{ background: '#ffd84a' }} />{txt.soleil}</span>
        <span><i style={{ background: '#7fd1ff' }} />{txt.terre}</span>
        <span><i style={{ background: '#ff785a' }} />{txt.mars}</span>
      </div>
      <Curseur libelle={txt.temps} valeur={jour} min={0} max={1560} pas={2} onChange={setJour} texte={txt.jours(fmt(jour))} />
      <p className="fo-note">{txt.note}</p>
    </figure>
  )
}

/* ---------- Descripteurs : reconnaître une forme dessinée ---------- */

const CANDIDATS = ['cercle', 'ellipse', 'trefle', 'coeur', 'infini', 'poisson', 'carre', 'triangle', 'etoile', 'avion', 'koch']

export function FigureDescripteurs({ txt, fmt }) {
  const toile = useRef(null)
  const trace = useRef(null)
  const [points, setPoints] = useState(null)
  const references = useMemo(() => CANDIDATS.map((id) => [id, descripteur(preparer(FORMES[id], 'vitesse', 1024).c)]), [])
  const resultats = useMemo(() => {
    if (!points) return null
    const d = descripteur(coefficients(reechantillonner(points, 1024, true)))
    return references.map(([id, r]) => [id, distanceDescripteurs(d, r)]).sort((a, b) => a[1] - b[1]).slice(0, 3)
  }, [points, references])

  const dessiner = () => {
    const c = toile.current
    const e = Math.min(window.devicePixelRatio || 1, 2)
    c.width = Math.round(c.clientWidth * e); c.height = Math.round(c.clientHeight * e)
    const ctx = c.getContext('2d')
    ctx.fillStyle = '#0b0d12'
    ctx.fillRect(0, 0, c.width, c.height)
    const pts = trace.current ?? points
    if (pts?.length > 1) {
      ctx.strokeStyle = '#7fd1ff'
      ctx.lineWidth = 2.5 * e
      ctx.lineJoin = 'round'
      ctx.beginPath()
      pts.forEach(([x, y], i) => (i ? ctx.lineTo(x * c.width, y * c.height) : ctx.moveTo(x * c.width, y * c.height)))
      if (!trace.current) ctx.closePath()
      ctx.stroke()
    }
  }
  useEffect(dessiner)
  const pos = (e) => {
    const r = toile.current.getBoundingClientRect()
    return [(e.clientX - r.left) / r.width, (e.clientY - r.top) / r.height]
  }
  return (
    <figure className="figure figure--large">
      <figcaption className="figure-titre">{txt.titre}</figcaption>
      <canvas
        ref={toile}
        className="fo-figure-canvas fo-dessin"
        style={{ aspectRatio: '4 / 3', maxWidth: 420, cursor: 'crosshair', touchAction: 'none' }}
        aria-label={txt.resume}
        onPointerDown={(e) => { e.currentTarget.setPointerCapture?.(e.pointerId); trace.current = [pos(e)]; dessiner() }}
        onPointerMove={(e) => { if (trace.current) { trace.current.push(pos(e)); dessiner() } }}
        onPointerUp={() => { const p = trace.current; trace.current = null; if (p && p.length > 8) setPoints(p.map(([x, y]) => [x * 4, y * 3])); else dessiner() }}
      />
      <p className="fo-etat">
        {resultats
          ? txt.resultat(resultats.map(([id, d]) => `${txt.noms[id]} (${fmt(d, { maximumFractionDigits: 2, minimumFractionDigits: 2 })})`).join(', '))
          : txt.consigne}
      </p>
      <div className="fo-commandes"><button className="btn" onClick={() => setPoints(null)}>{txt.effacer}</button></div>
      <p className="fo-note">{txt.note}</p>
    </figure>
  )
}

