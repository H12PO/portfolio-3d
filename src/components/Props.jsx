import Seat from './props/Seat'
import Planter from './props/Planter'
import { PROPS } from '../config/props'

// Une famille → un composant. Les variantes se géreront à l'intérieur
// de chaque composant, pas ici.
const COMPONENTS = {
  seat: Seat,
  planter: Planter,
}

export default function Props() {
  return (
    <group>
      {PROPS.map((p) => {
        const C = COMPONENTS[p.type]
        if (!C) return null      // type inconnu : on ignore au lieu de planter
        return (
          <C
            key={p.id}
            position={[p.x, 0, p.z]}
            rotation-y={p.rotY ?? 0}
            scale={p.scale ?? 1}
            variant={p.variant}
          />
        )
      })}
    </group>
  )
}