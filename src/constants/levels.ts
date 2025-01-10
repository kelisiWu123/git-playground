import type { FileNode } from '../components/FileTree'

export type CommandType =
  | 'init'
  | 'add'
  | 'commit'
  | 'branch'
  | 'merge'
  | 'push'
  | 'pull'
  | 'checkout'
  | 'status'
  | 'log'
  | 'reset'
  | 'revert'
  | 'stash'
  | 'tag'
  | 'remote'
  | 'fetch'
  | 'clone'
  | 'rebase'
  | 'cherry-pick'
  | 'submodule'

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
    title: '查看仓库状态',
    description: '让我们来了解如何查看Git仓库的当前状态。',
    story: '太好了！我们已经创建了Git仓库。不过在添加文件之前，我们需要学会如何查看仓库的状态。这样我们就能知道文件是否被Git跟踪了。',
    hint: '使用 git status 命令来查看仓库的当前状态。这个命令会显示哪些文件被修改了，哪些文件还未被跟踪。',
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
              status: 'untracked',
            },
          ],
        },
      ],
      branch: 'master',
      message: '查看了仓库状态',
    },
    commands: [
      {
        type: 'status',
        command: 'git status',
      },
    ],
    requiredCommands: [
      {
        type: 'status',
        command: 'git status',
      },
    ],
    validation: (commands) => commands.some((cmd) => cmd.type === 'status'),
  },
  {
    id: 3,
    title: '添加文件',
    description: '让我们开始往相册里添加第一张可爱的猫咪照片！',
    story: '通过git status，我们看到了有一个未跟踪的文件。现在，让我们把这张可爱的猫咪照片添加到Git的暂存区，这样Git就能开始跟踪它的变化了。',
    hint: '使用 git add <文件名> 命令将文件添加到暂存区。你会看到文件状态从未跟踪（红色）变成已暂存（绿色）。',
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
    id: 4,
    title: '提交更改',
    description: '是时候保存我们的第一张照片了！',
    story: '照片已经在暂存区了，现在让我们创建一个提交来永久保存这个更改。每次提交都像是给相册拍了一张快照，记录了当前的状态。',
    hint: '使用 git commit -m "添加第一张可爱猫咪照片" 命令来提交更改。提交信息应该简短但有描述性，说明这次提交做了什么。',
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
    id: 5,
    title: '查看提交历史',
    description: '让我们来看看我们的相册是如何一步步完成的！',
    story: '我们已经成功提交了第一张照片！现在让我们来看看提交的历史记录，了解相册是如何一步步建立起来的。',
    hint: '使用 git log 命令来查看提交历史。你会看到每个提交的详细信息，包括提交ID、作者、日期和提交信息。',
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
      message: '添加第一张可爱猫咪照片',
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
      message: '查看了提交历史',
    },
    commands: [
      {
        type: 'log',
        command: 'git log',
      },
    ],
    requiredCommands: [
      {
        type: 'log',
        command: 'git log',
      },
    ],
    validation: (commands) => commands.some((cmd) => cmd.type === 'log'),
  },
  {
    id: 6,
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
      {
        type: 'checkout',
        command: 'git checkout',
        args: ['special-photos'],
      },
    ],
    requiredCommands: [
      {
        type: 'branch',
        command: 'git branch',
      },
      {
        type: 'checkout',
        command: 'git checkout',
      },
    ],
    validation: (commands) => commands.some((cmd) => cmd.type === 'branch') && commands.some((cmd) => cmd.type === 'checkout'),
  },
  {
    id: 7,
    title: '在分支上工作',
    description: '在新分支上添加和提交更改',
    story: '现在我们在special-photos分支上了，让我们添加一些特别的猫咪照片！记住，在这个分支上的更改不会影响到主分支。',
    hint: '使用 git add 和 git commit 命令来添加和提交新的照片。这些更改只会保存在当前分支上。',
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
              status: 'untracked',
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
      branch: 'special-photos',
      message: '添加特别的猫咪照片',
    },
    commands: [
      {
        type: 'add',
        command: 'git add',
        args: ['special-cat-1.jpg'],
      },
      {
        type: 'commit',
        command: 'git commit',
        args: ['-m', '添加特别的猫咪照片'],
      },
    ],
    requiredCommands: [
      {
        type: 'add',
        command: 'git add',
      },
      {
        type: 'commit',
        command: 'git commit',
      },
    ],
    validation: (commands) => commands.some((cmd) => cmd.type === 'add') && commands.some((cmd) => cmd.type === 'commit'),
  },
  {
    id: 8,
    title: '切换分支',
    description: '让我们回到主分支看看有什么不同',
    story: '我们在special-photos分支上添加了新照片，现在让我们切换回master分支。你会发现在master分支上看不到我们刚才添加的特别照片！',
    hint: '使用 git checkout master 命令切换回主分支。注意观察文件的变化。',
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
          ],
        },
      ],
      branch: 'master',
    },
    commands: [
      {
        type: 'checkout',
        command: 'git checkout',
        args: ['master'],
      },
    ],
    requiredCommands: [
      {
        type: 'checkout',
        command: 'git checkout',
      },
    ],
    validation: (commands) => commands.some((cmd) => cmd.type === 'checkout'),
  },
  {
    id: 9,
    title: '合并分支',
    description: '将special-photos分支的更改合并到master分支',
    story: '经过反复确认，我们决定把特别照片也放到主相册中。现在让我们把special-photos分支的更改合并到master分支。',
    hint: '确保你在master分支上，然后使用 git merge special-photos 命令来合并分支。',
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
  {
    id: 10,
    title: '解决合并冲突',
    description: '学习如何处理合并时的冲突',
    story: '哎呀！看起来我们在两个分支上都修改了同一张照片的标题，这导致了合并冲突。不用担心，让我们一起来解决这个问题！',
    hint: '当发生冲突时，Git会在文件中标记出冲突的部分。你需要手动编辑文件，选择要保留的内容，然后使用git add和git commit来完成合并。',
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
              name: 'photo-title.txt',
              type: 'file',
              status: 'conflict',
              content: `<<<<<<< HEAD
我最喜欢的猫咪照片
=======
特别可爱的猫咪照片
>>>>>>> feature-branch`,
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
              name: 'photo-title.txt',
              type: 'file',
              status: 'committed',
              content: '特别可爱的猫咪照片',
            },
          ],
        },
      ],
      branch: 'master',
      message: '解决合并冲突',
    },
    commands: [
      {
        type: 'add',
        command: 'git add',
        args: ['photo-title.txt'],
      },
      {
        type: 'commit',
        command: 'git commit',
        args: ['-m', '解决合并冲突'],
      },
    ],
    requiredCommands: [
      {
        type: 'add',
        command: 'git add',
      },
      {
        type: 'commit',
        command: 'git commit',
      },
    ],
    validation: (commands) => commands.some((cmd) => cmd.type === 'add') && commands.some((cmd) => cmd.type === 'commit'),
  },
  {
    id: 11,
    title: '撤销更改',
    description: '学习如何撤销未提交的更改',
    story: '哎呀！我们不小心修改了一张照片，但还没有提交。让我们学习如何撤销这些更改。',
    hint: '使用 git checkout -- <文件名> 命令来撤销对文件的修改。这会将文件恢复到最后一次提交的状态。',
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
              status: 'modified',
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
    },
    commands: [
      {
        type: 'checkout',
        command: 'git checkout',
        args: ['--', 'cute-cat-1.jpg'],
      },
    ],
    requiredCommands: [
      {
        type: 'checkout',
        command: 'git checkout',
      },
    ],
    validation: (commands) => commands.some((cmd) => cmd.type === 'checkout'),
  },
  {
    id: 12,
    title: '添加远程仓库',
    description: '学习如何连接到远程仓库',
    story: '我们的相册做得很棒！现在是时候把它分享给其他人了。首先，我们需要添加一个远程仓库。',
    hint: '使用 git remote add origin <仓库URL> 命令添加远程仓库。这会将远程仓库命名为"origin"。',
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
              children: [
                {
                  name: 'config',
                  type: 'file',
                  status: 'committed',
                },
              ],
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
      message: '添加了远程仓库',
    },
    commands: [
      {
        type: 'remote',
        command: 'git remote add',
        args: ['origin', 'https://github.com/user/cat-album.git'],
      },
    ],
    requiredCommands: [
      {
        type: 'remote',
        command: 'git remote add',
      },
    ],
    validation: (commands) => commands.some((cmd) => cmd.type === 'remote'),
  },
  {
    id: 13,
    title: '推送到远程',
    description: '学习如何将本地更改推送到远程仓库',
    story: '远程仓库已经设置好了，现在让我们把我们的相册上传到那里！',
    hint: '使用 git push -u origin master 命令将当前分支推送到远程仓库。-u 参数会设置跟踪关系，这样以后就可以直接使用 git push 了。',
    initialState: {
      files: [
        {
          name: 'cat-album',
          type: 'directory',
          children: [
            {
              name: '.git',
              type: 'directory',
              children: [
                {
                  name: 'config',
                  type: 'file',
                  status: 'committed',
                },
              ],
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
              children: [
                {
                  name: 'config',
                  type: 'file',
                  status: 'committed',
                },
              ],
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
      message: '推送到远程仓库',
    },
    commands: [
      {
        type: 'push',
        command: 'git push',
        args: ['-u', 'origin', 'master'],
      },
    ],
    requiredCommands: [
      {
        type: 'push',
        command: 'git push',
      },
    ],
    validation: (commands) => commands.some((cmd) => cmd.type === 'push'),
  },
  {
    id: 14,
    title: '克隆仓库',
    description: '学习如何克隆远程仓库',
    story: '让我们假设你在另一台电脑上想要继续编辑相册。首先需要从远程仓库获取一份完整的拷贝。',
    hint: '使用 git clone <仓库URL> 命令克隆远程仓库。这会创建一个新的目录，包含仓库的所有内容。',
    initialState: {
      files: [],
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
              children: [
                {
                  name: 'config',
                  type: 'file',
                  status: 'committed',
                },
              ],
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
      message: '克隆了远程仓库',
    },
    commands: [
      {
        type: 'clone',
        command: 'git clone',
        args: ['https://github.com/user/cat-album.git'],
      },
    ],
    requiredCommands: [
      {
        type: 'clone',
        command: 'git clone',
      },
    ],
    validation: (commands) => commands.some((cmd) => cmd.type === 'clone'),
  },
  {
    id: 15,
    title: '拉取更新',
    description: '学习如何从远程仓库获取最新更改',
    story: '其他人可能已经在远程仓库添加了新的照片。让我们获取这些更新！',
    hint: '使用 git pull 命令从远程仓库拉取最新的更改并合并到当前分支。',
    initialState: {
      files: [
        {
          name: 'cat-album',
          type: 'directory',
          children: [
            {
              name: '.git',
              type: 'directory',
              children: [
                {
                  name: 'config',
                  type: 'file',
                  status: 'committed',
                },
              ],
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
              children: [
                {
                  name: 'config',
                  type: 'file',
                  status: 'committed',
                },
              ],
            },
            {
              name: 'cute-cat-1.jpg',
              type: 'file',
              status: 'committed',
            },
            {
              name: 'cute-cat-2.jpg',
              type: 'file',
              status: 'committed',
            },
          ],
        },
      ],
      branch: 'master',
      message: '拉取了远程更新',
    },
    commands: [
      {
        type: 'pull',
        command: 'git pull',
      },
    ],
    requiredCommands: [
      {
        type: 'pull',
        command: 'git pull',
      },
    ],
    validation: (commands) => commands.some((cmd) => cmd.type === 'pull'),
  },
  {
    id: 16,
    title: '暂存更改',
    description: '学习如何临时保存工作进度',
    story: '我们正在编辑一些照片，但突然需要切换到另一个任务。不用担心，Git可以帮我们临时保存这些更改！',
    hint: '使用 git stash 命令暂存当前的更改。这些更改会被保存起来，你可以稍后恢复它们。',
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
              status: 'modified',
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
      message: '暂存了工作进度',
    },
    commands: [
      {
        type: 'stash',
        command: 'git stash',
      },
    ],
    requiredCommands: [
      {
        type: 'stash',
        command: 'git stash',
      },
    ],
    validation: (commands) => commands.some((cmd) => cmd.type === 'stash'),
  },
  {
    id: 17,
    title: '恢复暂存的更改',
    description: '学习如何恢复之前暂存的更改',
    story: '现在我们可以继续之前的工作了。让我们把暂存的更改恢复回来！',
    hint: '使用 git stash pop 命令恢复最近暂存的更改。这会把更改应用回来，并从暂存列表中删除。',
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
              status: 'modified',
            },
          ],
        },
      ],
      branch: 'master',
      message: '恢复了暂存的更改',
    },
    commands: [
      {
        type: 'stash',
        command: 'git stash pop',
      },
    ],
    requiredCommands: [
      {
        type: 'stash',
        command: 'git stash pop',
      },
    ],
    validation: (commands) => commands.some((cmd) => cmd.type === 'stash'),
  },
  {
    id: 18,
    title: '回退版本',
    description: '学习如何回退到之前的版本',
    story: '糟糕！我们刚才的修改好像不太理想。让我们回到上一个版本看看。',
    hint: '使用 git reset --hard HEAD^ 命令回退到上一个提交。注意：这会丢失当前的更改！',
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
              name: 'cute-cat-2.jpg',
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
      branch: 'master',
      message: '回退到上一个版本',
    },
    commands: [
      {
        type: 'reset',
        command: 'git reset',
        args: ['--hard', 'HEAD^'],
      },
    ],
    requiredCommands: [
      {
        type: 'reset',
        command: 'git reset',
      },
    ],
    validation: (commands) => commands.some((cmd) => cmd.type === 'reset'),
  },
  {
    id: 19,
    title: '创建标签',
    description: '学习如何为重要的版本创建标签',
    story: '我们的相册第一个版本完成了！让我们给它打上一个标签，这样以后可以很容易地找到这个版本。',
    hint: '使用 git tag -a v1.0 -m "第一个版本" 命令创建一个带注释的标签。',
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
      branch: 'master',
      message: '创建了标签 v1.0',
    },
    commands: [
      {
        type: 'tag',
        command: 'git tag',
        args: ['-a', 'v1.0', '-m', '第一个版本'],
      },
    ],
    requiredCommands: [
      {
        type: 'tag',
        command: 'git tag',
      },
    ],
    validation: (commands) => commands.some((cmd) => cmd.type === 'tag'),
  },
  {
    id: 20,
    title: '变基操作',
    description: '学习如何使用变基来整理提交历史',
    story: '我们的提交历史有点乱，让我们用变基来整理一下，使其更清晰！',
    hint: '使用 git rebase -i HEAD~3 命令来交互式地重新排列最近的三个提交。',
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
              name: 'cute-cat-2.jpg',
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
            {
              name: 'cute-cat-2.jpg',
              type: 'file',
              status: 'committed',
            },
          ],
        },
      ],
      branch: 'master',
      message: '重新排列了提交历史',
    },
    commands: [
      {
        type: 'rebase',
        command: 'git rebase',
        args: ['-i', 'HEAD~3'],
      },
    ],
    requiredCommands: [
      {
        type: 'rebase',
        command: 'git rebase',
      },
    ],
    validation: (commands) => commands.some((cmd) => cmd.type === 'rebase'),
  },
  {
    id: 21,
    title: 'Feature Branch工作流',
    description: '学习如何使用Feature Branch工作流进行开发',
    story: '我们要添加一个新功能：给照片添加标签功能。让我们创建一个特性分支来开发这个功能。',
    hint: '使用 git checkout -b feature/photo-tags 命令创建并切换到新的特性分支。',
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
      branch: 'feature/photo-tags',
    },
    commands: [
      {
        type: 'checkout',
        command: 'git checkout',
        args: ['-b', 'feature/photo-tags'],
      },
    ],
    requiredCommands: [
      {
        type: 'checkout',
        command: 'git checkout',
      },
    ],
    validation: (commands) => commands.some((cmd) => cmd.type === 'checkout'),
  },
  {
    id: 22,
    title: 'Gitflow工作流',
    description: '学习如何使用Gitflow工作流管理版本',
    story: '我们的相册越来越受欢迎了！让我们使用Gitflow工作流来更好地管理版本。',
    hint: '使用 git checkout -b develop master 命令创建开发分支，这是Gitflow工作流的核心分支之一。',
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
      branch: 'develop',
    },
    commands: [
      {
        type: 'checkout',
        command: 'git checkout',
        args: ['-b', 'develop', 'master'],
      },
    ],
    requiredCommands: [
      {
        type: 'checkout',
        command: 'git checkout',
      },
    ],
    validation: (commands) => commands.some((cmd) => cmd.type === 'checkout'),
  },
  {
    id: 23,
    title: 'Cherry-pick操作',
    description: '学习如何选择性地应用提交',
    story: '在另一个分支上有一个很棒的修改，我们想把它应用到当前分支，但不想合并整个分支。',
    hint: '使用 git cherry-pick <commit-hash> 命令来选择性地应用某个提交。',
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
            {
              name: 'photo-filter.js',
              type: 'file',
              status: 'committed',
            },
          ],
        },
      ],
      branch: 'master',
      message: '应用了照片滤镜功能',
    },
    commands: [
      {
        type: 'cherry-pick',
        command: 'git cherry-pick',
        args: ['abc1234'],
      },
    ],
    requiredCommands: [
      {
        type: 'cherry-pick',
        command: 'git cherry-pick',
      },
    ],
    validation: (commands) => commands.some((cmd) => cmd.type === 'cherry-pick'),
  },
  {
    id: 24,
    title: '子模块管理',
    description: '学习如何使用Git子模块',
    story: '我们想要在相册中使用一个外部的照片处理库，这个库也是一个Git仓库。',
    hint: '使用 git submodule add <仓库URL> libs/photo-processor 命令添加一个子模块。',
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
            {
              name: 'libs',
              type: 'directory',
              children: [
                {
                  name: 'photo-processor',
                  type: 'directory',
                  children: [],
                },
              ],
            },
            {
              name: '.gitmodules',
              type: 'file',
              status: 'committed',
            },
          ],
        },
      ],
      branch: 'master',
      message: '添加了照片处理库子模块',
    },
    commands: [
      {
        type: 'submodule',
        command: 'git submodule add',
        args: ['https://github.com/example/photo-processor.git', 'libs/photo-processor'],
      },
    ],
    requiredCommands: [
      {
        type: 'submodule',
        command: 'git submodule add',
      },
    ],
    validation: (commands) => commands.some((cmd) => cmd.type === 'submodule'),
  },
  {
    id: 25,
    title: '工作流回顾',
    description: '回顾并实践完整的工作流程',
    story: '让我们用一个完整的工作流程来实现一个新功能：添加照片评论功能！',
    hint: '这个关卡需要综合运用之前学到的知识。首先创建特性分支，然后进行开发，最后合并回主分支。',
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
            {
              name: 'comments.js',
              type: 'file',
              status: 'committed',
            },
          ],
        },
      ],
      branch: 'master',
      message: '合并了评论功能',
    },
    commands: [
      {
        type: 'checkout',
        command: 'git checkout',
        args: ['-b', 'feature/comments'],
      },
      {
        type: 'add',
        command: 'git add',
        args: ['comments.js'],
      },
      {
        type: 'commit',
        command: 'git commit',
        args: ['-m', '添加评论功能'],
      },
      {
        type: 'checkout',
        command: 'git checkout',
        args: ['master'],
      },
      {
        type: 'merge',
        command: 'git merge',
        args: ['feature/comments'],
      },
    ],
    requiredCommands: [
      {
        type: 'checkout',
        command: 'git checkout',
      },
      {
        type: 'add',
        command: 'git add',
      },
      {
        type: 'commit',
        command: 'git commit',
      },
      {
        type: 'merge',
        command: 'git merge',
      },
    ],
    validation: (commands) =>
      commands.some((cmd) => cmd.type === 'checkout') && commands.some((cmd) => cmd.type === 'add') && commands.some((cmd) => cmd.type === 'commit') && commands.some((cmd) => cmd.type === 'merge'),
  },
]
