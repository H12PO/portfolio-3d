import { useEffect, useRef } from 'react'

const MAP = {
  KeyW: 'forward',  KeyZ: 'forward',  ArrowUp: 'forward',
  KeyS: 'backward',                   ArrowDown: 'backward',
  KeyA: 'left',     KeyQ: 'left',     ArrowLeft: 'left',
  KeyD: 'right',                      ArrowRight: 'right',
}

export default function useKeyboard(onInteract) {
  const keys = useRef({
    forward: false,
    backward: false,
    left: false,
    right: false,
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

      const action = MAP[e.code]
      if (action) keys.current[action] = true
    }

    const up = (e) => {
      const action = MAP[e.code]
      if (action) keys.current[action] = false
    }

    const blur = () => {
      keys.current.forward = false
      keys.current.backward = false
      keys.current.left = false
      keys.current.right = false
    }

    window.addEventListener('keydown', down)
    window.addEventListener('keyup', up)
    window.addEventListener('blur', blur)

    return () => {
      window.removeEventListener('keydown', down)
      window.removeEventListener('keyup', up)
      window.removeEventListener('blur', blur)
    }
  }, [])

  return keys
}