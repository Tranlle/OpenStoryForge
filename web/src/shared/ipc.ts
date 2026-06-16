import type { RegisteredGlobalShortcut } from "./electron";

export type WindowState = {
  isFullScreen: boolean;
  isMaximized: boolean;
};

export type IpcChannelMap = {
  "shortcuts:register-global-bindings": {
    args: [RegisteredGlobalShortcut[]];
    return: {
      registeredCommandIds: string[];
    };
  };
  "window:close": {
    args: [];
    return: void;
  };
  "window:get-state": {
    args: [];
    return: WindowState;
  };
  "window:minimize": {
    args: [];
    return: void;
  };
  "window:toggle-maximize": {
    args: [];
    return: void;
  };
};
