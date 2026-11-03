import { Article } from '../commun/Lecture'
import * as F from './figures'
import { Fiche } from './fiches'

// ============================================================
//  ONGLETS DE LECTURE DES ÉPICYCLES DE FOURIER : Comprendre, Théorie, Applications,
//  Calcul, Histoire. La mise en page est commune (lab/commun/Lecture.jsx) ;
//  ici, les figures, les fiches des scénarios et le bouton qui ouvre un scénario.
// ============================================================

const FIGURES = Object.fromEntries(Object.entries(F).filter(([k]) => k.startsWith('Figure')).map(([k, v]) => [k.slice(6).toLowerCase(), v]))

function special(bloc, ctx) {
  if (bloc.ouvrir) {
    return (
      <div className="appel">
        <button className="btn-principal" onClick={() => ctx.ouvrir(bloc.ouvrir)}>{bloc.libelle}</button>
        {bloc.aide && <span>{bloc.aide}</span>}
      </div>
    )
  }
  if (bloc.fiche) return <Fiche id={bloc.fiche} ctx={ctx} />
  const Figure = FIGURES[bloc.figure]
  return Figure ? <Figure txt={ctx.T.figures[bloc.figure]} T={ctx.T} fmt={ctx.fmt} /> : null
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
