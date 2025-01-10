import React, { useState } from 'react'
import type { Command } from '../constants/levels'

interface GitSimulatorProps {
  onCommand: (command: Command) => void
}

export default function GitSimulator({ onCommand }: GitSimulatorProps) {
  const [input, setInput] = useState('')
  const [history, setHistory] = useState<string[]>([])

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
    <div className="rounded-lg bg-gray-900 p-4 font-mono text-sm text-white">
      <div className="mb-4 h-48 overflow-y-auto">
        {history.map((line, index) => (
          <div key={index} className="mb-1">
            {line}
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit} className="flex items-center">
        <span className="mr-2">$</span>
        <input type="text" value={input} onChange={(e) => setInput(e.target.value)} className="flex-1 bg-transparent focus:outline-none" placeholder="输入 git 命令..." spellCheck={false} />
      </form>
    </div>
  )
}
