import { BookOpenText } from "lucide-react";

import { chapterItems } from "@renderer/features/home/home.data";

export function ProjectDrawerChaptersTab(): JSX.Element {
  return (
    <div className="space-y-3">
      {chapterItems.map((chapter) => (
        <article
          className="flex gap-3 rounded-[1.25rem] bg-background/24 p-4 shadow-[inset_0_0_0_1px_hsl(var(--border)/0.36)]"
          key={chapter.title}
        >
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
