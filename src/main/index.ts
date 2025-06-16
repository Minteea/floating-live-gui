import { app } from "electron";
import { FloatingLive } from "floating-live";
import ElectronGui from "./plugins/gui";
import Server from "./plugins/server";
import AuthSave from "./plugins/authSave";
import Config from "./plugins/config";
import RoomLoader from "./plugins/roomLoader";
import JsonStorage from "./plugins/storage";
import { Auth } from "@floating-live/plugin-auth";
import { Save } from "@floating-live/plugin-save";
import { PluginBilibili } from "@floating-live/bilibili";
import { PluginAcfun } from "@floating-live/acfun";
import { ConsoleEvent } from "@floating-live/plugin-console-event";
import path from "path";
import ElectronLoginWindow from "./plugins/webLogin/electronWebLogin";
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);

if (require("electron-squirrel-startup")) {
  app.quit();
}

declare global {
  var floatingLive: FloatingLive;
}

// 引入程序
const floatingLive = new FloatingLive();

global.floatingLive = floatingLive;

async function lifeCycle() {
  console.log("Floating Live GUI by Minteea");
  return;
}

lifeCycle()
  .then(async () => {
    // 控制台事件插件
    await floatingLive.register(ConsoleEvent);
    // 安装核心插件
    await floatingLive.register(JsonStorage, {
      path: path.resolve(app.getPath("userData"), "./AppStorage"),
    });
    await floatingLive.register(Config, {
      defaultOptions: {
        save: {
          path: "./saves",
        },
      },
    });

    await floatingLive.register(ElectronGui);

    await floatingLive.register(Auth);

    await floatingLive.register(Save);
    await floatingLive.register(Server);

    await floatingLive.register(PluginBilibili);
    await floatingLive.register(PluginAcfun);

    await floatingLive.register(ElectronLoginWindow);
    console.log("插件注册完毕");
  })
  .then(async () => {
    await floatingLive.register(AuthSave);
    await floatingLive.register(RoomLoader, { storage: true });
    // 载入房间
    console.log("房间加载完毕");
  });
// javascript
