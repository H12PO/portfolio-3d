import { useEffect, useRef, useState } from 'react'
import { charger } from './registre'

// Image réelle d'un projet pour la page Projets : le projet la dessine lui-même
// avec sa fonction apercu(canvas, { theme }). Sans elle, des hachures discrètes.
export default function Apercu({ id, theme }) {
  const ref = useRef(null)
  const [vide, setVide] = useState(false)

  useEffect(() => {
    let annule = false
    const canvas = ref.current
    const e = Math.min(window.devicePixelRatio || 1, 2)
    canvas.width = Math.max(1, Math.round(canvas.clientWidth * e))
    canvas.height = Math.max(1, Math.round(canvas.clientHeight * e))

    charger(id)
      .then((mod) => {
        if (annule) return
        if (mod.apercu) mod.apercu(canvas, { theme })
        else setVide(true)
      })
      .catch(() => { if (!annule) setVide(true) })

    return () => { annule = true }
  }, [id, theme])

  return <canvas ref={ref} data-vide={vide} aria-hidden="true" />
}
