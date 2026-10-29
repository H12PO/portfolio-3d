import { useEffect, useMemo, useRef, useState } from 'react'
import katex from 'katex'
import 'katex/dist/katex.min.css'
import '@fontsource-variable/stix-two-text'
import { mesurerLangton } from './moteur'
import { PRESETS_LETTRES } from './presets'
import { FigureDamier, FigureRetour, FigureCourbe, TableMesures, FigureMonteCarlo } from './figures'

// ============================================================
//  ONGLETS DE LECTURE : Comprendre, Théorie, Histoire et références
//  Le contenu est dans textes.js et lecture-*.js, sous forme de blocs :
//  { p }, { liste }, { tex, etroit? }, { figure }, { preuve }, { expert },
//  { frise }, { refs }, { visite }, { presets }.
//  Dans le texte : *mot* en italique, $formule$ en LaTeX (KaTeX).
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

function Bloc({ bloc, ctx }) {
  const { T, theme, fmt, lang, mesures, onVisite } = ctx

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
          <li key={annee}>
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
          <li key={texte}>{url ? <a href={url} target="_blank" rel="noreferrer">{texte}</a> : texte}</li>
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

  if (bloc.presets) {
    return (
      <dl className="presets">
        {PRESETS_LETTRES.map((p) => (
          <div key={p.id}>
            <dt><span>{T.presetsLettres[p.id][0]}</span><code>{p.lettres}</code></dt>
            <dd>{T.presetsLettres[p.id][1]}</dd>
          </div>
        ))}
      </dl>
    )
  }

  if (bloc.figure === 'damier') return <FigureDamier txt={T.figures.damier} theme={theme} />
  if (bloc.figure === 'retour') return <FigureRetour txt={T.figures.retour} theme={theme} fmt={fmt} />
  if (bloc.figure === 'courbe') return <FigureCourbe txt={T.figures.courbe} mesures={mesures} fmt={fmt} />
  if (bloc.figure === 'mesures') return <TableMesures txt={T.figures.mesures} mesures={mesures} fmt={fmt} lang={lang} />
  if (bloc.figure === 'montecarlo') return <FigureMonteCarlo txt={T.figures.montecarlo} mesures={mesures} fmt={fmt} />
  return null
}

// Un article avec son sommaire ; la section visible est repérée dans le sommaire
function Article({ sections, ctx }) {
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

export function Comprendre({ ctx }) {
  return <Article sections={ctx.T.comprendre} ctx={ctx} />
}

export function Theorie({ ctx }) {
  // Mesures faites par le moteur, une seule fois à l'ouverture de l'onglet (~40 ms)
  const mesures = useMemo(() => mesurerLangton(), [])
  return <Article sections={ctx.T.theorie} ctx={{ ...ctx, mesures }} />
}

export function Histoire({ ctx }) {
  return <Article sections={ctx.T.histoire} ctx={ctx} />
}
