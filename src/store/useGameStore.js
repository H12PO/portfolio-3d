import { create } from 'zustand'

export const useGameStore = create((set, get) => ({
  started: false,
  start: () => set({ started: true, phase: 'couloir' }),

  // Un seul mode à la fois : 'play' | 'plan' | 'edit'
  // 'plan' = vue de dessus simple (P), 'edit' = vue de dessus + éditeur (O)
  mode: 'play',
  setMode: (m) => set({ mode: m }),
  toggleMode: (m) => set((s) => ({ mode: s.mode === m ? 'play' : m })),
  /* 'couloir'    → le joueur est dans le poste de securite
     'transition' → il est entre, le couloir est encore monte
     'hall'       → regime normal, couloir demonte */
  phase: 'couloir',
  setPhase: (phase) => set({ phase }),

  nearby: null,
  setNearby: (door) => set((s) =>
    s.nearby === door ? s : { nearby: door }
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

    // Musique. La lecture elle-meme vit dans store/musique.js : ici on ne
  // garde que ce qui declenche un rendu.
  muet: false,
  toggleMuet: () => set((s) => ({ muet: !s.muet })),

  jukeboxOuvert: false,
  setJukeboxOuvert: (v) => set({ jukeboxOuvert: v }),

  titreCourant: null,
  setTitreCourant: (t) => set({ titreCourant: t }),

}))