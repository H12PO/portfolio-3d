import { Link, useLocation } from 'react-router'
import { useTexte } from '../site/textes'
import { pick } from './registre'

// En-tête de document d'un projet : fil d'Ariane, titre, résumé,
// actions éventuelles et onglets (facultatifs)
export default function BarreProjet({ meta, onglets, actif, onChange, children }) {
  const { state } = useLocation()
  const { t, lang } = useTexte()

  return (
    <header className="doc">
      <nav className="doc-fil" aria-label="Fil d’Ariane">
        <Link to={state?.depuis ?? '/projets'}>{t('nav.projets')}</Link>
        <span aria-hidden="true">/</span>
        <span>{t(`projets.domaines.${meta.domaine}`)}</span>
      </nav>
      <div className="doc-titre">
        <div>
          <h1>{pick(meta.titre, lang)}</h1>
          <p>{pick(meta.resume, lang)}</p>
        </div>
        {children && <div className="doc-actions">{children}</div>}
      </div>
      {onglets && (
        <div className="doc-onglets" role="tablist">
          {onglets.map((o) => (
            <button key={o.id} role="tab" aria-selected={o.id === actif} onClick={() => onChange(o.id)}>
              {o.label}
            </button>
          ))}
        </div>
      )}
    </header>
  )
}
