import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Progress, Achievement } from '../types/progress'
import { ACHIEVEMENTS, ACHIEVEMENT_IDS } from '../constants/achievements'

interface ProgressStore extends Progress {
  initializeProgress: () => void
  completeLevel: (levelId: number) => void
  recordCommand: (levelId: number, command: string) => void
  incrementAttempts: (levelId: number) => void
  incrementHints: (levelId: number) => void
  updateTimeSpent: (levelId: number, seconds: number) => void
  unlockAchievement: (achievementId: string) => void
  updateAchievementProgress: (achievementId: string, progress: number) => void
  checkAchievements: () => void
}

export const useProgressStore = create<ProgressStore>()(
  persist(
    (set, get) => ({
      levels: {},
      achievements: {},
      lastCompletedLevel: 1,
      totalTimeSpent: 0,

      initializeProgress: () => {
        const { achievements } = get()
        // 如果成就列表为空，初始化所有成就
        if (Object.keys(achievements).length === 0) {
          const initialAchievements: Record<string, Achievement> = {}
          ACHIEVEMENTS.forEach((achievement) => {
            initialAchievements[achievement.id] = achievement
          })
          set({ achievements: initialAchievements })
        }
      },

      completeLevel: (levelId: number) => {
        const { levels, lastCompletedLevel, checkAchievements } = get()
        const now = new Date().toISOString()

        // 更新关卡进度
        set((state) => ({
          levels: {
            ...state.levels,
            [levelId]: {
              ...state.levels[levelId],
              completed: true,
              completedAt: now,
            },
          },
          lastCompletedLevel: Math.max(lastCompletedLevel, levelId + 1),
        }))

        // 检查成就
        checkAchievements()
      },

      recordCommand: (levelId: number, command: string) => {
        const { levels, checkAchievements } = get()
        const now = new Date().toISOString()

        set((state) => ({
          levels: {
            ...state.levels,
            [levelId]: {
              ...state.levels[levelId],
              commandCount: (state.levels[levelId]?.commandCount || 0) + 1,
              commandHistory: [...(state.levels[levelId]?.commandHistory || []), { command, timestamp: now }],
            },
          },
        }))

        // 检查成就
        checkAchievements()
      },

      incrementAttempts: (levelId: number) => {
        set((state) => ({
          levels: {
            ...state.levels,
            [levelId]: {
              ...state.levels[levelId],
              attempts: (state.levels[levelId]?.attempts || 0) + 1,
            },
          },
        }))
      },

      incrementHints: (levelId: number) => {
        set((state) => ({
          levels: {
            ...state.levels,
            [levelId]: {
              ...state.levels[levelId],
              hints: (state.levels[levelId]?.hints || 0) + 1,
            },
          },
        }))
      },

      updateTimeSpent: (levelId: number, seconds: number) => {
        set((state) => ({
          levels: {
            ...state.levels,
            [levelId]: {
              ...state.levels[levelId],
              timeSpent: (state.levels[levelId]?.timeSpent || 0) + seconds,
            },
          },
          totalTimeSpent: state.totalTimeSpent + seconds,
        }))
      },

      unlockAchievement: (achievementId: string) => {
        const { achievements } = get()
        if (achievements[achievementId] && !achievements[achievementId].unlockedAt) {
          set((state) => ({
            achievements: {
              ...state.achievements,
              [achievementId]: {
                ...state.achievements[achievementId],
                unlockedAt: new Date().toISOString(),
              },
            },
          }))
        }
      },

      updateAchievementProgress: (achievementId: string, progress: number) => {
        set((state) => ({
          achievements: {
            ...state.achievements,
            [achievementId]: {
              ...state.achievements[achievementId],
              progress,
            },
          },
        }))
      },

      checkAchievements: () => {
        const { levels, unlockAchievement, updateAchievementProgress } = get()

        // 检查各种成就条件
        const completedLevels = Object.values(levels).filter((level) => level.completed)
        const uniqueCommands = new Set(
          Object.values(levels)
            .flatMap((level) => level.commandHistory || [])
            .map((h) => h.command)
        )

        // 检查首次初始化成就
        if (levels[1]?.commandHistory?.some((h) => h.command.includes('git init'))) {
          unlockAchievement(ACHIEVEMENT_IDS.FIRST_INIT)
        }

        // 检查首次提交成就
        if (Object.values(levels).some((level) => level.commandHistory?.some((h) => h.command.includes('git commit')))) {
          unlockAchievement(ACHIEVEMENT_IDS.FIRST_COMMIT)
        }

        // 检查速通成就
        if (Object.values(levels).some((level) => level.completed && level.timeSpent <= 180)) {
          unlockAchievement(ACHIEVEMENT_IDS.SPEED_RUNNER)
        }

        // 检查无提示成就
        if (Object.values(levels).some((level) => level.completed && level.hints === 0)) {
          unlockAchievement(ACHIEVEMENT_IDS.NO_HINT_MASTER)
        }

        // 检查完美通关成就
        if (Object.values(levels).some((level) => level.completed && level.attempts === 1)) {
          unlockAchievement(ACHIEVEMENT_IDS.PERFECT_LEVEL)
        }

        // 更新命令达人进度
        updateAchievementProgress(ACHIEVEMENT_IDS.COMMAND_MASTER, uniqueCommands.size)
        if (uniqueCommands.size >= 20) {
          unlockAchievement(ACHIEVEMENT_IDS.COMMAND_MASTER)
        }

        // 更新全部关卡进度
        updateAchievementProgress(ACHIEVEMENT_IDS.ALL_LEVELS, completedLevels.length)
        if (completedLevels.length >= 5) {
          unlockAchievement(ACHIEVEMENT_IDS.ALL_LEVELS)
        }

        // 检查连续学习成就
        const recentCompletions = Object.values(levels)
          .filter((level) => level.completedAt)
          .sort((a, b) => new Date(b.completedAt!).getTime() - new Date(a.completedAt!).getTime())

        if (recentCompletions.length >= 3) {
          const dates = new Set(recentCompletions.slice(0, 3).map((level) => new Date(level.completedAt!).toDateString()))
          if (dates.size >= 3) {
            unlockAchievement(ACHIEVEMENT_IDS.CONTINUOUS_LEARNING)
          }
        }
      },
    }),
    {
      name: 'git-game-progress',
    }
  )
)
