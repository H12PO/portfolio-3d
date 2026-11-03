import { useEffect, useRef, useState } from 'react'
import katex from 'katex'
import 'katex/dist/katex.min.css'
import '@fontsource-variable/stix-two-text'
import './lecture.css'

// ============================================================
//  LECTURE COMMUNE : les onglets d'articles des projets du labo
//  Un article est une liste de sections { id, titre, blocs }.
//  Blocs reconnus ici : { p }, { liste }, { tex, etroit? }, { preuve },
//  { expert }, { frise }, { refs }, { visite }, { figure }.
//  Dans le texte : *mot* en italique, $formule$ en LaTeX (KaTeX).
//  Le reste (figures, listes propres à un projet) passe par ctx.special(bloc).
// ============================================================

// KaTeX produit du HTML pour l'affichage et du MathML pour les lecteurs d'écran.
// Les formules sont fixes : on garde le résultat pour ne pas les recalculer à chaque rendu.
const cache = new Map()
function formule(code, bloc) {
  const cle = (bloc ? 'B' : 'L') + code
  if (!cache.has(cle)) {
    cache.set(cle, katex.renderToString(code, { displayMode: bloc, throwOnError: false, strict: false }))
  }
  return cache.get(cle)
}

const enrichir = (texte) =>
  texte.split(/(\$[^$]+\$|\*[^*]+\*)/g).map((m, k) => {
    if (m.length > 2 && m.startsWith('$') && m.endsWith('$')) {
      return <span key={k} className="maths" dangerouslySetInnerHTML={{ __html: formule(m.slice(1, -1), false) }} />
    }
    if (m.length > 2 && m.startsWith('*') && m.endsWith('*')) return <em key={k}>{m.slice(1, -1)}</em>
    return m
  })

const majuscule = (s) => s.charAt(0).toUpperCase() + s.slice(1)

export function Bloc({ bloc, ctx }) {
  const { T, onVisite } = ctx

  if (bloc.p) return <p>{enrichir(bloc.p)}</p>
  if (bloc.liste) return <ul>{bloc.liste.map((l) => <li key={l}>{enrichir(l)}</li>)}</ul>

  if (bloc.tex) {
    // Une variante sur plusieurs lignes remplace les formules trop larges sur les petits écrans
    if (!bloc.etroit) return <div className="equation" dangerouslySetInnerHTML={{ __html: formule(bloc.tex, true) }} />
    return (
      <>
        <div className="equation equation--large" dangerouslySetInnerHTML={{ __html: formule(bloc.tex, true) }} />
        <div className="equation equation--etroite" dangerouslySetInnerHTML={{ __html: formule(bloc.etroit, true) }} />
      </>
    )
  }

  if (bloc.preuve) {
    return (
      <details className="preuve">
        <summary>
          <span>{bloc.preuve}</span>
          {bloc.source && <span className="preuve-source">{bloc.source}</span>}
        </summary>
        <div className="preuve-corps">{bloc.paragraphes.map((p) => <p key={p}>{enrichir(p)}</p>)}</div>
      </details>
    )
  }

  // Encadré replié : la lecture principale reste accessible, le détail est à un clic
  if (bloc.expert) {
    return (
      <details className="expert">
        <summary>
          <span className="expert-etiquette">{T.expert}</span>
          <span className="expert-titre">{majuscule(bloc.expert)}</span>
        </summary>
        <div className="expert-corps">
          {bloc.blocs.map((b, k) => <Bloc key={k} bloc={b} ctx={ctx} />)}
        </div>
      </details>
    )
  }

  if (bloc.frise) {
    return (
      <ol className="frise">
        {bloc.frise.map(([annee, qui, quoi]) => (
          <li key={annee + qui}>
            <span className="frise-annee">{annee}</span>
            <p>{qui && <strong>{qui}</strong>}{qui && ' '}{enrichir(quoi)}</p>
          </li>
        ))}
      </ol>
    )
  }

  if (bloc.refs) {
    return (
      <ol className="refs">
        {bloc.refs.map(([texte, url]) => (
          <li key={texte}>{url ? <a href={url} target="_blank" rel="noreferrer">{enrichir(texte)}</a> : enrichir(texte)}</li>
        ))}
      </ol>
    )
  }

  if (bloc.visite) {
    return (
      <div className="appel">
        <button className="btn-principal" onClick={onVisite}>{bloc.visite}</button>
        <span>{bloc.aide}</span>
      </div>
    )
  }

  return ctx.special?.(bloc) ?? null
}

// Un article avec son sommaire ; la section visible est repérée dans le sommaire
export function Article({ sections, ctx }) {
  const zone = useRef(null)
  const [ici, setIci] = useState(sections[0].id)

  useEffect(() => {
    const racine = zone.current
    const obs = new IntersectionObserver(
      (entrees) => {
        const visibles = entrees.filter((e) => e.isIntersecting)
        if (visibles.length) setIci(visibles[0].target.id)
      },
      { root: racine, rootMargin: '0px 0px -70% 0px' },
    )
    racine.querySelectorAll('section[id]').forEach((s) => obs.observe(s))
    return () => obs.disconnect()
  }, [sections])

  const aller = (id) => (e) => {
    e.preventDefault()
    zone.current.querySelector(`#${id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <div className="lecture" ref={zone}>
      <div className="lecture-grille">
        <article className="article">
          {sections.map((s) => (
            <section key={s.id} id={s.id}>
              <h2>{s.titre}</h2>
              {s.blocs.map((b, k) => <Bloc key={k} bloc={b} ctx={ctx} />)}
            </section>
          ))}
        </article>
        {sections.length > 2 && (
          <nav className="sommaire" aria-label={ctx.T.sommaire}>
            <p>{ctx.T.sommaire}</p>
            {sections.map((s) => (
              <a key={s.id} href={`#${s.id}`} aria-current={ici === s.id ? 'true' : undefined} onClick={aller(s.id)}>
                {s.titre}
              </a>
            ))}
          </nav>
        )}
      </div>
    </div>
  )
}
