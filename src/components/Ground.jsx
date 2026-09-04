import { useGameStore } from '../store/useGameStore'
import { HALL, clampToHall } from '../config/world'

export default function Ground() {
  const setDestination = useGameStore((s) => s.setDestination)

  return (
    <mesh
      rotation-x={-Math.PI / 2}
      position={[0, 0.02, 0]}
      visible={false}
      onPointerDown={(e) => {
        e.stopPropagation()
        const p = { x: e.point.x, z: e.point.z }
        clampToHall(p)
        setDestination(p)
      }}
    >
      <planeGeometry args={[HALL.halfWidth * 2, HALL.halfDepth * 2]} />
      <meshBasicMaterial />
    </mesh>
  )
}