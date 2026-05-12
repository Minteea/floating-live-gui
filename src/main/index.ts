import { app } from "electron";
import { FloatingLive, PluginRegisterOptions } from "floating-live";
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
import path from "node:path";
import { createRequire } from "node:module";
import PluginLoader from "./plugins/pluginLoader";
import PluginInstaller from "./plugins/pluginInstaller";

import { registerHooks as moduleRegisterHooks } from "node:module";
import { isUnderDir } from "./utils/path";
import { fileURLToPath } from "node:url";

const pluginExternalDependencies = new Set(["floating-live"]);

const cwd = process.cwd();
moduleRegisterHooks({
  resolve: (specifier, context, nextResolve) => {
    // console.log("resolve: ", " -> ", specifier);
    // console.log(context)

    const parentURL = context.parentURL;
    if (
      parentURL &&
      !isUnderDir(cwd, fileURLToPath(parentURL)) &&
      pluginExternalDependencies.has(specifier)
    ) {
      // console.log("resolve external dependency");
      context.parentURL = undefined;
    }
    return nextResolve(specifier, context);
  },
});

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

function frameworkPluginRegisterOptions({
  context,
  unremovable,
  accessApp,
}: PluginRegisterOptions = {}): PluginRegisterOptions {
  return {
    context,
    unremovable: unremovable ?? true,
    accessApp: accessApp ?? false,
    pluginType: "framework",
  };
}

function internalPluginRegisterOptions({
  context,
  unremovable,
  accessApp,
  pluginType,
}: PluginRegisterOptions = {}): PluginRegisterOptions {
  return {
    context,
    unremovable: unremovable ?? true,
    accessApp: accessApp ?? false,
    pluginType: pluginType ?? "",
  };
}

lifeCycle()
  .then(async () => {
    // 控制台事件插件
    await floatingLive.register(ConsoleEvent, frameworkPluginRegisterOptions());

    // 加载框架插件
    await floatingLive.register(
      JsonStorage,
      {
        path: path.resolve(app.getPath("userData"), "./AppStorage"),
      },
      frameworkPluginRegisterOptions()
    );

    await floatingLive.register(
      Config,
      {
        defaultOptions: {
          save: {
            path: "./saves",
          },
        },
      },
      frameworkPluginRegisterOptions()
    );

    await floatingLive.register(ElectronGui, {}, frameworkPluginRegisterOptions());

    // 其他框架插件加载完毕后，加载插件包加载器和安装器插件
    await floatingLive.register(
      PluginLoader,
      {
        storage: true,
        basePath: path.resolve(app.getPath("userData"), "./AppPlugins"),
        skipErrors: true,
      },
      frameworkPluginRegisterOptions()
    );
    await floatingLive.register(PluginInstaller, {}, frameworkPluginRegisterOptions());

    // 加载内置功能插件

    await floatingLive.register(Server, {}, internalPluginRegisterOptions());

    await floatingLive.register(Auth, {}, internalPluginRegisterOptions());

    await floatingLive.register(Save, {}, internalPluginRegisterOptions());

    // 加载内置平台插件
    // 测试插件包管理功能时，可禁用其中一个或多个插件，并安装通过Minteea/floating-live-plugins仓库编译后的插件包进行测试
    await floatingLive.register(PluginBilibili);
    await floatingLive.register(PluginAcfun);

    console.log("插件注册完毕");
  })
  .then(async () => {
    await floatingLive.register(AuthSave, {}, internalPluginRegisterOptions());

    await floatingLive.call("auth.read", "bilibili");

    await floatingLive.register(
      RoomLoader,
      { storage: true, allowInvalidRoom: true },
      frameworkPluginRegisterOptions()
    );
    // 载入房间
    console.log("房间加载完毕");
  });
