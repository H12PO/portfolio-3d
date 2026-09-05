import { useMemo } from 'react'
import * as THREE from 'three'
import { useThree } from '@react-three/fiber'
import { OrthographicCamera, Grid, Line } from '@react-three/drei'
import { useGameStore } from '../store/useGameStore'
import { BOUNDS, OUTLINE } from '../config/world'

const MARGIN = 6      // marge en mètres autour du contour
const CAM_Y = 40      // altitude de la caméra
const CUT = 3.2       // hauteur de coupe, comme un plan d'architecte  // marge en mètres autour du contour

export default function DebugCamera() {
  const mode = useGameStore((s) => s.mode)
  const size = useThree((s) => s.size)

  // Zoom orthographique = pixels par mètre. On prend l'axe le plus contraint,
  // le hall entre donc toujours dans le cadre, quel que soit le format.
  const zoom = useMemo(() => Math.min(
    size.width / (BOUNDS.spanX + MARGIN),
    size.height / (BOUNDS.spanZ + MARGIN),
  ), [size.width, size.height])

  const contour = useMemo(() => {
    const pts = OUTLINE.map(([x, z]) => new THREE.Vector3(x, 0.05, z))
    pts.push(pts[0].clone())
    return pts
  }, [])

  if (mode === 'play') return null

  return (
    <>
      {/* Vue de dessus. La rotation explicite évite le lookAt dégénéré,
          et makeDefault restaure seul la caméra de jeu au démontage. */}
      <OrthographicCamera
        makeDefault
        position={[BOUNDS.cx, CAM_Y, BOUNDS.cz]}
        rotation={[-Math.PI / 2, 0, 0]}
        zoom={zoom}
        near={CAM_Y - CUT}
        far={120}
      />

      {/* Grille centrée sur l'origine du monde, pas sur le hall :
          les sections de 5 m tombent ainsi sur des coordonnées rondes. */}
      <Grid
        position={[0, 0.02, 0]}
        args={[80, 40]}
        cellSize={1}
        cellColor="#9aa0aa"
        sectionSize={5}
        sectionColor="#5a6a80"
        fadeDistance={200}
      />

      <Line points={contour} color="#5aa9e6" lineWidth={2} />
    </>
  )
}