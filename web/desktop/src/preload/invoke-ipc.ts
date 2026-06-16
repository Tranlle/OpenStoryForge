import { ipcRenderer } from "electron";

import type { IpcChannelMap } from "@shared/ipc";

export function invokeIpc<K extends keyof IpcChannelMap>(
  channel: K,
  ...args: IpcChannelMap[K]["args"]
): Promise<IpcChannelMap[K]["return"]> {
  return ipcRenderer.invoke(channel, ...args);
}
