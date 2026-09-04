import { useEffect, useRef } from 'react'

const MAP = {
  KeyW: 'forward',  KeyZ: 'forward',  ArrowUp: 'forward',
  KeyS: 'backward',                   ArrowDown: 'backward',
  KeyA: 'left',     KeyQ: 'left',     ArrowLeft: 'left',
  KeyD: 'right',                      ArrowRight: 'right',
}

/**
 * Entrées du joueur, agrégées dans un ref (aucun re-render).
 *
 *   move  : intention de déplacement en repère écran, longueur ≤ 1.
 *           x > 0 vers la droite, z > 0 vers la caméra.
 *   stick : part écrite par le joystick tactile. Après l'avoir modifié,
 *           appeler sync() pour recomposer move.
 */
export default function useInput(onInteract) {
  const state = useRef({
    move: { x: 0, z: 0 },
    stick: { x: 0, z: 0 },
    zoomDelta: 0,
    sync: () => {},
  })

  const held = useRef({
    forward: false, backward: false, left: false, right: false,
  })

  const callback = useRef(onInteract)
  callback.current = onInteract

  useEffect(() => {
    const s = state.current
    const h = held.current

    // Clavier et joystick s'additionnent dans le même vecteur.
    // On ne ramène à 1 que ce qui dépasse : la diagonale clavier (1,1)
    // est corrigée, mais une poussée douce du joystick garde son dosage.
    const sync = () => {
      let x = (h.right ? 1 : 0) - (h.left ? 1 : 0) + s.stick.x
      let z = (h.backward ? 1 : 0) - (h.forward ? 1 : 0) + s.stick.z
      const len = Math.hypot(x, z)
      if (len > 1) {
        x /= len
        z /= len
      }
      s.move.x = x
      s.move.z = z
    }
    s.sync = sync

    const down = (e) => {
      if (e.repeat) return

      if (e.code === 'KeyE' || e.code === 'Space' || e.code === 'Enter') {
        e.preventDefault()
        callback.current?.()
        return
      }

      const a = MAP[e.code]
      if (!a) return
      if (e.code.startsWith('Arrow')) e.preventDefault()   // sinon la page défile
      h[a] = true
      sync()
    }

    const up = (e) => {
      const a = MAP[e.code]
      if (!a) return
      h[a] = false
      sync()
    }

    const blur = () => {
      h.forward = h.backward = h.left = h.right = false
      s.stick.x = s.stick.z = 0
      sync()
    }

    const onWheel = (e) => { s.zoomDelta += e.deltaY * 0.01 }

    window.addEventListener('keydown', down)
    window.addEventListener('keyup', up)
    window.addEventListener('blur', blur)
    window.addEventListener('wheel', onWheel, { passive: true })

    return () => {
      window.removeEventListener('keydown', down)
      window.removeEventListener('keyup', up)
      window.removeEventListener('blur', blur)
      window.removeEventListener('wheel', onWheel)
    }
  }, [])

  return state
}