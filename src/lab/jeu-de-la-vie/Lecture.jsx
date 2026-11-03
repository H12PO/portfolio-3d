import { Article } from '../commun/Lecture'
import { REGLES } from './regles'
import { FigureDestins, FigureVoisinage, FigurePlaneur, FigureCanon, FigureSaut, FigureJumeaux, FigureSoupes, FigureLambda, FigureReplicateurs } from './figures'
import { FigurePorte, FigureMinsky } from './figures-calcul'

// ============================================================
//  ONGLETS DE LECTURE DU JEU DE LA VIE : Comprendre, Théorie, Calcul, Histoire
//  La mise en page des articles est commune (lab/commun/Lecture.jsx) ;
//  ici, seulement ce qui est propre au jeu de la vie : ses figures et
//  la liste des règles proposées.
// ============================================================

function special(bloc, ctx) {
  const { T, theme, fmt, lang } = ctx

  if (bloc.regles) {
    return (
      <dl className="presets">
        {REGLES.map((r) => (
          <div key={r.id}>
            <dt><span>{T.regles[r.id][0]}</span><code>{r.texte}</code></dt>
            <dd>{T.regles[r.id][1]}</dd>
          </div>
        ))}
      </dl>
    )
  }

  const f = T.figures
  switch (bloc.figure) {
    case 'destins': return <FigureDestins txt={f.destins} theme={theme} />
    case 'voisinage': return <FigureVoisinage txt={f.voisinage} />
    case 'planeur': return <FigurePlaneur txt={f.planeur} />
    case 'canon': return <FigureCanon txt={f.canon} theme={theme} fmt={fmt} />
    case 'saut': return <FigureSaut txt={f.saut} theme={theme} fmt={fmt} />
    case 'jumeaux': return <FigureJumeaux txt={f.jumeaux} theme={theme} />
    case 'soupes': return <FigureSoupes txt={f.soupes} lang={lang} />
    case 'lambda': return <FigureLambda txt={f.lambda} T={T} theme={theme} />
    case 'replicateurs': return <FigureReplicateurs txt={f.replicateurs} theme={theme} />
    case 'porte': return <FigurePorte txt={f.porte} theme={theme} />
    case 'minsky': return <FigureMinsky txt={f.minsky} />
    default: return null
  }
}

const avecFigures = (ctx) => ({ ...ctx, special: (bloc) => special(bloc, ctx) })

export function Comprendre({ ctx }) {
  return <Article sections={ctx.T.comprendre} ctx={avecFigures(ctx)} />
}

export function Theorie({ ctx }) {
  return <Article sections={ctx.T.theorie} ctx={avecFigures(ctx)} />
}

export function Calcul({ ctx }) {
  return <Article sections={ctx.T.calcul} ctx={avecFigures(ctx)} />
}

export function Histoire({ ctx }) {
  return <Article sections={ctx.T.histoire} ctx={avecFigures(ctx)} />
}