import React from 'react'
import { motion } from 'framer-motion'
import { useProgressStore } from '../store/progressStore'
import { LEVELS } from '../constants/levels'

export default function ProgressStats() {
  const { levels, lastPlayedAt } = useProgressStore()

  // 计算总体进度
  const totalLevels = LEVELS.length
  const completedLevels = Object.values(levels).filter((level) => level.completed).length
  const progressPercentage = Math.round((completedLevels / totalLevels) * 100)

  // 计算学习时间
  const firstCompletedLevel = Object.values(levels)
    .filter((level) => level.completedAt)
    .sort((a, b) => new Date(a.completedAt!).getTime() - new Date(b.completedAt!).getTime())[0]

  const studyDuration = firstCompletedLevel ? Math.ceil((new Date(lastPlayedAt || '').getTime() - new Date(firstCompletedLevel.completedAt!).getTime()) / (1000 * 60 * 60 * 24)) : 0

  // 计算最近完成的关卡
  const lastCompletedLevel = Object.values(levels)
    .filter((level) => level.completed)
    .sort((a, b) => new Date(b.completedAt!).getTime() - new Date(a.completedAt!).getTime())[0]

  // 计算新的统计数据
  const totalTimeSpent = Object.values(levels).reduce((sum, level) => sum + (level.timeSpent || 0), 0)
  const totalCommands = Object.values(levels).reduce((sum, level) => sum + (level.commandCount || 0), 0)
  const totalAttempts = Object.values(levels).reduce((sum, level) => sum + (level.attempts || 0), 0)
  const averageTimePerLevel = completedLevels > 0 ? Math.round(totalTimeSpent / completedLevels) : 0

  // 分析最常用的命令
  const commandFrequency: Record<string, number> = {}
  Object.values(levels).forEach((level) => {
    level.commandHistory?.forEach((history) => {
      commandFrequency[history.command] = (commandFrequency[history.command] || 0) + 1
    })
  })
  const mostUsedCommands = Object.entries(commandFrequency)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3)

  return (
    <div className="rounded-lg bg-white p-6 shadow-md">
      <h2 className="mb-6 text-xl font-bold text-pink-600">学习进度统计</h2>

      {/* 总体进度 */}
      <div className="mb-6">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-sm text-gray-600">总体进度</span>
          <span className="text-sm font-medium text-pink-600">{progressPercentage}%</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-pink-100">
          <motion.div className="h-full bg-pink-500" initial={{ width: 0 }} animate={{ width: `${progressPercentage}%` }} transition={{ duration: 1, ease: 'easeOut' }} />
        </div>
      </div>

      {/* 基础统计 */}
      <div className="mb-6 grid grid-cols-2 gap-4">
        <div className="rounded-lg bg-pink-50 p-4">
          <div className="text-2xl font-bold text-pink-600">{completedLevels}</div>
          <div className="text-sm text-gray-600">已完成关卡</div>
        </div>
        <div className="rounded-lg bg-pink-50 p-4">
          <div className="text-2xl font-bold text-pink-600">{totalLevels - completedLevels}</div>
          <div className="text-sm text-gray-600">剩余关卡</div>
        </div>
        <div className="rounded-lg bg-pink-50 p-4">
          <div className="text-2xl font-bold text-pink-600">{studyDuration}</div>
          <div className="text-sm text-gray-600">学习天数</div>
        </div>
        <div className="rounded-lg bg-pink-50 p-4">
          <div className="text-2xl font-bold text-pink-600">{lastCompletedLevel ? LEVELS.find((l) => l.id === lastCompletedLevel.levelId)?.title || '-' : '-'}</div>
          <div className="text-sm text-gray-600">最近完成</div>
        </div>
      </div>

      {/* 详细统计 */}
      <div className="mb-6">
        <h3 className="mb-4 text-lg font-semibold text-pink-600">详细数据</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-lg bg-pink-50 p-4">
            <div className="text-2xl font-bold text-pink-600">{Math.round(totalTimeSpent / 60)}分钟</div>
            <div className="text-sm text-gray-600">总学习时长</div>
          </div>
          <div className="rounded-lg bg-pink-50 p-4">
            <div className="text-2xl font-bold text-pink-600">{Math.round(averageTimePerLevel / 60)}分钟</div>
            <div className="text-sm text-gray-600">平均每关用时</div>
          </div>
          <div className="rounded-lg bg-pink-50 p-4">
            <div className="text-2xl font-bold text-pink-600">{totalCommands}</div>
            <div className="text-sm text-gray-600">命令使用次数</div>
          </div>
          <div className="rounded-lg bg-pink-50 p-4">
            <div className="text-2xl font-bold text-pink-600">{totalAttempts}</div>
            <div className="text-sm text-gray-600">总尝试次数</div>
          </div>
        </div>
      </div>

      {/* 命令使用统计 */}
      {mostUsedCommands.length > 0 && (
        <div className="mb-6">
          <h3 className="mb-4 text-lg font-semibold text-pink-600">最常用命令</h3>
          <div className="space-y-2">
            {mostUsedCommands.map(([command, count]) => (
              <div key={command} className="flex items-center justify-between rounded-lg bg-pink-50 p-3">
                <code className="text-sm font-mono text-pink-600">{command}</code>
                <span className="text-sm text-gray-600">使用 {count} 次</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 最近活动 */}
      {lastPlayedAt && <div className="mt-6 text-center text-sm text-gray-500">上次学习时间：{new Date(lastPlayedAt).toLocaleString()}</div>}
    </div>
  )
}
