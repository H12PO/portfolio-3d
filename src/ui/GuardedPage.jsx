import { Navigate, useParams } from 'react-router'
import { useGameStore } from '../store/useGameStore'
import { DOORS } from '../config/doors'
import Page from './Page'

export default function GuardedPage() {
  const { doorId } = useParams()
  const lastDoor = useGameStore((s) => s.lastDoor)

  const exists = DOORS.some((d) => d.id === doorId)
  if (!exists || lastDoor !== doorId) return <Navigate to="/" replace />

  return <Page />
}