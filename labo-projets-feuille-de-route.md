# Labo de projets — feuille de route (état au 28/10/2026)

Page d'intro du portfolio : une vitrine de petits projets de code rangés par onglets, en parallèle de l'aéroport. Les plus visuels se lancent aussi sur la borne d'arcade du hall.
Objectif recruteur : **30 secondes pour voir des choses qui bougent, 2 minutes pour comprendre ce que tu sais faire.**

Stack existante : Vite 8 · React 19 · three.js 0.185 · R3F 9 · drei 10 · Zustand · Vercel prévu en fin de parcours.

---

## 1. Lire les tableaux

### Où tourne le calcul

| Niveau | Signification | Coût d'hébergement |
|---|---|---|
| 🟢 **Navigateur** | Tout tourne chez le visiteur : Canvas, shaders WebGL, Web Worker pour le calcul lourd. | Nul (site statique) |
| 🟡 **Pré-calcul** | Un script Python tourne une fois chez toi et dépose des fichiers JSON/Parquet figés. Le site reste statique et ne fait qu'afficher, filtrer, rejouer. | Nul |
| 🔴 **Backend live** | Un serveur doit tourner en continu : clé d'API secrète, état partagé (multijoueur), LLM, calcul lourd à la demande. | Un serveur à payer et surveiller |

**Le navigateur calcule bien plus qu'on ne croit.** Un shader de fractale calcule des millions de pixels par image, un Monte Carlo à 100 000 trajectoires tient dans un Web Worker. Ce qui force vraiment un serveur, c'est rarement la puissance : c'est **un secret** (clé d'API), **un état partagé** (Perudo en ligne), **une licence ou un volume de données**, ou **un LLM**.

### Règles décidées
- **Données figées par défaut.** Les projets de calcul et de visualisation s'appuient sur des jeux de données téléchargés une fois, rarement voire jamais mis à jour : le but est de montrer la méthode, pas de suivre le marché.
- **Le live passe derrière un mot de passe.** Tout projet qui appelle une source en direct est 🔒.
- **Bascule libre vers le backend.** Quand le backend existera, n'importe quel projet pourra y migrer tout ou partie de son calcul : il suffit de changer le champ `calcul` de sa fiche (§6).
- **Un projet = une case cliquable** dans la grille de la page Lab.

### Autres colonnes
- **Diff.** : difficulté technique sur 5.
- **Effort** (estimation grossière, à ton rythme de sessions du soir) : **S** = 1–3 soirées · **M** = 1–3 semaines · **L** = 1–2 mois · **XL** = plusieurs mois.
- **Borne** : ✅ jouable ou regardable sur l'écran d'arcade (basse résolution, joystick + 2 boutons) · ⚠️ regardable seulement (boucle de démo) · ❌ besoin d'une vraie page (texte, formulaires, tableaux).
- **Visibilité** : Public · 🔒 protégé (voir section 7).

---

## 2. Onglets proposés

| Onglet | Contenu |
|---|---|
| ⭐ **À la une** (par défaut) | Les 6 meilleurs projets, tous onglets confondus. Un recruteur ne parcourt pas 50 cartes. |
| 🧬 **Simulations** | Automates cellulaires, systèmes multi-agents, modèles économiques et sociaux, émergence |
| 🌀 **Maths & génératif** | Fractales, animations mathématiques, visualiseur musical |
| 🧭 **Algorithmes** | Algorithmes classiques rendus visibles |
| 🎮 **Jeux** | Perudo, mini-jeux de la borne |
| 📈 **Finance quant** | Filtres internes : Dérivés · Taux & crédit · Stratégies & statistiques · Microstructure · Informatique financière · Fiches de recherche |
| 🎓 **Entretiens** | Préparation aux entretiens finance |
| 🛰️ **Données live** | ISS, avions, séismes, satellites |
| 🔒 **Labo** | Projets privés ou en cours |
| 🔒 **Outils** | Tes outils de développement personnels (Obsidian, candidatures…), visibles par toi seul |

---

## 3. Tes projets

