// ============================================================
//  LIGNES DE DÉSIR : les courbes en direct
//  Une petite courbe par indicateur ; l'axe horizontal est le temps
//  du modèle (en jours). Les indicateurs dépendent du modèle.
// ============================================================

const W = 200
const H = 56

function MiniCourbe({ titre, aide, points, max, format, resume }) {
  const t0 = points.length ? points[0][0] : 0
  const t1 = points.length ? points[points.length - 1][0] : 1
  const haut = max ?? Math.max(1e-6, ...points.map((p) => p[1])) * 1.15
  const sx = (t) => (t1 > t0 ? ((t - t0) / (t1 - t0)) * W : 0)
  const sy = (y) => H - 3 - (Math.min(y, haut) / haut) * (H - 6)
  const dernier = points.length ? format(points[points.length - 1][1]) : '–'
  return (
    <figure className="ld-courbe" title={aide}>
      <figcaption>
        <span>{titre}</span>
        <b>{dernier}</b>
      </figcaption>
      <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" role="img" aria-label={resume(titre, dernier)}>
        <line className="ld-courbe-axe" x1="0" x2={W} y1={H - 3} y2={H - 3} />
        {max === 1 && <line className="ld-courbe-moitie" x1="0" x2={W} y1={sy(0.5)} y2={sy(0.5)} />}
        {points.length > 1 && (
          <polyline className="ld-courbe-trace" points={points.map(([t, y]) => `${sx(t).toFixed(1)},${sy(y).toFixed(1)}`).join(' ')} />
        )}
      </svg>
    </figure>
  )
}

/**
 * historique : liste de mesures (moteur.js, mesurer), avec leur temps t (jours)
 * zones : vrai si le terrain a des zones de comptage (double pont)
 */
export default function Courbes({ historique, modele, zones, T, fmt }) {
  const pct = (x) => fmt(x, { style: 'percent', maximumFractionDigits: 0 })
  const pct1 = (x) => fmt(x, { style: 'percent', maximumFractionDigits: 1 })
  const ent = (x) => fmt(x, { maximumFractionDigits: 0 })
  const m2 = (x) => T.m2(fmt(x, { maximumFractionDigits: 0 }))
  const FORMATS = {
    sentiers: [m2], pietine: [m2], detour: [pct1], confort: [pct, 1], marcheurs: [ent],
    livrees: [ent], chargees: [pct, 1], partA: [pct, 1], debit: [ent],
  }
  const liste = modele === 'fourmis'
    ? (zones ? ['livrees', 'partA', 'chargees'] : ['livrees', 'chargees'])
    : ['sentiers', 'detour', 'confort', 'marcheurs']
  return (
    <div className="ld-courbes" aria-label={T.mesures.titre}>
      {liste.map((cle) => {
        const [format, max] = FORMATS[cle]
        return (
          <MiniCourbe
            key={cle}
            titre={T.mesures[cle][0]}
            aide={T.mesures[cle][1]}
            points={historique.map((m) => [m.t, m[cle]])}
            max={max}
            format={format}
            resume={T.mesures.resume}
          />
        )
      })}
    </div>
  )
}
