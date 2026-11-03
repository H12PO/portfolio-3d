import { useState } from 'react'
import { useLargeur } from './graphes'

// ============================================================
//  GRAPHIQUE COMMUN : courbes et nuages de points en SVG
//  Une ou plusieurs séries sur les mêmes axes. Survol : viseur
//  vertical et infobulle au point le plus proche ; tableau des
//  données repliable. Les couleurs sont des variables CSS (--sig…)
//  pour suivre le thème. Au-delà d'une série : légende obligatoire.
// ============================================================

const MARGE = { g: 48, d: 16, h: 22, b: 36 }

/**
 * @param series   [{ id, nom, points: [[x, y]], couleur: 'var(--sig)', trace: 'ligne' | 'points' | 'les deux' }]
 * @param x, y     { min, max, ticks: [..], titre, format(v) }
 * @param reperes  [{ x, texte }] : lignes verticales pointillées
 * @param info     (x, valeurs: [{ serie, y }]) → texte de l'infobulle
 * @param resume   phrase lue par les lecteurs d'écran
 * @param tableau  { titre, colonnes: [..], lignes: [[..]] } : vue en tableau
 */
export default function Graphique({ titre, series, x, y, reperes = [], info, resume, tableau, hauteur = 240 }) {
  const [cadre, largeur] = useLargeur(640)
  const [survol, setSurvol] = useState(null) // valeur de x survolée

  const sx = (v) => MARGE.g + ((v - x.min) / (x.max - x.min)) * (largeur - MARGE.g - MARGE.d)
  const sy = (v) => hauteur - MARGE.b - ((v - y.min) / (y.max - y.min)) * (hauteur - MARGE.h - MARGE.b)
  const ticksX = largeur < 480 && x.ticks.length > 4 ? x.ticks.filter((_, k) => k % 2 === 0) : x.ticks

  // Toutes les abscisses présentes, pour accrocher le viseur au point le plus proche
  const abscisses = [...new Set(series.flatMap((s) => s.points.map((p) => p[0])))].sort((a, b) => a - b)

  const surMouvement = (e) => {
    if (!abscisses.length) return
    const r = e.currentTarget.getBoundingClientRect()
    const v = x.min + ((((e.clientX - r.left) / r.width) * largeur - MARGE.g) / (largeur - MARGE.g - MARGE.d)) * (x.max - x.min)
    let meilleur = abscisses[0]
    for (const a of abscisses) if (Math.abs(a - v) < Math.abs(meilleur - v)) meilleur = a
    setSurvol(meilleur)
  }

  const valeurs = survol === null ? [] : series
    .map((s) => ({ serie: s, point: s.points.find((p) => p[0] === survol) }))
    .filter((v) => v.point)
  const haut = valeurs.length ? Math.max(...valeurs.map((v) => v.point[1])) : 0

  return (
    <figure className="figure figure--large">
      <figcaption className="figure-titre">{titre}</figcaption>
      {series.length > 1 && (
        <ul className="legende-graphique">
          {series.map((s) => (
            <li key={s.id}><span style={{ background: s.couleur }} aria-hidden="true" />{s.nom}</li>
          ))}
        </ul>
      )}
      <div className="courbe" ref={cadre}>
        <svg
          viewBox={`0 0 ${largeur} ${hauteur}`}
          role="img"
          aria-label={resume}
          onPointerMove={surMouvement}
          onPointerLeave={() => setSurvol(null)}
        >
          {y.ticks.map((v) => (
            <g key={v}>
              <line className="courbe-grille" x1={MARGE.g} x2={largeur - MARGE.d} y1={sy(v)} y2={sy(v)} />
              <text className="courbe-texte" x={MARGE.g - 8} y={sy(v) + 4} textAnchor="end">{y.format(v)}</text>
            </g>
          ))}
          {ticksX.map((v) => (
            <text key={v} className="courbe-texte" x={sx(v)} y={hauteur - MARGE.b + 18} textAnchor="middle">{x.format(v)}</text>
          ))}
          <text className="courbe-texte" x={largeur - MARGE.d} y={hauteur - 4} textAnchor="end">{x.titre}</text>
          <text className="courbe-texte" x={0} y={MARGE.h - 10}>{y.titre}</text>

          {reperes.map((r) => (
            <g key={r.texte}>
              <line className="courbe-repere" x1={sx(r.x)} x2={sx(r.x)} y1={MARGE.h} y2={hauteur - MARGE.b} />
              <text className="courbe-texte courbe-texte--fort" x={sx(r.x) + 6} y={MARGE.h + 10}>{r.texte}</text>
            </g>
          ))}

          {series.map((s) => (
            <g key={s.id}>
              {s.trace !== 'points' && s.points.length > 1 && (
                <path
                  className="graphique-ligne"
                  style={{ stroke: s.couleur }}
                  d={s.points.map(([a, b], k) => `${k ? 'L' : 'M'}${sx(a).toFixed(1)},${sy(b).toFixed(1)}`).join('')}
                />
              )}
              {s.trace !== 'ligne' && s.points.map(([a, b]) => (
                <circle key={a} className="graphique-point" style={{ fill: s.couleur }} cx={sx(a)} cy={sy(b)} r="4" />
              ))}
            </g>
          ))}

          {survol !== null && (
            <g>
              <line className="courbe-viseur" x1={sx(survol)} x2={sx(survol)} y1={MARGE.h} y2={hauteur - MARGE.b} />
              {valeurs.map((v) => (
                <circle key={v.serie.id} className="graphique-point graphique-point--actif" style={{ fill: v.serie.couleur }} cx={sx(v.point[0])} cy={sy(v.point[1])} r="5" />
              ))}
            </g>
          )}
        </svg>
        {survol !== null && valeurs.length > 0 && (
          <div
            className="courbe-info"
            style={{
              left: `${(sx(survol) / largeur) * 100}%`,
              top: `${(sy(haut) / hauteur) * 100}%`,
              transform: `translate(${sx(survol) < largeur * 0.2 ? '-12%' : sx(survol) > largeur * 0.8 ? '-88%' : '-50%'}, calc(-100% - 12px))`,
            }}
          >
            {info(survol, valeurs.map((v) => ({ serie: v.serie, y: v.point[1] })))}
          </div>
        )}
      </div>
      {tableau && (
        <details className="donnees">
          <summary>{tableau.titre}</summary>
          <table>
            <thead><tr>{tableau.colonnes.map((c) => <th key={c} scope="col">{c}</th>)}</tr></thead>
            <tbody>{tableau.lignes.map((l) => <tr key={l[0]}>{l.map((c, k) => <td key={k}>{c}</td>)}</tr>)}</tbody>
          </table>
        </details>
      )}
    </figure>
  )
}
