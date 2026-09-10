import { useEffect } from 'react'
import * as THREE from 'three'
import { useGLTF } from '@react-three/drei'

const URL = '/models/panneau_departs.glb'

export default function DepartureBoard(props) {
  const { nodes, materials } = useGLTF(URL)

  useEffect(() => {
    Object.values(materials).forEach((m) => { m.side = THREE.FrontSide })
  }, [materials])

  return (
    <group {...props} dispose={null}>
      <mesh castShadow receiveShadow geometry={nodes.PAN_Affichage001.geometry} material={materials.M_Affichage} />
      <mesh castShadow receiveShadow geometry={nodes.PAN_Anthracite.geometry} material={materials.M_Anthracite} />
      <mesh castShadow receiveShadow geometry={nodes.PAN_Ardoise_Base.geometry} material={materials.M_Ardoise_Base} />
      <mesh castShadow receiveShadow geometry={nodes.PAN_Ardoise_Clair.geometry} material={materials.M_Ardoise_Clair} />
      <mesh castShadow receiveShadow geometry={nodes.PAN_Ardoise_Fonce.geometry} material={materials.M_Ardoise_Fonce} />
      <mesh castShadow receiveShadow geometry={nodes.PAN_Creme.geometry} material={materials.M_Creme} />
      <mesh castShadow receiveShadow geometry={nodes.PAN_Struct.geometry} material={materials.M_Struct} />
    </group>
  )
}

useGLTF.preload(URL)