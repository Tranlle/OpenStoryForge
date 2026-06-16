export type OpenStoryForgeAppInfo = {
  name: string;
  platform: string | "browser";
  versions: {
    chrome: string;
    electron: string;
    node: string;
  };
};

export type OpenStoryForgeWindowState = {
  isFullScreen: boolean;
  isMaximized: boolean;
};

export type OpenStoryForgeDesktopApi = {
  getAppInfo: () => OpenStoryForgeAppInfo;
  shortcuts: {
    onCommand: (callback: (commandId: ShortcutCommandId) => void) => () => void;
    registerGlobalBindings: (bindings: RegisteredGlobalShortcut[]) => Promise<{
      registeredCommandIds: string[];
    }>;
  };
  windowControls: {
    close: () => Promise<void>;
    getState: () => Promise<OpenStoryForgeWindowState>;
    minimize: () => Promise<void>;
    onStateChange: (callback: (state: OpenStoryForgeWindowState) => void) => () => void;
    toggleMaximize: () => Promise<void>;
  };
};

export type ShortcutCommandId =
  | "app.gotoWelcome"
  | "app.gotoHome"
  | "app.toggleTheme"
  | "welcome.quickStart"
  | "welcome.projects"
  | "welcome.tokens"
  | "welcome.settings"
  | "home.newConversation"
  | "home.returnWelcome";

export type RegisteredGlobalShortcut = {
  accelerator: string;
  commandId: ShortcutCommandId;
};
