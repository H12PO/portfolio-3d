import { useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router'
import { useGameStore } from '../store/useGameStore'
import { BOARDING, LANDING } from '../config/doors'

/**
 * Effets des sequences de porte : ouvre la page a la fin de
 * l'embarquement, la referme pendant le debarquement.
 * Le declenchement, lui, passe par useInteraction.
 */
export default function useDoorNavigation() {
  const navigate = useNavigate()
  const { pathname } = useLocation()

  const boardingDoor = useGameStore((s) => s.boardingDoor)
  const boardingTime = useGameStore((s) => s.boardingTime)
  const landingDoor = useGameStore((s) => s.landingDoor)
  const landingTime = useGameStore((s) => s.landingTime)

  useEffect(() => {
    if (!boardingDoor || boardingTime < BOARDING.total) return
    navigate(`/${boardingDoor}`)
    useGameStore.getState().endBoarding()
  }, [boardingDoor, boardingTime, navigate])

  useEffect(() => {
    if (!landingDoor) return
    if (landingTime >= LANDING.routeChange && pathname !== '/') {
      navigate('/')
    }
    if (landingTime >= LANDING.total) {
      useGameStore.getState().endLanding()
    }
  }, [landingDoor, landingTime, pathname, navigate])
}