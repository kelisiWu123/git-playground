import React from 'react'
import type { Level, Command, LevelState } from '../constants/levels'
import GitSimulator from './GitSimulator'
import FileTree from './FileTree'

interface LevelContentProps {
  level: Level
  onComplete: () => void
}

export default function LevelContent({ level, onComplete }: LevelContentProps) {
  const [commands, setCommands] = React.useState<Command[]>([])
  const [currentState, setCurrentState] = React.useState<LevelState>(level.initialState)

  const handleCommand = (command: Command) => {
    setCommands((prev) => [...prev, command])

    // 更新当前状态
    switch (command.type) {
      case 'init':
        setCurrentState((prev) => ({
          ...prev,
          files: [
            {
              name: 'cat-album',
              type: 'directory',
              children: [
                {
                  name: '.git',
                  type: 'directory',
                  children: [],
                },
                ...(prev.files[0].children || []).filter((child) => child.name !== '.git'),
              ],
            },
          ],
          branch: 'master',
        }))
        break
      case 'add':
        setCurrentState((prev) => ({
          ...prev,
          files: prev.files.map((file) => ({
            ...file,
            children: file.children?.map((child) => (child.name === command.args?.[0] ? { ...child, status: 'staged' as const } : child)),
          })),
        }))
        break
      case 'commit':
        setCurrentState((prev) => ({
          ...prev,
          files: prev.files.map((file) => ({
            ...file,
            children: file.children?.map((child) => (child.status === 'staged' ? { ...child, status: 'committed' as const } : child)),
          })),
          message: command.args?.[1],
        }))
        break
      case 'branch':
        if (command.args?.[0]) {
          setCurrentState((prev) => ({
            ...prev,
            branch: command.args?.[0] || prev.branch,
          }))
        }
        break
      case 'merge':
        setCurrentState((prev) => ({
          ...prev,
          branch: 'master',
          message: `Merged branch ${command.args?.[0]}`,
        }))
        break
    }

    // 检查是否完成关卡
    const newCommands = [...commands, command]
    if (level.validation(newCommands)) {
      onComplete()
    }
  }

  return (
    <div className="space-y-6">
      {/* 故事内容 */}
      <div className="rounded-lg bg-white p-6 shadow-md">
        <div className="mb-4 flex items-center">
          <img src="/cat-teacher.svg" alt="喵喵老师" className="mr-4 h-16 w-16 rounded-full bg-pink-50 p-1" />
          <div>
            <h3 className="text-lg font-semibold text-pink-600">喵喵老师</h3>
            <p className="text-gray-600">{level.story}</p>
          </div>
        </div>
      </div>

      {/* 任务说明 */}
      <div className="rounded-lg bg-white p-6 shadow-md">
        <h3 className="mb-2 text-lg font-semibold text-pink-600">任务目标</h3>
        <p className="mb-4 text-gray-600">{level.description}</p>
        <div className="rounded-lg bg-pink-50 p-4">
          <h4 className="mb-2 font-medium text-pink-600">提示</h4>
          <p className="text-sm text-gray-600">{level.hint}</p>
        </div>
      </div>

      {/* 状态显示 */}
      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="rounded-lg bg-white p-6 shadow-md">
            <h3 className="mb-4 text-lg font-semibold text-pink-600">当前状态</h3>
            <div className="mb-2 text-sm text-gray-500">
              当前分支: <span className="font-mono text-pink-600">{currentState.branch || '无'}</span>
            </div>
            {currentState.message && (
              <div className="mb-2 text-sm text-gray-500">
                最新提交: <span className="font-mono text-pink-600">{currentState.message}</span>
              </div>
            )}
            <FileTree files={currentState.files} />
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-lg bg-white p-6 shadow-md">
            <h3 className="mb-4 text-lg font-semibold text-pink-600">目标状态</h3>
            <div className="mb-2 text-sm text-gray-500">
              目标分支: <span className="font-mono text-pink-600">{level.targetState.branch || '无'}</span>
            </div>
            {level.targetState.message && (
              <div className="mb-2 text-sm text-gray-500">
                预期提交: <span className="font-mono text-pink-600">{level.targetState.message}</span>
              </div>
            )}
            <FileTree files={level.targetState.files} />
          </div>
        </div>
      </div>

      {/* Git模拟器 */}
      <div className="rounded-lg bg-white p-6 shadow-md">
        <h3 className="mb-4 text-lg font-semibold text-pink-600">Git终端</h3>
        <GitSimulator onCommand={handleCommand} />
      </div>
    </div>
  )
}
