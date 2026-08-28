import { Routes, Route, Navigate } from 'react-router'
import { Canvas } from '@react-three/fiber'
import { Stats } from '@react-three/drei'
import Ground from './components/Ground'
import Player from './components/Player'
import Door from './components/Door'
import Prompt from './ui/Prompt'
import Page from './ui/Page'
import Intro from './ui/Intro'
import Ticket from './ui/Ticket'
import LangSwitch from './ui/LangSwitch'
import GuardedPage from './ui/GuardedPage'
import { DOORS } from './config/doors'

export default function App() {
  return (
    <>
      <Canvas shadows camera={{ position: [0, 4, 12], fov: 50 }}>
        <color attach="background" args={['#15151f']} />

        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 8, 5]} intensity={2} castShadow />

        <Ground />
        <Player />
        {DOORS.map((door) => (
          <Door key={door.id} {...door} />
        ))}

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