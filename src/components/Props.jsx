import { PROPS } from '../config/props'
import { COMPONENTS } from '../config/propRegistry'

export default function Props() {
  return (
    <group>
      {PROPS.map((p) => {
        const C = COMPONENTS[p.type]
        if (!C) return null      // type non encore branché : on ignore
        return (
          <C
            key={p.id}
            position={[p.x, p.y ?? 0, p.z]}
            rotation-y={p.rotY ?? 0}
            scale={p.scale ?? 1}
          />
        )
      })}
    </group>
  )
}