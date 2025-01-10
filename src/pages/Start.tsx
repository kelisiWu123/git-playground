import { Link } from 'react-router-dom'
import { ROUTES } from '../constants/routes'
import { motion } from 'framer-motion'

export default function Start() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-pink-50 to-white px-4 py-8 sm:px-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="w-full max-w-md text-center">
        <h1 className="mb-4 text-3xl font-bold text-pink-600 sm:mb-8 sm:text-4xl">Git 猫咪历险记</h1>
        <p className="mb-8 text-base text-gray-600 sm:mb-12 sm:text-lg">
          和可爱的猫咪一起学习 Git，
          <br className="hidden sm:block" />
          开启你的代码版本控制之旅吧！
        </p>

        <div className="space-y-3 sm:space-y-4">
          <Link
            to={ROUTES.LEVELS}
            className="block rounded-lg bg-pink-500 px-6 py-3 text-base font-semibold text-white shadow-lg transition-all hover:bg-pink-600 hover:shadow-xl active:bg-pink-700 sm:px-8 sm:text-lg"
          >
            开始游戏
          </Link>
          <Link
            to={ROUTES.ACHIEVEMENTS}
            className="block rounded-lg bg-pink-100 px-6 py-3 text-base font-semibold text-pink-600 shadow transition-all hover:bg-pink-200 hover:shadow-md active:bg-pink-300 sm:px-8 sm:text-lg"
          >
            我的成就
          </Link>
          <Link
            to={ROUTES.SETTINGS}
            className="block rounded-lg bg-white px-6 py-3 text-base font-semibold text-pink-500 shadow transition-all hover:bg-pink-50 hover:shadow-md active:bg-pink-100 sm:px-8 sm:text-lg"
          >
            游戏设置
          </Link>
        </div>

        <div className="mt-8 space-y-1 text-xs text-gray-500 sm:mt-12 sm:text-sm">
          <p>Version 1.0.0</p>
          <p>Made with ❤️ by KelisiWu</p>
        </div>

        <div className="mt-4 text-xs text-gray-400 sm:hidden">提示：竖屏使用效果更佳</div>
      </motion.div>
    </div>
  )
}
