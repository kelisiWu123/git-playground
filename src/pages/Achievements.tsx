import { Link } from 'react-router-dom'
import { ROUTES } from '../constants/routes'

const achievements = [
  {
    id: 1,
    title: '初次提交',
    description: '完成第一次Git提交',
    completed: true,
  },
  {
    id: 2,
    title: '分支大师',
    description: '成功创建并合并一个分支',
    completed: false,
  },
  {
    id: 3,
    title: '团队协作',
    description: '完成第一次远程仓库操作',
    completed: false,
  },
]

export default function Achievements() {
  return (
    <div className="min-h-screen bg-pink-50 p-8">
      <h1 className="mb-8 text-center text-3xl font-bold text-pink-600">我的成就</h1>
      <div className="mx-auto max-w-2xl space-y-4">
        {achievements.map((achievement) => (
          <div key={achievement.id} className={`rounded-lg bg-white p-4 shadow-md ${achievement.completed ? 'border-2 border-pink-300' : ''}`}>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-pink-600">{achievement.title}</h3>
                <p className="text-sm text-gray-500">{achievement.description}</p>
              </div>
              {achievement.completed ? (
                <span className="rounded-full bg-pink-100 px-3 py-1 text-sm text-pink-600">已完成</span>
              ) : (
                <span className="rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-600">未完成</span>
              )}
            </div>
          </div>
        ))}
      </div>
      <Link to={ROUTES.HOME} className="mt-8 block text-center text-pink-600 hover:text-pink-700">
        返回首页
      </Link>
    </div>
  )
}
