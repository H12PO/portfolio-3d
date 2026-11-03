"""
SCHELLING : préparer une vraie ville pour l'explorateur
=======================================================

Télécharge une ville sur OpenStreetMap (bâtiments, eau, parcs, voies ferrées
et autoroutes, gares, écoles, commerces), et les revenus de l'Insee
(Filosofi 2021, carreaux de 200 m), puis les ramène sur une grille carrée
de N × N cases. Le site lit ensuite le fichier produit, sans rien télécharger.

    python villes.py "Paris, France" --id paris
    python villes.py --exemples                 # Lyon, Paris et Bouc-Bel-Air
    python villes.py "Bouc-Bel-Air, France" --taille 64

Sorties : public/data/schelling/<id>.json, et la liste villes.json.
Le premier passage télécharge beaucoup (environ 25 minutes pour Paris) ;
chaque réponse d'OpenStreetMap est gardée dans le dossier cache/ : un
passage interrompu (Ctrl+C) ne redemande pas ce qui a déjà été reçu.

Licences : les fichiers produits sont des bases dérivées d'OpenStreetMap
(© les contributeurs d'OpenStreetMap, licence ODbL) et de données de l'Insee
(Licence Ouverte). Le site affiche ces deux mentions sous la carte.
"""

import argparse
import base64
import csv
import datetime
import io
import json
import math
import pathlib
import re
import sys
import time
import unicodedata
import urllib.request
import zipfile

import numpy as np
from PIL import Image, ImageDraw
from pyproj import Transformer
from scipy import ndimage
from shapely.geometry import box

ICI = pathlib.Path(__file__).resolve().parent
SORTIE = ICI.parent.parent / 'public' / 'data' / 'schelling'
CACHE = ICI / 'cache'

# Le dernier nombre : le côté de la grille (None : celui de --taille, 128 par défaut).
# Une petite commune en 64 × 64 garde des cases d'une centaine de mètres.
EXEMPLES = [
    ('Lyon, France', 'lyon', 'Lyon', None),
    ('Paris, France', 'paris', 'Paris', None),
    ('Bouc-Bel-Air, France', 'bouc-bel-air', 'Bouc-Bel-Air', 64),
]

# Serveurs Overpass : le premier est le serveur officiel ; les autres servent
# de secours s'il refuse ou coupe la connexion (ce qui arrive quand il est saturé).
SERVEURS = [
    'https://overpass-api.de/api',
    'https://overpass.private.coffee/api',
    'https://maps.mail.ru/osm/tools/overpass/api',
]

INSEE_URL = 'https://www.insee.fr/fr/statistiques/fichier/8735162/Filosofi2021_carreaux_200m_csv.zip'
INSEE_PAS = 200  # côté d'un carreau, en mètres

# Valeurs du sol, les mêmes que dans terrain.js
HABITABLE, EAU, PARC, VOIE, NON_BATI, HORS = 0, 1, 2, 3, 4, 5

SUR = 4  # suréchantillonnage : chaque case est dessinée en SUR × SUR pixels

ETIQUETTES = {
    'batiments': {'building': True},
    'eau': {'natural': ['water', 'bay'], 'water': True, 'waterway': ['riverbank'], 'landuse': ['reservoir', 'basin']},
    'parcs': {
        'leisure': ['park', 'garden', 'nature_reserve'],
        'landuse': ['forest', 'grass', 'recreation_ground', 'cemetery', 'meadow'],
        'natural': ['wood', 'scrub', 'heath'],
    },
    'voies': {'railway': ['rail'], 'highway': ['motorway', 'trunk']},
    'gares': {'railway': ['station', 'halt'], 'station': ['subway', 'light_rail', 'train'], 'public_transport': ['station']},
    'ecoles': {'amenity': ['school', 'college', 'university', 'kindergarten']},
    'commerces': {'shop': True, 'amenity': ['restaurant', 'cafe', 'bar', 'marketplace', 'pharmacy']},
}


def dire(*morceaux):
    print(*morceaux, flush=True)


def identifiant(nom):
    s = unicodedata.normalize('NFKD', nom).encode('ascii', 'ignore').decode().lower()
    return re.sub(r'[^a-z0-9]+', '-', s).strip('-') or 'ville'


