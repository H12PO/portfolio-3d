import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Stats } from '@react-three/drei'
import { useRef } from 'react'

function Cube() {
  const ref = useRef()

  useFrame((state, delta) => {
    ref.current.rotation.y += delta * 0.5
    ref.current.rotation.x += delta * 0.2
  })

  return (
    <mesh ref={ref}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="orange" />
    </mesh>
  )
}

export default function App() {
  return (
    <Canvas camera={{ position: [3, 3, 3], fov: 50 }}>
      <color attach="background" args={['#15151f']} />
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 5, 5]} intensity={3} />
      <Cube />
      <OrbitControls />
      <Stats />
    </Canvas>
  )
}