import { app } from "electron";
import { FloatingLive } from "floating-live";
import ElectronGui from "./plugins/gui";
import Server from "./plugins/server";
import BilibiliAvatar from "./plugins/bilibiliAvatar";
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

if (require("electron-squirrel-startup")) {
  app.quit();
}

declare global {
  var floating: FloatingLive;
}

// 引入程序
const floating = new FloatingLive();

global.floating = floating;

async function lifeCycle() {
  console.log("Floating Live GUI by Minteea");
  return;
}

lifeCycle()
  .then(async () => {
    // 安装核心插件
    await floating.plugin.register(JsonStorage, {
      path: path.resolve(app.getPath("userData"), "./AppStorage"),
    });
    await floating.plugin.register(Config, {
      defaultOptions: {
        save: {
          path: "./saves",
        },
      },
    });

    await floating.plugin.register(ElectronGui);

    await floating.plugin.register(ConsoleEvent);
    await floating.plugin.register(Auth);

    await floating.plugin.register(Save);
    await floating.plugin.register(Server);

    await floating.plugin.register(PluginBilibili);
    await floating.plugin.register(PluginAcfun);

    await floating.plugin.register(BilibiliAvatar);

    console.log("插件注册完毕");
  })
  .then(async () => {
    await floating.plugin.register(AuthSave);
    await floating.plugin.register(RoomLoader, { storage: true });
    // 载入房间
    console.log("房间加载完毕");
  });
// javascript
