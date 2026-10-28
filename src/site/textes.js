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
    nav: { projets: 'Projets', cv: 'CV' },
    intro: { raccourci: 'Pas le temps de jouer ?' },
    projets: {
      titre: 'Projets',
      sousTitre: 'Simulations, mathématiques et finance quantitative : des projets de code à ouvrir en un clic.',
      onglets: {
        une: 'À la une',
        simulations: 'Simulations',
        maths: 'Maths & génératif',
        algos: 'Algorithmes',
        jeux: 'Jeux',
        finance: 'Finance quantitative',
        entretiens: 'Entretiens',
        live: 'Données en direct',
      },
      enCours: 'En cours',
      idee: 'Idée',
      borne: 'Sur la borne',
      pause: 'Pause',
      reprendre: 'Reprendre',
      recommencer: 'Recommencer',
      erreur: 'Impossible de charger ce projet.',
    },
    cv: {
      titre: 'CV',
      bientot: 'Bientôt ici : le CV en version classique, rapide à lire.',
    },
  },

  en: {
    nom: 'Hippolyte',
    nav: { projets: 'Projects', cv: 'CV' },
    intro: { raccourci: 'No time to play?' },
    projets: {
      titre: 'Projects',
      sousTitre: 'Simulations, mathematics and quantitative finance: code projects, one click away.',
      onglets: {
        une: 'Featured',
        simulations: 'Simulations',
        maths: 'Maths & generative',
        algos: 'Algorithms',
        jeux: 'Games',
        finance: 'Quantitative finance',
        entretiens: 'Interviews',
        live: 'Live data',
      },
      enCours: 'In progress',
      idee: 'Idea',
      borne: 'On the arcade',
      pause: 'Pause',
      reprendre: 'Resume',
      recommencer: 'Restart',
      erreur: 'This project could not be loaded.',
    },
    cv: {
      titre: 'CV',
      bientot: 'Coming soon: the classic CV, quick to read.',
    },
  },
}

const lire = (dico, chemin) => chemin.split('.').reduce((o, k) => o?.[k], dico)

// t('projets.onglets.une') → le texte dans la langue courante, le français à défaut
export function useTexte() {
  const lang = useLangStore((s) => s.lang)
  const t = (chemin) => lire(TEXTES[lang], chemin) ?? lire(TEXTES.fr, chemin) ?? chemin
  return { t, lang }
}

// Titre de l'onglet du navigateur : « Projets · Hippolyte »
export function useTitre(titre) {
  useEffect(() => {
    const avant = document.title
    document.title = `${titre} · Hippolyte`
    return () => { document.title = avant }
  }, [titre])
}
