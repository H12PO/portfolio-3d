import { useEffect, useRef } from 'react'

const MAP = {
  KeyW: 'forward',  KeyZ: 'forward',  ArrowUp: 'forward',
  KeyS: 'backward',                   ArrowDown: 'backward',
  KeyA: 'left',     KeyQ: 'left',     ArrowLeft: 'left',
  KeyD: 'right',                      ArrowRight: 'right',
}

export default function useKeyboard(onInteract) {
  const keys = useRef({
    forward: false, backward: false, left: false, right: false,
    turn: 0,        // -1 ou +1 : un cran demandé
    zoomDelta: 0,
  })

  const callback = useRef(onInteract)
  callback.current = onInteract

  useEffect(() => {
    const down = (e) => {
      if (e.repeat) return

      if (e.code === 'KeyE' || e.code === 'Space' || e.code === 'Enter') {
        e.preventDefault()
        callback.current?.()
        return
      }

      // rotation par crans
      if (e.code === 'KeyR' || e.code === 'Comma') { keys.current.turn = -1; return }
      if (e.code === 'KeyT' || e.code === 'Period') { keys.current.turn = 1; return }

      const a = MAP[e.code]
      if (a) keys.current[a] = true
    }

    const up = (e) => {
      const a = MAP[e.code]
      if (a) keys.current[a] = false
    }

    const blur = () => {
      keys.current.forward = keys.current.backward = false
      keys.current.left = keys.current.right = false
    }

    const onWheel = (e) => { keys.current.zoomDelta += e.deltaY * 0.01 }

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

  return keys
}