import { Article } from '../commun/Lecture'
import { FigureOrbite, FigureCouleurs, FigureJulias, FigureGalerie, FigureDichotomie, FigureBulbes, FigurePi, FigureBifurcation, FigureBanc, FigurePrecision } from './figures'
import { FigureConstruction, FigureBoites, FigureChaos, FigureLittoral, FigureRelief, FigureAgregation, FigureVignettes } from './figures-theorie'

// ============================================================
//  ONGLETS DE LECTURE DES FRACTALES : Comprendre, Théorie, Applications,
//  Calcul, Histoire
//  La mise en page des articles est commune (lab/commun/Lecture.jsx) ;
//  ici, seulement les figures et les blocs de code.
// ============================================================

function special(bloc, ctx) {
  const { T, theme, fmt } = ctx
  if (bloc.code) return <pre className="fr-code"><code>{bloc.code}</code></pre>

  const f = T.figures
  switch (bloc.figure) {
    case 'orbite': return <FigureOrbite txt={f.orbite} fmt={fmt} />
    case 'couleurs': return <FigureCouleurs txt={f.couleurs} />
    case 'julias': return <FigureJulias txt={f.julias} fmt={fmt} />
    case 'galerie': return <FigureGalerie txt={f.galerie} T={T} onOuvrir={ctx.ouvrir} />
    case 'dichotomie': return <FigureDichotomie txt={f.dichotomie} fmt={fmt} />
    case 'bulbes': return <FigureBulbes txt={f.bulbes} />
    case 'pi': return <FigurePi txt={f.pi} fmt={fmt} />
    case 'bifurcation': return <FigureBifurcation txt={f.bifurcation} fmt={fmt} theme={theme} />
    case 'banc': return <FigureBanc txt={f.banc} fmt={fmt} />
    case 'precision': return <FigurePrecision txt={f.precision} T={T} />
    case 'construction': return <FigureConstruction txt={f.construction} fmt={fmt} />
    case 'boites': return <FigureBoites txt={f.boites} fmt={fmt} />
    case 'chaos': return <FigureChaos txt={f.chaos} fmt={fmt} />
    case 'littoral': return <FigureLittoral txt={f.littoral} fmt={fmt} />
    case 'relief': return <FigureRelief txt={f.relief} fmt={fmt} />
    case 'agregation': return <FigureAgregation txt={f.agregation} fmt={fmt} />
    case 'vignettes': return <FigureVignettes ids={bloc.ids} txt={f.vignettes} onOuvrir={ctx.ouvrir} />
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

export function Applications({ ctx }) {
  return <Article sections={ctx.T.applications} ctx={avecFigures(ctx)} />
}

export function Calcul({ ctx }) {
  return <Article sections={ctx.T.calcul} ctx={avecFigures(ctx)} />
}

export function Histoire({ ctx }) {
  return <Article sections={ctx.T.histoire} ctx={avecFigures(ctx)} />
}
