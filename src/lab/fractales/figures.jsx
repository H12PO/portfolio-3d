import { useEffect, useRef, useState } from 'react'
import { preparer } from '../commun/graphes'
import { creerGPU } from '../commun/gpu'
import { EVASION } from './shaders'
import { rendreCPU, buddhaCPU, orbite, periode, iterationsAvantEvasion, attracteur, centresDoublement, rendreFloat32 } from './cpu.js'
import { pasDe, iterationsAuto, LIEUX, fractale } from './formules.js'

// ============================================================
//  FIGURES DES FRACTALES
//  Calculées sur le processeur, dans le navigateur, sauf le banc
//  d'essai qui mesure aussi la carte graphique.
// ============================================================

/* ---------- Outils ---------- */

const peindre = (canvas, px, w, h) => {
  canvas.width = w
  canvas.height = h
  canvas.getContext('2d').putImageData(new ImageData(px, w, h), 0, 0)
}

// Un point du plan sous le pointeur
function pointSous(canvas, e, vue) {
  const r = canvas.getBoundingClientRect()
  const W = canvas.width
  const H = canvas.height
  const sx = ((e.clientX - r.left) / r.width) * W
  const sy = ((e.clientY - r.top) / r.height) * H
  const h = pasDe(vue.zoom, W, H)
  return [vue.x + (sx - W / 2) * h, vue.y + (H / 2 - sy) * h]
}

const versEcran = (vue, W, H) => {
  const h = pasDe(vue.zoom, W, H)
  return ([x, y]) => [W / 2 + (x - vue.x) / h, H / 2 - (y - vue.y) / h]
}

// Le temps qui passe (hors des composants, pour la règle de pureté de React)
const horloge = () => performance.now()

const texteC = ([re, im], fmt) => `${fmt(re)} ${im < 0 ? '−' : '+'} ${fmt(Math.abs(im))} i`

// Carte de l'ensemble de Mandelbrot commune à plusieurs figures (calculée une fois)
const VUE_CARTE = { x: -0.65, y: 0, zoom: 1.05 }
const CW = 450
const CH = 300
let carteCache = null
const carte = () => {
  carteCache ??= new ImageData(rendreCPU({ id: 'mandelbrot', largeur: CW, hauteur: CH, ...VUE_CARTE, iter: 150, palette: 'glace', densite: 3 }), CW, CH)
  return carteCache
}

function dessinerCarte(canvas, marques) {
  canvas.width = CW
  canvas.height = CH
  const ctx = canvas.getContext('2d')
  ctx.putImageData(carte(), 0, 0)
  marques?.(ctx, versEcran(VUE_CARTE, CW, CH), pasDe(VUE_CARTE.zoom, CW, CH))
}

// Glisser sur une carte : la même action à l'appui et pendant le glissement
function useGlisser(action) {
  const appui = useRef(false)
  return {
    onPointerDown: (e) => {
      appui.current = true
      e.currentTarget.setPointerCapture(e.pointerId)
      action(e)
    },
    onPointerMove: (e) => { if (appui.current) action(e) },
    onPointerUp: () => { appui.current = false },
    onPointerCancel: () => { appui.current = false },
  }
}

/* ---------- Comprendre 1 : l'orbite d'un point ---------- */

