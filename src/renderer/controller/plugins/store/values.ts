import { FloatingValueMap, RoomInfo } from "floating-live";
import { WritableAtom, map } from "nanostores";
import FloatingController from "../../Controller";
import { ControllerValueMap } from "../../types";

export default class StoreValues {
  static pluginName = "values";
  readonly main: FloatingController;
  readonly $values = map<Partial<FloatingValueMap & ControllerValueMap>>({});
  constructor(main: FloatingController) {
    this.main = main;
  }
  register() {
    this.$values.set(this.main.value.getSnapshot());
    this.main.on("snapshot", (snapshot) => {
      this.$values.set({ ...snapshot.value, ...this.main.value.getSnapshot() });
    });
    this.main.on("value:change", async (name, value) => {
      this.$values.setKey(name as any, value);
    });
  }
}
