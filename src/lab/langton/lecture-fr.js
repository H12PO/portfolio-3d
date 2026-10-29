// ============================================================
//  ARTICLES EN FRANÇAIS : Théorie, Histoire et références, figures
//  Blocs : { p }, { liste }, { tex }, { figure }, { preuve }, { expert },
//  { frise }, { refs }. Dans le texte : *italique* et $formule$ (LaTeX).
//  Sources : Bunimovich et Troubetzkoy (1992) ; Gale, Propp, Sutherland et
//  Troubetzkoy (1995) ; Gajardo, Moreira et Goles (2002) ; Wikipédia.
//  Les chiffres viennent du moteur (mesurerLangton, essaiAutoroute).
// ============================================================

const tex = String.raw

const PREUVE = [
  'Supposons la trajectoire bornée. Seul un nombre fini de cases est alors visité, et certaines le sont une infinité de fois. Notons *S* l’ensemble de ces cases. Les autres ne sont visitées qu’un nombre fini de fois : passé un certain pas, la fourmi ne quitte plus *S*.',
  'Choisissons dans *S* la case *c* la plus à droite, et parmi celles-ci la plus haute. Sa voisine de droite et sa voisine du dessus ne sont pas dans *S*.',
  'À chaque visite, la fourmi inverse la case *c* : elle y tourne donc alternativement à droite et à gauche.',
  '*Si c est toujours atteinte horizontalement*, la fourmi ne peut pas y arriver depuis la droite, puisque la voisine de droite n’est pas dans *S*. Elle y arrive donc toujours en allant vers la droite. En tournant à gauche, elle repart vers le haut ; en tournant à droite, vers le bas. Une visite sur deux, elle passe donc à la case du dessus, hors de *S*.',
  '*Si c est toujours atteinte verticalement*, la fourmi ne peut pas y arriver depuis le haut. Elle y arrive donc toujours en montant, et une visite sur deux, en tournant à droite, elle passe à la case de droite, hors de *S*.',
  'Dans les deux cas, la fourmi sort de *S* une infinité de fois, ce qui contredit le choix de *S*. La trajectoire n’est donc jamais bornée.',
]