export function FigureOrbite({ txt, fmt }) {
  const ref = useRef(null)
  const [c, setC] = useState([-0.1226, 0.7449])

  useEffect(() => {
    dessinerCarte(ref.current, (ctx, ecran, h) => {
      const [ox, oy] = ecran([0, 0])
      ctx.strokeStyle = 'rgba(255, 255, 255, .55)'
      ctx.setLineDash([5, 4])
      ctx.lineWidth = 1.2
      ctx.beginPath()
      ctx.arc(ox, oy, 2 / h, 0, 2 * Math.PI)
      ctx.stroke()
      ctx.setLineDash([])
      const pts = orbite({ re: c[0], im: c[1], maxIter: 40, rayon: 4 }).points.map(ecran)
      ctx.strokeStyle = 'rgba(255, 255, 255, .9)'
      ctx.lineWidth = 1.4
      ctx.beginPath()
      pts.forEach(([x, y], k) => (k ? ctx.lineTo(x, y) : ctx.moveTo(x, y)))
      ctx.stroke()
      ctx.fillStyle = '#fff'
      for (const [x, y] of pts) ctx.fillRect(x - 2, y - 2, 4, 4)
      const [cx, cy] = ecran(c)
      ctx.strokeStyle = '#33AD78'
      ctx.lineWidth = 2.5
      ctx.beginPath()
      ctx.arc(cx, cy, 7, 0, 2 * Math.PI)
      ctx.stroke()
    })
  }, [c])

  const gestes = useGlisser((e) => setC(pointSous(ref.current, e, VUE_CARTE)))
  const { echappe } = orbite({ re: c[0], im: c[1], maxIter: 3000 })
  const p = echappe ? null : periode(c[0], c[1])
  const verdict = echappe ? txt.echappe(echappe) : p ? txt.cycle(p) : txt.bornee
  const f3 = (n) => fmt(n, { maximumFractionDigits: 3, minimumFractionDigits: 3 })

  return (
    <figure className="figure figure--large">
      <canvas ref={ref} width={CW} height={CH} className="fr-carte" role="img" aria-label={txt.label} {...gestes} />
      <figcaption>
        <p className="figure-etat" aria-live="polite">{txt.point(texteC(c, f3))} · {verdict}</p>
        <p>{txt.legende}</p>
      </figcaption>
    </figure>
  )
}

/* ---------- Comprendre 2 : bandes ou dégradé ---------- */

const VUE_COULEURS = { x: -0.747, y: 0.11, zoom: 50 }
const calculCouleurs = (lisse) => rendreCPU({ id: 'mandelbrot', largeur: 320, hauteur: 214, ...VUE_COULEURS, iter: 400, palette: 'ultra', densite: 2, lisse })

