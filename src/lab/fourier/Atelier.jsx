import { useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react'
import BarreEtat from '../BarreEtat'
import Crans, { IconeLecture, IconePause } from '../commun/Crans'
import { preparer, approximation, bilan, cerclesNonNuls, longueur } from './moteur'
import { FORMES } from './formes'
import { creerRendu2D } from './rendu2d'
import { SCENARIOS, REGLAGES, scenario } from './scenarios'
import Spectre from './Spectre'

// ============================================================
//  ÉPICYCLES DE FOURIER : l'explorateur
//  Tout se calcule sur le fil principal : une FFT de 2 048 points prend
//  moins d'une milliseconde. La page garde la forme, ses coefficients
//  et l'approximation courante ; la boucle d'animation fait tourner la
//  chaîne de cercles et dessine, en 2D (Canvas) ou en 3D (three.js,
//  chargé à la demande).
// ============================================================

const N = 2048
const MMAX = N - 1
const VITESSES = [0.25, 0.5, 1, 2, 4]
const PERIODE = 12          // secondes par tour à la vitesse 1
const SCEN_DEPART = 'coeur'

const versCurseur = (M) => Math.round((1000 * Math.log(Math.max(1, M))) / Math.log(MMAX))
const depuisCurseur = (v) => Math.max(1, Math.min(MMAX, Math.round(Math.exp((v / 1000) * Math.log(MMAX)))))
const complets = (r) => ({ ...REGLAGES, ...(r ?? {}) })

// La forme à préparer : une forme célèbre, ou le dessin du visiteur
function formeDe(id, dessin, fermee) {
  if (id === 'dessin') return dessin ? { points: dessin, fermee } : null
  const f = FORMES[id]
  return f.fermee === false ? { ...f, fermee } : f
}

function Pli({ titre, ouvert = false, children }) {
  return (
    <details className="fo-pli" open={ouvert}>
      <summary>{titre}</summary>
      <div className="fo-pli-corps">{children}</div>
    </details>
  )
}

export default function Atelier({ visible, T, ref }) {
  const toile2 = useRef(null)
  const toile3 = useRef(null)
  const rendu2 = useRef(null)
  const rendu3 = useRef(null)
  const tRef = useRef(0)
  const scene = useRef({})
  const trace = useRef(null)              // tracé en cours, à la souris
  const opts = useRef({})

  const [scen, setScen] = useState(SCEN_DEPART)
  const [R, setR] = useState(() => complets(scenario(SCEN_DEPART).r))
  const [dessin, setDessin] = useState(null)
  const [modifie, setModifie] = useState(false)
  const [dim, setDim] = useState(2)
  const [pause, setPause] = useState(false)
  const [vitesse, setVitesse] = useState(2)
  const [outil, setOutil] = useState('regarder')
  const [aff, setAff] = useState({ cercles: true, origine: true, courbe: true })
  const [tour, setTour] = useState(0)
  const [replie, setReplie] = useState(false)
  const [erreur3D, setErreur3D] = useState(false)

  const formeId = scenario(scen).forme
  const brute = FORMES[formeId]
  const peutFormule = !!brute?.formule
  const peutOuvrir = formeId === 'dessin' || brute?.fermee === false
  const param = peutFormule ? R.param : 'vitesse'
  const lissage = R.ordre === 'frequence' ? R.lissage : 'aucun'

  const prep = useMemo(() => {
    const f = formeDe(formeId, dessin, R.fermee)
    return f ? preparer(f, param, N) : null
  }, [formeId, dessin, R.fermee, param])
  const approx = useMemo(() => (prep ? approximation(prep.c, prep.ordres[R.ordre], R.M, lissage) : null), [prep, R.ordre, R.M, lissage])
  const b = prep ? bilan(prep.c, prep.ordres[R.ordre], R.M) : null
  const nonNuls = useMemo(() => (prep && param === 'formule' ? cerclesNonNuls(prep.c, 1e-6) : null), [prep, param])
  const fermee = formeId === 'dessin' || peutOuvrir ? R.fermee : true

  useEffect(() => {
    scene.current = { origine: prep?.echantillons ?? null, approx, fermee, options: aff }
  }, [prep, approx, fermee, aff])
  useEffect(() => {
    Object.assign(opts.current, { pause, vitesse, visible, dim })
  }, [pause, vitesse, visible, dim])

  /* ---------- Boucle d'animation ---------- */
  useEffect(() => {
    rendu2.current = creerRendu2D(toile2.current)
    let raf = 0
    let avant = performance.now()
    let derniereMaj = 0
    const boucle = (now) => {
      raf = requestAnimationFrame(boucle)
      const o = opts.current
      const dt = Math.min(0.1, (now - avant) / 1000)
      avant = now
      if (!o.visible) return
      if (!o.pause) tRef.current = (tRef.current + (dt * VITESSES[o.vitesse]) / PERIODE) % 1
      const s = { ...scene.current, t: tRef.current, dessin: trace.current }
      if (o.dim === 3) {
        if (rendu3.current?.dessiner) {
          rendu3.current.redimensionner()
          rendu3.current.dessiner(s)
        }
      } else {
        rendu2.current.redimensionner()
        rendu2.current.dessiner(s)
      }
      if (now - derniereMaj > 250) { derniereMaj = now; setTour(tRef.current) }
    }
    raf = requestAnimationFrame(boucle)
    return () => {
      cancelAnimationFrame(raf)
      rendu3.current?.liberer?.()
      rendu3.current = null
    }
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
    setScen(s.id)
    setR(complets(s.r))
    setModifie(false)
    setOutil(s.forme === 'dessin' && !dessin ? 'dessiner' : 'regarder')
    setPause(false)
    tRef.current = 0
  }
  function changer(cle, valeur) {
    setR((r) => ({ ...r, [cle]: valeur }))
    setModifie(true)
  }
  const changerM = (M) => changer('M', Math.max(1, Math.min(MMAX, M)))
  const recommencer = () => { tRef.current = 0 }
  const basculer = (cle) => setAff((a) => ({ ...a, [cle]: !a[cle] }))

  /* ---------- Dessin à la souris ---------- */

  const dessinActif = dim === 2 && (outil === 'dessiner' || (formeId === 'dessin' && !dessin))
  function versMonde(e) {
    const c = toile2.current
    const r = c.getBoundingClientRect()
    rendu2.current.cadrer()
    return rendu2.current.versMonde(((e.clientX - r.left) / r.width) * c.width, ((e.clientY - r.top) / r.height) * c.height)
  }
  const appui = (e) => {
    if (!dessinActif) return
    e.currentTarget.setPointerCapture?.(e.pointerId)
    trace.current = [versMonde(e)]
  }
  const glisse = (e) => {
    if (!trace.current) return
    const p = versMonde(e)
    const d = trace.current[trace.current.length - 1]
    if (Math.hypot(p[0] - d[0], p[1] - d[1]) > 0.006) trace.current.push(p)
  }
  const relache = () => {
    const pts = trace.current
    trace.current = null
    if (!pts || pts.length < 8 || longueur(pts, false) < 0.3) return
    setDessin(pts)
    if (scen !== 'dessin') {
      setScen('dessin')
      setR((r) => ({ ...complets(scenario('dessin').r), fermee: r.fermee }))
    }
    setModifie(false)
    setOutil('regarder')
    tRef.current = 0
  }

  useImperativeHandle(ref, () => ({
    // Depuis les onglets de lecture : ouvrir un scénario dans l'explorateur
    ouvrir(id) { choisirScenario(id) },
  }))

  /* ---------- Affichage ---------- */
  const fmt = (n, o) => n.toLocaleString(T.nombre, o)
  const pct = (x) => fmt(x, { style: 'percent', maximumFractionDigits: 1 })
  const pct2 = (x) => fmt(x, { style: 'percent', maximumSignificantDigits: 2 })
  const id = (cle) => `fo-${cle}`
  const txtScen = T.scenarios[scen]

  return (
    <div className="atelier" hidden={!visible}>
      <div className="atelier-corps" data-replie={replie}>
        <div className="plan">
          <div className="plan-outils">
            <div className="groupe" role="group" aria-label={T.outilsTitre}>
              {['regarder', 'dessiner'].map((o) => (
                <button key={o} aria-pressed={(o === 'dessiner') === dessinActif} onClick={() => setOutil(o)} disabled={dim === 3 && o === 'dessiner'} title={T.outilsAide[o]}>{T.outils[o]}</button>
              ))}
            </div>
            <div className="plan-outils-droite">
              <div className="groupe" role="group" aria-label={T.dimension}>
                {[2, 3].map((d) => (
                  <button key={d} aria-pressed={dim === d} onClick={() => setDim(d)} title={T.dimensionAide[d]}>{d}D</button>
                ))}
              </div>
              {replie && <button className="btn" onClick={() => setReplie(false)}>‹ {T.reglages}</button>}
            </div>
          </div>

          <div className="cadre fo-cadre">
            <canvas
              ref={toile2}
              className="cadre-canvas fo-canvas"
              hidden={dim === 3}
              data-outil={dessinActif ? 'dessiner' : 'aucun'}
              onPointerDown={appui}
              onPointerMove={glisse}
              onPointerUp={relache}
              onPointerCancel={relache}
              aria-label={T.toile(txtScen?.titre ?? '', dessinActif)}
            />
            <canvas ref={toile3} className="cadre-canvas fo-canvas fo-canvas3d" hidden={dim !== 3} aria-label={T.toile3d} />
            {dim === 3 && erreur3D && <p className="fo-message">{T.erreur3D}</p>}
            {dim === 2 && formeId === 'dessin' && !dessin && <p className="fo-message">{T.dessinez}</p>}
            {dim === 2 && dessinActif && formeId !== 'dessin' && <p className="fo-bandeau">{T.dessinezAutre}</p>}
          </div>

          <div className="transport">
            <div className="transport-boutons">
              <button className="btn-principal" onClick={() => setPause(!pause)}>
                {pause ? <IconeLecture /> : <IconePause />}
                {pause ? T.reprendre : T.pause}
              </button>
              <button className="btn" onClick={recommencer} title={T.recommencerAide}>{T.recommencer}</button>
            </div>
            <Crans valeur={vitesse} max={VITESSES.length - 1} onChange={setVitesse} libelle={T.vitesse} texte={T.vitesseTexte(fmt(PERIODE / VITESSES[vitesse], { maximumFractionDigits: 1 }))} />
          </div>

          {prep && <Spectre prep={prep} ordre={R.ordre} M={R.M} T={T} fmt={fmt} />}
        </div>

        {!replie && (
          <aside className="inspecteur fo-inspecteur" aria-label={T.reglages}>
            <div className="insp-tete">
              <span>{T.reglages}</span>
              <button onClick={() => setReplie(true)} aria-label={T.replier} title={T.replier}>›</button>
            </div>

            {/* Formes */}
            <section className="bloc">
              <h3>{T.formesTitre}{modifie && <span>{T.modifie}</span>}</h3>
              <ul className="fo-scenarios">
                {SCENARIOS.map((s) => (
                  <li key={s.id}>
                    <button aria-pressed={scen === s.id} onClick={() => choisirScenario(s.id)}>
                      <span>{T.scenarios[s.id].titre}</span>
                      <em>{T.scenarios[s.id].etiquette}</em>
                    </button>
                  </li>
                ))}
              </ul>
              {txtScen && <p className="aide">{txtScen.aide}</p>}
              {modifie && <button className="btn" onClick={() => choisirScenario(scen)}>{T.retablir}</button>}
            </section>

            {/* Cercles */}
            <section className="bloc">
              <h3>{T.cerclesTitre}</h3>
              <div className="fo-reglage">
                <div className="fo-reglage-tete">
                  <label htmlFor={id('M')}>{T.cercles}</label>
                  <output htmlFor={id('M')}>{fmt(R.M)}</output>
                </div>
                <div className="fo-curseur-cercles">
                  <button className="btn" onClick={() => changerM(R.M - 1)} aria-label={T.moins}>−</button>
                  <input id={id('M')} type="range" min="0" max="1000" step="1" value={versCurseur(R.M)} onChange={(e) => changerM(depuisCurseur(Number(e.target.value)))} />
                  <button className="btn" onClick={() => changerM(R.M + 1)} aria-label={T.plus}>+</button>
                </div>
              </div>
              <p className="aide">{T.cerclesAide}</p>
              <div className="groupe groupe--plein" role="group" aria-label={T.ordre}>
                {['frequence', 'amplitude'].map((o) => (
                  <button key={o} aria-pressed={R.ordre === o} onClick={() => changer('ordre', o)}>{T.ordres[o]}</button>
                ))}
              </div>
              <p className="aide">{T.ordresAide[R.ordre]}</p>
              <div className="ligne">
                <label htmlFor={id('lissage')}>{T.lissage}</label>
                <select id={id('lissage')} value={lissage} disabled={R.ordre !== 'frequence'} onChange={(e) => changer('lissage', e.target.value)}>
                  {['aucun', 'fejer', 'lanczos'].map((l) => <option key={l} value={l}>{T.lissages[l]}</option>)}
                </select>
              </div>
              <p className="aide">{R.ordre === 'frequence' ? T.lissageAide : T.lissageSeulFrequence}</p>
            </section>

            {/* Tracé */}
            <section className="bloc">
              <h3>{T.traceTitre}</h3>
              <Pli titre={T.parametrage} ouvert>
                <div className="groupe groupe--plein" role="group" aria-label={T.parametrage}>
                  {['formule', 'vitesse'].map((p) => (
                    <button key={p} aria-pressed={param === p} disabled={!peutFormule && p === 'formule'} onClick={() => changer('param', p)}>{T.parametrages[p]}</button>
                  ))}
                </div>
                <p className="aide">{peutFormule ? T.parametrageAide : T.parametrageIndispo}</p>
                <label className="option">
                  <input type="checkbox" checked={fermee} disabled={!peutOuvrir} onChange={() => changer('fermee', !R.fermee)} />
                  {T.fermer}
                </label>
                <p className="aide">{peutOuvrir ? T.fermerAide : T.fermerIndispo}</p>
              </Pli>
              <Pli titre={T.affichage} ouvert>
                {['cercles', 'origine', 'courbe'].map((k) => (
                  <label key={k} className="option">
                    <input type="checkbox" checked={aff[k]} onChange={() => basculer(k)} />
                    {T.montrer[k]}
                  </label>
                ))}
              </Pli>
              <div className="fo-boutons">
                <button className="btn" onClick={() => { setOutil('dessiner'); setDim(2) }}>{T.dessiner}</button>
                {dessin && <button className="btn" onClick={() => { setDessin(null); if (scen === 'dessin') setOutil('dessiner') }}>{T.effacerDessin}</button>}
              </div>
              <p className="aide">{T.dessinerAide}</p>
            </section>

            {/* Mesures */}
            {b && (
              <section className="bloc">
                <h3>{T.mesuresTitre}</h3>
                <dl className="fo-chiffres">
                  <div><dt>{T.mesures.energie[0]}</dt><dd>{pct(b.energie)}</dd></div>
                  <div><dt>{T.mesures.erreur[0]}</dt><dd>{pct2(b.erreur)}</dd></div>
                  <div><dt>{T.mesures.part[0]}</dt><dd>{pct2(R.M / N)}</dd></div>
                  <div><dt>{T.mesures.frequence[0]}</dt><dd>{fmt(approx?.K ?? 0)}</dd></div>
                </dl>
                <p className="aide">{T.mesuresAide}</p>
                {nonNuls !== null && <p className="aide">{T.nonNuls(fmt(nonNuls))}</p>}
              </section>
            )}
          </aside>
        )}
      </div>

      <BarreEtat
        statut={pause ? T.statut.pause : T.statut.enCours}
        actif={!pause}
        elements={[
          txtScen?.titre,
          modifie && T.modifie,
          T.etat.cercles(fmt(R.M)),
          b && T.etat.energie(pct(b.energie)),
          b && T.etat.erreur(pct2(b.erreur)),
        ]}
        fin={T.etat.tour(fmt(tour, { style: 'percent', maximumFractionDigits: 0 }))}
      />
    </div>
  )
}