def b64(tableau):
    return base64.b64encode(np.ascontiguousarray(tableau, dtype=np.uint8).tobytes()).decode('ascii')


# ------------------------------------------------------------
#  OpenStreetMap
# ------------------------------------------------------------

def preparer_osmnx(contact=None):
    import osmnx as ox
    ox.settings.use_cache = True
    ox.settings.cache_folder = str(CACHE / 'osmnx')
    ox.settings.requests_timeout = 600
    ox.settings.log_console = False
    if contact:  # les serveurs aiment savoir qui les interroge
        ox.settings.http_user_agent = f'{ox.settings.http_user_agent}; portfolio-schelling, contact: {contact}'
    return ox


def choisir_serveur(ox, url):
    ox.settings.overpass_url = url
    # seul le serveur officiel publie ses créneaux libres ; ailleurs, OSMnx attendrait 60 s à chaque requête
    ox.settings.overpass_rate_limit = 'overpass-api.de' in url


def raison(e):
    """Une raison d'échec courte : le code HTTP s'il y en a un, sinon le type d'erreur."""
    m = re.search(r'responded:? (\d{3}[^<\n]{0,40})', str(e))
    return m.group(1).strip() if m else type(e).__name__


def demander(ox, zone, etiquettes, essais=3):
    """Une requête, avec trois essais par serveur, puis le serveur suivant. None si la zone est vide."""
    depart = SERVEURS.index(ox.settings.overpass_url) if ox.settings.overpass_url in SERVEURS else 0
    ordre = [ox.settings.overpass_url] + [s for s in SERVEURS[depart + 1:] + SERVEURS[:depart] if s != ox.settings.overpass_url]
    for k, url in enumerate(ordre):
        if k:
            dire(f'    on passe sur le serveur {url.split("/")[2]}')
            choisir_serveur(ox, url)
        for essai in range(essais):
            try:
                return ox.features_from_polygon(zone, etiquettes)
            except Exception as e:  # réponse vide, serveur occupé, délai dépassé, connexion coupée
                if 'InsufficientResponse' in type(e).__name__ or 'No matching features' in str(e):
                    return None
                if essai < essais - 1:
                    dire(f'    serveur occupé ({raison(e)}), nouvel essai dans 30 s')
                    time.sleep(30)
                elif k == len(ordre) - 1:
                    raise
                else:
                    dire(f'    serveur occupé ({raison(e)})')


def objets(ox, polygone, etiquettes, tuiles=1):
    """Les objets OSM d'un polygone (en WGS84), tuile par tuile pour les grosses requêtes."""
    import geopandas as gpd
    import pandas as pd
    minx, miny, maxx, maxy = polygone.bounds
    morceaux = []
    zones = []
    for i in range(tuiles):
        for j in range(tuiles):
            tuile = box(minx + (maxx - minx) * i / tuiles, miny + (maxy - miny) * j / tuiles,
                        minx + (maxx - minx) * (i + 1) / tuiles, miny + (maxy - miny) * (j + 1) / tuiles)
            zone = polygone.intersection(tuile)
            if not zone.is_empty:
                zones.append(zone)
    for k, zone in enumerate(zones, 1):
        debut = time.time()
        gdf = demander(ox, zone, etiquettes)
        if gdf is not None:
            morceaux.append(gdf)
        if len(zones) > 1:
            dire(f'    tuile {k}/{len(zones)} : {0 if gdf is None else len(gdf)} objets en {time.time() - debut:.0f} s')
    if not morceaux:
        return gpd.GeoDataFrame(geometry=[], crs='EPSG:4326')
    tout = pd.concat(morceaux)
    tout = tout[~tout.index.duplicated()]
    return gpd.GeoDataFrame(tout, geometry='geometry', crs='EPSG:4326')


def sans_tunnels(gdf):
    for col in ('tunnel', 'covered'):
        if col in gdf.columns:
            gdf = gdf[~gdf[col].isin(['yes', 'building_passage', 'culvert'])]
    if 'layer' in gdf.columns:
        couche = gdf['layer'].astype(str).str.extract(r'(-?\d+)')[0].astype(float)
        gdf = gdf[~(couche < 0)]
    return gdf


# ------------------------------------------------------------
#  Grille et dessin
# ------------------------------------------------------------