export function FigureCouleurs({ txt }) {
  const refs = [useRef(null), useRef(null)]
  useEffect(() => {
    const t = setTimeout(() => {
      peindre(refs[0].current, calculCouleurs(false), 320, 214)
      peindre(refs[1].current, calculCouleurs(true), 320, 214)
    }, 30)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return (
    <figure className="figure figure--large">
      <div className="fr-paire">
        {txt.titres.map((t, k) => (
          <div key={t}><canvas ref={refs[k]} width="320" height="214" role="img" aria-label={t} /><span>{t}</span></div>
        ))}
      </div>
      <figcaption><p>{txt.legende}</p></figcaption>
    </figure>
  )
}

/* ---------- Comprendre 3 : cinq ensembles de Julia ---------- */

export function FigureJulias({ txt, fmt }) {
  const refs = useRef([])
  useEffect(() => {
    let k = 0
    let t = 0
    const suivant = () => {
      const l = LIEUX.julia[k]
      peindre(refs.current[k], rendreCPU({ id: 'mandelbrot', julia: l.c, largeur: 200, hauteur: 200, x: 0, y: 0, zoom: 0.95, iter: 250, palette: 'glace', densite: 3 }), 200, 200)
      k++
      if (k < LIEUX.julia.length) t = setTimeout(suivant, 0)
    }
    t = setTimeout(suivant, 30)
    return () => clearTimeout(t)
  }, [])
  const f2 = (n) => fmt(n, { maximumFractionDigits: 3 })
  return (
    <figure className="figure figure--large">
      <div className="fr-julias">
        {LIEUX.julia.map((l, k) => (
          <div key={l.id}>
            <canvas ref={(el) => { refs.current[k] = el }} width="200" height="200" role="img" aria-label={txt.noms[l.id]} />
            <span>{txt.noms[l.id]}</span>
            <span className="fr-c-texte">c = {texteC(l.c, f2)}</span>
          </div>
        ))}
      </div>
      <figcaption><p>{txt.legende}</p></figcaption>
    </figure>
  )
}

/* ---------- Comprendre 4 : la galerie des autres formules ---------- */

const GALERIE = [
  { id: 'burning', calcul: () => rendreCPU({ id: 'burning', largeur: 240, hauteur: 160, ...lieuSans(LIEUX.burning[1]), iter: 300, densite: 4 }) },
  { id: 'tricorn', calcul: () => rendreCPU({ id: 'tricorn', largeur: 240, hauteur: 160, ...fractale('tricorn').vue, iter: 200, densite: 4 }) },
  { id: 'multibrot', calcul: () => rendreCPU({ id: 'multibrot', degre: 3, largeur: 240, hauteur: 160, ...fractale('multibrot').vue, iter: 200, densite: 4 }) },
  { id: 'newton', calcul: () => rendreCPU({ id: 'newton', polynome: 'z3', largeur: 240, hauteur: 160, ...fractale('newton').vue, iter: 60, palette: 'spectre' }) },
  { id: 'lyapunov', calcul: () => rendreCPU({ id: 'lyapunov', suite: 'AB', largeur: 240, hauteur: 160, ...fractale('lyapunov').vue, iter: 200 }) },
  // Le Buddhabrot n'est pas dans l'explorateur (trop lent en direct) : une image fixe, sans bouton
  { id: 'buddha', fixe: true, calcul: () => buddhaCPU({ largeur: 240, hauteur: 160, x: 0, y: 0.45, zoom: 1, echantillons: 250000, maxIter: 300 }) },
]
function lieuSans(l) {
  const { x, y, zoom } = l
  return { x, y, zoom }
}

export function FigureGalerie({ txt, T, onOuvrir }) {
  const refs = useRef([])
  useEffect(() => {
    let k = 0
    let t = 0
    const suivant = () => {
      peindre(refs.current[k], GALERIE[k].calcul(), 240, 160)
      k++
      if (k < GALERIE.length) t = setTimeout(suivant, 0)
    }
    t = setTimeout(suivant, 30)
    return () => clearTimeout(t)
  }, [])
  return (
    <div className="fr-galerie">
      {GALERIE.map((g, k) => (
        <figure key={g.id}>
          <canvas ref={(el) => { refs.current[k] = el }} width="240" height="160" role="img" aria-label={T.noms[g.id]} />
          <figcaption>
            <strong>{T.noms[g.id]}</strong>
            <code>{T.formules[g.id]}</code>
            <span>{txt.cartes[g.id]}</span>
            {!g.fixe && <button className="btn" onClick={() => onOuvrir(g.id)}>{txt.ouvrir}</button>}
          </figcaption>
        </figure>
      ))}
    </div>
  )
}

/* ---------- Théorie 2 : d'un seul tenant, ou en poussière ---------- */

export function FigureDichotomie({ txt, fmt }) {
  const refCarte = useRef(null)
  const refJulia = useRef(null)
  const [c, setC] = useState([-0.1226, 0.7449])

  useEffect(() => {
    dessinerCarte(refCarte.current, (ctx, ecran) => {
      const [x, y] = ecran(c)
      ctx.strokeStyle = '#33AD78'
      ctx.lineWidth = 2.5
      ctx.beginPath()
      ctx.arc(x, y, 7, 0, 2 * Math.PI)
      ctx.stroke()
    })
    // La Julia se calcule à l'image suivante : la carte réagit tout de suite
    const raf = requestAnimationFrame(() => {
      peindre(refJulia.current, rendreCPU({ id: 'mandelbrot', julia: c, largeur: 240, hauteur: 240, x: 0, y: 0, zoom: 0.95, iter: 200, palette: 'glace', densite: 3 }), 240, 240)
    })
    return () => cancelAnimationFrame(raf)
  }, [c])

  const gestes = useGlisser((e) => setC(pointSous(refCarte.current, e, VUE_CARTE)))
  const dedans = orbite({ re: c[0], im: c[1], maxIter: 3000 }).echappe === null
  const f3 = (n) => fmt(n, { maximumFractionDigits: 3, minimumFractionDigits: 3 })

  return (
    <figure className="figure figure--large">
      <div className="fr-dichotomie">
        <canvas ref={refCarte} width={CW} height={CH} className="fr-carte" role="img" aria-label={txt.carte} {...gestes} />
        <canvas ref={refJulia} width="240" height="240" className="fr-julia-figure" role="img" aria-label={txt.julia(texteC(c, f3))} />
      </div>
      <figcaption>
        <p className="figure-etat" aria-live="polite">c = {texteC(c, f3)} · {dedans ? txt.dedans : txt.dehors}</p>
        <p>{txt.legende}</p>
      </figcaption>
    </figure>
  )
}

/* ---------- Théorie 3 : la période des bulbes ---------- */

export function FigureBulbes({ txt }) {
  const ref = useRef(null)
  const [c, setC] = useState(null)

  useEffect(() => {
    dessinerCarte(ref.current, c && ((ctx, ecran) => {
      const [x, y] = ecran(c)
      ctx.strokeStyle = '#fff'
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.arc(x, y, 5, 0, 2 * Math.PI)
      ctx.stroke()
    }))
  }, [c])

  let texte = txt.attente
  if (c) {
    const echappe = orbite({ re: c[0], im: c[1], maxIter: 4000 }).echappe
    const p = echappe ? null : periode(c[0], c[1])
    texte = echappe ? txt.dehors : p ? txt.periode(p) : txt.inconnue
  }

  return (
    <figure className="figure figure--large">
      <canvas
        ref={ref}
        width={CW}
        height={CH}
        className="fr-carte"
        role="img"
        aria-label={txt.label}
        onPointerMove={(e) => setC(pointSous(ref.current, e, VUE_CARTE))}
        onPointerDown={(e) => setC(pointSous(ref.current, e, VUE_CARTE))}
      />
      <figcaption><p className="figure-etat" aria-live="polite">{texte}</p></figcaption>
    </figure>
  )
}

/* ---------- Théorie 3 (suite) : π caché ---------- */

const EXPOSANTS = '⁰¹²³⁴⁵⁶⁷⁸⁹'
const puissance = (k) => `10⁻${String(k).split('').map((d) => EXPOSANTS[Number(d)]).join('')}`
const COU = [1, 2, 3, 4, 5, 6, 7]
const POINTE = [2, 4, 6, 8, 10]

export function FigurePi({ txt, fmt }) {
  const [cou, setCou] = useState([])
  const [pointe, setPointe] = useState([])

  useEffect(() => {
    let t = 0
    const taches = [
      ...COU.map((k) => () => {
        const n = iterationsAvantEvasion(-0.75, 10 ** -k)
        setCou((l) => [...l, { k, n, v: n * 10 ** -k }])
      }),
      ...POINTE.map((k) => () => {
        const n = iterationsAvantEvasion(0.25 + 10 ** -k, 0)
        setPointe((l) => [...l, { k, n, v: n * 10 ** (-k / 2) }])
      }),
    ]
    let i = 0
    const suivant = () => {
      taches[i++]()
      if (i < taches.length) t = setTimeout(suivant, 0)
    }
    t = setTimeout(suivant, 50)
    return () => clearTimeout(t)
  }, [])

  const f = (v) => fmt(v, { minimumFractionDigits: 7, maximumFractionDigits: 7 })
  const table = (titre, lignes, colonne, tous) => (
    <table className="mesures mesures--serre">
      <caption>{titre}</caption>
      <thead><tr><th scope="col">{txt.colEps}</th><th scope="col">{txt.colN}</th><th scope="col">{colonne}</th></tr></thead>
      <tbody>
        {lignes.map((l) => <tr key={l.k}><td>{puissance(l.k)}</td><td>{fmt(l.n)}</td><td>{f(l.v)}</td></tr>)}
        {lignes.length < tous && <tr><td colSpan="3" className="fr-attente">{txt.enCours}</td></tr>}
      </tbody>
    </table>
  )

  return (
    <figure className="figure figure--large">
      <div className="fr-tables">
        {table(txt.titreCou, cou, txt.colProduit, COU.length)}
        {table(txt.titrePointe, pointe, txt.colRacine, POINTE.length)}
      </div>
      <figcaption><p>{txt.legende}</p></figcaption>
    </figure>
  )
}

/* ---------- Théorie 4 : le diagramme de bifurcation ---------- */

const C_MIN = -2.05
const C_MAX = 0.3

export function FigureBifurcation({ txt, fmt, theme }) {
  const ref = useRef(null)

  useEffect(() => {
    const canvas = ref.current
    const { ctx, e } = preparer(canvas)
    const W = canvas.width
    const H = canvas.height
    const HD = Math.round(H * 0.62) // hauteur du diagramme ; en dessous, l'ensemble
    const HM = H - HD
    const style = getComputedStyle(canvas)
    const encre = style.getPropertyValue('--texte').trim() || '#16181D'
    const sig = style.getPropertyValue('--sig').trim() || '#1E7A50'
    const fond = style.getPropertyValue('--surface').trim() || '#fff'

    ctx.fillStyle = fond
    ctx.fillRect(0, 0, W, HD)
    const xDe = (c) => ((c - C_MIN) / (C_MAX - C_MIN)) * W
    ctx.fillStyle = encre
    ctx.globalAlpha = 0.45
    for (let k = 0; k < W; k++) {
      const c = C_MIN + ((k + 0.5) / W) * (C_MAX - C_MIN)
      for (const v of attracteur(c, { avant: 500, garder: 160 })) {
        ctx.fillRect(k, HD / 2 - (v / 2.1) * (HD / 2), 1, 1)
      }
    }
    ctx.globalAlpha = 1

    // L'ensemble de Mandelbrot autour de l'axe réel, à la même échelle
    const zoom = (3 * W) / (HM * (C_MAX - C_MIN))
    const px = rendreCPU({ id: 'mandelbrot', largeur: W, hauteur: HM, x: (C_MIN + C_MAX) / 2, y: 0, zoom, iter: 300, palette: 'glace', densite: 3 })
    ctx.putImageData(new ImageData(px, W, HM), 0, HD)

    // Repères : premiers doublements et point de Feigenbaum
    ctx.strokeStyle = sig
    ctx.fillStyle = sig
    ctx.lineWidth = e
    ctx.setLineDash([4 * e, 3 * e])
    ctx.font = `${11 * e}px "IBM Plex Sans", system-ui, sans-serif`
    for (const [c, nom] of [[-0.75, '−3/4'], [-1.25, '−5/4'], [-1.401155, '−1,4012']]) {
      const x = xDe(c)
      ctx.beginPath()
      ctx.moveTo(x, 0)
      ctx.lineTo(x, H)
      ctx.stroke()
      ctx.fillText(nom, x + 4 * e, 14 * e)
    }
    ctx.setLineDash([])
  }, [theme])

  const centres = centresDoublement(11)
  const lignes = centres.slice(1).map((c, i) => {
    const k = i + 1
    const r = k >= 2 ? (centres[k - 1] - centres[k - 2]) / (centres[k] - centres[k - 1]) : null
    return [2 ** k, c, r]
  })

  return (
    <figure className="figure figure--large">
      <canvas ref={ref} className="fr-bifurcation" role="img" aria-label={txt.label} />
      <figcaption>
        <p>{txt.legende}</p>
        <details className="donnees">
          <summary>{txt.donnees}</summary>
          <table>
            <caption>{txt.titre}</caption>
            <thead><tr><th scope="col">{txt.colK}</th><th scope="col">{txt.colC}</th><th scope="col">{txt.colRapport}</th></tr></thead>
            <tbody>
              {lignes.map(([p, c, r]) => (
                <tr key={p}><td>{fmt(p)}</td><td>{fmt(c, { maximumFractionDigits: 10, minimumFractionDigits: 10 })}</td><td>{r ? fmt(r, { maximumFractionDigits: 6, minimumFractionDigits: 6 }) : '—'}</td></tr>
              ))}
            </tbody>
          </table>
        </details>
      </figcaption>
    </figure>
  )
}

/* ---------- Calcul 1 : processeur contre carte graphique ---------- */

const BANC = { x: -0.6, y: 0, zoom: 1, cote: 512, iter: 1000 }

// La même image, en JavaScript, sans raccourci
function chronoCPU() {
  const { cote: N, iter } = BANC
  const h = pasDe(BANC.zoom, N, N)
  const t0 = horloge()
  let somme = 0
  for (let j = 0; j < N; j++) {
    const ci = BANC.y + (N / 2 - j - 0.5) * h
    for (let k = 0; k < N; k++) {
      const cr = BANC.x + (k + 0.5 - N / 2) * h
      let zr = 0
      let zi = 0
      let n = 0
      for (; n < iter; n++) {
        const t = zr * zr - zi * zi + cr
        zi = 2 * zr * zi + ci
        zr = t
        if (zr * zr + zi * zi > 4) break
      }
      somme += n
    }
  }
  return { ms: horloge() - t0, somme }
}

// Sur la carte graphique : le shader de l'explorateur, attendu jusqu'au bout (lecture d'un pixel)
function chronoGPU() {
  const canvas = document.createElement('canvas')
  canvas.width = 1
  canvas.height = 1
  const gpu = creerGPU(canvas)
  if (!gpu || !gpu.flottant) {
    gpu?.detruire()
    return null
  }
  try {
    const { gl } = gpu
    const N = BANC.cote
    const prog = gpu.programme(EVASION)
    const cible = gpu.cible(N, N)
    const valeurs = {
      u_taille: [N, N], u_decal: [0, 0], u_centre: [BANC.x, 0, BANC.y, 0], u_pas: pasDe(BANC.zoom, N, N),
      u_iter: BANC.iter, u_rotation: [1, 0], u_un: 1, u_sens: 1, u_formule: 0, u_julia: false, u_c: [0, 0], u_degre: 2, u_lumiere: [0.7, 0.7],
    }
    const tampon = new Float32Array(4)
    const une = () => {
      gpu.dessiner(prog, valeurs, { vers: cible })
      gl.bindFramebuffer(gl.FRAMEBUFFER, cible.fbo)
      gl.readPixels(0, 0, 1, 1, gl.RGBA, gl.FLOAT, tampon)
    }
    une() // échauffement : compilation, mise en mémoire
    let meilleur = Infinity
    for (let k = 0; k < 3; k++) {
      const t0 = horloge()
      une()
      meilleur = Math.min(meilleur, horloge() - t0)
    }
    return meilleur
  } finally {
    gpu.detruire()
  }
}

export function FigureBanc({ txt, fmt }) {
  const [etat, setEtat] = useState(null) // null | 'calcul' | { cpu, gpu }

  const mesurer = () => {
    setEtat('calcul')
    setTimeout(() => {
      let gpu
      try { gpu = chronoGPU() } catch { gpu = null }
      const cpu = chronoCPU().ms
      setEtat({ cpu, gpu })
    }, 60)
  }

  const ms = (v) => txt.ms(fmt(v, { maximumFractionDigits: v < 10 ? 1 : 0 }))
  return (
    <figure className="figure figure--large">
      <div className="figure-actions">
        <button className="btn-principal" onClick={mesurer} disabled={etat === 'calcul'}>{etat === 'calcul' ? txt.enCours : etat ? txt.encore : txt.bouton}</button>
      </div>
      {etat && etat !== 'calcul' ? (
        <>
          <table className="mesures mesures--serre fr-banc">
            <tbody>
              <tr><th scope="row">{txt.cpu}</th><td>{ms(etat.cpu)}</td></tr>
              <tr><th scope="row">{txt.gpu}</th><td>{etat.gpu === null ? txt.sansGpu : ms(etat.gpu)}</td></tr>
            </tbody>
          </table>
          {etat.gpu !== null && <p className="figure-etat">{txt.rapport(fmt(Math.max(1, Math.round(etat.cpu / Math.max(etat.gpu, 0.1)))))}</p>}
        </>
      ) : (
        <p className="aide-figure">{txt.attente}</p>
      )}
    </figure>
  )
}

/* ---------- Calcul 2 : 32 bits contre 64 bits ---------- */

const MINI = LIEUX.mandelbrot.find((l) => l.id === 'mini')
const PW = 200
const PH = 132

export function FigurePrecision({ txt, T }) {
  const refs = [useRef(null), useRef(null)]
  const [e, setE] = useState(4)
  const zoom = 10 ** e

  useEffect(() => {
    const t = setTimeout(() => {
      const iter = Math.min(1000, iterationsAuto('mandelbrot', zoom))
      for (const [k, simple] of [[0, true], [1, false]]) {
        peindre(refs[k].current, rendreFloat32({ largeur: PW, hauteur: PH, x: MINI.x, y: MINI.y, zoom, iter, palette: 'ultra', simple }), PW, PH)
      }
    }, 90)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [zoom])

  return (
    <figure className="figure figure--large">
      <label className="saut-curseur fr-curseur">
        <span>{txt.zoom}</span>
        <input type="range" min="2" max="10" step="0.25" value={e} onChange={(ev) => setE(Number(ev.target.value))} />
        <output>{T.zoomTexte(zoom)}</output>
      </label>
      <div className="fr-paire">
        {txt.titres.map((t, k) => (
          <div key={t}><canvas ref={refs[k]} width={PW} height={PH} role="img" aria-label={`${t}, ${T.zoomTexte(zoom)}`} /><span>{t}</span></div>
        ))}
      </div>
      <figcaption><p>{txt.legende}</p></figcaption>
    </figure>
  )
}
