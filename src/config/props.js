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
  //{ id: 'jukebox-01', type: 'jukebox', x: 0, z: 2, rotY: 0, scale: 1, y: -0.058 },



      // --- Decor
  //{ id: 'affiche-01', type: 'affiche_paysage', x: 3, z: 2, rotY: 0, scale: 2, image: '/affiches/paysage.jpg' },
  { id: 'affiche-02', type: 'affiche_portrait', x: 25, z: 1.2, y:  -0.5, rotY: 0, scale: 2.5, image: { fr: '/affiches/Savoie_fr.png', en: '/affiches/Savoie_eng.png' } },
  { id: 'porte_service-01',     type: 'porte_service',      x: 26.8, z: 5.5, rotY: -Math.PI / 2, scale: 1 },
  { id: 'chariot_nettoyage-01', type: 'chariot_nettoyage', x: 26.5, z: 4, rotY: Math.PI / 2, scale: 1, },
  { id: 'bac-02', type: 'bac_hortensias', x: 26.1, z: 1.4, rotY: Math.PI, scale: 0.90 },

    /* FrontSide */
    //Droite
  { id: 'fr-barr-D01', type: 'barriere_segment', x: 22, z: 8.8, rotY: 0, scale: 1 },
  { id: 'fr-barr-D02', type: 'barriere_segment', x: 23.5, z: 8.8, rotY: 0, scale: 1 },
  { id: 'fr-barr-D03', type: 'barriere_segment', x: 25, z: 8.8, rotY: 0, scale: 1 },
  { id: 'fr-barr-D04', type: 'barriere_poteau',  x: 26.5, z: 8.8, rotY: 0, scale: 1 },

  { id: 'fr-jard-01', type: 'jard_massif_fleuri', x:  21, z: 9, rotY: 0, scale: 1 },
  { id: 'fr-banqt-01',    type: 'banquette_tablette', x:   19, z: 9, rotY: Math.PI, scale: 1 },
  { id: 'fr-jard-02', type: 'bac_fleuri',     x: 16.8, z: 9, rotY: 0, scale: 1 },
  { id: 'fr-barr-D05', type: 'barriere_poteau',  x: 15.8, z: 8.8, rotY: 0, scale: 1 },
  { id: 'fr-barr-D06', type: 'barriere_segment', x: 14.3, z: 8.8, rotY: 0, scale: 1 },
  { id: 'bac-06',   type: 'bac_cactus',            x: 13.8, z: 9, rotY: 0, scale: 1 },
  { id: 'ilot-01',     type: 'banc_ilot',          x:   12.5, z: 9, rotY: 0, scale: 1 },
  { id: 'bac-05', type: 'bac_champetre',  x:  10.8, z: 9, rotY: 0, scale: 1 },
  { id: 'ilot-01',     type: 'banc_ilot',          x:   9, z: 9, rotY: 0, scale: 1 },
  { id: 'fr-barr-D05', type: 'barriere_poteau',  x: 7.5, z: 8.8, rotY: 0, scale: 1 },
  { id: 'fr-barr-D06', type: 'barriere_segment', x: 6, z: 8.8, rotY: 0, scale: 1 },
  { id: 'fr-barr-D07', type: 'barriere_segment', x: 4.5, z: 8.8, rotY: 0, scale: 1 },
  { id: 'fr-barr-D08', type: 'barriere_segment', x: 3, z: 8.8, rotY: 0, scale: 1 },
  { id: 'fr-barr-D09', type: 'barriere_segment', x: 3, z: 7.3, rotY: -Math.PI/2, scale: 1 },


    //Couloir
  { id: 'sec-portique', type: 'portique_detection', zone: 'couloir', x: 0, z: 9.5, rotY: 0, scale: 1 },
  { id: 'sec-scanner', type: 'scanner_bagages', zone: 'couloir', x: 1.2, z: 9.5, rotY: -Math.PI / 2, scale: 1 },
  { id: 'sec-bureau', type: 'bureau_controle', zone: 'couloir', x: 2.3, z: 9.5, rotY: Math.PI / 2, scale: 1 },
  { id: 'sec-chaise', type: 'chaise_controle', zone: 'couloir', x: 3, z: 9.5, rotY: -Math.PI / 2, scale: 1 },
  { id: 'cou-barr-05', type: 'barriere_segment',zone: 'couloir', x: -0.82, z: 10.15, rotY: 9*Math.PI/14, scale: 1 },
  { id: 'bac-03', type: 'jard_haute_mixte',zone: 'couloir',   x:  -2, z: 10, rotY: 0, scale: 1 },
  { id: 'borneinfo-01', type: 'borne_info',zone: 'couloir', x: -0.82, z: 10.15, rotY: Math.PI, scale: 0.8 },
  //{ id: 'banq2-01',    type: 'banquette_2p',zone: 'couloir',       x: -3, z: 11.5, rotY: Math.PI/2, scale: 1 },
  { id: 'fr-tblbgd-01',    type: 'table_basse_gd',zone: 'couloir', x:   -2, z: 11.5, rotY: Math.PI/2, scale: 1 },
  { id: 'prospectus', type: 'pile_prospectus',zone: 'couloir', x: -1.9,y : 0.4, z:11.5, rotY: Math.PI, scale: 1 },
  { id: 'cafe', type: 'gobelet_cafe',zone: 'couloir', x: -2,y : 0.4, z: 12, rotY: Math.PI, scale: 1 },
  { id: 'petit-03', type: 'petit_terracotta_clochettes',zone: 'couloir',  x:-2 ,y : 0.4, z: 11.2, rotY: 0, scale: 1 },
  { id: 'bouteille', type: 'bouteille_eau',zone: 'couloir', x: 2,y : 0.77, z: 10, rotY: Math.PI, scale: 1 },
  { id: 'cou-porte-g', type: 'porte_service', zone: 'couloir', x: 3.35, z: 13.4, rotY: -Math.PI / 2, scale: 1 },
  { id: 'cou-valise', type: 'bag_valise_rigide', zone: 'couloir',x: -2.55, z: 13, rotY: -0.4, scale: 1, couleur: '#3d6b8f' },
      /* ---- joue gauche : rotY = +PI/2 ---- */

  { id: 'cou-banq', type: 'banquette_4p', zone: 'couloir',
    x: -3.0, z: 11.5, rotY: Math.PI / 2, scale: 1 },
  { id: 'cou-journal', type: 'journal_plie', zone: 'couloir',
    x: -2.95, y: 0.45, z: 11, rotY: 1.2, scale: 1 },




  { id: 'cou-glissant', type: 'panneau_sol_glissant', zone: 'couloir',
    x: 1.9, z: 15.2, rotY: -0.7, scale: 1 },

  //Gauche
  { id: 'fr-barr-G01', type: 'barriere_segment', x: -26.5, z: 8.8, rotY: 0, scale: 1 },
  { id: 'fr-barr-G02', type: 'barriere_segment', x: -25.0, z: 8.8, rotY: 0, scale: 1 },
  { id: 'fr-barr-G03', type: 'barriere_segment', x: -23.5, z: 8.8, rotY: 0, scale: 1 },
  { id: 'fr-barr-G04', type: 'barriere_poteau',  x: -22.0, z: 8.8, rotY: 0, scale: 1 },
  { id: 'fr-banqt-01',    type: 'banquette_tablette', x:   -20.3, z: 9, rotY: Math.PI, scale: 1 },
  { id: 'fr-tblbgd-01',    type: 'table_basse_gd', x:   -18.325, z: 9, rotY: 0, scale: 1 },
  { id: 'bac-04', type: 'bac_roses',      x:  -17, z: 9, rotY: 0, scale: 1 },
  { id: 'fr-barr-G07', type: 'barriere_segment', x: -16, z: 8.8, rotY: 0, scale: 1 },
  { id: 'fr-barr-G08', type: 'barriere_poteau',  x: -14.5, z: 8.8, rotY: 0, scale: 1 },
  { id: 'sujet-03', type: 'sujet_monstera',        x:  -13.5, z: 9, rotY: 0, scale: 0.9},
  { id: 'ilot-01',     type: 'banc_ilot',          x:   -12.3, z: 9, rotY: 0, scale: 1 },
  { id: 'bac-03', type: 'bac_exotique',   x:  -10.5, z: 9, rotY: 0, scale: 1 },
  { id: 'banq2-01',    type: 'banquette_2p',       x: -9, z: 9, rotY: Math.PI, scale: 1 },
  { id: 'bac-06',   type: 'bac_cactus',            x: -8, z: 9, rotY: 0, scale: 1 },
  { id: 'banq2-01',    type: 'banquette_2p',       x: -7, z: 9, rotY: Math.PI, scale: 1 },
  { id: 'fr-barr-G06', type: 'barriere_segment', x: -6, z: 8.8, rotY: 0, scale: 1 },
  { id: 'fr-barr-G07', type: 'barriere_segment', x: -4.5, z: 8.8, rotY: 0, scale: 1 },
  { id: 'fr-barr-G08', type: 'barriere_poteau',  x: -3, z: 8.8, rotY: 0, scale: 1 },
  { id: 'cou-barr-05', type: 'barriere_segment', x: -1.5, z: 8.8, rotY: Math.PI, scale: 1 },




