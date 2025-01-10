import type { Achievement, Progress } from '../types/progress'

// Achievement IDs as constants
export const ACHIEVEMENT_IDS = {
  FIRST_INIT: 'first-init',
  FIRST_COMMIT: 'first-commit',
  SPEED_RUNNER: 'speed-runner',
  NO_HINT_MASTER: 'no-hint-master',
  PERFECT_LEVEL: 'perfect-level',
  COMMAND_MASTER: 'command-master',
  ALL_LEVELS: 'all-levels',
  CONTINUOUS_LEARNING: 'continuous-learning',
} as const

export const ACHIEVEMENTS: Achievement[] = [
  // 基础操作成就
  {
    id: ACHIEVEMENT_IDS.FIRST_INIT,
    title: '从零开始',
    description: '成功创建第一个Git仓库',
    icon: '🎉',
    condition: (progress: Progress) => progress.levels[1]?.completed,
  },
  {
    id: ACHIEVEMENT_IDS.FIRST_COMMIT,
    title: '第一次提交',
    description: '完成你的第一次代码提交',
    icon: '📝',
    condition: (progress: Progress) => progress.levels[4]?.completed,
  },
  {
    id: ACHIEVEMENT_IDS.SPEED_RUNNER,
    title: '极速通关',
    description: '在3分钟内完成一个关卡',
    icon: '⚡',
    condition: (progress: Progress) => Object.values(progress.levels).some((level) => level.timeSpent <= 180),
  },
  {
    id: ACHIEVEMENT_IDS.NO_HINT_MASTER,
    title: '无需提示',
    description: '不使用任何提示完成关卡',
    icon: '🎯',
    condition: (progress: Progress) => Object.values(progress.levels).some((level) => level.completed && level.hints === 0),
  },
  {
    id: ACHIEVEMENT_IDS.PERFECT_LEVEL,
    title: '完美通关',
    description: '一次尝试就完成关卡',
    icon: '💎',
    condition: (progress: Progress) => Object.values(progress.levels).some((level) => level.completed && level.attempts === 1),
  },
  {
    id: ACHIEVEMENT_IDS.COMMAND_MASTER,
    title: '命令达人',
    description: '使用20个不同的Git命令',
    icon: '🎮',
    condition: (progress: Progress) => {
      const uniqueCommands = new Set(
        Object.values(progress.levels)
          .flatMap((level) => level.commandHistory || [])
          .map((h) => h.command)
      )
      return uniqueCommands.size >= 20
    },
  },
  {
    id: ACHIEVEMENT_IDS.ALL_LEVELS,
    title: '全部通关',
    description: '完成所有关卡',
    icon: '👑',
    condition: (progress: Progress) => Object.values(progress.levels).filter((level) => level.completed).length >= 5,
  },
  {
    id: ACHIEVEMENT_IDS.CONTINUOUS_LEARNING,
    title: '持续学习',
    description: '连续三天完成关卡',
    icon: '📚',
    condition: (progress: Progress) => {
      const completedLevels = Object.values(progress.levels).filter((level) => level.completedAt)
      if (completedLevels.length < 3) return false

      const dates = new Set(completedLevels.map((level) => new Date(level.completedAt!).toDateString()))
      return dates.size >= 3
    },
  },
]
