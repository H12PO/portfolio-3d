import { useEffect, useImperativeHandle, useRef, useState } from 'react'
import BarreEtat from '../BarreEtat'
import Crans, { IconeLecture, IconePause } from '../commun/Crans'
import { creerVille, avancer, mesurer, regler, peindre, DEFAUTS, REGLAGES_DE_DEPART, MAX_GROUPES, OUTILS } from './moteur'
import { creerRendu, COULEURS_GROUPES, COULEURS_SATISFACTION, VUES, couleurRampe } from './rendu'
import { SCENARIOS, scenario } from './scenarios'
import Courbes from './Courbes'

// ============================================================
//  SCHELLING : l'explorateur
//  Les villes (moteur.js) vivent dans des références ; la boucle
//  d'animation les fait avancer et les dessine. React ne gère que
//  les réglages, les scénarios, le pinceau et les courbes.
//  Le calcul reste sur le fil principal : une ville de 100 × 100
//  coûte de 1 à 20 ms par tour selon les réglages (mesuré en Node),
//  et la boucle s'arrête à 10 ms par image quoi qu'il arrive.
// ============================================================

const VITESSES = [0.01, 0.03, 0.1, 0.3, 1]   // tours par image
const VITESSE_DEFAUT = 2
const TAILLES = [60, 100, 150]
const BUDGET_MS = 10
const MAX_POINTS = 240
const GROUPES = Array.from({ length: MAX_GROUPES }, (_, g) => g)

// Le temps qui passe et le hasard, hors des composants (règle de pureté de React)
const horloge = () => performance.now()
const nouvelleGraine = () => 1 + Math.floor(Math.random() * 999999)

// Les réglages complets d'une ville (ceux du scénario par-dessus les valeurs par défaut)
const complets = (r) => ({ ...structuredClone(DEFAUTS), ...structuredClone(r ?? {}) })
const reglagesDe = (s) => ({ a: complets(s.a), b: s.b ? complets(s.b) : null })

// Un curseur de l'inspecteur
function Curseur({ id, libelle, valeur, min, max, pas, onChange, texte, couleur }) {
  return (
    <div className="sc-reglage">
      <div className="sc-reglage-tete">
        <label htmlFor={id}>
          {couleur && <i className="sc-pastille" style={{ background: couleur }} aria-hidden="true" />}
          {libelle}
        </label>
        <output htmlFor={id}>{texte}</output>
      </div>
      <input id={id} type="range" min={min} max={max} step={pas} value={valeur} onChange={(e) => onChange(Number(e.target.value))} />
    </div>
  )
}

// Un pli de l'inspecteur
function Pli({ titre, ouvert = false, children }) {
  return (
    <details className="sc-pli" open={ouvert}>
      <summary>{titre}</summary>
      <div className="sc-pli-corps">{children}</div>
    </details>
  )
}

// La légende de la vue, posée sur le coin du cadre
function Legende({ vue, groupes, T }) {
  if (vue === 'groupes') {
    return (
      <div className="sc-legende">
        {GROUPES.slice(0, groupes).map((g) => <span key={g}><i style={{ background: COULEURS_GROUPES[g] }} />{T.groupeN(g + 1)}</span>)}
      </div>
    )
  }
  if (vue === 'satisfaction') {
    return (
      <div className="sc-legende">
        <span><i style={{ background: COULEURS_SATISFACTION.oui }} />{T.legende.satisfait}</span>
        <span><i style={{ background: COULEURS_SATISFACTION.non }} />{T.legende.insatisfait}</span>
        <span><i style={{ background: COULEURS_SATISFACTION.chasse }} />{T.legende.chasse}</span>
      </div>
    )
  }
  return (
    <div className="sc-legende">
      <span>{T.legende.bas[vue]}</span>
      <span className="sc-rampe" style={{ background: `linear-gradient(90deg, ${[0, 0.25, 0.5, 0.75, 1].map(couleurRampe).join(', ')})` }} />
      <span>{T.legende.haut[vue]}</span>
    </div>
  )
}

