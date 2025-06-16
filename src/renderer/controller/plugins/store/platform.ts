import { map } from "nanostores";
import { BasePlugin, LivePlatformInfo, PluginContext } from "floating-live";
import type {} from "@floating-live/platform";

export default class StorePlatform extends BasePlugin {
  static pluginName = "storePlatform";
  readonly $platform = map<Record<string, LivePlatformInfo | undefined>>({});
  init(ctx: PluginContext) {
    ctx.on("snapshot", ({ platform }) => {
      if (platform) this.$platform.set(nameValuePair(platform));
    });
    ctx.on("platform:register", ({ name, info }) => {
      this.$platform.setKey(name, info);
    });
    ctx.on("platform:unregister", ({ name }) => {
      this.$platform.setKey(name, undefined);
    });
  }
}

export function nameValuePair<K extends string, V>(
  list: { name: K; info: V }[]
): Record<K, V> {
  const record = {} as Record<K, V>;
  list.forEach(({ name, info }) => {
    record[name] = info;
  });
  return record;
}
