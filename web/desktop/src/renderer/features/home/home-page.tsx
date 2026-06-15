import { useGSAP } from "@gsap/react";
import {
  BookOpenText,
  Bot,
  ChevronRight,
  Circle,
  FileText,
  Folder,
  FolderTree,
  ListTree,
  MessageSquarePlus,
  Network,
  PanelRightClose,
  PanelRightOpen,
  SendHorizontal,
  Settings2,
  UserRound
} from "lucide-react";
import type { ReactNode } from "react";
import { useRef, useState } from "react";

import { Button } from "@renderer/components/primitives/button";
import { animateHome } from "@renderer/features/home/home-motion";
import { cn } from "@renderer/lib/utils";

type ProjectTabId = "directory" | "outline" | "chapters" | "nodes";

const projectTabs = [
  { id: "directory", label: "目录", icon: FolderTree },
  { id: "outline", label: "大纲", icon: ListTree },
  { id: "chapters", label: "章节", icon: BookOpenText },
  { id: "nodes", label: "节点", icon: Network }
] as const;

const messages = [
  {
    id: "agent-1",
    role: "agent",
    title: "OpenStoryForge Agent",
    body: "选择项目文件夹后，我会读取目录结构，并把大纲、章节和节点同步到右侧页面栏。"
  },
  {
    id: "user-1",
    role: "user",
    title: "创作者",
    body: "我想搭建一个偏悬疑的视觉小说项目，先整理世界观、章节结构和关键节点。"
  },
  {
    id: "agent-2",
    role: "agent",
    title: "OpenStoryForge Agent",
    body: "收到。左侧保持连续对话，右侧作为可收放的项目页面栏。"
  }
];

const directoryItems = [
  { depth: 0, name: "未选择项目文件夹", type: "folder" },
  { depth: 1, name: "选择文件夹后读取目录", type: "file" },
  { depth: 1, name: "assets / scripts / chapters", type: "file" }
];

const outlineItems = ["世界观设定", "主角动机", "冲突推进", "结局分支"];

const chapterItems = [
  { title: "序章", meta: "建立悬疑引子" },
  { title: "第一章", meta: "角色进入异常现场" },
  { title: "第二章", meta: "关键证词出现矛盾" }
];

const nodeItems = [
  { title: "开始节点", children: ["开场对白", "环境镜头"] },
  { title: "调查节点", children: ["线索 A", "线索 B", "分歧选择"] }
];

export function HomePage(): JSX.Element {
  const rootRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState<ProjectTabId>("directory");
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  useGSAP(
    () => {
      if (!rootRef.current) {
        return undefined;
      }

      return animateHome(rootRef.current);
    },
    { scope: rootRef }
  );

  return (
    <div ref={rootRef} className="relative h-full min-h-[640px] overflow-hidden">
      <div className="flex h-full min-h-0 min-w-0 overflow-hidden">
        <AgentWorkspace />
        <ProjectDrawer
          activeTab={activeTab}
          isOpen={isDrawerOpen}
          onTabChange={setActiveTab}
          onToggle={() => setIsDrawerOpen((current) => !current)}
        />
      </div>
    </div>
  );
}

