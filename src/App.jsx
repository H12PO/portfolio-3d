import { Routes, Route, Navigate } from 'react-router'
import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { Stats } from '@react-three/drei'
import Terminal from './components/Terminal'
import Ground from './components/Ground'
import Player from './components/Player'
import Props from './components/Props'
import Door from './components/Door'
import DebugCamera from './components/DebugCamera'
import Prompt from './ui/Prompt'
import GuardedPage from './ui/GuardedPage'
import Intro from './ui/Intro'
import Ticket from './ui/Ticket'
import LangSwitch from './ui/LangSwitch'
import { DOORS } from './config/doors'

export default function App() {
  return (
    <>
      <Canvas shadows camera={{ position: [0, 6, 20], fov: 35 }}>
        <color attach="background" args={['#8fc4e8']} />

        <ambientLight intensity={1.3} />
        <directionalLight position={[12, 20, 10]} intensity={2.4} castShadow />
        <directionalLight position={[-10, 8, -16]} intensity={1.1} color="#cfe6f7" />

        <Suspense fallback={null}>
          <Terminal />
          <Ground />
          <Props />
          <Player />
          {DOORS.map((d) => <Door key={d.id} {...d} />)}
        </Suspense>

        <DebugCamera />
        <Stats />
      </Canvas>

      <Prompt />
      <Ticket />
      <Routes>
        <Route path="/" element={null} />
        <Route path="/:doorId" element={<GuardedPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Intro />
      <LangSwitch />
    </>
  )
}