import { ipcMain, webContents } from "electron";
import { EventEmitter } from "stream";
import { UniSender } from "../types/UniLink";

class IpcUniSender implements UniSender {
  origin: Electron.IpcMainEvent;
  type = "ipc"
  constructor(ipc: Electron.IpcMainEvent) {
    this.origin = ipc
  }
  send(channel: string, ...args: any[]) {
    this.origin.sender.send(channel, ...args)
  };
}

class IpcLink {
  event = new EventEmitter()
  constructor() {
  }
  on(channel: string, func: (e: UniSender, ...args: any[]) => void) {
    ipcMain.on(channel, (e, ...args) => {
      func(new IpcUniSender(e), ...args)
    })
  }
  send(channel: string, ...args: any[]) {
    webContents.getAllWebContents().forEach((e) => {
      e.send(channel, ...args);
    });
  }
}

export default IpcLink