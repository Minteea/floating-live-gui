import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("process", {
  versions: JSON.parse(JSON.stringify(process.versions)),
  env: JSON.parse(JSON.stringify(process.env)),
  platform: String(process.platform),
});

contextBridge.exposeInMainWorld("ipcRenderer", {
  invoke: (channel: string, ...args: any[]) =>
    ipcRenderer.invoke(channel, ...args),
  on: (channel: string, func: (e: any, ...args: any[]) => void) =>
    ipcRenderer.on(channel, func),
  once: (channel: string, func: (e: any, ...args: any[]) => void) =>
    ipcRenderer.once(channel, func),
});
