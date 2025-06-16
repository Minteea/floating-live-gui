import { BasePlugin, PluginContext } from "floating-live";
import { ReadableAtom, WritableAtom, atom, computed, map } from "nanostores";

export default class StoreCommands extends BasePlugin {
  static pluginName = "storeCommands";
  readonly $commands: ReadableAtom<{ name: string }[]>;
  readonly $remoteCommands = atom<{ name: string }[]>([]);
  readonly $localCommands = atom<{ name: string }[]>([]);

  readonly $commandNames: ReadableAtom<string[]>;

  constructor(ctx: PluginContext, options: any) {
    super(ctx, options);
    this.$commands = computed(
      [this.$localCommands, this.$remoteCommands],
      (localCommands, remoteCommands) => [...localCommands, ...remoteCommands]
    );
    this.$commandNames = computed([this.$commands], (commands) =>
      commands.map(({ name }) => name)
    );
  }
  init(ctx: PluginContext) {
    this.$localCommands.set(this.ctx.call("command.snapshot"));
    this.ctx.on("snapshot", (snapshot) => {
      this.$remoteCommands.set([...snapshot.command]);
    });
    this.ctx.on("command:register", ({ name, remote }) => {
      if (!remote) {
        this.$localCommands.set([...this.$localCommands.get(), { name }]);
      } else {
        this.$remoteCommands.set([...this.$remoteCommands.get(), { name }]);
      }
    });
    this.ctx.on("command:unregister", ({ name, remote }) => {
      const $storeCommands = remote
        ? this.$remoteCommands
        : this.$localCommands;
      const list = [...$storeCommands.get()];
      const index = list.findIndex((n) => n.name == name);
      if (index > -1) {
        list.splice(index, 1);
        $storeCommands.set(list);
      }
    });
  }
}
