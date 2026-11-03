import { useEffect, useImperativeHandle, useRef, useState } from 'react'
import BarreEtat from '../BarreEtat'
import Crans, { IconeLecture, IconePause } from '../commun/Crans'
import { creerMoteur, PALETTES } from './moteur'
import { REGLES, CREATURES, PLANEURS_SL } from './bestiaire'
import { MODELES, TAILLES, preparer, muter, lireAnneaux } from './modeles'
import Courbes from './Courbes'

// ============================================================
//  LENIA : l'explorateur
//  Le moteur (moteur.js) vit dans une référence ; la boucle
//  d'animation le fait avancer et dessine. React ne gère que les
//  réglages : modèle, créature, règle (éditable), mutants.
// ============================================================

const VITESSES = [1 / 8, 1 / 4, 1 / 2, 1, 2]   // pas de simulation par image (moins de 1 : un pas toutes les n images)
const VITESSE_DEFAUT = 2
const N_MUTANT = 128
const PREMIERE = { classique: 'orbium', etendu: 'limus', smooth: 'smooth_planeurs', flow: 'flow_cellules' }
const REGLES_LIBRES = { smooth: ['smooth_planeurs', 'smooth', 'smooth_bouillon', 'smooth_vers'], flow: ['flow_cellules', 'flow_division', 'flow_essaim', 'flow_pointilles'] }
const FORCES = { petite: 0.04, moyenne: 0.08, grande: 0.16 }

// Le temps qui passe et le hasard, hors des composants (règle de pureté de React)
const horloge = () => performance.now()
const hasard = () => Math.random()
const cloner = (r) => structuredClone(r)

const creature = (id) => CREATURES.find((c) => c.id === id)
const avecCreatures = (modele) => modele === 'classique' || modele === 'etendu'

// Une goutte de matière au hasard, de rayon r (SmoothLife, Flow Lenia, mutants sans créature)
function goutte(r, C, plein = false) {
  const D = 2 * r + 1
  const canaux = Array.from({ length: C }, () => new Float32Array(D * D))
  for (let y = 0; y < D; y++) {
    for (let x = 0; x < D; x++) {
      const d = Math.hypot(x - r, y - r) / r
      if (d > 1) continue
      for (const c of canaux) c[y * D + x] = plein ? 1 : hasard() * (hasard() < 0.85 ? 1 : 0)
    }
  }
  return { w: D, h: D, canaux }
}

// Toute une soupe : des carrés ou des disques de matière semés au hasard
function soupe(N, regle) {
  const d = new Float32Array(N * N * 4)
  const smooth = regle.modele === 'smooth'
  const taille = smooth ? regle.ra : regle.modele === 'flow' ? 18 : Math.round((regle.R ?? 13) * 1.2)
  const nb = smooth ? Math.round(((N * N) / (taille * taille)) * 0.6) : Math.round(((N * N) / (taille * taille)) * 0.12)
  for (let k = 0; k < nb; k++) {
    const x0 = Math.floor(hasard() * N)
    const y0 = Math.floor(hasard() * N)
    for (let y = 0; y < taille; y++) {
      for (let x = 0; x < taille; x++) {
        const i = (((y0 + y) % N) * N + ((x0 + x) % N)) * 4
        for (let c = 0; c < regle.C; c++) d[i + c] = smooth ? 1 : hasard()
        d[i + 3] = 1
      }
    }
  }
  return d
}

// SmoothLife : un planeur, mis à l'échelle du rayon (les motifs sont pris pour ra = 21)
const planeur = (regle, angle) => preparer(PLANEURS_SL[regle.planeur], angle, regle.ra / 21)

// Écart entre deux points d'un monde torique de côté N
const ecart = (a, b, N) => Math.hypot(...[a[0] - b[0], a[1] - b[1]].map((d) => (((d % N) + 1.5 * N) % N) - N / 2))

