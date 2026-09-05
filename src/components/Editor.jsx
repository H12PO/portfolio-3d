import { useEffect, useState } from 'react'
import { Text } from '@react-three/drei'
import { create } from 'zustand'
import { useGameStore } from '../store/useGameStore'
import { BOUNDS } from '../config/world'
import { PROP_TYPES, PROPS } from '../config/props'

// ============================================================
//  TABLE À DESSIN — outil jetable, à supprimer une fois le plan figé.
//  Deux composants : EditorScene dans le Canvas, EditorPanel en DOM.
// ============================================================

const SNAP = 0.25
const QUARTER = Math.PI / 2
const EIGHTH = Math.PI / 4

const round = (v) => Math.round(v / SNAP) * SNAP
const sizeOf = (p) => ({
  w: p.w ?? PROP_TYPES[p.type].w,
  d: p.d ?? PROP_TYPES[p.type].d,
})

const useEditor = create((set, get) => ({
  items: PROPS.map((p) => ({ ...p })),
  selected: null,
  drag: null,

  select: (id) => set({ selected: id }),
  patch: (id, c) => set((s) => ({
    items: s.items.map((p) => (p.id === id ? { ...p, ...c } : p)),
  })),
  setDrag: (d) => set({ drag: d }),

  add: (type) => set((s) => {
    let n = 1
    while (s.items.some((p) => p.id === `${type}-${n}`)) n++
    const id = `${type}-${n}`
    return {
      selected: id,
      items: [...s.items, { id, type, label: type, x: 0, z: -2, rotY: 0, scale: 1 }],
    }
  }),
  remove: (id) => set((s) => ({
    items: s.items.filter((p) => p.id !== id),
    selected: null,
  })),
  rotate: (id, step = QUARTER) => {
    const p = get().items.find((i) => i.id === id)
    if (p) get().patch(id, { rotY: (p.rotY ?? 0) + step })
  },
}))

/* ---------- vue de dessus ---------- */

export function EditorScene() {
  const mode = useGameStore((s) => s.mode)
  const { items, selected, drag, select, patch, setDrag } = useEditor()

  if (mode !== 'edit') return null

  const onMove = (e) => {
    if (!drag) return
    patch(drag.id, { x: round(e.point.x + drag.dx), z: round(e.point.z + drag.dz) })
  }

  return (
    <group>
      {/* Capteur : reçoit le glissement et le clic dans le vide. */}
      <mesh
        rotation-x={-Math.PI / 2}
        position={[BOUNDS.cx, 0, BOUNDS.cz]}
        visible={false}
        onPointerMove={onMove}
        onPointerUp={() => setDrag(null)}
        onPointerDown={() => select(null)}
      >
        <planeGeometry args={[BOUNDS.spanX + 40, BOUNDS.spanZ + 40]} />
      </mesh>

      {items.map((p) => {
        const { w, d } = sizeOf(p)
        const on = p.id === selected
        const color = PROP_TYPES[p.type]?.color ?? '#888'

        return (
          <group key={p.id}>
            <group position={[p.x, 0.06, p.z]} rotation-y={p.rotY ?? 0}>
              {on && (
                <mesh rotation-x={-Math.PI / 2} position-y={-0.01}>
                  <planeGeometry args={[w + 0.16, d + 0.16]} />
                  <meshBasicMaterial color="#1b2430" />
                </mesh>
              )}
              <mesh
                rotation-x={-Math.PI / 2}
                onPointerDown={(e) => {
                  e.stopPropagation()
                  select(p.id)
                  setDrag({ id: p.id, dx: p.x - e.point.x, dz: p.z - e.point.z })
                }}
              >
                <planeGeometry args={[w, d]} />
                <meshBasicMaterial color={color} transparent opacity={on ? 0.9 : 0.55} />
              </mesh>
            </group>

            {/* Étiquette hors du groupe tourné : toujours lisible à l'écran. */}
            <Text
              position={[p.x, 0.1, p.z]}
              rotation-x={-Math.PI / 2}
              fontSize={0.42}
              color="#ffffff"
              anchorY="bottom"
            >
              {p.label ?? p.type}
            </Text>
            <Text
              position={[p.x, 0.1, p.z + 0.12]}
              rotation-x={-Math.PI / 2}
              fontSize={0.3}
              color="#e8eef5"
              anchorY="top"
            >
              {`${w} × ${d}`}
            </Text>
          </group>
        )
      })}
    </group>
  )
}

/* ---------- panneau ---------- */

