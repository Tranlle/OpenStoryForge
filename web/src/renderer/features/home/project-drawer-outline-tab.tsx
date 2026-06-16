import { useI18n } from "@renderer/i18n/use-i18n";
import { outlineItems } from "@renderer/features/home/home.data";

export function ProjectDrawerOutlineTab(): JSX.Element {
  const { t } = useI18n();

  return (
    <div className="space-y-3">
      {outlineItems.map((item, index) => (
        <article
          className="rounded-[1.25rem] bg-background/24 p-4 shadow-[inset_0_0_0_1px_hsl(var(--border)/0.36)]"
          key={item}
        >
          <div className="text-xs font-bold text-muted">{t("home.outlineLabel", { index: index + 1 })}</div>
          <div className="mt-2 font-display text-lg font-black">{item}</div>
          <div className="mt-3 h-1.5 rounded-full bg-border">
            <div className="h-full rounded-full bg-accent" style={{ width: `${32 + index * 14}%` }} />
          </div>
        </article>
      ))}
    </div>
  );
}
