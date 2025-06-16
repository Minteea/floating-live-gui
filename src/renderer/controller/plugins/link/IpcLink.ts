import type { IpcRenderer } from "electron";
import { BasePlugin, PluginContext } from "floating-live";

declare module "floating-live" {
  interface AppCommandMap {
    send: (channel: string, ...args: any[]) => any;
  }

  interface AppEventDetailMap {
    snapshot: AppSnapshotMap;
  }

  interface AppSnapshotMap {}
}

interface FLEGIpcRenderer extends IpcRenderer {
  invoke(channel: "command", ...args: any[]): Promise<[boolean, any]>;
  invoke(channel: "connect"): Promise<[boolean]>;
}

export class IpcLink extends BasePlugin {
  static pluginName = "ipcLink";
  readonly isElectron = /Electron/.test(navigator.userAgent);
  readonly ipcRenderer = this.isElectron ? window.ipcRenderer : undefined;
  init(ctx: PluginContext) {
    if (this.isElectron) {
      const ipcRenderer = this.ipcRenderer!;
      ipcRenderer.on("event", (e, eventName, detail) => {
        console.log(["event", eventName, detail]);
        ctx.emit(eventName, detail);
      });
      ipcRenderer.on("snapshot", (e, snapshot) => {
        console.log(["snapshot", snapshot]);
        ctx.emit("snapshot", snapshot);
      });

      ctx.registerCommand(
        "send",
        async (e, channel: string, ...args: any[]) => {
          console.log(["send", channel, ...args]);
          const result = await this.ipcRenderer!.invoke(
            channel as any,
            ...args
          );
          if (!result) {
            this.throw(
              new this.Error("ipc:unknown_channel", {
                message: "ipc调用失败",
                cause: "未知的channel",
              })
            );
          } else {
            const [fulfilled, value] = result;
            if (fulfilled) {
              return value;
            } else {
              if (value?._error) {
                ctx.throw(value);
              } else {
                throw value;
              }
            }
          }
        }
      );

      ctx.on("snapshot", (e) => {
        console.log("snapshot");
        console.log(e);
      });
      ctx.call("send", "connect", {
        snapshots: ["platform", "command", "value", "plugin", "room", "hook"],
      });
    } else {
      this.throw(
        new this.Error("link@ipc:non_electron", {
          message: "插件初始化失败",
          reason: "插件非Electron环境",
        })
      );
    }
  }
}
