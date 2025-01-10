import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { UserProgress, LevelProgress, Achievement } from '../types/progress'
import { LEVELS } from '../constants/levels'

interface ProgressState extends UserProgress {
  initializeProgress: () => void
  updateLevelProgress: (levelId: number, progress: Partial<LevelProgress>) => void
  completeLevel: (levelId: number) => void
  unlockAchievement: (achievement: Achievement) => void
  resetProgress: () => void
}

const initialProgress: UserProgress = {
  currentLevel: 1,
  levels: {},
  achievements: {},
}

export const useProgressStore = create<ProgressState>()(
  persist(
    (set, get) => ({
      ...initialProgress,

      initializeProgress: () => {
        const { levels } = get()
        if (Object.keys(levels).length === 0) {
          const initialLevels: Record<number, LevelProgress> = {}
          LEVELS.forEach((level) => {
            initialLevels[level.id] = {
              levelId: level.id,
              completed: false,
              commands: [],
            }
          })
          set({ levels: initialLevels })
        }
      },

      updateLevelProgress: (levelId, progress) => {
        set((state) => ({
          levels: {
            ...state.levels,
            [levelId]: {
              ...state.levels[levelId],
              ...progress,
            },
          },
        }))
      },

      completeLevel: (levelId) => {
        const nextLevel = levelId + 1
        set((state) => ({
          currentLevel: Math.max(state.currentLevel, nextLevel),
          levels: {
            ...state.levels,
            [levelId]: {
              ...state.levels[levelId],
              completed: true,
              completedAt: new Date().toISOString(),
            },
          },
          lastPlayedAt: new Date().toISOString(),
        }))
      },

      unlockAchievement: (achievement) => {
        set((state) => ({
          achievements: {
            ...state.achievements,
            [achievement.id]: {
              ...achievement,
              unlockedAt: new Date().toISOString(),
            },
          },
        }))
      },

      resetProgress: () => {
        set(initialProgress)
      },
    }),
    {
      name: 'git-meow-progress',
      version: 1,
    }
  )
)
