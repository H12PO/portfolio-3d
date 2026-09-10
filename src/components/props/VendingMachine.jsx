import { useEffect } from 'react'
import * as THREE from 'three'
import { useGLTF } from '@react-three/drei'

const URL = '/models/distributeur_boissons.glb'

export default function VendingMachine(props) {
  const { nodes, materials } = useGLTF(URL)

  useEffect(() => {
    Object.values(materials).forEach((m) => {
      if (m.name !== 'M_Vitre') m.side = THREE.FrontSide
    })
  }, [materials])

  return (
    <group {...props} dispose={null}>
      <mesh castShadow receiveShadow geometry={nodes.MESH_DIS_Distributeur.geometry} material={materials.M_Ardoise_Base} />
      <mesh castShadow receiveShadow geometry={nodes.MESH_DIS_Distributeur_1.geometry} material={materials.M_Prod_Ambre} />
      <mesh castShadow receiveShadow geometry={nodes.MESH_DIS_Distributeur_2.geometry} material={materials.M_Prod_Rouge} />
      <mesh castShadow receiveShadow geometry={nodes.MESH_DIS_Distributeur_3.geometry} material={materials.M_Gris_Moyen} />
      <mesh castShadow receiveShadow geometry={nodes.MESH_DIS_Distributeur_4.geometry} material={materials.M_Prod_Vert} />
      <mesh castShadow receiveShadow geometry={nodes.MESH_DIS_Distributeur_5.geometry} material={materials.M_Anthracite} />
      <mesh castShadow receiveShadow geometry={nodes.MESH_DIS_Distributeur_6.geometry} material={materials.M_Creme} />
      <mesh castShadow receiveShadow geometry={nodes.MESH_DIS_Distributeur_7.geometry} material={materials.M_Gris_Clair} />
      <mesh castShadow receiveShadow geometry={nodes.MESH_DIS_Distributeur_8.geometry} material={materials.M_Struct} />
      <mesh castShadow receiveShadow geometry={nodes.MESH_DIS_Distributeur_9.geometry} material={materials.M_Ecran} />
      <mesh castShadow receiveShadow geometry={nodes.MESH_DIS_Distributeur_10.geometry} material={materials.M_Etagere} />
      <mesh castShadow receiveShadow geometry={nodes.MESH_DIS_Distributeur_11.geometry} material={materials.M_Noir} />
      <mesh castShadow receiveShadow geometry={nodes.MESH_DIS_Distributeur_12.geometry} material={materials.M_Ardoise_Fonce} />
      <mesh castShadow receiveShadow geometry={nodes.MESH_DIS_Distributeur_13.geometry} material={materials.M_Ardoise_Clair} />
      <mesh castShadow receiveShadow geometry={nodes.MESH_DIS_Distributeur_14.geometry} material={materials.M_Vitre} />
      <mesh castShadow receiveShadow geometry={nodes.MESH_DIS_Distributeur_15.geometry} material={materials.M_Voyant_Vert} />
    </group>
  )
}

useGLTF.preload(URL)