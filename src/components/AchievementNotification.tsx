import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { Achievement } from '../types/progress'

interface AchievementNotificationProps {
  achievement: Achievement
  onClose: () => void
}

export default function AchievementNotification({ achievement, onClose }: AchievementNotificationProps) {
  React.useEffect(() => {
    const timer = setTimeout(onClose, 3000)
    return () => clearTimeout(timer)
  }, [onClose])

  return (
    <AnimatePresence>
      <motion.div
        className="fixed right-4 top-4 z-50 w-80 rounded-lg bg-white p-4 shadow-lg"
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 100 }}
        transition={{ type: 'spring', damping: 20 }}
      >
        <div className="flex items-center space-x-3">
          <motion.div className="text-3xl" animate={{ rotate: [0, -10, 10, -10, 10, 0], scale: [1, 1.2, 1] }} transition={{ duration: 0.5 }}>
            {achievement.icon}
          </motion.div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-green-600">成就解锁！</h3>
            <p className="text-sm text-gray-600">{achievement.title}</p>
            <p className="text-xs text-gray-400">{achievement.description}</p>
          </div>
        </div>
        <motion.div className="mt-2 h-1 bg-green-200" initial={{ width: '100%' }} animate={{ width: '0%' }} transition={{ duration: 3 }} />
      </motion.div>
    </AnimatePresence>
  )
}
