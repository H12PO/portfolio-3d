import { create } from 'zustand'

export const useGameStore = create((set) => ({
  started: false,
  start: () => set({ started: true }),

  nearbyDoor: null,
  setNearbyDoor: (door) => set((state) =>
    state.nearbyDoor === door ? state : { nearbyDoor: door }
  ),

  destination: null,
  setDestination: (point) => set({ destination: point }),
}))