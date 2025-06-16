import { AppValueMap, BasePlugin, PluginContext } from "floating-live";
import { WritableAtom, computed, map } from "nanostores";

export default class StoreValues extends BasePlugin {
  static pluginName = "storeValues";
  readonly $localValues = map<Partial<AppValueMap>>({});
  readonly $remoteValues = map<Partial<AppValueMap>>({});
  readonly $values = computed(
    [this.$localValues, this.$remoteValues],
    (localValues, remoteValues) => ({ ...remoteValues, ...localValues })
  );

  init() {
    this.$localValues.set(nameValuePair(this.ctx.call("value.snapshot")));
    this.ctx.on("snapshot", ({ value }) => {
      this.$remoteValues.set(nameValuePair(value));
    });
    this.ctx.on("value:change", async ({ name, value, remote }) => {
      (remote ? this.$remoteValues : this.$localValues).setKey(
        name as any,
        value
      );
    });
    this.ctx.on("value:register", async ({ name, value, remote }) => {
      (remote ? this.$remoteValues : this.$localValues).setKey(
        name as any,
        value
      );
    });
    this.ctx.on("value:unregister", async ({ name, remote }) => {
      (remote ? this.$remoteValues : this.$localValues).setKey(
        name as any,
        undefined
      );
    });
  }
}
export function nameValuePair<K extends string, V>(
  list: { name: K; value: V }[]
): Record<K, V> {
  const record = {} as Record<K, V>;
  list.forEach(({ name, value }) => {
    record[name] = value;
  });
  return record;
}
