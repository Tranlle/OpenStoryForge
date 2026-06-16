import { BookOpenText, FolderTree, ListTree, Network } from "lucide-react";

import type { ProjectTreeData } from "@renderer/components/layout/app-shell.types";
import type {
  ChapterItem,
  ConversationConfig,
  ConversationMessage,
  ConversationRecord,
  CreateConversationInput,
  DirectoryItem,
  NodeItem,
  QuickPrompt
} from "@renderer/features/home/home.types";

const defaultProjectPath = "D:/Stories/悬疑视觉小说";

const defaultConversationConfig: ConversationConfig = {
  folderLabel: "指定文件夹",
  modelLabel: "deepseek-v4-flash",
  presetLabel: "故事策划 Agent",
  reasoningLevel: "None"
};

const markdownProbeMessage = `# 世界观上下文速览

选择项目文件夹后，我会先读取目录结构，再把大纲、章节和节点整理到右侧抽屉中。

## 首轮动作

- 扫描项目目录与现有资源
- 提取世界观、角色、章节的核心线索
- 建立后续对话可复用的上下文骨架

> 当前这段内容用于测试 Markdown 渲染，包括层级标题、列表、引用、表格、任务项和代码块。

## 当前检查项

- [x] 标题层级
- [x] 无序列表
- [x] 引用块
- [x] 表格
- [ ] 代码块高亮样式

## 信息摘要

| 模块 | 状态 | 说明 |
| --- | --- | --- |
| 项目目录 | 已接入 | 等待真实后端返回目录结构 |
| 章节大纲 | 占位中 | 后续替换为实际项目数据 |
| 节点面板 | 可展开 | 用于承接结构化分析结果 |

\`\`\`ts
const workspacePlan = {
  folder: "悬疑视觉小说",
  focus: ["世界观", "角色关系", "前三章结构"],
  nextStep: "同步到右侧抽屉"
};
\`\`\`

如果这段渲染没有问题，下一步就可以继续增强代码块、表格和长文档排版。`;

export const mockConversations: ConversationRecord[] = [
  {
    config: {
      folderLabel: "悬疑视觉小说",
      modelLabel: "deepseek-v4-pro",
      presetLabel: "世界观构建 Agent",
      reasoningLevel: "High"
    },
    id: "conv-01",
    modifiedAt: "5 分钟前",
    projectPath: defaultProjectPath,
    status: "running",
    title: "悬疑视觉小说世界观搭建",
    messages: [
      {
        id: "agent-1",
        role: "agent",
        title: "OpenStoryForge Agent",
        body: markdownProbeMessage
      },
      {
        id: "user-1",
        role: "user",
        title: "创作者",
        body: "我想搭建一个悬疑视觉小说项目，先整理世界观、角色关系和前三章结构。"
      },
      {
        id: "agent-2",
        role: "agent",
        title: "OpenStoryForge Agent",
        body: "收到。我会先整理项目上下文，再继续细化章节与冲突节奏。"
      }
    ]
  },
  {
    config: {
      folderLabel: "悬疑视觉小说",
      modelLabel: "gpt-5-codex",
      presetLabel: "角色关系分析 Agent",
      reasoningLevel: "Medium"
    },
    id: "conv-02",
    modifiedAt: "昨天 21:14",
    projectPath: defaultProjectPath,
    status: "error",
    title: "角色关系和冲突草图",
    messages: [
      {
        id: "agent-1",
        role: "agent",
        title: "OpenStoryForge Agent",
        body: "你可以先列出核心角色、他们之间的冲突关系，以及各自掌握的信息差。"
      },
      {
        id: "user-1",
        role: "user",
        title: "创作者",
        body: "我需要整理侦探、失踪者妹妹、匿名举报人和反派之间的关系。"
      },
      {
        id: "agent-2",
        role: "agent",
        title: "OpenStoryForge Agent",
        body: "草图已经生成，但有两处动机冲突还需要回头校正。"
      }
    ]
  },
  {
    config: {
      folderLabel: "悬疑视觉小说",
      modelLabel: "deepseek-v4-flash",
      presetLabel: "分支节奏审校 Agent",
      reasoningLevel: "Low"
    },
    id: "conv-03",
    modifiedAt: "6 月 12 日",
    projectPath: defaultProjectPath,
    status: "completed",
    title: "前三章分支节奏检查",
    messages: [
      {
        id: "agent-1",
        role: "agent",
        title: "OpenStoryForge Agent",
        body: "前三章的分支节奏已经整理完成，我把关键转折压缩成三次主要决策。"
      },
      {
        id: "user-1",
        role: "user",
        title: "创作者",
        body: "我希望第二章结尾前就埋下反派误导观众的假线索。"
      },
      {
        id: "agent-2",
        role: "agent",
        title: "OpenStoryForge Agent",
        body: "已完成节奏检查，当前版本在第二章结尾加入了伪证物与监控盲区的双重误导。"
      }
    ]
  }
];

