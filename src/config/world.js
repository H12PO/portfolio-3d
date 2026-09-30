// ============================================================
//  CONCOURSE — cotes de référence
//  Repère : X droite, Z vers la caméra, Y hauteur. Origine au centre.
//  ⚠️ Toute cote modifiée ici doit l'être aussi dans Blender.
// ============================================================

export const HALL = {
  wallHeight: 8,
  glassBase: 0.6,
  glassTop: 6.8,
  transomY: 3.3,
  mullionGap: 3.2,

  doorHeight: 3.1,
  doorWidth: 2.9,
  
  frontZ: 9,
  floorSize: 120,

  alcoveCeiling: 3.5,   // plafond bas des creux
  alcoveBanner: 1.5,    // bandeau plein au-dessus, porte l'enseigne

}

// ---- Contour, sens horaire depuis l'avant-gauche ----
export const OUTLINE = [
  [-27,    9],   //  0  extrémité avant gauche
  [-27,    1],   //  1
  [-22,    1],   //  2  mur face caméra gauche, 5 m
  [-12,   -9],   //  3  oblique gauche, 45°
  [-10.5, -9],   //  4
  [-10.5,-13],   //  5  alcôve A2, 5 × 4
  [ -5.5,-13],   //  6
  [ -5.5, -9],   //  7
  [ -2.5, -9],   //  8  baie gauche, 3 m
  [ -2.5,-12.5], //  9  niche cookies, 5 × 3,5
  [  2.5,-12.5], // 10
  [  2.5, -9],   // 11
  [  5.5, -9],   // 12  baie droite, 3 m
  [  5.5,-13],   // 13  alcôve A3, 5 × 4
  [ 10.5,-13],   // 14
  [ 10.5, -9],   // 15
  [ 12,   -9],   // 16
  [ 22,    1],   // 17  oblique droite, 45°
  [ 27,    1],   // 18  mur face caméra droit, 5 m
  [ 27,    9],   // 19
]


// ---- Emprise du contour, dérivée. Aucune cote d'emprise ailleurs. ----
const _xs = OUTLINE.map((p) => p[0])
const _zs = OUTLINE.map((p) => p[1])
const _minX = Math.min(..._xs), _maxX = Math.max(..._xs)
const _minZ = Math.min(..._zs), _maxZ = Math.max(..._zs)

export const BOUNDS = {
  minX: _minX, maxX: _maxX,     // -27 → 27
  minZ: _minZ, maxZ: _maxZ,     // -13 →  9
  spanX: _maxX - _minX,         // 54
  spanZ: _maxZ - _minZ,         // 22
  cx: (_minX + _maxX) / 2,      //  0
  cz: (_minZ + _maxZ) / 2,      // -2
}
export const ENTREE = {
  demiLargeur: 3.5,
  zBouche: 9,         // = BOUNDS.maxZ
  zFond: 27,
  zMaxJoueur: 13,
  spawnZ: 18,
  zVerrou: 8.5,
}

export function clampToCouloir(pos) {
  const l = ENTREE.demiLargeur - MARGIN
  if (pos.x >  l) pos.x =  l
  if (pos.x < -l) pos.x = -l
  if (pos.z > ENTREE.zMaxJoueur) pos.z = ENTREE.zMaxJoueur
}

// ---- Murs. `low` : plafond d'alcôve abaissé ----
export const WALLS = [
  { a: 0,  b: 1,  glazed: false, name: 'retour-gauche' },
  { a: 1,  b: 2,  glazed: false, name: 'face-camera-gauche' },
  { a: 2,  b: 3,  glazed: true,  name: 'oblique-gauche' },
  { a: 3,  b: 4,  glazed: true,  name: 'fond-gauche' },
  { a: 4,  b: 5,  glazed: false, low: true, name: 'A2-joue-g' },
  { a: 5,  b: 6,  glazed: false, low: true, name: 'A2-fond' },
  { a: 6,  b: 7,  glazed: false, low: true, name: 'A2-joue-d' },
  { a: 7,  b: 8,  glazed: true,  name: 'baie-gauche' },
  { a: 8,  b: 9,  glazed: false, low: true, name: 'niche-joue-g' },
  { a: 9,  b: 10, glazed: false, low: true, name: 'niche-fond' },
  { a: 10, b: 11, glazed: false, low: true, name: 'niche-joue-d' },
  { a: 11, b: 12, glazed: true,  name: 'baie-droite' },
  { a: 12, b: 13, glazed: false, low: true, name: 'A3-joue-g' },
  { a: 13, b: 14, glazed: false, low: true, name: 'A3-fond' },
  { a: 14, b: 15, glazed: false, low: true, name: 'A3-joue-d' },
  { a: 15, b: 16, glazed: true,  name: 'fond-droit' },
  { a: 16, b: 17, glazed: true,  name: 'oblique-droite' },
  { a: 17, b: 18, glazed: false, name: 'face-camera-droit' },
  { a: 18, b: 19, glazed: false, name: 'retour-droit' },
]

