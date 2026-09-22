// ============================================================
//  MOBILIER — tableau unique, généré par le mode éditeur (touche O)
//  Coordonnées monde absolues. Ne pas éditer à la main :
//  utiliser l'éditeur et coller son export.
// ============================================================

/**
 * Emprises au sol, en mètres. À remplir au moment des collisions AABB,
 * une fois les props posés — pas avant, sinon on saisit deux fois.
 * Un type absent d'ici ne bloque rien : ni le rendu, ni l'éditeur.
 *   w, d, h : emprise en mètres
 */
export const PROP_TYPES = {}

export const PROPS = [
  // --- bornes et comptoirs ---
  { id: 'cookie-01',     type: 'cookie_stand', x:   0.0, z: -10.5, rotY: 0, scale: 1 },
  { id: 'departures-01', type: 'departures',   x: -24.4, y:  1.15, z:   1.35, rotY: 0, scale: 1 },
  { id: 'vending-01',    type: 'vending',      x:  -3.5, z:  -8.25, rotY: 0, scale: 1 },
  { id: 'bookshelf-01',  type: 'bookshelf',    x:  22.7, z:   1.4,  rotY: 0, scale: 1 },

  // --- sièges, positions temporaires pour jugement ---
  /*{ id: 'banq2-01',    type: 'banquette_2p',       x: -10, z: 2, rotY: 0, scale: 1 },
  { id: 'banq4-01',    type: 'banquette_4p',       x:  -6, z: 2, rotY: 0, scale: 1 },
  { id: 'banqd-01',    type: 'banquette_dos',      x:  -2, z: 2, rotY: 0, scale: 1 },
  { id: 'banqt-01',    type: 'banquette_tablette', x:   2, z: 2, rotY: 0, scale: 1 },
  { id: 'ilot-01',     type: 'banc_ilot',          x:   6, z: 2, rotY: 0, scale: 1 },
  { id: 'fauteuil-01', type: 'fauteuil',           x:   9, z: 2, rotY: 0, scale: 1 },*/


      // --- bornes restantes, positions temporaires ---
  { id: 'borne-01',     type: 'borne',      x: -14, z: 5, rotY: 0, scale: 1 },
  { id: 'borneinfo-01', type: 'borne_info', x: -11, z: 5, rotY: 0, scale: 1 },
  { id: 'carrousel-01', type: 'carrousel',  x:  25.7, z: 6.5, rotY: 0, scale: 1 },
  { id: 'portique-e', type: 'portique_entree', x: 24.65, z: 1.4, rotY: 0, scale: 1 },
  { id: 'portique-s', type: 'portique_sortie', x: 26.7, z: 7.55, rotY: Math.PI / 2, scale: 1 },
  { id: 'jukebox-01', type: 'jukebox', x: 0, z: 2, rotY: 0, scale: 1, y: -0.058 },



      // --- Decor
  { id: 'affiche-01', type: 'affiche_paysage', x: 3, z: 2, rotY: 0, scale: 2, image: '/affiches/paysage.jpg' },
  { id: 'affiche-02', type: 'affiche_portrait', x: 25, z: 1.2, y:  -0.5, rotY: 0, scale: 2.5, image: { fr: '/affiches/Savoie_fr.png', en: '/affiches/Savoie_eng.png' } },
  { id: 'porte_service-01',     type: 'porte_service',      x: 26.8, z: 5.5, rotY: -Math.PI / 2, scale: 1 },
  { id: 'chariot_nettoyage-01', type: 'chariot_nettoyage', x: 26.4, z: 4, rotY: Math.PI / 2, scale: 1, },

  /*// --- bagages, positions temporaires ---p
  { id: 'bag-01', type: 'bag_mallette',       x: -1, z: 5, rotY: 0, scale: 1 },
  { id: 'bag-02', type: 'bag_sac_a_dos',      x:  0, z: 5, rotY: 0, scale: 1 },
  { id: 'bag-03', type: 'bag_sac_marin',      x:  1, z: 5, rotY: 0, scale: 1 },
  { id: 'bag-04', type: 'bag_sac_voyage',     x:  2, z: 5, rotY: 0, scale: 1 },
  { id: 'bag-05', type: 'bag_valise_cabine',  x:  3, z: 5, rotY: 0, scale: 1 },
  { id: 'bag-06', type: 'bag_valise_rigide',  x:  4, z: 5, rotY: 0, scale: 1 },*/

  // --- bacs maçonnés, positions temporaires ---
  // { id: 'bac-01', type: 'bac_fleuri',     x: -6, z: 2, rotY: 0, scale: 1 },
  { id: 'bac-02', type: 'bac_hortensias', x: 26.1, z: 1.4, rotY: Math.PI, scale: 0.90 },
  // { id: 'bac-03', type: 'bac_exotique',   x:  0, z: 2, rotY: 0, scale: 1 },
  // { id: 'bac-04', type: 'bac_roses',      x:  3, z: 2, rotY: 0, scale: 1 },
  // { id: 'bac-05', type: 'bac_champetre',  x:  6, z: 2, rotY: 0, scale: 1 },



  /*    // --- jardinières, positions temporaires ---
  { id: 'jard-01', type: 'jard_deux_faces',    x: -8, z: 5, rotY: 0, scale: 1 },
  { id: 'jard-02', type: 'jard_epis',          x: -4, z: 5, rotY: 0, scale: 1 },
  { id: 'jard-03', type: 'jard_haute_mixte',   x:  0, z: 5, rotY: 0, scale: 1 },
  { id: 'jard-04', type: 'jard_massif_fleuri', x:  4, z: 5, rotY: 0, scale: 1 },
  { id: 'jard-05', type: 'jard_treillis',      x:  8, z: 5, rotY: 0, scale: 1 },

  // --- sujets et bac cactus ---
  { id: 'sujet-01', type: 'sujet_feuilles_larges', x: -6, z: -1, rotY: 0, scale: 1 },
  { id: 'sujet-02', type: 'sujet_fougere',         x: -3, z: -1, rotY: 0, scale: 1 },
  { id: 'sujet-03', type: 'sujet_monstera',        x:  0, z: -1, rotY: 0, scale: 1 },
  { id: 'sujet-04', type: 'sujet_palmier',         x:  3, z: -1, rotY: 0, scale: 1 },
  { id: 'bac-06',   type: 'bac_cactus',            x:  6, z: -1, rotY: 0, scale: 1 },

  // --- petits pots et suspensions ---
  { id: 'petit-01', type: 'petit_coupe_grasses',          x: -5, z: 7, rotY: 0, scale: 1 },
  { id: 'petit-02', type: 'petit_pot_bureau',             x: -3, z: 7, rotY: 0, scale: 1 },
  { id: 'petit-03', type: 'petit_terracotta_clochettes',  x: -1, z: 7, rotY: 0, scale: 1 },
  { id: 'petit-04', type: 'petit_terracotta_fleuri',      x:  1, z: 7, rotY: 0, scale: 1 },
  { id: 'susp-01',  type: 'suspension_feuillage',         x:  4, z: 7, rotY: 0, scale: 1 },
  { id: 'susp-02',  type: 'suspension_fleurie',           x:  6, z: 7, rotY: 0, scale: 1 },*/
]