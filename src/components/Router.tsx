import React from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { ROUTES } from '../constants/routes'

// 页面组件
import Home from '../pages/Home'
import Levels from '../pages/Levels'

// 懒加载其他页面组件
const Level = React.lazy(() => import('../pages/Level'))
const Achievements = React.lazy(() => import('../pages/Achievements'))
const Settings = React.lazy(() => import('../pages/Settings'))

// 创建路由配置
const router = createBrowserRouter([
  {
    path: ROUTES.HOME,
    element: <Home />,
  },
  {
    path: ROUTES.LEVELS,
    element: <Levels />,
  },
  {
    path: ROUTES.LEVEL,
    element: (
      <React.Suspense fallback={<div>Loading...</div>}>
        <Level />
      </React.Suspense>
    ),
  },
  {
    path: ROUTES.ACHIEVEMENTS,
    element: (
      <React.Suspense fallback={<div>Loading...</div>}>
        <Achievements />
      </React.Suspense>
    ),
  },
  {
    path: ROUTES.SETTINGS,
    element: (
      <React.Suspense fallback={<div>Loading...</div>}>
        <Settings />
      </React.Suspense>
    ),
  },
])

export default function Router() {
  return <RouterProvider router={router} />
}
