/**
 * Lecteur audio. L'element <audio> vit ici, hors de React : sa position
 * de lecture change soixante fois par seconde et n'a rien a faire dans
 * du state. Le jukebox la lit directement dans son useFrame.
 *
 * Seuls le morceau courant et l'etat muet passent par le store Zustand,
 * puisque eux declenchent un rendu.
 */
import { MORCEAUX, PLAYLIST_DEFAUT } from '../config/musique'

export const AUDIO = {
  el: null,
  index: 0,
  onChange: null,      // appele quand le morceau change
}

function element() {
  if (AUDIO.el) return AUDIO.el
  const a = new Audio()
  a.volume = 0.45
  a.addEventListener('ended', suivant)
  AUDIO.el = a
  return a
}

export function morceauCourant() {
  const id = PLAYLIST_DEFAUT[AUDIO.index % PLAYLIST_DEFAUT.length]
  return MORCEAUX.find((m) => m.id === id) ?? MORCEAUX[0]
}

export function jouer(id) {
  const a = element()
  if (id) {
    const i = PLAYLIST_DEFAUT.indexOf(id)
    AUDIO.index = i >= 0 ? i : AUDIO.index
    if (i < 0) {
      // Morceau hors playlist : on le joue sans toucher a l'ordre.
      const m = MORCEAUX.find((x) => x.id === id)
      if (m) { a.src = m.fichier; a.play().catch(() => {}); AUDIO.onChange?.(); return }
    }
  }
  a.src = morceauCourant().fichier
  a.play().catch(() => {})     // refus du navigateur : on ignore
  AUDIO.onChange?.()
}

export function suivant() {
  AUDIO.index = (AUDIO.index + 1) % PLAYLIST_DEFAUT.length
  jouer()
}

export function muet(valeur) {
  const a = element()
  a.muted = valeur
}

/** Progression de 0 a 1, lue a chaque image par le jukebox. */
export function progression() {
  const a = AUDIO.el
  if (!a || !a.duration) return 0
  return a.currentTime / a.duration
}
