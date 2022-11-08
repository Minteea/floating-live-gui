import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';

contextBridge.exposeInMainWorld('nodeProcess', {
  versions: JSON.parse(JSON.stringify(process.versions)),
  env: JSON.parse(JSON.stringify(process.env)),
  platform: String(process.platform),
});

contextBridge.exposeInMainWorld('electron', {
  ipcRenderer: {
    send: (channel: string, ...args: any[]) =>
      ipcRenderer.send(channel, ...args),
    on: (channel: string, func: (e: any, ...args: any[]) => void) =>
      ipcRenderer.on(channel, func),
    once: (channel: string, func: (e: any, ...args: any[]) => void) =>
      ipcRenderer.once(channel, func),
  },
});