// SmoothLife : une volée de planeurs semés au hasard, sans se toucher.
// En escadrille, ils partent tous dans la même direction et ne se croisent jamais.
function semerPlaneurs(mo, m) {
  const r = m.regle
  const N = m.N
  const nb = Math.max(1, Math.round((N * N) / (r.ra * r.ra * 30)))
  const cap = hasard() * 2 * Math.PI
  const places = []
  for (let essai = 0; essai < 500 && places.length < nb; essai++) {
    const p = [hasard() * N, hasard() * N]
    if (places.some((q) => ecart(p, q, N) < 3.2 * r.ra)) continue
    places.push(p)
    const motif = planeur(r, r.escadrille ? cap : hasard() * 2 * Math.PI)
    mo.poser(m, motif, p[0] - motif.w / 2, p[1] - motif.h / 2)
  }
}

// Un curseur de l'éditeur
function Curseur({ id, libelle, valeur, min, max, pas, onChange, texte }) {
  return (
    <div className="ligne">
      <label htmlFor={id}>{libelle}</label>
      <div className="curseur">
        <input id={id} type="range" min={min} max={max} step={pas} value={valeur} onChange={(e) => onChange(Number(e.target.value))} />
        <output htmlFor={id}>{texte}</output>
      </div>
    </div>
  )
}

// Poids h d'une nouvelle espèce (Flow Lenia)
const espece = (n) => Array.from({ length: n }, () => 0.05 + 0.95 * hasard())

