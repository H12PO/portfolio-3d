// ============================================================
//  ARTICLES EN FRANÇAIS : Comprendre, Théorie, Applications, Calcul,
//  Histoire et références, et les textes des figures et des fiches
//  Blocs : { p }, { liste }, { tex, etroit? }, { figure }, { expert },
//  { preuve }, { frise }, { refs }, { fiche }, { ouvrir, libelle, aide }.
//  Dans le texte : *italique* et $formule$ (LaTeX).
//  Les chiffres « dans nos simulations » viennent du moteur de
//  l'explorateur (tests en Node, voir donnees.js et scenarios.js).
//  Les autres viennent des articles cités dans les références.
// ============================================================

const tex = String.raw

export const LECTURE_FR = {
  comprendre: [
    {
      id: 'idee', titre: 'Des milliers, et pas de chef', blocs: [
        { p: 'Le soir, au-dessus des villes, des nuées de milliers d’étourneaux dessinent dans le ciel des formes qui se plient, se creusent, se déchirent et se ressoudent en une seconde. Aucun oiseau ne voit la nuée entière, aucun ne la dirige. Chacun ne regarde que quelques voisins.' },
        { p: 'En 1986, l’informaticien Craig Reynolds cherche à animer un tel vol sur ordinateur sans dessiner chaque trajectoire. Sa réponse : donner à chaque oiseau virtuel, qu’il appelle *boid* (de *bird-oid*, « qui ressemble à un oiseau »), trois règles très simples, qui ne parlent que de ses voisins immédiats.' },
        { figure: 'regles' },
        { p: '*Séparation* : ne pas heurter ses voisins trop proches. *Alignement* : voler dans la même direction qu’eux. *Cohésion* : rester près d’eux. Rien d’autre. Aucune règle ne parle de la nuée, de sa forme ni de sa direction. Pourtant, quand des centaines de boids appliquent ces trois règles, une nuée apparaît, file, se coupe autour d’un obstacle et se reforme derrière : un comportement collectif *émerge*.' },
        { p: 'Physiciens, biologistes et mathématiciens ont repris l’idée sous d’autres formes. Tamás Vicsek, en 1995, avec le modèle le plus simple possible, pour étudier le passage du désordre à l’ordre. Iain Couzin, en 2002, pour les bancs de poissons, et des groupes qui gardent la mémoire de leur passé. Felipe Cucker et Steve Smale, en 2007, avec un modèle fait pour démontrer des théorèmes. L’explorateur réunit les quatre.' },
      ],
    },
    {
      id: 'regle', titre: 'La règle du jeu', blocs: [
        { p: 'Dans l’explorateur, chaque oiseau a une position et une vitesse. À chaque pas, il regarde ses voisins : ceux qui sont à moins d’une certaine distance (le *rayon de perception*, qui sert d’unité de longueur), sauf ceux qui sont dans son dos, dans un angle mort de 90°. Puis :' },
        {
          liste: [
            '*séparation* : il veut s’éloigner de chaque voisin à moins de 0,6, d’autant plus fort que ce voisin est proche ;',
            '*alignement* : il veut prendre la vitesse moyenne de ses voisins ;',
            '*cohésion* : il veut aller vers leur centre ;',
            'chaque envie devient une petite correction de sa vitesse, bornée : un oiseau ne fait pas demi-tour d’un coup. Les trois corrections s’additionnent, chacune avec son poids (2,5, 1 et 0,6 par défaut), plus une petite poussée au hasard ;',
            'sa vitesse reste entre une vitesse minimale et une vitesse maximale, puis il avance.',
          ],
        },
        { p: 'Tous les oiseaux décident en même temps, d’après ce qu’ils voient au début du pas. Personne n’a de plan, personne ne connaît la position du groupe, et pourtant le groupe existe.' },
      ],
    },
    {
      id: 'lire', titre: 'Lire l’explorateur', blocs: [
        { p: 'Chaque petit triangle est un oiseau, pointé dans le sens de son vol. Les boutons du haut changent les couleurs : *Espèces* (blanc quand il n’y en a qu’une, puis orange, bleu et vert), *Cap* (une teinte par direction de vol : une nuée bien alignée est d’une seule couleur) et *Peur* (du gris au rouge, la panique devant un prédateur). Chez Couzin, *Meneurs* colore les individus qui connaissent une direction. Les disques gris sont des obstacles, les grands triangles rouges des prédateurs.' },
        { p: '*2D* et *3D* changent le monde lui-même : en 3D, les oiseaux volent dans un volume, et l’on tourne autour à la souris. Le monde se referme sur lui-même : un oiseau qui sort par la droite rentre par la gauche. Chez Couzin et chez Cucker et Smale, le monde est ouvert, et la vue suit le groupe (chez Couzin, le plus grand : ceux qui s’en détachent sortent du cadre) ; le quadrillage montre qu’il avance.' },
        { p: 'Les courbes suivent quatre mesures. La *polarisation* vaut 0 quand chacun vole dans sa direction et 1 quand tous volent dans le même sens. La *rotation* vaut 1 pour un groupe qui tourne en rond autour de son centre. *Groupes* compte les groupes séparés, *Plus proche voisin* donne la distance moyenne entre voisins. Selon le modèle, d’autres apparaissent : les *captures* quand il y a des prédateurs, l’*écart des vitesses* chez Cucker et Smale.' },
        { p: 'Voici les scénarios, un par un : la question posée, les règles, ce qu’il faut regarder, et ce qui se passe. Les images ont été calculées à l’avance avec le moteur de l’explorateur, sur des groupes plus petits.' },
      ],
    },
    { id: 'sc-reynolds', titre: '1. Les trois règles', blocs: [{ fiche: 'reynolds' }] },
    { id: 'sc-sans-alignement', titre: '2. Sans alignement', blocs: [{ fiche: 'sans-alignement' }] },
    { id: 'sc-etourneaux', titre: '3. Les étourneaux comptent leurs voisins', blocs: [{ fiche: 'etourneaux' }] },
    { id: 'sc-faucons', titre: '4. Les faucons', blocs: [{ fiche: 'faucons' }] },
    { id: 'sc-foret', titre: '5. La forêt', blocs: [{ fiche: 'foret' }] },
    { id: 'sc-vent', titre: '6. Le vent', blocs: [{ fiche: 'vent' }] },
    { id: 'sc-especes', titre: '7. Trois espèces', blocs: [{ fiche: 'especes' }] },
    { id: 'sc-vicsek', titre: '8. Le modèle de Vicsek', blocs: [{ fiche: 'vicsek' }] },
    { id: 'sc-bandes', titre: '9. Les bandes', blocs: [{ fiche: 'bandes' }] },
    { id: 'sc-couzin', titre: '10. Essaim, tore, migration', blocs: [{ fiche: 'couzin' }] },
    { id: 'sc-meneurs', titre: '11. Des meneurs que personne ne connaît', blocs: [{ fiche: 'meneurs' }] },
    { id: 'sc-conflit', titre: '12. Compromis ou choix', blocs: [{ fiche: 'conflit' }] },
    { id: 'sc-cucker', titre: '13. Un théorème de vol', blocs: [{ fiche: 'cucker' }] },
    {
      id: 'retenir', titre: 'Ce qu’il faut retenir', blocs: [
        { p: 'Un vol collectif n’a besoin ni de chef, ni de plan, ni de vue d’ensemble : des règles locales suffisent, à condition de contenir une forme d’alignement. Sans alignement, on obtient des grappes ; avec, une nuée qui va quelque part.' },
        { p: 'Les mêmes règles donnent des formes très différentes selon de petits réglages : essaim, tore ou migration chez Couzin, désordre ou bandes chez Vicsek. La forme d’un groupe peut même dépendre de son histoire. L’onglet *Théorie* explique pourquoi.' },
      ],
    },
  ],

  theorie: [
    {
      id: 'agents', titre: 'Un modèle d’agents', blocs: [
        { p: 'Le modèle de Reynolds est un *modèle d’agents* : on décrit chaque individu et ses règles, on laisse tourner, et on regarde ce qui se passe à l’échelle du groupe. Le boid $i$ a une position $\\mathbf x_i$ et une vitesse $\\mathbf v_i$ ; ses voisins $\\mathcal N_i$ sont ceux qui sont à moins de $R$ et hors de son angle mort.' },
        { p: 'Reynolds écrit chaque règle comme une *force de pilotage* : la vitesse que l’oiseau voudrait avoir, moins sa vitesse actuelle, bornée par une force maximale $F$. Pour l’alignement, la vitesse voulue va dans la direction de la vitesse moyenne des voisins, à la vitesse maximale $v_{\\max}$ :' },
        { tex: tex`\mathbf f^{\,\text{ali}}_i = \operatorname{borne}_F\!\Big( v_{\max}\,\frac{\sum_{j\in\mathcal N_i}\mathbf v_j}{\big\|\sum_{j\in\mathcal N_i}\mathbf v_j\big\|} - \mathbf v_i \Big)`, etroit: tex`\begin{aligned}\mathbf f^{\,\text{ali}}_i = \operatorname{borne}_F\!\Big(& v_{\max}\,\hat{\mathbf u}_i - \mathbf v_i\Big),\\ \hat{\mathbf u}_i =\ & \frac{\sum_{j}\mathbf v_j}{\|\sum_{j}\mathbf v_j\|}\end{aligned}` },
        { p: 'De même, la cohésion vise le centre des voisins, et la séparation s’éloigne de chaque voisin trop proche (à moins de $r_s$), avec un poids en $1/d$ :' },
        { tex: tex`\mathbf d^{\,\text{coh}}_i = \frac{1}{|\mathcal N_i|}\sum_{j\in\mathcal N_i}(\mathbf x_j - \mathbf x_i), \qquad \mathbf d^{\,\text{sep}}_i = -\sum_{j:\ d_{ij}<r_s} \frac{\mathbf x_j - \mathbf x_i}{d_{ij}^2}`, etroit: tex`\begin{aligned}\mathbf d^{\,\text{coh}}_i &= \tfrac{1}{|\mathcal N_i|}\textstyle\sum_{j}(\mathbf x_j - \mathbf x_i)\\ \mathbf d^{\,\text{sep}}_i &= -\textstyle\sum_{d_{ij}<r_s} \frac{\mathbf x_j - \mathbf x_i}{d_{ij}^2}\end{aligned}` },
        { p: 'Les trois forces s’additionnent avec des poids $w$, plus un bruit $\\boldsymbol\\xi_i$ ; la vitesse est maintenue entre $v_{\\max}/2$ et $v_{\\max}$, puis l’oiseau avance :' },
        { tex: tex`\mathbf v_i \leftarrow \operatorname{clip}\big(\mathbf v_i + w_s\,\mathbf f^{\,\text{sep}}_i + w_a\,\mathbf f^{\,\text{ali}}_i + w_c\,\mathbf f^{\,\text{coh}}_i + \boldsymbol\xi_i\big), \qquad \mathbf x_i \leftarrow \mathbf x_i + \mathbf v_i`, etroit: tex`\begin{aligned}\mathbf v_i &\leftarrow \operatorname{clip}\big(\mathbf v_i + \textstyle\sum_r w_r\,\mathbf f^{\,r}_i + \boldsymbol\xi_i\big)\\ \mathbf x_i &\leftarrow \mathbf x_i + \mathbf v_i\end{aligned}` },
        { p: 'Deux choix comptent plus qu’il n’y paraît. *La force bornée* : un oiseau ne peut pas changer de direction d’un coup, ce qui donne aux nuées leur souplesse. *La mise à jour synchrone* : tout le monde décide d’après le même instantané. Le tout forme un système dynamique de dimension $4N$ (ou $6N$ en 3D), non linéaire, sans énergie à minimiser : rien ne garantit qu’il converge vers quoi que ce soit. C’est pourquoi les physiciens ont cherché des modèles plus simples.' },
      ],
    },
    {
      id: 'voisinage', titre: 'Métrique ou topologique', blocs: [
        { p: 'Qui est le voisin de qui ? Dans le modèle *métrique*, tous ceux qui sont à moins de $R$ : leur nombre vaut en moyenne $\\rho\\pi R^2$ en 2D, il suit la densité. Dans le modèle *topologique*, les $k$ plus proches, où qu’ils soient : leur nombre est fixe, c’est la distance qui suit la densité.' },
        { figure: 'voisinage' },
        { p: 'Ballerini et ses collègues (2008) ont tranché pour les étourneaux. Ils ont reconstruit en trois dimensions dix nuées de 450 à 2 600 oiseaux, photographiées en relief au-dessus de Rome. L’idée : un oiseau qui réagit à ses voisins ne les a pas répartis de la même façon dans toutes les directions ; il en a moins devant et derrière que sur les côtés. Cette anisotropie s’efface quand on regarde des voisins de plus en plus éloignés : là où elle disparaît se trouve le *dernier voisin avec lequel il interagit*.' },
        { p: 'Résultat : cette portée vaut $n_c = 6{,}5 \\pm 0{,}9$ voisins, sans aucun lien avec la densité de la nuée, alors que la même portée exprimée en mètres varie avec elle. Les étourneaux comptent leurs voisins, ils ne mesurent pas des distances.' },
        { p: 'Pourquoi ? Leurs simulations donnent une piste : attaquées par un prédateur, des nuées métriques se cassaient le plus souvent en plusieurs morceaux et laissaient beaucoup de traînards (43 % des morceaux), alors que les nuées topologiques restaient le plus souvent d’un seul tenant (5 % de traînards). Une règle topologique garde la nuée unie quand sa densité change brutalement.' },
        {
          expert: 'portée des interactions et portée des corrélations', blocs: [
            { p: 'Il ne faut pas confondre : $n_c \\approx 7$ est le nombre de voisins avec lesquels un oiseau *interagit*. Les directions, elles, sont *corrélées* à travers toute la nuée (voir plus bas, Cavagna et al., 2010). Et un modèle d’entropie maximale ajusté sur les mêmes données (Bialek et al., 2012) trouve une interaction effective qui porte en moyenne sur une vingtaine de voisins ($n_c = 21{,}2 \\pm 1{,}7$), elle aussi indépendante de la densité. Les chiffres dépendent de la méthode ; la conclusion topologique, non.' },
          ],
        },
      ],
    },
    {
      id: 'vicsek', titre: 'Le modèle de Vicsek', blocs: [
        { p: 'En 1995, Tamás Vicsek et ses collègues retirent tout ce qui n’est pas indispensable. Plus de séparation ni de cohésion, une vitesse constante $v_0$, et une seule règle : chaque particule prend le cap moyen de ses voisins dans un rayon $r = 1$, elle comprise, plus un bruit.' },
        { tex: tex`\theta_i(t+1) = \arg\Big(\sum_{j:\ \|\mathbf x_j - \mathbf x_i\|<r} e^{\mathrm i\,\theta_j(t)}\Big) + \eta\,\xi_i(t), \qquad \xi_i \sim \mathcal U\big[-\tfrac12, \tfrac12\big]`, etroit: tex`\begin{aligned}\theta_i(t+1) &= \arg\Big(\textstyle\sum_{j} e^{\mathrm i\,\theta_j(t)}\Big) + \eta\,\xi_i(t)\\ \xi_i &\sim \mathcal U\big[-\tfrac12, \tfrac12\big]\end{aligned}` },
        { tex: tex`\mathbf x_i(t+1) = \mathbf x_i(t) + v_0\,\big(\cos\theta_i(t),\ \sin\theta_i(t)\big)\,\Delta t` },
        { p: 'Le bruit $\\eta$ joue le rôle de la température, et la densité $\\rho = N/L^2$ celui de la densité d’aimants : c’est un aimant dont les petits aimants avancent. Pour mesurer l’ordre, on prend la longueur de la vitesse moyenne, ramenée entre 0 et 1 :' },
        { tex: tex`\varphi = \frac{1}{N v_0}\,\Big\| \sum_{i=1}^N \mathbf v_i \Big\|` },
        { figure: 'vicsekvivant' },
        { p: 'Avec $v_0 = 0{,}03$ et des systèmes de 40 à 10 000 particules, Vicsek et al. trouvent une transition : $\\varphi$ vaut presque 1 à faible bruit, et tombe vers 0 au-delà d’un bruit critique, qu’ils estiment à $\\eta_c \\approx 2{,}9$ pour un système infini. Près du seuil, $\\varphi$ s’annule comme une puissance, $\\varphi \\sim (\\eta_c - \\eta)^\\beta$ avec $\\beta \\approx 0{,}45$ : ils concluent à une transition *continue*, comme celle d’un aimant qu’on chauffe.' },
        { figure: 'transition' },
        { p: 'La figure refait le calcul avec le moteur de l’explorateur, à la densité de leur figure (4 particules par unité de surface). On retrouve leurs courbes : plus le système est grand, plus la chute est nette et plus elle arrive tôt. Les petits systèmes gardent un peu d’ordre même à très fort bruit, car la moyenne de $N$ directions au hasard ne vaut pas exactement zéro, mais environ $1/\\sqrt N$ : 0,1 pour 100 particules.' },
      ],
    },
    {
      id: 'nature', titre: 'Continue ou discontinue ? La controverse des bandes', blocs: [
        { p: 'En 2004, Guillaume Grégoire et Hugues Chaté relancent le débat : dans des systèmes assez grands, la transition est *discontinue*. Près du seuil, l’ordre n’apparaît pas progressivement : il se concentre en *bandes* denses et alignées qui traversent le système, perpendiculaires à leur direction de vol, au milieu d’un gaz désordonné (scénario *Bandes*).' },
        { p: 'Pourquoi Vicsek ne les avait-il pas vues ? Parce qu’elles n’apparaissent qu’au-delà d’une taille de système $L^*$, qui grandit beaucoup quand la vitesse diminue. Avec $v_0 = 0{,}03$, il faudrait des systèmes énormes ; avec $v_0 = 0{,}5$ et la densité 2, $L^*$ vaut environ 128 pour le bruit d’origine, et beaucoup moins pour le bruit « vectoriel » de Grégoire et Chaté (Chaté et al., 2008). En dessous de $L^*$, la transition *ressemble* à une transition continue.' },
        { p: 'Une transition discontinue a deux signatures classiques : un *saut* du paramètre d’ordre, et une *hystérésis* (le système ne change pas d’état au même endroit selon qu’on monte ou qu’on descend le paramètre). La figure suit un même système de 2 048 particules, avec le bruit vectoriel, en montant lentement le bruit, puis en le redescendant.' },
        { figure: 'hysteresis' },
        { p: 'Le saut est net : en montant, $\\varphi$ vaut encore 0,62 à $\\eta = 4{,}02$, puis tombe à 0,05 à $\\eta = 4{,}08$. En redescendant, le désordre tient jusqu’à $\\eta \\approx 3{,}9$, et l’ordre ne revient franchement qu’à $\\eta = 3{,}83$. Entre les deux, le système est ordonné ou désordonné selon d’où il vient : une petite boucle d’hystérésis, signature d’une transition discontinue. Sur des systèmes plus grands, Chaté et al. voient aussi des distributions de $\\varphi$ à deux bosses et des sauts brusques au cours du temps.' },
        {
          expert: 'pourquoi des bandes', blocs: [
            { p: 'Le mécanisme tient en une boucle. L’alignement est d’autant plus efficace que la densité locale est grande : plus de voisins, moins d’effet du bruit. Or une région alignée avance d’un bloc, ramasse les particules qu’elle rencontre, et devient plus dense. Densité et ordre se renforcent : juste au-dessus du seuil, l’état homogène est *instable*, et le système se sépare en une phase dense et ordonnée (les bandes) et une phase diluée et désordonnée, comme un liquide et sa vapeur. Solon, Chaté et Tailleur (2015) ont montré que la transition de Vicsek est bien une séparation de phases de ce type, où les bandes jouent le rôle de gouttes.' },
            { p: 'Le bruit vectoriel : au lieu d’ajouter une erreur au cap final, on ajoute à la somme des directions des voisins un vecteur au hasard, de poids proportionnel au nombre de voisins $n_i$. Un individu bien entouré d’accords est moins perturbé. Les bandes et le caractère discontinu y sont plus faciles à voir.' },
            { tex: tex`\hat{\mathbf u}_i(t+1) = \frac{\sum_{j\in\mathcal N_i}\hat{\mathbf u}_j(t) + \eta\, n_i(t)\, \boldsymbol\xi_i(t)}{\big\|\sum_{j\in\mathcal N_i}\hat{\mathbf u}_j(t) + \eta\, n_i(t)\, \boldsymbol\xi_i(t)\big\|}`, etroit: tex`\hat{\mathbf u}_i(t+1) \propto \textstyle\sum_{j}\hat{\mathbf u}_j(t) + \eta\, n_i(t)\, \boldsymbol\xi_i(t)` },
          ],
        },
      ],
    },
    {
      id: 'toner-tu', titre: 'Un ordre interdit à l’équilibre', blocs: [
        { p: 'Le modèle de Vicsek cache une surprise plus profonde. En 2D, pour des aimants *immobiles* dont les directions tournent dans le plan (le modèle XY), le théorème de Mermin et Wagner (1966) interdit tout ordre à longue portée : à toute température non nulle, les ondes d’orientation de très grande longueur d’onde coûtent si peu d’énergie qu’elles finissent par tout désordonner. Une nuée en 2D est l’analogue de ce modèle, à ceci près que ses « aimants » avancent.' },
        { p: 'John Toner et Yuhai Tu (1995) montrent que ce détail change tout. Ils décrivent une nuée vue de loin comme un fluide : un champ de vitesse $\\mathbf v(\\mathbf x, t)$ et un champ de densité $\\rho(\\mathbf x, t)$, avec tous les termes permis par les symétries.' },
        { tex: tex`\partial_t \mathbf v + (\mathbf v\cdot\nabla)\mathbf v = \alpha\mathbf v - \beta|\mathbf v|^2\mathbf v - \nabla P + D_L\nabla(\nabla\cdot\mathbf v) + D_1\nabla^2\mathbf v + D_2(\mathbf v\cdot\nabla)^2\mathbf v + \mathbf f`, etroit: tex`\begin{aligned}\partial_t \mathbf v + (\mathbf v\cdot\nabla)\mathbf v =\ & \alpha\mathbf v - \beta|\mathbf v|^2\mathbf v - \nabla P\\ & + D_L\nabla(\nabla\cdot\mathbf v) + D_1\nabla^2\mathbf v\\ & + D_2(\mathbf v\cdot\nabla)^2\mathbf v + \mathbf f\end{aligned}` },
        { tex: tex`\partial_t\rho + \nabla\cdot(\rho\,\mathbf v) = 0` },
        { p: 'Avec $\\alpha < 0$, le fluide est désordonné ; avec $\\alpha > 0$, il prend une vitesse moyenne de norme $\\sqrt{\\alpha/\\beta}$, dans une direction choisie au hasard. $P$ est une pression qui dépend de la densité, $\\mathbf f$ un bruit. Le terme $(\\mathbf v\\cdot\\nabla)\\mathbf v$ n’existe pas pour des aimants immobiles : il dit que l’ordre est *transporté* par le mouvement. Deux oiseaux d’abord éloignés finissent par se croiser et s’influencer : l’information se propage bien plus efficacement que de proche en proche.' },
        { p: 'Toner et Tu montrent que cela suffit à stabiliser un véritable ordre à longue portée en 2D, et calculent des exposants exacts pour les fluctuations ($z = 6/5$, $\\zeta = 3/5$, $\\chi = -1/5$), sous une hypothèse qu’ils ne démontrent pas entièrement. En 1998, ils généralisent les équations avec des coefficients libres devant les termes de transport : contrairement à un fluide ordinaire, une nuée n’a pas de raison d’être invariante par changement de référentiel, puisque les oiseaux volent par rapport à l’air.' },
        {
          expert: 'Mermin et Wagner en quelques lignes', blocs: [
            { p: 'Dans un aimant XY à l’équilibre, l’énergie d’une ondulation de l’orientation, de vecteur d’onde $q$, est proportionnelle à $q^2$. À la température $T$, chaque mode a donc une amplitude moyenne $\\langle|\\delta\\theta_q|^2\\rangle \\propto T/q^2$, et la fluctuation totale de l’orientation vaut, en dimension $d$ :' },
            { tex: tex`\langle \delta\theta^2\rangle \propto T\int \frac{d^d q}{q^2}` },
            { p: 'En dimension 2, cette intégrale diverge (logarithmiquement) aux grandes longueurs d’onde : dans un système assez grand, l’orientation erre sans limite, et l’ordre à longue portée est impossible. Chez Toner et Tu, les termes non linéaires de transport changent la façon dont les coefficients dépendent de l’échelle, et la divergence disparaît : c’est le sens de $\\chi = -1/5 < 0$, qui dit que les fluctuations de vitesse restent finies quand la nuée grandit.' },
          ],
        },
        { p: 'Une autre prédiction se vérifie dans l’explorateur : les *fluctuations géantes du nombre*. Dans un gaz ordinaire, si une boîte contient en moyenne $n$ particules, l’écart-type de ce nombre vaut $\\sqrt n$ : $\\sigma \\propto n^{1/2}$. Dans une nuée ordonnée, les particules arrivent par paquets, et les fluctuations grossissent plus vite : $\\sigma \\propto n^{\\alpha}$ avec $\\alpha > 1/2$. Chaté et al. (2008) mesurent $\\alpha \\approx 0{,}8$, en 2D comme en 3D (une théorie de Ramaswamy et al. prédisait $1/2 + 1/d$, soit 1 en 2D, ce qui ne colle pas).' },
        { figure: 'fluctuations' },
        { p: 'Avec le moteur de l’explorateur (8 192 particules, $v_0 = 0{,}5$, $\\rho = 2$), on mesure une pente d’environ 0,78 dans la phase ordonnée, et d’environ 0,48 dans la phase désordonnée, tout près de la valeur 1/2 d’un gaz ordinaire.' },
      ],
    },
    {
      id: 'couzin', titre: 'Les zones de Couzin', blocs: [
        { p: 'Couzin, Krause, James, Ruxton et Franks (2002) découpent l’espace autour de chaque individu en trois zones emboîtées. Dans la *zone de répulsion*, de rayon $r_r = 1$, il fuit ses voisins, et rien d’autre ne compte :' },
        { tex: tex`\mathbf d_i = -\sum_{j \in \text{rép.}} \frac{\mathbf r_{ij}}{\|\mathbf r_{ij}\|}` },
        { p: 'Sinon, il s’aligne sur les voisins de la *zone d’orientation* (jusqu’à $r_o = r_r + \\Delta r_o$) et se dirige vers ceux de la *zone d’attraction* (jusqu’à $r_a = r_o + \\Delta r_a$), en faisant la moyenne des deux directions si les deux zones sont occupées :' },
        { tex: tex`\mathbf d_o = \sum_{j\in\text{or.}} \frac{\mathbf v_j}{\|\mathbf v_j\|}, \qquad \mathbf d_a = \sum_{j\in\text{att.}}\frac{\mathbf r_{ij}}{\|\mathbf r_{ij}\|}, \qquad \mathbf d_i = \frac12\Big(\frac{\mathbf d_o}{\|\mathbf d_o\|} + \frac{\mathbf d_a}{\|\mathbf d_a\|}\Big)`, etroit: tex`\begin{aligned}\mathbf d_o &= \textstyle\sum_{\text{or.}} \hat{\mathbf v}_j, \quad \mathbf d_a = \textstyle\sum_{\text{att.}}\hat{\mathbf r}_{ij}\\ \mathbf d_i &= \tfrac12\big(\hat{\mathbf d}_o + \hat{\mathbf d}_a\big)\end{aligned}` },
        { p: 'Il va à vitesse constante $s$, ne voit pas derrière lui (un angle mort de $360° - \\alpha$), tourne d’au plus $\\theta\\tau$ par pas de temps $\\tau$, et sa direction voulue est perturbée par un bruit d’écart-type $\\sigma$. Les valeurs de l’article : 100 individus, $s = 3$, $\\alpha = 270°$, $\\theta = 40°$ par seconde, $\\tau = 0{,}1$ s, $\\sigma = 0{,}05$. Ce sont celles de l’explorateur.' },
        { p: 'Pour reconnaître les états, deux mesures : la *polarisation* $p = \\|\\frac1N\\sum_i \\hat{\\mathbf v}_i\\|$, et le *moment angulaire* $m = \\|\\frac1N\\sum_i \\hat{\\mathbf r}_{ic}\\times\\hat{\\mathbf v}_i\\|$, où $\\hat{\\mathbf r}_{ic}$ pointe du centre du groupe vers l’individu $i$. Un essaim a $p$ et $m$ faibles, un tore un $m$ fort, un groupe parallèle un $p$ fort.' },
        { figure: 'couzin' },
        { p: 'La figure refait le diagramme avec le moteur de l’explorateur, en 3D comme dans l’article : pour chaque couple $(\\Delta r_o, \\Delta r_a)$, trois groupes de 100 poissons, 1 500 pas. On retrouve les régions de Couzin : l’essaim sans orientation, le tore pour une orientation étroite et une attraction large, les groupes parallèles dès que l’orientation s’élargit, et la fragmentation quand l’attraction est trop courte pour retenir le groupe.' },
        { p: 'Le plus surprenant est ailleurs : la *mémoire collective*. Fixons $r_a = 14$, et faisons varier $r_o$ lentement, d’abord en montant, puis en descendant, sans jamais recréer le groupe.' },
        { figure: 'memoire' },
        { p: 'Dans nos simulations, en montant, le groupe est un essaim, devient un tore dès $r_o \\approx 1{,}25$ et le reste jusqu’à $r_o \\approx 3{,}5$, puis s’aligne. En redescendant, il reste aligné jusqu’à $r_o \\approx 1{,}5$ et ne repasse jamais par le tore (l’article trouve le tore entre 1,5 et 2,5 environ à la montée, et le même refus du tore à la descente). Entre ces bornes, pour exactement les mêmes règles, le groupe est un tore ou une colonne selon son *passé*. Aucun individu ne garde le moindre souvenir : la mémoire est dans la configuration du groupe.' },
      ],
    },
    {
      id: 'meneurs', titre: 'Des meneurs que personne ne connaît', blocs: [
        { p: 'Couzin, Krause, Franks et Levin (2005) ajoutent des individus *informés*, qui connaissent une direction préférée $\\mathbf g$. Leur direction voulue devient un compromis entre le groupe et leur préférence, avec un poids $\\omega$ :' },
        { tex: tex`\mathbf d'_i = \frac{\mathbf d_i + \omega\,\mathbf g_i}{\|\mathbf d_i + \omega\,\mathbf g_i\|}` },
        { p: 'Personne ne sait qui est informé, et il n’y a aucun signal. Leur premier résultat : la précision du groupe, c’est-à-dire à quel point il suit $\\mathbf g$, augmente avec la part $p$ d’informés, et *plus le groupe est grand, plus la part nécessaire est petite* : dans un grand groupe, quelques pour cent suffisent.' },
        { figure: 'meneurs' },
        { p: 'Dans nos simulations (en 3D, 6 tirages par point, 200 secondes de nage), sans informé, le groupe part n’importe où : l’écart moyen avec la direction préférée est de 85 à 120°. Un seul informé suffit à guider un groupe de 20 (écart inférieur à 1°). Pour 100 et 200 individus, l’écart tombe à environ 25° avec 5 % d’informés et sous 20° avec 10 %. À part égale, le groupe de 200 est un peu plus précis que celui de 100 (13° contre 17° avec 10 % d’informés, 3° contre 7° avec 20 %), dans le sens de l’article.' },
        { p: 'Leur second résultat porte sur les conflits. Deux minorités de même taille préfèrent deux directions écartées d’un certain angle. Si l’écart est petit, le groupe suit la moyenne ; au-delà d’un seuil, il choisit l’une des deux, au hasard d’un essai à l’autre. Et si l’une des deux minorités est plus nombreuse, même de peu (6 contre 5), le groupe la suit.' },
        { figure: 'conflit' },
        { p: 'Dans nos simulations (ω = 1, 8 tirages par écart), jusqu’à 90° d’écart environ, le groupe part entre les deux, à quelques degrés près : c’est le compromis. À partir de 105°, il rejoint l’une des deux directions préférées, tantôt l’une, tantôt l’autre : la courbe se dédouble. C’est une *bifurcation*, la même que celle d’un système qui doit trancher entre deux options. Mais ce choix a un prix : les informés du camp perdant, trop attachés à leur direction, quittent le groupe et partent seuls (10 individus sur 100). Les points orange marquent les tirages où une partie du groupe est partie ; la figure donne alors la direction du groupe principal. Avec une préférence plus faible (ω = 0,5), personne ne part, mais nos groupes font des compromis jusqu’à 150° d’écart. Plus les convictions sont fortes, plus le groupe tranche, et plus il risque de se défaire.' },
        { p: 'Une précision honnête : l’article utilise un modèle un peu différent (une zone de répulsion, et une seule zone où l’on s’aligne et se rapproche à la fois). L’explorateur greffe leur règle des informés sur le modèle de 2002, en 3D, où le groupe forme une colonne bien alignée. Les tendances sont les mêmes ; les chiffres, non.' },
      ],
    },
    {
      id: 'consensus', titre: 'S’accorder sur un graphe qui change', blocs: [
        { p: 'Le modèle de Vicsek sans bruit pose une question de mathématicien. Si chacun fait la moyenne des caps de ses voisins, mais que les voisins changent sans cesse (puisque tout le monde bouge), est-on sûr que tout le monde finira par avoir le même cap ? Jadbabaie, Lin et Morse (2003) répondent pour la version linéarisée du modèle :' },
        { tex: tex`\theta_i(t+1) = \frac{1}{1 + n_i(t)}\Big(\theta_i(t) + \sum_{j\in\mathcal N_i(t)} \theta_j(t)\Big)` },
        { p: 'En vecteur, $\\boldsymbol\\theta(t+1) = F(t)\\,\\boldsymbol\\theta(t)$, où $F(t)$ est une *matrice stochastique* (positive, dont chaque ligne a pour somme 1) qui dépend du graphe des voisinages à l’instant $t$. Leur théorème : si l’on peut découper le temps en intervalles successifs de longueur bornée, sur chacun desquels la réunion des graphes est *connexe* (tout le monde est relié à tout le monde, de proche en proche, au moins une fois dans l’intervalle), alors tous les caps convergent vers une même valeur. Le graphe peut être déconnecté à chaque instant : il suffit qu’il soit connecté *au total*, régulièrement.' },
        { figure: 'consensus' },
        {
          expert: 'l’idée de la preuve', blocs: [
            { p: 'Une moyenne ne sort jamais de l’intervalle de ce qu’elle moyenne : le plus grand cap ne peut que baisser, le plus petit que monter. L’écart $\\max_i\\theta_i - \\min_i\\theta_i$ décroît donc. Mais rien ne dit encore qu’il tend vers zéro.' },
            { p: 'C’est la connexité qui force la contraction. Sur un intervalle où le graphe réuni est connexe, l’influence de chaque individu finit par atteindre tous les autres : le produit des matrices $F$ sur un nombre suffisant de ces intervalles a toutes ses entrées strictement positives, et bornées par en dessous. Une telle matrice réduit l’écart d’un facteur strictement inférieur à 1. En enchaînant, l’écart décroît géométriquement.' },
            { p: 'La preuve de Jadbabaie et al. s’appuie sur un résultat de Wolfowitz (1963) sur les produits infinis de matrices stochastiques. Le même raisonnement vaut pour le consensus de capteurs, de robots ou d’opinions. Sans connexité, le théorème tombe : deux groupes qui ne se voient jamais convergent chacun vers leur propre cap (bouton *Deux groupes séparés*).' },
          ],
        },
      ],
    },
    {
      id: 'cucker', titre: 'Cucker et Smale : un théorème de vol', blocs: [
        { p: 'Le théorème précédent *suppose* que le graphe reste connecté, alors que c’est justement ce qu’on voudrait démontrer : un groupe qui se disperse perd ses liens. Cucker et Smale (2007) ferment la boucle avec un modèle où *tout le monde* influence tout le monde, d’autant moins qu’il est loin :' },
        { tex: tex`\dot{\mathbf x}_i = \mathbf v_i, \qquad \dot{\mathbf v}_i = \frac{K}{N}\sum_{j=1}^N \psi\big(\|\mathbf x_j - \mathbf x_i\|\big)\,(\mathbf v_j - \mathbf v_i), \qquad \psi(r) = \frac{1}{(1+r^2)^\beta}`, etroit: tex`\begin{aligned}\dot{\mathbf x}_i &= \mathbf v_i\\ \dot{\mathbf v}_i &= \tfrac{K}{N}\textstyle\sum_{j} \psi(\|\mathbf x_j - \mathbf x_i\|)\,(\mathbf v_j - \mathbf v_i)\\ \psi(r) &= (1+r^2)^{-\beta}\end{aligned}` },
        { p: 'Le *vol en groupe* (en anglais, *flocking*) a une définition précise : les vitesses s’accordent ($\\mathbf v_i - \\mathbf v_j \\to 0$) et le groupe reste borné ($\\sup_t \\|\\mathbf x_i - \\mathbf x_j\\| < \\infty$). Le théorème : si $\\beta < 1/2$, le vol en groupe arrive *toujours*, quelles que soient les positions et les vitesses de départ, et à vitesse exponentielle (Cucker et Smale, 2007) ; le cas $\\beta = 1/2$ a été ajouté ensuite (Ha et Tadmor, 2008 ; Ha et Liu, 2009). Si $\\beta > 1/2$, il n’arrive que pour certains départs : assez serrés, avec des vitesses assez proches.' },
        { figure: 'cucker' },
        { p: 'Dans la figure, avec 60 individus partis du même tirage, l’écart des vitesses s’effondre exponentiellement pour $\\beta = 0{,}25$ et $0{,}5$, bien plus lentement pour $0{,}75$, et reste élevé pour $1{,}5$ : le groupe s’est dispersé avant d’avoir pu s’accorder. La somme des vitesses, elle, ne change jamais (chaque paire échange des quantités opposées) : le groupe finit par voler à la vitesse moyenne du départ.' },
        {
          preuve: 'La preuve, en deux inégalités', source: 'Ha et Liu, 2009',
          paragraphes: [
            'Notons $X(t)$ le plus grand écart de positions et $V(t)$ le plus grand écart de vitesses dans le groupe. Deux inégalités suffisent, à des constantes près. Les positions ne peuvent s’écarter qu’à la vitesse des écarts de vitesse : $\\dot X \\le V$. Et l’alignement réduit les écarts de vitesse, d’autant moins que le groupe est étalé, puisque $\\psi$ décroît : $\\dot V \\le -K\\,\\psi(X)\\,V$.',
            'On pose alors $\\mathcal L(t) = V(t) + K\\int_0^{X(t)}\\psi(s)\\,ds$. Sa dérivée vaut $\\dot V + K\\psi(X)\\dot X \\le -K\\psi(X)V + K\\psi(X)V = 0$ : $\\mathcal L$ ne peut que décroître. Donc $K\\int_{X(0)}^{X(t)}\\psi(s)\\,ds \\le V(0)$ pour tout $t$.',
            'Si $\\int_0^\\infty \\psi = \\infty$, cette inégalité borne $X(t)$ par un nombre $X^*$ : le groupe reste borné. Alors $\\psi(X) \\ge \\psi(X^*) > 0$, et $\\dot V \\le -K\\psi(X^*)V$ donne $V(t) \\le V(0)\\,e^{-K\\psi(X^*)t}$ : les vitesses s’accordent exponentiellement vite.',
            'Or $\\psi(r) \\sim r^{-2\\beta}$ à l’infini : son intégrale diverge si et seulement si $2\\beta \\le 1$. C’est tout le seuil $\\beta = 1/2$. Au-delà, la « réserve d’attraction » $K\\int_{X(0)}^\\infty \\psi$ est finie, et si l’écart de vitesse du départ la dépasse, rien n’empêche le groupe de se disperser pour de bon.',
          ],
        },
      ],
    },
    {
      id: 'nuees-reelles', titre: 'Les vraies nuées', blocs: [
        { p: 'Depuis une quinzaine d’années, on mesure les nuées réelles avec la précision d’une expérience de physique. À Rome, l’équipe d’Andrea Cavagna et Irene Giardina photographie en relief des nuées d’étourneaux, et reconstruit la trajectoire de chaque oiseau.' },
        { p: '*Des corrélations sans échelle* (Cavagna et al., 2010). Sur 24 nuées de 122 à 4 268 oiseaux, très ordonnées (polarisation moyenne de 0,96), on regarde les *fluctuations* : la vitesse de chaque oiseau moins la vitesse moyenne de la nuée. Elles sont corrélées sur des distances énormes : la longueur de corrélation $\\xi$ grandit avec la taille de la nuée, $\\xi \\approx 0{,}35\\,L$, pour des nuées de 9 à 86 mètres. Il n’y a pas de distance caractéristique : en pratique, chaque oiseau est relié à toute la nuée, alors qu’il n’interagit qu’avec quelques voisins.' },
        { tex: tex`C(r) = \frac{\sum_{i,j} \mathbf u_i\cdot\mathbf u_j\;\delta(r - r_{ij})}{\sum_{i,j}\delta(r - r_{ij})}, \qquad \mathbf u_i = \mathbf v_i - \frac1N\sum_k \mathbf v_k`, etroit: tex`\begin{aligned}C(r) &= \frac{\sum_{i,j} \mathbf u_i\cdot\mathbf u_j\,\delta(r - r_{ij})}{\sum_{i,j}\delta(r - r_{ij})}\\ \mathbf u_i &= \mathbf v_i - \tfrac1N\textstyle\sum_k \mathbf v_k\end{aligned}` },
        { p: 'Pour l’orientation, ce n’est pas si étonnant : briser une symétrie continue (toutes les directions de vol sont possibles, la nuée en choisit une) laisse des modes « mous », qui ne coûtent presque rien et portent loin, des modes de Goldstone. Pour la *vitesse* des oiseaux, en revanche, il n’y a pas de symétrie brisée : que ses fluctuations soient elles aussi sans échelle ($\\xi_{sp} \\approx 0{,}36\\,L$) suggère que les nuées vivent près d’un point critique, là où un système répond le plus fortement aux perturbations. Les auteurs restent prudents : d’autres explications ne sont pas exclues.' },
        { p: '*Un modèle tiré des données* (Bialek et al., 2012). Au lieu de deviner les règles, on cherche la loi de probabilité la moins arbitraire (d’entropie maximale) qui reproduit les corrélations mesurées entre voisins. Elle a exactement la forme d’un modèle d’aimants de Heisenberg, avec des interactions limitées à un nombre fixe de voisins. Nourri seulement de corrélations locales, ce modèle prédit, sans paramètre libre, les corrélations à travers toute la nuée.' },
        { p: '*Les virages se propagent comme des ondes* (Attanasi et al., 2014). Quand une nuée tourne, le virage part de quelques oiseaux et traverse la nuée à vitesse constante, presque sans s’affaiblir. Les modèles de type Vicsek prédisent au contraire une propagation diffusive, qui s’étale et s’amortit. Il faut donner une *inertie* au comportement de chaque oiseau pour retrouver ce que l’on mesure. La théorie prédit aussi que l’information va plus vite dans une nuée plus ordonnée, ce que confirment les données.' },
      ],
    },
    {
      id: 'predateurs', titre: 'Pourquoi se grouper', blocs: [
        { p: 'En 1971, William D. Hamilton propose une explication égoïste au groupe. Chaque individu a un *domaine de danger* : la zone où un prédateur qui surgirait serait plus près de lui que de tout autre. Se glisser entre des congénères rétrécit ce domaine. Si chacun le fait, le groupe se resserre, sans que personne ne cherche le bien commun : c’est le *troupeau égoïste*.' },
        { p: 'D’autres avantages s’ajoutent. L’*effet de dilution* : un prédateur qui attrape une proie à la fois a moins de chances de vous choisir dans un grand groupe. L’*effet de confusion* : devant des dizaines de silhouettes semblables qui bougent ensemble, un prédateur a du mal à suivre une cible. Et la vigilance : mille yeux voient le danger plus tôt, et la fuite de quelques-uns prévient tous les autres.' },
        { figure: 'predateur' },
        { p: 'Dans nos simulations (un prédateur, un monde de taille fixe, 12 000 pas, 3 tirages), sans confusion, le prédateur fait de 31 à 35 captures pour 10 000 pas, quelle que soit la taille de la nuée : il est limité par ses poursuites et ses temps de repos. Avec confusion, ses captures baissent quand la nuée grandit, de 28 à 24. Pour chaque oiseau, le risque chute avec la taille du groupe : avec 1 000 oiseaux plutôt que 30, il est environ 30 fois plus faible sans confusion, et près de 40 fois avec. C’est l’effet de dilution, que la confusion renforce.' },
        { p: 'Dans les vraies nuées, la fuite produit des figures typiques : un vide qui s’ouvre devant le prédateur, une « fontaine » où le groupe se fend et se referme derrière lui, des ondes d’agitation qui parcourent des milliers d’étourneaux (Procaccini et al., 2011). Des expériences où des poissons prédateurs chassent des proies virtuelles ont montré que la prédation favorise directement les proies qui se déplacent de façon coordonnée (Ioannou, Guttal et Couzin, 2012).' },
      ],
    },
    {
      id: 'matiere-active', titre: 'La matière active', blocs: [
        { p: 'Les modèles de nuées ont donné naissance à un domaine de la physique : la *matière active*, l’étude des systèmes dont chaque élément puise de l’énergie pour se déplacer. Oiseaux et poissons, mais aussi bactéries, cellules, filaments du squelette des cellules poussés par des moteurs moléculaires, robots, grains secoués (Marchetti et al., 2013). Ces systèmes échappent aux lois de l’équilibre : l’ordre en 2D de Toner et Tu, les fluctuations géantes, les séparations de phase sans attraction en sont des signatures.' },
        { p: 'En 2013, Bricard et ses collègues fabriquent une nuée de laboratoire : des billes de plastique de quelques micromètres, par millions, qui roulent toutes seules dans un champ électrique (des « rouleurs de Quincke »). Au-delà d’une densité seuil, elles se mettent à rouler ensemble, en bandes qui se propagent : une transition de type Vicsek, dans un vrai matériau.' },
      ],
    },
  ],

  applications: [
    {
      id: 'cinema', titre: 'Le cinéma et les jeux', blocs: [
        { p: 'Les boids sont nés pour le cinéma. Le premier film qui les utilise est un court métrage de 1987, *Stanley and Stella in: Breaking the Ice*. En 1992, *Batman Returns* leur confie des nuées de chauves-souris et une armée de pingouins qui défile dans Gotham City. En 1998, Reynolds reçoit un prix scientifique et technique de l’Académie des Oscars « pour ses contributions pionnières au développement de l’animation 3D par ordinateur pour le cinéma ».' },
        { p: 'Le principe est resté : pour animer une foule, un troupeau ou un banc, on ne dessine pas chaque individu, on lui donne des règles. Les logiciels de foules des grands films en sont les héritiers, avec des règles bien plus riches. Les jeux vidéo aussi : les oiseaux de *Half-Life* (1998) s’appelaient « boid » dans les fichiers du jeu.' },
      ],
    },
    {
      id: 'drones', titre: 'Les essaims de drones', blocs: [
        { p: 'Faire voler des drones en groupe sans pilote central pose exactement la question de Reynolds : quelles règles locales donnent un vol collectif stable ? Vásárhelyi et ses collègues (2018) ont fait voler 30 drones dehors, sans contrôle central, en nuée, avec évitement des collisions et des obstacles. Les paramètres de leur modèle de vol ont été réglés par un algorithme d’évolution, en simulation, avant les vols réels.' },
        { p: 'À ne pas confondre avec les spectacles de drones lumineux : ceux-là suivent chacun une trajectoire calculée à l’avance par un ordinateur central. Ils dessinent des figures, ils ne forment pas une nuée.' },
      ],
    },
    {
      id: 'biologie', titre: 'Criquets, poissons, bactéries', blocs: [
        { p: '*Les criquets.* Buhl et ses collègues (2006) ont filmé des criquets pèlerins qui marchent dans une arène en anneau. À faible densité (5 à 17 criquets par mètre carré), leurs déplacements sont désordonnés. Entre 25 et 62 par mètre carré, ils marchent ensemble, mais changent brusquement de sens de temps en temps. Au-delà de 74 par mètre carré, ils marchent tous dans le même sens, durablement. C’est la transition de Vicsek, dans un insecte qui ravage des cultures : comprendre à quelle densité un essaim se met en marche aide à le prévenir.' },
        { p: '*Les poissons.* Les bancs passent d’un essaim compact à un tore ou à une colonne selon le danger et le courant, comme dans le modèle de Couzin. En laboratoire, on suit chaque poisson par vidéo pour ajuster les règles.' },
        { p: '*Les bactéries et les cellules.* Des bactéries qui nagent forment des tourbillons et des courants collectifs ; des cellules qui ferment une plaie migrent en nappe, alignées sur leurs voisines. Les équations de Toner et Tu, avec quelques termes de plus, servent à les décrire.' },
        { p: '*Des meneurs, parfois.* Toutes les nuées ne sont pas égalitaires. En équipant des pigeons de balises GPS, Nagy et ses collègues (2010) ont montré qu’un vol de pigeons suit une hiérarchie : certains oiseaux influencent davantage les autres. Les modèles sans chef sont un point de départ, pas une loi universelle.' },
      ],
    },
    {
      id: 'foules', titre: 'Les foules humaines', blocs: [
        { p: 'Une foule de piétons n’est pas une nuée : on ne s’aligne pas sur ses voisins, on va chacun vers son but, en évitant les autres. Mais l’esprit est le même : des règles locales (garder ses distances, contourner, suivre celui qui va dans le même sens) font apparaître des files de marcheurs, des bouchons aux portes, des ondes de compression dans les foules denses. C’est le sujet d’un prochain projet du labo : la foule de l’aéroport.' },
      ],
    },
    {
      id: 'limites', titre: 'Ce que ces modèles ne disent pas', blocs: [
        { p: 'Ce sont des caricatures, et elles l’assument. Un vrai oiseau a une aérodynamique, une inertie, un champ de vision masqué par ses voisins, de la fatigue, des préférences, des liens avec certains individus. Nos boids voient parfaitement à travers la foule, décident tous en même temps, et ne se fatiguent jamais.' },
        { p: 'Leur force est ailleurs : ils montrent *ce qui suffit*. Si trois règles produisent une nuée, il n’est pas nécessaire de supposer un chef, un plan ou une intelligence collective mystérieuse. Ils montrent aussi ce qui est *robuste* : les états de Couzin, la transition de Vicsek, l’ordre de Toner et Tu ne dépendent pas des détails, et c’est pour cela qu’on les retrouve chez des criquets, des poissons et des billes de plastique.' },
      ],
    },
  ],

  calcul: [
    {
      id: 'grille', titre: 'Trouver ses voisins vite : la grille', blocs: [
        { p: 'La première difficulté est banale : trouver les voisins. Comparer chaque oiseau à tous les autres coûte $N(N-1)/2$ comparaisons par pas : 200 millions pour 20 000 oiseaux. Or chaque oiseau ne regarde que ceux qui sont à moins de $R$.' },
        { p: 'L’explorateur découpe le monde en cases de côté au moins $R$. Un voisin à moins de $R$ est forcément dans la même case ou dans l’une des 8 cases autour (26 en 3D). À chaque pas, on range les oiseaux par case avec un *tri par comptage* : un premier passage compte les oiseaux de chaque case, une somme cumulée donne où commence chaque case dans un tableau, un second passage y range les indices. Tout tient dans trois tableaux d’entiers, sans aucune allocation.' },
        { figure: 'grille' },
        { p: 'Le coût d’un pas devient proportionnel à $N$ fois le nombre moyen d’oiseaux par case, au lieu de $N^2$. La liste des cases voisines de chaque case est calculée une fois pour toutes, puisque la grille ne change pas sur un tore.' },
        { figure: 'cout' },
        { p: 'La figure compare, sur la même machine, le pas complet avec la grille et la seule recherche des voisins en comparant toutes les paires. À 16 000 oiseaux, il y a un facteur d’environ 150. La grille tient la pente de $N$ ; la méthode naïve, celle de $N^2$.' },
      ],
    },
    {
      id: 'topologique', titre: 'Les k plus proches voisins', blocs: [
        { p: 'Pour la règle topologique, on ne connaît pas la distance à l’avance. On parcourt les cases par anneaux concentriques : la case de l’oiseau et ses voisines, puis l’anneau suivant, et ainsi de suite. On garde les $k$ plus proches dans un petit tableau trié (une insertion, comme on range des cartes).' },
        { p: 'Quand s’arrêter ? Tout oiseau d’un anneau de rang $r + 1$ est à au moins $r$ fois le côté d’une case. Dès que le $k$-ième voisin trouvé est plus proche que cela, aucun oiseau plus loin ne peut le battre : on s’arrête. Dans une nuée dense, un ou deux anneaux suffisent.' },
      ],
    },
    {
      id: 'tore', titre: 'Le monde qui se referme', blocs: [
        { p: 'Sur un tore de côté $L$, l’écart entre deux oiseaux est le plus court des écarts possibles, en passant ou non par le bord : c’est la *convention de l’image minimale*. Plutôt que $dx - L\\,\\operatorname{round}(dx/L)$, l’explorateur fait une simple comparaison : si $dx > L/2$, on retire $L$ ; si $dx < -L/2$, on l’ajoute. C’est exact dès que les positions restent dans le monde, et nettement plus rapide.' },
        { p: 'Pour la rotation d’un groupe, il faut son centre. Or la moyenne des positions n’a pas de sens sur un tore (un groupe à cheval sur le bord aurait son « centre » au milieu du monde). On prend une *moyenne circulaire* : chaque coordonnée est vue comme un angle, on fait la moyenne des vecteurs $(\\cos, \\sin)$, et on revient à une position.' },
      ],
    },
    {
      id: 'pas', titre: 'Un pas de temps', blocs: [
        { p: '*Boids.* Les nouvelles vitesses sont calculées dans un second tableau, puis recopiées : tout le monde décide d’après le même instantané (mise à jour synchrone). Chaque règle est une force de pilotage bornée, la somme est ajoutée à la vitesse, la vitesse est ramenée entre $v_{\\max}/2$ et $v_{\\max}$ (davantage en cas de panique), puis la position avance.' },
        { p: '*Vicsek.* L’ordre des opérations suit l’article : on avance avec l’ancienne vitesse, puis on calcule le nouveau cap. En 3D, le bruit est une rotation d’angle tiré entre $-\\eta/2$ et $\\eta/2$, autour d’un axe perpendiculaire tiré au hasard.' },
        { p: '*Couzin.* Pour tourner d’au plus $\\theta\\tau$ vers la direction voulue $\\mathbf d$, on décompose $\\mathbf d$ selon la direction actuelle $\\mathbf u$ et sa partie perpendiculaire $\\mathbf w$, puis on prend $\\cos(\\theta\\tau)\\,\\mathbf u + \\sin(\\theta\\tau)\\,\\mathbf w$.' },
        { p: '*Cucker et Smale.* Chacun regarde tout le monde : $N^2$ termes par pas. Comme $\\psi(r_{ij}) = \\psi(r_{ji})$, on calcule chaque paire une seule fois et on ajoute à $i$ ce que l’on retire à $j$. Le calcul est deux fois plus rapide, et la somme des vitesses est conservée exactement.' },
      ],
    },
    {
      id: 'worker', titre: 'Le calcul à côté de la page', blocs: [
        { p: 'Le moteur tourne dans un *Web Worker*, un fil d’exécution à part : la page reste fluide même quand un pas prend 20 millisecondes. À chaque rafraîchissement de l’écran, la page demande une image ; le Worker avance de quelques pas (sans dépasser 35 millisecondes) et renvoie l’état de chaque oiseau dans un tableau de nombres à virgule. Ce tableau est *transféré*, pas copié : il passe d’un fil à l’autre sans recopie, et revient au Worker à l’image suivante. Deux tableaux circulent ainsi en permanence, sans jamais en allouer de nouveau.' },
        { p: 'Le dessin 2D range les oiseaux par couleur et remplit un seul chemin par couleur : quelques appels de dessin pour 5 000 triangles. En 3D, three.js dessine tous les oiseaux en un seul appel (un *InstancedMesh*) : un même petit cône, répété avec une matrice par oiseau. Pour orienter le cône selon la vitesse $\\mathbf d$, on construit directement trois axes perpendiculaires (un vecteur $\\mathbf e_1 \\perp \\mathbf d$, puis $\\mathbf e_1\\times\\mathbf d$) plutôt que de passer par des quaternions.' },
      ],
    },
    {
      id: 'mesures', titre: 'Les mesures', blocs: [
        { tex: tex`p = \Big\|\frac1N\sum_i \hat{\mathbf v}_i\Big\|, \qquad m = \Big\|\frac1N\sum_i \hat{\mathbf r}_{ic}\times\hat{\mathbf v}_i\Big\|`, etroit: tex`\begin{aligned}p &= \big\|\tfrac1N\textstyle\sum_i \hat{\mathbf v}_i\big\|\\ m &= \big\|\tfrac1N\textstyle\sum_i \hat{\mathbf r}_{ic}\times\hat{\mathbf v}_i\big\|\end{aligned}` },
        { p: 'La polarisation et la rotation sont celles de Couzin ; la rotation est calculée autour du centre du plus grand groupe. Les groupes sont trouvés par *union-recherche* : chaque paire de voisins à moins de $R$ réunit ses deux ensembles, et l’on compte les ensembles à la fin. L’écart des vitesses est l’écart-type des vitesses, rapporté à la vitesse moyenne. Les mesures sont prises quatre fois par seconde.' },
      ],
    },
    {
      id: 'hasard', titre: 'Le hasard, et les figures', blocs: [
        { p: 'Le hasard vient d’un générateur à graine (*mulberry32*) : même graine, mêmes tirages, même nuée. Le bouton *Recommencer* tire une nouvelle graine ; changer un réglage de départ recrée le monde avec la même graine, pour que la comparaison soit juste.' },
        { p: 'Les figures marquées « précalculé » viennent du même moteur, lancé en Node.js : la transition de Vicsek (trois tailles, 21 bruits, jusqu’à 6 tirages chacun), l’hystérésis, les fluctuations géantes, le diagramme de Couzin (100 cases, 3 tirages, 1 500 pas chacune), la mémoire collective, les meneurs, les conflits, Cucker et Smale, les prédateurs et le coût d’un pas. De même pour les images des fiches de l’onglet *Comprendre* (4 octets par oiseau : position, direction, couleur). Elles sont rangées dans des fichiers de données, pour que la page n’ait pas à les recalculer.' },
      ],
    },
  ],

  histoire: [
    {
      id: 'frise', titre: 'Une histoire du vol collectif', blocs: [
        {
          frise: [
            ['1971', 'William D. Hamilton', 'propose le *troupeau égoïste* : se grouper pour réduire son propre domaine de danger.'],
            ['1982', 'Ichiro Aoki', 'simule des bancs de poissons sur ordinateur avec des règles locales de répulsion, d’alignement et d’attraction.'],
            ['1987', 'Craig Reynolds', 'présente les *boids* à la conférence SIGGRAPH ; le court métrage *Breaking the Ice* les met en scène.'],
            ['1992', '', '*Batman Returns* : chauves-souris et pingouins animés avec des boids.'],
            ['1995', 'Tamás Vicsek et al.', 'proposent le modèle minimal et sa transition entre désordre et ordre.'],
            ['1995', 'John Toner et Yuhai Tu', 'montrent qu’une nuée peut avoir un ordre à longue portée en 2D, interdit à l’équilibre.'],
            ['1998', 'Craig Reynolds', 'reçoit un prix scientifique et technique de l’Académie des Oscars.'],
            ['2002', 'Iain Couzin et al.', 'décrivent essaim, tore et migration, et la mémoire collective.'],
            ['2003', 'Ali Jadbabaie, Jie Lin et A. Stephen Morse', 'démontrent le consensus sur un graphe qui change.'],
            ['2004', 'Guillaume Grégoire et Hugues Chaté', 'montrent que la transition de Vicsek est discontinue, avec des bandes.'],
            ['2005', 'Couzin, Krause, Franks et Levin', 'montrent qu’une petite minorité informée peut guider un grand groupe.'],
            ['2006', 'Jerome Buhl et al.', 'observent la transition ordre-désordre chez des criquets qui marchent.'],
            ['2007', 'Felipe Cucker et Steve Smale', 'démontrent quand un groupe finit par voler ensemble.'],
            ['2008', 'Michele Ballerini et al.', 'montrent que les étourneaux suivent 6 à 7 voisins, quelle que soit la distance.'],
            ['2010', 'Andrea Cavagna et al.', 'mesurent des corrélations sans échelle dans les nuées d’étourneaux.'],
            ['2013', 'Antoine Bricard et al.', 'créent une nuée de billes colloïdales qui roulent seules.'],
            ['2014', 'Alessandro Attanasi et al.', 'montrent que les virages traversent la nuée comme des ondes.'],
            ['2018', 'Gábor Vásárhelyi et al.', 'font voler 30 drones en nuée, dehors, sans contrôle central.'],
          ],
        },
      ],
    },
    {
      id: 'quatre-regards', titre: 'Quatre regards sur une nuée', blocs: [
        { p: '*L’animation.* Reynolds veut des images crédibles. Ses règles sont pragmatiques, réglées à l’œil, et il les enrichit sans cesse (éviter les obstacles, suivre un chemin, fuir). C’est l’ingénierie du comportement.' },
        { p: '*La physique statistique.* Vicsek, Toner, Tu, Chaté et d’autres cherchent ce qui est *universel* : ce qui ne dépend pas des détails, comme la nature d’une transition ou des exposants. Ils réduisent le modèle à l’os pour mieux le comprendre.' },
        { p: '*La biologie.* Aoki, Couzin, Krause, Cavagna, Giardina et d’autres veulent les vraies règles des vrais animaux, et les mesurent. Ils demandent aussi *pourquoi* ces règles ont été sélectionnées : se défendre, se nourrir, décider.' },
        { p: '*Les mathématiques.* Jadbabaie, Cucker, Smale, Ha, Tadmor et d’autres veulent des théorèmes : sous quelles conditions un groupe s’accorde-t-il à coup sûr ? Leurs résultats servent aujourd’hui à concevoir des essaims de robots qui doivent marcher à tous les coups.' },
      ],
    },
    {
      id: 'refs', titre: 'Références', blocs: [
        {
          refs: [
            ['C. W. Reynolds, « Flocks, herds and schools: A distributed behavioral model », *Computer Graphics* (SIGGRAPH ’87), 21(4), 1987.', 'https://www.red3d.com/cwr/boids/'],
            ['I. Aoki, « A simulation study on the schooling mechanism in fish », *Bulletin of the Japanese Society of Scientific Fisheries*, 48, 1982.'],
            ['W. D. Hamilton, « Geometry for the selfish herd », *Journal of Theoretical Biology*, 31, 1971.', 'https://doi.org/10.1016/0022-5193(71)90189-5'],
            ['T. Vicsek, A. Czirók, E. Ben-Jacob, I. Cohen, O. Shochet, « Novel type of phase transition in a system of self-driven particles », *Physical Review Letters*, 75, 1995.', 'https://arxiv.org/abs/cond-mat/0611743'],
            ['J. Toner, Y. Tu, « Long-range order in a two-dimensional dynamical XY model: how birds fly together », *Physical Review Letters*, 75, 1995.', 'https://arxiv.org/abs/adap-org/9506001'],
            ['N. D. Mermin, H. Wagner, « Absence of ferromagnetism or antiferromagnetism in one- or two-dimensional isotropic Heisenberg models », *Physical Review Letters*, 17, 1966.', 'https://doi.org/10.1103/PhysRevLett.17.1133'],
            ['G. Grégoire, H. Chaté, « Onset of collective and cohesive motion », *Physical Review Letters*, 92, 2004.', 'https://arxiv.org/abs/cond-mat/0401208'],
            ['H. Chaté, F. Ginelli, G. Grégoire, F. Raynaud, « Collective motion of self-propelled particles interacting without cohesion », *Physical Review E*, 77, 2008.', 'https://arxiv.org/abs/0712.2062'],
            ['A. P. Solon, H. Chaté, J. Tailleur, « From phase to microphase separation in flocking models: the essential role of nonequilibrium fluctuations », *Physical Review Letters*, 114, 2015.'],
            ['I. D. Couzin, J. Krause, R. James, G. D. Ruxton, N. R. Franks, « Collective memory and spatial sorting in animal groups », *Journal of Theoretical Biology*, 218, 2002.', 'https://doi.org/10.1006/jtbi.2002.3065'],
            ['I. D. Couzin, J. Krause, N. R. Franks, S. A. Levin, « Effective leadership and decision-making in animal groups on the move », *Nature*, 433, 2005.', 'https://doi.org/10.1038/nature03236'],
            ['A. Jadbabaie, J. Lin, A. S. Morse, « Coordination of groups of mobile autonomous agents using nearest neighbor rules », *IEEE Transactions on Automatic Control*, 48(6), 2003.', 'https://doi.org/10.1109/TAC.2003.812781'],
            ['F. Cucker, S. Smale, « Emergent behavior in flocks », *IEEE Transactions on Automatic Control*, 52(5), 2007.', 'https://doi.org/10.1109/TAC.2007.895842'],
            ['S.-Y. Ha, J.-G. Liu, « A simple proof of the Cucker-Smale flocking dynamics and mean-field limit », *Communications in Mathematical Sciences*, 7(2), 2009.'],
            ['M. Ballerini et al., « Interaction ruling animal collective behavior depends on topological rather than metric distance: Evidence from a field study », *PNAS*, 105, 2008.', 'https://arxiv.org/abs/0709.1916'],
            ['A. Cavagna et al., « Scale-free correlations in starling flocks », *PNAS*, 107, 2010.', 'https://arxiv.org/abs/0911.4393'],
            ['W. Bialek et al., « Statistical mechanics for natural flocks of birds », *PNAS*, 109, 2012.', 'https://doi.org/10.1073/pnas.1118633109'],
            ['A. Attanasi et al., « Information transfer and behavioural inertia in starling flocks », *Nature Physics*, 10, 2014.', 'https://doi.org/10.1038/nphys3035'],
            ['M. Procaccini et al., « Propagating waves in starling, *Sturnus vulgaris*, flocks under predation », *Animal Behaviour*, 82, 2011.'],
            ['C. C. Ioannou, V. Guttal, I. D. Couzin, « Predatory fish select for coordinated collective motion in virtual prey », *Science*, 337, 2012.'],
            ['J. Buhl et al., « From disorder to order in marching locusts », *Science*, 312, 2006.', 'https://doi.org/10.1126/science.1125142'],
            ['M. Nagy, Z. Ákos, D. Biro, T. Vicsek, « Hierarchical group dynamics in pigeon flocks », *Nature*, 464, 2010.', 'https://doi.org/10.1038/nature08891'],
            ['A. Bricard, J.-B. Caussin, N. Desreumaux, O. Dauchot, D. Bartolo, « Emergence of macroscopic directed motion in populations of motile colloids », *Nature*, 503, 2013.', 'https://doi.org/10.1038/nature12673'],
            ['M. C. Marchetti et al., « Hydrodynamics of soft active matter », *Reviews of Modern Physics*, 85, 2013.', 'https://doi.org/10.1103/RevModPhys.85.1143'],
            ['T. Vicsek, A. Zafeiris, « Collective motion », *Physics Reports*, 517, 2012 (une synthèse).', 'https://arxiv.org/abs/1010.5017'],
            ['G. Vásárhelyi et al., « Optimized flocking of autonomous drones in confined environments », *Science Robotics*, 3, 2018.', 'https://hal.elte.hu/drones/scirob2018.html'],
          ],
        },
      ],
    },
  ],

  /* ---------- Textes des figures ---------- */

  figures: {
    regles: {
      titre: 'Les trois règles, autour d’un oiseau',
      resume: 'Un oiseau blanc au centre, ses voisins autour, et les directions voulues par chaque règle.',
      regle: 'Règle montrée',
      regles: { separation: 'Séparation', alignement: 'Alignement', cohesion: 'Cohésion', tout: 'Les trois' },
      nouveau: 'Autres voisins',
      legendes: {
        separation: 'Séparation (rouge) : s’éloigner des voisins trop proches, dans le disque rouge. Les plus proches comptent le plus.',
        alignement: 'Alignement (bleu) : prendre la direction moyenne des voisins, dans le cercle pointillé.',
        cohesion: 'Cohésion (vert) : aller vers le centre des voisins (le petit cercle vert).',
        tout: 'Les trois envies s’additionnent, chacune avec son poids : la flèche blanche est le virage que prendra l’oiseau. La zone grisée derrière lui est son angle mort.',
      },
    },
    voisinage: {
      titre: 'Dans un rayon, ou les 7 plus proches',
      resumes: { metrique: 'Voisins dans un rayon fixe autour du point blanc.', topologique: 'Les 7 plus proches voisins du point blanc.' },
      metrique: (n) => `Dans un rayon de 1\u00a0: ${n} voisins`,
      topologique: (k, r) => `Les ${k} plus proches\u00a0: jusqu’à une distance de ${r}`,
      densite: 'Densité',
      note: 'Changez la densité : le nombre de voisins « dans un rayon » suit la densité ; le nombre de voisins « topologiques » reste 7, c’est leur distance qui change.',
    },
    vicsekvivant: {
      titre: 'Un petit modèle de Vicsek',
      resume: '400 particules qui prennent le cap moyen de leurs voisins, colorées selon leur direction.',
      eta: 'Bruit η',
      lancer: 'Lancer',
      pause: 'Pause',
      nouveau: 'Mélanger',
      etat: (phi) => `polarisation φ = ${phi}`,
      note: '400 particules, densité 4, vitesse 0,05. Une couleur par direction : quand tout est d’une couleur, φ est proche de 1. Montez le bruit au-delà de 4 environ : les couleurs se mélangent.',
    },
    transition: {
      titre: 'Polarisation selon le bruit, pour trois tailles',
      serie: (n) => `${n} particules`,
      axeX: 'bruit η',
      axeY: 'polarisation φ',
      repere: 'η_c ≈ 2,9 (taille infinie)',
      info: (x, v) => `η = ${x}\u00a0: ${v}`,
      resume: 'Trois courbes qui descendent de 1 vers 0 quand le bruit augmente ; la chute est plus nette pour les grands systèmes.',
      tableau: 'Voir les valeurs',
    },
    hysteresis: {
      titre: 'Bruit vectoriel : on monte, puis on redescend',
      montee: 'en montant le bruit',
      descente: 'en le redescendant',
      axeX: 'bruit η (radians)',
      axeY: 'polarisation φ',
      info: (x, v) => `η = ${x}\u00a0: ${v}`,
      resume: 'La polarisation chute d’un coup quand le bruit dépasse un seuil, et remonte d’un coup quand il repasse en dessous.',
    },
    fluctuations: {
      titre: 'Fluctuations du nombre de particules dans une boîte',
      ordonne: (p) => `phase ordonnée (pente ${p})`,
      desordonne: (p) => `phase désordonnée (pente ${p})`,
      axeX: 'nombre moyen n dans la boîte',
      axeY: 'écart-type σ',
      info: (x, v) => `n ≈ ${x}\u00a0: ${v}`,
      resume: (a, b) => `En échelle logarithmique, deux droites\u00a0: pente ${a} pour la phase ordonnée, ${b} pour la phase désordonnée.`,
    },
    couzin: {
      titre: 'Les états du modèle de Couzin (3D, 100 individus)',
      axeX: 'Δr_o (orientation)',
      axeY: 'Δr_a',
      etats: { essaim: 'essaim', tore: 'tore', dynamique: 'parallèle mobile', parallele: 'très parallèle', fragmente: 'fragmenté' },
      case: (o, a, etat, p, m) => `Δr_o = ${o}, Δr_a = ${a}\u00a0: ${etat} (p = ${p}, m = ${m})`,
      resume: 'Une grille de cases colorées selon l’état du groupe ; le tore occupe une bande étroite à gauche, en haut.',
      note: 'Survolez une case pour voir la polarisation p et la rotation m. États : rotation > 0,5 → tore ; sinon p < 0,5 → essaim ; p ≥ 0,9 → très parallèle ; entre les deux → parallèle mobile ; groupe cassé dans au moins deux tirages sur trois → fragmenté.',
    },
    memoire: {
      titre: 'La mémoire collective (r_a = 14)',
      pMontee: 'polarisation, en montant',
      pDescente: 'polarisation, en descendant',
      mMontee: 'rotation, en montant',
      mDescente: 'rotation, en descendant',
      axeX: 'rayon d’orientation r_o',
      axeY: 'p ou m',
      info: (x, v) => `r_o = ${x}\u00a0: ${v}`,
      resume: 'En montant, la rotation est forte entre 1,25 et 3,5 (un tore) ; en descendant, elle reste faible et la polarisation reste forte jusqu’à 1,5.',
    },
    meneurs: {
      titre: 'Écart entre la direction du groupe et la direction des informés',
      serie: (n) => `${n} individus`,
      axeX: 'part d’informés',
      axeY: 'écart (degrés)',
      info: (x, v) => `${x} d’informés\u00a0: ${v}`,
      resume: 'L’écart tombe de 90° ou plus (le hasard) vers 0 quand la part d’informés augmente.',
      tableau: 'Voir les valeurs (nombre d’informés entre parenthèses)',
    },
    conflit: {
      titre: 'Deux minorités, deux directions : où va le groupe ?',
      uni: 'groupe resté entier',
      scinde: 'une partie est partie',
      pref1: 'préférence 1',
      pref2: 'préférence 2',
      axeX: 'écart entre les deux préférences',
      axeY: 'direction du groupe principal',
      info: (x, v) => `écart ${x}°\u00a0: ${v}`,
      resume: 'Pour de petits écarts, les points sont au milieu (compromis) ; pour de grands écarts, ils rejoignent l’une ou l’autre préférence (choix), et une partie du groupe s’en va.',
    },
    consensus: {
      titre: 'Douze caps qui s’accordent',
      mode: 'Configuration',
      modes: { un: 'Un groupe qui se mélange', deux: 'Deux groupes séparés' },
      nouveau: 'Autre tirage',
      axeX: 'pas',
      resume: (mode) => (mode === 'un' ? 'Douze courbes de cap qui convergent vers une même valeur.' : 'Deux paquets de six courbes qui convergent vers deux valeurs différentes.'),
      etat: (mode, v) => (mode === 'un' ? `Caps finaux\u00a0: ${v.join('°, ')}° — un seul cap commun.` : `Caps finaux\u00a0: ${v.join('°, ')}° — un cap par groupe.`),
    },
    cucker: {
      titre: 'Cucker et Smale : l’écart des vitesses au fil du temps',
      serie: (b) => `β = ${b}`,
      axeX: 'temps',
      axeY: 'écart des vitesses',
      info: (x, v) => `t = ${x}\u00a0: ${v}`,
      resume: 'En échelle logarithmique, l’écart des vitesses plonge pour β ≤ 0,5, baisse lentement pour 0,75 et reste élevé pour 1,5.',
      note: '60 individus, même tirage de départ pour les quatre courbes. Les courbes s’arrêtent vers 10⁻⁵ : plus bas, on touche la précision du calcul.',
    },
    predateur: {
      titre: 'Captures d’un prédateur selon la taille de la nuée',
      sans: 'sans confusion',
      avec: 'avec confusion',
      axeX: 'oiseaux dans le monde',
      axeY: 'captures pour 10 000 pas',
      info: (x, v) => `${x} oiseaux\u00a0: ${v}`,
      resume: 'Sans confusion, le nombre de captures ne dépend presque pas de la taille de la nuée ; avec confusion, il baisse quand la nuée grandit.',
    },
    cout: {
      titre: 'Coût d’un pas selon le nombre d’oiseaux (mesuré)',
      grille: 'pas complet, avec la grille',
      naif: 'recherche des voisins, toutes les paires',
      axeX: 'oiseaux',
      axeY: 'millisecondes',
      info: (x, v) => `${x} oiseaux\u00a0: ${v}`,
      resume: 'En échelle logarithmique, la grille suit une pente de 1, la méthode naïve une pente de 2.',
    },
    grille: {
      titre: 'La grille : chercher seulement dans les cases voisines',
      resume: 'Des points sur une grille ; seuls ceux des 9 cases autour du point blanc sont examinés.',
      nouveau: 'Autres points',
      etat: (n, c, v) => `${n} oiseaux\u202f; ${c} examinés dans les 9 cases\u202f; ${v} voisins à moins de R.`,
    },
  },

  /* ---------- Fiches des scénarios ---------- */

  fiche: {
    regles: 'Les règles',
    regarder: 'À regarder',
    pourquoi: 'Ce qui se passe, et pourquoi',
    realite: 'Dans la réalité',
    ouvrir: 'Ouvrir ce scénario dans l’explorateur',
    ouvrirNom: (nom) => `Ouvrir «\u00a0${nom}\u00a0»`,
    depart: 'Départ',
    apres: (n, modele) => (modele === 'couzin' ? `Après ${(n / 10).toLocaleString('fr-FR')} s` : `Après ${n.toLocaleString('fr-FR')} pas`),
    calcul: 'Chargement…',
    note: (vue) => `Calculé à l’avance avec le moteur de l’explorateur, sur un groupe plus petit (vu de dessus en 3D). Couleurs\u00a0: ${vue.toLowerCase()}.`,
    mesures: {
      polarisation: (v) => `polarisation ${v}`,
      rotation: (v) => `rotation ${v}`,
      groupes: (v) => `${v} groupe${v === '1' ? '' : 's'}`,
      captures: (v) => `${v} captures`,
      dispersion: (v) => `écart des vitesses ${v}`,
      cap: (v) => `direction du groupe\u00a0: ${v}°`,
    },
  },

  fiches: {
    reynolds: {
      question: 'Trois règles locales suffisent-elles à faire une nuée ?',
      regles: [
        '1 500 oiseaux (700 sur les images), placés au hasard, chacun dans une direction au hasard.',
        'Chacun applique les trois règles à ses voisins dans un rayon de 1 : s’écarter (sous 0,6), s’aligner, se rapprocher.',
        'Le monde se referme sur lui-même : il n’y a pas de bord.',
      ],
      images: {},
      regarder: [
        'Les premières secondes : de petits groupes de quelques oiseaux se forment partout, chacun dans sa direction.',
        'Puis ces groupes se rencontrent et fusionnent, et la *polarisation* monte vers 0,9 : presque tout le monde vole dans le même sens.',
        'Vue *Cap* : chaque groupe prend une couleur, puis les couleurs se rejoignent.',
      ],
      pourquoi: [
        'L’alignement fait l’essentiel du travail : deux oiseaux qui se voient finissent par voler parallèlement. Comme chacun a plusieurs voisins, qui en ont d’autres, l’accord se propage de proche en proche. La cohésion empêche le groupe de se disperser, la séparation l’empêche de s’écraser en un point.',
        'Quand deux groupes se croisent, chacun aligne un peu l’autre : ils fusionnent dans une direction intermédiaire. Avec le temps, il ne reste que quelques grandes nuées.',
      ],
      realite: 'Reynolds a écrit ces règles pour le cinéma, pas pour la biologie. Mais elles ont donné un vocabulaire aux biologistes : on cherche depuis, dans les vrais bancs et les vraies nuées, ce qui joue le rôle de la séparation, de l’alignement et de la cohésion.',
    },
    'sans-alignement': {
      question: 'Et si l’on supprime l’alignement ?',
      regles: [
        'Les mêmes oiseaux, la même séparation, une cohésion un peu plus forte (1,5).',
        'Le poids de l’alignement est mis à zéro : chacun ignore la direction de ses voisins.',
      ],
      images: { avec: 'Avec alignement, après 1 500 pas', sans: 'Sans alignement, après 1 500 pas' },
      regarder: [
        'Vue *Cap* : sans alignement, chaque grappe reste multicolore, ses membres volent dans tous les sens.',
        'La *polarisation* reste autour de 0,05, contre 0,9 avec alignement.',
        'Les grappes grouillent sur place et ne vont nulle part.',
      ],
      pourquoi: [
        'La cohésion rassemble, la séparation espace : on obtient des amas, comme un essaim de moucherons. Mais pour que le groupe *aille quelque part*, il faut que les directions s’accordent, et aucune de ces deux règles ne parle de direction.',
        'C’est le cœur de presque tous les modèles de vol collectif : l’alignement, ou quelque chose qui y ressemble, transforme un amas en nuée.',
      ],
      realite: 'Les essaims de moucherons ressemblent à ce scénario : un amas compact, sans direction commune. Leurs mouvements sont pourtant fortement corrélés, comme s’ils se tenaient près d’un point critique (Attanasi et al., 2014, sur des moucherons sauvages).',
    },
    etourneaux: {
      question: 'Pourquoi les étourneaux suivent-ils un nombre fixe de voisins plutôt que tous ceux qui sont proches ?',
      regles: [
        '1 200 oiseaux sur les images (4 000 dans l’explorateur), et un faucon qui les chasse.',
        'Image de gauche : chacun suit ses voisins dans un rayon de 1 (règle *métrique*).',
        'Image de droite : chacun suit ses 7 plus proches voisins, où qu’ils soient (règle *topologique*).',
      ],
      images: { metrique: 'Dans un rayon, après 1 200 pas', topologique: '7 plus proches, après 1 200 pas' },
      regarder: [
        'Vue *Peur* : la panique, en rouge, part du faucon et se propage dans la nuée.',
        'Avec la règle métrique, un oiseau qui s’écarte un peu trop perd tout contact avec le groupe ; avec la règle topologique, il continue à suivre ses 7 voisins, même éloignés, et revient.',
        'La courbe *Groupes* est en général plus basse avec la règle topologique.',
      ],
      pourquoi: [
        'Avec un rayon fixe, le nombre de voisins dépend de la densité : dans une nuée qui s’étire, il tombe à zéro et la nuée se casse. Avec un nombre fixe de voisins, chaque oiseau reste relié au groupe, quelle que soit la densité. Une nuée qui se dilate devant un faucon, puis se resserre, garde ainsi sa cohésion.',
      ],
      realite: 'En photographiant des nuées d’étourneaux en relief au-dessus de Rome, Michele Ballerini et ses collègues (2008) ont montré que chaque oiseau interagit avec 6 à 7 voisins, quelle que soit la densité de la nuée. Dans leurs simulations, les nuées « métriques » attaquées se cassaient souvent en plusieurs morceaux ; les nuées « topologiques » restaient le plus souvent d’un seul tenant.',
    },
    faucons: {
      question: 'Que fait une nuée devant des prédateurs ?',
      regles: [
        '900 oiseaux sur les images (2 000 dans l’explorateur), et trois faucons, 1,6 fois plus rapides qu’eux.',
        'Un faucon fonce sur l’oiseau le plus proche. Les oiseaux qui le voient à moins de 3 fuient, plus vite que d’habitude.',
        'Après une capture, l’oiseau réapparaît ailleurs et le faucon se repose.',
      ],
      images: {},
      regarder: [
        'Vue *Peur* : un vide s’ouvre devant chaque faucon, puis la nuée se referme derrière lui.',
        'La nuée se coupe parfois en deux autour d’un faucon, et les deux moitiés se rejoignent plus loin.',
        'La courbe *Captures* : quelques captures, surtout quand un oiseau isolé croise la route d’un faucon.',
      ],
      pourquoi: [
        'Chaque oiseau ne réagit qu’au faucon qu’il voit, mais ses voisins réagissent à son virage, par l’alignement : la fuite se propage bien au-delà de la vue du faucon. C’est une onde de panique.',
        'Un faucon vise un oiseau précis. Au milieu d’une foule de silhouettes semblables, il peut perdre sa cible pour une autre et hésiter (réglage *Confusion*) : c’est l’un des avantages du groupe.',
      ],
      realite: 'Les nuées réelles montrent ces figures : des ouvertures soudaines, des « fontaines » où la nuée se fend et se referme derrière le prédateur, des vagues sombres qui parcourent des milliers d’oiseaux (Procaccini et al., 2011).',
    },
    foret: {
      question: 'Une nuée sait-elle contourner des obstacles ?',
      regles: [
        '800 oiseaux sur les images, au milieu d’une forêt de colonnes.',
        'Un oiseau qui se dirige vers une colonne proche tourne pour l’éviter, d’autant plus fort qu’elle est près.',
        'Personne ne voit la forêt entière.',
      ],
      images: {},
      regarder: [
        'La nuée se coupe en filets qui passent entre les colonnes, puis se ressoudent derrière.',
        'Avec l’outil *Obstacle*, dessinez un mur en travers de la nuée.',
      ],
      pourquoi: [
        'Seuls les oiseaux proches d’une colonne la voient ; les autres suivent leurs voisins qui tournent. La nuée coule autour des obstacles comme un fluide, et la cohésion réunit les filets derrière eux.',
      ],
      realite: 'C’est l’ajout que Reynolds proposait dès 1987 : des règles d’évitement qui s’ajoutent aux trois autres. Les essaims de drones utilisent le même principe pour franchir des passages étroits.',
    },
    vent: {
      question: 'Le vent défait-il la nuée ?',
      regles: [
        '700 oiseaux, un vent de 60 % de leur vitesse, qui forcit et tourne par rafales.',
        'Le vent déplace tout le monde de la même façon ; il ne change pas la direction vers laquelle chaque oiseau pointe.',
      ],
      images: { calme: 'Sans vent, après 1 500 pas', vent: 'Avec vent et rafales, après 1 500 pas' },
      regarder: [
        'La nuée dérive, mais reste d’un seul tenant.',
        'Le vent ne change ni la polarisation ni le nombre de groupes.',
      ],
      pourquoi: [
        'Toutes les règles parlent de positions et de vitesses *relatives* : l’écart avec les voisins. Un vent uniforme déplace tout le monde de la même façon, il ne change aucun écart. Les règles ne le voient pas, et la nuée non plus : dans le référentiel de l’air, il ne se passe rien de nouveau.',
        'Cela cesse dès que le vent n’est plus le même partout, ou dès qu’il y a des obstacles, fixes par rapport au sol : la nuée est alors poussée contre eux.',
      ],
      realite: 'Les vrais oiseaux corrigent leur cap pour compenser le vent, ce que nos boids ne font pas. Mais le principe tient : une perturbation qui touche tout le monde de la même façon ne défait pas un groupe. Ce sont les différences qui le défont.',
    },
    especes: {
      question: 'Trois espèces qui s’évitent finissent-elles séparées ?',
      regles: [
        '900 oiseaux, trois espèces de même effectif. L’orange vole à la vitesse normale, le bleu 20 % plus vite, le vert 15 % plus lentement.',
        'Image de gauche : les espèces se mêlent, tout le monde s’aligne sur tout le monde.',
        'Image de droite : chacune ne suit que les siens et fuit les autres espèces qu’elle voit.',
      ],
      images: { melent: 'Elles se mêlent', evitent: 'Elles s’évitent' },
      regarder: [
        'Quand elles se mêlent, les nuées sont multicolores ; quand elles s’évitent, chaque nuée est d’une seule couleur, et les nuées s’écartent en se croisant.',
      ],
      pourquoi: [
        'C’est un cousin du modèle de Schelling : une règle locale, « s’éloigner de ce qui ne me ressemble pas », produit une séparation complète. Même sans fuite, des espèces qui ne volent pas à la même vitesse se séparent peu à peu : les plus rapides prennent la tête et finissent par former leurs propres nuées.',
      ],
      realite: 'Des espèces différentes volent parfois ensemble, comme les volées mixtes de petits passereaux en hiver, et parfois s’évitent. Dans les bancs de poissons, les individus de tailles différentes, qui ne nagent pas à la même vitesse, tendent à se trier.',
    },
    vicsek: {
      question: 'À partir de quel niveau de bruit l’ordre disparaît-il ?',
      regles: [
        '600 particules sur les images (2 000 dans l’explorateur), qui avancent toutes à la même vitesse, à la densité 4.',
        'À chaque pas, chacune prend la direction moyenne de ses voisins à moins de 1 (elle comprise), puis s’en écarte d’un angle tiré au hasard entre −η/2 et +η/2.',
        'Rien d’autre : ni séparation, ni cohésion.',
      ],
      images: { faible: 'Bruit faible (η = 1)', moyen: 'Bruit moyen (η = 3)', fort: 'Bruit fort (η = 5)' },
      regarder: [
        'Vue *Cap* : avec peu de bruit, une seule couleur envahit tout ; avec beaucoup de bruit, les couleurs restent mêlées.',
        'Entre les deux, des îlots alignés se forment, dérivent et se défont.',
        'Dans l’explorateur, faites varier η et regardez la polarisation.',
      ],
      pourquoi: [
        'Deux forces s’opposent : l’alignement, qui propage l’accord, et le bruit, qui le détruit. Quand le bruit est faible, l’accord gagne et s’étend à tout le système ; quand il est fort, le bruit l’emporte. Entre les deux, il y a un seuil, une *transition de phase*, comme l’aimantation d’un aimant qui disparaît quand on le chauffe.',
      ],
      realite: 'Vicsek et ses collègues ont proposé ce modèle en 1995 pour montrer qu’une telle transition existe chez des particules qui avancent toutes seules. Il est devenu le modèle de base de la *matière active*, la physique des systèmes dont les éléments consomment de l’énergie pour se déplacer.',
    },
    bandes: {
      question: 'Comment l’ordre apparaît-il dans un grand système ?',
      regles: [
        '2 048 particules sur les images (4 608 dans l’explorateur), plus rapides (v₀ = 0,5), à la densité 2.',
        'Le bruit est « vectoriel » : il s’ajoute à chaque interaction plutôt qu’au cap final (Grégoire et Chaté, 2004).',
        'Il est réglé juste en dessous du seuil.',
      ],
      images: {},
      regarder: [
        'Une bande dense et alignée se forme et traverse le monde, perpendiculaire à sa direction de vol.',
        'Autour d’elle, un gaz clairsemé de particules qui vont en tous sens.',
        'Montez un peu le bruit : la bande disparaît d’un coup.',
      ],
      pourquoi: [
        'L’ordre et la densité s’entretiennent : là où les particules sont nombreuses, elles s’alignent mieux ; là où elles sont alignées, elles avancent ensemble et restent serrées. Le système se partage alors en une région dense et ordonnée et une région clairsemée et désordonnée, comme un liquide et sa vapeur.',
        'C’est pourquoi la transition de Vicsek est en réalité *discontinue* : l’ordre apparaît d’un bloc, en bandes, et non progressivement. Il a fallu de grands systèmes, et près de dix ans, pour s’en apercevoir.',
      ],
      realite: 'Des bandes de ce genre ont été vues en laboratoire, dans des populations de billes qui roulent toutes seules (Bricard et al., 2013), ou dans des filaments de protéines poussés par des moteurs moléculaires.',
    },
    couzin: {
      question: 'Comment un même banc de poissons peut-il former un essaim, un tore ou une colonne en marche ?',
      regles: [
        '100 poissons ; la vue suit le groupe. Autour de chacun, trois zones emboîtées : il fuit ceux qui sont trop près (à moins de 1), s’aligne sur ceux de la zone suivante (de largeur Δr_o), se rapproche de ceux de la dernière (de largeur Δr_a = 12).',
        'Il tourne d’au plus 40° par seconde, et ne voit pas derrière lui.',
        'On ne change qu’un réglage : la largeur de la zone d’orientation.',
      ],
      images: { essaim: 'Δr_o = 0 : essaim', tore: 'Δr_o = 1 : tore', migration: 'Δr_o = 8 : migration' },
      regarder: [
        'Sans zone d’orientation : un essaim compact, de polarisation faible (environ 0,15).',
        'Avec une zone d’orientation étroite : un tore, un anneau qui tourne autour d’un vide (rotation d’environ 0,9).',
        'Avec une zone d’orientation large : tout le monde file dans la même direction (polarisation proche de 1).',
      ],
      pourquoi: [
        'Sans alignement, l’attraction rassemble et la répulsion espace : un essaim. Avec un peu d’alignement, les voisins proches s’accordent, mais l’attraction tire chacun vers le centre ; à vitesse constante, on ne peut pas aller vers le centre sans le dépasser, et l’accord local se met à tourner autour. Avec beaucoup d’alignement, l’accord s’étend à tout le groupe, qui part en ligne droite.',
      ],
      realite: 'Les trois formes existent dans la nature : essaims de moucherons, bancs qui tournent en tore (on en voit chez les barracudas et les carangues), migrations en colonne. Couzin et ses collègues (2002) ont montré qu’un même groupe peut passer de l’une à l’autre en changeant un peu ses règles, et que sa forme dépend aussi de son passé (voir *Théorie*).',
      ouvrir: ['essaim', 'tore', 'migration'],
    },
    meneurs: {
      question: 'Quelques individus informés suffisent-ils à guider tout un groupe ?',
      regles: [
        '100 poissons, en 3D (le groupe y forme une colonne bien alignée), avec le modèle de Couzin.',
        '10 % d’entre eux (en orange) connaissent une direction, vers la droite : leur cap voulu est tiré vers elle, avec un poids ω = 0,5.',
        'Personne ne sait qui est informé, et il n’y a aucun signal.',
      ],
      images: {},
      regarder: [
        'Le groupe se forme, puis part vers la droite. Les informés se retrouvent souvent devant.',
        'Dans l’explorateur, baissez la part d’informés : en dessous de quelques pour cent, le groupe part dans n’importe quelle direction.',
      ],
      pourquoi: [
        'Les non-informés suivent leurs voisins ; les informés suivent leurs voisins *et* leur direction. Leur petit biais, répété à chaque pas, se propage par l’alignement à tout le groupe.',
      ],
      realite: 'Couzin, Krause, Franks et Levin (2005) proposent ce mécanisme pour les essaims d’abeilles qui déménagent : une petite minorité d’éclaireuses connaît l’emplacement du nouveau nid, et l’essaim entier les suit, sans les reconnaître.',
    },
    conflit: {
      question: 'Si deux minorités veulent aller dans deux directions différentes, le groupe fait-il un compromis ?',
      regles: [
        '100 poissons en 3D ; 10 informés veulent aller dans une direction, 10 autres dans une autre, et chacun y tient fortement (ω = 1).',
        'Les deux directions sont écartées d’un angle donné, de part et d’autre de la droite.',
      ],
      images: { petit: 'Écart de 40°, après 150 s', grand: 'Écart de 140°, après 150 s' },
      regarder: [
        'Petit écart : le groupe part entre les deux, dans la direction moyenne.',
        'Grand écart : le gros du groupe choisit l’une des deux directions (au hasard d’un essai à l’autre). Les 10 informés de l’autre camp s’en vont seuls et sortent du cadre : la vue suit le groupe principal.',
      ],
      pourquoi: [
        'Quand les deux directions sont proches, la moyenne satisfait à peu près tout le monde : chaque minorité tire un peu, le groupe suit la somme. Quand elles sont éloignées, la moyenne ne va à personne : dès qu’un camp prend un léger avantage, le groupe bascule vers lui. Une décision collective émerge, sans vote et sans chef.',
        'Les perdants tiennent trop à leur direction (ω = 1) pour suivre : ils partent. Baissez leur conviction dans l’explorateur (ω = 0,5), puis relancez : plus personne ne part, mais le groupe fait alors un compromis, même à 140°.',
      ],
      realite: 'C’est le résultat de Couzin et al. (2005) : en dessous d’un certain écart, compromis ; au-dessus, choix. Si un camp est un peu plus nombreux, le groupe le suit, même quand l’écart est faible.',
    },
    cucker: {
      question: 'Peut-on démontrer qu’un groupe finira par voler ensemble ?',
      regles: [
        '150 individus sur les images, sans bruit ni obstacle.',
        'Chacun ajuste sa vitesse vers celle de *tous* les autres, avec un poids qui diminue avec la distance : 1 / (1 + r²)^β.',
        'Image de gauche : β = 0,3 ; image de droite : β = 1,5.',
      ],
      images: { faible: 'β = 0,3 : l’influence décroît lentement', fort: 'β = 1,5 : elle décroît vite' },
      regarder: [
        'Avec β = 0,3, l’écart des vitesses tombe vers zéro : tout le monde finit par voler à la même vitesse, en groupe.',
        'Avec β = 1,5, de petits groupes partent chacun de leur côté et ne se revoient plus.',
      ],
      pourquoi: [
        'Si l’influence d’un voisin lointain diminue lentement (β ≤ 1/2), elle ne disparaît jamais tout à fait : même un individu qui s’éloigne reste assez lié pour revenir, et l’accord finit toujours par l’emporter. Si elle diminue vite, deux individus qui s’éloignent ne se voient bientôt plus du tout, et peuvent ne jamais s’accorder. Cucker et Smale l’ont démontré : c’est un théorème, pas une observation.',
      ],
      realite: 'Le modèle n’est pas fait pour imiter des oiseaux, mais pour être démontré. Il a lancé toute une branche des mathématiques appliquées, et ses variantes servent à prouver que des essaims de drones ou de robots se coordonneront.',
    },
  },
}
