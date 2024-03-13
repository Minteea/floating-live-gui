import { FloatingLive } from "floating-live";
import { JsonDB, Config } from "node-json-db";
import path from "path";

declare module "floating-live" {
  interface FloatingCommandMap {
    "storage.require": (name: string) => {
      get(name?: string): Promise<any> | any;
      set(name: string, value: any): Promise<void> | void;
    };
  }
}

export default class JsonStorage {
  static pluginName = "storage";
  path: string;
  constructor(main: FloatingLive, options: { path?: string }) {
    this.path = path.resolve(options.path || "./storage");
    main.command.register("storage.require", (name: string) =>
      this.require(name)
    );
  }
  require(name: string) {
    return new JsonStorageItem(path.resolve(this.path, `${name}.json`));
  }
}

class JsonStorageItem {
  protected readonly db: JsonDB;
  constructor(path: string) {
    this.db = new JsonDB(new Config(path, true, true, ".", false));
  }
  get(name?: string) {
    return this.db.getData("." + (name || ""));
  }
  set(name: string, value: any) {
    return this.db.push("." + (name || ""), value, true);
  }
}
