// ============================================================
//  PORTES — deux sur le mur du fond, deux sur les pans coupés
//  normale = (sin rotY, 0, cos rotY), pointe vers l'intérieur
// ============================================================

const Q = Math.PI / 4

export const DOORS = [
  { id: 'parcours',    gate: 'A1', x: -15, z:  -8, rotY:  Q },
  { id: 'experiences', gate: 'A2', x:  -9, z: -11, rotY:  0 },
  { id: 'projets',     gate: 'A3', x:   9, z: -11, rotY:  0 },
  { id: 'contact',     gate: 'A4', x:  15, z:  -8, rotY: -Q },
].map((d) => ({
  ...d,
  nx: Math.sin(d.rotY),
  nz: Math.cos(d.rotY),
}))

export const DOOR_RADIUS = 2.6   // rayon de détection de proximité
export const STAND_OFF   = 1.9   // distance d'arrêt devant la porte
export const WALK_IN     = 1.4   // distance parcourue dans la passerelle

// Séquences, en secondes
export const BOARDING = { doorOpen: 0.7, walkIn: 1.4, total: 2.2 }
export const LANDING  = { ticketIn: 0.5, routeChange: 0.6, walkOut: 1.7, total: 2.2 }