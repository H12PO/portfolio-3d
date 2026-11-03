import { useEffect, useImperativeHandle, useRef, useState } from 'react'
import BarreEtat from '../BarreEtat'
import Crans, { IconeLecture, IconePause } from '../commun/Crans'
import { DEFAUTS, MODELES, REGLAGES_DE_DEPART, MAX_ESPECES, MAX_PREDATEURS, MAX_CUCKER, RELATIONS, coteMonde } from './moteur'
import { creerRendu2D, COULEURS_ESPECES, COULEURS_MENEURS, COULEURS_CAP, COULEURS_PEUR } from './rendu2d'
import { creerSimulateur } from './simulateur'
import { SCENARIOS, DECORS, scenario } from './scenarios'
import Courbes from './Courbes'

// ============================================================
//  BOIDS : l'explorateur
//  Le calcul tourne dans un Web Worker (simulateur.js) : la page lui
//  demande une image à chaque rafraîchissement de l'écran, et dessine
//  la dernière reçue, en 2D (Canvas) ou en 3D (three.js, chargé à la
//  demande). React ne gère que les réglages, les scénarios, les
//  outils et les courbes.
// ============================================================

const VITESSES = [0.25, 0.5, 1, 2, 4, 8]   // pas du modèle par image
const BUDGET_MS = 35                        // le Worker rend la main après ce temps, quoi qu'il arrive
const MAX_POINTS = 240
const ESPECES = Array.from({ length: MAX_ESPECES }, (_, s) => s)
const POPULATIONS = {
  boids: [300, 1000, 1500, 2000, 3000, 5000],
  vicsek: [500, 1000, 2000, 3000, 4608],
  couzin: [30, 100, 200, 400],
  cucker: [50, 100, 300, 600],
}

const horloge = () => performance.now()
const nouvelleGraine = () => 1 + Math.floor(Math.random() * 999999)
const complets = (r) => ({ ...structuredClone(DEFAUTS), ...structuredClone(r ?? {}) })
const tous = (x) => [x, x, x]

function Curseur({ id, libelle, valeur, min, max, pas, onChange, texte, couleur }) {
  return (
    <div className="bo-reglage">
      <div className="bo-reglage-tete">
        <label htmlFor={id}>
          {couleur && <i className="bo-pastille" style={{ background: couleur }} aria-hidden="true" />}
          {libelle}
        </label>
        <output htmlFor={id}>{texte}</output>
      </div>
      <input id={id} type="range" min={min} max={max} step={pas} value={valeur} onChange={(e) => onChange(Number(e.target.value))} />
    </div>
  )
}

function Pli({ titre, ouvert = false, children }) {
  return (
    <details className="bo-pli" open={ouvert}>
      <summary>{titre}</summary>
      <div className="bo-pli-corps">{children}</div>
    </details>
  )
}

function Legende({ vue, modele, especes, T }) {
  if (vue === 'cap') {
    return (
      <div className="bo-legende">
        <span className="bo-roue" style={{ background: `conic-gradient(from 90deg, ${[...COULEURS_CAP, COULEURS_CAP[0]].join(', ')})` }} aria-hidden="true" />
        <span>{T.legende.cap}</span>
      </div>
    )
  }
  if (vue === 'peur') {
    return (
      <div className="bo-legende">
        <span>{T.legende.calme}</span>
        <span className="bo-rampe" style={{ background: `linear-gradient(90deg, ${COULEURS_PEUR.join(', ')})` }} />
        <span>{T.legende.panique}</span>
      </div>
    )
  }
  if (modele === 'couzin') {
    return (
      <div className="bo-legende">
        {COULEURS_MENEURS.map((c, k) => <span key={c}><i style={{ background: c }} />{T.legende.meneurs[k]}</span>)}
      </div>
    )
  }
  if (modele === 'boids' && especes > 1) {
    return (
      <div className="bo-legende">
        {ESPECES.slice(0, especes).map((s) => <span key={s}><i style={{ background: COULEURS_ESPECES[s] }} />{T.especeN(s + 1)}</span>)}
      </div>
    )
  }
  return null
}

