// ============================================================
//  CATALOGUE MUSICAL
//  Les fichiers vivent dans public/music/.
//  `auteur` et `licence` servent a l'attribution : les morceaux en CC BY
//  l'exigent, et un jukebox qui affiche le titre en cours est de toute
//  facon ce qu'on attend de lui.
// ============================================================

export const CATEGORIES = [
  { id: 'ambiance', fr: 'Ambiance', en: 'Ambient' },
  { id: 'jazz',     fr: 'Jazz',     en: 'Jazz' },
]

export const MORCEAUX = [
  { id: 'britons', titre: 'The Britons', auteur: 'Kevin MacLeod',
    categorie: 'ambiance', licence: 'Domaine public',
    fichier: '/music/the-britons.mp3' },
  { id: 'waltz', titre: 'Starting Out Waltz Vivace', auteur: 'Kevin MacLeod',
    categorie: 'ambiance', licence: 'CC BY 4.0',
    fichier: '/music/starting-out-waltz.mp3' },
  { id: 'space-jazz', titre: 'Space Jazz', auteur: 'Kevin MacLeod',
    categorie: 'jazz', licence: 'CC BY 4.0',
    fichier: '/music/space-jazz.mp3' },
]

// Joue en boucle tant que le visiteur ne choisit rien.
export const PLAYLIST_DEFAUT = ['britons', 'waltz', 'space-jazz']