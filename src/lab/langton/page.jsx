import { useEffect, useMemo, useRef, useState } from 'react'
import '@fontsource-variable/stix-two-text'
import BarreProjet from '../BarreProjet'
import { useTexte } from '../../site/textes'
import { TEXTES } from './textes'
import {
  creerMonde, avancer, regleLettres, regleTurmite, lettresValides, changerRegle,
  reinitialiser, toutEffacer, ajouterFourmi, poserMur, gommer,
} from './moteur'
import { creerRendu, palette, couleurCss } from './rendu'
import { PRESETS_LETTRES, PRESETS_TURMITES } from './presets'
import './langton.css'

const TAILLE = 512 // feuille de 512 × 512 cases
const VITESSES = ['auto', 1, 2, 5, 10, 25, 50, 100, 250, 500, 1000, 2500, 5000]
const rampe = (pas) => Math.min(2000, 1 + Math.floor(pas / 100)) // lent au début, puis accélère
const OUTILS = ['main', 'fourmi', 'mur', 'gomme']
const LETTRE_VIRAGE = ['N', 'R', 'U', 'L']
const RL = { type: 'lettres', id: 'RL', lettres: 'RL' }

// Arrêts de la visite guidée (règle RL, une fourmi)
const ETAPES = [
  { pas: 0 },
  { pas: 250 },
  { pas: 3000 },
  { autoroute: true },
  { fin: true },
]
const atteinte = (e, m) =>
  e.pas != null ? m.pas >= e.pas
    : e.autoroute ? m.autoroute !== null
      : m.fourmis.length === 0 || (m.autoroute !== null && m.pas >= m.autoroute + 6000)

const construireRegle = (r) => (r.type === 'lettres' ? regleLettres(r.lettres) : regleTurmite(r.code))

// Une case de la feuille, en légende
const Case = ({ rvb }) => <span className="fourmi-case" style={{ background: couleurCss(rvb) }} />

