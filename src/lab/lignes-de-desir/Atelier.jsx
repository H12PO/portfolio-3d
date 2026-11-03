import { useEffect, useImperativeHandle, useRef, useState } from 'react'
import BarreEtat from '../BarreEtat'
import Crans, { IconeLecture, IconePause } from '../commun/Crans'
import { DEFAUTS, MODELES, REGLAGES_DE_DEPART, SOL, MAX_FOURMIS } from './moteur'
import { creerRendu2D, COULEURS_TYPES } from './rendu2d'
import { creerSimulateur } from './simulateur'
import { SCENARIOS, TERRAINS, scenario } from './scenarios'
import Courbes from './Courbes'

// ============================================================
//  LIGNES DE DÉSIR : l'explorateur
//  Le calcul tourne dans un Web Worker (simulateur.js) : la page lui
//  demande une image à chaque rafraîchissement de l'écran et dessine
//  la dernière reçue, en 2D (Canvas) ou en 3D (three.js, chargé à la
//  demande). On peut retoucher le terrain au pinceau : allées, herbe,
//  bâtiments, clôtures, arbres, portes.
// ============================================================

const VITESSES = [1, 2, 4, 8, 16, 32, 64]   // pas du modèle par image
const BUDGET_MS = 35
const MAX_POINTS = 240
const OUTILS = ['regarder', 'porte', 'pave', 'herbe', 'bati', 'cloture', 'arbre']
const OUTILS_FOURMIS = ['regarder', 'nourriture', 'bati', 'herbe']
const SOL_OUTIL = { pave: SOL.PAVE, herbe: SOL.HERBE, bati: SOL.BATI, cloture: SOL.CLOTURE, arbre: SOL.ARBRE }
const PINCEAU = { pave: 1.25, herbe: 1.5, bati: 2, cloture: 0.3, arbre: 1.2 }   // rayon par défaut (m)
const POPULATIONS_FOURMIS = [200, 500, 1000, 2000]

const horloge = () => performance.now()
const nouvelleGraine = () => 1 + Math.floor(Math.random() * 999999)
const complets = (r) => ({ ...structuredClone(DEFAUTS), ...structuredClone(r ?? {}) })

function Curseur({ id, libelle, valeur, min, max, pas, onChange, texte, couleur }) {
  return (
    <div className="ld-reglage">
      <div className="ld-reglage-tete">
        <label htmlFor={id}>
          {couleur && <i className="ld-pastille" style={{ background: couleur }} aria-hidden="true" />}
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
    <details className="ld-pli" open={ouvert}>
      <summary>{titre}</summary>
      <div className="ld-pli-corps">{children}</div>
    </details>
  )
}

function Legende({ modele, vue, fond, T }) {
  if (modele === 'fourmis') {
    return (
      <div className="ld-legende">
        <span><i style={{ background: '#5f9bff' }} />{T.legende.versNid}</span>
        <span><i style={{ background: '#ffa040' }} />{T.legende.versNourriture}</span>
        <span><i style={{ background: '#ffd27a' }} />{T.legende.chargee}</span>
      </div>
    )
  }
  if (vue === 'types') {
    return (
      <div className="ld-legende">
        {COULEURS_TYPES.map((c, k) => <span key={c}><i style={{ background: c }} />{T.typesNoms[k]}</span>)}
      </div>
    )
  }
  return (
    <div className="ld-legende">
      <span>{fond === 'sol' ? T.legende.solNeuf : T.legende.herbe}</span>
      <span className="ld-rampe" data-fond={fond} />
      <span>{fond === 'sol' ? T.legende.solUse : T.legende.terre}</span>
    </div>
  )
}

