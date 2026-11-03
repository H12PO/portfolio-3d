import { memo, useMemo, useState } from 'react'
import { useLargeur } from '../commun/graphes'
import { indice, courbeErreur } from './moteur'

// ============================================================
//  ÉPICYCLES DE FOURIER : sous l'explorateur, le spectre (la taille de
//  chaque cercle selon sa fréquence, en échelle logarithmique) et
//  l'erreur selon le nombre de cercles, dans les deux ordres.
//  Deux graphiques SVG autonomes (styles fo- de fourier.css) : ils ne
//  dépendent pas des styles des onglets de lecture, et leur bulle de
//  survol est posée par-dessus, sans rien décaler.
// ============================================================

const KV = 40           // fréquences montrées : −KV … KV
const PLANCHER = -5     // log10 de l'amplitude relative la plus petite montrée
const ERREUR_MIN = -4   // log10 de la plus petite erreur montrée (0,01 %)
const COULEURS = { frequence: 'var(--sig)', amplitude: '#E69F00' }

const puissance = (v) => (v === 0 ? '1' : `10${String(v).replace('-', '⁻').replace(/\d/g, (d) => '⁰¹²³⁴⁵⁶⁷⁸⁹'[d])}`)

// La bulle : centrée sur le point survolé, mais calée à gauche ou à droite près des bords
function Bulle({ x, largeur, children }) {
  const cote = x < largeur * 0.3 ? 'gauche' : x > largeur * 0.7 ? 'droite' : 'centre'
  return (
    <div className={`fo-bulle fo-bulle--${cote}`} style={{ left: `${(x / largeur) * 100}%` }}>
      {children}
    </div>
  )
}

/* ---------- Le spectre en barres (aussi utilisé par la figure des symétries) ---------- */

export function Barres({ c, gardes, T, fmt, hauteur = 150, kv = KV, couleur }) {
  const [ref, largeur] = useLargeur(560)
  const [survol, setSurvol] = useState(null)
  const m = { g: 34, d: 8, h: 8, b: 26 }
  const n = 2 * kv + 1
  const lc = largeur - m.g - m.d
  const pas = lc / n
  let max = 0
  for (let j = 1; j < c.N; j++) max = Math.max(max, c.amp[j])
  const sy = (v) => m.h + (v / PLANCHER) * (hauteur - m.h - m.b)
  const relatif = (k) => c.amp[indice(k, c.N)] / (max || 1)

  const barres = []
  for (let k = -kv; k <= kv; k++) {
    if (!k) continue
    const v = Math.max(PLANCHER, Math.log10(relatif(k) || 1e-12))
    const garde = gardes.has(indice(k, c.N))
    barres.push(
      <rect key={k} x={m.g + (k + kv) * pas + 0.5} width={Math.max(1, pas - 1)} y={sy(v)} height={Math.max(0.5, sy(PLANCHER) - sy(v))}
        fill={couleur ? couleur(k) : garde ? 'var(--sig)' : 'var(--discret)'} opacity={garde || couleur ? 0.95 : 0.35} />,
    )
  }

  const surMouvement = (e) => {
    const r = e.currentTarget.getBoundingClientRect()
    const x = ((e.clientX - r.left) / r.width) * largeur
    const k = Math.floor((x - m.g) / pas) - kv
    setSurvol(k >= -kv && k <= kv && k !== 0 ? k : null)
  }

  const reperesK = [-kv, -kv / 2, 0, kv / 2, kv].map(Math.round)
  const xs = survol === null ? 0 : m.g + (survol + kv + 0.5) * pas
  return (
    <div className="fo-graphe" ref={ref}>
      <svg viewBox={`0 0 ${largeur} ${hauteur}`} role="img" aria-label={T.spectre.resume} onPointerMove={surMouvement} onPointerLeave={() => setSurvol(null)}>
        {[0, -1, -2, -3, -4, -5].map((v) => (
          <g key={v}>
            <line className="fo-grille" x1={m.g} x2={m.g + lc} y1={sy(v)} y2={sy(v)} />
            <text className="fo-axe" x={m.g - 5} y={sy(v) + 4} textAnchor="end">{puissance(v)}</text>
          </g>
        ))}
        {survol !== null && <rect className="fo-survol" x={m.g + (survol + kv) * pas} width={pas} y={m.h} height={sy(PLANCHER) - m.h} />}
        {barres}
        {reperesK.map((k) => <text key={k} className="fo-axe" x={m.g + (k + kv + 0.5) * pas} y={hauteur - 8} textAnchor="middle">{fmt(k)}</text>)}
      </svg>
      {survol !== null && (
        <Bulle x={xs} largeur={largeur}>
          {T.spectre.info(fmt(survol), fmt(relatif(survol), { maximumSignificantDigits: 2 }))}
        </Bulle>
      )}
    </div>
  )
}

