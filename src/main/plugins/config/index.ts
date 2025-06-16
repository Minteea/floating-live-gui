import { BasePlugin, PluginContext } from "floating-live";

interface StorageItem {
  get(name?: string): Promise<any> | any;
  set(name: string, value: any): Promise<void> | void;
}

interface ConfigOptions {
  /** 插件默认选项 */
  defaultOptions?: Record<string, any>;
}

/** 配置 */
export default class Config extends BasePlugin {
  static pluginName = "config";
  protected storage!: StorageItem;
  private configData!: Promise<Record<string, any>>;
  init(ctx: PluginContext, options: ConfigOptions) {
    const defaultOptions = options.defaultOptions || {};
    this.storage = ctx.call("storage.require", "config");
    this.configData = this.get();
    ctx.useHook("plugin.register", async (ctx) => {
      const { pluginName, options } = ctx;
      ctx.options = {
        ...defaultOptions[pluginName],
        ...(await this.configData)[pluginName],
        ...options,
      };
    });
    ctx.on("value:change", ({ name, value }) => {
      this.set(name, value);
    });
  }
  get(name?: string) {
    return this.storage.get(name);
  }
  set(name: string, value: any) {
    return this.storage.set(name, value);
  }
}
