// ============================================================
//  ARTICLES EN FRANÇAIS : Comprendre, Théorie, Applications, Calcul,
//  Histoire et références, plus les textes des figures et des fiches
//  de scénarios.
//  Blocs : { p }, { liste }, { tex, etroit? }, { figure }, { expert },
//  { preuve }, { frise }, { refs }, { fiche }.
//  Dans le texte : *italique* et $formule$ (LaTeX).
// ============================================================

const tex = String.raw

export const LECTURE_FR = {
  comprendre: [
    {
      id: 'idee', titre: 'Des sentiers que personne n’a dessinés', blocs: [
        { p: 'Sur presque toutes les pelouses de parc ou de campus, une bande de terre nue coupe en diagonale ce que l’architecte avait prévu à angle droit. Les urbanistes l’appellent une *ligne de désir* : le chemin que les gens veulent vraiment prendre, tracé par leurs pieds.' },
        { p: 'Personne ne l’a dessinée. Chaque passant veut seulement aller où il va, sans trop se fatiguer. Mais ses pas usent l’herbe, et l’herbe usée attire le passant suivant : on marche plus volontiers là où d’autres sont déjà passés. Au bout de quelques jours, un sentier existe. C’est une boucle qui se renforce d’elle-même, freinée par l’herbe qui repousse.' },
        { p: 'En 1997, le physicien Dirk Helbing et ses collègues ont mis cette boucle en équations, avec des *marcheurs actifs* : des marcheurs qui changent le sol, et que le sol change en retour. Leur modèle reproduit les sentiers des campus réels, et montre que ces réseaux ne sont ni les plus courts ni les plus directs : ce sont des compromis.' },
        { p: 'La même boucle existe chez les fourmis, qui marquent le sol d’une substance odorante, une *phéromone*, et suivent celle des autres. L’explorateur réunit trois modèles : les marcheurs actifs de Helbing, des marcheurs qui calculent le chemin le moins fatigant, et des fourmis.' },
      ],
    },
    {
      id: 'regle', titre: 'Les règles du jeu', blocs: [
        { p: 'Le terrain est découpé en cases de 50 cm : de l’herbe, des allées pavées, des bâtiments, des clôtures, des arbres. Des marcheurs entrent par une porte et vont vers une autre, tirée au hasard selon la fréquentation de chacune. Puis, à chaque pas :' },
        {
          liste: [
            'le marcheur se tourne vers sa destination : tout droit s’il la voit, sinon par le plus court chemin autour des obstacles ;',
            'il regarde autour de lui, jusqu’à une distance σ (3 m par défaut), et les sentiers qu’il voit l’attirent, d’autant plus que l’*attrait* A est grand. Sa direction est un compromis entre son but et le confort d’un sentier ;',
            'il ne revient jamais en arrière pour rejoindre un sentier : l’attrait peut le dévier sur le côté, pas le faire reculer ;',
            'chacun de ses pas use un peu l’herbe sous lui (l’*usure* I) ; une case très piétinée devient de la terre nue ;',
            'partout, l’herbe repousse : sans passage, une trace s’efface en quelques jours (la *repousse* T).',
          ],
        },
        { p: 'Les allées pavées sont confortables et attirent aussi les marcheurs, mais elles ne s’usent pas. Les bâtiments, les clôtures et les arbres bloquent le passage. Une journée de simulation concentre tous les passages du jour en mille pas de calcul.' },
      ],
    },
    {
      id: 'lire', titre: 'Lire l’explorateur', blocs: [
        { p: 'Vue de dessus, l’herbe neuve est verte, la terre nue est brune ; les allées sont grises, les bâtiments sombres, les clôtures claires. Les carrés jaunes sont les portes, avec leur nom. Les petits points sont les marcheurs. Le bouton *Marcheurs* les colore par type : pressés en orange, ordinaires en blanc, flâneurs en bleu.' },
        { p: 'Chez les fourmis, le nid est un carré bleu, la nourriture un carré orange. Le sol montre les deux phéromones : en bleu la piste qui mène au nid, en orange celle qui mène à la nourriture. Les fourmis chargées sont jaunes.' },
        { p: 'Les courbes suivent quatre mesures. *Sentiers* : la surface d’herbe usée jusqu’à la terre. *Détour* : de combien les derniers arrivés ont marché plus que le plus court chemin. *Confort* : la part de leur trajet faite sur un sentier ou une allée. *En route* : les marcheurs sur le terrain. Chez les fourmis : les charges rapportées au nid, la part de fourmis chargées et, sur le double pont, la part des passages par la branche A.' },
        { p: '*3D* montre le même terrain en relief : l’herbe se couche là où l’on passe. Les outils (en 2D) permettent de poser des portes, de tracer des allées, des bâtiments ou des clôtures, et *Paver les sentiers* fait comme l’architecte qui attend de voir où passent les gens avant de construire les allées.' },
        { p: 'Voici les scénarios, un par un : la question posée, les règles, ce qu’il faut regarder, et ce qui se passe. Les images ont été calculées à l’avance avec le moteur de l’explorateur.' },
      ],
    },
    { id: 'sc-square', titre: '1. Le square', blocs: [{ fiche: 'square' }] },
    { id: 'sc-campus', titre: '2. Le campus', blocs: [{ fiche: 'campus' }] },
    { id: 'sc-trois', titre: '3. Trois portes', blocs: [{ fiche: 'trois' }] },
    { id: 'sc-quatre', titre: '4. Quatre portes', blocs: [{ fiche: 'quatre' }] },
    { id: 'sc-anneau', titre: '5. Dix points en cercle', blocs: [{ fiche: 'anneau' }] },
    { id: 'sc-repousse', titre: '6. L’herbe repousse', blocs: [{ fiche: 'repousse' }] },
    { id: 'sc-types', titre: '7. Pressés et flâneurs', blocs: [{ fiche: 'types' }] },
    { id: 'sc-pointe', titre: '8. Heures de pointe', blocs: [{ fiche: 'pointe' }] },
    { id: 'sc-aeroport', titre: '9. Le hall de l’aéroport', blocs: [{ fiche: 'aeroport' }] },
    { id: 'sc-effort', titre: '10. Moindre effort', blocs: [{ fiche: 'effort' }] },
    { id: 'sc-pont', titre: '11. Le double pont', blocs: [{ fiche: 'pont' }] },
    { id: 'sc-pontInegal', titre: '12. Le pont inégal', blocs: [{ fiche: 'pontInegal' }] },
    { id: 'sc-fourragement', titre: '13. Le fourragement', blocs: [{ fiche: 'fourragement' }] },
    {
      id: 'retenir', titre: 'Ce qu’il faut retenir', blocs: [
        { p: 'Un sentier naît d’une boucle : on marche là où d’autres ont marché, et en marchant on rend le passage plus attirant. L’herbe qui repousse fait le tri : seuls les sentiers assez utilisés survivent.' },
        { p: 'Le réseau qui en sort n’est ni celui des chemins directs (trop de surface piétinée), ni le plus court réseau possible (trop de détours) : c’est un compromis, réglé par la force de l’attrait face à la repousse. Chez les fourmis, la même boucle choisit une branche d’un pont, et le plus souvent la plus courte. L’onglet *Théorie* explique pourquoi.' },
      ],
    },
  ],

  theorie: [
    {
      id: 'helbing', titre: 'Le modèle des marcheurs actifs', blocs: [
        { p: 'Helbing, Keltsch et Molnár (1997) décrivent le sol par un champ $G(\\mathbf r, t)$ : la « structure du sol », qui mesure à quel point l’herbe est piétinée en chaque point. Elle revient vers son état naturel $G_0$ avec un temps caractéristique $T$ (la repousse), et chaque marcheur $\\alpha$ la marque là où il passe, d’autant moins qu’elle est déjà près de sa valeur maximale $G_{\\max}$ :' },
        { tex: tex`\frac{dG(\mathbf r,t)}{dt} = \frac{1}{T(\mathbf r)}\big[G_0(\mathbf r) - G(\mathbf r,t)\big] + I(\mathbf r)\Big[1 - \frac{G(\mathbf r,t)}{G_{\max}(\mathbf r)}\Big]\sum_\alpha \delta\big(\mathbf r - \mathbf r_\alpha(t)\big)`, etroit: tex`\begin{aligned}\frac{dG}{dt} =\ & \frac{1}{T}\big[G_0 - G\big]\\ & + I\Big[1 - \frac{G}{G_{\max}}\Big]\sum_\alpha \delta(\mathbf r - \mathbf r_\alpha)\end{aligned}` },
        { p: 'Un marcheur ne voit pas le sol case par case : il voit les sentiers autour de lui, d’autant moins nettement qu’ils sont loin. Le *potentiel des sentiers* est le sol vu à la distance $\\sigma$ :' },
        { tex: tex`V_{\text{tr}}(\mathbf r_\alpha, t) = \int d^2 r\ e^{-\|\mathbf r - \mathbf r_\alpha\|/\sigma}\ G(\mathbf r, t)` },
        { p: 'Sa direction de marche combine la direction de son but $\\mathbf d_\\alpha$ et la pente de ce potentiel, qui le tire vers les sentiers proches :' },
        { tex: tex`\mathbf e_\alpha = \frac{\hat{\mathbf u}_\alpha + \nabla V_{\text{tr}}(\mathbf r_\alpha, t)}{\big\|\hat{\mathbf u}_\alpha + \nabla V_{\text{tr}}(\mathbf r_\alpha, t)\big\|}, \qquad \hat{\mathbf u}_\alpha = \frac{\mathbf d_\alpha - \mathbf r_\alpha}{\|\mathbf d_\alpha - \mathbf r_\alpha\|}, \qquad \frac{d\mathbf r_\alpha}{dt} = v_\alpha^0\, \mathbf e_\alpha`, etroit: tex`\begin{aligned}\mathbf e_\alpha &\propto \hat{\mathbf u}_\alpha + \nabla V_{\text{tr}}(\mathbf r_\alpha, t)\\ \hat{\mathbf u}_\alpha &= \frac{\mathbf d_\alpha - \mathbf r_\alpha}{\|\mathbf d_\alpha - \mathbf r_\alpha\|}, \quad \dot{\mathbf r}_\alpha = v_\alpha^0\, \mathbf e_\alpha\end{aligned}` },
        { figure: 'regle' },
        { p: 'Dans l’explorateur, $G$ va de 0 (herbe neuve) à 1 (terre nue). Le *confort* d’une case vaut $G$ sur l’herbe et 1 sur une allée pavée : une allée attire comme un sentier parfait. Le potentiel est la moyenne du confort pondérée par une cloche de largeur $\\sigma$ (une gaussienne plutôt qu’une exponentielle, voir *Calcul*), et l’attrait $A$ règle le poids de sa pente face au but :' },
        { tex: tex`\mathbf e_\alpha \propto \hat{\mathbf u}_\alpha + A\,\sigma\,\nabla \tilde V(\mathbf r_\alpha), \qquad \tilde V = \text{confort vu à la distance } \sigma`, etroit: tex`\mathbf e_\alpha \propto \hat{\mathbf u}_\alpha + A\,\sigma\,\nabla \tilde V(\mathbf r_\alpha)` },
        { p: 'Combien de passages faut-il pour qu’un sentier tienne ? Chaque jour, l’herbe repousse, puis $n$ passants usent chacun la part $I$ de ce qui reste. L’usure se stabilise là où les deux s’équilibrent :' },
        { tex: tex`G^\ast = \frac{1 - (1-I)^n}{1 - (1-I)^n\, e^{-1/T}}`, etroit: tex`G^\ast = \frac{1 - (1-I)^n}{1 - (1-I)^n e^{-1/T}}` },
        { figure: 'usure' },
        { p: 'Le potentiel, lui, explique pourquoi un sentier attire à distance. En coupe, un sentier de 1,5 m est une marche ; vu à la distance $\\sigma$, il devient une bosse douce, et sa pente pousse vers lui des deux côtés.' },
        { figure: 'potentiel' },
      ],
    },
    {
      id: 'regimes', titre: 'Direct, minimal, ou entre les deux', blocs: [
        { p: 'Helbing et ses collègues montrent qu’après mise à l’échelle, le modèle ne dépend plus que de deux nombres sans dimension. Le premier, noté $\\kappa$, mesure la force de la mémoire du sol : il grandit avec l’usure $I$ et la durée de vie $T$ des traces, et diminue quand la visibilité $\\sigma$ augmente. Le second compare la vitesse de marche à $\\sigma / T$ ; ils le gardent fixe.' },
        {
          liste: [
            '*κ petit* : les traces s’effacent avant de compter. Chacun suit son chemin direct : un *système de chemins directs*, qui piétine beaucoup de surface.',
            '*κ grand* : les traces durent et attirent fort. Les chemins se regroupent jusqu’au réseau le plus court qui relie toutes les portes, un *système de chemins minimal*, au prix de grands détours.',
            '*entre les deux* : un *système de détours minimaux*, un compromis. C’est, d’après les auteurs, ce qui se forme pour des paramètres réalistes : l’évolution s’arrête avant le réseau minimal.',
          ],
        },
        { figure: 'regimes' },
        { p: 'Pour mesurer ce compromis, on amincit les sentiers jusqu’à un trait d’une case et l’on mesure leur longueur totale, en même temps que le détour moyen des marcheurs. Le résultat se compare à deux réseaux géométriques qui relient les trois portes : l’*arbre couvrant minimal* (deux des trois côtés) et l’*arbre de Steiner* (trois branches qui se rejoignent en un point).' },
        { figure: 'compromis' },
        { p: 'Dans nos simulations (10 jours, 500 passages par jour, 2 tirages par point), de l’attrait 0 à l’attrait 12, le réseau de sentiers raccourcit d’environ 13 %, pour un détour moyen qui passe de 0 à 8,5 %. L’arbre de Steiner serait 42 % plus court que les chemins directs, mais imposerait 15,5 % de détour en moyenne ; l’arbre couvrant minimal, 33 % plus court, 33 % de détour. Nos marcheurs restent bien plus près des chemins directs : ils acceptent un petit détour, pas un grand.' },
        { p: 'Avec quatre portes, la longueur ne baisse pas régulièrement : vers un attrait de 2 ou 3, des sentiers parallèles coexistent avant de fusionner, et le réseau s’allonge (426 m contre 301 m sans attrait) ; au-delà, il raccourcit (255 m à l’attrait 12), pour 14 % de détour. Les auteurs résument ce comportement par une conjecture : le réseau qui se forme serait le plus court parmi ceux qui respectent un certain détour accepté.' },
      ],
    },
    {
      id: 'reseaux', titre: 'Ce que les sentiers optimisent', blocs: [
        { p: 'Relier trois points par le réseau le plus court est un vieux problème. Pierre de Fermat l’a posé à Evangelista Torricelli vers 1640 : où placer un point dont la somme des distances aux trois sommets d’un triangle est la plus petite ? Réponse : au point où les trois segments font des angles de 120° deux à deux (si aucun angle du triangle ne dépasse 120°).' },
        { figure: 'steiner' },
        { p: 'Avec plus de points, le réseau le plus court peut demander plusieurs points de jonction, toujours à 120° : c’est l’*arbre de Steiner*. Le trouver est très difficile : le problème est *NP-difficile*, et aucun algorithme connu ne le résout vite pour de nombreux points. Les sentiers, eux, ne calculent rien : ils approchent un compromis par essais et renforcements.' },
        {
          expert: 'le rapport de Steiner', blocs: [
            { p: 'L’arbre couvrant minimal (relier les points par des segments entre eux, sans point ajouté) se calcule facilement. De combien l’arbre de Steiner peut-il être plus court ? Gilbert et Pollak ont conjecturé en 1968 que le rapport ne descend jamais sous $\\sqrt 3/2 \\approx 0{,}866$, la valeur atteinte par le triangle équilatéral :' },
            { tex: tex`\frac{L_{\text{Steiner}}}{L_{\text{arbre couvrant}}} \ \ge\ \frac{\sqrt 3}{2}` },
            { p: 'Une démonstration a été annoncée en 1990, mais Ivanov et Tuzhilin ont montré en 2012 qu’elle comportait une lacune : la conjecture reste ouverte. Pour nos trois portes, presque un triangle équilatéral, le rapport vaut 0,867.' },
          ],
        },
        { p: 'Mais le réseau le plus court n’est pas ce que veulent les marcheurs. Chacun paie le détour de son propre trajet ; la longueur totale ne compte que pour le jardinier. Un réseau de sentiers réel arbitre entre deux coûts : la surface piétinée (ou à entretenir) et le temps perdu par chacun. C’est un problème à deux objectifs, et l’attrait règle le prix que chacun accepte de payer pour un sol plus confortable.' },
        { p: 'L’architecte allemand Frei Otto a étudié ces réseaux avec des fils de laine mouillés : tendus entre des points avec un peu de mou, les fils trempés se collent les uns aux autres en ressortant de l’eau, et dessinent un réseau qui regroupe les trajets sans trop les allonger. Le scénario *Dix points en cercle* s’en inspire.' },
      ],
    },
    {
      id: 'effort', titre: 'Le moindre effort et l’équation eikonale', blocs: [
        { p: 'Les marcheurs de Helbing ne voient que les sentiers proches. Imaginons au contraire des marcheurs qui connaissent tout le terrain, et choisissent le chemin qui les fatigue le moins. Marcher dans l’herbe coûte 1 par mètre ; sur un sentier bien tracé ou une allée, un peu moins : $1 - e$, où $e$ est l’*économie sur sentier* (25 % par défaut). Le coût d’un chemin est la somme de ces coûts le long du trajet.' },
        { p: 'Le coût minimal $T(\\mathbf r)$ pour rejoindre une porte depuis le point $\\mathbf r$ obéit à l’*équation eikonale*, la même que celle d’un front de lumière qui avance plus lentement dans un milieu plus dense :' },
        { tex: tex`\big\|\nabla T(\mathbf r)\big\| = c(\mathbf r), \qquad T = 0 \text{ à la porte}, \qquad c(\mathbf r) = 1 - e\,\text{confort}(\mathbf r)`, etroit: tex`\begin{aligned}\|\nabla T(\mathbf r)\| &= c(\mathbf r), \quad T = 0 \text{ à la porte}\\ c(\mathbf r) &= 1 - e\,\text{confort}(\mathbf r)\end{aligned}` },
        { p: 'Le meilleur chemin descend la pente de $T$. La *marche rapide* (voir *Calcul*) résout cette équation sur toute la grille d’un coup. À mesure que les sentiers se creusent, le coût baisse sur eux, $T$ change, et les chemins se réorganisent : la même boucle, mais avec des marcheurs qui savent tout.' },
        { p: 'Ce modèle accepte un détour si, et seulement si, il paie : avec 25 % d’économie, un trajet entièrement sur sentier peut être un tiers plus long qu’en ligne droite et rester rentable. Dans nos simulations du campus, ces marcheurs tracent deux fois moins de sentiers que ceux de Helbing (306 m² contre 590 m²), plus nets et plus droits, pour 3 % de détour contre 10 %. Hughes (2002) a utilisé la même équation pour décrire des foules qui cherchent à arriver au plus tôt.' },
      ],
    },
    {
      id: 'fourmis', titre: 'Fourmis et phéromones', blocs: [
        { p: 'En 1959, le biologiste Pierre-Paul Grassé décrit la façon dont les termites coordonnent leurs constructions sans se parler : le travail déjà fait guide le travail suivant. Il l’appelle *stigmergie*. Les pistes des fourmis en sont l’exemple le plus célèbre : une fourmi dépose une phéromone, les suivantes la sentent et la suivent, et la renforcent.' },
        { p: 'Au tournant des années 1990, Jean-Louis Deneubourg, Simon Goss et leurs collègues mettent un nid de fourmis d’Argentine (*Linepithema humile*) et une source de nourriture de part et d’autre d’un *double pont* : deux branches entre les deux. Quand les branches sont égales, les fourmis les prennent d’abord autant l’une que l’autre, puis finissent par n’en prendre qu’une, au hasard d’un essai à l’autre. Quand l’une est plus courte, la plupart des fourmis finissent par la prendre.' },
        { p: 'Ils décrivent le choix d’une fourmi par une fonction simple : si $A$ et $B$ fourmis sont déjà passées par chaque branche, la suivante prend la branche A avec la probabilité' },
        { tex: tex`P_A = \frac{(k + A)^n}{(k + A)^n + (k + B)^n}` },
        { p: 'Le paramètre $k$ est un seuil : tant que peu de fourmis sont passées, le choix reste presque au hasard. L’exposant $n$ dit à quel point une petite avance compte. Avec $n = 1$, la part de chaque branche dérive sans jamais trancher ; avec $n > 1$, la branche en avance attire plus que sa part, et le système bascule. Les données des fourmis d’Argentine sont bien reproduites avec $k \\approx 20$ et $n \\approx 2$.' },
        { figure: 'choix' },
        { p: 'Pourquoi la branche courte gagne-t-elle ? Les fourmis qui l’empruntent arrivent les premières à la nourriture et rentrent les premières : leur piste est marquée dans les deux sens avant celle de la branche longue. L’avance initiale est petite, mais la boucle l’amplifie. Dans l’explorateur, une fourmi marque d’autant plus fort qu’elle a quitté le nid (ou la nourriture) depuis peu, comme dans le modèle de Helbing, Schweitzer et leurs collègues (1997) : les chemins courts reçoivent les marques les plus fortes.' },
        { figure: 'pont' },
        { p: 'Dans nos simulations (12 essais par pont), sur les branches égales, 6 essais ont choisi la branche A, 5 la branche B, et un hésitait encore à la fin. Sur le pont inégal, les 12 essais ont choisi la branche courte, la plupart en moins de 800 pas. Dans un terrain ouvert avec plusieurs sources (*Fourragement*), les pistes se ramifient en arbre depuis le nid, comme les pistes de fourragement de nombreuses espèces.' },
      ],
    },
    {
      id: 'keller-segel', titre: 'Chimiotaxie : la boucle en équations', blocs: [
        { p: 'Des cellules qui se dirigent vers une substance qu’elles produisent elles-mêmes : c’est la *chimiotaxie*. Keller et Segel (1970) l’ont décrite par deux équations, l’une pour la densité $\\rho$ des cellules, l’autre pour la concentration $c$ de la substance :' },
        { tex: tex`\frac{\partial \rho}{\partial t} = D_\rho \nabla^2 \rho - \chi\, \nabla\!\cdot\!\big(\rho\, \nabla c\big), \qquad \frac{\partial c}{\partial t} = D_c \nabla^2 c + \alpha \rho - \beta c`, etroit: tex`\begin{aligned}\partial_t \rho &= D_\rho \nabla^2 \rho - \chi\, \nabla\!\cdot\!(\rho\, \nabla c)\\ \partial_t c &= D_c \nabla^2 c + \alpha \rho - \beta c\end{aligned}` },
        { p: 'Les cellules errent ($D_\\rho$) et remontent la pente de $c$ ($\\chi$) ; elles produisent la substance ($\\alpha$), qui se répand ($D_c$) et disparaît ($\\beta$). Ce sont exactement les ingrédients de nos sentiers : des marcheurs qui suivent la pente d’un champ ($\\chi$, notre attrait), qu’ils créent en passant ($\\alpha$, notre usure), et qui s’efface ($\\beta$, l’inverse de notre repousse).' },
        {
          expert: 'quand la boucle l’emporte', blocs: [
            { p: 'Partons d’un état uniforme $\\rho_0$, $c_0 = \\alpha \\rho_0 / \\beta$, et perturbons-le d’une petite onde $e^{i k x + \\lambda t}$. En linéarisant, on obtient :' },
            { tex: tex`(\lambda + D_\rho k^2)(\lambda + D_c k^2 + \beta) = \chi\, \rho_0\, \alpha\, k^2` },
            { p: 'Une perturbation grandit ($\\lambda > 0$) si, et seulement si, $\\chi \\rho_0 \\alpha > D_\\rho (D_c k^2 + \\beta)$. Pour les grandes longueurs d’onde ($k \\to 0$), la condition devient' },
            { tex: tex`\chi\, \alpha\, \rho_0 \ >\ D_\rho\, \beta` },
            { p: 'La boucle (attrait × production × densité) doit battre l’errance et l’oubli. Sinon, tout reste uniforme ; au-delà, les cellules s’agrègent. C’est l’analogue du nombre $\\kappa$ de Helbing : sous un seuil, pas de sentier ; au-dessus, la boucle creuse des chemins.' },
          ],
        },
      ],
    },
    {
      id: 'boucle', titre: 'Une même boucle, partout', blocs: [
        { p: 'Sentiers, pistes de fourmis, amas de cellules : à chaque fois, des individus laissent une trace, la trace oriente les suivants, et l’oubli (repousse, évaporation, dégradation) efface ce qui ne sert plus. Le renforcement amplifie les petites différences ; l’oubli permet de changer d’avis. Sans oubli, le premier sentier venu resterait pour toujours ; sans renforcement, aucun ne se formerait.' },
        { p: 'Cette boucle résout des problèmes. Le moisi visqueux *Physarum polycephalum* renforce les tubes où son protoplasme coule le plus et laisse dépérir les autres ; Tero et ses collègues (2010) l’ont fait pousser entre des flocons d’avoine placés comme les villes autour de Tokyo, et il a tissé un réseau comparable au réseau ferré, en efficacité comme en robustesse. Ce sera un projet à part dans ce labo.' },
        { p: 'Les informaticiens ont copié la boucle : les *algorithmes de colonies de fourmis* (Dorigo et ses collègues, à partir de 1991) envoient des fourmis virtuelles parcourir un graphe, renforcent les arêtes des bons trajets et font s’évaporer les autres. Ils trouvent de bonnes solutions au problème du voyageur de commerce et à des problèmes de routage.' },
      ],
    },
  ],

  applications: [
    {
      id: 'urbanisme', titre: 'Dessiner les allées après coup', blocs: [
        { p: 'Une idée revient souvent chez les paysagistes : semer du gazon partout, attendre, puis paver là où les gens ont marché. On raconte que plusieurs universités l’ont fait ; c’est en tout cas le bouton *Paver les sentiers* de l’explorateur. Helbing et ses collègues proposaient leur modèle comme outil pour les urbanistes : il suffit de connaître les entrées, les destinations et leur fréquentation pour prévoir les lignes de désir avant même de construire.' },
        { p: 'Les sentiers apparaissent vite. Un guide de randonnée de 1988 (*Soft Paths*, de Hampton et Cole) estime qu’une quinzaine de passages peut suffire à marquer un sentier visible. En 2014, Virginia Tech a décidé de paver les chemins de terre tracés à travers le *Drillfield*, sa grande pelouse centrale. À Detroit, où des quartiers entiers se sont vidés, on a recensé plus de 240 km de lignes de désir à travers les terrains abandonnés.' },
        { p: 'Le modèle explique aussi pourquoi une allée mal placée ne suffit pas à protéger une pelouse : si elle impose un détour trop grand, l’attrait de son confort ne compense pas, et le raccourci se creuse à côté. Une clôture déplace le problème plus qu’elle ne le règle : on passe par ses trous.' },
      ],
    },
    {
      id: 'campus', titre: 'Les campus de Helbing', blocs: [
        { p: 'L’article de 1997 s’ouvre sur une photo du campus de l’université de Stuttgart à Vaihingen : des sentiers droits ou légèrement courbes entre des allées pavées à angle droit. Les auteurs remarquent deux sortes de nœuds : des croisements de sentiers droits, et des jonctions où les sentiers se rejoignent en douceur. Ils comparent aussi leur simulation aux sentiers du campus de Brasília, et la ressemblance est frappante.' },
        { p: 'Le scénario *Campus* de l’explorateur reprend cette situation : des bâtiments, des allées orthogonales, une gare dans un coin. Les marcheurs coupent les angles et dessinent des diagonales que l’architecte n’avait pas prévues.' },
      ],
    },
    {
      id: 'foules', titre: 'Gares, aéroports et foules', blocs: [
        { p: 'Dans un bâtiment, le sol ne s’use pas en quelques jours, mais la question est la même : par où passent les gens, et le plan les aide-t-il ou les contrarie-t-il ? Les gestionnaires de gares et d’aéroports mesurent les flux de voyageurs pour placer les panneaux, les boutiques et les files d’attente. Dans le scénario *Hall de l’aéroport*, l’usure du sol joue le rôle d’une carte de chaleur des passages.' },
        { p: 'Les marcheurs de l’explorateur s’ignorent les uns les autres : ils ne se bousculent pas. Pour une foule dense, il faut ajouter les forces entre piétons, le *modèle des forces sociales* de Helbing et Molnár (1995). Ce sera le sujet du projet *Foule d’aéroport*, qui reprendra les sentiers de celui-ci.' },
      ],
    },
    {
      id: 'algorithmes', titre: 'Des fourmis dans les ordinateurs', blocs: [
        { p: 'Les algorithmes de colonies de fourmis transposent le double pont : des fourmis virtuelles parcourent un graphe, déposent une phéromone d’autant plus forte que leur trajet est court, et la phéromone s’évapore. Ils servent pour des tournées de livraison, l’ordonnancement de tâches, ou le routage dans les réseaux de télécommunication (AntNet, Di Caro et Dorigo, 1998).' },
        { p: 'En robotique en essaim, des robots imitent les pistes avec des marques lumineuses ou des balises : sans carte ni chef, ils trouvent et entretiennent des chemins entre des points d’intérêt.' },
      ],
    },
    {
      id: 'limites', titre: 'Ce que ces modèles ne disent pas', blocs: [
        { p: 'Les vrais passants ne marchent pas dans une pelouse uniforme : la pente, la boue, les flaques, la vue, la peur de se faire remarquer sur l’herbe interdite comptent. Ils ne se croisent pas sans se voir, marchent parfois en groupe, et ne posent pas le pied exactement au même endroit. Le modèle ignore tout cela.' },
        { p: 'Sa force est ailleurs : il montre qu’il suffit de deux ingrédients, le désir d’aller droit et l’attrait du sol déjà foulé, pour obtenir des réseaux qui ressemblent aux vrais, et que leur forme dépend surtout d’un équilibre entre mémoire et oubli. C’est cet équilibre que l’on règle en jouant sur l’attrait et la repousse.' },
      ],
    },
  ],

  calcul: [
    {
      id: 'grille', titre: 'Le sol en cases', blocs: [
        { p: 'Le terrain est une grille de cases de 50 cm (2,5 mm pour les fourmis) : 140 × 100 cases pour le square, 220 × 160 pour le campus. Chaque case a un type (herbe, allée, bâtiment, clôture, arbre) et une usure $G$ entre 0 et 1, rangée dans un tableau de nombres à virgule.' },
        { p: 'Un marcheur se déplace en continu (ses coordonnées sont des nombres réels), mais il use les quatre cases qui l’entourent, chacune en proportion de sa proximité (*interpolation bilinéaire*). Sans cela, les sentiers suivraient les lignes de la grille. Un pas use la part $I$ de ce qui reste d’herbe, en proportion de sa longueur : $G \\leftarrow G + I\\,(1 - G)$ pour un pas ordinaire de 65 cm.' },
        { p: 'La repousse est appliquée tous les quatre pas, d’un coup : $G \\leftarrow G\\, e^{-4/(T \\cdot 1000)}$, puisqu’une journée compte mille pas. C’est exact (une décroissance exponentielle se compose) et quatre fois moins coûteux.' },
      ],
    },
    {
      id: 'flou', titre: 'Voir les sentiers à distance : trois flous en boîte', blocs: [
        { p: 'Le potentiel des sentiers est une moyenne pondérée du confort autour de chaque point. Calculée directement, elle coûterait, pour chaque case, une somme sur toutes les cases à quelques σ : des millions d’opérations, à refaire souvent. On la remplace par trois *flous en boîte* successifs : chacun remplace une case par la moyenne de ses $2r + 1$ voisines, d’abord en ligne puis en colonne.' },
        { p: 'Un flou en boîte se calcule avec une somme glissante : on ajoute la case qui entre, on retire celle qui sort, quel que soit $r$. Et trois boîtes successives donnent presque une gaussienne, par le théorème central limite : l’écart-type de trois boîtes de largeur $2r + 1$ vaut $\\sqrt{3\\,((2r+1)^2 - 1)/12}$, ce qui fixe $r$ pour obtenir $\\sigma$.' },
        { figure: 'flou' },
        { p: 'Le potentiel n’est recalculé que tous les huit pas : les sentiers changent lentement. Sa pente au point du marcheur est lue par différences finies sur des valeurs interpolées.' },
      ],
    },
    {
      id: 'eikonale', titre: 'Le plus court chemin autour des obstacles', blocs: [
        { p: 'Un marcheur qui ne voit pas sa porte doit contourner les bâtiments. Pour chaque porte, on calcule une fois la distance la plus courte depuis chaque case, en évitant les obstacles : la solution de l’équation eikonale $\\|\\nabla T\\| = c$ avec $c = 1$ partout où l’on peut marcher. La direction vers la porte est alors la pente descendante de $T$.' },
        { p: 'La *marche rapide* de Sethian (1996) la calcule comme l’algorithme de Dijkstra calcule des distances dans un graphe : on part de la porte, on fige toujours la case la plus proche non encore figée (un tas binaire donne la plus petite en $O(\\log N)$), et l’on met à jour ses voisines. Pour une case dont deux voisines connues valent $a$ (en ligne) et $b$ (en colonne), la mise à jour résout un petit polynôme du second degré :' },
        { tex: tex`T = \begin{cases} \dfrac{a + b + \sqrt{2c^2 - (a-b)^2}}{2} & \text{si } |a - b| < c \\[2mm] \min(a, b) + c & \text{sinon} \end{cases}` },
        { p: 'Contrairement à Dijkstra sur une grille, qui ne connaît que les pas horizontaux, verticaux ou en diagonale, la marche rapide donne des distances presque euclidiennes : un front circulaire reste circulaire.' },
        { figure: 'eikonale' },
        { p: 'Dans le modèle du moindre effort, le coût dépend du confort, qui change sans cesse : la carte d’une porte est refaite tous les 25 pas, à tour de rôle. Quand une porte est en vue (aucun obstacle sur la ligne droite, testé une fois pour toutes), le marcheur y va tout droit : plus juste que la pente de la carte, qui garde la trace des cases.' },
      ],
    },
    {
      id: 'fourmis', titre: 'Les fourmis, pas à pas', blocs: [
        { p: 'Chaque fourmi a une position et un cap. Elle sent la phéromone qui l’intéresse en trois points devant elle : droit devant, et à 40° à gauche et à droite, à quatre cases. Elle tourne de 25° vers le côté le plus marqué (au hasard en cas d’égalité), ajoute un peu d’errance, et avance d’une case. Contre un mur, elle repart dans une autre direction.' },
        { p: 'En cherchant, elle dépose la phéromone « vers le nid » ; en rentrant chargée, la phéromone « vers la nourriture ». La marque vaut $e^{-\\beta t}$, où $t$ est le temps depuis son départ du nid ou de la nourriture, et elle ne fait que relever la valeur de la case (elle ne s’y ajoute pas). Les deux phéromones s’évaporent de 0,2 % par pas et se répandent un peu aux cases voisines tous les quatre pas.' },
        { p: 'Sur le double pont, deux zones de comptage, au milieu de chaque branche, enregistrent les passages ; la mesure *Branche A* est la part de A parmi les 200 derniers.' },
      ],
    },
    {
      id: 'mesures', titre: 'Les mesures', blocs: [
        { p: '*Sentiers* : la surface des cases d’herbe dont l’usure dépasse 45 % ; *Herbe abîmée* : celles qui dépassent 15 %. *Détour* : pour chacun des 120 derniers arrivés, la longueur marchée rapportée à la distance la plus courte depuis son point de départ (autour des obstacles), moins 1. *Confort* : la part de ses pas faite sur une case confortable (allée, ou herbe usée à plus de 50 %).' },
        { p: 'La longueur d’un réseau de sentiers (figure du compromis) demande de réduire chaque sentier à un trait : on amincit le masque des cases usées par l’algorithme de Zhang et Suen (1984), qui ronge les bords d’une forme sans la couper, puis l’on compte les pas entre cases voisines du squelette (50 cm en ligne droite, 71 cm en diagonale).' },
      ],
    },
    {
      id: 'worker', titre: 'Le calcul à côté de la page', blocs: [
        { p: 'Le moteur tourne dans un *Web Worker*. À chaque image, la page demande un état ; le Worker avance de quelques pas et renvoie l’usure du sol (un octet par case), les marcheurs et les portes. Le type de chaque case n’est renvoyé que lorsqu’il a changé (un coup de pinceau, un pavage). Les tableaux passent d’un fil à l’autre sans copie (objets transférables).' },
        { p: 'Le dessin 2D peint le sol dans une petite image d’un pixel par case, que le navigateur agrandit avec lissage : les sentiers ont des bords doux sans calcul supplémentaire. En 3D, la même image sert de texture au terrain, et des brins d’herbe se couchent là où l’usure est forte.' },
        { p: 'Les images des fiches ont été calculées à l’avance dans Node.js avec le même moteur et la même graine, puis compressées (*deflate*, l’algorithme des fichiers .zip) : le type de chaque case, l’usure sur 4 bits, quelques marcheurs. La page les décompresse avec l’outil du navigateur (*DecompressionStream*) et les dessine aussitôt. Les figures marquées « précalculées » (compromis, double pont) viennent elles aussi du moteur, lancé dans Node.js.' },
      ],
    },
  ],

  histoire: [
    {
      id: 'frise', titre: 'Une histoire des chemins qui se tracent seuls', blocs: [
        {
          frise: [
            ['vers 1640', 'Pierre de Fermat', 'pose à Torricelli le problème du point qui minimise la somme des distances aux trois sommets d’un triangle.'],
            ['1959', 'Pierre-Paul Grassé', 'nomme *stigmergie* la coordination des termites par le travail déjà fait.'],
            ['1968', 'Edgar Gilbert et Henry Pollak', 'étudient les arbres de Steiner et conjecturent le rapport $\\sqrt 3/2$.'],
            ['1970', 'Evelyn Keller et Lee Segel', 'mettent en équations l’agrégation des amibes par chimiotaxie.'],
            ['1989', 'Simon Goss et al.', 'montrent que les fourmis d’Argentine trouvent le plus court de deux chemins.'],
            ['1990', 'Jean-Louis Deneubourg et al.', 'décrivent le double pont et la fonction de choix des fourmis.'],
            ['1991', 'Marco Dorigo et al.', 'proposent le premier algorithme de colonies de fourmis.'],
            ['1995', 'Dirk Helbing et Péter Molnár', 'décrivent les piétons par des forces sociales.'],
            ['1996', 'James Sethian', 'publie la marche rapide pour suivre des fronts.'],
            ['1997', 'Helbing, Keltsch et Molnár', 'modélisent l’évolution des sentiers humains (*Nature*) ; Helbing, Schweitzer et al. étendent les marcheurs actifs aux fourmis.'],
            ['2002', 'Roger Hughes', 'décrit les foules comme un fluide qui cherche à arriver au plus tôt (équation eikonale).'],
            ['2010', 'Atsushi Tero et al.', 'font redessiner le réseau ferré de Tokyo par *Physarum*.'],
            ['2012', 'Alexander Ivanov et Alexey Tuzhilin', 'montrent que la démonstration de 1990 du rapport de Steiner est incomplète.'],
            ['2014', '', 'Virginia Tech décide de paver les sentiers de terre tracés à travers son *Drillfield*.'],
          ],
        },
      ],
    },
    {
      id: 'quatre-regards', titre: 'Quatre regards sur un sentier', blocs: [
        { p: '*Urbanisme et paysage.* Les lignes de désir sont un message des usagers aux concepteurs. Les uns les combattent (clôtures, haies), d’autres les suivent (paver après coup). Frei Otto y voyait un principe de conception : laisser les chemins se trouver, puis construire.' },
        { p: '*Physique.* Helbing et ses collègues voient des systèmes qui s’organisent seuls, loin de l’équilibre, comme les dunes ou les rides de sable. Ils cherchent les quelques nombres sans dimension qui décident de la forme : ici, $\\kappa$.' },
        { p: '*Biologie.* Grassé, Deneubourg, Goss et d’autres étudient comment des insectes sans plan collectif bâtissent des nids, tracent des pistes, choisissent des sources. La stigmergie y est une stratégie sélectionnée par l’évolution.' },
        { p: '*Informatique.* Dorigo et ses successeurs ont fait de la boucle trace-renforcement-oubli une méthode d’optimisation. Les géomètres, eux, savent que le réseau le plus court est très difficile à calculer, et regardent avec intérêt ces systèmes qui trouvent de bons compromis sans rien calculer.' },
      ],
    },
    {
      id: 'refs', titre: 'Références', blocs: [
        {
          refs: [
            ['D. Helbing, J. Keltsch, P. Molnár, « Modelling the evolution of human trail systems », *Nature*, 388, 47–50, 1997.', 'https://arxiv.org/abs/cond-mat/9805158'],
            ['D. Helbing, F. Schweitzer, J. Keltsch, P. Molnár, « Active walker model for the formation of human and animal trail systems », *Physical Review E*, 56, 2527, 1997.', 'https://arxiv.org/abs/cond-mat/9806097'],
            ['D. Helbing, P. Molnár, « Social force model for pedestrian dynamics », *Physical Review E*, 51, 4282, 1995.', 'https://doi.org/10.1103/PhysRevE.51.4282'],
            ['P.-P. Grassé, « La reconstruction du nid et les coordinations interindividuelles chez *Bellicositermes natalensis* et *Cubitermes* sp. La théorie de la stigmergie », *Insectes Sociaux*, 6, 1959.'],
            ['S. Goss, S. Aron, J.-L. Deneubourg, J. M. Pasteels, « Self-organized shortcuts in the Argentine ant », *Naturwissenschaften*, 76, 1989.'],
            ['J.-L. Deneubourg, S. Aron, S. Goss, J. M. Pasteels, « The self-organizing exploratory pattern of the Argentine ant », *Journal of Insect Behavior*, 3, 1990.'],
            ['M. Dorigo, V. Maniezzo, A. Colorni, « Ant system: optimization by a colony of cooperating agents », *IEEE Transactions on Systems, Man, and Cybernetics B*, 26(1), 1996.', 'https://doi.org/10.1109/3477.484436'],
            ['G. Di Caro, M. Dorigo, « AntNet: distributed stigmergetic control for communications networks », *Journal of Artificial Intelligence Research*, 9, 1998.'],
            ['E. F. Keller, L. A. Segel, « Initiation of slime mold aggregation viewed as an instability », *Journal of Theoretical Biology*, 26, 1970.'],
            ['J. A. Sethian, « A fast marching level set method for monotonically advancing fronts », *PNAS*, 93, 1591–1595, 1996.', 'https://doi.org/10.1073/pnas.93.4.1591'],
            ['R. L. Hughes, « A continuum theory for the flow of pedestrians », *Transportation Research B*, 36, 2002.'],
            ['E. N. Gilbert, H. O. Pollak, « Steiner minimal trees », *SIAM Journal on Applied Mathematics*, 16(1), 1968.', 'https://doi.org/10.1137/0116001'],
            ['A. O. Ivanov, A. A. Tuzhilin, « The Steiner ratio Gilbert–Pollak conjecture is still open », *Algorithmica*, 62, 2012.'],
            ['A. Tero et al., « Rules for biologically inspired adaptive network design », *Science*, 327, 439–442, 2010.', 'https://doi.org/10.1126/science.1177894'],
            ['T. Y. Zhang, C. Y. Suen, « A fast parallel algorithm for thinning digital patterns », *Communications of the ACM*, 27(3), 1984.', 'https://doi.org/10.1145/357994.358023'],
            ['B. Hampton, D. Cole, *Soft Paths: How to Enjoy the Wilderness Without Harming It*, 1988.'],
            ['« Desire path », Wikipédia (en anglais) : exemples, chiffres et sources sur les lignes de désir.', 'https://en.wikipedia.org/wiki/Desire_path'],
          ],
        },
      ],
    },
  ],

  /* ---------- Textes des figures ---------- */

  figures: {
    regle: {
      titre: 'Entre le but et le sentier',
      resume: 'Un marcheur sur une pelouse, un sentier qui passe au-dessus de lui, et les flèches de sa direction.',
      but: 'but',
      versBut: 'vers le but',
      versSentier: 'attrait du sentier',
      resultat: 'direction prise',
      attrait: 'Attrait A',
      sigma: 'Visibilité σ',
      metres: (x) => `${x} m`,
      note: 'Glissez le marcheur (le rond blanc). La flèche jaune vise le but, l’orange tire vers le sentier, la blanche est la direction prise ; les pointillés montrent le chemin qu’il suivra. Avec un attrait nul, il va tout droit ; avec un attrait fort, il rejoint le sentier et le suit, puis le quitte quand il ne va plus vers son but.',
    },
    usure: {
      titre: 'Usure à l’équilibre selon le nombre de passages',
      serie: (t) => `repousse T = ${t} j`,
      seuil: 'seuil d’un sentier (45 %)',
      axeX: 'passages par jour sur la même case',
      axeY: 'usure à l’équilibre',
      info: (x, v) => `${x} passages par jour\u00a0: ${v}`,
      resume: 'Trois courbes qui montent de 0 vers 100 % ; plus la repousse est lente, plus elles montent vite.',
      usure: 'Usure par passage I',
      note: 'Avec la repousse par défaut (4 jours) et une usure de 0,05 par passage, environ trois passages par jour sur la même case suffisent à franchir le seuil. En vrai, les passants ne posent pas le pied au même endroit : il en faut bien plus pour un sentier entier.',
    },
    potentiel: {
      titre: 'Un sentier en coupe, vu à la distance σ',
      G: 'le sentier (usure)',
      V: 'le sentier vu à σ (potentiel)',
      A: 'attrait (pente du potentiel)',
      axeX: 'distance au milieu du sentier (m)',
      axeY: 'valeur',
      info: (x, v) => `${x} m\u00a0: ${v}`,
      resume: 'Une marche (le sentier), une bosse douce (le potentiel), et une courbe positive à gauche, négative à droite (l’attrait).',
      sigma: 'Visibilité σ',
      metres: (x) => `${x} m`,
      note: 'L’attrait est positif à gauche du sentier et négatif à droite : des deux côtés, il pousse vers lui. Il est le plus fort à environ σ du milieu et s’annule sur le sentier. Augmentez σ : le sentier attire de plus loin, mais moins fort.',
    },
    regimes: {},
    compromis: {
      titre: 'Trois portes : longueur du réseau contre détour',
      simulations: 'nos sentiers (attrait 0 à 12)',
      directs: 'chemins directs',
      arbre: 'arbre couvrant minimal',
      steiner: 'arbre de Steiner',
      axeX: 'longueur du réseau (part des chemins directs)',
      axeY: 'détour moyen',
      info: (x, v) => `longueur ${x}\u00a0: ${v}`,
      resume: 'Nos simulations restent près des chemins directs ; l’arbre de Steiner et l’arbre couvrant minimal sont bien plus courts mais imposent de grands détours.',
    },
    steiner: {
      titre: 'Relier trois portes : direct, arbre, Steiner',
      resume: 'Trois carrés jaunes reliés à un point orange par trois sentiers ; les côtés du triangle en pointillés.',
      directs: 'Chemins directs',
      sansDetour: 'aucun détour',
      arbre: 'Arbre couvrant minimal',
      economie: (p) => `${p} plus court`,
      steiner: 'Arbre de Steiner',
      detour: (p) => `détour moyen ${p}`,
      metres: (x) => `${x} m`,
      note: 'Glissez les portes. Le point orange est le point de Fermat : les trois sentiers s’y rejoignent à 120°. Si un angle du triangle dépasse 120°, il se pose sur la porte de cet angle. Le dessin fait 40 m de large.',
    },
    choix: {
      titre: 'La fonction de choix des fourmis, essai par essai',
      resume: 'Seize courbes qui partent de 50 % ; avec n = 2, elles finissent près de 0 ou de 100 %.',
      axeX: 'fourmis passées (1 000 en tout)',
      finales: 'parts finales',
      k: 'Seuil k',
      n: 'Non-linéarité n',
      nouveau: 'Autres tirages',
      note: 'Chaque courbe suit la part de la branche A au fil des passages, pour seize essais ; l’histogramme montre les parts finales. Avec n = 1, les essais s’étalent sans trancher ; avec n = 2, chaque essai choisit une branche. Un seuil k plus grand retarde le choix.',
    },
    pont: {
      titre: 'Le double pont dans l’explorateur (12 essais par pont)',
      resume: 'À gauche, des courbes qui finissent à 0 ou à 100 % ; à droite, toutes montent à 100 %.',
      panneaux: { pont: 'Branches égales', pontInegal: 'Branche A plus courte' },
      axeX: 'temps (4 800 pas)',
      note: 'Part des 200 derniers passages par la branche A, mesurée tous les 400 pas. En vert, les essais qui finissent sur A ; en orange, ceux qui finissent sur B.',
    },
    eikonale: {
      titre: 'La marche rapide : distances autour des obstacles',
      resume: 'Une carte colorée par la distance au but, des bandes concentriques déformées par les murs, et cinq chemins blancs qui y descendent.',
      note: (max) => `Cliquez pour déplacer le but (le carré jaune). Chaque bande de couleur couvre 5 cases de distance\u202f; le point le plus éloigné est à ${max} cases. Les chemins blancs descendent la pente de la distance\u00a0: ils contournent les murs au plus court.`,
    },
    flou: {
      titre: 'Trois flous en boîte valent presque une gaussienne',
      passes: (n) => `${n} boîte${n > 1 ? 's' : ''}`,
      gauss: 'gaussienne de même écart-type',
      axeX: 'cases',
      axeY: 'poids',
      info: (x, v) => `case ${x}\u00a0: ${v}`,
      resume: 'Une boîte rectangulaire, puis un triangle, puis une cloche presque confondue avec la gaussienne.',
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
    chargement: 'Chargement…',
    erreur: 'Image indisponible sur ce navigateur.',
    note: 'Calculé à l’avance avec le moteur de l’explorateur, vu de dessus. Sous chaque image : la surface de sentiers et le détour moyen des derniers arrivés (chez les fourmis : les charges rapportées et la part de la branche A).',
    mesures: {
      sentiers: (v) => `${v} m² de sentiers`,
      detour: (v) => `détour moyen ${v}`,
      livrees: (v) => `${v} charges rapportées`,
      partA: (v) => `branche A\u00a0: ${v} des passages`,
    },
  },

  fiches: {
    square: {
      question: 'Combien de temps faut-il pour que les diagonales apparaissent ?',
      regles: [
        'Une pelouse de 70 × 50 m, bordée d’une allée et coupée par un axe jusqu’à une fontaine. Une haie tout autour, sept entrées.',
        '900 passages par jour, de toutes les entrées vers toutes les autres, plus nombreux par le sud-est.',
        'L’herbe repousse en 6 jours environ.',
      ],
      images: { j1: 'Jour 1', j6: 'Jour 6' },
      regarder: [
        'Le premier jour, des traces pâles un peu partout : chacun coupe à sa façon.',
        'Puis quelques diagonales se creusent et attirent les autres : les traces voisines s’effacent.',
        'Les allées prévues restent utilisées quand elles vont dans la bonne direction.',
      ],
      pourquoi: [
        'L’allée fait le tour de la pelouse : pour aller d’un coin à l’autre, elle impose un détour. Les premiers passants coupent à travers, chacun un peu différemment. Les traces qui se recouvrent sont un peu plus marquées, donc un peu plus attirantes : elles captent les passants suivants et se renforcent, pendant que les autres repoussent.',
        'En six jours, la surface de sentiers passe de 76 à 699 m², et le détour moyen reste sous 3 % : les diagonales suivent presque la ligne droite.',
      ],
      realite: 'C’est la situation la plus courante : les squares et les pelouses de résidence où l’allée fait le tour. Les jardiniers posent alors des chaînettes ou des haies basses… ou finissent par paver la diagonale.',
    },
    campus: {
      question: 'Que se passe-t-il si l’architecte pave les lignes de désir ?',
      regles: [
        'Un campus de 110 × 80 m : quatre bâtiments, des allées à angle droit, une gare dans un coin, un parking, des résidences.',
        '700 passages par jour, selon la fréquentation de chaque bâtiment.',
        'Au bout de six jours, on pave les sentiers bien marqués (bouton *Paver les sentiers*), et l’on continue.',
      ],
      images: { avant: 'Jour 6, avant de paver', apres: 'Jour 10, quatre jours après le pavage' },
      regarder: [
        'Avant : des diagonales entre la gare, la cafétéria et les amphis coupent les pelouses.',
        'Après : ces diagonales sont devenues des allées grises ; il reste peu de nouvelles traces.',
      ],
      pourquoi: [
        'Les allées d’origine suivent les façades, pas les trajets : pour aller de la gare aux amphis, elles imposent un grand détour. Les sentiers montrent les vrais trajets, avec un compromis : ils se regroupent en quelques troncs plutôt que de relier chaque porte à chaque autre.',
        'Une fois pavés, ils sont confortables pour toujours et ne repoussent plus : les marcheurs y restent. La surface de sentiers sur l’herbe tombe de 573 à 185 m², pour le même détour (près de 10 %, dû aux bâtiments qu’il faut contourner).',
      ],
      realite: 'Helbing et ses collègues proposaient d’utiliser leur modèle ainsi : simuler les trajets avant de construire, et placer les allées là où les gens voudront marcher. Leur article s’ouvre sur les sentiers du campus de l’université de Stuttgart à Vaihingen.',
    },
    trois: {
      question: 'Que relie un réseau de sentiers entre trois portes ?',
      regles: [
        'Une pelouse nue, trois portes placées presque en triangle équilatéral.',
        '500 passages par jour, de chaque porte vers les deux autres.',
        'Trois mondes identiques, sauf l’attrait des sentiers : 0, 3 et 10.',
      ],
      images: { a0: 'Attrait 0', a3: 'Attrait 3', a10: 'Attrait 10' },
      regarder: [
        'Sans attrait : trois chemins droits, les côtés du triangle.',
        'Avec un attrait moyen : les chemins se courbent vers l’intérieur et se rapprochent.',
        'Avec un attrait fort : ils fusionnent au centre en un réseau en Y.',
      ],
      pourquoi: [
        'Sans attrait, chacun va droit au but : c’est le système des chemins directs. Avec de l’attrait, un marcheur qui voit un sentier voisin s’en rapproche, même si ce sentier va un peu ailleurs ; les sentiers s’attirent les uns les autres et finissent par partager un tronc commun. On tend vers le réseau en Y de Steiner, qui relie trois points au plus court, avec des branches à 120°.',
        'Le prix : un détour. Il passe de 0 à 4 %, puis à 8 % ; la surface de sentiers diminue d’environ 17 %.',
      ],
      realite: 'C’est l’expérience de pensée de base de Helbing et ses collègues : selon les paramètres, système direct, système minimal, ou compromis. Les vraies pelouses sont le plus souvent dans le compromis.',
    },
    quatre: {
      question: 'Avec quatre coins, les sentiers forment-ils une croix ou autre chose ?',
      regles: [
        'Une pelouse nue, quatre portes aux coins d’un rectangle de 48 × 40 m.',
        '500 passages par jour entre toutes les paires de portes.',
        'Attrait 0, 3 et 8.',
      ],
      images: { a0: 'Attrait 0', a3: 'Attrait 3', a8: 'Attrait 8' },
      regarder: [
        'Sans attrait : les quatre côtés et les deux diagonales, six chemins droits.',
        'Avec de l’attrait : les chemins voisins se regroupent ; près des portes, des fourches apparaissent.',
        'Les fourches en Y et les croisements en X : les deux sortes de nœuds de Helbing.',
      ],
      pourquoi: [
        'Quand deux trajets partent de la même porte dans des directions proches, ils partagent d’abord le même sentier, puis se séparent : une fourche. Quand deux trajets se croisent presque à angle droit, partager ne rapporte rien : ils se croisent en X.',
        'Le détour monte à 7,5 % puis 12 %. La surface ne baisse pas toujours : à l’attrait 3, des sentiers parallèles hésitent encore à fusionner.',
      ],
      realite: 'Sur les photos de campus, on retrouve ces deux formes : des croisements de sentiers droits, et des jonctions qui se rejoignent en douceur, comme des affluents.',
    },
    anneau: {
      question: 'Que deviennent des trajets entre dix points disposés en cercle ?',
      regles: [
        'Dix portes sur un cercle de 54 m de diamètre, chacune reliée à toutes les autres.',
        '900 passages par jour, attrait 2.',
      ],
      images: { j1: 'Jour 1', j10: 'Jour 10' },
      regarder: [
        'Le premier jour, un écheveau de lignes droites qui se croisent partout.',
        'Au dixième jour, un réseau : des troncs qui regroupent plusieurs trajets, des boucles, un centre souvent évité.',
      ],
      pourquoi: [
        'Quarante-cinq paires de portes, quarante-cinq lignes droites : ce serait beaucoup d’herbe piétinée. L’attrait regroupe les trajets voisins en troncs communs ; le réseau qui en sort piétine moins de surface par trajet, au prix d’un détour d’environ 15 %.',
      ],
      realite: 'L’architecte Frei Otto cherchait de tels réseaux avec des fils de laine : tendus entre des points avec un peu de mou, puis trempés dans l’eau, ils se collent les uns aux autres et dessinent un réseau qui regroupe les trajets sans trop les allonger.',
    },
    repousse: {
      question: 'Quels sentiers survivent quand l’herbe repousse vite ?',
      regles: [
        'Un parc avec cinq entrées : le métro et l’école, très fréquentés, et trois entrées calmes (un kiosque, un banc, des jeux).',
        '400 passages par jour.',
        'Deux mondes : l’herbe repousse en 8 jours dans l’un, en 1,5 jour dans l’autre.',
      ],
      images: { lente: 'Repousse lente (8 jours)', rapide: 'Repousse rapide (1,5 jour)' },
      regarder: [
        'Repousse lente : un réseau complet, jusqu’aux entrées calmes.',
        'Repousse rapide : le grand sentier entre le métro et l’école, et presque rien d’autre.',
      ],
      pourquoi: [
        'Un sentier ne tient que si les passages l’usent plus vite que l’herbe ne repousse. Entre le métro et l’école, les passages sont nombreux : le sentier tient toujours. Vers le banc, quelques passages par jour ne suffisent pas si l’herbe repousse vite : la trace s’efface avant le passage suivant.',
        'La surface de sentiers passe de 383 à 125 m². La repousse fait le tri : seuls les chemins utiles survivent.',
      ],
      realite: 'C’est pourquoi les sentiers sont plus nets en été sec qu’au printemps, et pourquoi une pelouse fermée quelques semaines efface les traces secondaires, pas les grandes.',
    },
    types: {
      question: 'Les pressés et les flâneurs tracent-ils les mêmes sentiers ?',
      regles: [
        'Le square, avec moitié de pressés (orange) et moitié de flâneurs (bleu).',
        'Les pressés marchent à 1,6 m/s, regardent peu les sentiers et hésitent peu ; les flâneurs, à 0,9 m/s, sont près de quatre fois plus attirés par les sentiers et hésitent davantage.',
      ],
      images: { types: 'Jour 6 : pressés (orange) et flâneurs (bleu)' },
      regarder: [
        'Les pressés coupent au plus court, parfois à côté des sentiers.',
        'Les flâneurs suivent les sentiers, quitte à faire un détour.',
      ],
      pourquoi: [
        'Dans nos mesures, en cours de route, les pressés font environ 1 % de détour, les flâneurs 6 %. Les uns tracent les raccourcis, les autres les entretiennent.',
        'Avec seulement des pressés, le square se couvre de 748 m² de sentiers presque droits (0,5 % de détour) ; avec seulement des flâneurs, de 532 m² de sentiers regroupés, au prix de 8 % de détour.',
      ],
      realite: 'Les études de piétons distinguent bien des comportements différents (pendulaires pressés, promeneurs, groupes), mais les chiffres de l’explorateur sont des choix de modélisation, pas des mesures.',
    },
    pointe: {
      question: 'Les sentiers changent-ils au fil de la journée ?',
      regles: [
        'Le campus, avec des flux qui varient : le matin, on arrive de la gare, du parking et des résidences vers les cours ; à midi, on va à la cafétéria ; le soir, on repart.',
        '800 passages par jour, surtout aux heures de pointe.',
      ],
      images: { matin: 'Sixième jour, le matin', midi: 'Sixième jour, à midi', soir: 'Sixième jour, le soir' },
      regarder: [
        'Les marcheurs changent : nombreux le matin et le soir, dans des sens opposés ; à midi, vers la cafétéria.',
        'Le sol, lui, change à peine.',
      ],
      pourquoi: [
        'L’herbe met des jours à repousser : le sol garde la mémoire de tous les trajets de la journée, et même des jours précédents. Les sentiers sont la moyenne des flux, pas leur photo à un instant. Leur surface ne varie que de 532 à 565 m² entre le matin et le soir.',
      ],
      realite: 'Un sentier de campus sert aussi bien à l’aller qu’au retour : il relie des lieux, pas des heures. C’est pour cela qu’on peut le paver une fois pour toutes.',
    },
    aeroport: {
      question: 'Où passent les voyageurs dans un hall d’aéroport ?',
      regles: [
        'Un terminal de 100 × 56 m : trois entrées en bas, des banques d’enregistrement, un contrôle de sûreté percé de quatre passages, une librairie, un café, six portes d’embarquement en haut.',
        '1 200 passages par jour, avec des heures de pointe.',
        'Pas d’herbe : le sol « s’use » là où l’on passe, comme une carte de chaleur.',
      ],
      images: { hall: 'Jour 5' },
      regarder: [
        'Des couloirs nets entre les entrées et les passages du contrôle.',
        'Au-delà du contrôle, des éventails vers les portes, la librairie et le café.',
      ],
      pourquoi: [
        'Les obstacles décident presque tout : il faut contourner les banques et passer par l’un des quatre passages du contrôle. Le détour mesuré est presque nul, parce qu’il est compté par rapport au plus court chemin autour des obstacles : dans un hall, c’est l’architecture qui impose les détours, pas les sentiers.',
      ],
      realite: 'Un vrai sol de terminal ne s’use pas en cinq jours, mais la question est la même pour les concepteurs : placer les contrôles, les boutiques et la signalétique sur les flux. Le projet *Foule d’aéroport* ajoutera les bousculades.',
    },
    effort: {
      question: 'Et si les marcheurs connaissaient tout le terrain ?',
      regles: [
        'Le campus, deux fois.',
        'À gauche, les marcheurs actifs de Helbing : ils voient les sentiers à 3 m.',
        'À droite, le moindre effort : chacun calcule le chemin le moins fatigant sur tout le terrain, sachant qu’un sentier bien tracé coûte 25 % de moins que l’herbe.',
      ],
      images: { helbing: 'Marcheurs actifs, jour 8', effort: 'Moindre effort, jour 8' },
      regarder: [
        'Moindre effort : des raccourcis plus nets, plus droits, moins nombreux.',
        'Marcheurs actifs : des sentiers plus larges, qui ondulent et se regroupent.',
      ],
      pourquoi: [
        'Les marcheurs actifs ne voient que les sentiers proches : ils se laissent attirer par un sentier qui ne va pas tout à fait chez eux, puis le quittent. Les marcheurs du moindre effort ne prennent un sentier que s’il fait gagner quelque chose sur tout le trajet.',
        'Résultat : 306 m² de sentiers au lieu de 590, et 3 % de détour au lieu de 10 %, avec presque tout le trajet sur un sol confortable.',
      ],
      realite: 'Les vrais passants sont entre les deux : ils connaissent souvent leur trajet, mais pas tout le terrain, et réagissent à ce qu’ils voient. Le moindre effort est aussi la base de modèles de foules comme celui de Hughes (2002).',
      ouvrir: ['campus', 'effort'],
    },
    pont: {
      question: 'Deux chemins identiques : les fourmis se partagent-elles ?',
      regles: [
        'Un nid en bas, de la nourriture en haut, deux branches identiques entre les deux (A à gauche, B à droite).',
        '500 fourmis sortent peu à peu du nid. En cherchant, elles marquent le sol d’une phéromone ; en rentrant chargées, d’une autre, et chacune suit celle qui la mène où elle va.',
      ],
      images: { essai1: 'Premier essai, après 3 000 pas', essai2: 'Second essai, après 3 000 pas' },
      regarder: [
        'Au début, les deux branches sont prises à peu près autant.',
        'Puis l’une prend de l’avance, et les fourmis abandonnent l’autre.',
        'D’un essai à l’autre, ce n’est pas toujours la même.',
      ],
      pourquoi: [
        'Une branche un peu plus marquée attire un peu plus de fourmis, qui la marquent davantage : la petite différence du début, due au hasard, est amplifiée jusqu’à ce qu’une seule branche reste. C’est une *brisure de symétrie* : le système est symétrique, son état final ne l’est pas.',
      ],
      realite: 'C’est l’expérience de Deneubourg et ses collègues avec des fourmis d’Argentine : les fourmis finissent par converger sur une branche, au hasard d’un essai à l’autre.',
    },
    pontInegal: {
      question: 'Si une branche est plus courte, les fourmis la trouvent-elles ?',
      regles: [
        'Le même pont, mais la branche B fait un long détour par la droite ; la branche A reste courte.',
        'Les fourmis ne mesurent rien : elles suivent seulement les phéromones.',
      ],
      images: { debut: 'Après 400 pas', fin: 'Après 3 000 pas' },
      regarder: [
        'Au début, les fourmis prennent les deux branches.',
        'Bientôt, presque toutes passent par la branche courte.',
      ],
      pourquoi: [
        'Les fourmis qui ont pris la branche courte arrivent les premières à la nourriture et rentrent les premières : leur piste de retour est marquée avant celle de la branche longue, et la piste aller l’est plus fort, car une fourmi marque d’autant plus qu’elle est partie depuis peu. La boucle fait le reste.',
        'Dans nos 12 essais, la branche courte a gagné 12 fois.',
      ],
      realite: 'Goss et ses collègues (1989) ont observé que les fourmis d’Argentine finissent le plus souvent par prendre la plus courte des deux branches. Ce résultat a inspiré les algorithmes de colonies de fourmis.',
    },
    fourragement: {
      question: 'Comment des pistes naissent-elles sur un terrain ouvert ?',
      regles: [
        'Un nid au centre, trois sources de nourriture, quelques cailloux.',
        '700 fourmis, les mêmes règles que sur le pont.',
      ],
      images: { debut: 'Après 500 pas', fin: 'Après 4 000 pas' },
      regarder: [
        'Au début, l’exploration : les fourmis rayonnent autour du nid.',
        'Puis des pistes nettes vers les trois sources, qui contournent les cailloux et partagent parfois un tronc commun.',
      ],
      pourquoi: [
        'Les premières fourmis à trouver une source rentrent en marquant leur chemin ; les suivantes le suivent et le redressent, car les chemins courts sont mieux marqués. Entre 500 et 4 000 pas, les charges rapportées passent de 265 à près de 12 000.',
      ],
      realite: 'Beaucoup d’espèces de fourmis forment ainsi des réseaux de pistes ramifiés en arbre depuis le nid. Helbing et ses collègues obtiennent des pistes de ce type avec leur modèle de marcheurs actifs appliqué aux fourmis.',
    },
  },
}
