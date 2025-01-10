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
  timeSpent: number
  commandCount: number
  commandHistory: {
    command: string
    timestamp: string
  }[]
  attempts: number
  hints: number
}

export interface UserProgress {
  currentLevel: number
  levels: Record<number, LevelProgress>
  achievements: Record<string, Achievement>
  lastPlayedAt?: string
}

export interface Progress {
  currentLevel: number
  levels: Record<number, LevelProgress>
  lastPlayedAt: string
}
