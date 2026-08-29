import { useGameStore } from '../store/useGameStore'
import { TERMINAL } from '../config/world'

export default function Ground() {
  const setDestination = useGameStore((s) => s.setDestination)
  const { length } = TERMINAL

  return (
    <mesh
      rotation-x={-Math.PI / 2}
      position={[0, 0.02, 0]}
      visible={false}
      onPointerDown={(e) => {
        e.stopPropagation()
        setDestination(e.point)
      }}
    >
      <planeGeometry args={[length, 12]} />
      <meshBasicMaterial />
    </mesh>
  )
}