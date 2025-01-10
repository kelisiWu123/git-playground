export const ROUTES = {
  HOME: '/',
  LEVELS: '/levels',
  LEVEL: '/level/:levelId',
  ACHIEVEMENTS: '/achievements',
  SETTINGS: '/settings',
} as const

export type RouteKeys = keyof typeof ROUTES
export type Routes = (typeof ROUTES)[RouteKeys]
