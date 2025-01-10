import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { Command } from '../constants/levels'

interface GitSimulatorProps {
  onCommand: (command: Command) => void
}

const lineVariants = {
  initial: { opacity: 0, x: -20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 20 },
}

export default function GitSimulator({ onCommand }: GitSimulatorProps) {
  const [input, setInput] = useState('')
  const [history, setHistory] = useState<string[]>([])
  const historyEndRef = React.useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    historyEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  React.useEffect(() => {
    scrollToBottom()
  }, [history])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!input.trim()) return

    // 添加命令到历史记录
    setHistory((prev) => [...prev, `$ ${input}`])

    // 解析命令
    const parts = input.trim().split(' ')
    if (parts[0] === 'git') {
      const type = parts[1] as Command['type']
      const command: Command = {
        type,
        command: `git ${type}`,
        args: parts.slice(2),
      }
      onCommand(command)

      // 添加模拟输出到历史记录
      switch (type) {
        case 'init':
          setHistory((prev) => [...prev, 'Initialized empty Git repository'])
          break
        case 'add':
          setHistory((prev) => [...prev, 'Changes staged for commit'])
          break
        case 'commit':
          setHistory((prev) => [...prev, 'Created commit with message: ' + parts.slice(3).join(' ')])
          break
        case 'branch':
          setHistory((prev) => [...prev, `Created branch '${parts[2]}'`])
          break
        case 'merge':
          setHistory((prev) => [...prev, `Merged branch '${parts[2]}' into current branch`])
          break
        default:
          setHistory((prev) => [...prev, 'Command executed successfully'])
      }
    } else {
      setHistory((prev) => [...prev, 'Error: Unknown command. Please use git commands.'])
    }

    setInput('')
  }

  return (
    <motion.div className="flex h-full flex-col rounded-lg bg-gray-900 text-sm text-white" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
      <div className="flex-1 overflow-y-auto p-4">
        <AnimatePresence mode="popLayout">
          {history.map((line, index) => (
            <motion.div
              key={index}
              className="mb-1"
              variants={lineVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.2 }}
              style={{
                color: line.startsWith('Error:') ? '#ef4444' : line.startsWith('$') ? '#93c5fd' : '#ffffff',
              }}
            >
              {line}
            </motion.div>
          ))}
        </AnimatePresence>
        <div ref={historyEndRef} />
      </div>
      <motion.form onSubmit={handleSubmit} className="flex items-center border-t border-gray-700 p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
        <motion.span className="mr-2" animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 1, repeat: Infinity }}>
          $
        </motion.span>
        <input type="text" value={input} onChange={(e) => setInput(e.target.value)} className="flex-1 bg-transparent focus:outline-none" placeholder="输入 git 命令..." spellCheck={false} autoFocus />
      </motion.form>
    </motion.div>
  )
}
