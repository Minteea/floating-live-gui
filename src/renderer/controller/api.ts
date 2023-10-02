import version from "./version";
import BrowserApi from "./BrowserApi";

const ipcRenderer = window.ipcRenderer;

class Api {
  on: (channel: string, listener: (...args: any[]) => void) => void;

  send: (channel: string, ...args: any[]) => any;

  browserApi: BrowserApi | null = null;

  constructor() {
    if (version.client == "electron") {
      this.on = (channel, listener) =>
        ipcRenderer.on(channel, (e, ...args) => {
          listener(...args);
          console.log(`event: ${channel} ${args.join(" ")}`);
        });
      this.send = (channel, ...args) => ipcRenderer.invoke(channel, ...args);
    } else {
      this.browserApi = new BrowserApi();
      this.on = (channel, listener) =>
        this.browserApi?.on(channel, (...args) => {
          listener(...args);
          console.log(`event: ${channel} ${args.join(" ")}`);
        });
      this.send = (channel, ...args) => this.browserApi?.send(channel, ...args);
    }
  }
}

export default new Api();
