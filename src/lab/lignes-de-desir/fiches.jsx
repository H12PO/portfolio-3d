import { useEffect, useRef, useState } from 'react'
import { Bloc } from '../commun/Lecture'
import { creerRendu2D } from './rendu2d'
import { IMAGES, decoder } from './fiches-calcul'

// ============================================================
//  LIGNES DE DÉSIR : les fiches des scénarios (onglet Comprendre)
//  Une fiche = la question, les règles, des images, ce qu'il faut
//  regarder, ce qui se passe et pourquoi, le lien avec la réalité,
//  et un bouton vers l'explorateur.
//  Les images ont été calculées à l'avance avec le moteur de
//  l'explorateur (fiches-images.js, chargé une seule fois, à la
//  première fiche qui approche de l'écran) : elles s'affichent aussitôt.
// ============================================================

let chargement = null
const chargerImages = () => (chargement ??= import('./fiches-images').then((mod) => mod.IMAGES_FICHES))

/** Les images d'une fiche, avec leurs légendes */
export function ImagesFiche({ id, T, fmt }) {
  const zone = useRef(null)
  const toiles = useRef([])
  const [donnees, setDonnees] = useState(null)   // les images codées de cette fiche
  const [erreur, setErreur] = useState(false)
  const conf = IMAGES[id]
  const F = T.fiche

  // on ne charge les images que lorsque la fiche approche de l'écran
  useEffect(() => {
    let arret = false
    const obs = new IntersectionObserver((entrees) => {
      if (!entrees.some((e) => e.isIntersecting)) return
      obs.disconnect()
      chargerImages()
        .then((toutes) => Promise.all(toutes[id].map((c) => decoder(c))).then((images) => ({ codees: toutes[id], images })))
        .then((d) => { if (!arret) setDonnees(d) })
        .catch(() => { if (!arret) setErreur(true) })
    }, { rootMargin: '400px 0px' })
    obs.observe(zone.current)
    return () => { arret = true; obs.disconnect() }
  }, [id])

  // dessin, puis à nouveau si la taille des images change
  useEffect(() => {
    if (!donnees) return
    const dessiner = () => {
      donnees.images.forEach((img, k) => {
        const toile = toiles.current[k]
        if (!toile) return
        const r = creerRendu2D(toile)
        r.redimensionner()
        r.dessiner(img, { vue: conf.images[k].vue ?? 'sol', noms: false })
      })
    }
    dessiner()
    const obs = new ResizeObserver(dessiner)
    toiles.current.forEach((t) => t && obs.observe(t))
    return () => obs.disconnect()
  }, [donnees, conf])

  const pct = (x) => fmt(x, { style: 'percent', maximumFractionDigits: 0 })
  const decrire = (m, modele) => {
    if (modele === 'fourmis') return [F.mesures.livrees(fmt(m.livrees)), ...(m.partA || id.startsWith('pont') ? [F.mesures.partA(pct(m.partA))] : [])]
    return [F.mesures.sentiers(fmt(m.sentiers)), F.mesures.detour(pct(m.detour))]
  }
  const titres = T.fiches[id]?.images ?? {}
  const classe = conf.images.length === 3 ? 'ld-trio' : conf.images.length === 1 ? 'ld-seule' : 'ld-paire'
  return (
    <figure className="figure figure--large ld-fiche-images" ref={zone}>
      <div className={classe}>
        {conf.images.map((img, k) => (
          <figure key={k}>
            <canvas ref={(el) => { toiles.current[k] = el }} className="ld-figure-canvas" style={{ aspectRatio: donnees ? `${donnees.images[k].W} / ${donnees.images[k].H}` : '7 / 5' }} aria-label={titres[img.etiquette] ?? ''} />
            <figcaption>
              <strong>{titres[img.etiquette]}</strong>
              {donnees ? decrire(donnees.codees[k].mesure, donnees.codees[k].modele).map((l) => <span key={l}>{l}</span>) : <span>{erreur ? F.erreur : F.chargement}</span>}
            </figcaption>
          </figure>
        ))}
      </div>
      <p className="ld-note">{F.note}</p>
    </figure>
  )
}

/** La fiche complète d'un scénario */
export function Fiche({ id, ctx }) {
  const { T, fmt } = ctx
  const F = T.fiches[id]
  const G = T.fiche
  return (
    <div className="ld-fiche">
      <p className="ld-fiche-question">{F.question}</p>
      <p className="ld-fiche-titre">{G.regles}</p>
      <Bloc bloc={{ liste: F.regles }} ctx={ctx} />
      {IMAGES[id] && <ImagesFiche id={id} T={T} fmt={fmt} />}
      <p className="ld-fiche-titre">{G.regarder}</p>
      <Bloc bloc={{ liste: F.regarder }} ctx={ctx} />
      <p className="ld-fiche-titre">{G.pourquoi}</p>
      {F.pourquoi.map((p) => <Bloc key={p} bloc={{ p }} ctx={ctx} />)}
      {F.realite && (
        <>
          <p className="ld-fiche-titre">{G.realite}</p>
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