class Grille:
    """Une grille carrée de N × N cases, nord en haut, dans un système métrique (UTM)."""

    def __init__(self, polygone_proj, N):
        minx, miny, maxx, maxy = polygone_proj.bounds
        cote = max(maxx - minx, maxy - miny) * 1.04
        cx, cy = (minx + maxx) / 2, (miny + maxy) / 2
        self.N = N
        self.cellule = cote / N
        self.x0 = cx - cote / 2
        self.y1 = cy + cote / 2

    def pixel(self, x, y):
        return ((x - self.x0) / self.cellule * SUR, (self.y1 - y) / self.cellule * SUR)

    def centres(self):
        k = np.arange(self.N) + 0.5
        xs = self.x0 + k * self.cellule
        ys = self.y1 - k * self.cellule
        return np.meshgrid(xs, ys)  # X[ligne, colonne], Y[ligne, colonne]

    def nouvelle_image(self):
        return Image.new('L', (self.N * SUR, self.N * SUR), 0)

    def couverture(self, image):
        a = np.asarray(image, dtype=np.float32) / 255
        return a.reshape(self.N, SUR, self.N, SUR).mean(axis=(1, 3))

    def polygones(self, geometries):
        """Part de chaque case couverte par des polygones (trous compris)."""
        img = self.nouvelle_image()
        d = ImageDraw.Draw(img)
        trous = []
        for g in geometries:
            for p in getattr(g, 'geoms', [g]):
                if p.geom_type != 'Polygon' or p.is_empty:
                    continue
                d.polygon([self.pixel(x, y) for x, y in p.exterior.coords], fill=255)
                trous.extend(p.interiors)
        for t in trous:
            d.polygon([self.pixel(x, y) for x, y in t.coords], fill=0)
        return self.couverture(img)

    def lignes(self, geometries, largeur_m):
        img = self.nouvelle_image()
        d = ImageDraw.Draw(img)
        l = max(2, round(largeur_m / self.cellule * SUR))
        for g in geometries:
            for ligne in getattr(g, 'geoms', [g]):
                if ligne.geom_type == 'LineString':
                    d.line([self.pixel(x, y) for x, y in ligne.coords], fill=255, width=l)
                elif ligne.geom_type == 'Polygon':
                    d.line([self.pixel(x, y) for x, y in ligne.exterior.coords], fill=255, width=l)
        return self.couverture(img)

    def comptes(self, geometries):
        """Nombre de points (ou de centres d'objets) par case."""
        c = np.zeros((self.N, self.N), dtype=np.float32)
        for g in geometries:
            p = g if g.geom_type == 'Point' else g.representative_point()
            col = int((p.x - self.x0) / self.cellule)
            lig = int((self.y1 - p.y) / self.cellule)
            if 0 <= lig < self.N and 0 <= col < self.N:
                c[lig, col] += 1
        return c

    def distance(self, masque):
        """Distance (m) de chaque case à la plus proche case du masque (très loin s'il est vide)."""
        if not masque.any():
            return np.full(masque.shape, 1e6, dtype=np.float32)
        return ndimage.distance_transform_edt(~masque).astype(np.float32) * self.cellule


# ------------------------------------------------------------
#  Insee : Filosofi 2021, carreaux de 200 m
# ------------------------------------------------------------

def fichier_insee():
    CACHE.mkdir(parents=True, exist_ok=True)
    chemin = CACHE / 'Filosofi2021_carreaux_200m_csv.zip'
    if not chemin.exists() or chemin.stat().st_size < 1_000_000:
        dire(f'  téléchargement des données de l’Insee (≈ 90 Mo) : {INSEE_URL}')
        partiel = chemin.with_suffix('.partiel')
        with urllib.request.urlopen(INSEE_URL, timeout=120) as r, open(partiel, 'wb') as f:
            while bloc := r.read(1 << 20):
                f.write(bloc)
        partiel.rename(chemin)
    return chemin


ID_CARREAU = re.compile(r'CRS(\d+)RES(\d+)mN(\d+)E(\d+)')


def nombre(texte):
    try:
        return float(str(texte).replace(',', '.'))
    except ValueError:
        return 0.0


