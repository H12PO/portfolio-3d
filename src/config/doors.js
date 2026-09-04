// ============================================================
//  PORTES
//  A1 et A4 : sur les obliques à ±45°
//  A2 et A3 : au fond des alcôves latérales
//
//  x, z    : centre de l'ouverture, dans le plan du mur
//  rotY    : orientation, la porte regarde vers l'intérieur
//  nx, nz  : normale intérieure, dérivée de rotY
// ============================================================

const Q = Math.PI / 4

export const DOORS = [
  { id: 'parcours',    gate: 'A1', x: -17.5, z:  -3.5, rotY:  Q },
  { id: 'experiences', gate: 'A2', x:  -8,   z: -13,   rotY:  0 },
  { id: 'projets',     gate: 'A3', x:   8,   z: -13,   rotY:  0 },
  { id: 'contact',     gate: 'A4', x:  17.5, z:  -3.5, rotY: -Q },
].map((d) => ({
  ...d,
  nx: Math.sin(d.rotY),
  nz: Math.cos(d.rotY),
}))

export const DOOR_RADIUS = 2.4   // rayon de détection de proximité
export const STAND_OFF   = 1.8   // distance d'arrêt devant la porte
export const WALK_IN     = 1.6   // distance parcourue dans la passerelle

// Séquences, en secondes
export const BOARDING = { doorOpen: 0.7, walkIn: 1.4, total: 2.2 }
export const LANDING  = { ticketIn: 0.5, routeChange: 0.6, walkOut: 1.7, total: 2.2 }