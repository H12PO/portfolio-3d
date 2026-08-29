export const BOUNDS = {
  minX: -20,
  maxX: 20,
  minZ: -3.4,
  maxZ: 3.6,
}

// ⚠️ COTES DE RÉFÉRENCE POUR BLENDER — ne pas modifier à la légère
export const TERMINAL = {
  length: 52,
  wallZ: -4.6,
  wallHeight: 8,      // pas de plafond : le mur sort du cadre par le haut
  glassBase: 0.6,     // hauteur de l'allège
  glassTop: 6.8,      // sous le bandeau haut
  transomY: 3.3,      // traverse horizontale, alignée sur les linteaux de porte
  doorHeight: 3.1,
  floorDepth: 40,
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