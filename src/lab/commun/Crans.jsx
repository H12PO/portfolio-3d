// Curseur à crans : un vrai <input type="range">, habillé (rail, crans, poignée)
export default function Crans({ valeur, max, onChange, libelle, texte }) {
  const pos = (k) => `calc(5px + ${k / max} * (100% - 10px))`
  return (
    <label className="crans-libelle">
      <span>{libelle}</span>
      <span className="crans" style={{ '--plein': pos(valeur) }}>
        {Array.from({ length: max + 1 }, (_, k) => <i key={k} style={{ left: pos(k) }} />)}
        <input type="range" min="0" max={max} step="1" value={valeur} onChange={(e) => onChange(Number(e.target.value))} />
      </span>
      <output>{texte}</output>
    </label>
  )
}

export const IconeLecture = () => (
  <svg viewBox="0 0 16 16" width="11" height="11" aria-hidden="true"><path d="M4 2.5v11l9-5.5z" fill="currentColor" /></svg>
)

export const IconePause = () => (
  <svg viewBox="0 0 16 16" width="11" height="11" aria-hidden="true"><path d="M4 2.5h3v11H4zM9 2.5h3v11H9z" fill="currentColor" /></svg>
)
