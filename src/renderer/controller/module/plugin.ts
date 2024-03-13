import FloatingController from "../Controller";
import { ControllerPluginConstructor, ControllerPluginItem } from "../types";

export class ModPlugin {
  /** 插件列表 */
  private list = new Map<string, ControllerPluginItem>();
  protected readonly main: FloatingController;

  constructor(main: FloatingController) {
    this.main = main;
  }
  /** 注册插件 */
  async register<P extends ControllerPluginItem>(
    pluginFunc: ControllerPluginConstructor<P>,
    options: Record<string, any> = {}
  ) {
    const name = pluginFunc.pluginName;
    if (!name) {
      this.main.throw({
        message: "缺少插件id",
        id: "plugin:register_id_missing",
      });
    }
    if (this.list.has(name)) {
      this.main.throw({
        message: "已存在相同id的插件",
        id: "plugin:register_id_duplicate",
      });
    }
    // 执行插件函数
    const plugin = new pluginFunc(this.main, options);
    this.list.set(name, plugin);
    // 调用插件的register钩子
    await plugin.register?.(this.main, options);
    this.main.emit("plugin:add", name);
    return plugin;
  }
  /** 以同步方式注册插件 */
  registerSync<P extends ControllerPluginItem>(
    pluginFunc: ControllerPluginConstructor<P>,
    options: Record<string, any> = {}
  ) {
    const name = pluginFunc.pluginName;
    if (!name) {
      this.main.throw({
        message: "缺少插件id",
        id: "plugin:register_id_missing",
      });
    }
    if (this.list.has(name)) {
      this.main.throw({
        message: "已存在相同id的插件",
        id: "plugin:register_id_duplicate",
      });
    }
    // 执行插件函数
    const plugin = new pluginFunc(this.main, options);
    this.list.set(name, plugin);
    // 调用插件的register钩子
    plugin.register?.(this.main, options);
    this.main.emit("plugin:add", name);
    return plugin;
  }
  /** 移除插件 */
  async unregister(name: string) {
    const plugin = this.list.get(name);
    // 检测插件是否存在
    if (!plugin) {
      this.main.throw({
        message: "插件不存在",
        id: "plugin:unregister_unexist",
      });
    } else {
      // 调用该插件的destroy钩子
      await plugin.destroy?.();
      // 从列表中移除插件
      this.list.delete(name);
      // 移除插件注册
      this.main.emit("plugin:remove", name);
    }
  }
  /** 获取插件实例 */
  get(name: string) {
    return this.list.get(name);
  }
  getSnapshot() {
    return [...this.list.keys()];
  }
}
