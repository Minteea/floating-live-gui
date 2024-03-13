import { FloatingValueMap, RoomInfo } from "floating-live";
import { ReadableAtom, WritableAtom, computed, map } from "nanostores";
import FloatingController from "../../Controller";
import { ControllerValueMap } from "../../types";

export default class StoreCommands {
  static pluginName = "commands";
  readonly main: FloatingController;
  readonly $commands: ReadableAtom<string[]>;
  readonly $floatingCommands = map<string[]>([]);
  readonly $controllerCommands = map<string[]>([]);
  constructor(main: FloatingController) {
    this.main = main;
    this.$commands = computed(
      [this.$controllerCommands, this.$floatingCommands],
      (controllerCommands, floatingCommands) => [
        ...controllerCommands,
        ...floatingCommands,
      ]
    );
  }
  register() {
    this.$controllerCommands.set(this.main.command.getSnapshot());
    this.main.on("snapshot", (snapshot) => {
      this.$floatingCommands.set([...snapshot.command]);
    });
    this.main.on("command:add", (name: string, fromController?: boolean) => {
      if (fromController) {
        this.$controllerCommands.set([...this.$controllerCommands.get(), name]);
      } else {
        this.$floatingCommands.set([...this.$floatingCommands.get(), name]);
      }
    });
    this.main.on("command:remove", (name: string, fromController?: boolean) => {
      if (fromController) {
        const list = [...this.$controllerCommands.get()];
        const index = list.findIndex((n) => n == name);
        if (index > -1) {
          list.splice(index, 1);
          this.$controllerCommands.set(list);
        }
      } else {
        const list = [...this.$floatingCommands.get()];
        const index = list.findIndex((n) => n == name);
        if (index > -1) {
          list.splice(index, 1);
          this.$floatingCommands.set(list);
        }
      }
    });
  }
}
