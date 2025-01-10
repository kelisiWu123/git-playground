import Router from './components/Router'
import { useProgressStore } from './store/progressStore'
import { useEffect, useState } from 'react'
import type { Achievement } from './types/progress'
import AchievementNotification from './components/AchievementNotification'

export default function App() {
  const [unlockedAchievement, setUnlockedAchievement] = useState<Achievement | null>(null)
  const { achievements } = useProgressStore()

  // 监听成就解锁
  useEffect(() => {
    const checkNewAchievements = () => {
      const newlyUnlocked = Object.values(achievements).find((achievement) => achievement.unlockedAt && new Date(achievement.unlockedAt).getTime() > Date.now() - 1000)
      if (newlyUnlocked) {
        setUnlockedAchievement(newlyUnlocked)
      }
    }

    // 每秒检查一次新解锁的成就
    const interval = setInterval(checkNewAchievements, 1000)
    return () => clearInterval(interval)
  }, [achievements])

  return (
    <>
      <Router />
      {unlockedAchievement && <AchievementNotification achievement={unlockedAchievement} onClose={() => setUnlockedAchievement(null)} />}
    </>
  )
}
