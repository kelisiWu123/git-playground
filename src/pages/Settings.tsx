import { Link } from 'react-router-dom'
import { ROUTES } from '../constants/routes'

export default function Settings() {
  return (
    <div className="min-h-screen bg-pink-50 p-8">
      <h1 className="mb-8 text-center text-3xl font-bold text-pink-600">个人设置</h1>
      <div className="mx-auto max-w-2xl rounded-lg bg-white p-8 shadow-md">
        <div className="mb-8">
          <h2 className="mb-4 text-xl font-semibold text-pink-600">猫咪外观</h2>
          <div className="grid grid-cols-3 gap-4">
            {['白色', '橘色', '黑色'].map((color) => (
              <button key={color} className="rounded-lg border-2 border-pink-200 p-4 text-center hover:border-pink-400">
                {color}猫咪
              </button>
            ))}
          </div>
        </div>

        <div className="mb-8">
          <h2 className="mb-4 text-xl font-semibold text-pink-600">游戏设置</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">背景音乐</span>
              <label className="relative inline-flex cursor-pointer items-center">
                <input type="checkbox" className="peer sr-only" />
                <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-pink-500 peer-checked:after:translate-x-full peer-checked:after:border-white"></div>
              </label>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">音效</span>
              <label className="relative inline-flex cursor-pointer items-center">
                <input type="checkbox" className="peer sr-only" />
                <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-pink-500 peer-checked:after:translate-x-full peer-checked:after:border-white"></div>
              </label>
            </div>
          </div>
        </div>

        <div className="flex justify-between">
          <Link to={ROUTES.HOME} className="rounded-lg bg-pink-100 px-6 py-2 text-pink-600 hover:bg-pink-200">
            返回首页
          </Link>
          <button className="rounded-lg bg-pink-500 px-6 py-2 text-white hover:bg-pink-600">保存设置</button>
        </div>
      </div>
    </div>
  )
}
