// ============================================================
//  BOIDS : les courbes en direct
//  Une petite courbe par indicateur ; l'axe horizontal est le temps
//  du modèle. Les indicateurs montrés dépendent du modèle.
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
    <figure className="bo-courbe" title={aide}>
      <figcaption>
        <span>{titre}</span>
        <b>{dernier}</b>
      </figcaption>
      <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" role="img" aria-label={resume(titre, dernier)}>
        <line className="bo-courbe-axe" x1="0" x2={W} y1={H - 3} y2={H - 3} />
        {max === 1 && <line className="bo-courbe-moitie" x1="0" x2={W} y1={sy(0.5)} y2={sy(0.5)} />}
        {points.length > 1 && (
          <polyline className="bo-courbe-trace" points={points.map(([t, y]) => `${sx(t).toFixed(1)},${sy(y).toFixed(1)}`).join(' ')} />
        )}
      </svg>
    </figure>
  )
}

// Indicateurs montrés selon le modèle
const PAR_MODELE = {
  boids: ['polarisation', 'rotation', 'groupes', 'voisin'],
  vicsek: ['polarisation', 'groupes', 'plusGrand', 'voisin'],
  couzin: ['polarisation', 'rotation', 'groupes', 'voisin'],
  cucker: ['polarisation', 'dispersion', 'groupes', 'voisin'],
}

/**
 * historique : liste de mesures (moteur.js, mesurer), avec leur temps t
 */
export default function Courbes({ historique, modele, predateurs, T, fmt }) {
  const pct = (x) => fmt(x, { style: 'percent', maximumFractionDigits: 0 })
  const dec = (x) => fmt(x, { maximumFractionDigits: 2, minimumFractionDigits: 2 })
  const ent = (x) => fmt(x, { maximumFractionDigits: 0 })
  const FORMATS = {
    polarisation: [dec, 1], rotation: [dec, 1], plusGrand: [pct, 1], groupes: [ent], voisin: [dec], dispersion: [dec], captures: [ent],
  }
  const liste = [...(PAR_MODELE[modele] ?? PAR_MODELE.boids)]
  if (modele === 'boids' && predateurs > 0) liste[3] = 'captures'
  return (
    <div className="bo-courbes" aria-label={T.mesures.titre}>
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
