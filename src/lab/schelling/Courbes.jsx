// ============================================================
//  SCHELLING : les courbes en direct
//  Une petite courbe par indicateur, une ligne par ville (A, et B
//  quand on compare). L'axe horizontal : les tours écoulés.
// ============================================================

const W = 200
const H = 56

function MiniCourbe({ titre, aide, series, max, format, resume }) {
  const tous = series.flatMap((s) => s.points)
  const t0 = tous.length ? Math.min(...tous.map((p) => p[0])) : 0
  const t1 = tous.length ? Math.max(...tous.map((p) => p[0])) : 1
  const haut = max ?? Math.max(0.05, ...tous.map((p) => p[1])) * 1.1
  const sx = (t) => (t1 > t0 ? ((t - t0) / (t1 - t0)) * W : 0)
  const sy = (y) => H - 3 - (Math.min(y, haut) / haut) * (H - 6)
  return (
    <figure className="sc-courbe" title={aide}>
      <figcaption>
        <span>{titre}</span>
        <span className="sc-courbe-valeurs">
          {series.map((s) => (
            <b key={s.id} style={{ color: s.couleur }}>{s.points.length ? format(s.points[s.points.length - 1][1]) : '–'}</b>
          ))}
        </span>
      </figcaption>
      <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" role="img" aria-label={resume}>
        <line className="sc-courbe-axe" x1="0" x2={W} y1={H - 3} y2={H - 3} />
        {max === 1 && <line className="sc-courbe-moitie" x1="0" x2={W} y1={sy(0.5)} y2={sy(0.5)} />}
        {series.map((s) => s.points.length > 1 && (
          <polyline
            key={s.id}
            className="sc-courbe-trace"
            style={{ stroke: s.couleur }}
            points={s.points.map(([t, y]) => `${sx(t).toFixed(1)},${sy(y).toFixed(1)}`).join(' ')}
          />
        ))}
      </svg>
    </figure>
  )
}

/**
 * historique : { a: [mesures], b: [mesures] | [] } ; chaque mesure vient de mesurer() (moteur.js)
 */
export default function Courbes({ historique, T, fmt, loyers }) {
  const pct = (x) => fmt(x, { style: 'percent', maximumFractionDigits: 0 })
  const dec = (x) => fmt(x, { maximumFractionDigits: 2, minimumFractionDigits: 2 })
  const cotes = [
    { id: 'a', couleur: 'var(--sig)', h: historique.a },
    { id: 'b', couleur: 'var(--serie-2)', h: historique.b },
  ].filter((c) => c.h.length)
  const indicateurs = [
    { cle: 'semblables', max: 1, format: pct },
    { cle: 'satisfaits', max: 1, format: pct },
    { cle: 'theil', max: 1, format: dec },
    loyers && { cle: 'theilRevenus', max: 1, format: dec },
    { cle: 'demenagements', format: dec },
  ].filter(Boolean)
  return (
    <div className="sc-courbes" aria-label={T.mesures.titre}>
      {indicateurs.map((ind) => {
        const series = cotes.map((c) => ({ id: c.id, couleur: c.couleur, points: c.h.map((m) => [m.t, m[ind.cle]]) }))
        const derniers = series.map((s) => (s.points.length ? ind.format(s.points[s.points.length - 1][1]) : '–'))
        return (
          <MiniCourbe
            key={ind.cle}
            titre={T.mesures[ind.cle][0]}
            aide={T.mesures[ind.cle][1]}
            series={series}
            max={ind.max}
            format={ind.format}
            resume={T.mesures.resume(T.mesures[ind.cle][0], derniers)}
          />
        )
      })}
    </div>
  )
}