export default function Atelier({ visible, T, ref }) {
  const toile2 = useRef(null)
  const toile3 = useRef(null)
  const rendu2 = useRef(null)
  const rendu3 = useRef(null)
  const sim = useRef(null)
  const dernier = useRef(null)          // dernière image reçue
  const libres = useRef([])             // tampons à renvoyer au Worker
  const attente = useRef(false)
  const historique = useRef([])
  const obstacles = useRef([])          // copie des obstacles du monde (pour le recréer)
  const cote = useRef(0)
  const trace = useRef(null)            // tracé en cours (outil obstacle ou gomme)
  const opts = useRef({ graine: 1, unPas: 0 })
  const compte = useRef({ t: horloge(), pas: 0 })

  const [scen, setScen] = useState(SCENARIOS[0].id)
  const [R, setR] = useState(() => complets(SCENARIOS[0].r))
  const [modifie, setModifie] = useState(false)
  const [vue, setVue] = useState('especes')
  const [traines, setTraines] = useState(false)
  const [pause, setPause] = useState(false)
  const [vitesse, setVitesse] = useState(SCENARIOS[0].vitesse ?? 2)
  const [outil, setOutil] = useState('faucon')
  const [taillePinceau, setTaillePinceau] = useState(1.2)
  const [courbes, setCourbes] = useState([])
  const [etat, setEtat] = useState({ t: 0, pasParS: 0, ms: 0, N: 0, captures: 0, local: false })
  const [replie, setReplie] = useState(false)
  const [erreur3D, setErreur3D] = useState(false)

  useEffect(() => {
    Object.assign(opts.current, { pause, vitesse, vue, traines, visible, especes: R.especes })
  }, [pause, vitesse, vue, traines, visible, R.especes])

  /* ---------- Monde ---------- */

  // (Re)crée le monde dans le simulateur ; sans toucher à l'état de React
  function creer(r, graine, decor) {
    opts.current.graine = graine
    const L = coteMonde(r)
    let liste = decor ?? obstacles.current
    // le monde change de taille : les obstacles suivent, à la même place relative
    if (!decor && cote.current && L && Math.abs(L - cote.current) > 1e-6) liste = liste.map((v, k) => (k % 3 === 2 ? v : (v * L) / cote.current))
    if (r.modele !== 'boids') liste = []
    obstacles.current = liste
    cote.current = L
    historique.current = []
    rendu2.current?.oublier()
    sim.current?.envoyer({ type: 'creer', reglages: r, graine, obstacles: liste })
  }
  function demarrer(r, graine = nouvelleGraine(), decor = null) {
    creer(r, graine, decor)
    setCourbes([])
  }

  /* ---------- Boucle : demander une image, dessiner la dernière ---------- */
  useEffect(() => {
    rendu2.current = creerRendu2D(toile2.current)
    let derniereMaj = 0
    const surImage = (img) => {
      attente.current = false
      const ancien = dernier.current
      if (ancien && ancien.etat.length === img.etat.length && libres.current.length < 2) libres.current.push(ancien.etat)
      dernier.current = img
      obstacles.current = Array.from(img.obstacles)
      if (img.mesure) {
        historique.current.push(img.mesure)
        if (historique.current.length > MAX_POINTS) historique.current = historique.current.filter((_, k) => k % 2 === 0)
      }
    }
    sim.current = creerSimulateur(surImage)
    creer(complets(SCENARIOS[0].r), nouvelleGraine(), null)

    let raf = 0
    let dette = 0
    const boucle = (t) => {
      raf = requestAnimationFrame(boucle)
      const o = opts.current
      if (!o.visible) return
      if (!attente.current) {
        if (!o.pause) dette = Math.min(dette + VITESSES[o.vitesse], 16)
        let pas = Math.floor(dette)
        dette -= pas
        pas += o.unPas
        o.unPas = 0
        const tampon = libres.current.pop()
        attente.current = true
        sim.current.envoyer({ type: 'image', pas, budget: BUDGET_MS, tampon }, tampon ? [tampon.buffer] : [])
      }
      const img = dernier.current
      if (img) {
        if (img.D === 3) {
          if (rendu3.current?.dessiner) {
            rendu3.current.redimensionner()
            rendu3.current.dessiner(img, o)
          }
        } else {
          rendu2.current.redimensionner()
          rendu2.current.dessiner(img, o)
        }
        if (t - derniereMaj > 250) {
          derniereMaj = t
          const c = compte.current
          const dt = (horloge() - c.t) / 1000
          setEtat({
            t: img.t, N: img.N, ms: img.ms, captures: img.mesure?.captures ?? 0,
            pasParS: dt > 0 && img.pas >= c.pas ? (img.pas - c.pas) / dt : 0,
            local: sim.current.local,
          })
          compte.current = { t: horloge(), pas: img.pas }
          setCourbes(historique.current.slice())
        }
      }
    }
    raf = requestAnimationFrame(boucle)
    return () => {
      cancelAnimationFrame(raf)
      sim.current?.fermer()
      rendu3.current?.liberer?.()
      rendu3.current = null
    }
    // la boucle lit tout par des références : elle ne démarre qu'une fois
  }, [])

  // La 3D : three.js n'est chargé que la première fois qu'on en a besoin
  useEffect(() => {
    if (R.dim !== 3 || rendu3.current) return
    rendu3.current = { chargement: true }
    import('./rendu3d')
      .then((mod) => mod.creerRendu3D(toile3.current))
      .then((r) => { rendu3.current = r })
      .catch(() => { rendu3.current = null; setErreur3D(true) })
  }, [R.dim])

  /* ---------- Actions ---------- */

  function choisirScenario(id) {
    const s = scenario(id)
    // un scénario garde la dimension choisie, sauf s'il en impose une (meneurs : en 3D)
    const r = { ...complets(s.r), dim: s.r.dim ?? R.dim }
    setScen(s.id)
    setR(r)
    setModifie(false)
    setVue(s.vue ?? 'especes')
    setVitesse(s.vitesse ?? 2)
    setPause(false)
    demarrer(r, nouvelleGraine(), s.obstacles ? DECORS[s.obstacles](coteMonde(r)) : [])
  }

  // Un réglage. Ceux « de départ » recréent le monde (même graine)
  function changer(cle, valeur) {
    const r = { ...R, [cle]: valeur }
    if (cle === 'modele') Object.assign(r, structuredClone(MODELE_PAR_DEFAUT[valeur]))
    setR(r)
    setModifie(true)
    if (REGLAGES_DE_DEPART.includes(cle) || (DEPART_PAR_MODELE[R.modele] ?? []).includes(cle)) {
      if (cle === 'modele') setVue(VUE_PAR_MODELE[valeur] ?? 'especes')
      demarrer(r, opts.current.graine)
    } else sim.current?.envoyer({ type: 'regler', reglages: { [cle]: valeur } })
  }
  const changerEspece = (cle, s, valeur) => {
    const t = R[cle].slice()
    t[s] = valeur
    changer(cle, t)
  }

  const recommencer = () => demarrer(R)
  const unPas = () => { opts.current.unPas += 1; setPause(true) }

  function decor(nom) {
    const liste = nom ? DECORS[nom](coteMonde(R)) : []
    obstacles.current = liste
    sim.current?.envoyer({ type: 'obstacles', liste })
    setModifie(true)
  }

  /* ---------- Outils (2D) : faucon à la souris, obstacles, gomme ---------- */

  function versMonde(e) {
    const c = toile2.current
    const r = c.getBoundingClientRect()
    return rendu2.current.versMonde(((e.clientX - r.left) / r.width) * c.width, ((e.clientY - r.top) / r.height) * c.height)
  }
  function agir(e) {
    const [x, y] = versMonde(e)
    if (outil === 'faucon') {
      sim.current?.envoyer({ type: 'souris', souris: { actif: true, x, y, z: 0 } })
      return
    }
    const d = trace.current
    // un obstacle tous les « diamètre » le long du tracé
    if (d && d.x !== undefined && Math.hypot(x - d.x, y - d.y) < taillePinceau * (outil === 'gomme' ? 0.5 : 1.6)) return
    trace.current = { x, y }
    sim.current?.envoyer({ type: 'obstacle', x, y, r: taillePinceau, efface: outil === 'gomme' })
    setModifie(true)
  }
  const outilsActifs = R.modele === 'boids' && R.dim === 2
  const appui = (e) => {
    if (!outilsActifs) return
    e.currentTarget.setPointerCapture?.(e.pointerId)
    trace.current = {}
    agir(e)
  }
  const glisse = (e) => { if (trace.current) agir(e) }
  const relache = () => {
    trace.current = null
    if (outil === 'faucon') sim.current?.envoyer({ type: 'souris', souris: { actif: false } })
  }

  useImperativeHandle(ref, () => ({
    // Depuis les onglets de lecture : ouvrir un scénario dans l'explorateur
    ouvrir(id) { choisirScenario(id) },
  }))

  /* ---------- Affichage ---------- */
  const fmt = (n, o) => n.toLocaleString(T.nombre, o)
  const pct = (x) => fmt(x, { style: 'percent', maximumFractionDigits: 0 })
  const f1 = (x) => fmt(x, { maximumFractionDigits: 1, minimumFractionDigits: 1 })
  const f2 = (x) => fmt(x, { maximumFractionDigits: 2, minimumFractionDigits: 2 })
  const deg = (x) => `${fmt(x, { maximumFractionDigits: 0 })}°`
  const id = (cle) => `bo-${cle}`
  const txtScen = T.scenarios[scen]
  const M = R.modele
  const vuesPossibles = M === 'boids' ? ['especes', 'cap', 'peur'] : ['especes', 'cap']
  const populations = POPULATIONS[M]
  const temps = M === 'couzin' ? T.etat.secondes(f1(etat.t)) : M === 'cucker' ? T.etat.temps(f1(etat.t)) : T.etat.pas(fmt(Math.round(etat.t)))

  return (
    <div className="atelier" hidden={!visible}>
      <div className="atelier-corps" data-replie={replie}>
        <div className="plan">
          <div className="plan-outils">
            <div className="groupe" role="group" aria-label={T.vue}>
              {vuesPossibles.map((v) => (
                <button key={v} aria-pressed={vue === v} onClick={() => setVue(v)} title={T.vuesAide[v]}>
                  {v === 'especes' && M === 'couzin' ? T.vues3.meneurs : T.vues3[v]}
                </button>
              ))}
            </div>
            <div className="plan-outils-droite">
              <div className="groupe" role="group" aria-label={T.dimension}>
                {[2, 3].map((d) => (
                  <button key={d} aria-pressed={R.dim === d} onClick={() => changer('dim', d)} title={T.dimensionAide[d]}>{d}D</button>
                ))}
              </div>
              {R.dim === 2 && <button className="btn" aria-pressed={traines} onClick={() => setTraines(!traines)} title={T.trainesAide}>{T.traines}</button>}
              {replie && <button className="btn" onClick={() => setReplie(false)}>‹ {T.reglages}</button>}
            </div>
          </div>

          <div className="cadre bo-cadre">
            <canvas
              ref={toile2}
              className="cadre-canvas bo-canvas"
              hidden={R.dim === 3}
              data-outil={outilsActifs ? outil : 'aucun'}
              onPointerDown={appui}
              onPointerMove={glisse}
              onPointerUp={relache}
              onPointerCancel={relache}
              aria-label={T.toile(txtScen?.titre ?? '', outilsActifs ? T.outils[outil] : null)}
            />
            <canvas ref={toile3} className="cadre-canvas bo-canvas bo-canvas3d" hidden={R.dim !== 3} aria-label={T.toile3d} />
            {R.dim === 3 && erreur3D && <p className="bo-message">{T.erreur3D}</p>}
            <Legende vue={vue} modele={M} especes={R.especes} T={T} />
          </div>

          <div className="transport">
            <div className="transport-boutons">
              <button className="btn-principal" onClick={() => setPause(!pause)}>
                {pause ? <IconeLecture /> : <IconePause />}
                {pause ? T.reprendre : T.pause}
              </button>
              <button className="btn" onClick={unPas}>{T.unPas}</button>
              <button className="btn" onClick={recommencer} title={T.recommencerAide}>{T.recommencer}</button>
            </div>
            <Crans valeur={vitesse} max={VITESSES.length - 1} onChange={setVitesse} libelle={T.vitesse} texte={T.pasParImage(VITESSES[vitesse], fmt)} />
          </div>

          <Courbes historique={courbes} modele={M} predateurs={R.predateurs} T={T} fmt={fmt} />
        </div>

        {!replie && (
          <aside className="inspecteur bo-inspecteur" aria-label={T.reglages}>
            <div className="insp-tete">
              <span>{T.reglages}</span>
              <button onClick={() => setReplie(true)} aria-label={T.replier} title={T.replier}>›</button>
            </div>

            {/* Scénarios */}
            <section className="bloc">
              <h3>{T.scenariosTitre}{modifie && <span>{T.modifie}</span>}</h3>
              <ul className="bo-scenarios">
                {SCENARIOS.map((s) => (
                  <li key={s.id}>
                    <button aria-pressed={scen === s.id} onClick={() => choisirScenario(s.id)}>
                      <span>{T.scenarios[s.id].titre}</span>
                      <em>{T.modelesCourts[s.r.modele ?? 'boids']}</em>
                    </button>
                  </li>
                ))}
              </ul>
              {txtScen && <p className="aide">{txtScen.aide}</p>}
              {modifie && <button className="btn" onClick={() => choisirScenario(scen)}>{T.retablir}</button>}
            </section>

            {/* Modèle et ses réglages */}
            <section className="bloc">
              <h3>{T.modele}</h3>
              <div className="ligne">
                <label htmlFor={id('modele')}>{T.modele}</label>
                <select id={id('modele')} value={M} onChange={(e) => changer('modele', e.target.value)}>
                  {MODELES.map((m) => <option key={m} value={m}>{T.modeles[m]}</option>)}
                </select>
              </div>
              <p className="aide">{T.modelesAide[M]}</p>

              {M === 'boids' && (
                <>
                  <Pli titre={T.plis.regles} ouvert>
                    <Curseur id={id('sep')} libelle={T.separation} valeur={R.separation[0]} min={0} max={5} pas={0.1} onChange={(x) => changer('separation', tous(x))} texte={f1(R.separation[0])} />
                    <Curseur id={id('ali')} libelle={T.alignement} valeur={R.alignement[0]} min={0} max={3} pas={0.05} onChange={(x) => changer('alignement', tous(x))} texte={f2(R.alignement[0])} />
                    <Curseur id={id('coh')} libelle={T.cohesion} valeur={R.cohesion[0]} min={0} max={3} pas={0.05} onChange={(x) => changer('cohesion', tous(x))} texte={f2(R.cohesion[0])} />
                    <p className="aide">{T.reglesAide}</p>
                    <Curseur id={id('dsep')} libelle={T.distSeparation} valeur={R.distSeparation} min={0.2} max={1} pas={0.05} onChange={(x) => changer('distSeparation', x)} texte={f2(R.distSeparation)} />
                    <Curseur id={id('bruit')} libelle={T.bruit} valeur={R.bruit} min={0} max={2} pas={0.05} onChange={(x) => changer('bruit', x)} texte={f2(R.bruit)} />
                    <p className="aide">{T.bruitAide}</p>
                  </Pli>

                  <Pli titre={T.plis.voisinage}>
                    <div className="groupe groupe--plein" role="group" aria-label={T.voisinage}>
                      {['metrique', 'topologique'].map((v) => (
                        <button key={v} aria-pressed={R.voisinage === v} onClick={() => changer('voisinage', v)}>{T.voisinages[v]}</button>
                      ))}
                    </div>
                    {R.voisinage === 'topologique'
                      ? <Curseur id={id('k')} libelle={T.k} valeur={R.k} min={1} max={20} pas={1} onChange={(x) => changer('k', x)} texte={fmt(R.k)} />
                      : <Curseur id={id('rayon')} libelle={T.rayon} valeur={R.rayon} min={0.5} max={2} pas={0.05} onChange={(x) => changer('rayon', x)} texte={f2(R.rayon)} />}
                    <p className="aide">{T.voisinagesAide[R.voisinage]}</p>
                    <Curseur id={id('vision')} libelle={T.vision} valeur={R.vision} min={60} max={360} pas={10} onChange={(x) => changer('vision', x)} texte={deg(R.vision)} />
                    <p className="aide">{T.visionAide}</p>
                  </Pli>

                  <Pli titre={T.plis.predateurs}>
                    <Curseur id={id('pred')} libelle={T.predateurs} valeur={R.predateurs} min={0} max={MAX_PREDATEURS} pas={1} onChange={(x) => changer('predateurs', x)} texte={fmt(R.predateurs)} />
                    <Curseur id={id('vpred')} libelle={T.vitessePredateur} valeur={R.vitessePredateur} min={0.8} max={2.5} pas={0.05} onChange={(x) => changer('vitessePredateur', x)} texte={`×${f2(R.vitessePredateur)}`} />
                    <Curseur id={id('peur')} libelle={T.peur} valeur={R.peur} min={1} max={6} pas={0.1} onChange={(x) => changer('peur', x)} texte={f1(R.peur)} />
                    <Curseur id={id('conf')} libelle={T.confusion} valeur={R.confusion} min={0} max={1} pas={0.05} onChange={(x) => changer('confusion', x)} texte={pct(R.confusion)} />
                    <p className="aide">{T.predateursAide}</p>
                  </Pli>

                  <Pli titre={T.plis.especes}>
                    <div className="ligne">
                      <label htmlFor={id('especes')}>{T.nbEspeces}</label>
                      <select id={id('especes')} value={R.especes} onChange={(e) => changer('especes', Number(e.target.value))}>
                        {[1, 2, 3].map((n) => <option key={n} value={n}>{n}</option>)}
                      </select>
                    </div>
                    {R.especes > 1 && (
                      <>
                        <div className="ligne">
                          <label htmlFor={id('relation')}>{T.relation}</label>
                          <select id={id('relation')} value={R.relation} onChange={(e) => changer('relation', e.target.value)}>
                            {RELATIONS.map((r) => <option key={r} value={r}>{T.relations[r]}</option>)}
                          </select>
                        </div>
                        <p className="aide">{T.relationsAide[R.relation]}</p>
                        {ESPECES.slice(0, R.especes).map((s) => (
                          <div key={s} className="bo-espece">
                            <p className="bo-sous-titre"><i className="bo-pastille" style={{ background: COULEURS_ESPECES[s] }} aria-hidden="true" />{T.especeN(s + 1)}</p>
                            <Curseur id={id(`part-${s}`)} libelle={T.part} valeur={R.parts[s]} min={0.2} max={3} pas={0.1} onChange={(x) => changerEspece('parts', s, x)} texte={f1(R.parts[s])} />
                            <Curseur id={id(`vit-${s}`)} libelle={T.vitesseEspece} valeur={R.vitesse[s]} min={0.5} max={1.6} pas={0.05} onChange={(x) => changerEspece('vitesse', s, x)} texte={`×${f2(R.vitesse[s])}`} />
                            <Curseur id={id(`coh-${s}`)} libelle={T.cohesion} valeur={R.cohesion[s]} min={0} max={3} pas={0.05} onChange={(x) => changerEspece('cohesion', s, x)} texte={f2(R.cohesion[s])} />
                            <Curseur id={id(`ali-${s}`)} libelle={T.alignement} valeur={R.alignement[s]} min={0} max={3} pas={0.05} onChange={(x) => changerEspece('alignement', s, x)} texte={f2(R.alignement[s])} />
                          </div>
                        ))}
                      </>
                    )}
                    <p className="aide">{T.especesAide}</p>
                  </Pli>

                  <Pli titre={T.plis.environnement}>
                    <Curseur id={id('vent')} libelle={T.vent} valeur={R.vent} min={0} max={1.2} pas={0.05} onChange={(x) => changer('vent', x)} texte={pct(R.vent)} />
                    {R.vent > 0 && (
                      <>
                        <Curseur id={id('capvent')} libelle={T.capVent} valeur={R.capVent} min={0} max={355} pas={5} onChange={(x) => changer('capVent', x)} texte={deg(R.capVent)} />
                        <Curseur id={id('rafales')} libelle={T.rafales} valeur={R.rafales} min={0} max={1} pas={0.05} onChange={(x) => changer('rafales', x)} texte={pct(R.rafales)} />
                      </>
                    )}
                    <p className="aide">{T.ventAide}</p>
                    <div className="ligne">
                      <label htmlFor={id('bords')}>{T.bords}</label>
                      <select id={id('bords')} value={R.bords === 'ouvert' ? 'tore' : R.bords} onChange={(e) => changer('bords', e.target.value)}>
                        {['tore', 'murs'].map((b) => <option key={b} value={b}>{T.bordsNoms[b]}</option>)}
                      </select>
                    </div>
                    <p className="aide">{T.bordsAide[R.bords === 'murs' ? 'murs' : 'tore']}</p>
                    <div className="bo-boutons">
                      <button className="btn" onClick={() => decor('foret')}>{T.decorForet}</button>
                      <button className="btn" onClick={() => decor(null)}>{T.decorVide}</button>
                    </div>
                  </Pli>
                </>
              )}

              {M === 'vicsek' && (
                <Pli titre={T.plis.vicsek} ouvert>
                  <Curseur id={id('eta')} libelle={T.eta} valeur={R.eta} min={0} max={6.28} pas={0.02} onChange={(x) => changer('eta', x)} texte={f2(R.eta)} />
                  <p className="aide">{T.etaAide}</p>
                  <Curseur id={id('v0')} libelle={T.v0} valeur={R.v0} min={0.01} max={1} pas={0.01} onChange={(x) => changer('v0', x)} texte={f2(R.v0)} />
                  <Curseur id={id('densite')} libelle={T.densite} valeur={R.densite} min={0.1} max={4} pas={0.1} onChange={(x) => changer('densite', x)} texte={f1(R.densite)} />
                  <p className="aide">{T.v0Aide}</p>
                  <label className="option">
                    <input type="checkbox" checked={R.vectoriel} onChange={() => changer('vectoriel', !R.vectoriel)} />
                    {T.vectoriel}
                  </label>
                  <p className="aide">{T.vectorielAide}</p>
                </Pli>
              )}

              {M === 'couzin' && (
                <>
                  <Pli titre={T.plis.zones} ouvert>
                    <Curseur id={id('zoo')} libelle={T.zoo} valeur={R.zoo} min={0} max={15} pas={0.25} onChange={(x) => changer('zoo', x)} texte={f2(R.zoo)} />
                    <Curseur id={id('zoa')} libelle={T.zoa} valeur={R.zoa} min={0} max={15} pas={0.25} onChange={(x) => changer('zoa', x)} texte={f2(R.zoa)} />
                    <p className="aide">{T.zonesAide}</p>
                    <Curseur id={id('alpha')} libelle={T.vision} valeur={R.vision} min={180} max={360} pas={10} onChange={(x) => changer('vision', x)} texte={deg(R.vision)} />
                    <Curseur id={id('virage')} libelle={T.virage} valeur={R.virage} min={10} max={120} pas={5} onChange={(x) => changer('virage', x)} texte={T.degParS(fmt(R.virage))} />
                    <Curseur id={id('sigma')} libelle={T.sigma} valeur={R.sigma} min={0} max={0.4} pas={0.01} onChange={(x) => changer('sigma', x)} texte={f2(R.sigma)} />
                  </Pli>
                  <Pli titre={T.plis.meneurs} ouvert={R.informes > 0}>
                    <Curseur id={id('inf')} libelle={T.informes} valeur={R.informes} min={0} max={0.5} pas={0.01} onChange={(x) => changer('informes', x)} texte={pct(R.informes)} couleur={COULEURS_MENEURS[1]} />
                    <Curseur id={id('inf2')} libelle={T.informes2} valeur={R.informes2} min={0} max={0.5} pas={0.01} onChange={(x) => changer('informes2', x)} texte={pct(R.informes2)} couleur={COULEURS_MENEURS[2]} />
                    {R.informes2 > 0 && <Curseur id={id('ecart')} libelle={T.ecart} valeur={R.ecart} min={0} max={180} pas={5} onChange={(x) => changer('ecart', x)} texte={deg(R.ecart)} />}
                    <Curseur id={id('poids')} libelle={T.poids} valeur={R.poids} min={0} max={2} pas={0.05} onChange={(x) => changer('poids', x)} texte={f2(R.poids)} />
                    <p className="aide">{T.meneursAide}</p>
                  </Pli>
                </>
              )}

              {M === 'cucker' && (
                <Pli titre={T.plis.cucker} ouvert>
                  <Curseur id={id('beta')} libelle={T.beta} valeur={R.beta} min={0} max={2} pas={0.05} onChange={(x) => changer('beta', x)} texte={f2(R.beta)} />
                  <Curseur id={id('K')} libelle={T.K} valeur={R.K} min={0.1} max={5} pas={0.1} onChange={(x) => changer('K', x)} texte={f1(R.K)} />
                  <p className="aide">{T.cuckerAide}</p>
                </Pli>
              )}
            </section>

            {/* Outils */}
            {outilsActifs && (
              <section className="bloc">
                <h3>{T.outilsTitre}</h3>
                <div className="bo-outils" role="group" aria-label={T.outilsTitre}>
                  {['faucon', 'obstacle', 'gomme'].map((o) => <button key={o} aria-pressed={outil === o} onClick={() => setOutil(o)}>{T.outils[o]}</button>)}
                </div>
                {outil !== 'faucon' && <Curseur id={id('pinceau')} libelle={T.taillePinceau} valeur={taillePinceau} min={0.4} max={4} pas={0.1} onChange={setTaillePinceau} texte={f1(taillePinceau)} />}
                <p className="aide">{T.outilsAide[outil]}</p>
              </section>
            )}

            {/* Monde */}
            <section className="bloc">
              <h3>{T.monde}</h3>
              <div className="ligne">
                <label htmlFor={id('n')}>{T.population}</label>
                <select id={id('n')} value={populations.includes(R.n) ? R.n : ''} onChange={(e) => changer('n', Number(e.target.value))}>
                  {!populations.includes(R.n) && <option value="">{fmt(R.n)}</option>}
                  {populations.map((n) => <option key={n} value={n}>{fmt(n)}</option>)}
                </select>
              </div>
              {M === 'boids' && (R.dim === 3
                ? <Curseur id={id('dens3')} libelle={T.densite3} valeur={R.densite3} min={0.02} max={0.5} pas={0.01} onChange={(x) => changer('densite3', x)} texte={f2(R.densite3)} />
                : <Curseur id={id('dens')} libelle={T.densite} valeur={R.densite} min={0.1} max={2} pas={0.05} onChange={(x) => changer('densite', x)} texte={f2(R.densite)} />)}
              <p className="aide">{M === 'cucker' ? T.populationCucker(MAX_CUCKER) : T.populationAide}</p>
            </section>
          </aside>
        )}
      </div>

      <BarreEtat
        statut={pause ? T.statut.pause : T.statut.enCours}
        actif={!pause}
        elements={[
          txtScen?.titre,
          modifie && T.modifie,
          T.modeles[M],
          T.etat.oiseaux(fmt(etat.N)),
          temps,
          M === 'boids' && R.predateurs > 0 && T.etat.captures(fmt(etat.captures)),
        ]}
        fin={T.etat.vitesse(fmt(etat.pasParS, { maximumFractionDigits: 0 }), fmt(etat.ms, { maximumFractionDigits: 1, minimumFractionDigits: 1 }), etat.local)}
      />
    </div>
  )
}

// Quand on change de modèle : des réglages de départ qui lui conviennent
// Cucker-Smale : une fois le groupe d'accord, β et K ne changent plus rien ; on relance
// donc le vol depuis le même départ pour que leur effet se voie
const DEPART_PAR_MODELE = { cucker: ['beta', 'K'] }
// Cucker-Smale : la vue Cap montre l'accord des vitesses (une seule couleur)
const VUE_PAR_MODELE = { cucker: 'cap' }

const MODELE_PAR_DEFAUT = {
  boids: { n: 1500, densite: 0.5, bords: 'tore' },
  vicsek: { n: 2000, densite: 4, eta: 2, v0: 0.03, vectoriel: false },
  couzin: { n: 100, zoo: 2, zoa: 12, informes: 0, informes2: 0 },
  cucker: { n: 300, beta: 0.3, K: 1 },
}
