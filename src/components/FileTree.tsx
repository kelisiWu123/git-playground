import React from 'react'

export interface FileNode {
  name: string
  type: 'file' | 'directory'
  status?: 'untracked' | 'staged' | 'committed'
  children?: FileNode[]
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

function FileTreeNode({ node, depth = 0 }: { node: FileNode; depth?: number }) {
  return (
    <div style={{ paddingLeft: `${depth * 1.5}rem` }}>
      <div className={`flex items-center py-1 ${node.status === 'staged' ? 'text-green-600' : ''}`}>
        <FileIcon type={node.type} status={node.status} />
        <span>{node.name}</span>
      </div>
      {node.children?.map((child, index) => <FileTreeNode key={index} node={child} depth={depth + 1} />)}
    </div>
  )
}

export default function FileTree({ files }: FileTreeProps) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 font-mono text-sm">
      <div className="mb-2 text-gray-500">项目文件结构：</div>
      {files.map((file, index) => (
        <FileTreeNode key={index} node={file} />
      ))}
    </div>
  )
}
