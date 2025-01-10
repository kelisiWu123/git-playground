import { useParams, Link, useNavigate } from 'react-router-dom'
import { ROUTES } from '../constants/routes'
import { LEVELS } from '../constants/levels'
import { useProgressStore } from '../store/progressStore'
import LevelContent from '../components/LevelContent'
import { useEffect } from 'react'

export default function Level() {
  const { levelId } = useParams()
  const navigate = useNavigate()
  const { currentLevel, completeLevel, initializeProgress } = useProgressStore()

  const levelNumber = Number(levelId)
  const currentLevelData = LEVELS.find((level) => level.id === levelNumber)

  // 初始化进度
  useEffect(() => {
    initializeProgress()
  }, [initializeProgress])

  // 检查关卡访问权限
  useEffect(() => {
    if (currentLevelData && levelNumber > currentLevel) {
      navigate(ROUTES.LEVELS)
    }
  }, [currentLevel, currentLevelData, levelNumber, navigate])

  // 如果关卡不存在,显示错误页面
  if (!currentLevelData) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-pink-50 px-4 py-8 text-center">
        <h1 className="mb-4 text-xl font-bold text-pink-600 sm:text-2xl">关卡不存在</h1>
        <p className="mb-6 text-sm text-gray-600 sm:text-base">抱歉,您访问的关卡不存在。请返回关卡列表选择其他关卡。</p>
        <Link to={ROUTES.LEVELS} className="rounded-lg bg-pink-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-pink-600 active:bg-pink-700 sm:px-6 sm:text-base">
          返回关卡列表
        </Link>
      </div>
    )
  }

  const handleLevelComplete = () => {
    completeLevel(levelNumber)

    // 如果还有下一关，则导航到下一关
    const nextLevel = LEVELS.find((level) => level.id === currentLevelData.id + 1)
    if (nextLevel) {
      navigate(ROUTES.LEVEL.replace(':levelId', String(nextLevel.id)))
    } else {
      navigate(ROUTES.LEVELS)
    }
  }

  return (
    <div className="min-h-screen bg-pink-50">
      <LevelContent level={currentLevelData} onComplete={handleLevelComplete} onBack={() => navigate(ROUTES.LEVELS)} />
    </div>
  )
}
