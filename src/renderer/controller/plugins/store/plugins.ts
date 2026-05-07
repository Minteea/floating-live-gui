import { AppValueMap, BasePlugin, PluginContext } from "floating-live";
import { MapStore, WritableAtom, atom, computed, map } from "nanostores";
import type { PluginLoaderItem } from "../../../../main/plugins/pluginLoader";

export default class StorePlugins extends BasePlugin {
  static pluginName = "storePlugins";
  readonly $plugins = atom<{ pluginName: string }[]>([]);
  readonly $installedPlugins = atom<MapStore<PluginLoaderItem>[]>([]);

  readonly $loaderPluginNames = computed([this.$installedPlugins], (plugins) => {
    return new Set(plugins.map((p) => p.get().pluginName));
  });

  readonly $internalPlugins = computed(
    [this.$plugins, this.$loaderPluginNames],
    (plugins, loaderPluginNames) => (plugins.filter((p) => !loaderPluginNames.has(p.pluginName)))
  );

  readonly $currentPlugin = atom<string>("");
  readonly $currentPluginInfo = computed([this.$currentPlugin, this.$installedPlugins], (currentPlugin, plugins) => {
    return plugins.find((p) => p.get().pluginName === currentPlugin) || null;
  });


  init() {
    this.ctx.on("snapshot", ({ plugin, pluginLoader }) => {
      if (plugin) this.$plugins.set(plugin);
      if (pluginLoader) this.$installedPlugins.set(pluginLoader.map((p) => map(p)));
    });
    this.ctx.on("plugin:register", async ({ pluginName }) => {
      const list = [...this.$plugins.get(), { pluginName }];
      this.$plugins.set(list);
    });
    this.ctx.on("plugin:unregister", async ({ pluginName }) => {
      const list = this.$plugins.get().filter((p) => p.pluginName !== pluginName);
      this.$plugins.set(list);
    });
    this.ctx.on("pluginLoader:register", async ({ pluginName, info, path, open, available }) => {
      const list = [...this.$installedPlugins.get(), map({ pluginName, info, path, open, available })];
      this.$installedPlugins.set(list);
    });
    this.ctx.on("pluginLoader:unregister", async ({ pluginName }) => {
      const list = this.$installedPlugins.get().filter((p) => p.get().pluginName !== pluginName);
      this.$installedPlugins.set(list);
    });
    this.ctx.on("pluginLoader:load", async ({ pluginName }) => {
      const plugin = this.$installedPlugins.get().find((p) => p.get().pluginName === pluginName);
      if (plugin) {
        plugin.setKey("open", true);
        this.$installedPlugins.set([...this.$installedPlugins.get()]);
      }
    });
    this.ctx.on("pluginLoader:unload", async ({ pluginName }) => {
      const plugin = this.$installedPlugins.get().find((p) => p.get().pluginName === pluginName);
      if (plugin) {
        plugin.setKey("open", false);
        this.$installedPlugins.set([...this.$installedPlugins.get()]);
      }
    });
  }
}