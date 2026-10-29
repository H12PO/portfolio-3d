import Site from './Site'
import { useTexte, useTitre } from './textes'

// CV classique, rapide à lire.
// À ne pas confondre avec le CV interactif, derrière sa porte dans l'aéroport.
export default function CvPage() {
  const { t } = useTexte()
  useTitre(t('cv.titre'))

  return (
    <Site>
      <main className="page-col">
        <h1 className="page-titre">{t('cv.titre')}</h1>
        <p className="page-intro">{t('cv.bientot')}</p>
      </main>
    </Site>
  )
}
