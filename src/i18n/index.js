import { create } from 'zustand'
import fr from './fr.json'
import en from './en.json'

const DICTIONARIES = { fr, en }
const FALLBACK = 'fr'

function detectLanguage() {
  const saved = localStorage.getItem('lang')
  if (saved && DICTIONARIES[saved]) return saved

  const browser = navigator.language?.slice(0, 2)
  return DICTIONARIES[browser] ? browser : FALLBACK
}

export const useLangStore = create((set) => ({
  lang: detectLanguage(),
  setLang: (lang) => {
    localStorage.setItem('lang', lang)
    document.documentElement.lang = lang
    set({ lang })
  },
}))

function resolve(dict, path) {
  return path.split('.').reduce((acc, key) => acc?.[key], dict)
}

export function useT() {
  const lang = useLangStore((s) => s.lang)

  return (path) => {
    const value = resolve(DICTIONARIES[lang], path)
    if (value !== undefined) return value

    const fallback = resolve(DICTIONARIES[FALLBACK], path)
    if (fallback !== undefined) return fallback

    console.warn(`[i18n] clé manquante : ${path}`)
    return path
  }
}