def carreaux_insee(chemin, grille, crs_grille):
    """Les carreaux qui recouvrent la grille : {(epsg, E, N): {ind, men, snv, soc}}."""
    X, Y = grille.centres()
    boites = {}

    def boite(epsg):
        if epsg not in boites:
            t = Transformer.from_crs(crs_grille, f'EPSG:{epsg}', always_xy=True)
            xs, ys = t.transform(X.ravel(), Y.ravel())
            boites[epsg] = (min(xs) - 400, min(ys) - 400, max(xs) + 400, max(ys) + 400)
        return boites[epsg]

    trouves = {}
    with zipfile.ZipFile(chemin) as z:
        noms = [n for n in z.namelist() if n.lower().endswith('.csv')]
        if not noms:
            raise RuntimeError('Aucun fichier CSV dans le zip de l’Insee.')
        for nom in noms:
            with z.open(nom) as brut:
                texte = io.TextIOWrapper(brut, encoding='utf-8-sig', errors='replace')
                tete = texte.readline()
                sep = ';' if tete.count(';') > tete.count(',') else ','
                colonnes = [c.strip().strip('"').lower() for c in tete.strip().split(sep)]
                lecteur = csv.reader(texte, delimiter=sep)
                k_id = next((i for i, c in enumerate(colonnes) if c.startswith('idcar_200')), None)
                if k_id is None:
                    continue
                k = {c: colonnes.index(c) for c in ('ind', 'men', 'ind_snv', 'log_soc') if c in colonnes}
                for ligne in lecteur:
                    m = ID_CARREAU.search(ligne[k_id])
                    if not m:
                        continue
                    epsg, _, n, e = (int(x) for x in m.groups())
                    x0, y0, x1, y1 = boite(epsg)
                    if not (x0 <= e <= x1 and y0 <= n <= y1):
                        continue
                    trouves[(epsg, e, n)] = {
                        'ind': nombre(ligne[k['ind']]) if 'ind' in k else 0.0,
                        'men': nombre(ligne[k['men']]) if 'men' in k else 0.0,
                        'snv': nombre(ligne[k['ind_snv']]) if 'ind_snv' in k else 0.0,
                        'soc': nombre(ligne[k['log_soc']]) if 'log_soc' in k else 0.0,
                    }
    return trouves


