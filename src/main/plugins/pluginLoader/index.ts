import { BasePlugin, PluginConstructor, PluginContext, PluginItem } from "floating-live";
import { createRequire } from "node:module";
import path from "node:path";
import { pathToFileURL } from "node:url";

declare module "floating-live" {
  interface AppCommandMap {
    "storage.require": (name: string) => {
      get(name?: string): Promise<any> | any;
      set(name: string, value: any): Promise<void> | void;
    };
  }
  interface AppCommandMap {
    "pluginLoader.register": (
      item: PluginLoaderItem | PluginLoaderEntriesItem
    ) => Promise<PluginLoaderItem>;
    "pluginLoader.unregister": (pluginName: string) => Promise<void>;
    "pluginLoader.load": (pluginName: string) => Promise<void>;
    "pluginLoader.unload": (pluginName: string) => Promise<void>;
    "pluginLoader.snapshot": () => PluginLoaderItem[];
  }
  interface AppEventDetailMap {
    "pluginLoader:register": {
      pluginName: string;
      info: PluginInfo;
      path: string;
      open: boolean;
      available: boolean;
    };
    "pluginLoader:unregister": { pluginName: string };
    "pluginLoader:load": { pluginName: string };
    "pluginLoader:unload": { pluginName: string };
  }
  interface AppValueMap {
    "pluginLoader.basePath": string;
  }
  interface AppSnapshotMap {
    pluginLoader: PluginLoaderItem[];
  }
}

export interface PluginInfo {
  name: string;
  description?: string;
  version?: string;
  author?: string;
  repository?: string;
  main: string;
}

interface StorageItem {
  get(name?: string): Promise<any> | any;
  set(name: string, value: any): Promise<void> | void;
}

interface PluginLoaderOptions {
  list?: (PluginLoaderEntriesItem | string)[];
  /** 使用存储 */
  storage?: boolean;
  /** 是否开启所有插件
   * @description
   * 若为true，则开启所有未单独设置为开启的插件；若为false，则不开启任何插件，包括被单独设置开启的插件
   */
  open?: boolean;
  basePath?: string;
  skipErrors?: boolean;
  /** 是否扫描basePath目录下的插件，默认为false */
  // scanDir?: boolean;
  /** 自动加载basePath目录下的所有插件，默认为false，需设置scanDir为true */
  // loadAllInDir?: boolean;
}

export interface PluginLoaderItem {
  pluginName: string;
  info: PluginInfo;
  path: string;
  open?: boolean;
  available?: boolean;
  // 插件构造函数，将在插件首次启用时保存
  pluginConstructor?: PluginConstructor<PluginItem>;
}

export interface PluginLoaderEntriesItem {
  pluginName?: string;
  info?: PluginInfo;
  path: string;
  open?: boolean;
  available?: boolean;
}

/** 插件包加载器
 * @description
 * **框架插件**，通过加载器加载插件包，提供注册、卸载、开启、关闭等功能。在启用storage的情况下可持久化存取插件数据。
 *
 * 插件安装类型：
 * - 内部插件：不通过加载器加载的插件，内部插件无法通过加载器卸载，只能通过floating-live的指令进行卸载。
 * - 加载器插件：通过加载器加载的插件，加载器插件可以被卸载。
 * - 目录内已注册插件：位于basePath目录下并通过加载器注册的插件。
 * - 目录内未注册插件：位于basePath目录下但未通过加载器注册的插件。
 * - 外置插件：不在basePath目录下的插件。
 */
export default class PluginLoader extends BasePlugin {
  static pluginName = "pluginLoader";
  protected storage?: StorageItem;

  #basePath!: string;

  get basePath() {
    return this.#basePath;
  }

  list: Map<string, PluginLoaderItem> = new Map();

  async init(ctx: PluginContext, options: PluginLoaderOptions) {
    this.#basePath = path.resolve(options.basePath || ".");

    ctx.registerCommand(
      "pluginLoader.register",
      (commandContext, item: PluginLoaderItem | PluginLoaderEntriesItem) => {
        return this.register(item);
      }
    );
    ctx.registerCommand("pluginLoader.unregister", (commandContext, pluginName: string) => {
      return this.unregister(pluginName);
    });
    ctx.registerCommand("pluginLoader.load", (commandContext, pluginName: string) => {
      return this.load(pluginName);
    });
    ctx.registerCommand("pluginLoader.unload", (commandContext, pluginName: string) => {
      return this.unload(pluginName);
    });
    ctx.registerCommand("pluginLoader.snapshot", (commandContext) => {
      return this.toSnapshot();
    });
    ctx.registerValue("pluginLoader.basePath", {
      get: () => this.#basePath,
    });

    if (options.storage) this.storage = ctx.call("storage.require", "plugins");
    const open = options.open;

    const optionsList: PluginLoaderEntriesItem[] =
      options?.list?.map((item) => {
        if (typeof item === "string") {
          return { path: item, open: open };
        }
        return { ...item, open: item.open ?? open };
      }) || [];

    // 从storage中加载的列表，在未单独指定开启的情况下不会开启，不受开启所有房间选项的影响
    const storageList: PluginLoaderItem[] =
      (await this.storage?.get("list").catch(() => {
        this.storage!.set("list", []);
      })) || [];

    // 先加载options中的插件
    for (const item of optionsList) {
      try {
        await this.register(item);
      } catch (err) {
        if (options.skipErrors) {
          console.error(`加载插件${item.pluginName}失败`, err);
        }
      }
    }

    // 再加载storage中的插件
    for (const item of storageList) {
      try {
        await this.register(item);
      } catch (err) {
        if (!options.skipErrors) {
          console.error(`加载插件${item.pluginName}失败`, err);
        }
      }
    }

    // 监听事件，更新数据库
    if (options.storage) {
      ctx.on("pluginLoader:register", async ({ pluginName, info, path }) => {
        const list: PluginLoaderItem[] = await this.storage!.get("list");
        if (!list.find((i) => i.pluginName === pluginName)) {
          list.push({ pluginName, info, path });
          await this.storage!.set("list", list);
        }
      });

      ctx.on("pluginLoader:unregister", async ({ pluginName }) => {
        const list: PluginLoaderItem[] = await this.storage!.get("list");
        const index = list.findIndex((i) => i.pluginName === pluginName);
        if (index !== -1) {
          list.splice(index, 1);
          await this.storage!.set("list", list);
        }
      });

      ctx.on("pluginLoader:load", async ({ pluginName }) => {
        const list: PluginLoaderItem[] = await this.storage!.get("list");
        const item = list.find((i) => i.pluginName === pluginName);
        if (item) {
          item.open = true;
          await this.storage!.set("list", list);
        }
      });

      ctx.on("pluginLoader:unload", async ({ pluginName }) => {
        const list: PluginLoaderItem[] = await this.storage!.get("list");
        const item = list.find((i) => i.pluginName === pluginName);
        if (item) {
          item.open = false;
          await this.storage!.set("list", list);
        }
      });
    }

    // 如自行通过指令安装/卸载插件，则更新PluginLoader中相应插件的启用/停用状态
    ctx.on("plugin:register", async ({ pluginName }) => {
      if (this.list.has(pluginName)) {
        const item = this.list.get(pluginName)!;
        item.open = true;
        this.ctx.emit("pluginLoader:load", { pluginName });
      }
    });

    ctx.on("plugin:unregister", async ({ pluginName }) => {
      if (this.list.has(pluginName)) {
        const item = this.list.get(pluginName)!;
        item.open = false;
        this.ctx.emit("pluginLoader:unload", { pluginName });
      }
    });
  }