export default function Atelier({ visible, T, ref }) {
  const canvasRef = useRef(null)
  const rendu = useRef(null)
  const villes = useRef({ a: null, b: null })
  const cadres = useRef([])
  const historique = useRef({ a: [], b: [] })
  const peinture = useRef(null)          // tracé du pinceau en cours
  const opts = useRef({ graine: 1 })

  const [scen, setScen] = useState(SCENARIOS[0].id)
  const [reglages, setReglages] = useState(() => reglagesDe(SCENARIOS[0]))
  const [modifie, setModifie] = useState(false)
  const [cible, setCible] = useState('a')
  const [vue, setVue] = useState('groupes')
  const [pause, setPause] = useState(false)
  const [vitesse, setVitesse] = useState(VITESSE_DEFAUT)
  const [outil, setOutil] = useState('habitant')
  const [groupePinceau, setGroupePinceau] = useState(0)
  const [rayon, setRayon] = useState(2)
  const [courbes, setCourbes] = useState({ a: [], b: [] })
  const [etat, setEtat] = useState({ t: 0, pop: 0, vitesse: 0 })
  const [replie, setReplie] = useState(false)

  useEffect(() => {
    Object.assign(opts.current, { pause, vitesse, vue, visible })
  }, [pause, vitesse, vue, visible])

  /* ---------- Villes ---------- */

  function mesurerTout() {
    const h = historique.current
    for (const cote of ['a', 'b']) {
      const v = villes.current[cote]
      if (!v) { h[cote] = []; continue }
      h[cote].push(mesurer(v))
      // au-delà de MAX_POINTS, on garde un point sur deux (la courbe reste lisible)
      if (h[cote].length > MAX_POINTS) h[cote] = h[cote].filter((_, k) => k % 2 === 0)
    }
    setCourbes({ a: h.a.slice(), b: h.b.slice() })
  }

  // (Re)crée les villes ; deux villes partent toujours de la même graine
  function creer(R, graine) {
    opts.current.graine = graine
    villes.current = { a: creerVille(R.a, graine), b: R.b ? creerVille(R.b, graine) : null }
    historique.current = { a: [], b: [] }
  }
  function demarrer(R, graine = nouvelleGraine()) {
    creer(R, graine)
    mesurerTout()
    const v = villes.current.a
    setEtat((e) => ({ ...e, t: 0, pop: v.pop }))
  }

  /* ---------- Boucle d'animation ---------- */
  useEffect(() => {
    rendu.current = creerRendu(canvasRef.current)
    creer(reglagesDe(SCENARIOS[0]), nouvelleGraine())
    let raf = 0
    let derniere = 0
    let dette = 0
    let tours = 0
    let tCompte = horloge()
    const boucle = (t) => {
      raf = requestAnimationFrame(boucle)
      const o = opts.current
      if (!o.visible) return
      const vs = [villes.current.a, villes.current.b].filter(Boolean)
      if (!vs.length) return
      if (!o.pause) {
        dette += VITESSES[o.vitesse]
        const debut = horloge()
        while (dette > 1e-9 && horloge() - debut < BUDGET_MS) {
          const pas = Math.min(dette, 0.05)
          for (const v of vs) avancer(v, pas)
          dette -= pas
          tours += pas
        }
        dette = Math.min(dette, 0.05) // trop lent : on ralentit plutôt que d'accumuler du retard
      }
      rendu.current.redimensionner()
      cadres.current = rendu.current.dessiner(vs, o.vue)
      if (t - derniere > 250) {
        derniere = t
        mesurerTout()
        const dt = (horloge() - tCompte) / 1000
        setEtat({ t: vs[0].t, pop: vs[0].pop, vitesse: dt > 0 ? tours / dt : 0 })
        tours = 0
        tCompte = horloge()
      }
    }
    raf = requestAnimationFrame(boucle)
    return () => cancelAnimationFrame(raf)
  }, []) // la boucle lit tout par des références : elle ne démarre qu'une fois

  /* ---------- Actions ---------- */

  function choisirScenario(id) {
    const s = scenario(id)
    const R = reglagesDe(s)
    setScen(s.id)
    setReglages(R)
    setModifie(false)
    setCible('a')
    setVue(s.vue ?? 'groupes')
    setPause(false)
    demarrer(R)
  }

  // Un réglage d'une ville. Ceux « de départ » recréent les villes (même graine : la comparaison reste juste)
  function changer(cle, valeur, cote = cible) {
    const R = { ...reglages, [cote]: { ...reglages[cote], [cle]: valeur } }
    setReglages(R)
    setModifie(true)
    if (REGLAGES_DE_DEPART.includes(cle)) demarrer(R, opts.current.graine)
    else if (villes.current[cote]) regler(villes.current[cote], { [cle]: valeur })
  }
  const changerCase = (cle, g, valeur) => {
    const t = reglages[cible][cle].slice()
    t[g] = valeur
    changer(cle, t)
  }

  // Terrain et taille : communs aux deux villes
  function changerMonde(cle, valeur) {
    const R = { a: { ...reglages.a, [cle]: valeur }, b: reglages.b ? { ...reglages.b, [cle]: valeur } : null }
    setReglages(R)
    setModifie(true)
    demarrer(R, opts.current.graine)
  }

  function basculerComparaison() {
    const R = reglages.b ? { a: reglages.a, b: null } : { a: reglages.a, b: structuredClone(reglages.a) }
    setReglages(R)
    setCible(R.b ? 'b' : 'a')
    setModifie(true)
    demarrer(R)
  }

  function basculerMixite() {
    const avec = reglages[cible].mixite.some((x) => x < 1)
    changer('mixite', avec ? [1, 1, 1, 1, 1] : [0.75, 0.75, 0.75, 0.75, 0.75])
  }

  const recommencer = () => demarrer(reglages)

  function unTour() {
    for (const v of [villes.current.a, villes.current.b]) if (v) avancer(v, 1)
    mesurerTout()
    setPause(true)
  }

  /* ---------- Pinceau ---------- */

  function peindreSous(e) {
    const canvas = canvasRef.current
    const r = canvas.getBoundingClientRect()
    const px = ((e.clientX - r.left) / r.width) * canvas.width
    const py = ((e.clientY - r.top) / r.height) * canvas.height
    cadres.current.forEach(([x0, y0, taille, s], k) => {
      if (px < x0 || py < y0 || px >= x0 + taille || py >= y0 + taille) return
      const v = k === 0 ? villes.current.a : villes.current.b
      const x = Math.floor((px - x0) / s)
      const y = Math.floor((py - y0) / s)
      const cle = `${k}:${x}:${y}`
      if (peinture.current === cle) return
      peinture.current = cle
      peindre(v, outil, x, y, rayon, groupePinceau)
    })
  }
  const debutPeinture = (e) => {
    e.currentTarget.setPointerCapture?.(e.pointerId)
    peinture.current = ''
    peindreSous(e)
  }
  const suitePeinture = (e) => { if (peinture.current !== null) peindreSous(e) }
  const finPeinture = () => { peinture.current = null }

  useImperativeHandle(ref, () => ({
    // Depuis les onglets de lecture : ouvrir un scénario dans l'explorateur
    ouvrir(id) { choisirScenario(id) },
  }))

  /* ---------- Affichage ---------- */
  const fmt = (n, o) => n.toLocaleString(T.nombre, o)
  const pct = (x) => fmt(x, { style: 'percent', maximumFractionDigits: 0 })
  const f2 = (x) => fmt(x, { maximumFractionDigits: 2 })
  const R = reglages[cible] ?? reglages.a
  const G = R.groupes
  const comparer = !!reglages.b
  const sommePoids = (t) => t.slice(0, G).reduce((a, b) => a + b, 0) || 1
  const mixite = R.mixite.some((x) => x < 1)
  const txtScen = T.scenarios[scen]
  const id = (cle) => `sc-${cle}`

  return (
    <div className="atelier" hidden={!visible}>
      <div className="atelier-corps" data-replie={replie}>
        <div className="plan">
          <div className="plan-outils">
            <div className="groupe" role="group" aria-label={T.vue}>
              {VUES.map((v) => (
                <button key={v} aria-pressed={vue === v} onClick={() => setVue(v)} title={T.vuesAide[v]}>{T.vuesVille[v]}</button>
              ))}
            </div>
            <div className="plan-outils-droite">
              <button className="btn" aria-pressed={comparer} onClick={basculerComparaison} title={T.comparerAide}>{comparer ? T.comparerFin : T.comparer}</button>
              {replie && <button className="btn" onClick={() => setReplie(false)}>‹ {T.reglages}</button>}
            </div>
          </div>

          <div className="cadre sc-cadre">
            <canvas
              ref={canvasRef}
              className="cadre-canvas sc-canvas"
              onPointerDown={debutPeinture}
              onPointerMove={suitePeinture}
              onPointerUp={finPeinture}
              onPointerCancel={finPeinture}
              aria-label={T.toile(txtScen?.titre ?? '', T.outils[outil])}
            />
            {comparer && (
              <div className="sc-etiquettes">
                {['a', 'b'].map((c) => (
                  <span key={c} className="sc-etiquette" data-cote={c}>
                    <strong>{T.ville(c)}</strong>
                    {!modifie && txtScen?.[c] && <> · {txtScen[c]}</>}
                  </span>
                ))}
              </div>
            )}
            <Legende vue={vue} groupes={reglages.a.groupes} T={T} />
          </div>

          <div className="transport">
            <div className="transport-boutons">
              <button className="btn-principal" onClick={() => setPause(!pause)}>
                {pause ? <IconeLecture /> : <IconePause />}
                {pause ? T.reprendre : T.pause}
              </button>
              <button className="btn" onClick={unTour}>{T.unTour}</button>
              <button className="btn" onClick={recommencer} title={T.recommencerAide}>{T.recommencer}</button>
            </div>
            <Crans valeur={vitesse} max={VITESSES.length - 1} onChange={setVitesse} libelle={T.vitesse} texte={T.toursParImage(VITESSES[vitesse], fmt)} />
          </div>

          <Courbes historique={courbes} T={T} fmt={fmt} loyers={reglages.a.loyers > 0 || reglages.b?.loyers > 0} />
        </div>

        {!replie && (
          <aside className="inspecteur sc-inspecteur" aria-label={T.reglages}>
            <div className="insp-tete">
              <span>{T.reglages}</span>
              <button onClick={() => setReplie(true)} aria-label={T.replier} title={T.replier}>›</button>
            </div>

            {/* Scénarios */}
            <section className="bloc">
              <h3>{T.scenariosTitre}{modifie && <span>{T.modifie}</span>}</h3>
              <ul className="sc-scenarios">
                {SCENARIOS.map((s) => (
                  <li key={s.id}>
                    <button aria-pressed={scen === s.id} onClick={() => choisirScenario(s.id)}>
                      <span>{T.scenarios[s.id].titre}</span>
                      {s.b && <em>{T.aDeux}</em>}
                    </button>
                  </li>
                ))}
              </ul>
              {txtScen && <p className="aide">{txtScen.aide}</p>}
              {modifie && <button className="btn" onClick={() => choisirScenario(scen)}>{T.retablir}</button>}
            </section>

            {/* Réglages de la ville A ou B */}
            <section className="bloc">
              <h3>{T.reglesVille}</h3>
              {comparer && (
                <div className="groupe groupe--plein" role="group" aria-label={T.villeReglee}>
                  {['a', 'b'].map((c) => <button key={c} aria-pressed={cible === c} onClick={() => setCible(c)}>{T.ville(c)}</button>)}
                </div>
              )}

              <Pli titre={T.plis.groupes} ouvert>
                <div className="ligne">
                  <label htmlFor={id('groupes')}>{T.nbGroupes}</label>
                  <select id={id('groupes')} value={G} onChange={(e) => changer('groupes', Number(e.target.value))}>
                    {[2, 3, 4, 5].map((n) => <option key={n} value={n}>{n}</option>)}
                  </select>
                </div>
                <p className="sc-sous-titre">{T.toleranceTitre}</p>
                {GROUPES.slice(0, G).map((g) => (
                  <Curseur key={g} id={id(`tol-${g}`)} couleur={COULEURS_GROUPES[g]} libelle={T.groupeN(g + 1)} valeur={R.tolerance[g]} min={0} max={1} pas={0.01} onChange={(x) => changerCase('tolerance', g, x)} texte={pct(R.tolerance[g])} />
                ))}
                <p className="aide">{T.toleranceAide}</p>
                <label className="option">
                  <input type="checkbox" checked={mixite} onChange={basculerMixite} />
                  {T.mixite}
                </label>
                {mixite && (
                  <>
                    <p className="sc-sous-titre">{T.mixiteTitre}</p>
                    {GROUPES.slice(0, G).map((g) => (
                      <Curseur key={g} id={id(`mix-${g}`)} couleur={COULEURS_GROUPES[g]} libelle={T.groupeN(g + 1)} valeur={R.mixite[g]} min={0.3} max={1} pas={0.01} onChange={(x) => changerCase('mixite', g, x)} texte={pct(R.mixite[g])} />
                    ))}
                    <p className="aide">{T.mixiteAide}</p>
                  </>
                )}
                <p className="sc-sous-titre">{T.partsTitre}</p>
                {GROUPES.slice(0, G).map((g) => (
                  <Curseur key={g} id={id(`part-${g}`)} couleur={COULEURS_GROUPES[g]} libelle={T.groupeN(g + 1)} valeur={R.parts[g]} min={0.1} max={4} pas={0.1} onChange={(x) => changerCase('parts', g, x)} texte={pct(R.parts[g] / sommePoids(R.parts))} />
                ))}
                <Curseur id={id('vides')} libelle={T.vides} valeur={R.vides} min={0.02} max={0.5} pas={0.01} onChange={(x) => changer('vides', x)} texte={pct(R.vides)} />
                <p className="aide">{T.departAide}</p>
              </Pli>

              <Pli titre={T.plis.habitants}>
                <Curseur id={id('bruit')} libelle={T.bruit} valeur={R.bruit} min={0} max={1.5} pas={0.01} onChange={(x) => changer('bruit', x)} texte={f2(R.bruit)} />
                <p className="aide">{T.bruitAide}</p>
                <Curseur id={id('attachement')} libelle={T.attachement} valeur={R.attachement} min={0} max={1} pas={0.01} onChange={(x) => changer('attachement', x)} texte={f2(R.attachement)} />
                <p className="aide">{T.attachementAide}</p>
                <Curseur id={id('renouvellement')} libelle={T.renouvellement} valeur={R.renouvellement} min={0} max={0.1} pas={0.005} onChange={(x) => changer('renouvellement', x)} texte={pct(R.renouvellement)} />
                <p className="aide">{T.renouvellementAide}</p>
                {R.renouvellement > 0 && (
                  <>
                    <p className="sc-sous-titre">{T.arriveesTitre}</p>
                    {GROUPES.slice(0, G).map((g) => {
                      const poids = R.arrivees ?? R.parts
                      return (
                        <Curseur key={g} id={id(`arr-${g}`)} couleur={COULEURS_GROUPES[g]} libelle={T.groupeN(g + 1)} valeur={poids[g]} min={0} max={4} pas={0.1} onChange={(x) => { const t = poids.slice(); t[g] = x; changer('arrivees', t) }} texte={pct(poids[g] / sommePoids(poids))} />
                      )
                    })}
                  </>
                )}
              </Pli>

              <Pli titre={T.plis.logement}>
                <Curseur id={id('loyers')} libelle={T.loyers} valeur={R.loyers} min={0} max={1} pas={0.01} onChange={(x) => changer('loyers', x)} texte={f2(R.loyers)} />
                <p className="aide">{T.loyersAide}</p>
                <Curseur id={id('ecart')} libelle={T.ecartRevenus} valeur={R.ecartRevenus} min={0} max={1.5} pas={0.05} onChange={(x) => changer('ecartRevenus', x)} texte={f2(R.ecartRevenus)} />
                <p className="aide">{T.ecartAide}</p>
                <Curseur id={id('attrait')} libelle={T.attrait} valeur={R.attrait} min={0} max={1} pas={0.01} onChange={(x) => changer('attrait', x)} texte={f2(R.attrait)} />
                <p className="aide">{R.terrain === 'ville' ? T.attraitAide : T.attraitGrille}</p>
                <Curseur id={id('social')} libelle={T.social} valeur={R.social} min={0} max={0.4} pas={0.01} onChange={(x) => changer('social', x)} texte={pct(R.social)} />
                {R.social > 0 && (
                  <label className="option">
                    <input type="checkbox" checked={R.socialRegroupe} onChange={() => changer('socialRegroupe', !R.socialRegroupe)} />
                    {T.socialRegroupe}
                  </label>
                )}
                <p className={R.social > 0 && R.loyers <= 0 ? 'aide aide--erreur' : 'aide'}>{R.social > 0 && R.loyers <= 0 ? T.socialSansLoyers : T.socialAide}</p>
                <Curseur id={id('discrimination')} libelle={T.discrimination} valeur={R.discrimination} min={0} max={1} pas={0.01} onChange={(x) => changer('discrimination', x)} texte={pct(R.discrimination)} />
                {R.discrimination > 0 && (
                  <div className="ligne">
                    <label htmlFor={id('cible')}>{T.cible}</label>
                    <select id={id('cible')} value={Math.min(R.cible, G - 1)} onChange={(e) => changer('cible', Number(e.target.value))}>
                      {GROUPES.slice(0, G).map((g) => <option key={g} value={g}>{T.groupeN(g + 1)}</option>)}
                    </select>
                  </div>
                )}
                <p className="aide">{T.discriminationAide}</p>
              </Pli>

              <Pli titre={T.plis.amis}>
                <Curseur id={id('amis')} libelle={T.amis} valeur={R.amis} min={0} max={1.5} pas={0.01} onChange={(x) => changer('amis', x)} texte={f2(R.amis)} />
                <Curseur id={id('homophilie')} libelle={T.homophilie} valeur={R.homophilie} min={0} max={1} pas={0.01} onChange={(x) => changer('homophilie', x)} texte={pct(R.homophilie)} />
                <p className="aide">{T.amisAide}</p>
              </Pli>
            </section>

            {/* Pinceau */}
            <section className="bloc">
              <h3>{T.pinceau}</h3>
              <div className="sc-outils" role="group" aria-label={T.pinceau}>
                {OUTILS.map((o) => <button key={o} aria-pressed={outil === o} onClick={() => setOutil(o)} title={T.outilsAide[o]}>{T.outils[o]}</button>)}
              </div>
              {outil === 'habitant' && (
                <div className="sc-pinceau-groupes" role="group" aria-label={T.groupePinceau}>
                  {GROUPES.slice(0, reglages.a.groupes).map((g) => (
                    <button key={g} aria-pressed={groupePinceau === g} onClick={() => setGroupePinceau(g)} aria-label={T.groupeN(g + 1)}>
                      <i style={{ background: COULEURS_GROUPES[g] }} />
                    </button>
                  ))}
                </div>
              )}
              <Curseur id={id('rayon')} libelle={T.rayon} valeur={rayon} min={0} max={8} pas={1} onChange={setRayon} texte={fmt(rayon)} />
              <p className="aide">{T.outilsAide[outil]}</p>
            </section>

            {/* Monde */}
            <section className="bloc">
              <h3>{T.monde}</h3>
              <div className="ligne">
                <label htmlFor={id('terrain')}>{T.terrain}</label>
                <select id={id('terrain')} value={reglages.a.terrain} onChange={(e) => changerMonde('terrain', e.target.value)}>
                  {['grille', 'ville'].map((t) => <option key={t} value={t}>{T.terrains[t]}</option>)}
                </select>
              </div>
              <div className="ligne">
                <label htmlFor={id('taille')}>{T.taille}</label>
                <select id={id('taille')} value={reglages.a.taille} onChange={(e) => changerMonde('taille', Number(e.target.value))}>
                  {TAILLES.map((n) => <option key={n} value={n}>{T.tailleN(n, fmt)}</option>)}
                </select>
              </div>
              <p className="aide">{T.terrainsAide[reglages.a.terrain]}</p>
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
          T.etat.tours(fmt(etat.t, { maximumFractionDigits: 1, minimumFractionDigits: 1 })),
          T.etat.habitants(fmt(etat.pop)),
        ]}
        fin={T.etat.vitesse(fmt(etat.vitesse, { maximumFractionDigits: 1 }))}
      />
    </div>
  )
}
