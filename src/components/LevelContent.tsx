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

export default function LevelContent({ level, onComplete, onBack }: LevelContentProps) {
  const [commands, setCommands] = React.useState<Command[]>([])
  const [currentState, setCurrentState] = React.useState<LevelState>(level.initialState)
  const [showSuccess, setShowSuccess] = React.useState(false)
  const [showHint, setShowHint] = React.useState(false)
  const [activeTab, setActiveTab] = React.useState<'terminal' | 'content' | 'tree'>('content')
  const { recordCommand, incrementAttempts, incrementHints, updateTimeSpent } = useProgressStore()

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
      <div className="flex items-center justify-between border-b border-pink-100 bg-white px-4 py-3 sm:px-6 sm:py-4">
        <div>
          <h1 className="text-lg font-bold text-pink-600 sm:text-2xl">
            Level {level.id}: <span className="hidden sm:inline">{level.title}</span>
          </h1>
          <h2 className="mt-0.5 text-sm text-gray-500 sm:hidden">{level.title}</h2>
        </div>
        <button onClick={onBack} className="rounded-lg bg-pink-100 px-3 py-1.5 text-sm font-medium text-pink-600 transition-colors hover:bg-pink-200 active:bg-pink-300 sm:px-4 sm:py-2">
          返回
        </button>
      </div>

      {/* 移动端标签页切换 */}
      <div className="border-b border-pink-100 bg-white p-2 sm:hidden">
        <div className="grid grid-cols-3 gap-2">
          <button onClick={() => setActiveTab('content')} className={`rounded-lg px-3 py-2 text-sm font-medium ${activeTab === 'content' ? 'bg-pink-500 text-white' : 'bg-pink-50 text-pink-600'}`}>
            学习内容
          </button>
          <button onClick={() => setActiveTab('terminal')} className={`rounded-lg px-3 py-2 text-sm font-medium ${activeTab === 'terminal' ? 'bg-pink-500 text-white' : 'bg-pink-50 text-pink-600'}`}>
            终端
          </button>
          <button onClick={() => setActiveTab('tree')} className={`rounded-lg px-3 py-2 text-sm font-medium ${activeTab === 'tree' ? 'bg-pink-500 text-white' : 'bg-pink-50 text-pink-600'}`}>
            文件树
          </button>
        </div>
      </div>

      {/* 主要内容区域 */}
      <div className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-[0.8fr,1.2fr,0.6fr] sm:gap-6 sm:p-6">
        {/* Git终端 */}
        <motion.div className={`flex flex-col space-y-4 sm:space-y-6 ${activeTab !== 'terminal' ? 'hidden sm:flex' : ''}`} {...fadeIn} transition={{ delay: 0.2 }}>
          <div className="flex h-[calc(100vh-16rem)] flex-col rounded-lg bg-white shadow-md sm:h-[calc(100vh-20rem)]">
            <div className="border-b border-gray-100 p-3 sm:p-4">
              <h3 className="text-base font-semibold text-pink-600 sm:text-lg">Git终端</h3>
              <p className="mt-0.5 text-xs text-gray-500 sm:mt-1 sm:text-sm">在这里输入 Git 命令来完成任务</p>
            </div>
            <div className="flex-1">
              <GitSimulator onCommand={handleCommand} />
            </div>
          </div>

          {/* 命令提示 */}
          <motion.div className="rounded-lg bg-gray-50 p-3 sm:p-4" {...fadeIn} transition={{ delay: 0.3 }}>
            <h4 className="mb-2 text-xs font-medium text-gray-600 sm:text-sm">常用命令</h4>
            <div className="space-y-1 text-xs text-gray-500 sm:text-sm">
              <p>
                <code className="rounded bg-gray-100 px-1 py-0.5">git add &lt;文件名&gt;</code> - 添加文件到暂存区
              </p>
              <p>
                <code className="rounded bg-gray-100 px-1 py-0.5">git status</code> - 查看文件状态
              </p>
            </div>
          </motion.div>
        </motion.div>

        {/* 学习内容 */}
        <div className={`space-y-4 sm:space-y-6 ${activeTab !== 'content' ? 'hidden sm:block' : ''}`}>
          <motion.div className="rounded-lg bg-white p-4 shadow-md sm:p-6" {...fadeIn} transition={{ duration: 0.5 }}>
            <div className="mb-4 flex items-center">
              <motion.img
                src="/cat-teacher.svg"
                alt="喵喵老师"
                className="mr-3 h-16 w-16 rounded-full bg-pink-50 p-1 sm:mr-4 sm:h-20 sm:w-20"
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ duration: 0.2 }}
              />
              <div>
                <motion.h3 className="mb-1 text-lg font-semibold text-pink-600 sm:mb-2 sm:text-xl" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
                  喵喵老师
                </motion.h3>
                <motion.p className="text-sm leading-relaxed text-gray-600 sm:text-base" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
                  {level.story}
                </motion.p>
              </div>
            </div>
          </motion.div>

          <motion.div className="rounded-lg bg-white p-4 shadow-md sm:p-6" {...fadeIn} transition={{ delay: 0.2 }}>
            <h3 className="mb-3 text-lg font-semibold text-pink-600 sm:mb-4 sm:text-xl">任务目标</h3>
            <p className="mb-4 text-sm leading-relaxed text-gray-600 sm:mb-6 sm:text-base">{level.description}</p>

            {/* Git 知识点 */}
            <div className="mb-4 rounded-lg bg-blue-50 p-3 sm:mb-6 sm:p-4">
              <h4 className="mb-2 text-sm font-medium text-blue-600 sm:text-base">知识要点</h4>
              <ul className="list-inside list-disc space-y-1 text-xs text-gray-600 sm:space-y-2 sm:text-sm">
                <li>Git 是一个版本控制系统，可以帮助我们记录文件的变化</li>
                <li>使用 git add 命令可以将文件添加到暂存区</li>
                <li>暂存区中的文件会被标记为待提交状态</li>
              </ul>
            </div>

            <div className="space-y-2">
              <button onClick={handleHintToggle} className="flex w-full items-center justify-between rounded-lg bg-pink-50 p-3 text-left transition-colors hover:bg-pink-100 sm:p-4">
                <h4 className="text-sm font-medium text-pink-600 sm:text-base">需要帮助？</h4>
                <motion.span animate={{ rotate: showHint ? 180 : 0 }} transition={{ duration: 0.2 }} className="text-pink-600">
                  ▼
                </motion.span>
              </button>
              <AnimatePresence>
                {showHint && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden rounded-lg bg-pink-50 p-3 text-sm text-pink-600 sm:p-4"
                  >
                    {level.hint}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>

        {/* 右侧面板：文件树 */}
        <motion.div className={`rounded-lg bg-white p-4 shadow-md ${activeTab !== 'tree' ? 'hidden sm:block' : ''}`} {...fadeIn} transition={{ delay: 0.4 }}>
          <h3 className="mb-4 text-base font-semibold text-pink-600 sm:text-lg">文件结构</h3>
          <FileTree files={currentState.files} />
        </motion.div>
      </div>

      {/* 成功提示 */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 p-4"
          >
            <div className="rounded-lg bg-white p-6 text-center shadow-xl">
              <div className="mb-4 text-4xl">🎉</div>
              <h3 className="mb-2 text-xl font-bold text-pink-600">恭喜通关！</h3>
              <p className="mb-4 text-sm text-gray-600">你已经掌握了这一关的知识点</p>
              <div className="flex flex-col gap-2">
                <button onClick={handleComplete} className="rounded-lg bg-pink-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-pink-600 active:bg-pink-700">
                  进入下一关
                </button>
                <button onClick={onBack} className="rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200 active:bg-gray-300">
                  返回关卡列表
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
