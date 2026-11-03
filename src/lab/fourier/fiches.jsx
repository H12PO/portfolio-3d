import { useEffect, useMemo, useRef, useState } from 'react'
import { Bloc } from '../commun/Lecture'
import { preparer, approximation, bilan } from './moteur'
import { FORMES } from './formes'
import { creerRendu2D } from './rendu2d'

// ============================================================
//  ÉPICYCLES DE FOURIER : les fiches des scénarios (onglet Comprendre)
//  Une fiche = la question, les règles, des images, ce qu'il faut
//  regarder, ce qui se passe et pourquoi, le lien avec la réalité,
//  et un bouton vers l'explorateur.
//  Les images sont calculées dans la page quand la fiche approche de
//  l'écran : une FFT de 2 048 points par forme, quelques millisecondes.
// ============================================================

// Pour chaque fiche : ses images (forme, cercles, ordre, paramétrage, lissage, instant des cercles)
const IMAGES = {
  ellipse: { images: [
    { f: 'cercle', M: 1, ordre: 'frequence', param: 'formule', etiquette: 'cercle' },
    { f: 'ellipse', M: 2, ordre: 'frequence', param: 'formule', etiquette: 'ellipse' },
    { f: 'trefle', M: 2, param: 'formule', etiquette: 'trefle' },
    { f: 'spirographe', M: 2, param: 'formule', etiquette: 'spirographe' },
  ] },
  mars: { images: [
    { f: 'mars', M: 1, param: 'formule', etiquette: 'un' },
    { f: 'mars', M: 2, param: 'formule', etiquette: 'deux' },
  ] },
  coeur: { images: [
    { f: 'coeur', M: 2, param: 'formule', etiquette: 'm2' },
    { f: 'coeur', M: 4, param: 'formule', etiquette: 'm4' },
    { f: 'coeur', M: 8, param: 'formule', etiquette: 'm8' },
    { f: 'coeur', M: 8, param: 'vitesse', etiquette: 'v8' },
  ] },
  infini: { images: [
    { f: 'infini', M: 2, ordre: 'frequence', param: 'formule', etiquette: 'm2' },
    { f: 'infini', M: 4, ordre: 'frequence', param: 'formule', etiquette: 'm4' },
    { f: 'infini', M: 6, ordre: 'frequence', param: 'formule', etiquette: 'm6' },
  ] },
  carre: { images: [
    { f: 'carre', M: 2, ordre: 'frequence', etiquette: 'm2' },
    { f: 'carre', M: 8, ordre: 'frequence', etiquette: 'm8' },
    { f: 'carre', M: 40, ordre: 'frequence', etiquette: 'm40' },
  ] },
  etoile: { images: [
    { f: 'etoile', M: 1, etiquette: 'm1' },
    { f: 'etoile', M: 3, etiquette: 'm3' },
    { f: 'etoile', M: 12, etiquette: 'm12' },
  ] },
  avion: { images: [
    { f: 'avion', M: 5, etiquette: 'm5' },
    { f: 'avion', M: 15, etiquette: 'm15' },
    { f: 'avion', M: 30, etiquette: 'm30' },
  ] },
  koch: { images: [
    { f: 'koch', M: 10, etiquette: 'm10' },
    { f: 'koch', M: 50, etiquette: 'm50' },
    { f: 'koch', M: 400, etiquette: 'm400' },
  ] },
  spirale: { images: [
    { f: 'spirale', M: 30, ordre: 'frequence', etiquette: 'm30' },
    { f: 'spirale', M: 200, ordre: 'frequence', etiquette: 'm200' },
    { f: 'spirale', M: 200, ordre: 'frequence', lissage: 'fejer', etiquette: 'fejer' },
  ] },
}

const INSTANT = 0.3      // l'instant où l'on montre la chaîne de cercles

function calculer(img) {
  const forme = FORMES[img.f]
  const p = preparer(forme, img.param ?? 'vitesse', 2048)
  const ordre = img.ordre ?? 'amplitude'
  const approx = approximation(p.c, p.ordres[ordre], img.M, img.lissage ?? 'aucun')
  return { scene: { origine: p.echantillons, approx, t: INSTANT, fermee: forme.fermee !== false, options: { trace: false, epais: 2 } }, bilan: bilan(p.c, p.ordres[ordre], img.M) }
}

/** Les images d'une fiche, avec leurs légendes */
export function ImagesFiche({ id, T, fmt }) {
  const zone = useRef(null)
  const toiles = useRef([])
  const [pret, setPret] = useState(false)
  const conf = IMAGES[id]
  const F = T.fiche

  // on ne calcule que lorsque la fiche approche de l'écran
  useEffect(() => {
    const obs = new IntersectionObserver((entrees) => {
      if (!entrees.some((e) => e.isIntersecting)) return
      obs.disconnect()
      setPret(true)
    }, { rootMargin: '400px 0px' })
    obs.observe(zone.current)
    return () => obs.disconnect()
  }, [])

  const resultats = useMemo(() => (pret ? conf.images.map(calculer) : null), [pret, conf])

  // dessin, puis à nouveau si la taille des images change
  useEffect(() => {
    if (!resultats) return
    const dessiner = () => {
      resultats.forEach((r, k) => {
        const toile = toiles.current[k]
        if (!toile) return
        const rendu = creerRendu2D(toile)
        rendu.redimensionner()
        rendu.dessiner(r.scene)
      })
    }
    dessiner()
    const obs = new ResizeObserver(dessiner)
    toiles.current.forEach((t) => t && obs.observe(t))
    return () => obs.disconnect()
  }, [resultats])

  const pct = (x) => fmt(x, { style: 'percent', maximumFractionDigits: 1 })
  const titres = T.fiches[id]?.images ?? {}
  const n = conf.images.length
  const classe = n === 4 ? 'fo-quatre' : n === 3 ? 'fo-trio' : n === 1 ? 'fo-seule' : 'fo-paire'
  return (
    <figure className="figure figure--large fo-fiche-images" ref={zone}>
      <div className={classe}>
        {conf.images.map((img, k) => (
          <figure key={k}>
            <canvas ref={(el) => { toiles.current[k] = el }} className="fo-figure-canvas" style={{ aspectRatio: '1' }} aria-label={titres[img.etiquette] ?? ''} />
            <figcaption>
              <strong>{titres[img.etiquette]}</strong>
              {resultats ? <span>{F.mesures(fmt(img.M), pct(resultats[k].bilan.energie))}</span> : <span>{F.calcul}</span>}
            </figcaption>
          </figure>
        ))}
      </div>
      <p className="fo-note">{F.note}</p>
    </figure>
  )
}

/** La fiche complète d'un scénario */
export function Fiche({ id, ctx }) {
  const { T, fmt } = ctx
  const F = T.fiches[id]
  const G = T.fiche
  return (
    <div className="fo-fiche">
      <p className="fo-fiche-question">{F.question}</p>
      <p className="fo-fiche-titre">{G.regles}</p>
      <Bloc bloc={{ liste: F.regles }} ctx={ctx} />
      {IMAGES[id] && <ImagesFiche id={id} T={T} fmt={fmt} />}
      <p className="fo-fiche-titre">{G.regarder}</p>
      <Bloc bloc={{ liste: F.regarder }} ctx={ctx} />
      <p className="fo-fiche-titre">{G.pourquoi}</p>
      {F.pourquoi.map((p) => <Bloc key={p} bloc={{ p }} ctx={ctx} />)}
      {F.realite && (
        <>
          <p className="fo-fiche-titre">{G.realite}</p>
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
