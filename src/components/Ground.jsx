import { Grid } from '@react-three/drei'
import { useGameStore } from '../store/useGameStore'

export default function Ground() {
  const setDestination = useGameStore((s) => s.setDestination)

  return (
    <>
      <mesh
        rotation-x={-Math.PI / 2}
        position-y={-0.01}
        receiveShadow
        onPointerDown={(e) => {
          e.stopPropagation()
          setDestination(e.point)
        }}
      >
        <planeGeometry args={[40, 40]} />
        <meshStandardMaterial color="#2a2a35" />
      </mesh>

      <Grid
        args={[40, 40]}
        cellSize={1}
        cellColor="#3d3d4d"
        sectionSize={5}
        sectionColor="#5a5a75"
        fadeDistance={50}
      />
    </>
  )
}