function serialize(items) {
  const rot = (r) => {
  const i = ((Math.round((r ?? 0) / EIGHTH) % 8) + 8) % 8
  return ['0', 'Math.PI / 4', 'Math.PI / 2', '3 * Math.PI / 4', 'Math.PI',
          '-3 * Math.PI / 4', '-Math.PI / 2', '-Math.PI / 4'][i]
  }

  const body = items.map((p) => {
    const f = [`id: '${p.id}'`, `type: '${p.type}'`]
    if (p.label) f.push(`label: '${p.label}'`)
    f.push(`x: ${p.x}`, `z: ${p.z}`, `rotY: ${rot(p.rotY)}`, `scale: ${p.scale ?? 1}`)
    if (p.w != null) f.push(`w: ${p.w}`)
    if (p.d != null) f.push(`d: ${p.d}`)
    return `  { ${f.join(', ')} },`
  }).join('\n')

  return `export const PROPS = [\n${body}\n]\n`
}

export function EditorPanel() {
  const mode = useGameStore((s) => s.mode)
  const { items, selected, select, patch, add, remove, rotate } = useEditor()
  const [dump, setDump] = useState(null)

  const sel = items.find((p) => p.id === selected)

  useEffect(() => {
    if (mode !== 'edit') return
    const onKey = (e) => {
      const t = e.target.tagName
      if (t === 'INPUT' || t === 'TEXTAREA') return
      if (!selected) return
      if (e.code === 'KeyR') rotate(selected, e.shiftKey ? EIGHTH : QUARTER)
      if (e.code === 'Delete' || e.code === 'Backspace') remove(selected)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [mode, selected, rotate, remove])

  if (mode !== 'edit') return null

  const copy = () => {
    const text = serialize(items)
    navigator.clipboard?.writeText(text).then(
      () => setDump(null),
      () => setDump(text),
    )
  }

  const num = (key) => (e) => {
    const v = parseFloat(e.target.value)
    patch(sel.id, { [key]: Number.isNaN(v) ? undefined : v })
  }

  return (
    <div style={S.panel}>
      <div style={S.title}>Plan — {items.length} props</div>

      <div style={S.row}>
        {Object.keys(PROP_TYPES).map((t) => (
          <button key={t} style={S.btn} onClick={() => add(t)}>+ {t}</button>
        ))}
      </div>

      <div style={S.list}>
        {items.map((p) => (
          <div
            key={p.id}
            onClick={() => select(p.id)}
            style={{ ...S.item, background: p.id === selected ? '#2b3f56' : 'transparent' }}
          >
            {p.label ?? p.type} <span style={S.dim}>{p.x} / {p.z}</span>
          </div>
        ))}
      </div>

      {sel && (
        <div style={S.form}>
          <input
            style={S.input}
            value={sel.label ?? ''}
            placeholder="nom"
            onChange={(e) => patch(sel.id, { label: e.target.value })}
          />
          <div style={S.row}>
            <input style={S.input} type="number" step="0.1" value={sel.w ?? sizeOf(sel).w} onChange={num('w')} />
            <input style={S.input} type="number" step="0.1" value={sel.d ?? sizeOf(sel).d} onChange={num('d')} />
          </div>
          <div style={S.row}>
            <button style={S.btn} onClick={() => rotate(sel.id)}>↻ 90°</button>
            <button style={S.btn} onClick={() => rotate(sel.id, EIGHTH)}>↻ 45°</button>
            <button style={S.btn} onClick={() => remove(sel.id)}>Suppr.</button>
          </div>
        </div>
      )}

      <button style={{ ...S.btn, ...S.copy }} onClick={copy}>Copier props.js</button>

      {dump && <textarea style={S.dump} readOnly value={dump} onFocus={(e) => e.target.select()} />}
    </div>
  )
}

const S = {
  panel: { position: 'fixed', top: 12, right: 12, width: 260, padding: 12, zIndex: 20,
    background: 'rgba(20,26,34,0.94)', color: '#e8eef5', borderRadius: 8,
    font: '13px system-ui, sans-serif' },
  title: { fontWeight: 600, marginBottom: 8 },
  row: { display: 'flex', gap: 6, marginBottom: 6 },
  btn: { flex: 1, padding: '6px 8px', background: '#2b3f56', color: '#e8eef5',
    border: 0, borderRadius: 4, cursor: 'pointer', font: 'inherit' },
  copy: { marginTop: 10, background: '#3d6b8f' },
  list: { maxHeight: 220, overflowY: 'auto', margin: '8px 0' },
  item: { padding: '4px 6px', borderRadius: 4, cursor: 'pointer' },
  dim: { opacity: 0.5, float: 'right' },
  form: { borderTop: '1px solid #33445a', paddingTop: 8 },
  input: { width: '100%', boxSizing: 'border-box', padding: '5px 6px', marginBottom: 6,
    background: '#141a22', color: '#e8eef5', border: '1px solid #33445a',
    borderRadius: 4, font: 'inherit' },
  dump: { width: '100%', height: 120, marginTop: 8, boxSizing: 'border-box',
    background: '#141a22', color: '#e8eef5', border: '1px solid #33445a', fontSize: 11 },
}