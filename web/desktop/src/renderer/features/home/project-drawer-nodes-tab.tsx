import { ChevronRight, Circle } from "lucide-react";

import { nodeItems } from "@renderer/features/home/home.data";

export function ProjectDrawerNodesTab(): JSX.Element {
  return (
    <div className="space-y-3">
      {nodeItems.map((node) => (
        <article
          className="rounded-[1.25rem] bg-background/24 p-4 shadow-[inset_0_0_0_1px_hsl(var(--border)/0.36)]"
          key={node.title}
        >
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
