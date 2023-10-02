import { getAtom, setAtom, store } from "../store";
import api from "./api";
import { RoomInfo, RoomDetail } from "floating-live/src/types";
import { RoomStatus } from "floating-live/src/enum";
import { Message } from "floating-live/src/types";
import {
  roomAdd,
  roomClose,
  roomOpen,
  roomRemove,
  updateRoomInfo,
  updateRoomStats,
  updateRoomStatus,
  updateRoomDetail,
} from "../store/storeRoom";
import { messagePush } from "../store/storeMessage";

export default class ControllerLive {
  count: number = 0;
  constructor() {
    api.on("live:message", (msg: Message.All) => {
      msg.id = `${msg.id}-${this.count}`;
      messagePush(msg);
      this.count++;
    });
    this.initEvent();
  }
  initEvent() {
    console.log(store);
    api.on("room:add", (key: string, room: RoomInfo) => {
      roomAdd(key, room);
    });
    api.on("room:remove", (key: string) => {
      roomRemove(key);
    });
    api.on("room:open", (key: string) => {
      roomOpen(key);
    });
    api.on("room:close", (key: string) => {
      roomClose(key);
    });
    api.on("room:info", (key: string, room: RoomInfo) => {
      updateRoomInfo(key, room);
    });
    api.on("room:detail", (key: string, data: Partial<RoomDetail>) => {
      updateRoomDetail(key, data);
    });
    api.on("room:stats", (key: string, data) => {
      updateRoomStats(key, data);
    });
    api.on(
      "room:status",
      (key: string, status: RoomStatus, timestamp: number, id?: string) => {
        updateRoomStatus(key, status, timestamp, id);
      }
    );

    api.on("auth:update", (platform, userId) => {
      const authStatus = { ...getAtom(store.auth.status) };
      authStatus[platform] = userId;
      setAtom(store.auth.status, authStatus);
    });
  }
}
