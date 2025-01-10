import { motion, AnimatePresence } from 'framer-motion'
import type { Achievement } from '../types/progress'

interface AchievementUnlockProps {
  achievement: Achievement
  onClose: () => void
}

export function AchievementUnlock({ achievement, onClose }: AchievementUnlockProps) {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.3 }}
        animate={{
          opacity: 1,
          y: 0,
          scale: 1,
          transition: {
            type: 'spring',
            stiffness: 300,
            damping: 25,
          },
        }}
        exit={{ opacity: 0, y: 50, scale: 0.3 }}
        className="fixed bottom-4 right-4 z-50"
      >
        <div className="flex items-center gap-4 rounded-lg bg-gradient-to-r from-pink-500 to-purple-500 p-4 text-white shadow-lg">
          <motion.div
            animate={{
              rotate: [0, -10, 10, -10, 10, 0],
              scale: [1, 1.2, 1.2, 1.2, 1.2, 1],
            }}
            transition={{
              duration: 2,
              ease: 'easeInOut',
              times: [0, 0.2, 0.4, 0.6, 0.8, 1],
              repeat: Infinity,
              repeatDelay: 3,
            }}
            className="text-4xl"
          >
            {achievement.icon}
          </motion.div>

          <div className="flex flex-col">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-sm font-medium text-pink-100">
              新成就解锁！
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="text-lg font-bold">
              {achievement.title}
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="text-sm text-pink-100">
              {achievement.description}
            </motion.div>
          </div>

          <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={onClose} className="ml-4 rounded-full p-1 hover:bg-white/20">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </motion.button>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
