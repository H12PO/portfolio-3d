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
  { id: 'departures-01', type: 'departures',   x: -24.5, z:   1.15, rotY: 0, scale: 1 },
  { id: 'vending-01',    type: 'vending',      x:  -3.5, z:  -8.25, rotY: 0, scale: 1 },
  { id: 'bookshelf-01',  type: 'bookshelf',    x:  24.5, z:   1.3,  rotY: 0, scale: 1 },

  // --- sièges, positions temporaires pour jugement ---
  { id: 'banq2-01',    type: 'banquette_2p',       x: -10, z: 2, rotY: 0, scale: 1 },
  { id: 'banq4-01',    type: 'banquette_4p',       x:  -6, z: 2, rotY: 0, scale: 1 },
  { id: 'banqd-01',    type: 'banquette_dos',      x:  -2, z: 2, rotY: 0, scale: 1 },
  { id: 'banqt-01',    type: 'banquette_tablette', x:   2, z: 2, rotY: 0, scale: 1 },
  { id: 'ilot-01',     type: 'banc_ilot',          x:   6, z: 2, rotY: 0, scale: 1 },
  { id: 'fauteuil-01', type: 'fauteuil',           x:   9, z: 2, rotY: 0, scale: 1 },


      // --- bornes restantes, positions temporaires ---
  { id: 'borne-01',     type: 'borne',      x: -14, z: 5, rotY: 0, scale: 1 },
  { id: 'borneinfo-01', type: 'borne_info', x: -11, z: 5, rotY: 0, scale: 1 },
  { id: 'carrousel-01', type: 'carrousel',  x:  -7, z: 5, rotY: 0, scale: 1 },

  // --- bagages, positions temporaires ---
  { id: 'bag-01', type: 'bag_mallette',       x: -1, z: 5, rotY: 0, scale: 1 },
  { id: 'bag-02', type: 'bag_sac_a_dos',      x:  0, z: 5, rotY: 0, scale: 1 },
  { id: 'bag-03', type: 'bag_sac_marin',      x:  1, z: 5, rotY: 0, scale: 1 },
  { id: 'bag-04', type: 'bag_sac_voyage',     x:  2, z: 5, rotY: 0, scale: 1 },
  { id: 'bag-05', type: 'bag_valise_cabine',  x:  3, z: 5, rotY: 0, scale: 1 },
  { id: 'bag-06', type: 'bag_valise_rigide',  x:  4, z: 5, rotY: 0, scale: 1 },
]