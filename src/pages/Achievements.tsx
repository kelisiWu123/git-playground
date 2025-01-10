import { Link } from 'react-router-dom'
import { ROUTES } from '../constants/routes'
import { useProgressStore } from '../store/progressStore'
import { motion } from 'framer-motion'
import { ACHIEVEMENTS } from '../constants/achievements'

export default function Achievements() {
  const { achievements } = useProgressStore()

  return (
    <div className="min-h-screen bg-pink-50 p-8">
      <h1 className="mb-8 text-center text-3xl font-bold text-pink-600">我的成就</h1>
      <div className="mx-auto max-w-4xl space-y-4">
        {ACHIEVEMENTS.map((achievement) => {
          const userAchievement = achievements[achievement.id]
          const isUnlocked = userAchievement?.unlockedAt
          const progress = userAchievement?.progress
          const maxProgress = achievement.id === 'command-master' ? 20 : achievement.id === 'all-levels' ? 5 : undefined

          return (
            <motion.div
              key={achievement.id}
              className={`rounded-lg bg-white p-6 shadow-md transition-colors ${isUnlocked ? 'border-2 border-green-300' : ''}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <motion.div
                    className={`text-3xl ${isUnlocked ? 'opacity-100' : 'opacity-50'}`}
                    animate={isUnlocked ? { rotate: [0, -10, 10, -10, 10, 0], scale: [1, 1.2, 1] } : {}}
                    transition={{ duration: 0.5 }}
                  >
                    {achievement.icon}
                  </motion.div>
                  <div>
                    <h3 className={`text-lg font-semibold ${isUnlocked ? 'text-green-600' : 'text-gray-600'}`}>{achievement.title}</h3>
                    <p className="text-sm text-gray-500">{achievement.description}</p>
                  </div>
                </div>
                <div className="text-right">
                  {isUnlocked ? (
                    <div className="flex flex-col items-end">
                      <span className="rounded-full bg-green-100 px-3 py-1 text-sm text-green-600">已解锁</span>
                      <span className="mt-1 text-xs text-gray-400">{new Date(userAchievement.unlockedAt!).toLocaleDateString()}</span>
                    </div>
                  ) : (
                    <span className="rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-600">未解锁</span>
                  )}
                </div>
              </div>

              {/* 进度条 */}
              {maxProgress && (
                <div className="mt-4">
                  <div className="mb-1 flex items-center justify-between text-xs text-gray-500">
                    <span>进度</span>
                    <span>
                      {progress || 0} / {maxProgress}
                    </span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-gray-100">
                    <motion.div
                      className="h-full bg-green-500"
                      initial={{ width: 0 }}
                      animate={{ width: `${((progress || 0) / maxProgress) * 100}%` }}
                      transition={{ duration: 0.5, ease: 'easeOut' }}
                    />
                  </div>
                </div>
              )}
            </motion.div>
          )
        })}
      </div>

      <Link to={ROUTES.HOME} className="mt-8 block text-center text-pink-600 hover:text-pink-700">
        返回首页
      </Link>
    </div>
  )
}