| # | Projet                                      | Onglet | Besoin dominant | Calcul | Données | Diff. | Effort | Borne | Visibilité |
|---|---------------------------------------------|---|---|---|---|---|---|---|---|
| 1 | ~~Fourmi de Langton~~                       | Simulations | Interface | 🟢 | — | 1 | S | ✅ | Public |
| 2 | ~~Jeu de la vie + variantes~~               | Simulations | Interface (GPU pour les grandes grilles) | 🟢 | motifs au format RLE | 2 (Lenia : 4) | S → M | ✅ | Public |
| 3 | ~~Ségrégation de Schelling multi-facteurs~~ | Simulations | Interface + réglages + courbes | 🟢 (Worker) | — (carte réelle : 🟡) | 3 | M | ⚠️ | Public |
| 4 | ~~Traceur de lignes de désir~~              | Simulations | Interface | 🟢 | — (traces réelles : 🟡) | 3 | M | ✅ | Public |
| 5a | Perudo contre des bots                      | Jeux | Interface + IA des bots | 🟢 | — | 3 | M | ✅ | Public |
| 5b | Perudo en ligne                             | Jeux | Serveur temps réel | 🔴 | — | 4 | L | ❌ | 🔒 tant que WIP |
| 6 | ~~Générateur de fractales~~                 | Maths & génératif | Shader GPU | 🟢 | — | 2 (zoom profond : 5) | S → M | ✅ | Public |
| 7 | Visualiseur musical                         | Maths & génératif | Web Audio + shaders | 🟢 | fichier ou micro du visiteur | 3 | M | ✅ | Public |
| 8 | Zone d'animations mathématiques             | Maths & génératif | Interface | 🟢 | — | 1–3 | S chacune | ✅ | Public |
| 9 | Entraînement entretiens finance             | Entretiens | Contenu + interface | 🟢 QCM/quiz/code · 🔴 correction IA | ta banque de questions | 3 + contenu | L | ❌ | Public / IA 🔒 |
| 10 | Pricer d'options + greeks                   | Finance quant | Calcul + graphes | 🟢 (MC en Worker) | — | 3 | M | ⚠️ | Public |
| 11 | Backtester de pair trading                  | Finance quant | Données + calcul | 🟡 + 🟢 | quotidien, 50–200 actions | 4 | L | ❌ | Public (résultats) |
| 12 | Carnet d'ordres + market making             | Finance quant | Simulation + visuel | 🟢 | simulées | 4 | L | ✅ | Public |
| 13 | Signaux alpha par machine learning          | 🔒 Labo | Calcul lourd | 🟡 (entraînement chez toi) | gros historique | 5 | XL | ❌ | 🔒 |
| 14 | Market Profile / TPO                        | Finance quant | Visuel | 🟢 rendu · 🟡 données | barres 30 min | 3 | M | ⚠️ | Public |
| 15 | Détecteur de volatility clustering          | Finance quant | Calcul + graphes | 🟡 | quotidien | 3 | M | ❌ | Public |
| 16 | Carte de saisonnalité intraday              | Finance quant | Heatmap | 🟡 | intraday sur plusieurs années | 2 (données : 4) | M | ❌ | Public |
| 17 | Test de neutralité aux facteurs             | Finance quant | Calcul | 🟡 | facteurs Fama-French + rendements | 3 | M | ❌ | Public |
| 18 | Momentum dépendant du régime                | Finance quant | Calcul | 🟡 | quotidien, long historique | 4 | L | ❌ | Public |
| 19 | Fiches info & recherche                     | Finance quant | Contenu | 🟢 | — | 1 (le temps est dans l'écriture) | continu | ❌ | Public |
| 20 | ISS Live Tracker                            | Données live | Interface | 🟢 | API publique | 1 | S | ✅ | Public |
| 21 | Lab de trading IA                           | 🔒 Labo | Tout | 🔴 | fournisseur payant | 5 | XL | ❌ | 🔒 |

**Bilan : sur ces 22 lignes (Perudo compte double), 12 tournent entièrement dans le navigateur, 7 se contentent d'un pré-calcul, et 3 seulement exigent un vrai serveur** (Perudo en ligne, correction IA des entretiens, Lab IA). Tu peux construire presque toute la page sans backend.

### Notes par projet

**1. Fourmi de Langton.** Ajouter les règles multi-couleurs (chaînes du type `RLLR`), plusieurs fourmis, les turmites. À haute vitesse, faire des milliers de pas par image et ne redessiner que les cases modifiées. L'« autoroute » qui apparaît après ~10 000 pas est le moment fort à mettre en scène.

**2. Jeu de la vie.** Version CPU confortable jusqu'à ~500×500. Au-delà, calcul sur GPU en « ping-pong » entre deux textures. Variantes : HighLife, Day & Night, Brian's Brain, règles B/S libres, grille hexagonale ; Lenia (version continue) en bonus, très spectaculaire. Import des motifs au format RLE.

**3. Schelling multi-facteurs.** Facteurs possibles : plus de deux groupes, tolérance différente par groupe, revenu et prix du logement (on ne déménage que là où on peut payer), attrait des équipements, distance au centre. Courbes en direct : indice de dissimilarité, taux d'agents satisfaits. Présenter comme un modèle d'émergence : des préférences individuelles modestes produisent une ségrégation forte.

**4. Lignes de désir.** Modèle de « marcheurs actifs » (Helbing et al., 1997) : l'herbe piétinée attire les marcheurs suivants, et les sentiers émergent. **Lien direct avec l'aéroport** : simuler des passagers entre portes et boutiques et voir où se forment les chemins ; la texture d'usure pourrait même finir sur le sol du hall.

**5. Perudo.** Commencer par le solo contre des bots : la probabilité qu'au moins *k* dés montrent une valeur suit une loi binomiale (p = 1/3 avec les pacos jokers, 1/6 pour les pacos eux-mêmes), plus une dose de bluff. Joli pont vers la finance. Le mode en ligne demande un serveur WebSocket avec salons par code ; les fonctions serverless de Vercel ne gardent pas de connexion ouverte, il faudra un petit serveur à part.

**6. Fractales.** Shader de fragment : Mandelbrot, Julia liée à la souris, Burning Ship, Newton, coloration lissée. La précision float32 pixelise vers un zoom ×100 000 ; le zoom profond demande la théorie des perturbations (gros morceau, à garder pour plus tard). Extensions : Mandelbulb 3D en raymarching, IFS (fougère de Barnsley), L-systems.

**7. Visualiseur musical.** Web Audio API (`AnalyserNode`, FFT) branché sur des shaders, détection de battements par flux d'énergie. Sources : fichier déposé par le visiteur ou micro. Les services de streaming (Spotify, etc.) sont protégés et ne peuvent pas être analysés. Pour la borne, embarquer quelques morceaux libres de droits.

**8. Animations mathématiques.** Une série de petites pièces de 1 à 3 soirées (liste en section 4). Format idéal pour la borne et pour l'attract mode.

**9. Entretiens finance.** Le vrai travail est le contenu : banque de questions en JSON/Markdown (thème, difficulté, type, réponse, explication). Types : QCM, quiz numérique, rédaction, code. Le code s'exécute dans le navigateur avec **Pyodide** (Python + numpy + pandas en WebAssembly) et **sql.js** pour le SQL : correction automatique par tests, sans serveur. La rédaction corrigée par IA est le seul morceau qui coince :
- Ollama sur ta machine → fonctionne pour toi seul, pas pour les visiteurs ;
- WebLLM dans le navigateur du visiteur → aucun serveur, mais téléchargement de centaines de Mo à plusieurs Go et WebGPU obligatoire ;
- API de LLM derrière ton backend → simple, mais chaque requête coûte : à protéger.

Version publique sans IA : corrigé type + grille d'auto-évaluation. Attention : ne pas recopier les questions des livres de préparation, les reformuler.

**10. Pricer.** Black-Scholes fermé + greeks analytiques ; arbre binomial CRR pour l'exercice américain ; Monte Carlo pour les exotiques (asiatique, barrière) avec réduction de variance (antithétique, variable de contrôle). Graphe de convergence MC → BS, solveur de volatilité implicite, diagrammes de payoff, et une **surface de prix 3D en three.js** pour la vitrine.

**11. Pair trading.** Pré-calcul Python : univers par secteur, corrélation puis cointégration (Engle-Granger), ratio de couverture (MCO glissant ou filtre de Kalman), spread et z-score. Le navigateur rejoue les spreads pré-calculés et laisse régler les seuils d'entrée/sortie et les frais en direct. **Montrer explicitement les pièges** (biais d'anticipation, biais du survivant, tests multiples sur des centaines de paires) : c'est ce qui distingue un candidat sérieux.

