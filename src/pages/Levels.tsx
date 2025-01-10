import { Link } from 'react-router-dom'
import { ROUTES } from '../constants/routes'

export default function Levels() {
  return (
    <div className="min-h-screen bg-pink-50 p-8">
      <h1 className="mb-8 text-center text-3xl font-bold text-pink-600">选择关卡</h1>
      <div className="mx-auto grid max-w-4xl grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
        {[1, 2, 3, 4, 5].map((level) => (
          <Link
            key={level}
            to={ROUTES.LEVEL.replace(':levelId', String(level))}
            className="flex aspect-square flex-col items-center justify-center rounded-lg bg-white p-4 shadow-md transition-transform hover:scale-105"
          >
            <div className="mb-2 text-2xl font-bold text-pink-500">Level {level}</div>
            <div className="text-sm text-gray-500">点击开始</div>
          </Link>
        ))}
      </div>
      <Link to={ROUTES.HOME} className="mt-8 block text-center text-pink-600 hover:text-pink-700">
        返回首页
      </Link>
    </div>
  )
}
