import SiteHeader from './SiteHeader'
import { useTexte, useTitre } from './textes'
import './site.css'

// CV classique, rapide à lire.
// À ne pas confondre avec le CV interactif, derrière sa porte dans l'aéroport.
export default function CvPage() {
  const { t } = useTexte()
  useTitre(t('cv.titre'))

  return (
    <div className="site">
      <SiteHeader />
      <main className="site-main site-main--etroit">
        <h1>{t('cv.titre')}</h1>
        <p className="lab-sub">{t('cv.bientot')}</p>
      </main>
    </div>
  )
}