export default function Atelier({ visible, T, ref }) {
  const toile2 = useRef(null)
  const toile3 = useRef(null)
  const rendu2 = useRef(null)
  const rendu3 = useRef(null)
  const sim = useRef(null)
  const dernier = useRef(null)          // dernière image reçue
  const libres = useRef(null)           // tampons à renvoyer au Worker
  const attente = useRef(false)
  const historique = useRef([])
  const solConnu = useRef({ version: -1, sol: null, arbres: [] })
  const trace = useRef(null)            // tracé en cours (pinceau)
  const opts = useRef({ graine: 1, unPas: 0 })
  const compte = useRef({ t: horloge(), pas: 0 })

  const [scen, setScen] = useState(SCENARIOS[0].id)
  const [R, setR] = useState(() => complets(SCENARIOS[0].r))
  const [modifie, setModifie] = useState(false)
  const [vue, setVue] = useState('sol')
  const [dim, setDim] = useState(2)
  const [noms, setNoms] = useState(true)
  const [pause, setPause] = useState(false)
  const [vitesse, setVitesse] = useState(SCENARIOS[0].vitesse ?? 4)
  const [outil, setOutil] = useState('regarder')
  const [pinceau, setPinceau] = useState(1.5)
  const [courbes, setCourbes] = useState([])
  const [etat, setEtat] = useState({ jour: 0, periode: -1, na: 0, passages: 0, livrees: 0, ms: 0, pasParS: 0, local: false, calcul: false, fond: 'herbe', zones: false, portes: [] })
  const [replie, setReplie] = useState(false)
  const [erreur3D, setErreur3D] = useState(false)

  useEffect(() => {
    Object.assign(opts.current, { pause, vitesse, vue, visible, dim, noms })
  }, [pause, vitesse, vue, visible, dim, noms])

  // les compteurs ne sont mesurés que quatre fois par seconde : on garde les derniers connus
  const etatPrecedent = useRef(etat)
  useEffect(() => { etatPrecedent.current = etat }, [etat])

  /* ---------- Monde ---------- */

  // (Re)crée le monde : avec un terrain neuf, ou (terrain null) sur le terrain actuel, retouches comprises
  function creer(r, graine, terrain) {
    opts.current.graine = graine
    historique.current = []
    solConnu.current.version = -1
    sim.current?.envoyer({ type: 'creer', terrain, reglages: r, graine })
  }
  function demarrer(r, graine = nouvelleGraine(), terrain = null) {
    creer(r, graine, terrain)
    setCourbes([])
  }

  /* ---------- Boucle : demander une image, dessiner la dernière ---------- */
  useEffect(() => {
    rendu2.current = creerRendu2D(toile2.current)
    let derniereMaj = 0
    const surImage = (img) => {
      attente.current = false
      const ancien = dernier.current
      if (ancien) libres.current = { champ: ancien.champ, champ2: ancien.champ2, agents: ancien.agents }
      if (img.sol) solConnu.current = { version: img.version, sol: img.sol, arbres: img.arbres ?? [] }
      dernier.current = img
      if (img.mesure) {
        historique.current.push(img.mesure)
        if (historique.current.length > MAX_POINTS) historique.current = historique.current.filter((_, k) => k % 2 === 0)
      }
    }
    sim.current = creerSimulateur(surImage)
    const s0 = SCENARIOS[0]
    creer(complets(s0.r), nouvelleGraine(), TERRAINS[s0.terrain]())

    let raf = 0
    let dette = 0
    const boucle = (t) => {
      raf = requestAnimationFrame(boucle)
      const o = opts.current
      if (!o.visible) return
      if (!attente.current) {
        if (!o.pause) dette = Math.min(dette + VITESSES[o.vitesse], 128)
        let pas = Math.floor(dette)
        dette -= pas
        pas += o.unPas
        o.unPas = 0
        const tampons = libres.current ?? {}
        libres.current = null
        attente.current = true
        const transferts = [tampons.champ?.buffer, tampons.champ2?.buffer, tampons.agents?.buffer].filter(Boolean)
        sim.current.envoyer({ type: 'image', pas, budget: BUDGET_MS, tampons, version: solConnu.current.version }, transferts)
      }
      const img0 = dernier.current
      if (img0 && solConnu.current.sol) {
        // le sol n'est joint que lorsqu'il change : on garde le dernier reçu
        const img = img0.sol ? img0 : { ...img0, sol: solConnu.current.sol, arbres: solConnu.current.arbres }
        if (o.dim === 3) {
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
            jour: img.jour, periode: img.periode, na: img.na, ms: img.ms,
            passages: img.mesure?.passages ?? etatPrecedent.current.passages,
            livrees: img.mesure?.livrees ?? etatPrecedent.current.livrees,
            pasParS: dt > 0 && img.pas >= c.pas ? (img.pas - c.pas) / dt : 0,
            local: sim.current.local, calcul: img.calcul, fond: img.fond, zones: (img.zones?.length ?? 0) > 0,
            portes: img.portes,
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
    if (dim !== 3 || rendu3.current) return
    rendu3.current = { chargement: true }
    import('./rendu3d')
      .then((mod) => mod.creerRendu3D(toile3.current))
      .then((r) => { rendu3.current = r })
      .catch(() => { rendu3.current = null; setErreur3D(true) })
  }, [dim])

  /* ---------- Actions ---------- */

  function choisirScenario(id) {
    const s = scenario(id)
    const r = complets(s.r)
    setScen(s.id)
    setR(r)
    setModifie(false)
    setVue(s.vue ?? 'sol')
    setVitesse(s.vitesse ?? 4)
    setPause(false)
    setOutil('regarder')
    demarrer(r, nouvelleGraine(), TERRAINS[s.terrain]())
  }

  // Un réglage. Ceux « de départ » recréent le monde (même graine, même terrain)
  function changer(cle, valeur) {
    const r = { ...R, [cle]: valeur }
    setR(r)
    setModifie(true)
    if (cle === 'modele') {
      // les fourmis vivent sur leurs propres terrains ; les marcheurs, sur les leurs
      const versFourmis = valeur === 'fourmis', depuisFourmis = R.modele === 'fourmis'
      if (versFourmis !== depuisFourmis) {
        const s = scenario(versFourmis ? 'fourragement' : 'square')
        const r2 = { ...complets(s.r), modele: valeur }
        setR(r2)
        setScen(s.id)
        setVue('sol')
        setOutil('regarder')
        demarrer(r2, opts.current.graine, TERRAINS[s.terrain]())
        return
      }
    }
    if (REGLAGES_DE_DEPART.includes(cle)) demarrer(r, opts.current.graine)
    else sim.current?.envoyer({ type: 'regler', reglages: { [cle]: valeur } })
  }
  const changerPart = (k, valeur) => {
    const parts = R.parts.slice()
    parts[k] = valeur
    changer('parts', parts)
  }
  function changerPoids(k, poids) {
    sim.current?.envoyer({ type: 'poids', k, poids })
    setModifie(true)
  }

  const recommencer = () => demarrer(R)
  const unPas = () => { opts.current.unPas += 1; setPause(true) }
  const paver = () => { sim.current?.envoyer({ type: 'paver' }); setModifie(true) }
  const effacer = () => { sim.current?.envoyer({ type: 'effacer' }); setModifie(true) }
  function terrainVierge() {
    const s = scenario(R.modele === 'fourmis' ? 'fourragement' : 'libre')
    setScen(s.id)
    setModifie(true)
    demarrer(R, opts.current.graine, TERRAINS[s.terrain]())
  }
  function choisirOutil(o) {
    setOutil(o)
    if (PINCEAU[o]) setPinceau(PINCEAU[o])
  }

  /* ---------- Pinceau (2D) ---------- */

  function versMonde(e) {
    const c = toile2.current
    const r = c.getBoundingClientRect()
    return rendu2.current.versMonde(((e.clientX - r.left) / r.width) * c.width, ((e.clientY - r.top) / r.height) * c.height)
  }
  function agir(e, debut) {
    const [x, y] = versMonde(e)
    if (outil === 'porte' || outil === 'nourriture') {
      if (debut) sim.current?.envoyer({ type: 'porte', x, y, genre: outil })
      setModifie(true)
      return
    }
    if (outil === 'arbre') {
      if (debut) sim.current?.envoyer({ type: 'peindre', sol: SOL.ARBRE, x, y, rayon: pinceau })
      setModifie(true)
      return
    }
    const d = trace.current
    if (!debut && d && Math.hypot(x - d.x, y - d.y) < Math.max(0.3, pinceau * 0.5)) return
    sim.current?.envoyer({ type: 'peindre', sol: SOL_OUTIL[outil], x, y, rayon: pinceau, x0: d?.x, y0: d?.y })
    trace.current = { x, y }
    setModifie(true)
  }
  const outilsActifs = dim === 2 && outil !== 'regarder'
  const appui = (e) => {
    if (!outilsActifs) return
    e.currentTarget.setPointerCapture?.(e.pointerId)
    trace.current = null
    agir(e, true)
  }
  const glisse = (e) => { if (outilsActifs && trace.current) agir(e, false) }
  const relache = () => { trace.current = null }

  useImperativeHandle(ref, () => ({
    // Depuis les onglets de lecture : ouvrir un scénario dans l'explorateur
    ouvrir(id) { choisirScenario(id) },
  }))

  /* ---------- Affichage ---------- */
  const fmt = (n, o) => n.toLocaleString(T.nombre, o)
  const pct = (x) => fmt(x, { style: 'percent', maximumFractionDigits: 0 })
  const f1 = (x) => fmt(x, { maximumFractionDigits: 1, minimumFractionDigits: 1 })
  const f2 = (x) => fmt(x, { maximumFractionDigits: 2, minimumFractionDigits: 2 })
  const f3 = (x) => fmt(x, { maximumFractionDigits: 3, minimumFractionDigits: 3 })
  const id = (cle) => `ld-${cle}`
  const txtScen = T.scenarios[scen]
  const M = R.modele
  const fourmis = M === 'fourmis'
  const outils = fourmis ? OUTILS_FOURMIS : OUTILS
  const jour = T.etat.jour(fmt(Math.floor(etat.jour) + 1), R.pointe && !fourmis ? T.periodes[etat.periode] : null)

  return (
    <div className="atelier" hidden={!visible}>
      <div className="atelier-corps" data-replie={replie}>
        <div className="plan">
          <div className="plan-outils">
            <div className="groupe" role="group" aria-label={T.vue}>
              {!fourmis && ['sol', 'types'].map((v) => (
                <button key={v} aria-pressed={vue === v} onClick={() => setVue(v)} title={T.vuesAide[v]}>{T.vues3[v]}</button>
              ))}
              {fourmis && <button aria-pressed="true">{T.vues3.pheromones}</button>}
            </div>
            <div className="plan-outils-droite">
              <div className="groupe" role="group" aria-label={T.dimension}>
                {[2, 3].map((d) => (
                  <button key={d} aria-pressed={dim === d} onClick={() => setDim(d)} title={T.dimensionAide[d]}>{d}D</button>
                ))}
              </div>
              {dim === 2 && <button className="btn" aria-pressed={noms} onClick={() => setNoms(!noms)} title={T.nomsAide}>{T.noms}</button>}
              {replie && <button className="btn" onClick={() => setReplie(false)}>‹ {T.reglages}</button>}
            </div>
          </div>

          <div className="cadre ld-cadre">
            <canvas
              ref={toile2}
              className="cadre-canvas ld-canvas"
              hidden={dim === 3}
              data-outil={outilsActifs ? outil : 'aucun'}
              onPointerDown={appui}
              onPointerMove={glisse}
              onPointerUp={relache}
              onPointerCancel={relache}
              aria-label={T.toile(txtScen?.titre ?? '', outilsActifs ? T.outils[outil] : null)}
            />
            <canvas ref={toile3} className="cadre-canvas ld-canvas ld-canvas3d" hidden={dim !== 3} aria-label={T.toile3d} />
            {dim === 3 && erreur3D && <p className="ld-message">{T.erreur3D}</p>}
            {etat.calcul && <p className="ld-calcul">{T.calculDistances}</p>}
            <Legende modele={M} vue={vue} fond={etat.fond} T={T} />
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

          <Courbes historique={courbes} modele={M} zones={etat.zones} T={T} fmt={fmt} />
        </div>

        {!replie && (
          <aside className="inspecteur ld-inspecteur" aria-label={T.reglages}>
            <div className="insp-tete">
              <span>{T.reglages}</span>
              <button onClick={() => setReplie(true)} aria-label={T.replier} title={T.replier}>›</button>
            </div>

            {/* Scénarios */}
            <section className="bloc">
              <h3>{T.scenariosTitre}{modifie && <span>{T.modifie}</span>}</h3>
              <ul className="ld-scenarios">
                {SCENARIOS.map((s) => (
                  <li key={s.id}>
                    <button aria-pressed={scen === s.id} onClick={() => choisirScenario(s.id)}>
                      <span>{T.scenarios[s.id].titre}</span>
                      <em>{T.modelesCourts[s.r.modele ?? 'helbing']}</em>
                    </button>
                  </li>
                ))}
              </ul>
              {txtScen && <p className="aide">{txtScen.aide}</p>}
              {modifie && <button className="btn" onClick={() => choisirScenario(scen)}>{T.retablir}</button>}
            </section>

            {/* Modèle et réglages */}
            <section className="bloc">
              <h3>{T.modele}</h3>
              <div className="ligne">
                <label htmlFor={id('modele')}>{T.modele}</label>
                <select id={id('modele')} value={M} onChange={(e) => changer('modele', e.target.value)}>
                  {MODELES.map((m) => <option key={m} value={m}>{T.modeles[m]}</option>)}
                </select>
              </div>
              <p className="aide">{T.modelesAide[M]}</p>

              {!fourmis && (
                <>
                  <Pli titre={T.plis.marche} ouvert>
                    {M === 'helbing' ? (
                      <>
                        <Curseur id={id('attrait')} libelle={T.attrait} valeur={R.attrait} min={0} max={8} pas={0.1} onChange={(x) => changer('attrait', x)} texte={f1(R.attrait)} />
                        <Curseur id={id('sigma')} libelle={T.sigma} valeur={R.sigma} min={1} max={8} pas={0.5} onChange={(x) => changer('sigma', x)} texte={T.metres(f1(R.sigma))} />
                        <p className="aide">{T.attraitAide}</p>
                      </>
                    ) : (
                      <>
                        <Curseur id={id('effort')} libelle={T.effort} valeur={R.effort} min={0} max={0.8} pas={0.05} onChange={(x) => changer('effort', x)} texte={pct(R.effort)} />
                        <p className="aide">{T.effortAide}</p>
                      </>
                    )}
                    <Curseur id={id('bruit')} libelle={T.bruit} valeur={R.bruit} min={0} max={0.5} pas={0.01} onChange={(x) => changer('bruit', x)} texte={f2(R.bruit)} />
                  </Pli>

                  <Pli titre={T.plis.herbe} ouvert>
                    <Curseur id={id('usure')} libelle={T.usure} valeur={R.usure} min={0.005} max={0.2} pas={0.005} onChange={(x) => changer('usure', x)} texte={f3(R.usure)} />
                    <Curseur id={id('repousse')} libelle={T.repousse} valeur={R.repousse} min={0.25} max={20} pas={0.25} onChange={(x) => changer('repousse', x)} texte={T.jours(f2(R.repousse))} />
                    <p className="aide">{T.herbeAide}</p>
                  </Pli>

                  <Pli titre={T.plis.flux}>
                    <Curseur id={id('debit')} libelle={T.debit} valeur={R.debit} min={50} max={2500} pas={50} onChange={(x) => changer('debit', x)} texte={T.parJour(fmt(R.debit))} />
                    <label className="option">
                      <input type="checkbox" checked={R.pointe} onChange={() => changer('pointe', !R.pointe)} />
                      {T.pointe}
                    </label>
                    <p className="aide">{T.pointeAide}</p>
                    {!R.pointe && etat.portes.length > 0 && (
                      <div className="ld-portes">
                        <p className="ld-sous-titre">{T.poidsPortes}</p>
                        {etat.portes.map((po, k) => (
                          <Curseur key={`${k}-${po.nom}`} id={id(`porte-${k}`)} libelle={po.nom || T.porteN(k + 1)} valeur={po.poids} min={0} max={5} pas={0.1} onChange={(x) => changerPoids(k, x)} texte={f1(po.poids)} />
                        ))}
                      </div>
                    )}
                  </Pli>

                  <Pli titre={T.plis.types}>
                    {T.typesNoms.map((nom, k) => (
                      <Curseur key={nom} id={id(`type-${k}`)} libelle={nom} valeur={R.parts[k]} min={0} max={1} pas={0.05} onChange={(x) => changerPart(k, x)} texte={f2(R.parts[k])} couleur={COULEURS_TYPES[k]} />
                    ))}
                    <p className="aide">{T.typesAide}</p>
                  </Pli>
                </>
              )}

              {fourmis && (
                <Pli titre={T.plis.fourmis} ouvert>
                  <div className="ligne">
                    <label htmlFor={id('n')}>{T.nbFourmis}</label>
                    <select id={id('n')} value={POPULATIONS_FOURMIS.includes(R.fourmis) ? R.fourmis : ''} onChange={(e) => changer('fourmis', Math.min(MAX_FOURMIS, Number(e.target.value)))}>
                      {!POPULATIONS_FOURMIS.includes(R.fourmis) && <option value="">{fmt(R.fourmis)}</option>}
                      {POPULATIONS_FOURMIS.map((n) => <option key={n} value={n}>{fmt(n)}</option>)}
                    </select>
                  </div>
                  <Curseur id={id('evap')} libelle={T.evaporation} valeur={R.evaporation} min={0} max={0.02} pas={0.0005} onChange={(x) => changer('evaporation', x)} texte={f3(R.evaporation)} />
                  <Curseur id={id('oubli')} libelle={T.oubli} valeur={R.oubli} min={0} max={0.02} pas={0.0005} onChange={(x) => changer('oubli', x)} texte={f3(R.oubli)} />
                  <Curseur id={id('diff')} libelle={T.diffusion} valeur={R.diffusion} min={0} max={0.5} pas={0.01} onChange={(x) => changer('diffusion', x)} texte={f2(R.diffusion)} />
                  <Curseur id={id('angle')} libelle={T.angleCapteur} valeur={R.angleCapteur} min={10} max={80} pas={5} onChange={(x) => changer('angleCapteur', x)} texte={`${fmt(R.angleCapteur)}°`} />
                  <p className="aide">{T.fourmisAide}</p>
                </Pli>
              )}
            </section>

            {/* Terrain */}
            <section className="bloc">
              <h3>{T.terrain}</h3>
              <div className="ld-outils" role="group" aria-label={T.outilsTitre}>
                {outils.map((o) => <button key={o} aria-pressed={outil === o} onClick={() => choisirOutil(o)} disabled={dim === 3 && o !== 'regarder'}>{T.outils[o]}</button>)}
              </div>
              {['pave', 'herbe', 'bati', 'cloture', 'arbre'].includes(outil) && (
                <Curseur id={id('pinceau')} libelle={T.pinceau} valeur={pinceau} min={0.25} max={5} pas={0.25} onChange={setPinceau} texte={T.metres(f2(pinceau))} />
              )}
              <p className="aide">{dim === 3 ? T.outils3d : T.outilsAide[outil]}</p>
              <div className="ld-boutons">
                {!fourmis && <button className="btn" onClick={paver} title={T.paverAide}>{T.paver}</button>}
                <button className="btn" onClick={effacer} title={T.effacerAide}>{fourmis ? T.effacerPheromones : T.effacer}</button>
                <button className="btn" onClick={terrainVierge}>{T.vierge}</button>
              </div>
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
          jour,
          fourmis ? T.etat.fourmis(fmt(etat.na)) : T.etat.marcheurs(fmt(etat.na)),
          fourmis ? T.etat.livrees(fmt(etat.livrees)) : T.etat.passages(fmt(etat.passages)),
        ]}
        fin={T.etat.vitesse(fmt(etat.pasParS, { maximumFractionDigits: 0 }), fmt(etat.ms, { maximumFractionDigits: 2, minimumFractionDigits: 2 }), etat.local)}
      />
    </div>
  )
}
