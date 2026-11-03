# Schelling : préparer de vraies villes

Ce script télécharge une ville sur OpenStreetMap et les revenus de l'Insee,
puis écrit un petit fichier que l'explorateur de Schelling lit tel quel
(terrain « Vraie ville »). On le lance une fois par ville, depuis son ordinateur.

## 1. Installer (une seule fois)

Ubuntu (ou WSL) :

```bash
sudo apt install python3-venv
cd data/schelling
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

macOS : pareil, sans la ligne `apt`. Windows : `python -m venv .venv`, puis `.venv\Scripts\activate`.

Dans un nouveau terminal, il suffit de refaire `source .venv/bin/activate` dans `data/schelling`.

## 2. Préparer des villes

```bash
python villes.py --exemples                      # Lyon, Paris et Aix-en-Provence
python villes.py "Nantes, France" --id nantes     # n'importe quelle commune
```

- Chaque ville écrit `public/data/schelling/<id>.json` et s'ajoute à `public/data/schelling/villes.json`.
- La ville est découpée en tuiles d'environ 8 km² (au plus 9 pour Lyon, 16 pour Paris, 25 pour Aix-en-Provence ;
  les tuiles hors de la commune sont sautées). Chaque tuile affiche
  le temps écoulé pendant qu'elle se télécharge : un serveur peut mettre une ou deux minutes à répondre.
- On peut arrêter à tout moment (Ctrl+C) : en relançant, les tuiles déjà reçues ne sont pas redemandées.
- Le fichier de l'Insee (≈ 90 Mo) se télécharge une seule fois. Tout est gardé dans `cache/`.
- Pour une ville hors de France : ajouter `--sans-insee` (pas de revenus réels).
- `--taille 128` règle le côté de la grille (128 par défaut, une case fait alors 80 à 160 m selon la ville).
  Pour une petite commune, `--taille 64` garde des cases d'une centaine de mètres.

## 3. Si OpenStreetMap ne répond pas

Les serveurs publics d'OpenStreetMap (Overpass) sont très chargés depuis 2026. Le script s'y prend
comme ils le demandent : il se présente par le nom du projet, envoie des requêtes légères, une à la fois,
et attend avant de réessayer. Si un serveur refuse, il passe au suivant (trois serveurs) ; si une tuile est
trop lourde, il la coupe en quatre.

- Les serveurs aiment qu'on laisse un contact : `--contact ton@email.fr` (ou l'adresse de ton site).
- Pour commencer par un autre serveur : `--serveur https://overpass.private.coffee/api/interpreter`.
- En dernier recours, à la main : chaque tuile a sa requête dans `cache/osm/<id>/<nom>.overpassql`.
  La coller sur https://overpass-turbo.eu, lancer, puis Exporter → les données brutes (« raw OSM data »), et enregistrer
  le fichier sous `cache/osm/<id>/<nom>.osm` (même nom). Le script s'en servira au prochain passage.

## 4. Publier

Ajouter les fichiers de `public/data/schelling/` au dépôt. Les dossiers `cache/` et `.venv/` restent en local (ils sont ignorés).

## Licences

Les fichiers produits sont des bases dérivées :

- d'OpenStreetMap : © les contributeurs d'OpenStreetMap, licence ODbL (https://www.openstreetmap.org/copyright) ;
- de l'Insee, Filosofi 2021, données carroyées à 200 m : Licence Ouverte (https://www.insee.fr/fr/statistiques/8735162).

L'explorateur affiche ces deux mentions sous la carte.