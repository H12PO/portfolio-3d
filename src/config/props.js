// ============================================================
//  MOBILIER — tableau unique, généré par le mode éditeur (touche O)
//  Coordonnées monde absolues. Ne pas éditer à la main :
//  utiliser l'éditeur et coller son export.
// ============================================================

/**

 * Familles de props. Une famille = un comportement et une emprise.
 *   w, d : emprise au sol par défaut, en mètres
 *   color : couleur du rectangle dans l'éditeur
 * Un prop peut surcharger w et d individuellement : c'est ce qui permet
 * des bancs de longueurs différentes sans créer de famille nouvelle.
 */
export const PROP_TYPES = {
  seat:    { w: 3.0, d: 0.9, h: 0.9, color: '#3d6b8f' },
  planter: { w: 1.4, d: 1.1, h: 0.6, color: '#4a8c55' },
}
export const PROPS = [
  { id: 'seat-01',    type: 'seat',    x:  -7, z: -3, rotY: 0, scale: 1.0 },
  { id: 'seat-02',    type: 'seat',    x:   2, z: -3, rotY: 0, scale: 1.0 },
  { id: 'seat-03',    type: 'seat',    x:  -7, z:  3, rotY: 0, scale: 1.0 },
  { id: 'seat-04',    type: 'seat',    x:   7, z:  3, rotY: 0, scale: 1.0 },

  { id: 'planter-01', type: 'planter', x: -13, z: -2, rotY: 0, scale: 1.10 },
  { id: 'planter-02', type: 'planter', x:  13, z: -2, rotY: 0, scale: 1.10 },
  { id: 'planter-03', type: 'planter', x:  -9, z:  8, rotY: 0, scale: 0.95 },
  { id: 'planter-04', type: 'planter', x:   9, z:  8, rotY: 0, scale: 0.95 },
  { id: 'planter-05', type: 'planter', x:  -3, z:  9, rotY: 0, scale: 1.15 },
  { id: 'planter-06', type: 'planter', x:   3, z:  9, rotY: 0, scale: 1.00 },
]