export default function PageLangton({ meta }) {
  const { lang } = useTexte()
  const T = TEXTES[lang] ?? TEXTES.fr

  const canvasRef = useRef(null)
  const sim = useRef(null)                          // { monde, rendu, echelle }
  const opts = useRef({ pause: true, vitesse: 'auto', effets: {}, auto: true, visite: null, marquer: false })

  const [pause, setPause] = useState(true)          // on attend « Lancer »
  const [vitesse, setVitesse] = useState(0)         // indice dans VITESSES
  const [effets, setEffets] = useState({ surligneur: true, quadrillage: true, passages: false })
  const [auto, setAuto] = useState(true)
  const [outil, setOutil] = useState('main')
  const [onglet, setOnglet] = useState('reglages')
  const [type, setType] = useState('lettres')
  const [regle, setRegle] = useState(RL)
  const [saisie, setSaisie] = useState('RL')
  const [erreurSaisie, setErreurSaisie] = useState(false)
  const [bords, setBords] = useState('arret')
  const [stats, setStats] = useState({ pas: 0, fourmis: 1, autoroute: null })
  const [visite, setVisite] = useState(false)       // visite guidée en cours
  const [etape, setEtape] = useState(null)          // note de visite affichée

  // L'état React pilote la boucle d'animation à travers opts
  useEffect(() => {
    Object.assign(opts.current, { pause, vitesse: VITESSES[vitesse], effets, auto, marquer: etape === 3 })
  }, [pause, vitesse, effets, auto, etape])

  /* ---------- Boucle d'animation ---------- */
  useEffect(() => {
    const canvas = canvasRef.current
    const echelle = Math.min(window.devicePixelRatio || 1, 2)
    const dimensionner = () => {
      canvas.width = Math.max(1, Math.round(canvas.clientWidth * echelle))
      canvas.height = Math.max(1, Math.round(canvas.clientHeight * echelle))
    }
    dimensionner()

    const monde = creerMonde({ W: TAILLE, H: TAILLE, regle: regleLettres('RL') })
    const rendu = creerRendu(canvas, monde)
    sim.current = { monde, rendu, echelle }

    let raf = 0
    let derniereMaj = 0
    const boucle = (t) => {
      const o = opts.current
      let lot = 0
      if (!o.pause) {
        lot = o.vitesse === 'auto' ? rampe(monde.pas) : o.vitesse
        const prochaine = o.visite && ETAPES[o.visite.prochaine]
        if (prochaine?.pas != null) lot = Math.min(lot, Math.max(0, prochaine.pas - monde.pas))
        avancer(monde, lot)
        // Plus aucune fourmi sur la feuille : on s'arrête
        if (monde.fourmis.length === 0 && !prochaine) {
          o.pause = true
          setPause(true)
        }
        if (prochaine && atteinte(prochaine, monde)) {
          o.pause = true
          setPause(true)
          setEtape(o.visite.prochaine)
          o.visite.prochaine = Math.min(o.visite.prochaine + 1, ETAPES.length - 1)
        }
      }
      rendu.dessiner({
        effets: o.effets,
        pasParImage: lot || 1,
        auto: o.auto,
        marques: o.marquer && monde.fourmis[0] ? [monde.fourmis[0]] : [],
      })
      if (t - derniereMaj > 200) {
        derniereMaj = t
        setStats((s) => (s.pas === monde.pas && s.fourmis === monde.fourmis.length && s.autoroute === monde.autoroute
          ? s
          : { pas: monde.pas, fourmis: monde.fourmis.length, autoroute: monde.autoroute }))
      }
      raf = requestAnimationFrame(boucle)
    }
    raf = requestAnimationFrame(boucle)

    const ro = new ResizeObserver(dimensionner)
    ro.observe(canvas)

    // Molette : zoom autour du curseur (écouteur non passif pour bloquer le défilement)
    const molette = (e) => {
      e.preventDefault()
      const r = canvas.getBoundingClientRect()
      rendu.zoomer(Math.exp(-e.deltaY * 0.0015), (e.clientX - r.left) * echelle, (e.clientY - r.top) * echelle)
      opts.current.auto = false
      setAuto(false)
    }
    canvas.addEventListener('wheel', molette, { passive: false })

    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      canvas.removeEventListener('wheel', molette)
    }
  }, [])

  /* ---------- Lecture ---------- */
  const lancer = () => { opts.current.pause = false; setPause(false) }
  const arreter = () => { opts.current.pause = true; setPause(true) }
  const basculerLecture = () => (pause ? lancer() : arreter())

  const pasAPas = () => {
    arreter()
    avancer(sim.current.monde, 1)
  }

  // Après une remise à zéro : compteur à jour tout de suite, et on attend « Lancer »
  const remisAZero = () => {
    const { monde, rendu } = sim.current
    rendu.vider()
    arreter()
    setStats({ pas: 0, fourmis: monde.fourmis.length, autoroute: null })
  }

  const recommencer = () => { reinitialiser(sim.current.monde); remisAZero() }
  const effacerTout = () => { toutEffacer(sim.current.monde); remisAZero() }

  /* ---------- Règles ---------- */
  const appliquerRegle = (r) => {
    changerRegle(sim.current.monde, construireRegle(r))
    setRegle(r)
    if (r.type === 'lettres') setSaisie(r.lettres)
    remisAZero()
  }

  const validerSaisie = (e) => {
    e.preventDefault()
    const l = saisie.trim().toUpperCase()
    if (!lettresValides(l)) { setErreurSaisie(true); return }
    setErreurSaisie(false)
    appliquerRegle({ type: 'lettres', id: l, lettres: l })
  }

  const changerBords = (b) => {
    sim.current.monde.bords = b
    setBords(b)
  }

  const zoom = (f) => {
    sim.current.rendu.zoomer(f)
    opts.current.auto = false
    setAuto(false)
  }

  /* ---------- Visite guidée ---------- */
  const lancerVisite = () => {
    const { monde } = sim.current
    toutEffacer(monde)
    changerRegle(monde, regleLettres('RL'))
    monde.bords = 'arret'
    remisAZero()
    setRegle(RL)
    setSaisie('RL')
    setType('lettres')
    setBords('arret')
    setVitesse(0)
    setAuto(true)
    setOutil('main')
    opts.current.visite = { prochaine: 1 }
    setVisite(true)
    setEtape(0)
  }

  const quitterVisite = () => {
    opts.current.visite = null
    setVisite(false)
    setEtape(null)
  }

  const continuerVisite = () => {
    if (etape === ETAPES.length - 1) { quitterVisite(); return }
    setEtape(null)
    lancer()
  }

  /* ---------- Clavier : espace = lancer / pause, flèche droite = un pas ---------- */
  useEffect(() => {
    const touche = (e) => {
      if (['INPUT', 'TEXTAREA', 'SELECT', 'BUTTON'].includes(e.target.tagName)) return
      if (e.code === 'Space') {
        e.preventDefault()
        const p = !opts.current.pause
        opts.current.pause = p
        setPause(p)
      } else if (e.code === 'ArrowRight') {
        e.preventDefault()
        opts.current.pause = true
        setPause(true)
        avancer(sim.current.monde, 1)
      }
    }
    window.addEventListener('keydown', touche)
    return () => window.removeEventListener('keydown', touche)
  }, [])

  /* ---------- Souris et doigts ---------- */
  const pointeurs = useRef(new Map())
  const derniereCase = useRef(null)

  const versCanvas = (e) => {
    const r = canvasRef.current.getBoundingClientRect()
    const s = sim.current.echelle
    return { x: (e.clientX - r.left) * s, y: (e.clientY - r.top) * s }
  }

  // Murs et gomme : on relie les cases entre deux événements pour ne pas laisser de trous
  const tracer = (p) => {
    const { monde, rendu } = sim.current
    const c = rendu.versCase(p.x, p.y)
    const depart = derniereCase.current ?? c
    const n = Math.max(Math.abs(c.x - depart.x), Math.abs(c.y - depart.y), 1)
    for (let k = 0; k <= n; k++) {
      const x = Math.round(depart.x + ((c.x - depart.x) * k) / n)
      const y = Math.round(depart.y + ((c.y - depart.y) * k) / n)
      if (outil === 'mur') poserMur(monde, x, y)
      else gommer(monde, x, y)
    }
    derniereCase.current = c
  }

  const camManuelle = () => {
    opts.current.auto = false
    setAuto(false)
  }

  const surAppui = (e) => {
    e.currentTarget.setPointerCapture(e.pointerId)
    const p = versCanvas(e)
    pointeurs.current.set(e.pointerId, p)
    if (pointeurs.current.size > 1) return
    derniereCase.current = null
    if (outil === 'fourmi') {
      const c = sim.current.rendu.versCase(p.x, p.y)
      ajouterFourmi(sim.current.monde, c.x, c.y)
      setStats((s) => ({ ...s, fourmis: sim.current.monde.fourmis.length }))
    } else if (outil === 'mur' || outil === 'gomme') {
      tracer(p)
    }
  }

  const surMouvement = (e) => {
    const avant = pointeurs.current.get(e.pointerId)
    if (!avant) return
    const p = versCanvas(e)
    const { rendu } = sim.current

    if (pointeurs.current.size === 2) {
      // Pincement : zoom + déplacement autour du milieu des deux doigts
      const [a, b] = [...pointeurs.current.values()]
      const autre = a === avant ? b : a
      const d0 = Math.hypot(avant.x - autre.x, avant.y - autre.y)
      const d1 = Math.hypot(p.x - autre.x, p.y - autre.y)
      if (d0 > 0) rendu.zoomer(d1 / d0, (p.x + autre.x) / 2, (p.y + autre.y) / 2)
      rendu.deplacer((p.x - avant.x) / 2, (p.y - avant.y) / 2)
      camManuelle()
    } else if (outil === 'main') {
      rendu.deplacer(p.x - avant.x, p.y - avant.y)
      camManuelle()
    } else if (outil === 'mur' || outil === 'gomme') {
      tracer(p)
    }
    pointeurs.current.set(e.pointerId, p)
  }

  const surRelache = (e) => {
    pointeurs.current.delete(e.pointerId)
    derniereCase.current = null
  }

  /* ---------- Légende de la règle active ---------- */
  const regleActive = useMemo(() => construireRegle(regle), [regle])
  const couleurs = useMemo(() => palette(regleActive.couleurs), [regleActive])
  const presetLettres = PRESETS_LETTRES.find((p) => p.id === regle.id)

  const fmt = (n) => n.toLocaleString(T.nombre)
  const termine = pause && stats.fourmis === 0 && stats.pas > 0
  const libelleLecture = termine ? T.reinitialiser : !pause ? T.pause : stats.pas === 0 ? T.lancer : T.reprendre

  return (
    <>
      <BarreProjet meta={meta} />

      <div className="fourmi">
        <div className="fourmi-plateau">

          {/* Barre du haut : outils et vue */}
          <div className="fourmi-barre fourmi-barre--haut">
            <div className="fourmi-choix" role="group" aria-label={T.outils.main}>
              {OUTILS.map((o) => (
                <button key={o} aria-pressed={outil === o} title={T.aides[o]} onClick={() => setOutil(o)}>
                  {T.outils[o]}
                </button>
              ))}
            </div>
            <div className="fourmi-choix">
              <button onClick={() => zoom(1 / 1.5)} aria-label={T.zoomMoins} title={T.zoomMoins}>−</button>
              <button onClick={() => zoom(1.5)} aria-label={T.zoomPlus} title={T.zoomPlus}>+</button>
              <button aria-pressed={auto} onClick={() => setAuto(!auto)} title={T.cadrage}>
                <span className="fourmi-long">{T.cadrage}</span>
                <span className="fourmi-court">{T.auto}</span>
              </button>
            </div>
          </div>

          {/* La feuille */}
          <div className="fourmi-feuille">
            <canvas
              ref={canvasRef}
              className="fourmi-canvas"
              data-outil={outil}
              onPointerDown={surAppui}
              onPointerMove={surMouvement}
              onPointerUp={surRelache}
              onPointerCancel={surRelache}
            />
          </div>

          {/* Barre du bas : lecture, ou note de la visite guidée */}
          <div className="fourmi-barre fourmi-barre--bas">
            {etape !== null ? (
              <div className="fourmi-visite" aria-live="polite">
                <p className="fourmi-visite-etape">{T.etapeSur(etape + 1, ETAPES.length)}</p>
                <h2>{T.etapes[etape][0]}</h2>
                <p className="fourmi-visite-texte">
                  {T.etapes[etape][1]}
                  {etape === 3 && stats.autoroute !== null && ` (${T.autorouteAu} ${fmt(stats.autoroute)}.)`}
                </p>
                <div className="fourmi-visite-actions">
                  <button className="fourmi-texte" onClick={quitterVisite}>{T.quitter}</button>
                  <button className="fourmi-principal" onClick={continuerVisite}>
                    {etape === ETAPES.length - 1 ? T.terminer : T.continuer}
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="fourmi-lecture">
                  <button className="fourmi-principal" onClick={termine ? recommencer : basculerLecture} title={T.raccourcis}>
                    {!termine && (pause ? <IconeLecture /> : <IconePause />)}
                    {libelleLecture}
                  </button>
                  <button className="fourmi-texte" onClick={pasAPas}>{T.unPas}</button>
                  <button className="fourmi-texte" onClick={recommencer} title={T.reinitialiserAide}>{T.reinitialiser}</button>
                  <button className="fourmi-texte" onClick={effacerTout} title={T.toutEffacerAide}>{T.toutEffacer}</button>
                </div>
                <label className="fourmi-vitesse">
                  {T.vitesse}
                  <input type="range" min="0" max={VITESSES.length - 1} value={vitesse}
                    onChange={(e) => setVitesse(Number(e.target.value))} />
                  <span>{vitesse === 0 ? T.auto : `${fmt(VITESSES[vitesse])} ${T.pasParImage}`}</span>
                </label>
                <p className="fourmi-compteur">
                  <span>{fmt(stats.pas)} {T.pas}</span>
                  <span>{stats.fourmis} {T.pluriel(stats.fourmis) ? T.fourmis : T.fourmi}</span>
                  {stats.autoroute !== null && <span>{T.autorouteAu} {fmt(stats.autoroute)}</span>}
                </p>
                {visite && <button className="fourmi-texte" onClick={quitterVisite}>{T.quitter}</button>}
              </>
            )}
          </div>
        </div>

        {/* Marge */}
        <aside className="fourmi-marge">
          <div className="fourmi-onglets" role="tablist">
            {['reglages', 'comprendre'].map((o) => (
              <button key={o} role="tab" aria-selected={onglet === o} onClick={() => setOnglet(o)}>
                {T.onglets[o]}
              </button>
            ))}
          </div>

          {onglet === 'reglages' ? (
            <>
              <section>
                <h3>{T.regle}</h3>
                <div className="fourmi-types">
                  {['lettres', 'turmites'].map((k) => (
                    <button key={k} aria-pressed={type === k} onClick={() => setType(k)}>{T.types[k]}</button>
                  ))}
                </div>

                {type === 'lettres' ? (
                  <>
                    <ul className="fourmi-liste">
                      {PRESETS_LETTRES.map((p) => (
                        <li key={p.id}>
                          <button
                            aria-pressed={regle.id === p.id}
                            onClick={() => appliquerRegle({ type: 'lettres', id: p.id, lettres: p.lettres })}
                          >
                            <span>{T.presetsLettres[p.id][0]}</span>
                            <code>{p.lettres}</code>
                          </button>
                        </li>
                      ))}
                    </ul>
                    {presetLettres && <p className="fourmi-description">{T.presetsLettres[presetLettres.id][1]}</p>}

                    <form className="fourmi-saisie" onSubmit={validerSaisie}>
                      <label htmlFor="fourmi-regle">{T.votreRegle}</label>
                      <div>
                        <input
                          id="fourmi-regle"
                          value={saisie}
                          onChange={(e) => setSaisie(e.target.value.toUpperCase())}
                          maxLength={12}
                          spellCheck={false}
                          autoComplete="off"
                          aria-invalid={erreurSaisie}
                          aria-describedby="fourmi-regle-aide"
                        />
                        <button className="fourmi-texte" type="submit">{T.appliquer}</button>
                      </div>
                      <p id="fourmi-regle-aide" className={erreurSaisie ? 'fourmi-aide fourmi-aide--erreur' : 'fourmi-aide'}>
                        {erreurSaisie ? T.invalide : T.saisie}
                      </p>
                    </form>
                  </>
                ) : (
                  <ul className="fourmi-liste">
                    {PRESETS_TURMITES.map((p) => (
                      <li key={p.id}>
                        <button
                          aria-pressed={regle.id === p.id}
                          onClick={() => appliquerRegle({ type: 'turmite', id: p.id, code: p.code })}
                        >
                          <span>{T.presetsTurmites[p.id]}</span>
                          <code>{p.code.match(/.{3}/g).join(' ')}</code>
                        </button>
                      </li>
                    ))}
                  </ul>
                )}

                {regleActive.type === 'lettres' ? (
                  <>
                    <p className="fourmi-aide">{T.legende}</p>
                    <ul className="fourmi-legende">
                      {[...regleActive.nom].map((l, c) => (
                        <li key={c}>
                          <Case rvb={couleurs[c]} />
                          <code>{l}</code>
                          {T.lettresVerbe[l]}
                        </li>
                      ))}
                    </ul>
                  </>
                ) : (
                  <>
                    <p className="fourmi-aide">{T.tableTurmite}</p>
                    <table className="fourmi-table">
                      <thead>
                        <tr>
                          <th />
                          {couleurs.map((c, k) => (
                            <th key={k} scope="col"><Case rvb={c} /></th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {Array.from({ length: regleActive.etats }, (_, s) => (
                          <tr key={s}>
                            <th scope="row">{T.etat} {s}</th>
                            {couleurs.map((_, c) => {
                              const k = (s * regleActive.couleurs + c) * 3
                              return (
                                <td key={c}>
                                  <Case rvb={couleurs[regleActive.table[k]]} />
                                  <code>{LETTRE_VIRAGE[regleActive.table[k + 1]]}</code>
                                  → {regleActive.table[k + 2]}
                                </td>
                              )
                            })}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </>
                )}
              </section>

              <section>
                <h3>{T.affichage}</h3>
                {Object.keys(effets).map((k) => (
                  <label key={k} className="fourmi-option">
                    <input type="checkbox" checked={effets[k]} onChange={() => setEffets({ ...effets, [k]: !effets[k] })} />
                    {T.effetsNoms[k]}
                  </label>
                ))}
              </section>

              <section>
                <h3>{T.bordsTitre}</h3>
                {['arret', 'tore'].map((b) => (
                  <label key={b} className="fourmi-option">
                    <input type="radio" name="fourmi-bords" checked={bords === b} onChange={() => changerBords(b)} />
                    {T.bords[b]}
                  </label>
                ))}
              </section>
            </>
          ) : (
            <div className="fourmi-fiche">
              <button className="fourmi-principal fourmi-large" onClick={lancerVisite}>{T.visiteLancer}</button>
              {T.fiche.map((s) => (
                <section key={s.titre}>
                  <h3>{s.titre}</h3>
                  {s.texte.map((p) => <p key={p}>{p}</p>)}
                </section>
              ))}
              <p className="fourmi-aide">{T.sources}</p>
            </div>
          )}
        </aside>
      </div>
    </>
  )
}

const IconeLecture = () => (
  <svg viewBox="0 0 16 16" width="12" height="12" aria-hidden="true"><path d="M4 2.5v11l9-5.5z" fill="currentColor" /></svg>
)
const IconePause = () => (
  <svg viewBox="0 0 16 16" width="12" height="12" aria-hidden="true"><path d="M4 2.5h3v11H4zM9 2.5h3v11H9z" fill="currentColor" /></svg>
)
