import { useEffect, useImperativeHandle, useRef, useState } from 'react'
import BarreEtat from '../BarreEtat'
import { useGestes, useClavier } from '../commun/gestes'
import { creerRendu } from './rendu'
import { FRACTALES, fractale, LIEUX, PALETTES, POLYNOMES, iterationsAuto, pasDe, zoomMax, versComplexe, versPlan, lireSuite, evaluer, racines } from './formules.js'
import { orbite as calculerOrbite, periode } from './cpu.js'

// ============================================================
//  FRACTALES : l'explorateur (onglet Simulation)
//  La vue (centre, zoom) vit dans une référence et change à chaque
//  geste ; la boucle d'animation la lit à chaque image et la passe au
//  moteur de rendu sur la carte graphique. React ne gère que les
//  réglages et ce qui s'affiche autour.
// ============================================================

const DENSITE_DEFAUT = -5 // log2 du nombre de tours de palette par itération : 1/32
const iterDeCurseur = (k) => Math.round(50 * 400 ** (k / 100))
const curseurDeIter = (n) => Math.round((100 * Math.log(n / 50)) / Math.log(400))

// La plongée guidée dans l'ensemble de Mandelbrot
const MINI = LIEUX.mandelbrot.find((l) => l.id === 'mini')
const ETAPES = [
  LIEUX.mandelbrot.find((l) => l.id === 'ensemble'),
  LIEUX.mandelbrot.find((l) => l.id === 'hippocampes'),
  LIEUX.mandelbrot.find((l) => l.id === 'spirale'),
  { x: MINI.x, y: MINI.y, zoom: 2e7 },
  MINI,
]

// Lien partagé : ?f=mandelbrot&x=…&y=…&z=…
function lireLien(texte) {
  const q = new URLSearchParams(texte)
  const f = FRACTALES.find((v) => v.id === q.get('f'))
  if (!f) return null
  const nb = (k) => (q.has(k) && Number.isFinite(Number(q.get(k))) ? Number(q.get(k)) : undefined)
  const j = q.get('j')?.split(',').map(Number)
  return {
    id: f.id,
    vue: { x: nb('x') ?? f.vue.x, y: nb('y') ?? f.vue.y, zoom: nb('z') ?? f.vue.zoom },
    julia: j?.length === 2 && j.every(Number.isFinite) ? j : null,
    degre: nb('d'),
    polynome: POLYNOMES[q.get('n')] ? q.get('n') : undefined,
    relax: nb('a'),
    suite: lireSuite(q.get('s') ?? '') ? q.get('s').toUpperCase() : undefined,
    palette: PALETTES[q.get('p')] ? q.get('p') : undefined,
    rotation: nb('r') ?? 0,
  }
}

const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2)
const horloge = () => performance.now()

