import { Link, useSearchParams } from 'react-router'
import SiteHeader from '../site/SiteHeader'
import { useTexte, useTitre } from '../site/textes'
import { PROJETS, ONGLETS, pick } from './registre'
import '../site/site.css'

const parOnglet = (onglet) =>
  onglet === 'une' ? PROJETS.filter((p) => p.une) : PROJETS.filter((p) => p.onglet === onglet)

// Teinte stable tirée de l'id : chaque projet garde sa couleur d'aperçu
const teinte = (id) => [...id].reduce((h, c) => (h * 31 + c.charCodeAt(0)) % 360, 7)

export default function LabPage() {
  const { t, lang } = useTexte()
  const [params, setParams] = useSearchParams()
  useTitre(t('projets.titre'))

  // Onglet actif rangé dans l'URL (?onglet=finance) : il survit au retour d'un projet
  const onglets = ONGLETS.filter((o) => parOnglet(o).length > 0)
  const demande = params.get('onglet')
  const onglet = onglets.includes(demande) ? demande : onglets[0]
  const liste = onglet ? parOnglet(onglet) : []

  return (
    <div className="site">
      <SiteHeader />

      <main className="site-main">
        <h1>{t('projets.titre')}</h1>
        <p className="lab-sub">{t('projets.sousTitre')}</p>

        <nav className="lab-tabs">
          {onglets.map((o) => (
            <button
              key={o}
              className="lab-tab"
              aria-pressed={o === onglet}
              onClick={() => setParams({ onglet: o }, { replace: true })}
            >
              {t(`projets.onglets.${o}`)}
              <span>{parOnglet(o).length}</span>
            </button>
          ))}
        </nav>

        <div className="lab-grid">
          {liste.map((p) => {
            const h = teinte(p.id)
            return (
              <Link
                key={p.id}
                to={`/projets/${p.id}`}
                state={{ depuis: `/projets?onglet=${onglet}` }}
                className="lab-card"
              >
                <div
                  className="lab-thumb"
                  style={{ background: `linear-gradient(135deg, hsl(${h} 45% 28%), hsl(${(h + 50) % 360} 45% 12%))` }}
                />
                <div className="lab-card-body">
                  <h2>{pick(p.titre, lang)}</h2>
                  <p>{pick(p.resume, lang)}</p>
                  <div className="lab-badges">
                    {p.statut === 'wip' && <span className="lab-badge">{t('projets.enCours')}</span>}
                    {p.statut === 'idee' && <span className="lab-badge">{t('projets.idee')}</span>}
                    {p.arcade === 'jouable' && <span className="lab-badge">🕹 {t('projets.borne')}</span>}
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </main>
    </div>
  )
}
