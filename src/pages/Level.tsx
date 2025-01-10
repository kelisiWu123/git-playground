import { useParams, Link, useNavigate } from 'react-router-dom'
import { ROUTES } from '../constants/routes'
import { LEVELS } from '../constants/levels'
import LevelContent from '../components/LevelContent'

export default function Level() {
  const { levelId } = useParams()
  const navigate = useNavigate()

  const currentLevel = LEVELS.find((level) => level.id === Number(levelId))

  if (!currentLevel) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-pink-50">
        <h1 className="mb-4 text-2xl font-bold text-pink-600">关卡不存在</h1>
        <Link to={ROUTES.LEVELS} className="rounded-lg bg-pink-500 px-6 py-2 text-white hover:bg-pink-600">
          返回关卡列表
        </Link>
      </div>
    )
  }

  const handleLevelComplete = () => {
    // TODO: 更新用户进度
    // TODO: 解锁成就

    // 显示完成提示
    alert('恭喜你完成了关卡！')

    // 如果还有下一关，则导航到下一关
    const nextLevel = LEVELS.find((level) => level.id === currentLevel.id + 1)
    if (nextLevel) {
      navigate(ROUTES.LEVEL.replace(':levelId', String(nextLevel.id)))
    } else {
      navigate(ROUTES.LEVELS)
    }
  }

  return (
    <div className="min-h-screen bg-pink-50 p-8">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-pink-600">
            Level {currentLevel.id}: {currentLevel.title}
          </h1>
          <Link to={ROUTES.LEVELS} className="rounded-lg bg-pink-100 px-4 py-2 text-pink-600 hover:bg-pink-200">
            返回关卡列表
          </Link>
        </div>

        <LevelContent level={currentLevel} onComplete={handleLevelComplete} />
      </div>
    </div>
  )
}
