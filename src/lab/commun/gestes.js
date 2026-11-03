import { useEffect, useRef } from 'react'

// ============================================================
//  GESTES COMMUNS DES ATELIERS
//  useGestes  : souris et doigts sur le canvas (déplacer, pincer,
//               molette, tracé continu, clic, survol)
//  useClavier : raccourcis clavier, actifs seulement quand l'atelier
//               est visible et que le focus n'est pas dans un champ
//  Les options sont relues à chaque événement : pas de fermeture périmée.
// ============================================================

const SAISIE = ['INPUT', 'TEXTAREA', 'SELECT'] // on y tape du texte : aucun raccourci
const BOUTONS = ['BUTTON', 'SUMMARY']           // Espace et Entrée leur appartiennent

/**
 * @param canvasRef  ref du <canvas>
 * @param options {
 *   vue()            → { zoomer, deplacer, versCase } (ou null tant que rien n'est prêt)
 *   echelle()        → pixels réels par pixel CSS
 *   outil            outil actif ; 'main' déplace la vue
 *   outilsTrace      outils qui dessinent en continu (ex. ['crayon', 'gomme'])
 *   onDebutTrace(c)  appui avec un outil de tracé, sur la case c
 *   onTrace(c)       chaque case parcourue pendant le tracé
 *   onAppui(c)       appui avec un autre outil (poser une fourmi, un motif…)
 *   onSurvol(c)      case sous le pointeur sans appui (null en sortie)
 *   onCamManuelle()  l'utilisateur a bougé la vue lui-même
 * }
 */
export function useGestes(canvasRef, options) {
  const opts = useRef(options)
  const pointeurs = useRef(new Map())
  const derniere = useRef(null)

  useEffect(() => { opts.current = options })

  // Molette : zoom autour du curseur (écouteur non passif pour bloquer le défilement de la page)
  useEffect(() => {
    const canvas = canvasRef.current
    const molette = (e) => {
      const v = opts.current.vue()
      if (!v) return
      e.preventDefault()
      const r = canvas.getBoundingClientRect()
      const s = opts.current.echelle()
      v.zoomer(Math.exp(-e.deltaY * 0.0015), (e.clientX - r.left) * s, (e.clientY - r.top) * s)
      opts.current.onCamManuelle?.()
    }
    canvas.addEventListener('wheel', molette, { passive: false })
    return () => canvas.removeEventListener('wheel', molette)
  }, [canvasRef])

  const versCanvas = (e) => {
    const r = canvasRef.current.getBoundingClientRect()
    const s = opts.current.echelle()
    return { x: (e.clientX - r.left) * s, y: (e.clientY - r.top) * s }
  }

  // Relie les cases entre deux événements pour ne pas laisser de trous dans le tracé
  const tracer = (p) => {
    const c = opts.current.vue().versCase(p.x, p.y)
    const depart = derniere.current ?? c
    const n = Math.max(Math.abs(c.x - depart.x), Math.abs(c.y - depart.y), 1)
    for (let k = 0; k <= n; k++) {
      opts.current.onTrace?.({
        x: Math.round(depart.x + ((c.x - depart.x) * k) / n),
        y: Math.round(depart.y + ((c.y - depart.y) * k) / n),
      })
    }
    derniere.current = c
  }

  const onPointerDown = (e) => {
    const v = opts.current.vue()
    if (!v) return
    e.currentTarget.setPointerCapture(e.pointerId)
    const p = versCanvas(e)
    pointeurs.current.set(e.pointerId, p)
    if (pointeurs.current.size > 1) return
    derniere.current = null
    const { outil, outilsTrace = [] } = opts.current
    if (outilsTrace.includes(outil)) {
      opts.current.onDebutTrace?.(v.versCase(p.x, p.y))
      tracer(p)
    } else if (outil !== 'main') {
      opts.current.onAppui?.(v.versCase(p.x, p.y))
    }
  }

  const onPointerMove = (e) => {
    const v = opts.current.vue()
    if (!v) return
    const p = versCanvas(e)
    const avant = pointeurs.current.get(e.pointerId)
    const { outil, outilsTrace = [] } = opts.current

    if (!avant) {
      opts.current.onSurvol?.(v.versCase(p.x, p.y))
      return
    }
    if (pointeurs.current.size === 2) {
      // Pincement : zoom + déplacement autour du milieu des deux doigts
      const [a, b] = [...pointeurs.current.values()]
      const autre = a === avant ? b : a
      const d0 = Math.hypot(avant.x - autre.x, avant.y - autre.y)
      const d1 = Math.hypot(p.x - autre.x, p.y - autre.y)
      if (d0 > 0) v.zoomer(d1 / d0, (p.x + autre.x) / 2, (p.y + autre.y) / 2)
      v.deplacer((p.x - avant.x) / 2, (p.y - avant.y) / 2)
      opts.current.onCamManuelle?.()
    } else if (outil === 'main') {
      v.deplacer(p.x - avant.x, p.y - avant.y)
      opts.current.onCamManuelle?.()
    } else if (outilsTrace.includes(outil)) {
      tracer(p)
    } else {
      opts.current.onSurvol?.(v.versCase(p.x, p.y))
    }
    pointeurs.current.set(e.pointerId, p)
  }

  const onPointerUp = (e) => {
    pointeurs.current.delete(e.pointerId)
    derniere.current = null
  }

  const onPointerLeave = () => opts.current.onSurvol?.(null)

  return { onPointerDown, onPointerMove, onPointerUp, onPointerCancel: onPointerUp, onPointerLeave }
}

/**
 * @param options { actif, touches: { Space: fn, ArrowRight: fn, … } } (codes KeyboardEvent.code)
 */
export function useClavier(options) {
  const opts = useRef(options)
  useEffect(() => { opts.current = options })

  useEffect(() => {
    const touche = (e) => {
      const { actif, touches } = opts.current
      if (!actif || e.ctrlKey || e.metaKey || e.altKey) return
      if (SAISIE.includes(e.target.tagName) || e.target.isContentEditable) return
      if (BOUTONS.includes(e.target.tagName) && (e.code === 'Space' || e.code === 'Enter')) return
      const action = touches[e.code]
      if (!action) return
      e.preventDefault()
      action()
    }
    window.addEventListener('keydown', touche)
    return () => window.removeEventListener('keydown', touche)
  }, [])
}