// ---- Les trois creux : emprise et identité ----
export const RECESSES = [
  { id: 'A2',      minX: -10.5, maxX: -5.5, minZ: -13,   maxZ: -9 },
  { id: 'cookies', minX:  -2.5, maxX:  2.5, minZ: -12.5, maxZ: -9 },
  { id: 'A3',      minX:   5.5, maxX: 10.5, minZ: -13,   maxZ: -9 },
]


// ============================================================
//  ZONE JOUABLE — test point-dans-polygone
//  Une forme concave avec des creux ne peut pas se traiter par
//  demi-plans : la contrainte d'un mur s'appliquerait partout.
// ============================================================

const MARGIN = 0.6

// Polygone fermé : le contour, refermé par le bord avant.
const POLY = OUTLINE

function pointInPolygon(x, z) {
  let inside = false
  for (let i = 0, j = POLY.length - 1; i < POLY.length; j = i++) {
    const [xi, zi] = POLY[i]
    const [xj, zj] = POLY[j]
    if ((zi > z) !== (zj > z) &&
        x < ((xj - xi) * (z - zi)) / (zj - zi) + xi) {
      inside = !inside
    }
  }
  return inside
}

// Point le plus proche sur un segment, écrit dans `out`
function closestOnSegment(px, pz, ax, az, bx, bz, out) {
  const dx = bx - ax
  const dz = bz - az
  const l2 = dx * dx + dz * dz
  let t = l2 === 0 ? 0 : ((px - ax) * dx + (pz - az) * dz) / l2
  t = t < 0 ? 0 : t > 1 ? 1 : t
  out.x = ax + t * dx
  out.z = az + t * dz
}

const _c = { x: 0, z: 0 }
const _best = { x: 0, z: 0 }

// Distance au bord le plus proche, et point associé
function nearestEdge(x, z) {
  let bestD2 = Infinity
  for (let i = 0, j = POLY.length - 1; i < POLY.length; j = i++) {
    closestOnSegment(x, z, POLY[j][0], POLY[j][1], POLY[i][0], POLY[i][1], _c)
    const dx = x - _c.x
    const dz = z - _c.z
    const d2 = dx * dx + dz * dz
    if (d2 < bestD2) {
      bestD2 = d2
      _best.x = _c.x
      _best.z = _c.z
    }
  }
  return Math.sqrt(bestD2)
}

/** Vrai si le point est dans la zone jouable, marge comprise. */
export function isInsideHall(x, z, margin = MARGIN) {
  if (!pointInPolygon(x, z)) return false
  return nearestEdge(x, z) >= margin
}

/**
 * Ramène un point dans la zone jouable. Mute et retourne {x, z}.
 * Projette sur le bord le plus proche, ce qui produit le glissement
 * le long des murs quelle que soit leur orientation.
 */
export function clampToHall(p, margin = MARGIN) {
  for (let pass = 0; pass < 2; pass++) {
    const inside = pointInPolygon(p.x, p.z)
    const d = nearestEdge(p.x, p.z)
    if (inside && d >= margin) return p

    let dx = p.x - _best.x
    let dz = p.z - _best.z
    const len = Math.hypot(dx, dz)

    if (len > 1e-5) {
      dx /= len
      dz /= len
    } else {
      dx = 0
      dz = 1
    }
    if (!inside) {
      dx = -dx
      dz = -dz
    }
    p.x = _best.x + dx * margin
    p.z = _best.z + dz * margin
  }
  return p
}

export const PALETTE = {
  floor:     '#e6e3dd',
  joint:     '#c9c4ba',
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