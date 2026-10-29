import { useEffect, useRef, useState } from 'react'
import { creerMonde, avancer, reculer, regleLettres, essaiAutoroute, generateur } from './moteur'
import { THEMES } from './rendu'

// ============================================================
//  FIGURES DE L'ONGLET THÉORIE
//  Toutes tournent sur le vrai moteur, dans le navigateur.
// ============================================================

// Prépare un canvas à la taille de son affichage (écran haute densité compris)
function preparer(canvas) {
  const e = Math.min(window.devicePixelRatio || 1, 2)
  canvas.width = Math.max(1, Math.round(canvas.clientWidth * e))
  canvas.height = Math.max(1, Math.round(canvas.clientHeight * e))
  return { ctx: canvas.getContext('2d'), e }
}

function dessinerFourmi(ctx, f, x, y, z, th, e) {
  const a = (f.dir * Math.PI) / 2
  const r = z * 0.42
  ctx.fillStyle = th.sig
  ctx.strokeStyle = th.contour
  ctx.lineWidth = 1.5 * e
  ctx.beginPath()
  ctx.moveTo(x + Math.sin(a) * r, y - Math.cos(a) * r)
  ctx.lineTo(x + Math.sin(a + 2.4) * r, y - Math.cos(a + 2.4) * r)
  ctx.lineTo(x + Math.sin(a - 2.4) * r, y - Math.cos(a - 2.4) * r)
  ctx.closePath()
  ctx.fill()
  ctx.stroke()
}

/* ---------- Le damier : horizontal sur les cases teintées, vertical sur les unies ---------- */

// Dimensions paires : sur le tore, passer d'un bord à l'autre change aussi de case de damier
const DW = 14
const DH = 10
const nouveauDamier = () => creerMonde({ W: DW, H: DH, regle: regleLettres('RL'), bords: 'tore' })

export function FigureDamier({ txt, theme }) {
  const canvasRef = useRef(null)
  const monde = useRef(null)
  const [pas, setPas] = useState(0)
  const [dernier, setDernier] = useState(null)   // { teintee, horizontal }

  useEffect(() => {
    monde.current ??= nouveauDamier()
    const m = monde.current
    const th = THEMES[theme]
    const { ctx, e } = preparer(canvasRef.current)
    const z = Math.min(ctx.canvas.width / DW, ctx.canvas.height / DH)
    const ox = (ctx.canvas.width - DW * z) / 2
    const oy = (ctx.canvas.height - DH * z) / 2

    ctx.fillStyle = th.feuille
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height)
    for (let y = 0; y < DH; y++) {
      for (let x = 0; x < DW; x++) {
        if ((x + y) % 2) {
          ctx.fillStyle = `rgba(${th.grille}, .55)`
          ctx.fillRect(ox + x * z, oy + y * z, z, z)
        }
        if (m.couleur[y * DW + x]) {
          const b = z * 0.18
          ctx.fillStyle = th.encre
          ctx.fillRect(ox + x * z + b, oy + y * z + b, z - 2 * b, z - 2 * b)
        }
      }
    }
    const f = m.fourmis[0]
    dessinerFourmi(ctx, f, ox + (f.x + 0.5) * z, oy + (f.y + 0.5) * z, z, th, e)
  }, [pas, theme])

  const unPas = () => {
    const m = monde.current
    const avant = m.fourmis[0].y
    avancer(m, 1)
    const f = m.fourmis[0]
    setDernier({ teintee: (f.x + f.y) % 2 === 1, horizontal: f.y === avant })
    setPas(m.pas)
  }

  const recommencer = () => {
    monde.current = nouveauDamier()
    setDernier(null)
    setPas(0)
  }

  return (
    <figure className="figure">
      <canvas ref={canvasRef} className="figure-canvas figure-canvas--damier" aria-hidden="true" />
      <figcaption>
        <p>{txt.legende}</p>
        <p className="figure-etat" aria-live="polite">{dernier ? txt.etat(pas, dernier.teintee, dernier.horizontal) : txt.depart}</p>
        <div className="figure-actions">
          <button className="btn" onClick={unPas}>{txt.unPas}</button>
          <button className="btn" onClick={recommencer} disabled={pas === 0}>{txt.recommencer}</button>
        </div>
      </figcaption>
    </figure>
  )
}

/* ---------- Remonter le temps ---------- */

const RW = 96
const VUE = 56          // on montre le centre de la feuille
const CIBLE = 2000
const PAR_IMAGE = 40

