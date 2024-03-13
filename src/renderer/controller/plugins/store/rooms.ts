import { RoomInfo } from "floating-live";
import { MapStore, atom, map } from "nanostores";
import FloatingController from "../../Controller";

export default class StoreRooms {
  static pluginName = "rooms";
  readonly main: FloatingController;
  readonly $rooms = atom<MapStore<RoomInfo>[]>([]);
  constructor(main: FloatingController) {
    this.main = main;
  }
  find(key: string) {
    return this.$rooms.get().find((room) => room.get().key == key);
  }
  register(main: FloatingController) {
    main.on("snapshot", (snapshot) => {
      this.$rooms.set(snapshot.room.map((room) => map(room)));
    });
    main.on("room:add", (key, room) => {
      this.$rooms.set([...this.$rooms.get(), map(room)]);
    });
    main.on("room:remove", (key) => {
      const rooms = [...this.$rooms.get()];
      const index = rooms.findIndex((room) => room.get().key == key);
      if (index > -1) {
        rooms.splice(index, 1);
        this.$rooms.set(rooms);
      }
    });
    main.on("room:move", (key, position) => {
      const rooms = [...this.$rooms.get()];
      const index = rooms.findIndex((room) => room.get().key == key);
      if (index > -1) {
        const [room] = rooms.splice(index, 1);
        rooms.splice(position, 0, room);
        this.$rooms.set(rooms);
      }
    });
    this.main.on("room:open", (key) => {
      this.find(key)?.setKey("opened", true);
    });
    this.main.on("room:close", (key) => {
      this.find(key)?.setKey("opened", false);
    });
    this.main.on("room:info", (key, room) => {
      this.find(key)?.set(room);
    });
    this.main.on("room:detail", (key, detail) => {
      const $room = this.find(key);
      if (!$room) return;
      $room.setKey("detail", { ...$room.get().detail, ...detail });
    });
    this.main.on("room:stats", (key, stats) => {
      const $room = this.find(key);
      if (!$room) return;
      $room.setKey("stats", { ...$room.get().stats, ...stats });
    });
    this.main.on("room:status", (key, statusInfo) => {
      const $room = this.find(key);
      if (!$room) return;
      $room.set({ ...$room.get(), ...statusInfo });
    });
  }
}
