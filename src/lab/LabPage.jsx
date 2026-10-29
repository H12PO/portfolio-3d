import { Link } from 'react-router'
import Site from '../site/Site'
import { useTexte, useTitre } from '../site/textes'
import { useTheme } from '../site/theme'
import Apercu from './Apercu'
import { PROJETS, DOMAINES, pick } from './registre'

// Page /projets : un bloc par domaine, chacun avec la mise en page qui lui convient
export default function LabPage() {
  const { t, lang } = useTexte()
  const theme = useTheme()
  useTitre(t('projets.titre'))

  const blocs = DOMAINES
    .map((d) => ({ ...d, projets: PROJETS.filter((p) => p.domaine === d.id) }))
    .filter((d) => d.projets.length > 0)

  const lien = (p) => ({ to: `/projets/${p.id}`, state: { depuis: '/projets' } })
  const statut = (p) => <span className={`statut-${p.statut}`}>{t(`projets.statut.${p.statut}`)}</span>

  return (
    <Site>
      <main className="page-col">
        <h1 className="page-titre">{t('projets.titre')}</h1>
        <p className="page-intro">{t('projets.sousTitre')}</p>

        {blocs.map((d) => (
          <section key={d.id} className="domaine" aria-labelledby={`domaine-${d.id}`}>
            <div>
              <h2 id={`domaine-${d.id}`}>{t(`projets.domaines.${d.id}`)}</h2>
              <div className="domaine-compte">{t('projets.compte')(d.projets.length)}</div>
            </div>

            {d.mise === 'vitrine' && (
              <div className="domaine-projets">
                {d.projets.map((p) => (
                  <Link key={p.id} className="vitrine" {...lien(p)}>
                    <Apercu id={p.id} theme={theme} />
                    <div>
                      <h3>{pick(p.titre, lang)}</h3>
                      <p>{pick(p.resume, lang)}</p>
                      <div className="meta">
                        {p.techno && <span>{p.techno}</span>}
                        {p.annee && <span>{p.annee}</span>}
                        {statut(p)}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}

            {d.mise === 'liste' && (
              <div className="liste">
                {d.projets.map((p) => (
                  <Link key={p.id} {...lien(p)}>
                    <span>{pick(p.titre, lang)}</span>
                    <span>{pick(p.methodes ?? p.resume, lang)}</span>
                    {statut(p)}
                  </Link>
                ))}
              </div>
            )}

            {d.mise === 'ecrans' && (
              <div className="ecrans">
                {d.projets.map((p) => (
                  <Link key={p.id} className="ecran" {...lien(p)}>
                    <Apercu id={p.id} theme={theme} />
                    <span>{pick(p.titre, lang)}</span>
                  </Link>
                ))}
              </div>
            )}
          </section>
        ))}
      </main>
    </Site>
  )
}
