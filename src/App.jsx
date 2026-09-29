import { Routes, Route, Navigate } from 'react-router'
import { Suspense, useEffect, useRef } from 'react'
import { Canvas } from '@react-three/fiber'
import { Stats } from '@react-three/drei'
import Terminal from './components/Terminal'
import Ground from './components/Ground'
import Player from './components/Player'
import Props from './components/Props'
import Door from './components/Door'
import Entree from './components/Entree'

import { EditorScene, EditorPanel } from './components/Editor'
import DebugCamera from './components/DebugCamera'
import Prompt from './ui/Prompt'
import GuardedPage from './ui/GuardedPage'
import Intro from './ui/Intro'
import Ticket from './ui/Ticket'
import LangSwitch from './ui/LangSwitch'
import { DOORS } from './config/doors'
import Musique from './ui/Musique'
/**
 * Soleil. Les bornes shadow-camera-* sont écrites sur l'objet par R3F,
 * mais la matrice de projection de la caméra d'ombre n'est pas recalculée
 * pour autant : sans updateProjectionMatrix, le volume reste au défaut
 * de 10 × 10 m et les ombres disparaissent au-delà.
 */
function Sun() {
  const ref = useRef()

  useEffect(() => {
    const cam = ref.current?.shadow?.camera
    if (cam) cam.updateProjectionMatrix()
  }, [])

  return (
    <directionalLight
      ref={ref}
      position={[12, 20, 10]}
      intensity={2.4}
      castShadow
      shadow-mapSize={[2048, 2048]}
      shadow-normalBias={0.02}
      shadow-camera-left={-32}
      shadow-camera-right={32}
      shadow-camera-top={22}
      shadow-camera-bottom={-22}
      shadow-camera-near={1}
      shadow-camera-far={70}
    />
  )
}

export default function App() {
  return (
    <>
      <Canvas shadows camera={{ position: [0, 6, 20], fov: 35 }}>
        <color attach="background" args={['#8fc4e8']} />

        <ambientLight intensity={1.3} />
        <Sun />
        <directionalLight position={[-10, 8, -16]} intensity={1.1} color="#cfe6f7" />

        <Suspense fallback={null}>
          <Terminal />
          <Ground />
          <Entree />
          <Props />
          <EditorScene />
          <Player />
          {DOORS.map((d) => <Door key={d.id} {...d} />)}
        </Suspense>

        <DebugCamera />
        <Stats />
      </Canvas>
      <EditorPanel />
      <Prompt />
      <Ticket />
      <Routes>
        <Route path="/" element={null} />
        <Route path="/:doorId" element={<GuardedPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Intro />
      <LangSwitch />
      <Musique />
    </>
  )
}