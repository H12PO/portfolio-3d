import { useCallback } from 'react'
import { useNavigate, useLocation } from 'react-router'
import { useGameStore } from '../store/useGameStore'

export default function useDoorNavigation() {
  const navigate = useNavigate()
  const { pathname } = useLocation()

  const enterDoor = useCallback(() => {
    if (pathname !== '/') return

    const { nearbyDoor, started } = useGameStore.getState()
    if (!started || !nearbyDoor) return

    useGameStore.getState().setDestination(null)
    navigate(`/${nearbyDoor}`)
  }, [navigate, pathname])

  return enterDoor
}