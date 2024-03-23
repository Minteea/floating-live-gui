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
      main.registerSender(async (channel, ...args) => {
        console.log(["send", channel, ...args]);
        const result = await this.ipcRenderer!.invoke(channel, ...args);
        if (!result) {
          main.throw({
            message: "ipc调用失败",
            reason: "未知的channel",
            id: "ipc:unknown_channel",
          });
        } else {
          const [fulfilled, value] = result as [number, any];
          if (fulfilled) {
            return value;
          } else {
            if (value?._error) {
              main.throw(value);
            } else {
              throw value;
            }
          }
        }
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
