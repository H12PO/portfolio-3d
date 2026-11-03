// ============================================================
//  TEXTES DE LA PAGE « JEU DE LA VIE » (FR / EN)
//  Interface, visite guidée et onglet Comprendre. Les articles Théorie,
//  Calcul et Histoire et références, avec leurs figures, sont dans
//  lecture-fr.js et lecture-en.js.
//  Dans les textes, *mot* s'affiche en italique.
// ============================================================

import { LECTURE_FR } from './lecture-fr'
import { LECTURE_EN } from './lecture-en'

export const TEXTES = {
  fr: {
    ...LECTURE_FR,
    nombre: 'fr-FR',
    vues: { simulation: 'Simulation', comprendre: 'Comprendre', theorie: 'Théorie', calcul: 'Calcul', histoire: 'Histoire et références' },

    /* ---------- Simulation ---------- */
    outils: { main: 'Déplacer', crayon: 'Crayon', gomme: 'Gomme', tampon: 'Tampon' },
    aides: {
      main: 'Glisser pour déplacer la vue. Molette ou pincement pour zoomer.',
      crayon: 'Cliquer ou glisser pour faire naître des cellules. En partant d’une cellule vivante, le crayon efface.',
      gomme: 'Glisser pour effacer.',
      tampon: 'Cliquer pour poser le motif choisi. R : tourner, F : retourner.',
    },
    zoomPlus: 'Zoomer',
    zoomMoins: 'Dézoomer',
    cadrage: 'Cadrage auto',
    lancer: 'Lancer',
    reprendre: 'Reprendre',
    pause: 'Pause',
    unPas: 'Une génération',
    reinitialiser: 'Réinitialiser',
    toutEffacer: 'Tout effacer',
    reinitialiserAide: 'Revient au motif de départ, tel qu’il était avant « Lancer »',
    toutEffacerAide: 'Vide la grille',
    raccourcis: 'Espace : lancer ou mettre en pause. Flèche droite : une génération.',
    vitesse: 'Vitesse',
    genParSeconde: (n) => `${n} gén./s`,
    max: 'max',
    statut: { pret: 'Prêt', enCours: 'En cours', pause: 'En pause', fini: 'Plus rien ne vit' },
    etatRegle: (r) => `règle ${r}`,
    etatGen: (n) => `génération ${n}`,
    etatPop: (n, texte) => (n > 1 ? `${texte} cellules` : `${texte} cellule`),
    etatVitesse: (n) => `${n} gén./s`,
    courbe: 'Population sur les dernières générations',

    reglages: 'Réglages',
    replier: 'Replier les réglages',
    deplier: 'Afficher les réglages',

    regle: 'Règle',
    prereglage: 'Préréglage',
    personnalisee: 'Personnalisée',
    naissance: 'Naissance',
    survie: 'Survie',
    voisines: 'Nombre de voisines vivantes qui fait naître une cellule, ou qui la garde en vie.',
    notation: 'Notation',
    appliquer: 'Appliquer',
    aideNotation: 'B : naissance, S : survie. Le jeu de la vie s’écrit B3/S23. Ajouter /C3 pour une règle à trois états.',
    invalide: 'Notation non reconnue. Exemples : B36/S23, B2/S/C3.',
    etats: (n) => `${n} états`,
    legendeEtats: (s) => (s === 1 ? 'vivante' : 'en train de mourir'),
    regles: {
      life: ['Jeu de la vie', 'La règle de Conway : naissance à 3 voisines, survie à 2 ou 3.'],
      highlife: ['HighLife', 'Une naissance de plus, à 6 voisines : un petit motif s’y recopie sans fin.'],
      daynight: ['Jour et nuit', 'Symétrique : les cases vides s’y comportent exactement comme les vivantes.'],
      seeds: ['Graines', 'Aucune cellule ne survit, et pourtant beaucoup de motifs explosent.'],
      sansmort: ['Vie sans mort', 'Une cellule ne meurt jamais : les motifs s’étalent comme de l’encre.'],
      labyrinthe: ['Labyrinthe', 'Les cellules creusent des couloirs.'],
      replicateur: ['Réplicateur', 'Tout motif finit par se recopier.'],
      brain: ['Brian’s Brain', 'Trois états : allumée, en train de s’éteindre, éteinte. Rien ne se fige.'],
      starwars: ['Star Wars', 'Quatre états : des vaisseaux qui filent et se percutent.'],
    },

    motifs: 'Motifs',
    choisirMotif: 'Choisir un motif',
    groupes: {
      stables: 'Natures mortes',
      oscillateurs: 'Oscillateurs',
      vaisseaux: 'Vaisseaux',
      canons: 'Canons',
      mathusalems: 'Mathusalems',
      croissance: 'Croissance sans fin',
    },
    nomsMotifs: {
      bloc: 'Bloc', ruche: 'Ruche', pain: 'Pain', bateau: 'Bateau', mangeur: 'Mangeur',
      clignotant: 'Clignotant', crapaud: 'Crapaud', balise: 'Balise', pulsar: 'Pulsar', huit: 'Huit', pentadecathlon: 'Pentadécathlon',
      planeur: 'Planeur', lwss: 'Vaisseau léger', mwss: 'Vaisseau moyen', hwss: 'Vaisseau lourd', copperhead: 'Copperhead',
      gosper: 'Canon de Gosper',
      rpentomino: 'R-pentomino', diehard: 'Diehard', gland: 'Gland',
      ligne39: 'Ligne de 39 cases',
    },
    poserCentre: 'Poser au centre',
    tourner: 'Tourner',
    retourner: 'Retourner',
    aideTampon: 'R : tourner, F : retourner, Échap : ranger le tampon.',
    rle: {
      titre: 'Format RLE',
      ouvrir: 'Importer ou exporter',
      coller: 'Collez un motif au format RLE (LifeWiki, Golly)',
      importer: 'Importer',
      exporter: 'Copier la grille en RLE',
      copie: 'Copié dans le presse-papiers.',
      erreur: 'Format RLE non reconnu.',
      vide: 'La grille est vide.',
      importe: (nom, n) => `${nom || 'Motif'}\u00a0: ${n} cellules, posé au centre et chargé dans le tampon.`,
    },

    soupe: 'Soupe aléatoire',
    densite: 'Densité',
    pourcent: (n) => `${n}\u202f%`,
    taille: 'Taille',
    nouvelleSoupe: 'Nouvelle soupe',
    tailleN: (n) => `${n} × ${n}`,

    affichage: 'Affichage',
    effetsNoms: { quadrillage: 'Quadrillage', age: 'Âge des cellules', trainees: 'Traînées', activite: 'Carte d’activité' },
    effetsAides: {
      age: 'Vert à la naissance, puis de plus en plus sombre.',
      trainees: 'Les cellules mortes laissent une trace qui s’efface.',
      activite: 'Plus une case a vu de naissances, plus elle est foncée.',
    },
    bordsTitre: 'Bords de la grille',
    bords: { ferme: 'Fermés : au-delà, tout est vide', tore: 'Les bords se rejoignent' },

    saut: {
      titre: 'Sauter dans le temps',
      aide: 'Hashlife calcule l’avenir du motif d’un seul coup, sur un plan infini : les bords de la grille n’existent plus.',
      taille: 'Saut',
      option: (n, p) => `${n} générations (${p})`,
      bouton: 'Sauter',
      encore: 'Sauter encore',
      generations: 'Hashlife ne traite ici que les règles à deux états.',
      fait: (n, ms) => `Saut de ${n} générations calculé en ${ms} ms.`,
      calcul: 'Calcul en cours…',
      trop: 'Motif trop chaotique : Hashlife dépasserait 2 millions de nœuds en mémoire. Laissez d’abord la simulation calmer le chaos, puis sautez.',
      vide: 'La grille est vide.',
      vue: {
        titre: 'Vue Hashlife',
        gen: (n) => `Génération ${n}`,
        texte: (pop) => `${pop} cellules vivantes. Le motif déborde de la grille\u00a0: Hashlife le montre sur un plan infini. Molette ou pincement pour zoomer.`,
        revenir: 'Revenir à la grille',
        statut: 'Vue Hashlife',
        noeuds: (n) => `${n} nœuds`,
      },
    },

    analyse: {
      titre: 'Analyse',
      vide: (g) => `Plus aucune cellule depuis la génération ${g}.`,
      stable: 'Nature morte : plus rien ne bouge.',
      oscillateur: (p) => `Oscillateur de période ${p}\u00a0: le motif revient à l’identique toutes les ${p} générations.`,
      vaisseau: (p, d, v) => `Vaisseau de période ${p}\u00a0: toutes les ${p} générations, il revient à l’identique, décalé ${d}. Vitesse\u00a0: ${v}.`,
      deplacement: (dx, dy) => {
        const k = Math.max(Math.abs(dx), Math.abs(dy))
        const cases = k > 1 ? `de ${k} cases` : 'd’une case'
        if (dx && dy) return Math.abs(dx) === Math.abs(dy) ? `${cases} en diagonale` : `de (${dx}, ${dy})`
        return `${cases} ${dx ? 'à l’horizontale' : 'à la verticale'}`
      },
      grand: 'Motif trop étendu pour l’analyse automatique.',
      enCours: 'Le motif évolue encore.',
      attente: 'Lancez la simulation : l’analyse reconnaît les natures mortes, les oscillateurs et les vaisseaux.',
      court: {
        vide: 'grille vide',
        stable: 'nature morte',
        oscillateur: (p) => `oscillateur, période ${p}`,
        vaisseau: (v) => `vaisseau ${v}`,
      },
    },

    visite: {
      etapeSur: (k, n) => `Visite guidée, étape ${k} sur ${n}`,
      continuer: 'Continuer',
      quitter: 'Quitter la visite',
      terminer: 'Terminer',
      etapes: [
        ['Cinq cellules', 'Le R-pentomino : cinq cellules, trouvées par John Conway en 1969. Les deux règles s’appliquent à chaque génération, rien d’autre.'],
        ['Un planeur', 'Génération 69 : cinq cellules se détachent et partent en diagonale. C’est un planeur, le premier jamais observé, repéré par Richard Guy. Il voyagera en ligne droite pour toujours.'],
        ['Le chaos', 'Des centaines de cellules s’agitent sans ordre apparent. Rien dans les cinq cellules de départ ne laissait prévoir cette explosion.'],
        ['Le calme', 'Génération 1 103 : tout se fige. Il reste 116 cellules : des blocs, des ruches, des clignotants, un bateau, un pain… et six planeurs qui s’éloignent.'],
        ['À vous', 'Dessinez, posez un motif de la bibliothèque, changez la règle. Ces deux règles suffisent à produire tout ce zoo.'],
      ],
    },

    /* ---------- Lecture ---------- */
    sommaire: 'Sur cette page',
    expert: 'Pour les experts',
    comprendre: [
      {
        id: 'regle', titre: 'La règle', blocs: [
          { p: 'Une grille de cases, chacune vivante ou morte. Chaque case a huit voisines : les quatre qui la touchent par un côté, les quatre qui la touchent par un coin. À chaque génération, toutes les cases changent en même temps :' },
          {
            liste: [
              'une case morte entourée d’exactement 3 voisines vivantes *naît* ;',
              'une case vivante entourée de 2 ou 3 voisines vivantes *survit* ;',
              'toutes les autres meurent ou restent mortes : d’isolement, avec moins de 2 voisines, d’étouffement, avec plus de 3.',
            ],
          },
          { p: 'Il n’y a pas de joueur : on dessine une configuration de départ, puis on regarde. Tout ce qui suit découle des deux règles.' },
        ],
      },
      {
        id: 'destins', titre: 'Quatre destins', blocs: [
          { p: 'Laissé à lui-même, un motif finit presque toujours de l’une de ces quatre façons :' },
          { figure: 'destins' },
          { p: 'Il peut aussi croître sans fin : c’est plus rare, et Conway lui-même pensait d’abord que c’était impossible. L’onglet Théorie raconte comment il a été démenti.' },
        ],
      },
      {
        id: 'rpentomino', titre: 'Le R-pentomino', blocs: [
          { p: 'Cinq cellules suffisent à produire plus de mille générations de chaos. La visite guidée suit le R-pentomino pas à pas, jusqu’à ce que tout se fige.' },
          { visite: 'Suivre la visite guidée', aide: 'La simulation s’arrête à chaque étape, avec une explication.' },
        ],
      },
      {
        id: 'regles', titre: 'Les règles de la simulation', blocs: [
          { p: 'Les réglages permettent de changer les deux nombres de la règle : combien de voisines font naître une cellule (B, pour *birth*), combien la gardent en vie (S, pour *survival*). Le jeu de la vie s’écrit B3/S23. Voici les règles proposées.' },
          { regles: true },
          { p: 'Brian’s Brain et Star Wars appartiennent à une autre famille, les règles *Generations* : une cellule qui ne survit pas passe par un ou plusieurs états « mourants » avant de disparaître, et seules les cellules pleinement vivantes comptent comme voisines.' },
        ],
      },
      {
        id: 'motifs', titre: 'Motifs et format RLE', blocs: [
          { p: 'La bibliothèque regroupe des motifs célèbres, rangés par famille. Le tampon les pose où l’on veut, tournés ou retournés.' },
          { p: 'Les amateurs du jeu de la vie s’échangent les motifs au format RLE : « 3o » signifie trois cellules vivantes, « 2b » deux cases vides, « $ » passe à la ligne suivante. Un motif copié sur LifeWiki se colle directement dans les réglages, et la grille entière s’exporte de la même façon.' },
        ],
      },
    ],
  },

  en: {
    ...LECTURE_EN,
    nombre: 'en-US',
    vues: { simulation: 'Simulation', comprendre: 'Understand', theorie: 'Theory', calcul: 'Computation', histoire: 'History and references' },

    outils: { main: 'Pan', crayon: 'Pencil', gomme: 'Eraser', tampon: 'Stamp' },
    aides: {
      main: 'Drag to move the view. Scroll or pinch to zoom.',
      crayon: 'Click or drag to bring cells to life. Starting on a live cell, the pencil erases.',
      gomme: 'Drag to erase.',
      tampon: 'Click to place the selected pattern. R: rotate, F: flip.',
    },
    zoomPlus: 'Zoom in',
    zoomMoins: 'Zoom out',
    cadrage: 'Auto framing',
    lancer: 'Start',
    reprendre: 'Resume',
    pause: 'Pause',
    unPas: 'One generation',
    reinitialiser: 'Reset',
    toutEffacer: 'Clear all',
    reinitialiserAide: 'Back to the starting pattern, as it was before “Start”',
    toutEffacerAide: 'Empties the grid',
    raccourcis: 'Space: start or pause. Right arrow: one generation.',
    vitesse: 'Speed',
    genParSeconde: (n) => `${n} gen/s`,
    max: 'max',
    statut: { pret: 'Ready', enCours: 'Running', pause: 'Paused', fini: 'Nothing left alive' },
    etatRegle: (r) => `rule ${r}`,
    etatGen: (n) => `generation ${n}`,
    etatPop: (n, texte) => (n === 1 ? `${texte} cell` : `${texte} cells`),
    etatVitesse: (n) => `${n} gen/s`,
    courbe: 'Population over the last generations',

    reglages: 'Settings',
    replier: 'Hide settings',
    deplier: 'Show settings',

    regle: 'Rule',
    prereglage: 'Preset',
    personnalisee: 'Custom',
    naissance: 'Birth',
    survie: 'Survival',
    voisines: 'Number of live neighbours that brings a cell to life, or keeps it alive.',
    notation: 'Notation',
    appliquer: 'Apply',
    aideNotation: 'B: birth, S: survival. The Game of Life is B3/S23. Add /C3 for a three-state rule.',
    invalide: 'Unrecognized notation. Examples: B36/S23, B2/S/C3.',
    etats: (n) => `${n} states`,
    legendeEtats: (s) => (s === 1 ? 'alive' : 'dying'),
    regles: {
      life: ['Game of Life', 'Conway’s rule: birth with 3 neighbours, survival with 2 or 3.'],
      highlife: ['HighLife', 'One more birth, with 6 neighbours: a small pattern copies itself forever.'],
      daynight: ['Day & Night', 'Symmetric: empty cells behave exactly like live ones.'],
      seeds: ['Seeds', 'No cell survives, and yet many patterns explode.'],
      sansmort: ['Life without death', 'A cell never dies: patterns spread like ink.'],
      labyrinthe: ['Maze', 'Cells carve out corridors.'],
      replicateur: ['Replicator', 'Every pattern ends up copying itself.'],
      brain: ['Brian’s Brain', 'Three states: on, dying, off. Nothing ever settles.'],
      starwars: ['Star Wars', 'Four states: spaceships that race and collide.'],
    },

    motifs: 'Patterns',
    choisirMotif: 'Pick a pattern',
    groupes: {
      stables: 'Still lifes',
      oscillateurs: 'Oscillators',
      vaisseaux: 'Spaceships',
      canons: 'Guns',
      mathusalems: 'Methuselahs',
      croissance: 'Endless growth',
    },
    nomsMotifs: {
      bloc: 'Block', ruche: 'Beehive', pain: 'Loaf', bateau: 'Boat', mangeur: 'Eater',
      clignotant: 'Blinker', crapaud: 'Toad', balise: 'Beacon', pulsar: 'Pulsar', huit: 'Figure eight', pentadecathlon: 'Pentadecathlon',
      planeur: 'Glider', lwss: 'Lightweight spaceship', mwss: 'Middleweight spaceship', hwss: 'Heavyweight spaceship', copperhead: 'Copperhead',
      gosper: 'Gosper glider gun',
      rpentomino: 'R-pentomino', diehard: 'Diehard', gland: 'Acorn',
      ligne39: '39-cell line',
    },
    poserCentre: 'Place at centre',
    tourner: 'Rotate',
    retourner: 'Flip',
    aideTampon: 'R: rotate, F: flip, Esc: put the stamp away.',
    rle: {
      titre: 'RLE format',
      ouvrir: 'Import or export',
      coller: 'Paste a pattern in RLE format (LifeWiki, Golly)',
      importer: 'Import',
      exporter: 'Copy the grid as RLE',
      copie: 'Copied to the clipboard.',
      erreur: 'RLE format not recognized.',
      vide: 'The grid is empty.',
      importe: (nom, n) => `${nom || 'Pattern'}: ${n} cells, placed at the centre and loaded into the stamp.`,
    },

    soupe: 'Random soup',
    densite: 'Density',
    pourcent: (n) => `${n}%`,
    taille: 'Size',
    nouvelleSoupe: 'New soup',
    tailleN: (n) => `${n} × ${n}`,

    affichage: 'Display',
    effetsNoms: { quadrillage: 'Grid lines', age: 'Cell age', trainees: 'Trails', activite: 'Activity map' },
    effetsAides: {
      age: 'Green when born, then darker and darker.',
      trainees: 'Dead cells leave a fading trace.',
      activite: 'The more births a cell has seen, the darker it is.',
    },
    bordsTitre: 'Grid edges',
    bords: { ferme: 'Closed: everything beyond is empty', tore: 'Edges wrap around' },

    saut: {
      titre: 'Jump ahead in time',
      aide: 'Hashlife computes the pattern’s future in one go, on an infinite plane: the grid edges no longer exist.',
      taille: 'Jump',
      option: (n, p) => `${n} generations (${p})`,
      bouton: 'Jump',
      encore: 'Jump again',
      generations: 'Here, Hashlife only handles two-state rules.',
      fait: (n, ms) => `Jump of ${n} generations computed in ${ms} ms.`,
      calcul: 'Computing…',
      trop: 'Pattern too chaotic: Hashlife would need more than 2 million nodes in memory. Let the simulation calm the chaos down first, then jump.',
      vide: 'The grid is empty.',
      vue: {
        titre: 'Hashlife view',
        gen: (n) => `Generation ${n}`,
        texte: (pop) => `${pop} live cells. The pattern overflows the grid: Hashlife shows it on an infinite plane. Scroll or pinch to zoom.`,
        revenir: 'Back to the grid',
        statut: 'Hashlife view',
        noeuds: (n) => `${n} nodes`,
      },
    },

    analyse: {
      titre: 'Analysis',
      vide: (g) => `No cell left since generation ${g}.`,
      stable: 'Still life: nothing moves any more.',
      oscillateur: (p) => `Oscillator of period ${p}: the pattern comes back identical every ${p} generations.`,
      vaisseau: (p, d, v) => `Spaceship of period ${p}: every ${p} generations it comes back identical, shifted ${d}. Speed: ${v}.`,
      deplacement: (dx, dy) => {
        const k = Math.max(Math.abs(dx), Math.abs(dy))
        const cases = k > 1 ? `${k} cells` : 'one cell'
        if (dx && dy) return Math.abs(dx) === Math.abs(dy) ? `${cases} diagonally` : `by (${dx}, ${dy})`
        return `${cases} ${dx ? 'horizontally' : 'vertically'}`
      },
      grand: 'Pattern too large for automatic analysis.',
      enCours: 'The pattern is still evolving.',
      attente: 'Start the simulation: the analysis recognizes still lifes, oscillators and spaceships.',
      court: {
        vide: 'empty grid',
        stable: 'still life',
        oscillateur: (p) => `oscillator, period ${p}`,
        vaisseau: (v) => `spaceship ${v}`,
      },
    },

    visite: {
      etapeSur: (k, n) => `Guided tour, step ${k} of ${n}`,
      continuer: 'Continue',
      quitter: 'Leave the tour',
      terminer: 'Finish',
      etapes: [
        ['Five cells', 'The R-pentomino: five cells, found by John Conway in 1969. The two rules apply at every generation, nothing else.'],
        ['A glider', 'Generation 69: five cells break away and head off diagonally. It is a glider, the first ever observed, spotted by Richard Guy. It will travel in a straight line forever.'],
        ['Chaos', 'Hundreds of cells churn with no visible order. Nothing in the five starting cells hinted at this explosion.'],
        ['Calm', 'Generation 1,103: everything settles. 116 cells remain: blocks, beehives, blinkers, a boat, a loaf… and six gliders drifting away.'],
        ['Your turn', 'Draw, place a pattern from the library, change the rule. These two rules are enough to produce this whole zoo.'],
      ],
    },

    sommaire: 'On this page',
    expert: 'For experts',
    comprendre: [
      {
        id: 'regle', titre: 'The rule', blocs: [
          { p: 'A grid of cells, each alive or dead. Every cell has eight neighbours: the four that share a side with it, the four that share a corner. At each generation, all cells change at once:' },
          {
            liste: [
              'a dead cell with exactly 3 live neighbours is *born*;',
              'a live cell with 2 or 3 live neighbours *survives*;',
              'all the others die or stay dead: of loneliness, with fewer than 2 neighbours, or of overcrowding, with more than 3.',
            ],
          },
          { p: 'There is no player: you draw a starting configuration, then watch. Everything that follows comes from the two rules.' },
        ],
      },
      {
        id: 'destins', titre: 'Four fates', blocs: [
          { p: 'Left alone, a pattern almost always ends up in one of these four ways:' },
          { figure: 'destins' },
          { p: 'It can also grow forever: that is rarer, and Conway himself first thought it was impossible. The Theory tab tells how he was proven wrong.' },
        ],
      },
      {
        id: 'rpentomino', titre: 'The R-pentomino', blocs: [
          { p: 'Five cells are enough to produce more than a thousand generations of chaos. The guided tour follows the R-pentomino step by step, until everything settles.' },
          { visite: 'Take the guided tour', aide: 'The simulation stops at each step, with an explanation.' },
        ],
      },
      {
        id: 'regles', titre: 'The rules in the simulation', blocs: [
          { p: 'The settings let you change the two numbers of the rule: how many neighbours bring a cell to life (B, for birth), how many keep it alive (S, for survival). The Game of Life is written B3/S23. Here are the rules on offer.' },
          { regles: true },
          { p: 'Brian’s Brain and Star Wars belong to another family, the *Generations* rules: a cell that does not survive goes through one or more “dying” states before it disappears, and only fully live cells count as neighbours.' },
        ],
      },
      {
        id: 'motifs', titre: 'Patterns and the RLE format', blocs: [
          { p: 'The library gathers famous patterns, sorted by family. The stamp places them anywhere, rotated or flipped.' },
          { p: 'Game of Life enthusiasts share patterns in RLE format: “3o” means three live cells, “2b” two empty cells, “$” moves to the next line. A pattern copied from LifeWiki can be pasted straight into the settings, and the whole grid can be exported the same way.' },
        ],
      },
    ],
  },
}