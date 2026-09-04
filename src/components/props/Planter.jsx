import { useGLTF } from '@react-three/drei'

const URL = '/models/planter.glb'

export default function Planter(props) {
  const { nodes, materials } = useGLTF(URL)

  return (
    <group {...props} dispose={null}>
      <mesh
        geometry={nodes['1710Model'].geometry}
        material={materials.AIRPORT}
        castShadow
        receiveShadow
      />
    </group>
  )
}

useGLTF.preload(URL)