import { useLangStore } from '../i18n'

const LANGS = ['fr', 'en']

export default function LangSwitch() {
  const lang = useLangStore((s) => s.lang)
  const setLang = useLangStore((s) => s.setLang)

  return (
    <div style={{
      position: 'absolute', top: 18, right: 20,
      display: 'flex', gap: 4,
      font: '13px system-ui',
    }}>
      {LANGS.map((code) => (
        <button
          key={code}
          onClick={() => setLang(code)}
          style={{
            padding: '5px 11px', borderRadius: 6, cursor: 'pointer',
            border: '1px solid rgba(255,255,255,.18)',
            background: code === lang ? 'rgba(255,255,255,.14)' : 'transparent',
            color: '#e8e8f0',
            opacity: code === lang ? 1 : .55,
            font: 'inherit', textTransform: 'uppercase',
          }}
        >
          {code}
        </button>
      ))}
    </div>
  )
}