export function FigureRetour({ txt, theme, fmt }) {
  const canvasRef = useRef(null)
  const monde = useRef(null)
  const anim = useRef(0)
  const [pas, setPas] = useState(0)
  const [marquees, setMarquees] = useState(0)
  const [enCours, setEnCours] = useState(false)

  const dessiner = () => {
    monde.current ??= creerMonde({ W: RW, H: RW, regle: regleLettres('RL'), bords: 'tore' })
    const m = monde.current
    const th = THEMES[theme]
    const { ctx, e } = preparer(canvasRef.current)
    const z = Math.min(ctx.canvas.width, ctx.canvas.height) / VUE
    const ox = (ctx.canvas.width - VUE * z) / 2
    const oy = (ctx.canvas.height - VUE * z) / 2
    const d = (RW - VUE) / 2
    ctx.fillStyle = th.feuille
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height)
    ctx.fillStyle = th.encre
    let n = 0
    for (let y = 0; y < RW; y++) {
      for (let x = 0; x < RW; x++) {
        if (!m.couleur[y * RW + x]) continue
        n++
        if (x >= d && x < d + VUE && y >= d && y < d + VUE) ctx.fillRect(ox + (x - d) * z, oy + (y - d) * z, z, z)
      }
    }
    const f = m.fourmis[0]
    dessinerFourmi(ctx, f, ox + (f.x - d + 0.5) * z, oy + (f.y - d + 0.5) * z, Math.max(z, 9 * e), th, e)
    return n
  }

  // Redessine à chaque rendu (thème changé, premier affichage) : 96 × 96 cases, c'est instantané
  useEffect(() => { dessiner() })

  // Arrête l'animation si on quitte l'onglet en cours de route
  useEffect(() => {
    const a = anim
    return () => cancelAnimationFrame(a.current)
  }, [])

  const animer = (sens) => {
    cancelAnimationFrame(anim.current)
    setEnCours(true)
    const image = () => {
      const m = monde.current
      if (sens > 0) avancer(m, Math.min(PAR_IMAGE, CIBLE - m.pas))
      else reculer(m, PAR_IMAGE)
      setMarquees(dessiner())
      setPas(m.pas)
      const fini = sens > 0 ? m.pas >= CIBLE : m.pas === 0
      if (fini) setEnCours(false)
      else anim.current = requestAnimationFrame(image)
    }
    anim.current = requestAnimationFrame(image)
  }

  return (
    <figure className="figure">
      <canvas ref={canvasRef} className="figure-canvas" aria-hidden="true" />
      <figcaption>
        <p>{txt.legende}</p>
        <p className="figure-etat" aria-live="polite">
          <span>{txt.pas(fmt(pas))}</span>
          <span>{txt.cases(marquees, fmt(marquees))}</span>
        </p>
        <div className="figure-actions">
          <button className="btn" onClick={() => animer(1)} disabled={enCours || pas >= CIBLE}>{txt.avancer}</button>
          <button className="btn" onClick={() => animer(-1)} disabled={enCours || pas === 0}>{txt.reculer}</button>
        </div>
      </figcaption>
    </figure>
  )
}

/* ---------- Largeur réelle d'un graphique ---------- */

// Le viewBox suit la largeur affichée : 1 unité = 1 pixel, donc des libellés lisibles sur mobile
function useLargeur(defaut) {
  const ref = useRef(null)
  const [largeur, setLargeur] = useState(defaut)
  useEffect(() => {
    const obs = new ResizeObserver(([e]) => setLargeur(Math.max(280, Math.round(e.contentRect.width))))
    obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])
  return [ref, largeur]
}

/* ---------- Courbe : distance au départ en fonction du nombre de pas ---------- */

const HAUTEUR = 260
const MARGE = { g: 48, d: 16, h: 18, b: 36 }