  async register(item: PluginLoaderItem | PluginLoaderEntriesItem): Promise<PluginLoaderItem> {
    const pluginJsonPath = path.resolve(this.basePath, item.path, "plugin.json");

    const pluginInfo: PluginInfo = await importJson(pluginJsonPath);

    const pluginName = pluginInfo?.name;
    if (!pluginName) throw new Error(`插件${item.path}的plugin.json缺少name字段`);
    if (this.list.has(pluginName)) {
      throw new Error(`插件${pluginName}已经安装`);
    } else if (this.ctx.hasPlugin(pluginName)) {
      throw new Error(`插件${pluginName}已经被注册为内部插件`);
    }

    const pluginLoaderItem: PluginLoaderItem = { ...item, pluginName, info: pluginInfo };

    this.list.set(pluginName, pluginLoaderItem);
    if (item.open) {
      await this.load(pluginName);
    }

    this.ctx.emit("pluginLoader:register", {
      pluginName,
      info: pluginInfo,
      path: pluginLoaderItem.path,
      open: pluginLoaderItem.open ?? false,
      available: pluginLoaderItem.available ?? true,
    });

    return pluginLoaderItem;
  }

  async unregister(pluginName: string) {
    if (!this.list.has(pluginName)) {
      if (this.ctx.hasPlugin(pluginName)) {
        throw new Error(`插件${pluginName}属于内部插件，无法卸载`);
      } else {
        throw new Error(`插件${pluginName}不存在`);
      }
    }
    if (this.ctx.hasPlugin(pluginName)) {
      await this.unload(pluginName);
    }

    this.list.delete(pluginName);

    this.ctx.emit("pluginLoader:unregister", { pluginName });
  }

  async load(pluginName: string) {
    if (!this.list.has(pluginName)) {
      throw new Error(`插件${pluginName}不存在`);
    }
    if (this.ctx.hasPlugin(pluginName)) {
      throw new Error(`插件${pluginName}已经启用`);
    }
    const item = this.list.get(pluginName)!;
    if (item.available == false) {
      throw new Error(`插件${pluginName}不可用`);
    }

    const pluginMainPath = path.resolve(this.#basePath, item.path, item.info.main);

    const pluginConstructor: PluginConstructor<PluginItem> =
      item.pluginConstructor ||
      (await import(pathToFileURL(pluginMainPath).toString()).then((m) => m.default));

    if (!pluginConstructor) throw new Error(`插件${pluginName}的入口文件未正确导出插件构造函数`);
    if (!pluginConstructor.pluginName)
      throw new Error(`插件${pluginName}的构造函数缺少pluginName字段`);
    if (pluginConstructor.pluginName !== pluginName)
      throw new Error(
        `插件${pluginName}的构造函数的pluginName字段(${pluginConstructor?.pluginName})与plugin.json中的name字段不匹配`
      );

    await this.ctx.register(pluginConstructor);
    item.open = true;
    this.ctx.emit("pluginLoader:load", { pluginName });
  }
  async unload(pluginName: string) {
    if (!this.list.has(pluginName)) {
      throw new Error(`插件${pluginName}不存在`);
    }
    if (!this.ctx.hasPlugin(pluginName)) {
      throw new Error(`插件${pluginName}未启用`);
    }

    await this.ctx.unregister(pluginName);
    const item = this.list.get(pluginName)!;
    item.open = false;
    this.ctx.emit("pluginLoader:unload", { pluginName });
  }

  toSnapshot(): PluginLoaderItem[] {
    return structuredClone([...this.list.values()]);
  }
}

const require = createRequire(import.meta.url);
function importJson(path: string): Promise<any> {
  return require(path);
  // return import(pathToFileURL(path).toString(), { with: { type: "json" } }).then((m) => m.default);
}
