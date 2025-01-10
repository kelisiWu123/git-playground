import { Link } from 'react-router-dom'
import { ROUTES } from '../constants/routes'

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-pink-50">
      <h1 className="mb-8 text-4xl font-bold text-pink-600">Git 喵喵乐园</h1>
      <div className="space-y-4">
        <Link to={ROUTES.LEVELS} className="block rounded-lg bg-pink-500 px-8 py-3 text-center font-medium text-white hover:bg-pink-600">
          开始游戏
        </Link>
        <Link to={ROUTES.ACHIEVEMENTS} className="block rounded-lg bg-pink-100 px-8 py-3 text-center font-medium text-pink-600 hover:bg-pink-200">
          查看成就
        </Link>
        <Link to={ROUTES.SETTINGS} className="block rounded-lg bg-pink-100 px-8 py-3 text-center font-medium text-pink-600 hover:bg-pink-200">
          个人设置
        </Link>
      </div>
    </div>
  )
}
