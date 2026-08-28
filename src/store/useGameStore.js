import { create } from 'zustand'

export const useGameStore = create((set, get) => ({
  nearbyDoor: null,
  setNearbyDoor: (door) => set((state) =>
    state.nearbyDoor === door ? state : { nearbyDoor: door }
  ),

  destination: null,
  setDestination: (point) => set({ destination: point }),

  activeDoor: null,
  enterDoor: () => {
    const { nearbyDoor, activeDoor } = get()
    if (!nearbyDoor || activeDoor) return
    set({ activeDoor: nearbyDoor, destination: null })
  },
  exitDoor: () => set({ activeDoor: null }),
}))