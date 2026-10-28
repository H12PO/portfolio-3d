import { Link, NavLink } from 'react-router'
import { useGameStore } from '../store/useGameStore'
import { useLangStore } from '../i18n'
import { useTexte } from './textes'
import './site.css'

const LANGUES = ['fr', 'en']

// En-tête commun du site vitrine (Projets, CV…), indépendant de l'aéroport.
export default function SiteHeader() {
  const { t, lang } = useTexte()
  const setLang = useLangStore((s) => s.setLang)

  // Seul pont avec l'aéroport, en attendant le vrai lien : si on est arrivé
  // par la porte A3, cliquer sur le nom ressort par l'animation d'atterrissage.
  const started = useGameStore((s) => s.started)
  const lastDoor = useGameStore((s) => s.lastDoor)
  const beginLanding = useGameStore((s) => s.beginLanding)
  const accueil = (e) => {
    if (started && lastDoor === 'projets') {
      e.preventDefault()
      beginLanding('projets')
    }
  }

  return (
    <header className="site-header">
      <div className="site-header-inner">
        <Link to="/" className="site-brand" onClick={accueil}>{t('nom')}</Link>
        <nav className="site-nav">
          <NavLink to="/projets">{t('nav.projets')}</NavLink>
          <NavLink to="/cv">{t('nav.cv')}</NavLink>
          <span className="site-langues">
            {LANGUES.map((code) => (
              <button key={code} aria-pressed={code === lang} onClick={() => setLang(code)}>
                {code}
              </button>
            ))}
          </span>
        </nav>
      </div>
    </header>
  )
}
