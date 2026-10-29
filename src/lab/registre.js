import { lazy } from 'react'

// ============================================================
//  REGISTRE DES PROJETS
//  Un projet = un dossier src/lab/<id>/ contenant :
//    meta.js   → sa fiche (titre, domaine, statut…), lue tout de suite
//    index.js  → mount(canvas) pour la borne, et apercu(canvas) pour la page Projets
//    page.jsx  → (facultatif) une page complète, qui remplace le canvas simple
//  Ajouter un projet = créer le dossier. Rien d'autre à toucher.
// ============================================================

// Ordre des domaines sur la page Projets, et leur mise en page :
//   vitrine → grande image réelle + texte
//   liste   → une ligne par projet, avec les méthodes
//   ecrans  → des écrans de borne
// Un domaine sans projet n'apparaît pas.
export const DOMAINES = [
  { id: 'simulations', mise: 'vitrine' },
  { id: 'maths', mise: 'vitrine' },
  { id: 'algos', mise: 'vitrine' },
  { id: 'finance', mise: 'liste' },
  { id: 'jeux', mise: 'ecrans' },
  { id: 'entretiens', mise: 'liste' },
  { id: 'live', mise: 'vitrine' },
]

const fiches = import.meta.glob('./*/meta.js', { eager: true, import: 'default' })
const codes = import.meta.glob('./*/index.js')
const pages = import.meta.glob('./*/page.jsx')

const idDe = (chemin) => chemin.split('/')[1] // './langton/meta.js' → 'langton'

export const PROJETS = Object.entries(fiches)
  .map(([chemin, fiche]) => ({ ...fiche, id: idDe(chemin) }))
  // Les idées n'apparaissent qu'en local (npm run dev), jamais sur le site en ligne
  .filter((p) => p.statut !== 'idee' || import.meta.env.DEV)
  // rang = la place dans le classement de la feuille de route
  .sort((a, b) => (a.rang ?? 999) - (b.rang ?? 999))

export const trouver = (id) => PROJETS.find((p) => p.id === id)

export function charger(id) {
  const importer = codes[`./${id}/index.js`]
  return importer ? importer() : Promise.reject(new Error(`Pas de code pour le projet « ${id} »`))
}

// Pages complètes des projets qui en ont une : { langton: <composant chargé à la demande> }
// Créées une seule fois ici, pour que React garde toujours le même composant.
export const PAGES = Object.fromEntries(
  Object.entries(pages).map(([chemin, importer]) => [idDe(chemin), lazy(importer)]),
)

// Texte bilingue { fr, en } → la langue demandée, le français à défaut
export const pick = (texte, lang) =>
  texte && typeof texte === 'object' ? texte[lang] ?? texte.fr : texte
