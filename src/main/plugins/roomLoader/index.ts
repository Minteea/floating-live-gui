import { FloatingLive } from "floating-live";

declare module "floating-live" {
  interface FloatingValueMap {
    "roomLoader.open": boolean | undefined;
  }
}

interface StorageItem {
  get(name?: string): Promise<any> | any;
  set(name: string, value: any): Promise<void> | void;
}

interface RoomLoaderOptions {
  list?: RoomLoaderItem[];
  /** 使用存储 */
  storage?: boolean;
  /** 是否开启所有房间
   * @description
   * 若为true，则开启所有未单独设置为开启的房间；若为false，则不开启任何房间，包括被单独设置开启的房间
   */
  open?: boolean;
}

interface RoomLoaderItem {
  platform: string;
  id: string | number;
  open?: boolean;
}

export default class RoomLoader {
  static pluginName = "roomLoader";
  protected readonly storage?: StorageItem;
  readonly main: FloatingLive;
  constructor(main: FloatingLive, options: RoomLoaderOptions) {
    this.main = main;
    if (options.storage) this.storage = main.call("storage.require", "rooms");
  }
  async register(main: FloatingLive, options: RoomLoaderOptions) {
    let list = options?.list || [];
    let open = options.open;

    main.value.register("roomLoader.open", {
      get: () => open,
      set: (v) => {
        open = v;
        main.value.emit("roomLoader.open", v);
      },
    });

    if (options.storage) {
      const storageList: RoomLoaderItem[] =
        (await this.storage?.get("list").catch(() => {
          this.storage!.set("list", []);
        })) || [];
      // 从storage中加载的列表，在未单独指定开启的情况下不会开启，不受开启所有房间选项的影响
      storageList.forEach((r) => {
        if (!r.open || open == false) r.open = false;
      });
      list = list.concat(storageList);
    }
    await this.load(list, open);
    if (options.storage) {
      main.on("room:add", async (key, { platform, id }) => {
        const list: RoomLoaderItem[] = await this.storage!.get("list");
        if (!list.find((r) => r.platform == platform && r.id == id)) {
          list.push({ platform, id });
          this.storage!.set("list", list);
        }
      });
      main.on("room:remove", async (key) => {
        const list: RoomLoaderItem[] = await this.storage!.get("list");
        const index = list.findIndex((r) => `${r.platform}:${r.id}` == key);
        if (index > -1) {
          list.splice(index, 1);
          this.storage!.set("list", list);
        }
      });
      main.on("room:open", async (key) => {
        const list: RoomLoaderItem[] = await this.storage!.get("list");
        const item = list.find((r) => `${r.platform}:${r.id}` == key);
        if (item) {
          item.open = true;
          this.storage!.set("list", list);
        }
      });
      main.on("room:close", async (key) => {
        const list: RoomLoaderItem[] = await this.storage!.get("list");
        const item = list.find((r) => `${r.platform}:${r.id}` == key);
        if (item) {
          item.open = false;
          this.storage!.set("list", list);
        }
      });
    }
  }
  async load(list: RoomLoaderItem[], open?: boolean) {
    for (const r of list) {
      const isOpen = open != false && r.open != false && (open || r.open);
      await this.main.room.add(r.platform, r.id as number, { open: isOpen });
    }
  }
}
