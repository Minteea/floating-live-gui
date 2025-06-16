import { BasePlugin, LiveMessage, PluginContext } from "floating-live";
import { atom } from "nanostores";

declare module "floating-live" {
  interface AppCommandMap {
    /** 清除消息 */
    "messages.clear": () => void;
  }
  interface AppValueMap {
    /** 设置最大消息数 */
    "messages.maxNumber": number;
  }
}

export default class StoreMessages extends BasePlugin {
  static pluginName = "storeMessages";
  maxNumber: number = 200;
  readonly $messages = atom<LiveMessage.All[]>([]);
  init(ctx: PluginContext) {
    ctx.registerValue("messages.maxNumber", {
      get: () => this.maxNumber,
      set: (n) => {
        this.maxNumber = n;
      },
    });
    ctx.registerCommand("messages.clear", () => this.clear);

    ctx.on("live:message", ({ message }) => {
      const messages = this.$messages.get();
      if (messages.length > this.maxNumber) {
        messages.splice(0, messages.length - this.maxNumber);
      }
      this.$messages.set([...messages, message]);
    });
  }
  clear() {
    this.$messages.set([]);
  }
}
