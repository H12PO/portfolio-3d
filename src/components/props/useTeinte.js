import { useEffect, useMemo } from 'react'
import * as THREE from 'three'

/**
 * Clone un materiau pour qu'une instance puisse changer de couleur sans
 * affecter les autres : useGLTF met les materiaux en cache et les partage
 * entre toutes les instances d'un meme .glb.
 * Sans couleur, le materiau d'origine est renvoye tel quel : aucun clone,
 * donc aucun cout pour les props poses en decor.
 */
export function useTeinte(materiau, couleur) {
  const clone = useMemo(() => {
    if (!couleur) return null
    const m = materiau.clone()
    m.color.set(couleur)
    m.side = THREE.FrontSide
    return m
  }, [materiau, couleur])

  useEffect(() => () => clone?.dispose(), [clone])

  return clone ?? materiau
}