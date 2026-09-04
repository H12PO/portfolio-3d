import { useEffect, useRef } from 'react'
import { useThree } from '@react-three/fiber'
import { Grid } from '@react-three/drei'
import { useGameStore } from '../store/useGameStore'

export default function DebugCamera() {
  const topDown = useGameStore((s) => s.topDown)
  const toggleTopDown = useGameStore((s) => s.toggleTopDown)
  const { camera } = useThree()
  const saved = useRef(null)

  useEffect(() => {
    const onKey = (e) => {
      if (e.code === 'KeyP' && !e.repeat) toggleTopDown()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [toggleTopDown])

  useEffect(() => {
    if (topDown) {
      saved.current = { pos: camera.position.clone(), fov: camera.fov }
      camera.position.set(0, 52, 0.01)
      camera.lookAt(0, 0, 0)
      camera.fov = 45
      camera.updateProjectionMatrix()
    } else if (saved.current) {
      camera.position.copy(saved.current.pos)
      camera.fov = saved.current.fov
      camera.updateProjectionMatrix()
    }
  }, [topDown, camera])

  if (!topDown) return null

  return (
    <Grid
      position={[0, 0.02, 0]}
      args={[80, 80]}
      cellSize={1}
      cellColor="#9aa0aa"
      sectionSize={5}
      sectionColor="#5a6a80"
      fadeDistance={120}
    />
  )
}