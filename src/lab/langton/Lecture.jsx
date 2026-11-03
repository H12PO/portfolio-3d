import { useMemo } from 'react'
import { Article } from '../commun/Lecture'
import { mesurerLangton } from './moteur'
import { PRESETS_LETTRES } from './presets'
import { FigureDamier, FigureRetour, FigureCourbe, TableMesures, FigureMonteCarlo } from './figures'

// ============================================================
//  ONGLETS DE LECTURE DE LA FOURMI : Comprendre, Théorie, Histoire
//  La mise en page des articles est commune (lab/commun/Lecture.jsx) ;
//  ici, seulement ce qui est propre à la fourmi : ses figures et la
//  liste des règles proposées.
// ============================================================

function special(bloc, ctx) {
  const { T, theme, fmt, lang, mesures } = ctx

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

const avecFigures = (ctx) => ({ ...ctx, special: (bloc) => special(bloc, ctx) })

export function Comprendre({ ctx }) {
  return <Article sections={ctx.T.comprendre} ctx={avecFigures(ctx)} />
}

export function Theorie({ ctx }) {
  // Mesures faites par le moteur, une seule fois à l'ouverture de l'onglet (~40 ms)
  const mesures = useMemo(() => mesurerLangton(), [])
  return <Article sections={ctx.T.theorie} ctx={avecFigures({ ...ctx, mesures })} />
}

export function Histoire({ ctx }) {
  return <Article sections={ctx.T.histoire} ctx={avecFigures(ctx)} />
}
