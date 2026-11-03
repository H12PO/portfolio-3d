import { useEffect, useRef, useState } from 'react'

// ============================================================
//  OUTILS COMMUNS DES FIGURES
// ============================================================

// Prépare un canvas à la taille de son affichage (écran haute densité compris)
export function preparer(canvas) {
  const e = Math.min(window.devicePixelRatio || 1, 2)
  canvas.width = Math.max(1, Math.round(canvas.clientWidth * e))
  canvas.height = Math.max(1, Math.round(canvas.clientHeight * e))
  return { ctx: canvas.getContext('2d'), e }
}

// Largeur réelle d'un graphique SVG : le viewBox la suit (1 unité = 1 pixel),
// donc les libellés gardent leur taille, y compris sur mobile
export function useLargeur(defaut) {
  const ref = useRef(null)
  const [largeur, setLargeur] = useState(defaut)
  useEffect(() => {
    const obs = new ResizeObserver(([e]) => setLargeur(Math.max(280, Math.round(e.contentRect.width))))
    obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])
  return [ref, largeur]
}
