import { createContext, useContext, useState, useCallback, ReactNode } from 'react'
import type { Achievement } from '../types/progress'
import { AchievementUnlock } from '../components/AchievementUnlock'

interface AchievementContextType {
  showAchievement: (achievement: Achievement) => void
}

const AchievementContext = createContext<AchievementContextType | null>(null)

export function AchievementProvider({ children }: { children: ReactNode }) {
  const [currentAchievement, setCurrentAchievement] = useState<Achievement | null>(null)

  const showAchievement = useCallback((achievement: Achievement) => {
    setCurrentAchievement(achievement)
    // 5秒后自动关闭
    setTimeout(() => {
      setCurrentAchievement(null)
    }, 5000)
  }, [])

  return (
    <AchievementContext.Provider value={{ showAchievement }}>
      {children}
      {currentAchievement && <AchievementUnlock achievement={currentAchievement} onClose={() => setCurrentAchievement(null)} />}
    </AchievementContext.Provider>
  )
}

export function useAchievement() {
  const context = useContext(AchievementContext)
  if (!context) {
    throw new Error('useAchievement must be used within an AchievementProvider')
  }
  return context
}