function AgentWorkspace(): JSX.Element {
  return (
    <section className="flex min-h-0 min-w-0 flex-1 flex-col border-r border-border/70" data-reveal>
      <div className="flex h-14 shrink-0 items-center justify-end gap-2 border-b border-border/50 px-4 md:px-6">
        <IconButton label="新建对话">
          <MessageSquarePlus aria-hidden="true" className="h-4 w-4" />
        </IconButton>
        <IconButton label="Agent 设置">
          <Settings2 aria-hidden="true" className="h-4 w-4" />
        </IconButton>
      </div>

      <div className="flex min-h-0 flex-1 flex-col bg-surface/24">
        <div className="flex shrink-0 items-center gap-3 border-b border-border/50 px-5 py-4 md:px-6">
          <div className="grid h-10 w-10 place-items-center rounded-2xl bg-accent text-accent-foreground shadow-lift">
            <Bot aria-hidden="true" className="h-5 w-5" />
          </div>
          <div>
            <div className="font-display text-base font-black">OpenStoryForge Agent</div>
            <div className="text-xs text-muted">项目上下文暂未连接 · 等待选择文件夹</div>
          </div>
        </div>

        <div className="min-h-0 flex-1 space-y-5 overflow-y-auto px-5 py-6 md:px-8">
          {messages.map((message) => {
            const isUser = message.role === "user";

            return (
              <article className={cn("flex gap-3", isUser && "flex-row-reverse")} data-reveal key={message.id}>
                <div
                  className={cn(
                    "grid h-9 w-9 shrink-0 place-items-center rounded-2xl border border-border",
                    isUser ? "bg-foreground text-background" : "bg-accent text-accent-foreground"
                  )}
                >
                  {isUser ? (
                    <UserRound aria-hidden="true" className="h-4 w-4" />
                  ) : (
                    <Bot aria-hidden="true" className="h-4 w-4" />
                  )}
                </div>
                <div
                  className={cn(
                    "max-w-[76%] rounded-[1.35rem] border border-border/70 px-4 py-3 shadow-panel",
                    isUser ? "bg-foreground text-background" : "bg-surface/62"
                  )}
                >
                  <div className={cn("text-xs font-bold", isUser ? "text-background/70" : "text-muted")}>
                    {message.title}
                  </div>
                  <p className="mt-2 text-sm leading-7">{message.body}</p>
                </div>
              </article>
            );
          })}
        </div>

        <div className="shrink-0 border-t border-border/50 p-4 md:px-6">
          <div className="flex items-end gap-3 rounded-[1.35rem] border border-border bg-background/46 p-3 shadow-panel">
            <textarea
              className="min-h-12 flex-1 resize-none bg-transparent px-2 py-2 text-sm leading-6 outline-none placeholder:text-muted"
              placeholder="输入创作目标、剧情设定或让 Agent 分析当前项目..."
              rows={2}
            />
            <Button size="icon" type="button">
              <SendHorizontal aria-hidden="true" className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

type IconButtonProps = {
  children: ReactNode;
  label: string;
};

function IconButton({ children, label }: IconButtonProps): JSX.Element {
  return (
    <button
      aria-label={label}
      className="grid h-10 w-10 place-items-center rounded-xl border border-border bg-surface/42 text-muted transition hover:bg-surface/72 hover:text-foreground"
      title={label}
      type="button"
    >
      {children}
    </button>
  );
}

type ProjectDrawerProps = {
  activeTab: ProjectTabId;
  isOpen: boolean;
  onTabChange: (tab: ProjectTabId) => void;
  onToggle: () => void;
};

function ProjectDrawer({ activeTab, isOpen, onTabChange, onToggle }: ProjectDrawerProps): JSX.Element {
  return (
    <aside
      className={cn(
        "relative z-20 flex min-h-0 shrink-0 overflow-hidden bg-surface/22 backdrop-blur-2xl transition-[width] duration-300 ease-out",
        isOpen ? "w-[410px]" : "w-[72px]"
      )}
      data-reveal
    >
      <div className="flex h-full w-[72px] shrink-0 flex-col items-center border-l border-border/70 py-2">
        <div className="flex h-12 shrink-0 items-center justify-center">
          <button
            aria-label={isOpen ? "收起页面栏" : "展开页面栏"}
            className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-border bg-background/42 text-muted transition hover:text-foreground"
            onClick={onToggle}
            type="button"
          >
            {isOpen ? (
              <PanelRightClose aria-hidden="true" className="h-4 w-4" />
            ) : (
              <PanelRightOpen aria-hidden="true" className="h-4 w-4" />
            )}
          </button>
        </div>

        <div className="flex flex-1 flex-col items-center gap-2 py-3">
          {projectTabs.map((tab) => {
            const Icon = tab.icon;
            const selected = activeTab === tab.id;

            return (
              <button
                aria-label={tab.label}
                aria-pressed={selected}
                className={cn(
                  "grid h-10 w-10 place-items-center rounded-xl text-muted transition hover:bg-surface/60 hover:text-foreground",
                  selected && "bg-foreground text-background"
                )}
                key={tab.id}
                onClick={() => {
                  onTabChange(tab.id);

                  if (!isOpen) {
                    onToggle();
                  }
                }}
                title={tab.label}
                type="button"
              >
                <Icon aria-hidden="true" className="h-4 w-4" />
              </button>
            );
          })}
        </div>
      </div>

      <div
        aria-hidden={!isOpen}
        className={cn(
          "min-h-0 w-[338px] shrink-0 overflow-y-auto border-l border-border/70 bg-surface/42 p-4 transition duration-300 ease-out app-scrollbar",
          isOpen ? "translate-x-0 opacity-100" : "-translate-x-4 opacity-0 pointer-events-none"
        )}
      >
        {activeTab === "directory" ? <DirectoryView /> : null}
        {activeTab === "outline" ? <OutlineView /> : null}
        {activeTab === "chapters" ? <ChaptersView /> : null}
        {activeTab === "nodes" ? <NodesView /> : null}
      </div>
    </aside>
  );
}

function DirectoryView(): JSX.Element {
  return (
    <div className="space-y-4">
      <Button className="w-full" variant="secondary">
        <Folder aria-hidden="true" className="h-4 w-4" />
        选择项目文件夹
      </Button>
      <div className="rounded-[1.25rem] border border-border/70 bg-background/36 p-3">
        {directoryItems.map((item) => {
          const Icon = item.type === "folder" ? Folder : FileText;

          return (
            <div
              className="flex items-center gap-2 rounded-xl px-2 py-2 text-sm text-muted"
              key={`${item.depth}-${item.name}`}
              style={{ paddingLeft: `${item.depth * 18 + 8}px` }}
            >
              <Icon aria-hidden="true" className="h-4 w-4" />
              {item.name}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function OutlineView(): JSX.Element {
  return (
    <div className="space-y-3">
      {outlineItems.map((item, index) => (
        <article className="rounded-[1.25rem] border border-border/70 bg-background/36 p-4" key={item}>
          <div className="text-xs font-bold text-muted">大纲 {index + 1}</div>
          <div className="mt-2 font-display text-lg font-black">{item}</div>
          <div className="mt-3 h-1.5 rounded-full bg-border">
            <div className="h-full rounded-full bg-accent" style={{ width: `${32 + index * 14}%` }} />
          </div>
        </article>
      ))}
    </div>
  );
}

function ChaptersView(): JSX.Element {
  return (
    <div className="space-y-3">
      {chapterItems.map((chapter) => (
        <article className="flex gap-3 rounded-[1.25rem] border border-border/70 bg-background/36 p-4" key={chapter.title}>
          <div className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-accent/16 text-accent">
            <BookOpenText aria-hidden="true" className="h-5 w-5" />
          </div>
          <div>
            <div className="font-display text-lg font-black">{chapter.title}</div>
            <div className="mt-1 text-sm leading-6 text-muted">{chapter.meta}</div>
          </div>
        </article>
      ))}
    </div>
  );
}

function NodesView(): JSX.Element {
  return (
    <div className="space-y-3">
      {nodeItems.map((node) => (
        <article className="rounded-[1.25rem] border border-border/70 bg-background/36 p-4" key={node.title}>
          <div className="flex items-center gap-2 font-display text-lg font-black">
            <ChevronRight aria-hidden="true" className="h-4 w-4 text-accent" />
            {node.title}
          </div>
          <div className="mt-3 space-y-2 border-l border-border/80 pl-4">
            {node.children.map((child) => (
              <div className="flex items-center gap-2 text-sm text-muted" key={child}>
                <Circle aria-hidden="true" className="h-2.5 w-2.5 fill-current" />
                {child}
              </div>
            ))}
          </div>
        </article>
      ))}
    </div>
  );
}