export function FigureCourbe({ txt, mesures, fmt }) {
  const [cadre, largeur] = useLargeur(640)
  const [survol, setSurvol] = useState(null)
  const { points, debut } = mesures
  const xmax = points[points.length - 1][0]
  const ymax = Math.ceil(Math.max(...points.map((p) => p[1])) / 100) * 100
  const sx = (s) => MARGE.g + (s / xmax) * (largeur - MARGE.g - MARGE.d)
  const sy = (d) => HAUTEUR - MARGE.b - (d / ymax) * (HAUTEUR - MARGE.h - MARGE.b)
  const trace = points.map(([s, d], k) => `${k ? 'L' : 'M'}${sx(s).toFixed(1)},${sy(d).toFixed(1)}`).join('')
  const ticksX = (largeur < 480 ? [0, 10000, 20000] : [0, 5000, 10000, 15000, 20000]).filter((v) => v <= xmax)
  const ticksY = Array.from({ length: ymax / 100 + 1 }, (_, k) => k * 100)

  const surMouvement = (e) => {
    const r = e.currentTarget.getBoundingClientRect()
    const x = ((e.clientX - r.left) / r.width) * largeur
    const s = ((x - MARGE.g) / (largeur - MARGE.g - MARGE.d)) * xmax
    const k = Math.round((s / xmax) * (points.length - 1))
    setSurvol(Math.min(points.length - 1, Math.max(0, k)))
  }

  const p = survol !== null ? points[survol] : null

  return (
    <figure className="figure figure--large">
      <figcaption className="figure-titre">{txt.titre}</figcaption>
      <div className="courbe" ref={cadre}>
        <svg
          viewBox={`0 0 ${largeur} ${HAUTEUR}`}
          role="img"
          aria-label={txt.resume(fmt(debut))}
          onPointerMove={surMouvement}
          onPointerLeave={() => setSurvol(null)}
        >
          {ticksY.map((v) => (
            <g key={v}>
              <line className="courbe-grille" x1={MARGE.g} x2={largeur - MARGE.d} y1={sy(v)} y2={sy(v)} />
              <text className="courbe-texte" x={MARGE.g - 8} y={sy(v) + 4} textAnchor="end">{fmt(v)}</text>
            </g>
          ))}
          {ticksX.map((v) => (
            <text key={v} className="courbe-texte" x={sx(v)} y={HAUTEUR - MARGE.b + 18} textAnchor="middle">{fmt(v)}</text>
          ))}
          <text className="courbe-texte" x={largeur - MARGE.d} y={HAUTEUR - 4} textAnchor="end">{txt.axeX}</text>
          <text className="courbe-texte" x={MARGE.g - 8} y={MARGE.h - 6} textAnchor="end">{txt.axeY}</text>

          <line className="courbe-repere" x1={sx(debut)} x2={sx(debut)} y1={MARGE.h} y2={HAUTEUR - MARGE.b} />
          <text className="courbe-texte courbe-texte--fort" x={sx(debut) - 6} y={MARGE.h + 10} textAnchor="end">{txt.debut(fmt(debut))}</text>

          <path className="courbe-ligne" d={trace} />

          {p && (
            <g>
              <line className="courbe-viseur" x1={sx(p[0])} x2={sx(p[0])} y1={MARGE.h} y2={HAUTEUR - MARGE.b} />
              <circle className="courbe-point" cx={sx(p[0])} cy={sy(p[1])} r="4.5" />
            </g>
          )}
        </svg>
        {p && (
          <div
            className="courbe-info"
            style={{ left: `${(sx(p[0]) / largeur) * 100}%`, top: `${(sy(p[1]) / HAUTEUR) * 100}%` }}
          >
            {txt.info(fmt(p[0]), fmt(Math.round(p[1] * 10) / 10))}
          </div>
        )}
      </div>
      <details className="donnees">
        <summary>{txt.donnees}</summary>
        <table>
          <thead><tr><th scope="col">{txt.colPas}</th><th scope="col">{txt.colDist}</th></tr></thead>
          <tbody>
            {points.filter(([s]) => s % 1000 === 0).map(([s, d]) => (
              <tr key={s}><td>{fmt(s)}</td><td>{fmt(Math.round(d * 10) / 10)}</td></tr>
            ))}
          </tbody>
        </table>
      </details>
    </figure>
  )
}

/* ---------- Tableau des mesures ---------- */

