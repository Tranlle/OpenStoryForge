import { FileText, Folder } from "lucide-react";

import { Button } from "@renderer/components/primitives/button";
import { directoryItems } from "@renderer/features/home/home.data";

export function ProjectDrawerDirectoryTab(): JSX.Element {
  return (
    <div className="space-y-4">
      <Button className="w-full" variant="secondary">
        <Folder aria-hidden="true" className="h-4 w-4" />
        选择项目文件夹
      </Button>
      <div className="rounded-[1.25rem] bg-background/24 p-3 shadow-[inset_0_0_0_1px_hsl(var(--border)/0.36)]">
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
