import { BasePlugin, PluginContext, LiveRoomData } from "floating-live";
import { MapStore, ReadableAtom, atom, computed, map } from "nanostores";

export default class StoreRooms extends BasePlugin {
  static pluginName = "storeRooms";
  readonly $rooms = atom<MapStore<LiveRoomData>[]>([]);
  readonly $openedRooms: ReadableAtom<MapStore<LiveRoomData>[]>;

  constructor(ctx: PluginContext, options: any) {
    super(ctx, options);
    this.$openedRooms = computed([this.$rooms], (rooms) => {
      return rooms.filter((r) => r.get().opened);
    });
  }
  find(key: string) {
    return this.$rooms.get().find((room) => room.get().key == key);
  }
  init(ctx: PluginContext) {
    ctx.on("snapshot", (snapshot) => {
      this.$rooms.set(snapshot.room.map((room) => map(room)));
    });
    ctx.on("room:add", ({ room }) => {
      this.$rooms.set([...this.$rooms.get(), map(room)]);
    });
    ctx.on("room:remove", ({ key }) => {
      const rooms = [...this.$rooms.get()];
      const index = rooms.findIndex((room) => room.get().key == key);
      if (index > -1) {
        rooms.splice(index, 1);
        this.$rooms.set(rooms);
      }
    });
    ctx.on("room:move", ({ key, position }) => {
      const rooms = [...this.$rooms.get()];
      const index = rooms.findIndex((room) => room.get().key == key);
      if (index > -1) {
        const [room] = rooms.splice(index, 1);
        rooms.splice(position, 0, room);
        this.$rooms.set(rooms);
      }
    });
    this.ctx.on("room:open", ({ key }) => {
      const $room = this.find(key);
      if (!$room) return;
      $room.setKey("opened", true);
      this.$rooms.set([...this.$rooms.get()]);
    });
    this.ctx.on("room:close", ({ key }) => {
      const $room = this.find(key);
      if (!$room) return;
      $room.setKey("opened", false);
      this.$rooms.set([...this.$rooms.get()]);
    });
    this.ctx.on("room:update", ({ key, room }) => {
      const $room = this.find(key);
      if (!$room) return;
      $room.set(room);
    });
    this.ctx.on("room:detail", ({ key, detail }) => {
      const $room = this.find(key);
      if (!$room) return;
      $room.setKey("detail", { ...$room.get().detail, ...detail });
    });
    this.ctx.on("room:stats", ({ key, stats }) => {
      const $room = this.find(key);
      if (!$room) return;
      $room.setKey("stats", { ...$room.get().stats, ...stats });
    });
    this.ctx.on("room:status", ({ key, liveId, timestamp, status }) => {
      const $room = this.find(key);
      if (!$room) return;
      const room = { ...$room.get() };
      room.liveId = liveId as string;
      room.timestamp = timestamp || 0;
      room.status = status;
      $room.set(room);
    });
  }
}
