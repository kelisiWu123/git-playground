import { create } from 'zustand'

interface GameState {
  currentLevel: number
  score: number
  achievements: string[]
  setCurrentLevel: (level: number) => void
  addScore: (points: number) => void
  unlockAchievement: (achievement: string) => void
}

export const useGameStore = create<GameState>((set) => ({
  currentLevel: 1,
  score: 0,
  achievements: [],

  setCurrentLevel: (level) => set({ currentLevel: level }),

  addScore: (points) => set((state) => ({ score: state.score + points })),

  unlockAchievement: (achievement) =>
    set((state) => ({
      achievements: [...state.achievements, achievement],
    })),
}))