/* ---------- L'erreur selon le nombre de cercles ---------- */

function CourbeErreur({ c, ordres, M, T, fmt }) {
  const [ref, largeur] = useLargeur(560)
  const [survol, setSurvol] = useState(null)   // nombre de cercles survolé
  const hauteur = 176
  const m = { g: 54, d: 12, h: 12, b: 30 }
  const xMax = Math.log10(c.N - 1)
  const sx = (v) => m.g + (v / xMax) * (largeur - m.g - m.d)
  const sy = (v) => m.h + (v / ERREUR_MIN) * (hauteur - m.h - m.b)

  // L'erreur exacte pour chaque nombre de cercles de 1 à N − 1, dans les deux ordres (Parseval)
  const erreurs = useMemo(() => {
    const tous = Array.from({ length: c.N - 1 }, (_, i) => i + 1)
    return Object.fromEntries(['frequence', 'amplitude'].map((o) => [o, courbeErreur(c, ordres[o], tous).map(([, e]) => e)]))
  }, [c, ordres])
  // Les abscisses tracées : tous les entiers jusqu'à 100, puis un pas logarithmique
  const tracees = useMemo(() => {
    const v = []
    for (let k = 1; k < c.N; k = k < 100 ? k + 1 : Math.max(k + 1, Math.round(k * 1.03))) v.push(k)
    if (v[v.length - 1] !== c.N - 1) v.push(c.N - 1)
    return v
  }, [c.N])
  const ly = (e) => Math.max(ERREUR_MIN, Math.log10(Math.max(e, 1e-12)))
  const chemin = (o) => tracees.map((k, q) => `${q ? 'L' : 'M'}${sx(Math.log10(k)).toFixed(1)},${sy(ly(erreurs[o][k - 1])).toFixed(1)}`).join('')

  const pct = (e) => (e < 1e-4 ? `< ${fmt(1e-4, { style: 'percent', maximumFractionDigits: 2 })}` : fmt(e, { style: 'percent', maximumSignificantDigits: 2 }))
  const axeY = (v) => fmt(10 ** v, { style: 'percent', maximumFractionDigits: 2 })

  const surMouvement = (e) => {
    const r = e.currentTarget.getBoundingClientRect()
    const x = ((e.clientX - r.left) / r.width) * largeur
    const v = ((x - m.g) / (largeur - m.g - m.d)) * xMax
    if (v < -0.05 || v > xMax + 0.05) { setSurvol(null); return }
    setSurvol(Math.min(c.N - 1, Math.max(1, Math.round(10 ** Math.max(0, v)))))
  }

  const Mc = Math.min(c.N - 1, Math.max(1, M))
  const xM = sx(Math.log10(Mc))
  const etiquetteADroite = xM < largeur * 0.72
  const xs = survol === null ? 0 : sx(Math.log10(survol))
  return (
    <>
      <ul className="fo-legende-courbes">
        {['frequence', 'amplitude'].map((o) => <li key={o}><span style={{ background: COULEURS[o] }} aria-hidden="true" />{T.ordres[o]}</li>)}
      </ul>
      <div className="fo-graphe" ref={ref}>
        <svg viewBox={`0 0 ${largeur} ${hauteur}`} role="img" aria-label={T.erreurResume} onPointerMove={surMouvement} onPointerLeave={() => setSurvol(null)}>
          {[0, -1, -2, -3, -4].map((v) => (
            <g key={v}>
              <line className="fo-grille" x1={m.g} x2={largeur - m.d} y1={sy(v)} y2={sy(v)} />
              <text className="fo-axe" x={m.g - 6} y={sy(v) + 4} textAnchor="end">{axeY(v)}</text>
            </g>
          ))}
          {[0, 1, 2, 3].map((v) => <text key={v} className="fo-axe" x={sx(v)} y={hauteur - m.b + 16} textAnchor="middle">{fmt(10 ** v)}</text>)}
          <text className="fo-axe" x={largeur - m.d} y={hauteur - 2} textAnchor="end">{T.cerclesAxe}</text>

          {/* le nombre de cercles choisi */}
          <line className="fo-repere" x1={xM} x2={xM} y1={m.h} y2={sy(ERREUR_MIN)} />
          <text className="fo-axe fo-axe--fort" x={etiquetteADroite ? xM + 5 : xM - 5} y={m.h + 10} textAnchor={etiquetteADroite ? 'start' : 'end'}>{T.ici(fmt(Mc))}</text>

          {['frequence', 'amplitude'].map((o) => <path key={o} className="fo-ligne" style={{ stroke: COULEURS[o] }} d={chemin(o)} />)}
          {['frequence', 'amplitude'].map((o) => <circle key={o} className="fo-point" style={{ fill: COULEURS[o] }} cx={xM} cy={sy(ly(erreurs[o][Mc - 1]))} r="3.5" />)}

          {survol !== null && (
            <g>
              <line className="fo-viseur" x1={xs} x2={xs} y1={m.h} y2={sy(ERREUR_MIN)} />
              {['frequence', 'amplitude'].map((o) => <circle key={o} className="fo-point fo-point--actif" style={{ fill: COULEURS[o] }} cx={xs} cy={sy(ly(erreurs[o][survol - 1]))} r="4.5" />)}
            </g>
          )}
        </svg>
        {survol !== null && (
          <Bulle x={xs} largeur={largeur}>
            <strong>{T.ici(fmt(survol))}</strong>
            {['frequence', 'amplitude'].map((o) => (
              <span key={o}><i style={{ background: COULEURS[o] }} aria-hidden="true" />{T.ordres[o]} : {pct(erreurs[o][survol - 1])}</span>
            ))}
          </Bulle>
        )}
      </div>
    </>
  )
}

function Spectre({ prep, ordre, M, T, fmt }) {
  const { c, ordres } = prep
  const gardes = useMemo(() => new Set(ordres[ordre].slice(0, M)), [ordres, ordre, M])
  return (
    <div className="fo-mesures">
      <figure className="fo-panneau">
        <figcaption>{T.spectre.titre}</figcaption>
        <Barres c={c} gardes={gardes} T={T} fmt={fmt} />
        <p className="fo-note">{T.spectre.note(fmt(KV))}</p>
      </figure>
      <figure className="fo-panneau">
        <figcaption>{T.erreurTitre}</figcaption>
        <CourbeErreur c={c} ordres={ordres} M={M} T={T} fmt={fmt} />
      </figure>
    </div>
  )
}

// L'explorateur se redessine quatre fois par seconde (la barre d'état) : on ne recalcule
// les graphiques que si la forme, l'ordre, le nombre de cercles ou la langue changent.
export default memo(Spectre, (a, b) => a.prep === b.prep && a.ordre === b.ordre && a.M === b.M && a.T === b.T)