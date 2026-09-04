import { create } from 'zustand'

export const useGameStore = create((set, get) => ({
  started: false,
  start: () => set({ started: true }),

  topDown: false,
  toggleTopDown: () => set((s) => ({ topDown: !s.topDown })),

  nearbyDoor: null,
  setNearbyDoor: (door) => set((s) =>
    s.nearbyDoor === door ? s : { nearbyDoor: door }
  ),

  destination: null,
  setDestination: (point) => set({ destination: point }),

  boardingDoor: null,
  boardingTime: 0,
  landingDoor: null,
  landingTime: 0,
  lastDoor: null,

  beginBoarding: (doorId) => {
    if (get().boardingDoor || get().landingDoor) return
    set({ boardingDoor: doorId, boardingTime: 0, destination: null, lastDoor: doorId })
  },
  tickBoarding: (delta) => set((s) => ({ boardingTime: s.boardingTime + delta })),
  endBoarding: () => set({ boardingDoor: null, boardingTime: 0 }),

  beginLanding: (doorId) => {
    if (get().landingDoor || get().boardingDoor) return
    set({ landingDoor: doorId, landingTime: 0, destination: null })
  },
  tickLanding: (delta) => set((s) => ({ landingTime: s.landingTime + delta })),
  endLanding: () => set({ landingDoor: null, landingTime: 0 }),
}))