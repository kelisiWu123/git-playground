export interface LevelProgress {
  levelId: number
  completed: boolean
  completedAt?: string
  timeSpent: number
  commandCount: number
  commandHistory: Array<{
    command: string
    timestamp: string
  }>
  attempts: number
  hints: number
}

export interface Progress {
  levels: Record<number, LevelProgress>
  achievements: Record<string, Achievement>
  lastCompletedLevel: number
  totalTimeSpent: number
}

export interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  unlockedAt?: string
  progress?: number
  condition: (progress: Progress) => boolean
}

export type AchievementId = string
