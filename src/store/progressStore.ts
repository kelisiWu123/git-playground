import { create } from 'zustand'
import { LEVELS } from '../constants/levels'
import { LevelProgress, Progress } from '../types/progress'

interface ProgressStore {
  currentLevel: number
  levels: Record<number, LevelProgress>
  lastPlayedAt: string
  initializeProgress: () => void
  completeLevel: (levelId: number) => void
  recordCommand: (levelId: number, command: string) => void
  incrementAttempts: (levelId: number) => void
  incrementHints: (levelId: number) => void
  updateTimeSpent: (levelId: number, seconds: number) => void
}

const STORAGE_KEY = 'git-game-progress'

const getInitialProgress = (): Progress => {
  const savedProgress = localStorage.getItem(STORAGE_KEY)
  if (savedProgress) {
    return JSON.parse(savedProgress)
  }

  const initialLevels: Record<number, LevelProgress> = {}
  LEVELS.forEach((level) => {
    initialLevels[level.id] = {
      levelId: level.id,
      completed: false,
      timeSpent: 0,
      commandCount: 0,
      commandHistory: [],
      attempts: 0,
      hints: 0,
    }
  })

  return {
    currentLevel: 1,
    levels: initialLevels,
    lastPlayedAt: new Date().toISOString(),
  }
}

export const useProgressStore = create<ProgressStore>((set, get) => ({
  ...getInitialProgress(),

  initializeProgress: () => {
    const progress = getInitialProgress()
    set(progress)
  },

  completeLevel: (levelId: number) => {
    set((state) => {
      const newLevels = { ...state.levels }
      newLevels[levelId] = {
        ...newLevels[levelId],
        completed: true,
        completedAt: new Date().toISOString(),
      }

      const newState = {
        currentLevel: Math.min(levelId + 1, LEVELS.length),
        levels: newLevels,
        lastPlayedAt: new Date().toISOString(),
      }

      localStorage.setItem(STORAGE_KEY, JSON.stringify(newState))
      return newState
    })
  },

  recordCommand: (levelId: number, command: string) => {
    set((state) => {
      const newLevels = { ...state.levels }
      const level = newLevels[levelId]
      newLevels[levelId] = {
        ...level,
        commandCount: (level.commandCount || 0) + 1,
        commandHistory: [...(level.commandHistory || []), { command, timestamp: new Date().toISOString() }],
      }

      const newState = {
        ...state,
        levels: newLevels,
        lastPlayedAt: new Date().toISOString(),
      }

      localStorage.setItem(STORAGE_KEY, JSON.stringify(newState))
      return newState
    })
  },

  incrementAttempts: (levelId: number) => {
    set((state) => {
      const newLevels = { ...state.levels }
      const level = newLevels[levelId]
      newLevels[levelId] = {
        ...level,
        attempts: (level.attempts || 0) + 1,
      }

      const newState = {
        ...state,
        levels: newLevels,
        lastPlayedAt: new Date().toISOString(),
      }

      localStorage.setItem(STORAGE_KEY, JSON.stringify(newState))
      return newState
    })
  },

  incrementHints: (levelId: number) => {
    set((state) => {
      const newLevels = { ...state.levels }
      const level = newLevels[levelId]
      newLevels[levelId] = {
        ...level,
        hints: (level.hints || 0) + 1,
      }

      const newState = {
        ...state,
        levels: newLevels,
        lastPlayedAt: new Date().toISOString(),
      }

      localStorage.setItem(STORAGE_KEY, JSON.stringify(newState))
      return newState
    })
  },

  updateTimeSpent: (levelId: number, seconds: number) => {
    set((state) => {
      const newLevels = { ...state.levels }
      const level = newLevels[levelId]
      newLevels[levelId] = {
        ...level,
        timeSpent: (level.timeSpent || 0) + seconds,
      }

      const newState = {
        ...state,
        levels: newLevels,
        lastPlayedAt: new Date().toISOString(),
      }

      localStorage.setItem(STORAGE_KEY, JSON.stringify(newState))
      return newState
    })
  },
}))
