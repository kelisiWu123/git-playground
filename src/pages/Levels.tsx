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
    <div className="min-h-screen bg-pink-50 p-8">
      <h1 className="mb-8 text-center text-3xl font-bold text-pink-600">Git 喵喵乐园</h1>

      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <ProgressStats />
        </div>

        <h2 className="mb-6 text-2xl font-bold text-pink-600">选择关卡</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
          {LEVELS.map((level) => {
            const isLocked = level.id > currentLevel
            const isCompleted = levels[level.id]?.completed

            if (isCompleted) {
              return (
                <motion.div key={level.id} className="flex flex-col rounded-lg bg-green-50 p-4 shadow-md" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-lg font-semibold text-green-600">Level {level.id}</span>
                    <span className="text-2xl">✨</span>
                  </div>
                  <h3 className="mb-3 text-base font-medium text-green-600">{level.title}</h3>
                  <div className="flex-1">
                    <h4 className="mb-2 text-sm font-medium text-green-600">知识要点</h4>
                    <ul className="list-inside list-disc space-y-1 text-sm text-gray-600">
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
                  <div className="mt-3 text-center">
                    <Link to={ROUTES.LEVEL.replace(':levelId', String(level.id))} className="text-sm text-green-600 hover:text-green-700">
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
                className={`flex aspect-square flex-col items-center justify-center rounded-lg p-4 shadow-md transition-transform ${
                  isLocked ? 'cursor-not-allowed bg-gray-100' : 'bg-white hover:scale-105'
                }`}
              >
                <div className={`mb-2 text-2xl font-bold ${isLocked ? 'text-gray-400' : 'text-pink-500'}`}>Level {level.id}</div>
                <div className={`text-center text-sm ${isLocked ? 'text-gray-400' : 'text-gray-500'}`}>{level.title}</div>
                {isLocked && <div className="mt-2 text-3xl">🔒</div>}
                {!isLocked && <div className="mt-2 text-sm text-pink-600">点击开始</div>}
              </Link>
            )
          })}
        </div>
      </div>

      <Link to={ROUTES.HOME} className="mt-8 block text-center text-pink-600 hover:text-pink-700">
        返回首页
      </Link>
    </div>
  )
}