export default function Atelier({ visible, T, ref }) {
  const canvasRef = useRef(null)
  const moteur = useRef(null)
  const monde = useRef(null)
  const mutantsRef = useRef(null)          // { mondes: [4], regles: [4], m0: [4] }
  const cadreRef = useRef([0, 0, 1, 1])
  const regleEnAttente = useRef(null)
  const opts = useRef({})

  const [erreur, setErreur] = useState(null)
  const [modele, setModele] = useState('classique')
  const [choix, setChoix] = useState('orbium')       // créature (classique, étendu) ou règle (smooth, flow)
  const [regle, setRegle] = useState(() => cloner(REGLES.orbium))
  const [modifiee, setModifiee] = useState(false)
  const [taille, setTaille] = useState(256)
  const [palette, setPalette] = useState('lenia')
  const [vue, setVue] = useState('etat')
  const [pause, setPause] = useState(false)
  const [vitesse, setVitesse] = useState(VITESSE_DEFAUT)
  const [rotation, setRotation] = useState(true)
  const [especes, setEspeces] = useState(false)
  const [noyau, setNoyau] = useState(0)
  const [force, setForce] = useState('moyenne')
  const [mutants, setMutants] = useState(null)       // null, ou { regles, verdicts }
  const [stats, setStats] = useState({ t: 0, masse: 0, pas: 0 })
  const [replie, setReplie] = useState(false)

  useEffect(() => {
    Object.assign(opts.current, { pause, vitesse, vue, palette, visible, taille, especes, rotation })
  }, [pause, vitesse, vue, palette, visible, taille, especes, rotation])

  /* ---------- Monde ---------- */

  // Pose une créature (ou une goutte) en (x, y), coordonnées du monde ; centre par défaut
  function poserDans(m, cible, x = m.N / 2, y = m.N / 2, angle = null) {
    const moteurActif = moteur.current
    if (!moteurActif) return
    const r = m.regle
    let motif
    let h = null
    if (cible && avecCreatures(r.modele)) {
      const a = angle ?? (opts.current.rotation ? hasard() * 2 * Math.PI : 0)
      motif = preparer(cible.cellules, a)
    } else if (r.modele === 'smooth' && r.planeur) {
      motif = planeur(r, hasard() * 2 * Math.PI)
    } else {
      motif = goutte(r.modele === 'smooth' ? Math.round(r.ra * 0.9) : r.modele === 'flow' ? 16 : 12, r.C, r.modele === 'smooth')
      if (m.especes) h = espece(r.noyaux.length)
    }
    moteurActif.poser(m, motif, x - motif.w / 2, y - motif.h / 2, h)
  }

  // Recommence le monde principal avec une règle, et une créature ou une soupe
  function recommencer(r, c, { taille: N = opts.current.taille, especesOn = opts.current.especes } = {}) {
    const mo = moteur.current
    if (!mo) return
    let m = monde.current
    if (!m || m.N !== N) {
      if (m) mo.liberer(m)
      m = mo.creerMonde(N)
      monde.current = m
    }
    mo.activerEspeces(m, r.modele === 'flow' && especesOn)
    mo.regler(m, r)
    mo.effacer(m)
    if (c) poserDans(m, c, N / 2, N / 2, 0)
    else if (r.modele === 'flow' && m.especes) {
      // quatre espèces, chacune dans son coin
      for (const [fx, fy] of [[0.27, 0.27], [0.73, 0.27], [0.27, 0.73], [0.73, 0.73]]) poserDans(m, null, N * fx, N * fy)
    } else if (r.modele === 'flow') poserDans(m, null)
    else if (r.planeur) semerPlaneurs(mo, m)
    else mo.remplacer(m, soupe(N, r))
    regleEnAttente.current = null
  }

  /* ---------- Moteur et boucle d'animation ---------- */
  useEffect(() => {
    const canvas = canvasRef.current
    const mo = creerMoteur(canvas)
    if (mo.erreur) {
      const signal = requestAnimationFrame(() => setErreur(mo))
      return () => cancelAnimationFrame(signal)
    }
    moteur.current = mo
    recommencer(cloner(REGLES.orbium), creature('orbium'), { taille: 256, especesOn: false })

    let raf = 0
    let derniereMesure = 0
    let pasCompte = 0
    let credit = 0 // fraction de pas accumulée, pour les vitesses inférieures à 1 pas par image
    let tCompte = horloge()
    const boucle = (t) => {
      raf = requestAnimationFrame(boucle)
      const o = opts.current
      if (!o.visible) return
      if (mo.perdu()) {
        cancelAnimationFrame(raf)
        setErreur({ erreur: 'perdu' })
        return
      }
      const m = monde.current
      // Une règle éditée s'applique au plus une fois par image
      if (regleEnAttente.current && m) {
        mo.regler(m, regleEnAttente.current)
        regleEnAttente.current = null
      }
      const mut = mutantsRef.current
      if (!o.pause) {
        credit += VITESSES[o.vitesse]
        const n = Math.floor(credit)
        credit -= n
        for (let i = 0; i < n; i++) {
          if (mut) for (const mm of mut.mondes) mo.pas(mm)
          else if (m) mo.pas(m)
        }
        pasCompte += n
      }
      const [W, H] = mo.redimensionner()
      if (mut) {
        // quatre mutants en grille 2 × 2 : 0 et 1 en haut
        mut.mondes.forEach((mm, i) => {
          const qw = W / 2
          const qh = H / 2
          const s = Math.min(qw, qh) * 0.94
          const x = (i % 2) * qw + (qw - s) / 2
          const y = (i < 2 ? qh : 0) + (qh - s) / 2
          mo.dessiner(mm, [x, y, s, s], { palette: o.palette, effacerFond: i === 0 })
        })
      } else if (m) {
        const s = Math.min(W, H)
        const cadre = [(W - s) / 2, (H - s) / 2, s, s]
        cadreRef.current = cadre
        mo.dessiner(m, cadre, { vue: o.vue, palette: o.palette })
      }
      if (t - derniereMesure > 400) {
        const dt = (horloge() - tCompte) / 1000
        const vitesseReelle = dt > 0 ? pasCompte / dt : 0
        pasCompte = 0
        tCompte = horloge()
        derniereMesure = t
        if (mut) {
          const verdicts = mut.mondes.map((mm, i) => {
            const masse = mo.mesurer(mm).masse
            const r = masse / Math.max(1e-6, mut.m0[i])
            if (mm.regle.modele === 'flow') return 'conserve'
            return r < 0.15 ? 'eteint' : r > 4 ? 'explose' : 'vivant'
          })
          setMutants((x) => (x ? { ...x, verdicts } : x))
          setStats({ t: mut.mondes[0].t, masse: 0, pas: vitesseReelle })
        } else if (m) {
          setStats({ t: m.t, masse: mo.mesurer(m).masse, pas: vitesseReelle })
        }
      }
    }
    raf = requestAnimationFrame(boucle)

    return () => {
      cancelAnimationFrame(raf)
      if (mutantsRef.current) for (const mm of mutantsRef.current.mondes) mo.liberer(mm)
      mutantsRef.current = null
      if (monde.current) mo.liberer(monde.current)
      monde.current = null
      mo.detruire()
      moteur.current = null
    }
    // La boucle lit tout par des références : elle ne démarre qu'une fois
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  /* ---------- Actions ---------- */

  function fermerMutants() {
    const mut = mutantsRef.current
    if (mut && moteur.current) for (const mm of mut.mondes) moteur.current.liberer(mm)
    mutantsRef.current = null
    setMutants(null)
  }

  function choisirModele(id) {
    fermerMutants()
    setModele(id)
    setVitesse(VITESSE_DEFAUT)
    choisir(PREMIERE[id], id)
  }

  // Une créature du bestiaire, ou une règle (SmoothLife, Flow Lenia)
  function choisir(id, mod = modele) {
    fermerMutants()
    setChoix(id)
    setNoyau(0)
    setModifiee(false)
    if (avecCreatures(mod)) {
      const c = creature(id)
      const memeRegle = monde.current?.regle && !modifiee && c.regle === creature(choix)?.regle && mod === modele
      if (memeRegle) {
        // même règle (l'aquarium) : on ajoute la créature, au hasard, sans effacer
        const m = monde.current
        poserDans(m, c, hasard() * m.N, hasard() * m.N)
        return
      }
      const r = cloner(REGLES[c.regle])
      setRegle(r)
      recommencer(r, c)
    } else {
      const r = cloner(REGLES[id])
      setRegle(r)
      recommencer(r, null)
      // SmoothLife en temps discret saute vite : chaque règle a sa vitesse conseillée
      if (r.modele === 'smooth') setVitesse(r.vitesse ?? VITESSE_DEFAUT)
    }
    setPause(false)
  }

  function changerTaille(N) {
    setTaille(N)
    opts.current.taille = N
    recommencer(regle, avecCreatures(modele) ? creature(choix) : null, { taille: N })
  }

  function basculerEspeces() {
    const oui = !especes
    setEspeces(oui)
    opts.current.especes = oui
    recommencer(regle, null, { especesOn: oui })
  }

  function semer() {
    const m = monde.current
    if (!m || !moteur.current) return
    if (m.regle.modele === 'flow') {
      for (let k = 0; k < 6; k++) poserDans(m, null, hasard() * m.N, hasard() * m.N)
      return
    }
    if (m.regle.modele === 'smooth' && m.regle.planeur) {
      // une nouvelle volée de planeurs, dans un monde vide
      moteur.current.effacer(m)
      semerPlaneurs(moteur.current, m)
      return
    }
    moteur.current.remplacer(m, soupe(m.N, m.regle))
  }

  function toutEffacer() {
    if (monde.current && moteur.current) moteur.current.effacer(monde.current)
  }

  function retablir() {
    const r = cloner(REGLES[avecCreatures(modele) ? creature(choix).regle : choix])
    setRegle(r)
    setModifiee(false)
    regleEnAttente.current = r
  }

  // Éditeur : une modification de la règle, appliquée à l'image suivante
  function modifier(f) {
    const r = cloner(regle)
    f(r)
    setRegle(r)
    setModifiee(true)
    regleEnAttente.current = r
  }

  /* ---------- Mutants ---------- */

  function nouvellePortee(base = regle) {
    const mo = moteur.current
    if (!mo) return
    if (mutantsRef.current) for (const mm of mutantsRef.current.mondes) mo.liberer(mm)
    const regles = Array.from({ length: 4 }, () => muter(base, hasard, FORCES[force]))
    const c = avecCreatures(base.modele) ? creature(choix) : null
    const mondes = regles.map((r) => {
      const m = mo.creerMonde(N_MUTANT)
      mo.regler(m, r)
      mo.effacer(m)
      if (c) poserDans(m, c, N_MUTANT / 2, N_MUTANT / 2, 0)
      else if (r.modele === 'smooth' && r.planeur) semerPlaneurs(mo, m)
      else if (r.modele === 'smooth') mo.remplacer(m, soupe(N_MUTANT, r))
      else poserDans(m, null)
      return m
    })
    const m0 = mondes.map((m) => mo.mesurer(m).masse)
    mutantsRef.current = { mondes, regles, m0 }
    setMutants({ regles, verdicts: regles.map(() => 'vivant') })
    setPause(false)
  }

  function garder(i) {
    const r = mutants.regles[i]
    fermerMutants()
    setRegle(r)
    setModifiee(true)
    recommencer(r, avecCreatures(r.modele) ? creature(choix) : null)
  }

  /* ---------- Clic dans le monde : poser ---------- */

  function surClic(e) {
    const m = monde.current
    if (!m || mutantsRef.current) return
    const canvas = canvasRef.current
    const rect = canvas.getBoundingClientRect()
    const px = ((e.clientX - rect.left) / rect.width) * canvas.width
    const py = canvas.height - ((e.clientY - rect.top) / rect.height) * canvas.height
    const [x0, y0, w, h] = cadreRef.current
    const x = ((px - x0) / w) * m.N
    const y = ((py - y0) / h) * m.N
    if (x < 0 || y < 0 || x > m.N || y > m.N) return
    poserDans(m, avecCreatures(m.regle.modele) ? creature(choix) : null, x, y)
  }

  useImperativeHandle(ref, () => ({
    // Depuis les onglets de lecture : ouvrir une créature ou une règle dans l'explorateur
    ouvrir(id) {
      const c = creature(id)
      const mod = c ? c.modele : REGLES[id]?.modele
      if (!mod) return
      fermerMutants()
      setModele(mod)
      setChoix(id)
      setNoyau(0)
      setModifiee(false)
      const r = cloner(REGLES[c ? c.regle : id])
      setRegle(r)
      recommencer(r, c ?? null)
      setVitesse(r.vitesse ?? VITESSE_DEFAUT)
      setPause(false)
    },
  }))

  /* ---------- Affichage ---------- */
  const fmt = (n, o) => n.toLocaleString(T.nombre, o)
  const f2 = (v) => fmt(v, { maximumFractionDigits: 3 })
  const k = regle.noyaux?.[noyau] ?? regle.noyaux?.[0]

  if (erreur) {
    return (
      <div className="atelier" hidden={!visible}>
        <div className="ln-erreur">
          <h2>{T.erreurs.titre}</h2>
          <p>{T.erreurs[erreur.erreur] ?? T.erreurs.shader}</p>
          {erreur.detail && <pre>{erreur.detail}</pre>}
        </div>
        <canvas ref={canvasRef} hidden />
      </div>
    )
  }

  const liste = avecCreatures(modele) ? CREATURES.filter((c) => c.modele === modele) : REGLES_LIBRES[modele].map((id) => ({ id }))
  const nomChoix = avecCreatures(modele) ? T.creatures[choix]?.[0] ?? creature(choix)?.nom : T.reglesLibres[choix]?.[0]

  return (
    <div className="atelier" hidden={!visible}>
      <div className="atelier-corps" data-replie={replie}>
        <div className="plan">
          <div className="plan-outils">
            <div className="groupe" role="group" aria-label={T.modele}>
              {MODELES.map((id) => (
                <button key={id} aria-pressed={modele === id} onClick={() => choisirModele(id)} title={T.modelesAide[id]}>{T.modeles[id]}</button>
              ))}
            </div>
            <div className="plan-outils-droite">
              {modele === 'classique' && !mutants && (
                <div className="groupe" role="group" aria-label={T.vue}>
                  {['etat', 'potentiel', 'croissance'].map((v) => (
                    <button key={v} aria-pressed={vue === v} onClick={() => setVue(v)} title={T.vuesAide[v]}>{T.vuesMonde[v]}</button>
                  ))}
                </div>
              )}
              {replie && <button className="btn" onClick={() => setReplie(false)}>‹ {T.reglages}</button>}
            </div>
          </div>

          <div className="cadre ln-cadre">
            <canvas ref={canvasRef} className="cadre-canvas ln-canvas" onPointerDown={surClic} aria-label={T.toile(T.modeles[modele], nomChoix ?? '')} />
            {mutants && (
              <div className="ln-mutants">
                {mutants.regles.map((r, i) => (
                  <div key={i} className="ln-mutant">
                    <span className="ln-mutant-titre">{T.mutations.mutant(i + 1)} · <strong data-verdict={mutants.verdicts[i]}>{T.mutations.verdicts[mutants.verdicts[i]]}</strong></span>
                    <button className="btn" onClick={() => garder(i)}>{T.mutations.garder}</button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="transport">
            <div className="transport-boutons">
              <button className="btn-principal" onClick={() => setPause(!pause)}>
                {pause ? <IconeLecture /> : <IconePause />}
                {pause ? T.reprendre : T.pause}
              </button>
              <button className="btn" onClick={() => {
                const mo = moteur.current
                if (!mo) return
                if (mutantsRef.current) for (const mm of mutantsRef.current.mondes) mo.pas(mm)
                else if (monde.current) mo.pas(monde.current)
                setPause(true)
              }}>{T.unPas}</button>
              {!mutants && (regle.modele === 'smooth' && regle.planeur
                ? <button className="btn" onClick={semer} title={T.voleeAide}>{T.volee}</button>
                : <button className="btn" onClick={semer} title={T.soupeAide}>{T.soupe}</button>)}
              {!mutants && <button className="btn" onClick={toutEffacer}>{T.vider}</button>}
              {mutants && <button className="btn" onClick={fermerMutants}>{T.mutations.fermer}</button>}
            </div>
            <Crans valeur={vitesse} max={VITESSES.length - 1} onChange={setVitesse} libelle={T.vitesse} texte={T.pasParImage(VITESSES[vitesse])} />
          </div>
        </div>

        {!replie && (
          <aside className="inspecteur" aria-label={T.reglages}>
            <div className="insp-tete">
              <span>{T.reglages}</span>
              <button onClick={() => setReplie(true)} aria-label={T.replier} title={T.replier}>›</button>
            </div>

            {/* Bestiaire */}
            <section className="bloc">
              <h3>{avecCreatures(modele) ? T.bestiaire : T.regles}</h3>
              <p className="aide">{T.modelesAide[modele]}</p>
              <ul className="ln-bestiaire">
                {liste.map((c) => {
                  const t = avecCreatures(modele) ? T.creatures[c.id] : T.reglesLibres[c.id]
                  return (
                    <li key={c.id}>
                      <button aria-pressed={choix === c.id} onClick={() => choisir(c.id)} title={t?.[1]}>
                        <span>{t?.[0] ?? c.nom}</span>
                        {c.nom && t?.[0] !== c.nom && <em>{c.nom}</em>}
                      </button>
                    </li>
                  )
                })}
              </ul>
              {T.creatures[choix]?.[1] && avecCreatures(modele) && <p className="aide">{T.creatures[choix][1]}</p>}
              {!avecCreatures(modele) && T.reglesLibres[choix]?.[1] && <p className="aide">{T.reglesLibres[choix][1]}</p>}
              <p className="aide">{avecCreatures(modele) ? T.aideClic.creature : regle.modele === 'smooth' && regle.planeur ? T.aideClic.planeur : T.aideClic.goutte}</p>
              {avecCreatures(modele) && (
                <label className="option">
                  <input type="checkbox" checked={rotation} onChange={() => { setRotation(!rotation); opts.current.rotation = !rotation }} />
                  {T.rotation}
                </label>
              )}
              {modele === 'flow' && (
                <>
                  <label className="option">
                    <input type="checkbox" checked={especes} onChange={basculerEspeces} />
                    {T.especes}
                  </label>
                  <p className="aide">{T.especesAide}</p>
                </>
              )}
            </section>

            {/* Règle */}
            <section className="bloc">
              <h3>{T.regle}<span>{modifiee ? T.regleModifiee : T.regleOrigine}</span></h3>
              <Courbes regle={regle} noyau={noyau} T={T} fmt={fmt} />

              {regle.modele === 'smooth' ? (
                <>
                  <div className="ligne">
                    <label htmlFor="ln-temps">{T.smooth.temps}</label>
                    <select id="ln-temps" value={regle.mode ?? 0} onChange={(e) => modifier((r) => { r.mode = Number(e.target.value); r.dt = r.dt ?? 0.1 })}>
                      {T.smooth.modes.map((t, i) => <option key={t} value={i}>{t}</option>)}
                    </select>
                  </div>
                  {(regle.mode ?? 0) > 0 && (
                    <Curseur id="ln-dt" libelle={T.dt} valeur={regle.dt} min={0.02} max={0.5} pas={0.01} onChange={(v) => modifier((r) => { r.dt = v })} texte={f2(regle.dt)} />
                  )}
                  <Curseur id="ln-ra" libelle={T.ra} valeur={regle.ra} min={6} max={40} pas={1} onChange={(v) => modifier((r) => { r.ra = v })} texte={fmt(regle.ra)} />
                  {['b1', 'b2', 'd1', 'd2'].map((cle) => (
                    <Curseur key={cle} id={`ln-${cle}`} libelle={T.smooth[cle]} valeur={regle[cle]} min={0} max={1} pas={0.001} onChange={(v) => modifier((r) => { r[cle] = v })} texte={f2(regle[cle])} />
                  ))}
                  <Curseur id="ln-an" libelle={T.smooth.an} valeur={regle.an} min={0.002} max={0.2} pas={0.001} onChange={(v) => modifier((r) => { r.an = v })} texte={f2(regle.an)} />
                  <Curseur id="ln-am" libelle={T.smooth.am} valeur={regle.am} min={0.01} max={0.5} pas={0.001} onChange={(v) => modifier((r) => { r.am = v })} texte={f2(regle.am)} />
                </>
              ) : (
                <>
                  {regle.noyaux.length > 1 && (
                    <div className="ligne">
                      <label htmlFor="ln-noyau">{T.noyau}</label>
                      <select id="ln-noyau" value={noyau} onChange={(e) => setNoyau(Number(e.target.value))}>
                        {regle.noyaux.map((kk, i) => <option key={i} value={i}>{T.noyauDe(i + 1, kk.c0 ?? 0, kk.c1 ?? 0, regle.C)}</option>)}
                      </select>
                    </div>
                  )}
                  <Curseur id="ln-R" libelle={T.R} valeur={regle.R} min={regle.modele === 'flow' ? 2 : 2} max={regle.modele === 'flow' ? 25 : 40} pas={regle.modele === 'flow' ? 0.1 : 1} onChange={(v) => modifier((r) => { r.R = v })} texte={fmt(regle.R, { maximumFractionDigits: 1 })} />
                  {regle.modele === 'flow'
                    ? <Curseur id="ln-dt" libelle={T.dt} valeur={regle.dt} min={0.05} max={0.5} pas={0.01} onChange={(v) => modifier((r) => { r.dt = v })} texte={f2(regle.dt)} />
                    : <Curseur id="ln-T" libelle={T.T} valeur={regle.T} min={1} max={40} pas={1} onChange={(v) => modifier((r) => { r.T = v })} texte={`1/${fmt(regle.T)}`} />}
                  <Curseur id="ln-m" libelle={T.m} valeur={k.m} min={0.01} max={0.6} pas={0.001} onChange={(v) => modifier((r) => { r.noyaux[noyau].m = v })} texte={f2(k.m)} />
                  <Curseur id="ln-s" libelle={T.s} valeur={k.s} min={0.001} max={0.2} pas={0.0005} onChange={(v) => modifier((r) => { r.noyaux[noyau].s = v })} texte={f2(k.s)} />
                  {(regle.modele !== 'classique') && (
                    <Curseur id="ln-h" libelle={T.h} valeur={k.h ?? 1} min={0.01} max={1} pas={0.01} onChange={(v) => modifier((r) => { r.noyaux[noyau].h = v })} texte={f2(k.h ?? 1)} />
                  )}
                  {regle.modele === 'etendu' && (
                    <Curseur id="ln-r" libelle={T.r} valeur={k.r ?? 1} min={0.2} max={1} pas={0.01} onChange={(v) => modifier((r) => { r.noyaux[noyau].r = v })} texte={f2(k.r ?? 1)} />
                  )}
                  {regle.modele !== 'flow' && (
                    <div className="ln-anneaux">
                      <span className="ln-anneaux-titre">{T.anneaux}</span>
                      {lireAnneaux(k.b).map((b, i, tous) => (
                        <div key={i} className="curseur">
                          <input type="range" min={0} max={1} step={1 / 12} value={b} aria-label={T.anneau(i + 1)} onChange={(e) => modifier((r) => {
                            const bb = lireAnneaux(r.noyaux[noyau].b).slice()
                            bb[i] = Number(e.target.value)
                            r.noyaux[noyau].b = bb
                          })} />
                          <output>{f2(b)}</output>
                          {tous.length > 1 && <button className="btn ln-petit" onClick={() => modifier((r) => { r.noyaux[noyau].b = lireAnneaux(r.noyaux[noyau].b).filter((_, j) => j !== i) })} aria-label={T.retirerAnneau}>−</button>}
                        </div>
                      ))}
                      {lireAnneaux(k.b).length < 4 && <button className="btn ln-petit" onClick={() => modifier((r) => { r.noyaux[noyau].b = [...lireAnneaux(r.noyaux[noyau].b), 0.5] })}>{T.ajouterAnneau}</button>}
                    </div>
                  )}
                  {regle.modele === 'classique' && (
                    <>
                      <div className="ligne">
                        <label htmlFor="ln-kn">{T.coeur}</label>
                        <select id="ln-kn" value={k.kn ?? 1} onChange={(e) => modifier((r) => { r.noyaux[0].kn = Number(e.target.value) })}>
                          {T.coeurs.map((t, i) => <option key={t} value={i + 1}>{t}</option>)}
                        </select>
                      </div>
                      <div className="ligne">
                        <label htmlFor="ln-gn">{T.croissanceType}</label>
                        <select id="ln-gn" value={regle.gn ?? 1} onChange={(e) => modifier((r) => { r.gn = Number(e.target.value) })}>
                          {T.croissances.map((t, i) => <option key={t} value={i + 1}>{t}</option>)}
                        </select>
                      </div>
                    </>
                  )}
                </>
              )}
              {modifiee && <button className="btn" onClick={retablir}>{T.retablir}</button>}
            </section>

            {/* Mutations */}
            <section className="bloc">
              <h3>{T.mutations.titre}</h3>
              <p className="aide">{T.mutations.aide}</p>
              <div className="groupe groupe--plein" role="group" aria-label={T.mutations.force}>
                {Object.keys(FORCES).map((f) => <button key={f} aria-pressed={force === f} onClick={() => setForce(f)}>{T.mutations.forces[f]}</button>)}
              </div>
              <div className="boutons-ligne">
                <button className="btn-principal" onClick={() => nouvellePortee()}>{mutants ? T.mutations.portee : T.mutations.voir}</button>
                {mutants && <button className="btn" onClick={fermerMutants}>{T.mutations.fermer}</button>}
              </div>
            </section>

            {/* Monde */}
            <section className="bloc">
              <h3>{T.monde}</h3>
              <div className="ligne">
                <label htmlFor="ln-taille">{T.taille}</label>
                <select id="ln-taille" value={taille} onChange={(e) => changerTaille(Number(e.target.value))}>
                  {TAILLES.map((n) => <option key={n} value={n}>{T.tailleN(n)}</option>)}
                </select>
              </div>
              {(regle.C === 1 || regle.modele === 'flow') && (
                <div className="ligne">
                  <label htmlFor="ln-palette">{T.palette}</label>
                  <select id="ln-palette" value={palette} onChange={(e) => setPalette(e.target.value)}>
                    {Object.keys(PALETTES).map((p) => <option key={p} value={p}>{T.palettes[p]}</option>)}
                  </select>
                </div>
              )}
              <p className="aide">{T.tailleAide}</p>
            </section>
          </aside>
        )}
      </div>

      <BarreEtat
        statut={pause ? T.statut.pause : T.statut.enCours}
        actif={!pause}
        elements={[
          T.modeles[modele],
          nomChoix,
          T.etat.temps(fmt(stats.t, { maximumFractionDigits: 1, minimumFractionDigits: 1 })),
          !mutants && T.etat.masse(fmt(stats.masse, { maximumFractionDigits: 0 })),
        ]}
        fin={T.etat.vitesse(fmt(Math.round(stats.pas)))}
      />
    </div>
  )
}
