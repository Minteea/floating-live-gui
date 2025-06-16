import {
  AppPluginExposesMap,
  BasePlugin,
  FloatingLive,
  PluginContext,
} from "floating-live";

declare module "floating-live" {
  interface AppValueMap {
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

export default class RoomLoader extends BasePlugin {
  static pluginName = "roomLoader";
  protected storage?: StorageItem;
  private room?: AppPluginExposesMap["room"];

  async init(ctx: PluginContext, options: RoomLoaderOptions) {
    if (options.storage) this.storage = ctx.call("storage.require", "rooms");

    ctx.whenRegister("room", (room) => {
      this.room = room;
    });

    let list = options?.list || [];
    let open = options.open;

    const valueOpen = ctx.registerValue("roomLoader.open", {
      get: () => open,
      set: (v) => {
        open = v;
        valueOpen.emit(v);
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
      ctx.on("room:add", async ({ key, room: { platform, id } }) => {
        const list: RoomLoaderItem[] = await this.storage!.get("list");
        if (!list.find((r) => r.platform == platform && r.id == id)) {
          list.push({ platform, id });
          this.storage!.set("list", list);
        }
      });
      ctx.on("room:remove", async ({ key }) => {
        const list: RoomLoaderItem[] = await this.storage!.get("list");
        const index = list.findIndex((r) => `${r.platform}:${r.id}` == key);
        if (index > -1) {
          list.splice(index, 1);
          this.storage!.set("list", list);
        }
      });
      ctx.on("room:open", async ({ key }) => {
        const list: RoomLoaderItem[] = await this.storage!.get("list");
        const item = list.find((r) => `${r.platform}:${r.id}` == key);
        if (item) {
          item.open = true;
          this.storage!.set("list", list);
        }
      });
      ctx.on("room:close", async ({ key }) => {
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
      await this.room?.add(r.platform, r.id as number, { open: isOpen });
    }
  }
}
