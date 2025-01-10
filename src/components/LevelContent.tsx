import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { Level, Command, LevelState } from '../constants/levels'
import GitSimulator from './GitSimulator'
import FileTree from './FileTree'

interface LevelContentProps {
  level: Level
  onComplete: () => void
  onBack: () => void
}

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
  transition: { duration: 0.3 },
}

export default function LevelContent({ level, onComplete, onBack }: LevelContentProps) {
  const [commands, setCommands] = React.useState<Command[]>([])
  const [currentState, setCurrentState] = React.useState<LevelState>(level.initialState)
  const [showSuccess, setShowSuccess] = React.useState(false)

  const handleCommand = (command: Command) => {
    setCommands((prev) => [...prev, command])

    // 更新当前状态
    switch (command.type) {
      case 'init':
        setCurrentState((prev) => ({
          ...prev,
          files: [
            {
              name: 'cat-album',
              type: 'directory',
              children: [
                {
                  name: '.git',
                  type: 'directory',
                  children: [],
                },
                ...(prev.files[0].children || []).filter((child) => child.name !== '.git'),
              ],
            },
          ],
          branch: 'master',
        }))
        break
      case 'add':
        setCurrentState((prev) => ({
          ...prev,
          files: prev.files.map((file) => ({
            ...file,
            children: file.children?.map((child) => (child.name === command.args?.[0] ? { ...child, status: 'staged' as const } : child)),
          })),
        }))
        break
      case 'commit':
        setCurrentState((prev) => ({
          ...prev,
          files: prev.files.map((file) => ({
            ...file,
            children: file.children?.map((child) => (child.status === 'staged' ? { ...child, status: 'committed' as const } : child)),
          })),
          message: command.args?.[1],
        }))
        break
      case 'branch':
        if (command.args?.[0]) {
          setCurrentState((prev) => ({
            ...prev,
            branch: command.args?.[0] || prev.branch,
          }))
        }
        break
      case 'merge':
        setCurrentState((prev) => ({
          ...prev,
          branch: 'master',
          message: `Merged branch ${command.args?.[0]}`,
        }))
        break
    }

    // 检查是否完成关卡
    const newCommands = [...commands, command]
    if (level.validation(newCommands)) {
      setShowSuccess(true)
      setTimeout(() => {
        setShowSuccess(false)
        onComplete()
      }, 1500)
    }
  }

  return (
    <div className="min-h-screen bg-pink-50">
      {/* 顶部标题栏 */}
      <div className="flex items-center justify-between border-b border-pink-100 bg-white px-6 py-4">
        <h1 className="text-2xl font-bold text-pink-600">
          Level {level.id}: {level.title}
        </h1>
        <button onClick={onBack} className="rounded-lg bg-pink-100 px-4 py-2 text-pink-600 hover:bg-pink-200">
          返回关卡列表
        </button>
      </div>

      {/* 主要内容区域 */}
      <div className="grid grid-cols-[minmax(300px,400px),1fr,minmax(300px,400px)] gap-6 p-6">
        {/* 左侧面板：故事和任务说明 */}
        <div className="space-y-6">
          <motion.div className="rounded-lg bg-white p-6 shadow-md" {...fadeIn} transition={{ duration: 0.5 }}>
            <div className="mb-4 flex items-center">
              <motion.img src="/cat-teacher.svg" alt="喵喵老师" className="mr-4 h-16 w-16 rounded-full bg-pink-50 p-1" whileHover={{ scale: 1.1, rotate: 5 }} transition={{ duration: 0.2 }} />
              <div>
                <motion.h3 className="text-lg font-semibold text-pink-600" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
                  喵喵老师
                </motion.h3>
                <motion.p className="text-gray-600" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
                  {level.story}
                </motion.p>
              </div>
            </div>
          </motion.div>

          <motion.div className="rounded-lg bg-white p-6 shadow-md" {...fadeIn} transition={{ delay: 0.2 }}>
            <h3 className="mb-2 text-lg font-semibold text-pink-600">任务目标</h3>
            <p className="mb-4 text-gray-600">{level.description}</p>
            <motion.div className="rounded-lg bg-pink-50 p-4" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.4 }}>
              <h4 className="mb-2 font-medium text-pink-600">提示</h4>
              <p className="text-sm text-gray-600">{level.hint}</p>
            </motion.div>
          </motion.div>
        </div>

        {/* 中间面板：Git模拟器 */}
        <div className="flex flex-col space-y-6">
          <motion.div className="flex h-[calc(100vh-12rem)] flex-col rounded-lg bg-white shadow-md" {...fadeIn} transition={{ delay: 0.5 }}>
            <div className="border-b border-gray-100 p-4">
              <h3 className="text-lg font-semibold text-pink-600">Git终端</h3>
            </div>
            <div className="flex-1">
              <GitSimulator onCommand={handleCommand} />
            </div>
          </motion.div>
        </div>

        {/* 右侧面板：状态显示 */}
        <div className="space-y-6">
          <motion.div className="space-y-4" {...fadeIn} transition={{ delay: 0.3 }}>
            <div className="rounded-lg bg-white p-6 shadow-md">
              <h3 className="mb-4 text-lg font-semibold text-pink-600">当前状态</h3>
              <motion.div className="mb-2 text-sm text-gray-500" animate={{ color: currentState.branch ? '#2563eb' : '#6b7280' }}>
                当前分支:{' '}
                <motion.span className="font-mono" key={currentState.branch} initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
                  {currentState.branch || '无'}
                </motion.span>
              </motion.div>
              {currentState.message && (
                <motion.div className="mb-2 text-sm text-gray-500" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
                  最新提交: <span className="font-mono text-pink-600">{currentState.message}</span>
                </motion.div>
              )}
              <FileTree files={currentState.files} />
            </div>
          </motion.div>

          <motion.div className="space-y-4" {...fadeIn} transition={{ delay: 0.4 }}>
            <div className="rounded-lg bg-white p-6 shadow-md">
              <h3 className="mb-4 text-lg font-semibold text-pink-600">目标状态</h3>
              <div className="mb-2 text-sm text-gray-500">
                目标分支: <span className="font-mono text-pink-600">{level.targetState.branch || '无'}</span>
              </div>
              {level.targetState.message && (
                <div className="mb-2 text-sm text-gray-500">
                  预期提交: <span className="font-mono text-pink-600">{level.targetState.message}</span>
                </div>
              )}
              <FileTree files={level.targetState.files} />
            </div>
          </motion.div>
        </div>
      </div>

      {/* 成功提示 */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div className="rounded-lg bg-white p-8 text-center" initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.5, opacity: 0 }}>
              <motion.div className="mb-4 text-6xl" animate={{ rotate: [0, 15, -15, 0] }} transition={{ duration: 0.5, repeat: Infinity }}>
                🎉
              </motion.div>
              <h2 className="mb-2 text-2xl font-bold text-pink-600">太棒了！</h2>
              <p className="text-gray-600">你成功完成了这个关卡！</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
