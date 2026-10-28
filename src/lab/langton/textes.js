// ============================================================
//  TEXTES DE LA PAGE « FOURMI DE LANGTON » (FR / EN)
//  Faits vérifiés sur les pages Wikipédia « Langton's ant » et
//  « Turmite » (octobre 2026), tables de turmites de Golly.
// ============================================================

export const TEXTES = {
  fr: {
    nombre: 'fr-FR',
    pluriel: (n) => n > 1,    // 0 fourmi, 1 fourmi, 2 fourmis

    // Barre du haut : outils et vue
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
    auto: 'auto',

    // Barre du bas : lecture
    lancer: 'Lancer',
    reprendre: 'Reprendre',
    pause: 'Pause',
    unPas: 'Un pas',
    reinitialiser: 'Réinitialiser',
    toutEffacer: 'Tout effacer',
    toutEffacerAide: 'Retire aussi les murs et les fourmis ajoutées',
    reinitialiserAide: 'Revient au pas 0 en gardant murs et fourmis de départ',
    raccourcis: 'Espace : lancer ou mettre en pause. Flèche droite : un pas.',
    vitesse: 'Vitesse',
    pasParImage: 'pas par image',
    pas: 'pas',
    fourmi: 'fourmi',
    fourmis: 'fourmis',
    autorouteAu: 'autoroute au pas',
    plusDeFourmi: 'les fourmis ont quitté la feuille',

    // Marge
    onglets: { reglages: 'Réglages', comprendre: 'Comprendre' },
    regle: 'Règle',
    types: { lettres: 'Couleurs', turmites: 'Turmites' },
    votreRegle: 'Votre règle',
    saisie: 'Une lettre par couleur : L gauche, R droite, N tout droit, U demi-tour. De 2 à 12 lettres.',
    appliquer: 'Appliquer',
    invalide: 'Utilisez seulement L, R, N ou U, de 2 à 12 lettres.',
    legende: 'Sur chaque couleur, la fourmi :',
    lettresVerbe: { L: 'tourne à gauche', R: 'tourne à droite', N: 'va tout droit', U: 'fait demi-tour' },
    tableTurmite: 'Pour chaque état et chaque couleur : la couleur écrite, le virage, puis l’état suivant.',
    etat: 'État',
    couleur: 'Couleur',
    affichage: 'Affichage',
    effetsNoms: { surligneur: 'Surligneur sur les derniers pas', quadrillage: 'Quadrillage', passages: 'Carte des passages' },
    bordsTitre: 'Bords de la feuille',
    bords: { arret: 'La fourmi s’arrête au bord', tore: 'Les bords se rejoignent (tore)' },

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

    // Fiche
    visiteLancer: 'Suivre la visite guidée',
    fiche: [
      {
        titre: 'La règle',
        texte: [
          'Une fourmi se déplace sur une grille. Sur une case vide, elle tourne d’un quart de tour à droite ; sur une case marquée, à gauche. Elle inverse l’état de la case, puis avance d’une case.',
          'Deux règles, aucune part de hasard : tout ce qui suit est entièrement déterminé.',
        ],
      },
      {
        titre: 'Trois phases',
        texte: [
          'Simplicité : pendant les premières centaines de pas, la fourmi dessine des motifs simples, souvent symétriques.',
          'Chaos : un grand motif irrégulier s’étend, sans structure visible, jusque vers le pas 9 977.',
          'Ordre : la fourmi entre alors dans un cycle de 104 pas qui la décale de deux cases en diagonale, et le répète sans fin. C’est l’« autoroute ».',
        ],
      },
      {
        titre: 'Ce qui est démontré, et ce qui ne l’est pas',
        texte: [
          'La trajectoire de la fourmi n’est jamais bornée, quelle que soit la grille de départ (Bunimovich et Troubetzkoy, 1992 ; résultat connu sous le nom de théorème de Cohen-Kong).',
          'Toutes les grilles de départ finies testées finissent sur l’autoroute, mais personne n’a démontré que c’est toujours le cas.',
          'En 2002, Gajardo, Moreira et Goles ont montré qu’avec une grille de départ bien choisie, le trajet d’une seule fourmi peut calculer n’importe quel circuit logique.',
        ],
      },
      {
        titre: 'Plus de couleurs',
        texte: [
          'Greg Turk et Jim Propp ont généralisé la règle : les couleurs se suivent en cycle, et chaque lettre donne le virage pour une couleur. La fourmi de Langton s’écrit RL.',
          'Quand le nom est formé de paires de lettres identiques, comme LLRR, les motifs redeviennent symétriques encore et encore. C’est une condition suffisante, démontrée à l’aide des pavages de Truchet.',
        ],
      },
      {
        titre: 'Turmites',
        texte: [
          'Donnez une mémoire à la fourmi : un état interne qui change à chaque pas. La table de transition dit, pour chaque état et chaque couleur, quelle couleur écrire, comment tourner et quel état prendre. C’est une machine de Turing dont le ruban est une grille.',
          'Allen H. Brady les étudie en 1988 sous le nom de « TurNing machines » ; Greg Turk les explore de son côté ; A. K. Dewdney les baptise « tur-mites » en 1989 dans Scientific American.',
        ],
      },
      {
        titre: 'Choix de cette simulation',
        texte: [
          'Plusieurs fourmis jouent chacune à leur tour sur la même grille : elles ne se voient pas, mais chacune modifie le terrain des autres.',
          'Un mur fait faire demi-tour à la fourmi au lieu de la laisser avancer. Quand les bords ne se rejoignent pas, une fourmi qui sort de la feuille disparaît.',
        ],
      },
    ],
    sources: 'Sources : C. G. Langton, « Studying artificial life with cellular automata », Physica D, 1986. Wikipédia, « Langton’s ant » et « Turmite ». Collection de turmites du logiciel Golly.',

    // Visite guidée
    visite: 'Visite guidée',
    etapeSur: (k, n) => `Visite guidée, étape ${k} sur ${n}`,
    continuer: 'Continuer',
    quitter: 'Quitter la visite',
    terminer: 'Terminer',
    etapes: [
      ['Deux règles', 'Case vide : quart de tour à droite. Case marquée : quart de tour à gauche. La fourmi inverse la case et avance. C’est tout.'],
      ['Simplicité', 'Les premières centaines de pas donnent des motifs simples, souvent symétriques.'],
      ['Chaos', 'Puis plus rien ne se répète : pendant des milliers de pas, la fourmi semble errer au hasard. Elle applique pourtant toujours les deux mêmes règles.'],
      ['L’autoroute', 'Vers le pas 10 000, la fourmi entre dans un cycle de 104 pas qui la décale de deux cases en diagonale. Elle ne le quittera plus.'],
      ['Une question ouverte', 'On sait que la fourmi finit toujours par s’éloigner à l’infini. Mais personne n’a démontré qu’elle construit toujours une autoroute. À vous de jouer : posez des murs, d’autres fourmis, changez la règle.'],
    ],
  },

  en: {
    nombre: 'en-US',
    pluriel: (n) => n !== 1,  // 0 ants, 1 ant, 2 ants

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
    auto: 'auto',

    lancer: 'Start',
    reprendre: 'Resume',
    pause: 'Pause',
    unPas: 'One step',
    reinitialiser: 'Reset',
    toutEffacer: 'Clear all',
    toutEffacerAide: 'Also removes walls and added ants',
    reinitialiserAide: 'Back to step 0, keeping walls and starting ants',
    raccourcis: 'Space: start or pause. Right arrow: one step.',
    vitesse: 'Speed',
    pasParImage: 'steps per frame',
    pas: 'steps',
    fourmi: 'ant',
    fourmis: 'ants',
    autorouteAu: 'highway at step',
    plusDeFourmi: 'the ants have left the sheet',

    onglets: { reglages: 'Settings', comprendre: 'Learn' },
    regle: 'Rule',
    types: { lettres: 'Colors', turmites: 'Turmites' },
    votreRegle: 'Your rule',
    saisie: 'One letter per color: L left, R right, N straight, U U-turn. 2 to 12 letters.',
    appliquer: 'Apply',
    invalide: 'Use only L, R, N or U, 2 to 12 letters.',
    legende: 'On each color, the ant:',
    lettresVerbe: { L: 'turns left', R: 'turns right', N: 'goes straight', U: 'turns around' },
    tableTurmite: 'For each state and color: the color written, the turn, then the next state.',
    etat: 'State',
    couleur: 'Color',
    affichage: 'Display',
    effetsNoms: { surligneur: 'Highlight the latest steps', quadrillage: 'Grid lines', passages: 'Visit map' },
    bordsTitre: 'Sheet edges',
    bords: { arret: 'The ant stops at the edge', tore: 'Edges wrap around (torus)' },

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

    visiteLancer: 'Take the guided tour',
    fiche: [
      {
        titre: 'The rule',
        texte: [
          'An ant moves on a grid. On an empty cell it turns a quarter turn right; on a marked cell, left. It flips the cell, then moves forward one cell.',
          'Two rules, no randomness: everything that follows is fully determined.',
        ],
      },
      {
        titre: 'Three phases',
        texte: [
          'Simplicity: for the first few hundred steps, the ant draws simple, often symmetric patterns.',
          'Chaos: a large irregular pattern spreads with no visible structure, until around step 9,977.',
          'Order: the ant then enters a 104-step cycle that shifts it two cells diagonally, and repeats it forever. This is the “highway”.',
        ],
      },
      {
        titre: 'What is proven, and what is not',
        texte: [
          'The ant’s trajectory is always unbounded, whatever the starting grid (Bunimovich and Troubetzkoy, 1992; known as the Cohen-Kong theorem).',
          'Every finite starting grid tested ends on the highway, but nobody has proven that this always happens.',
          'In 2002, Gajardo, Moreira and Goles showed that with a well-chosen starting grid, the path of a single ant can compute any logic circuit.',
        ],
      },
      {
        titre: 'More colors',
        texte: [
          'Greg Turk and Jim Propp generalized the rule: colors follow a cycle, and each letter gives the turn for one color. Langton’s ant is written RL.',
          'When the name is made of pairs of identical letters, like LLRR, the patterns become symmetric again and again. This sufficient condition is proven with Truchet tiles.',
        ],
      },
      {
        titre: 'Turmites',
        texte: [
          'Give the ant a memory: an internal state that changes at every step. The transition table says, for each state and color, which color to write, how to turn and which state to take. It is a Turing machine whose tape is a grid.',
          'Allen H. Brady studied them in 1988 as “TurNing machines”; Greg Turk explored them independently; A. K. Dewdney named them “tur-mites” in Scientific American in 1989.',
        ],
      },
      {
        titre: 'Choices made in this simulation',
        texte: [
          'Several ants take turns on the same grid: they cannot see each other, but each one changes the ground the others walk on.',
          'A wall makes the ant turn around instead of moving forward. When the edges do not wrap, an ant that leaves the sheet disappears.',
        ],
      },
    ],
    sources: 'Sources: C. G. Langton, “Studying artificial life with cellular automata”, Physica D, 1986. Wikipedia, “Langton’s ant” and “Turmite”. Turmite collection from the Golly software.',

    visite: 'Guided tour',
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
}
