import { useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react'
import BarreEtat from '../BarreEtat'
import {
  creerMonde, avancer, regleLettres, regleTurmite, lettresValides, changerRegle,
  reinitialiser, toutEffacer, ajouterFourmi, poserMur, gommer,
} from './moteur'
import { creerRendu, palette, couleurCss } from './rendu'
import { PRESETS_LETTRES, PRESETS_TURMITES } from './presets'

// ============================================================
//  ATELIER — l'onglet Simulation : outils, feuille, lecture,
//  réglages repliables et barre d'état.
//  La simulation vit dans des useRef (hors de l'état React) :
//  seuls les boutons et la barre d'état passent par l'état.
// ============================================================

const TAILLE = 512 // feuille de 512 × 512 cases
const VITESSES = ['auto', 1, 2, 5, 10, 25, 50, 100, 250, 500, 1000, 2500, 5000]
const rampe = (pas) => Math.min(2000, 1 + Math.floor(pas / 100)) // lent au début, puis accélère
const OUTILS = ['main', 'fourmi', 'mur', 'gomme']
const LETTRE_VIRAGE = ['N', 'R', 'U', 'L']
const RL = { type: 'lettres', id: 'RL', lettres: 'RL' }

// Arrêts de la visite guidée (règle RL, une fourmi)
const ETAPES = [{ pas: 0 }, { pas: 250 }, { pas: 3000 }, { autoroute: true }, { fin: true }]
const atteinte = (e, m) =>
  e.pas != null ? m.pas >= e.pas
    : e.autoroute ? m.autoroute !== null
      : m.fourmis.length === 0 || (m.autoroute !== null && m.pas >= m.autoroute + 6000)

const construireRegle = (r) => (r.type === 'lettres' ? regleLettres(r.lettres) : regleTurmite(r.code))

/* ---------- Petits composants ---------- */

const Case = ({ rvb, theme }) => <span className="case" style={{ background: couleurCss(rvb, theme) }} />

const ICONES = {
  main: <path d="M8 1v14M1 8h14M8 1 6 3m2-2 2 2M8 15l-2-2m2 2 2-2M1 8l2-2M1 8l2 2m12-2-2-2m2 2-2 2" stroke="currentColor" strokeWidth="1.4" fill="none" />,
  fourmi: <path d="M8 2 13 13H3z" fill="currentColor" />,
  mur: <rect x="2" y="2" width="12" height="12" fill="currentColor" opacity=".7" />,
  gomme: <rect x="2.5" y="2.5" width="11" height="11" fill="none" stroke="currentColor" strokeWidth="1.4" strokeDasharray="2 2" />,
}
const Icone = ({ nom }) => <svg width="13" height="13" viewBox="0 0 16 16" aria-hidden="true">{ICONES[nom]}</svg>

// Curseur à crans : un vrai <input type="range">, habillé (rail, crans, poignée)
function Crans({ valeur, max, onChange, libelle, texte }) {
  const pos = (k) => `calc(5px + ${k / max} * (100% - 10px))`
  return (
    <label className="crans-libelle">
      <span>{libelle}</span>
      <span className="crans" style={{ '--plein': pos(valeur) }}>
        {Array.from({ length: max + 1 }, (_, k) => <i key={k} style={{ left: pos(k) }} />)}
        <input type="range" min="0" max={max} step="1" value={valeur} onChange={(e) => onChange(Number(e.target.value))} />
      </span>
      <output>{texte}</output>
    </label>
  )
}

export default function Atelier({ ref, visible, theme, T }) {
  const canvasRef = useRef(null)
  const sim = useRef(null)                          // { monde, rendu, echelle }
  const opts = useRef({ pause: true, vitesse: 'auto', effets: {}, auto: true, visite: null, marquer: false, visible: true, theme })

  const [pause, setPause] = useState(true)          // on attend « Lancer »
  const [vitesse, setVitesse] = useState(0)         // indice dans VITESSES
  const [effets, setEffets] = useState({ surligneur: true, quadrillage: true, passages: false })
  const [auto, setAuto] = useState(true)
  const [outil, setOutil] = useState('main')
  const [replie, setReplie] = useState(false)
  const [type, setType] = useState('lettres')
  const [regle, setRegle] = useState(RL)
  const [saisie, setSaisie] = useState('RL')
  const [erreurSaisie, setErreurSaisie] = useState(false)
  const [bords, setBords] = useState('arret')
  const [stats, setStats] = useState({ pas: 0, fourmis: 1, autoroute: null, ips: 0 })
  const [etape, setEtape] = useState(null)          // note de visite affichée
  const [enVisite, setEnVisite] = useState(false)

  // L'état React pilote la boucle d'animation à travers opts
  useEffect(() => {
    Object.assign(opts.current, { pause, vitesse: VITESSES[vitesse], effets, auto, marquer: etape === 3, visible, theme })
  }, [pause, vitesse, effets, auto, etape, visible, theme])

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
    let images = 0
    let debutSeconde = performance.now()
    let ips = 0

    const boucle = (t) => {
      const o = opts.current
      raf = requestAnimationFrame(boucle)
      if (!o.visible) return // onglet caché : on ne calcule ni ne dessine rien

      let lot = 0
      if (!o.pause) {
        lot = o.vitesse === 'auto' ? rampe(monde.pas) : o.vitesse
        const prochaine = o.visite && ETAPES[o.visite.prochaine]
        if (prochaine?.pas != null) lot = Math.min(lot, Math.max(0, prochaine.pas - monde.pas))
        avancer(monde, lot)
        // Plus aucune fourmi sur la feuille : on s'arrête
        if (monde.fourmis.length === 0 && !prochaine) { o.pause = true; setPause(true) }
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
        theme: o.theme,
        marques: o.marquer && monde.fourmis[0] ? [monde.fourmis[0]] : [],
      })

      images++
      if (t - debutSeconde >= 1000) { ips = Math.round((images * 1000) / (t - debutSeconde)); images = 0; debutSeconde = t }
      if (t - derniereMaj > 200) {
        derniereMaj = t
        setStats((s) => (s.pas === monde.pas && s.fourmis === monde.fourmis.length && s.autoroute === monde.autoroute && s.ips === ips
          ? s
          : { pas: monde.pas, fourmis: monde.fourmis.length, autoroute: monde.autoroute, ips }))
      }
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
    setStats((s) => ({ ...s, pas: 0, fourmis: monde.fourmis.length, autoroute: null }))
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

  const choisirPreset = (id) => {
    if (type === 'lettres') {
      const p = PRESETS_LETTRES.find((q) => q.id === id)
      if (p) appliquerRegle({ type: 'lettres', id: p.id, lettres: p.lettres })
    } else {
      const p = PRESETS_TURMITES.find((q) => q.id === id)
      if (p) appliquerRegle({ type: 'turmite', id: p.id, code: p.code })
    }
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

  /* ---------- Visite guidée (lancée depuis l'onglet Comprendre) ---------- */
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
    setEtape(null)
    lancer()
  }

  useImperativeHandle(ref, () => ({ lancerVisite }))

  /* ---------- Clavier : espace = lancer / pause, flèche droite = un pas ---------- */
  useEffect(() => {
    const touche = (e) => {
      if (!opts.current.visible) return
      if (['INPUT', 'TEXTAREA', 'SELECT', 'BUTTON', 'SUMMARY'].includes(e.target.tagName)) return
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

  /* ---------- Affichage ---------- */
  const regleActive = useMemo(() => construireRegle(regle), [regle])
  const couleurs = useMemo(() => palette(regleActive.couleurs, theme), [regleActive, theme])
  const presetsDuType = type === 'lettres' ? PRESETS_LETTRES : PRESETS_TURMITES
  const presetActif = presetsDuType.some((p) => p.id === regle.id) ? regle.id : ''

  const fmt = (n) => n.toLocaleString(T.nombre)
  const termine = pause && stats.fourmis === 0 && stats.pas > 0
  const libelleLecture = termine ? T.reinitialiser : !pause ? T.pause : stats.pas === 0 ? T.lancer : T.reprendre
  const statut = termine ? T.statut.fini : !pause ? T.statut.enCours : stats.pas === 0 ? T.statut.pret : T.statut.pause
  const nomRegle = regle.type === 'lettres' ? regle.lettres : T.presetsTurmites[regle.id]
  const nomCouleur = (c) => (c === 0 ? T.vide : regleActive.couleurs === 2 ? T.marquee : T.couleurN(c))

  return (
    <div className="atelier" hidden={!visible}>
      <div className="atelier-corps" data-replie={replie}>
        <div className="plan">

          <div className="plan-outils">
            <div className="groupe" role="group" aria-label={T.outils.main}>
              {OUTILS.map((o) => (
                <button key={o} aria-pressed={outil === o} title={T.aides[o]} onClick={() => setOutil(o)}>
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
            <canvas
              ref={canvasRef}
              className="cadre-canvas"
              data-outil={outil}
              onPointerDown={surAppui}
              onPointerMove={surMouvement}
              onPointerUp={surRelache}
              onPointerCancel={surRelache}
            />
          </div>

          <div className="transport">
            {etape !== null ? (
              <div className="visite" aria-live="polite">
                <p className="visite-etape">{T.visite.etapeSur(etape + 1, ETAPES.length)}</p>
                <h2>{T.visite.etapes[etape][0]}</h2>
                <p className="visite-texte">
                  {T.visite.etapes[etape][1]}
                  {etape === 3 && stats.autoroute !== null && ` (${T.etatAutoroute(fmt(stats.autoroute))}.)`}
                </p>
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
                  {!termine && <button className="btn" onClick={recommencer} title={T.reinitialiserAide}>{T.reinitialiser}</button>}
                  <button className="btn" onClick={effacerTout} title={T.toutEffacerAide}>{T.toutEffacer}</button>
                </div>
                <Crans
                  valeur={vitesse}
                  max={VITESSES.length - 1}
                  onChange={setVitesse}
                  libelle={T.vitesse}
                  texte={vitesse === 0 ? T.auto : `${fmt(VITESSES[vitesse])} ${T.pasParImage}`}
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

            <section className="bloc">
              <h3>
                {T.regle}
                <span>{regleActive.type === 'lettres' ? T.nbCouleurs(regleActive.couleurs) : T.nbEtats(regleActive.etats)}</span>
              </h3>
              <div className="groupe groupe--plein">
                {['lettres', 'turmites'].map((k) => (
                  <button key={k} aria-pressed={type === k} onClick={() => setType(k)}>{T.types[k]}</button>
                ))}
              </div>

              <div className="ligne">
                <label htmlFor="fourmi-preset">{T.prereglage}</label>
                <select id="fourmi-preset" value={presetActif} onChange={(e) => choisirPreset(e.target.value)}>
                  {!presetActif && <option value="">{type === 'lettres' ? T.personnalisee : T.choisir}</option>}
                  {type === 'lettres'
                    ? PRESETS_LETTRES.map((p) => <option key={p.id} value={p.id}>{T.presetsLettres[p.id][0]} ({p.lettres})</option>)
                    : PRESETS_TURMITES.map((p) => <option key={p.id} value={p.id}>{T.presetsTurmites[p.id]}</option>)}
                </select>
              </div>

              {type === 'lettres' && (
                <form className="ligne" onSubmit={validerSaisie}>
                  <label htmlFor="fourmi-lettres">{T.lettres}</label>
                  <div className="saisie">
                    <input
                      id="fourmi-lettres"
                      value={saisie}
                      onChange={(e) => setSaisie(e.target.value.toUpperCase())}
                      maxLength={12}
                      spellCheck={false}
                      autoComplete="off"
                      aria-invalid={erreurSaisie}
                      aria-describedby="fourmi-lettres-aide"
                    />
                    <button className="btn" type="submit">{T.appliquer}</button>
                  </div>
                </form>
              )}
              {type === 'lettres' && (
                <p id="fourmi-lettres-aide" className={erreurSaisie ? 'aide aide--erreur' : 'aide'}>
                  {erreurSaisie ? T.invalide : T.saisie}
                </p>
              )}

              {regleActive.type === 'lettres' ? (
                <ul className="legende">
                  {[...regleActive.nom].map((l, c) => (
                    <li key={c}>
                      <Case rvb={couleurs[c]} theme={theme} />
                      <code>{l}</code>
                      <span>{nomCouleur(c)} : {T.lettresVerbe[l]}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <>
                  <p className="aide">{T.tableTurmite}</p>
                  <table className="table-turmite">
                    <thead>
                      <tr>
                        <th />
                        {couleurs.map((c, k) => <th key={k} scope="col"><Case rvb={c} theme={theme} /></th>)}
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
                                <Case rvb={couleurs[regleActive.table[k]]} theme={theme} />
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

            <section className="bloc">
              <h3>{T.affichage}</h3>
              {Object.keys(effets).map((k) => (
                <label key={k} className="option">
                  <input type="checkbox" checked={effets[k]} onChange={() => setEffets({ ...effets, [k]: !effets[k] })} />
                  {T.effetsNoms[k]}
                </label>
              ))}
            </section>

            <section className="bloc">
              <h3>{T.bordsTitre}</h3>
              {['arret', 'tore'].map((b) => (
                <label key={b} className="option">
                  <input type="radio" name="fourmi-bords" checked={bords === b} onChange={() => changerBords(b)} />
                  {T.bords[b]}
                </label>
              ))}
            </section>
          </aside>
        )}
      </div>

      <BarreEtat
        statut={statut}
        actif={!pause}
        elements={[
          T.etatRegle(nomRegle),
          T.etatPas(fmt(stats.pas)),
          `${stats.fourmis} ${T.pluriel(stats.fourmis) ? T.fourmis : T.fourmi}`,
          stats.autoroute !== null && T.etatAutoroute(fmt(stats.autoroute)),
        ]}
        fin={T.etatIps(stats.ips)}
      />
    </div>
  )
}

const IconeLecture = () => (
  <svg viewBox="0 0 16 16" width="11" height="11" aria-hidden="true"><path d="M4 2.5v11l9-5.5z" fill="currentColor" /></svg>
)
const IconePause = () => (
  <svg viewBox="0 0 16 16" width="11" height="11" aria-hidden="true"><path d="M4 2.5h3v11H4zM9 2.5h3v11H9z" fill="currentColor" /></svg>
)
