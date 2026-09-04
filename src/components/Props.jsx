import Seat from './props/Seat'
import Planter from './props/Planter'
import { SEAT_ROWS, PLANTERS } from '../config/props'

export default function Props() {
  return (
    <group>
      {SEAT_ROWS.map((s, i) => (
        <Seat key={`seat-${i}`} position={[s.x, 0, s.z]} rotation-y={s.rotY} />
      ))}
      {PLANTERS.map((p, i) => (
        <Planter key={`plant-${i}`} position={[p.x, 0, p.z]} scale={p.scale} />
      ))}
    </group>
  )
}