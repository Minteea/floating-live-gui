import { FloatingLive } from "floating-live";

interface StorageItem {
  get(name?: string): Promise<any> | any;
  set(name: string, value: any): Promise<void> | void;
}

interface ConfigOptions {
  /** 插件默认选项 */
  defaultOptions?: Record<string, any>;
}

/** 配置 */
export default class Config {
  static pluginName = "config";
  protected readonly storage: StorageItem;
  private configData: Promise<Record<string, any>>;
  constructor(main: FloatingLive, options: ConfigOptions) {
    const defaultOptions = options.defaultOptions || {};
    this.storage = main.call("storage.require", "config");
    this.configData = this.get();
    main.hook.register("plugin.register", async (ctx) => {
      const { name, options } = ctx;
      ctx.options = {
        ...defaultOptions[name],
        ...(await this.configData)[name],
        ...options,
      };
    });
    main.on("value:change", (name, value) => {
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
