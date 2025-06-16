import { BasePlugin, PluginContext } from "floating-live";

export class MessageCount extends BasePlugin {
  static pluginName = "messageCount";
  count = 0;
  init(main: PluginContext) {
    main.useHook("live.message", ({ message }) => {
      this.count++;
      message.id = `${message.id}-${this.count}`;
    });
  }
}
