import React, { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { Level, Command, LevelState } from '../constants/levels'
import GitSimulator from './GitSimulator'
import FileTree from './FileTree'
import { useProgressStore } from '../store/progressStore'

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

// 格式化时间
const formatTime = (seconds: number) => {
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  return `${minutes}分${remainingSeconds}秒`
}

export default function LevelContent({ level, onComplete, onBack }: LevelContentProps) {
  const [commands, setCommands] = React.useState<Command[]>([])
  const [currentState, setCurrentState] = React.useState<LevelState>(level.initialState)
  const [showSuccess, setShowSuccess] = React.useState(false)
  const [showHint, setShowHint] = React.useState(false)
  const { recordCommand, incrementAttempts, incrementHints, updateTimeSpent, levels } = useProgressStore()

  // 使用 ref 来存储开始时间,避免重渲染
  const startTimeRef = React.useRef(Date.now())
  const timerRef = React.useRef<number>()

  // 组件挂载时开始计时
  useEffect(() => {
    startTimeRef.current = Date.now()

    // 每30秒更新一次用时
    timerRef.current = window.setInterval(() => {
      updateTimeSpent(level.id, 30) // 更新最近30秒的用时
    }, 30000)

    // 组件卸载时清理
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
      // 最后更新一次用时
      const finalTime = Date.now()
      const finalTimeSpent = Math.floor((finalTime - startTimeRef.current) / 1000)
      const remainingSeconds = finalTimeSpent % 30
      if (remainingSeconds > 0) {
        updateTimeSpent(level.id, remainingSeconds)
      }
    }
  }, [level.id, updateTimeSpent])

  // 关卡完成时更新最终用时
  const handleComplete = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current)
    }
    const finalTime = Date.now()
    const finalTimeSpent = Math.floor((finalTime - startTimeRef.current) / 1000)
    const remainingSeconds = finalTimeSpent % 30
    if (remainingSeconds > 0) {
      updateTimeSpent(level.id, remainingSeconds)
    }
    onComplete()
  }

  const handleCommand = (command: Command) => {
    setCommands((prev) => [...prev, command])

    // 记录命令
    recordCommand(level.id, `git ${command.type}${command.args ? ' ' + command.args.join(' ') : ''}`)

    // 检查命令是否符合要求
    const isValidCommand = level.requiredCommands.some((required) => required.type === command.type && (!required.args || required.args.every((arg, i) => command.args?.[i] === arg)))

    if (!isValidCommand) {
      // 如果命令不符合要求，增加尝试次数
      incrementAttempts(level.id)
      return
    }

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
        handleComplete()
      }, 1500)
    } else {
      // 如果命令正确但还未完成关卡，也增加尝试次数
      incrementAttempts(level.id)
    }
  }

  const handleHintToggle = () => {
    if (!showHint) {
      incrementHints(level.id)
    }
    setShowHint(!showHint)
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
      <div className="grid grid-cols-[0.8fr,1.2fr,0.6fr] gap-6 p-6">
        {/* 左侧面板：Git终端 */}
        <div className="flex flex-col space-y-6">
          <motion.div className="flex h-[calc(100vh-20rem)] flex-col rounded-lg bg-white shadow-md" {...fadeIn} transition={{ delay: 0.2 }}>
            <div className="border-b border-gray-100 p-4">
              <h3 className="text-lg font-semibold text-pink-600">Git终端</h3>
              <p className="mt-1 text-sm text-gray-500">在这里输入 Git 命令来完成任务</p>
            </div>
            <div className="flex-1">
              <GitSimulator onCommand={handleCommand} />
            </div>
          </motion.div>

          {/* 命令提示 */}
          <motion.div className="rounded-lg bg-gray-50 p-4" {...fadeIn} transition={{ delay: 0.3 }}>
            <h4 className="mb-2 text-sm font-medium text-gray-600">常用命令</h4>
            <div className="space-y-1 text-sm text-gray-500">
              <p>
                <code className="rounded bg-gray-100 px-1 py-0.5">git add &lt;文件名&gt;</code> - 添加文件到暂存区
              </p>
              <p>
                <code className="rounded bg-gray-100 px-1 py-0.5">git status</code> - 查看文件状态
              </p>
            </div>
          </motion.div>
        </div>

        {/* 中间面板：学习内容 */}
        <div className="space-y-6">
          <motion.div className="rounded-lg bg-white p-6 shadow-md" {...fadeIn} transition={{ duration: 0.5 }}>
            <div className="mb-4 flex items-center">
              <motion.img src="/cat-teacher.svg" alt="喵喵老师" className="mr-4 h-20 w-20 rounded-full bg-pink-50 p-1" whileHover={{ scale: 1.1, rotate: 5 }} transition={{ duration: 0.2 }} />
              <div>
                <motion.h3 className="mb-2 text-xl font-semibold text-pink-600" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
                  喵喵老师
                </motion.h3>
                <motion.p className="text-base leading-relaxed text-gray-600" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
                  {level.story}
                </motion.p>
              </div>
            </div>
          </motion.div>

          <motion.div className="rounded-lg bg-white p-6 shadow-md" {...fadeIn} transition={{ delay: 0.2 }}>
            <h3 className="mb-4 text-xl font-semibold text-pink-600">任务目标</h3>
            <p className="mb-6 text-base leading-relaxed text-gray-600">{level.description}</p>

            {/* Git 知识点 */}
            <div className="mb-6 rounded-lg bg-blue-50 p-4">
              <h4 className="mb-2 font-medium text-blue-600">知识要点</h4>
              <ul className="list-inside list-disc space-y-2 text-sm text-gray-600">
                <li>Git 是一个版本控制系统，可以帮助我们记录文件的变化</li>
                <li>使用 git add 命令可以将文件添加到暂存区</li>
                <li>暂存区中的文件会被标记为待提交状态</li>
              </ul>
            </div>

            <div className="space-y-2">
              <button onClick={handleHintToggle} className="flex w-full items-center justify-between rounded-lg bg-pink-50 p-4 text-left transition-colors hover:bg-pink-100">
                <h4 className="font-medium text-pink-600">需要帮助？</h4>
                <motion.span animate={{ rotate: showHint ? 180 : 0 }} transition={{ duration: 0.2 }} className="text-pink-600">
                  ▼
                </motion.span>
              </button>
              <AnimatePresence>
                {showHint && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden">
                    <div className="rounded-lg bg-pink-50 p-4">
                      <p className="text-sm leading-relaxed text-gray-600">{level.hint}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>

        {/* 右侧面板：状态和数据 */}
        <div className="space-y-6">
          {/* 简化的统计数据 */}
          <motion.div className="rounded-lg bg-white p-4 shadow-md" {...fadeIn} transition={{ delay: 0.3 }}>
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <span className="text-sm text-gray-500">已用时间</span>
              <span className="font-mono text-pink-600">{formatTime(levels[level.id]?.timeSpent || 0)}</span>
            </div>
            <div className="flex items-center justify-between border-b border-gray-100 py-3">
              <span className="text-sm text-gray-500">尝试次数</span>
              <span className="font-mono text-pink-600">{levels[level.id]?.attempts || 0} 次</span>
            </div>
            <div className="flex items-center justify-between pt-3">
              <span className="text-sm text-gray-500">使用提示</span>
              <span className="font-mono text-pink-600">{levels[level.id]?.hints || 0} 次</span>
            </div>
          </motion.div>

          {/* 当前状态 */}
          <motion.div className="rounded-lg bg-white p-4 shadow-md" {...fadeIn} transition={{ delay: 0.4 }}>
            <h3 className="mb-3 font-semibold text-pink-600">当前状态</h3>
            <div className="mb-2 text-sm text-gray-500">
              分支: <span className="font-mono text-pink-600">{currentState.branch || '无'}</span>
            </div>
            <FileTree files={currentState.files} />
          </motion.div>

          {/* 目标状态 */}
          <motion.div className="rounded-lg bg-white p-4 shadow-md" {...fadeIn} transition={{ delay: 0.5 }}>
            <h3 className="mb-3 font-semibold text-pink-600">目标状态</h3>
            <div className="mb-2 text-sm text-gray-500">
              分支: <span className="font-mono text-pink-600">{level.targetState.branch || '无'}</span>
            </div>
            <FileTree files={level.targetState.files} />
          </motion.div>
        </div>
      </div>

      {/* 成功提示 */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div className="max-w-md rounded-lg bg-white p-8 text-center shadow-xl" initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.5, opacity: 0 }}>
              <motion.div className="mb-4 text-6xl" animate={{ rotate: [0, 15, -15, 0] }} transition={{ duration: 0.5, repeat: Infinity }}>
                🎉
              </motion.div>
              <h2 className="mb-4 text-2xl font-bold text-pink-600">太棒了！</h2>
              <p className="mb-6 text-gray-600">你成功完成了这个关卡！</p>

              {/* 统计数据总结 */}
              <div className="mb-6 space-y-4 rounded-lg bg-pink-50 p-4">
                <h3 className="text-lg font-semibold text-pink-600">关卡统计</h3>
                <div className="grid grid-cols-2 gap-4">
                  <motion.div className="rounded-lg bg-white p-3 text-center" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                    <div className="text-sm text-gray-500">完成用时</div>
                    <div className="font-mono text-lg font-bold text-pink-600">{formatTime(levels[level.id]?.timeSpent || 0)}</div>
                  </motion.div>

                  <motion.div className="rounded-lg bg-white p-3 text-center" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                    <div className="text-sm text-gray-500">尝试次数</div>
                    <div className="font-mono text-lg font-bold text-pink-600">{levels[level.id]?.attempts || 0} 次</div>
                  </motion.div>

                  <motion.div className="rounded-lg bg-white p-3 text-center" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                    <div className="text-sm text-gray-500">使用提示</div>
                    <div className="font-mono text-lg font-bold text-pink-600">{levels[level.id]?.hints || 0} 次</div>
                  </motion.div>

                  <motion.div className="rounded-lg bg-white p-3 text-center" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
                    <div className="text-sm text-gray-500">命令使用</div>
                    <div className="font-mono text-lg font-bold text-pink-600">{levels[level.id]?.commandCount || 0} 次</div>
                  </motion.div>
                </div>
              </div>

              {/* 评价和鼓励 */}
              <motion.div className="mb-6 text-gray-600" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
                {levels[level.id]?.attempts === 1 ? (
                  <p>一次就完成了,真是太厉害了！🌟</p>
                ) : levels[level.id]?.attempts && levels[level.id]?.attempts <= 3 ? (
                  <p>经过几次尝试就掌握了要领,继续保持！✨</p>
                ) : (
                  <p>虽然花了一些时间,但最终还是成功了,做得好！💪</p>
                )}
              </motion.div>

              {/* 继续按钮 */}
              <motion.button
                className="rounded-lg bg-pink-500 px-6 py-2 text-white hover:bg-pink-600"
                onClick={() => {
                  setShowSuccess(false)
                  handleComplete()
                }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                继续下一关
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
