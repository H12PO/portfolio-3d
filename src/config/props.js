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
     ZONE 2 — LE SALON  (x -22 → -12.5, z 1 → 9)
     Deux ilots decales, pas une rangee. Le premier contre la
     verriere ouest, le second tourne vers l'axe central pour
     qu'on voie des dossiers de trois quarts en arrivant.
     ============================================================ */
  { id: 'z2-banqdos', type: 'banquette_dos',   x: -20.10, z:  6.30, rotY: Math.PI / 2 + 0.08, scale: 1 },
  { id: 'z2-table',   type: 'table_basse_gd',  x: -18.40, z:  6.60, rotY: 0.15, scale: 1 },
  { id: 'z2-fauteuil',type: 'fauteuil',     x: -17.10, z:  7.30, rotY: -2.20, scale: 1 },
  { id: 'z2-bac-a',   type: 'bac_exotique',    x: -21.30, z:  4.20, rotY: 0.25, scale: 1 },

  { id: 'z2-banq4',   type: 'banquette_4p',    x: -15.40, z:  3.40, rotY: Math.PI / 2 - 0.10, scale: 1 },
  { id: 'z2-ilot',    type: 'banc_ilot',    x: -17.30, z:  3.90, rotY:  1.35, scale: 1 },
  { id: 'z2-bac-b',   type: 'bac_roses',       x: -14.20, z:  5.60, rotY: -0.20, scale: 1 },
  { id: 'z2-bac-c',   type: 'bac_cactus',      x: -13.40, z:  3.40, rotY: 0.15, scale: 1 },
  { id: 'z2-poub',    type: 'poubelle_tri', x: -13.95, z:  6.90, rotY:  0.20, scale: 1 },

  // ce qui rend le salon habite : quelqu'un est passe avant toi
  { id: 'z2-magazine',type: 'magazine',        x: -18.30, y: 0.40, z: 6.40, rotY:  0.60, scale: 1 },
  { id: 'z2-mug',     type: 'mug_isotherme',   x: -18.75, y: 0.40, z: 6.90, rotY:  0.00, scale: 1 },
  { id: 'z2-journal', type: 'journal_ouvert',  x: -15.40, y: 0.45, z: 3.90, rotY: -0.50, scale: 1 },
  { id: 'z2-sacdos',  type: 'bag_sac_a_dos',     x: -19.50, z:  5.50, rotY: 0.90, scale: 1,couleur: '#3f5d52' },
  { id: 'z2-valise',  type: 'bag_valise_cabine', x: -14.60, z:  2.70, rotY: 0.50, scale: 1, couleur: '#b0554c' },

  /* ============================================================
     ZONE 3 — LE JARDIN DE LA VERRIERE  (chanfrein gauche)
     Le mur suit x = -21 - z. Tout est pose entre 0,9 et 1,9 m
     en retrait, en quinconce : une rangee reguliere se verrait
     immediatement. Aucun siege, aucun petit objet : on ne passe
     jamais a moins de 4 m d'ici.
     Aucun type vegetal nouveau — les six sont deja charges.
     ============================================================ */
  /* ============================================================
     ZONE 3 — L'ALLEE DE LA PORTE A1  (chanfrein gauche)
     Le mur suit x = -21 - z, et la porte est dessus a (-17.5, -3.5).
     Deux massifs l'encadrent a 4 m de part et d'autre, le seuil
     reste vide. Le monstera est pose plus en retrait que les
     autres : sans lui les bacs forment une rangee trop sage.
     ============================================================ */
  { id: 'z3-massif',  type: 'jard_massif_fleuri', x: -20.40, z:  1.00, rotY: Math.PI / 4, scale: 1 },
  { id: 'z3-monstera',type: 'sujet_monstera',     x: -21.2, z:  1.5, rotY: 0.55, scale: 0.95 },
  { id: 'z3-champ',   type: 'bac_champetre',      x: -19.45, z: -0.05, rotY: Math.PI / 4 + 0.06, scale: 1 },

  // ---- seuil de A1 : rien entre z = -1 et z = -5 ----

  { id: 'z3-fleuri',  type: 'bac_fleuri',         x: -14.25, z: -5.20, rotY: Math.PI / 4 - 0.04, scale: 1 },
  { id: 'z3-horten',  type: 'bac_hortensias',     x: -12.65, z: -6.85, rotY: Math.PI / 4, scale: 0.90 },

  /* ============================================================
     ZONE 5 — LE PASSAGE  (x -12.5 → -5.5, z 1 → 9)
     Volontairement pauvre : elle borde l'axe d'entree. Un seul
     objet fort, la borne, posee face au joueur qui arrive — c'est
     le premier interactif qu'il croise, donc celui qui lui
     apprend la touche E sans enjeu.
     ============================================================ */
  { id: 'z5-borne',   type: 'borne',           x:  -7.80, z:  4.60, rotY: 0.35, scale: 1 },
  { id: 'z5-bac',     type: 'bac_cactus',      x:  -9.20, z:  4.00, rotY: 0.20, scale: 1 },
  { id: 'z5-banq2',   type: 'banquette_2p',    x: -11.40, z:  6.40, rotY: Math.PI / 2 + 0.15, scale: 1 },
  { id: 'z5-sac',     type: 'bag_sac_voyage', x: -10.70, z: 5.45, rotY: 0.80, scale: 1,couleur: '#2f5d8a' },
  { id: 'z5-carte',   type: 'carte_embarquement', x: -7.20, y: 0.01, z: 5.40, rotY: 0.90, scale: 1,},

  /* ============================================================
     ZONE 9 — LE COIN CALME  (x 5.5 → 12, z 1 → 9)
     Tout est pousse vers x >= 9 : le couloir entre x = 5.5 et 8
     est le chemin direct de l'entree vers la porte A3, il reste
     libre. Un seul groupe, tourne de biais.
     ============================================================ */
  { id: 'z9-banqdos', type: 'banquette_dos',  x: 10.60, z: 5.60, rotY:  0.15, scale: 1 },
  { id: 'z9-table',   type: 'table_basse_gd', x: 10.50, z: 3.90, rotY: -0.20, scale: 1 },
  { id: 'z9-fauteuil',type: 'fauteuil',       x: 11.90, z: 4.30, rotY: -1.20, scale: 1 },
  { id: 'z9-bac',     type: 'bac_roses',      x:  9.20, z: 6.80, rotY:  0.30, scale: 1 },
  { id: 'z9-monstera',type: 'sujet_monstera', x: 11.90, z: 7.20, rotY:  0.50, scale: 0.90 },

  { id: 'z9-livre',   type: 'livre_poche',    x: 10.45, y: 0.40, z: 3.95, rotY: 0.70, scale: 1 },
  { id: 'z9-canette', type: 'canette',        x: 10.70, y: 0.40, z: 4.20, rotY: 0.00, scale: 1 },
  { id: 'z9-mallette',type: 'bag_mallette',   x: 10.00, z: 4.90, rotY: 0.80, scale: 1,
    couleur: '#4a4f55' },

  /* ============================================================
     ZONE 10 — L'ALLEE DE LA PORTE A4  (chanfrein droit)
     Le mur suit x = 21 + z, la porte contact est dessus a
     (17.5, -3.5). Meme grammaire que la zone 3 mais d'autres
     especes et un rythme different : trois en amont dont un
     tres en retrait, deux en aval, seuil vide.
     ============================================================ */
  { id: 'z10-haute',  type: 'jard_haute_mixte', x: 20.10, z:  0.80, rotY: -Math.PI / 4, scale: 1 },
  { id: 'z10-roses',  type: 'bac_roses',        x: 19.30, z: -0.30, rotY: -Math.PI / 4 - 0.05, scale: 1 },
  { id: 'z10-palmier',type: 'sujet_palmier',    x: 18.40, z:  0.90, rotY:  0.40, scale: 1 },

  // ---- seuil de A4 : rien entre z = -1 et z = -5 ----

  { id: 'z10-exo',    type: 'bac_exotique',     x: 14.10, z: -5.05, rotY: -Math.PI / 4 + 0.04, scale: 1 },
  { id: 'z10-champ',  type: 'bac_champetre',    x: 12.70, z: -6.70, rotY: -Math.PI / 4, scale: 1 },

  /* ============================================================
     ZONE 11 — L'ATTENTE DES BAGAGES  (x 12 → 22, z 1 → 9)
     Les assises regardent vers +x, donc vers le carrousel : on
     surveille le tapis. Moins dense que la zone 2, la zone 12
     juste derriere est deja chargee.
     ============================================================ */
  { id: 'z11-banq4',  type: 'banquette_4p',  x: 18.60, z: 5.20, rotY:  Math.PI / 2 + 0.10, scale: 1 },
  { id: 'z11-banq2',  type: 'banquette_2p',  x: 18.20, z: 3.10, rotY:  Math.PI / 2 - 0.12, scale: 1 },
  { id: 'z11-table',  type: 'table_basse_gd',x: 16.90, z: 4.30, rotY:  0.20, scale: 1 },
  { id: 'z11-exo',    type: 'bac_exotique',  x: 15.60, z: 6.40, rotY: -0.25, scale: 1 },
  { id: 'z11-cactus', type: 'bac_cactus',    x: 20.30, z: 2.40, rotY:  0.15, scale: 1 },
  { id: 'z11-poub',   type: 'poubelle_tri',  x: 15.55, z: 7.45, rotY: -0.30, scale: 1 },

  { id: 'z11-gobelets', type: 'porte_gobelets', x: 16.80, y: 0.40, z: 4.20, rotY:  0.50, scale: 1 },
  { id: 'z11-tel',      type: 'telephone',      x: 17.05, y: 0.40, z: 4.55, rotY: -0.80, scale: 1 },
  { id: 'z11-rigide',   type: 'bag_valise_rigide', x: 17.60, z: 6.00, rotY: 0.60, scale: 1,
    couleur: '#4a4f55' },
  { id: 'z11-marin',    type: 'bag_sac_marin',     x: 19.60, z: 4.10, rotY: -0.40, scale: 1,
    couleur: '#b0554c' },





  /* ============================================================
     ZONE 1 — LE COIN DES DEPARTS  (x -27 → -22, z 1 → 9)
     Le panneau des departs occupe deja tout le mur du fond :
     une seule assise, face a lui, et rien d'autre au mur. C'est
     le coin ou on s'assoit pour verifier son vol.
     ============================================================ */
  { id: 'z1-banqtab', type: 'banquette_tablette', x: -24.30, z: 3.60, rotY: Math.PI - 0.12, scale: 1 },
  { id: 'z1-gobelet', type: 'gobelet_cafe',   x: -24.25, y: 0.55, z: 3.55, rotY: 0.00, scale: 1 },
  { id: 'z1-bac',     type: 'bac_exotique',   x: -25.80, z: 5.60, rotY: 0.20, scale: 1 },
  { id: 'z1-poub',    type: 'poubelle_tri',   x: -26.40, z: 4.60, rotY: Math.PI / 2 + 0.10, scale: 1 },
  { id: 'z1-cactus',  type: 'bac_cactus',     x: -22.80, z: 6.60, rotY: 0.25, scale: 1 },
  { id: 'z1-valise',  type: 'bag_valise_rigide', x: -23.40, z: 4.20, rotY: 0.50, scale: 1,
    couleur: '#2f5d8a' },

  /* ============================================================
     ZONE 4 — L'APPROCHE DE A2  (x -12.5 → -5.5, z -9 → 1)
     Le couloir x = -9.5 → -6.5 vers la porte reste vide sur toute
     la profondeur. Tout le mobilier est pousse a gauche, le
     palmier seul marque l'autre bord. Deux poteaux nus encadrent
     la bouche de l'alcove.
     ============================================================ */
  { id: 'z4-banq4',   type: 'banquette_4p',  x: -11.40, z: -4.20, rotY: Math.PI / 2 + 0.10, scale: 1 },
  { id: 'z4-banq2',   type: 'banquette_2p',  x: -11.60, z: -6.60, rotY: Math.PI / 2 - 0.15, scale: 1 },
  { id: 'z4-exo',     type: 'bac_exotique',  x: -12.10, z: -2.20, rotY: 0.20, scale: 1 },
  { id: 'z4-cactus',  type: 'bac_cactus',    x: -10.10, z: -7.60, rotY: -0.25, scale: 1 },
  { id: 'z4-palmier', type: 'sujet_palmier', x:  -6.40, z: -3.60, rotY: 0.40, scale: 1 },
  { id: 'z4-pot-g',   type: 'barriere_poteau', x: -10.30, z: -8.40, rotY: 0, scale: 1 },
  { id: 'z4-pot-d',   type: 'barriere_poteau', x:  -5.90, z: -8.40, rotY: 0, scale: 1 },
  { id: 'z4-magazine',type: 'magazine',      x: -11.40, y: 0.45, z: -3.60, rotY: 0.60, scale: 1 },
  { id: 'z4-sac',     type: 'bag_sac_voyage',x: -10.70, z: -5.20, rotY: 0.70, scale: 1,
    couleur: '#3f5d52' },

  /* ============================================================
     ZONE 6 — LE COIN CAFE  (x -5.5 → 5.5, z -9 → 1)
     Le cœur chaud du hall. Jukebox et arcade cote a cote contre
     le mur du fond, a deux pas du stand : c'est le seul endroit
     qui a une raison d'etre bruyant. Le couloir central x = -2 → 2
     vers le stand reste libre.
     ============================================================ */
  { id: 'z6-jukebox', type: 'jukebox', x: 4.20, y: -0.058, z: -8.42, rotY: 0.00, scale: 1 },
  { id: 'z6-arcade',  type: 'arcade',  x: 2.90, z: -8.35, rotY: 0.15, scale: 1 },

  { id: 'z6-table-g', type: 'table_basse_gd', x: -2.60, z: -6.20, rotY:  0.25, scale: 1 },
  { id: 'z6-fauteuil',type: 'fauteuil',       x: -3.60, z: -5.40, rotY: -0.90, scale: 1 },
  { id: 'z6-ilot',    type: 'banc_ilot',      x: -1.50, z: -7.20, rotY:  0.40, scale: 1 },
  { id: 'z6-table-d', type: 'table_basse_gd', x:  3.10, z: -5.60, rotY: -0.20, scale: 1 },
  { id: 'z6-banq2',   type: 'banquette_2p',   x:  4.30, z: -4.90, rotY: -Math.PI / 2 + 0.20, scale: 1 },
  { id: 'z6-fleuri',  type: 'bac_fleuri',     x: -4.60, z: -3.40, rotY:  0.15, scale: 1 },
  { id: 'z6-exo',     type: 'bac_exotique',   x:  4.70, z: -2.60, rotY: -0.20, scale: 1 },

  { id: 'z6-gobelet', type: 'gobelet_cafe',   x: -2.55, y: 0.40, z: -6.10, rotY:  0.00, scale: 1 },
  { id: 'z6-snack',   type: 'sachet_snack',   x: -2.80, y: 0.40, z: -6.40, rotY:  0.80, scale: 1 },
  { id: 'z6-gobelets',type: 'porte_gobelets', x:  3.05, y: 0.40, z: -5.50, rotY:  0.40, scale: 1 },
  { id: 'z6-casque',  type: 'casque_audio',   x:  3.30, y: 0.40, z: -5.80, rotY: -0.50, scale: 1 },
  { id: 'z6-sacdos',  type: 'bag_sac_a_dos',  x: -3.10, z: -4.60, rotY: 0.60, scale: 1,
    couleur: '#b0554c' },

  /* ============================================================
     ZONE 8 — L'APPROCHE DE A3  (x 5.5 → 12, z -9 → 1)
     Miroir de la zone 4 mais d'autres especes, et le sujet isole
     est un monstera la ou la zone 4 a un palmier.
     ============================================================ */
  { id: 'z8-banq4',   type: 'banquette_4p',   x: 11.20, z: -4.60, rotY: -Math.PI / 2 - 0.10, scale: 1 },
  { id: 'z8-banq2',   type: 'banquette_2p',   x: 11.40, z: -6.90, rotY: -Math.PI / 2 + 0.15, scale: 1 },
  { id: 'z8-champ',   type: 'bac_champetre',  x: 11.90, z: -2.40, rotY: -0.20, scale: 1 },
  { id: 'z8-roses',   type: 'bac_roses',      x: 10.10, z: -7.70, rotY:  0.25, scale: 1 },
  { id: 'z8-monstera',type: 'sujet_monstera', x:  6.30, z: -3.80, rotY: -0.40, scale: 0.95 },
  { id: 'z8-pot-g',   type: 'barriere_poteau', x:  5.90, z: -8.40, rotY: 0, scale: 1 },
  { id: 'z8-pot-d',   type: 'barriere_poteau', x: 10.30, z: -8.40, rotY: 0, scale: 1 },
  { id: 'z8-journal', type: 'journal_plie',   x: 11.20, y: 0.45, z: -4.00, rotY: -0.70, scale: 1 },
  { id: 'z8-cabine',  type: 'bag_valise_cabine', x: 10.50, z: -5.60, rotY: -0.50, scale: 1,
    couleur: '#2f5d8a' },

  /* ============================================================
     ZONE 13 — ALCOVE A2 « EXPERIENCES »  (x -10.5 → -5.5, z -13 → -9)
     Seul endroit du hall qui ait un plafond : c'est la et nulle
     part ailleurs que les suspensions servent a quelque chose.
     L'axe x = -9.5 → -6.5 est vide sur toute la profondeur.
     ============================================================ */
  { id: 'z13-affiche',type: 'affiche_portrait', x: -10.23, y: 1.60, z: -11.00, rotY: Math.PI / 2, scale: 1.4,
    image: '/affiches/Savoie_fr.png' },
  { id: 'z13-cactus', type: 'bac_cactus',     x: -9.95, z: -9.90, rotY: Math.PI / 2, scale: 1 },
  { id: 'z13-banq2',  type: 'banquette_2p',   x: -6.30, z: -10.60, rotY: -Math.PI / 2 + 0.10, scale: 1 },
  { id: 'z13-susp',   type: 'suspension_feuillage', x: -10.00, y: 2.60, z: -10.30, rotY: 0, scale: 1 },

  /* ============================================================
     ZONE 14 — ALCOVE A3 « PROJETS »  (x 5.5 → 10.5, z -13 → -9)
     ============================================================ */
  { id: 'z14-affiche',type: 'affiche_paysage', x: 5.77, y: 1.70, z: -11.20, rotY: -Math.PI / 2, scale: 1.3,
    image: '/affiches/paysage.jpg' },
  { id: 'z14-banq2',  type: 'banquette_2p',   x: 9.75, z: -10.40, rotY: -Math.PI / 2, scale: 1 },
  { id: 'z14-cactus', type: 'bac_cactus',     x: 6.10, z: -9.90, rotY: -Math.PI / 2, scale: 1 },
  { id: 'z14-susp',   type: 'suspension_feuillage', x: 9.80, y: 2.60, z: -11.60, rotY: 0.60, scale: 1 },
  { id: 'z14-sac',    type: 'sac_boutique',   x: 9.60, z: -10.90, rotY: 0.60, scale: 1 },







]


