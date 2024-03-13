import { map } from "nanostores";
import FloatingController from "../../Controller";

export default class StoreManifests {
  static pluginName = "manifests";
  readonly main: FloatingController;
  readonly $manifests = map<Record<string, Record<string, any>>>({});
  constructor(main: FloatingController) {
    this.main = main;
  }
  register() {
    this.main.on("snapshot", (snapshot) => {
      this.$manifests.set(snapshot.manifest);
    });
    this.main.on("manifest:add", (name: string, id: string, value: any) => {
      const manifest = this.$manifests.get()[name];
      this.$manifests.setKey(name, { ...manifest, id: value });
    });
    this.main.on("manifest:remove", (name: string, id: string) => {
      const manifest = this.$manifests.get()[name];
      this.$manifests.setKey(name, { ...manifest, [id]: undefined });
    });
  }
}
