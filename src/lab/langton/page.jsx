import { lazy, Suspense, useRef } from 'react'
import { useSearchParams } from 'react-router'
import BarreProjet from '../BarreProjet'
import { useTexte } from '../../site/textes'
import { useTheme } from '../../site/theme'
import { TEXTES } from './textes'
import Atelier from './Atelier'
import '../commun/atelier.css'
import './langton.css'

// ============================================================
//  PAGE « FOURMI DE LANGTON » : quatre onglets
//  L'onglet est rangé dans l'adresse (?vue=theorie) pour pouvoir
//  partager un lien direct vers la théorie.
//  L'atelier reste monté quand on lit : la simulation garde son état.
// ============================================================

const VUES = ['simulation', 'comprendre', 'theorie', 'histoire']

// Les onglets de lecture (et KaTeX, ~270 ko) ne sont chargés qu'à la première ouverture de l'un d'eux
const lecture = () => import('./Lecture')
const Comprendre = lazy(() => lecture().then((m) => ({ default: m.Comprendre })))
const Theorie = lazy(() => lecture().then((m) => ({ default: m.Theorie })))
const Histoire = lazy(() => lecture().then((m) => ({ default: m.Histoire })))

export default function PageLangton({ meta }) {
  const { lang } = useTexte()
  const theme = useTheme()
  const T = TEXTES[lang] ?? TEXTES.fr
  const [params, setParams] = useSearchParams()
  const demande = params.get('vue') === 'plusloin' ? 'histoire' : params.get('vue')   // ancien nom de l'onglet
  const vue = VUES.includes(demande) ? demande : 'simulation'
  const atelier = useRef(null)

  const changer = (v) => setParams(v === 'simulation' ? {} : { vue: v }, { replace: true })

  // Le bouton « Suivre la visite guidée » de l'onglet Comprendre
  const lancerVisite = () => {
    atelier.current?.lancerVisite()
    changer('simulation')
  }

  const ctx = { T, theme, lang, fmt: (n) => n.toLocaleString(T.nombre), onVisite: lancerVisite }

  return (
    <>
      <BarreProjet
        meta={meta}
        onglets={VUES.map((v) => ({ id: v, label: T.vues[v] }))}
        actif={vue}
        onChange={changer}
      />
      <Atelier ref={atelier} visible={vue === 'simulation'} theme={theme} T={T} />
      <Suspense fallback={<div className="lecture" />}>
        {vue === 'comprendre' && <Comprendre ctx={ctx} />}
        {vue === 'theorie' && <Theorie ctx={ctx} />}
        {vue === 'histoire' && <Histoire ctx={ctx} />}
      </Suspense>
    </>
  )
}
