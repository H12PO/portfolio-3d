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

  { id: 'carrousel-01', type: 'carrousel',  x:  25.7, z: 6.5, rotY: 0, scale: 1 },
  { id: 'portique-e', type: 'portique_entree', x: 24.65, z: 1.4, rotY: 0, scale: 1 },
  { id: 'portique-s', type: 'portique_sortie', x: 26.7, z: 7.55, rotY: Math.PI / 2, scale: 1 },



      // --- Decor
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
  { id: 'cou-banq', type: 'banquette_4p', zone: 'couloir',x: -3.0, z: 11.5, rotY: Math.PI / 2, scale: 1 },
  { id: 'cou-journal', type: 'journal_plie', zone: 'couloir', x: -2.95, y: 0.45, z: 11, rotY: 1.2, scale: 1 },


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



   /* ============================================================
     ILOTS DE SIEGES — banquettes dos a dos alignees, pas 1.70 m.
     Quatre travees dans la bande avant, deux dans les salles
     d'embarquement. Les rotations ne depassent pas 0.02 rad :
     a cette echelle c'est ce qui fait « range » sans faire CAO.
     ============================================================ */
  { id: 'i1a', type: 'banquette_dos', x: -21.60, z: 6.05, rotY:  0.02, scale: 1 },
  { id: 'i1b', type: 'banquette_dos', x: -19.90, z: 6.02, rotY: -0.02, scale: 1 },
  { id: 'i1c', type: 'banquette_dos', x: -18.20, z: 6.08, rotY:  0.02, scale: 1 },

  { id: 'i2a', type: 'banquette_dos', x: -14.00, z: 6.10, rotY: -0.02, scale: 1 },
  { id: 'i2b', type: 'banquette_dos', x: -12.30, z: 6.06, rotY:  0.02, scale: 1 },
  { id: 'i2c', type: 'banquette_dos', x: -10.60, z: 6.12, rotY: -0.02, scale: 1 },

  { id: 'i3a', type: 'banquette_dos', x:   9.60, z: 6.05, rotY:  0.02, scale: 1 },
  { id: 'i3b', type: 'banquette_dos', x:  11.30, z: 6.02, rotY: -0.02, scale: 1 },
  { id: 'i3c', type: 'banquette_dos', x:  13.00, z: 6.08, rotY:  0.02, scale: 1 },

  { id: 'i4a', type: 'banquette_dos', x:  17.80, z: 6.05, rotY: -0.02, scale: 1 },
  { id: 'i4b', type: 'banquette_dos', x:  19.50, z: 6.02, rotY:  0.02, scale: 1 },

  { id: 'i6a', type: 'banquette_dos', x: -13.80, z: -4.60, rotY:  0.02, scale: 1 },
  { id: 'i6b', type: 'banquette_dos', x: -12.10, z: -4.60, rotY: -0.02, scale: 1 },
  { id: 'i7a', type: 'banquette_dos', x:  11.60, z: -4.60, rotY: -0.02, scale: 1 },
  { id: 'i7b', type: 'banquette_dos', x:  13.30, z: -4.60, rotY:  0.02, scale: 1 },

  // coin des departs, face au panneau
  { id: 'pd1', type: 'banquette_tablette', x: -24.90, z: 4.45, rotY: Math.PI - 0.05, scale: 1 },
  { id: 'pd2', type: 'banquette_4p',       x: -22.30, z: 4.50, rotY: Math.PI - 0.05, scale: 1 },

  /* ============================================================
     HAIE DE L'EPINE — z ~ 1.0, bout a bout, un trou a chaque
     bouche de branche. Seize bacs, cinq especes en alternance.
     C'est la piece qui structure tout le hall.
     ============================================================ */
  { id: 'hs1',  type: 'bac_fleuri',    x: -22.60, z: 1.10, rotY:  0.03, scale: 1 },
  { id: 'hs2',  type: 'bac_roses',     x: -21.05, z: 1.08, rotY: -0.02, scale: 1 },
  { id: 'hs3',  type: 'bac_champetre', x: -19.50, z: 1.12, rotY:  0.02, scale: 1 },

  { id: 'hs4',  type: 'bac_cactus',    x: -13.90, z: 1.00, rotY: -0.03, scale: 1 },
  { id: 'hs5',  type: 'bac_fleuri',    x: -12.35, z: 1.02, rotY:  0.02, scale: 1 },
  { id: 'hs6',  type: 'bac_roses',     x: -10.80, z: 0.98, rotY: -0.02, scale: 1 },

  { id: 'hs7',  type: 'bac_champetre', x:  -5.90, z: 0.90, rotY:  0.03, scale: 1 },
  { id: 'hs8',  type: 'bac_cactus',    x:  -4.35, z: 0.88, rotY: -0.02, scale: 1 },
  { id: 'hs9',  type: 'bac_fleuri',    x:  -2.80, z: 0.92, rotY:  0.02, scale: 1 },

  { id: 'hs10', type: 'bac_fleuri',    x:   3.60, z: 0.85, rotY: -0.02, scale: 1 },
  { id: 'hs11', type: 'bac_roses',     x:   5.15, z: 0.88, rotY:  0.03, scale: 1 },

  { id: 'hs12', type: 'bac_cactus',    x:  10.80, z: 0.98, rotY:  0.02, scale: 1 },
  { id: 'hs13', type: 'bac_champetre', x:  12.35, z: 1.02, rotY: -0.03, scale: 1 },
  { id: 'hs14', type: 'bac_fleuri',    x:  13.90, z: 1.00, rotY:  0.02, scale: 1 },

  { id: 'hs15', type: 'bac_roses',     x:  19.50, z: 1.08, rotY: -0.02, scale: 1 },
  { id: 'hs16', type: 'bac_exotique',  x:  21.05, z: 1.10, rotY:  0.03, scale: 1 },

  // sujets hauts en bout de haie
  { id: 'ha1', type: 'sujet_monstera', x: -23.90, z: 1.20, rotY:  0.40, scale: 0.95 },
  { id: 'ha2', type: 'sujet_monstera', x:  14.90, z: 1.10, rotY: -0.40, scale: 0.90 },

  /* ============================================================
     HAIES DE L'ALLEE D'ENTREE — le long de z, de part et d'autre
     ============================================================ */
  { id: 'he1', type: 'bac_cactus', x: -3.40, z: 7.60, rotY: Math.PI / 2 + 0.02, scale: 1 },
  { id: 'he2', type: 'bac_fleuri', x: -3.40, z: 6.05, rotY: Math.PI / 2 - 0.02, scale: 1 },
  { id: 'he3', type: 'bac_roses',  x: -3.40, z: 4.50, rotY: Math.PI / 2 + 0.03, scale: 1 },
  { id: 'he4', type: 'bac_cactus', x:  4.20, z: 7.50, rotY: Math.PI / 2 - 0.02, scale: 1 },
  { id: 'he5', type: 'bac_roses',  x:  4.20, z: 5.95, rotY: Math.PI / 2 + 0.02, scale: 1 },
  { id: 'he6', type: 'bac_fleuri', x:  4.20, z: 4.40, rotY: Math.PI / 2 - 0.03, scale: 1 },

  /* ============================================================
     HAIES DE BRANCHE — bordent les couloirs A2 et A3
     ============================================================ */
  { id: 'hb1', type: 'bac_exotique',  x: -10.20, z: -1.40, rotY: Math.PI / 2 + 0.02, scale: 1 },
  { id: 'hb2', type: 'bac_cactus',    x: -10.20, z: -2.95, rotY: Math.PI / 2 - 0.02, scale: 1 },
  { id: 'hb3', type: 'bac_fleuri',    x: -10.20, z: -4.50, rotY: Math.PI / 2 + 0.03, scale: 1 },
  { id: 'hb4', type: 'bac_roses',     x:  -6.30, z: -2.00, rotY: Math.PI / 2 - 0.02, scale: 1 },
  { id: 'hb5', type: 'bac_champetre', x:  -6.30, z: -3.55, rotY: Math.PI / 2 + 0.02, scale: 1 },
  { id: 'hb6', type: 'bac_cactus',    x:  -6.30, z: -5.10, rotY: Math.PI / 2 - 0.03, scale: 1 },

  { id: 'hb7', type: 'bac_cactus',    x:   6.30, z: -2.00, rotY: Math.PI / 2 + 0.02, scale: 1 },
  { id: 'hb8', type: 'bac_champetre', x:   6.30, z: -3.55, rotY: Math.PI / 2 - 0.02, scale: 1 },
  { id: 'hb9', type: 'bac_roses',     x:   6.30, z: -5.10, rotY: Math.PI / 2 + 0.03, scale: 1 },
  { id: 'hb10',type: 'bac_fleuri',    x:  10.20, z: -1.40, rotY: Math.PI / 2 - 0.02, scale: 1 },
  { id: 'hb11',type: 'bac_cactus',    x:  10.20, z: -2.95, rotY: Math.PI / 2 + 0.02, scale: 1 },
  { id: 'hb12',type: 'bac_exotique',  x:  10.20, z: -4.50, rotY: Math.PI / 2 - 0.03, scale: 1 },

  /* ============================================================
     ALLEES DES PORTES OBLIQUES — massifs hauts, seuil vide
     ============================================================ */
  { id: 'hd1', type: 'jard_massif_fleuri', x: -18.70, z: -0.70, rotY:  Math.PI / 4, scale: 1 },
  { id: 'hd2', type: 'bac_hortensias',     x: -14.40, z: -5.20, rotY:  Math.PI / 4, scale: 0.90 },
  { id: 'hd3', type: 'jard_haute_mixte',   x: -13.20, z: -6.60, rotY:  Math.PI / 4, scale: 1 },
  { id: 'hd4', type: 'jard_haute_mixte',   x:  18.70, z: -0.70, rotY: -Math.PI / 4, scale: 1 },
  { id: 'hd5', type: 'bac_hortensias',     x:  14.40, z: -5.20, rotY: -Math.PI / 4, scale: 0.95 },
  { id: 'hd6', type: 'jard_massif_fleuri', x:  13.20, z: -6.60, rotY: -Math.PI / 4, scale: 1 },

  /* ============================================================
     INTERACTIFS — chacun contre un mur, degagement devant
     ============================================================ */
  { id: 'x-arcade',  type: 'arcade',  x: -26.30, z: 7.30, rotY: Math.PI / 2 - 0.10, scale: 1 },
  { id: 'x-jukebox', type: 'jukebox', x:   4.20, y: -0.058, z: -8.42, rotY: 0.00, scale: 1 },
  { id: 'x-borne',   type: 'borne',   x:  -7.40, z: 6.30, rotY: 0.25, scale: 1 },

  /* ============================================================
     MOBILIER D'APPOINT
     ============================================================ */
  { id: 'm1', type: 'poubelle_tri', x: -26.30, z: 5.60, rotY: Math.PI / 2 + 0.08, scale: 1 },
  { id: 'm2', type: 'bac_exotique', x: -26.00, z: 4.10, rotY: 0.15, scale: 1 },
  { id: 'm3', type: 'poubelle_tri', x:  20.90, z: 7.40, rotY: -0.25, scale: 1 },
  { id: 'm4', type: 'bac_exotique', x:  21.00, z: 5.90, rotY: -0.20, scale: 1 },
  { id: 'm5', type: 'banc_ilot',    x:  -8.60, z: 7.40, rotY: 0.25, scale: 1 },
  { id: 'm6', type: 'banc_ilot',    x:   7.20, z: 7.30, rotY: -0.25, scale: 1 },
  { id: 'm7', type: 'sujet_monstera', x: 7.70, z: 5.20, rotY: -0.40, scale: 0.95 },
  { id: 'm8', type: 'sujet_monstera', x: -8.00, z: 4.60, rotY:  0.40, scale: 0.95 },

  /* ============================================================
     COIN CAFE — comptoir degage, coin d'ecoute pres du jukebox
     ============================================================ */
  { id: 'cf1', type: 'poubelle_tri',   x: -5.20, z: -8.20, rotY: 0.12, scale: 1 },
  { id: 'cf2', type: 'banc_ilot',      x: -4.40, z: -6.20, rotY: 0.30, scale: 1 },
  { id: 'cf3', type: 'gobelet_cafe',   x: -4.40, y: 0.45, z: -6.00, rotY: 0.00, scale: 1 },
  { id: 'cf4', type: 'sachet_snack',   x: -4.15, y: 0.45, z: -6.35, rotY: 0.80, scale: 1 },
  { id: 'cf5', type: 'table_basse_gd', x:  3.10, z: -6.40, rotY: -0.20, scale: 1 },
  { id: 'cf6', type: 'fauteuil',       x:  4.30, z: -5.70, rotY: 1.90, scale: 1 },
  { id: 'cf7', type: 'porte_gobelets', x:  3.05, y: 0.40, z: -6.30, rotY: 0.40, scale: 1 },
  { id: 'cf8', type: 'casque_audio',   x:  3.30, y: 0.40, z: -6.60, rotY: -0.50, scale: 1 },

  /* ============================================================
     BAGAGES ET PETITS OBJETS — uniquement la ou on passe pres
     ============================================================ */
  { id: 'o1', type: 'bag_sac_a_dos',     x: -20.70, z:  7.30, rotY:  0.85, scale: 1, couleur: '#3f5d52' },
  { id: 'o2', type: 'bag_valise_cabine', x: -11.40, z:  7.30, rotY:  0.45, scale: 1, couleur: '#b0554c' },
  { id: 'o3', type: 'bag_valise_rigide', x:  12.20, z:  7.30, rotY:  0.60, scale: 1, couleur: '#4a4f55' },
  { id: 'o4', type: 'bag_sac_marin',     x:  18.70, z:  7.30, rotY: -0.40, scale: 1, couleur: '#b0554c' },
  { id: 'o5', type: 'bag_sac_voyage',    x: -12.90, z: -6.00, rotY:  0.70, scale: 1, couleur: '#3f5d52' },
  { id: 'o6', type: 'bag_mallette',      x:  12.40, z: -6.00, rotY: -0.50, scale: 1, couleur: '#2f5d8a' },

  { id: 'o7',  type: 'journal_ouvert', x: -19.90, y: 0.45, z:  6.32, rotY: -0.45, scale: 1 },
  { id: 'o8',  type: 'magazine',       x: -12.30, y: 0.45, z:  5.76, rotY:  0.55, scale: 1 },
  { id: 'o9',  type: 'journal_plie',   x:  11.30, y: 0.45, z:  6.32, rotY: -0.70, scale: 1 },
  { id: 'o10', type: 'mug_isotherme',  x:  17.80, y: 0.45, z:  5.75, rotY:  0.00, scale: 1 },
  { id: 'o11', type: 'livre_poche',    x: -13.80, y: 0.45, z: -4.30, rotY:  0.70, scale: 1 },
  { id: 'o12', type: 'canette',        x:  13.30, y: 0.45, z: -4.90, rotY:  0.00, scale: 1 },
  { id: 'o13', type: 'telephone',      x:   9.60, y: 0.45, z:  5.75, rotY: -0.80, scale: 1 },
  { id: 'o14', type: 'gobelet_cafe',   x: -24.85, y: 0.55, z:  4.40, rotY:  0.00, scale: 1 },
  { id: 'o15', type: 'carte_embarquement', x: -7.00, y: 0.01, z: 7.20, rotY: 0.90, scale: 1 },
  { id: 'o16', type: 'sac_boutique',   x:  -2.90, z: 7.00, rotY: 0.60, scale: 1 },

  /* ============================================================
     ALCOVES — inchangees
     ============================================================ */
  { id: 'al1', type: 'affiche_portrait', x: -10.23, y: 1.60, z: -11.00, rotY: Math.PI / 2, scale: 1.4,
    image: '/affiches/Savoie_fr.png' },
  { id: 'al2', type: 'bac_cactus',   x:  -9.95, z:  -9.90, rotY: Math.PI / 2, scale: 1 },
  { id: 'al3', type: 'banquette_2p', x:  -6.15, z: -10.60, rotY: -Math.PI / 2 + 0.10, scale: 1 },
  { id: 'al4', type: 'suspension_feuillage', x: -10.00, y: 2.60, z: -10.30, rotY: 0.00, scale: 1 },

  { id: 'ar1', type: 'affiche_paysage', x: 5.77, y: 1.70, z: -11.20, rotY: -Math.PI / 2, scale: 1.3,
    image: '/affiches/paysage.jpg' },
  { id: 'ar2', type: 'bac_cactus',   x:  6.10, z:  -9.90, rotY: -Math.PI / 2, scale: 1 },
  { id: 'ar3', type: 'banquette_2p', x:  9.75, z: -10.40, rotY: -Math.PI / 2, scale: 1 },
  { id: 'ar4', type: 'suspension_feuillage', x: 9.80, y: 2.60, z: -11.60, rotY: 0.60, scale: 1 },
  { id: 'ar5', type: 'sac_boutique', x:  9.60, z: -10.90, rotY: 0.60, scale: 1 },
]


