import { useEffect } from 'react'
import * as THREE from 'three'
import { useGLTF } from '@react-three/drei'

const URL = '/models/bibliotheque.glb'

export default function Bookshelf(props) {
  const { nodes, materials } = useGLTF(URL)

  useEffect(() => {
    Object.values(materials).forEach((m) => { m.side = THREE.FrontSide })
  }, [materials])

  return (
    <group {...props} dispose={null}>
      <mesh castShadow receiveShadow geometry={nodes.BIB_Anthracite.geometry} material={materials.M_Anthracite} />
      <mesh castShadow receiveShadow geometry={nodes.BIB_Bois.geometry} material={materials.M_Bois} />
      <mesh castShadow receiveShadow geometry={nodes.BIB_Creme.geometry} material={materials.M_Creme} />
      <mesh castShadow receiveShadow geometry={nodes.BIB_Livre_Brique.geometry} material={materials.M_Livre_Brique} />
      <mesh castShadow receiveShadow geometry={nodes.BIB_Livre_Creme.geometry} material={materials.M_Livre_Creme} />
      <mesh castShadow receiveShadow geometry={nodes.BIB_Livre_Olive.geometry} material={materials.M_Livre_Olive} />
      <mesh castShadow receiveShadow geometry={nodes.BIB_Livre_Sable.geometry} material={materials.M_Livre_Sable} />
      <mesh castShadow receiveShadow geometry={nodes.BIB_Prune_Base.geometry} material={materials.M_Prune_Base} />
      <mesh castShadow receiveShadow geometry={nodes.BIB_Prune_Clair.geometry} material={materials.M_Prune_Clair} />
      <mesh castShadow receiveShadow geometry={nodes.BIB_Signe001.geometry} material={materials.M_Signe_BIB} />
      <mesh castShadow receiveShadow geometry={nodes.BIB_Struct.geometry} material={materials.M_Struct} />
    </group>
  )
}

useGLTF.preload(URL)