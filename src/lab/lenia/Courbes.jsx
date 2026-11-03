import { profilNoyau, CROISSANCES, transitionSmooth } from './modeles.js'

// ============================================================
//  LENIA : les deux courbes de l'éditeur de règles
//  À gauche, le noyau K selon la distance (en rayons) ; à droite,
//  la croissance G selon le potentiel u. Pour SmoothLife : la
//  transition s(n) quand la case est vide (naissance) et pleine (survie).
// ============================================================

const W = 220
const H = 120
const M = { g: 28, d: 8, h: 10, b: 22 }

function Trace({ points, xmin, xmax, ymin, ymax, classe }) {
  const sx = (x) => M.g + ((x - xmin) / (xmax - xmin)) * (W - M.g - M.d)
  const sy = (y) => H - M.b - ((y - ymin) / (ymax - ymin)) * (H - M.h - M.b)
  const d = points.map(([x, y], i) => `${i ? 'L' : 'M'}${sx(x).toFixed(1)} ${sy(Math.max(ymin, Math.min(ymax, y))).toFixed(1)}`).join('')
  return <path d={d} className={classe} />
}

function Axes({ xmin, xmax, ymin, ymax, titreX, ticksX, ticksY, fmt }) {
  const sx = (x) => M.g + ((x - xmin) / (xmax - xmin)) * (W - M.g - M.d)
  const sy = (y) => H - M.b - ((y - ymin) / (ymax - ymin)) * (H - M.h - M.b)
  return (
    <g className="ln-axes">
      <line x1={M.g} x2={W - M.d} y1={sy(Math.max(ymin, 0))} y2={sy(Math.max(ymin, 0))} />
      <line x1={M.g} x2={M.g} y1={M.h} y2={H - M.b} />
      {ticksX.map((t) => <text key={t} x={sx(t)} y={H - M.b + 13} textAnchor="middle">{fmt(t)}</text>)}
      {ticksY.map((t) => <text key={t} x={M.g - 4} y={sy(t) + 3.5} textAnchor="end">{fmt(t)}</text>)}
      <text x={W - M.d} y={H - 2} textAnchor="end" className="ln-axes-titre">{titreX}</text>
    </g>
  )
}

export default function Courbes({ regle, noyau = 0, T, fmt }) {
  const f = (v) => fmt(v, { maximumFractionDigits: 2 })
  if (regle.modele === 'smooth') {
    const pts = (m) => Array.from({ length: 101 }, (_, i) => [i / 100, transitionSmooth(i / 100, m, regle)])
    return (
      <div className="ln-courbes">
        <figure>
          <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={T.courbes.smoothLabel}>
            <Axes xmin={0} xmax={1} ymin={0} ymax={1} titreX="n" ticksX={[0, 0.5, 1]} ticksY={[0, 1]} fmt={f} />
            <Trace points={pts(0)} xmin={0} xmax={1} ymin={0} ymax={1} classe="ln-trace" />
            <Trace points={pts(1)} xmin={0} xmax={1} ymin={0} ymax={1} classe="ln-trace ln-trace--2" />
          </svg>
          <figcaption><span className="ln-pastille" />{T.courbes.naissance} <span className="ln-pastille ln-pastille--2" />{T.courbes.survie}</figcaption>
        </figure>
      </div>
    )
  }
  const k = regle.noyaux[noyau] ?? regle.noyaux[0]
  const profil = profilNoyau(regle, regle.noyaux.indexOf(k))
  const kmax = Math.max(1e-9, ...profil.map((p) => p[1]))
  const type = regle.modele === 'flow' ? 2 : regle.gn ?? 1
  const umax = Math.min(1, Math.max(0.3, k.m * 2.5))
  const croissance = Array.from({ length: 161 }, (_, i) => {
    const u = (i / 160) * umax
    return [u, CROISSANCES[type - 1](u, k.m, k.s)]
  })
  return (
    <div className="ln-courbes">
      <figure>
        <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={T.courbes.noyauLabel}>
          <Axes xmin={0} xmax={1.1} ymin={0} ymax={1} titreX={T.courbes.distance} ticksX={[0, 0.5, 1]} ticksY={[0, 1]} fmt={f} />
          <Trace points={profil.map(([x, y]) => [x, y / kmax])} xmin={0} xmax={1.1} ymin={0} ymax={1} classe="ln-trace" />
        </svg>
        <figcaption>{T.courbes.noyau}</figcaption>
      </figure>
      <figure>
        <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={T.courbes.croissanceLabel}>
          <Axes xmin={0} xmax={umax} ymin={-1} ymax={1} titreX="u" ticksX={[0, umax / 2, umax]} ticksY={[-1, 0, 1]} fmt={f} />
          <Trace points={croissance} xmin={0} xmax={umax} ymin={-1} ymax={1} classe="ln-trace ln-trace--2" />
        </svg>
        <figcaption>{T.courbes.croissance}</figcaption>
      </figure>
    </div>
  )
}
