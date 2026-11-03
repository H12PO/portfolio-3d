import { lazy, Suspense, useRef } from 'react'
import { useSearchParams } from 'react-router'
import BarreProjet from '../BarreProjet'
import { useTexte } from '../../site/textes'
import { useTheme } from '../../site/theme'
import { TEXTES } from './textes'
import Atelier from './Atelier'
import '../commun/atelier.css'
import './boids.css'

// ============================================================
//  PAGE « BOIDS » : six onglets
//  L'onglet est rangé dans l'adresse (?vue=theorie). L'explorateur
//  reste monté quand on lit : il garde son monde et ses réglages.
// ============================================================

const VUES = ['simulation', 'comprendre', 'theorie', 'applications', 'calcul', 'histoire']

// Les onglets de lecture (et KaTeX) ne sont chargés qu'à la première ouverture de l'un d'eux
const lecture = () => import('./Lecture')
const Comprendre = lazy(() => lecture().then((m) => ({ default: m.Comprendre })))
const Theorie = lazy(() => lecture().then((m) => ({ default: m.Theorie })))
const Applications = lazy(() => lecture().then((m) => ({ default: m.Applications })))
const Calcul = lazy(() => lecture().then((m) => ({ default: m.Calcul })))
const Histoire = lazy(() => lecture().then((m) => ({ default: m.Histoire })))

export default function PageBoids({ meta }) {
  const { lang } = useTexte()
  const theme = useTheme()
  const T = TEXTES[lang] ?? TEXTES.fr
  const [params, setParams] = useSearchParams()
  const vue = VUES.includes(params.get('vue')) ? params.get('vue') : 'simulation'
  const atelier = useRef(null)

  const changer = (v) => setParams(v === 'simulation' ? {} : { vue: v }, { replace: true })

  // Depuis un onglet de lecture : ouvrir un scénario dans l’explorateur
  const ouvrir = (id) => {
    atelier.current?.ouvrir(id)
    changer('simulation')
  }

  const ctx = { T, theme, lang, fmt: (n, o) => n.toLocaleString(T.nombre, o), ouvrir }

  return (
    <>
      <BarreProjet
        meta={meta}
        onglets={VUES.map((v) => ({ id: v, label: T.vues[v] }))}
        actif={vue}
        onChange={changer}
      />
      <Atelier ref={atelier} visible={vue === 'simulation'} T={T} />
      <Suspense fallback={<div className="lecture" />}>
        {vue === 'comprendre' && <Comprendre ctx={ctx} />}
        {vue === 'theorie' && <Theorie ctx={ctx} />}
        {vue === 'applications' && <Applications ctx={ctx} />}
        {vue === 'calcul' && <Calcul ctx={ctx} />}
        {vue === 'histoire' && <Histoire ctx={ctx} />}
      </Suspense>
    </>
  )
}
