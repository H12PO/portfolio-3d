import { useGLTF } from '@react-three/drei'

const URL = '/models/seat.glb'

export default function Seat(props) {
  const { nodes, materials } = useGLTF(URL)

  return (
    <group {...props} dispose={null}>
      <mesh
        geometry={nodes['10Chairs'].geometry}
        material={materials.AIRPORT}
        castShadow
        receiveShadow
      />
    </group>
  )
}

useGLTF.preload(URL)