import version from "./version"
import BrowserApi from "./BrowserApi";

//@ts-ignore
const ipcRenderer = window.ipcRenderer

class Api{
  on: (channel: string, listener: (e: any, ...args: any[]) => void) => void
  send: (channel: string, ...args: any[]) => void
  browserApi: BrowserApi | null = null
  constructor () {
    if(version.client == "electron") {
      this.on = (channel, listener) => ipcRenderer.on(channel, listener)
      this.send = (channel, ...args) => ipcRenderer.send(channel, ...args)
    } else {
      this.browserApi = new BrowserApi()
      this.on = (channel, listener) => this.browserApi?.on(channel, listener)
      this.send = (channel, ...args) => this.browserApi?.send(channel, ...args)
    }
  }
}

export default new Api()