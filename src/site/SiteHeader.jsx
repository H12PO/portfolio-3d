import { Link, NavLink } from 'react-router'
import { useGameStore } from '../store/useGameStore'
import { useLangStore } from '../i18n'
import { useTexte } from './textes'
import { useTheme, useThemeStore } from './theme'

const LANGUES = ['fr', 'en']

// En-tête commun du site vitrine, indépendant de l'aéroport
export default function SiteHeader() {
  const { t, lang } = useTexte()
  const setLang = useLangStore((s) => s.setLang)
  const theme = useTheme()
  const basculer = useThemeStore((s) => s.basculer)

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

  const vers = theme === 'sombre' ? 'clair' : 'sombre'

  return (
    <header className="site-header">
      <Link to="/" className="site-marque" onClick={accueil}>{t('nom')}</Link>
      <nav className="site-nav">
        <NavLink to="/projets">{t('nav.projets')}</NavLink>
        <NavLink to="/cv">{t('nav.cv')}</NavLink>
      </nav>
      <div className="site-outils">
        <div className="site-langues">
          {LANGUES.map((code) => (
            <button key={code} aria-pressed={code === lang} onClick={() => setLang(code)}>{code}</button>
          ))}
        </div>
        <button className="site-theme" onClick={basculer} aria-label={t(`theme.${vers}`)} title={t(`theme.${vers}`)}>
          <svg width="14" height="14" viewBox="0 0 16 16" aria-hidden="true">
            <circle cx="8" cy="8" r="6.2" fill="none" stroke="currentColor" strokeWidth="1.5" />
            <path d="M8 1.8a6.2 6.2 0 0 1 0 12.4z" fill="currentColor" />
          </svg>
        </button>
      </div>
    </header>
  )
}
