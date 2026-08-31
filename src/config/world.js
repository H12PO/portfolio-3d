export const BOUNDS = {
  minX: -20,
  maxX: 20,
  minZ: -3.4,
  maxZ: 4.3,      // +1.2 m de profondeur jouable
}

export const TERMINAL = {
  length: 52,
  wallZ: -4.6,
  wallHeight: 8,
  glassBase: 0.6,
  glassTop: 6.8,
  transomY: 3.3,
  doorHeight: 3.1,
  floorDepth: 40,
  frontZ: 5.4,       // mobilier reculé, hors du chemin
  railHeight: 0.55,  // barrière basse
  planterH: 0.4,     // bac bas
}


export const BACKDROP = {
  near: -20,
  mid: -35,
  far: -60,
}

export const PALETTE = {
  floor:     '#dcdde2',
  floorLine: '#eef2f6',
  wall:      '#e8e9ed',
  structure: '#c4c7cf',
  mullion:   '#9aa0aa',
  led:       '#f2f7ff',
  glass:     '#bfe0f0',
  sign:      '#2b3440',
  backNear:  '#b6bcc2',
  backMid:   '#c8d4dc',
  backFar:   '#8fc4e8',
}