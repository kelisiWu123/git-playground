import { Link } from 'react-router-dom'
import { ROUTES } from '../constants/routes'
import { LEVELS } from '../constants/levels'
import { useProgressStore } from '../store/progressStore'
import { useEffect } from 'react'
import ProgressStats from '../components/ProgressStats'

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

            return (
              <Link
                key={level.id}
                to={isLocked ? '#' : ROUTES.LEVEL.replace(':levelId', String(level.id))}
                className={`flex aspect-square flex-col items-center justify-center rounded-lg p-4 shadow-md transition-transform ${
                  isLocked ? 'cursor-not-allowed bg-gray-100' : isCompleted ? 'bg-green-50 hover:scale-105' : 'bg-white hover:scale-105'
                }`}
              >
                <div className={`mb-2 text-2xl font-bold ${isLocked ? 'text-gray-400' : isCompleted ? 'text-green-500' : 'text-pink-500'}`}>Level {level.id}</div>
                <div className={`text-center text-sm ${isLocked ? 'text-gray-400' : 'text-gray-500'}`}>{level.title}</div>
                {isLocked && <div className="mt-2 text-3xl">🔒</div>}
                {isCompleted && <div className="mt-2 text-3xl">✨</div>}
                {!isLocked && !isCompleted && <div className="mt-2 text-sm text-pink-600">点击开始</div>}
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
