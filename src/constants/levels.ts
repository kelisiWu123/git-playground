import type { FileNode } from '../components/FileTree'

export type CommandType = 'init' | 'add' | 'commit' | 'branch' | 'merge' | 'push' | 'pull'

export interface Command {
  type: CommandType
  command: string
  args?: string[]
}

export interface LevelState {
  files: FileNode[]
  branch: string
  message?: string
}

export interface Level {
  id: number
  title: string
  description: string
  story: string
  hint: string
  initialState: LevelState
  targetState: LevelState
  commands: Command[]
  requiredCommands: Command[]
  validation: (commands: Command[]) => boolean
}

export const LEVELS: Level[] = [
  {
    id: 1,
    title: '初始化仓库',
    description: '在这一关，你将学习如何创建一个新的Git仓库。我们要开始制作一个可爱的猫咪相册！',
    story: '欢迎来到Git喵喵乐园！我是你的导师喵喵老师。今天我们要开始一个激动人心的项目 - 制作一个可爱的猫咪相册！首先需要创建一个Git仓库来管理我们的项目。',
    hint: '使用 git init 命令来初始化一个新的Git仓库。初始化后，你会看到一个.git目录被创建。',
    initialState: {
      files: [
        {
          name: 'cat-album',
          type: 'directory',
          children: [],
        },
      ],
      branch: '',
    },
    targetState: {
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
          ],
        },
      ],
      branch: 'master',
    },
    commands: [
      {
        type: 'init',
        command: 'git init',
      },
    ],
    requiredCommands: [
      {
        type: 'init',
        command: 'git init',
      },
    ],
    validation: (commands) => commands.some((cmd) => cmd.type === 'init'),
  },
  {
    id: 2,
    title: '添加文件',
    description: '让我们开始往相册里添加第一张可爱的猫咪照片！',
    story: '太棒了！我们已经有了一个Git仓库。现在，让我们添加第一张可爱的猫咪照片到相册中。我已经帮你准备好了一张名为 cute-cat-1.jpg 的照片，让我们把它添加到Git的暂存区吧！',
    hint: '使用 git add <文件名> 命令将文件添加到暂存区。你会看到文件状态从未跟踪（红色问号）变成已暂存（绿色加号）。',
    initialState: {
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
            {
              name: 'cute-cat-1.jpg',
              type: 'file',
              status: 'untracked',
            },
          ],
        },
      ],
      branch: 'master',
    },
    targetState: {
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
            {
              name: 'cute-cat-1.jpg',
              type: 'file',
              status: 'staged',
            },
          ],
        },
      ],
      branch: 'master',
    },
    commands: [
      {
        type: 'add',
        command: 'git add',
        args: ['cute-cat-1.jpg'],
      },
    ],
    requiredCommands: [
      {
        type: 'add',
        command: 'git add',
      },
    ],
    validation: (commands) => commands.some((cmd) => cmd.type === 'add'),
  },
  {
    id: 3,
    title: '提交更改',
    description: '是时候保存我们的第一张照片了！',
    story: '照片已经在暂存区了，现在让我们创建一个提交来永久保存这个更改。每次提交都像是给相册拍了一张快照，记录了当前的状态。',
    hint: '使用 git commit -m "添加第一张可爱猫咪照片" 命令来提交更改。提交后，你会看到文件状态变成已提交（蓝色对勾）。',
    initialState: {
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
            {
              name: 'cute-cat-1.jpg',
              type: 'file',
              status: 'staged',
            },
          ],
        },
      ],
      branch: 'master',
    },
    targetState: {
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
            {
              name: 'cute-cat-1.jpg',
              type: 'file',
              status: 'committed',
            },
          ],
        },
      ],
      branch: 'master',
      message: '添加第一张可爱猫咪照片',
    },
    commands: [
      {
        type: 'commit',
        command: 'git commit',
        args: ['-m', '添加第一张可爱猫咪照片'],
      },
    ],
    requiredCommands: [
      {
        type: 'commit',
        command: 'git commit',
      },
    ],
    validation: (commands) => commands.some((cmd) => cmd.type === 'commit'),
  },
  {
    id: 4,
    title: '创建特色照片分支',
    description: '让我们创建一个新的分支来添加一些特别的照片！',
    story: '我们的相册越来越好看了！现在我想添加一些特别的照片，但我不确定是否要把它们放在主相册里。在Git中，我们可以创建一个新的分支来尝试不同的想法。',
    hint: '使用 git branch special-photos 创建分支，然后使用 git checkout special-photos 切换到新分支。你会看到当前分支名称发生变化。',
    initialState: {
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
            {
              name: 'cute-cat-1.jpg',
              type: 'file',
              status: 'committed',
            },
          ],
        },
      ],
      branch: 'master',
    },
    targetState: {
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
            {
              name: 'cute-cat-1.jpg',
              type: 'file',
              status: 'committed',
            },
          ],
        },
      ],
      branch: 'special-photos',
    },
    commands: [
      {
        type: 'branch',
        command: 'git branch',
        args: ['special-photos'],
      },
    ],
    requiredCommands: [
      {
        type: 'branch',
        command: 'git branch',
      },
    ],
    validation: (commands) => commands.some((cmd) => cmd.type === 'branch'),
  },
  {
    id: 5,
    title: '合并特色照片',
    description: '特色照片很受欢迎，让我们把它们合并到主相册中！',
    story: '我们在特色照片分支中添加的照片大受好评！现在是时候将这些照片合并回主相册了。',
    hint: '先使用 git checkout master 切换回主分支，然后使用 git merge special-photos 命令来合并分支。',
    initialState: {
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
            {
              name: 'cute-cat-1.jpg',
              type: 'file',
              status: 'committed',
            },
            {
              name: 'special-cat-1.jpg',
              type: 'file',
              status: 'committed',
            },
          ],
        },
      ],
      branch: 'special-photos',
    },
    targetState: {
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
            {
              name: 'cute-cat-1.jpg',
              type: 'file',
              status: 'committed',
            },
            {
              name: 'special-cat-1.jpg',
              type: 'file',
              status: 'committed',
            },
          ],
        },
      ],
      branch: 'master',
      message: 'Merged branch special-photos',
    },
    commands: [
      {
        type: 'merge',
        command: 'git merge',
        args: ['special-photos'],
      },
    ],
    requiredCommands: [
      {
        type: 'merge',
        command: 'git merge',
      },
    ],
    validation: (commands) => commands.some((cmd) => cmd.type === 'merge'),
  },
]
