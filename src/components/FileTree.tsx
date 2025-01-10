import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export interface FileNode {
  name: string
  type: 'file' | 'directory'
  children?: FileNode[]
  status?: 'untracked' | 'staged' | 'committed' | 'conflict' | 'modified'
  content?: string
}

interface FileTreeProps {
  files: FileNode[]
}

function FileIcon({ type, status }: { type: 'file' | 'directory'; status?: string }) {
  if (type === 'directory') {
    return <span className="mr-2 text-yellow-500">📁</span>
  }

  switch (status) {
    case 'untracked':
      return <span className="mr-2 text-red-500">❓</span>
    case 'staged':
      return <span className="mr-2 text-green-500">✚</span>
    case 'committed':
      return <span className="mr-2 text-blue-500">✓</span>
    default:
      return <span className="mr-2 text-gray-500">📄</span>
  }
}

const statusColors = {
  untracked: 'text-red-500',
  staged: 'text-green-500',
  committed: 'text-blue-500',
  conflict: 'text-yellow-500',
  modified: 'text-orange-500',
}

function FileTreeNode({ node, depth = 0 }: { node: FileNode; depth?: number }) {
  return (
    <motion.div
      style={{ paddingLeft: `${depth * 1.5}rem` }}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.2, delay: depth * 0.1 }}
    >
      <motion.div className={`flex items-center py-1 ${node.status ? statusColors[node.status] : ''}`} whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
        <motion.span initial={false} animate={node.status ? { rotate: [0, 15, -15, 0] } : {}} transition={{ duration: 0.5 }}>
          <FileIcon type={node.type} status={node.status} />
        </motion.span>
        <span>{node.name}</span>
      </motion.div>
      <AnimatePresence>{node.children?.map((child, index) => <FileTreeNode key={child.name + index} node={child} depth={depth + 1} />)}</AnimatePresence>
    </motion.div>
  )
}

export default function FileTree({ files }: FileTreeProps) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 font-mono text-sm">
      <div className="mb-2 text-gray-500">项目文件结构：</div>
      <AnimatePresence>
        {files.map((file, index) => (
          <FileTreeNode key={file.name + index} node={file} />
        ))}
      </AnimatePresence>
    </div>
  )
}
