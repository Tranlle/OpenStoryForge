import { useQuery } from "@tanstack/react-query";
import { Maximize2, Minus, PanelTop, X } from "lucide-react";
import { useEffect, useState } from "react";

import { useI18n } from "@renderer/i18n/use-i18n";
import { ThemeSwitcher, type ThemeId } from "@renderer/components/primitives/theme-switcher";
import { cn } from "@renderer/lib/utils";
import type { OpenStoryForgeWindowState } from "@shared/electron";

type RuntimeInfo = ReturnType<NonNullable<Window["openStoryForge"]>["getAppInfo"]>;

const browserRuntime: RuntimeInfo = {
  name: "OpenStoryForge",
  platform: "browser",
  versions: {
    chrome: "browser",
    electron: "browser",
    node: "browser"
  }
};

type WindowTitleBarProps = {
  theme: ThemeId;
  onThemeChange: (theme: ThemeId) => void;
};

export function WindowTitleBar({ onThemeChange, theme }: WindowTitleBarProps): JSX.Element {
  const { t } = useI18n();
  const bridge = window.openStoryForge;
  const [windowState, setWindowState] = useState<OpenStoryForgeWindowState>({
    isFullScreen: false,
    isMaximized: false
  });
  const { data: appInfo = browserRuntime } = useQuery({
    queryKey: ["desktop-app-info"],
    queryFn: async () => bridge?.getAppInfo() ?? browserRuntime,
    staleTime: Number.POSITIVE_INFINITY
  });
  const isMac = appInfo.platform === "darwin";
  const hasWindowControls = Boolean(bridge?.windowControls);

  useEffect(() => {
    if (!bridge?.windowControls) {
      return undefined;
    }

    let isMounted = true;

    void bridge.windowControls.getState().then((state) => {
      if (isMounted) {
        setWindowState(state);
      }
    });

    const removeListener = bridge.windowControls.onStateChange(setWindowState);

    return () => {
      isMounted = false;
      removeListener();
    };
  }, [bridge]);

  const handleToggleMaximize = (): void => {
    void bridge?.windowControls?.toggleMaximize();
  };

  const handleMinimize = (): void => {
    void bridge?.windowControls?.minimize();
  };

  const handleClose = (): void => {
    void bridge?.windowControls?.close();
  };

  return (
    <header
      className={cn(
        "window-drag relative z-50 flex h-12 select-none items-center border-b border-border/60 bg-surface/72 px-3 text-foreground shadow-[0_1px_0_hsl(var(--foreground)/0.04)] backdrop-blur-2xl",
        isMac ? "justify-center" : "justify-between"
      )}
    >
      {isMac && hasWindowControls ? (
        <div className="window-no-drag absolute left-3 top-0 flex h-12 items-center gap-2">
          <button
            aria-label={t("shell.closeWindow")}
            className="h-3.5 w-3.5 rounded-full border border-black/10 bg-[#ff5f57] shadow-inner transition hover:brightness-95"
            onClick={handleClose}
            type="button"
          />
          <button
            aria-label={t("shell.minimizeWindow")}
            className="h-3.5 w-3.5 rounded-full border border-black/10 bg-[#febc2e] shadow-inner transition hover:brightness-95"
            onClick={handleMinimize}
            type="button"
          />
          <button
            aria-label={windowState.isMaximized ? t("shell.restoreWindow") : t("shell.maximizeWindow")}
            className="h-3.5 w-3.5 rounded-full border border-black/10 bg-[#28c840] shadow-inner transition hover:brightness-95"
            onClick={handleToggleMaximize}
            type="button"
          />
        </div>
      ) : null}

      <div className={cn("flex min-w-0 items-center gap-3", isMac ? "justify-center" : "pl-1")}>
        <div className="grid h-7 w-7 shrink-0 place-items-center rounded-xl border border-border/80 bg-accent/14 text-accent shadow-panel">
          <PanelTop aria-hidden="true" className="h-3.5 w-3.5" />
        </div>
        <div className="min-w-0">
          <div className="truncate font-display text-[13px] font-black leading-4 tracking-normal">OpenStoryForge</div>
          <div className="truncate text-[11px] font-medium leading-4 text-muted">
            {(appInfo.platform === "browser" ? t("common.browser") : t(`shell.platform.${appInfo.platform}`))} {t("common.previewBackendOffline")}
          </div>
        </div>
      </div>

      {!isMac && hasWindowControls ? (
        <div className="window-no-drag flex h-12 items-center gap-2">
          <ThemeSwitcher value={theme} onChange={onThemeChange} />
          <button
            aria-label={t("shell.minimizeWindow")}
            className="grid h-9 w-11 place-items-center rounded-xl text-muted transition hover:bg-surface-strong/80 hover:text-foreground"
            onClick={handleMinimize}
            type="button"
          >
            <Minus aria-hidden="true" className="h-4 w-4" />
          </button>
          <button
            aria-label={windowState.isMaximized ? t("shell.restoreWindow") : t("shell.maximizeWindow")}
            className="grid h-9 w-11 place-items-center rounded-xl text-muted transition hover:bg-surface-strong/80 hover:text-foreground"
            onClick={handleToggleMaximize}
            type="button"
          >
            <Maximize2 aria-hidden="true" className="h-3.5 w-3.5" />
          </button>
          <button
            aria-label={t("shell.closeWindow")}
            className="grid h-9 w-11 place-items-center rounded-xl text-muted transition hover:bg-red-500 hover:text-white"
            onClick={handleClose}
            type="button"
          >
            <X aria-hidden="true" className="h-4 w-4" />
          </button>
        </div>
      ) : hasWindowControls ? (
        <div className="window-no-drag absolute right-4 flex items-center gap-3">
          <ThemeSwitcher value={theme} onChange={onThemeChange} />
          <span className="text-[11px] font-semibold text-muted">
            {windowState.isFullScreen ? t("shell.fullScreen") : t("shell.windowed")}
          </span>
        </div>
      ) : (
        <div className="window-no-drag flex items-center gap-3">
          <ThemeSwitcher value={theme} onChange={onThemeChange} />
        </div>
      )}
    </header>
  );
}
