import { useEffect } from 'react'
import { RouterProvider } from 'react-router-dom'
import { router } from './router'
import { useProgressStore } from './store/progressStore'
import { AchievementProvider, useAchievement } from './contexts/AchievementContext'

function AppContent() {
  const { showAchievement } = useAchievement()
  const initializeProgress = useProgressStore((state) => state.initializeProgress)
  const setState = useProgressStore.setState

  useEffect(() => {
    initializeProgress()
    setState({ onAchievementUnlock: showAchievement })
  }, [initializeProgress, setState, showAchievement])

  return <RouterProvider router={router} />
}

export default function App() {
  return (
    <AchievementProvider>
      <AppContent />
    </AchievementProvider>
  )
}
