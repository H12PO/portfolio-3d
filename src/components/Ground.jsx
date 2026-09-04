import { BOUNDS } from '../config/world'

/**
 * Plan de pioche au sol, invisible et inerte.
 * Le clic pour se déplacer a été retiré : ZQSD sur desktop, joystick sur mobile.
 * Ce plan resservira au mode éditeur pour lire les coordonnées sous le curseur.
 */
export default function Ground() {
  return (
    <mesh
      rotation-x={-Math.PI / 2}
      position={[BOUNDS.cx, 0.02, BOUNDS.cz]}
      visible={false}
    >
      <planeGeometry args={[BOUNDS.spanX, BOUNDS.spanZ]} />
      <meshBasicMaterial />
    </mesh>
  )
}