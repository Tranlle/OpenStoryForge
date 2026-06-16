export const supportedLocales = ["zh-CN", "en-US", "ja-JP"] as const;

export type AppLocale = (typeof supportedLocales)[number];

type MessageTree = {
  [key: string]: MessageTree | string;
};

export const messages: Record<AppLocale, MessageTree> = {
  "zh-CN": {
    common: {
      appName: "OpenStoryForge",
      browser: "浏览器",
      previewBackendOffline: "预览 / 后端离线",
      loadingWorkspace: "正在加载工作区...",
      page: "页面快捷键",
      global: "全局快捷键",
      resetDefaults: "恢复默认",
      noLinkedFolder: "未绑定文件夹",
      noLinkedFoldersYet: "尚未绑定文件夹",
      theme: "主题",
      language: "语言",
      keyboardShortcuts: "快捷键",
      settings: "设置",
      projectTree: "项目树",
      project: "项目",
      cancel: "取消",
      send: "发送",
      createTaskAndOpenHome: "创建任务并打开 Home",
      total: "总量",
      input: "输入",
      output: "输出",
      cached: "缓存",
      globalTotals: "全局总量",
      perProject: "按项目",
      currentProject: "当前项目",
      scope: "作用域",
      binding: "绑定",
      command: "命令",
      notConfigured: "未配置",
      saveForLater: "基座已接通，后续可直接扩展更多绑定。"
    },
    locale: {
      autoDetected: "跟随系统",
      "zh-CN": "简体中文",
      "en-US": "English",
      "ja-JP": "日本語"
    },
    theme: {
      cycle: "切换主题，当前为 {label}",
      clickToCycle: "点击切换主题",
      "paper-atelier": "明亮编辑室",
      "glass-script": "明亮玻璃稿台",
      "ink-theater": "暗黑剧场",
      "signal-forge": "暗黑信号熔炉"
    },
    shell: {
      welcomeMobileLabel: "欢迎页",
      welcomeMobileSubtitle: "项目优先入口",
      homeMobileLabel: "主页",
      homeMobileSubtitle: "Home 工作区",
      backToWelcome: "返回欢迎页",
      expandSidebar: "展开侧栏",
      collapseSidebar: "收起侧栏",
      platform: {
        darwin: "macOS",
        linux: "Linux",
        win32: "Windows"
      },
      closeWindow: "关闭窗口",
      minimizeWindow: "最小化窗口",
      maximizeWindow: "最大化窗口",
      restoreWindow: "还原窗口",
      fullScreen: "全屏",
      windowed: "窗口模式"
    },
    nav: {
      newChat: "新建对话",
      skills: "Skills",
      tools: "Tools",
      automation: "自动化",
      mcp: "MCP Server",
      archive: "归档",
      settings: "设置",
      more: "更多",
      recentTemplates: "最近模板",
      teamSpace: "团队空间",
      experiments: "实验面板"
    },
    status: {
      completed: "已完成",
      error: "异常",
      running: "运行中"
    },
    composer: {
      selectFolder: "选择文件夹",
      createAndSpecifyFolder: "创建并指定文件夹",
      selectExistingFolder: "选择已有文件夹",
      selectModel: "选择模型",
      agentMode: "Agent 模式",
      dialog: {
        createTitle: "指定新文件夹",
        selectTitle: "指定已有文件夹",
        description:
          "文件夹上下文属于任务而不是项目身份。欢迎页可以在这里新建或绑定项目，Home 中则保持当前项目只读。",
        close: "关闭弹窗",
        projectReadonly: "当前项目在这里以只读方式展示。",
        projectEditable: "可以输入新项目名，或选择已有项目。",
        basePath: "基础路径",
        folderPath: "文件夹路径",
        folderName: "文件夹名称",
        createAction: "创建文件夹",
        selectAction: "选择文件夹"
      },
      quickStartPlaceholder: "例如：创建一个悬疑视觉小说，先梳理世界规则、角色关系，以及前三章的结构。",
      conversationPlaceholder: "输入创作目标、剧情设定，或让 Agent 继续分析当前项目..."
    },
    starter: {
      eyebrow: "让故事先浮出水面",
      title: "我们从哪里开始？\n是一座尚未命名的城市，还是一桩仍未解开的谜案？",
      description:
        "一句话就足够开始。它可以是世界观种子、路线草图、冲突地图，或一条等待被拉出的角色线索。"
    },
    welcome: {
      quickStart: "快速开始",
      projectList: "项目清单",
      tokenUsage: "Token 用量",
      settings: "设置",
      loadingProjectTree: "正在加载项目树...",
      settingsThemeTitle: "主题",
      settingsThemeDescription: "继续使用标题栏中的全局主题切换器，保持现有行为不变。",
      settingsLanguageTitle: "语言",
      settingsLanguageDescription: "切换整个应用的界面语言。只影响 UI 文案，不翻译项目、任务或消息内容。",
      settingsShortcutTitle: "快捷键基座",
      settingsShortcutDescription: "已接通全局快捷键与页面快捷键两种作用域，当前先展示默认命令与绑定。",
      workspacePreferencesTitle: "工作区偏好",
      workspacePreferencesDescription:
        "后续可以在这里继续增加启动目录、项目默认值和 Token 展示偏好，而不影响 Home 的现有行为。"
    },
    home: {
      skills: "Skills",
      tools: "Tools",
      automation: "自动化",
      archive: "归档",
      projectTree: "项目树",
      newConversation: "新建对话",
      deleteFolder: "删除文件夹",
      selectProjectFolder: "选择项目文件夹",
      outlineLabel: "大纲 {index}",
      drawerCollapse: "收起项目侧栏",
      drawerExpand: "展开项目侧栏",
      tabs: {
        directory: "目录",
        outline: "大纲",
        chapters: "章节",
        nodes: "节点"
      },
      agentSettings: "Agent 设置"
    },
    shortcuts: {
      commands: {
        "app.gotoWelcome": "打开欢迎页",
        "app.gotoHome": "打开 Home",
        "app.toggleTheme": "切换主题",
        "welcome.quickStart": "欢迎页切换到快速开始",
        "welcome.projects": "欢迎页切换到项目清单",
        "welcome.tokens": "欢迎页切换到 Token 用量",
        "welcome.settings": "欢迎页切换到设置",
        "home.newConversation": "Home 新建对话",
        "home.returnWelcome": "Home 返回欢迎页"
      }
    }
  },
  "en-US": {
    common: {
      appName: "OpenStoryForge",
      browser: "Browser",
      previewBackendOffline: "Preview / Backend offline",
      loadingWorkspace: "Loading workspace...",
      page: "Page shortcuts",
      global: "Global shortcuts",
      resetDefaults: "Reset defaults",
      noLinkedFolder: "No linked folder",
      noLinkedFoldersYet: "No linked folders yet",
      theme: "Theme",
      language: "Language",
      keyboardShortcuts: "Keyboard shortcuts",
      settings: "Settings",
      projectTree: "Project tree",
      project: "Project",
      cancel: "Cancel",
      send: "Send",
      createTaskAndOpenHome: "Create task and open Home",
      total: "Total",
      input: "Input",
      output: "Output",
      cached: "Cached",
      globalTotals: "Global totals",
      perProject: "Per project",
      currentProject: "Current project",
      scope: "Scope",
      binding: "Binding",
      command: "Command",
      notConfigured: "Not configured",
      saveForLater: "The foundation is wired so more bindings can be added directly later."
    },
    locale: {
      autoDetected: "Follow system",
      "zh-CN": "Simplified Chinese",
      "en-US": "English",
      "ja-JP": "Japanese"
    },
    theme: {
      cycle: "Cycle theme, current: {label}",
      clickToCycle: "Click to cycle theme",
      "paper-atelier": "Paper Atelier",
      "glass-script": "Glass Script",
      "ink-theater": "Ink Theater",
      "signal-forge": "Signal Forge"
    },
    shell: {
      welcomeMobileLabel: "WELCOME",
      welcomeMobileSubtitle: "Project-first entry",
      homeMobileLabel: "HOME",
      homeMobileSubtitle: "Home workspace",
      backToWelcome: "Back to welcome",
      expandSidebar: "Expand sidebar",
      collapseSidebar: "Collapse sidebar",
      platform: {
        darwin: "macOS",
        linux: "Linux",
        win32: "Windows"
      },
      closeWindow: "Close window",
      minimizeWindow: "Minimize window",
      maximizeWindow: "Maximize window",
      restoreWindow: "Restore window",
      fullScreen: "Full screen",
      windowed: "Windowed"
    },
    nav: {
      newChat: "New chat",
      skills: "Skills",
      tools: "Tools",
      automation: "Automation",
      mcp: "MCP Server",
      archive: "Archive",
      settings: "Settings",
      more: "More",
      recentTemplates: "Recent templates",
      teamSpace: "Team space",
      experiments: "Experiments"
    },
    status: {
      completed: "Completed",
      error: "Error",
      running: "Running"
    },
    composer: {
      selectFolder: "Select folder",
      createAndSpecifyFolder: "Create and specify folder",
      selectExistingFolder: "Select existing folder",
      selectModel: "Select model",
      agentMode: "Agent mode",
      dialog: {
        createTitle: "Specify new folder",
        selectTitle: "Specify existing folder",
        description:
          "Folder context belongs to the task, not project identity. Welcome can create or bind a project here, while Home keeps the current project read-only.",
        close: "Close dialog",
        projectReadonly: "Current project is shown here as read-only.",
        projectEditable: "Type a new project name or choose an existing project.",
        basePath: "Base path",
        folderPath: "Folder path",
        folderName: "Folder name",
        createAction: "Create folder",
        selectAction: "Select folder"
      },
      quickStartPlaceholder:
        "For example: create a suspense visual novel, sort out the world rules, character dynamics, and the structure of the first three chapters.",
      conversationPlaceholder:
        "Describe a creative goal, a story constraint, or ask the agent to continue analyzing the current project..."
    },
    starter: {
      eyebrow: "Let the story surface first",
      title: "Where should we begin?\nA city not yet named, or a mystery still unresolved?",
      description:
        "A single sentence is enough to start. It can be a world seed, a route sketch, a conflict map, or a character thread waiting to be pulled into focus."
    },
    welcome: {
      quickStart: "Quick start",
      projectList: "Projects",
      tokenUsage: "Token usage",
      settings: "Settings",
      loadingProjectTree: "Loading project tree...",
      settingsThemeTitle: "Theme",
      settingsThemeDescription: "Keep using the global theme switcher in the title bar without changing existing behavior.",
      settingsLanguageTitle: "Language",
      settingsLanguageDescription:
        "Switch the interface language across the app. This only affects UI copy and does not translate projects, tasks, or messages.",
      settingsShortcutTitle: "Shortcut foundation",
      settingsShortcutDescription:
        "Global and page shortcut scopes are both wired in. For now this panel shows the default commands and bindings.",
      workspacePreferencesTitle: "Workspace preferences",
      workspacePreferencesDescription:
        "Future settings can add launch folders, project defaults, and token display preferences without changing Home behavior."
    },
    home: {
      skills: "Skills",
      tools: "Tools",
      automation: "Automation",
      archive: "Archive",
      projectTree: "Project tree",
      newConversation: "New conversation",
      deleteFolder: "Delete folder",
      selectProjectFolder: "Select project folder",
      outlineLabel: "Outline {index}",
      drawerCollapse: "Collapse project drawer",
      drawerExpand: "Expand project drawer",
      tabs: {
        directory: "Directory",
        outline: "Outline",
        chapters: "Chapters",
        nodes: "Nodes"
      },
      agentSettings: "Agent settings"
    },
    shortcuts: {
      commands: {
        "app.gotoWelcome": "Open Welcome",
        "app.gotoHome": "Open Home",
        "app.toggleTheme": "Toggle theme",
        "welcome.quickStart": "Switch Welcome to Quick start",
        "welcome.projects": "Switch Welcome to Projects",
        "welcome.tokens": "Switch Welcome to Token usage",
        "welcome.settings": "Switch Welcome to Settings",
        "home.newConversation": "Open Home new conversation",
        "home.returnWelcome": "Return from Home to Welcome"
      }
    }
  },
  "ja-JP": {
    common: {
      appName: "OpenStoryForge",
      browser: "ブラウザー",
      previewBackendOffline: "プレビュー / バックエンドオフライン",
      loadingWorkspace: "ワークスペースを読み込み中...",
      page: "ページショートカット",
      global: "グローバルショートカット",
      resetDefaults: "デフォルトに戻す",
      noLinkedFolder: "関連フォルダーなし",
      noLinkedFoldersYet: "まだ関連フォルダーがありません",
      theme: "テーマ",
      language: "言語",
      keyboardShortcuts: "ショートカット",
      settings: "設定",
      projectTree: "プロジェクトツリー",
      project: "プロジェクト",
      cancel: "キャンセル",
      send: "送信",
      createTaskAndOpenHome: "タスクを作成して Home を開く",
      total: "合計",
      input: "入力",
      output: "出力",
      cached: "キャッシュ",
      globalTotals: "全体合計",
      perProject: "プロジェクト別",
      currentProject: "現在のプロジェクト",
      scope: "スコープ",
      binding: "割り当て",
      command: "コマンド",
      notConfigured: "未設定",
      saveForLater: "基盤は接続済みなので、今後は直接バインドを追加できます。"
    },
    locale: {
      autoDetected: "システムに従う",
      "zh-CN": "簡体字中国語",
      "en-US": "英語",
      "ja-JP": "日本語"
    },
    theme: {
      cycle: "テーマ切り替え、現在: {label}",
      clickToCycle: "クリックしてテーマを切り替え",
      "paper-atelier": "Paper Atelier",
      "glass-script": "Glass Script",
      "ink-theater": "Ink Theater",
      "signal-forge": "Signal Forge"
    },
    shell: {
      welcomeMobileLabel: "WELCOME",
      welcomeMobileSubtitle: "プロジェクト優先の入口",
      homeMobileLabel: "HOME",
      homeMobileSubtitle: "Home ワークスペース",
      backToWelcome: "Welcome に戻る",
      expandSidebar: "サイドバーを展開",
      collapseSidebar: "サイドバーを折りたたむ",
      platform: {
        darwin: "macOS",
        linux: "Linux",
        win32: "Windows"
      },
      closeWindow: "ウィンドウを閉じる",
      minimizeWindow: "ウィンドウを最小化",
      maximizeWindow: "ウィンドウを最大化",
      restoreWindow: "ウィンドウを元に戻す",
      fullScreen: "フルスクリーン",
      windowed: "ウィンドウ表示"
    },
    nav: {
      newChat: "新規会話",
      skills: "Skills",
      tools: "Tools",
      automation: "自動化",
      mcp: "MCP Server",
      archive: "アーカイブ",
      settings: "設定",
      more: "その他",
      recentTemplates: "最近のテンプレート",
      teamSpace: "チームスペース",
      experiments: "実験パネル"
    },
    status: {
      completed: "完了",
      error: "エラー",
      running: "実行中"
    },
    composer: {
      selectFolder: "フォルダーを選択",
      createAndSpecifyFolder: "フォルダーを作成して指定",
      selectExistingFolder: "既存フォルダーを選択",
      selectModel: "モデルを選択",
      agentMode: "Agent モード",
      dialog: {
        createTitle: "新しいフォルダーを指定",
        selectTitle: "既存フォルダーを指定",
        description:
          "フォルダーコンテキストはタスクに属し、プロジェクトの識別子ではありません。Welcome ではここでプロジェクトを作成または紐付けでき、Home では現在のプロジェクトを読み取り専用で保持します。",
        close: "ダイアログを閉じる",
        projectReadonly: "現在のプロジェクトはここでは読み取り専用で表示されます。",
        projectEditable: "新しいプロジェクト名を入力するか、既存のプロジェクトを選択できます。",
        basePath: "ベースパス",
        folderPath: "フォルダーパス",
        folderName: "フォルダー名",
        createAction: "フォルダーを作成",
        selectAction: "フォルダーを選択"
      },
      quickStartPlaceholder:
        "例: サスペンス系ビジュアルノベルを作成し、世界設定、人物関係、最初の三章の構成を整理する。",
      conversationPlaceholder:
        "創作目標や物語の条件を入力するか、Agent に現在のプロジェクト分析を続けさせてください..."
    },
    starter: {
      eyebrow: "物語の輪郭を先に浮かび上がらせる",
      title: "どこから始めましょうか？\nまだ名もない街か、解かれていない謎か。",
      description:
        "ひと言あれば始められます。世界観の種、ルートの草案、対立マップ、あるいは引き出されるのを待つ人物の糸でも構いません。"
    },
    welcome: {
      quickStart: "クイックスタート",
      projectList: "プロジェクト一覧",
      tokenUsage: "Token 使用量",
      settings: "設定",
      loadingProjectTree: "プロジェクトツリーを読み込み中...",
      settingsThemeTitle: "テーマ",
      settingsThemeDescription: "既存の挙動を変えずに、タイトルバーのグローバルテーマ切り替えをそのまま利用します。",
      settingsLanguageTitle: "言語",
      settingsLanguageDescription:
        "アプリ全体の UI 言語を切り替えます。プロジェクト、タスク、メッセージ内容は翻訳しません。",
      settingsShortcutTitle: "ショートカット基盤",
      settingsShortcutDescription:
        "グローバルとページの両スコープを配線済みです。現時点ではデフォルトのコマンドと割り当てを表示します。",
      workspacePreferencesTitle: "ワークスペース設定",
      workspacePreferencesDescription:
        "今後は起動フォルダー、プロジェクト既定値、Token 表示設定などを、Home の既存挙動を壊さずにここへ追加できます。"
    },
    home: {
      skills: "Skills",
      tools: "Tools",
      automation: "自動化",
      archive: "アーカイブ",
      projectTree: "プロジェクトツリー",
      newConversation: "新規会話",
      deleteFolder: "フォルダーを削除",
      selectProjectFolder: "プロジェクトフォルダーを選択",
      outlineLabel: "アウトライン {index}",
      drawerCollapse: "プロジェクトドロワーを折りたたむ",
      drawerExpand: "プロジェクトドロワーを展開",
      tabs: {
        directory: "ディレクトリ",
        outline: "アウトライン",
        chapters: "章",
        nodes: "ノード"
      },
      agentSettings: "Agent 設定"
    },
    shortcuts: {
      commands: {
        "app.gotoWelcome": "Welcome を開く",
        "app.gotoHome": "Home を開く",
        "app.toggleTheme": "テーマを切り替える",
        "welcome.quickStart": "Welcome をクイックスタートへ切り替え",
        "welcome.projects": "Welcome をプロジェクト一覧へ切り替え",
        "welcome.tokens": "Welcome を Token 使用量へ切り替え",
        "welcome.settings": "Welcome を設定へ切り替え",
        "home.newConversation": "Home の新規会話を開く",
        "home.returnWelcome": "Home から Welcome へ戻る"
      }
    }
  }
};
