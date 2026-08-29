import { Routes, Route, Navigate } from 'react-router'
import { Canvas } from '@react-three/fiber'
import { Stats } from '@react-three/drei'
import Ground from './components/Ground'
import Player from './components/Player'
import Door from './components/Door'
import Terminal from './components/Terminal'
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
      <Canvas shadows camera={{ position: [0, 5, 15], fov: 35 }}>
        <color attach="background" args={['#8fc4e8']} />

        <ambientLight intensity={1.3} />
        <directionalLight position={[10, 18, 10]} intensity={2.4} castShadow />
        <directionalLight position={[-8, 8, -14]} intensity={1.1} color="#cfe6f7" />

        <Terminal />
        <Ground />
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