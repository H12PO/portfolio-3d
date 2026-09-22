import { useEffect, useMemo } from 'react'
import { useTexture } from '@react-three/drei'
import * as THREE from 'three'
import { useLangStore } from '../../i18n'

// Affiche par defaut quand un prop n'a pas d'image declaree.
const DEFAUT = '/affiches/defaut.jpg'
const FALLBACK = 'fr'

/**
 * Applique une image a la surface imprimee d'un prop, par instance :
 * le materiau est clone, donc deux affiches du meme modele portent
 * deux visuels differents. La texture, elle, reste partagee entre
 * toutes les affiches qui utilisent la meme image.
 *
 * `image` est soit un chemin, soit un objet { fr, en } quand le visuel
 * depend de la langue : une affiche de consignes se traduit, un plan
 * ou une photo non.
 */
export function useVisuel(surface, image) {
  const lang = useLangStore((s) => s.lang)

  const url = typeof image === 'string'
    ? image
    : (image?.[lang] ?? image?.[FALLBACK] ?? DEFAUT)

  const texture = useTexture(url)

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