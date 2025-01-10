import { createBrowserRouter } from 'react-router-dom'
import { ROUTES } from './constants/routes'
import Home from './pages/Home'
import Level from './pages/Level'
import Levels from './pages/Levels'
import Achievements from './pages/Achievements'
import Settings from './pages/Settings'
import Start from './pages/Start'

export const router = createBrowserRouter([
  {
    path: ROUTES.HOME,
    element: <Home />,
  },
  {
    path: ROUTES.START,
    element: <Start />,
  },
  {
    path: ROUTES.LEVELS,
    element: <Levels />,
  },
  {
    path: ROUTES.LEVEL,
    element: <Level />,
  },
  {
    path: ROUTES.ACHIEVEMENTS,
    element: <Achievements />,
  },
  {
    path: ROUTES.SETTINGS,
    element: <Settings />,
  },
])
