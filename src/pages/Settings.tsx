import { Link } from 'react-router-dom'
import { ROUTES } from '../constants/routes'
import { motion } from 'framer-motion'
import { useState } from 'react'

export default function Settings() {
  const [volume, setVolume] = useState(50)
  const [musicEnabled, setMusicEnabled] = useState(true)
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [language, setLanguage] = useState('zh')

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white p-8">
      <div className="mx-auto max-w-2xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <h1 className="mb-8 text-center text-3xl font-bold text-pink-600">游戏设置</h1>

          <div className="space-y-8 rounded-lg bg-white p-6 shadow-lg">
            {/* 音量控制 */}
            <div>
              <label className="mb-2 block font-medium text-gray-700">音量</label>
              <input type="range" min="0" max="100" value={volume} onChange={(e) => setVolume(Number(e.target.value))} className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-pink-200" />
              <div className="mt-1 text-right text-sm text-gray-500">{volume}%</div>
            </div>

            {/* 音乐开关 */}
            <div>
              <label className="relative inline-flex cursor-pointer items-center">
                <input type="checkbox" checked={musicEnabled} onChange={(e) => setMusicEnabled(e.target.checked)} className="peer sr-only" />
                <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-pink-500 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-pink-300"></div>
                <span className="ml-3 text-sm font-medium text-gray-700">背景音乐</span>
              </label>
            </div>

            {/* 音效开关 */}
            <div>
              <label className="relative inline-flex cursor-pointer items-center">
                <input type="checkbox" checked={soundEnabled} onChange={(e) => setSoundEnabled(e.target.checked)} className="peer sr-only" />
                <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-pink-500 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-pink-300"></div>
                <span className="ml-3 text-sm font-medium text-gray-700">音效</span>
              </label>
            </div>

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
