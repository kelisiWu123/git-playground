import { Link } from 'react-router-dom'
import { ROUTES } from '../constants/routes'
import { LEVELS } from '../constants/levels'
import { useProgressStore } from '../store/progressStore'
import { useEffect } from 'react'
import ProgressStats from '../components/ProgressStats'
import { motion } from 'framer-motion'

export default function Levels() {
  const { currentLevel, levels, initializeProgress } = useProgressStore()

  useEffect(() => {
    initializeProgress()
  }, [initializeProgress])

  return (
    <div className="min-h-screen bg-pink-50 p-4 pb-safe sm:p-8">
      <div className="mx-auto max-w-6xl">
        <h1 className="mb-4 text-center text-2xl font-bold text-pink-600 sm:mb-8 sm:text-3xl">Git 喵喵乐园</h1>

        <div className="mb-6 sm:mb-8">
          <ProgressStats />
        </div>

        <h2 className="mb-4 text-xl font-bold text-pink-600 sm:mb-6 sm:text-2xl">选择关卡</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 sm:gap-4 md:grid-cols-3">
          {LEVELS.map((level) => {
            const isLocked = level.id > currentLevel
            const isCompleted = levels[level.id]?.completed

            if (isCompleted) {
              return (
                <motion.div
                  key={level.id}
                  className="flex flex-col rounded-lg bg-green-50 p-3 shadow-md sm:p-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-base font-semibold text-green-600 sm:text-lg">Level {level.id}</span>
                    <span className="text-xl sm:text-2xl">✨</span>
                  </div>
                  <h3 className="mb-2 text-sm font-medium text-green-600 sm:mb-3 sm:text-base">{level.title}</h3>
                  <div className="flex-1">
                    <h4 className="mb-1 text-xs font-medium text-green-600 sm:mb-2 sm:text-sm">知识要点</h4>
                    <ul className="list-inside list-disc space-y-0.5 text-xs text-gray-600 sm:space-y-1 sm:text-sm">
                      {level.id === 1 && (
                        <>
                          <li>使用 git init 初始化仓库</li>
                          <li>理解 Git 仓库的概念</li>
                          <li>.git 目录的作用</li>
                        </>
                      )}
                      {level.id === 2 && (
                        <>
                          <li>使用 git add 添加文件</li>
                          <li>理解工作区和暂存区</li>
                          <li>文件的未追踪状态</li>
                        </>
                      )}
                      {level.id === 3 && (
                        <>
                          <li>使用 git commit 提交更改</li>
                          <li>编写合适的提交信息</li>
                          <li>理解版本历史记录</li>
                        </>
                      )}
                      {level.id === 4 && (
                        <>
                          <li>使用 git branch 创建分支</li>
                          <li>理解分支的概念</li>
                          <li>分支命名的规范</li>
                        </>
                      )}
                      {level.id === 5 && (
                        <>
                          <li>使用 git merge 合并分支</li>
                          <li>处理合并冲突</li>
                          <li>理解分支合并策略</li>
                        </>
                      )}
                    </ul>
                  </div>
                  <div className="mt-2 text-center sm:mt-3">
                    <Link
                      to={ROUTES.LEVEL.replace(':levelId', String(level.id))}
                      className="inline-block rounded-md px-3 py-1.5 text-xs font-medium text-green-600 hover:bg-green-100 active:bg-green-200 sm:text-sm"
                    >
                      重新练习 →
                    </Link>
                  </div>
                </motion.div>
              )
            }

            return (
              <Link
                key={level.id}
                to={isLocked ? '#' : ROUTES.LEVEL.replace(':levelId', String(level.id))}
                className={`flex aspect-square flex-col items-center justify-center rounded-lg p-3 shadow-md transition-transform sm:p-4 ${
                  isLocked ? 'cursor-not-allowed bg-gray-100' : 'bg-white hover:scale-105 active:scale-100'
                }`}
              >
                <div className={`mb-1 text-xl font-bold sm:mb-2 sm:text-2xl ${isLocked ? 'text-gray-400' : 'text-pink-500'}`}>Level {level.id}</div>
                <div className={`text-center text-xs sm:text-sm ${isLocked ? 'text-gray-400' : 'text-gray-500'}`}>{level.title}</div>
                {isLocked && <div className="mt-2 text-2xl sm:text-3xl">🔒</div>}
                {!isLocked && <div className="mt-2 text-xs text-pink-600 sm:text-sm">点击开始</div>}
              </Link>
            )
          })}
        </div>
      </div>

      <div className="mt-6 text-center sm:mt-8">
        <Link to={ROUTES.HOME} className="inline-block rounded-lg px-4 py-2 text-sm font-medium text-pink-600 hover:bg-pink-100 active:bg-pink-200 sm:text-base">
          返回首页
        </Link>
      </div>
    </div>
  )
}