export const LECTURE_FR = {
  theorie: [
    {
      id: 'bornee', titre: 'Une trajectoire jamais bornée', blocs: [
        { p: 'Quelle que soit la feuille de départ, même couverte de motifs, la fourmi finit toujours par s’éloigner indéfiniment : sa trajectoire n’est jamais bornée. Bunimovich et Troubetzkoy l’ont démontré en 1992 ; le résultat est souvent appelé théorème de Cohen-Kong.' },
        { p: 'Tout repose sur une observation. À chaque pas, la fourmi tourne d’un quart de tour : ses déplacements alternent donc *horizontal*, *vertical*, *horizontal*… Si l’on colorie la feuille en damier, elle change de couleur de damier à chaque pas. Avec $(x_t, y_t)$ sa position au pas $t$ :' },
        { tex: tex`x_t + y_t \equiv x_0 + y_0 + t \pmod 2` },
        { p: 'Une case donnée est donc toujours atteinte au même moment de l’alternance : toujours par un déplacement horizontal, ou toujours par un déplacement vertical.' },
        { figure: 'damier' },
        { preuve: 'Démonstration', source: 'Bunimovich et Troubetzkoy, 1992', paragraphes: PREUVE },
        { p: 'Conséquence : la fourmi ne repasse jamais par un état déjà vu (même feuille, même position, même orientation). Sinon, la règle étant déterministe, elle répéterait la même boucle pour toujours, et resterait bornée.' },
        {
          expert: 'énoncé formel', blocs: [
            { p: 'Notons $\\sigma : \\mathbb{Z}^2 \\to \\{0, 1\\}$ l’état de la feuille, $p \\in \\mathbb{Z}^2$ la position de la fourmi et $d \\in \\{\\pm e_1, \\pm e_2\\}$ son orientation. Avec $R$ la rotation d’un quart de tour dans le sens horaire, un pas est l’application' },
            { tex: tex`T(\sigma, p, d) = (\sigma', \, p + d', \, d') \quad \text{où} \quad d' = \begin{cases} R\,d & \text{si } \sigma(p) = 0 \\ R^{-1} d & \text{si } \sigma(p) = 1 \end{cases} \quad \text{et} \quad \sigma' = \sigma + \mathbf{1}_{\{p\}} \bmod 2.`, etroit: tex`\begin{gathered} T(\sigma, p, d) = (\sigma', \, p + d', \, d') \\[4pt] d' = \begin{cases} R\,d & \text{si } \sigma(p) = 0 \\ R^{-1} d & \text{si } \sigma(p) = 1 \end{cases} \\[4pt] \sigma' = \sigma + \mathbf{1}_{\{p\}} \bmod 2 \end{gathered}` },
            { p: '*Théorème* (Bunimovich et Troubetzkoy, 1992). Pour toute configuration initiale $\\sigma_0$, finie ou non, la suite des positions $(p_t)$ issue de $T$ n’est pas bornée :' },
            { tex: tex`\sup_{t \ge 0} \lVert p_t \rVert = +\infty.` },
            { p: 'L’argument vaut pour toute règle à plusieurs couleurs écrite avec des L et des R, à condition qu’elle contienne au moins un L et au moins un R : la couleur de la case extrême *c* parcourt tout le cycle, donc les deux virages s’y produisent une infinité de fois. La condition est nécessaire : avec seulement des L, la fourmi tourne en rond sur quatre cases. Avec les lettres N et U, l’alternance horizontal-vertical disparaît et l’argument ne s’applique plus.' },
            { p: 'Gale, Propp, Sutherland et Troubetzkoy surnomment ce résultat le « théorème fondamental de la myrmécologie ».' },
          ],
        },
      ],
    },
    {
      id: 'temps', titre: 'Remonter le temps', blocs: [
        { p: 'La règle est réversible : connaissant la feuille, la position de la fourmi et son orientation, on retrouve de façon unique l’état du pas précédent. La fourmi vient forcément de la case située derrière elle. Cette case a changé à son passage : on sait donc ce qu’elle était avant, et donc dans quel sens la fourmi y a tourné.' },
        { figure: 'retour' },
        {
          preuve: 'Défaire un pas', source: '', paragraphes: [
            'Notons *p* la position de la fourmi et *d* son orientation après un pas. Avant ce pas, elle était en *p − d*, la case derrière elle.',
            'Cette case a pris la couleur suivante lors du passage : sa couleur d’avant est donc la précédente dans le cycle.',
            'Cette couleur d’avant fixe le virage qui a été pris ; en le défaisant, on retrouve l’orientation d’avant. Chaque étape n’a qu’une seule possibilité : le pas précédent est unique.',
          ],
        },
        { p: 'Je l’ai vérifié sur la simulation : 11 000 pas en avant puis 11 000 en arrière ramènent exactement la feuille vide, pour les règles RL, LLRR, RLR et LRRRRRLLR. Ici, le retour en arrière n’est proposé que sans murs.' },
        {
          expert: 'l’application réciproque', blocs: [
            { p: '$T$ est une bijection de l’espace des états, et sa réciproque s’écrit explicitement :' },
            { tex: tex`T^{-1}(\sigma', p', d') = (\sigma, \, p' - d', \, d) \quad \text{où} \quad \sigma = \sigma' + \mathbf{1}_{\{p' - d'\}} \bmod 2, \quad d = \begin{cases} R^{-1} d' & \text{si } \sigma(p' - d') = 0 \\ R\,d' & \text{si } \sigma(p' - d') = 1. \end{cases}`, etroit: tex`\begin{gathered} T^{-1}(\sigma', p', d') = (\sigma, \, p' - d', \, d) \\[4pt] \sigma = \sigma' + \mathbf{1}_{\{p' - d'\}} \bmod 2 \\[4pt] d = \begin{cases} R^{-1} d' & \text{si } \sigma(p' - d') = 0 \\ R\,d' & \text{si } \sigma(p' - d') = 1 \end{cases} \end{gathered}` },
            { p: 'Avec $n$ couleurs et une règle $\\rho : \\mathbb{Z}_n \\to \\{\\mathrm{Id}, R, R^2, R^{-1}\\}$ (les lettres N, R, U, L), on remplace $+\\mathbf{1}_{\\{p\\}} \\bmod 2$ par $+\\mathbf{1}_{\\{p\\}} \\bmod n$ et l’on défait le virage $\\rho(\\sigma(p))$ : toutes les règles à lettres sont réversibles.' },
            { p: 'Les turmites, elles, ne le sont pas en général. Dans la spirale de Fibonacci, les entrées (état 0, couleur 0) et (état 0, couleur 1) donnent exactement le même résultat : écrire 1, tourner à gauche, passer à l’état 1. Après coup, impossible de savoir quelle couleur portait la case.' },
            { p: 'Conséquence de l’injectivité : deux histoires différentes ne se rejoignent jamais. Combinée à la non-bornitude, elle garantit que l’état de départ ne revient jamais.' },
          ],
        },
      ],
    },
    {
      id: 'chiffres', titre: 'L’autoroute en chiffres', blocs: [
        { p: 'Je relève la trajectoire de la fourmi sur une feuille vide de 1 024 × 1 024 cases. Ces mesures sont recalculées par votre navigateur à l’ouverture de l’onglet.' },
        { figure: 'courbe' },
        { figure: 'mesures' },
        { p: 'Deux régimes se lisent sur la courbe. Pendant le chaos, la distance maximale au départ croît à peu près comme la racine carrée du nombre de pas, comme pour une marche aléatoire. Sur l’autoroute, elle croît linéairement : la fourmi avance de $(\\pm 2, \\pm 2)$, soit une distance de $2\\sqrt{2}$, tous les 104 pas. Sa vitesse est donc' },
        { tex: tex`v = \frac{2\sqrt{2}}{104} \approx 0{,}0272 \ \text{case par pas.}` },
        { p: 'Ce sont des mesures sur une seule trajectoire, pas des lois démontrées. La littérature situe le début de l’autoroute au pas 9 977 ; je trouve 9 976 parce que je compte le premier pas comme le pas 0.' },
        {
          expert: 'feuilles de départ aléatoires', blocs: [
            { p: 'La conjecture de l’autoroute porte sur toutes les feuilles de départ finies. Je l’éprouve sur 200 feuilles aléatoires : chaque case d’un carré de 8 × 8 autour de la fourmi est marquée avec la probabilité 1/2, tirée par un générateur à graine fixe pour que l’expérience soit reproductible.' },
            { p: 'Pour chaque feuille, la fourmi avance jusqu’à ce que son mouvement soit exactement périodique pendant 10 cycles de 104 pas ; je remonte ensuite jusqu’au premier pas du régime périodique. Sur la feuille vide, cette méthode redonne exactement le pas 9 976.' },
            { figure: 'montecarlo' },
            { p: 'La feuille vide n’est pas un cas rapide : avec la graine 2026, la moitié des feuilles aléatoires construisent leur autoroute bien avant le pas 9 976. Toutes l’atteignent : la conjecture tient sur ces 200 essais, ce qui n’est évidemment pas une preuve.' },
            { p: 'Pour l’exposant du chaos, je fais une régression linéaire de $\\log d_{\\max}(t)$ sur $\\log t$, avec 40 instants répartis géométriquement entre les pas 500 et 9 876 :' },
            { tex: tex`\log d_{\max}(t) \approx \log C + \alpha \log t, \qquad \hat\alpha \approx 0{,}47, \qquad R^2 \approx 0{,}94.`, etroit: tex`\begin{gathered} \log d_{\max}(t) \approx \log C + \alpha \log t \\[4pt] \hat\alpha \approx 0{,}47, \quad R^2 \approx 0{,}94 \end{gathered}` },
            { p: 'Une marche aléatoire donnerait $\\alpha = 1/2$. La proximité est frappante, mais la fourmi est déterministe : ce n’est qu’une analogie.' },
          ],
        },
      ],
    },
    {
      id: 'symetrie', titre: 'Plus de couleurs, et la symétrie', blocs: [
        { p: 'Greg Turk et Jim Propp ont généralisé la règle à plusieurs couleurs : les couleurs se suivent en cycle, et chaque lettre donne le virage pour une couleur. Les comportements changent du tout au tout : RLR grandit de façon chaotique, LRRRRRLLR remplit un carré, RRLLLRLLLRRR construit un triangle qui finit par se déplacer.' },
        { p: 'Une famille se distingue. Si la règle, lue en boucle, alterne des séries de L et de R toutes de longueur paire (LLRR, LLLLRR, RRLLLL…), alors chaque fois que la fourmi repasse par son point de départ, le motif est symétrique par rapport à un axe. Gale, Propp, Sutherland et Troubetzkoy l’ont démontré en 1995.' },
        {
          expert: 'l’idée de la preuve', blocs: [
            { p: 'Dans chaque case, on dessine un pavé de Truchet : deux quarts de cercle qui relient des milieux de côtés voisins, orientés selon que la case fait tourner à gauche ou à droite. Les pavés s’assemblent en courbes fermées disjointes, les contours de Truchet, et la fourmi glisse le long de ces contours tant qu’elle ne modifie pas de case.' },
            { p: 'Avec des séries de longueur paire, une case qu’un contour visite deux fois ne change pas d’orientation au premier passage. La fourmi peut donc parcourir en entier un contour principal symétrique, revenir à son point de départ, puis recommencer avec le suivant. La démonstration conclut avec un graphe reliant les cases « chaudes » par leurs diagonales, un argument de parité des degrés et le théorème de Jordan.' },
            { p: 'La condition est suffisante, pas nécessaire, et la symétrie n’est garantie qu’aux retours au point de départ.' },
          ],
        },
      ],
    },
    {
      id: 'turmites', titre: 'Turmites', blocs: [
        { p: 'Donnez une mémoire à la fourmi : un état interne qui change à chaque pas. La table de transition dit, pour chaque état et chaque couleur, quelle couleur écrire, comment tourner et quel état prendre. C’est une machine de Turing dont le ruban est une feuille quadrillée : une turmite.' },
        { p: 'Cinq turmites sont proposées dans la simulation (Réglages, Règle, Turmites), chacune avec sa table de transition.' },
        {
          expert: 'définition et dénombrement', blocs: [
            { p: 'Une turmite à $s$ états et $n$ couleurs est une fonction de transition' },
            { tex: tex`\delta : \{0, \dots, s-1\} \times \mathbb{Z}_n \longrightarrow \mathbb{Z}_n \times \{N, R, U, L\} \times \{0, \dots, s-1\}`, etroit: tex`\begin{aligned} \delta : \ & \{0, \dots, s-1\} \times \mathbb{Z}_n \\ & \longrightarrow \mathbb{Z}_n \times \{N, R, U, L\} \times \{0, \dots, s-1\} \end{aligned}` },
            { p: 'qui donne, pour l’état $q$ de la fourmi et la couleur $c$ de sa case, la couleur à écrire, le virage et l’état suivant. Chacune des $sn$ entrées peut prendre $4ns$ valeurs, d’où' },
            { tex: tex`N(s, n) = (4ns)^{sn}, \qquad N(1, 2) = 8^2 = 64, \qquad N(2, 2) = 16^4 = 65\,536.`, etroit: tex`\begin{gathered} N(s, n) = (4ns)^{sn} \\[4pt] N(1, 2) = 8^2 = 64, \quad N(2, 2) = 16^4 = 65\,536 \end{gathered}` },
            { p: 'La fourmi de Langton est la turmite à un état $\\delta(0, 0) = (1, R, 0)$, $\\delta(0, 1) = (0, L, 0)$. Dans la notation de Golly utilisée ici, chaque entrée est un triplet (couleur, virage, état), avec les virages codés 1 (aucun), 2 (droite), 4 (demi-tour) et 8 (gauche) : la fourmi s’écrit 120080.' },
            { p: 'Brady cherchait des turmites qui s’arrêtent, l’équivalent des « castors affairés » (busy beavers) pour les machines de Turing. Il en a trouvé une à 2 états et 2 couleurs qui écrit 37 cases avant de s’arrêter, et une autre qui s’arrête après 121 pas.' },
          ],
        },
      ],
    },
    {
      id: 'calcul', titre: 'Calculer avec une fourmi', blocs: [
        { p: 'Gajardo, Moreira et Goles ont construit des feuilles de départ sur lesquelles le trajet d’une seule fourmi évalue n’importe quel circuit logique : certains motifs jouent le rôle de fils, d’autres de portes.' },
        { p: 'Ils en déduisent que prédire le comportement de la fourmi est un problème P-difficile. Sur des feuilles de départ infinies, la fourmi devient même universelle, et certaines questions à son sujet sont indécidables.' },
        {
          expert: 'ce que veut dire P-difficile', blocs: [
            { p: 'Un problème est P-difficile si tout problème résoluble en temps polynomial s’y ramène par une réduction très économe, en espace logarithmique. Comme on peut coder n’importe quel circuit dans une feuille de départ finie, prédire la fourmi est au moins aussi dur que n’importe quel calcul polynomial.' },
            { p: 'On pense que les problèmes P-complets ne se laissent pas accélérer massivement par le parallélisme : pour savoir où sera la fourmi, il faudrait pour l’essentiel la simuler pas à pas. Ce n’est pas démontré : cela reviendrait à prouver que les classes NC et P sont différentes.' },
            { p: 'Sur une feuille infinie, les circuits peuvent s’enchaîner sans fin : la fourmi simule une machine de Turing, et certaines questions sur son comportement futur deviennent indécidables, comme l’arrêt d’une machine de Turing.' },
          ],
        },
      ],
    },
    {
      id: 'ouvert', titre: 'Ce qu’on ne sait pas', blocs: [
        {
          liste: [
            '*La conjecture de l’autoroute.* Toutes les feuilles de départ finies testées finissent sur l’autoroute, mais personne n’a démontré que c’est toujours le cas.',
            '*RLR.* On ne sait pas si cette règle finit par construire une autoroute.',
            '*Le nombre 9 977.* Rien dans les deux règles ne laisse prévoir ce nombre : on le découvre en simulant.',
          ],
        },
        {
          expert: 'la conjecture, formellement', blocs: [
            { p: 'Pour toute configuration initiale $\\sigma_0$ à support fini, il existerait un pas $t_0$ et un vecteur $v \\in \\{(\\pm 2, \\pm 2)\\}$ tels que' },
            { tex: tex`\forall t \ge t_0, \qquad p_{t + 104} = p_t + v.` },
            { p: 'On sait seulement que la trajectoire n’est pas bornée. La conjecture ne porte que sur les feuilles finies : sur une feuille infinie, la fourmi peut simuler n’importe quel calcul, et aucune régularité de ce genre n’est attendue.' },
          ],
        },
      ],
    },
  ],

  histoire: [
    {
      id: 'frise', titre: 'Une courte histoire', blocs: [
        {
          frise: [
            ['1986', 'Chris Langton', 'introduit la fourmi dans « Studying artificial life with cellular automata » (Physica D), comme exemple de vie artificielle sur un automate cellulaire.'],
            ['1988', 'Allen H. Brady', 'étudie de son côté des machines de Turing orientées sur une grille, les « TurNing machines », et cherche celles qui tournent le plus longtemps avant de s’arrêter.'],
            ['1989', 'A. K. Dewdney', 'consacre sa rubrique « Computer Recreations » de Scientific American à ces fourmis et les baptise « tur-mites ». Greg Turk, qui les explorait aussi, lui avait écrit.'],
            ['1992', 'Bunimovich et Troubetzkoy', 'démontrent que la trajectoire n’est jamais bornée, dans un article sur les gaz de Lorentz sur réseau.'],
            ['1995', 'Gale, Propp, Sutherland et Troubetzkoy', 'démontrent la symétrie des règles à séries paires grâce aux pavages de Truchet, dans « Further travels with my ant ».'],
            ['2002', 'Gajardo, Moreira et Goles', 'montrent qu’une seule fourmi peut évaluer n’importe quel circuit logique : prédire son comportement est P-difficile.'],
            ['Aujourd’hui', '', 'Personne n’a encore démontré que toute feuille de départ finie mène à l’autoroute : la conjecture reste ouverte.'],
          ],
        },
      ],
    },
    {
      id: 'refs', titre: 'Références', blocs: [
        {
          refs: [
            ['C. G. Langton, « Studying artificial life with cellular automata », Physica D 22, 1986.'],
            ['L. A. Bunimovich et S. E. Troubetzkoy, « Recurrence properties of Lorentz lattice gas cellular automata », Journal of Statistical Physics 67, 1992.', 'https://doi.org/10.1007/BF01049035'],
            ['D. Gale, J. Propp, S. Sutherland et S. Troubetzkoy, « Further travels with my ant », The Mathematical Intelligencer, 1995.', 'https://arxiv.org/abs/math/9501233'],
            ['A. Gajardo, A. Moreira et E. Goles, « Complexity of Langton’s ant », Discrete Applied Mathematics, 2002.', 'https://arxiv.org/abs/nlin/0306022'],
            ['A. K. Dewdney, « Computer Recreations », Scientific American, septembre 1989.'],
            ['Wikipédia, « Langton’s ant ».', 'https://en.wikipedia.org/wiki/Langton%27s_ant'],
            ['Wikipédia, « Turmite ».', 'https://en.wikipedia.org/wiki/Turmite'],
            ['Tables de turmites de la collection de Golly, reprises par rm-hull/turmites.', 'https://github.com/rm-hull/turmites'],
          ],
        },
      ],
    },
  ],

  figures: {
    damier: {
      legende: 'Les cases se répartissent comme un damier. Avancez pas à pas : les cases teintées sont toujours atteintes par un déplacement horizontal, les cases unies par un déplacement vertical.',
      depart: 'Pas 0 : la fourmi est au centre, tournée vers le haut.',
      etat: (k, teintee, horizontal) => `Pas ${k}\u00a0: case ${teintee ? 'teintée' : 'unie'}, atteinte par un déplacement ${horizontal ? 'horizontal' : 'vertical'}.`,
      unPas: 'Un pas',
      recommencer: 'Recommencer',
    },
    retour: {
      legende: 'La même fourmi, en avant puis à rebours. Revenue au pas 0, elle laisse la feuille exactement vide.',
      avancer: 'Avancer de 2 000 pas',
      reculer: 'Remonter le temps',
      pas: (n) => `pas ${n}`,
      cases: (n, texte) => (n > 1 ? `${texte} cases marquées` : `${texte} case marquée`),
    },
    courbe: {
      titre: 'Distance de la fourmi à son point de départ',
      axeX: 'pas',
      axeY: 'cases',
      debut: (n) => `début de l’autoroute (pas ${n})`,
      info: (pas, d) => `pas ${pas}\u00a0: ${d} cases`,
      resume: (n) => `Courbe de la distance au départ en fonction du nombre de pas\u00a0: irrégulière et lente jusqu’au pas ${n}, puis linéaire.`,
      donnees: 'Voir les données',
      colPas: 'Pas',
      colDist: 'Distance au départ (cases)',
    },
    mesures: {
      titre: 'Mesures sur ma simulation',
      debut: 'Début du mouvement périodique',
      periode: 'Période',
      deplacement: 'Déplacement par période',
      vitesse: 'Vitesse sur l’autoroute',
      marquees: 'Cases marquées au début de l’autoroute',
      exposant: 'Exposant de croissance pendant le chaos',
      valeurs: {
        debut: (n) => `pas ${n}`,
        periode: (n) => `${n} pas`,
        deplacement: '2 cases en diagonale',
        vitesse: (v) => `√8 / 104 ≈ ${v} case par pas`,
        marquees: (n) => `${n}`,
        exposant: (x, a, b) => `${x}, ajusté entre les pas ${a} et ${b}`,
      },
    },
    montecarlo: {
      titre: 'Début de l’autoroute sur 200 feuilles de départ aléatoires',
      lancer: 'Lancer l’expérience',
      autre: 'Autre tirage',
      calcul: (k, n) => `Calcul\u00a0: ${k} feuilles sur ${n}`,
      attente: 'L’expérience tourne dans votre navigateur et prend une à deux secondes.',
      axeX: 'pas du début de l’autoroute',
      axeY: 'feuilles',
      vide: (n) => `feuille vide (pas ${n})`,
      barre: (a, b, k) => (b === null ? `à partir du pas ${a}\u00a0: ${k} ${k > 1 ? 'feuilles' : 'feuille'}` : `pas ${a} à ${b}\u00a0: ${k} ${k > 1 ? 'feuilles' : 'feuille'}`),
      resume: 'Histogramme du pas de début de l’autoroute pour 200 feuilles de départ aléatoires : la plupart avant le pas 10 000, quelques-unes beaucoup plus tard.',
      lignes: {
        atteintes: 'Feuilles qui atteignent l’autoroute',
        mediane: 'Médiane',
        deciles: 'Premier et dernier décile',
        extremes: 'Plus rapide et plus lente',
        graine: 'Graine du générateur',
      },
      valeurs: {
        atteintes: (k, n) => `${k} sur ${n}`,
        pas: (n) => `pas ${n}`,
        deux: (a, b) => `pas ${a} et ${b}`,
      },
      donnees: 'Voir les données',
      colTranche: 'Pas du début de l’autoroute',
      colNombre: 'Feuilles',
      tranche: (a, b) => (b === null ? `${a} et plus` : `${a} à ${b}`),
    },
  },
}
