import { useGameStore } from '../store/useGameStore'
import { BOUNDS } from '../config/world'

export default function Ground() {
  const setDestination = useGameStore((s) => s.setDestination)

  const width = BOUNDS.maxX - BOUNDS.minX
  const depth = BOUNDS.maxZ - BOUNDS.minZ

  return (
    <mesh
      rotation-x={-Math.PI / 2}
      position={[
        (BOUNDS.minX + BOUNDS.maxX) / 2,
        0.02,
        (BOUNDS.minZ + BOUNDS.maxZ) / 2,
      ]}
      visible={false}
      onPointerDown={(e) => {
        e.stopPropagation()
        setDestination(e.point)
      }}
    >
      <planeGeometry args={[width, depth]} />
      <meshBasicMaterial />
    </mesh>
  )
}