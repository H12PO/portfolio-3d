import { useCallback, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router'
import { useGameStore } from '../store/useGameStore'
import { BOARDING, LANDING } from '../config/doors'

export default function useDoorNavigation() {
  const navigate = useNavigate()
  const { pathname } = useLocation()

  const boardingDoor = useGameStore((s) => s.boardingDoor)
  const boardingTime = useGameStore((s) => s.boardingTime)
  const landingDoor = useGameStore((s) => s.landingDoor)
  const landingTime = useGameStore((s) => s.landingTime)

  const enterDoor = useCallback(() => {
    if (pathname !== '/') return

    const { nearbyDoor, started, boardingDoor, landingDoor } = useGameStore.getState()
    if (!started || !nearbyDoor || boardingDoor || landingDoor) return

    useGameStore.getState().beginBoarding(nearbyDoor)
  }, [pathname])

  // embarquement terminé → on ouvre la page
  useEffect(() => {
    if (!boardingDoor || boardingTime < BOARDING.total) return
    navigate(`/${boardingDoor}`)
    useGameStore.getState().endBoarding()
  }, [boardingDoor, boardingTime, navigate])

  // débarquement : on referme la page à mi-course
  useEffect(() => {
    if (!landingDoor) return

    if (landingTime >= LANDING.routeChange && pathname !== '/') {
      navigate('/')
    }
    if (landingTime >= LANDING.total) {
      useGameStore.getState().endLanding()
    }
  }, [landingDoor, landingTime, pathname, navigate])

  return enterDoor
}