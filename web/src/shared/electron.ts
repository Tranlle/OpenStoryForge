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
  windowControls: {
    close: () => Promise<void>;
    getState: () => Promise<OpenStoryForgeWindowState>;
    minimize: () => Promise<void>;
    onStateChange: (callback: (state: OpenStoryForgeWindowState) => void) => () => void;
    toggleMaximize: () => Promise<void>;
  };
};
