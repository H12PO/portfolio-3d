import { useParams } from 'react-router'
import { useGameStore } from '../store/useGameStore'
import { useT } from '../i18n'
import { DOORS } from '../config/doors'

export default function Page() {
  const { doorId } = useParams()
  const beginLanding = useGameStore((s) => s.beginLanding)
  const t = useT()

  const door = DOORS.find((d) => d.id === doorId)
  if (!door) return null

  const paragraphs = t(`pages.${doorId}.body`)

  return (
    <div style={{
      position: 'absolute', inset: 0,
      background: 'rgba(10,10,18,.96)', color: '#e8e8f0',
      overflowY: 'auto',
      font: '16px/1.7 system-ui',
    }}>
      <div style={{ maxWidth: 680, margin: '0 auto', padding: '80px 28px 120px' }}>
        <p style={{ opacity: .45, letterSpacing: '.18em', fontSize: 12, marginBottom: 10 }}>
          {t('nav.gate').toUpperCase()} {door.gate}
        </p>

        <h1 style={{ fontSize: 42, fontWeight: 600, marginBottom: 36 }}>
          {t(`pages.${doorId}.title`)}
        </h1>

        {paragraphs.map((text, i) => (
          <p key={i} style={{ marginBottom: 22, opacity: .82 }}>{text}</p>
        ))}
        <button
          onClick={() => beginLanding(doorId)}
          style={{
            marginTop: 20, padding: '11px 26px', borderRadius: 8,
            border: '1px solid rgba(255,255,255,.22)',
            background: 'transparent', color: 'inherit',
            font: 'inherit', cursor: 'pointer',
          }}
        >
          ← {t('nav.back')}
        </button>
      </div>
    </div>
  )
}