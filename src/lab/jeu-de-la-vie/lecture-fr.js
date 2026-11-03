// ============================================================
//  ARTICLES EN FRANÇAIS : Théorie, Calcul, Histoire et références, figures
//  Blocs : { p }, { liste }, { tex, etroit? }, { figure }, { expert },
//  { frise }, { refs }. Dans le texte : *italique* et $formule$ (LaTeX).
//  Sources principales : Gardner (1970), Winning Ways (1982), Moore (1962),
//  Myhill (1963), Gosper (1984), Brown et al. (2023), LifeWiki, Wikipédia.
//  Les chiffres des soupes et de Hashlife sont mesurés par le moteur.
// ============================================================

const tex = String.raw

export const LECTURE_FR = {
  theorie: [
    {
      id: 'regle', titre: 'La règle, en une formule', blocs: [
        { p: 'Notons $s_t(x) \\in \\{0, 1\\}$ l’état de la case $x$ à la génération $t$ (1 pour vivante) et $N_t(x)$ le nombre de ses voisines vivantes. Les deux règles tiennent en une ligne :' },
        { tex: tex`s_{t+1}(x) = \begin{cases} 1 & \text{si } N_t(x) = 3, \\ s_t(x) & \text{si } N_t(x) = 2, \\ 0 & \text{sinon.} \end{cases}` },
        { p: 'Avec 2 voisines, rien ne change ; avec 3, la case est vivante quoi qu’il arrive ; dans tous les autres cas, elle est morte. Cliquez sur les cases pour essayer :' },
        { figure: 'voisinage' },
        { p: 'La même règle s’applique partout, et toutes les cases changent en même temps : c’est ce qu’on appelle un *automate cellulaire*.' },
        {
          expert: 'définition formelle', blocs: [
            { p: 'Un automate cellulaire sur la grille $\\mathbb{Z}^2$ est la donnée d’un ensemble d’états $S$, d’un voisinage fini $V$ et d’une règle locale $f : S^V \\to S$. Elle définit l’application globale $F$, qui fait avancer toute configuration $c : \\mathbb{Z}^2 \\to S$ d’une génération :' },
            { tex: tex`F(c)(x) = f\big((c(x + v))_{v \in V}\big), \qquad V = \{-1, 0, 1\}^2 \ \text{(voisinage de Moore)}.`, etroit: tex`\begin{gathered} F(c)(x) = f\big((c(x + v))_{v \in V}\big) \\[4pt] V = \{-1, 0, 1\}^2 \end{gathered}` },
            { p: 'La règle de Conway est *totalistique extérieure* : elle ne dépend que de l’état de la case et du nombre de voisines vivantes, pas de leur position. Une telle règle se décrit par deux sous-ensembles de $\\{0, \\dots, 8\\}$ : les nombres de voisines qui font naître ($B$) et ceux qui font survivre ($S$). Il y en a donc' },
            { tex: tex`2^9 \times 2^9 = 2^{18} = 262\,144,` },
            { p: 'dont le jeu de la vie, B3/S23. Les règles contenant B0, où une case vide sans aucune voisine naît, font clignoter tout le fond de la grille ; la simulation ne les propose pas.' },
          ],
        },
      ],
    },
    {
      id: 'zoo', titre: 'Le zoo des motifs', blocs: [
        { p: 'Les passionnés du jeu de la vie classent les motifs selon leur comportement. Une *nature morte* ne change plus : le bloc, la ruche. Un *oscillateur* revient à l’identique après un nombre fixe de générations, sa période : 2 pour le clignotant, 3 pour le pulsar. Un *vaisseau* revient à l’identique, mais décalé : il voyage.' },
        { p: 'Le plus petit vaisseau est le planeur : cinq cellules qui se décalent d’une case en diagonale toutes les quatre générations. À mi-parcours, il est le reflet de lui-même.' },
        { figure: 'planeur' },
        { p: 'L’analyse automatique de la simulation reconnaît ces trois familles : génération après génération, elle cherche une configuration déjà vue, au même endroit ou décalée.' },
        { p: 'En 2023, Mitchell Riley et Nico Brown trouvent des oscillateurs de période 19 et 41, les deux dernières qui manquaient. Dans un article de décembre 2023, avec leurs cinq coauteurs, ils concluent que le jeu de la vie est *omnipériodique* : pour tout entier $p \\ge 1$, il existe un oscillateur de période $p$.' },
        {
          expert: 'la vitesse de la lumière', blocs: [
            { p: 'Une case ne voit que ses voisines immédiates : aucune information ne peut avancer de plus d’une case par génération. Cette vitesse maximale se note $c$, la « vitesse de la lumière » du jeu de la vie. Un vaisseau qui se décale de $(\\Delta x, \\Delta y)$ en $p$ générations va à la vitesse' },
            { tex: tex`v = \frac{\max(|\Delta x|, |\Delta y|)}{p}\, c, \qquad \text{planeur : } \frac{c}{4}, \qquad \text{vaisseau léger : } \frac{2}{4}\,c = \frac{c}{2}.`, etroit: tex`\begin{gathered} v = \frac{\max(|\Delta x|, |\Delta y|)}{p}\, c \\[4pt] \text{planeur : } \frac{c}{4}, \quad \text{vaisseau léger : } \frac{c}{2} \end{gathered}` },
            { p: '*Théorème* (Conway, 1970). Dans un univers vide, aucun vaisseau ne dépasse $c/2$ orthogonalement, ni $c/4$ en diagonale.' },
            { p: '*Idée de la preuve*, pour la diagonale. Plaçons le vaisseau d’un côté d’une diagonale. Pour qu’une case située deux diagonales plus loin soit vivante deux générations plus tard, ses trois seules voisines possibles doivent être vivantes à la génération 1 : deux sur la diagonale intermédiaire, une sur la première. Les deux premières doivent naître, donc avoir chacune trois voisines vivantes au départ ; cela fait au moins quatre voisines vivantes autour de la troisième, qui meurt étouffée. Contradiction : le bord du vaisseau avance d’au plus une diagonale toutes les deux générations, soit $c/4$. Le même raisonnement, sur deux diagonales croisées, donne la borne orthogonale.' },
          ],
        },
      ],
    },
    {
      id: 'croissance', titre: 'Croître sans fin', blocs: [
        { p: 'Conway pensait qu’aucun motif fini ne pouvait grandir indéfiniment. Dans l’article de Martin Gardner qui fait connaître le jeu, en octobre 1970, il offre 50 dollars à qui démontrera ou réfutera cette conjecture avant la fin de l’année. Le prix est gagné dès novembre par une équipe du MIT menée par Bill Gosper, avec un *canon* : un oscillateur de période 30 qui lance un planeur à chaque période.' },
        { figure: 'canon' },
        { p: 'Chaque planeur emporte cinq cellules : la population croît d’environ cinq cellules toutes les trente générations, sans jamais s’arrêter.' },
        { p: 'Combien de cellules après un milliard de générations ? Simuler génération par génération prendrait des heures. En 1984, Gosper publie *Hashlife*, un algorithme qui découpe l’univers en carrés emboîtés et mémorise l’avenir de chaque carré déjà rencontré. Sur un motif régulier comme un canon, le même calcul resservant sans cesse, il saute des milliards de générations d’un coup. Il tourne ici dans votre navigateur :' },
        { figure: 'saut' },
        {
          expert: 'jusqu’où peut-on croître ?', blocs: [
            { p: 'La vitesse de la lumière borne la croissance. Un motif qui tient dans un rectangle $L \\times H$ ne peut pas s’étendre de plus de $t$ cases dans chaque direction en $t$ générations. Sa population vérifie donc' },
            { tex: tex`P(t) \le (L + 2t)(H + 2t) = O(t^2).` },
            { p: 'Un canon donne une croissance linéaire : $P(t) \\approx P_0 + t/6$ pour celui de Gosper, cinq cellules toutes les trente générations. Gosper a aussi construit le premier *breeder*, un motif qui sème derrière lui des canons, chacun lançant ses planeurs. Sa population croît comme $t^2$ : à une constante près, c’est la croissance la plus rapide possible.' },
            { p: 'Hashlife repose sur la même borne. Un carré de $2^k \\times 2^k$ cases détermine entièrement son carré central de $2^{k-1} \\times 2^{k-1}$ pendant $2^{k-2}$ générations, puisque rien de l’extérieur n’a le temps d’y arriver. L’algorithme calcule ce saut récursivement, à partir de neuf sous-carrés, et le mémorise :' },
            { tex: tex`\text{centre}\big(F^{2^{k-2}}(Q)\big) = \operatorname{suivant}(Q), \qquad \text{calculé une seule fois pour chaque carré } Q \text{ distinct.}`, etroit: tex`\begin{gathered} \text{centre}\big(F^{2^{k-2}}(Q)\big) = \operatorname{suivant}(Q) \\[4pt] \text{une seule fois par carré } Q \text{ distinct} \end{gathered}` },
            { p: 'Le moteur Hashlife de ce site donne, cellule par cellule, les mêmes résultats que le moteur ordinaire sur le planeur, le pulsar, le R-pentomino, le canon de Gosper, le gland et le copperhead.' },
          ],
        },
      ],
    },
    {
      id: 'eden', titre: 'Les jardins d’Éden', blocs: [
        { p: 'Toute configuration a un avenir. Mais toutes n’ont pas de passé : un *jardin d’Éden* est une configuration qu’aucune autre ne peut produire. On ne l’obtient qu’en la dessinant.' },
        { p: 'Leur existence tient à un phénomène que la fourmi de Langton ignore : deux passés différents peuvent mener au même présent. Les deux grilles ci-dessous ne diffèrent que par la case centrale ; quel que soit leur entourage, elles ont exactement le même avenir.' },
        { figure: 'jumeaux' },
        { p: 'Ces deux motifs sont des *jumeaux*. Le théorème du jardin d’Éden, démontré par Edward Moore en 1962 et John Myhill en 1963, dit qu’un automate cellulaire a des jardins d’Éden si et seulement s’il a des jumeaux. Le jeu de la vie en a donc.' },
        { p: 'Le premier exemple explicite est proposé par Roger Banks en 1971 : ses cellules tiennent dans un rectangle de 9 × 33, et une recherche exhaustive confirme qu’il n’a aucun antécédent. En avril 2016, Steven Eker trouve le plus petit motif sans antécédent connu : 57 cellules dans un rectangle de 8 × 12.' },
        {
          expert: 'le théorème, et une preuve par comptage', blocs: [
            { p: 'Notons $F$ l’application qui fait avancer d’une génération une configuration $c : \\mathbb{Z}^2 \\to \\{0, 1\\}$. Deux motifs finis sont *jumeaux* s’ils sont différents mais donnent toujours le même successeur, quel que soit le reste de la grille.' },
            { p: '*Théorème* (Moore, 1962 ; Myhill, 1963). $F$ est surjective, c’est-à-dire sans jardin d’Éden, si et seulement si elle n’a pas de jumeaux.' },
            { p: 'Le sens qui nous intéresse, celui de Moore, se démontre en comptant. Supposons des jumeaux de taille $n \\times n$, et prenons un carré de $k \\times k$ blocs de cette taille. À la génération suivante, l’intérieur de ce carré, privé d’un bord d’une case, ne dépend que du carré lui-même. Dans chaque bloc, l’un des deux jumeaux ne sert à rien : l’autre produit le même effet. Les carrés de départ donnent donc au plus $(2^{n^2} - 1)^{k^2}$ intérieurs différents, alors qu’il existe $2^{(kn-2)^2}$ intérieurs possibles. Pour $k$ assez grand,' },
            { tex: tex`\big(2^{n^2} - 1\big)^{k^2} < 2^{(kn-2)^2},` },
            { p: 'et certains intérieurs n’ont aucun antécédent : ce sont des *orphelins*, et toute configuration qui en contient un est un jardin d’Éden.' },
            { p: 'Pour le jeu de la vie, les jumeaux de la figure donnent $n = 5$. L’inégalité n’est vraie qu’à partir de $k \\approx 4{,}65 \\times 10^8$ : l’argument garantit des orphelins d’environ 2,3 milliards de cases de côté. Le plus petit connu tient dans 8 × 12 cases.' },
            { p: 'La fourmi de Langton, elle, est réversible : chaque état a exactement un passé. Ni jumeaux, ni jardins d’Éden.' },
          ],
        },
      ],
    },
    {
      id: 'soupes', titre: 'Les soupes aléatoires', blocs: [
        { p: 'Remplissons une grille au hasard, chaque case vivante avec la probabilité $p$, et laissons tourner. Après quelques milliers de générations, il ne reste que des « cendres » : des natures mortes, des clignotants, quelques planeurs. Quelle densité reste-t-il ?' },
        { figure: 'soupes' },
        { p: 'Entre 20 % et 70 % de cases vivantes au départ, la densité finale tourne autour de 3 %, presque sans dépendre de la densité de départ. Avec très peu de cellules, la plupart meurent d’isolement ; avec trop, presque toutes meurent étouffées dès la première génération.' },
        {
          expert: 'le champ moyen, et pourquoi il se trompe', blocs: [
            { p: 'Première idée : faire comme si les cases étaient indépendantes, toutes vivantes avec la même probabilité $p_t$. Une case morte naît si exactement 3 de ses 8 voisines sont vivantes ; une case vivante survit s’il y en a 2 ou 3. La densité suivante serait alors, avec $q_t = 1 - p_t$ :' },
            { tex: tex`p_{t+1} = p_t \left[\binom{8}{2} p_t^2 q_t^6 + \binom{8}{3} p_t^3 q_t^5\right] + q_t \binom{8}{3} p_t^3 q_t^5.`, etroit: tex`\begin{gathered} p_{t+1} = p_t \left[\binom{8}{2} p_t^2 q_t^6 + \binom{8}{3} p_t^3 q_t^5\right] \\[4pt] + \; q_t \binom{8}{3} p_t^3 q_t^5 \end{gathered}` },
            { p: 'Cette suite a deux points fixes non nuls : $p \\approx 0{,}19$, instable, et $p \\approx 0{,}37$, stable. Partie d’une densité comprise entre 19 % et 56 % environ, une soupe se stabiliserait donc vers 37 % de cases vivantes ; en dehors, elle s’éteindrait. La simulation en trouve plus de dix fois moins.' },
            { p: 'L’erreur vient de l’hypothèse d’indépendance. Les cendres sont faites de petits motifs très organisés : dans un bloc, chaque cellule a exactement trois voisines vivantes, et aucune case autour n’en a trois. Ces corrélations, que le champ moyen ignore, décident de tout.' },
          ],
        },
      ],
    },
    {
      id: 'chaos', titre: 'Au bord du chaos', blocs: [
        { p: 'Pourquoi cette règle-là ? Parmi les 262 144 règles B/S, la plupart donnent des mondes sans histoire : tout meurt, tout se fige, ou tout bouillonne. En 1984, Stephen Wolfram range les automates cellulaires en quatre classes. Dans la classe I, tout devient uniforme ; dans la classe II, tout se fige en structures fixes ou périodiques ; dans la classe III, l’agitation ne cesse jamais. La classe IV, plus rare, est celle où des structures localisées naissent, voyagent et interagissent longtemps. Le jeu de la vie en est l’exemple type.' },
        { p: 'En 1990, Christopher Langton, l’inventeur de la fourmi, propose une mesure pour s’y retrouver : le paramètre $\\lambda$, la proportion des voisinages possibles qui donnent une case vivante. Sur des règles tirées au hasard, il observe que l’ordre domine quand $\\lambda$ est petit, le chaos quand il approche de 1/2, et que les comportements complexes se concentrent près de la transition, au *bord du chaos*. Le jeu de la vie a $\\lambda = 140/512 \\approx 0{,}273$, et Langton le place dans cette zone de transition.' },
        { figure: 'lambda' },
        { p: 'La figure montre aussi les limites de l’idée. Graines a le plus petit $\\lambda$ de la liste, et presque tout y explose. Jour et nuit et Réplicateur ont exactement le même, 1/2 : dans le premier, la soupe se résorbe ; dans le second, elle envahit tout. Le paramètre décrit une tendance moyenne sur des règles tirées au hasard, pas le destin d’une règle donnée.' },
        { p: 'L’idée a aussi été discutée sur le fond. En 1988, Norman Packard pense montrer que des automates à qui l’on apprend à calculer évoluent vers le bord du chaos. En 1993, Melanie Mitchell, Peter Hraber et James Crutchfield refont l’expérience et n’en retrouvent pas le résultat. Le bord du chaos reste une image féconde, mais pas une loi.' },
        {
          expert: 'le paramètre λ d’une règle B/S', blocs: [
            { p: 'Une règle B/S se lit sur les $2^9 = 512$ voisinages possibles : la case et ses 8 voisines. Un voisinage où la case est morte et compte $k$ voisines vivantes donne une naissance si $k \\in B$ ; il y a $\\binom{8}{k}$ voisinages de ce genre. De même pour la survie, avec $S$. D’où' },
            { tex: tex`\lambda = \frac{1}{512}\Big(\sum_{k \in B} \binom{8}{k} + \sum_{k \in S} \binom{8}{k}\Big), \qquad \text{jeu de la vie : } \frac{56 + 28 + 56}{512} = \frac{140}{512}.`, etroit: tex`\begin{gathered} \lambda = \frac{1}{512}\Big(\sum_{k \in B} \binom{8}{k} + \sum_{k \in S} \binom{8}{k}\Big) \\[6pt] \text{jeu de la vie : } \frac{56 + 28 + 56}{512} = \frac{140}{512} \end{gathered}` },
            { p: 'Échanger les cases vivantes et mortes donne une règle de paramètre $1 - \\lambda$. Au-delà de 1/2, l’ordre revient donc, cette fois avec des grilles qui se remplissent : Vie sans mort et Labyrinthe sont de ce côté.' },
            { p: 'Le calcul compte tous les voisinages à égalité, comme dans une grille à moitié pleine. Or un monde réel est souvent presque vide, et c’est là que Graines frappe : sa seule règle, B2, ne pèse que $\\binom{8}{2} = 28$ voisinages sur 512, mais ce sont justement ceux qui abondent autour de cellules éparses.' },
          ],
        },
      ],
    },
    {
      id: 'replication', titre: 'Des motifs qui se recopient', blocs: [
        { p: 'À la fin des années 1940, John von Neumann se demande ce qu’il faut, au minimum, pour qu’une machine se reproduise. Sa réponse tient en deux pièces : un *constructeur universel*, capable de fabriquer n’importe quelle machine dont on lui donne la description, et un ruban qui porte cette description. Le constructeur lit le ruban pour bâtir sa fille, puis recopie le ruban et le lui donne. Le ruban sert deux fois, comme programme puis comme simple donnée. C’est la logique que la biologie découvre avec l’ADN, dont James Watson et Francis Crick publient la structure en 1953.' },
        { p: 'Von Neumann conçoit sa machine sur une grille à 29 états ; ses travaux paraissent en 1966, après sa mort, complétés par Arthur Burks. Edgar Codd ramène le nombre d’états à 8 en 1968. En 1984, Christopher Langton renonce à l’universalité et obtient, sur une grille à 8 états, une boucle d’environ 86 cases qui se recopie en 151 générations environ. La machine de von Neumann elle-même ne tourne qu’en 1994, réalisée par Renato Nobili et Umberto Pesavento sur une version un peu étendue de sa grille.' },
        { p: 'Dans le jeu de la vie, Andrew J. Wade construit en 2010 Gemini, un motif qui se reconstruit sans cesse un peu plus loin. Ses deux moitiés se renvoient un ruban de planeurs qui leur dit quoi faire : chacune efface son ancêtre et en bâtit une copie. Le tout se déplace de 5 120 cases vers le haut et de 1 024 sur le côté toutes les 33 699 586 générations. Gemini reste un vaisseau, avec une seule copie à la fois. Le 23 novembre 2013, Dave Greene construit le premier vrai réplicateur du jeu de la vie : son nombre de copies augmente à chaque cycle, d’environ 237 millions de générations.' },
        { p: 'Dans des règles voisines, c’est beaucoup plus simple. En 1994, Nathan Thompson invente HighLife, B36/S23, où un motif de 12 cellules se recopie tout seul. Et dans la règle Réplicateur, tous les motifs se recopient :' },
        { figure: 'replicateurs' },
        {
          expert: 'pourquoi tout se recopie dans Réplicateur', blocs: [
            { p: 'La règle B1357/S1357 dit : une case est vivante à la génération suivante si et seulement si elle a un nombre impair de voisines vivantes, qu’elle soit vivante ou non. Son nouvel état est donc la somme de ses 8 voisines, modulo 2. Notons $\\tau_v$ le décalage de toute la grille par le vecteur $v$. Dans l’arithmétique modulo 2, l’application $F$ est une somme de décalages :' },
            { tex: tex`F = \sum_{v \in V^*} \tau_v, \qquad V^* = \{-1, 0, 1\}^2 \setminus \{(0, 0)\}.` },
            { p: 'Les décalages commutent entre eux et, modulo 2, $(a + b)^2 = a^2 + 2ab + b^2 = a^2 + b^2$ : le carré d’une somme est la somme des carrés. En élevant $k$ fois au carré,' },
            { tex: tex`F^{2^k} = \sum_{v \in V^*} \tau_v^{\,2^k} = \sum_{v \in V^*} \tau_{2^k v}.` },
            { p: 'Après $2^k$ générations, un motif de moins de $2^k$ cases de côté se retrouve donc en 8 exemplaires, décalés de $2^k$ cases dans les 8 directions, sans chevauchement. C’est ce que montre la figure à la génération $16 = 2^4$. Entre deux puissances de 2, les copies se superposent, et deux cellules qui se recouvrent s’annulent : c’est le désordre que l’on voit passer.' },
          ],
        },
      ],
    },
    {
      id: 'ouvert', titre: 'Ce qu’on ne sait pas', blocs: [
        { p: 'Certaines questions ont résisté longtemps. En 1970, Conway demandait si un motif pouvait croître sans fin : réglé en un mois. En 1972, il demandait s’il existe un motif qui a un parent mais pas de grand-parent : réglé en 2016. Il a fallu attendre 2023 pour savoir que toutes les périodes d’oscillateur existent. D’autres restent ouvertes :' },
        {
          liste: [
            '*L’objet inébranlable.* Existe-t-il un motif fini dont la case centrale ne changera jamais d’état, quoi qu’on place autour ? Conway a posé la question en 1972.',
            '*L’objet à l’épreuve des planeurs.* Existe-t-il un motif fini qui détruit tout planeur venu de l’infini, quelle que soit sa direction, sans que sa propre évolution en soit modifiée ?',
            '*Le plus petit orphelin.* Le plus petit motif sans antécédent connu a 57 cellules ; personne ne sait s’il en existe de plus petits.',
          ],
        },
        {
          expert: 'les grands-parents, formellement', blocs: [
            { p: 'Notons $X = \\{0, 1\\}^{\\mathbb{Z}^2}$ l’ensemble des configurations. Un motif fini a un parent s’il apparaît dans une configuration de $F(X)$, un grand-parent s’il apparaît dans $F^2(X)$, et ainsi de suite. En mai 2016, un passionné connu sous le pseudonyme mtve trouve un motif qui a un parent mais pas de grand-parent. En 2022, Ilkka Törmä et Ville Salo démontrent beaucoup plus fort :' },
            { tex: tex`\forall n \in \mathbb{N},\ \exists P : \quad P \text{ apparaît dans } F^n(X) \text{ mais pas dans } F^{n+1}(X).`, etroit: tex`\begin{gathered} \forall n \in \mathbb{N},\ \exists P : \\[4pt] P \text{ apparaît dans } F^n(X) \\ \text{mais pas dans } F^{n+1}(X) \end{gathered}` },
            { p: 'Autrement dit, la suite décroissante $X \\supseteq F(X) \\supseteq F^2(X) \\supseteq \\cdots$ ne se stabilise jamais : chaque génération supplémentaire rend impossibles de nouveaux motifs.' },
          ],
        },
      ],
    },
  ],

  calcul: [
    {
      id: 'signaux', titre: 'Des planeurs comme signaux', blocs: [
        { p: 'Pour calculer, il faut des signaux qui circulent et des portes qui les combinent. Dans le jeu de la vie, le signal le plus simple est un flot de planeurs : un planeur présent vaut 1, un planeur absent vaut 0. Un canon de Gosper en lance un toutes les 30 générations. C’est à la fois une horloge et une source de 1 qui ne s’arrête jamais.' },
        { p: 'Deux planeurs qui se croisent à angle droit peuvent s’annihiler sans laisser de trace, s’ils se rencontrent au bon moment. Faisons croiser le flot d’un canon et un signal A. Là où A porte un planeur, les deux disparaissent ; là où A n’en porte pas, le planeur du canon passe. Ce qui sort est le contraire de A : c’est une porte NON.' },
        { figure: 'porte' },
        { p: 'La figure tourne sur le même moteur que la simulation. Les positions des deux canons ont été trouvées par une recherche systématique, puis vérifiées sur près de 200 bits tirés au hasard. Le *mangeur*, une nature morte de 7 cellules, avale chaque planeur qui le percute et se reconstruit en quelques générations.' },
        { p: 'La même collision donne les autres portes : il suffit de changer ce que l’on fait se croiser.' },
        {
          expert: 'l’algèbre des collisions', blocs: [
            { p: 'Notons $x$ et $y$ la présence (1) ou l’absence (0) d’un planeur dans deux flots, au même créneau. Après le croisement, chaque flot ne garde que les planeurs qui n’ont pas trouvé de partenaire :' },
            { tex: tex`x' = x \wedge \neg y, \qquad y' = y \wedge \neg x.` },
            { p: 'Un canon fournit le flot constant $1$. Croisé avec $x$, il sort $\\neg x$ sur sa propre voie : c’est la figure. Faisons maintenant croiser ce flot $\\neg x$ avec un troisième flot $y$. Ce qui reste de $y$ vaut' },
            { tex: tex`y \wedge \neg(\neg x) = x \wedge y,` },
            { p: 'une porte ET. Avec NON et ET, on écrit toutes les fonctions logiques, par exemple $x \\lor y = \\neg(\\neg x \\wedge \\neg y)$. Pour assembler un vrai circuit, il faut encore dupliquer un signal, le retarder, et faire se croiser deux flots sans qu’ils se touchent. D’autres collisions et d’autres motifs s’en chargent.' },
          ],
        },
      ],
    },
    {
      id: 'memoire', titre: 'Une mémoire qui glisse', blocs: [
        { p: 'Des portes ne suffisent pas : un ordinateur doit aussi retenir des nombres, aussi grands qu’on veut. Conway les range dans un bloc, la nature morte de 2 × 2 cellules. Le nombre, c’est la distance du bloc à un point fixe, comptée en diagonale. Une salve de planeurs bien réglée pousse le bloc d’un cran ; une autre le tire d’un cran.' },
        { p: 'Dans la construction de Conway, 2 planeurs tiraient le bloc de trois cases, et il en fallait 30 pour le repousser d’autant. Le 1er mars 1990, Dean Hickerson décrit bien plus économique : une salve de 2 planeurs tire le bloc d’une case, une salve de 3 le pousse d’une case. C’est la *mémoire à bloc glissant*. Pour savoir si le compteur vaut zéro, on lance un planeur à travers la position zéro : il heurte le bloc, ou il passe.' },
        { p: 'Avec des compteurs, on peut tout calculer. Marvin Minsky l’a montré dans les années 1960 : une machine qui sait seulement ajouter 1 à un compteur, ou lui retirer 1 en sautant ailleurs s’il vaut zéro, fait tout ce que fait une machine de Turing, et deux compteurs lui suffisent. En voici une. Chaque compteur est un bloc sur son rail :' },
        { figure: 'minsky' },
        { p: 'Il ne reste qu’à tout traduire en planeurs. Chaque compteur devient un bloc glissant, chaque instruction une salve, et le programme un circuit de portes qui choisit la salve suivante selon la réponse du test du zéro. C’est l’argument du dernier chapitre de *Winning Ways for your Mathematical Plays*, en 1982 : le jeu de la vie contient un ordinateur universel.' },
        {
          expert: 'de la machine de Turing au jeu de la vie', blocs: [
            { p: 'La preuve est une chaîne de simulations. Chaque flèche se lit « peut être simulé par » :' },
            { tex: tex`\text{machine de Turing} \to \text{2 piles} \to \text{3 compteurs} \to \text{2 compteurs} \to \text{jeu de la vie}`, etroit: tex`\begin{gathered} \text{machine de Turing} \to \text{2 piles} \\[2pt] \to \text{3 compteurs} \to \text{2 compteurs} \\[2pt] \to \text{jeu de la vie} \end{gathered}` },
            { p: '*Du ruban aux piles.* On coupe le ruban en deux à l’endroit de la tête. Chaque moitié est une pile de symboles ; déplacer la tête revient à retirer un symbole d’une pile pour le poser sur l’autre.' },
            { p: '*Des piles aux compteurs.* Une pile de symboles pris parmi $k$ s’écrit comme un nombre $n$ en base $k$. Poser le symbole $s$, c’est remplacer $n$ par $kn + s$ ; retirer le symbole du dessus, c’est diviser par $k$ et garder le reste. Ces opérations se programment avec un troisième compteur, qui sert de brouillon.' },
            { p: '*De trois compteurs à deux.* On range les trois valeurs $a$, $b$ et $c$ dans un seul nombre,' },
            { tex: tex`n = 2^a \, 3^b \, 5^c,` },
            { p: 'et le second compteur sert de brouillon. Ajouter 1 à $a$, c’est multiplier $n$ par 2 : on vide le premier compteur dans le second en ajoutant 2 à chaque pas, puis on le rapatrie. Tester si $b = 0$, c’est tester si $n$ est divisible par 3. C’est extraordinairement lent, mais exact.' },
            { p: '*De deux compteurs au jeu de la vie.* Deux blocs glissants et un circuit de portes fini. Le motif de départ est fini, mais les blocs peuvent s’éloigner sans limite : la place occupée grandit avec le calcul, comme le ruban d’une machine de Turing.' },
          ],
        },
      ],
    },
    {
      id: 'machines', titre: 'Des ordinateurs dans la grille', blocs: [
        { p: 'L’argument de Conway prouve qu’un ordinateur existe ; il ne le dessine pas. Les passionnés s’y sont mis ensuite, et leurs machines ont grandi avec la puissance des ordinateurs qui les simulent.' },
        {
          frise: [
            ['1991', 'Dean Hickerson', 'construit *Primer*, un canon qui tire des vaisseaux légers. D’autres canons jouent le rôle du crible d’Ératosthène et détruisent les vaisseaux en trop : un vaisseau franchit le bord du motif à la génération $120n$ si et seulement si $n$ est premier.'],
            ['2000', 'Paul Rendell', 'fait fonctionner en avril une machine de Turing, avec ses états, son ruban et sa tête de lecture.'],
            ['2002', 'Paul Chapman', 'construit une machine de Minsky sur la mémoire de Hickerson, puis l’étend en machine à registres universelle.'],
            ['2006', 'Brice Due', 'achève le *métapixel OTCA* : un carré de 2 048 × 2 048 cases qui se comporte comme une seule case du jeu de la vie, ou de n’importe quelle règle du même type. Il lui faut 35 328 générations pour en simuler une.'],
            ['2009', 'Adam P. Goucher', 'construit un ordinateur-constructeur universel muni de trois rubans de mémoire infinis.'],
            ['2010', 'Paul Rendell', 'rend sa machine universelle : elle lit sur son ruban la description d’une autre machine, et l’exécute.'],
            ['2011', 'Paul Rendell', 'lui donne un ruban illimité : deux piles construites par collisions de planeurs, qui s’allongent tant que le calcul en a besoin.'],
            ['2017', 'Une équipe de Code Golf Stack Exchange', 'achève *Quest for Tetris* : un processeur de 16 bits, avec son assembleur et son compilateur, qui fait tourner une partie de Tetris. Le motif mesure près de 3 millions de cases sur plus de 10 millions.'],
          ],
        },
        { p: 'Le Tetris est bâti par étages. Des métapixels OTCA simulent une variante du jeu de la vie où chaque case peut suivre sa propre règle. Dans cette variante, on construit des portes logiques ; avec les portes, un processeur ; pour le processeur, un langage d’assemblage, puis un petit langage de programmation, dans lequel le jeu est écrit.' },
        { p: 'Le métapixel permet aussi au jeu de la vie de se simuler lui-même : une grille de métapixels se comporte comme une grille du jeu de la vie, 2 048 fois plus grande et 35 328 fois plus lente. On peut recommencer avec cette grille, et ainsi de suite.' },
      ],
    },
    {
      id: 'limites', titre: 'Ce qu’on ne pourra jamais prédire', blocs: [
        { p: 'Un ordinateur universel hérite d’une limite célèbre. En 1936, Alan Turing démontre qu’aucun programme ne peut dire, pour tout programme et toute donnée, si le calcul finira par s’arrêter. Le jeu de la vie en hérite à son tour.' },
        { p: 'Prenons une machine de Turing quelconque et construisons le motif qui la simule, avec un ajout : au moment où la machine s’arrête, le motif lance un planeur vers une case lointaine, que rien d’autre ne touche. Cette case s’allumera un jour si et seulement si la machine s’arrête. Un algorithme qui prédirait l’avenir de n’importe quelle case résoudrait le problème de l’arrêt : il n’en existe donc pas. La même astuce montre qu’on ne peut pas savoir en général si un motif donné apparaîtra un jour.' },
        { p: 'Attention au sens. Chaque génération se calcule sans peine, et si la case s’allume, la simulation finira par le voir. Ce qui est impossible, c’est de certifier en général qu’elle ne s’allumera jamais. Les mathusalems en donnent un avant-goût : rien, dans les 5 cellules du R-pentomino, n’annonce les 1 103 générations d’agitation qui suivent.' },
        { p: 'Le jeu de la vie résiste aussi aux raccourcis. Hashlife saute des milliards de générations, mais seulement quand le motif se répète. En général, on pense qu’aucun ordinateur, même massivement parallèle, ne peut prédire l’état d’une case beaucoup plus vite qu’en déroulant les générations.' },
        {
          expert: 'indécidable, semi-décidable, P-complet', blocs: [
            { p: 'Notons $F$ l’application qui fait avancer d’une génération. Savoir si un motif fini $P$ devient un jour exactement le motif $Q$,' },
            { tex: tex`\mathcal{A} = \big\{ (P, Q) \;:\; \exists\, t \ge 0,\ F^t(P) = Q \big\},` },
            { p: 'est *semi-décidable* : si c’est le cas, la simulation finit par le montrer. Mais ce n’est pas décidable, et c’est même un problème $\\Sigma^0_1$-complet : exactement aussi difficile que le problème de l’arrêt.' },
            { p: 'En informatique, le théorème de Rice (1953) va plus loin que le problème de l’arrêt : toute propriété non triviale de la fonction que calcule un programme est indécidable. Le jeu de la vie en a un équivalent informel : dès qu’une question sur l’avenir lointain d’un motif permet de lire le résultat d’une machine simulée, elle est indécidable.' },
            { p: 'À horizon fixé, la question devient décidable, mais elle reste difficile à paralléliser. Le problème « la case $x$ est-elle vivante à la génération $T$ ? », avec $T$ écrit en unaire, est *P-complet*. Si, comme on le conjecture, $\\mathsf{P} \\neq \\mathsf{NC}$, aucun algorithme parallèle utilisant un nombre polynomial de processeurs ne le résout en temps polylogarithmique.' },
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
            ['Années 1940', 'Stanisław Ulam et John von Neumann', 'posent les bases des automates cellulaires. Von Neumann conçoit, sur une grille à 29 états, une machine capable de se reproduire ; ses travaux paraissent en 1966, complétés par Arthur Burks.'],
            ['1970', 'Martin Gardner', 'présente en octobre, dans sa rubrique « Mathematical Games » de Scientific American, le jeu inventé par John Conway. Conway y promet 50 dollars à qui dira si un motif peut croître sans fin.'],
            ['1970', 'Bill Gosper et son équipe du MIT', 'remportent le prix en novembre avec le premier canon à planeurs.'],
            ['1971', 'Roger Banks', 'propose le premier jardin d’Éden explicite, confirmé ensuite par une recherche exhaustive.'],
            ['1972', 'John Conway', 'pose le problème du grand-père dans la lettre d’information *Lifeline*.'],
            ['1982', 'Berlekamp, Conway et Guy', 'esquissent dans *Winning Ways for your Mathematical Plays* la démonstration que le jeu de la vie peut tout calculer.'],
            ['1984', 'Bill Gosper', 'publie Hashlife, qui saute des milliards de générations sur les motifs réguliers.'],
            ['1984', 'Stephen Wolfram', 'range les automates cellulaires en quatre classes, de l’ordre au chaos.'],
            ['1990', 'Christopher Langton', 'propose le paramètre $\\lambda$ et l’image du « bord du chaos ».'],
            ['2000', 'Paul Rendell', 'construit une machine de Turing en état de marche ; il en fait une machine universelle en 2010.'],
            ['2006', 'Brice Due', 'achève le métapixel OTCA : le jeu de la vie simulé dans lui-même.'],
            ['2010', 'Andrew J. Wade', 'annonce Gemini, un motif qui se reconstruit sans cesse plus loin : le premier vaisseau qui se déplace en oblique.'],
            ['2013', 'Dave Greene', 'construit le 23 novembre le premier réplicateur du jeu de la vie.'],
            ['2016', 'Steven Eker', 'trouve en avril le plus petit orphelin connu : 57 cellules, dans un rectangle de 8 × 12.'],
            ['2016', 'mtve', 'résout en mai le problème du grand-père : un motif qui a un parent, mais pas de grand-parent.'],
            ['2017', 'Une équipe de Code Golf Stack Exchange', 'fait tourner Tetris sur un processeur construit dans le jeu de la vie.'],
            ['2018', 'Adam P. Goucher', 'découvre Sir Robin, le premier vaisseau élémentaire qui avance comme le cavalier des échecs.'],
            ['2020', 'John Conway', 'meurt le 11 avril, des suites du Covid-19.'],
            ['2023', 'Nico Brown, Mitchell Riley et leurs coauteurs', 'trouvent des oscillateurs de période 19 et 41 : le jeu de la vie a un oscillateur de chaque période.'],
          ],
        },
      ],
    },
    {
      id: 'refs', titre: 'Références', blocs: [
        {
          refs: [
            ['A. M. Turing, « On computable numbers, with an application to the Entscheidungsproblem », Proceedings of the London Mathematical Society, 1936.'],
            ['H. G. Rice, « Classes of recursively enumerable sets and their decision problems », Transactions of the American Mathematical Society 74, 1953.'],
            ['E. F. Moore, « Machine models of self-reproduction », Proceedings of Symposia in Applied Mathematics 14, 1962.'],
            ['J. Myhill, « The converse of Moore’s Garden-of-Eden theorem », Proceedings of the American Mathematical Society 14, 1963.'],
            ['J. von Neumann, *Theory of Self-Reproducing Automata*, éd. A. W. Burks, University of Illinois Press, 1966.'],
            ['M. L. Minsky, *Computation: Finite and Infinite Machines*, Prentice-Hall, 1967.'],
            ['E. F. Codd, *Cellular Automata*, Academic Press, 1968.'],
            ['M. Gardner, « Mathematical Games : the fantastic combinations of John Conway’s new solitaire game “life” », Scientific American 223, octobre 1970.'],
            ['E. R. Berlekamp, J. H. Conway et R. K. Guy, *Winning Ways for your Mathematical Plays*, Academic Press, 1982.'],
            ['R. W. Gosper, « Exploiting regularities in large cellular spaces », Physica D 10, 1984.'],
            ['S. Wolfram, « Universality and complexity in cellular automata », Physica D 10, 1984.'],
            ['C. G. Langton, « Self-reproduction in cellular automata », Physica D 10, 1984.'],
            ['D. Hickerson, « Description of sliding block memory », 1990.', 'https://conwaylife.com/ref/lifepage/patterns/sbm/sbm.html'],
            ['C. G. Langton, « Computation at the edge of chaos : phase transitions and emergent computation », Physica D 42, 1990.'],
            ['M. Mitchell, P. Hraber et J. P. Crutchfield, « Revisiting the edge of chaos : evolving cellular automata to perform computations », 1993.', 'https://arxiv.org/abs/adap-org/9303003'],
            ['U. Pesavento, « An implementation of von Neumann’s self-reproducing machine », Artificial Life 2, 1995.'],
            ['P. Rendell, « A fully universal Turing machine in Conway’s Game of Life », Journal of Cellular Automata 8, 2013.'],
            ['P. Rendell, *Turing Machine Universality of the Game of Life*, Springer, 2015.'],
            ['T. Rokicki, « An algorithm for compressing space and time », Dr. Dobb’s Journal, 2006.', 'https://www.drdobbs.com/cpp/an-algorithm-for-compressing-space-and-t/184406478'],
            ['N. Johnston, « Generating sequences of primes in Conway’s Game of Life », 2009.', 'https://njohnston.ca/2009/08/generating-sequences-of-primes-in-conways-game-of-life/'],
            ['N. Johnston, « Spaceship speed limits in “B3” Life-like cellular automata », 2009.', 'https://njohnston.ca/2009/10/spaceship-speed-limits-in-life-like-cellular-automata/'],
            ['« Build a working game of Tetris in Conway’s Game of Life », Code Golf Stack Exchange, 2017.', 'https://codegolf.stackexchange.com/questions/11880/build-a-working-game-of-tetris-in-conways-game-of-life'],
            ['V. Salo et I. Törmä, « What can oracles teach us about the ultimate fate of life? », 2022.', 'https://arxiv.org/abs/2202.07346'],
            ['N. Brown, C. Cheng, T. Jacobi, M. Karpovich, M. Merzenich, D. Raucci et M. Riley, « Conway’s Game of Life is omniperiodic », 2023.', 'https://arxiv.org/abs/2312.02799'],
            ['Wikipédia, « Conway’s Game of Life ».', 'https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life'],
            ['Wikipédia, « Garden of Eden (cellular automaton) ».', 'https://en.wikipedia.org/wiki/Garden_of_Eden_(cellular_automaton)'],
            ['Wikipédia, « Life-like cellular automaton ».', 'https://en.wikipedia.org/wiki/Life-like_cellular_automaton'],
            ['Wikipédia, « Replicator (cellular automaton) ».', 'https://en.wikipedia.org/wiki/Replicator_(cellular_automaton)'],
            ['Wikipédia, « P-complete ».', 'https://en.wikipedia.org/wiki/P-complete'],
            ['D. Eppstein, « Replicators : B36/S23 (HighLife) ».', 'https://ics.uci.edu/~eppstein/ca/replicators/b36s23.html'],
            ['LifeWiki, « Gemini ».', 'https://conwaylife.com/wiki/Gemini'],
            ['LifeWiki, « R-pentomino ».', 'https://conwaylife.com/wiki/R-pentomino'],
            ['LifeWiki, « Problem » (questions ouvertes).', 'https://conwaylife.com/wiki/Problem'],
          ],
        },
      ],
    },
  ],

  figures: {
    destins: [
      ['Il meurt', 'Sept cellules, éteintes en 45 générations.'],
      ['Il se fige', 'Neuf cellules, figées en 53 générations.'],
      ['Il oscille', 'Le pulsar revient à l’identique toutes les 3 générations.'],
      ['Il voyage', 'Le planeur avance d’une case en diagonale toutes les 4 générations.'],
    ],
    voisinage: {
      groupe: 'La case centrale et ses huit voisines',
      centre: 'Case centrale',
      voisine: 'Voisine',
      legende: 'La case entourée et ses huit voisines. Cliquez pour faire vivre ou mourir une case.',
      compte: (n) => (n > 1 ? `${n} voisines vivantes` : `${n} voisine vivante`),
      verdict: (centre, n, suivant) => {
        if (centre && suivant) return 'Vivante, elle survit.'
        if (centre) return n < 2 ? 'Vivante, elle meurt d’isolement.' : 'Vivante, elle meurt étouffée.'
        return suivant ? 'Morte, elle naît.' : 'Morte, elle le reste.'
      },
    },
    planeur: {
      legende: 'Les cinq premières générations du planeur. À la génération 2, il est le reflet de la génération 0 par rapport à une diagonale ; à la génération 4, il a retrouvé sa forme, décalé d’une case en diagonale (en pointillé : sa position de départ).',
      phase: (g) => `Planeur, génération ${g}`,
      gen: (g) => `gén. ${g}`,
    },
    canon: {
      label: 'Le canon de Gosper en action : un planeur sort toutes les 30 générations.',
      legende: 'Le canon de Gosper : deux navettes font des allers-retours entre deux blocs, et lancent un planeur toutes les 30 générations.',
      titre: 'Population du canon de Gosper',
      axeX: 'générations',
      axeY: 'cellules',
      premier: 'premier planeur (gén. 15)',
      info: (g, p) => `génération ${g}\u00a0: ${p} cellules`,
      resume: 'Courbe de la population du canon de Gosper sur 600 générations : elle oscille, mais monte régulièrement, d’environ 5 cellules toutes les 30 générations.',
      donnees: 'Voir les données',
      colGen: 'Génération',
      colPop: 'Cellules',
    },
    saut: {
      titre: 'Sauter dans le temps avec Hashlife',
      motif: 'Motif',
      noms: { gosper: 'Canon de Gosper', gland: 'Gland', ligne39: 'Ligne de 39 cases' },
      generations: 'Générations',
      calculer: 'Calculer',
      enCours: 'Calcul en cours…',
      attente: 'Choisissez un motif et un nombre de générations, puis lancez le calcul.',
      resume: (nom, gen, pop) => `${nom} à la génération ${gen}\u00a0: ${pop} cellules, vu en entier.`,
      colGen: 'Génération',
      colPop: 'Cellules vivantes',
      colTemps: 'Temps de calcul',
      colNoeuds: 'Carrés distincts en mémoire',
      ms: (n) => `${n} ms`,
    },
    jumeaux: {
      titres: ['Le carré central est vide', 'Une seule cellule au centre'],
      legende: 'Même entourage tiré au hasard, et un carré de 5 × 5 au centre : vide à gauche, avec une seule cellule à droite (en vert).',
      depart: 'Génération 0 : les deux grilles diffèrent d’une seule case.',
      identiques: (g) => (g > 1 ? `Génération ${g}\u00a0: les deux grilles sont toujours identiques.` : 'Génération 1 : les deux grilles sont identiques, partout.'),
      differentes: (g) => `Génération ${g}\u00a0: les grilles diffèrent.`,
      unPas: 'Une génération',
      autre: 'Autre entourage',
    },
    soupes: {
      titre: 'Densité finale d’une soupe aléatoire',
      champ: 'Champ moyen (cases indépendantes)',
      mesure: 'Simulation',
      axeX: 'densité de départ',
      axeY: 'densité finale',
      info: (p, valeurs) => `départ ${p}\u00a0: ${valeurs.map(([nom, v]) => `${nom.split(' (')[0].toLowerCase()} ${v}`).join(', ')}`,
      resume: 'Densité finale en fonction de la densité de départ : le champ moyen prédit 37 % au milieu, la simulation donne environ 3 %.',
      lancer: 'Lancer l’expérience',
      relancer: 'Recalculer',
      attente: '38 soupes de 128 × 128 cases sur un tore, 2 000 générations chacune : quelques secondes, dans votre navigateur.',
      calcul: (k, n) => `Calcul\u00a0: ${k} soupes sur ${n}`,
      donnees: 'Voir les données',
      colDepart: 'Densité de départ',
      colMesure: 'Simulation',
      colChamp: 'Champ moyen',
    },
    lambda: {
      titre: 'Le paramètre λ des règles à deux états',
      valeur: (n, v) => `${n}/512 ≈ ${v}`,
      label: (nom) => `Une soupe aléatoire de 40 × 40 cases sous la règle ${nom}`,
      etat: (nom, texte) => `${nom}, ${texte}`,
      legende: 'Cliquez sur une règle pour la voir agir. La soupe de départ est la même pour toutes : 40 × 40 cases, dont 40 % de vivantes. La barre montre λ, de 0 à 1.',
    },
    replicateurs: {
      titres: ['HighLife (B36/S23) : un motif de 12 cellules', 'Réplicateur (B1357/S1357) : le R-pentomino'],
      legende: 'À gauche, le motif se dédouble en 12 générations, puis chaque copie se recopie à son tour : 8 copies à la génération 84. À droite, à la génération 16, le R-pentomino est là en 8 exemplaires, à 16 cases dans chaque direction.',
    },
    porte: {
      label: 'Une porte NON en planeurs : le flot d’un canon croise le signal A et ne passe que là où A est vide.',
      reperes: { canon: 'canon : que des 1', signal: 'signal A', sortie: 'sortie : NON A', mangeur: 'mangeur' },
      entree: 'Entrée A',
      lue: 'Sortie lue',
      bit: (i, b) => `Bit ${i} de l’entrée\u00a0: ${b}. Cliquer pour le changer.`,
      bitLu: (i, b) => `Bit ${i} lu en sortie\u00a0: ${b}`,
      attente: 'En attente du prochain passage',
      legende: 'En haut à gauche, un canon de Gosper ; en haut à droite, son reflet, qui porte le signal A. Les 8 bits de l’entrée défilent en boucle ; cliquez pour les changer. Pour envoyer un 0, on retire le planeur à la sortie de son canon. La sortie est lue dans le carré pointillé, puis avalée par le mangeur. Après un changement, le nouveau bit met quelques secondes à arriver.',
    },
    minsky: {
      programme: 'Programme',
      noms: { doubler: 'Doubler A', parite: 'A est-il pair ?' },
      depart: 'Au départ',
      moins: 'Diminuer A',
      plus: 'Augmenter A',
      code: 'Le programme',
      rail: (r, n) => `Compteur ${r}\u00a0: le bloc est à ${n} cases du zéro`,
      instruction: (i) => (i.op === 'inc'
        ? `INC ${i.r}, puis q${i.suite + 1}`
        : `DEC ${i.r}, puis q${i.suite + 1}\u202f; si ${i.r} = 0\u00a0: ${ARRETS[i.siZero]}`),
      action: (e, id, a) => {
        if (!e.dernier) return `Prêt\u00a0: A = ${a}, B = 0. Le programme commence en q1.`
        if (e.fin && id === 'doubler') return `Test du zéro\u00a0: A = 0, la machine s’arrête. B = ${e.B}, le double de ${a}, en ${e.pas} instructions.`
        if (e.fin) return `Test du zéro\u00a0: A = 0 en q${e.dernier.pc + 1}, arrêt sur «\u00a0${e.fin}\u00a0»\u00a0: ${a} est ${e.fin}.`
        const { pc, op, r } = e.dernier
        return op === 'inc'
          ? `q${pc + 1}, INC ${r}\u00a0: une salve de 3 planeurs pousse le bloc ${r} d’une case.`
          : `q${pc + 1}, DEC ${r}\u00a0: une salve de 2 planeurs tire le bloc ${r} d’une case.`
      },
      unPas: 'Une instruction',
      lancer: 'Lancer',
      pause: 'Pause',
      recommencer: 'Recommencer',
      legende: 'Deux instructions seulement : INC ajoute 1 à un compteur ; DEC lui retire 1, ou saute ailleurs s’il vaut déjà 0. La case foncée marque la position du bloc, comptée depuis la case de gauche. Les salves indiquées sont celles de la mémoire de Dean Hickerson.',
    },
  },
}

// Les trois façons de s’arrêter des machines à compteurs
const ARRETS = { fin: 'arrêt', pair: 'arrêt, « pair »', impair: 'arrêt, « impair »' }