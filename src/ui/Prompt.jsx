import { useLocation } from 'react-router'
import { useGameStore } from '../store/useGameStore'
import { INTERACTIFS } from '../config/interactions'
import { useT } from '../i18n'

export default function Prompt() {
  const nearby = useGameStore((s) => s.nearby)
  const { pathname } = useLocation()
  const t = useT()

  if (!nearby || pathname !== '/') return null
  const it = INTERACTIFS.find((i) => i.id === nearby)
  if (!it) return null

  return (
    <div style={{
      position: 'absolute', bottom: '8%', left: '50%',
      transform: 'translateX(-50%)',
      padding: '10px 22px', borderRadius: 10,
      background: 'rgba(20,20,32,.85)', color: '#e8e8f0',
      font: '15px system-ui', letterSpacing: '.02em',
      pointerEvents: 'none',
    }}>
      {t(it.libelle)} · {t('nav.interact')}
    </div>
  )
}