// ============================================================
//  ARTICLES EN FRANÇAIS : Comprendre, Théorie, Applications, Calcul,
//  Histoire et références, et les textes des figures
//  Blocs : { p }, { liste }, { tex, etroit? }, { figure }, { expert },
//  { frise }, { refs }, { ouvrir, libelle, aide }. Dans le texte :
//  *italique* et $formule$ (LaTeX).
//  Les chiffres « dans nos simulations » viennent du moteur de
//  l'explorateur (tests en Node, voir donnees.js et scenarios.js).
//  Les autres viennent des articles cités dans les références.
// ============================================================

const tex = String.raw

export const LECTURE_FR = {
  comprendre: [
    {
      id: 'idee', titre: 'Des préférences modestes, une ville séparée', blocs: [
        { p: 'Prenez un damier. Posez au hasard des jetons de deux couleurs, et laissez quelques cases vides. Chaque jeton a une seule exigence, modeste : qu’au moins un tiers de ses voisins aient sa couleur. Il accepte donc volontiers d’être en minorité. S’il n’est pas satisfait, il déménage vers une case vide.' },
        { p: 'On s’attendrait à une ville mêlée, puisque personne ne demande l’entre-soi. C’est pourtant une ville séparée qui apparaît, en quelques tours : des quartiers d’une seule couleur, séparés par des frontières nettes. Au départ, un voisin sur deux ressemble à chacun ; à la fin, trois sur quatre.' },
        { figure: 'damier' },
        { p: 'C’est l’expérience que l’économiste Thomas Schelling fait à la main à la fin des années 1960, avec des pièces de monnaie sur un damier. Elle montre une idée qui dépasse de loin la question des villes : des choix individuels raisonnables peuvent produire un résultat collectif que personne n’a voulu. Schelling en fera le titre d’un livre : *Micromotives and Macrobehavior*, les petits motifs et les grands comportements.' },
      ],
    },
    {
      id: 'regle', titre: 'La règle du jeu', blocs: [
        { p: 'Dans l’explorateur, la ville est une grille de 100 × 100 cases. Chaque case est un logement, occupé ou vide. Les voisins d’un habitant sont les huit cases qui l’entourent. À chaque tour, chaque habitant est réveillé une fois en moyenne, dans un ordre tiré au hasard :' },
        {
          liste: [
            'il compte, parmi ses voisins occupés, la part de ceux qui appartiennent à son groupe ;',
            'si cette part atteint sa *tolérance* (un tiers, la moitié…), il est satisfait et ne bouge pas ;',
            'sinon, il visite seize logements vides tirés au hasard, et s’installe dans celui qui le satisfait, s’il y en a un.',
          ],
        },
        { p: 'C’est tout. Personne ne voit la ville entière, personne ne planifie de quartier. La ségrégation n’est inscrite dans aucune règle : elle *émerge* des déménagements successifs, chacun rendant un peu plus probable le suivant.' },
      ],
    },
    {
      id: 'lire-ville', titre: 'Lire une ville', blocs: [
        { p: 'Chaque petit carré est un logement. Sa couleur dit qui l’habite : orange pour le groupe 1, bleu pour le groupe 2, puis vert, rose et jaune quand il y a plus de groupes. Les carrés sombres sont des logements vides. Dans la ville inventée, la bande bleu foncé est une rivière et les taches vert foncé sont des parcs : personne n’y habite.' },
        { p: 'Les *vues*, en haut de l’explorateur, changent ce que disent les couleurs. *Satisfaction* : bleu pour un habitant satisfait, rouge orangé pour un insatisfait, jaune pour un habitant dont le loyer est devenu trop cher. *Revenus*, *Loyers* et *Attrait* : du violet (bas) au jaune (élevé).' },
        { p: 'Les courbes, sous la ville, la suivent au fil des tours. La plus simple à lire est *Voisins semblables* : la part moyenne des voisins qui appartiennent au même groupe. Si les habitants étaient placés au hasard, elle vaudrait la part de leur groupe dans la ville, soit 50 % pour deux groupes égaux. Plus elle monte au-dessus, plus la ville est séparée.' },
        { p: 'Un *tour*, c’est le temps pour que chaque habitant ait eu, en moyenne, une occasion de déménager. Sept des douze scénarios comparent deux villes côte à côte : elles partent exactement du même tirage et ne diffèrent que par un réglage. Toute différence qui apparaît vient donc de ce réglage.' },
        { p: 'Voici les douze scénarios, un par un. Pour chacun : la question posée, les règles, ce qu’il faut regarder, et ce qui se passe. Les images sont calculées dans votre navigateur, sur une petite ville, avec le même moteur que l’explorateur.' },
      ],
    },
    { id: 'sc-damier', titre: '1. Le damier de Schelling', blocs: [{ fiche: 'damier' }] },
    { id: 'sc-seuil', titre: '2. Le seuil', blocs: [{ fiche: 'seuil' }] },
    { id: 'sc-mixite', titre: '3. Tous veulent la mixité', blocs: [{ fiche: 'mixite' }] },
    { id: 'sc-bruit', titre: '4. Le hasard', blocs: [{ fiche: 'bruit' }] },
    { id: 'sc-revenus', titre: '5. Riches et pauvres', blocs: [{ fiche: 'revenus' }] },
    { id: 'sc-gentrification', titre: '6. Le centre s’embourgeoise', blocs: [{ fiche: 'gentrification' }] },
    { id: 'sc-social', titre: '7. Logement social', blocs: [{ fiche: 'social' }] },
    { id: 'sc-discrimination', titre: '8. Discrimination', blocs: [{ fiche: 'discrimination' }] },
    { id: 'sc-amis', titre: '9. Les amis', blocs: [{ fiche: 'amis' }] },
    { id: 'sc-attachement', titre: '10. Attachement', blocs: [{ fiche: 'attachement' }] },
    { id: 'sc-arrivees', titre: '11. Une ville qui change', blocs: [{ fiche: 'arrivees' }] },
    { id: 'sc-quatre', titre: '12. Une petite minorité', blocs: [{ fiche: 'quatre' }] },
    {
      id: 'lire', titre: 'Ce que le modèle dit, et ce qu’il ne dit pas', blocs: [
        { p: 'Les douze scénarios montrent la même chose sous douze angles : une ville peut se séparer fortement sans que personne ne le veuille. Des préférences modestes suffisent (scénarios 1 et 2), des préférences pour la mixité aussi (3), et même aucune préférence, quand les prix (5, 6) ou une discrimination (8) font le tri.' },
        { p: 'Le modèle ne dit pas pour autant pourquoi une ville réelle est séparée : dans le monde réel, tous ces mécanismes jouent ensemble, avec l’histoire des quartiers et les politiques de logement. Il dit autre chose, de plus troublant : on ne peut pas lire les intentions des individus dans le résultat collectif. Une ville très séparée peut naître de gens peu exigeants, et une ville mêlée peut cacher des habitants mécontents. Les onglets Théorie et Applications vont plus loin.' },
      ],
    },
  ],

  theorie: [
    {
      id: 'modele', titre: 'Le modèle, précisément', blocs: [
        { p: 'Une ville est un ensemble de cases $x$, chacune vide ou occupée par un habitant $i$ d’un groupe $g_i \\in \\{1, \\dots, G\\}$. Les voisins d’une case sont les 8 cases qui l’entourent (le *voisinage de Moore*). Pour un habitant $i$ installé en $x$, on note $n_i$ le nombre de voisins occupés et $n_i^{=}$ le nombre de voisins de son groupe. La part de voisins semblables est' },
        { tex: tex`s_i = \frac{n_i^{=}}{n_i}, \qquad \text{et l'habitant est satisfait si } \; s_i \geq \tau_{g_i},` },
        { p: 'où $\\tau_g$ est la tolérance du groupe $g$ (un habitant sans voisin est satisfait). La dynamique est *asynchrone* : à chaque instant, un seul habitant, tiré au hasard, peut bouger. Un « tour » compte autant d’activations qu’il y a d’habitants. Activé et insatisfait, un habitant visite $k = 16$ logements vides tirés au hasard et s’installe dans un logement qui le satisfait, s’il en trouve un.' },
        { p: 'Schelling, lui, faisait bouger les mécontents dans un ordre fixé, vers la case satisfaisante *la plus proche*. Notre règle, plus proche des versions informatiques modernes, mélange davantage : à tolérance égale, elle sépare un peu plus. Les deux donnent la même image qualitative.' },
        {
          expert: 'les tolérances ne valent que par paliers', blocs: [
            { p: 'Avec $n_i \\leq 8$, la part $s_i$ ne prend qu’un petit nombre de valeurs : 0, 1/8, 1/7, 1/6… Une tolérance de 0,26 et une de 0,33 imposent exactement les mêmes conditions à un habitant entouré de 8 voisins (au moins 3 semblables). Gauvin, Vannimenus et Nadal (2009) le notent : seules les valeurs de la forme $k/n$ comptent, les autres se ramènent à la plus proche en dessous. C’est pourquoi la courbe de la section suivante avance par marches.' },
          ],
        },
      ],
    },
    {
      id: 'ligne', titre: 'Le modèle linéaire de 1971', blocs: [
        { p: 'L’article de 1971 commence par une ligne : 70 personnes, 35 de chaque groupe, rangées au hasard. Chacune regarde ses 4 voisins de gauche et ses 4 voisins de droite, et veut qu’au moins la moitié lui ressemblent. Les mécontents se déplacent à tour de rôle, de gauche à droite, vers la place la plus proche où ils seraient satisfaits, en s’intercalant entre deux personnes.' },
        { figure: 'ligne' },
        { p: 'Dans l’exemple de Schelling, deux passages suffisent : la ligne se range en six paquets, et 81,5 % des relations de voisinage (440 sur 540) relient deux personnes du même groupe, contre environ la moitié au départ. Le résultat varie d’un tirage à l’autre, mais le mécanisme est toujours le même : chaque départ rend un voisin mécontent, et les paquets se renforcent d’eux-mêmes.' },
      ],
    },
    {
      id: 'balayage', titre: 'Trois régimes', blocs: [
        { p: 'Sur le damier, faisons varier la tolérance de 0 à 90 %, et mesurons, une fois la ville arrêtée, la part moyenne de voisins semblables et la part d’habitants satisfaits :' },
        { figure: 'balayage' },
        {
          liste: [
            '*Jusqu’à 25 %* : presque rien ne bouge. Les habitants se contentent de deux voisins semblables sur huit, ce que le hasard leur donne déjà presque toujours.',
            '*De 30 à 60 %* : la ville se sépare, d’autant plus que la tolérance est haute, et tout le monde finit satisfait. À 60 %, 96 % des voisins se ressemblent.',
            '*Au-delà de 65 %* : la ville se *fige*. Chacun voudrait au moins six voisins semblables sur huit ; presque aucun logement vide ne l’offre, donc personne ne bouge. La ville reste mêlée, et la plupart des habitants restent mécontents.',
          ],
        },
        { p: 'Ce troisième régime rappelle qu’un indice de ségrégation bas ne dit rien du bien-être : il peut cacher une ville où presque personne n’est content. Gauvin, Vannimenus et Nadal (2009) retrouvent ces régimes, et quelques autres, dans un diagramme de phases complet qui dépend aussi de la part de logements vides.' },
        {
          expert: 'ce que disait Schelling', blocs: [
            { p: 'Dans l’article de 1971, avec sa règle du « plus proche logement satisfaisant » et un petit damier de 13 × 16, Schelling trouve une séparation *légère* pour une exigence d’un tiers et *frappante* pour une exigence de moitié : au-delà de la moitié, plus de quatre voisins sur cinq se ressemblent. La règle de déménagement compte donc. Ce qui ne change pas, c’est la forte non-linéarité : un petit changement d’exigence individuelle peut transformer l’ensemble.' },
          ],
        },
      ],
    },
    {
      id: 'bascule', titre: 'Le voisinage borné et le point de bascule', blocs: [
        { p: 'Le même article contient un second modèle, moins connu et pourtant plus proche des quartiers réels : le *voisinage borné*. Il n’y a plus de géographie, seulement un quartier, où l’on est dedans ou dehors. Chacun ne regarde que la proportion des deux groupes dans le quartier. Dans chaque groupe, les tolérances varient d’une personne à l’autre : la plus tolérante accepte, par exemple, deux fois plus d’« autres » que de « siens », la médiane autant, la moins tolérante aucun.' },
        { p: 'Rangeons les membres du groupe 1 du plus tolérant au moins tolérant. Le $n$-ième tolère un rapport $R(n)$ entre les autres et les siens, qui décroît avec $n$. Si $W$ membres du groupe 1 sont présents, le moins tolérant d’entre eux reste tant que $B / W \\leq R(W)$, où $B$ est le nombre de membres du groupe 2. La limite' },
        { tex: tex`B = W \, R(W), \qquad R(n) = R_{\max} \left( 1 - \frac{n - 1}{N} \right)` },
        { p: 'est une parabole dans le plan $(W, B)$ : sous elle, le groupe 1 trouve le quartier acceptable et y entre ; au-dessus, il en sort. Le groupe 2 a sa propre parabole. Chaque point de départ suit les flèches jusqu’à un équilibre. Cliquez dans la figure pour choisir le départ :' },
        { figure: 'bascule' },
        { p: 'Avec les tolérances de base de Schelling ($R_{\\max} = 2$) et un groupe 2 deux fois moins nombreux, il n’existe que deux équilibres stables : le quartier entièrement au groupe 1, ou entièrement au groupe 2. Tout mélange est instable : il suffit de quelques départs pour que le quartier *bascule*. Avec deux groupes de même taille et des tolérances plus larges ($R_{\\max} = 5$), un mélange stable apparaît, vers 80 et 80 personnes, atteint depuis une large zone de départs. Avec des groupes de tailles différentes, il disparaît de nouveau, même avec des tolérances larges. Schelling en tire quelques règles générales : les mélanges stables sont fragiles, ils demandent que la minorité soit la plus tolérante, et limiter le nombre total de présents (par exemple, le nombre de logements) peut aider à stabiliser un mélange.' },
        { p: 'C’est l’origine de l’expression *point de bascule* (*tipping point*), que Schelling a popularisée : un seuil de composition au-delà duquel un quartier se vide d’un groupe. L’onglet Applications montre qu’on l’a cherché, et trouvé, dans les données des villes américaines.' },
      ],
    },
    {
      id: 'potentiel', titre: 'Pourquoi la ségrégation gagne : une fonction potentielle', blocs: [
        { p: 'Pourquoi la ville séparée est-elle si robuste ? En physique, on répond avec une énergie que le système fait baisser. Junfu Zhang (2004) montre qu’une variante du modèle en possède une. Dans sa ville, sans logement vide, deux habitants de groupes différents échangent leurs logements quand l’échange les arrange. Chacun préfère un voisinage moitié-moitié, mais souffre plus d’être en minorité que d’être en majorité. Le nombre de paires de voisins de groupes différents joue alors le rôle d’un *potentiel* : un échange qui profite aux deux habitants le fait baisser.' },
        { p: 'Zhang ajoute un peu de hasard : un échange se fait avec une probabilité qui croît avec le gain, selon une règle *log-linéaire* de paramètre $\\beta$. Il montre alors que les états *stochastiquement stables*, ceux où le système passe presque tout son temps quand $\\beta$ est grand, sont ceux qui minimisent le nombre de paires mixtes : des états séparés, quel que soit le départ, alors même que tout le monde préfère la mixité.' },
        {
          expert: 'jeux de potentiel et loi de Gibbs', blocs: [
            { p: 'Un jeu est un *jeu de potentiel* s’il existe une fonction $\\Phi$ de la configuration telle que le gain d’un joueur qui change de stratégie soit exactement la variation de $\\Phi$. Avec la règle log-linéaire asynchrone (un joueur tiré au hasard choisit une option avec une probabilité proportionnelle à $e^{\\beta u}$), la chaîne de Markov est réversible et sa loi stationnaire est une loi de Gibbs :' },
            { tex: tex`\pi(\sigma) \propto e^{\beta\, \Phi(\sigma)} .` },
            { p: 'Quand $\\beta \\to \\infty$, toute la probabilité se concentre sur les maxima globaux de $\\Phi$ : ce sont les états stochastiquement stables de Peyton Young (1993, 1998). Ce n’est pas la même chose que les équilibres de Nash, dont beaucoup sont des pièges locaux : c’est ce qui reste quand le hasard a eu le temps de sortir des pièges.' },
          ],
        },
        { p: 'Sebastian Grauwin, Éric Bertin, Rémi Lemoy et Pablo Jensen (2009) vont plus loin. Ils découpent la ville en îlots et donnent à chacun la même utilité $u(\\rho)$, fonction de la densité $\\rho$ de son îlot, maximale quand l’îlot est à moitié plein. Un habitant tiré au hasard envisage un logement vide d’un autre îlot, et l’accepte avec la probabilité' },
        { tex: tex`P = \frac{1}{1 + e^{-G/T}}, \qquad G = \Delta u + \alpha \left( \Delta U - \Delta u \right),` },
        { p: 'où $\\Delta u$ est son propre gain, $\\Delta U$ le gain de toute la ville, et $\\alpha \\in [0, 1]$ son degré d’*altruisme*. Ils construisent une fonction de liaison qui transforme les gains individuels en variation d’une quantité globale, et en déduisent l’équivalent d’une énergie libre. Par îlot, elle vaut' },
        {
          tex: tex`f(\rho) = -T \left[ \rho \ln \rho + (1 - \rho) \ln (1 - \rho) \right] + \alpha\, \rho\, u(\rho) + (1 - \alpha) \int_0^{\rho} u(\rho')\, \mathrm{d}\rho'`,
          etroit: tex`\begin{aligned} f(\rho) = &-T \left[ \rho \ln \rho + (1 - \rho) \ln (1 - \rho) \right] \\ &+ \alpha\, \rho\, u(\rho) + (1 - \alpha) \int_0^{\rho} u(\rho')\, \mathrm{d}\rho' \end{aligned}`,
        },
        { p: 'et la ville s’organise pour maximiser $\\sum_q f(\\rho_q)$ à densité moyenne fixée. Comme pour un liquide et sa vapeur, la réponse se lit sur l’*enveloppe concave* de $f$ : si $f$ touche son enveloppe à la densité moyenne, la ville reste homogène ; sinon, elle se sépare en îlots vides et en îlots trop pleins. Dans la figure, la température est nulle, l’utilité monte de 0 à 1 jusqu’à la moitié, puis redescend jusqu’à $m$ quand l’îlot est plein :' },
        { figure: 'potentiel' },
        { p: 'Avec des habitants purement égoïstes ($\\alpha = 0$), la ville se sépare, et l’utilité totale est basse alors que chacun cherche à l’améliorer. Avec des habitants qui pensent au collectif ($\\alpha = 1$), elle reste mélangée. La transition a lieu en $\\alpha_c = 1/(3 - 2m)$ : il suffit d’un tiers d’altruisme quand $m = 0$. La morale est précise : ce n’est pas la préférence individuelle qui sépare, c’est l’écart entre ce que gagne celui qui bouge et ce que perdent ceux qu’il laisse.' },
      ],
    },
    {
      id: 'mixite', titre: 'Vouloir la mixité ne suffit pas', blocs: [
        { p: 'Romans Pancs et Nicolaas Vriend (2007) posent la question la plus dérangeante : que se passe-t-il si tout le monde *préfère* l’intégration ? Dans leur modèle, l’utilité de chaque habitant culmine pour un voisinage moitié-moitié et décroît des deux côtés. Chacun choisit le meilleur logement disponible. La ville se sépare quand même.' },
        { p: 'L’explorateur reproduit ce résultat avec l’*envie de mixité* : la satisfaction devient une note entre 0 et 1, maximale entre la tolérance et le plafond, qui baisse vite en minorité et doucement en majorité, comme chez Zhang. Avec un plafond et une tolérance de 50 %, tout le monde veut exactement moitié-moitié ; avec un peu de bruit, on finit pourtant à 88 % de voisins semblables dans nos simulations, et moins d’un habitant sur dix est pleinement satisfait.' },
        { p: 'Le mécanisme est celui de la section précédente. Quand un habitant quitte un voisinage où il était minoritaire, il améliore son sort, mais il rend ses anciens voisins de son groupe encore plus minoritaires : ils partent à leur tour. Chacun fait au mieux ; personne ne paie pour l’effet de ses choix sur les autres. Les économistes parlent d’*externalité*.' },
        { ouvrir: 'mixite', libelle: 'Ouvrir « Tous veulent la mixité »' },
      ],
    },
    {
      id: 'physique', titre: 'Un cousin du modèle d’Ising', blocs: [
        { p: 'Les physiciens reconnaissent dans le damier de Schelling un vieux compagnon. Donnons à chaque case une valeur $c_x$ : $+1$ pour le groupe 1, $-1$ pour le groupe 2, $0$ pour un logement vide. Une configuration où les voisins se ressemblent est une configuration où les produits $c_x c_y$ de voisins valent souvent $+1$ : c’est un *aimant* dans le modèle d’Ising, où les petits aimants voisins préfèrent s’aligner.' },
        { p: 'Avec des logements vides, le bon cousin est le modèle de Blume, Emery et Griffiths (1971), conçu pour les mélanges d’hélium 3 et d’hélium 4. Gauvin, Vannimenus et Nadal (2009) montrent que la règle de Schelling ressemble à la recherche d’un minimum de l’énergie' },
        { tex: tex`E = -\sum_{\langle x, y \rangle} c_x c_y \; - \; K \sum_{\langle x, y \rangle} c_x^2 c_y^2, \qquad K = 1 - 2\tau,` },
        { p: 'où les sommes portent sur les paires de voisins et $\\tau$ est la tolérance (ils notent la leur $1 - \\tau$). Ce n’est qu’une analogie : les auteurs notent que $E$ ne baisse à coup sûr que si seuls les mécontents déménagent, et que ce n’est plus vrai dès que les satisfaits bougent aussi. Mais elle guide l’intuition : la ségrégation est une *mise en ordre*, comme l’aimantation.' },
        { p: 'Dans un aimant, la température s’oppose à l’ordre : au-delà d’une température critique, l’agitation détruit l’aimantation (pour le modèle d’Ising sur un réseau carré, $T_c = 2 / \\ln(1 + \\sqrt 2) \\approx 2{,}269$ en unités naturelles). Dietrich Stauffer et Sorin Solomon (2007) ajoutent ainsi une température au modèle de Schelling : un habitant accepte un déménagement défavorable avec une probabilité qui croît avec $T$. Au-dessus d’un seuil, les groupes se mélangent complètement, quelle que soit la composition de la ville.' },
        { p: 'Le *bruit* de l’explorateur joue ce rôle. Il réserve une surprise : un peu de hasard *renforce* la séparation avant que beaucoup la dissolve.' },
        { figure: 'temperature' },
        { p: 'Sans bruit, la ville se fige dès que tout le monde est satisfait : ses quartiers restent petits et biscornus. Avec un peu de bruit, les habitants satisfaits continuent de bouger de temps en temps ; les petits quartiers se dissolvent au profit des grands, et la séparation monte à 97 %. Avec beaucoup de bruit, les déménagements deviennent presque aléatoires et les groupes se mêlent : la courbe redescend vers 50 %. Entre les deux, la transition est douce dans nos simulations, entre $T = 0{,}5$ et $T = 2$.' },
      ],
    },
    {
      id: 'grossissement', titre: 'Des quartiers qui grossissent comme des gouttes', blocs: [
        { p: 'Regardez une ville bruitée dans l’explorateur : les quartiers grossissent, les petits sont avalés par les grands, les frontières s’arrondissent. C’est le *mûrissement* (en anglais, *coarsening*) que l’on voit dans une vinaigrette qui se sépare, ou dans un alliage qui refroidit.' },
        { p: 'Dejan Vinković et Alan Kirman (2006) en donnent une lecture physique : la règle de satisfaction crée une *tension de surface* le long des frontières entre groupes. Un habitant posé sur une frontière convexe a moins de voisins semblables qu’un habitant au fond d’un creux ; les frontières tendent donc à se raccourcir, et les petits amas, qui ont beaucoup de frontière pour peu d’habitants, disparaissent au profit des grands. Les logements vides forment une couche qui isole les amas les uns des autres.' },
        { p: 'Luca Dall’Asta, Claudio Castellano et Matteo Marsili (2008) mesurent la vitesse de ce mûrissement : la taille typique $L$ des amas croît comme' },
        { tex: tex`L(t) \sim t^{1/z}, \qquad z = 2,` },
        { p: 'la loi des systèmes où l’ordre n’est pas conservé localement. La densité de frontières, elle, décroît comme $1/L$, donc comme $t^{-1/2}$. Sur un graphique en échelles logarithmiques, cela donne une droite de pente $-1/2$ :' },
        { figure: 'grossissement' },
        { p: 'Dans nos simulations avec un peu de bruit, la pente vaut environ $-0{,}47$ au-delà de 20 tours, proche de la valeur théorique. Sans bruit, la courbe s’arrête net : la ville se fige et ses frontières ne bougent plus. Dall’Asta et ses collègues montrent aussi qu’au-delà d’une certaine part de logements vides, les vides forment un réseau continu et les amas cessent de grossir.' },
      ],
    },
    {
      id: 'mesures', titre: 'Mesurer la ségrégation', blocs: [
        { p: 'Pour comparer des villes, il faut un nombre. Le plus ancien est l’*indice de dissimilarité* d’Otis et Beverly Duncan (1955). On découpe la ville en quartiers ; si le quartier $q$ compte $a_q$ habitants du groupe A et $b_q$ du groupe B, sur des totaux $A$ et $B$,' },
        { tex: tex`D = \frac{1}{2} \sum_q \left| \frac{a_q}{A} - \frac{b_q}{B} \right| .` },
        { p: '$D$ est la part d’un des groupes qu’il faudrait déménager pour que chaque quartier ait la composition de la ville. L’*indice d’entropie* de Henri Theil s’étend à plusieurs groupes : si $E$ est l’entropie de la composition de la ville et $E_q$ celle du quartier $q$, de population $t_q$ sur $T$,' },
        { tex: tex`H = \sum_q \frac{t_q}{T} \, \frac{E - E_q}{E}, \qquad E = -\sum_g \pi_g \ln \pi_g .` },
        { p: '$H$ vaut 0 si chaque quartier ressemble à la ville, 1 si chaque quartier ne contient qu’un groupe. C’est l’indice que suivent les courbes de l’explorateur, et celui qu’utilise l’Insee pour les revenus. L’*indice d’isolement* mesure autre chose : la part moyenne de son propre groupe dans le quartier d’un membre de B, $P^* = \\sum_q (b_q / B)(b_q / t_q)$.' },
        { p: 'Douglas Massey et Nancy Denton (1988) distinguent cinq dimensions de la ségrégation : la *répartition* (le $D$ et le $H$), l’*exposition* (l’isolement), la *concentration* dans peu d’espace, la *centralisation* près du centre, et le *regroupement* des quartiers d’un même groupe. Aucun indice ne les résume toutes. La figure montre un piège plus profond, connu sous le nom de *problème de l’échiquier* : les indices par quartiers dépendent de la taille des quartiers et ignorent leur disposition.' },
        { figure: 'mesures' },
        { p: 'Des bandes de 3 cases de large donnent $D = 0$ avec des quartiers de 6 × 6 (chaque quartier est moitié-moitié) et $D = 1$ avec des quartiers de 3 × 3. Un échiquier parfait donne un $D$ presque nul à toutes les échelles. La part de voisins semblables, mesurée au niveau de la rue, voit autre chose encore. C’est pourquoi l’explorateur affiche plusieurs mesures à la fois.' },
      ],
    },
    {
      id: 'economie', titre: 'Prix, revenus et règles', blocs: [
        { p: 'Les économistes ajoutent au modèle ce qui lui manque le plus : un prix. Depuis Charles Tiebout (1956), on sait que les ménages « votent avec leurs pieds » et se répartissent selon ce qu’ils peuvent et veulent payer. Dans l’explorateur, le loyer d’un logement $c$ suit une cible qui dépend de son attrait $A_c$ et du revenu moyen $\\bar y_c$ des habitants des 5 × 5 cases autour :' },
        { tex: tex`L_c^{\star} = \lambda \cdot \min\!\left( 0{,}98,\; \max\!\left( 0{,}02,\; 0{,}22 + 0{,}5\, A_c + 0{,}9 \left( \bar y_c - \tfrac{1}{2} \right) \right) \right),` },
        { p: 'où $\\lambda$ est la force du marché (le curseur Loyers). Un habitant de revenu $y_i$ ne peut s’installer que si $L_c \\leq y_i$, et doit partir si le loyer dépasse ses moyens de plus de 8 %. La boucle est fermée : les riches s’installent dans les beaux endroits, les loyers y montent, les modestes n’y entrent plus, et les loyers montent encore.' },
        { p: 'Si les groupes ont des revenus moyens différents, cette boucle sépare aussi les *groupes*, sans que personne regarde le groupe de ses voisins : dans nos simulations, 66 % de voisins semblables avec des revenus inégaux, contre 50 % avec des revenus égaux. William Clark et Mark Fossett (2008) trouvent, eux, que les revenus pèsent beaucoup sur la séparation sociale mais assez peu sur la séparation ethnique : l’écart de revenus n’est qu’un des canaux possibles.' },
        { p: 'Les deux derniers facteurs sont des *règles*. Les logements sociaux coupent la boucle des loyers : dispersés dans la ville, ils divisent par deux la ségrégation des revenus de nos simulations ; regroupés en grands ensembles, ils ne changent presque rien. La discrimination agit comme une contrainte : des propriétaires qui refusent un groupe dans certains quartiers suffisent, au fil des déménagements, à séparer une ville où personne n’a de préférence.' },
        { ouvrir: 'social', libelle: 'Comparer logements sociaux dispersés et regroupés' },
      ],
    },
  ],

  applications: [
    {
      id: 'bascule-reelle', titre: 'Le point de bascule existe', blocs: [
        { p: 'Si le modèle du voisinage borné est juste, les quartiers devraient basculer : en dessous d’une certaine part de minorités, la population majoritaire reste ; au-dessus, elle part. David Card, Alexandre Mas et Jesse Rothstein (2008) ont cherché ces seuils dans les recensements américains de 1970 à 2000, quartier par quartier, avec des méthodes de discontinuité.' },
        { p: 'Ils les trouvent dans la plupart des villes : les flux de population blanche montrent une rupture nette quand la part des minorités dépasse un seuil, entre 5 et 20 % environ selon les villes. Ces seuils sont plus élevés dans les villes dont les habitants se déclarent plus tolérants. En revanche, les loyers et les prix des logements ne montrent pas de rupture au même endroit.' },
      ],
    },
    {
      id: 'preferences', titre: 'Ce que disent les enquêtes', blocs: [
        { p: 'Le modèle demande des préférences. Les enquêtes en mesurent : on montre aux personnes des dessins de quartiers de compositions variées, et on leur demande où elles aimeraient vivre. Une enquête menée à Detroit dans les années 1970 trouvait que la plupart des habitants noirs préféraient des quartiers à peu près moitié-moitié, et la plupart des habitants blancs des quartiers presque entièrement blancs.' },
        { p: 'Clark et Fossett (2008) résument des données plus récentes de Los Angeles : les quatre groupes étudiés souhaitent qu’une majorité, ou presque, de leurs voisins soient de leur groupe. La part des personnes voulant au moins 3 voisins sur 8 de leur groupe y va de 60 % (habitants noirs) à 75 % (habitants d’origine asiatique). Ce sont justement les niveaux qui, dans le modèle, suffisent à séparer une ville. Les auteurs en concluent que supprimer les discriminations ne suffirait pas, à soi seul, à produire rapidement une ville mélangée ; ils ne disent pas que les discriminations ne comptent pas.' },
      ],
    },
    {
      id: 'france', titre: 'En France : revenus, logement, discriminations', blocs: [
        { p: 'En France, on mesure surtout la séparation par les revenus. Une étude de l’Insee (Mathilde Gerardin et Julien Pramil, 2023) applique l’indice de Theil aux cinq tranches de revenus, sur des carreaux de 200 mètres de côté, dans les zones denses des 53 plus grandes villes. Entre 2004 et 2019, la ségrégation selon le revenu a augmenté dans plus de 30 des 50 villes étudiées. Les 20 % les plus aisés et les 20 % les plus modestes sont les plus concentrés ; les ménages intermédiaires, les mieux répartis. Paris et Marseille sont parmi les villes les plus séparées ; Lyon, Toulouse, Nice et Montpellier parmi les plus homogènes.' },
        { p: 'La même étude note que la part de logements sociaux est plus élevée dans les villes les moins homogènes, et avance une hypothèse : la concentration du parc social dans les grands ensembles des années 1960. C’est exactement la différence que montre le scénario « Logement social » de l’explorateur, entre logements dispersés et regroupés. Depuis la loi SRU du 13 décembre 2000 (article 55), les communes concernées doivent compter 20 ou 25 % de logements sociaux, selon la tension du marché local.' },
        { p: 'Les discriminations, enfin, se mesurent par *testing* : on répond à des annonces avec des candidatures fictives identiques, sauf un détail. Julie Le Gallo, Yannick L’Horty, Loïc du Parquet et Pascale Petit ont envoyé cinq candidatures à chacune de 5 000 annonces de location, dans les 50 plus grandes aires urbaines, en 2016. Ils ne trouvent pas de discrimination selon l’âge, mais une discrimination importante selon l’origine : les candidats dont le nom évoque une origine maghrébine ou africaine sont pénalisés.' },
        { ouvrir: 'discrimination', libelle: 'Voir l’effet d’une discrimination dans l’explorateur' },
      ],
    },
    {
      id: 'ailleurs', titre: 'Bien au-delà des villes', blocs: [
        { p: 'Le modèle de Schelling est devenu un modèle-type de l’*émergence* : un phénomène collectif qui n’est voulu par personne et qui ne se lit dans aucune règle individuelle. On le retrouve partout où des individus choisissent leur voisinage : les écoles, les entreprises, les réseaux d’amis, les lieux de sociabilité. Il a aussi servi de point de départ à toute une tradition de *modèles à agents* en économie et en sociologie, et de pont entre ces disciplines et la physique statistique.' },
        { p: 'En 2014, Vi Hart et Nicky Case en ont fait une petite histoire interactive, *Parable of the Polygons*, placée dans le domaine public. Des triangles et des carrés un peu partiaux y construisent une ville séparée ; la morale de l’histoire est que défaire une séparation demande une action délibérée, alors qu’il suffit d’un peu de partialité pour la créer.' },
      ],
    },
    {
      id: 'limites', titre: 'Les limites', blocs: [
        { p: 'Le modèle est une caricature, et c’est sa force : il isole un mécanisme. Mais il ne peut pas dire ce qui a séparé une ville réelle. Les villes ont une histoire : des politiques publiques, des pratiques de banques et d’agences immobilières (comme le *redlining* des années 1930 aux États-Unis), des grands ensembles construits en une fois, des écarts de revenus hérités. Le modèle montre qu’une préférence faible *suffit* ; il ne montre pas qu’elle est la cause.' },
        { p: 'Les préférences elles-mêmes ne sont pas des données de la nature : elles dépendent de l’expérience, de la peur de voir baisser la valeur de son logement, des écoles, de la sécurité, de l’image d’un quartier. Le modèle les prend comme fixes ; elles changent pourtant avec la ville. Enfin, le damier ignore les distances, les transports, les emplois. La ville inventée de l’explorateur en réintroduit un peu, et l’étape suivante serait un vrai plan de ville.' },
      ],
    },
  ],

  calcul: [
    {
      id: 'tableaux', titre: 'La ville en tableaux', blocs: [
        { p: 'Toute la ville tient dans des tableaux typés de JavaScript, un élément par case : le sol (habitable, eau, parc, mur), l’habitant présent ou $-1$, le loyer, l’attrait, le logement social, le refus éventuel du propriétaire. Les habitants ont leurs propres tableaux : groupe, revenu, position, date d’emménagement, amis. Un tableau de 100 × 100 entiers de 32 bits pèse 40 ko : la ville entière tient sans peine dans les caches du processeur.' },
        { p: 'Deux listes rendent chaque opération instantanée : la liste des habitants et la liste des logements vides, chacune doublée d’un index qui donne la position de chaque élément dans la liste. Tirer un logement vide au hasard, en retirer un, en ajouter un, coûte un temps constant : on échange l’élément retiré avec le dernier de la liste. Les huit voisins de chaque case sont calculés une fois pour toutes, au bord près ou en refermant le damier sur lui-même.' },
      ],
    },
    {
      id: 'tour', titre: 'Un tour, pas à pas', blocs: [
        { p: 'Un tour, c’est autant d’activations que d’habitants, chacune sur un habitant tiré au hasard : certains bougent deux fois, d’autres pas du tout. Cette mise à jour *asynchrone* évite un défaut des mises à jour simultanées : si tous les mécontents bougeaient en même temps, ils viseraient les mêmes logements et créeraient de nouveaux mécontents en masse.' },
        { p: 'Activé, un habitant $i$ calcule l’utilité de son logement actuel $c_0$, puis de $k$ logements vides tirés au hasard ($k = 16$ s’il est mécontent, $k = 4$ s’il est satisfait et cherche seulement mieux). L’utilité d’un logement $c$ vaut' },
        { tex: tex`u_i(c) = S_i(c) + w_A \, A_c + w_F \, F_i(c),` },
        { p: 'où $S_i$ est la satisfaction sociale (0 ou 1, ou une note avec l’envie de mixité), $A_c$ l’attrait du lieu et $F_i(c)$ la part de ses amis à moins de 6 cases. Sans bruit, il retient le meilleur logement $c^{\\star}$ ; avec un bruit $T > 0$, il tire un logement avec une probabilité proportionnelle à $e^{u_i(c)/T}$. Il déménage alors avec la probabilité' },
        { tex: tex`P = \frac{1}{1 + e^{-G/T}}, \qquad G = u_i(c^{\star}) - u_i(c_0) - \kappa_i,` },
        { p: 'où $\\kappa_i$ est le coût du déménagement : 0,04, plus l’attachement, qui grandit pendant les 10 premiers tours passés au même endroit. Sans bruit, il déménage si $G > 0$. Les loyers sont révisés au même rythme : chaque case une fois par tour en moyenne, à mi-chemin vers sa cible.' },
      ],
    },
    {
      id: 'mesures-calcul', titre: 'Mesurer en un seul passage', blocs: [
        { p: 'Les courbes sont remises à jour quatre fois par seconde. Chaque mesure parcourt une fois la liste des habitants : elle compte les voisins semblables, les satisfaits, les paires de voisins de groupes différents, et remplit un tableau de comptes par quartier et par groupe, d’où l’on tire l’indice de Theil. Pour la ségrégation des revenus, il faut d’abord les seuils des cinq tranches : on trie les revenus, ce qui coûte $O(n \\log n)$, environ une milliseconde pour 10 000 habitants.' },
        { p: 'Le nombre de déménagements est un compteur, remis à zéro à chaque mesure et divisé par le temps écoulé en tours. Quand l’historique dépasse 240 points, on n’en garde qu’un sur deux : les courbes couvrent toute la simulation sans que leur coût augmente.' },
      ],
    },
    {
      id: 'cout', titre: 'Ce que coûte un tour', blocs: [
        { p: 'Combien de temps faut-il pour un tour ? Ça dépend énormément des réglages, parce que les habitants satisfaits du modèle classique ne font rien, alors qu’avec du bruit ou l’envie de mixité tout le monde cherche. Voici le temps moyen d’un tour sur une ville de 100 × 100, mesuré sur 150 tours avec le moteur de l’explorateur :' },
        { figure: 'cout' },
        { p: 'Même le pire cas tient en une vingtaine de millisecondes. Le calcul reste donc sur le fil principal du navigateur, sans *Web Worker* : la boucle d’animation avance par tranches de 0,05 tour et s’arrête dès qu’elle a dépensé 10 millisecondes dans une image. Si la ville est trop lourde, la simulation ralentit au lieu de bloquer la page.' },
        { p: 'Le dessin est une image peinte pixel par pixel : chaque case devient un carré de $s \\times s$ pixels, avec $s$ entier pour garder des bords nets. On écrit directement les couleurs dans un tableau d’entiers de 32 bits qui partage la mémoire de l’image, puis on la colle d’un coup dans le canvas.' },
      ],
    },
    {
      id: 'hasard', titre: 'Le même hasard pour deux villes', blocs: [
        { p: 'Toute la simulation tire ses nombres d’un générateur pseudo-aléatoire à graine (*mulberry32*). Deux villes créées avec la même graine et le même terrain partent exactement du même état : c’est ce qui rend honnête la comparaison côte à côte. Elles divergent ensuite, bien sûr, puisque leurs règles diffèrent.' },
        { p: 'Les chiffres cités dans ces onglets viennent du même moteur, lancé en Node.js sur des grilles de 100 × 100, souvent en moyenne sur plusieurs graines. Les courbes des figures de l’onglet Théorie sont précalculées ainsi, et rangées dans un petit fichier de données.' },
      ],
    },
  ],

  histoire: [
    {
      id: 'frise', titre: 'Repères', blocs: [
        {
          frise: [
            ['1949', 'James Sakoda', 'soutient à Berkeley une thèse sur le camp d’internement de Minidoka, où il était lui-même interné ; son annexe contient un premier modèle de damier.'],
            ['1955', 'Otis et Beverly Duncan', 'comparent les indices de ségrégation, dont l’indice de dissimilarité.'],
            ['1956', 'Charles Tiebout', 'décrit des ménages qui « votent avec leurs pieds » en choisissant leur commune.'],
            ['1969', 'Thomas Schelling', 'publie *Models of Segregation*, un mémorandum de la RAND, et un court article dans l’*American Economic Review*.'],
            ['1971', 'Sakoda puis Schelling', 'publient leurs modèles de damier dans les deux premiers numéros du *Journal of Mathematical Sociology*. Celui de Schelling deviendra l’article le plus cité de la revue.'],
            ['1971', 'Blume, Emery et Griffiths', 'proposent, pour les mélanges d’hélium, le modèle de physique dont Schelling est le cousin.'],
            ['1978', 'Thomas Schelling', 'publie *Micromotives and Macrobehavior*.'],
            ['1988', 'Douglas Massey et Nancy Denton', 'distinguent cinq dimensions de la ségrégation.'],
            ['1996', 'Joshua Epstein et Robert Axtell', 'font pousser des sociétés artificielles (*Sugarscape*) : les modèles à agents deviennent une méthode.'],
            ['1998', 'H. Peyton Young', 'publie *Individual Strategy and Social Structure* : la stabilité stochastique.'],
            ['2000', 'Loi SRU', 'impose aux communes concernées une part minimale de logements sociaux.'],
            ['2004', 'Junfu Zhang', 'montre la ségrégation dans un monde où tous veulent l’intégration.'],
            ['2005', 'Thomas Schelling', 'reçoit le prix d’économie en mémoire d’Alfred Nobel, avec Robert Aumann.'],
            ['2006', 'Dejan Vinković et Alan Kirman', 'proposent l’analogie avec les liquides et la tension de surface.'],
            ['2007', 'Pancs et Vriend ; Stauffer et Solomon', 'revisitent le modèle : préférence pour l’intégration, température et modèle d’Ising.'],
            ['2008', 'Card, Mas et Rothstein', 'trouvent des points de bascule dans les quartiers américains.'],
            ['2008', 'Dall’Asta, Castellano et Marsili', 'mesurent le mûrissement des quartiers.'],
            ['2009', 'Grauwin, Bertin, Lemoy et Jensen', 'relient comportements individuels et collectifs par une fonction potentielle.'],
            ['2009', 'Gauvin, Vannimenus et Nadal', 'dressent le diagramme de phases du modèle.'],
            ['2014', 'Vi Hart et Nicky Case', 'publient *Parable of the Polygons*.'],
            ['2017', 'Rainer Hegselmann', 'retrace l’histoire croisée des modèles de Sakoda et de Schelling.'],
            ['2023', 'Insee', 'mesure la hausse de la ségrégation selon le revenu dans la plupart des grandes villes françaises.'],
          ],
        },
      ],
    },
    {
      id: 'deux-peres', titre: 'Un modèle, deux pères', blocs: [
        { p: 'Thomas Schelling fait ses simulations à la main, avec des pièces, des jetons ou ce qui lui tombe sous la main, sur un damier. C’est un choix : un modèle que chacun peut refaire sur sa table de cuisine. James Minoru Sakoda, lui, était un pionnier de la simulation par ordinateur. Son modèle de 1971, publié un numéro avant celui de Schelling dans la même revue, faisait se déplacer deux groupes sur un damier selon leurs attitudes, attirance, indifférence ou rejet, envers leur propre groupe et envers l’autre.' },
        { p: 'Rainer Hegselmann (2017) montre qu’en un sens, le modèle de Schelling est un cas particulier de celui de Sakoda. Pourtant, l’article de Sakoda est resté presque ignoré, et celui de Schelling est devenu un classique. Hegselmann y voit une combinaison de facteurs techniques (un modèle qui se fait à la main, facile à montrer) et sociaux (la réputation d’un auteur célèbre), sans faute de quiconque.' },
      ],
    },
    {
      id: 'refs', titre: 'Références', blocs: [
        {
          refs: [
            ['T. C. Schelling, « Dynamic Models of Segregation », *Journal of Mathematical Sociology*, 1 (2), 143–186, 1971.', 'https://doi.org/10.1080/0022250X.1971.9989794'],
            ['T. C. Schelling, « Models of Segregation », *American Economic Review*, 59 (2), 488–493, 1969.'],
            ['T. C. Schelling, *Micromotives and Macrobehavior*, W. W. Norton, 1978.'],
            ['J. M. Sakoda, « The Checkerboard Model of Social Interaction », *Journal of Mathematical Sociology*, 1 (1), 1971.'],
            ['R. Hegselmann, « Thomas C. Schelling and James M. Sakoda: The Intellectual, Technical, and Social History of a Model », *JASSS*, 20 (3), 15, 2017.', 'https://www.jasss.org/20/3/15.html'],
            ['J. Zhang, « Residential segregation in an all-integrationist world », *Journal of Economic Behavior & Organization*, 54 (4), 533–550, 2004.', 'https://ideas.repec.org/a/eee/jeborg/v54y2004i4p533-550.html'],
            ['R. Pancs et N. J. Vriend, « Schelling’s spatial proximity model of segregation revisited », *Journal of Public Economics*, 91, 1–24, 2007.', 'https://nvriend.econ.qmul.ac.uk/abs/abs.pubec.html'],
            ['H. P. Young, *Individual Strategy and Social Structure*, Princeton University Press, 1998.'],
            ['S. Grauwin, É. Bertin, R. Lemoy et P. Jensen, « Competition between collective and individual dynamics », *PNAS*, 106, 2009.', 'https://www.arxiv.org/abs/0907.2167'],
            ['L. Gauvin, J. Vannimenus et J.-P. Nadal, « Phase diagram of a Schelling segregation model », *European Physical Journal B*, 70, 293–304, 2009.', 'https://ar5iv.arxiv.org/html/0903.4694'],
            ['L. Dall’Asta, C. Castellano et M. Marsili, « Statistical physics of the Schelling model of segregation », *Journal of Statistical Mechanics*, 2008.', 'https://arxiv.org/abs/0707.1681'],
            ['D. Stauffer et S. Solomon, « Ising, Schelling and self-organising segregation », *European Physical Journal B*, 2007.', 'https://arxiv.org/abs/physics/0701051'],
            ['D. Vinković et A. Kirman, « A physical analogue of the Schelling model », *PNAS*, 103, 2006.', 'https://pmc.ncbi.nlm.nih.gov/articles/PMC1748214'],
            ['M. Blume, V. J. Emery et R. B. Griffiths, « Ising model for the λ transition and phase separation in He³-He⁴ mixtures », *Physical Review A*, 4, 1971.'],
            ['O. D. Duncan et B. Duncan, « A methodological analysis of segregation indexes », *American Sociological Review*, 20 (2), 210–217, 1955.'],
            ['D. S. Massey et N. A. Denton, « The Dimensions of Residential Segregation », *Social Forces*, 67 (2), 1988.', 'https://collaborate.princeton.edu/en/publications/the-dimensions-of-residential-segregation/'],
            ['C. M. Tiebout, « A Pure Theory of Local Expenditures », *Journal of Political Economy*, 64 (5), 416–424, 1956.'],
            ['D. Card, A. Mas et J. Rothstein, « Tipping and the Dynamics of Segregation », *Quarterly Journal of Economics*, 123 (1), 177–218, 2008.', 'https://nber.org/papers/w13052'],
            ['W. A. V. Clark et M. Fossett, « Understanding the social context of the Schelling segregation model », *PNAS*, 105 (11), 4109–4114, 2008.', 'https://ccpr.ucla.edu/wp-content/uploads/2024/04/Understanding-the-social-context-of-the-Schelling-segregation-model.pdf'],
            ['M. Gerardin et J. Pramil, « En 15 ans, les disparités entre quartiers, mesurées selon le revenu, se sont accentuées dans la plupart des grandes villes », *Insee Analyses*, 79, 2023.', 'https://www.insee.fr/fr/statistiques/6680439'],
            ['J. Le Gallo, Y. L’Horty, L. du Parquet et P. Petit, « Les discriminations dans l’accès au logement en France : un testing sur les aires urbaines métropolitaines », *Économie et Statistique*, 513, 2019.', 'https://www.insee.fr/fr/statistiques/4467358'],
            ['ANIL, « Production de logements sociaux : obligations des communes » (article 55 de la loi SRU).', 'https://www.anil.org/aj-logement-production-logement-social-obligation-commune/'],
            ['J. M. Epstein et R. Axtell, *Growing Artificial Societies*, Brookings Institution Press et MIT Press, 1996.'],
            ['V. Hart et N. Case, *Parable of the Polygons*, 2014 (domaine public).', 'https://ncase.me/polygons/'],
          ],
        },
      ],
    },
  ],

  fiche: {
    regles: 'Les règles',
    regarder: 'À regarder',
    pourquoi: 'Ce qui se passe, et pourquoi',
    realite: 'Dans la réalité',
    ouvrir: 'Ouvrir ce scénario dans l’explorateur',
    depart: 'Départ',
    apres: (n) => `Après ${n} tours`,
    ville: (c, n, nom) => `Ville ${c.toUpperCase()} (${nom}), après ${n} tours`,
    calcul: 'Calcul en cours…',
    note: (vue) => `Une petite ville de 60 × 60, calculée dans votre navigateur avec le moteur de l’explorateur. Vue\u00a0: ${vue.toLowerCase()}.`,
    mesures: {
      semblables: (v) => `${v} de voisins semblables`,
      satisfaits: (v) => `${v} de satisfaits`,
      theilRevenus: (v) => `ségrégation des revenus\u00a0: ${v}`,
      minorite: (v) => `minorité\u00a0: ${v} de voisins semblables`,
    },
  },

  fiches: {
    damier: {
      question: 'Si chacun accepte d’être en minorité, la ville reste-t-elle mélangée ?',
      regles: [
        'Deux groupes de même taille, orange et bleu, placés au hasard ; 10 % de logements vides.',
        'Chaque habitant veut qu’au moins un tiers de ses voisins lui ressemblent, soit 3 sur 8. Il accepte donc d’être en minorité.',
        'Un habitant insatisfait déménage vers un logement vide où il serait satisfait.',
      ],
      regarder: [
        'Au départ, vue *Satisfaction* : environ un habitant sur cinq est insatisfait (rouge orangé), et ils sont éparpillés partout.',
        'La courbe *Voisins semblables* : elle part de 50 % (le hasard), grimpe vers 75 % en une dizaine de tours, puis s’arrête.',
      ],
      pourquoi: [
        'Chaque déménagement a deux effets. En partant, un habitant orange laisse ses anciens voisins oranges un peu plus seuls au milieu des bleus : certains passent sous leur seuil et partent à leur tour. En arrivant, il renforce un coin orange, qui devient plus accueillant pour les oranges suivants.',
        'Ces deux effets s’entraînent l’un l’autre : c’est une cascade. Elle s’arrête quand plus personne n’est insatisfait. À ce moment, chacun vit entouré aux trois quarts de son groupe, alors qu’un tiers lui suffisait. La ville est bien plus séparée que ce que chacun demandait.',
      ],
      realite: 'C’est l’expérience que Schelling faisait à la main, avec des pièces de monnaie. Sa leçon : on ne peut pas lire les intentions des habitants dans la carte d’une ville. Une forte séparation peut naître de préférences modestes.',
    },
    seuil: {
      question: 'Une petite différence de tolérance donne-t-elle une petite différence de ville ?',
      regles: [
        'Deux villes jumelles : même tirage au départ, mêmes règles, une seule différence.',
        'Ville A : chacun veut au moins 25 % de voisins semblables, soit 2 sur 8.',
        'Ville B : au moins 30 %, soit 3 sur 8.',
      ],
      regarder: [
        'Au tout début, vue *Satisfaction* : la ville A a beaucoup moins de cases rouge orangé que la ville B.',
        'Les deux courbes *Voisins semblables* : elles s’écartent vite, puis se figent vers 57 % et 74 %.',
      ],
      pourquoi: [
        'Avec huit voisins, une tolérance se compte en voisins entiers. 20 % ou 25 %, c’est pareil : il faut 2 voisins semblables. 30 % ou 35 %, c’est pareil aussi : il en faut 3. La vraie différence entre A et B, c’est un seul voisin.',
        'Or, au hasard, presque tout le monde a déjà 2 voisins semblables : dans la ville A, 94 % des habitants sont satisfaits dès le départ, et les rares déménagements ne déclenchent pas de cascade. Dans la ville B, 18 % des habitants sont insatisfaits au départ : c’est assez pour lancer une cascade, et la ville se sépare.',
        'C’est un effet de seuil : en dessous, presque rien ; au-dessus, presque tout.',
      ],
      realite: 'On retrouve ces seuils dans les villes réelles. Aux États-Unis, Card, Mas et Rothstein (2008) ont mesuré que des quartiers basculent quand la part d’une minorité dépasse un seuil, entre 5 et 20 % selon les villes.',
    },
    mixite: {
      question: 'Si tout le monde préfère un voisinage mélangé, la ville reste-t-elle mélangée ?',
      regles: [
        'Deux groupes. Chacun voudrait exactement moitié de voisins semblables, moitié d’autres.',
        'La satisfaction devient une note : elle baisse vite quand on est en minorité, et doucement quand on est en majorité. Être minoritaire est pire qu’être majoritaire.',
        'Un peu de hasard : de temps en temps, un habitant se trompe ou bouge sans raison.',
      ],
      regarder: [
        'Vue *Satisfaction* : presque tout est rouge orangé, et le reste. Moins d’un habitant sur dix est pleinement satisfait.',
        'Vue *Groupes*, à vitesse rapide : des quartiers d’un seul groupe se forment peu à peu. La courbe *Voisins semblables* monte vers 90 %.',
      ],
      pourquoi: [
        'Un voisinage exactement moitié-moitié est rare, et fragile : il suffit qu’un voisin parte pour qu’il ne le soit plus.',
        'Un habitant en minorité est le plus malheureux, donc le premier à partir. Il cherche un endroit où il sera au moins à égalité, et trouve souvent un endroit où son groupe domine déjà. En partant, il laisse ses anciens voisins de son groupe encore plus minoritaires : ils partent à leur tour.',
        'Chacun fait au mieux pour lui-même, mais personne ne tient compte de ce que son départ fait aux autres. Les économistes appellent cela une *externalité*. Le résultat : une ville séparée que personne ne voulait, où presque personne n’est content.',
      ],
      realite: 'C’est le résultat de Zhang (2004) et de Pancs et Vriend (2007) : vouloir la mixité ne suffit pas à la produire. L’onglet Théorie montre ce qui la sauve : que chacun tienne compte, au moins un peu, de l’effet de ses choix sur les autres.',
    },
    bruit: {
      question: 'Un peu de hasard dans les déménagements mélange-t-il la ville ?',
      regles: [
        'Deux villes avec la même règle : au moins 50 % de voisins semblables.',
        'Ville A : un peu de hasard (T = 0,05). De temps en temps, un habitant satisfait déménage quand même, ou choisit un logement un peu moins bon.',
        'Ville B : beaucoup de hasard (T = 1). Les choix deviennent presque aléatoires.',
      ],
      regarder: [
        'Mettez la vitesse au maximum : le hasard agit lentement, sur des centaines de tours.',
        'Ville A : les petits quartiers disparaissent, les grands grossissent. Ville B : la ville reste un patchwork.',
        'La courbe *Ségrégation* : elle monte haut à gauche, et reste basse à droite.',
      ],
      pourquoi: [
        'Sans hasard, la ville s’arrête dès que tout le monde est satisfait, avec des quartiers petits et biscornus.',
        'Un peu de hasard secoue la ville. Or les habitants qui bougent le plus sont ceux des bords des petits quartiers : ils ont moins de voisins semblables, ils sont plus souvent insatisfaits. Les petits quartiers fondent donc au profit des grands, comme des gouttes d’huile qui se rejoignent dans l’eau. Un peu de hasard *renforce* la séparation.',
        'Beaucoup de hasard, en revanche, empêche chacun de suivre ses préférences : les déménagements deviennent presque aléatoires, et le hasard mélange tout.',
      ],
      realite: 'Les physiciens connaissent bien ce comportement : un aimant perd son aimantation quand on le chauffe. Le hasard joue ici le rôle de la température. L’onglet Théorie le détaille, avec le modèle d’Ising.',
    },
    revenus: {
      question: 'Des groupes peuvent-ils se séparer sans que personne ne regarde le groupe de ses voisins ?',
      regles: [
        'Personne n’a de préférence de groupe : la tolérance vaut 0.',
        'La ville inventée a un centre attirant. Les loyers suivent l’attrait du lieu et le revenu des voisins. On ne s’installe que là où l’on peut payer.',
        'Ville A : le groupe 1 (orange) est en moyenne plus aisé que le groupe 2 (bleu). Ville B : les deux groupes ont les mêmes revenus.',
      ],
      regarder: [
        'Vue *Revenus* : dans les deux villes, les ménages aisés (jaune) occupent le centre, et les modestes (violet) la périphérie.',
        'Vue *Groupes* : à gauche, le centre devient orange et la périphérie bleue. À droite, les couleurs restent mêlées.',
        'Les courbes : la *Ségrégation des revenus* monte dans les deux villes, la *Ségrégation* des groupes seulement à gauche.',
      ],
      pourquoi: [
        'Les loyers trient les habitants par revenu : les ménages aisés peuvent payer le centre, les modestes non.',
        'Si un groupe est plus aisé en moyenne, trier par revenu revient en partie à trier par groupe. La séparation des groupes n’est voulue par personne : c’est un effet secondaire du tri par les prix.',
      ],
      realite: 'Dans la réalité, les revenus pèsent lourd dans la séparation sociale. Mais Clark et Fossett (2008) trouvent qu’ils n’expliquent qu’une partie de la séparation entre groupes : c’est un mécanisme parmi d’autres.',
    },
    gentrification: {
      question: 'Que se passe-t-il quand un quartier devient très demandé ?',
      regles: [
        'Personne n’a de préférence de groupe.',
        'Le centre de la ville est très attirant. Les loyers suivent l’attrait du lieu et le revenu des voisins.',
        'Si son loyer dépasse ses moyens, un habitant doit partir. Par ailleurs, 2 % des habitants quittent la ville à chaque tour, et de nouveaux arrivants les remplacent.',
      ],
      regarder: [
        'Vue *Loyers* : le centre devient vite cher (jaune).',
        'Vue *Satisfaction*, pendant les premiers tours : les cases jaunes sont des habitants que leur loyer chasse.',
        'Vue *Revenus* : le centre se remplit de ménages aisés. La courbe *Ségrégation des revenus* monte.',
      ],
      pourquoi: [
        'C’est une boucle. Les ménages aisés s’installent au centre parce qu’il attire. Le revenu moyen du voisinage monte, donc les loyers montent. Les modestes ne peuvent plus y entrer, et ceux qui y vivaient doivent partir quand leur loyer dépasse leurs moyens. Le centre s’enrichit encore, et les loyers montent encore.',
        'Personne n’expulse personne : c’est le prix qui trie. Dans nos simulations, plus d’un habitant sur trois doit quitter son logement pendant les 40 premiers tours.',
      ],
      realite: 'C’est le mécanisme de base de la gentrification. Le modèle le simplifie beaucoup : il ignore la construction de logements, l’encadrement des loyers et les aides au logement.',
    },
    social: {
      question: 'Les logements sociaux mélangent-ils la ville ? Et où faut-il les placer ?',
      regles: [
        'La même ville que dans « Riches et pauvres » : des loyers, et un groupe 1 plus aisé.',
        '20 % des logements sont sociaux : loyer très bas, réservés aux 40 % les plus modestes. Quand les cases sont assez grandes, un logement social occupé porte un petit point sombre au centre.',
        'Ville A : les logements sociaux sont dispersés partout. Ville B : regroupés en quatre grands ensembles, en périphérie.',
      ],
      regarder: [
        'Vue *Revenus* : à gauche, des ménages modestes (violet) vivent partout, même au centre cher. À droite, ils restent en périphérie.',
        'Les courbes *Ségrégation des revenus* : celle de la ville A est environ deux fois plus basse.',
      ],
      pourquoi: [
        'Un logement social échappe au tri par les prix : son loyer reste bas même si le quartier devient cher. Dispersés, les logements sociaux garantissent des ménages modestes dans chaque quartier, y compris au centre.',
        'Regroupés en périphérie, ils sont justement là où les modestes vivaient déjà : ils ne changent presque rien à la carte. Dans nos simulations, la ville B est aussi séparée qu’une ville sans aucun logement social.',
      ],
      realite: 'En France, la loi SRU (2000) impose aux communes concernées 20 ou 25 % de logements sociaux. L’Insee note que les villes les plus séparées par le revenu ont souvent plus de logements sociaux, et avance une explication : leur concentration dans les grands ensembles des années 1960.',
    },
    discrimination: {
      question: 'Une ville peut-elle se séparer si personne n’a de préférence ?',
      regles: [
        'Personne ne se soucie de ses voisins : la tolérance vaut 0.',
        'À chaque tour, 5 % des habitants quittent la ville ; de nouveaux arrivants prennent les logements libérés.',
        'Ville A : dans certaines zones, les propriétaires refusent le groupe 2 (bleu) quand ils louent. Ville B : aucun refus.',
      ],
      regarder: [
        'Mettez la vitesse au maximum : seuls les départs font bouger la ville.',
        'Ville A : des zones deviennent entièrement orange, et les bleus se concentrent ailleurs. Ville B : rien ne change.',
        'La courbe *Voisins semblables* : elle monte lentement à gauche, vers 85 %, et reste à 50 % à droite.',
      ],
      pourquoi: [
        'Personne ne déménage par choix. Mais chaque départ libère un logement. Dans une zone fermée, un bleu ne peut pas le reprendre : c’est un orange qui s’y installe.',
        'Départ après départ, les zones fermées se vident de leurs bleus : au bout de 50 tours, il n’en reste presque plus. Les bleus se retrouvent dans les zones ouvertes, où ils deviennent majoritaires. La séparation ne vient pas des préférences, mais d’une règle d’accès au logement.',
      ],
      realite: 'En France, une étude par *testing* (Le Gallo et ses collègues, 2019) a envoyé des candidatures fictives identiques à 5 000 annonces de location : les candidats dont le nom évoque une origine maghrébine ou africaine sont pénalisés. Aux États-Unis, des pratiques comme le *redlining* ont longtemps fermé des quartiers entiers.',
    },
    amis: {
      question: 'Les réseaux d’amis peuvent-ils séparer une ville ?',
      regles: [
        'Une tolérance faible : 20 % de voisins semblables suffisent. Seule, elle ne sépare presque rien.',
        'Ville A : chacun a 4 amis et préfère vivre à moins de 6 cases d’eux. Neuf amis sur dix sont de son propre groupe.',
        'Ville B : la même ville, sans amis.',
      ],
      regarder: [
        'Ville B : elle se fige vite, presque mélangée.',
        'Ville A, à vitesse rapide : des quartiers se forment peu à peu, puis grossissent.',
        'Les courbes *Voisins semblables* : vers 94 % à gauche, 56 % à droite.',
      ],
      pourquoi: [
        'Chacun se rapproche de ses amis. Comme ses amis sont presque tous de son groupe, se rapprocher de ses amis revient à se rapprocher de son groupe.',
        'Les amis bougent aussi pour se rapprocher les uns des autres : des grappes se forment, s’attirent et grossissent. Personne ne cherche des voisins de son groupe, et pourtant les quartiers se séparent.',
      ],
      realite: 'Les sociologues appellent *homophilie* la tendance à se lier avec des gens qui nous ressemblent. Dans la réalité, on choisit souvent un logement près de sa famille et de ses amis.',
    },
    attachement: {
      question: 'Que change le fait qu’il soit coûteux de déménager ?',
      regles: [
        'Deux villes avec la même règle (un tiers de semblables) et un peu de hasard : même satisfaits, les habitants déménagent de temps en temps.',
        'Ville A : déménager ne coûte presque rien.',
        'Ville B : plus on est installé depuis longtemps (jusqu’à 10 tours), plus déménager coûte cher.',
      ],
      regarder: [
        'La courbe *Déménagements* : à gauche, environ 3 habitants sur 10 déménagent à chaque tour, sans fin. À droite, plus personne ne bouge après quelques tours.',
        'La courbe *Voisins semblables* : à gauche, elle continue de monter vers 95 % ; à droite, elle se fige vers 78 %.',
      ],
      pourquoi: [
        'À gauche, les habitants continuent de bouger au hasard, et la ville mûrit lentement : les petits quartiers fondent au profit des grands, comme dans le scénario « Le hasard ».',
        'À droite, une fois installé, plus personne ne déménage pour un petit gain. La ville se fige dans l’état où elle est, avant que les quartiers aient eu le temps de grossir. L’attachement freine les cascades.',
      ],
      realite: 'Dans la réalité, déménager coûte cher : de l’argent, un travail, une école, des habitudes. C’est une des raisons pour lesquelles les quartiers changent lentement.',
    },
    arrivees: {
      question: 'Que se passe-t-il quand la composition de la ville change ?',
      regles: [
        'Chacun veut au moins un tiers de voisins semblables.',
        'À chaque tour, 3 % des habitants quittent la ville.',
        'Parmi les nouveaux arrivants, trois sur quatre sont du groupe 2 (bleu).',
      ],
      regarder: [
        'Vue *Groupes*, à vitesse rapide : les quartiers orange rétrécissent, et certains basculent en entier.',
        'Le groupe 1 passe d’environ la moitié de la ville à environ un quart, et se retrouve dans quelques îlots.',
      ],
      pourquoi: [
        'Quand un orange quitte un quartier orange, il est le plus souvent remplacé par un bleu. Au début, les oranges qui restent sont encore satisfaits.',
        'Mais quand assez de bleus sont arrivés, les oranges restants passent sous leur seuil d’un tiers : ils partent à leur tour, et sont remplacés par des bleus. Le quartier bascule d’un coup. C’est le *point de bascule* du modèle du voisinage borné de Schelling (onglet Théorie).',
      ],
      realite: 'Card, Mas et Rothstein (2008) ont trouvé ces points de bascule dans les quartiers américains entre 1970 et 2000 : au-delà d’une certaine part de minorités, entre 5 et 20 % selon les villes, la population blanche part nettement.',
    },
    quatre: {
      question: 'Que vit une petite minorité dans une ville qui se sépare ?',
      regles: [
        'Trois grands groupes (orange, bleu, vert) et une petite minorité en rose : un habitant sur dix.',
        'Tout le monde veut au moins 30 % de voisins semblables, soit 3 sur 8.',
      ],
      regarder: [
        'Vue *Satisfaction* au départ : presque tous les membres de la minorité sont insatisfaits.',
        'Vue *Groupes* : la minorité finit en petits îlots compacts.',
      ],
      pourquoi: [
        'Au hasard, un membre de la minorité a en moyenne un seul voisin semblable sur dix : il n’a presque jamais 3 voisins sur 8 de son groupe. Au départ, seuls 4 % d’entre eux sont satisfaits.',
        'Pour être satisfait, il doit rejoindre d’autres membres de la minorité. Les seuls endroits qui lui conviennent sont donc les petits groupes déjà formés, qui grossissent et deviennent des îlots. À la fin, six voisins sur dix d’un membre de la minorité sont de son groupe.',
        'Les grands groupes, eux, sont satisfaits beaucoup plus facilement : la contrainte pèse surtout sur la minorité.',
      ],
      realite: 'Schelling l’avait remarqué dès 1971 : quand un groupe est minoritaire, ses membres se regroupent, même quand leurs exigences sont très modestes.',
    },
  },

  figures: {
    ligne: {
      titre: 'Le modèle linéaire : 70 personnes, 4 voisins de chaque côté, au moins la moitié de semblables',
      resume: (paquets, pct) => `Une ligne de 70 personnes en ${paquets} paquets, ${pct} de relations entre semblables.`,
      etat: (tours, mecontents, paquets, pct) => `${tours} passage${tours > 1 ? 's' : ''} · ${mecontents} mécontent${mecontents > 1 ? 's' : ''} (entourés) · ${paquets} paquets · ${pct} de relations entre semblables`,
      unTour: 'Un passage',
      bout: 'Jusqu’au bout',
      nouveau: 'Nouveau tirage',
      note: 'Un passage : chaque mécontent, de gauche à droite, va s’intercaler à la place satisfaisante la plus proche. Les mécontents sont entourés de rouge.',
    },
    damier: {
      titre: 'Un damier de 40 × 40, deux groupes, 10 % de logements vides',
      resume: 'Un damier vivant de 40 × 40 cases, deux groupes de couleurs différentes.',
      tolerance: 'Tolérance',
      pause: 'Pause',
      lancer: 'Lancer',
      nouveau: 'Nouveau tirage',
      vue: 'Vue',
      vues: { groupes: 'Groupes', satisfaction: 'Satisfaction' },
      etat: (t, semb, sat) => `tour ${t} · voisins semblables ${semb} · satisfaits ${sat}`,
    },
    balayage: {
      titre: 'Voisins semblables et habitants satisfaits, une fois la ville arrêtée, selon la tolérance',
      semblables: 'Voisins semblables',
      satisfaits: 'Satisfaits',
      tolerance: 'Tolérance',
      axeX: 'tolérance',
      axeY: 'part',
      resume: 'Les voisins semblables restent vers 50 % jusqu’à une tolérance de 25 %, sautent à 75 % à 30 %, montent jusqu’à 96 % à 60 %, puis retombent vers 50 % au-delà de 65 %, où la ville se fige et où les satisfaits chutent.',
      tableau: 'Voir les données (100 tours, moyenne de 3 tirages)',
    },
    bascule: {
      titre: 'Le voisinage borné : 100 personnes du groupe 1, 50 ou 100 du groupe 2',
      resume: (verdict) => `Diagramme du voisinage borné\u202f; la trajectoire choisie aboutit à\u00a0: ${verdict}.`,
      axeX: 'groupe 1 présents',
      axeY: 'groupe 2 présents',
      courbe1: 'Limite du groupe 1 : au-dessous, il entre',
      courbe2: 'Limite du groupe 2 : à gauche, il entre',
      rmax: 'Le plus tolérant accepte',
      taille2: 'Personnes du groupe 2',
      etat: (w, b, verdict) => `Départ\u00a0: ${w} du groupe 1 et ${b} du groupe 2 → ${verdict}. Cliquez dans le diagramme pour changer de départ.`,
      verdicts: {
        groupe1: 'quartier entièrement au groupe 1',
        groupe2: 'quartier entièrement au groupe 2',
        mixte: (w, b) => `mélange stable (${w} et ${b})`,
      },
      note: 'Rapport accepté par le plus tolérant de chaque groupe ; il décroît en ligne droite jusqu’au moins tolérant. Schelling : 2 pour 1, puis 5 pour 1 dans sa variante plus tolérante.',
    },
    potentiel: {
      titre: 'Le potentiel d’un îlot f(ρ) et son enveloppe concave, à température nulle',
      potentiel: 'f(ρ)',
      enveloppe: 'Enveloppe concave',
      axeX: 'densité de l’îlot ρ',
      axeY: 'f',
      resume: (separee) => (separee ? 'La courbe passe sous son enveloppe à ρ = 1/2 : la ville se sépare.' : 'La courbe touche son enveloppe à ρ = 1/2 : la ville reste homogène.'),
      alpha: 'Altruisme α',
      m: 'Utilité d’un îlot plein m',
      separee: (r1, r2) => `À densité moyenne 1/2, f passe sous son enveloppe\u00a0: la ville se sépare en îlots de densité ${r1} et ${r2}.`,
      mixte: 'À densité moyenne 1/2, f touche son enveloppe : tous les îlots restent à moitié pleins.',
      seuil: (ac) => `Seuil théorique\u00a0: α_c = 1/(3 − 2m) = ${ac}.`,
    },
    temperature: {
      titre: 'Voisins semblables après 200 tours, selon le bruit T (tolérance 50 %)',
      semblables: 'Voisins semblables',
      axeX: 'bruit T',
      axeY: 'part',
      resume: 'Sans bruit, 87 % de voisins semblables ; un peu de bruit fait monter à 97 % ; au-delà de T = 0,5, la part redescend vers 56 % à T = 3.',
      tableau: 'Voir les données (moyenne de 2 tirages)',
    },
    grossissement: {
      titre: 'Densité de frontières au fil des tours, en échelles logarithmiques (tolérance 50 %, 150 × 150)',
      froid: 'Sans bruit',
      tiede: 'Bruit T = 0,05',
      axeX: 'tours',
      axeY: 'frontières',
      tours: 'tour',
      resume: 'Sans bruit, la densité de frontières se fige vers 0,13. Avec un peu de bruit, elle décroît comme une droite de pente −0,47 en échelles logarithmiques, jusqu’à 0,014 après mille tours.',
    },
    mesures: {
      titre: 'Cinq indices, cinq arrangements, quatre tailles de quartier',
      arrangement: 'Arrangement',
      arrangements: { hasard: 'Hasard', echiquier: 'Échiquier', bandes1: 'Bandes de 1', bandes3: 'Bandes de 3', moities: 'Deux moitiés' },
      quartier: 'Taille des quartiers',
      quartiers: (k) => `${k} × ${k}`,
      resume: (arr, q) => `Arrangement «\u00a0${arr}\u00a0», quartiers de ${q}.`,
      noms: {
        D: 'Dissimilarité D',
        H: 'Entropie de Theil H',
        iso: 'Isolement P* (bleus)',
        semb: 'Voisins semblables',
        inter: 'Densité de frontières',
      },
      note: 'Grille de 24 × 24 refermée sur elle-même, moitié orange, moitié bleu. Les traits blancs montrent les quartiers. Les deux dernières mesures ne dépendent pas des quartiers.',
    },
    cout: {
      titre: 'Durée moyenne d’un tour, ville de 100 × 100 (Node 22, un cœur)',
      scenario: 'Scénario',
      villeA: 'Ville A',
      villeB: 'Ville B',
      note: 'Un navigateur récent donne des ordres de grandeur comparables. Les écarts viennent surtout du nombre d’habitants qui cherchent un logement à chaque tour.',
    },
  },
}
