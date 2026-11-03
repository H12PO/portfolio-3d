# CLAUDE.md — Portfolio d'Hippolyte : le labo de projets

Ce fichier sert à reprendre le travail dans une nouvelle session. À lire en entier avant de toucher au code.

## 1. Le projet en deux mots

Portfolio « ultra créatif » d'Hippolyte (profil finance quantitative). Une scène 3D (aéroport, R3F) et un site vitrine qui contient le **labo** : une page `/projets` qui présente des petits projets de code (simulations, maths, finance, jeux). Chaque projet a une page complète : un explorateur interactif plus des onglets de lecture riches (Comprendre, Théorie, Applications, Calcul, Histoire). Les plus visuels tournent aussi sur une borne d'arcade dans le hall.

Stack : Vite 8 · React 19 · react-router 8 · three.js 0.18x · R3F 9 · drei 10 · Zustand · KaTeX · polices IBM Plex Sans/Mono et STIX Two Text. Pas de backend pour l'instant : tout tourne dans le navigateur.

Documents de référence dans le Projet claude.ai « Portfolio Code » (à lire avec l'outil Projects) :
- `claude/labo-projets-feuille-de-route.md` : la feuille de route complète et le classement des 106 projets. **Ne jamais la modifier sans demander.**
- un `claude/<projet>-plan.md` par projet fini : les choix, le moteur, les fichiers, les chiffres mesurés et les sources.

## 2. Règles de travail (demandées par Hippolyte)

- **Langue** : répondre en français simple, phrases courtes, pas de ton « trop IA ». Les textes du site sont en FR et en EN (anglais britannique : *aeroplane*, *recognise*).
- **Choix par QCM** : au début de chaque projet, poser un QCM (outil AskUserQuestion, option recommandée en premier) sur les formes ou scénarios, le rendu (2D, 3D, les deux), les réglages et la théorie. Hippolyte aime ce format.
- **Livraison** : jusqu'à 4 fichiers, les envoyer un par un ; au-delà, un zip qui garde l'arborescence `src/lab/<id>/…`. Hippolyte intègre les fichiers lui-même et renvoie des captures d'écran avec ses retours.
- **Pas de test dans un navigateur de mon côté** (« juste les fichiers et je te fais des retours ») : seulement lint, build, rendu serveur (SSR) et tests Node.
- **Fin de projet** : écrire `claude/<id>-plan.md` dans le Projet, dans le même format que les autres.
- **Feuille de route** : ne pas la modifier sans demander.
- **Schelling** : ne jamais remettre de bandeau ni de visite guidée dans l'explorateur, et pas de carte de vraie ville.
- **Physarum** : sera un projet à part, plus tard.
- **Vérifier les faits** : tout chiffre cité dans les textes est soit mesuré avec le moteur du projet (script Node), soit vérifié sur le web, avec la source citée. Si un fait n'est pas vérifié, ne pas l'affirmer.
- **Théorie** : Hippolyte veut une théorie poussée, avec des preuves en encadrés repliables et des notes « Pour les experts », mais une lecture principale qui reste accessible.

## 3. Où en est-on (3 nov. 2026)

| Rang | Projet | Dossier | État |
|---|---|---|---|
| 1 | Fourmi de Langton | `langton/` | fini |
| 2 | Jeu de la vie + variantes (HashLife…) | `jeu-de-la-vie/` | fini |
| 2 bis | Lenia | `lenia/` | fini |
| 3 | Générateur de fractales (shaders) | `fractales/` | fini |
| 17 | Schelling multi-facteurs | `schelling/` | fini |
| 11 | Boids (avec Couzin, Cucker-Smale) | `boids/` | fini, corrigé après retours (5 000 oiseaux au maximum, vue de Couzin, images des fiches précalculées) |
| 18 | Lignes de désir | `lignes-de-desir/` | fini, validé (« rien à redire ») |
| 8 | Épicycles de Fourier | `fourier/` | fini ; graphiques de l'explorateur et boutons des formes corrigés le 3 nov. Validé pour le reste |

**Prochain projet : Attracteurs étranges (rang 9, domaine `maths`).** Hippolyte l'a choisi le 3 nov. Commencer par le QCM. Pistes à proposer :
- **Attracteurs** : Lorenz, Rössler, Thomas, Aizawa, Hénon (application), Clifford, De Jong (cartes 2D à des millions de points), double pendule en clin d'œil.
- **Rendu** : 3D (particules, traînées) et cartes 2D en densité, sur GPU.
- **Réglages** : paramètres, condition initiale et sensibilité (deux trajectoires à ε près), nombre de points.
- **Théorie** (à vérifier sur le web avant d'écrire) : flots et applications, points fixes et stabilité, bifurcations, exposants de Lyapunov, dimension fractale (corrélation, Kaplan-Yorke), section de Poincaré, Lorenz 1963, Ruelle-Takens 1971 (le terme « attracteur étrange »), Hénon 1976, Rössler 1976, la preuve assistée par ordinateur de Tucker (2002) pour Lorenz, le fer à cheval de Smale.

Les projets suivants du classement, pour plus tard : Pricer d'options (4), Calcul mental (5), Casse-têtes de probabilité (6), Simulateur de trajectoires (7), ISS (10), Planche de Galton (12)… Aucun projet finance n'est encore fait.

## 4. Architecture du labo

```
src/site/            site vitrine : SiteHeader, textes.js (useTexte → { lang }), theme.js (useTheme), site.css (jetons de couleur)
src/lab/
  registre.js        trouve tout seul les projets (import.meta.glob sur */meta.js, */index.js, */page.jsx)
  LabPage.jsx        /projets : la grille par domaine
  ProjectPage.jsx    /projets/:id : page.jsx s'il existe, sinon canvas simple via mount()
  BarreProjet.jsx    barre du haut : retour, titre, onglets
  BarreEtat.jsx      barre d'état du bas : statut, mesures, valeur à droite
  Apercu.jsx
  commun/
    Lecture.jsx      Article (sommaire + sections) et Bloc (rendu des blocs de texte, KaTeX)
    lecture.css      styles des onglets de lecture (chargés à la demande avec eux)
    atelier.css      styles de l'explorateur : .atelier, .plan, .groupe, .inspecteur, .bloc, .btn…
    Graphique.jsx    courbes SVG des onglets de lecture (styles dans lecture.css)
    graphes.js       useLargeur(defaut) : largeur réelle d'un SVG (ResizeObserver)
    Crans.jsx, gestes.js, camera.js, gpu.js, aleatoire.js
  <id>/              un dossier par projet
```

Domaines (dans `registre.js`) : `simulations`, `maths`, `algos`, `finance`, `jeux`, `entretiens`, `live`.

### Fichiers d'un projet riche (modèle : `fourier/` ou `lignes-de-desir/`)

| Fichier | Rôle |
|---|---|
| `meta.js` | fiche : `titre {fr,en}`, `resume {fr,en}`, `domaine`, `rang`, `statut` ('fini'/'wip'/'idee'), `techno`, `annee`, `visibilite`, `calcul`, `arcade` ('jouable'/'demo'/false) |
| `index.js` | `mount(canvas)` → `{ pause, resume, input(bouton 'A'/'B'), unmount }` pour la borne ; `apercu(canvas)` = image fixe de la page Projets |
| `page.jsx` | la page : `VUES = ['simulation','comprendre','theorie','applications','calcul','histoire']`, onglet rangé dans l'URL (`?vue=theorie`). L'Atelier reste monté quand on lit. Les onglets de lecture sont chargés en `lazy(() => import('./Lecture'))`. `ctx = { T, theme, lang, fmt, ouvrir }` avec `fmt = (n, o) => n.toLocaleString(T.nombre, o)` |
| `Atelier.jsx` | l'explorateur : canvas + inspecteur (réglages, en plis) + barre de lecture + BarreEtat. Expose `ouvrir(idScenario)` par ref |
| `moteur.js` | le calcul pur, testable en Node |
| `scenarios.js` | les scénarios ou formes (réglages de départ) |
| `rendu2d.js`, `rendu3d.js` | dessin Canvas 2D ; 3D three.js chargé seulement à la demande |
| `hote.js`, `travail.js`, `simulateur.js` | calcul lourd dans un Web Worker (hôte commun, worker, repli sur le fil principal), voir `boids/` |
| `Lecture.jsx` | branche les figures et les fiches sur `commun/Lecture.jsx` via `ctx.special(bloc)` |
| `figures.jsx` | figures interactives des onglets, exportées sous la forme `FigureXxx({ txt, T, fmt })`, avec `txt = T.figures.xxx` |
| `fiches.jsx` | fiches des scénarios (onglet Comprendre) : question, règles, images, « à regarder », pourquoi, pour aller plus loin, bouton « Ouvrir dans l'explorateur » |
| `fiches-images.js` | images des fiches **précalculées** (deflate + base64, décompressées avec DecompressionStream, chargées à la demande) quand les calculer dans la page prend plus d'un instant |
| `textes.js` | `TEXTES = { fr: { ...LECTURE_FR, nombre: 'fr-FR', expert, sommaire, vues, …UI… }, en: { ...LECTURE_EN, nombre: 'en-GB', … } }` |
| `lecture-fr.js`, `lecture-en.js` | les articles : `{ comprendre, theorie, applications, calcul, histoire, figures: {…}, fiche: {…}, fiches: {…} }` ; même structure exacte en FR et en EN |
| `<prefixe>.css` | styles propres, tous préfixés (`fo-` pour Fourier, `ld-` pour Lignes de désir…) |

### Blocs des articles (`commun/Lecture.jsx`)
Une section = `{ id, titre, blocs: [...] }`. Les blocs possibles :
- `{ p }` : paragraphe ;
- `{ liste: [...] }` ;
- `{ tex, etroit? }` : formule centrée, avec une variante sur plusieurs lignes pour mobile ;
- `{ preuve, source, paragraphes }` : preuve repliable ;
- `{ expert, blocs }` : encadré « Pour les experts » ;
- `{ frise: [[date, qui, quoi]] }` ;
- `{ refs: [[texte, url?]] }` ;
- `{ figure: 'id' }` et `{ fiche: 'id' }` : propres au projet ;
- `{ ouvrir, libelle, aide }`.

Dans le texte, `*italique*` et `$LaTeX$`. Les formules sont écrites avec `const tex = String.raw` et des gabarits `` tex`…` ``.

### Conventions visuelles
- Canvas sombre (`FOND = '#0b0d12'`).
- Jetons CSS : `--sig`, `--sig-doux`, `--serie-2`, `--texte`, `--discret`, `--trait`, `--surface`, `--champ`, `--survol`, `--sans`, `--mono`.
- Couleurs secondaires lisibles par les daltoniens : `#E69F00`, `#CC79A7`, `#56B4E9`.
- Boutons de scénarios en grille de 2 colonnes : titre au-dessus, petite étiquette en mono en dessous (pas côte à côte, sinon ça déborde).

## 5. Leçons apprises (bugs à ne pas refaire)

- **`commun/Graphique.jsx` dépend de `lecture.css`**, qui n'est chargé qu'avec les onglets de lecture. Dans l'explorateur, il s'affiche cassé : légende en puces, zone noire, bulle de survol qui décale la page. Dans l'Atelier, utiliser des graphiques SVG autonomes avec leurs propres classes (modèle : `fourier/Spectre.jsx`, avec une bulle en position absolue calée près des bords et `memo` pour ne pas recalculer à chaque image).
- **ESLint react-refresh** : un fichier qui exporte des composants ne doit exporter que des composants. Garder les constantes non exportées, ou les mettre dans un fichier `.js`.
- **Images des fiches** : si leur calcul dure plus de quelques dizaines de millisecondes, les précalculer (Hippolyte n'aime pas les images qui mettent des secondes à apparaître).
- **Pluriels avec `fmt`** : `` `${n} cercle${n === '1' ? '' : 's'}` `` (n est déjà une chaîne formatée).
- **Mesurer avant d'écrire** : sur Fourier, trois affirmations étaient fausses avant la vérification (infini avec 2 cercles = un segment, carré avec 2 cercles = un cercle, Koch divisé « à peu près » et non « exactement » par 4).
- **Plafonds de performance** : Boids est plafonné à 5 000 oiseaux, sinon ça rame.
- **Après des réglages qui changent le modèle** : relancer la simulation (cas de Cucker-Smale), sinon le visiteur ne voit pas l'effet.

## 6. Vérifications avant chaque livraison

Dans un espace de test qui contient `package.json`, `vite.config.js`, `eslint.config.js`, `src/site` et `src/lab` :

1. `npx eslint src/lab/<id>`
2. `npx vite build`
3. Tests Node du moteur (chiffres cités dans les textes, vitesse).
4. SSR de chaque onglet en FR et en EN, en cherchant les erreurs KaTeX et les `*…*` non convertis :

```js
// ssr-<id>.mjs
import { createServer } from 'vite'
const v = await createServer({ server: { middlewareMode: true }, appType: 'custom', logLevel: 'error' })
try {
  const { renderToString } = await import('react-dom/server')
  const React = await import('react')
  const L = await v.ssrLoadModule('/src/lab/<id>/Lecture.jsx')
  const { TEXTES } = await v.ssrLoadModule('/src/lab/<id>/textes.js')
  for (const lang of ['fr', 'en']) {
    const T = TEXTES[lang]
    const ctx = { T, theme: 'clair', lang, fmt: (n, o) => n.toLocaleString(T.nombre, o), onVisite() {}, ouvrir() {} }
    for (const o of ['Comprendre', 'Theorie', 'Applications', 'Calcul', 'Histoire']) {
      const html = renderToString(React.createElement(L[o], { ctx }))
      const err = html.match(/katex-error[^>]*title="[^"]*"/g) || []
      const etoiles = html.replace(/<[^>]+>/g, '').match(/\*[^*\s][^*]{0,40}\*/g) || []
      console.log(lang, o, html.length, 'katex', err.length, etoiles.slice(0, 3).join(' '))
    }
  }
} finally { await v.close() }
```

5. SSR de l'Atelier : `renderToString(<Atelier visible T={TEXTES[lang]} />)`.
6. Comparaison de structure FR/EN : mêmes clés, mêmes longueurs de tableaux, mêmes arités de fonctions, mêmes `id`/`figure`/`fiche`, et aucune chaîne vide. Les clés `fiche` et `ouvrir` donnent de faux positifs quand `fiche` est aussi un objet de textes.
7. Typographie française sur `lecture-fr.js` (à partir de `export const LECTURE_FR`) et sur le bloc `fr` de `textes.js` (entre `  fr: {` et `  en: {`), avec le script ci-dessous.

```python
# typo_lib.py : traiter(chemin, debut, fin=None)
# Espaces insécables avant : ; ? !, dans « », dans les nombres. Ne touche jamais au LaTeX.
import re
NBSP, NNBSP = chr(0xA0), chr(0x202F)
ESC_NB, ESC_NNB = '\\' + 'u00a0', '\\' + 'u202f'
def texte(t, nb, nnb):
    t = re.sub(r'(\d) (\d{3})(?!\d)', lambda k: k.group(1) + nnb + k.group(2), t)
    t = t.replace('« ', '«' + nb).replace(' »', nb + '»')
    t = re.sub(r'(\d) %', lambda k: k.group(1) + nnb + '%', t)
    t = re.sub(r' ([:;?!])', lambda k: (nb if k.group(1) == ':' else nnb) + k.group(1), t)
    return t
def chaine_simple(m):
    morceaux = re.split(r'(\$[^$]+\$)', m.group(0))
    return ''.join(x if x.startswith('$') and x.endswith('$') and len(x) > 2 else texte(x, NBSP, NNBSP) for x in morceaux)
def chaine_gabarit(m):
    morceaux = re.split(r'(\$\{[^}]*\})', m.group(0))
    return ''.join(x if x.startswith('${') else texte(x, ESC_NB, ESC_NNB) for x in morceaux)
def traiter(chemin, debut, fin=None):
    s = open(chemin, encoding='utf-8').read()
    i = s.index(debut); j = s.index(fin) if fin else len(s)
    bloc = s[i:j]; gardes = []
    def garder(m):
        gardes.append(m.group(0)); return f'\x00{len(gardes) - 1}\x00'
    bloc = re.sub(r"tex`(?:[^`\\]|\\.)*`", garder, bloc)
    bloc = re.sub(r"'(?:[^'\\\n]|\\.)*'", chaine_simple, bloc)
    bloc = re.sub(r"`(?:[^`\\]|\\.)*`", chaine_gabarit, bloc)
    bloc = re.sub(r"`(?:[^`\\]|\\.)*`", lambda m: m.group(0).replace(NBSP, ESC_NB).replace(NNBSP, ESC_NNB), bloc)
    bloc = re.sub(r'\x00(\d+)\x00', lambda m: gardes[int(m.group(1))], bloc)
    open(chemin, 'w', encoding='utf-8').write(s[:i] + bloc + s[j:])
```

## 7. Déroulé type d'un projet

1. QCM des choix, puis une phrase qui dit ce qui va être fait.
2. Liste de tâches (moteur, scénarios, rendu 2D/3D, Atelier, figures, fiches, textes FR, textes EN, vérifications, livraison).
3. Moteur, testé en Node. Mesurer les chiffres qui iront dans les textes.
4. Scénarios, rendu, Atelier, `index.js` (borne + aperçu), `meta.js`.
5. Figures et fiches, puis `lecture-fr.js` (théorie poussée, preuves, encadrés experts, frise, références vérifiées), puis `lecture-en.js` avec exactement la même structure.
6. Typographie, vérifications (section 6), zip, `claude/<id>-plan.md`.
7. Message final court, en français simple, avec la liste des sources.
