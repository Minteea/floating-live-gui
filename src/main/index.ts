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
// import { PluginAcfun } from "@floating-live/acfun";
import { ConsoleEvent } from "@floating-live/plugin-console-event";
import path from "path";
import { createRequire } from "node:module";
import PluginLoader from "./plugins/pluginLoader";
import PluginInstaller from "./plugins/pluginInstaller";

import { registerHooks as moduleRegisterHooks } from "node:module"
import { isUnderDir } from "./utils/path";
import { fileURLToPath } from "node:url";


const pluginExternalDependencies = new Set(["floating-live"])

const cwd = process.cwd();
moduleRegisterHooks({
  resolve: (specifier, context, nextResolve) => {
    console.log("resolve: ", " -> ", specifier);
    console.log(context)

    let parentURL = context.parentURL;
    if (parentURL && !isUnderDir(cwd, fileURLToPath(parentURL)) && pluginExternalDependencies.has(specifier)) {

      console.log("resolve external dependency");
      context.parentURL = undefined;
    }
    return nextResolve(specifier, context);
  }
});


const require = createRequire(import.meta.url);

const b = import("floating-live").then((mod) => {
  console.log("import: ", mod);
}).catch((err) => {
  console.error("import error: ", err);
});

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
    // 加载框架插件
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

    await floatingLive.register(Server);

    await floatingLive.register(Auth);

    await floatingLive.register(Save);

    // 其他框架插件加载完毕后，加载插件包加载器和安装器插件
    await floatingLive.register(PluginLoader, { storage: true, basePath: path.resolve(app.getPath("userData"), "./AppPlugins") });
    await floatingLive.register(PluginInstaller);

    // 加载内置平台插件
    await floatingLive.register(PluginBilibili);
    // await floatingLive.register(PluginAcfun);

    console.log("插件注册完毕");
  })
  .then(async () => {
    await floatingLive.register(AuthSave);

    await floatingLive.call("auth.read", "bilibili");

    await floatingLive.register(RoomLoader, { storage: true });
    // 载入房间
    console.log("房间加载完毕");
  });
// javascript
