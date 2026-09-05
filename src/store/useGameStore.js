import { create } from 'zustand'

export const useGameStore = create((set, get) => ({
  started: false,
  start: () => set({ started: true }),

  // Un seul mode à la fois : 'play' | 'plan' | 'edit'
  // 'plan' = vue de dessus simple (P), 'edit' = vue de dessus + éditeur (O)
  mode: 'play',
  setMode: (m) => set({ mode: m }),
  toggleMode: (m) => set((s) => ({ mode: s.mode === m ? 'play' : m })),

  nearbyDoor: null,
  setNearbyDoor: (door) => set((s) =>
    s.nearbyDoor === door ? s : { nearbyDoor: door }
  ),

  boardingDoor: null,
  boardingTime: 0,
  landingDoor: null,
  landingTime: 0,
  lastDoor: null,

  beginBoarding: (doorId) => {
    if (get().boardingDoor || get().landingDoor) return
    set({ boardingDoor: doorId, boardingTime: 0, lastDoor: doorId })
  },
  tickBoarding: (delta) => set((s) => ({ boardingTime: s.boardingTime + delta })),
  endBoarding: () => set({ boardingDoor: null, boardingTime: 0 }),

  beginLanding: (doorId) => {
    if (get().landingDoor || get().boardingDoor) return
    set({ landingDoor: doorId, landingTime: 0 })
  },
  tickLanding: (delta) => set((s) => ({ landingTime: s.landingTime + delta })),
  endLanding: () => set({ landingDoor: null, landingTime: 0 }),
}))