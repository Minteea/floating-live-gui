import { BasePlugin, PluginContext, LiveRoomData, LiveConnectionStatus } from "floating-live";
import { MapStore, ReadableAtom, atom, computed, map } from "nanostores";

export default class StoreRooms extends BasePlugin {
  static pluginName = "storeRooms";

  readonly $remoteRooms = atom<MapStore<LiveRoomData>[]>([]);
  readonly $rooms = atom<MapStore<LiveRoomData>[]>([]);
  readonly $openedRooms: ReadableAtom<MapStore<LiveRoomData>[]>;

  constructor(ctx: PluginContext, options: any) {
    super(ctx, options);
    this.$openedRooms = computed([this.$rooms], (rooms) => {
      return rooms.filter((r) => r.get().opened);
    });

    this.$remoteRooms.listen((value) => {
      this.$rooms.set([...value]);
    });
  }
  find(key: string) {
    return this.$remoteRooms.get().find((room) => room.get().key == key);
  }
  init(ctx: PluginContext) {
    ctx.on("snapshot", (snapshot) => {
      this.$remoteRooms.set(snapshot.room.map((room) => map(room)));
    });
    ctx.on("room:add", ({ room }) => {
      const list = [...this.$remoteRooms.get(), map(room)];
      this.$remoteRooms.set(list);
    });
    ctx.on("room:remove", ({ key }) => {
      const rooms = [...this.$remoteRooms.get()];
      const index = rooms.findIndex((room) => room.get().key == key);
      if (index > -1) {
        rooms.splice(index, 1);
        this.$remoteRooms.set(rooms);
      }
    });
    ctx.on("room:move", ({ key, position }) => {
      const rooms = [...this.$remoteRooms.get()];
      const index = rooms.findIndex((room) => room.get().key == key);
      if (index > -1) {
        const [room] = rooms.splice(index, 1);
        rooms.splice(position, 0, room);
        this.$remoteRooms.set(rooms);
      }
    });

    this.ctx.on("room:open", ({ key }) => {
      const $room = this.find(key);
      if (!$room) return;
      $room.setKey("opened", true);
      this.$remoteRooms.set([...this.$remoteRooms.get()]);
    });
    this.ctx.on("room:close", ({ key }) => {
      const $room = this.find(key);
      if (!$room) return;
      $room.setKey("opened", false);
      $room.setKey("connectionStatus", LiveConnectionStatus.off);
      this.$remoteRooms.set([...this.$remoteRooms.get()]);
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

    this.ctx.on("room:connecting", ({ key }) => {
      const $room = this.find(key);
      if (!$room) return;
      $room.setKey("connectionStatus", LiveConnectionStatus.connecting);
      this.$remoteRooms.set([...this.$remoteRooms.get()]);
    });
    this.ctx.on("room:connected", ({ key }) => {
      const $room = this.find(key);
      if (!$room) return;
      $room.setKey("connectionStatus", LiveConnectionStatus.connected);
      this.$remoteRooms.set([...this.$remoteRooms.get()]);
    });
    this.ctx.on("room:disconnect", ({ key }) => {
      const $room = this.find(key);
      if (!$room) return;
      $room.setKey("connectionStatus", LiveConnectionStatus.disconnected);
      this.$remoteRooms.set([...this.$remoteRooms.get()]);
    });
    this.ctx.on("room:enter", ({ key }) => {
      const $room = this.find(key);
      if (!$room) return;
      $room.setKey("connectionStatus", LiveConnectionStatus.entered);
      this.$remoteRooms.set([...this.$remoteRooms.get()]);
    });

    this.ctx.on("room:validate", ({ key, room }) => {
      const $room = this.find(key);
      if (!$room) return;
      $room.set(room);
    });
    this.ctx.on("room:invalidate", ({ key, room }) => {
      const $room = this.find(key);
      if (!$room) return;
      $room.set(room);
    });
  }
}