//     { id: 'cou-barr-05', type: 'bouteille_eau', x: 0, z: 5, rotY: Math.PI, scale: 1 },
// { id: 'cou-barr-05', type: 'canette', x: 0.5, z: 5, rotY: Math.PI, scale: 1 },
// { id: 'cou-barr-05', type: 'carte_embarquement', x: 1, z: 5, rotY: Math.PI, scale: 1 },
// { id: 'cou-barr-05', type: 'casque_audio', x: 1.5, z: 5, rotY: Math.PI, scale: 1 },
// { id: 'cou-barr-05', type: 'gobelet_cafe', x: 2, z: 5, rotY: Math.PI, scale: 1 },
// { id: 'cou-barr-05', type: 'journal_ouvert', x: 2.5, z: 5, rotY: Math.PI, scale: 1 },
//     { id: 'cou-barr-05', type: 'journal_plie', x: 3, z: 5, rotY: Math.PI, scale: 1 },
//     { id: 'cou-barr-05', type: 'livre_poche', x: 3.5, z: 5, rotY: Math.PI, scale: 1 },
//     { id: 'cou-barr-05', type: 'magazine', x: 4, z: 5, rotY: Math.PI, scale: 1 },
//     { id: 'cou-barr-05', type: 'mug_isotherme', x: 4.5, z: 5, rotY: Math.PI, scale: 1 },
//     { id: 'cou-barr-05', type: 'pile_prospectus', x: 5, z: 5, rotY: Math.PI, scale: 1 },
//     { id: 'cou-barr-05', type: 'porte_gobelets', x: 5.5, z: 5, rotY: Math.PI, scale: 1 },
//     { id: 'cou-barr-05', type: 'sac_boutique', x: 6, z: 5, rotY: Math.PI, scale: 1 },
//     { id: 'cou-barr-05', type: 'sachet_snack', x: 6.5, z: 5, rotY: Math.PI, scale: 1 },
//     { id: 'cou-barr-05', type: 'telephone', x: 7, z: 5, rotY: Math.PI, scale: 1 },


