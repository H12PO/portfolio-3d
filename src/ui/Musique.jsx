import { useEffect } from 'react'
import { useGameStore } from '../store/useGameStore'
import { AUDIO, jouer, muet, morceauCourant } from '../store/musique'

export default function Musique() {
  const started = useGameStore((s) => s.started)
  const estMuet = useGameStore((s) => s.muet)
  const toggleMuet = useGameStore((s) => s.toggleMuet)
  const setTitre = useGameStore((s) => s.setTitreCourant)

  // Le navigateur refuse le son avant une interaction : l'ecran d'intro
  // fournit ce geste, d'ou le declenchement sur `started`.
  useEffect(() => {
    if (!started) return
    AUDIO.onChange = () => setTitre(morceauCourant().titre)
    jouer()
    return () => { AUDIO.onChange = null }
  }, [started, setTitre])

  useEffect(() => { muet(estMuet) }, [estMuet])

  if (!started) return null

  return (
    <button onClick={toggleMuet} style={S.btn}
            title={estMuet ? 'Activer le son' : 'Couper le son'}>
      {estMuet ? '🔇' : '🔊'}
    </button>
  )
}

const S = {
  btn: {
    position: 'fixed', top: 12, right: 76, zIndex: 30,
    width: 38, height: 38, padding: 0,
    background: 'rgba(20,26,34,0.82)', color: '#e8eef5',
    border: 0, borderRadius: 8, cursor: 'pointer', fontSize: 16,
  },
}