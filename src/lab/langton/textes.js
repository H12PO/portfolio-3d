// ============================================================
//  TEXTES DE LA PAGE « FOURMI DE LANGTON » (FR / EN)
//  Interface, visite guidée et onglet Comprendre. Les articles Théorie
//  et Histoire et références, avec leurs figures, sont dans
//  lecture-fr.js et lecture-en.js.
//  Dans les textes, *mot* s'affiche en italique.
// ============================================================

import { LECTURE_FR } from './lecture-fr'
import { LECTURE_EN } from './lecture-en'

export const TEXTES = {
  fr: {
    ...LECTURE_FR,
    nombre: 'fr-FR',
    pluriel: (n) => n > 1,    // 0 fourmi, 1 fourmi, 2 fourmis
    vues: { simulation: 'Simulation', comprendre: 'Comprendre', theorie: 'Théorie', histoire: 'Histoire et références' },

    /* ---------- Simulation ---------- */
    outils: { main: 'Déplacer', fourmi: 'Fourmi', mur: 'Mur', gomme: 'Gomme' },
    aides: {
      main: 'Glisser pour déplacer la vue. Molette ou pincement pour zoomer.',
      fourmi: 'Cliquer sur la feuille pour poser une fourmi.',
      mur: 'Dessiner des murs : la fourmi fait demi-tour dessus.',
      gomme: 'Effacer murs, cases et fourmis.',
    },
    zoomPlus: 'Zoomer',
    zoomMoins: 'Dézoomer',
    cadrage: 'Cadrage auto',
    lancer: 'Lancer',
    reprendre: 'Reprendre',
    pause: 'Pause',
    unPas: 'Un pas',
    reinitialiser: 'Réinitialiser',
    toutEffacer: 'Tout effacer',
    reinitialiserAide: 'Revient au pas 0 en gardant murs et fourmis de départ',
    toutEffacerAide: 'Retire aussi les murs et les fourmis ajoutées',
    raccourcis: 'Espace : lancer ou mettre en pause. Flèche droite : un pas.',
    vitesse: 'Vitesse',
    auto: 'auto',
    pasParImage: 'pas / image',
    statut: { pret: 'Prêt', enCours: 'En cours', pause: 'En pause', fini: 'Terminé' },
    etatRegle: (r) => `règle ${r}`,
    etatPas: (n) => `${n} pas`,
    fourmi: 'fourmi',
    fourmis: 'fourmis',
    etatAutoroute: (n) => `autoroute au pas ${n}`,
    etatIps: (n) => `${n} i/s`,

    reglages: 'Réglages',
    replier: 'Replier les réglages',
    deplier: 'Afficher les réglages',
    regle: 'Règle',
    types: { lettres: 'Couleurs', turmites: 'Turmites' },
    nbCouleurs: (n) => `${n} couleurs`,
    nbEtats: (n) => `${n} états`,
    prereglage: 'Préréglage',
    personnalisee: 'Personnalisée',
    choisir: 'Choisir une turmite',
    lettres: 'Lettres',
    appliquer: 'Appliquer',
    saisie: 'Une lettre par couleur : L gauche, R droite, N tout droit, U demi-tour. De 2 à 12 lettres.',
    invalide: 'Utilisez seulement L, R, N ou U, de 2 à 12 lettres.',
    vide: 'case vide',
    marquee: 'case marquée',
    couleurN: (k) => `couleur ${k}`,
    lettresVerbe: { L: 'tourne à gauche', R: 'tourne à droite', N: 'va tout droit', U: 'fait demi-tour' },
    tableTurmite: 'Pour chaque état et chaque couleur : la couleur écrite, le virage, puis l’état suivant.',
    etat: 'État',
    affichage: 'Affichage',
    effetsNoms: { surligneur: 'Surligner les derniers pas', quadrillage: 'Quadrillage', passages: 'Carte des passages' },
    bordsTitre: 'Bords de la feuille',
    bords: { arret: 'La fourmi s’arrête au bord', tore: 'Les bords se rejoignent' },

    presetsLettres: {
      RL: ['Classique', 'La fourmi de Langton : chaos, puis autoroute vers 10 000 pas.'],
      RLR: ['Chaos', 'Croissance chaotique. Personne ne sait si une autoroute finit par apparaître.'],
      LLRR: ['Symétrie', 'Croissance symétrique.'],
      LRRRRRLLR: ['Carré', 'Remplit un carré autour d’elle.'],
      LLRRRLRLRLLR: ['Autoroute tordue', 'Construit une autoroute alambiquée.'],
      RRLLLRLLLRRR: ['Triangle', 'Un triangle plein qui grandit, puis se déplace vers 15 900 pas.'],
    },
    presetsTurmites: {
      fibonacci: 'Spirale de Fibonacci',
      corde: 'Corde enroulée',
      art: 'Art informatique',
      vers: 'Traces de vers',
      spirale: 'Spirale rayée',
    },

    visite: {
      etapeSur: (k, n) => `Visite guidée, étape ${k} sur ${n}`,
      continuer: 'Continuer',
      quitter: 'Quitter la visite',
      terminer: 'Terminer',
      etapes: [
        ['Deux règles', 'Case vide : quart de tour à droite. Case marquée : quart de tour à gauche. La fourmi inverse la case et avance. C’est tout.'],
        ['Simplicité', 'Les premières centaines de pas donnent des motifs simples, souvent symétriques.'],
        ['Chaos', 'Puis plus rien ne se répète : pendant des milliers de pas, la fourmi semble errer au hasard. Elle applique pourtant toujours les deux mêmes règles.'],
        ['L’autoroute', 'Vers le pas 10 000, la fourmi entre dans un cycle de 104 pas qui la décale de deux cases en diagonale. Elle ne le quittera plus.'],
        ['Une question ouverte', 'On sait que la fourmi finit toujours par s’éloigner indéfiniment. Mais personne n’a démontré qu’elle construit toujours une autoroute. À vous : posez des murs, d’autres fourmis, changez la règle.'],
      ],
    },

    /* ---------- Lecture ---------- */
    sommaire: 'Sur cette page',
    comprendre: [
      {
        id: 'regle', titre: 'La règle', blocs: [
          { p: 'Une fourmi se déplace sur une feuille quadrillée. À chaque pas, elle regarde la case sous elle :' },
          { liste: ['case vide : elle tourne d’un quart de tour à droite ;', 'case marquée : elle tourne d’un quart de tour à gauche.'] },
          { p: 'Puis elle inverse la case (vide devient marquée, et l’inverse) et avance d’une case. C’est tout : aucune part de hasard, chaque pas découle du précédent.' },
        ],
      },
      {
        id: 'phases', titre: 'Trois phases', blocs: [
          { p: '*Simplicité.* Pendant les premières centaines de pas, la fourmi dessine des motifs simples, souvent symétriques.' },
          { p: '*Chaos.* Puis un grand motif irrégulier s’étend, sans structure visible, pendant près de 10 000 pas.' },
          { p: '*Ordre.* Enfin la fourmi entre dans un cycle de 104 pas qui la décale de deux cases en diagonale, et le répète sans fin : c’est l’« autoroute ».' },
          { visite: 'Suivre la visite guidée', aide: 'La simulation s’arrête à chaque phase, avec une explication.' },
        ],
      },
      {
        id: 'regles', titre: 'Les règles de la simulation', blocs: [
          { p: 'Dans les réglages, une règle s’écrit avec une lettre par couleur : L gauche, R droite, N tout droit, U demi-tour. Les couleurs se suivent en cycle ; la fourmi de Langton s’écrit RL. Voici celles qui sont proposées.' },
          { presets: true },
        ],
      },
      {
        id: 'fourmis', titre: 'Plusieurs fourmis et des murs', blocs: [
          { p: 'Ici, plusieurs fourmis jouent chacune à leur tour sur la même feuille. Elles ne se voient pas, mais chacune modifie le terrain des autres.' },
          { p: 'Un mur fait faire demi-tour à la fourmi au lieu de la laisser avancer. Quand les bords ne se rejoignent pas, une fourmi qui sort de la feuille disparaît.' },
          { p: 'D’autres choix sont possibles : Ed Pegg Jr a étudié des fourmis qui se divisent et s’annihilent en se rencontrant. Le comportement dépend fortement de ces choix.' },
        ],
      },
    ],
    expert: 'Pour les experts',
  },

  en: {
    ...LECTURE_EN,
    nombre: 'en-US',
    pluriel: (n) => n !== 1,  // 0 ants, 1 ant, 2 ants
    vues: { simulation: 'Simulation', comprendre: 'Understand', theorie: 'Theory', histoire: 'History and references' },

    outils: { main: 'Pan', fourmi: 'Ant', mur: 'Wall', gomme: 'Eraser' },
    aides: {
      main: 'Drag to move the view. Scroll or pinch to zoom.',
      fourmi: 'Click the sheet to drop an ant.',
      mur: 'Draw walls: ants turn around on them.',
      gomme: 'Erase walls, cells and ants.',
    },
    zoomPlus: 'Zoom in',
    zoomMoins: 'Zoom out',
    cadrage: 'Auto framing',
    lancer: 'Start',
    reprendre: 'Resume',
    pause: 'Pause',
    unPas: 'One step',
    reinitialiser: 'Reset',
    toutEffacer: 'Clear all',
    reinitialiserAide: 'Back to step 0, keeping walls and starting ants',
    toutEffacerAide: 'Also removes walls and added ants',
    raccourcis: 'Space: start or pause. Right arrow: one step.',
    vitesse: 'Speed',
    auto: 'auto',
    pasParImage: 'steps / frame',
    statut: { pret: 'Ready', enCours: 'Running', pause: 'Paused', fini: 'Finished' },
    etatRegle: (r) => `rule ${r}`,
    etatPas: (n) => `${n} steps`,
    fourmi: 'ant',
    fourmis: 'ants',
    etatAutoroute: (n) => `highway at step ${n}`,
    etatIps: (n) => `${n} fps`,

    reglages: 'Settings',
    replier: 'Hide settings',
    deplier: 'Show settings',
    regle: 'Rule',
    types: { lettres: 'Colors', turmites: 'Turmites' },
    nbCouleurs: (n) => `${n} colors`,
    nbEtats: (n) => `${n} states`,
    prereglage: 'Preset',
    personnalisee: 'Custom',
    choisir: 'Pick a turmite',
    lettres: 'Letters',
    appliquer: 'Apply',
    saisie: 'One letter per color: L left, R right, N straight, U U-turn. 2 to 12 letters.',
    invalide: 'Use only L, R, N or U, 2 to 12 letters.',
    vide: 'empty cell',
    marquee: 'marked cell',
    couleurN: (k) => `color ${k}`,
    lettresVerbe: { L: 'turns left', R: 'turns right', N: 'goes straight', U: 'turns around' },
    tableTurmite: 'For each state and color: the color written, the turn, then the next state.',
    etat: 'State',
    affichage: 'Display',
    effetsNoms: { surligneur: 'Highlight the latest steps', quadrillage: 'Grid lines', passages: 'Visit map' },
    bordsTitre: 'Sheet edges',
    bords: { arret: 'The ant stops at the edge', tore: 'Edges wrap around' },

    presetsLettres: {
      RL: ['Classic', 'Langton’s ant: chaos, then a highway around step 10,000.'],
      RLR: ['Chaos', 'Grows chaotically. Nobody knows whether a highway ever appears.'],
      LLRR: ['Symmetry', 'Grows symmetrically.'],
      LRRRRRLLR: ['Square', 'Fills a square around itself.'],
      LLRRRLRLRLLR: ['Twisted highway', 'Builds a convoluted highway.'],
      RRLLLRLLLRRR: ['Triangle', 'A filled triangle that grows, then starts moving around step 15,900.'],
    },
    presetsTurmites: {
      fibonacci: 'Fibonacci spiral',
      corde: 'Coiled rope',
      art: 'Computer art',
      vers: 'Worm trails',
      spirale: 'Striped spiral',
    },

    visite: {
      etapeSur: (k, n) => `Guided tour, step ${k} of ${n}`,
      continuer: 'Continue',
      quitter: 'Leave the tour',
      terminer: 'Finish',
      etapes: [
        ['Two rules', 'Empty cell: quarter turn right. Marked cell: quarter turn left. The ant flips the cell and moves on. That is all.'],
        ['Simplicity', 'The first few hundred steps give simple, often symmetric patterns.'],
        ['Chaos', 'Then nothing repeats: for thousands of steps the ant seems to wander at random. Yet it keeps applying the same two rules.'],
        ['The highway', 'Around step 10,000, the ant enters a 104-step cycle that shifts it two cells diagonally. It will never leave it.'],
        ['An open question', 'We know the ant always ends up drifting away forever. But nobody has proven that it always builds a highway. Your turn: add walls, more ants, change the rule.'],
      ],
    },

    sommaire: 'On this page',
    comprendre: [
      {
        id: 'regle', titre: 'The rule', blocs: [
          { p: 'An ant moves on a squared sheet. At each step, it looks at the cell beneath it:' },
          { liste: ['empty cell: it turns a quarter turn right;', 'marked cell: it turns a quarter turn left.'] },
          { p: 'Then it flips the cell (empty becomes marked, and the other way round) and moves forward one cell. That is all: no randomness, each step follows from the previous one.' },
        ],
      },
      {
        id: 'phases', titre: 'Three phases', blocs: [
          { p: '*Simplicity.* For the first few hundred steps, the ant draws simple, often symmetric patterns.' },
          { p: '*Chaos.* Then a large irregular pattern spreads, with no visible structure, for almost 10,000 steps.' },
          { p: '*Order.* Finally the ant enters a 104-step cycle that shifts it two cells diagonally, and repeats it forever: the “highway”.' },
          { visite: 'Take the guided tour', aide: 'The simulation stops at each phase, with an explanation.' },
        ],
      },
      {
        id: 'regles', titre: 'The rules in the simulation', blocs: [
          { p: 'In the settings, a rule has one letter per color: L left, R right, N straight, U U-turn. Colors follow a cycle; Langton’s ant is written RL. Here are the ones on offer.' },
          { presets: true },
        ],
      },
      {
        id: 'fourmis', titre: 'Several ants, and walls', blocs: [
          { p: 'Here, several ants take turns on the same sheet. They cannot see each other, but each one changes the ground the others walk on.' },
          { p: 'A wall makes the ant turn around instead of moving forward. When the edges do not wrap, an ant that leaves the sheet disappears.' },
          { p: 'Other choices are possible: Ed Pegg Jr studied ants that split and annihilate when they meet. The behaviour depends heavily on these choices.' },
        ],
      },
    ],
    expert: 'For experts',
  },
}
