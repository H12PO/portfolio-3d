// ============================================================
//  INTERACTIFS
//  Tout ce qu'on peut activer avec la touche E : les portes, et les
//  props dont le type est declare ici. Liste calculee une fois.
// ============================================================

import { DOORS, DOOR_RADIUS, STAND_OFF } from './doors'
import { PROPS } from './props'

/**
 * Par TYPE de prop, ce qui le rend interactif. Tout prop de ce type
 * l'est d'office, a la position ou il est pose dans props.js.
 *   action : cle traitee par useInteraction
 *   rayon  : distance de detection autour du point d'approche
 *   devant : recul du point d'approche, dans l'axe du prop
 */
export const TYPES_INTERACTIFS = {
  jukebox: { action: 'jukebox', rayon: 1.6, devant: 0.9 },
}

// Point ou le joueur doit se tenir : devant l'objet, dans son axe.
// Meme calcul que le STAND_OFF des portes.
function approche(x, z, rotY, recul) {
  return { x: x + Math.sin(rotY) * recul, z: z + Math.cos(rotY) * recul }
}

export const INTERACTIFS = [
  ...DOORS.map((d) => ({
    id: d.id,
    action: 'porte',
    cle: d.id,
    libelle: `doors.${d.id}.label`,
    rayon: DOOR_RADIUS,
    ...approche(d.x, d.z, d.rotY, STAND_OFF),
  })),
  ...PROPS.filter((p) => TYPES_INTERACTIFS[p.type]).map((p) => {
    const t = TYPES_INTERACTIFS[p.type]
    return {
      id: p.id,
      action: t.action,
      cle: p.type,
      libelle: `props.${p.type}.label`,
      rayon: t.rayon,
      ...approche(p.x, p.z, p.rotY ?? 0, t.devant),
    }
  }),
]