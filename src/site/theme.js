import { create } from 'zustand'

// ============================================================
//  THÈME CLAIR / SOMBRE DU SITE VITRINE
//  Par défaut, suit le réglage de l'appareil du visiteur.
//  Dès qu'il clique sur le bouton, son choix est retenu.
// ============================================================

const CLE = 'theme'
const requete = typeof window !== 'undefined' && window.matchMedia
  ? window.matchMedia('(prefers-color-scheme: dark)')
  : null

function lireChoix() {
  try {
    const v = localStorage.getItem(CLE)
    return v === 'clair' || v === 'sombre' ? v : null
  } catch {
    return null // stockage indisponible (navigation privée…)
  }
}

export const useThemeStore = create((set, get) => ({
  choix: lireChoix(),                          // null = suit le système
  systeme: requete?.matches ? 'sombre' : 'clair',
  basculer: () => {
    const actuel = get().choix ?? get().systeme
    const suivant = actuel === 'sombre' ? 'clair' : 'sombre'
    try { localStorage.setItem(CLE, suivant) } catch { /* choix gardé pour la session */ }
    set({ choix: suivant })
  },
}))

// Le système change pendant la visite (passage en mode nuit…) : on suit
requete?.addEventListener('change', (e) => useThemeStore.setState({ systeme: e.matches ? 'sombre' : 'clair' }))

// 'clair' ou 'sombre'
export const useTheme = () => useThemeStore((s) => s.choix ?? s.systeme)
