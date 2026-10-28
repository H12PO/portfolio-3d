import { Suspense, useEffect, useRef, useState } from 'react'
import { Navigate, useParams } from 'react-router'
import SiteHeader from '../site/SiteHeader'
import { useTexte, useTitre } from '../site/textes'
import BarreProjet from './BarreProjet'
import { trouver, charger, PAGES, pick } from './registre'
import '../site/site.css'

export default function ProjectPage() {
  const { id } = useParams()
  const { t, lang } = useTexte()
  const meta = trouver(id)
  useTitre(meta ? pick(meta.titre, lang) : t('projets.titre'))

  if (!meta) return <Navigate to="/projets" replace />

  // Le projet a sa propre page (page.jsx) ? Sinon, canvas simple via mount()
  const PageDuProjet = PAGES[id]

  return (
    <div className="site projet">
      <SiteHeader />
      {PageDuProjet
        ? (
          <Suspense fallback={<BarreProjet meta={meta} />}>
            <PageDuProjet meta={meta} />
          </Suspense>
        )
        : <CanvasSimple key={id} id={id} meta={meta} />}
    </div>
  )
}

// Projet sans page dédiée : un canvas plein écran + pause / recommencer
function CanvasSimple({ id, meta }) {
  const { t, lang } = useTexte()
  const canvasRef = useRef(null)
  const handleRef = useRef(null)
  const [essai, setEssai] = useState(0)        // +1 = on remonte le projet de zéro
  const [enPause, setEnPause] = useState(false)
  const [erreur, setErreur] = useState(false)

  useEffect(() => {
    let annule = false
    const canvas = canvasRef.current

    // Taille réelle en pixels de l'écran (plafonnée à 2× pour les écrans très denses)
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    const { width, height } = canvas.getBoundingClientRect()
    canvas.width = Math.round(width * dpr)
    canvas.height = Math.round(height * dpr)

    charger(id)
      .then((mod) => {
        if (annule) return
        handleRef.current = mod.mount(canvas, { mode: 'page', lang })
      })
      .catch((e) => {
        console.error(e)
        if (!annule) setErreur(true)
      })

    return () => {
      annule = true
      handleRef.current?.unmount()
      handleRef.current = null
    }
  }, [id, essai, lang])

  const basculer = () => {
    const h = handleRef.current
    if (!h) return
    if (enPause) h.resume()
    else h.pause()
    setEnPause(!enPause)
  }

  const relancer = () => {
    setEnPause(false)
    setErreur(false)
    setEssai((n) => n + 1)
  }

  return (
    <>
      <BarreProjet meta={meta}>
        <button className="site-btn" onClick={basculer} disabled={erreur}>
          {enPause ? t('projets.reprendre') : t('projets.pause')}
        </button>
        <button className="site-btn" onClick={relancer}>{t('projets.recommencer')}</button>
      </BarreProjet>

      {erreur
        ? <p className="projet-erreur">{t('projets.erreur')}</p>
        : <canvas ref={canvasRef} className="projet-canvas" />}
    </>
  )
}
