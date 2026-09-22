import { PROPS } from '../config/props'
import { COMPONENTS } from '../config/propRegistry'

export default function Props() {
  return (
    <group>
      {PROPS.map((p) => {
        const C = COMPONENTS[p.type]
        if (!C) return null      // type non encore branche : on ignore

        // Tout champ qui n'est pas geometrique est transmis tel quel au
        // composant : image pour les affiches, couleur pour les bagages,
        // et ce qu'on ajoutera ensuite.
        const { id, type, x, y, z, rotY, scale, ...options } = p
        return (
          <C
            key={id}
            position={[x, y ?? 0, z]}
            rotation-y={rotY ?? 0}
            scale={scale ?? 1}
            {...options}
          />
        )
      })}
    </group>
  )
}