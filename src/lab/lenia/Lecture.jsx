import { Article } from '../commun/Lecture'
import { FigureMecanisme, FigureVoisinages, FigureRegle, FigureRobustesse, FigureGalerie, FigureBanc } from './figures'

// ============================================================
//  ONGLETS DE LECTURE DE LENIA : Comprendre, Théorie, Applications,
//  Calcul, Histoire. La mise en page est commune (lab/commun/Lecture.jsx) ;
//  ici, seulement les figures et le bouton qui ouvre l'explorateur.
// ============================================================

function special(bloc, ctx) {
  const { T, fmt } = ctx
  const f = T.figures
  if (bloc.ouvrir) {
    return (
      <div className="appel">
        <button className="btn-principal" onClick={() => ctx.ouvrir(bloc.ouvrir)}>{bloc.libelle}</button>
        {bloc.aide && <span>{bloc.aide}</span>}
      </div>
    )
  }
  switch (bloc.figure) {
    case 'mecanisme': return <FigureMecanisme txt={f.mecanisme} fmt={fmt} />
    case 'voisinages': return <FigureVoisinages txt={f.voisinages} />
    case 'regle': return <FigureRegle txt={f.regle} T={T} fmt={fmt} />
    case 'robustesse': return <FigureRobustesse txt={f.robustesse} fmt={fmt} />
    case 'galerie': return <FigureGalerie txt={f.galerie} T={T} onOuvrir={ctx.ouvrir} />
    case 'banc': return <FigureBanc txt={f.banc} fmt={fmt} />
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
