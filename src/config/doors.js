export const DOORS = [
  { id: 'parcours',    gate: 'A1', x: -14 },
  { id: 'experiences', gate: 'A2', x: -5 },
  { id: 'projets',     gate: 'A3', x: 5 },
  { id: 'contact',     gate: 'A4', x: 14 },
]

export const DOOR_Z = -4
export const DOOR_RADIUS = 2

// Embarquement : le joueur entre dans la porte
export const BOARDING = {
  doorOpen: 0.7,
  walkIn: 1.4,
  total: 2.2,
}

// Débarquement : le joueur ressort
export const LANDING = {
  ticketIn: 0.5,      // le ticket entre et couvre
  routeChange: 0.6,   // la page disparaît sous le ticket
  walkOut: 1.7,       // le joueur ressort
  total: 2.2,
}