// ============================================================
//  ARTICLES EN FRANÇAIS : Comprendre, Théorie, Applications, Calcul,
//  Histoire et références, plus les textes des figures et des fiches.
//  Blocs : { p }, { liste }, { tex, etroit? }, { figure }, { expert },
//  { preuve }, { frise }, { refs }, { fiche }.
//  Dans le texte : *italique* et $formule$ (LaTeX).
// ============================================================

const tex = String.raw

export const LECTURE_FR = {
  comprendre: [
    {
      id: 'idee', titre: 'Dessiner avec des cercles', blocs: [
        { p: 'Prenez un cercle qui tourne à vitesse constante, et posez au bout de son rayon un deuxième cercle, qui tourne plus vite. Puis un troisième au bout du deuxième, et ainsi de suite. La pointe du dernier rayon dessine une courbe. Avec deux cercles, on obtient une ellipse ou une rosace ; avec une centaine, presque n’importe quelle forme : un cœur, un avion, votre signature.' },
        { p: 'Les astronomes grecs utilisaient déjà ce montage, les *épicycles*, pour décrire le mouvement des planètes vues de la Terre. En 1807, Joseph Fourier affirme quelque chose de plus fort : toute fonction périodique est une somme d’ondes. Pour une courbe fermée du plan, cela veut dire : toute courbe fermée est tracée par une chaîne de cercles qui tournent.' },
        { p: 'Ce projet montre comment trouver ces cercles, combien il en faut, et pourquoi certaines formes en demandent beaucoup plus que d’autres. Le calcul repose sur la *transformée de Fourier rapide*, l’un des algorithmes les plus utilisés au monde.' },
      ],
    },
    {
      id: 'regle', titre: 'Les règles du jeu', blocs: [
        { p: 'La forme est parcourue une fois, à vitesse régulière, pendant un « tour ». On en relève 2 048 points. La transformée de Fourier les change en 2 048 coefficients : un centre et 2 047 cercles :' },
        {
          liste: [
            'chaque cercle a une *fréquence* entière $k$ : il fait $k$ tours pendant que la pointe fait le tour de la forme. Positif, il tourne dans un sens ; négatif, dans l’autre ;',
            'chaque cercle a un rayon et un angle de départ, donnés par un nombre complexe, son *coefficient* $c_k$ ;',
            'le coefficient $c_0$ ne tourne pas : c’est le centre de la forme, d’où part la chaîne ;',
            'on garde un certain nombre de cercles, soit des plus lents aux plus rapides (*par fréquence*), soit des plus grands aux plus petits (*par taille*) ;',
            'avec tous les cercles, la pointe repasse exactement par les 2 048 points relevés.',
          ],
        },
        { p: 'Le reste n’est que de l’addition : à chaque instant, on met les rayons bout à bout, et la pointe se trouve au bout de la chaîne.' },
      ],
    },
    {
      id: 'lire', titre: 'Lire l’explorateur', blocs: [
        { p: 'La forme d’origine est en blanc pâle. Les cercles sont bleus, leurs rayons blancs ; la pointe trace en orange la courbe obtenue avec les cercles gardés. La courbe complète, en orange pâle, montre ce que les cercles dessineront sur un tour entier.' },
        { p: 'L’outil *Dessiner* permet de tracer sa propre forme, d’un seul trait. Le curseur *Nombre de cercles* va de 1 à 2 047. *Par fréquence* ajoute les cercles des plus lents aux plus rapides ; *par taille*, des plus grands aux plus petits. Le *lissage* atténue les cercles rapides, et le *paramétrage* change la vitesse à laquelle la forme est parcourue.' },
        { p: 'Sous l’animation, le *spectre* montre la taille de chaque cercle selon sa fréquence, en échelle logarithmique : chaque graduation est dix fois plus petite que la précédente. À côté, la courbe d’*erreur* dit de combien la forme dessinée s’écarte de l’originale selon le nombre de cercles, dans les deux ordres. En *3D*, le temps devient la profondeur : la pointe laisse derrière elle un ressort.' },
        { p: 'Voici les formes, une par une : la question posée, les règles, ce qu’il faut regarder, et ce qui se passe. Les images sont calculées dans la page.' },
      ],
    },
    { id: 'sc-dessin', titre: '1. Votre dessin', blocs: [{ fiche: 'dessin' }] },
    { id: 'sc-ellipse', titre: '2. Un, puis deux cercles', blocs: [{ fiche: 'ellipse' }] },
    { id: 'sc-mars', titre: '3. Mars vue de la Terre', blocs: [{ fiche: 'mars' }] },
    { id: 'sc-coeur', titre: '4. Le cœur', blocs: [{ fiche: 'coeur' }] },
    { id: 'sc-infini', titre: '5. Une courbe lisse', blocs: [{ fiche: 'infini' }] },
    { id: 'sc-carre', titre: '6. Le carré', blocs: [{ fiche: 'carre' }] },
    { id: 'sc-etoile', titre: '7. L’étoile', blocs: [{ fiche: 'etoile' }] },
    { id: 'sc-avion', titre: '8. L’avion', blocs: [{ fiche: 'avion' }] },
    { id: 'sc-koch', titre: '9. Le flocon de Koch', blocs: [{ fiche: 'koch' }] },
    { id: 'sc-spirale', titre: '10. La spirale ouverte', blocs: [{ fiche: 'spirale' }] },
    {
      id: 'retenir', titre: 'Ce qu’il faut retenir', blocs: [
        { p: 'Toute courbe fermée est une somme de cercles qui tournent à des vitesses entières. Les grands cercles lents donnent l’allure générale ; les petits cercles rapides, les détails.' },
        { p: 'Le nombre de cercles nécessaires dépend de la régularité de la forme : une courbe lisse en demande peu, un coin beaucoup plus, un saut énormément, et un saut laisse toujours une oscillation de 9 % (le phénomène de Gibbs). La façon de parcourir la forme compte autant que la forme elle-même. L’onglet *Théorie* explique tout cela.' },
      ],
    },
  ],

  theorie: [
    {
      id: 'serie', titre: 'Une courbe est une somme de cercles', blocs: [
        { p: 'Un point du plan $(x, y)$ est un nombre complexe $z = x + iy$. Une courbe fermée parcourue en un tour, pendant le temps $t \\in [0, 1[$, est une fonction $z(t)$ périodique de période 1. Le vecteur qui tourne le plus simplement est $e^{2i\\pi t} = \\cos 2\\pi t + i \\sin 2\\pi t$ : il fait un tour, de rayon 1. Avec un coefficient complexe $c$, $c\\,e^{2i\\pi k t}$ est un vecteur de longueur $|c|$, d’angle de départ $\\arg c$, qui fait $k$ tours. La *série de Fourier* de la courbe est la somme de ces vecteurs :' },
        { tex: tex`z(t) = \sum_{k=-\infty}^{+\infty} c_k\, e^{2i\pi k t}, \qquad c_k = \int_0^1 z(t)\, e^{-2i\pi k t}\, dt` },
        { p: 'Pourquoi cette formule pour $c_k$ ? Parce que les vecteurs tournants sont *orthogonaux* : sur un tour, la moyenne de $e^{2i\\pi k t}\\,\\overline{e^{2i\\pi m t}} = e^{2i\\pi (k - m) t}$ est nulle dès que $k \\ne m$ (un vecteur qui fait un nombre entier non nul de tours a une moyenne nulle).' },
        { tex: tex`\int_0^1 e^{2i\pi k t}\, e^{-2i\pi m t}\, dt = \begin{cases} 1 & \text{si } k = m \\ 0 & \text{sinon} \end{cases}` },
        { p: 'Multiplier $z(t)$ par $e^{-2i\\pi k t}$, c’est faire tourner tout le dessin à la vitesse $-k$ : le cercle de fréquence $k$ s’arrête, tous les autres continuent de tourner. En faisant la moyenne sur un tour, ceux qui tournent disparaissent ; il ne reste que $c_k$.' },
        { figure: 'deuxcercles' },
        { p: 'Deux cercles suffisent déjà à beaucoup de formes. Avec $k = 1$ et $k = -1$, on obtient une ellipse de demi-axes $|c_1| + |c_{-1}|$ et $\\big||c_1| - |c_{-1}|\\big|$. Avec $k = 3$ et $k = -1$ de même rayon, un trèfle à quatre feuilles. Un spirographe, c’est deux cercles ; et Mars vue de la Terre aussi (voir *Histoire*).' },
      ],
    },
    {
      id: 'hilbert', titre: 'Une géométrie des fonctions', blocs: [
        { p: 'Les courbes se comportent comme des vecteurs d’un espace de dimension infinie. On peut les additionner, les multiplier par un nombre, et mesurer l’angle entre deux d’entre elles grâce au *produit scalaire* :' },
        { tex: tex`\langle f, g\rangle = \int_0^1 f(t)\,\overline{g(t)}\, dt, \qquad \|f\|^2 = \int_0^1 |f(t)|^2\, dt` },
        { p: 'Les courbes de « longueur » $\\|f\\|$ finie forment l’espace $L^2$. Les fonctions $e_k(t) = e^{2i\\pi k t}$ y jouent le rôle des axes d’un repère : elles sont de longueur 1 et deux à deux orthogonales, et $c_k = \\langle z, e_k\\rangle$ est la coordonnée de $z$ sur l’axe $k$. La somme partielle $S_K = \\sum_{|k| \\le K} c_k e_k$ est alors la *projection orthogonale* de la courbe sur le sous-espace engendré par les fréquences $-K \\dots K$.' },
        {
          preuve: 'La somme partielle est la meilleure approximation', source: 'théorème de Pythagore',
          paragraphes: [
            'Soit $P(t) = \\sum_{|k| \\le K} a_k e^{2i\\pi k t}$ n’importe quelle somme de cercles de fréquences au plus $K$. La différence $z - S_K$ est orthogonale à chaque $e_k$ avec $|k| \\le K$ (ses coordonnées sur ces axes sont $c_k - c_k = 0$), donc orthogonale à $S_K - P$.',
            'Par le théorème de Pythagore, $\\|z - P\\|^2 = \\|z - S_K\\|^2 + \\|S_K - P\\|^2 \\ge \\|z - S_K\\|^2$, avec égalité seulement si $P = S_K$. Parmi toutes les sommes de cercles de fréquence au plus $K$, la somme partielle de Fourier est la plus proche de la courbe, en moyenne quadratique.',
            'Le même argument montre que, si l’on a droit à $M$ cercles de fréquences quelconques, le meilleur choix est de garder les $M$ plus grands $|c_k|$ : l’erreur est la somme des $|c_k|^2$ oubliés, et elle est la plus petite quand on oublie les plus petits. C’est l’ordre *par taille* de l’explorateur.',
          ],
        },
        { p: 'Le théorème de Pythagore, étendu à une infinité d’axes, donne l’*égalité de Parseval* : l’énergie de la courbe est la somme des énergies de ses cercles.' },
        { tex: tex`\int_0^1 |z(t)|^2\, dt = \sum_{k=-\infty}^{+\infty} |c_k|^2, \qquad \|z - S_K\|^2 = \sum_{|k| > K} |c_k|^2` },
        { p: 'C’est ce que mesure l’explorateur : l’*énergie gardée* est la part de $\\sum |c_k|^2$ (hors $c_0$) portée par les cercles gardés, et l’*erreur* est la racine de la part oubliée. Pas besoin de comparer les courbes point par point : les rayons suffisent.' },
        {
          expert: 'complétude et théorème de Riesz-Fischer', blocs: [
            { p: 'Parseval suppose que les $e_k$ forment une base *complète* : aucune courbe non nulle n’est orthogonale à toutes. C’est un théorème, pas une évidence. Une preuve passe par Fejér (plus bas) : les moyennes de Fejér d’une fonction continue convergent uniformément vers elle, donc les polynômes trigonométriques sont denses dans les fonctions continues, elles-mêmes denses dans $L^2$.' },
            { p: 'Réciproquement, le théorème de Riesz-Fischer (1907) dit que toute suite $(c_k)$ telle que $\\sum |c_k|^2 < \\infty$ est la suite des coefficients d’une fonction de $L^2$. L’application $z \\mapsto (c_k)$ est donc une isométrie bijective entre $L^2$ et l’espace $\\ell^2$ des suites de carré sommable : une courbe et son spectre, c’est la même information, écrite dans deux repères.' },
          ],
        },
      ],
    },
    {
      id: 'convergence', titre: 'La série converge-t-elle ?', blocs: [
        { p: 'Parseval dit que $S_K$ s’approche de $z$ *en moyenne*. Mais en chaque point ? La question a occupé les mathématiciens pendant un siècle et demi. Pour y répondre, on écrit la somme partielle comme une moyenne pondérée de la courbe autour du point, avec le *noyau de Dirichlet* :' },
        { tex: tex`S_K z(t) = \int_0^1 z(t - s)\, D_K(s)\, ds, \qquad D_K(s) = \sum_{|k| \le K} e^{2i\pi k s} = \frac{\sin\big((2K + 1)\pi s\big)}{\sin(\pi s)}`, etroit: tex`\begin{aligned}S_K z(t) &= \int_0^1 z(t - s)\, D_K(s)\, ds\\ D_K(s) &= \frac{\sin((2K + 1)\pi s)}{\sin(\pi s)}\end{aligned}` },
        { p: 'Le noyau de Dirichlet a un pic de hauteur $2K + 1$ en 0, mais il oscille et prend des valeurs négatives. Sa valeur absolue moyenne, la *constante de Lebesgue*, grandit sans limite, comme $\\frac{4}{\\pi^2}\\ln K$. C’est la source de tous les ennuis.' },
        { figure: 'noyaux' },
        { p: '*Dirichlet (1829).* Si la courbe est formée d’un nombre fini de morceaux dérivables, la série converge en chaque point, vers la valeur de la courbe là où elle est continue, et vers le milieu du saut là où elle saute. C’est le premier théorème rigoureux de la théorie, vingt ans après l’affirmation de Fourier.' },
        { p: '*Du Bois-Reymond (1873).* Il existe une fonction *continue* dont la série de Fourier diverge en un point. La continuité ne suffit donc pas. *Kolmogorov* fait pire : une fonction intégrable dont la série diverge presque partout (1923), puis partout (1926).' },
        { p: '*Carleson (1966).* Pour toute fonction de $L^2$, et donc toute courbe continue, la série converge *presque partout* : les points où elle diverge, s’il y en a, forment un ensemble de longueur nulle. Ce théorème, conjecturé par Lusin en 1915, est l’un des plus difficiles de l’analyse ; Hunt l’a étendu en 1968 aux espaces $L^p$, $p > 1$.' },
        { p: '*Fejér (1900).* Il suffit de changer la façon de sommer. Au lieu de $S_K$, on prend la moyenne des sommes partielles, $\\sigma_K = (S_0 + S_1 + \\dots + S_K)/(K + 1)$. Cela revient à pondérer le coefficient de fréquence $k$ par $1 - |k|/(K + 1)$, et le noyau devient le *noyau de Fejér* :' },
        { tex: tex`F_K(s) = \frac{1}{K + 1}\left(\frac{\sin\big((K + 1)\pi s\big)}{\sin(\pi s)}\right)^2 \ \ge\ 0`, etroit: tex`F_K(s) = \frac{1}{K + 1}\left(\frac{\sin((K + 1)\pi s)}{\sin(\pi s)}\right)^2` },
        { p: 'Il est positif, d’intégrale 1, et se concentre en 0 : c’est une vraie moyenne locale. Fejér en déduit, à 20 ans, que pour toute courbe continue, $\\sigma_K$ converge *uniformément*. C’est le *lissage Fejér* de l’explorateur.' },
        {
          expert: 'pourquoi la continuité ne suffit pas', blocs: [
            { p: 'L’argument moderne passe par le *principe de la borne uniforme* (Banach-Steinhaus). L’application qui envoie une fonction continue $f$ sur $S_K f(0)$ est linéaire, et sa norme est exactement la constante de Lebesgue $L_K = \\int_0^1 |D_K|$, qui tend vers l’infini. Si $S_K f(0)$ restait borné pour toute $f$ continue, le principe forcerait les normes $L_K$ à rester bornées. Contradiction : il existe une $f$ continue telle que $\\sup_K |S_K f(0)| = +\\infty$.' },
            { tex: tex`L_K = \int_0^1 \big|D_K(s)\big|\, ds = \frac{4}{\pi^2}\ln K + O(1)` },
            { p: 'La preuve ne construit pas la fonction : elle montre qu’elle existe, et même que les fonctions continues dont la série diverge en 0 sont « génériques » (au sens de Baire). Du Bois-Reymond, lui, l’avait construite à la main.' },
          ],
        },
      ],
    },
    {
      id: 'gibbs', titre: 'Le phénomène de Gibbs', blocs: [
        { p: 'Quand la courbe saute, la série converge vers le milieu du saut, mais pas uniformément. De part et d’autre, la somme partielle dépasse, puis oscille. Le pic se rapproche du saut quand $K$ grandit, mais sa hauteur ne diminue pas : elle tend vers environ 9 % de la taille du saut.' },
        { p: 'Prenons le *créneau*, qui vaut $-1$ puis $+1$ : $f(x) = \\frac{4}{\\pi}\\sum_{k \\text{ impair}} \\frac{\\sin kx}{k}$. Près du saut, la somme partielle s’écrit, quand $K$ est grand,' },
        { tex: tex`S_K(x) \approx \frac{2}{\pi}\, \mathrm{Si}\big((K + 1)\, x\big), \qquad \mathrm{Si}(u) = \int_0^u \frac{\sin s}{s}\, ds`, etroit: tex`S_K(x) \approx \tfrac{2}{\pi}\, \mathrm{Si}\big((K + 1)\, x\big)` },
        { p: 'La fonction sinus intégral $\\mathrm{Si}$ atteint son maximum en $u = \\pi$, où elle vaut $1{,}851\\,937\\dots$ La somme culmine donc à $\\frac{2}{\\pi}\\mathrm{Si}(\\pi) \\approx 1{,}178\\,98$ au lieu de 1 : un dépassement de $0{,}179$ pour un saut de 2, soit $8{,}949\\ \\%$ du saut, quel que soit $K$.' },
        { figure: 'creneau' },
        { p: 'Dans le plan, une courbe saute quand elle n’est pas fermée : la fin ne rejoint pas le début, et la série doit franchir l’écart. Sur la *spirale ouverte* de l’explorateur, nous mesurons un dépassement de 8,8 à 9,5 % de l’écart, de 30 à 400 cercles (la spirale n’est pas droite près du saut, d’où ces petites variations). Avec le lissage de Fejér, il disparaît : le noyau est positif, la somme devient une moyenne de points de la courbe, et une moyenne ne dépasse pas. Avec les facteurs $\\sigma$ de Lanczos, $\\mathrm{sinc}\\big(k/(K + 1)\\big)$, il tombe vers 1 % dès une soixantaine de cercles, en gardant une forme plus nette.' },
        { p: 'Un coin, lui, ne produit pas de phénomène de Gibbs : la courbe est continue, seule sa direction saute. La série converge uniformément ; le coin est seulement arrondi.' },
      ],
    },
    {
      id: 'regularite', titre: 'Régularité et décroissance', blocs: [
        { p: 'Combien de cercles faut-il ? Cela dépend de la vitesse à laquelle les $|c_k|$ décroissent, et cette vitesse est dictée par la *régularité* de la courbe. Tout repose sur une intégration par parties :' },
        { tex: tex`c_k(z') = 2i\pi k\; c_k(z) \qquad\Longrightarrow\qquad |c_k(z)| = \frac{|c_k(z')|}{2\pi |k|}`, etroit: tex`c_k(z') = 2i\pi k\, c_k(z)` },
        { p: 'Dériver multiplie le $k$-ième coefficient par $2i\\pi k$. Si la courbe est $p$ fois dérivable avec une dérivée $p$-ième intégrable, ses coefficients sont donc divisés par $|k|^p$ :' },
        {
          liste: [
            '*un saut* (courbe ouverte) : $|c_k| \\sim C/|k|$. La spirale ouverte : pente mesurée $-1{,}1$ ;',
            '*un coin* (la direction saute) : $|c_k| \\sim C/k^2$. Le carré : $-1{,}9$ ; l’étoile et l’avion : $-2{,}0$ ; le cœur parcouru à vitesse constante : $-2{,}1$ ;',
            '*des angles à toutes les échelles* : le flocon de Koch, continu mais dérivable nulle part. Sa régularité de Hölder d’exposant $\\alpha = \\ln 3/\\ln 4 \\approx 0{,}79$ garantit au moins $|c_k| = O(|k|^{-0{,}79})$ ; nous mesurons une pente moyenne de $-1{,}3$, et le long des fréquences $-1, -4, -16, -64$, le rayon est divisé à peu près par 4 à chaque étape (par 3,99, puis 3,96, puis 3,83) ;',
            '*une courbe analytique* (sans coin, développable en série entière, comme la lemniscate) : $|c_k| \\le C e^{-a|k|}$, une décroissance plus rapide que toute puissance.',
          ],
        },
        { figure: 'decroissance' },
        {
          preuve: 'Pourquoi un coin donne 1/k²', source: 'intégration par parties',
          paragraphes: [
            'Parcourue à vitesse constante, une ligne brisée a une vitesse $z\'(t)$ constante sur chaque côté, qui saute à chaque coin : $z\'$ est une fonction en escalier.',
            'Un saut de hauteur $h$ au temps $t_0$ contribue au coefficient de $z\'$ un terme de taille $|h|/(2\\pi |k|)$ (comme le créneau). Donc $|c_k(z\')| \\le C/|k|$, et par la formule de dérivation $|c_k(z)| = |c_k(z\')|/(2\\pi|k|) \\le C\'/k^2$.',
            'Réciproquement, un coin suffit à empêcher mieux : si $|c_k(z)|$ décroissait plus vite que $1/k^2$ en moyenne quadratique, $z\'$ serait dans un espace où les fonctions en escalier ne sont pas. On mesure bien une pente proche de $-2$ sur le carré, l’étoile et l’avion.',
          ],
        },
        { p: 'Mais la régularité dont il s’agit est celle de la *fonction* $z(t)$, pas de la forme dessinée. Le cœur en est l’exemple frappant. Sa formule, $x = 16\\sin^3 t$, $y = 13\\cos t - 5\\cos 2t - 2\\cos 3t - \\cos 4t$, est un polynôme trigonométrique : en suivant sa formule, exactement 8 cercles le dessinent, sans aucune erreur. Pourtant, le cœur a une pointe en haut. La formule y passe en ralentissant jusqu’à s’arrêter : sa vitesse s’annule, et la fonction reste lisse. Parcouru à vitesse constante, il faut au contraire tourner d’un coup au passage de la pointe, et les coefficients décroissent en $1/k^2$.' },
        { figure: 'parametrage' },
      ],
    },
    {
      id: 'symetries', titre: 'Symétries et invariances', blocs: [
        { p: 'Ce qu’on fait subir à la forme se lit directement sur ses coefficients :' },
        {
          liste: [
            '*la déplacer* change seulement $c_0$, le centre ;',
            '*l’agrandir* d’un facteur $\\lambda$ multiplie tous les $c_k$ par $\\lambda$ ;',
            '*la tourner* d’un angle $\\varphi$ les multiplie tous par $e^{i\\varphi}$ : les rayons ne changent pas ;',
            '*changer le point de départ* (commencer le tour au temps $\\tau$) multiplie $c_k$ par $e^{2i\\pi k\\tau}$ : les rayons ne changent pas non plus ;',
            '*la parcourir dans l’autre sens* échange $c_k$ et $c_{-k}$.',
          ],
        },
        { p: 'Une symétrie de rotation impose davantage. Si la forme revient sur elle-même quand on la tourne d’un $m$-ième de tour, et qu’un $m$-ième du temps suffit pour cela, alors $z(t + 1/m) = e^{2i\\pi/m}\\, z(t)$. En prenant les coefficients des deux côtés :' },
        { tex: tex`e^{2i\pi k/m}\, c_k = e^{2i\pi/m}\, c_k \qquad\Longrightarrow\qquad c_k = 0 \ \text{ sauf si } \ k \equiv 1 \pmod m`, etroit: tex`c_k = 0 \ \text{ sauf si } \ k \equiv 1 \pmod m` },
        { p: 'Une étoile à cinq branches n’utilise que les fréquences $1, -4, 6, -9, 11, \\dots$ ; un carré, $1, -3, 5, -7, \\dots$ ; un triangle, $1, -2, 4, -5, \\dots$ Les quatre cinquièmes des cercles de l’étoile sont nuls, ce qui explique pourquoi l’ordre *par fréquence* gaspille tant de cercles sur ces formes. Le flocon de Koch, parcouru dans l’autre sens, n’utilise que les fréquences $k \\equiv -1 \\pmod 3$ : $-1, 2, -4, 5, \\dots$' },
        { figure: 'symetrie' },
        { p: 'Les rayons $|c_k|$ ne dépendent donc ni de la position, ni de l’orientation, ni du point de départ ; divisés par la racine de l’énergie, ils ne dépendent plus de la taille non plus. Ils forment une signature de la forme, les *descripteurs de Fourier*, qui sert à reconnaître des formes (voir *Applications*).' },
      ],
    },
    {
      id: 'discret', titre: 'De l’intégrale à la somme : échantillonner', blocs: [
        { p: 'Un ordinateur ne connaît pas $z(t)$ pour tout $t$ : il en connaît $N$ valeurs, $z_n = z(n/N)$. Il remplace l’intégrale par une moyenne, la *transformée de Fourier discrète* :' },
        { tex: tex`\hat c_k = \frac{1}{N}\sum_{n=0}^{N-1} z_n\, e^{-2i\pi k n / N}, \qquad z_n = \sum_{k} \hat c_k\, e^{2i\pi k n / N}`, etroit: tex`\begin{aligned}\hat c_k &= \tfrac{1}{N}\textstyle\sum_{n} z_n\, e^{-2i\pi k n / N}\\ z_n &= \textstyle\sum_{k} \hat c_k\, e^{2i\pi k n / N}\end{aligned}` },
        { p: 'Les deux formules sont exactes : $N$ points, $N$ coefficients, et l’on passe de l’un à l’autre sans perte. Mais $\\hat c_k$ n’est pas tout à fait $c_k$. Aux instants $n/N$, les fréquences $k$ et $k + N$ sont indiscernables, puisque $e^{2i\\pi (k + N) n/N} = e^{2i\\pi k n/N}$ : c’est le *repliement*. En remplaçant $z$ par sa série :' },
        { tex: tex`\hat c_k = \sum_{j=-\infty}^{+\infty} c_{k + jN}` },
        { p: 'Chaque coefficient discret est le vrai coefficient, plus tous ceux qui se replient sur lui. On range donc les fréquences de $-N/2$ à $N/2 - 1$, les plus lentes possible, et l’erreur de repliement est petite si les coefficients décroissent vite. Si la courbe n’a aucune fréquence au-delà de $K$, $N > 2K$ points suffisent à la retrouver exactement : c’est le *théorème d’échantillonnage* de Nyquist et Shannon.' },
        { figure: 'repliement' },
        { p: 'C’est le même effet que les roues de diligence qui semblent tourner à l’envers au cinéma : la caméra prend 24 images par seconde, et une roue qui fait presque un tour entre deux images semble reculer.' },
      ],
    },
    {
      id: 'fft', titre: 'La transformée de Fourier rapide', blocs: [
        { p: 'Calculée directement, la transformée discrète demande $N$ multiplications pour chacun des $N$ coefficients : $N^2$ en tout, plus de quatre millions pour $N = 2\\,048$. La *transformée rapide* (FFT) sépare les points d’indice pair et impair. Avec $w = e^{-2i\\pi/N}$ :' },
        { tex: tex`X_k = \underbrace{\sum_{m} z_{2m}\, w^{2mk}}_{E_k} + w^k \underbrace{\sum_{m} z_{2m+1}\, w^{2mk}}_{O_k}, \qquad X_{k + N/2} = E_k - w^k\, O_k`, etroit: tex`\begin{aligned}X_k &= E_k + w^k\, O_k\\ X_{k + N/2} &= E_k - w^k\, O_k\end{aligned}` },
        { p: '$E$ et $O$ sont deux transformées de taille $N/2$, et chaque paire $(X_k, X_{k+N/2})$ se déduit de $(E_k, O_k)$ par une seule multiplication : un *papillon*. En recommençant jusqu’à des transformées de taille 1, on fait $\\log_2 N$ étages de $N/2$ papillons. Le coût vérifie $T(N) = 2\\,T(N/2) + O(N)$, d’où $T(N) = O(N \\log N)$.' },
        { figure: 'papillon' },
        { p: 'Pour 2 048 points : 11 264 papillons au lieu de 4 194 304 multiplications, près de 400 fois moins. Pour un million de points, le facteur dépasse 100 000. Cooley et Tukey publient la méthode en 1965 ; on a découvert ensuite que Gauss l’avait trouvée vers 1805, pour calculer les orbites des astéroïdes Pallas et Juno, sans la publier.' },
      ],
    },
    {
      id: 'transformee', titre: 'De la série à la transformée', blocs: [
        { p: 'Une courbe fermée est périodique ; un signal qui ne se répète pas ne l’est pas. Quand la période tend vers l’infini, les fréquences $k$ se resserrent jusqu’à remplir toute la droite, et la série devient une intégrale, la *transformée de Fourier* :' },
        { tex: tex`\hat f(\xi) = \int_{-\infty}^{+\infty} f(x)\, e^{-2i\pi x \xi}\, dx, \qquad f(x) = \int_{-\infty}^{+\infty} \hat f(\xi)\, e^{2i\pi x \xi}\, d\xi`, etroit: tex`\hat f(\xi) = \int f(x)\, e^{-2i\pi x \xi}\, dx` },
        { p: 'Parseval devient le théorème de Plancherel ($\\|\\hat f\\| = \\|f\\|$), et la dérivation devient toujours une multiplication par $2i\\pi\\xi$. Un nouveau phénomène apparaît : une fonction et sa transformée ne peuvent pas être toutes deux très concentrées. Si l’on mesure leur étalement par leurs écarts-types, le *principe d’incertitude* impose' },
        { tex: tex`\sigma_x\, \sigma_\xi \ \ge\ \frac{1}{4\pi}` },
        { p: 'Une note très brève n’a pas de hauteur précise ; une hauteur précise demande une note longue. C’est la même inégalité qui, en mécanique quantique, lie la position et la vitesse d’une particule. Pour nos courbes, c’est la version périodique qui compte : un détail très fin (un coin, une pointe) ne peut pas être fait de quelques fréquences.' },
        {
          expert: 'la formule sommatoire de Poisson', blocs: [
            { p: 'Le lien entre la série, la transformée et l’échantillonnage tient en une formule : pour une fonction assez régulière,' },
            { tex: tex`\sum_{n=-\infty}^{+\infty} f(n) = \sum_{k=-\infty}^{+\infty} \hat f(k)` },
            { p: 'Échantillonner aux entiers d’un côté, c’est périodiser de l’autre. La formule du repliement de la section précédente en est la version discrète, et le théorème de Shannon en découle : si $\\hat f$ est nulle hors de $[-B, B]$, les copies périodisées ne se chevauchent pas tant que l’on échantillonne plus vite que $2B$, et $f$ se retrouve exactement.' },
          ],
        },
      ],
    },
  ],

  applications: [
    {
      id: 'compression', titre: 'Garder les grands cercles : la compression', blocs: [
        { p: 'Garder les plus grands cercles et oublier les autres, c’est comprimer. L’avion de l’explorateur a 2 048 coefficients ; rangés par taille, 13 cercles gardent 99 % de son énergie, 29 en gardent 99,9 %. Rangés par fréquence, il en faut 17 et 40.' },
        { figure: 'compression' },
        { p: 'Le format d’image JPEG (1992) fait exactement cela, en deux dimensions. L’image est découpée en carrés de 8 × 8 pixels ; chaque carré est transformé par une *transformée en cosinus discrète* (une cousine réelle de la transformée de Fourier, proposée par Ahmed, Natarajan et Rao en 1974) ; les coefficients sont arrondis, d’autant plus grossièrement qu’ils correspondent à des détails fins que l’œil remarque peu. La plupart deviennent nuls et ne coûtent presque rien à stocker.' },
        { p: 'Près des bords nets, une image trop comprimée montre des ondulations : c’est le phénomène de Gibbs, qui apparaît dès qu’on coupe les hautes fréquences d’un saut.' },
      ],
    },
    {
      id: 'son', titre: 'Le son', blocs: [
        { p: 'Un son est une pression qui varie dans le temps. Sa transformée de Fourier dit quelles fréquences il contient : une note de piano est une fréquence fondamentale et ses harmoniques, et leurs proportions font le timbre. Les accordeurs, les égaliseurs et les spectrogrammes calculent des FFT en continu.' },
        { p: 'Les formats MP3 et AAC découpent le son en tranches brèves, les transforment (une transformée en cosinus modifiée), et suppriment ce que l’oreille n’entend pas, par exemple un son faible masqué par un son fort de fréquence voisine. C’est le principe de la compression : garder les grands coefficients, ceux qui comptent pour nous.' },
      ],
    },
    {
      id: 'irm', titre: 'L’IRM : une image mesurée en fréquences', blocs: [
        { p: 'Un scanner IRM ne photographie pas le corps. Grâce à des gradients de champ magnétique, chaque mesure donne un coefficient de Fourier de l’image : le signal des noyaux d’hydrogène oscille à une fréquence qui dépend de leur position. L’appareil parcourt ainsi l’« espace des fréquences », puis une transformée de Fourier inverse reconstitue l’image.' },
        { p: 'Paul Lauterbur publie la première image de ce type en 1973 ; Peter Mansfield invente des façons rapides de parcourir les fréquences. Ils reçoivent ensemble le prix Nobel de physiologie ou médecine en 2003. Couper les hautes fréquences pour gagner du temps produit, là aussi, des ondulations le long des contours.' },
      ],
    },
    {
      id: 'formes', titre: 'Reconnaître des formes', blocs: [
        { p: 'Les rayons des cercles ne dépendent ni de la position, ni de l’orientation, ni du point de départ (voir *Théorie*). Divisés par la racine de l’énergie, ils ne dépendent plus de la taille. Deux formes semblables ont donc des signatures proches : ce sont les *descripteurs de Fourier*, utilisés depuis les années 1970 pour reconnaître des caractères manuscrits, des contours de pièces mécaniques ou des silhouettes (Granlund, 1972 ; Zahn et Roskies, 1972).' },
        { figure: 'descripteurs' },
        { p: 'En biologie, les *descripteurs elliptiques* de Kuhl et Giardina (1982), une variante qui décompose $x(t)$ et $y(t)$ séparément, servent à comparer des contours de feuilles, de coquillages, d’os ou de graines, et à mesurer leurs variations d’une espèce à l’autre.' },
      ],
    },
    {
      id: 'calculs', titre: 'La FFT partout', blocs: [
        { p: 'La FFT est un des algorithmes les plus exécutés au monde. Le Wi-Fi et la 4G découpent leur signal en centaines de fréquences porteuses, émises et reçues avec des FFT. Multiplier deux nombres de millions de chiffres revient à multiplier leurs transformées (Schönhage et Strassen, 1971). Les « méthodes spectrales » résolvent des équations de la physique en travaillant sur les coefficients, où dériver revient à multiplier. Et toute convolution, du flou d’une photo à la réverbération d’une salle, se calcule plus vite en passant par les fréquences.' },
      ],
    },
    {
      id: 'limites', titre: 'Ce que Fourier fait mal', blocs: [
        { p: 'Un cercle de Fourier tourne pendant tout le tour : chaque coefficient dépend de toute la courbe. Un détail très local, un petit crochet au milieu d’un trait droit, se paie donc en beaucoup de cercles, qui s’annulent presque partout ailleurs. Les *ondelettes*, développées dans les années 1980, utilisent au contraire des ondes brèves, localisées dans le temps et en fréquence. Le format JPEG 2000 les emploie à la place de la transformée en cosinus.' },
        { p: 'Et un saut laisse toujours ses 9 % d’oscillation, tant qu’on se contente de couper la série. Les lissages de Fejér et de Lanczos l’atténuent, au prix de détails émoussés : on ne gagne pas sur tous les tableaux.' },
      ],
    },
  ],

  calcul: [
    {
      id: 'echantillonnage', titre: 'Relever 2 048 points', blocs: [
        { p: 'Une forme célèbre est donnée par une formule, ou par une ligne brisée ; un dessin, par les positions successives de la souris, plus serrées là où l’on va lentement. Dans les deux cas, on relève $N = 2\\,048$ points. *Selon sa formule* : aux temps $0, 1/N, 2/N \\dots$ *À vitesse constante* : à des distances égales le long du tracé. On calcule les longueurs cumulées des segments, puis, pour chaque distance $s_n = nL/N$, on cherche le segment qui la contient et l’on interpole.' },
        { p: 'Un dessin à main levée est toujours parcouru à vitesse constante : sinon, les endroits où la main a ralenti auraient plus de poids. Si l’option *Relier la fin au début* est décochée, la courbe n’est pas refermée : les points vont du début à la fin, et la série doit sauter de la fin au début.' },
      ],
    },
    {
      id: 'fft', titre: 'La FFT, en place', blocs: [
        { p: 'La FFT de l’explorateur est itérative et travaille en place, sur deux tableaux de nombres à virgule de 64 bits (parties réelle et imaginaire). Elle commence par ranger les points dans l’ordre de l’*inversion des bits* de leur indice (le point 1 = 001 va en 4 = 100), puis enchaîne les étages de papillons de taille 2, 4, 8… jusqu’à $N$. Les rotations $w^k$ sont obtenues de proche en proche par multiplication, sans appeler sinus et cosinus à chaque papillon.' },
        { p: 'Comparée à la transformée directe, calculée en $N^2$ opérations, elle s’accorde à $10^{-12}$ près en valeur relative ; un aller-retour (transformée puis transformée inverse) retrouve les données à $10^{-13}$ près. Une FFT de 2 048 points prend moins d’un dixième de milliseconde, et toute la préparation d’une forme (relevé des points compris) environ une milliseconde : tout se fait dans la page, sans Web Worker.' },
      ],
    },
    {
      id: 'dessin', titre: 'Dessiner la chaîne et la courbe', blocs: [
        { p: 'La courbe obtenue avec $M$ cercles se calcule d’un coup : on met à zéro les coefficients non gardés (après les avoir pondérés si l’on lisse), et une FFT inverse donne ses 2 048 points exacts. La trace orange n’est que le début de ce tableau, jusqu’à l’instant présent.' },
        { p: 'La chaîne des cercles, elle, est recalculée à chaque image : pour chaque cercle, un cosinus et un sinus, et une addition. Les cercles sont rangés du plus grand au plus petit, ce qui donne la chaîne la plus lisible ; l’ordre de l’addition ne change pas la position de la pointe. Les cercles de moins d’un demi-pixel ne sont pas tracés.' },
      ],
    },
    {
      id: 'ordres', titre: 'Les deux ordres et la courbe d’erreur', blocs: [
        { p: '*Par fréquence*, la liste est $1, -1, 2, -2, 3, \\dots$ *Par taille*, c’est la liste des 2 047 coefficients triée par $|c_k|$ décroissant. Grâce à Parseval, l’erreur avec $M$ cercles se lit sur les sommes cumulées des $|c_k|^2$ dans cet ordre : toute la courbe d’erreur se calcule en une seule passe, sans redessiner une seule forme.' },
        { p: '*Lissage* : pour une somme dont la plus haute fréquence est $K$, Fejér multiplie le coefficient de fréquence $k$ par $1 - |k|/(K + 1)$, et Lanczos par $\\sin u / u$ avec $u = \\pi k/(K + 1)$. Le lissage n’a de sens que par fréquence, où $K$ est bien défini.' },
      ],
    },
    {
      id: 'troisd', titre: 'Le ressort en 3D', blocs: [
        { p: 'En 3D, le point de la courbe au temps $t - a$ est placé à la profondeur $-a$, pour $a$ allant de 0 à un tour : la courbe devient un ressort qui s’enfonce dans le passé. De face, on retrouve la forme ; de côté, on voit $x(t)$ ou $y(t)$ comme une onde. Le ressort est une seule ligne de 2 048 points, mise à jour à chaque image ; les cercles sont une seule géométrie de segments. three.js n’est chargé que si l’on passe en 3D.' },
      ],
    },
  ],

  histoire: [
    {
      id: 'frise', titre: 'Une histoire des cercles et des ondes', blocs: [
        {
          frise: [
            ['vers 150', 'Claude Ptolémée', 'rassemble dans l’*Almageste* une astronomie de cercles : chaque planète tourne sur un épicycle, dont le centre tourne sur un déférent.'],
            ['1543', 'Nicolas Copernic', 'place le Soleil au centre, mais garde des cercles et des épicycles.'],
            ['1609', 'Johannes Kepler', 'remplace les cercles par des ellipses (*Astronomia nova*).'],
            ['1753', 'Daniel Bernoulli', 'propose d’écrire la vibration d’une corde comme une somme de sinus ; Euler et d’Alembert en doutent.'],
            ['vers 1805', 'Carl Friedrich Gauss', 'invente, sans la publier, la méthode de la transformée rapide, pour les orbites de Pallas et Junon.'],
            ['1807', 'Joseph Fourier', 'présente à l’Institut son mémoire sur la chaleur : toute fonction serait une somme de sinus. Lagrange proteste.'],
            ['1822', 'Joseph Fourier', 'publie la *Théorie analytique de la chaleur*.'],
            ['1829', 'Gustav Lejeune Dirichlet', 'démontre la première condition de convergence rigoureuse.'],
            ['1848', 'Henry Wilbraham', 'remarque le dépassement près d’un saut, ce qu’on appellera le phénomène de Gibbs.'],
            ['1873', 'Paul du Bois-Reymond', 'construit une fonction continue dont la série diverge en un point.'],
            ['1898', 'Albert Michelson', 'construit avec Samuel Stratton un analyseur harmonique mécanique à 80 éléments ; ses courbes montrent le dépassement.'],
            ['1898–1899', 'Josiah Willard Gibbs', 'explique ce dépassement dans deux lettres à *Nature*.'],
            ['1900', 'Lipót Fejér', 'montre que les moyennes des sommes partielles convergent pour toute fonction continue.'],
            ['1906', 'Maxime Bôcher', 'analyse le phénomène en détail et lui donne le nom de Gibbs.'],
            ['1907', 'Frigyes Riesz et Ernst Fischer', 'identifient les fonctions de carré intégrable et les suites de carré sommable.'],
            ['1923', 'Andreï Kolmogorov', 'construit une fonction intégrable dont la série diverge presque partout (partout en 1926).'],
            ['1960', 'Norwood Russell Hanson', 'montre que des épicycles en nombre fini approchent n’importe quel mouvement plan périodique.'],
            ['1965', 'James Cooley et John Tukey', 'publient la transformée de Fourier rapide.'],
            ['1966', 'Lennart Carleson', 'démontre que la série d’une fonction de carré intégrable converge presque partout.'],
            ['1972', 'Charles Zahn et Ralph Roskies', 'décrivent les contours de formes par leurs coefficients de Fourier.'],
            ['1973', 'Paul Lauterbur', 'publie la première image par résonance magnétique.'],
            ['1992', 'Le comité JPEG', 'publie la norme de compression d’images qui porte son nom.'],
          ],
        },
      ],
    },
    {
      id: 'ptolemee', titre: 'Le ciel en cercles', blocs: [
        { p: 'Vues de la Terre, les planètes avancent d’ordinaire d’ouest en est parmi les étoiles, mais de temps en temps elles s’arrêtent, reculent, puis repartent : c’est la *rétrogradation*. Pour la décrire avec des cercles, les astronomes grecs (Apollonius, Hipparque, puis Ptolémée) font tourner la planète sur un petit cercle, l’*épicycle*, dont le centre tourne sur un grand cercle, le *déférent*, autour de la Terre.' },
        { figure: 'ptolemee' },
        { p: 'Aujourd’hui, on comprend pourquoi cela marche. Mars et la Terre tournent autour du Soleil ; vue de la Terre, la position de Mars est la différence des deux : $z_{\\text{Mars}}(t) - z_{\\text{Terre}}(t)$, deux vecteurs qui tournent. Le déférent est l’orbite de Mars, l’épicycle est celle de la Terre, vue à l’envers. Dans l’explorateur, le scénario *Mars vue de la Terre* trace exactement cela : huit tours de Mars pendant quinze tours de la Terre, soit environ quinze ans, et sept boucles de rétrogradation.' },
        { p: 'Les orbites réelles sont des ellipses, et Ptolémée dut ajouter des réglages (l’excentrique, l’équant) pour suivre les observations. En 1960, Norwood Russell Hanson fait remarquer que ce n’était pas une impasse mathématique : avec assez d’épicycles, on approche n’importe quel mouvement périodique du plan. C’est exactement le théorème de Fourier. La révolution de Copernic et de Kepler ne vient pas de ce que les cercles étaient impuissants, mais de ce qu’ils décrivaient sans expliquer.' },
      ],
    },
    {
      id: 'fourier', titre: 'Fourier et la chaleur', blocs: [
        { p: 'Joseph Fourier (1768-1830), mathématicien, préfet de l’Isère, accompagnateur de Bonaparte en Égypte, étudie la propagation de la chaleur dans une barre ou un anneau de métal. Il trouve que chaque sinus se refroidit à sa propre vitesse, d’autant plus vite qu’il oscille vite. Pour résoudre l’équation, il suffit donc d’écrire la température initiale comme une somme de sinus.' },
        { p: 'Mais *toute* fonction, même avec des coins ou des sauts ? Lagrange, au jury de 1807, refuse de le croire : une somme de fonctions lisses lui semble ne pouvoir donner qu’une fonction lisse. Il avait raison de se méfier et tort de conclure : la série converge, mais pas toujours comme on l’attend. Il a fallu un siècle et demi pour savoir exactement quand.' },
      ],
    },
    {
      id: 'heritage', titre: 'Ce que Fourier a changé', blocs: [
        { p: 'Les questions soulevées par Fourier ont façonné les mathématiques modernes. Pour définir ses coefficients, Riemann précise la notion d’intégrale (1854). En étudiant l’unicité des séries trigonométriques, Cantor est amené aux ensembles infinis et à la théorie des ensembles. L’intégrale de Lebesgue (1902) et les espaces de Hilbert donnent enfin le cadre où Parseval devient une évidence géométrique. Plus tard, les distributions de Laurent Schwartz étendent la transformée de Fourier à des objets qui ne sont même plus des fonctions.' },
        { p: 'De l’autre côté, les ingénieurs ont fait de Fourier un outil quotidien : analyse des vibrations, télécommunications, imagerie médicale, compression. Et une chaîne de cercles qui dessine une forme est devenue l’une des façons les plus visuelles de l’expliquer.' },
      ],
    },
    {
      id: 'refs', titre: 'Références', blocs: [
        {
          refs: [
            ['J. Fourier, *Théorie analytique de la chaleur*, Paris, Firmin Didot, 1822.'],
            ['P. G. Lejeune Dirichlet, « Sur la convergence des séries trigonométriques qui servent à représenter une fonction arbitraire entre des limites données », *Journal für die reine und angewandte Mathematik*, 4, 1829.'],
            ['L. Fejér, « Sur les fonctions bornées et intégrables », *Comptes rendus de l’Académie des sciences*, 131, 1900.'],
            ['J. W. Gibbs, « Fourier’s series », *Nature*, 59, 1898 et 1899.'],
            ['M. Bôcher, « Introduction to the theory of Fourier’s series », *Annals of Mathematics*, 7, 1906.'],
            ['L. Carleson, « On convergence and growth of partial sums of Fourier series », *Acta Mathematica*, 116, 1966.'],
            ['J. W. Cooley, J. W. Tukey, « An algorithm for the machine calculation of complex Fourier series », *Mathematics of Computation*, 19, 1965.', 'https://doi.org/10.1090/S0025-5718-1965-0178586-1'],
            ['M. T. Heideman, D. H. Johnson, C. S. Burrus, « Gauss and the history of the fast Fourier transform », *Archive for History of Exact Sciences*, 34, 1985.', 'https://doi.org/10.1007/BF00348431'],
            ['N. R. Hanson, « The mathematical power of epicyclical astronomy », *Isis*, 51, 150–158, 1960.'],
            ['C. T. Zahn, R. Z. Roskies, « Fourier descriptors for plane closed curves », *IEEE Transactions on Computers*, C-21, 1972.'],
            ['F. P. Kuhl, C. R. Giardina, « Elliptic Fourier features of a closed contour », *Computer Graphics and Image Processing*, 18, 1982.'],
            ['N. Ahmed, T. Natarajan, K. R. Rao, « Discrete cosine transform », *IEEE Transactions on Computers*, C-23, 1974.'],
            ['P. C. Lauterbur, « Image formation by induced local interactions », *Nature*, 242, 1973.'],
            ['Y. Katznelson, *An Introduction to Harmonic Analysis*, Cambridge University Press (3e éd. 2004).'],
            ['T. W. Körner, *Fourier Analysis*, Cambridge University Press, 1988 : une histoire vivante de la théorie, et de ses applications.'],
            ['« Gibbs phenomenon », Wikipédia (en anglais) : histoire et calculs.', 'https://en.wikipedia.org/wiki/Gibbs_phenomenon'],
          ],
        },
      ],
    },
  ],

  /* ---------- Textes des figures ---------- */

  figures: {
    deuxcercles: {
      titre: 'Deux vecteurs qui tournent',
      resume: 'Une courbe orange tracée par deux cercles bleus, l’un au bout de l’autre.',
      presets: { ellipse: 'Ellipse', trefle: 'Trèfle', spirographe: 'Spirographe', mars: 'Mars' },
      k1: 'Fréquence du 1er cercle',
      r1: 'Rayon du 1er cercle',
      k2: 'Fréquence du 2e cercle',
      r2: 'Rayon du 2e cercle',
      temps: 'Instant',
      note: 'Une fréquence négative fait tourner le cercle dans l’autre sens ; un rayon négatif décale son départ d’un demi-tour. Deux fréquences égales à ±1 donnent une ellipse ; deux fréquences quelconques, une rosace qui se referme après un tour.',
    },
    creneau: {
      titre: 'Le créneau et sa somme partielle',
      resume: 'Un créneau gris qui vaut −1 puis 1, et une courbe verte qui l’approche en oscillant, avec un pic près de chaque saut.',
      K: 'Fréquence maximale K',
      lissage: 'Lissage',
      lissages: { aucun: 'Aucun', fejer: 'Fejér', lanczos: 'Lanczos' },
      serieF: 'le créneau',
      serieS: (k) => `somme jusqu’à ${k}`,
      axeX: 'x',
      axeY: 'valeur',
      info: (x, v) => `x = ${x}\u00a0: ${v}`,
      depassement: (p) => `Dépassement près du saut\u00a0: ${p} du saut.`,
      note: 'Augmentez K : le pic se rapproche du saut mais sa hauteur tend vers 8,95 % du saut. Avec Fejér, il disparaît ; avec Lanczos, il reste moins de 1,2 %.',
    },
    noyaux: {
      titre: 'Les noyaux de Dirichlet et de Fejér',
      resume: 'Un noyau vert avec un grand pic et des oscillations négatives, un noyau orange positif et plus étalé.',
      K: 'K',
      dirichlet: 'Dirichlet D_K',
      fejer: 'Fejér F_K',
      axeX: 'écart x = 2πs',
      axeY: 'poids',
      info: (x, v) => `${x}\u00a0: ${v}`,
      note: 'La somme partielle est une moyenne de la courbe pondérée par le noyau de Dirichlet, qui prend des valeurs négatives : d’où les oscillations. Le noyau de Fejér, toujours positif, fait une vraie moyenne locale.',
    },
    decroissance: {
      titre: 'La taille des cercles selon leur fréquence (échelles logarithmiques)',
      resume: 'Cinq courbes qui descendent : très vite pour la courbe lisse, comme 1/k² pour les coins, comme 1/k pour le saut.',
      noms: { infini: 'infini (lisse)', coeur: 'cœur (une pointe)', carre: 'carré (des coins)', koch: 'Koch (fractale)', spirale: 'spirale (un saut)' },
      serie: (nom, p) => (p ? `${nom} (pente ${p})` : nom),
      axeX: 'fréquence |k|',
      axeY: 'rayon typique',
      info: (x, v) => `|k| ≈ ${x}\u00a0: ${v}`,
      note: 'Chaque point est la moyenne quadratique des rayons d’une octave de fréquences (de 2^m à 2^(m+1)). Les formes sont parcourues à vitesse constante.',
    },
    parametrage: {
      titre: 'Le même cœur, deux façons de le parcourir',
      series: { formule: 'selon sa formule', vitesse: 'à vitesse constante' },
      axeX: 'cercles (rangés par taille)',
      axeY: 'erreur',
      info: (x, v) => `${x} cercles\u00a0: ${v}`,
      resume: 'Selon sa formule, l’erreur tombe à zéro à 8 cercles ; à vitesse constante, elle décroît lentement.',
      note: 'La formule ralentit jusqu’à s’arrêter à la pointe du cœur : elle reste lisse, et 8 cercles suffisent exactement. À vitesse constante, la pointe devient un coin, et il en faut des centaines.',
    },
    symetrie: {
      titre: 'Symétrie de rotation et fréquences permises',
      formes: { triangle: 'Triangle', carre: 'Carré', etoile: 'Étoile' },
      note: (m) => `En vert, les fréquences k telles que k − 1 est un multiple de ${m}\u00a0: ce sont les seules non nulles (à la précision du calcul près). Les autres barres touchent le plancher de l’échelle.`,
    },
    repliement: {
      titre: 'Huit images par tour : le repliement',
      resume: 'Un cercle, huit points numérotés de 0 à 7, et la trajectoire réelle en orange pâle.',
      k: 'Fréquence réelle k',
      etat: (k, a) => `Fréquence réelle ${k}, fréquence apparente ${a}.`,
      note: 'Un point tourne k fois par tour, mais on ne le regarde que huit fois. Les points numérotés sont tout ce que l’on voit : ils semblent tourner à la fréquence apparente, entre −4 et 3.',
    },
    papillon: {
      titre: 'La FFT de 8 points : trois étages de papillons',
      resume: 'Huit lignes horizontales reliées par des croisements en X sur trois étages.',
      naive: 'transformée directe (N²)',
      rapide: 'papillons de la FFT ((N/2) log₂ N)',
      note: 'À gauche, les points dans l’ordre de l’inversion des bits ; à droite, les coefficients dans l’ordre. Chaque X est un papillon : une multiplication, une addition, une soustraction.',
    },
    compression: {
      titre: 'L’avion : l’erreur selon le nombre de cercles',
      ordres: { frequence: 'par fréquence', amplitude: 'par taille' },
      axeX: 'cercles gardés',
      axeY: 'erreur',
      info: (x, v) => `${x} cercles\u00a0: ${v}`,
      resume: 'Deux courbes qui descendent ; rangés par taille, il faut moins de cercles pour la même erreur.',
      note: 'L’erreur est la racine de la part d’énergie oubliée, d’après l’égalité de Parseval. Échelles logarithmiques sur les deux axes.',
    },
    ptolemee: {
      titre: 'Mars vue du Soleil et vue de la Terre',
      resume: 'À gauche, deux orbites circulaires autour du Soleil ; à droite, la trajectoire de Mars vue de la Terre, avec des boucles.',
      helio: 'vue du Soleil',
      geo: 'vue de la Terre',
      soleil: 'Soleil',
      terre: 'Terre',
      mars: 'Mars',
      temps: 'Temps',
      jours: (j) => `${j} jours`,
      note: 'Orbites circulaires, rayons 1 et 1,524 unité astronomique, périodes 365,25 et 686,98 jours. Quand la Terre double Mars, Mars semble reculer : c’est une boucle de rétrogradation, environ tous les 780 jours.',
    },
    descripteurs: {
      titre: 'Quelle forme avez-vous dessinée ?',
      resume: 'Une zone de dessin ; on y trace une forme et la figure annonce les formes connues les plus proches.',
      consigne: 'Dessinez une forme d’un seul trait dans le cadre.',
      resultat: (l) => `Les plus proches\u00a0: ${l}.`,
      effacer: 'Effacer',
      noms: { cercle: 'cercle', ellipse: 'ellipse', trefle: 'trèfle', coeur: 'cœur', infini: 'infini', poisson: 'poisson', carre: 'carré', triangle: 'triangle', etoile: 'étoile', avion: 'avion', koch: 'flocon' },
      note: 'Signature : les rayons des 24 premiers cercles (fréquences −12 à 12), divisés par la racine de l’énergie, comparés aussi en sens inverse. Entre parenthèses, la distance : plus elle est petite, plus les formes se ressemblent. Taille, position, orientation et point de départ n’y changent rien.',
    },
  },

  /* ---------- Fiches des scénarios ---------- */

  fiche: {
    regles: 'Les règles',
    regarder: 'À regarder',
    pourquoi: 'Ce qui se passe, et pourquoi',
    realite: 'Pour aller plus loin',
    ouvrir: 'Ouvrir dans l’explorateur',
    ouvrirNom: (nom) => `Ouvrir «\u00a0${nom}\u00a0»`,
    calcul: 'Calcul…',
    note: 'Calculé dans la page avec le moteur de l’explorateur. En blanc pâle, la forme d’origine ; en orange, la courbe des cercles gardés ; en bleu, les cercles à un instant du tour.',
    mesures: (m, e) => `${m} cercle${m === '1' ? '' : 's'} · énergie gardée ${e}`,
  },

  fiches: {
    dessin: {
      question: 'Peut-on redessiner n’importe quelle forme avec des cercles ?',
      regles: [
        'Choisissez *Votre dessin*, ou le bouton *Dessiner*, et tracez une forme d’un seul trait, sans lever le doigt.',
        'La forme est parcourue à vitesse constante et relevée en 2 048 points ; la fin est reliée au début.',
        'Les cercles sont rangés par taille, et l’on en garde 60 au départ.',
      ],
      regarder: [
        'Avec 1 cercle : un cercle, à peu près de la taille de votre dessin.',
        'Avec 5 à 10 cercles : l’allure générale apparaît.',
        'Avec une centaine : les détails, jusqu’aux tremblements de la main.',
      ],
      pourquoi: [
        'Votre dessin est une courbe fermée : le théorème de Fourier garantit qu’elle est une somme de cercles. Les grands cercles lents portent l’essentiel de l’énergie ; les petits cercles rapides ajoutent les détails. Rangés par taille, on obtient la meilleure ressemblance possible pour un nombre de cercles donné.',
        'Les coins demandent beaucoup de petits cercles : un dessin tout en courbes douces se reconnaît avec moins de cercles qu’un dessin plein d’angles.',
      ],
      realite: 'Décochez *Relier la fin au début* : la courbe saute alors de la fin au début, et la série oscille près du saut. C’est le phénomène de Gibbs (fiche de la spirale).',
    },
    ellipse: {
      question: 'Que dessinent un ou deux cercles ?',
      regles: [
        'Un cercle seul, de fréquence 1.',
        'Puis deux cercles : fréquences 1 et −1 (ellipse), 3 et −1 (trèfle), 3 et −2 (spirographe).',
        'Les formes sont parcourues selon leur formule.',
      ],
      images: { cercle: 'Un cercle', ellipse: 'Ellipse : 1 et −1', trefle: 'Trèfle : 3 et −1', spirographe: 'Spirographe : 3 et −2' },
      regarder: [
        'Chaque forme est dessinée exactement : l’énergie gardée est de 100 %.',
        'Le nombre de feuilles ou de pointes dépend de l’écart entre les deux fréquences.',
      ],
      pourquoi: [
        'Deux vecteurs qui tournent aux fréquences $a$ et $b$ reviennent à la même position relative tous les $1/|a - b|$ de tour : la forme a une symétrie d’ordre $|a - b|$. Le trèfle (3 et −1) a quatre feuilles ; le spirographe (3 et −2), cinq pointes. L’ellipse (1 et −1) a deux axes de symétrie.',
        'Les demi-axes de l’ellipse sont la somme et la différence des deux rayons.',
      ],
      realite: 'Le spirographe, jouet inventé dans les années 1960, fait rouler une roue dentée dans une autre : c’est exactement une somme de deux cercles. Les courbes de Lissajous et les harmonographes en sont des cousins.',
      ouvrir: ['ellipse', 'trefle', 'spirographe'],
    },
    mars: {
      question: 'Pourquoi Mars semble-t-elle reculer dans le ciel ?',
      regles: [
        'Mars tourne autour du Soleil en 687 jours, à 1,524 fois la distance Terre-Soleil ; la Terre en 365 jours.',
        'Vue de la Terre, la position de Mars est la différence des deux.',
        'Sur un tour de la courbe : huit tours de Mars, quinze de la Terre, soit environ quinze ans.',
      ],
      images: { un: 'Un cercle : le déférent', deux: 'Deux cercles : déférent et épicycle' },
      regarder: [
        'Avec un cercle, Mars tourne régulièrement.',
        'Avec deux, elle fait sept boucles : à chaque boucle, elle recule un moment.',
      ],
      pourquoi: [
        'Quand la Terre, plus rapide et plus proche du Soleil, double Mars, Mars semble reculer, comme une voiture que l’on dépasse sur l’autoroute. En quinze ans, la Terre double Mars sept fois (15 − 8 = 7).',
        'Le premier cercle (l’orbite de Mars) porte 70 % de l’énergie, le second (l’orbite de la Terre, vue à l’envers) les 30 % restants. Deux cercles dessinent la trajectoire exactement.',
      ],
      realite: 'C’est le système du déférent et de l’épicycle de Ptolémée (voir *Histoire*). Les vraies orbites étant des ellipses, Ptolémée dut ajouter des réglages ; avec assez de cercles, on les aurait suivies aussi bien qu’on veut.',
    },
    coeur: {
      question: 'Combien de cercles pour dessiner un cœur ?',
      regles: [
        'Le cœur de la formule $x = 16\\sin^3 t$, $y = 13\\cos t - 5\\cos 2t - 2\\cos 3t - \\cos 4t$.',
        'Trois images selon sa formule, avec 2, 4 et 8 cercles rangés par taille.',
        'La dernière, à vitesse constante, avec 8 cercles.',
      ],
      images: { m2: 'Formule : 2 cercles', m4: 'Formule : 4 cercles', m8: 'Formule : 8 cercles', v8: 'Vitesse constante : 8 cercles' },
      regarder: [
        'Selon sa formule, 8 cercles dessinent le cœur exactement.',
        'À vitesse constante, 8 cercles arrondissent la pointe du haut et celle du bas.',
      ],
      pourquoi: [
        'La formule ne contient que des sinus et des cosinus de fréquences 1 à 4 : en nombres complexes, au plus 8 vecteurs qui tournent. C’est un *polynôme trigonométrique* : un nombre fini de cercles suffit.',
        'À vitesse constante, il faut tourner d’un coup au passage des pointes : ce sont des coins, et un coin demande une infinité de cercles dont les rayons décroissent comme $1/k^2$. Avec 8 cercles, il reste 4 % d’erreur, et encore 0,5 % avec 30.',
      ],
      realite: 'La même forme, deux paramétrages, deux spectres très différents : la régularité qui compte est celle du mouvement, pas du dessin. La formule passe la pointe en s’arrêtant (sa vitesse s’annule).',
      ouvrir: ['coeur'],
    },
    infini: {
      question: 'Combien de cercles pour une courbe parfaitement lisse ?',
      regles: [
        'La lemniscate de Bernoulli, en forme de ∞, selon sa formule.',
        'Cercles ajoutés par fréquence : 2, 4, puis 6.',
      ],
      images: { m2: '2 cercles', m4: '4 cercles', m6: '6 cercles' },
      regarder: [
        'Avec 2 cercles : un simple segment.',
        'Avec 4 : déjà un huit ; avec 6, le ∞ (99,5 % de l’énergie).',
      ],
      pourquoi: [
        'Les deux premiers cercles, de fréquences 1 et −1, ont le même rayon : ils tournent en sens contraires, leurs mouvements verticaux s’annulent, et il reste un aller-retour horizontal. Les cercles de fréquences 2 et −2 ajoutent la montée et la descente des deux boucles.',
        'La lemniscate est *analytique* : sans coin ni pointe, elle se développe en série entière. Ses coefficients décroissent alors plus vite que toute puissance de $k$, comme $e^{-a|k|}$ : chaque nouveau cercle est une fraction fixe du précédent.',
      ],
      realite: 'Les courbes lisses sont bon marché, les coins chers. C’est pourquoi les formats de compression gardent sans peine les dégradés doux, et peinent sur les bords nets.',
    },
    carre: {
      question: 'Pourquoi les coins coûtent-ils cher ?',
      regles: [
        'Un carré, parcouru à vitesse constante.',
        'Cercles ajoutés par fréquence : 2, 8, puis 40.',
      ],
      images: { m2: '2 cercles', m8: '8 cercles', m40: '40 cercles' },
      regarder: [
        'Avec 2 cercles : un simple cercle ; le cercle de fréquence −1 est nul.',
        'Les coins s’aiguisent lentement ; même avec 40 cercles, ils restent arrondis.',
        'Dans le spectre, seule une fréquence sur quatre est utilisée.',
      ],
      pourquoi: [
        'À chaque coin, la direction de la vitesse saute : les coefficients décroissent comme $1/k^2$ (pente mesurée : −1,9). Pour diviser l’erreur par 10, il faut environ 10 fois plus de cercles.',
        'Le carré revient sur lui-même après un quart de tour : seules les fréquences $1, -3, 5, -7\\dots$ sont non nulles. Par fréquence, 22 cercles sont nécessaires pour 99,99 % de l’énergie ; par taille, 6, parce qu’on saute les cercles nuls.',
      ],
      realite: 'Pas de phénomène de Gibbs ici : la courbe est continue, seule sa direction saute. Les coins sont arrondis, jamais dépassés.',
    },
    etoile: {
      question: 'Que nous apprend la symétrie d’une étoile ?',
      regles: [
        'Une étoile à cinq branches, parcourue à vitesse constante.',
        'Cercles rangés par taille : 1, 3, puis 12.',
      ],
      images: { m1: '1 cercle', m3: '3 cercles', m12: '12 cercles' },
      regarder: [
        'Avec 3 cercles, l’étoile est reconnaissable (99,9 % de l’énergie).',
        'Dans le spectre : seules les fréquences 1, −4, 6, −9, 11… sont non nulles.',
      ],
      pourquoi: [
        'Tourner l’étoile d’un cinquième de tour la laisse inchangée. Sur les coefficients, cela impose $c_k = 0$ sauf si $k - 1$ est un multiple de 5. Les trois cercles utiles sont les fréquences 1, −4 et 6 : la forme générale, puis les cinq pointes.',
      ],
      realite: 'Cette règle se démontre en deux lignes (voir *Théorie*). Elle explique pourquoi les flocons, les fleurs et les engrenages ont des spectres si clairsemés.',
    },
    avion: {
      question: 'Combien de cercles faut-il pour reconnaître un avion ?',
      regles: [
        'La silhouette d’un avion de ligne vue de dessus, une ligne brisée de 23 sommets, parcourue à vitesse constante.',
        'Cercles rangés par taille : 5, 15, puis 30.',
      ],
      images: { m5: '5 cercles', m15: '15 cercles', m30: '30 cercles' },
      regarder: [
        'Avec 5 cercles : une croix molle.',
        'Avec 15 : on reconnaît les ailes et l’empennage.',
        'Avec 30 : l’avion, aux coins près.',
      ],
      pourquoi: [
        'Rangés par taille, 13 cercles gardent 99 % de l’énergie et 29 en gardent 99,9 % ; il en faut 17 et 40 par fréquence. Sur 2 048 coefficients, 30 suffisent à une forme reconnaissable : une compression de près de 70 fois.',
      ],
      realite: 'C’est le principe du JPEG et du MP3 : transformer, garder les grands coefficients, oublier les autres (voir *Applications*).',
    },
    koch: {
      question: 'Que se passe-t-il quand il y a des coins à toutes les échelles ?',
      regles: [
        'Le flocon de Koch après quatre étapes : chaque côté est remplacé par quatre côtés trois fois plus courts, quatre fois de suite (768 côtés).',
        'Cercles rangés par taille : 10, 50, puis 400.',
      ],
      images: { m10: '10 cercles', m50: '50 cercles', m400: '400 cercles' },
      regarder: [
        'Avec 10 cercles : un triangle à bosses.',
        'Chaque palier de cercles fait apparaître un nouvel étage de pointes.',
      ],
      pourquoi: [
        'Le flocon complet est continu mais n’a de tangente nulle part. Ses coefficients décroissent lentement : pente moyenne mesurée −1,3. Le long des fréquences −1, −4, −16, −64, le rayon est divisé à peu près par 4 à chaque étape : chaque étage de détails trois fois plus petits demande quatre fois plus de cercles.',
        'Le flocon revient sur lui-même après un tiers de tour, et il est parcouru dans l’autre sens que le carré et l’étoile : seules les fréquences −1, 2, −4, 5… sont utilisées.',
      ],
      realite: 'Helge von Koch a publié cette courbe en 1904, comme exemple de courbe continue sans tangente. Son périmètre est infini, sa surface finie. Voir aussi le projet *Fractales* du labo.',
    },
    spirale: {
      question: 'Que se passe-t-il quand la courbe ne se referme pas ?',
      regles: [
        'Une spirale de deux tours et demi, dont la fin ne rejoint pas le début.',
        'Les cercles sont ajoutés par fréquence : 30, puis 200.',
        'La dernière image ajoute le lissage de Fejér.',
      ],
      images: { m30: '30 cercles', m200: '200 cercles', fejer: '200 cercles, lissage de Fejér' },
      regarder: [
        'La série relie la fin au début par un trait droit… qui dépasse aux deux bouts, puis oscille.',
        'Avec 200 cercles, les oscillations sont plus serrées, mais le dépassement n’a pas diminué.',
        'Avec Fejér, plus de dépassement, mais une spirale plus molle.',
      ],
      pourquoi: [
        'Pour la série, la courbe est périodique : elle doit sauter de la fin au début. Près d’un saut, la somme partielle dépasse d’environ 9 % de l’écart, quel que soit le nombre de cercles : c’est le *phénomène de Gibbs*. Nous mesurons 9,4 % de l’écart avec 30 cercles et 8,9 % avec 200.',
        'Le lissage de Fejér pondère les cercles rapides vers zéro ; la somme devient une vraie moyenne locale, qui ne peut pas dépasser.',
      ],
      realite: 'Ces oscillations se voient autour des bords nets des images JPEG trop comprimées, et dans les images d’IRM : c’est le même phénomène.',
    },
  },
}
