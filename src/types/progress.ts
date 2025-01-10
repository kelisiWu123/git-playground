export interface Achievement {
  id: string
  title: string
  description: string
  unlockedAt?: string
}

export interface LevelProgress {
  levelId: number
  completed: boolean
  completedAt?: string
  commands: string[]
}

export interface UserProgress {
  currentLevel: number
  levels: Record<number, LevelProgress>
  achievements: Record<string, Achievement>
  lastPlayedAt?: string
}
