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

      {/* 详细统计 */}
      <div className="grid grid-cols-2 gap-4">
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

      {/* 最近活动 */}
      {lastPlayedAt && <div className="mt-6 text-center text-sm text-gray-500">上次学习时间：{new Date(lastPlayedAt).toLocaleString()}</div>}
    </div>
  )
}
