import { useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react'
import BarreEtat from '../BarreEtat'
import Crans, { IconeLecture, IconePause } from '../commun/Crans'
import { useGestes, useClavier } from '../commun/gestes'
import { generateur } from '../commun/aleatoire.js'
import {
  creerMonde, avancer, ecrire, lire, placer, soupe, toutEffacer, reinitialiser,
  changerRegle, changerBords, lireRegle, cellules, boite,
} from './moteur.js'
import { creerHashlife } from './hashlife.js'
import { creerRendu, THEMES } from './rendu'
import { creerAnalyse } from './periodes.js'
import { BIBLIOTHEQUE, GROUPES, motif, lireRLE, ecrireRLE, tourner, retourner } from './motifs.js'
import { REGLES, LIFE, reglePreset } from './regles'

// ============================================================
//  ATELIER DU JEU DE LA VIE : l'onglet Simulation
//  Outils, grille, lecture, réglages repliables, barre d'état.
//  La simulation vit dans des useRef (hors de l'état React) :
//  seuls les boutons et la barre d'état passent par l'état.
// ============================================================

const TAILLE = 1024 // grille de 1 024 × 1 024 cases
const VITESSES = [1, 2, 5, 10, 20, 30, 60, 120, 250, 500, 1000, 'max'] // générations par seconde
const VITESSE_DEFAUT = 5
const BUDGET = 12 // millisecondes de calcul par image, au plus : l'interface reste fluide
const OUTILS = ['main', 'crayon', 'gomme', 'tampon']
const TAILLES_SOUPE = [64, 128, 256, 512, 1024]
const HISTORIQUE = 160 // points de la petite courbe de population
const SAUTS = [10, 15, 20, 25, 30] // sauts dans le temps : 2^k générations
const EXPOSANTS = '⁰¹²³⁴⁵⁶⁷⁸⁹'
const puissance = (k) => `2${[...String(k)].map((c) => EXPOSANTS[c]).join('')}`

// Durée d'un calcul, en millisecondes (au moins 1)
function chronometrer(calcul) {
  const t0 = performance.now()
  calcul()
  return Math.max(1, Math.round(performance.now() - t0))
}

// Visite guidée : le R-pentomino. Pour chaque étape : la vitesse, et la demi-largeur du cadre autour du centre
const ETAPES = [
  { gen: 0, cadre: 24 },
  { gen: 69, vitesse: 4, cadre: 40 },
  { gen: 500, vitesse: 6, cadre: 100 },
  { gen: 1103, vitesse: 7, cadre: 100 },
  { gen: 1300, vitesse: 7, cadre: 100 },
]
const cadreVisite = (k) => {
  const c = TAILLE / 2
  const r = ETAPES[k].cadre
  return { x0: c - r, y0: c - r, x1: c + r, y1: c + r }
}

const ICONES = {
  main: <path d="M8 1v14M1 8h14M8 1 6 3m2-2 2 2M8 15l-2-2m2 2 2-2M1 8l2-2M1 8l2 2m12-2-2-2m2 2-2 2" stroke="currentColor" strokeWidth="1.4" fill="none" />,
  crayon: <path d="M11 2.5 13.5 5 6 12.5H3.5V10z" stroke="currentColor" strokeWidth="1.4" fill="none" strokeLinejoin="round" />,
  gomme: <rect x="2.5" y="2.5" width="11" height="11" fill="none" stroke="currentColor" strokeWidth="1.4" strokeDasharray="2 2" />,
  tampon: <path d="M3 3h4v4H3zM9 9h4v4H9zM9 3h4v4H9z" fill="currentColor" opacity=".75" />,
}
const Icone = ({ nom }) => <svg width="13" height="13" viewBox="0 0 16 16" aria-hidden="true">{ICONES[nom]}</svg>

// Petite courbe de population pour la barre d'état (décorative : la valeur est écrite à côté)
function Courbe({ points }) {
  if (points.length < 2) return null
  const max = Math.max(...points, 1)
  const min = Math.min(...points)
  const etendue = Math.max(1, max - min)
  const d = points.map((p, k) => `${((k / (HISTORIQUE - 1)) * 64).toFixed(1)},${(13 - ((p - min) / etendue) * 12).toFixed(1)}`).join(' ')
  return (
    <svg className="etat-courbe" width="64" height="14" viewBox="0 0 64 14" aria-hidden="true">
      <polyline points={d} />
    </svg>
  )
}

export default function Atelier({ ref, visible, theme, T }) {
  const canvasRef = useRef(null)
  const sim = useRef(null) // { monde, rendu, analyse, echelle }
  const opts = useRef({ pause: true, vitesse: VITESSE_DEFAUT, effets: {}, auto: false, visite: null, visible: true, theme, fantome: null })
  const historique = useRef([])
  const traceVers = useRef(1) // le crayon dessine (1) ou efface (0) selon la case de départ

  const [pause, setPause] = useState(true)
  const [vitesse, setVitesse] = useState(VITESSE_DEFAUT)
  const [effets, setEffets] = useState({ quadrillage: true, age: true, trainees: false, activite: false })
  const [auto, setAuto] = useState(false)
  const [outil, setOutil] = useState('main')
  const [replie, setReplie] = useState(false)
  const [regle, setRegle] = useState(LIFE)
  const [saisie, setSaisie] = useState(LIFE.texte)
  const [erreurSaisie, setErreurSaisie] = useState(false)
  const [bords, setBords] = useState('ferme')
  const [motifId, setMotifId] = useState('')
  const [tampon, setTampon] = useState(() => motif('planeur'))
  const [densite, setDensite] = useState(35)
  const [tailleSoupe, setTailleSoupe] = useState(128)
  const [rle, setRle] = useState('')
  const [messageRle, setMessageRle] = useState(null) // { texte, erreur }
  const [stats, setStats] = useState({ gen: 0, pop: 0, gps: 0, analyse: null, courbe: [] })
  const [etape, setEtape] = useState(null)
  const [enVisite, setEnVisite] = useState(false)
  const [saut, setSaut] = useState(20)
  const [messageSaut, setMessageSaut] = useState(null)
  const [calculSaut, setCalculSaut] = useState(false)
  const [vueHL, setVueHL] = useState(null) // { gen, pop, noeuds } quand la vue Hashlife est affichée
  const hashlife = useRef(null)

  // L'état React pilote la boucle d'animation à travers opts
  useEffect(() => {
    Object.assign(opts.current, { pause, vitesse, effets, auto, visible, theme })
  }, [pause, vitesse, effets, auto, visible, theme])

  /* ---------- Boucle d'animation ---------- */
  useEffect(() => {
    const canvas = canvasRef.current
    const echelle = Math.min(window.devicePixelRatio || 1, 2)
    const dimensionner = () => {
      canvas.width = Math.max(1, Math.round(canvas.clientWidth * echelle))
      canvas.height = Math.max(1, Math.round(canvas.clientHeight * echelle))
    }
    dimensionner()

    const monde = creerMonde({ W: TAILLE, H: TAILLE, regle: LIFE })
    // Au premier affichage : une soupe, toujours la même (graine fixe)
    soupe(monde, { cote: 128, densite: 0.35, alea: generateur(2026) })
    const rendu = creerRendu(canvas, monde)
    const analyse = creerAnalyse()
    rendu.recentrer()
    sim.current = { monde, rendu, analyse, echelle }

    let raf = 0
    let dernier = performance.now()
    let accumule = 0
    let derniereMaj = 0
    let gensSeconde = 0
    let debutSeconde = performance.now()
    let gps = 0

    const boucle = (t) => {
      raf = requestAnimationFrame(boucle)
      const o = opts.current
      const dt = Math.min(100, t - dernier)
      dernier = t
      if (!o.visible) return // onglet caché : rien à calculer ni à dessiner

      if (o.hashlife) {
        rendu.dessinerHashlife(o.hashlife, { theme: o.theme, quadrillage: o.effets.quadrillage })
        return
      }

      if (!o.pause) {
        const v = VITESSES[o.vitesse]
        let n
        if (v === 'max') n = Infinity
        else {
          accumule += (dt * v) / 1000
          n = Math.floor(accumule)
          accumule -= n
        }
        const prochaine = o.visite && ETAPES[o.visite.prochaine]
        if (prochaine) n = Math.min(n, prochaine.gen - monde.gen)
        const debut = performance.now()
        let k = 0
        while (k < n && performance.now() - debut < BUDGET) {
          avancer(monde, 1)
          analyse.suivre(monde)
          k++
          if (monde.population === 0) break
        }
        if (k < n && v !== 'max') accumule = 0 // en retard : on ne rattrape pas
        gensSeconde += k

        if (monde.population === 0 && !prochaine) { o.pause = true; setPause(true) }
        if (prochaine && monde.gen >= prochaine.gen) {
          o.pause = true
          setPause(true)
          setEtape(o.visite.prochaine)
          o.visite.prochaine = Math.min(o.visite.prochaine + 1, ETAPES.length - 1)
        }
      }

      rendu.dessiner({ effets: o.effets, auto: o.auto, cible: o.visite?.cadre, theme: o.theme, fantome: o.fantome })

      if (t - debutSeconde >= 1000) {
        gps = Math.round((gensSeconde * 1000) / (t - debutSeconde))
        gensSeconde = 0
        debutSeconde = t
      }
      if (t - derniereMaj > 200) {
        derniereMaj = t
        const h = historique.current
        if (!h.length || h[h.length - 1][0] !== monde.gen) {
          h.push([monde.gen, monde.population])
          if (h.length > HISTORIQUE) h.shift()
        }
        const resultat = analyse.resultat
        setStats((s) => (s.gen === monde.gen && s.pop === monde.population && s.gps === gps && s.analyse === resultat
          ? s
          : { gen: monde.gen, pop: monde.population, gps, analyse: resultat, courbe: h.map((p) => p[1]) }))
      }
    }
    raf = requestAnimationFrame(boucle)

    const ro = new ResizeObserver(dimensionner)
    ro.observe(canvas)
    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
    }
  }, [])

  /* ---------- Lecture ---------- */
  const lancer = () => { opts.current.pause = false; setPause(false) }
  const arreter = () => { opts.current.pause = true; setPause(true) }
  const basculerLecture = () => {
    if (opts.current.hashlife) return // vue Hashlife : la grille est en attente
    if (opts.current.pause) lancer()
    else arreter()
  }

  const pasAPas = () => {
    if (opts.current.hashlife) return
    arreter()
    const { monde, analyse } = sim.current
    avancer(monde, 1)
    analyse.suivre(monde)
  }

  // Après un changement de la grille : compteurs à jour tout de suite, courbe et analyse remises à zéro
  const grilleChangee = ({ arret = true } = {}) => {
    const { monde, analyse } = sim.current
    analyse.oublier()
    historique.current = []
    if (arret) arreter()
    setStats((s) => ({ ...s, gen: monde.gen, pop: monde.population, analyse: null, courbe: [] }))
  }

  const recommencer = () => { if (reinitialiser(sim.current.monde)) grilleChangee() }
  const effacerTout = () => { toutEffacer(sim.current.monde); grilleChangee() }

  const nouvelleSoupe = () => {
    const { monde, rendu } = sim.current
    soupe(monde, { cote: Math.min(tailleSoupe, TAILLE), densite: densite / 100 })
    rendu.recentrer()
    grilleChangee()
  }

  /* ---------- Règles ---------- */
  const appliquerRegle = (r) => {
    changerRegle(sim.current.monde, r)
    setRegle(r)
    setSaisie(r.texte)
    setErreurSaisie(false)
    sim.current.analyse.oublier()
  }

  const basculerChiffre = (cle, k) => {
    const n = { naissance: Uint8Array.from(regle.naissance), survie: Uint8Array.from(regle.survie) }
    n[cle][k] = n[cle][k] ? 0 : 1
    const texte = `B${[...n.naissance].map((v, j) => (v ? j : '')).join('')}/S${[...n.survie].map((v, j) => (v ? j : '')).join('')}${regle.etats > 2 ? `/C${regle.etats}` : ''}`
    const r = lireRegle(texte)
    if (r) appliquerRegle(r)
  }

  const validerSaisie = (e) => {
    e.preventDefault()
    const r = lireRegle(saisie)
    if (!r) { setErreurSaisie(true); return }
    appliquerRegle(r)
  }

  const choisirBords = (b) => {
    changerBords(sim.current.monde, b)
    setBords(b)
    sim.current.analyse.oublier()
  }

  /* ---------- Motifs ---------- */
  const choisirMotif = (id) => {
    setMotifId(id)
    const m = motif(id)
    if (!m) return
    setTampon(m)
    setOutil('tampon')
  }

  // Vide la grille et pose un motif au centre, cadré
  const poserAuCentre = (m) => {
    const { monde, rendu } = sim.current
    toutEffacer(monde)
    placer(monde, m.cellules, (TAILLE - m.largeur) >> 1, (TAILLE - m.hauteur) >> 1)
    rendu.recentrer()
    grilleChangee()
  }

  const transformer = (f) => setTampon((t) => (t ? f(t) : t))

  const importerRle = (e) => {
    e.preventDefault()
    const m = lireRLE(rle)
    if (!m || !m.cellules.length || m.largeur > TAILLE || m.hauteur > TAILLE) {
      setMessageRle({ texte: T.rle.erreur, erreur: true })
      return
    }
    const r = m.regle && lireRegle(m.regle)
    if (r && r.texte !== regle.texte) appliquerRegle(r)
    setTampon(m)
    setMotifId('')
    poserAuCentre(m)
    setMessageRle({ texte: T.rle.importe(m.nom, m.cellules.length.toLocaleString(T.nombre)), erreur: false })
  }

  const exporterRle = async () => {
    const c = cellules(sim.current.monde)
    if (!c.length) { setMessageRle({ texte: T.rle.vide, erreur: true }); return }
    const texte = ecrireRLE({ cellules: c, regle: regle.texte, etats: regle.etats })
    setRle(texte)
    try {
      await navigator.clipboard.writeText(texte)
      setMessageRle({ texte: T.rle.copie, erreur: false })
    } catch {
      setMessageRle(null) // presse-papiers refusé : le texte reste dans le champ, à copier à la main
    }
  }

  /* ---------- Sauter dans le temps (Hashlife) ---------- */
  const quitterHashlife = () => {
    hashlife.current = null
    opts.current.hashlife = null
    sim.current.rendu.modeInfini(false)
    sim.current.rendu.recentrer()
    setVueHL(null)
  }

  const montrerHashlife = (h, gen) => {
    hashlife.current = h
    opts.current.hashlife = h
    const { rendu } = sim.current
    rendu.modeInfini(true)
    rendu.recentrer(h.boite())
    setOutil('main')
    setVueHL({ gen, pop: h.population(), noeuds: h.noeuds() })
  }

  // Le calcul part après un court délai : le message « Calcul en cours » a le temps de s'afficher
  const sauter = () => {
    arreter()
    setCalculSaut(true)
    setMessageSaut(T.saut.calcul)
    setTimeout(() => {
      try {
        calculerSaut()
      } catch (e) {
        if (e.message !== 'hashlife:limite') throw e
        setMessageSaut(T.saut.trop)
      } finally {
        setCalculSaut(false)
      }
    }, 40)
  }

  function calculerSaut() {
    const { monde, rendu } = sim.current
    // Déjà dans la vue Hashlife : on continue sur le même univers
    if (hashlife.current) {
      const h = hashlife.current
      const ms = chronometrer(() => h.sauter(saut))
      const gen = vueHL.gen + 2 ** saut
      setMessageSaut(T.saut.fait(fmt(2 ** saut), fmt(ms)))
      montrerHashlife(h, gen)
      return
    }
    const b = boite(monde)
    if (!b) { setMessageSaut(T.saut.vide); return }
    const h = creerHashlife(regle)
    for (const [x, y, e] of cellules(monde, b)) if (e === 1) h.poser(b.x0 + x, b.y0 + y)
    const ms = chronometrer(() => h.sauter(saut))
    const gen = monde.gen + 2 ** saut
    setMessageSaut(T.saut.fait(fmt(2 ** saut), fmt(ms)))
    const r = h.boite()
    const tient = !r || (r.x0 >= 0 && r.y0 >= 0 && r.x1 < TAILLE && r.y1 < TAILLE && gen < 2 ** 31)
    if (!tient) { montrerHashlife(h, gen); return }
    // Le résultat tient dans la grille : on le recopie et la simulation continue normalement
    const depart = monde.depart ?? (monde.gen === 0 ? monde.etat.slice() : null)
    toutEffacer(monde)
    for (const [x, y] of h.cellules()) ecrire(monde, x, y, 1)
    monde.gen = gen
    monde.depart = depart
    monde.boiteGen = -1
    rendu.repeindre()
    grilleChangee()
  }

  /* ---------- Vue ---------- */
  const zoom = (f) => {
    sim.current.rendu.zoomer(f)
    opts.current.auto = false
    setAuto(false)
  }

  /* ---------- Visite guidée (lancée depuis l'onglet Comprendre) ---------- */
  const lancerVisite = () => {
    if (hashlife.current) quitterHashlife()
    const { monde } = sim.current
    if (regle.texte !== LIFE.texte) appliquerRegle(LIFE)
    if (monde.bords !== 'ferme') { changerBords(monde, 'ferme'); setBords('ferme') }
    poserAuCentre(motif('rpentomino'))
    setVitesse(ETAPES[1].vitesse)
    opts.current.vitesse = ETAPES[1].vitesse
    setEffets({ quadrillage: true, age: true, trainees: false, activite: false })
    setAuto(false)
    setOutil('main')
    sim.current.rendu.recentrer(cadreVisite(0))
    opts.current.visite = { prochaine: 1, cadre: cadreVisite(0) }
    setEnVisite(true)
    setEtape(0)
  }

  const quitterVisite = () => {
    opts.current.visite = null
    setEnVisite(false)
    setEtape(null)
  }

  const continuerVisite = () => {
    if (etape === ETAPES.length - 1) { quitterVisite(); return }
    const v = ETAPES[etape + 1].vitesse
    if (v != null) { setVitesse(v); opts.current.vitesse = v }
    opts.current.visite.cadre = cadreVisite(etape + 1)
    setEtape(null)
    lancer()
  }

  useImperativeHandle(ref, () => ({ lancerVisite }))

  /* ---------- Clavier ---------- */
  useClavier({
    actif: visible,
    touches: {
      Space: basculerLecture,
      ArrowRight: pasAPas,
      KeyR: () => transformer(tourner),
      KeyF: () => transformer(retourner),
      Escape: () => { setOutil('main'); opts.current.fantome = null },
    },
  })

  /* ---------- Souris et doigts ---------- */
  const camManuelle = () => {
    opts.current.auto = false
    setAuto(false)
  }

  const gestes = useGestes(canvasRef, {
    vue: () => sim.current?.rendu ?? null,
    echelle: () => sim.current.echelle,
    outil,
    outilsTrace: ['crayon', 'gomme'],
    onDebutTrace: (c) => {
      // Le crayon efface s'il part d'une cellule vivante (comme dans Golly)
      traceVers.current = outil === 'gomme' ? 0 : lire(sim.current.monde, c.x, c.y) ? 0 : 1
    },
    onTrace: (c) => {
      if (ecrire(sim.current.monde, c.x, c.y, traceVers.current)) sim.current.analyse.oublier()
    },
    onAppui: (c) => {
      if (outil !== 'tampon' || !tampon) return
      placer(sim.current.monde, tampon.cellules, c.x - (tampon.largeur >> 1), c.y - (tampon.hauteur >> 1))
      sim.current.analyse.oublier()
    },
    onSurvol: (c) => {
      opts.current.fantome = c && outil === 'tampon' && tampon
        ? { cellules: tampon.cellules, x: c.x - (tampon.largeur >> 1), y: c.y - (tampon.hauteur >> 1) }
        : null
    },
    onCamManuelle: camManuelle,
  })

  // Le fantôme suit les rotations du tampon et disparaît avec l'outil
  useEffect(() => {
    const f = opts.current.fantome
    if (outil !== 'tampon' || !tampon) opts.current.fantome = null
    else if (f) opts.current.fantome = { cellules: tampon.cellules, x: f.x, y: f.y }
  }, [outil, tampon])

  /* ---------- Affichage ---------- */
  const fmt = (n) => n.toLocaleString(T.nombre)
  const presetActif = reglePreset(regle.texte)
  const termine = pause && stats.pop === 0 && stats.gen > 0
  const libelleLecture = termine ? T.reinitialiser : !pause ? T.pause : stats.gen === 0 ? T.lancer : T.reprendre
  const statut = termine ? T.statut.fini : !pause ? T.statut.enCours : stats.gen === 0 ? T.statut.pret : T.statut.pause
  const v = VITESSES[vitesse]
  const couleursEtats = useMemo(() => {
    const th = THEMES[theme]
    return Array.from({ length: regle.etats - 1 }, (_, k) => (k === 0 ? th.encre : `color-mix(in srgb, ${th.encre} ${Math.round(70 - (50 * k) / Math.max(1, regle.etats - 2))}%, ${th.feuille})`))
  }, [regle.etats, theme])

  const a = stats.analyse
  const texteAnalyse = !a
    ? stats.gen === 0 ? T.analyse.attente : T.analyse.enCours
    : a.type === 'vide' ? T.analyse.vide(fmt(a.gen))
      : a.type === 'stable' ? T.analyse.stable
        : a.type === 'oscillateur' ? T.analyse.oscillateur(a.periode)
          : a.type === 'vaisseau' ? T.analyse.vaisseau(a.periode, T.analyse.deplacement(a.dx, a.dy), a.texte)
            : T.analyse.grand
  const analyseCourte = a && a.type !== 'grand'
    ? a.type === 'oscillateur' ? T.analyse.court.oscillateur(a.periode)
      : a.type === 'vaisseau' ? T.analyse.court.vaisseau(a.texte)
        : T.analyse.court[a.type]
    : null

  return (
    <div className="atelier" hidden={!visible}>
      <div className="atelier-corps" data-replie={replie}>
        <div className="plan">

          <div className="plan-outils">
            <div className="groupe" role="group" aria-label={T.outils.main}>
              {OUTILS.map((o) => (
                <button key={o} aria-pressed={outil === o} title={T.aides[o]} onClick={() => setOutil(o)} disabled={!!vueHL && o !== 'main'}>
                  <Icone nom={o} />{T.outils[o]}
                </button>
              ))}
            </div>
            <div className="plan-outils-droite">
              <div className="groupe">
                <button onClick={() => zoom(1 / 1.5)} aria-label={T.zoomMoins} title={T.zoomMoins}>−</button>
                <button onClick={() => zoom(1.5)} aria-label={T.zoomPlus} title={T.zoomPlus}>+</button>
                <button aria-pressed={auto} onClick={() => setAuto(!auto)}>{T.cadrage}</button>
              </div>
              {replie && <button className="btn" onClick={() => setReplie(false)}>‹ {T.reglages}</button>}
            </div>
          </div>

          <div className="cadre">
            <canvas ref={canvasRef} className="cadre-canvas" data-outil={outil} {...gestes} />
          </div>

          <div className="transport">
            {vueHL ? (
              <div className="visite" aria-live="polite">
                <p className="visite-etape">{T.saut.vue.titre}</p>
                <h2>{T.saut.vue.gen(fmt(vueHL.gen))}</h2>
                <p className="visite-texte">{T.saut.vue.texte(fmt(vueHL.pop))}</p>
                <div className="visite-actions">
                  <button className="btn" onClick={quitterHashlife}>{T.saut.vue.revenir}</button>
                  <button className="btn-principal" onClick={sauter} disabled={calculSaut}>{T.saut.encore}</button>
                </div>
              </div>
            ) : etape !== null ? (
              <div className="visite" aria-live="polite">
                <p className="visite-etape">{T.visite.etapeSur(etape + 1, ETAPES.length)}</p>
                <h2>{T.visite.etapes[etape][0]}</h2>
                <p className="visite-texte">{T.visite.etapes[etape][1]}</p>
                <div className="visite-actions">
                  <button className="btn" onClick={quitterVisite}>{T.visite.quitter}</button>
                  <button className="btn-principal" onClick={continuerVisite}>
                    {etape === ETAPES.length - 1 ? T.visite.terminer : T.visite.continuer}
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="transport-boutons">
                  <button className="btn-principal" onClick={termine ? recommencer : basculerLecture} title={T.raccourcis}>
                    {!termine && (pause ? <IconeLecture /> : <IconePause />)}
                    {libelleLecture}
                  </button>
                  <button className="btn" onClick={pasAPas}>{T.unPas}</button>
                  {!termine && <button className="btn" onClick={recommencer} title={T.reinitialiserAide} disabled={stats.gen === 0}>{T.reinitialiser}</button>}
                  <button className="btn" onClick={effacerTout} title={T.toutEffacerAide}>{T.toutEffacer}</button>
                </div>
                <Crans
                  valeur={vitesse}
                  max={VITESSES.length - 1}
                  onChange={setVitesse}
                  libelle={T.vitesse}
                  texte={v === 'max' ? T.max : T.genParSeconde(fmt(v))}
                />
                {enVisite && <button className="btn" onClick={quitterVisite}>{T.visite.quitter}</button>}
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

            {/* Règle */}
            <section className="bloc" inert={!!vueHL}>
              <h3>{T.regle}<span>{regle.texte}</span></h3>
              <div className="ligne">
                <label htmlFor="vie-preset">{T.prereglage}</label>
                <select id="vie-preset" value={presetActif} onChange={(e) => appliquerRegle(REGLES.find((r) => r.id === e.target.value).regle)}>
                  {!presetActif && <option value="">{T.personnalisee}</option>}
                  {REGLES.map((r) => <option key={r.id} value={r.id}>{T.regles[r.id][0]}</option>)}
                </select>
              </div>
              {presetActif && <p className="aide">{T.regles[presetActif][1]}</p>}

              <div className="voisines" role="group" aria-label={T.voisines}>
                {['naissance', 'survie'].map((cle) => (
                  <div key={cle} className="voisines-ligne">
                    <span>{T[cle]}</span>
                    <div className="voisines-cases">
                      {Array.from({ length: 9 }, (_, k) => (
                        <button
                          key={k}
                          aria-pressed={!!regle[cle][k]}
                          aria-label={`${T[cle]} ${k}`}
                          disabled={cle === 'naissance' && k === 0}
                          onClick={() => basculerChiffre(cle, k)}
                        >
                          {k}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <form className="ligne" onSubmit={validerSaisie}>
                <label htmlFor="vie-notation">{T.notation}</label>
                <div className="saisie">
                  <input
                    id="vie-notation"
                    value={saisie}
                    onChange={(e) => setSaisie(e.target.value.toUpperCase())}
                    maxLength={24}
                    spellCheck={false}
                    autoComplete="off"
                    aria-invalid={erreurSaisie}
                    aria-describedby="vie-notation-aide"
                  />
                  <button className="btn" type="submit">{T.appliquer}</button>
                </div>
              </form>
              <p id="vie-notation-aide" className={erreurSaisie ? 'aide aide--erreur' : 'aide'}>
                {erreurSaisie ? T.invalide : T.aideNotation}
              </p>
              {regle.etats > 2 && (
                <ul className="legende-etats">
                  {couleursEtats.map((c, k) => (
                    <li key={k}><span className="pastille" style={{ background: c }} />{k + 1} : {T.legendeEtats(k + 1)}</li>
                  ))}
                </ul>
              )}
            </section>

            {/* Motifs */}
            <section className="bloc" inert={!!vueHL}>
              <h3>{T.motifs}{tampon && <span>{tampon.id ? T.nomsMotifs[tampon.id] : tampon.nom}</span>}</h3>
              <div className="ligne ligne--large">
                <select aria-label={T.choisirMotif} value={motifId} onChange={(e) => choisirMotif(e.target.value)}>
                  <option value="">{T.choisirMotif}</option>
                  {GROUPES.map((g) => (
                    <optgroup key={g} label={T.groupes[g]}>
                      {BIBLIOTHEQUE.filter((p) => p.groupe === g).map((p) => <option key={p.id} value={p.id}>{T.nomsMotifs[p.id]}</option>)}
                    </optgroup>
                  ))}
                </select>
              </div>
              <div className="boutons-ligne">
                <button className="btn" onClick={() => tampon && poserAuCentre(tampon)} disabled={!tampon}>{T.poserCentre}</button>
                <button className="btn btn-icone" onClick={() => transformer(tourner)} disabled={!tampon} aria-label={T.tourner} title={`${T.tourner} (R)`}>
                  <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><path d="M12.5 7.5A4.5 4.5 0 1 1 8 3h3.5m0 0L9.5 1m2 2-2 2" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </button>
                <button className="btn btn-icone" onClick={() => transformer(retourner)} disabled={!tampon} aria-label={T.retourner} title={`${T.retourner} (F)`}>
                  <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><path d="M8 1.5v13M6 4 2 11h4zm4 0 4 7h-4z" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" /></svg>
                </button>
              </div>
              <p className="aide">{T.aideTampon}</p>

              <details className="rle">
                <summary>{T.rle.ouvrir}</summary>
                <form onSubmit={importerRle}>
                  <label htmlFor="vie-rle" className="aide">{T.rle.coller}</label>
                  <textarea
                    id="vie-rle"
                    value={rle}
                    onChange={(e) => setRle(e.target.value)}
                    rows={5}
                    spellCheck={false}
                    placeholder={'x = 3, y = 3, rule = B3/S23\nbo$2bo$3o!'}
                  />
                  <div className="boutons-ligne">
                    <button className="btn" type="submit" disabled={!rle.trim()}>{T.rle.importer}</button>
                    <button className="btn" type="button" onClick={exporterRle}>{T.rle.exporter}</button>
                  </div>
                  {messageRle && <p className={messageRle.erreur ? 'aide aide--erreur' : 'aide'} role="status">{messageRle.texte}</p>}
                </form>
              </details>
            </section>

            {/* Soupe */}
            <section className="bloc" inert={!!vueHL}>
              <h3>{T.soupe}</h3>
              <div className="ligne">
                <label htmlFor="vie-densite">{T.densite}</label>
                <div className="curseur">
                  <input id="vie-densite" type="range" min="5" max="95" step="5" value={densite} onChange={(e) => setDensite(Number(e.target.value))} />
                  <output htmlFor="vie-densite">{T.pourcent(densite)}</output>
                </div>
              </div>
              <div className="ligne">
                <label htmlFor="vie-taille">{T.taille}</label>
                <select id="vie-taille" value={tailleSoupe} onChange={(e) => setTailleSoupe(Number(e.target.value))}>
                  {TAILLES_SOUPE.map((n) => <option key={n} value={n}>{T.tailleN(n)}</option>)}
                </select>
              </div>
              <button className="btn" onClick={nouvelleSoupe}>{T.nouvelleSoupe}</button>
            </section>

            {/* Analyse */}
            <section className="bloc" inert={!!vueHL}>
              <h3>{T.analyse.titre}</h3>
              <p className="analyse" aria-live="polite">{texteAnalyse}</p>
            </section>

            {/* Sauter dans le temps */}
            <section className="bloc">
              <h3>{T.saut.titre}<span>Hashlife</span></h3>
              <p className="aide">{T.saut.aide}</p>
              <div className="ligne">
                <label htmlFor="vie-saut">{T.saut.taille}</label>
                <select id="vie-saut" value={saut} onChange={(e) => setSaut(Number(e.target.value))}>
                  {SAUTS.map((k) => <option key={k} value={k}>{T.saut.option(fmt(2 ** k), puissance(k))}</option>)}
                </select>
              </div>
              <button className="btn" onClick={sauter} disabled={regle.etats > 2 || calculSaut}>{vueHL ? T.saut.encore : T.saut.bouton}</button>
              {regle.etats > 2 && <p className="aide">{T.saut.generations}</p>}
              {messageSaut && <p className="aide" role="status">{messageSaut}</p>}
            </section>

            {/* Affichage */}
            <section className="bloc">
              <h3>{T.affichage}</h3>
              {Object.keys(effets).map((k) => (
                <label key={k} className="option" title={T.effetsAides[k]}>
                  <input type="checkbox" checked={effets[k]} onChange={() => setEffets({ ...effets, [k]: !effets[k] })} />
                  {T.effetsNoms[k]}
                </label>
              ))}
            </section>

            {/* Bords */}
            <section className="bloc" inert={!!vueHL}>
              <h3>{T.bordsTitre}</h3>
              {['ferme', 'tore'].map((b) => (
                <label key={b} className="option">
                  <input type="radio" name="vie-bords" checked={bords === b} onChange={() => choisirBords(b)} />
                  {T.bords[b]}
                </label>
              ))}
            </section>
          </aside>
        )}
      </div>

      {vueHL ? (
        <BarreEtat
          statut={T.saut.vue.statut}
          elements={[T.etatRegle(regle.texte), T.etatGen(fmt(vueHL.gen)), T.etatPop(vueHL.pop, fmt(vueHL.pop))]}
          fin={T.saut.vue.noeuds(fmt(vueHL.noeuds))}
        />
      ) : (
      <BarreEtat
        statut={statut}
        actif={!pause}
        elements={[
          T.etatRegle(regle.texte),
          T.etatGen(fmt(stats.gen)),
          { cle: 'pop', contenu: <><Courbe points={stats.courbe} />{T.etatPop(stats.pop, fmt(stats.pop))}</> },
          analyseCourte,
        ]}
        fin={T.etatVitesse(fmt(pause ? 0 : stats.gps))}
      />
      )}
    </div>
  )
}