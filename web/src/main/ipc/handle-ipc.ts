import { ipcMain } from "electron";

import type { IpcChannelMap } from "@shared/ipc";

export function handleIpc<K extends keyof IpcChannelMap>(
  channel: K,
  handler: (...args: IpcChannelMap[K]["args"]) => IpcChannelMap[K]["return"] | Promise<IpcChannelMap[K]["return"]>
): void {
  ipcMain.handle(channel, (_event, ...args) => handler(...(args as IpcChannelMap[K]["args"])));
}
