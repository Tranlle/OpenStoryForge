import type { HTMLAttributes } from "react";

import { cn } from "@renderer/lib/utils";

export type SurfaceProps = HTMLAttributes<HTMLDivElement> & {
  tone?: "soft" | "strong" | "transparent";
};

export function Surface({
  className,
  tone = "soft",
  ...props
}: SurfaceProps): JSX.Element {
  return (
    <div
      className={cn(
        "rounded-panel border border-border shadow-panel backdrop-blur-2xl",
        tone === "soft" && "bg-surface/72",
        tone === "strong" && "bg-surface-strong/82",
        tone === "transparent" && "bg-surface/36",
        className
      )}
      {...props}
    />
  );
}