export default function Atelier({ ref, visible, T }) {
  const canvasRef = useRef(null)
  const calqueRef = useRef(null)
  const rendu = useRef(null)
  const [lien] = useState(() => (typeof window === 'undefined' ? null : lireLien(window.location.search)))

  /* ---------- Réglages (React) ---------- */
  const [id, setId] = useState(lien?.id ?? 'mandelbrot')
  const [julia, setJulia] = useState(lien?.julia ?? null)
  const [degre, setDegre] = useState(lien?.degre ?? 3)
  const [polynome, setPolynome] = useState(lien?.polynome ?? 'z3')
  const [relax, setRelax] = useState(lien?.relax ?? 1)
  const [suite, setSuite] = useState(lien?.suite ?? 'AB')
  const [saisieSuite, setSaisieSuite] = useState(lien?.suite ?? 'AB')
  const [palette, setPalette] = useState(lien?.palette ?? 'quilez')
  const [echelle, setEchelle] = useState('zoom')
  const [bandes, setBandes] = useState(false)
  const [plongee, setPlongee] = useState(false)
  const [densite, setDensite] = useState(DENSITE_DEFAUT)
  const [decalage, setDecalage] = useState(0)
  const [defile, setDefile] = useState(false)
  const [relief, setRelief] = useState(false)
  const [bords, setBords] = useState(false)
  const [iterAuto, setIterAuto] = useState(true)
  const [iterMain, setIterMain] = useState(1000)
  const [outil, setOutil] = useState('main')
  const [apercuJulia, setApercuJulia] = useState(true)
  const [replie, setReplie] = useState(false)
  const [etape, setEtape] = useState(null)
  const [lieu, setLieu] = useState('')
  const [infos, setInfos] = useState({ x: 0, y: 0, zoom: 1, progres: 0, affinage: 0, iter: 0, profond: false, limite: false })
  const [exportation, setExportation] = useState(null) // null | progression 0 → 1
  const [facteur, setFacteur] = useState(2)
  const [message, setMessage] = useState(null)
  const [erreur, setErreur] = useState(null)
  const [essai, setEssai] = useState(0) // relancer le moteur après une perte du contexte graphique
  const [tailleJulia, setTailleJulia] = useState(0)
  const [texteOrb, setTexteOrb] = useState(null)

  /* ---------- Ce que la boucle lit à chaque image ---------- */
  const vue = useRef({ ...(lien?.vue ?? fractale(lien?.id ?? 'mandelbrot').vue), rotation: lien?.rotation ?? 0 })
  const vol = useRef(null)               // animation vers un lieu
  const plonge = useRef(null)            // plongée continue : allers-retours entre la vue d'ensemble et un point profond
  const survolC = useRef(LIEUX.julia[0].c) // c de la Julia en incrustation
  const orbite = useRef(null)            // point de l'orbite, dans le plan
  const exportEnCours = useRef(false)
  const reglages = useRef({})
  const textes = useRef(T)
  const visibleRef = useRef(visible)

  const famille = fractale(id).famille
  const iter = iterAuto ? iterationsAuto(id, infos.zoom) : iterMain

  useEffect(() => {
    visibleRef.current = visible
    textes.current = T
    reglages.current = { id, julia, degre, polynome, relax, suite, palette, densite, decalage, defile, echelle, bandes, relief, bords, iterAuto, iterMain, apercuJulia, outil }
  })

  // Ce que le moteur de rendu reçoit, image après image
  const parametres = () => {
    const r = reglages.current
    const v = vue.current
    return {
      id: r.id,
      x: v.x,
      y: v.y,
      zoom: v.zoom,
      rotation: v.rotation ?? 0,
      iter: r.iterAuto ? iterationsAuto(r.id, v.zoom) : r.iterMain,
      julia: fractale(r.id).famille === 'evasion' ? r.julia : null,
      degre: r.degre,
      polynome: r.polynome,
      relax: r.relax,
      suite: r.suite,
      palette: r.palette,
      densite: 2 ** r.densite,
      // Défilement : la palette tourne avec le temps, sans toucher au réglage
      decalage: r.defile ? (r.decalage + horloge() * 0.00008) % 1 : r.decalage,
      defile: r.defile,
      echelle: r.echelle,
      bandes: r.bandes,
      relief: r.relief,
      bords: r.bords,
      apercuJulia: r.apercuJulia && !r.julia ? survolC.current : null,
    }
  }

  /* ---------- Vue ---------- */
  const taille = () => rendu.current?.taille() ?? [canvasRef.current.width, canvasRef.current.height]
  const toucher = () => rendu.current?.toucher()

  const borner = (z) => {
    const max = zoomMax(reglages.current.id)
    return Math.min(max, Math.max(0.2, z))
  }

  // Point de l'écran (pixels du canvas) → point du plan ; la vue peut être tournée
  const versPlanEcran = (sx, sy) => {
    const v = vue.current
    const [W, H] = taille()
    const h = pasDe(v.zoom, W, H)
    const dx = (sx - W / 2) * h
    const dy = (H / 2 - sy) * h
    const c = Math.cos(v.rotation ?? 0)
    const s = Math.sin(v.rotation ?? 0)
    return [v.x + dx * c - dy * s, v.y + dx * s + dy * c]
  }

  // Zoom autour d'un point : il reste sous le curseur
  function zoomerAutour(f, sx, sy) {
    const v = vue.current
    const [px, py] = versPlanEcran(sx, sy)
    v.zoom = borner(v.zoom * f)
    const [qx, qy] = versPlanEcran(sx, sy)
    v.x += px - qx
    v.y += py - qy
    toucher()
  }

  function deplacer(dx, dy) {
    const v = vue.current
    const [ax, ay] = versPlanEcran(0, 0)
    const [bx, by] = versPlanEcran(dx, dy)
    v.x -= bx - ax
    v.y -= by - ay
    toucher()
  }

  // Centre du pixel (sx, sy) → point du plan
  const versPlanPixel = (sx, sy) => versPlanEcran(sx + 0.5, sy + 0.5)

  // Vol animé jusqu'à un lieu : le point visé glisse vers le centre pendant qu'on zoome
  function voler(but, duree) {
    const de = { ...vue.current, rotation: vue.current.rotation ?? 0 }
    const z1 = borner(but.zoom)
    const decades = Math.abs(Math.log10(z1 / de.zoom))
    // la rotation revient au plus court vers celle du lieu (0 par défaut)
    const r1 = but.rotation ?? 0
    const dr = Math.atan2(Math.sin(r1 - de.rotation), Math.cos(r1 - de.rotation))
    vol.current = { de, vers: { x: but.x, y: but.y, zoom: z1, rotation: de.rotation + dr }, t0: horloge(), duree: duree ?? Math.min(7000, 900 + 450 * decades) }
  }

  function animer(t) {
    // Plongée continue : le zoom respire entre la vue d'ensemble et le point visé, en tournant doucement
    const P = plonge.current
    if (P) {
      const ph = ((t - P.t0) / P.periode + P.phase) % 1
      const e = (1 - Math.cos(2 * Math.PI * ph)) / 2
      const z = Math.exp(Math.log(P.de.zoom) + (Math.log(P.vers.zoom) - Math.log(P.de.zoom)) * e)
      const k = (P.de.zoom / z) * (1 - e)
      vue.current = { x: P.vers.x + (P.de.x - P.vers.x) * k, y: P.vers.y + (P.de.y - P.vers.y) * k, zoom: z, rotation: P.r0 + (t - P.t0) * 0.00005 }
      toucher()
      return
    }
    const a = vol.current
    if (!a) return
    const e = ease(Math.min(1, (t - a.t0) / a.duree))
    const z = Math.exp(Math.log(a.de.zoom) + (Math.log(a.vers.zoom) - Math.log(a.de.zoom)) * e)
    const k = (a.de.zoom / z) * (1 - e)
    vue.current = {
      x: a.vers.x + (a.de.x - a.vers.x) * k,
      y: a.vers.y + (a.de.y - a.vers.y) * k,
      zoom: z,
      rotation: a.de.rotation + (a.vers.rotation - a.de.rotation) * e,
    }
    toucher()
    if (e >= 1) vol.current = null
  }

  // Plongée : vers le point où l'on a zoomé, sinon vers un lieu prévu (mini-Mandelbrot, armada)
  function butPlongee() {
    const r = reglages.current
    const ici = vue.current
    if (ici.zoom >= 20) return { x: ici.x, y: ici.y, zoom: ici.zoom, deja: true }
    if (r.id === 'mandelbrot' && !r.julia) return MINI
    if (r.id === 'burning' && !r.julia) return LIEUX.burning.find((l) => l.id === 'armada')
    return null
  }
  function arreterPlongee() {
    plonge.current = null
    setPlongee(false)
  }
  function basculerPlongee() {
    if (plonge.current) { arreterPlongee(); return }
    const but = butPlongee()
    if (!but) return
    const r = reglages.current
    const f = fractale(r.id)
    const depart = r.julia ? f.julia : f.vue
    const z1 = borner(but.zoom)
    const decades = Math.max(1, Math.log10(z1 / depart.zoom))
    plonge.current = {
      de: depart,
      vers: { x: but.x, y: but.y, zoom: z1 },
      t0: horloge(),
      periode: 2 * (5000 + 2200 * decades),
      phase: but.deja ? 0.5 : 0, // déjà au fond : on commence par remonter
      r0: vue.current.rotation ?? 0,
    }
    vol.current = null
    setEtape(null)
    setPlongee(true)
  }

  /* ---------- Orbite d'un point ---------- */
  function dessinerOrbite() {
    const c = calqueRef.current
    if (!c) return
    const [W, H] = taille()
    if (c.width !== W || c.height !== H) { c.width = W; c.height = H }
    const ctx = c.getContext('2d')
    ctx.clearRect(0, 0, W, H)
    const o = orbite.current
    const r = reglages.current
    if (!o || fractale(r.id).famille === 'lyapunov') return
    const v = vue.current
    const h = pasDe(v.zoom, W, H)
    const cr = Math.cos(v.rotation ?? 0)
    const sr = Math.sin(v.rotation ?? 0)
    const ecran = ([re, im]) => {
      const [x, y] = versPlan(r.id, re, im)
      const dx = x - v.x
      const dy = y - v.y
      return [W / 2 + (dx * cr + dy * sr) / h, H / 2 - (-dx * sr + dy * cr) / h]
    }
    const pts = pointsOrbite(r, o).map(ecran)
    const e = Math.min(window.devicePixelRatio || 1, 2)
    ctx.lineWidth = 1.5 * e
    ctx.strokeStyle = 'rgba(255, 255, 255, .85)'
    ctx.beginPath()
    pts.forEach(([x, y], k) => (k ? ctx.lineTo(x, y) : ctx.moveTo(x, y)))
    ctx.stroke()
    ctx.fillStyle = '#fff'
    for (const [x, y] of pts) ctx.fillRect(x - 2 * e, y - 2 * e, 4 * e, 4 * e)
    const [x0, y0] = ecran(versComplexe(r.id, ...o))
    ctx.strokeStyle = '#33AD78'
    ctx.lineWidth = 2.5 * e
    ctx.beginPath()
    ctx.arc(x0, y0, 7 * e, 0, 2 * Math.PI)
    ctx.stroke()
  }

  // Les z_n de l'orbite (nombres complexes), selon la fractale
  function pointsOrbite(r, [x, y]) {
    const [re, im] = versComplexe(r.id, x, y)
    const f = fractale(r.id)
    if (f.famille === 'newton') {
      const coef = POLYNOMES[r.polynome]
      let z = [re, im]
      const pts = [z]
      for (let n = 0; n < 60; n++) {
        const { f: fz, d } = evaluer(coef, z)
        const den = d[0] * d[0] + d[1] * d[1]
        if (den === 0) break
        const q = [(fz[0] * d[0] + fz[1] * d[1]) / den, (fz[1] * d[0] - fz[0] * d[1]) / den]
        z = [z[0] - r.relax * q[0], z[1] - r.relax * q[1]]
        pts.push(z)
        if (Math.hypot(q[0], q[1]) < 1e-9) break
      }
      return pts
    }
    const julia = f.famille === 'evasion' ? r.julia : null
    return calculerOrbite({ formule: f.formule ?? 0, degre: r.degre, julia, re, im, maxIter: 400, rayon: 6 }).points
  }

  function texteOrbite() {
    const o = orbite.current
    const r = reglages.current
    const T = textes.current
    if (!o || r.outil !== 'orbite') return null
    const f = fractale(r.id)
    const [re, im] = versComplexe(r.id, ...o)
    if (f.famille === 'newton') {
      const pts = pointsOrbite(r, o)
      const fin = pts[pts.length - 1]
      const rac = racines(POLYNOMES[r.polynome])
      const k = rac.findIndex((z) => Math.hypot(z[0] - fin[0], z[1] - fin[1]) < 1e-6)
      return k >= 0 ? T.orbite.newton(pts.length - 1) : T.orbite.newtonEchec
    }
    if (f.famille === 'lyapunov') return null
    const julia = f.famille === 'evasion' ? r.julia : null
    const { echappe } = calculerOrbite({ formule: f.formule ?? 0, degre: r.degre, julia, re, im, maxIter: 5000 })
    if (echappe) return T.orbite.echappe(echappe)
    if (!julia && (f.formule ?? 0) === 0) {
      const p = periode(re, im)
      if (p) return T.orbite.cycle(p)
    }
    return T.orbite.bornee
  }

  /* ---------- Moteur de rendu et boucle d'animation ---------- */
  useEffect(() => {
    const canvas = canvasRef.current
    const r = creerRendu(canvas)
    if (r.erreur) {
      const signal = requestAnimationFrame(() => setErreur(r))
      return () => cancelAnimationFrame(signal)
    }
    rendu.current = r
    let raf = 0
    let derniereInfo = 0
    let sigCalque = ''

    const boucle = (t) => {
      raf = requestAnimationFrame(boucle)
      if (!visibleRef.current || exportEnCours.current) return
      if (r.perdu()) {
        cancelAnimationFrame(raf)
        setErreur({ erreur: 'perdu' })
        return
      }
      animer(t)
      const p = parametres()
      const res = r.image(p, t)
      const v = vue.current
      const o = reglages.current.outil
      const sc = `${v.x}|${v.y}|${v.zoom}|${orbite.current?.join()}|${p.id}|${p.julia?.join()}|${p.degre}|${p.polynome}|${p.relax}|${r.taille().join()}|${o}`
      if (sc !== sigCalque) {
        // l'orbite ne dépend pas du zoom : son texte ne change qu'avec le point ou la fractale
        const so = sc.split('|').slice(3).join('|')
        if (so !== sigCalque.split('|').slice(3).join('|')) setTexteOrb(texteOrbite())
        sigCalque = sc
        dessinerOrbite()
      }
      if (t - derniereInfo > 200) {
        derniereInfo = t
        setInfos({ x: v.x, y: v.y, zoom: v.zoom, progres: res.progres, affinage: res.affinage, iter: p.iter, profond: res.profond, limite: v.zoom >= zoomMax(p.id) * 0.999 })
      }
    }
    raf = requestAnimationFrame(boucle)

    const obs = new ResizeObserver(([e]) => {
      setTailleJulia(Math.round(Math.min(e.contentRect.width, e.contentRect.height) * 0.3))
      r.toucher()
    })
    obs.observe(canvas)

    return () => {
      cancelAnimationFrame(raf)
      obs.disconnect()
      r.detruire()
      rendu.current = null
    }
    // La boucle lit tout par des références : elle ne redémarre qu'avec un nouvel essai
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [essai])

  /* ---------- Gestes ---------- */
  const adaptateur = {
    zoomer: zoomerAutour,
    deplacer,
    versCase: (sx, sy) => ({ x: Math.floor(sx), y: Math.floor(sy) }),
  }
  const placerOrbite = (c) => {
    const p = versPlanPixel(c.x, c.y)
    orbite.current = p
    const r = reglages.current
    if (fractale(r.id).famille === 'evasion' && !r.julia) survolC.current = versComplexe(r.id, ...p)
    toucher()
  }
  const gestes = useGestes(canvasRef, {
    vue: () => (rendu.current ? adaptateur : null),
    echelle: () => canvasRef.current.width / Math.max(1, canvasRef.current.clientWidth),
    outil: outil === 'orbite' && famille !== 'lyapunov' ? 'orbite' : 'main',
    outilsTrace: ['orbite'],
    onDebutTrace: placerOrbite,
    onTrace: placerOrbite,
    onSurvol: (c) => {
      const r = reglages.current
      if (!c || fractale(r.id).famille !== 'evasion' || r.julia || !r.apercuJulia) return
      survolC.current = versComplexe(r.id, ...versPlanPixel(c.x, c.y))
    },
    onCamManuelle: () => {
      vol.current = null
      if (plonge.current) arreterPlongee()
    },
  })

  /* ---------- Actions ---------- */
  const zoomBouton = (f) => {
    const [W, H] = taille()
    zoomerAutour(f, W / 2, H / 2)
  }

  function choisirFractale(nouveau) {
    setId(nouveau)
    setJulia(null)
    setLieu('')
    setEtape(null)
    orbite.current = null
    vol.current = null
    arreterPlongee()
    vue.current = { ...fractale(nouveau).vue, rotation: 0 }
    if (nouveau === 'lyapunov') { setSuite('AB'); setSaisieSuite('AB') }
    toucher()
  }

  function ouvrirJulia(c) {
    setJulia(c)
    setLieu('')
    orbite.current = null
    vol.current = null
    arreterPlongee()
    vue.current = { ...fractale(reglages.current.id).julia, rotation: 0 }
    toucher()
  }

  function quitterJulia() {
    setJulia(null)
    setLieu('')
    orbite.current = null
    arreterPlongee()
    vue.current = { ...fractale(id).vue, rotation: 0 }
    toucher()
  }

  const lieuxDispo = famille === 'evasion' && julia ? LIEUX.julia : LIEUX[id] ?? []

  function allerA(lieuId) {
    setLieu(lieuId)
    const l = lieuxDispo.find((x) => x.id === lieuId)
    if (!l) return
    arreterPlongee()
    if (l.c) { ouvrirJulia(l.c); setLieu(lieuId); return }
    if (l.polynome) { setPolynome(l.polynome); vue.current = { ...fractale('newton').vue, rotation: 0 }; toucher(); return }
    if (l.suite) { setSuite(l.suite); setSaisieSuite(l.suite) }
    voler(l)
  }

  function vueEnsemble() {
    vol.current = null
    arreterPlongee()
    setLieu('')
    voler(julia ? fractale(id).julia : fractale(id).vue, 900)
  }

  /* ---------- Visite guidée ---------- */
  const etapes = ETAPES
  function lancerVisite() {
    if (id !== 'mandelbrot' || julia) {
      setId('mandelbrot')
      setJulia(null)
      vue.current = { ...fractale('mandelbrot').vue, rotation: 0 }
    }
    arreterPlongee()
    orbite.current = null
    setLieu('')
    setEtape(0)
    voler(etapes[0], 900)
  }
  function continuerVisite() {
    if (etape >= etapes.length - 1) { setEtape(null); return }
    setEtape(etape + 1)
    voler(etapes[etape + 1])
  }
  const quitterVisite = () => setEtape(null)
  useImperativeHandle(ref, () => ({
    lancerVisite,
    ouvrir: (nouveau) => choisirFractale(nouveau),
  }))

  /* ---------- Export et lien ---------- */
  async function exporter() {
    if (!rendu.current || exportation !== null) return
    exportEnCours.current = true
    setExportation(0)
    try {
      const blob = await rendu.current.exporter(parametres(), facteur, setExportation)
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `fractale-${id}${julia ? '-julia' : ''}.png`
      a.click()
      setTimeout(() => URL.revokeObjectURL(url), 2000)
      setMessage({ texte: T.partage.exporte })
    } catch {
      setMessage({ texte: T.partage.exportErreur, erreur: true })
    } finally {
      exportEnCours.current = false
      setExportation(null)
      toucher()
    }
  }

  function texteLien() {
    const v = vue.current
    const q = new URLSearchParams({ f: id, x: v.x.toPrecision(17), y: v.y.toPrecision(17), z: v.zoom.toPrecision(6) })
    if (julia) q.set('j', julia.map((n) => n.toPrecision(15)).join(','))
    if (id === 'multibrot') q.set('d', String(degre))
    if (id === 'newton') { q.set('n', polynome); q.set('a', String(relax)) }
    if (id === 'lyapunov') q.set('s', suite)
    if (v.rotation) q.set('r', (v.rotation % (2 * Math.PI)).toFixed(4))
    q.set('p', palette)
    return `${window.location.origin}${window.location.pathname}?${q}`
  }
  async function copierLien() {
    const url = texteLien()
    try {
      await navigator.clipboard.writeText(url)
      setMessage({ texte: T.partage.copie })
    } catch {
      setMessage({ texte: T.partage.copieManuelle(url) })
    }
  }

  /* ---------- Clavier ---------- */
  useClavier({
    actif: visible,
    touches: {
      ArrowLeft: () => deplacer(taille()[0] * 0.1, 0),
      ArrowRight: () => deplacer(-taille()[0] * 0.1, 0),
      ArrowUp: () => deplacer(0, taille()[1] * 0.1),
      ArrowDown: () => deplacer(0, -taille()[1] * 0.1),
      Equal: () => zoomBouton(1.5),
      NumpadAdd: () => zoomBouton(1.5),
      Minus: () => zoomBouton(1 / 1.5),
      NumpadSubtract: () => zoomBouton(1 / 1.5),
      KeyO: () => setOutil((o) => (o === 'orbite' ? 'main' : 'orbite')),
      KeyP: basculerPlongee,
      Digit0: vueEnsemble,
      Escape: () => {
        if (etape !== null) setEtape(null)
        orbite.current = null
        toucher()
      },
    },
  })

  /* ---------- Affichage ---------- */
  const lang = T.nombre
  const fmt = (n, o) => n.toLocaleString(lang, o)
  const chiffres = Math.min(17, Math.max(4, Math.ceil(Math.log10(Math.max(1, infos.zoom))) + 4))
  const coord = (n) => fmt(n, { maximumFractionDigits: chiffres - 1, minimumFractionDigits: Math.min(chiffres - 1, 3) })
  const holomorphe = (id === 'mandelbrot' || id === 'multibrot')
  const nomFractale = julia ? T.juliaDe(T.noms[id], `${coord(julia[0])} ${julia[1] < 0 ? '−' : '+'} ${coord(Math.abs(julia[1]))} i`) : T.noms[id]

  if (erreur) {
    return (
      <div className="atelier" hidden={!visible}>
        <div className="fr-erreur">
          <h2>{T.erreurs.titre}</h2>
          <p>{T.erreurs[erreur.erreur] ?? T.erreurs.shader}</p>
          {erreur.detail && <pre>{erreur.detail}</pre>}
          {erreur.erreur === 'perdu' && <button className="btn-principal" onClick={() => { setErreur(null); setEssai((n) => n + 1) }}>{T.erreurs.relancer}</button>}
        </div>
        <canvas ref={canvasRef} hidden />
      </div>
    )
  }

  return (
    <div className="atelier" hidden={!visible}>
      <div className="atelier-corps" data-replie={replie}>
        <div className="plan">

          <div className="plan-outils">
            <div className="groupe" role="group" aria-label={T.outils.titre}>
              {['main', 'orbite'].map((o) => (
                <button key={o} aria-pressed={outil === o} title={T.aides[o]} onClick={() => setOutil(o)} disabled={o === 'orbite' && famille === 'lyapunov'}>
                  {T.outils[o]}
                </button>
              ))}
            </div>
            <div className="plan-outils-droite">
              <div className="groupe">
                <button onClick={() => zoomBouton(1 / 1.5)} aria-label={T.zoomMoins} title={T.zoomMoins}>−</button>
                <button onClick={() => zoomBouton(1.5)} aria-label={T.zoomPlus} title={T.zoomPlus}>+</button>
                <button onClick={vueEnsemble} title={T.vueEnsembleAide}>{T.vueEnsemble}</button>
              </div>
              {famille === 'evasion' && !julia && (
                <div className="groupe">
                  <button aria-pressed={apercuJulia} onClick={() => setApercuJulia(!apercuJulia)} title={T.apercuJuliaAide}>{T.apercuJulia}</button>
                </div>
              )}
              {replie && <button className="btn" onClick={() => setReplie(false)}>‹ {T.reglages}</button>}
            </div>
          </div>

          <div className="cadre fr-cadre">
            <canvas ref={canvasRef} className="cadre-canvas" data-outil={outil === 'orbite' && famille !== 'lyapunov' ? 'orbite' : 'main'} {...gestes} aria-label={T.toile(nomFractale)} />
            <canvas ref={calqueRef} className="fr-calque" aria-hidden="true" />
            {famille === 'evasion' && !julia && apercuJulia && tailleJulia > 0 && (
              <button className="fr-julia" style={{ width: tailleJulia, height: tailleJulia }} onClick={() => ouvrirJulia([...survolC.current])} title={T.ouvrirJulia} aria-label={T.ouvrirJulia}>
                <span>{T.ouvrirJuliaCourt}</span>
              </button>
            )}
            {exportation !== null && (
              <div className="fr-export" role="status">
                <span>{T.partage.enCours}</span>
                <progress value={exportation} max="1" />
              </div>
            )}
          </div>

          <div className="transport">
            {etape !== null ? (
              <div className="visite" aria-live="polite">
                <p className="visite-etape">{T.visite.etapeSur(etape + 1, etapes.length)}</p>
                <h2>{T.visite.etapes[etape][0]}</h2>
                <p className="visite-texte">{T.visite.etapes[etape][1]}</p>
                <div className="visite-actions">
                  <button className="btn" onClick={quitterVisite}>{T.visite.quitter}</button>
                  <button className="btn-principal" onClick={continuerVisite}>
                    {etape === etapes.length - 1 ? T.visite.terminer : T.visite.continuer}
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="transport-boutons">
                  {id === 'mandelbrot' && !julia && <button className="btn-principal" onClick={lancerVisite}>{T.visite.lancer}</button>}
                  <button className="btn" onClick={basculerPlongee} aria-pressed={plongee} disabled={!plongee && infos.zoom < 20 && !((id === 'mandelbrot' || id === 'burning') && !julia)} title={T.plongeeAide}>
                    {plongee ? T.plongeeStop : T.plongee}
                  </button>
                  {julia && <button className="btn" onClick={quitterJulia}>{T.retourEnsemble(T.noms[id])}</button>}
                </div>
                <p className="fr-aide" aria-live="polite">{(outil === 'orbite' && texteOrb) || T.aides[outil === 'orbite' && famille !== 'lyapunov' ? 'orbite' : 'main']}</p>
              </>
            )}
          </div>
        </div>

        {!replie && (
          <aside className="inspecteur" aria-label={T.reglages}>
            <div className="insp-tete">
              <span>{T.reglages}</span>
              <button onClick={() => setReplie(true)} aria-label={T.replier} title={T.replier}>›</button>
            </div>

            {/* Fractale */}
            <section className="bloc">
              <h3>{T.fractale}<span>{T.formules[id]}</span></h3>
              <div className="ligne ligne--large">
                <select aria-label={T.fractale} value={id} onChange={(e) => choisirFractale(e.target.value)}>
                  {FRACTALES.map((f) => <option key={f.id} value={f.id}>{T.noms[f.id]}</option>)}
                </select>
              </div>
              <p className="aide">{T.descriptions[id]}</p>

              {famille === 'evasion' && (
                <label className="option">
                  <input type="checkbox" checked={!!julia} onChange={() => (julia ? quitterJulia() : ouvrirJulia([...survolC.current]))} />
                  {T.ensembleJulia}
                </label>
              )}
              {famille === 'evasion' && julia && (
                <div className="fr-c">
                  {[0, 1].map((k) => (
                    <label key={k}>
                      <span>{k ? 'Im c' : 'Re c'}</span>
                      <input type="number" step="0.001" value={julia[k]} onChange={(e) => {
                        const v = Number(e.target.value)
                        if (Number.isFinite(v)) setJulia(k ? [julia[0], v] : [v, julia[1]])
                      }} />
                    </label>
                  ))}
                </div>
              )}

              {id === 'multibrot' && (
                <div className="ligne">
                  <label htmlFor="fr-degre">{T.degre}</label>
                  <div className="curseur">
                    <input id="fr-degre" type="range" min="2" max="8" step="0.1" value={degre} onChange={(e) => setDegre(Number(e.target.value))} />
                    <output htmlFor="fr-degre">{fmt(degre)}</output>
                  </div>
                </div>
              )}

              {id === 'newton' && (
                <>
                  <div className="ligne">
                    <label htmlFor="fr-poly">{T.polynome}</label>
                    <select id="fr-poly" value={polynome} onChange={(e) => setPolynome(e.target.value)}>
                      {Object.keys(POLYNOMES).map((k) => <option key={k} value={k}>{T.polynomes[k]}</option>)}
                    </select>
                  </div>
                  <div className="ligne">
                    <label htmlFor="fr-relax">{T.relaxation}</label>
                    <div className="curseur">
                      <input id="fr-relax" type="range" min="0.3" max="1.9" step="0.05" value={relax} onChange={(e) => setRelax(Number(e.target.value))} />
                      <output htmlFor="fr-relax">{fmt(relax)}</output>
                    </div>
                  </div>
                  <p className="aide">{T.relaxationAide}</p>
                </>
              )}

              {id === 'lyapunov' && (
                <form className="ligne" onSubmit={(e) => { e.preventDefault(); if (lireSuite(saisieSuite)) setSuite(saisieSuite.toUpperCase()) }}>
                  <label htmlFor="fr-suite">{T.suite}</label>
                  <div className="saisie">
                    <input id="fr-suite" value={saisieSuite} maxLength={24} spellCheck={false} autoComplete="off" onChange={(e) => setSaisieSuite(e.target.value.toUpperCase())} aria-invalid={!lireSuite(saisieSuite)} />
                    <button className="btn" type="submit" disabled={!lireSuite(saisieSuite)}>{T.appliquer}</button>
                  </div>
                </form>
              )}
              {id === 'lyapunov' && <p className="aide">{T.suiteAide}</p>}

            </section>

            {/* Lieux célèbres */}
            {lieuxDispo.length > 0 && (
              <section className="bloc">
                <h3>{T.lieux}</h3>
                <div className="ligne ligne--large">
                  <select aria-label={T.lieux} value={lieu} onChange={(e) => allerA(e.target.value)}>
                    <option value="">{T.choisirLieu}</option>
                    {lieuxDispo.map((l) => <option key={l.id} value={l.id}>{T.nomsLieux[l.id]}</option>)}
                  </select>
                </div>
                {lieu && <p className="aide">{T.textesLieux[lieu]}</p>}
              </section>
            )}

            {/* Couleurs */}
            <section className="bloc">
              <h3>{T.couleurs}</h3>
              <div className="ligne">
                <label htmlFor="fr-palette">{T.palette}</label>
                <select id="fr-palette" value={palette} onChange={(e) => setPalette(e.target.value)}>
                  {Object.keys(PALETTES).map((k) => <option key={k} value={k}>{T.palettes[k]}</option>)}
                </select>
              </div>
              <div className="ligne">
                <label htmlFor="fr-densite">{T.densite}</label>
                <div className="curseur">
                  <input id="fr-densite" type="range" min="-9" max="-1" step="0.25" value={densite} onChange={(e) => setDensite(Number(e.target.value))} />
                </div>
              </div>
              <div className="ligne">
                <label htmlFor="fr-decalage">{T.decalage}</label>
                <div className="curseur">
                  <input id="fr-decalage" type="range" min="0" max="1" step="0.01" value={decalage} onChange={(e) => setDecalage(Number(e.target.value))} />
                </div>
              </div>
              <label className="option">
                <input type="checkbox" checked={defile} onChange={() => setDefile(!defile)} />
                {T.defile}
              </label>
              {famille === 'evasion' && (
                <>
                  <div className="ligne">
                    <label htmlFor="fr-echelle">{T.echelle}</label>
                    <select id="fr-echelle" value={echelle} onChange={(e) => setEchelle(e.target.value)}>
                      {['zoom', 'log', 'lineaire'].map((k) => <option key={k} value={k}>{T.echelles[k]}</option>)}
                    </select>
                  </div>
                  <p className="aide">{T.echellesAide[echelle]}</p>
                  <label className="option" title={T.bandesAide}>
                    <input type="checkbox" checked={bandes} onChange={() => setBandes(!bandes)} />
                    {T.bandes}
                  </label>
                </>
              )}
              {holomorphe && (
                <>
                  <label className="option" title={T.reliefAide}>
                    <input type="checkbox" checked={relief} onChange={() => setRelief(!relief)} />
                    {T.relief}
                  </label>
                  <label className="option" title={T.bordsAide}>
                    <input type="checkbox" checked={bords} onChange={() => setBords(!bords)} />
                    {T.bords}
                  </label>
                </>
              )}
            </section>

            {/* Calcul */}
            <section className="bloc">
              <h3>{T.blocCalcul}<span>{infos.profond ? T.precisionProfonde : T.precisionSimple}</span></h3>
              <label className="option">
                <input type="checkbox" checked={iterAuto} onChange={() => { setIterMain(iter); setIterAuto(!iterAuto) }} />
                {T.iterAuto}
              </label>
              <div className="ligne">
                <label htmlFor="fr-iter">{T.iterations}</label>
                <div className="curseur">
                  <input id="fr-iter" type="range" min="0" max="100" value={curseurDeIter(iter)} disabled={iterAuto} onChange={(e) => setIterMain(iterDeCurseur(Number(e.target.value)))} />
                  <output htmlFor="fr-iter">{fmt(iter)}</output>
                </div>
              </div>
              <p className="aide">{famille === 'evasion' && id !== 'multibrot' ? T.precisionAide : T.precisionLimitee}</p>
              {infos.limite && <p className="aide aide--erreur">{T.limite}</p>}
            </section>

            {/* Partager */}
            <section className="bloc">
              <h3>{T.partage.titre}</h3>
              <div className="ligne">
                <label htmlFor="fr-taille">{T.partage.taille}</label>
                <select id="fr-taille" value={facteur} onChange={(e) => setFacteur(Number(e.target.value))}>
                  {[1, 2, 4].map((f) => <option key={f} value={f}>{T.partage.facteur(f)}</option>)}
                </select>
              </div>
              <div className="boutons-ligne">
                <button className="btn" onClick={exporter} disabled={exportation !== null}>{T.partage.exporter}</button>
                <button className="btn" onClick={copierLien}>{T.partage.lien}</button>
              </div>
              {message && <p className={message.erreur ? 'aide aide--erreur' : 'aide fr-message'} role="status">{message.texte}</p>}
            </section>
          </aside>
        )}
      </div>

      <BarreEtat
        statut={plongee ? T.etat.plongee : infos.progres < 1 ? T.etat.calcul(Math.round(infos.progres * 100)) : infos.affinage < 1 ? T.etat.affinage(Math.round(infos.affinage * 100)) : T.etat.pret}
        actif={plongee || infos.affinage < 1}
        elements={[
          nomFractale,
          T.etat.centre(coord(infos.x), coord(infos.y)),
          T.etat.zoom(T.zoomTexte(infos.zoom)),
          T.etat.iterations(fmt(infos.iter)),
        ]}
        fin={infos.profond ? T.precisionProfonde : T.precisionSimple}
      />
    </div>
  )
}
