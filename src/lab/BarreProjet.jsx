import { useLocation, useNavigate } from 'react-router'
import { useTexte } from '../site/textes'
import { pick } from './registre'

// Barre sous l'en-tête : retour à la grille, titre, résumé, et des actions en option
export default function BarreProjet({ meta, children }) {
  const navigate = useNavigate()
  const { state } = useLocation()
  const { t, lang } = useTexte()

  return (
    <div className="projet-bar">
      <button className="site-btn" onClick={() => navigate(state?.depuis ?? '/projets')}>
        ← {t('nav.projets')}
      </button>
      <div className="projet-titre">
        <h1>{pick(meta.titre, lang)}</h1>
        <p>{pick(meta.resume, lang)}</p>
      </div>
      {children && <div className="projet-actions">{children}</div>}
    </div>
  )
}