export const quickPromptPlaceholders: QuickPrompt[] = [
  {
    id: "quick-01",
    title: "延续当前角色冲突",
    summary: "基于已有设定，继续梳理主角、匿名举报人和反派之间的动机链。"
  },
  {
    id: "quick-02",
    title: "推进前三章分支",
    summary: "接着检查前三章分支节奏，补全误导线索和关键决策点。"
  }
];

export const projectTabs = [
  { id: "directory", label: "目录", icon: FolderTree },
  { id: "outline", label: "大纲", icon: ListTree },
  { id: "chapters", label: "章节", icon: BookOpenText },
  { id: "nodes", label: "节点", icon: Network }
] as const;

export const directoryItems: DirectoryItem[] = [
  { depth: 0, name: "未指定项目文件夹", type: "folder" },
  { depth: 1, name: "等待选择目录后读取结构", type: "file" },
  { depth: 1, name: "assets / scripts / chapters", type: "file" }
];

export const outlineItems = ["世界观设定", "主角动机", "冲突推进", "结局分支"];

export const chapterItems: ChapterItem[] = [
  { title: "序章", meta: "建立悬疑引子" },
  { title: "第一章", meta: "角色进入异常现场" },
  { title: "第二章", meta: "关键证词出现矛盾" }
];

export const nodeItems: NodeItem[] = [
  { title: "开始节点", children: ["开场对白", "环境镜头"] },
  { title: "调查节点", children: ["线索 A", "线索 B", "分支选择"] }
];

export function buildProjectTree(conversations: ConversationRecord[]): ProjectTreeData {
  const latestProjectPath = conversations[0]?.projectPath ?? defaultProjectPath;

  return {
    folderName: getPathLeaf(latestProjectPath),
    name: "OpenStoryForge",
    conversations: conversations.map((conversation) => ({
      id: conversation.id,
      modifiedAt: conversation.modifiedAt,
      status: conversation.status,
      title: conversation.title
    }))
  };
}

export function createConversationRecord(input: CreateConversationInput): ConversationRecord {
  const normalizedPrompt = input.prompt.trim();
  const projectPath = normalizeProjectPath(input.folderPath, input.folderLabel);
  const title = buildConversationTitle(normalizedPrompt);
  const modelLabel = input.modelId || defaultConversationConfig.modelLabel;
  const presetLabel = input.presetLabel || defaultConversationConfig.presetLabel;
  const folderLabel = input.folderLabel || getPathLeaf(projectPath);
  const reasoningLevel = input.reasoningLevel || defaultConversationConfig.reasoningLevel;
  const userMessage: ConversationMessage = {
    id: `user-${Date.now()}`,
    role: "user",
    title: "创作者",
    body: normalizedPrompt
  };
  const agentMessage: ConversationMessage = {
    id: `agent-${Date.now()}`,
    role: "agent",
    title: "OpenStoryForge Agent",
    body: `已为“${title}”创建会话起点。我会先围绕 ${presetLabel} 整理项目上下文，再继续展开具体执行。`
  };

  return {
    config: {
      folderLabel,
      modelLabel,
      presetLabel,
      reasoningLevel
    },
    id: `conv-${Date.now()}`,
    messages: [userMessage, agentMessage],
    modifiedAt: "刚刚",
    projectPath,
    status: "running",
    title
  };
}

function buildConversationTitle(prompt: string): string {
  const firstLine = prompt.split(/\r?\n/).find((line) => line.trim().length > 0)?.trim() ?? "新的主题会话";

  return firstLine.length > 22 ? `${firstLine.slice(0, 22)}...` : firstLine;
}

function normalizeProjectPath(folderPath: string, folderLabel: string): string {
  if (folderPath.trim()) {
    return folderPath.trim();
  }

  if (folderLabel.trim()) {
    return `D:/Stories/${folderLabel.trim()}`;
  }

  return defaultProjectPath;
}

function getPathLeaf(path: string): string {
  const segments = path.split(/[\\/]/).filter(Boolean);

  return segments.at(-1) ?? "未指定项目";
}

