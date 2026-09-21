import { useCallback } from 'react'
import { useLocation } from 'react-router'
import { useGameStore } from '../store/useGameStore'
import { INTERACTIFS } from '../config/interactions'

/**
 * Touche E : declenche l'action de l'interactif le plus proche.
 * Ajouter un objet interactif revient a ajouter un cas ici, sans
 * toucher ni au Player ni au Prompt.
 */
export default function useInteraction() {
  const { pathname } = useLocation()

  return useCallback(() => {
    if (pathname !== '/') return
    const s = useGameStore.getState()
    if (!s.started || !s.nearby || s.boardingDoor || s.landingDoor) return

    const it = INTERACTIFS.find((i) => i.id === s.nearby)
    if (!it) return

    switch (it.action) {
      case 'porte':
        s.beginBoarding(it.cle)
        break
      case 'jukebox':
        s.setJukeboxOuvert(true)
        break
      default:
        break
    }
  }, [pathname])
}