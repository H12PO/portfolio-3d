// ============================================================
//  ARTICLES EN FRANÇAIS : Comprendre, Théorie, Applications, Calcul,
//  Histoire et références, et les textes des figures
//  Blocs : { p }, { liste }, { tex, etroit? }, { figure }, { expert },
//  { frise }, { refs }, { visite }, { code }. Dans le texte : *italique*
//  et $formule$ (LaTeX).
//  Sources principales : Wikipédia (Mandelbrot set, Julia set, Fractal
//  dimension, Coastline paradox, Feigenbaum constants, Newton fractal,
//  Buddhabrot, Lyapunov fractal, Tricorn, Burning Ship, Diffusion-limited
//  aggregation), Mu-Ency (R. Munafo), Devaney (1999), IEEE History Center
//  (antennes), les articles cités dans les références.
//  Les nombres des figures (π, Feigenbaum, dimensions, chronométrages)
//  sont calculés dans le navigateur.
// ============================================================

const tex = String.raw

export const LECTURE_FR = {
  comprendre: [
    {
      id: 'formule', titre: 'Une formule, répétée', blocs: [
        { p: 'Prenez un point c du plan, vu comme un nombre complexe. Partez de z = 0 et répétez sans fin la même opération : élever z au carré, puis ajouter c. Élever au carré un nombre complexe double son angle et met au carré sa distance à 0 ; ajouter c le décale. Deux choses peuvent arriver : ou bien les valeurs de z restent dans une région bornée, ou bien elles s’envolent vers l’infini.' },
        { p: 'L’ensemble de Mandelbrot réunit les points c du premier cas. Cliquez ou glissez sur la carte pour choisir c, et suivez son *orbite*, la suite z₀, z₁, z₂… :' },
        { figure: 'orbite' },
        { p: 'Il suffit de surveiller une seule chose : dès que $|z|$ dépasse 2, la suite part à l’infini, c’est démontré. Pour dessiner l’ensemble, on refait donc le calcul pour chaque pixel, en comptant les étapes avant de dépasser 2. Les points qui ne le dépassent jamais, dans la limite du nombre d’étapes fixé, sont peints en noir.' },
      ],
    },
    {
      id: 'couleurs', titre: 'D’où viennent les couleurs', blocs: [
        { p: 'Le noir est la seule couleur qui ait un sens mathématique : il marque l’ensemble lui-même. Tout le reste est un choix. La couleur d’un point extérieur dit combien d’étapes il lui a fallu pour dépasser 2 : peu au bord de l’image, beaucoup tout près de l’ensemble.' },
        { figure: 'couleurs' },
        { p: 'Compter les étapes donne des bandes. Pour un dégradé continu, on corrige le compte selon la vitesse à laquelle $|z|$ a franchi la limite. L’explorateur va plus loin : la dérivée de la suite sert à éclairer l’image comme un relief, et une estimation de la distance au bord fait ressortir des filaments trop fins pour un pixel.' },
      ],
    },
    {
      id: 'julia', titre: 'Mandelbrot, la carte des Julia', blocs: [
        { p: 'Gardez la formule, mais échangez les rôles. Fixez c une fois pour toutes, et faites varier le point de départ z₀ : les points de départ dont l’orbite reste bornée forment l’*ensemble de Julia* de c. Chaque point c a le sien.' },
        { figure: 'julias' },
        { p: 'L’ensemble de Mandelbrot sert de carte : quand c est dedans, la Julia est d’un seul tenant ; quand c est dehors, elle se brise en poussière. Dans l’explorateur, survolez l’ensemble : la Julia du point survolé s’affiche en bas à droite, et un clic l’ouvre en grand.' },
      ],
    },
    {
      id: 'autres', titre: 'D’autres formules', blocs: [
        { p: 'On peut changer presque tout dans la formule, et chaque changement donne un autre monde. En voici six autres ; les cinq premiers s’ouvrent dans l’explorateur, et l’onglet Théorie les explique un à un :' },
        { figure: 'galerie' },
      ],
    },
    {
      id: 'plongee', titre: 'Plonger', blocs: [
        { p: 'L’ensemble de Mandelbrot n’a pas de fond. Partout sur son bord, en zoomant, on trouve de nouvelles spirales, de nouveaux filaments, et des copies réduites de l’ensemble entier : les mini-Mandelbrot. La visite guidée descend jusqu’à un zoom de 2,5 milliards.' },
        { visite: 'Suivre la visite guidée', aide: 'Elle s’ouvre dans l’explorateur ; « Continuer » passe à l’étape suivante.' },
        { p: 'Pourquoi s’arrêter là ? Parce que les nombres d’un ordinateur n’ont qu’un nombre fini de chiffres. L’explorateur descend jusqu’à un zoom de mille milliards, $10^{12}$ ; l’onglet Calcul raconte comment, et ce qu’il faudrait pour aller plus loin.' },
      ],
    },
  ],

  theorie: [
    {
      id: 'fractale', titre: 'Qu’est-ce qu’une fractale ?', blocs: [
        { p: 'Les figures de la géométrie classique, droites, cercles, polygones, deviennent simples quand on les regarde de près : un petit bout de cercle ressemble à un segment. Une fractale fait le contraire. À quelque échelle qu’on la regarde, elle reste aussi découpée, et souvent un morceau ressemble au tout. On parle d’*autosimilarité*.' },
        { p: 'Il n’existe pas de définition unique. Benoît Mandelbrot forge le mot en 1975, à partir du latin *fractus*, « brisé ». En 1977, il propose une définition précise : une fractale est un ensemble dont la dimension de Hausdorff dépasse la dimension topologique. Il la juge lui-même trop étroite par la suite. En pratique, on reconnaît une fractale à trois traits : du détail à toutes les échelles, une forme trop irrégulière pour la géométrie classique, et une dimension qui n’est souvent pas un nombre entier.' },
        { p: 'Les premiers exemples sont bien plus anciens que le mot. À la fin du XIXe siècle, des mathématiciens construisent des objets pour mettre l’intuition en défaut : une courbe continue qui n’a de tangente nulle part (Karl Weierstrass, 1872), une poussière de points aussi nombreux que ceux de la droite entière (Georg Cantor, 1883), une courbe qui remplit tout un carré (Giuseppe Peano, 1890). Charles Hermite écrit en 1893 qu’il se détourne « avec effroi et horreur de cette plaie lamentable des fonctions continues qui n’ont point de dérivées ». Trois de ces « monstres » se construisent en répétant une seule étape :' },
        { figure: 'construction' },
        { p: 'À chaque étape du flocon de Koch (Helge von Koch, 1904), chaque segment est remplacé par quatre segments trois fois plus courts : la longueur est multipliée par 4/3. Après une infinité d’étapes, le périmètre est infini, alors que le flocon tient dans un disque. Le triangle de Sierpiński (Wacław Sierpiński, 1915) perd un quart de son aire à chaque étape : il finit d’aire nulle, sans être pour autant une simple ligne. L’ensemble de Cantor a une longueur nulle, mais une infinité non dénombrable de points. Ni la longueur ni l’aire ne conviennent pour mesurer ces objets. Il faut une autre notion.' },
      ],
    },
    {
      id: 'dimension', titre: 'Mesurer l’irrégulier : la dimension', blocs: [
        { p: 'Coupez un segment en morceaux trois fois plus petits : vous en obtenez 3. Un carré donne 9 petits carrés, un cube 27 petits cubes. En divisant les longueurs par k, on obtient $k^D$ copies, et l’exposant D est la dimension : 1, 2 ou 3. Le flocon de Koch, lui, se découpe en 4 copies réduites d’un facteur 3. Il faudrait donc $3^D = 4$, soit' },
        { tex: tex`D = \frac{\log 4}{\log 3} \approx 1{,}262.` },
        { p: 'Plus qu’une ligne, moins qu’une surface. La même règle donne $\\log 2/\\log 3 \\approx 0{,}631$ pour l’ensemble de Cantor et $\\log 3/\\log 2 \\approx 1{,}585$ pour le triangle de Sierpiński. Ce nombre mesure la façon dont la forme remplit l’espace à mesure qu’on la regarde de plus près.' },
        { p: 'Les formes qui ne sont pas faites de copies exactes, comme une côte ou un ensemble de Julia, se mesurent en comptant des boîtes. On pose sur la forme une grille de côté ε et l’on compte les cases touchées, N(ε). Si $N(\\varepsilon) \\approx C\\,\\varepsilon^{-D}$, les points $(\\log 1/\\varepsilon,\\, \\log N)$ s’alignent sur une droite de pente D. Essayez :' },
        { figure: 'boites' },
        { p: 'Le calcul retrouve les valeurs exactes à quelques centièmes près ; l’écart vient de la trame, qui ne peut pas descendre sous la taille d’un point. Pour le bord de l’ensemble de Julia du lapin, aucune formule simple ne donne la dimension : seul le calcul l’estime.' },
        {
          expert: 'la dimension de Hausdorff', blocs: [
            { p: 'Le comptage de boîtes a un défaut : un ensemble dénombrable, que l’on peut ranger en une simple suite de points, en sort avec la dimension 1 s’il est présent partout, comme les nombres rationnels entre 0 et 1. Felix Hausdorff propose en 1918 une définition plus fine. On recouvre l’ensemble E par des morceaux $U_i$ de toutes les tailles, de diamètre au plus δ, et l’on pose' },
            { tex: tex`\mathcal{H}^s(E) = \lim_{\delta \to 0} \, \inf \Big\{ \sum_i (\operatorname{diam} U_i)^s \Big\}.` },
            { p: 'Quand s augmente, cette quantité passe brusquement de l’infini à zéro. Le seuil est la dimension de Hausdorff. Elle vaut 0 pour tout ensemble dénombrable, les rationnels compris, et ne dépasse jamais la dimension des boîtes. Pour une figure faite de N copies d’elle-même réduites d’un facteur k, qui ne se chevauchent pas trop, les deux dimensions coïncident et valent $\\log N / \\log k$ (Patrick Moran, 1946).' },
          ],
        },
      ],
    },
    {
      id: 'ifs', titre: 'Des formes faites de leurs propres copies', blocs: [
        { p: 'Le triangle de Sierpiński est fait de trois copies de lui-même, deux fois plus petites. Renversons le point de vue. Donnons-nous trois transformations du plan : chacune réduit tout de moitié et pousse vers l’un des coins. Existe-t-il une forme qui soit exactement la réunion de ses trois images ? John Hutchinson démontre en 1981 que oui, et qu’elle est unique : pour toute famille de transformations contractantes $f_1, \\dots, f_k$, il existe un seul ensemble compact A tel que' },
        { tex: tex`A = f_1(A) \cup f_2(A) \cup \dots \cup f_k(A).` },
        { p: 'On appelle A l’*attracteur* de ce système de fonctions itérées. Michael Barnsley en fait un outil de dessin : quatre transformations affines suffisent pour une fougère. Pour voir l’attracteur apparaître, il suffit de jouer au hasard. On part d’un point quelconque, on lui applique une des transformations tirée au sort, puis on recommence en marquant chaque point obtenu. C’est le *jeu du chaos* :' },
        { figure: 'chaos' },
        { p: 'Les tout premiers points tombent n’importe où ; très vite, ils ne quittent plus l’attracteur, qui se dessine de lui-même. Les probabilités changent la vitesse à laquelle chaque partie se remplit, pas la forme finale.' },
        {
          expert: 'pourquoi il n’y a qu’un attracteur', blocs: [
            { p: 'On mesure l’écart entre deux formes compactes A et B par la *distance de Hausdorff* : le plus petit r tel que chacune soit contenue dans le voisinage de rayon r de l’autre. Muni de cette distance, l’ensemble des formes compactes du plan est un espace complet.' },
            { p: 'Si chaque $f_i$ rapproche les points d’un facteur au moins $r < 1$, l’opérateur $W(A) = f_1(A) \\cup \\dots \\cup f_k(A)$ rapproche les formes du même facteur : $d(W(A), W(B)) \\le r\\, d(A, B)$. Le théorème du point fixe de Banach fait le reste. W a un unique point fixe, et l’on y converge en itérant W à partir de n’importe quelle forme. Le jeu du chaos est une version aléatoire de cette itération.' },
            { p: 'Barnsley en tire au milieu des années 1980 le *théorème du collage* : si les images d’une forme par les $f_i$ la recouvrent presque exactement, l’attracteur lui ressemble. C’est le point de départ de la compression fractale des images (onglet Applications).' },
          ],
        },
      ],
    },
    {
      id: 'iterer', titre: 'Itérer une formule', blocs: [
        { p: 'L’ensemble de Mandelbrot n’est pas fait de copies exactes de lui-même, et aucune famille de transformations ne le construit. Il vient d’un autre mécanisme : répéter une fonction, et regarder ce que devient chaque point. C’est l’objet de la *dynamique*.' },
        { p: 'Partons d’une fonction f et d’un point $z_0$. Son *orbite* est la suite $z_1 = f(z_0)$, $z_2 = f(z_1)$, et ainsi de suite. Un *point fixe* $z^*$ vérifie $f(z^*) = z^*$. Près de lui, l’écart à $z^*$ est multiplié à chaque étape par environ $|f\'(z^*)|$ : le point fixe *attire* les points voisins si ce nombre est inférieur à 1, et les *repousse* s’il est supérieur à 1.' },
        { p: 'Prenons $f(z) = z^2$ dans le plan complexe. Élever au carré double l’angle et met au carré la distance à 0. Les points à l’intérieur du cercle de rayon 1 tombent vers 0, ceux de l’extérieur partent à l’infini, et ceux du cercle tournent sur le cercle sans jamais le quitter. La frontière entre les deux destins est un cercle : rien de fractal. Ajoutons une constante, $f_c(z) = z^2 + c$. Dès que c n’est pas nul, la frontière se met à onduler, à se replier sur elle-même, et devient fractale. C’est l’ensemble de Julia de c. L’ensemble de Mandelbrot range tous ces ensembles sur une seule carte. Les sections qui suivent démontrent ses premières propriétés.' },
      ],
    },
    {
      id: 'echappement', titre: 'Pourquoi 2 suffit', blocs: [
        { p: 'Pour dessiner l’ensemble de Mandelbrot, il faut décider pour chaque point c si l’orbite de 0 reste bornée. Notons $f_c(z) = z^2 + c$, et $z_{n+1} = f_c(z_n)$ avec $z_0 = 0$. L’ensemble de Mandelbrot est' },
        { tex: tex`M = \big\{\, c \in \mathbb{C} \;:\; \text{la suite } (z_n) \text{ est bornée} \,\big\}.` },
        { p: 'Impossible de calculer une infinité d’étapes. Heureusement, il existe un point de non-retour : dès que $|z_n| > 2$, la suite s’échappe vers l’infini.' },
        {
          expert: 'la preuve, en trois lignes', blocs: [
            { p: 'Supposons $|z| > 2$ et $|z| \\ge |c|$. Par l’inégalité triangulaire,' },
            { tex: tex`|z^2 + c| \;\ge\; |z|^2 - |c| \;\ge\; |z|^2 - |z| \;=\; |z|\,(|z| - 1).` },
            { p: 'Écrivons $|z| - 1 = 1 + \\varepsilon$ avec $\\varepsilon > 0$ : le module suivant dépasse $|z|\\,(1 + \\varepsilon)$, donc il reste plus grand que 2 et que $|c|$, et l’on peut recommencer. À chaque étape, le module est multiplié par au moins $1 + \\varepsilon$ : la suite part à l’infini.' },
            { p: 'Reste à voir que les deux conditions finissent par être réunies. Si $|c| \\le 2$, dès que $|z_n| > 2$ on a aussi $|z_n| > |c|$. Si $|c| > 2$, c’est vrai dès $z_1 = c$. D’où' },
            { tex: tex`c \in M \iff |z_n| \le 2 \ \text{pour tout } n, \qquad M \subset \{\, |c| \le 2 \,\}.` },
          ],
        },
        { p: 'Ce test ne marche que dans un sens. Un point qui n’a pas dépassé 2 après mille étapes peut le faire à la mille et unième : le noir des images est toujours une approximation, d’autant meilleure qu’on fait plus d’itérations. C’est pourquoi l’explorateur en fait davantage à mesure qu’on zoome.' },
      ],
    },
    {
      id: 'julia', titre: 'Julia : d’un seul tenant, ou en poussière', blocs: [
        { p: 'Pour un c fixé, l’*ensemble de Julia rempli* $K_c$ réunit les points de départ dont l’orbite reste bornée ; son bord est l’ensemble de Julia $J_c$. Gaston Julia et Pierre Fatou en posent les bases à la fin des années 1910, sans aucune image. Ils démontrent un résultat surprenant : tout se joue sur l’orbite d’un seul point, 0.' },
        { p: '*Théorème* (Fatou, Julia). Si l’orbite de 0 reste bornée, c’est-à-dire si $c \\in M$, alors $K_c$ est connexe. Sinon, $K_c$ est un ensemble de Cantor : une poussière de points, sans aucun morceau d’un seul tenant.' },
        { figure: 'dichotomie' },
        { p: 'C’est pourquoi l’ensemble de Mandelbrot est la carte des ensembles de Julia. Le lien va plus loin : en certains points de son bord, les points de Misiurewicz, l’ensemble de Mandelbrot ressemble de plus en plus à la Julia du même point à mesure qu’on zoome (Tan Lei, 1990).' },
        {
          expert: 'pourquoi le point 0 décide de tout', blocs: [
            { p: '0 est le seul point critique de $f_c$, le seul où la dérivée $f_c\'(z) = 2z$ s’annule. Fatou a montré que tout cycle attractif attire l’orbite d’un point critique. Il n’y en a qu’un ici : $f_c$ a au plus un cycle attractif, et c’est l’orbite de 0 qui le trouve.' },
            { p: 'Pour la connexité, on regarde $K_c$ de loin. Loin de l’origine, $f_c$ ressemble à $z \\mapsto z^2$, et l’on mesure la hauteur d’un point par le potentiel' },
            { tex: tex`G_c(z) = \lim_{n \to \infty} \frac{\log |f_c^{\,n}(z)|}{2^n},` },
            { p: 'nul exactement sur $K_c$. Ses courbes de niveau sont des courbes fermées autour de $K_c$. En descendant vers $K_c$, elles restent d’un seul tenant tant qu’elles ne passent pas par un point critique. Si l’orbite de 0 s’échappe, l’une d’elles passe par 0 et se pince en forme de huit : $K_c$ se coupe en deux, puis chaque moitié en deux, sans fin. Il ne reste qu’une poussière.' },
            { p: 'La coloration lissée de l’explorateur est une approximation de ce potentiel.' },
          ],
        },
      ],
    },
    {
      id: 'bulbes', titre: 'Les nombres cachés dans la forme', blocs: [
        { p: 'La grande forme en cœur est la *cardioïde principale* : pour ces c, l’orbite de 0 se pose sur un point fixe. Le disque à sa gauche, centré en −1 et de rayon 1/4, réunit les c pour lesquels l’orbite tourne sur un cycle de 2 points. Chaque bulbe accroché à la cardioïde a sa période, et elle se lit dans sa forme : c’est le nombre de branches de l’antenne qui le prolonge. Survolez la carte :' },
        { figure: 'bulbes' },
        { p: 'Les bulbes sont rangés autour de la cardioïde selon une règle d’arithmétique. Entre le bulbe de période 2 et celui de période 3, le plus grand est de période 5 ; entre ceux de période 3 et 5, il est de période 8 ; puis viennent 13, 21… C’est la suite de Fibonacci, parce que chaque bulbe porte une fraction $p/q$ et que, entre $p/q$ et $r/s$, le plus grand bulbe porte la fraction $(p + r)/(q + s)$ : c’est l’*addition de Farey*.' },
        {
          expert: 'la cardioïde, en une ligne', blocs: [
            { p: 'Un point fixe $z^*$ de $f_c$ vérifie $z^{*2} + c = z^*$, et il attire les orbites voisines quand $|f_c\'(z^*)| = |2z^*| < 1$. Notons $\\mu = 2z^*$ ce multiplicateur. Alors $z^* = \\mu/2$ et' },
            { tex: tex`c = \frac{\mu}{2} - \frac{\mu^2}{4}, \qquad |\mu| < 1.` },
            { p: 'Quand $\\mu$ parcourt le disque unité, c décrit l’intérieur de la cardioïde. Pour $\\mu = e^{2i\\pi p/q}$, sur le bord, on trouve le point où s’accroche le bulbe $p/q$, de période $q$. De même, les deux points d’un cycle de période 2 ont pour produit $z_1 z_2 = c + 1$ ; le cycle attire quand $|f_c\'(z_1) f_c\'(z_2)| = |4(c + 1)| < 1$, c’est-à-dire $|c + 1| < 1/4$ : le disque de gauche.' },
          ],
        },
        { p: 'Et π ? Au début des années 1990, David Boll cherche à vérifier que le cou qui relie la cardioïde au disque de gauche, en $c = -3/4$, est d’épaisseur nulle. Il compte les itérations nécessaires pour s’échapper depuis $c = -3/4 + i\\varepsilon$, juste au-dessus du cou, et découvre que ce nombre, multiplié par ε, tend vers π. Le calcul tourne ici :' },
        { figure: 'pi' },
        { p: 'La même chose se produit à la pointe de la cardioïde, en $c = 1/4 + \\varepsilon$, avec cette fois $N\\sqrt{\\varepsilon}$. Aaron Klebanoff en publie une preuve en 2001.' },
      ],
    },
    {
      id: 'chaos', titre: 'La route vers le chaos', blocs: [
        { p: 'Restons sur l’axe réel. Pour c entre −2 et 1/4, l’orbite de 0 reste bornée, mais elle ne fait pas toujours la même chose. Entre −3/4 et 1/4, elle se pose sur un point fixe. De −3/4 à −5/4, elle oscille entre 2 valeurs, puis entre 4, puis entre 8 : les doublements se resserrent, et vers $c \\approx -1{,}401\\,155$ commence le chaos.' },
        { figure: 'bifurcation' },
        { p: 'Ce diagramme est célèbre : c’est celui de la suite logistique $x_{n+1} = r\\,x_n(1 - x_n)$, le modèle le plus simple d’une population qui croît puis sature. Le changement de variable $z = r\\,(1/2 - x)$ transforme l’une en l’autre, avec $c = r/2 - r^2/4$ : l’axe réel de l’ensemble de Mandelbrot *est* le diagramme de bifurcation.' },
        { p: 'Les doublements se rapprochent selon une progression presque géométrique. Le rapport de deux écarts successifs tend vers une constante que Mitchell Feigenbaum découvre en 1975 :' },
        { tex: tex`\delta = \lim_{k \to \infty} \frac{c_{k} - c_{k-1}}{c_{k+1} - c_{k}} = 4{,}669\,201\ldots` },
        { p: 'Feigenbaum montre qu’elle ne dépend pas de la formule : toutes les familles dont le graphe n’a qu’une bosse arrondie passent au chaos avec la même constante. En 1982, Oscar Lanford le démontre avec l’aide d’un ordinateur.' },
        {
          expert: 'pourquoi le cycle double', blocs: [
            { p: 'Un point fixe attractif devient instable quand son multiplicateur franchit −1. Sur l’axe réel, le point fixe attractif de $f_c$ est $z^* = (1 - \\sqrt{1 - 4c})/2$, de multiplicateur $\\mu = 1 - \\sqrt{1 - 4c}$, qui vaut −1 pour $c = -3/4$. À cet instant, $f_c \\circ f_c$ voit naître deux nouveaux points fixes : un cycle de période 2.' },
            { p: 'Le même scénario se répète pour $f_c^{\\,2}$, puis $f_c^{\\,4}$, et ainsi de suite. Chaque doublement est une copie du précédent, réduite d’environ 4,669 en largeur et d’environ 2,503 en hauteur : c’est l’idée de la *renormalisation*, qui explique pourquoi la constante est universelle.' },
          ],
        },
      ],
    },
    {
      id: 'variantes', titre: 'Burning Ship, Tricorn, Multibrot : changer la formule', blocs: [
        { p: 'Les trois premières variantes de l’explorateur gardent le même principe, une suite partie de 0 et un test d’évasion, et changent un seul détail de la formule. Ce détail suffit à changer ce que l’on peut démontrer.' },
        { figure: 'vignettes', ids: ['burning', 'tricorn', 'multibrot'] },
        { p: '*La Burning Ship* (Michael Michelitsch et Otto Rössler, 1992) rend positives les deux parties de z avant de l’élever au carré : $z_{n+1} = (|x_n| + i\\,|y_n|)^2 + c$. La valeur absolue replie le plan sur un quart avant chaque étape. La formule n’est plus *holomorphe* : elle ne se dérive plus comme une fonction de la variable complexe. Or les théorèmes de Fatou et Julia, la connexité démontrée par Douady et Hubbard, tout cela repose sur cette propriété. On ne sait presque rien démontrer sur la Burning Ship. Elle doit son nom au navire en flammes qui se dessine sur son antenne, à gauche.' },
        { p: '*Le Tricorn* remplace z par son conjugué : $z_{n+1} = \\bar z_n^{\\,2} + c$. La formule est *antiholomorphe*, mais deux étapes de suite redonnent une fonction holomorphe de z, si bien qu’une partie de la théorie survit : Shizuo Nakane montre en 1993 que l’ensemble est connexe. La symétrie change. Si l’on multiplie c par $\\omega = e^{2i\\pi/3}$, toute l’orbite de 0 est multipliée par ω, d’où les trois pointes. John Milnor, qui lui donne son nom en 1992, en trouve des copies dans les familles de polynômes de degré 3. Et John Hubbard et Dierk Schleicher montrent en 2014 qu’il n’est pas *connexe par arcs* : d’un seul tenant, il contient pourtant des points qu’aucun chemin tracé dans l’ensemble ne relie.' },
        { p: '*Les Multibrot* changent de puissance : $z_{n+1} = z_n^d + c$. Pour un entier d, presque toute la théorie se transpose. L’ensemble est connexe, et l’orbite de 0 décide encore de tout, car 0 reste le seul point critique. Remplacer c par $e^{2i\\pi/(d-1)} c$ fait tourner toute l’orbite du même angle : d’où $d - 1$ axes de symétrie. Quand d grandit, l’ensemble s’arrondit et se rapproche du disque de rayon 1. Pour un degré non entier, la puissance d’un nombre complexe n’a plus de valeur unique : il faut choisir une coupure, et l’image se fend le long de cette coupure.' },
      ],
    },
    {
      id: 'newton', titre: 'Newton : à la recherche des racines', blocs: [
        { p: 'Pour résoudre une équation $p(z) = 0$, la méthode de Newton part d’une estimation et l’améliore en suivant la tangente :' },
        { tex: tex`z_{n+1} = z_n - \frac{p(z_n)}{p'(z_n)}.` },
        { p: 'Près d’une racine, la méthode est redoutable : le nombre de chiffres justes double à chaque étape. Mais si l’on part de loin, où arrive-t-on ? En 1879, Arthur Cayley pose la question dans le plan complexe. Pour un polynôme à deux racines, la réponse est simple : chaque point de départ va vers la racine la plus proche, et la frontière entre les deux est une droite. Pour trois racines, Cayley avoue ne pas savoir.' },
        { figure: 'vignettes', ids: ['newton', 'newtonZoom', 'cycle'] },
        { p: 'L’image montre pourquoi. L’explorateur colore chaque point de départ selon la racine atteinte. Les trois bassins ne sont pas séparés par des lignes : là où deux couleurs se touchent, la troisième s’intercale, puis de nouveau les deux autres, à toutes les échelles. C’est un théorème de la dynamique complexe : le bord de chaque bassin est l’ensemble de Julia de la fonction $z \\mapsto z - p(z)/p\'(z)$, le même pour les trois. Tout point du bord d’un bassin est donc au bord des trois à la fois.' },
        { p: 'Il y a pire. Pour $p(z) = z^3 - 2z + 2$, la méthode partie de 0 va en 1, puis revient en 0, sans fin, et tout un voisinage de ce cycle ne converge vers aucune racine : ce sont les zones noires de la troisième image. Curtis McMullen a montré en 1987 qu’aucune méthode de ce genre, une formule fixe que l’on répète, ne trouve une racine depuis presque tout point de départ pour tous les polynômes de degré 4 ou plus. On sait pourtant s’en sortir : John Hubbard, Dierk Schleicher et Scott Sutherland donnent en 2001 une liste explicite de points de départ, environ $1{,}1\\, d \\log^2 d$ pour le degré d, qui trouvent à coup sûr toutes les racines.' },
        {
          expert: 'pourquoi les chiffres justes doublent', blocs: [
            { p: 'Notons $N(z) = z - p(z)/p\'(z)$, et r une racine simple. Alors $N(r) = r$ et $N\'(z) = p(z)\\,p\'\'(z)/p\'(z)^2$, donc $N\'(r) = 0$ : la racine est un point fixe *super-attractif*. En développant près de r,' },
            { tex: tex`N(z) - r \approx \frac{p''(r)}{2\,p'(r)}\,(z - r)^2.` },
            { p: 'L’erreur est élevée au carré à chaque étape : $10^{-3}$ devient $10^{-6}$, puis $10^{-12}$. Le réglage « relaxation » de l’explorateur remplace l’étape par $z - a\\,p(z)/p\'(z)$. Pour $a \\ne 1$, la racine n’est plus super-attractive, la convergence ralentit et les frontières changent d’allure.' },
          ],
        },
      ],
    },
    {
      id: 'lyapunov', titre: 'Lyapunov : l’ordre et le chaos sur une carte', blocs: [
        { p: 'La suite logistique $x_{n+1} = r\\,x_n(1 - x_n)$, déjà croisée sur la route vers le chaos, décrit une population qui croît au taux r puis sature. Selon r, elle se stabilise, oscille ou devient chaotique. Mario Markus, qui étudie à la fin des années 1980 des populations soumises à un milieu changeant, fait alterner le taux entre deux valeurs a et b selon une suite fixée, par exemple AB ou AABAB. Chaque point (a, b) du carré $[0, 4]^2$ reçoit une couleur, selon que la suite obtenue est ordonnée ou chaotique.' },
        { figure: 'vignettes', ids: ['lyapunov', 'lyapunovB'] },
        { p: 'Pour trancher, on mesure l’*exposant de Lyapunov*, la vitesse moyenne à laquelle deux populations presque identiques s’écartent :' },
        { tex: tex`\lambda = \lim_{N \to \infty} \frac{1}{N} \sum_{n=1}^{N} \log \big| r_n \,(1 - 2x_n) \big|.` },
        { p: 'Si λ est négatif, les écarts se résorbent et la suite finit par se répéter : l’explorateur colore ces points. S’il est positif, la moindre différence grandit comme $e^{\\lambda n}$ : c’est le chaos, en noir. Sur la diagonale a = b, le taux ne change plus, et l’on retrouve la suite logistique ordinaire et son diagramme de bifurcation. La seconde image utilise la suite BBBBBBAAAAAA.' },
        {
          expert: 'd’où vient la formule', blocs: [
            { p: 'Deux départs voisins $x_0$ et $x_0 + \\varepsilon$ sont, après n étapes, à une distance d’environ $\\varepsilon\\,|(f^n)\'(x_0)|$. La dérivée d’une composée est le produit des dérivées : $(f^n)\'(x_0) = f\'(x_0)\\, f\'(x_1) \\cdots f\'(x_{n-1})$. Pour $f(x) = r\\,x(1 - x)$, $f\'(x) = r\\,(1 - 2x)$. Le logarithme change le produit en somme, et l’on fait la moyenne par étape : c’est λ. Le nom vient d’Alexandre Liapounov, qui étudie en 1892 la stabilité des mouvements.' },
          ],
        },
      ],
    },
    {
      id: 'bouddha', titre: 'Le Buddhabrot : où passent les orbites', blocs: [
        { p: 'Les images précédentes colorent des points de départ. Le Buddhabrot, que Melinda Green décrit en 1993, montre autre chose : des trajets. On tire au hasard des millions de points c. Pour chaque c dont l’orbite de 0 s’échappe, on repasse sur toute l’orbite $z_1, z_2, \\dots$ et l’on ajoute 1 à chaque pixel traversé. L’image est une carte de densité. Elle montre où passent les orbites qui finissent par s’échapper, dans le plan des z et non plus dans celui des c.' },
        { figure: 'vignettes', ids: ['buddha', 'nebula'] },
        { p: 'Tournée d’un quart de tour, elle évoque un bouddha assis. La variante *Nebulabrot* refait le compte avec trois limites d’itérations, ici 2 000, 200 et 20, et les place dans le rouge, le vert et le bleu, comme les images en fausses couleurs des nébuleuses. Les orbites longues viennent des points c tout près du bord de l’ensemble de Mandelbrot, et dessinent les détails les plus fins.' },
        { p: 'C’est aussi la plus coûteuse de ces images. Il faut des millions d’orbites pour une image propre, et dès qu’on zoome, la plupart des orbites tirées au hasard ne traversent même pas la vue. Calculée en direct, elle ralentissait tout l’ordinateur : elle n’est donc pas dans l’explorateur. L’onglet Calcul explique pourquoi elle coûte si cher.' },
      ],
    },
    {
      id: 'inconnu', titre: 'Ce que l’on sait, ce que l’on ignore', blocs: [
        { p: 'Malgré ses images connues de tous, l’ensemble de Mandelbrot reste un objet de recherche active. Au début des années 1980, Adrien Douady et John Hubbard démontrent qu’il est connexe : d’un seul tenant, même là où ses morceaux semblent séparés. En 1991, Mitsuhiro Shishikura montre que son bord est aussi épais qu’une courbe peut l’être : sa dimension de Hausdorff vaut 2, comme celle d’une surface.' },
        { p: 'La grande question ouverte est la conjecture *MLC* : l’ensemble est-il *localement connexe* ? Autrement dit, deux points proches de l’ensemble peuvent-ils toujours être reliés par un chemin qui reste dans l’ensemble et près d’eux ? Si c’est le cas, Douady et Hubbard ont montré que toute sa forme se décrit par une combinatoire explicite, et l’on obtient la *densité de l’hyperbolicité* : tout point c peut être approché par des points dont l’orbite de 0 tombe sur un cycle attractif. Jean-Christophe Yoccoz démontre MLC en tous les points qui ne sont pas « infiniment renormalisables », l’un des travaux qui lui valent la médaille Fields en 1994. Sur l’axe réel, la densité de l’hyperbolicité est établie en 1997, par Jacek Graczyk et Grzegorz Świątek d’une part, par Mikhaïl Lyubich d’autre part. Le cas général résiste toujours.' },
        { p: 'D’autres questions ont l’air plus simples et ne le sont pas. L’aire de l’ensemble vaut environ 1,5066, d’après des décomptes de pixels toujours plus fins, mais on n’en connaît pas la valeur exacte, et les encadrements démontrés restent larges. On ne sait pas si son bord, de dimension 2, a une aire non nulle. Pour les ensembles de Julia, la question est tranchée en 2012 : Xavier Buff et Arnaud Chéritat construisent des ensembles de Julia quadratiques d’aire strictement positive.' },
      ],
    },
  ],

  applications: [
    {
      id: 'nature', titre: 'La géométrie de la nature', blocs: [
        { p: 'En 1982, Benoît Mandelbrot ouvre *The Fractal Geometry of Nature* sur un constat : les nuages, les montagnes, les côtes ou l’écorce des arbres n’ont pas les formes lisses de la géométrie d’Euclide. Pour lui, les fractales ne sont pas des curiosités de mathématiciens, mais le langage qui manquait pour décrire ces formes. Le premier exemple qu’il étudie, dès 1967, est une côte.' },
        { p: 'Le météorologue anglais Lewis Fry Richardson s’était demandé si la longueur de la frontière entre deux pays influait sur leur risque d’entrer en guerre. En rassemblant les chiffres, il découvre qu’ils ne s’accordent pas : l’Espagne donnait 987 km pour sa frontière avec le Portugal, le Portugal 1 214 km. La raison est géométrique. On mesure une côte ou une frontière avec une règle ; plus la règle est courte, plus elle suit de détours, et plus la longueur grandit. Mesurez cette île imaginaire :' },
        { figure: 'littoral' },
        { p: 'Richardson observe que la longueur mesurée suit une loi de puissance de la taille de la règle, avec un exposant propre à chaque côte. Mandelbrot y lit en 1967 une dimension fractale : environ 1,25 pour la côte ouest de la Grande-Bretagne, très découpée, et 1,02 pour celle de l’Afrique du Sud, presque lisse. La question « quelle est la longueur de cette côte ? » n’a pas de réponse. La question « quelle est sa dimension ? » en a une.' },
      ],
    },
    {
      id: 'vivant', titre: 'Le vivant : remplir un volume avec des tuyaux', blocs: [
        { p: 'Le corps humain est plein de réseaux qui se ramifient : bronches, artères, veines, nerfs. Dans les poumons, la trachée se divise en deux bronches, qui se divisent à leur tour, environ 23 fois de suite, jusqu’aux alvéoles. L’arbre obtenu loge une surface d’échange de plusieurs dizaines de mètres carrés dans le volume de la cage thoracique. Les vaisseaux sanguins suivent la même logique : presque aucune cellule n’est à plus de quelques dixièmes de millimètre d’un capillaire.' },
        { p: 'Une ramification fractale dessert tout un volume avec un réseau de longueur et de volume limités. C’est l’argument que Geoffrey West, James Brown et Brian Enquist avancent en 1997 pour expliquer la *loi de Kleiber* : chez les mammifères, de la souris à l’éléphant, la dépense d’énergie au repos croît comme la masse à la puissance 3/4. Leur modèle reste discuté, mais il a fait des réseaux fractals un sujet central de la biologie théorique.' },
        { p: 'Les plantes en offrent les exemples les plus visibles : les branches d’un arbre, les frondes d’une fougère, les pointes du chou romanesco, qui répètent la forme entière sur cinq ou six niveaux. Dans la nature, l’autosimilarité s’arrête toujours à une échelle, celle de la cellule ou de la feuille : une fractale réelle n’a qu’un nombre fini d’étages.' },
        { p: 'La médecine s’en sert aussi comme mesure. Le rythme d’un cœur en bonne santé n’est pas régulier : ses fluctuations ont la même allure sur quelques secondes et sur quelques heures. L’équipe d’Ary Goldberger a montré que cette structure s’appauvrit avec l’âge et avec certaines maladies cardiaques. La dimension fractale du contour d’une tumeur, des vaisseaux de la rétine ou de la trame d’un os est étudiée comme indicateur ; ces mesures restent surtout des outils de recherche.' },
      ],
    },
    {
      id: 'antennes', titre: 'Des antennes dans nos poches', blocs: [
        { p: 'En 1987, Nathan Cohen, radioastronome à l’université de Boston et radioamateur, assiste à une conférence de Mandelbrot. Peu après, il découpe dans du papier d’aluminium une petite antenne en forme de courbe fractale, l’installe à la rambarde de son appartement, et constate qu’elle fonctionne aussi bien qu’une antenne ordinaire bien plus grande. Il dépose un brevet en 1995 et publie la même année ses premiers résultats.' },
        { p: 'Deux propriétés font l’intérêt de ces antennes. Une courbe fractale loge une grande longueur de conducteur dans une petite surface : l’antenne est compacte. Et une forme qui se répète à plusieurs échelles résonne à plusieurs fréquences : l’antenne en triangle de Sierpiński de Carles Puente et de ses collègues (1996) fonctionne sur plusieurs bandes à la fois. Or un téléphone doit capter en même temps les réseaux mobiles, le wifi, le Bluetooth et le GPS. Des antennes de ce type équipent des téléphones, des étiquettes RFID et des radars de voiture.' },
      ],
    },
    {
      id: 'images', titre: 'Des paysages qui n’existent pas', blocs: [
        { p: 'En 1980, Loren Carpenter, ingénieur chez Boeing, présente au congrès SIGGRAPH *Vol Libre*, un court film qui survole des montagnes entièrement calculées. Sa méthode reprend une idée de Mandelbrot. On part de quelques grands triangles, on coupe chaque côté en deux, on déplace le milieu au hasard, d’autant moins que le côté est court, et l’on recommence. Lucasfilm l’embauche. Deux ans plus tard, ses montagnes fractales forment la planète de la séquence Genesis de *Star Trek II*, l’une des premières scènes de cinéma entièrement en images de synthèse.' },
        { p: 'Le réglage décisif est la vitesse à laquelle les déplacements diminuent d’une échelle à l’autre. On la note H, l’*exposant de Hurst* : chaque fois que la taille est divisée par deux, l’amplitude est multipliée par $2^{-H}$. Un H petit donne un relief hérissé, un H grand des collines douces, et le profil a pour dimension $2 - H$.' },
        { figure: 'relief' },
        { p: 'Ken Perlin, qui a travaillé sur les images de *Tron* (1982) et les trouve trop lisses, invente l’année suivante un « bruit » aléatoire mais régulier ; il reçoit pour cela un Oscar technique en 1997. Superposer ce bruit à plusieurs échelles, chaque couche deux fois plus fine et moins forte que la précédente, donne un relief fractal. Cette recette produit aujourd’hui les terrains de nombreux jeux vidéo, des nuages, du feu, et des textures de marbre ou de bois.' },
      ],
    },
    {
      id: 'compression', titre: 'Compresser une image avec ses propres copies', blocs: [
        { p: 'Le théorème du collage (onglet Théorie) suggère une idée audacieuse : décrire une image non par ses pixels, mais par une liste de transformations dont elle serait à peu près l’attracteur. Quelques dizaines de nombres suffisent pour une fougère entière. Michael Barnsley fonde en 1987 la société Iterated Systems pour exploiter cette idée.' },
        { p: 'Une photographie n’est pas l’attracteur d’un petit système de transformations. En 1992, Arnaud Jacquin, ancien doctorant de Barnsley, rend la méthode praticable : on découpe l’image en petits blocs, et l’on cherche pour chacun un bloc plus grand de la même image qui, réduit, éclairci ou retourné, lui ressemble. Le décodage est rapide, et l’image peut être agrandie à volonté : les détails inventés ont l’allure des vrais. L’encyclopédie Encarta de Microsoft s’en est servie pour ses images au début des années 1990.' },
        { p: 'L’encodage, lui, est très lent, car il faut comparer chaque bloc à tous les autres. Le JPEG, puis les ondelettes, l’ont emporté. La compression fractale reste un bel exemple d’un théorème abstrait devenu, un temps, un produit.' },
      ],
    },
    {
      id: 'hasard', titre: 'Le hasard sauvage : bourse, réseaux et musique', blocs: [
        { p: 'En 1963, Mandelbrot étudie des décennies de prix du coton. Les modèles de l’époque supposent que les variations suivent une courbe en cloche, où les très grands écarts sont rarissimes. Les données disent autre chose : les krachs et les envolées sont bien plus fréquents que prévu, et une courbe de prix a la même allure, qu’on la regarde sur un jour, un mois ou une année. Une série de nombres dans le temps peut, elle aussi, être fractale.' },
        { p: 'Il appelle ce comportement le « hasard sauvage », et propose plus tard des modèles *multifractals* des marchés, longtemps ignorés des manuels de finance. Les krachs de 1987 et de 2008 lui ont donné une audience nouvelle, sans que ces modèles remplacent les outils habituels.' },
        { p: 'Le même constat surgit dans les réseaux informatiques. En 1994, Will Leland et ses collègues analysent des millions de paquets circulant sur un réseau Ethernet. Le trafic arrive par rafales, et ces rafales se regroupent elles-mêmes en rafales, de la milliseconde à l’heure. Les modèles classiques, qui prévoyaient un trafic lissé à grande échelle, sous-estimaient les pics : il a fallu revoir le dimensionnement des réseaux.' },
        { p: 'Et dans la musique. En 1975, Richard Voss et John Clarke mesurent les fluctuations de l’intensité et de la hauteur dans des enregistrements de musique classique, de jazz ou de rock. Elles suivent un *bruit en 1/f*, autosimilaire lui aussi, à mi-chemin entre le hasard pur et la répétition. Des mélodies tirées au hasard selon ce bruit paraissent plus musicales à leurs auditeurs que des mélodies tirées au hasard pur.' },
      ],
    },
    {
      id: 'physique', titre: 'Croissances et désordres', blocs: [
        { p: 'Une particule qui erre au hasard finit par heurter un amas et s’y colle ; une autre suit, puis une autre. En 1981, Thomas Witten et Leonard Sander montrent que cette règle, l’*agrégation limitée par diffusion*, fait pousser des arbres ramifiés de dimension proche de 1,71. Les branches les plus avancées captent presque toutes les particules, et les creux ne se remplissent jamais :' },
        { figure: 'agregation' },
        { p: 'On retrouve ces formes dans les dépôts de métal par électrolyse, dans les dendrites d’oxyde de manganèse qui couvrent certaines roches et que l’on prend parfois pour des fossiles, ou dans les figures de Lichtenberg qu’une décharge électrique grave dans un isolant. La foudre se ramifie selon un mécanisme voisin.' },
        { p: 'En physique statistique, les fractales apparaissent aux *points critiques*, quand un système hésite entre deux états. Remplissez une grille au hasard : juste au seuil où un chemin de cases pleines traverse la grille d’un bord à l’autre, l’amas qui le porte est une fractale de dimension 91/48, environ 1,896, une valeur connue exactement. La turbulence, enfin, transporte l’énergie des grands tourbillons vers les petits par une cascade sans échelle privilégiée. Richardson la résume en 1922 par une comptine : « Big whirls have little whirls that feed on their velocity, and little whirls have lesser whirls and so on to viscosity » (les grands tourbillons en ont de petits, qui se nourrissent de leur vitesse, et les petits en ont de plus petits, et ainsi de suite jusqu’à la viscosité).' },
      ],
    },
    {
      id: 'art', titre: 'Dans l’art', blocs: [
        { p: 'En 1999, le physicien Richard Taylor affirme dans *Nature* que les toiles de Jackson Pollock, faites de peinture projetée, ont une structure fractale, et que leur dimension augmente au fil de sa carrière. Il propose même de s’en servir pour authentifier des tableaux. En 2006, Katherine Jones-Smith et Harsh Mathur contestent la méthode dans la même revue : des dessins sans aucun rapport avec Pollock passaient le test. Le débat a surtout montré combien une dimension mesurée sur quelques échelles seulement est fragile.' },
        { p: 'Le chercheur Ron Eglash relève dans de nombreuses cultures africaines des motifs qui se répètent à plusieurs échelles : plans de villages faits d’enclos dans des enclos, coiffures tressées, tissus, sculptures. Son livre *African Fractals* (1999) y voit des savoirs mathématiques à part entière. Bien avant le mot, M. C. Escher dessinait dans les années 1950 des pavages dont les motifs rapetissent sans fin vers le bord d’un cercle.' },
        { p: 'Les images de cet explorateur sont devenues un art à part entière, des affiches des années 1980 aux zooms de plusieurs heures publiés en ligne. Chacune est entièrement déterminée par une formule de quelques symboles et par les choix de couleur de celui qui l’a calculée.' },
      ],
    },
  ],

  calcul: [
    {
      id: 'gpu', titre: 'Un calcul par pixel', blocs: [
        { p: 'Une image de 1 920 × 1 080 compte plus de deux millions de pixels. Avec mille itérations par pixel, cela fait deux milliards d’opérations pour une seule image. Mais le calcul a une propriété précieuse : chaque pixel est indépendant de ses voisins. C’est exactement le travail pour lequel une carte graphique est faite. Elle possède des milliers de petites unités de calcul, qui exécutent toutes le même programme, un *shader*, chacune sur son pixel.' },
        { p: 'Mesurez-le dans votre navigateur : la même image, calculée en JavaScript par le processeur, puis par la carte graphique.' },
        { figure: 'banc' },
        { p: 'L’explorateur calcule en deux passes. La première écrit, pour chaque pixel, des nombres bruts dans une texture : le nombre d’itérations lissé, l’éclairage du relief, la distance au bord. La seconde les traduit en couleurs. Changer de palette ne demande donc aucun nouveau calcul. Pendant un mouvement, l’image est calculée à la plus grande résolution qui suit le rythme de l’écran, puis agrandie avec lissage. À l’arrêt, la pleine résolution arrive bande par bande, pour ne jamais bloquer la carte graphique. Puis l’image s’affine : chaque nouveau passage décale les points de calcul d’une fraction de pixel, et la moyenne des passages efface les escaliers des bords. C’est l’*anticrénelage*.' },
        {
          expert: 'le cœur du programme', blocs: [
            { p: 'Le shader, en GLSL. gl_FragCoord est la position du pixel ; chaque pixel exécute la boucle de son côté.' },
            { code: 'vec2 c = centre + (gl_FragCoord.xy - 0.5 * taille) * pas;\nvec2 z = vec2(0.0);\nfor (int i = 0; i < iterations; i++) {\n  z = vec2(z.x * z.x - z.y * z.y, 2.0 * z.x * z.y) + c;\n  if (dot(z, z) > 4.0) { n = i; break; }\n}' },
          ],
        },
      ],
    },
    {
      id: 'couleurs', titre: 'Des couleurs qui suivent le zoom', blocs: [
        { p: 'La couleur d’un point extérieur vient du nombre d’itérations n qu’il lui a fallu pour s’échapper. Pour éviter les marches d’escalier, on corrige ce nombre selon la taille finale de z, ce qui donne un nombre réel qui varie continûment d’un pixel à l’autre :' },
        { tex: tex`\nu = n + 2 - \log_2 \ln |z_n|.` },
        { p: 'Loin de l’ensemble, $|z|$ est élevé au carré à chaque étape, donc $\\ln |z|$ double et $\\log_2 \\ln |z|$ augmente de 1 par itération : les deux termes se compensent, et ν ne dépend pas de l’étape à laquelle on s’arrête. On passe ensuite ν dans une palette, une fonction périodique qui associe une couleur à chaque nombre. Celle de l’explorateur reprend une formule d’Inigo Quilez : trois cosinus décalés, $0{,}5 + 0{,}5\\cos(2\\pi t + \\varphi)$, un pour le rouge, un pour le vert, un pour le bleu.' },
        { p: 'Reste à choisir combien de tours de palette pour une itération. Plus on zoome, plus les points proches du bord demandent d’itérations, et plus l’écart entre deux pixels voisins se compte en dizaines d’itérations. Avec une densité fixe, les couleurs défilent alors si vite qu’elles se brouillent en une bouillie. L’échelle « adaptée au zoom », reprise elle aussi de Quilez, divise ν par $1 + \\log_2 Z$ au zoom Z : les bandes s’élargissent à mesure qu’on descend, et l’image reste lisible à toutes les profondeurs.' },
      ],
    },
    {
      id: 'precision', titre: 'Pourquoi l’image finit par pixeliser', blocs: [
        { p: 'La carte graphique calcule avec des nombres à virgule de 32 bits. Ils ont 24 chiffres binaires, soit environ 7 chiffres décimaux : entre 1/2 et 1, deux nombres voisins sont séparés de $2^{-24} \\approx 6 \\times 10^{-8}$. Quand on zoome, deux pixels voisins finissent par correspondre exactement au même nombre. Ils reçoivent alors la même couleur, et l’image se couvre de gros carrés.' },
        { figure: 'precision' },
        { p: 'La limite arrive vite. Si l’image fait 1 000 pixels de haut et couvre une hauteur $3/Z$ du plan au zoom Z, deux pixels voisins sont distants de $3 \\times 10^{-3}/Z$. Près de $|c| \\approx 0{,}7$, il faut que cet écart reste bien plus grand que $2^{-24}$ : le zoom ne peut guère dépasser quelques dizaines de milliers. C’est encore la limite de Newton, de Lyapunov et des Multibrot dans l’explorateur.' },
      ],
    },
    {
      id: 'perturbation', titre: 'Un seul calcul précis : les perturbations', blocs: [
        { p: 'Pour aller plus loin, il faut plus de chiffres. Les cartes graphiques grand public calculent très lentement en 64 bits, et WebGL ne le permet pas du tout. Une première parade porte chaque coordonnée par deux nombres de 32 bits, un fort et un faible, dont la somme est la valeur voulue (Theodorus Dekker, 1971). La précision double, mais chaque multiplication en coûte une vingtaine, et certains compilateurs de shaders « simplifient » les formules au point de détruire la partie faible. Une version précédente de cet explorateur l’utilisait ; sur certaines cartes, elle s’arrêtait à ×30 000.' },
        { p: 'L’explorateur suit désormais une autre idée : ne faire qu’un seul calcul précis. Le processeur, en JavaScript, calcule avec des nombres de 64 bits l’orbite $Z_n$ d’un seul point C, le centre de l’image. Pour chaque pixel $c = C + \\delta c$, la carte graphique ne suit que l’écart $\\delta_n = z_n - Z_n$ entre l’orbite du pixel et celle du centre. On développe $(Z_n + \\delta_n)^2 + C + \\delta c$ et l’on retranche $Z_{n+1} = Z_n^2 + C$ :' },
        { tex: tex`\delta_{n+1} = 2 Z_n\, \delta_n + \delta_n^2 + \delta c.` },
        { p: 'Les grands nombres presque égaux ont disparu de la formule. Il ne reste que des produits de petits écarts, que des nombres de 32 bits portent sans peine, car leur précision est relative : $10^{-12}$ s’écrit aussi bien que 1. Un zoom de $10^{12}$ ne pose plus de problème, sur toutes les cartes graphiques, et le calcul est plus rapide que la double précision émulée.' },
        { p: 'Un piège demeure. Si l’orbite d’un pixel s’écarte trop de celle du centre, l’écart cesse d’être petit et le calcul se trompe sans prévenir : on parle de *glitch*. En 2021, un passionné connu sous le pseudonyme de Zhuoran propose un remède simple. Dès que le pixel passe plus près de 0 que de l’orbite de référence, on repart du début de celle-ci, qui commence justement en 0. L’explorateur applique cette règle à chaque itération ; elle sert aussi quand l’orbite du centre s’échappe avant celle du pixel.' },
        {
          expert: 'Tricorn, Burning Ship et ensembles de Julia', blocs: [
            { p: 'Pour le Tricorn, l’écart se conjugue : $\\delta_{n+1} = \\overline{2 Z_n \\delta_n + \\delta_n^2} + \\delta c$. Pour la Burning Ship, la valeur absolue empêche de développer directement. Avec $z = x + iy$ et $Z = X + iY$, la partie imaginaire de l’écart vaut $2\\,(|xy| - |XY|) + \\delta c_y$. On calcule cette différence de valeurs absolues sans soustraire deux grands nombres, en distinguant les signes :' },
            { tex: tex`|a + d| - |a| = \begin{cases} d & \text{si } a \ge 0 \text{ et } a + d \ge 0, \\ -2a - d & \text{si } a \ge 0 \text{ et } a + d < 0, \\ 2a + d & \text{si } a < 0 \text{ et } a + d > 0, \\ -d & \text{sinon,} \end{cases}`, etroit: tex`\begin{gathered} |a + d| - |a| \in \{\, d,\; -2a - d,\; 2a + d,\; -d \,\} \\[4pt] \text{selon les signes de } a \text{ et de } a + d \end{gathered}` },
            { p: 'avec $a = XY$ et $d = xy - XY = X\\,\\delta_y + \\delta_x\\,(Y + \\delta_y)$, qui ne contient lui aussi que des produits par des écarts. Pour un ensemble de Julia, c est fixé et c’est le point de départ qui varie : $\\delta c = 0$, et $\\delta_0$ est l’écart du pixel au centre. La règle de Zhuoran demande alors une seconde orbite de référence, celle qui part de 0, puisque l’orbite du centre ne commence pas en 0.' },
          ],
        },
        { p: 'Pourquoi s’arrêter à $10^{12}$ ? Le centre lui-même n’est connu qu’avec 16 chiffres décimaux, ceux d’un nombre de 64 bits. Les logiciels spécialisés, comme Kalles Fraktaler, calculent l’orbite de référence avec des centaines de chiffres, et portent les écarts avec un exposant étendu, car même l’exposant d’un nombre ordinaire finit par manquer. Ils dépassent ainsi des zooms de $10^{1000}$. L’idée des perturbations remonte au moins à 1992 ; K. I. Martin l’a popularisée en 2013 avec son logiciel SuperFractalThing.' },
      ],
    },
    {
      id: 'buddhabrot', titre: 'Pourquoi le Buddhabrot n’est pas dans l’explorateur', blocs: [
        { p: 'Le Buddhabrot ne se calcule pas pixel par pixel : chaque point tiré au hasard dépose sa trace sur des centaines de pixels à la fois. Ce travail convient mal à une carte graphique, faite pour des pixels indépendants ; il doit tourner sur le processeur. Une image propre demande des centaines de millions d’étapes de calcul, et tout est à refaire au moindre déplacement.' },
        { p: 'Une première version de l’explorateur le calculait en direct, dans un fil d’exécution séparé. Même ainsi, le processeur restait occupé à plein et tout l’ordinateur ralentissait. Les images de l’onglet Théorie sont calculées une seule fois, en petit format, avec quelques centaines de milliers de points.' },
        { p: 'Zoomer serait pire encore : la plupart des points tirés au hasard ont des orbites qui ne traversent pas la petite région affichée. Il faudrait tirer les points intelligemment, garder ceux dont l’orbite traverse la vue et en chercher d’autres tout près d’eux. C’est l’algorithme de Metropolis, emprunté à la physique statistique, que des programmes spécialisés utilisent pour zoomer dans le Buddhabrot.' },
      ],
    },
  ],

  histoire: [
    {
      id: 'frise', titre: 'Une courte histoire', blocs: [
        {
          frise: [
            ['1872', 'Karl Weierstrass', 'présente une fonction continue qui n’est dérivable en aucun point.'],
            ['1879', 'Arthur Cayley', 'propose d’étudier la méthode de Newton dans le plan complexe, et constate que le cas de trois racines résiste.'],
            ['1883', 'Georg Cantor', 'décrit l’ensemble qui porte son nom.'],
            ['1890', 'Giuseppe Peano', 'construit une courbe qui remplit tout un carré.'],
            ['1904', 'Helge von Koch', 'publie sa courbe, continue et sans tangente.'],
            ['1915', 'Wacław Sierpiński', 'décrit son triangle ; le tapis suit en 1916.'],
            ['1918', 'Gaston Julia', 'publie son mémoire sur l’itération des fractions rationnelles, couronné par l’Académie des sciences. Pierre Fatou mène des recherches parallèles.'],
            ['1918', 'Felix Hausdorff', 'définit la dimension qui porte aujourd’hui son nom.'],
            ['1922', 'Lewis Fry Richardson', 'décrit la turbulence comme une cascade de tourbillons.'],
            ['1961', 'Lewis Fry Richardson', 'observe, dans un texte publié après sa mort, que la longueur mesurée d’une côte dépend de la règle.'],
            ['1963', 'Benoît Mandelbrot', 'montre que les variations du prix du coton ne suivent pas la courbe en cloche.'],
            ['1967', 'Benoît Mandelbrot', 'publie « How long is the coast of Britain? » dans *Science*.'],
            ['1975', 'Benoît Mandelbrot', 'invente le mot « fractale ».'],
            ['1975', 'Mitchell Feigenbaum', 'découvre la constante 4,669…, publiée en 1978.'],
            ['1975', 'Richard Voss et John Clarke', 'trouvent un bruit en 1/f dans la musique.'],
            ['1978', 'Robert Brooks et Peter Matelski', 'tracent une première image de l’ensemble, dans un article sur les groupes kleiniens publié en 1981.'],
            ['1980', 'Benoît Mandelbrot', 'visualise l’ensemble le 1er mars, au centre de recherche d’IBM à Yorktown Heights.'],
            ['1980', 'Loren Carpenter', 'présente *Vol Libre*, un survol de montagnes fractales.'],
            ['1981', 'John Hutchinson', 'démontre l’existence et l’unicité de l’attracteur d’un système de fonctions itérées.'],
            ['1981', 'Thomas Witten et Leonard Sander', 'introduisent l’agrégation limitée par diffusion.'],
            ['1982', 'Oscar Lanford', 'démontre avec l’aide d’un ordinateur l’universalité de la constante de Feigenbaum.'],
            ['1982', 'Star Trek II', 'montre une planète faite de montagnes fractales, calculées chez Lucasfilm.'],
            ['Années 1980', 'Adrien Douady et John Hubbard', 'démontrent que l’ensemble est connexe, et lui donnent le nom de Mandelbrot.'],
            ['1985', 'A. K. Dewdney', 'présente en août, dans Scientific American, l’algorithme qui permet à chacun de dessiner l’ensemble ; une image fait la couverture.'],
            ['1985', 'Ken Perlin', 'publie le bruit qui porte son nom.'],
            ['1986', 'Heinz-Otto Peitgen et Peter Richter', 'publient *The Beauty of Fractals*.'],
            ['1987', 'Nathan Cohen', 'assiste à une conférence de Mandelbrot et fabrique peu après une antenne fractale.'],
            ['1988', 'Michael Barnsley', 'publie *Fractals Everywhere*, avec sa fougère.'],
            ['Fin des années 1980', 'Mario Markus', 'découvre les fractales de Lyapunov.'],
            ['1989', 'Crowe, Hasson, Rippon et Strain-Clark', 'étudient le Tricorn, qu’ils appellent ensemble de « Mandelbar ».'],
            ['1991', 'Mitsuhiro Shishikura', 'montre que le bord de l’ensemble a une dimension de Hausdorff égale à 2 (publié en 1998).'],
            ['Début des années 1990', 'David Boll', 'trouve π dans le nombre d’itérations, près du cou de la cardioïde.'],
            ['1992', 'Michael Michelitsch et Otto Rössler', 'décrivent la Burning Ship.'],
            ['1992', 'Arnaud Jacquin', 'rend praticable la compression fractale des images.'],
            ['1993', 'Melinda Green', 'décrit sur le forum sci.fractals la technique du Buddhabrot.'],
            ['1994', 'Jean-Christophe Yoccoz', 'reçoit la médaille Fields, notamment pour ses travaux sur la connexité locale de l’ensemble.'],
            ['1994', 'Will Leland et ses collègues', 'montrent que le trafic d’un réseau Ethernet est autosimilaire.'],
            ['1997', 'Geoffrey West, James Brown et Brian Enquist', 'expliquent la loi de Kleiber par des réseaux fractals.'],
            ['1999', 'Richard Taylor', 'mesure la dimension fractale des toiles de Pollock.'],
            ['2010', 'Benoît Mandelbrot', 'meurt le 14 octobre.'],
            ['2012', 'Xavier Buff et Arnaud Chéritat', 'construisent des ensembles de Julia d’aire non nulle.'],
            ['2013', 'K. I. Martin', 'répand la théorie des perturbations avec SuperFractalThing : les zooms très profonds deviennent accessibles à tous.'],
            ['2021', 'Zhuoran', 'propose le changement de référence qui supprime la plupart des glitches des perturbations.'],
          ],
        },
      ],
    },
    {
      id: 'refs', titre: 'Références', blocs: [
        {
          refs: [
            ['A. Cayley, « The Newton-Fourier imaginary problem », American Journal of Mathematics 2, 1879.'],
            ['G. Cantor, « Über unendliche, lineare Punktmannichfaltigkeiten », Mathematische Annalen 21, 1883.'],
            ['H. von Koch, « Sur une courbe continue sans tangente, obtenue par une construction géométrique élémentaire », Arkiv för matematik, astronomi och fysik 1, 1904.'],
            ['W. Sierpiński, « Sur une courbe dont tout point est un point de ramification », Comptes rendus de l’Académie des sciences 160, 1915.'],
            ['G. Julia, « Mémoire sur l’itération des fonctions rationnelles », Journal de mathématiques pures et appliquées, 1918.'],
            ['F. Hausdorff, « Dimension und äußeres Maß », Mathematische Annalen 79, 1918.'],
            ['P. Fatou, « Sur les équations fonctionnelles », Bulletin de la Société mathématique de France, 1919-1920.'],
            ['L. F. Richardson, *Weather Prediction by Numerical Process*, Cambridge University Press, 1922.'],
            ['P. A. P. Moran, « Additive functions of intervals and Hausdorff measure », Proceedings of the Cambridge Philosophical Society 42, 1946.'],
            ['L. F. Richardson, « The problem of contiguity », General Systems Yearbook 6, 1961.'],
            ['B. B. Mandelbrot, « The variation of certain speculative prices », Journal of Business 36, 1963.'],
            ['B. B. Mandelbrot, « How long is the coast of Britain? Statistical self-similarity and fractional dimension », Science 156, 1967.'],
            ['T. J. Dekker, « A floating-point technique for extending the available precision », Numerische Mathematik 18, 1971.'],
            ['R. F. Voss et J. Clarke, « 1/f noise in music and speech », Nature 258, 1975.'],
            ['M. J. Feigenbaum, « Quantitative universality for a class of nonlinear transformations », Journal of Statistical Physics 19, 1978.'],
            ['B. B. Mandelbrot, « Fractal aspects of the iteration of z ↦ λz(1 − z) for complex λ and z », Annals of the New York Academy of Sciences 357, 1980.'],
            ['J. E. Hutchinson, « Fractals and self similarity », Indiana University Mathematics Journal 30, 1981.'],
            ['T. A. Witten et L. M. Sander, « Diffusion-limited aggregation, a kinetic critical phenomenon », Physical Review Letters 47, 1981.'],
            ['R. Brooks et J. P. Matelski, « The dynamics of 2-generator subgroups of PSL(2, C) », Annals of Mathematics Studies 97, 1981.'],
            ['B. B. Mandelbrot, *The Fractal Geometry of Nature*, W. H. Freeman, 1982.'],
            ['A. Fournier, D. Fussell et L. Carpenter, « Computer rendering of stochastic models », Communications of the ACM 25, 1982.'],
            ['O. E. Lanford, « A computer-assisted proof of the Feigenbaum conjectures », Bulletin of the American Mathematical Society 6, 1982.'],
            ['A. Douady et J. H. Hubbard, « Itération des polynômes quadratiques complexes », Comptes rendus de l’Académie des sciences 294, 1982.'],
            ['A. K. Dewdney, « Computer Recreations », Scientific American, août 1985.'],
            ['K. Perlin, « An image synthesizer », Computer Graphics 19 (SIGGRAPH), 1985.'],
            ['H.-O. Peitgen et P. H. Richter, *The Beauty of Fractals*, Springer, 1986.'],
            ['C. McMullen, « Families of rational maps and iterative root-finding algorithms », Annals of Mathematics 125, 1987.'],
            ['M. F. Barnsley, *Fractals Everywhere*, Academic Press, 1988.'],
            ['M. Markus et B. Hess, « Lyapunov exponents of the logistic map with periodic forcing », Computers & Graphics 13, 1989.'],
            ['W. D. Crowe, R. Hasson, P. J. Rippon et P. E. D. Strain-Clark, « On the structure of the Mandelbar set », Nonlinearity 2, 1989.'],
            ['Tan Lei, « Similarity between the Mandelbrot set and Julia sets », Communications in Mathematical Physics 134, 1990.'],
            ['M. Michelitsch et O. E. Rössler, « The “Burning Ship” and its quasi-Julia sets », Computers & Graphics 16, 1992.'],
            ['J. Milnor, « Remarks on iterated cubic maps », Experimental Mathematics 1, 1992.'],
            ['A. E. Jacquin, « Image coding based on a fractal theory of iterated contractive image transformations », IEEE Transactions on Image Processing 1, 1992.'],
            ['S. Nakane, « Connectedness of the tricorn », Ergodic Theory and Dynamical Systems 13, 1993.'],
            ['W. E. Leland, M. S. Taqqu, W. Willinger et D. V. Wilson, « On the self-similar nature of Ethernet traffic », IEEE/ACM Transactions on Networking 2, 1994.'],
            ['N. Cohen, « Fractal antennas: Part 1 », Communications Quarterly, été 1995.'],
            ['C. Puente, J. Romeu, R. Pous, X. Garcia et F. Benítez, « Fractal multiband antenna based on the Sierpinski gasket », Electronics Letters 32, 1996.'],
            ['G. B. West, J. H. Brown et B. J. Enquist, « A general model for the origin of allometric scaling laws in biology », Science 276, 1997.'],
            ['J. Graczyk et G. Świątek, « Generic hyperbolicity in the logistic family », Annals of Mathematics 146, 1997.'],
            ['M. Lyubich, « Dynamics of quadratic polynomials, I–II », Acta Mathematica 178, 1997.'],
            ['M. Shishikura, « The Hausdorff dimension of the boundary of the Mandelbrot set and Julia sets », Annals of Mathematics 147, 1998.'],
            ['R. Eglash, *African Fractals: Modern Computing and Indigenous Design*, Rutgers University Press, 1999.'],
            ['R. P. Taylor, A. P. Micolich et D. Jonas, « Fractal analysis of Pollock’s drip paintings », Nature 399, 1999.'],
            ['R. L. Devaney, « The Mandelbrot set, the Farey tree, and the Fibonacci sequence », American Mathematical Monthly 106, 1999.'],
            ['J. Hubbard, D. Schleicher et S. Sutherland, « How to find all roots of complex polynomials by Newton’s method », Inventiones mathematicae 146, 2001.'],
            ['A. Klebanoff, « π in the Mandelbrot set », Fractals 9, 2001.'],
            ['A. L. Goldberger et al., « Fractal dynamics in physiology: alterations with disease and aging », PNAS 99, 2002.'],
            ['K. Jones-Smith et H. Mathur, « Revisiting Pollock’s drip paintings », Nature 444, 2006.'],
            ['X. Buff et A. Chéritat, « Quadratic Julia sets with positive area », Annals of Mathematics 176, 2012.'],
            ['J. H. Hubbard et D. Schleicher, « Multicorns are not path connected », dans *Frontiers in Complex Dynamics*, Princeton University Press, 2014.'],
            ['M. Green, « The Buddhabrot technique ».', 'https://superliminal.com/fractals/bbrot/'],
            ['I. Quilez, « Palettes ».', 'https://iquilezles.org/articles/palettes/'],
            ['IEEE History Center, « The invention of the fractal antenna ».', 'https://history.ieee.org/why-mobile-phones-can-do-so-many-things-the-invention-of-the-fractal-antenna/'],
            ['R. Munafo, *Mu-Ency*, l’encyclopédie de l’ensemble de Mandelbrot.', 'https://mrob.com/pub/muency.html'],
            ['luma.gl, « GPU floating-point precision techniques ».', 'https://luma.gl/docs/api-guide/shaders/gpu-floating-point-precision'],
            ['Wikipédia, « Mandelbrot set ».', 'https://en.wikipedia.org/wiki/Mandelbrot_set'],
            ['Wikipédia, « Julia set ».', 'https://en.wikipedia.org/wiki/Julia_set'],
            ['Wikipédia, « Fractal dimension ».', 'https://en.wikipedia.org/wiki/Fractal_dimension'],
            ['Wikipédia, « Coastline paradox ».', 'https://en.wikipedia.org/wiki/Coastline_paradox'],
            ['Wikipédia, « Feigenbaum constants ».', 'https://en.wikipedia.org/wiki/Feigenbaum_constants'],
            ['Wikipédia, « Burning Ship fractal ».', 'https://en.wikipedia.org/wiki/Burning_Ship_fractal'],
            ['Wikipédia, « Newton fractal ».', 'https://en.wikipedia.org/wiki/Newton_fractal'],
            ['Wikipédia, « Lyapunov fractal ».', 'https://en.wikipedia.org/wiki/Lyapunov_fractal'],
            ['Wikipédia, « Buddhabrot ».', 'https://en.wikipedia.org/wiki/Buddhabrot'],
            ['Wikipédia, « Diffusion-limited aggregation ».', 'https://en.wikipedia.org/wiki/Diffusion-limited_aggregation'],
          ],
        },
      ],
    },
  ],

  figures: {
    orbite: {
      label: 'Carte de l’ensemble de Mandelbrot ; l’orbite du point choisi est tracée en blanc.',
      legende: 'En noir, l’ensemble de Mandelbrot. Le cercle pointillé a pour rayon 2 : une orbite qui en sort ne revient jamais.',
      point: (c) => `c = ${c}`,
      echappe: (n) => `L’orbite dépasse 2 après ${n} étape${n > 1 ? 's' : ''}\u00a0: c est hors de l’ensemble.`,
      cycle: (p) => (p === 1 ? 'L’orbite se pose sur un point fixe : c est dans l’ensemble.' : `L’orbite tourne sur un cycle de ${p} points\u00a0: c est dans l’ensemble.`),
      bornee: 'L’orbite reste bornée : c est dans l’ensemble.',
    },
    couleurs: {
      titres: ['Le nombre d’étapes, tel quel', 'Le nombre d’étapes, lissé'],
      legende: 'La vallée des hippocampes, zoom ×50. À gauche, chaque bande correspond à un nombre entier d’étapes ; à droite, le compte est corrigé pour devenir continu.',
    },
    julias: {
      legende: 'Cinq points c, cinq ensembles de Julia. Les quatre premiers c sont dans l’ensemble de Mandelbrot ; le dernier est juste en dehors.',
      noms: { lapin: 'Le lapin de Douady', dendrite: 'La dendrite', sanmarco: 'San Marco', siegel: 'Disque de Siegel', poussiere: 'Poussière' },
    },
    galerie: {
      ouvrir: 'Ouvrir dans l’explorateur',
      cartes: {
        burning: 'Comme Mandelbrot, en rendant positives les deux parties de z avant le carré. Sur son antenne, un navire en flammes.',
        tricorn: 'Avec le conjugué de z : la symétrie passe à trois branches.',
        multibrot: 'z³ + c au lieu de z² + c : deux axes de symétrie au lieu d’un. Le degré se règle dans l’explorateur.',
        newton: 'La méthode de Newton pour z³ − 1. Chaque couleur est le bassin d’une racine ; leurs frontières sont fractales.',
        lyapunov: 'La suite logistique, son taux alternant entre a et b. Couleur : ordre ; noir : chaos.',
        buddha: 'Les trajets de millions de points qui s’échappent, accumulés : on y voit un bouddha assis. Trop lent à calculer en direct, il n’est montré qu’en image.',
      },
    },
    dichotomie: {
      carte: 'Carte de l’ensemble de Mandelbrot : cliquer pour choisir c.',
      julia: (c) => `Ensemble de Julia pour c = ${c}`,
      dedans: 'c est dans l’ensemble de Mandelbrot : la Julia est d’un seul tenant.',
      dehors: 'c est hors de l’ensemble de Mandelbrot : la Julia est une poussière.',
      legende: 'Cliquez ou glissez sur la carte de gauche. À droite, l’ensemble de Julia du point choisi.',
    },
    bulbes: {
      label: 'Carte de l’ensemble de Mandelbrot : survoler pour lire la période.',
      attente: 'Survolez un bulbe pour lire sa période.',
      periode: (p) => (p === 1 ? 'Cardioïde principale : un point fixe.' : `Bulbe de période ${p}\u00a0: l’orbite tourne sur ${p} points.`),
      dehors: 'Hors de l’ensemble.',
      inconnue: 'Tout près du bord : la période ne se lit pas en 4 000 étapes.',
    },
    pi: {
      titreCou: 'Au-dessus du cou : c = −3/4 + iε',
      titrePointe: 'À la pointe : c = 1/4 + ε',
      colEps: 'ε',
      colN: 'Itérations N',
      colProduit: 'N × ε',
      colRacine: 'N × √ε',
      enCours: 'Calcul en cours…',
      legende: 'Calculé dans votre navigateur. π = 3,141 592 65…',
    },
    bifurcation: {
      label: 'Diagramme de bifurcation de z → z² + c pour c réel, aligné au-dessus de l’ensemble de Mandelbrot.',
      legende: 'En haut, les valeurs prises par z après des centaines d’étapes, pour chaque c réel ; en bas, l’ensemble de Mandelbrot autour de l’axe réel, à la même échelle.',
      titre: 'Les doublements de période, de plus en plus serrés',
      colK: 'Période',
      colC: 'Centre du bulbe',
      colRapport: 'Rapport des écarts',
      donnees: 'Voir le calcul',
    },
    banc: {
      bouton: 'Mesurer',
      encore: 'Mesurer à nouveau',
      enCours: 'Mesure en cours…',
      attente: 'L’ensemble entier, 512 × 512 pixels, 1 000 itérations au plus par pixel. Le processeur peut prendre une ou deux secondes.',
      cpu: 'Processeur (JavaScript)',
      gpu: 'Carte graphique (WebGL2)',
      rapport: (r) => `La carte graphique va ${r} fois plus vite.`,
      ms: (n) => `${n} ms`,
      sansGpu: 'WebGL2 n’est pas disponible dans ce navigateur.',
    },
    precision: {
      titres: ['32 bits, comme une carte graphique', '64 bits'],
      zoom: 'Zoom',
      legende: 'Le même mini-Mandelbrot, calculé avec des nombres de 32 bits (à gauche) et de 64 bits (à droite). Montez le zoom : à gauche, l’image se change en carrés.',
    },
    construction: {
      choix: 'Figure',
      noms: { cantor: 'Cantor', koch: 'Koch', sierpinski: 'Sierpiński' },
      etape: 'Étape',
      mesure: {
        cantor: (n, l) => `${n} segments, longueur totale ${l}`,
        koch: (n, l) => `${n} segments, périmètre multiplié par ${l}`,
        sierpinski: (n, a) => `${n} triangles, aire multipliée par ${a}`,
      },
      dimension: (N, k, d) => `Dimension\u00a0: log ${N} / log ${k} ≈ ${d}`,
      legende: {
        cantor: 'À chaque étape, on retire le tiers du milieu de chaque segment. Les lignes montrent les étapes successives.',
        koch: 'À chaque étape, le tiers du milieu de chaque segment est remplacé par les deux autres côtés d’un triangle.',
        sierpinski: 'À chaque étape, chaque triangle est remplacé par ses trois coins, deux fois plus petits.',
      },
    },
    boites: {
      choix: 'Forme',
      noms: { koch: 'Courbe de Koch', sierpinski: 'Triangle de Sierpiński', julia: 'Bord du lapin de Douady' },
      label: (nom) => `${nom}, recouvert par une grille de boîtes`,
      taille: 'Côté ε',
      compte: (n, e) => `${n} boîtes de côté ${e} touchent la forme`,
      calcul: 'Calcul en cours…',
      titreGraphe: 'Nombre de boîtes touchées selon leur taille, en échelles logarithmiques',
      serie: 'Boîtes touchées',
      droite: 'Droite ajustée',
      axeX: '1 / ε',
      axeY: 'Boîtes touchées',
      info: (x, n) => `1/ε = ${x}\u00a0: ${n} boîtes`,
      resume: (p) => `Les points s’alignent sur une droite de pente ${p}.`,
      pente: (p) => `Pente de la droite\u00a0: ${p}`,
      exacte: (d) => `valeur exacte\u00a0: ${d}`,
      legende: 'La forme est tracée sur une trame de 1 024 × 1 024 points ; les boîtes touchées sont teintées. Chaque fois que l’on divise le côté des boîtes par 2, leur nombre est multiplié par environ 2 puissance D. La pente est mesurée sur les tailles intermédiaires.',
    },
    chaos: {
      choix: 'Système',
      noms: { sierpinski: 'Sierpiński', fougere: 'Fougère', dragon: 'Dragon' },
      label: (nom) => `Jeu du chaos\u00a0: ${nom}`,
      recommencer: 'Recommencer',
      points: (n) => `${n} points`,
      regles: {
        sierpinski: 'Trois transformations tirées avec la même probabilité : chacune réduit de moitié et rapproche d’un coin du triangle.',
        fougere: 'Quatre transformations affines (Barnsley, 1988). L’une, tirée 85 fois sur 100, fait monter la fronde en la réduisant un peu ; deux autres produisent les premières folioles, à gauche et à droite ; la dernière, rare, écrase tout sur la tige.',
        dragon: 'Deux similitudes de rapport 1/√2 ; l’une tourne de 45°, l’autre de 135°. Leur attracteur est la courbe du dragon de Heighway.',
      },
    },
    littoral: {
      label: 'Une île imaginaire, et le polygone obtenu en mesurant sa côte avec une règle.',
      regle: 'Règle',
      mesure: (n, l) => `${n} pas de règle\u00a0: ${l} km`,
      autre: 'Une autre île',
      titreGraphe: 'Longueur mesurée selon la taille de la règle, en échelles logarithmiques',
      serie: 'Longueur mesurée',
      axeX: 'Règle (km)',
      axeY: 'Longueur (km)',
      info: (r, l) => `Règle de ${r} km\u00a0: ${l} km`,
      resume: (d) => `Plus la règle est courte, plus la côte est longue. Dimension estimée\u00a0: ${d}.`,
      dimension: (d) => `Dimension estimée\u00a0: ${d}`,
      legende: 'L’île fait environ 1 000 km de large. On avance d’un pas de règle à la fois le long de la côte, comme avec un compas. Diviser la règle par 2 allonge la côte d’un facteur à peu près constant, 2 puissance (D − 1) : c’est la loi qu’avait observée Richardson.',
    },
    relief: {
      label: (h, d) => `Profil de montagne aléatoire\u202f; exposant de Hurst ${h}, dimension ${d}`,
      rugosite: 'Exposant H',
      valeurs: (h, d) => `H = ${h} · D = ${d}`,
      autre: 'Un autre tirage',
      legende: 'On déplace au hasard le milieu d’un segment, puis le milieu de chaque moitié, et ainsi de suite, neuf fois. Les tirages ne changent pas quand on bouge le curseur : seule change la vitesse à laquelle les déplacements diminuent.',
    },
    agregation: {
      label: 'Un amas qui grandit par agrégation de particules errantes.',
      recommencer: 'Recommencer',
      particules: (n) => `${n} particules`,
      dimension: (d) => `dimension estimée\u00a0: ${d}`,
      legende: 'Chaque particule part d’un cercle autour de l’amas et marche au hasard, une case à la fois, jusqu’à le toucher. La dimension s’estime en comptant les particules à moins de r du centre : leur nombre croît comme r puissance D. Sur quelques milliers de particules, l’estimation tombe entre 1,5 et 1,7 ; il en faut des millions pour approcher la valeur limite, 1,71.',
    },
    vignettes: {
      ouvrir: 'Ouvrir dans l’explorateur',
      noms: {
        burning: 'Burning Ship',
        tricorn: 'Tricorn',
        multibrot: 'Multibrot de degré 4',
        newton: 'Newton pour z³ − 1',
        newtonZoom: 'Là où les bassins se touchent, ×6',
        cycle: 'z³ − 2z + 2 : des zones sans racine',
        lyapunov: 'Lyapunov, suite AB',
        lyapunovB: 'Suite BBBBBBAAAAAA',
        buddha: 'Buddhabrot',
        nebula: 'Les orbites de moins de 40 étapes',
      },
      formules: {
        burning: 'z → (|x| + i|y|)² + c',
        tricorn: 'z → z̄² + c',
        multibrot: 'z → z⁴ + c',
        newton: 'z → z − p(z) / p′(z)',
        lyapunov: 'x → rₙ x (1 − x)',
      },
    },
  },
}
