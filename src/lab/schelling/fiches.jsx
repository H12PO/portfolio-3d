import { useEffect, useRef, useState } from 'react'
import { Bloc } from '../commun/Lecture'
import { creerVille, avancer, mesurer } from './moteur'
import { creerRendu } from './rendu'
import { scenario } from './scenarios'

// ============================================================
//  SCHELLING : les fiches des scénarios (onglet Comprendre)
//  Une fiche = la question, les règles, des images avant / après,
//  ce qu'il faut regarder, ce qui se passe et pourquoi, le lien
//  avec la réalité, et un bouton vers l'explorateur.
//  Les images sont calculées dans le navigateur avec le vrai moteur,
//  sur une ville de 60 × 60, seulement quand la fiche devient
//  visible, par tranches de 8 ms pour ne pas bloquer la page.
// ============================================================

const TAILLE = 60
const GRAINE = 7
const TRANCHE_MS = 8

// Pour chaque scénario : tours avant l'image « après », vue des images, mesure affichée en plus
const IMAGES = {
  damier: { tours: 20 },
  seuil: { tours: 20 },
  mixite: { tours: 100, mesure: 'satisfaits' },
  bruit: { tours: 200 },
  revenus: { tours: 40 },
  gentrification: { tours: 40, vue: 'loyers', mesure: 'theilRevenus' },
  social: { tours: 40, vue: 'revenus', mesure: 'theilRevenus' },
  discrimination: { tours: 150 },
  amis: { tours: 120 },
  attachement: { tours: 100 },
  arrivees: { tours: 120 },
  quatre: { tours: 40, mesure: 'minorite' },
}

const horloge = () => performance.now()

// Les images d'une fiche : le départ, puis la ville A (et B) après quelques tours
function Images({ id, T, fmt }) {
  const zone = useRef(null)
  const toiles = useRef([])
  const [mesures, setMesures] = useState(null)   // { depart, apres: [..] | null }, mesures brutes
  const s = scenario(id)
  const reglage = IMAGES[id]
  const vue = reglage.vue ?? s.vue ?? 'groupes'
  const cotes = s.b ? ['a', 'b'] : ['a']
  const F = T.fiche

  useEffect(() => {
    let arret = false
    let minuteur = 0
    const dessinerDans = (toile, v) => {
      if (!toile) return
      const r = creerRendu(toile)
      r.redimensionner()
      r.dessiner([v], vue)
    }
    function calculer() {
      const villes = cotes.map((c) => creerVille({ ...s[c], taille: TAILLE }, GRAINE))
      dessinerDans(toiles.current[0], villes[0])
      const depart = mesurer(villes[0])
      setMesures({ depart, apres: null })
      let fait = 0
      const pas = () => {
        if (arret) return
        const debut = horloge()
        while (fait < reglage.tours && horloge() - debut < TRANCHE_MS) {
          for (const v of villes) avancer(v, 0.25)
          fait += 0.25
        }
        if (fait < reglage.tours) { minuteur = setTimeout(pas, 0); return }
        villes.forEach((v, k) => dessinerDans(toiles.current[k + 1], v))
        setMesures({ depart, apres: villes.map((v) => mesurer(v)) })
      }
      minuteur = setTimeout(pas, 0)
    }
    // on ne calcule que lorsque la fiche approche de l'écran
    const obs = new IntersectionObserver((entrees) => {
      if (entrees.some((e) => e.isIntersecting)) {
        obs.disconnect()
        calculer()
      }
    }, { rootMargin: '200px 0px' })
    obs.observe(zone.current)
    return () => { arret = true; clearTimeout(minuteur); obs.disconnect() }
    // une fiche ne change jamais de scénario
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // les légendes se composent à l'affichage : elles suivent la langue
  const pct = (x) => fmt(x, { style: 'percent', maximumFractionDigits: 0 })
  const decrire = (m) => {
    const lignes = [F.mesures.semblables(pct(m.semblables))]
    if (reglage.mesure === 'satisfaits') lignes.push(F.mesures.satisfaits(pct(m.satisfaits)))
    if (reglage.mesure === 'theilRevenus') lignes.push(F.mesures.theilRevenus(fmt(m.theilRevenus, { maximumFractionDigits: 2, minimumFractionDigits: 2 })))
    if (reglage.mesure === 'minorite') lignes.push(F.mesures.minorite(pct(m.semblablesGroupe[3] ?? 0)))
    return lignes
  }
  const titres = [F.depart, ...cotes.map((c) => (s.b ? F.ville(c, reglage.tours, T.scenarios[id][c]) : F.apres(reglage.tours)))]
  return (
    <figure className="figure figure--large sc-fiche-images" ref={zone}>
      <div className={cotes.length === 2 ? 'sc-trio' : 'sc-paire'}>
        {titres.map((titre, k) => (
          <figure key={k}>
            <canvas ref={(el) => { toiles.current[k] = el }} className="sc-figure-canvas" style={{ aspectRatio: '1' }} aria-label={titre} />
            <figcaption>
              <strong>{titre}</strong>
              {(() => {
                const m = k === 0 ? mesures?.depart : mesures?.apres?.[k - 1]
                if (m) return decrire(m).map((l) => <span key={l}>{l}</span>)
                return <span>{mesures ? F.calcul : ''}</span>
              })()}
            </figcaption>
          </figure>
        ))}
      </div>
      <p className="sc-note">{F.note(T.vuesVille[vue])}</p>
    </figure>
  )
}

/** La fiche complète d'un scénario */
export function Fiche({ id, ctx }) {
  const { T, fmt } = ctx
  const F = T.fiches[id]
  const G = T.fiche
  return (
    <div className="sc-fiche">
      <p className="sc-fiche-question">{F.question}</p>
      <p className="sc-fiche-titre">{G.regles}</p>
      <Bloc bloc={{ liste: F.regles }} ctx={ctx} />
      <Images id={id} T={T} fmt={fmt} />
      <p className="sc-fiche-titre">{G.regarder}</p>
      <Bloc bloc={{ liste: F.regarder }} ctx={ctx} />
      <p className="sc-fiche-titre">{G.pourquoi}</p>
      {F.pourquoi.map((p) => <Bloc key={p} bloc={{ p }} ctx={ctx} />)}
      {F.realite && (
        <>
          <p className="sc-fiche-titre">{G.realite}</p>
          <Bloc bloc={{ p: F.realite }} ctx={ctx} />
        </>
      )}
      <div className="appel">
        <button className="btn-principal" onClick={() => ctx.ouvrir(id)}>{G.ouvrir}</button>
      </div>
    </div>
  )
}