//   // // --- bacs maçonnés, positions temporaires ---
//     { id: 'bac-01', type: 'bac_fleuri',     x: -6, z: 2, rotY: 0, scale: 1 },
//
//    { id: 'bac-03', type: 'bac_exotique',   x:  -3, z: 2, rotY: 0, scale: 1 },
//   //
// { id: 'bac-05', type: 'bac_champetre',  x:  6, z: 2, rotY: 0, scale: 1 },
//   //
//  { id: 'sujet-01', type: 'sujet_feuilles_larges', x: -6, z: -1, rotY: 0, scale: 1 },
//  { id: 'sujet-02', type: 'sujet_fougere',         x: -3, z: -1, rotY: 0, scale: 1 },
//   //
//   // { id: 'sujet-04', type: 'sujet_palmier',         x:  3, z: -1, rotY: 0, scale: 1 },
//
//   //     // --- jardinières, positions temporaires ---
//   // { id: 'jard-01', type: 'jard_deux_faces',    x: -8, z: 5, rotY: 0, scale: 1 },
//  { id: 'jard-02', type: 'jard_epis',          x: -4, z: 5, rotY: 0, scale: 1 },
//  { id: 'jard-03', type: 'jard_haute_mixte',   x:  0, z: 5, rotY: 0, scale: 1 },
//  { id: 'jard-04', type: 'jard_massif_fleuri', x:  4, z: 5, rotY: 0, scale: 1 },
//   { id: 'jard-05', type: 'jard_treillis',      x:  8, z: 5, rotY: 0, scale: 1 },
  //
  // // --- sujets et bac cactus ---
  //
  //
  //
  // // --- petits pots et suspensions ---
  // { id: 'petit-01', type: 'petit_coupe_grasses',          x: -5, z: 7, rotY: 0, scale: 1 },
  // { id: 'petit-02', type: 'petit_pot_bureau',             x: -3, z: 7, rotY: 0, scale: 1 },
   //{ id: 'petit-03', type: 'petit_terracotta_clochettes',  x: -1, z: 7, rotY: 0, scale: 1 },
  // { id: 'petit-04', type: 'petit_terracotta_fleuri',      x:  1, z: 7, rotY: 0, scale: 1 },
  // { id: 'susp-01',  type: 'suspension_feuillage',         x:  4,y:3, z: 7, rotY: 0, scale: 1 },
  // { id: 'susp-02',  type: 'suspension_fleurie',           x:  6, z: 7, rotY: 0, scale: 1 },

  /*// --- bagages, positions temporaires ---p
  { id: 'bag-01', type: 'bag_mallette',       x: -1, z: 5, rotY: 0, scale: 1 },
  { id: 'bag-02', type: 'bag_sac_a_dos',      x:  0, z: 5, rotY: 0, scale: 1 },
  { id: 'bag-03', type: 'bag_sac_marin',      x:  1, z: 5, rotY: 0, scale: 1 },
  { id: 'bag-04', type: 'bag_sac_voyage',     x:  2, z: 5, rotY: 0, scale: 1 },
  { id: 'bag-05', type: 'bag_valise_cabine',  x:  3, z: 5, rotY: 0, scale: 1 },
  { id: 'bag-06', type: 'bag_valise_rigide',  x:  4, z: 5, rotY: 0, scale: 1 },*/



      /* ---------- COULOIR D'ENTREE ----------
     zone: 'couloir' = monte et demonte avec le poste de securite.
     Tout ce qui est ici disparait en fondu au franchissement du
     verrou. Emprise utile : x de -3.2 a 3.2, z de 9 a 27. */





]


