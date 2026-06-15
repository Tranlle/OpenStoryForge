import { useGSAP } from "@gsap/react";
import { ArrowRight, Layers3, Palette, Type } from "lucide-react";
import { useRef } from "react";

import { Button } from "@renderer/components/primitives/button";
import { Surface } from "@renderer/components/primitives/surface";
import { animateHome } from "@renderer/features/home/home-motion";

const words = "把创作现场、模型能力、运行反馈和中文写作节奏放进同一个可扩展的桌面底座。".split("");

const themeCards = [
  {
    title: "四套主题先行",
    body: "明亮与暗黑各两套，全部由 CSS 变量驱动，Tailwind 与 Radix 共享同一套 token。",
    image: "https://picsum.photos/seed/openstoryforge-theme/1200/800"
  },
  {
    title: "字体按系统收束",
    body: "中文正文、展示标题、代码数值各自有明确字体栈，组件不能散写字体。",
    image: "https://picsum.photos/seed/openstoryforge-type/1200/800"
  },
  {
    title: "组件分层管理",
    body: "primitives、layout、features 分开演进，后续加菜单时不会把主页写成杂糅文件。",
    image: "https://picsum.photos/seed/openstoryforge-layer/1200/800"
  }
];

export function HomePage(): JSX.Element {
  const rootRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!rootRef.current) {
        return;
      }

      return animateHome(rootRef.current);
    },
    { scope: rootRef }
  );

  return (
    <div ref={rootRef} className="relative min-h-full overflow-hidden rounded-shell border border-border bg-background/58 shadow-panel">
      <div className="pointer-events-none absolute inset-0 opacity-70 [background-image:linear-gradient(90deg,hsl(var(--foreground)/0.05)_1px,transparent_1px),linear-gradient(hsl(var(--foreground)/0.04)_1px,transparent_1px)] [background-size:28px_28px]" />
      <div className="pointer-events-none absolute -right-24 top-0 h-72 w-72 rounded-full bg-accent/20 blur-3xl" />
      <div className="pointer-events-none absolute bottom-12 left-1/3 h-80 w-80 rounded-full bg-signal/16 blur-3xl" />

      <div className="relative px-6 py-8 md:px-10 lg:px-14">
        <nav className="mb-10 flex items-center justify-between gap-6 rounded-control border border-border bg-surface/56 px-5 py-3 shadow-panel backdrop-blur-2xl md:mb-16" data-reveal>
          <div className="font-display text-sm font-black tracking-normal">OpenStoryForge · 主页</div>
          <div className="hidden items-center gap-6 text-sm font-semibold text-muted md:flex">
            <span>设计系统</span>
            <span>主题</span>
            <span>字体</span>
          </div>
        </nav>

        <section className="relative min-h-[660px] py-6 md:min-h-[720px] md:py-14">
          <div className="relative z-10">
            <h1 className="max-w-[1120px] text-wrap font-display text-[clamp(2.45rem,4vw,4rem)] font-black leading-[1.03] tracking-normal" data-reveal>
              用克制但有锋芒的主页，定下 OpenStoryForge 的桌面气质。
            </h1>
            <p className="mt-7 max-w-3xl text-base leading-8 text-muted md:text-lg md:leading-9" data-reveal>
              这里先搭底层框架，不提前创建业务菜单。主页只承担风格样板、主题验证和组件组织示范。
            </p>
            <div className="mt-8 flex flex-wrap gap-3" data-reveal>
              <Button>
                查看框架结构
                <ArrowRight aria-hidden="true" className="h-4 w-4" />
              </Button>
              <Button variant="secondary">只保留主页菜单</Button>
            </div>
          </div>

          <Surface className="group mt-12 max-w-[560px] overflow-hidden p-3 md:ml-auto lg:absolute lg:bottom-0 lg:right-0 lg:mt-0 lg:w-[500px]" data-reveal>
            <div
              className="min-h-[360px] rounded-[24px] bg-cover bg-center p-5 contrast-125 transition-transform duration-700 ease-out group-hover:scale-[1.02] md:min-h-[430px]"
              data-scale-media
              style={{
                backgroundImage:
                  "linear-gradient(135deg, hsl(var(--background)/0.18), hsl(var(--foreground)/0.5)), url(https://picsum.photos/seed/openstoryforge-studio/1200/1200)"
              }}
            >
              <div className="flex h-full flex-col justify-between">
                <div className="max-w-xs rounded-2xl border border-white/18 bg-black/26 p-4 text-white backdrop-blur-xl">
                  <div className="font-display text-2xl font-black">主页</div>
                  <div className="mt-3 text-sm leading-6 text-white/76">
                    视觉方向、主题、字体、组件层次集中在这里验证。
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2 text-xs font-semibold text-white">
                  <span className="rounded-full bg-white/16 px-3 py-2 backdrop-blur-xl">Tailwind</span>
                  <span className="rounded-full bg-white/16 px-3 py-2 backdrop-blur-xl">Radix</span>
                  <span className="rounded-full bg-white/16 px-3 py-2 backdrop-blur-xl">GSAP</span>
                </div>
              </div>
            </div>
          </Surface>
        </section>

        <section className="py-28 md:py-40">
          <div className="max-w-6xl font-display text-[clamp(2.2rem,4.4vw,4.8rem)] font-black leading-tight tracking-normal" data-word-line>
            {words.map((word, index) => (
              <span data-word key={`${word}-${index}`}>
                {word}
              </span>
            ))}
          </div>
        </section>

        <section className="grid auto-rows-[minmax(210px,auto)] grid-cols-1 gap-4 [grid-auto-flow:dense] md:grid-cols-4">
          <Surface className="md:col-span-2 md:row-span-2 group overflow-hidden p-0" data-reveal>
            <div
              className="h-full min-h-[430px] bg-cover bg-center p-7 transition-transform duration-700 ease-out group-hover:scale-[1.03]"
              style={{
                backgroundImage:
                  "linear-gradient(135deg, hsl(var(--foreground)/0.68), hsl(var(--accent)/0.24)), url(https://picsum.photos/seed/openstoryforge-bento/1400/1000)"
              }}
            >
              <div className="max-w-md text-white">
                <Palette className="mb-6 h-7 w-7" />
                <h2 className="font-display text-4xl font-black leading-tight tracking-normal">设计系统先于业务扩展</h2>
                <p className="mt-5 text-base leading-8 text-white/78">
                  主题、字体、按钮、面板、导航与动效先稳定下来，后续加功能时只扩展结构。
                </p>
              </div>
            </div>
          </Surface>

          {themeCards.map((card) => (
            <Surface className="group overflow-hidden p-0" data-reveal key={card.title}>
              <div className="h-28 overflow-hidden">
                <img
                  alt=""
                  className="h-full w-full object-cover opacity-90 mix-blend-luminosity contrast-125 transition-transform duration-700 ease-out group-hover:scale-110"
                  src={card.image}
                />
              </div>
              <div className="p-5">
                <h3 className="font-display text-xl font-black tracking-normal">{card.title}</h3>
                <p className="mt-3 text-sm leading-7 text-muted">{card.body}</p>
              </div>
            </Surface>
          ))}

          <Surface className="md:col-span-2 p-7" data-reveal>
            <div className="flex h-full flex-col justify-between gap-8 md:flex-row md:items-end">
              <div>
                <Layers3 className="mb-5 h-7 w-7 text-accent" />
                <h3 className="font-display text-3xl font-black tracking-normal">组件边界清晰</h3>
                <p className="mt-4 max-w-xl text-sm leading-7 text-muted">
                  `primitives` 承载可复用 UI，`layout` 承载桌面壳，`features/home` 承载主页。后续页面可以独立添加。
                </p>
              </div>
              <div className="font-mono text-xs leading-6 text-muted">
                components/primitives
                <br />
                components/layout
                <br />
                features/home
              </div>
            </div>
          </Surface>

          <Surface className="md:col-span-2 p-7" data-reveal>
            <Type className="mb-5 h-7 w-7 text-signal" />
            <h3 className="font-display text-3xl font-black tracking-normal">字体有平台策略</h3>
            <p className="mt-4 text-sm leading-7 text-muted">
              中文正文优先系统中文字体；标题用 display 变量控制气质；代码与数值使用 mono 变量。组件不随意写散乱字体。
            </p>
          </Surface>
        </section>

        <footer className="flex flex-col justify-between gap-6 py-24 md:flex-row md:items-end">
          <div>
            <h2 className="font-display text-[clamp(2.4rem,4vw,4.8rem)] font-black leading-none tracking-normal">
              下一步只等你指定功能。
            </h2>
            <p className="mt-6 max-w-2xl text-base leading-8 text-muted">
              框架会保持可扩展，但不会擅自添加作品、角色、Agent、模型或设置菜单。
            </p>
          </div>
          <Button variant="secondary">主页框架已就绪</Button>
        </footer>
      </div>
    </div>
  );
}
