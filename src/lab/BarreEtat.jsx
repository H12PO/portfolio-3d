// Barre d'état en bas d'un projet : un statut, des mesures, une valeur à droite.
// Un élément est un texte, ou { cle, contenu } pour y mettre autre chose (une petite courbe…).
export default function BarreEtat({ statut, actif = false, elements = [], fin }) {
  return (
    <footer className="etat" aria-live="off">
      <span className="etat-statut" data-actif={actif}>{statut}</span>
      {elements.filter(Boolean).map((e) => (typeof e === 'string'
        ? <span key={e}>{e}</span>
        : <span key={e.cle}>{e.contenu}</span>))}
      {fin && <span className="etat-fin">{fin}</span>}
    </footer>
  )
}
