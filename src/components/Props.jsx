import { PROPS } from '../config/props'
import { COMPONENTS } from '../config/propRegistry'

export default function Props({ zone = 'hall' }) {
  return (
    <group>
      {PROPS.filter((p) => (p.zone ?? 'hall') === zone).map((p) => {
        const C = COMPONENTS[p.type]
        if (!C) return null      // type non encore branche : on ignore

        // Tout champ qui n'est pas geometrique est transmis tel quel au
        // composant : image pour les affiches, couleur pour les bagages,
        // et ce qu'on ajoutera ensuite. zone fait exception : c'est une
        // donnee de tri, pas une propriete d'objet 3D.
        const { id, type, zone: _zone, x, y, z, rotY, scale, ...options } = p
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