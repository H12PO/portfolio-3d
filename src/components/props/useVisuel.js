import { useEffect, useMemo } from 'react'
import { useTexture } from '@react-three/drei'
import * as THREE from 'three'

// Affiche par defaut quand un prop n'a pas d'image declaree.
const DEFAUT = '/affiches/defaut.jpg'

/**
 * Applique une image a la surface imprimee d'un prop, par instance :
 * le materiau est clone, donc deux affiches du meme modele peuvent
 * porter deux visuels differents. Meme principe que useTeinte.
 * La texture, elle, reste partagee entre toutes les affiches qui
 * utilisent la meme image : useTexture la met en cache par URL.
 */
export function useVisuel(surface, image) {
  const texture = useTexture(image || DEFAUT)

  const clone = useMemo(() => {
    /* eslint-disable react-hooks/immutability */
    // Les UV d'un glTF ont leur origine en haut a gauche, celles des
    // textures three.js en bas : sans correction, l'image est a l'envers.
    texture.flipY = false
    texture.colorSpace = THREE.SRGBColorSpace    // sinon delavee
    texture.needsUpdate = true
    /* eslint-enable react-hooks/immutability */

    const m = surface.clone()
    m.map = texture
    m.color.set('#ffffff')     // l'image est multipliee par la couleur
    m.side = THREE.FrontSide
    return m
  }, [surface, texture])

  useEffect(() => () => clone.dispose(), [clone])
  return clone
}