export function TableMesures({ txt, mesures, fmt, lang }) {
  const v = txt.valeurs
  const loc = lang === 'en' ? 'en-US' : 'fr-FR'
  const vitesse = (Math.sqrt(8) / 104).toLocaleString(loc, { maximumFractionDigits: 4 })
  const exposant = mesures.exposant.toLocaleString(loc, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  const lignes = [
    [txt.debut, v.debut(fmt(mesures.debut))],
    [txt.periode, v.periode(mesures.periode)],
    [txt.deplacement, v.deplacement],
    [txt.vitesse, v.vitesse(vitesse)],
    [txt.marquees, v.marquees(fmt(mesures.marqueesAuDebut))],
    [txt.exposant, v.exposant(exposant, fmt(mesures.intervalle[0]), fmt(mesures.intervalle[1]))],
  ]
  return (
    <table className="mesures">
      <caption>{txt.titre}</caption>
      <tbody>
        {lignes.map(([nom, val]) => <tr key={nom}><th scope="row">{nom}</th><td>{val}</td></tr>)}
      </tbody>
    </table>
  )
}

/* ---------- Monte Carlo : début de l'autoroute sur des feuilles aléatoires ---------- */

const MC = { essais: 200, cote: 8, densite: 0.5, graine: 2026, tranche: 2000, tranches: 16 }
const H_HAUTEUR = 240
const H_MARGE = { g: 44, d: 16, h: 24, b: 36 }
const LIMITE = MC.tranche * (MC.tranches - 1)   // la dernière tranche regroupe tout ce qui dépasse

// Colonne aux angles du haut arrondis (4 px), carrée sur la ligne de base
function colonne(x, y, l, h) {
  if (h <= 0) return ''
  const r = Math.min(4, h, l / 2)
  return `M${x},${y + h}V${y + r}Q${x},${y} ${x + r},${y}H${x + l - r}Q${x + l},${y} ${x + l},${y + r}V${y + h}Z`
}

const quantile = (tri, p) => tri[Math.min(tri.length - 1, Math.floor(tri.length * p))]

export function FigureMonteCarlo({ txt, fmt, mesures }) {
  const [cadre, largeur] = useLargeur(640)
  const monde = useRef(null)
  const anim = useRef(0)
  const [graine, setGraine] = useState(MC.graine)
  const [resultats, setResultats] = useState(null)   // pas de début de l'autoroute, ou null si jamais atteinte
  const [enCours, setEnCours] = useState(false)
  const [survol, setSurvol] = useState(null)

  useEffect(() => {
    const a = anim
    return () => cancelAnimationFrame(a.current)
  }, [])

  // Les essais sont répartis sur plusieurs images (12 ms de calcul par image) pour ne pas figer la page
  const lancer = (g) => {
    cancelAnimationFrame(anim.current)
    monde.current ??= creerMonde({ W: 1024, H: 1024, regle: regleLettres('RL') })
    const alea = generateur(g)
    const liste = []
    setGraine(g)
    setResultats([])
    setEnCours(true)
    const image = () => {
      const t0 = performance.now()
      while (liste.length < MC.essais && performance.now() - t0 < 12) {
        liste.push(essaiAutoroute(monde.current, { cote: MC.cote, densite: MC.densite, alea }))
      }
      setResultats([...liste])
      if (liste.length < MC.essais) anim.current = requestAnimationFrame(image)
      else setEnCours(false)
    }
    anim.current = requestAnimationFrame(image)
  }

  const liste = resultats ?? []
  const atteints = liste.filter((v) => v !== null).sort((a, b) => a - b)
  const comptes = Array(MC.tranches).fill(0)
  for (const v of atteints) comptes[Math.min(MC.tranches - 1, Math.floor(v / MC.tranche))]++
  const plusHaut = Math.max(...comptes)
  const ymax = Math.max(20, Math.ceil(plusHaut / 20) * 20)
  const ticksY = Array.from({ length: ymax / 20 + 1 }, (_, k) => k * 20).filter((v) => ymax <= 100 || v % 40 === 0)

  const largeurUtile = largeur - H_MARGE.g - H_MARGE.d
  const fente = largeurUtile / MC.tranches
  const sx = (pas) => H_MARGE.g + (pas / MC.tranche) * fente
  const sy = (n) => H_HAUTEUR - H_MARGE.b - (n / ymax) * (H_HAUTEUR - H_MARGE.h - H_MARGE.b)
  const bornes = (k) => [k * MC.tranche, k === MC.tranches - 1 ? null : (k + 1) * MC.tranche]
  const vide = mesures.debut
  const fini = resultats !== null && !enCours

  const lignes = fini && atteints.length
    ? [
        [txt.lignes.atteintes, txt.valeurs.atteintes(atteints.length, liste.length)],
        [txt.lignes.mediane, txt.valeurs.pas(fmt(quantile(atteints, 0.5)))],
        [txt.lignes.deciles, txt.valeurs.deux(fmt(quantile(atteints, 0.1)), fmt(quantile(atteints, 0.9)))],
        [txt.lignes.extremes, txt.valeurs.deux(fmt(atteints[0]), fmt(atteints[atteints.length - 1]))],
        [txt.lignes.graine, String(graine)],
      ]
    : null

  const [a, b] = survol !== null ? bornes(survol) : []
  const info = survol !== null ? txt.barre(fmt(a), b === null ? null : fmt(b - 1), comptes[survol]) : null

  return (
    <figure className="figure figure--large">
      <figcaption className="figure-titre">{txt.titre}</figcaption>
      <div className="courbe" ref={cadre}>
        <svg viewBox={`0 0 ${largeur} ${H_HAUTEUR}`} role="img" aria-label={txt.resume} onPointerLeave={() => setSurvol(null)}>
          {ticksY.map((v) => (
            <g key={v}>
              <line className="courbe-grille" x1={H_MARGE.g} x2={largeur - H_MARGE.d} y1={sy(v)} y2={sy(v)} />
              <text className="courbe-texte" x={H_MARGE.g - 8} y={sy(v) + 4} textAnchor="end">{fmt(v)}</text>
            </g>
          ))}
          {[0, 10000, 20000, LIMITE].map((v) => (
            <text key={v} className="courbe-texte" x={sx(v)} y={H_HAUTEUR - H_MARGE.b + 18} textAnchor="middle">
              {v === LIMITE ? `${fmt(v)}\u202f+` : fmt(v)}
            </text>
          ))}
          <text className="courbe-texte" x={largeur - H_MARGE.d} y={H_HAUTEUR - 4} textAnchor="end">{txt.axeX}</text>
          <text className="courbe-texte" x={0} y={H_MARGE.h - 10}>{txt.axeY}</text>

          {survol !== null && (
            <rect className="histo-survol" x={sx(survol * MC.tranche)} y={H_MARGE.h} width={fente} height={H_HAUTEUR - H_MARGE.h - H_MARGE.b} />
          )}
          {comptes.map((n, k) => (
            <path key={k} className="histo-barre" d={colonne(sx(k * MC.tranche) + 1, sy(n), fente - 2, sy(0) - sy(n))} />
          ))}

          <line className="courbe-repere" x1={sx(vide)} x2={sx(vide)} y1={H_MARGE.h} y2={H_HAUTEUR - H_MARGE.b} />
          <text className="courbe-texte courbe-texte--fort" x={sx(vide) + 6} y={H_MARGE.h + 10}>{txt.vide(fmt(vide))}</text>

          {/* Zones de survol : toute la hauteur de chaque tranche, plus large que la barre */}
          {fini && comptes.map((_, k) => (
            <rect
              key={k}
              className="histo-cible"
              x={sx(k * MC.tranche)}
              y={H_MARGE.h}
              width={fente}
              height={H_HAUTEUR - H_MARGE.h - H_MARGE.b}
              onPointerEnter={() => setSurvol(k)}
            />
          ))}
        </svg>
        {info && (
          <div
            className="courbe-info"
            style={{
              left: `${((sx(survol * MC.tranche) + fente / 2) / largeur) * 100}%`,
              top: `${(sy(comptes[survol]) / H_HAUTEUR) * 100}%`,
              // près des bords, l'infobulle se décale vers l'intérieur du graphique
              transform: `translate(${survol < 3 ? '-12%' : survol > MC.tranches - 4 ? '-88%' : '-50%'}, calc(-100% - 10px))`,
            }}
          >
            {info}
          </div>
        )}
        {!fini && (
          <div className="histo-lancer">
            {enCours
              ? <p aria-live="polite">{txt.calcul(liste.length, MC.essais)}</p>
              : (
                <>
                  <button className="btn-principal" onClick={() => lancer(MC.graine)}>{txt.lancer}</button>
                  <p>{txt.attente}</p>
                </>
              )}
          </div>
        )}
      </div>

      {lignes && (
        <>
          <table className="mesures mesures--serre">
            <tbody>
              {lignes.map(([nom, val]) => <tr key={nom}><th scope="row">{nom}</th><td>{val}</td></tr>)}
            </tbody>
          </table>
          <div className="figure-actions">
            <button className="btn" onClick={() => lancer(graine + 1)}>{txt.autre}</button>
          </div>
          <details className="donnees">
            <summary>{txt.donnees}</summary>
            <table>
              <thead><tr><th scope="col">{txt.colTranche}</th><th scope="col">{txt.colNombre}</th></tr></thead>
              <tbody>
                {comptes.map((n, k) => {
                  const [a, b] = bornes(k)
                  return <tr key={k}><td>{txt.tranche(fmt(a), b === null ? null : fmt(b - 1))}</td><td>{fmt(n)}</td></tr>
                })}
              </tbody>
            </table>
          </details>
        </>
      )}
    </figure>
  )
}