**12. Carnet d'ordres + market making.** Moteur d'appariement prix-temps, flux d'ordres par processus de Poisson, market maker d'Avellaneda-Stoikov (prix de réservation, risque d'inventaire). Visuels : profondeur, heatmap du carnet, PnL, inventaire. **Mode jeu : le joueur est le market maker** → parfait pour la borne. Plus tard, un « mode réel » branché sur le flux public d'une plateforme crypto (sans clé).

**13. Signaux ML.** Features, labels, validation croisée purgée avec embargo (López de Prado), chasse aux fuites d'information. Entraînement chez toi. Publier la méthodologie et les garde-fous, garder les signaux privés.

**14. TPO.** Calcul dans le navigateur à partir de barres 30 min : une lettre par période, POC, value area à 70 % (VAH/VAL), initial balance (A + B), single prints, formes D/P/b. Les données intraday gratuites sont le point dur ; la crypto est la voie la plus simple (mais marché 24 h/24, donc définir des « séances »). Livrer quelques journées d'exemple en fichiers statiques.

**15. Volatility clustering.** Autocorrélation des rendements (≈ 0) contre celle des rendements au carré ou absolus (forte), test ARCH-LM, GARCH(1,1) (package `arch` en Python), volatilité glissante avec régimes surlignés.

**16. Saisonnalité intraday.** Heatmap heure × jour de la semaine : rendement moyen, volatilité, volume (la courbe en U du volume intraday). Calcul trivial, données lourdes : pré-calcul obligatoire.

**17. Neutralité aux facteurs.** Régression des rendements d'un portefeuille sur marché, SMB, HML, momentum. Les facteurs sont gratuits sur la Kenneth French Data Library (y compris des facteurs européens). Afficher bêtas, t-stats, et un verdict « neutre / exposé ».

**18. Momentum par régime.** Régimes définis par la volatilité, la tendance (moyenne mobile 200 jours) ou un modèle de Markov caché ; performance du momentum par régime ; illustrer les « momentum crashes » (Daniel & Moskowitz).

**19. Fiches info & recherche.** Format MDX (Markdown + composants React) pour glisser des widgets interactifs dans le texte. Chaque projet a sa fiche : concept, maths, sources, ce que tu as appris, limites. C'est là que se lit ta compréhension, pas seulement ton code.

**20. ISS.** `wheretheiss.at` répond en HTTPS (avec une limite de requêtes). Open Notify, souvent cité dans les tutos, répond en HTTP : un site en HTTPS bloquera l'appel. Mieux encore : propager la position dans le navigateur avec `satellite.js` à partir des éléments orbitaux (TLE) → mouvement fluide à 60 i/s, trace de l'orbite, prochains passages. Un TLE perd sa précision en quelques semaines : pour rester public sans appel live, rafraîchir de temps en temps un fichier statique. Afficher sur un **globe 3D** plutôt qu'une carte plate, puisque tu maîtrises three.js.

**21. Lab de trading IA.** À faire en dernier, et **les petits projets en sont les briques** : pipeline de données (§6), backtester (11), garde-fous anti-surapprentissage (proposition « pièges du backtest »), analyse de régimes (18), ML (13). Le LLM génère des stratégies sous forme de configuration ou de code, exécutées dans un bac à sable, évaluées en walk-forward avec Sharpe dégonflé.

---

## 4. Propositions supplémentaires

⭐ = forte valeur pour un recruteur ou lien fort avec le reste du site. Toutes ces propositions sont publiques, sauf les données live (règle §1) et l'onglet Outils.

### 🧬 Simulations

| Projet                          | En deux mots | Calcul | Effort | Borne |
|---------------------------------|---|---|---|---|
| ⭐ ~~Boids~~                     | Nuées d'oiseaux à partir de trois règles locales | 🟢 | S | ✅ |
| ⭐ Foule d'aéroport / évacuation | Modèle de forces sociales ; sorties, goulets, panique. Réutilise les lignes de désir et se branche sur le hall | 🟢 | M | ✅ |
| Physarum                        | Moisissure qui dessine des réseaux (Jones, 2010), magnifique sur GPU | 🟢 | M | ✅ |
| Réaction-diffusion (Gray-Scott) | Motifs de Turing : taches, rayures, labyrinthes | 🟢 | S | ✅ |
| ⭐ Tas de sable abélien          | Criticité auto-organisée : avalanches de toutes tailles, métaphore des krachs | 🟢 | S | ✅ |
| Modèle d'Ising                  | Aimantation et transition de phase ; cousin des modèles de comportement moutonnier en finance | 🟢 | S | ✅ |
| Trafic de Nagel-Schreckenberg   | Bouchons fantômes qui naissent de rien | 🟢 | S | ✅ |
| Feux de forêt / percolation     | Seuil critique de propagation | 🟢 | S | ✅ |
| Proies-prédateurs               | Lotka-Volterra en équations et en agents, côte à côte | 🟢 | S → M | ✅ |
| Marché artificiel multi-agents  | Bulles et krachs émergents à la Santa Fe ; cousin de Schelling | 🟢 | L | ✅ |
| Fluides (Stable Fluids)         | Fluide qu'on touille à la souris | 🟢 | M | ✅ |

### 🌀 Maths & génératif

| Projet | En deux mots | Calcul | Effort | Borne |
|---|---|---|---|---|
| ⭐ Épicycles de Fourier | Le visiteur dessine, des cercles qui tournent redessinent la forme | 🟢 | S | ✅ |
| ⭐ Attracteurs étranges | Lorenz, Rössler, Clifford, De Jong : des millions de points sur GPU | 🟢 | S | ✅ |
| Mandelbulb 3D | Fractale 3D en raymarching, prolonge le générateur de fractales | 🟢 | M | ✅ |
| ⭐ Planche de Galton | Les billes construisent la loi normale ; pont vers l'arbre binomial du pricer | 🟢 | S | ✅ |
| π par Monte Carlo / aiguille de Buffon | Pont pédagogique vers le Monte Carlo du pricer | 🟢 | S | ✅ |
| Double pendule | Le chaos en direct, deux pendules à 0,001° d'écart | 🟢 | S | ✅ |
| Harmonographe / Lissajous | Courbes de pendules couplés | 🟢 | S | ✅ |
| L-systems | Plantes générées par réécriture | 🟢 | S | ✅ |
| Tesseract 4D | Hypercube projeté et tourné en 4D | 🟢 | S | ✅ |
| Spirale d'Ulam | Les nombres premiers dessinent des diagonales | 🟢 | S | ⚠️ |
| Pavages de Penrose | Pavage apériodique | 🟢 | M | ⚠️ |

### 🧭 Algorithmes

| Projet | En deux mots | Calcul | Effort | Borne |
|---|---|---|---|---|
| Tris sonifiés | Chaque comparaison fait une note | 🟢 | S | ✅ |
| ⭐ Pathfinding sur le plan de l'aéroport | A* / Dijkstra pour rejoindre une porte | 🟢 | S | ✅ |
| Labyrinthes | Génération puis résolution animées | 🟢 | S | ✅ |
| Voyageur de commerce | Recuit simulé contre colonies de fourmis (clin d'œil à Langton) | 🟢 | M | ✅ |
| Algorithme génétique | Créatures ou voitures qui apprennent à avancer | 🟢 | M | ✅ |
| Reconnaissance de chiffres | Le visiteur dessine, un petit réseau de neurones pré-entraîné devine | 🟢 | M | ✅ |

### 🎮 Jeux (pensés pour la borne)

| Projet | En deux mots | Calcul | Effort | Borne |
|---|---|---|---|---|
| ⭐ Jeu du market maker | Coter un bid/ask sur une quantité inconnue, comme en entretien trading. Relie Entretiens, Finance et arcade | 🟢 | M | ✅ |
| ⭐ Trading Pit | Prix simulés, acheter/vendre au joystick, score = PnL ajusté du risque | 🟢 | S → M | ✅ |
| Démineur probabiliste | Affiche la probabilité de mine de chaque case | 🟢 | M | ✅ |
| 2048 + IA expectimax | L'IA joue à côté de toi | 🟢 | S | ✅ |

### 📈 Finance quant

| Projet | En deux mots | Calcul | Effort | Borne |
|---|---|---|---|---|
| ⭐ Simulateur de trajectoires | Mouvement brownien géométrique, Heston, sauts de Merton ; complète le pricer | 🟢 | S | ✅ |
| ⭐ Surface de volatilité 3D | Modèle SVI paramétrique en three.js (données réelles d'options : 🟡 et coûteuses) | 🟢 | M | ✅ |
| ⭐ Les pièges du backtest | Démos interactives : biais d'anticipation, du survivant, surapprentissage, Sharpe dégonflé | 🟢 / 🟡 | M | ❌ |
| ⭐ Carte du marché en réseau | Arbre couvrant minimal des corrélations (Mantegna) en 3D | 🟡 | M | ✅ |
| Optimiseur de portefeuille | Frontière efficiente, parité de risque, HRP | 🟡 | M | ❌ |
| VaR / CVaR et stress tests | Historique, paramétrique, Monte Carlo | 🟡 | M | ❌ |
| Courbe des taux | Ajustement Nelson-Siegel-Svensson sur données de la BCE | 🟡 | M | ❌ |
| Critère de Kelly & ruine | Pourquoi parier trop gros ruine même avec un avantage | 🟢 | S | ✅ |
| Bootstrap des drawdowns | Distribution des pires pertes d'une stratégie | 🟢 | S | ❌ |
| Exécution optimale | Almgren-Chriss, TWAP / VWAP | 🟢 | M | ⚠️ |

### 🎓 Entretiens

| Projet | En deux mots | Calcul | Effort | Borne |
|---|---|---|---|---|
| ⭐ Calcul mental chronométré | Format des tests de trading | 🟢 | S | ✅ |
| ⭐ Casse-têtes de probabilité | Monty Hall, anniversaires, dés… avec un simulateur qui vérifie la réponse | 🟢 | S | ✅ |
| Suites logiques | Tests numériques | 🟢 | S | ⚠️ |
| Estimations de Fermi | Ordres de grandeur, corrigé raisonné | 🟢 | S | ❌ |

### 🛰️ Données live

| Projet | En deux mots | Calcul | Effort | Borne | Visibilité |
|---|---|---|---|---|---|
| ⭐ Radar des avions en direct | Positions autour d'un aéroport via OpenSky. Clin d'œil évident au thème | 🔴 petit proxy avec cache | M | ✅ | 🔒 |
| Séismes sur globe | Flux GeoJSON public de l'USGS | 🟢 | S | ✅ | Public (une année figée) · 🔒 (live) |
| Satellites / Starlink | Généralise l'ISS : TLE + propagation dans le navigateur | 🟢 | M | ✅ | Public (TLE rafraîchi de temps en temps) |
| Wikipédia en direct | Les modifications du monde entier en temps réel | 🟢 | S | ✅ | 🔒 |

Pour le radar : OpenSky est réservé à un usage non commercial, l'accès anonyme est limité à 400 crédits par jour, et l'authentification se fait désormais par OAuth2. D'où le proxy : un seul appel toutes les N secondes, servi à tous les visiteurs, clé cachée côté serveur.

---

### ➕ Deuxième vague : 50 propositions

#### 📈 Finance, quant, trading (25)

**Dérivés**

| Projet | En deux mots | Calcul | Effort | Borne | Visibilité |
|---|---|---|---|---|---|
| Options américaines par Longstaff-Schwartz | Monte Carlo puis régression sur les trajectoires | 🟢 (Worker) | M | ⚠️ | Public |
| Calibration de Heston | Ajuster le modèle à une surface de volatilité figée | 🟢 (Worker) | M | ❌ | Public |
| Volatilité locale de Dupire | Extraite de la surface implicite, affichée en 3D | 🟢 | M | ⚠️ | Public |
| Greeks par différentiation automatique | AAD contre différences finies : précision et vitesse | 🟢 | M | ❌ | Public |
| Constructeur de stratégies d'options | Straddle, butterfly, iron condor : payoff et greeks agrégés | 🟢 | S | ⚠️ | Public |
| Simulateur de delta-hedging | PnL d'une couverture discrète, gamma scalping | 🟢 | S → M | ⚠️ | Public |
| Réplication du VIX / variance swap | À partir d'une série d'options figée | 🟡 + 🟢 | M | ❌ | Public |

**Taux & crédit**

| Projet | En deux mots | Calcul | Effort | Borne | Visibilité |
|---|---|---|---|---|---|
| Pricer d'obligations | Duration, convexité, immunisation d'un passif | 🟢 | S | ❌ | Public |
| Modèles de taux courts | Vasicek, CIR, Hull-White : trajectoires et zéro-coupons | 🟢 | S → M | ⚠️ | Public |
| ACP de la courbe des taux | Niveau, pente, courbure sur données BCE figées | 🟡 | S → M | ❌ | Public |
| Modèle de Merton | Probabilité de défaut tirée du bilan d'une entreprise | 🟢 | S | ❌ | Public |
| Copule gaussienne et CDO | Défauts corrélés et tranches, le modèle au cœur de 2008 | 🟢 | M | ❌ | Public |

**Stratégies & statistiques**

| Projet | En deux mots | Calcul | Effort | Borne | Visibilité |
|---|---|---|---|---|---|
| Arbitrage statistique par ACP | Résidus d'ACP et retour à la moyenne (Avellaneda-Lee) | 🟡 | L | ❌ | Public |
| Bêta dynamique par Kalman | Une exposition au marché qui évolue dans le temps | 🟡 + 🟢 | M | ❌ | Public |
| Event study | Rendements anormaux autour des publications de résultats | 🟡 | M | ❌ | Public |
| Exposant de Hurst | Retour à la moyenne ou tendance ? Brownien fractionnaire simulé + séries réelles | 🟢 + 🟡 | S → M | ❌ | Public |
| Théorie des valeurs extrêmes | Risque de queue : estimateur de Hill, dépassements de seuil | 🟡 | M | ❌ | Public |
| Portefeuilles factoriels | Value, quality, low vol et décomposition de leur performance | 🟡 | L | ❌ | Public |
| Valorisation DCF | Flux actualisés interactifs + Monte Carlo sur les hypothèses | 🟢 | S → M | ❌ | Public |

**Microstructure & crypto**

| Projet | En deux mots | Calcul | Effort | Borne | Visibilité |
|---|---|---|---|---|---|
| Modèle de Kyle | Un initié, du bruit, un market maker ; le joueur incarne l'initié | 🟢 | S → M | ✅ | Public |
| Déséquilibre du flux d'ordres | Prédicteur de court terme, testé sur le carnet simulé | 🟢 | M | ❌ | Public |
| Teneur de marché automatique (AMM) | Produit constant façon Uniswap : slippage, perte impermanente | 🟢 | S → M | ⚠️ | Public |

**Informatique financière**

| Projet | En deux mots | Calcul | Effort | Borne | Visibilité |
|---|---|---|---|---|---|
| Grand livre en partie double | Virements sans doublon même rejoués, rapprochement, piste d'audit | 🔴 (démo possible en 🟢 avec SQLite en WebAssembly) | M | ❌ | Public (bac à sable) |
| Protocole FIX | Parseur dans le navigateur, simulateur de session côté serveur | 🟢 · 🔴 | M | ❌ | Public |
| Moteur d'appariement en Rust | Réécrit en Rust, compilé en WebAssembly, latence mesurée | 🟢 | M → L | ❌ | Public |

#### 🛠️ Outils perso (15) — onglet 🔒 Outils

| Outil | En deux mots | Calcul | Effort | Visibilité |
|---|---|---|---|---|
| Coffre Obsidian | Synchro par Git (plugin Obsidian Git), lecture via Quartz, édition via le backend | 🟡 lecture · 🔴 édition | S → M | 🔒 |
| « Interroge mes notes » | Un LLM qui répond à partir du coffre Obsidian | 🔴 | L | 🔒 |
| Répétition espacée | Façon Anki, alimentée par tes notes et la banque d'entretiens | 🔴 (progression stockée) | M | 🔒 |
| Suivi des candidatures | Entreprises, contacts, relances, statut | 🔴 | M | 🔒 |
| Liens de suivi pour le CV | Savoir quel recruteur a ouvert quoi | 🔴 | S | 🔒 (le tableau) |
| Statistiques de visite maison | Sans cookies : projets les plus ouverts, temps passé | 🔴 | S → M | 🔒 |
| Générateur de CV et lettres | PDF depuis les mêmes JSON que le site | 🟡 | S | 🔒 (l'outil) |
| Devlog | Journal de bord des sessions, alimenté par tes commits | 🟡 | S | Public |
| Tableau de bord GitHub | Commits, PR, état des builds | 🔴 (jeton d'accès) | S | 🔒 |
| Panneau d'admin du backend | Logs, tâches planifiées, relance des pipelines de données | 🔴 | M | 🔒 |
| Veille | RSS, arXiv, SSRN, avec tags et notes | 🔴 | M | 🔒 |
| Snippets | Gestionnaire de bouts de code, recherche plein texte | 🔴 | S → M | 🔒 |
| Kanban du labo | Synchronisé avec les `meta.js` (idée, en cours, fini) | 🟡 lecture · 🔴 édition | S | Public en lecture · 🔒 édition |
| Suivi de patrimoine | Import CSV de la banque, catégories, allocation | 🔴 | M | 🔒 + chiffré |
| Partage de fichiers | Liens qui expirent | 🔴 | S → M | 🔒 |

Le suivi de patrimoine manipule tes données bancaires : c'est le plus sensible de tout le site. Chiffrer les données stockées, ou garder cet outil en local.

#### 🎲 Fun (10) — tous publics

| Projet | En deux mots | Onglet | Calcul | Effort | Borne |
|---|---|---|---|---|---|
| ⭐ Sugarscape | Société artificielle d'Epstein & Axtell : les inégalités émergent toutes seules | Simulations | 🟢 | M | ✅ |
| ⭐ Yard-sale model | Des échanges équitables, et pourtant la richesse se concentre | Simulations | 🟢 | S | ✅ |
| Dilemme du prisonnier | Tournoi d'Axelrod, puis version spatiale (Nowak & May) | Simulations | 🟢 | S → M | ✅ |
| Bar d'El Farol | Jeu de la minorité : deviner ce que fera la foule | Simulations | 🟢 | S | ⚠️ |
| Dynamique d'opinions | Modèle de Deffuant : consensus, polarisation, bulles | Simulations | 🟢 | S | ✅ |
| Contagion bancaire | Faillites en cascade sur un réseau de prêts interbancaires | Simulations | 🟢 | M | ⚠️ |
| Automates de Wolfram | Les 256 règles en une dimension, la 30 et la 110 | Simulations | 🟢 | S | ✅ |
| Wireworld | Des circuits logiques qui calculent dans un automate cellulaire | Simulations | 🟢 | S → M | ✅ |
| Coloration de domaine | Fonctions complexes en couleurs, zéros de zêta en bonus | Maths & génératif | 🟢 | S | ✅ |
| Bifurcation logistique | La route vers le chaos | Maths & génératif | 🟢 | S | ✅ |

---

## 5. État des lieux : ce qui est facile

### Rapide (S, 🟢, zéro backend)
Langton · Jeu de la vie (CPU) · ISS · fractales 2D · épicycles de Fourier · attracteurs · Galton · boids · Gray-Scott · tas de sable · Kelly · calcul mental · casse-têtes de probabilité · pricer Black-Scholes seul · simulateur de trajectoires · pricer d'obligations · constructeur de stratégies d'options · Merton · yard-sale model · automates de Wolfram · coloration de domaine · bifurcation logistique.
→ **De quoi remplir une page vivante en quelques semaines.**

### Moyen (M)
Schelling multi-facteurs · lignes de désir · Perudo solo · visualiseur musical · pricer complet · TPO · volatility clustering · neutralité aux facteurs · saisonnalité intraday · entretiens (QCM, quiz, code) · surface de volatilité · jeu du market maker · Sugarscape · delta-hedging · modèle de Kyle · DCF · Longstaff-Schwartz · Obsidian en lecture · suivi des candidatures.

### Gros chantiers (L / XL)
Carnet d'ordres + market making complet · pair trading propre · momentum par régime · Perudo en ligne · entretiens avec IA · arbitrage statistique par ACP · portefeuilles factoriels · « interroge mes notes » · signaux ML · Lab de trading IA.

### Les vrais goulots
1. **Les données de marché.** Avec des jeux de données figés, les quotas des offres gratuites ne gênent plus : on télécharge une fois. Reste la licence, qui interdit souvent de redistribuer les séries brutes → afficher des résultats agrégés, ou partir de sources ouvertes (Kenneth French, BCE, crypto). L'intraday reste le plus dur à trouver gratuitement.
2. **Le contenu.** Questions d'entretien et fiches de recherche prendront plus de temps que le code.
3. **Le serveur.** Perudo en ligne, LLM, données live, outils perso : un hébergement à part de Vercel.
4. **Les performances dans la scène 3D** (voir section 8).

---

## 6. Architecture commune (à poser avant le premier projet)

### Un contrat par projet
Chaque projet vit dans `src/lab/<id>/` avec une fiche d'identité et un module chargé à la demande.

```js
// src/lab/langton/meta.js
export default {
  id: 'langton',
  titre: 'Fourmi de Langton',
  onglet: 'simulations',
  tags: ['automate cellulaire', 'émergence'],
  statut: 'fini',          // 'fini' | 'wip' | 'idee'
  visibilite: 'public',    // 'public' | 'protege'
  calcul: 'navigateur',    // 'navigateur' | 'precalcul' | 'backend'
  arcade: 'jouable',       // 'jouable' | 'demo' | false
  vignette: '/lab/langton/vignette.webm',
}
```

```js
// src/lab/langton/index.js
export function mount(canvas, { mode }) {   // mode : 'page' | 'arcade'
  // ...
  return { pause, resume, input /* (bouton) */, unmount }
}
```

Le même module se monte dans la page ou sur l'écran de la borne. La page Lab se construit toute seule à partir des `meta.js`.

### Règles techniques
- **Chargement à la demande** (`import()` dynamique) : la page d'intro reste légère même avec 50 projets.
- **Vignettes en vidéo courte** (webm), lecture au survol. Ne jamais faire tourner 20 simulations en même temps dans la grille.
- **Web Workers** pour le calcul CPU lourd (Schelling, Monte Carlo, backtests en direct).
- **Pyodide et sql.js** chargés uniquement sur les pages d'exercices de code (plusieurs Mo).
- **Mobile** : les recruteurs ouvrent souvent le lien sur téléphone. Commandes tactiles, résolution réduite pour les shaders lourds.
- **Pipeline de données** : un dossier Python à part (`data/`) avec des scripts qui produisent des fichiers figés dans `public/data/`, lancés à la main. Sert tous les projets 🟡. Une tâche planifiée (GitHub Actions) seulement pour les rares fichiers à rafraîchir, comme le TLE de l'ISS.
- **Un seul backend, plus tard** : FastAPI (Python, la même langue que ton code quant) pour le proxy des API, le LLM, les WebSockets du Perudo, les outils perso et tout projet qui y bascule. Hébergé à part.

---

## 7. Projets protégés par mot de passe

### Le piège à éviter
Sur un site statique Vite, **un mot de passe vérifié en JavaScript ne protège rien** : le code et le mot de passe sont dans le bundle téléchargé par le visiteur. La protection doit se faire côté serveur.

### Options
1. **Recommandé : un déploiement séparé** (par exemple `labo.tondomaine.fr`) **derrière Cloudflare Access**, gratuit jusqu'à 50 utilisateurs. Connexion par code reçu par e-mail : tu ajoutes l'adresse d'un recruteur, il reçoit un code. Mieux qu'un mot de passe partagé, et tu sais qui a regardé. Nécessite un nom de domaine géré par Cloudflare.
2. **La protection intégrée de l'hébergeur** : chez Vercel, la protection par mot de passe des déploiements est une option payante, à vérifier le moment venu.
3. **Ton backend**, une fois en place : connexion → cookie de session ; les données privées ne sortent que de l'API.

### Règle de vitrine
Un projet protégé garde **toujours une carte publique** : description, captures ou GIF, stack, ce que tu as appris, et un bouton « Démo sur demande ». Un projet totalement caché ne sert à rien pour un recruteur.

### Ce que je classerais en protégé

| Projet | Pourquoi | Ce qui reste public |
|---|---|---|
| Lab de trading IA | Stratégies, coûts d'API, clés | Carte + architecture + captures |
| Signaux alpha ML | Des signaux qui marchent ne se publient pas | Méthodologie, garde-fous, résultats agrégés |
| Entretiens : correction par IA | Coût par requête, risque d'abus | QCM, quiz, code, calcul mental |
| Perudo en ligne | Serveur fragile pendant le WIP | Perudo contre les bots |
| Pair trading, régimes (données réelles) | Licence des données | Résultats, graphes, code |
| Radar des avions, Wikipédia en direct, séismes live | Règle : tout le live derrière mot de passe | Carte + captures (séismes : version figée publique) |
| **Onglet Outils** (Obsidian, candidatures, patrimoine…) | Données personnelles | Rien, sauf le devlog et le kanban en lecture |
| **Tout projet au statut `wip`** | Règle par défaut | Carte « en cours » |

---

## 8. Borne d'arcade

### Projets compatibles
Tous les ✅ des tableaux. Pour démarrer : Langton, Jeu de la vie, fractales, boids, attracteurs, Fourier, Galton, Trading Pit, jeu du market maker, calcul mental, Perudo solo.

### Attract mode
Comme les vraies bornes : quand personne ne joue, l'écran fait défiler des boucles de démo (Langton → Jeu de la vie → fractale → boids…). Le hall reste vivant même pour un visiteur qui ne s'approche pas. Et l'animation « interagir avec une borne » de la liste du personnage trouve ici sa place.

### Technique
- **Rendu dans une texture** : un projet en Canvas 2D → `CanvasTexture` ; un projet en shader → render target dans le renderer R3F existant.
- **Un seul contexte WebGL** : les navigateurs limitent le nombre de contextes simultanés (une quinzaine). Un projet qui crée le sien à chaque montage finira par faire perdre le contexte de la scène.
- **Résolution 256 à 512 px**, pause dès que la borne sort du champ ou que le joueur s'éloigne.
- **Entrées réduites** : joystick + 2 boutons, transmis par `input()` du contrat.

---

## 9. Ordre conseillé

| Phase | Contenu | But |
|---|---|---|
| **A — Fondations** | Contrat de projet, page Lab avec onglets et cartes, chargement à la demande, gabarit de fiche. Langton de bout en bout, y compris un prototype sur la borne. | Valider la chaîne une fois, avec le projet le plus simple |
| **B — Victoires rapides** | Jeu de la vie, fractales, ISS, Fourier, attracteurs, boids | Une page déjà vivante pour les recruteurs |
| **C — Finance sans données** | Pricer complet, trajectoires, carnet d'ordres + market making, calcul mental, jeu du market maker | Crédibilité quant sans dépendre d'un fournisseur |
| **D — Pipeline de données** | Scripts Python + tâche planifiée, puis volatility clustering, neutralité aux facteurs, saisonnalité, TPO, pair trading, pièges du backtest | Débloquer tous les projets 🟡 |
| **E — Simulations riches** | Schelling multi-facteurs, lignes de désir + foule d'aéroport, Perudo solo, visualiseur musical | Les pièces signature |
| **F — Serveur** | Backend FastAPI, protection, Perudo en ligne, correction IA des entretiens, radar des avions | Le temps réel |
| **G — Le gros morceau** | Signaux ML, puis Lab de trading IA | Assembler les briques des phases C et D |

**Piste parallèle — Outils perso** : Obsidian en lecture (Quartz derrière Cloudflare Access) dès que le nom de domaine est en place, sans attendre le backend ; le reste des outils arrive avec la phase F.

Le classement ci-dessous entrelace les phases B et C, pour avoir de la finance à montrer très tôt.

---

## 10. Classement

Classement arbitraire, pondéré par quatre critères : l'intérêt pour un recruteur en finance, l'effort (les victoires rapides d'abord), les briques réutilisées ensuite, et tes envies (à valeur égale, tes projets passent devant les miens). Les projets qui exigent le backend ferment la marche. Les fiches de recherche s'écrivent au fil de l'eau, et la zone d'animations mathématiques regroupe les petites pièces de maths classées une par une.

### Vitrine (106 projets)

#### Palier 1 — D'abord (1–15)

| Rang | Projet                               | Effort | Pourquoi ici |
|---|--------------------------------------|---|---|
| 1 | ~~Fourmi de Langton~~                | S | Pose le contrat, la page et la borne avec le projet le plus simple |
| 2 | ~~Jeu de la vie + variantes~~        | S → M | Réutilise toute la chaîne de Langton |
| 3 | ~~Générateur de fractales~~          | S → M | Premier shader, effet immédiat |
| 4 | Pricer d'options + greeks            | M | Le projet quant de référence |
| 5 | Calcul mental chronométré            | S | Format des tests de trading, parfait sur la borne |
| 6 | Casse-têtes de probabilité           | S | Montre le raisonnement probabiliste |
| 7 | Simulateur de trajectoires           | S | Complète le pricer, très visuel |
| 8 | Épicycles de Fourier                 | S | Interactif et spectaculaire |
| 9 | Attracteurs étranges                 | S | Nourrit l'attract mode de la borne |
| 10 | ISS Live Tracker                     | S | Premier projet de données, globe 3D |
| 11 | ~~Boids~~                            | S | Base de la future foule d'aéroport |
| 12 | Planche de Galton                    | S | Pont vers l'arbre binomial du pricer |
| 13 | Constructeur de stratégies d'options | S | Prolonge le pricer à peu de frais |
| 14 | Jeu du market maker                  | M | Relie entretiens, finance et arcade |
| 15 | Carnet d'ordres + market making      | L | La pièce maîtresse en microstructure |

#### Palier 2 — Le cœur de la vitrine (16–40)

| Rang | Projet                                | Effort | Pourquoi ici |
|---|---------------------------------------|---|---|
| 16 | Perudo contre des bots                | M | Ton projet, et un pont vers les probabilités |
| 17 | ~~Schelling multi-facteurs~~          | M | Pièce signature sur l'émergence |
| 18 | ~~Lignes de désir~~                   | M | Se branche sur l'aéroport |
| 19 | Entretiens finance (QCM, quiz, code)  | L | Contenu long : à commencer tôt, utile pour toi autant que pour la vitrine |
| 20 | Simulateur de delta-hedging           | S → M | La couverture, cœur du métier d'options |
| 21 | Trading Pit                           | S → M | Jeu de borne qui parle finance |
| 22 | Visualiseur musical                   | M | Spectaculaire, change de registre |
| 23 | Les pièges du backtest                | M | Ce qui distingue un candidat sérieux |
| 24 | Volatility clustering                 | M | Premier projet sur données figées |
| 25 | Neutralité aux facteurs               | M | Facteurs gratuits, méthode classique |
| 26 | Market Profile / TPO                  | M | Visuel original |
| 27 | Backtester de pair trading            | L | Grand classique des entretiens quant |
| 28 | Surface de volatilité 3D              | M | La vitrine three.js de la finance |
| 29 | Pricer d'obligations                  | S | Ouvre le chapitre des taux |
| 30 | Modèles de taux courts                | S → M | Suite logique des obligations |
| 31 | Sugarscape                            | M | Inégalités émergentes, très parlant |
| 32 | Yard-sale model                       | S | Résultat contre-intuitif en une soirée |
| 33 | Dilemme du prisonnier spatial         | S → M | Beau visuel, théorie des jeux |
| 34 | Tas de sable abélien                  | S | Métaphore des krachs |
| 35 | Modèle de Kyle                        | S → M | Microstructure jouable sur la borne |
| 36 | Valorisation DCF + Monte Carlo        | S → M | Parle aussi aux profils corporate finance |
| 37 | Critère de Kelly & ruine              | S | Court et marquant |
| 38 | Foule d'aéroport                      | M | Réutilise boids et lignes de désir |
| 39 | Pathfinding sur le plan de l'aéroport | S | Clin d'œil au jeu |
| 40 | Carte du marché en réseau             | M | Graphe 3D des corrélations |

#### Palier 3 — Approfondissements (41–75)

| Rang | Projet | Effort |
|---|---|---|
| 41 | Options américaines par Longstaff-Schwartz | M |
| 42 | Greeks par différentiation automatique | M |
| 43 | Calibration de Heston | M |
| 44 | Volatilité locale de Dupire | M |
| 45 | Carte de saisonnalité intraday | M |
| 46 | Momentum dépendant du régime | L |
| 47 | ACP de la courbe des taux | S → M |
| 48 | Courbe des taux Nelson-Siegel-Svensson | M |
| 49 | Modèle de Merton | S |
| 50 | Copule gaussienne et CDO | M |
| 51 | VaR / CVaR et stress tests | M |
| 52 | Optimiseur de portefeuille | M |
| 53 | Bêta dynamique par Kalman | M |
| 54 | Event study | M |
| 55 | Théorie des valeurs extrêmes | M |
| 56 | Exposant de Hurst | S → M |
| 57 | Teneur de marché automatique (AMM) | S → M |
| 58 | Déséquilibre du flux d'ordres | M |
| 59 | Exécution optimale | M |
| 60 | Bootstrap des drawdowns | S |
| 61 | Réplication du VIX / variance swap | M |
| 62 | Grand livre en partie double | M |
| 63 | Moteur d'appariement en Rust | M → L |
| 64 | Protocole FIX | M |
| 65 | Contagion bancaire | M |
| 66 | Marché artificiel multi-agents | L |
| 67 | Dynamique d'opinions | S |
| 68 | Bar d'El Farol | S |
| 69 | Automates de Wolfram | S |
| 70 | Wireworld | S → M |
| 71 | Réaction-diffusion (Gray-Scott) | S |
| 72 | Physarum | M |
| 73 | Modèle d'Ising | S |
| 74 | Coloration de domaine | S |
| 75 | Bifurcation logistique | S |

#### Palier 4 — Bonus et gros chantiers (76–106)

| Rang | Projet | Effort |
|---|---|---|
| 76 | Mandelbulb 3D | M |
| 77 | Fluides (Stable Fluids) | M |
| 78 | Proies-prédateurs | S → M |
| 79 | Trafic de Nagel-Schreckenberg | S |
| 80 | Feux de forêt / percolation | S |
| 81 | Double pendule | S |
| 82 | Démineur probabiliste | M |
| 83 | Algorithme génétique | M |
| 84 | Reconnaissance de chiffres | M |
| 85 | Voyageur de commerce | M |
| 86 | Labyrinthes | S |
| 87 | Tris sonifiés | S |
| 88 | 2048 + IA expectimax | S |
| 89 | π par Monte Carlo / aiguille de Buffon | S |
| 90 | Harmonographe / Lissajous | S |
| 91 | L-systems | S |
| 92 | Tesseract 4D | S |
| 93 | Spirale d'Ulam | S |
| 94 | Pavages de Penrose | M |
| 95 | Suites logiques | S |
| 96 | Estimations de Fermi | S |
| 97 | Séismes sur globe | S |
| 98 | Satellites / Starlink | M |
| 99 | Wikipédia en direct | S |
| 100 | Portefeuilles factoriels | L |
| 101 | Arbitrage statistique par ACP | L |
| 102 | Perudo en ligne | L |
| 103 | Radar des avions en direct | M |
| 104 | Entretiens : correction par IA | L |
| 105 | Signaux alpha par machine learning | XL |
| 106 | Lab de trading IA | XL |

### Outils perso (🔒)

| Rang | Outil | Effort | Pourquoi ici |
|---|---|---|---|
| 1 | Coffre Obsidian en lecture | S | Aucun backend nécessaire (Quartz + Cloudflare Access) |
| 2 | Générateur de CV et lettres | S | Mêmes JSON que le site |
| 3 | Devlog | S | Public, visible par les recruteurs |
| 4 | Kanban du labo | S | Lit les fiches `meta.js` |
| 5 | Suivi des candidatures | M | Premier outil avec backend |
| 6 | Liens de suivi pour le CV | S | Se branche sur le suivi des candidatures |
| 7 | Statistiques de visite maison | S → M | Savoir ce que regardent les recruteurs |
| 8 | Répétition espacée | M | Branchée sur la banque d'entretiens |
| 9 | Veille (RSS, arXiv, SSRN) | M | |
| 10 | Snippets | S → M | |
| 11 | Tableau de bord GitHub | S | |
| 12 | Panneau d'admin du backend | M | Utile dès que plusieurs services tournent |
| 13 | Partage de fichiers | S → M | |
| 14 | « Interroge mes notes » | L | Demande un LLM |
| 15 | Suivi de patrimoine | M | Le plus sensible : en dernier, et chiffré |

---

## 11. Questions ouvertes

1. **Lignes de désir** : simulation d'agents (les sentiers émergent dans l'herbe) ou analyse de vraies traces (GPS, plans OpenStreetMap) ?
2. **Schelling multi-facteurs** : quels facteurs as-tu en tête ? Grille abstraite ou carte d'une vraie ville ?
3. **Données de marché** : actions US, européennes, crypto ? Pour l'intraday figé (TPO, saisonnalité), la crypto est la source gratuite la plus simple.
4. **Agent IA « en local »** : pour toi seulement, ou aussi pour les visiteurs du site ?
5. **Perudo** : règles exactes (paco, palifico), nombre de joueurs, salons par code ou comptes ?
6. **Langue du site** : français, anglais, ou les deux ? Les recruteurs en finance sont souvent internationaux.
7. **Nom de domaine** : déjà réservé ? Nécessaire pour Cloudflare Access.
8. **Ton projet `pfolio`** (le financier) : contient-il déjà du code réutilisable (téléchargement de données, backtest) pour la phase D ?
9. **Obsidian** : lecture seule depuis le site, ou aussi écriture ? L'écriture demande le backend.

---

## Sources

- [wheretheiss.at — documentation de l'API](https://wheretheiss.at/w/developer)
- [OpenSky Network — bibliothèques officielles et authentification](https://github.com/openskynetwork/opensky-api)
- [Cloudflare Access — offres](https://www.cloudflare.com/en-au/products/cloudflare-access)
- [Comparatif d'API de données boursières 2026 (apilayer)](https://blog.apilayer.com/?p=22092)
- [Kenneth French Data Library](https://mba.tuck.dartmouth.edu/pages/faculty/ken.french/data_library.html)
- Le lien Instagram n'est pas lisible automatiquement ; la partie TPO s'appuie sur le texte que tu as collé.
