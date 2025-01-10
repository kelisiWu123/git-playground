import { Link } from 'react-router-dom'
import { ROUTES } from '../constants/routes'
import { motion } from 'framer-motion'

export default function Start() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-pink-50 to-white px-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="text-center">
        <h1 className="mb-8 text-4xl font-bold text-pink-600">Git 猫咪历险记</h1>
        <p className="mb-12 text-lg text-gray-600">
          和可爱的猫咪一起学习 Git，
          <br />
          开启你的代码版本控制之旅吧！
        </p>

        <div className="space-y-4">
          <Link to={ROUTES.LEVELS} className="block rounded-lg bg-pink-500 px-8 py-3 text-lg font-semibold text-white shadow-lg transition-all hover:bg-pink-600 hover:shadow-xl">
            开始游戏
          </Link>
          <Link to={ROUTES.ACHIEVEMENTS} className="block rounded-lg bg-pink-100 px-8 py-3 text-lg font-semibold text-pink-600 shadow transition-all hover:bg-pink-200 hover:shadow-md">
            我的成就
          </Link>
          <Link to={ROUTES.SETTINGS} className="block rounded-lg bg-white px-8 py-3 text-lg font-semibold text-pink-500 shadow transition-all hover:bg-pink-50 hover:shadow-md">
            游戏设置
          </Link>
        </div>

        <div className="mt-12 text-sm text-gray-500">
          <p>Version 1.0.0</p>
          <p>Made with ❤️ by KelisiWu</p>
        </div>
      </motion.div>
    </div>
  )
}
