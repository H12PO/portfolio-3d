import { TERMINAL, PALETTE as C } from '../config/world'
import { FRONT_PROPS } from '../config/props'

export default function FrontLine() {
  const { frontZ, railHeight, planterH } = TERMINAL

  return (
    <group position={[0, 0, frontZ]}>
      {FRONT_PROPS.map((prop, i) => {
        if (prop.type === 'planter') {
          return (
            <group key={i} position={[prop.x, 0, 0]}>
              <mesh position={[0, planterH / 2, 0]} castShadow receiveShadow>
                <boxGeometry args={[prop.width, planterH, 1.3]} />
                <meshStandardMaterial color={C.structure} roughness={0.7} />
              </mesh>

              {/* touffes basses — placeholder du modèle Blender */}
              {[-0.3, 0.05, 0.35].map((t, k) => (
                <mesh
                  key={k}
                  position={[prop.width * t, planterH + 0.22, (k % 2 ? 0.18 : -0.18)]}
                  castShadow
                >
                  <sphereGeometry args={[0.3, 10, 8]} />
                  <meshStandardMaterial color="#5c9e64" roughness={0.9} />
                </mesh>
              ))}
            </group>
          )
        }

        const half = prop.width / 2
        return (
          <group key={i} position={[prop.x, 0, 0]}>
            {[-half, 0, half].map((dx) => (
              <mesh key={dx} position={[dx, railHeight / 2, 0]} castShadow>
                <cylinderGeometry args={[0.05, 0.05, railHeight, 8]} />
                <meshStandardMaterial color={C.mullion} metalness={0.5} roughness={0.4} />
              </mesh>
            ))}
            <mesh position={[0, railHeight - 0.04, 0]} castShadow>
              <boxGeometry args={[prop.width, 0.07, 0.07]} />
              <meshStandardMaterial color={C.mullion} metalness={0.5} roughness={0.4} />
            </mesh>
          </group>
        )
      })}
    </group>
  )
}