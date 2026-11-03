# Schelling : préparer de vraies villes

Ce script télécharge une ville sur OpenStreetMap et les revenus de l'Insee,
puis écrit un petit fichier que l'explorateur de Schelling lit tel quel
(terrain « Vraie ville »). On le lance une fois par ville, depuis son ordinateur.

## 1. Installer (une seule fois)

Depuis la racine du projet :

```bash
cd data/schelling
python -m venv .venv
# Windows : .venv\Scripts\activate    macOS / Linux : source .venv/bin/activate
pip install -r requirements.txt
```

## 2. Préparer des villes

```bash
python villes.py --exemples                      # Paris, Lyon et Marseille
python villes.py "Nantes, France" --id nantes     # n'importe quelle commune
```

- Chaque ville écrit `public/data/schelling/<id>.json` et s'ajoute à `public/data/schelling/villes.json`.
- Le premier passage est long : le fichier de l'Insee (≈ 90 Mo) se télécharge une fois, et OpenStreetMap
  envoie des dizaines de milliers de bâtiments (plusieurs minutes pour Paris). Tout est gardé dans `cache/`,
  les passages suivants sont rapides.
- Si le serveur d'OpenStreetMap est occupé, le script attend 30 s et réessaie, trois fois.
- Pour une ville hors de France : ajouter `--sans-insee` (pas de revenus réels).
- `--taille 128` règle le côté de la grille (128 par défaut, une case fait alors 80 à 160 m selon la ville).

## 3. Publier

Ajouter les fichiers de `public/data/schelling/` au dépôt. Le dossier `cache/` reste en local (il est ignoré).

## Licences

Les fichiers produits sont des bases dérivées :

- d'OpenStreetMap : © les contributeurs d'OpenStreetMap, licence ODbL (https://www.openstreetmap.org/copyright) ;
- de l'Insee, Filosofi 2021, données carroyées à 200 m : Licence Ouverte (https://www.insee.fr/fr/statistiques/8735162).

L'explorateur affiche ces deux mentions sous la carte.
