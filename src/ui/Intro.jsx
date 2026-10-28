import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router'
import { useProgress } from '@react-three/drei'
import { useGameStore } from '../store/useGameStore'
import { useT } from '../i18n'
import { useTexte } from '../site/textes'

const KEY = {
  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
  minWidth: 34, height: 34, padding: '0 8px',
  borderRadius: 7, border: '1px solid rgba(255,255,255,.22)',
  background: 'rgba(255,255,255,.07)',
  font: '600 13px system-ui',
}

const CARD = {
  flex: 1, minWidth: 150,
  padding: '18px 16px 20px',
  borderRadius: 12,
  border: '1px dashed rgba(255,255,255,.16)',
  textAlign: 'center',
}

// Boutons secondaires : accès direct au site vitrine, sans passer par l'aéroport
const RACCOURCI = {
  padding: '10px 28px', borderRadius: 9,
  border: '1px solid rgba(255,255,255,.18)',
  background: 'transparent',
  color: 'inherit', font: '500 14px system-ui',
  cursor: 'pointer',
}

export default function Intro() {
  const started = useGameStore((s) => s.started)
  const start = useGameStore((s) => s.start)
  const { progress, active } = useProgress()
  const navigate = useNavigate()
  const t = useT()
  const site = useTexte().t

  const [timedOut, setTimedOut] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setTimedOut(true), 8000)
    return () => clearTimeout(timer)
  }, [])

  // ⚠️ tous les hooks sont appelés AVANT ce return
  if (started) return null

  const ready = timedOut || !active
  return (
    <div style={{
      position: 'absolute', inset: 0, zIndex: 10,
      background: '#10101a', color: '#e8e8f0',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      font: '15px system-ui',
    }}>
      <div style={{ width: 'min(620px, 88vw)', textAlign: 'center' }}>

        <h1 style={{ fontSize: 'clamp(38px, 7vw, 62px)', fontWeight: 600, letterSpacing: '-.02em' }}>
          {t('intro.name')}
        </h1>
        <p style={{ opacity: .4, letterSpacing: '.22em', fontSize: 12, marginTop: 8 }}>
          {t('intro.subtitle').toUpperCase()}
        </p>

        <p style={{ opacity: .5, marginTop: 48, marginBottom: 16, fontSize: 13, letterSpacing: '.1em' }}>
          {t('intro.controls').toUpperCase()}
        </p>

        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <div style={CARD}>
            <p style={{ opacity: .65, fontSize: 13, marginBottom: 14 }}>{t('intro.move')}</p>
            <div style={{ display: 'flex', gap: 5, justifyContent: 'center' }}>
              {t('intro.keys').split('').map((k, i) => (
                <span key={i} style={KEY}>{k}</span>
              ))}
            </div>
          </div>

          <div style={CARD}>
            <p style={{ opacity: .65, fontSize: 13, marginBottom: 14 }}>{t('intro.moveClick')}</p>
            <span style={{ ...KEY, minWidth: 44 }}>🖱</span>
          </div>

          <div style={CARD}>
            <p style={{ opacity: .65, fontSize: 13, marginBottom: 14 }}>{t('intro.interact')}</p>
            <span style={KEY}>E</span>
          </div>
        </div>

        <button
          onClick={start}
          disabled={!ready}
          style={{
            marginTop: 44, padding: '13px 40px', borderRadius: 9,
            border: '1px solid rgba(255,255,255,.28)',
            background: ready ? 'rgba(255,255,255,.12)' : 'transparent',
            color: 'inherit', font: '600 15px system-ui',
            cursor: ready ? 'pointer' : 'default',
            opacity: ready ? 1 : .35,
            transition: 'opacity .3s, background .3s',
          }}
        >
          {ready ? t('intro.enter') : `${t('intro.loading')} ${Math.round(progress)}%`}
        </button>

        {/* Pas besoin d'attendre le chargement de la 3D pour ces deux-là */}
        <p style={{ opacity: .45, marginTop: 36, marginBottom: 12, fontSize: 13 }}>
          {site('intro.raccourci')}
        </p>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
          <button onClick={() => navigate('/cv')} style={RACCOURCI}>{site('nav.cv')}</button>
          <button onClick={() => navigate('/projets')} style={RACCOURCI}>{site('nav.projets')}</button>
        </div>
      </div>
    </div>
  )
}
