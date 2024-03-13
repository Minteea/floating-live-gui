import FloatingController from "../../Controller";

export class IpcLink {
  static pluginName = "link";
  readonly ipcRenderer?: Window["ipcRenderer"];
  constructor(main: FloatingController) {
    if (/Electron/.test(navigator.userAgent)) {
      this.ipcRenderer = window.ipcRenderer;
      this.ipcRenderer.on("event", (e, eventName, ...args) => {
        console.log(["event", eventName, ...args]);
        main.emit(eventName, ...args);
      });
      this.ipcRenderer.on("snapshot", (e, snapshot) => {
        console.log(["snapshot", snapshot]);
        main.emit("snapshot", snapshot);
      });
      main.registerSender((channel, ...args) => {
        console.log(["send", channel, ...args]);
        return this.ipcRenderer!.invoke(channel, ...args);
      });
      main.send("connect");
    } else {
      main.throw({
        message: "插件初始化失败",
        reason: "插件非Electron环境",
      });
    }
  }
}
