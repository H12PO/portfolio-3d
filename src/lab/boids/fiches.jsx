import { useEffect, useRef, useState } from 'react'
import { Bloc } from '../commun/Lecture'
import { scenario } from './scenarios'
import { creerRendu2D } from './rendu2d'
import { IMAGES, decoder } from './fiches-calcul'

// ============================================================
//  BOIDS : les fiches des scénarios (onglet Comprendre)
//  Une fiche = la question, les règles, des images, ce qu'il faut
//  regarder, ce qui se passe et pourquoi, le lien avec la réalité,
//  et un bouton vers l'explorateur.
//  Les images ont été calculées à l'avance avec le moteur de
//  l'explorateur (fiches-images.js, chargé une seule fois, à la
//  première fiche qui approche de l'écran) : elles s'affichent aussitôt.
// ============================================================

let chargement = null
const chargerImages = () => (chargement ??= import('./fiches-images').then((mod) => mod.IMAGES_FICHES))

function Images({ id, T, fmt }) {
  const zone = useRef(null)
  const toiles = useRef([])
  const [donnees, setDonnees] = useState(null)   // les images codées de cette fiche
  const conf = IMAGES[id]
  const F = T.fiche
  const vue = conf.vue ?? 'especes'

  // on ne charge les images que lorsque la fiche approche de l'écran
  useEffect(() => {
    let arret = false
    const obs = new IntersectionObserver((entrees) => {
      if (!entrees.some((e) => e.isIntersecting)) return
      obs.disconnect()
      chargerImages().then((toutes) => { if (!arret) setDonnees(toutes[id]) })
    }, { rootMargin: '400px 0px' })
    obs.observe(zone.current)
    return () => { arret = true; obs.disconnect() }
  }, [id])

  // dessin, puis à nouveau si la taille des images change
  useEffect(() => {
    if (!donnees) return
    const images = donnees.map((c) => decoder(c, vue))
    const dessiner = () => {
      images.forEach((img, k) => {
        const toile = toiles.current[k]
        if (!toile) return
        const r = creerRendu2D(toile)
        r.redimensionner()
        r.dessiner(img, { vue, especes: donnees[k].especes })
      })
    }
    dessiner()
    const obs = new ResizeObserver(dessiner)
    toiles.current.forEach((t) => t && obs.observe(t))
    return () => obs.disconnect()
  }, [donnees, vue])

  // les légendes se composent à l'affichage : elles suivent la langue
  const dec = (x) => fmt(x, { maximumFractionDigits: 2, minimumFractionDigits: 2 })
  const decrire = (m) => {
    const lignes = [F.mesures.polarisation(dec(m.polarisation))]
    if (conf.mesure === 'rotation') lignes.push(F.mesures.rotation(dec(m.rotation)))
    if (conf.mesure === 'captures') lignes.push(F.mesures.captures(fmt(m.captures)))
    if (conf.mesure === 'dispersion') lignes.push(F.mesures.dispersion(dec(m.dispersion)))
    else lignes.push(F.mesures.groupes(fmt(m.groupes)))
    if (conf.cap) lignes.push(F.mesures.cap(fmt(Math.round(m.cap))))
    return lignes
  }
  const titre = (img) => (img.etiquette ? T.fiches[id].images[img.etiquette] : img.pas === 0 ? F.depart : F.apres(img.pas, scenario(img.s).r.modele))
  const classe = conf.images.length === 3 ? 'bo-trio' : 'bo-paire'
  return (
    <figure className="figure figure--large bo-fiche-images" ref={zone}>
      <div className={classe}>
        {conf.images.map((img, k) => (
          <figure key={k}>
            <canvas ref={(el) => { toiles.current[k] = el }} className="bo-figure-canvas" style={{ aspectRatio: '1' }} aria-label={titre(img)} />
            <figcaption>
              <strong>{titre(img)}</strong>
              {donnees?.[k] ? decrire(donnees[k].mesure).map((l) => <span key={l}>{l}</span>) : <span>{F.calcul}</span>}
            </figcaption>
          </figure>
        ))}
      </div>
      <p className="bo-note">{F.note(T.vues3[vue])}</p>
    </figure>
  )
}

/** La fiche complète d'un scénario */
export function Fiche({ id, ctx }) {
  const { T, fmt } = ctx
  const F = T.fiches[id]
  const G = T.fiche
  return (
    <div className="bo-fiche">
      <p className="bo-fiche-question">{F.question}</p>
      <p className="bo-fiche-titre">{G.regles}</p>
      <Bloc bloc={{ liste: F.regles }} ctx={ctx} />
      <Images id={id} T={T} fmt={fmt} />
      <p className="bo-fiche-titre">{G.regarder}</p>
      <Bloc bloc={{ liste: F.regarder }} ctx={ctx} />
      <p className="bo-fiche-titre">{G.pourquoi}</p>
      {F.pourquoi.map((p) => <Bloc key={p} bloc={{ p }} ctx={ctx} />)}
      {F.realite && (
        <>
          <p className="bo-fiche-titre">{G.realite}</p>
          <Bloc bloc={{ p: F.realite }} ctx={ctx} />
        </>
      )}
      <div className="appel">
        {(F.ouvrir ?? [id]).map((s) => (
          <button key={s} className="btn-principal" onClick={() => ctx.ouvrir(s)}>{(F.ouvrir ? G.ouvrirNom(T.scenarios[s].titre) : G.ouvrir)}</button>
        ))}
      </div>
    </div>
  )
}
