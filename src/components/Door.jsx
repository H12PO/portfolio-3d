import { Text } from '@react-three/drei'
import { useGameStore } from '../store/useGameStore'
import { DOOR_Z } from '../config/doors'

export default function Door({ id, label, gate, x }) {
  const isNear = useGameStore((s) => s.nearbyDoor === id)

  return (
    <group position={[x, 0, DOOR_Z]}>
      <mesh position-y={1.1} castShadow>
        <boxGeometry args={[2.2, 2.2, 0.3]} />
        <meshStandardMaterial color={isNear ? '#4d8bd8' : '#3a3a4a'} />
      </mesh>

      <Text position={[0, 2.9, 0.2]} fontSize={0.32} color="#e8e8f0" anchorY="middle">
        {`${gate} — ${label}`}
      </Text>
    </group>
  )
}