def couches_insee(carreaux, grille, crs_grille):
    """Pour chaque case : rang du niveau de vie de son carreau (1…255, 0 sans donnée) et part de logements sociaux."""
    N = grille.N
    revenu = np.zeros((N, N), dtype=np.uint8)
    social = np.zeros((N, N), dtype=np.uint8)
    habite = np.zeros((N, N), dtype=bool)
    if not carreaux:
        return revenu, social, habite
    X, Y = grille.centres()
    epsgs = sorted({k[0] for k in carreaux})
    # le rang d'un carreau parmi ceux de la ville, pondéré par le nombre d'habitants
    utiles = [(k, v['snv'] / v['ind']) for k, v in carreaux.items() if v['ind'] > 0 and v['snv'] > 0]
    utiles.sort(key=lambda kv: kv[1])
    total = sum(carreaux[k]['ind'] for k, _ in utiles) or 1
    rang, cumul = {}, 0.0
    for k, _ in utiles:
        poids = carreaux[k]['ind']
        rang[k] = (cumul + poids / 2) / total
        cumul += poids
    for epsg in epsgs:
        t = Transformer.from_crs(crs_grille, f'EPSG:{epsg}', always_xy=True)
        xs, ys = t.transform(X.ravel(), Y.ravel())
        for idx, (x, y) in enumerate(zip(xs, ys)):
            cle = (epsg, int(x // INSEE_PAS) * INSEE_PAS, int(y // INSEE_PAS) * INSEE_PAS)
            v = carreaux.get(cle)
            if v is None:
                continue
            lig, col = divmod(idx, N)
            habite[lig, col] = v['men'] > 0
            if cle in rang:
                revenu[lig, col] = 1 + round(rang[cle] * 254)
            if v['men'] > 0:
                social[lig, col] = round(min(1.0, v['soc'] / v['men']) * 255)
    return revenu, social, habite


# ------------------------------------------------------------
#  Une ville
# ------------------------------------------------------------

def preparer_ville(requete, id_ville, nom, N, avec_insee, ox=None):
    ox = ox or preparer_osmnx()
    debut = time.time()
    dire(f'\n{nom} ({requete})')
    dire('  contour de la commune')
    contour = ox.geocode_to_gdf(requete)
    contour = contour[contour.geometry.geom_type.isin(['Polygon', 'MultiPolygon'])]
    if contour.empty:
        raise RuntimeError(f'Pas de contour pour « {requete} » : essayez « Ville, France ».')
    polygone = contour.geometry.iloc[0]
    contour_proj = ox.projection.project_gdf(contour)
    crs = contour_proj.crs
    grille = Grille(contour_proj.geometry.iloc[0], N)
    dire(f'  grille de {N} × {N} cases de {grille.cellule:.0f} m (système {crs.to_string()})')
    aire_km2 = contour_proj.geometry.iloc[0].area / 1e6
    tuiles = max(1, math.ceil(math.sqrt(aire_km2 / 30)))

    couches = {}
    for cle in ('batiments', 'eau', 'parcs', 'voies', 'gares', 'ecoles', 'commerces'):
        t = tuiles if cle in ('batiments', 'commerces') else 1
        dire(f'  OpenStreetMap : {cle}' + (f' ({t * t} tuiles)' if t > 1 else ''))
        gdf = objets(ox, polygone, ETIQUETTES[cle], tuiles=t)
        if cle == 'voies':
            gdf = sans_tunnels(gdf)
        couches[cle] = gdf.to_crs(crs).geometry if len(gdf) else []
        dire(f'    {len(gdf)} objets')

    ville = grille.polygones(contour_proj.geometry)
    bati = grille.polygones(couches['batiments'])
    eau = grille.polygones(couches['eau'])
    parcs = grille.polygones(couches['parcs'])
    voies = grille.lignes(couches['voies'], 30)

    revenu = social = None
    habite = None
    if avec_insee:
        dire('  Insee : revenus et logements sociaux (Filosofi 2021)')
        carreaux = carreaux_insee(fichier_insee(), grille, crs)
        revenu, social, habite = couches_insee(carreaux, grille, crs)
        dire(f'    {len(carreaux)} carreaux de 200 m, {int(habite.sum())} cases habitées')

    # Le sol de chaque case
    dans = ville >= 0.5
    sol = np.full((N, N), NON_BATI, dtype=np.uint8)
    sol[~dans] = HORS
    sol[dans & (eau >= 0.5)] = EAU
    sol[dans & (sol == NON_BATI) & (parcs >= 0.5)] = PARC
    sol[dans & (sol == NON_BATI) & (voies >= 0.12)] = VOIE  # toute case traversée par la voie
    logement = dans & (sol == NON_BATI) & (bati >= 0.06)
    if habite is not None and habite.any():
        logement &= habite  # l'Insee ne compte que les carreaux où vivent des ménages
    sol[logement] = HABITABLE

    # L'attrait : gares, commerces, écoles, parcs, eau
    gares = grille.comptes(couches['gares']) > 0
    ecoles = grille.comptes(couches['ecoles']) > 0
    commerces = ndimage.gaussian_filter(grille.comptes(couches['commerces']), sigma=max(1.0, 250 / grille.cellule))
    plafond = np.percentile(commerces[sol == HABITABLE], 95) if (sol == HABITABLE).any() else 0
    commerces = np.clip(commerces / plafond, 0, 1) if plafond > 0 else commerces * 0
    attrait = (0.35 * np.exp(-grille.distance(gares) / 400)
               + 0.25 * commerces
               + 0.15 * np.exp(-grille.distance(ecoles) / 300)
               + 0.15 * np.exp(-grille.distance(sol == PARC) / 250)
               + 0.10 * np.exp(-grille.distance(sol == EAU) / 300))
    haut = np.percentile(attrait[sol == HABITABLE], 98) if (sol == HABITABLE).any() else 1
    attrait = np.clip(attrait / max(haut, 1e-6), 0, 1)
    attrait[sol == HORS] = 0

    sources = ['© les contributeurs d’OpenStreetMap (ODbL)']
    if revenu is not None:
        sources.append('Insee, Filosofi 2021, données carroyées à 200 m (Licence Ouverte)')
    donnees = {
        'format': 1,
        'id': id_ville,
        'nom': nom,
        'requete': requete,
        'taille': N,
        'cellule': round(grille.cellule, 1),
        'crs': crs.to_string(),
        'origine': [round(grille.x0, 1), round(grille.y1, 1)],
        'couches': {
            'sol': b64(sol),
            'attrait': b64(np.round(attrait * 255)),
            'revenu': b64(revenu) if revenu is not None else None,
            'social': b64(social) if social is not None else None,
        },
        'stats': {
            'habitables': int((sol == HABITABLE).sum()),
            'eau': int((sol == EAU).sum()),
            'parcs': int((sol == PARC).sum()),
            'voies': int((sol == VOIE).sum()),
        },
        'sources': sources,
        'date': datetime.date.today().isoformat(),
    }
    dire(f'  {donnees["stats"]["habitables"]} cases habitables · {time.time() - debut:.0f} s')
    return donnees


def ecrire(donnees, sortie):
    sortie.mkdir(parents=True, exist_ok=True)
    (sortie / f'{donnees["id"]}.json').write_text(json.dumps(donnees, ensure_ascii=False, separators=(',', ':')), encoding='utf-8')
    liste_chemin = sortie / 'villes.json'
    liste = json.loads(liste_chemin.read_text(encoding='utf-8')) if liste_chemin.exists() else []
    liste = [v for v in liste if v['id'] != donnees['id']]
    liste.append({'id': donnees['id'], 'nom': donnees['nom'], 'taille': donnees['taille'],
                  'cellule': donnees['cellule'], 'insee': donnees['couches']['revenu'] is not None})
    liste.sort(key=lambda v: v['nom'])
    liste_chemin.write_text(json.dumps(liste, ensure_ascii=False, indent=1), encoding='utf-8')
    dire(f'  écrit : {sortie / (donnees["id"] + ".json")}')


def main():
    a = argparse.ArgumentParser(description='Prépare de vraies villes pour l’explorateur de Schelling.')
    a.add_argument('ville', nargs='?', help='« Ville, Pays », par exemple « Nantes, France »')
    a.add_argument('--id', help='identifiant court du fichier (par défaut : tiré du nom)')
    a.add_argument('--nom', help='nom affiché sur le site (par défaut : le premier mot de la requête)')
    a.add_argument('--exemples', action='store_true', help='prépare Lyon, Paris et Bouc-Bel-Air')
    a.add_argument('--taille', type=int, default=128, help='côté de la grille, en cases (128 par défaut)')
    a.add_argument('--sans-insee', action='store_true', help='sans les revenus de l’Insee (villes hors de France)')
    a.add_argument('--sortie', type=pathlib.Path, default=SORTIE, help='dossier des fichiers produits')
    a.add_argument('--contact', help='un e-mail ou l’adresse de votre site, transmis aux serveurs d’OpenStreetMap')
    a.add_argument('--serveur', help='le serveur Overpass à essayer en premier, par exemple https://overpass.private.coffee/api')
    args = a.parse_args()

    villes = list(EXEMPLES) if args.exemples else []
    if args.ville:
        nom = args.nom or args.ville.split(',')[0].strip()
        villes.append((args.ville, args.id or identifiant(nom), nom, None))
    if not villes:
        a.print_help()
        sys.exit(1)
    ox = preparer_osmnx(args.contact)
    if args.serveur:
        url = args.serveur.rstrip('/').removesuffix('/interpreter')
        if url not in SERVEURS:
            SERVEURS.insert(0, url)
        choisir_serveur(ox, url)
    else:
        choisir_serveur(ox, SERVEURS[0])
    ratees = []
    for requete, id_ville, nom, taille in villes:
        try:
            ecrire(preparer_ville(requete, id_ville, nom, taille or args.taille, not args.sans_insee, ox), args.sortie)
        except Exception as e:  # une ville ratée n'empêche pas les suivantes (Ctrl+C, lui, arrête tout)
            dire(f'  ÉCHEC pour {nom} : {raison(e)} — relancer la même commande reprendra où elle s’est arrêtée')
            ratees.append(nom)
    if ratees:
        dire(f'\nÀ relancer : {", ".join(ratees)}')
        sys.exit(1)


if __name__ == '__main__':
    main()