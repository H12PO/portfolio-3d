export const BOUNDS = {
  minX: -20,
  maxX: 20,
  minZ: -3.4,
  maxZ: 3.6,
}

// ⚠️ Ces cotes sont la référence pour la modélisation Blender.
// Toute modification ici doit être reportée dans le fichier .blend.
export const TERMINAL = {
  length: 52,        // longueur du couloir
  wallZ: -4.6,       // plan de la façade vitrée
  wallHeight: 4.6,   // hauteur sous plafond
  floorDepth: 34,    // sol, déborde largement du cadre
  ceilingFront: 12,  // le plafond dépasse la caméra
}

// Plans de fond, remplacés par des images texturées en phase 7
export const BACKDROP = {
  near: -20,   // avion + passerelle → 3D en Blender
  mid: -35,    // tour de contrôle, terminal d'en face → image
  far: -60,    // ciel, nuages, horizon → image
}

export const PALETTE = {
  floor:     '#dcdde2',
  floorLine: '#eef2f6',
  wall:      '#e8e9ed',
  structure: '#c4c7cf',
  mullion:   '#9aa0aa',
  ceiling:   '#eceef1',
  led:       '#f2f7ff',
  glass:     '#bfe0f0',
  sign:      '#2b3440',
  backNear:  '#b6bcc2',
  backMid:   '#c8d4dc',
  backFar:   '#8fc4e8',
}