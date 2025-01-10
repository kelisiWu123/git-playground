import { Link } from 'react-router-dom'
import { ROUTES } from '../constants/routes'
import { motion } from 'framer-motion'
import { useSettingsStore } from '../store/settingsStore'

export default function Settings() {
  const { language, setLanguage, resetSettings } = useSettingsStore()

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white p-8">
      <div className="mx-auto max-w-2xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <h1 className="mb-8 text-center text-3xl font-bold text-pink-600">游戏设置</h1>

          <div className="space-y-8 rounded-lg bg-white p-6 shadow-lg">
            {/* 语言选择 */}
            <div>
              <label className="mb-2 block font-medium text-gray-700">语言</label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full rounded-lg border border-gray-300 p-2 focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-200"
              >
                <option value="zh">简体中文</option>
                <option value="en">English</option>
              </select>
            </div>

            {/* 重置按钮 */}
            <div className="pt-4">
              <button onClick={resetSettings} className="w-full rounded-lg border border-pink-500 px-4 py-2 text-pink-500 transition-colors hover:bg-pink-50">
                重置设置
              </button>
            </div>
          </div>

          <div className="mt-8 text-center">
            <Link to={ROUTES.HOME} className="inline-block rounded-lg bg-pink-500 px-6 py-2 font-semibold text-white transition-colors hover:bg-pink-600">
              返回首页
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
