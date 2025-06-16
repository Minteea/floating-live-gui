import { contextBridge, ipcRenderer } from "electron";

declare const GUI_VERSION: string;
declare const FLOATING_VERSION: string;

contextBridge.exposeInMainWorld("process", {
  versions: JSON.parse(JSON.stringify(process.versions)),
  env: JSON.parse(JSON.stringify(process.env)),
  platform: String(process.platform),
});

contextBridge.exposeInMainWorld("version", {
  gui: GUI_VERSION,
  floating: FLOATING_VERSION,
});

contextBridge.exposeInMainWorld("ipcRenderer", {
  invoke: (channel: string, ...args: any[]) =>
    ipcRenderer.invoke(channel, ...args),
  send: (channel: string, ...args: any[]) => ipcRenderer.send(channel, ...args),
  on: (channel: string, func: (e: any, ...args: any[]) => void) =>
    ipcRenderer.on(channel, func),
  once: (channel: string, func: (e: any, ...args: any[]) => void) =>
    ipcRenderer.once(channel, func),
});
