import { useEffect } from 'react'
import { useLangStore } from '../i18n'

// ============================================================
//  TEXTES DU SITE VITRINE
//  Indépendants de fr.json / en.json (ceux de l'aéroport).
//  La langue vient du même store : le sélecteur FR / EN reste unique.
// ============================================================

const TEXTES = {
  fr: {
    nom: 'Hippolyte',
    nombre: 'fr-FR',
    nav: { projets: 'Projets', cv: 'CV' },
    intro: { raccourci: 'Pas le temps de jouer ?' },
    theme: { clair: 'Passer en thème clair', sombre: 'Passer en thème sombre' },
    projets: {
      titre: 'Projets',
      sousTitre: 'Ce que je code pour comprendre : simulations, mathématiques et finance quantitative.',
      compte: (n) => (n > 1 ? `${n} projets` : `${n} projet`),
      domaines: {
        simulations: 'Simulations',
        maths: 'Maths et génératif',
        algos: 'Algorithmes',
        jeux: 'Jeux',
        finance: 'Finance quantitative',
        entretiens: 'Entretiens',
        live: 'Données en direct',
      },
      statut: { fini: 'terminé', wip: 'en cours', idee: 'idée' },
      ouvrir: 'Ouvrir le projet',
      pause: 'Pause',
      reprendre: 'Reprendre',
      recommencer: 'Recommencer',
      erreur: 'Ce projet n’a pas pu se charger. Rechargez la page pour réessayer.',
    },
    cv: {
      titre: 'CV',
      bientot: 'Bientôt ici : le CV en version classique, rapide à lire.',
    },
  },

  en: {
    nom: 'Hippolyte',
    nombre: 'en-US',
    nav: { projets: 'Projects', cv: 'CV' },
    intro: { raccourci: 'No time to play?' },
    theme: { clair: 'Switch to light theme', sombre: 'Switch to dark theme' },
    projets: {
      titre: 'Projects',
      sousTitre: 'What I code to understand things: simulations, mathematics and quantitative finance.',
      compte: (n) => (n > 1 ? `${n} projects` : `${n} project`),
      domaines: {
        simulations: 'Simulations',
        maths: 'Maths and generative',
        algos: 'Algorithms',
        jeux: 'Games',
        finance: 'Quantitative finance',
        entretiens: 'Interviews',
        live: 'Live data',
      },
      statut: { fini: 'done', wip: 'in progress', idee: 'idea' },
      ouvrir: 'Open the project',
      pause: 'Pause',
      reprendre: 'Resume',
      recommencer: 'Restart',
      erreur: 'This project failed to load. Reload the page to try again.',
    },
    cv: {
      titre: 'CV',
      bientot: 'Coming soon: the classic CV, quick to read.',
    },
  },
}

const lire = (dico, chemin) => chemin.split('.').reduce((o, k) => o?.[k], dico)

// t('projets.domaines.finance') → le texte dans la langue courante, le français à défaut
export function useTexte() {
  const lang = useLangStore((s) => s.lang)
  const t = (chemin) => lire(TEXTES[lang], chemin) ?? lire(TEXTES.fr, chemin) ?? chemin
  return { t, lang, nombre: (n, options) => n.toLocaleString(t('nombre'), options) }
}

// Titre de l'onglet du navigateur : « Projets · Hippolyte »
export function useTitre(titre) {
  useEffect(() => {
    const avant = document.title
    document.title = `${titre} · Hippolyte`
    return () => { document.title = avant }
  }, [titre])
}
