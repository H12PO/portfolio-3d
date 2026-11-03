// ============================================================
//  ARTICLES EN FRANÇAIS : Comprendre, Théorie, Applications, Calcul,
//  Histoire et références, et les textes des figures
//  Blocs : { p }, { liste }, { tex, etroit? }, { figure }, { expert },
//  { frise }, { refs }, { ouvrir, libelle, aide }. Dans le texte :
//  *italique* et $formule$ (LaTeX).
//  Sources principales : les articles de Bert Chan (2019, 2020), de
//  Stephan Rafler (2011), d'Erwan Plantec et al. (2023), le dépôt
//  github.com/Chakazul/Lenia, et les autres travaux des références.
// ============================================================

const tex = String.raw

export const LECTURE_FR = {
  comprendre: [
    {
      id: 'continu', titre: 'Le jeu de la vie, en continu', blocs: [
        { p: 'Dans le jeu de la vie de John Conway, chaque case d’une grille est vivante ou morte, et regarde ses huit voisines. Trois voisines vivantes font naître une case ; deux ou trois la gardent en vie ; sinon, elle meurt. Le temps avance par sauts, tous en même temps.' },
        { p: 'Bert Chan se demande ce qui arrive si l’on rend tout continu. Une case n’est plus vivante ou morte : elle contient une quantité de matière entre 0 et 1. Elle ne regarde plus huit voisines mais un disque de plusieurs dizaines de cases, avec des poids qui varient doucement. Et le temps avance par petits pas. Il appelle le résultat *Lenia*, du latin *lenis*, « doux », et le publie en 2018.' },
        { p: 'Ce qui apparaît ne ressemble plus à des motifs de pixels, mais à des êtres : des taches qui nagent, tournent, pulsent, se réparent quand on les abîme. Le plus célèbre s’appelle Orbium.' },
        { ouvrir: 'orbium', libelle: 'Voir l’Orbium dans l’explorateur', aide: 'Cliquez ensuite dans le monde pour en poser d’autres.' },
      ],
    },
    {
      id: 'regle', titre: 'Une règle en deux temps', blocs: [
        { p: 'À chaque pas, chaque case fait deux choses. D’abord, elle regarde autour d’elle : elle fait la moyenne de la matière de ses voisines, pondérée par un *noyau* en forme d’anneau. On obtient un nombre entre 0 et 1, le *potentiel* U. Ensuite, elle applique la *croissance* : si U est proche d’une valeur idéale, la case gagne un peu de matière ; s’il en est loin, trop peu ou trop entourée, elle en perd.' },
        { p: 'Voici un Orbium de près, avec ces trois quantités côte à côte :' },
        { figure: 'mecanisme' },
        { p: 'Le potentiel est une version floue de la créature. La croissance montre le secret de son mouvement : la matière pousse à l’avant, en vert, et disparaît à l’arrière, en magenta. L’Orbium ne se déplace pas comme un objet qu’on pousse. Il se reconstruit sans cesse un peu plus loin.' },
      ],
    },
    {
      id: 'bestiaire', titre: 'Un bestiaire', blocs: [
        { p: 'Bert Chan a recensé plus de 400 espèces en 18 familles, qu’il range comme un naturaliste, avec des noms latins : Orbium, Scutium, Gyrorbium, Hydrogeminium… Beaucoup ont été trouvées par *évolution interactive* : l’ordinateur propose des variantes, l’humain choisit celles qui lui plaisent. Chacune correspond à une règle et à une forme de départ. Certaines avancent, d’autres tournent sur place ou restent immobiles. En voici quelques-unes :' },
        { figure: 'galerie' },
      ],
    },
    {
      id: 'modeles', titre: 'Quatre modèles', blocs: [
        { p: 'L’explorateur propose quatre variantes de la même idée.' },
        {
          liste: [
            '*Lenia*, la version de 2019 : un seul canal de matière, un noyau fait d’anneaux. Le bestiaire classique.',
            '*Lenia étendu* (2020) : trois canaux, rouge, vert et bleu, reliés par une quinzaine de noyaux. Les créatures ont des organes, et plusieurs espèces partagent la même règle.',
            '*SmoothLife* (2011) : l’ancêtre, inventé par Stephan Rafler. Un disque, un anneau, et des planeurs en forme de beignet.',
            '*Flow Lenia* (2023) : la matière ne se crée plus ni ne se détruit, elle s’écoule. Des individus se forment, se divisent, et plusieurs espèces peuvent se disputer le même monde.',
          ],
        },
        { ouvrir: 'limus', libelle: 'Ouvrir l’aquarium de Lenia étendu' },
      ],
    },
    {
      id: 'mutants', titre: 'Jouer à l’évolution', blocs: [
        { p: 'Les créatures vivent sur des crêtes étroites. Changez un peu le centre μ ou la largeur σ de la croissance, et l’Orbium s’éteint ou déborde en une tache qui envahit tout. Le panneau *Mutations* de l’explorateur fait varier la règle au hasard et montre quatre mutants côte à côte, partis de la même créature. La plupart meurent. Gardez un survivant, recommencez à partir de lui : c’est une sélection artificielle, à la main, la méthode même qui a permis à Bert Chan de découvrir une bonne part de son bestiaire.' },
      ],
    },
  ],

  theorie: [
    {
      id: 'pas-a-pas', titre: 'Du jeu de la vie à Lenia, pas à pas', blocs: [
        { p: 'Écrivons le jeu de la vie avec des outils qui se généralisent. Notons $A^t$ la grille au temps t, avec $A = 1$ pour une case vivante et 0 pour une morte. Compter les voisines vivantes d’une case revient à faire une *convolution* : on promène un masque K sur la grille, et l’on additionne les cases qu’il recouvre, pondérées par ses valeurs. Toute la règle tient alors en une ligne :' },
        { tex: tex`A^{t+1} = \big[\, A^t + G(K * A^t) \,\big]_0^1,` },
        { p: 'où G vaut +1 (naître ou survivre) ou −1 (mourir), et $[\\,\\cdot\\,]_0^1$ ramène le résultat entre 0 et 1. Lenia rend continu chacun des trois ingrédients.' },
        {
          liste: [
            '*Les états* : $A$ prend toutes les valeurs entre 0 et 1, et G devient une courbe en cloche lisse au lieu d’un tout ou rien.',
            '*L’espace* : le masque de 3 × 3 cases devient un noyau K en anneau de rayon R, des dizaines de cases, à poids lissés. Sa somme vaut 1, si bien que $U = K * A$ est une moyenne.',
            '*Le temps* : au lieu de sauter, on avance d’un petit pas $\\Delta t = 1/T$.',
          ],
        },
        { tex: tex`A^{t+\Delta t} = \big[\, A^t + \Delta t \; G(K * A^t) \,\big]_0^1.` },
        { p: 'Quand le pas de temps tend vers 0 et que les cases deviennent infiniment fines, on obtient une équation d’évolution continue, $\\partial A/\\partial t = G(K * A)$, tant que A reste entre 0 et 1. Lenia est la version calculable de cette équation.' },
        {
          expert: 'le jeu de la vie, cas particulier de Lenia', blocs: [
            { p: 'Prenons un noyau de rayon 2 qui vaut 1 sur les huit voisines et 1/2 sur la case elle-même ; sa somme vaut 8,5. Avec n voisines vivantes, le potentiel vaut $U = (n + A/2)/8{,}5$. Une case vivante survit si n vaut 2 ou 3, soit $U \\in \\{0{,}294;\\ 0{,}412\\}$ ; une case morte naît si n vaut 3, soit $U = 0{,}353$. Toutes les autres combinaisons tombent hors de l’intervalle [0,29 ; 0,42]. La règle de Conway s’écrit donc' },
            { tex: tex`G(U) = \begin{cases} +1 & \text{si } |U - 0{,}35| \le 0{,}07, \\ -1 & \text{sinon,} \end{cases} \qquad \Delta t = 1.` },
            { p: 'C’est exactement la règle du « planeur du jeu de la vie » de l’explorateur : Lenia contient le jeu de la vie comme un cas extrême, avec un noyau minuscule, une croissance en marche d’escalier et un pas de temps entier.' },
          ],
        },
        { ouvrir: 'planeur', libelle: 'Voir le planeur de Conway dans Lenia' },
      ],
    },
    {
      id: 'noyau', titre: 'Le noyau et la croissance', blocs: [
        { p: 'Le noyau décrit ce qu’une case « voit ». Il est fait d’un ou plusieurs anneaux concentriques : la distance r au centre, divisée par le rayon R, est découpée en B bandes, et chaque bande reçoit un profil en bosse multiplié par une hauteur $b_i$. Le profil le plus courant est exponentiel ou polynomial :' },
        { tex: tex`K_C(\rho) = \exp\!\Big(4 - \frac{1}{\rho(1 - \rho)}\Big) \quad \text{ou} \quad K_C(\rho) = \big(4\rho(1 - \rho)\big)^4, \qquad \rho \in\ ]0, 1[.` },
        { p: 'Les voisinages se voient mieux qu’ils ne se décrivent :' },
        { figure: 'voisinages' },
        { p: 'La croissance traduit le potentiel en gain ou en perte de matière. C’est une cloche de centre μ et de largeur σ, ramenée entre −1 et 1 :' },
        { tex: tex`G(U) = 2\exp\!\Big(-\frac{(U - \mu)^2}{2\sigma^2}\Big) - 1.` },
        { p: 'μ est la densité de voisinage idéale, σ la tolérance. Pour l’Orbium, μ = 0,15 et σ = 0,015 : une case ne gagne de la matière que si la moyenne pondérée de son anneau est très proche de 15 %. Faites varier les deux nombres :' },
        { figure: 'regle' },
        { p: 'Avec σ un peu trop petit, presque aucune case ne trouve son compte : la créature s’éteint. Avec σ un peu trop grand, trop de cases poussent : elle déborde et envahit le monde. Les créatures vivent dans la bande étroite entre les deux.' },
      ],
    },
    {
      id: 'creature', titre: 'Qu’est-ce qu’une créature ?', blocs: [
        { p: 'Pour Bert Chan, une créature est une forme localisée qui persiste : elle garde son allure au fil du temps, qu’elle reste sur place, tourne, oscille ou se déplace. En termes de systèmes dynamiques, c’est un *attracteur* : si on la dérange un peu, la dynamique la ramène vers sa forme. Essayez de bousculer un Orbium, ou de lui couper un morceau :' },
        { figure: 'robustesse' },
        { p: 'Le noyau est rond : la règle ne privilégie aucune direction. Une créature peut donc filer dans n’importe quel sens, alors que les planeurs du jeu de la vie ne connaissent que quatre diagonales. Sa forme décide de son mouvement. Une créature symétrique par rapport à un axe avance le long de cet axe ; une créature dont la forme ne change pas quand on la tourne d’un angle tourne sur place ; une forme sans symétrie décrit des cercles, comme le Gyrorbium.' },
        { p: 'Bert Chan a classé ses trouvailles comme un naturaliste : plus de 400 espèces réparties en 18 familles, Orbidae, Scutidae, Pterifera, Helicidae, Kronidae, Dentidae… Une espèce occupe une petite île dans l’espace des paramètres. Autour, il n’y a que des mondes vides ou des taches qui débordent. Le panneau *Mutations* de l’explorateur permet de tâter les bords de ces îles.' },
      ],
    },
    {
      id: 'smooth', titre: 'SmoothLife, l’ancêtre', blocs: [
        { p: 'En 2011, Stephan Rafler publie SmoothLife, le premier jeu de la vie vraiment lisse. Chaque case mesure deux moyennes : m sur un petit disque autour d’elle, qui dit si elle est « vivante », et n sur l’anneau qui l’entoure, qui joue le rôle des voisines. Le nouvel état est une fonction lisse $s(n, m)$ : une case vide naît si n tombe entre $b_1$ et $b_2$, une case pleine survit si n tombe entre $d_1$ et $d_2$, et des sigmoïdes adoucissent toutes ces frontières.' },
        { tex: tex`f^{t+1} = s(n, m) = \sigma\big(n - a(m)\big)\,\big(1 - \sigma\big(n - c(m)\big)\big),` },
        { p: 'où $a(m)$ passe de $b_1$ à $d_1$ et $c(m)$ de $b_2$ à $d_2$ quand la case se remplit. Les valeurs de Rafler, $b = [0{,}278 ; 0{,}365]$ et $d = [0{,}267 ; 0{,}445]$, rappellent celles du jeu de la vie : naître avec 3 voisines sur 8, c’est 0,375 ; survivre avec 2 ou 3, c’est entre 0,25 et 0,375. On y voit planer des anneaux, les premiers planeurs lisses.' },
        { ouvrir: 'smooth', libelle: 'Ouvrir SmoothLife' },
        { p: 'Rafler propose aussi un temps continu : au lieu de remplacer f par s d’un coup, on avance d’un petit pas dt, $f \\leftarrow f + dt\\,(2s - 1)$. D’autres variantes rapprochent simplement f de s, $f \\leftarrow f + dt\\,(s - f)$. Les planeurs y existent encore, mais pour d’autres seuils. Avec $b = [0{,}245 ; 0{,}293]$ et $d = [0{,}259 ; 0{,}414]$, trouvés ici par une recherche au hasard, ils glissent sans à-coups, à la même vitesse quel que soit dt.' },
        { ouvrir: 'smooth_planeurs', libelle: 'Ouvrir les planeurs lisses' },
      ],
    },
    {
      id: 'etendu', titre: 'Plusieurs canaux, plusieurs noyaux', blocs: [
        { p: 'En 2020, Bert Chan étend Lenia à plusieurs canaux, comme plusieurs substances chimiques qui coexistent, et à plusieurs noyaux, chacun lisant un canal et agissant sur un autre. Chaque noyau k a sa source $c_0$, sa cible $c_1$, sa croissance $G_k$ et un poids $h_k$ :' },
        { tex: tex`A_c^{t+\Delta t} = \Big[\, A_c^t + \Delta t \, \frac{\sum_{k \,:\, c_1(k) = c} h_k\, G_k\big(K_k * A_{c_0(k)}^t\big)}{\sum_{k \,:\, c_1(k) = c} h_k} \,\Big]_0^1.`, etroit: tex`\begin{gathered} A_c^{t+\Delta t} = \big[\, A_c^t + \Delta t \, D_c \,\big]_0^1 \\[4pt] D_c = \frac{\sum_{c_1(k) = c} h_k\, G_k\big(K_k * A_{c_0(k)}^t\big)}{\sum_{c_1(k) = c} h_k} \end{gathered}` },
        { p: 'Les créatures se différencient : un canal forme une membrane, un autre un noyau, un troisième une queue. Certaines se divisent ; d’autres réagissent quand elles en croisent une autre. Et plusieurs espèces peuvent partager exactement la même règle : c’est l’*aquarium* de l’explorateur, où six créatures très différentes vivent ensemble.' },
      ],
    },
    {
      id: 'flow', titre: 'Flow Lenia : la matière se conserve', blocs: [
        { p: 'Dans Lenia, la matière apparaît et disparaît : la masse totale varie sans cesse. Une créature ne prend donc rien à ses voisines, et il n’y a ni ressource ni compétition. En 2023, Erwan Plantec, Bert Chan et leurs collègues proposent *Flow Lenia* : le potentiel ne fait plus pousser la matière sur place, il indique où elle doit aller.' },
        { tex: tex`F = (1 - \alpha)\,\nabla U - \alpha\, \nabla A, \qquad \alpha = \min\big(1, (A/\theta)^2\big).` },
        { p: 'La matière remonte la pente de U, l’*affinité*, mais elle fuit les endroits déjà trop pleins, où α s’approche de 1. Elle est ensuite déplacée sans rien perdre ni gagner : la masse totale ne change jamais. Résultat, une tache de matière se fragmente en individus bien séparés, qui se déplacent, fusionnent ou se divisent.' },
        { p: 'Deuxième idée : chaque case porte ses propres paramètres, ici les poids des noyaux, et les transporte avec sa matière. Là où deux flux se mélangent, la case prend les paramètres de l’une de ses sources, tirée au sort selon la masse qu’elle apporte. Plusieurs espèces se disputent alors le même monde, et une mutation locale peut s’y répandre : l’évolution a lieu dans la simulation elle-même. C’est l’option *Plusieurs espèces* de l’explorateur.' },
        {
          expert: 'la redistribution de la matière', blocs: [
            { p: 'Le déplacement utilise le *reintegration tracking*, une technique de simulation de fluides imaginée par Mykhailo Moroz. La matière d’une case p′ est étalée dans un carré de côté 2s centré sur sa position d’arrivée $\\mu(p\') = p\' + \\Delta t\\, F(p\')$. La case p en reçoit la part que ce carré recouvre :' },
            { tex: tex`A'(p) = \sum_{p'} A(p')\, \frac{\big|\,[p]\, \cap\, \mathcal{C}_{2s}(\mu(p'))\,\big|}{(2s)^2}.` },
            { p: 'Les parts reçues par toutes les cases recouvrent exactement le carré de départ : leur somme vaut 1, et la masse totale est conservée. L’explorateur prend s = 0,65 et limite le déplacement pour que la recherche des sources reste dans un carré de 7 × 7 cases.' },
          ],
        },
        { ouvrir: 'flow_division', libelle: 'Voir une cellule de Flow Lenia se diviser' },
      ],
    },
    {
      id: 'ouvert', titre: 'Questions ouvertes', blocs: [
        { p: 'Le jeu de la vie peut calculer : on y a construit des portes logiques, puis des machines de Turing complètes. Pour Lenia, on ne sait pas. Ses créatures sont robustes et variées, mais personne n’a encore montré qu’on peut les assembler en circuits qui calculent n’importe quoi.' },
        { p: 'Autre question : l’évolution ouverte. Dans le vivant, l’évolution invente sans fin des formes plus complexes. Dans les mondes artificiels, elle finit presque toujours par s’essouffler. Flow Lenia et ses espèces qui se disputent la matière est l’une des tentatives pour la relancer. Les chercheurs automatisent aussi la découverte : des algorithmes d’exploration, puis des modèles d’intelligence artificielle capables de juger si un motif « a l’air vivant », parcourent l’espace des règles à la recherche de créatures nouvelles. L’onglet Applications en dit plus.' },
      ],
    },
  ],

  applications: [
    {
      id: 'morphogenese', titre: 'Les motifs du vivant', blocs: [
        { p: 'En 1952, Alan Turing publie *The Chemical Basis of Morphogenesis*. Deux substances diffusent et réagissent : un *activateur*, qui se renforce lui-même, et un *inhibiteur*, plus rapide, qui l’étouffe à distance. De ce duel naissent spontanément des taches et des rayures. En 1995, Shigeru Kondo et Rihito Asai montrent que les rayures d’un poisson-ange, le *Pomacanthus*, se déplacent et se réorganisent pendant sa croissance comme le prévoit un tel modèle.' },
        { p: 'Le noyau en anneau de Lenia joue le même jeu : la croissance favorise une densité modérée tout près, et punit l’excès plus loin. Les modèles de réaction-diffusion comme celui de Gray et Scott produisent d’ailleurs des taches qui se déplacent et se divisent, de proches cousines des créatures de Lenia.' },
      ],
    },
    {
      id: 'solitons', titre: 'Des particules sans particules', blocs: [
        { p: 'En 1834, l’ingénieur écossais John Scott Russell suit à cheval une vague solitaire qui remonte un canal sur des kilomètres sans se déformer. Ces *solitons* ont depuis été retrouvés en optique, dans les plasmas et dans les fibres des télécommunications. En 1996, Paul Umbanhowar, Francisco Melo et Harry Swinney observent dans une couche de sable secouée verticalement des *oscillons* : de petites bosses isolées qui battent sur place et peuvent s’assembler en molécules.' },
        { p: 'Les créatures de Lenia sont de la même famille : des motifs, et non des objets. Aucune case ne « appartient » à l’Orbium ; il persiste parce que la dynamique ne cesse de le recréer. C’est ce qui en fait un laboratoire pour la question : qu’est-ce qu’un individu ?' },
      ],
    },
    {
      id: 'neuronaux', titre: 'Les automates neuronaux', blocs: [
        { p: 'Un pas de Lenia est une convolution suivie d’une fonction non linéaire : exactement une couche d’un réseau de neurones convolutif. En 2020, Alexander Mordvintsev, Ettore Randazzo, Eyvind Niklasson et Michael Levin remplacent la règle écrite à la main par un petit réseau de neurones, entraîné par descente de gradient. Leur automate fait pousser un lézard à partir d’une seule cellule, et le répare quand on lui arrache un morceau.' },
        { p: 'La même équipe propose en 2022 *Particle Lenia*, où la matière est faite de particules qui se déplacent pour réduire une énergie. Ces travaux sont suivis de près par les biologistes qui étudient la régénération : comment des cellules sans plan d’ensemble retrouvent-elles la forme d’un organe ?' },
      ],
    },
    {
      id: 'ia', titre: 'Chercher la vie avec des machines', blocs: [
        { p: 'L’espace des règles de Lenia est immense, et les créatures y sont rares. En 2020, Chris Reinke, Mayalen Etcheverry et Pierre-Yves Oudeyer, à l’Inria, lâchent dans Lenia un algorithme d’exploration guidé par la curiosité : il se fixe ses propres buts et retient les motifs les plus différents de ceux qu’il connaît déjà. Il découvre une grande variété de créatures sans qu’on lui dise à quoi elles doivent ressembler.' },
        { p: 'En 2024, une équipe autour d’Akarsh Kumar, de Sakana AI et du MIT, va plus loin. Un modèle qui relie images et textes juge si une simulation évoque « une cellule qui se divise » ou simplement quelque chose de nouveau. Il parcourt ainsi Lenia, les boids ou le jeu de la vie. Ces recherches visent l’*évolution ouverte*, celle qui ne cesse d’inventer : une piste pour des machines vraiment créatives.' },
      ],
    },
    {
      id: 'possible', titre: 'La vie telle qu’elle pourrait être', blocs: [
        { p: 'Lenia n’est pas un modèle d’organisme réel : pas de chimie, pas de métabolisme, et dans sa version classique, pas même de conservation de la matière. Christopher Langton, qui lance la *vie artificielle* comme discipline en 1987, la définissait comme l’étude de « la vie telle qu’elle pourrait être », et pas seulement telle qu’elle est.' },
        { p: 'Lenia en est un bel exemple : se déplacer, se réparer, rester un individu, parfois se diviser, tout cela émerge de règles locales très simples. Le modèle ne dit pas comment la vie est apparue ; il montre ce qu’un peu de dynamique suffit à produire.' },
      ],
    },
    {
      id: 'convolutions', titre: 'Des convolutions partout', blocs: [
        { p: 'L’opération au cœur de Lenia, la convolution, est partout. Un flou d’image est une convolution par une petite cloche ; détecter les contours d’une photo, c’est une convolution par un noyau qui mesure la pente. La chaleur qui se diffuse suit une convolution par une gaussienne qui s’élargit. L’écho d’une cathédrale ajouté à un enregistrement, c’est la convolution du son par la réponse de la salle. Et les réseaux de neurones qui reconnaissent les images, depuis ceux de Yann LeCun à la fin des années 1980, en enchaînent des dizaines.' },
        { p: 'C’est pourquoi les cartes graphiques et la transformée de Fourier rapide, qui rendent Lenia possible en direct, servent aussi à toutes ces applications. L’onglet Calcul explique comment.' },
      ],
    },
  ],

  calcul: [
    {
      id: 'cout', titre: 'Le coût d’un pas', blocs: [
        { p: 'Pour un pas de Lenia, chaque case doit calculer son potentiel : une somme sur toutes les cases du noyau. Avec un rayon R = 13, le noyau tient dans un carré de 27 × 27, soit 729 multiplications par case. Un monde de 256 × 256 compte 65 536 cases : près de 48 millions de multiplications pour un seul pas, et il en faut des dizaines par seconde.' },
        { p: 'Pour l’aquarium de Lenia étendu, c’est bien pire : quinze noyaux de rayon 24, soit 15 × 49 × 49 ≈ 36 000 multiplications par case, et 2,4 milliards par pas.' },
      ],
    },
    {
      id: 'fourier', titre: 'Le détour par Fourier', blocs: [
        { p: 'La transformée de Fourier change une convolution en simple multiplication, case par case :' },
        { tex: tex`\widehat{K * A} = \widehat{K} \cdot \widehat{A}.` },
        { p: 'On transforme l’état, on le multiplie par la transformée du noyau, calculée une fois pour toutes, et l’on revient par la transformée inverse. Avec l’algorithme de *transformée de Fourier rapide*, publié par James Cooley et John Tukey en 1965 mais déjà connu de Gauss en 1805, une transformée de N × N cases coûte de l’ordre de $N^2 \\log_2 N$ opérations, quel que soit le rayon du noyau. Mesurez la différence sur votre processeur :' },
        { figure: 'banc' },
        {
          expert: 'pourquoi la FFT va si vite', blocs: [
            { p: 'La transformée de Fourier discrète de N valeurs se coupe en deux transformées de N/2 valeurs, l’une sur les indices pairs, l’autre sur les impairs :' },
            { tex: tex`\hat x_k = \hat e_k + \omega^k\, \hat o_k, \qquad \hat x_{k + N/2} = \hat e_k - \omega^k\, \hat o_k, \qquad \omega = e^{-2i\pi/N}.` },
            { p: 'Chaque niveau coûte N opérations, et il y a $\\log_2 N$ niveaux : $N \\log_2 N$ au lieu de $N^2$. Une transformée 2D se fait en transformant les lignes, puis les colonnes.' },
          ],
        },
      ],
    },
    {
      id: 'gpu', titre: 'Sur la carte graphique', blocs: [
        { p: 'L’explorateur fait tout sur la carte graphique. L’état du monde vit dans une texture de nombres à virgule de 32 bits ; chaque transformée de Fourier y est découpée en $2\\log_2 N$ passages, un par niveau, d’abord le long des lignes puis le long des colonnes. À chaque passage, un petit programme, un *shader*, calcule chaque case à partir de deux valeurs du passage précédent. Une texture RGBA porte deux nombres complexes : on traite deux canaux, ou deux noyaux, à la fois.' },
        { p: 'Un pas de Lenia classique sur un monde de 256 × 256 demande ainsi une trentaine de passages : transformée directe, produit par le noyau, transformée inverse, croissance. L’aquarium, avec ses quinze noyaux, en demande près de deux cents, que la carte graphique enchaîne en quelques millisecondes. Les transformées des noyaux, elles, ne sont recalculées que lorsqu’on change la règle.' },
        { p: 'Il faut de vrais nombres de 32 bits : en 16 bits, les erreurs d’arrondi des transformées brouillent les créatures en quelques pas. C’est pourquoi l’explorateur refuse de démarrer sur les rares cartes graphiques qui ne savent pas les écrire.' },
        {
          expert: 'la FFT sans permutation', blocs: [
            { p: 'La version classique de l’algorithme commence par permuter les données en ordre de bits inversés. Sur une carte graphique, on préfère la variante de Stockham, où chaque passage relit les données dans un ordre qui rend la permutation inutile. Au passage s, avec $L = 2^{s+1}$, la case k lit deux valeurs :' },
            { tex: tex`e = \Big\lfloor \frac{k}{L} \Big\rfloor \frac{L}{2} + \Big(k \bmod \frac{L}{2}\Big), \quad x'_k = x_e + e^{-2i\pi (k \bmod L)/L}\; x_{e + N/2}.` },
            { p: 'L’explorateur a vérifié cette indexation contre une transformée calculée directement, avant de l’écrire en GLSL.' },
          ],
        },
      ],
    },
    {
      id: 'flow', titre: 'Conserver la masse', blocs: [
        { p: 'Pour Flow Lenia, chaque pas ajoute deux passages. Le premier calcule le flux en chaque case, avec un filtre de Sobel, qui estime une pente à partir des huit voisines. Le second redistribue la matière : chaque case cherche, dans un carré de 7 × 7 autour d’elle, toutes celles dont la matière arrive chez elle, et additionne leurs parts. Comme les parts d’une case source se partagent exactement, la masse totale ne change qu’à cause des arrondis des nombres à virgule.' },
        { p: 'Avec plusieurs espèces, trois passages de plus transportent les poids des noyaux. Pour que les trois choisissent la même source, ils partagent le même tirage au sort, fixé par la position de la case et le numéro du pas.' },
      ],
    },
    {
      id: 'bestiaire', titre: 'D’où viennent les créatures', blocs: [
        { p: 'Les créatures de Lenia et de Lenia étendu viennent du catalogue que Bert Chan a publié avec ses programmes, sous licence libre. Elles sont codées dans un format compact, chaque valeur de 1 à 255 étant écrite par une ou deux lettres. Avant de les intégrer, chacune a été simulée en Python, avec les mêmes noyaux et les mêmes croissances, pour vérifier qu’elle garde sa masse et sa forme. Les règles de Flow Lenia ont été trouvées par une recherche au hasard : une soixantaine de règles tirées dans les intervalles de l’article original, simulées, et quatre retenues pour leurs comportements.' },
        { p: 'Les mutants, eux, sont tirés en direct : chaque paramètre de la règle est multiplié par un facteur aléatoire proche de 1. Les quatre mondes de 128 × 128 tournent en même temps. Toutes les 0,4 seconde, l’explorateur mesure leur masse : moins de 15 % de la masse de départ, le mutant est éteint ; plus de quatre fois, il déborde.' },
      ],
    },
  ],

  histoire: [
    {
      id: 'frise', titre: 'Une courte histoire', blocs: [
        {
          frise: [
            ['1805', 'Carl Friedrich Gauss', 'utilise une transformée de Fourier rapide pour calculer des orbites ; ses notes ne sont publiées qu’après sa mort.'],
            ['1834', 'John Scott Russell', 'observe une vague solitaire dans un canal près d’Édimbourg.'],
            ['Années 1940', 'John von Neumann et Stanisław Ulam', 'inventent les automates cellulaires pour étudier l’autoreproduction.'],
            ['1952', 'Alan Turing', 'publie *The Chemical Basis of Morphogenesis*.'],
            ['1965', 'James Cooley et John Tukey', 'publient l’algorithme de transformée de Fourier rapide.'],
            ['1970', 'John Conway', 'invente le jeu de la vie, présenté en octobre par Martin Gardner dans Scientific American.'],
            ['1987', 'Christopher Langton', 'organise à Los Alamos le premier colloque de vie artificielle.'],
            ['1995', 'Shigeru Kondo et Rihito Asai', 'montrent que les rayures du poisson-ange suivent un modèle de Turing.'],
            ['1996', 'Paul Umbanhowar, Francisco Melo et Harry Swinney', 'observent des oscillons dans du sable vibré.'],
            ['Vers 2005', 'Bert Chan', 'écrit Primordia, un programme précurseur de Lenia.'],
            ['2011', 'Stephan Rafler', 'publie SmoothLife.'],
            ['2018', 'Bert Chan', 'met Lenia en ligne, puis publie *Lenia : Biology of Artificial Life* (Complex Systems, 2019).'],
            ['2020', 'Bert Chan', 'présente Lenia étendu à la conférence ALIFE : plusieurs canaux, plusieurs noyaux.'],
            ['2020', 'Chris Reinke, Mayalen Etcheverry et Pierre-Yves Oudeyer', 'explorent Lenia avec un algorithme guidé par la curiosité.'],
            ['2020', 'Alexander Mordvintsev et ses collègues', 'publient les automates cellulaires neuronaux qui poussent et se réparent.'],
            ['2022', 'Alexander Mordvintsev, Eyvind Niklasson et Ettore Randazzo', 'proposent Particle Lenia.'],
            ['2023', 'Erwan Plantec, Bert Chan et leurs collègues', 'présentent Flow Lenia, où la matière se conserve.'],
            ['2024', 'Akarsh Kumar et ses collègues', 'cherchent la vie artificielle avec des modèles qui relient images et textes.'],
          ],
        },
      ],
    },
    {
      id: 'refs', titre: 'Références', blocs: [
        {
          refs: [
            ['A. M. Turing, « The chemical basis of morphogenesis », Philosophical Transactions of the Royal Society B 237, 1952.'],
            ['J. W. Cooley et J. W. Tukey, « An algorithm for the machine calculation of complex Fourier series », Mathematics of Computation 19, 1965.'],
            ['J. von Neumann, *Theory of Self-Reproducing Automata*, édité par A. W. Burks, University of Illinois Press, 1966.'],
            ['M. Gardner, « Mathematical Games: The fantastic combinations of John Conway’s new solitaire game “life” », Scientific American 223, octobre 1970.'],
            ['M. T. Heideman, D. H. Johnson et C. S. Burrus, « Gauss and the history of the fast Fourier transform », IEEE ASSP Magazine 1, 1984.'],
            ['C. G. Langton (dir.), *Artificial Life*, Addison-Wesley, 1989.'],
            ['J. E. Pearson, « Complex patterns in a simple system », Science 261, 1993.'],
            ['S. Kondo et R. Asai, « A reaction–diffusion wave on the skin of the marine angelfish Pomacanthus », Nature 376, 1995.'],
            ['P. B. Umbanhowar, F. Melo et H. L. Swinney, « Localized excitations in a vertically vibrated granular layer », Nature 382, 1996.'],
            ['S. Rafler, « Generalization of Conway’s “Game of Life” to a continuous domain – SmoothLife », arXiv:1111.1567, 2011.', 'https://arxiv.org/abs/1111.1567'],
            ['B. W.-C. Chan, « Lenia: Biology of Artificial Life », Complex Systems 28, 2019.', 'https://arxiv.org/abs/1812.05433'],
            ['B. W.-C. Chan, « Lenia and Expanded Universe », ALIFE 2020.', 'https://arxiv.org/abs/2005.03742'],
            ['C. Reinke, M. Etcheverry et P.-Y. Oudeyer, « Intrinsically Motivated Discovery of Diverse Patterns in Self-Organizing Systems », ICLR 2020.', 'https://arxiv.org/abs/1908.06663'],
            ['A. Mordvintsev, E. Randazzo, E. Niklasson et M. Levin, « Growing Neural Cellular Automata », Distill, 2020.', 'https://distill.pub/2020/growing-ca/'],
            ['M. Moroz, « Reintegration tracking », 2020.', 'https://michaelmoroz.github.io/Reintegration-Tracking/'],
            ['A. Mordvintsev, E. Niklasson et E. Randazzo, « Particle Lenia and the energy-based formulation », 2022.', 'https://google-research.github.io/self-organising-systems/particle-lenia/'],
            ['E. Plantec, G. Hamon, M. Etcheverry, P.-Y. Oudeyer, C. Moulin-Frier et B. W.-C. Chan, « Flow-Lenia: Towards open-ended evolution in cellular automata through mass conservation and parameter localization », ALIFE 2023.', 'https://arxiv.org/abs/2212.07906'],
            ['A. Kumar et al., « Automating the Search for Artificial Life with Foundation Models », 2024.', 'https://arxiv.org/abs/2412.17799'],
            ['B. Chan, dépôt Lenia (programmes et catalogue des créatures, licence MIT).', 'https://github.com/Chakazul/Lenia'],
            ['E. Plantec, dépôt FlowLenia.', 'https://github.com/erwanplantec/FlowLenia'],
          ],
        },
      ],
    },
  ],

  figures: {
    mecanisme: {
      titres: ['L’état A', 'Le potentiel U = K * A', 'La croissance G(U)'],
      pause: 'Pause',
      reprendre: 'Reprendre',
      recommencer: 'Recommencer',
      temps: (t) => `t = ${t}`,
      legende: 'Un Orbium dans un monde de 64 × 64, calculé dans votre navigateur. Au milieu, le potentiel est étiré pour être visible. À droite, en vert, les cases qui gagnent de la matière ; en magenta, celles qui en perdent.',
    },
    voisinages: {
      choix: 'Voisinage',
      noms: { vie: 'Jeu de la vie', un: 'Un anneau', deux: 'Deux anneaux', trois: 'Trois anneaux' },
      descriptions: {
        vie: 'Les huit voisines de Conway, toutes de même poids.',
        un: 'Le noyau de l’Orbium : un anneau lisse de rayon 13.',
        deux: 'Deux anneaux, le second trois fois plus faible : la famille des Kronium.',
        trois: 'Trois anneaux de hauteurs 1/2, 1 et 2/3 : l’Hydrogeminium.',
      },
      legende: 'Plus la case est claire, plus la voisine compte dans la moyenne. Le centre ne compte pas : une case ne se voit pas elle-même.',
    },
    regle: {
      legende: 'À gauche, le noyau de l’Orbium ; à droite, sa croissance. Le centre μ dit où se trouve la densité idéale, la largeur σ combien on tolère d’écart.',
    },
    robustesse: {
      label: 'Un Orbium qu’on peut bousculer ou couper',
      bousculer: 'Bousculer',
      couper: 'Couper un morceau',
      recommencer: 'Recommencer',
      masse: (m) => `masse ${m}`,
      legende: 'Bousculer ajoute du bruit autour de la créature ; couper efface sa moitié avant. Tant que le dégât n’est pas trop grand, l’Orbium retrouve sa forme et sa masse, autour de 70.',
    },
    galerie: {
      ouvrir: 'Ouvrir dans l’explorateur',
      cartes: {
        orbium: 'Le planeur le plus célèbre.',
        scutium: 'Un bouclier rapide.',
        gyrorbium: 'Tourne en rond.',
        hydrogeminium: 'Trois anneaux, une nage lente.',
        hexadentium: 'Une roue à six dents.',
        asterium: 'Une étoile qui avance.',
        limus: 'Trois canaux, quinze noyaux.',
        gyrans: 'L’aquarium, en couleur.',
        planeur: 'Conway, rejoué par Lenia.',
      },
    },
    banc: {
      bouton: 'Mesurer',
      encore: 'Mesurer à nouveau',
      enCours: 'Mesure en cours…',
      attente: 'Une convolution par le noyau de l’Orbium (R = 13), calculée directement puis par la transformée de Fourier, pour trois tailles de monde.',
      monde: 'Monde',
      directe: 'Directe',
      fourier: 'Fourier',
      rapport: 'Gain',
      ms: (n) => `${n} ms`,
      legende: 'En JavaScript, sur le processeur. Le coût direct croît avec le nombre de cases du noyau ; celui de Fourier non. L’écart grandit encore pour les grands noyaux de Lenia étendu.',
    },
  },
}
