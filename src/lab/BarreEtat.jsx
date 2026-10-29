// Barre d'état en bas d'un projet : un statut, des mesures, une valeur à droite
export default function BarreEtat({ statut, actif = false, elements = [], fin }) {
  return (
    <footer className="etat" aria-live="off">
      <span className="etat-statut" data-actif={actif}>{statut}</span>
      {elements.filter(Boolean).map((e) => <span key={e}>{e}</span>)}
      {fin && <span className="etat-fin">{fin}</span>}
    </footer>
  )
}
