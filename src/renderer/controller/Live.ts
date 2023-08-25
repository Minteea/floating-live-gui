import { storeRoom } from "./../store/storeRoom";
import store from "../store";
import Controller from "./Controller";
import api from "./api";
import { RoomInfo, RoomDetail, RoomStatus } from "floating-live";
import { MessageData } from "floating-live/src/types/message/MessageData";
import {
  addRoom,
  closeRoom,
  openRoom,
  removeRoom,
  updateRoomInfo,
  updateStatsInfo,
  updateStatus,
  updateDetail,
} from "../store/storeRoom";
import { proxyMap } from "valtio/utils";
import { pushMessage } from "../store/storeMessage";

export default class ControllerLive {
  count: number = 0;
  constructor(controller: Controller) {
    api.on("live_message", (e: any, msg: MessageData) => {
      msg.id = `${msg.id}-${this.count}`;
      pushMessage(msg);
      this.count++;
    });
    this.initEvent();
  }
  initEvent() {
    console.log(store);
    api.on("room_list", (e, roomInfoList) => {
      storeRoom.roomMap = proxyMap(roomInfoList);
    });
    api.on("room_add", (e, key: string, room: RoomInfo) => {
      addRoom(key, room);
    });
    api.on("room_remove", (e, key: string) => {
      removeRoom(key);
    });
    api.on("room_info", (e, key: string, room: RoomInfo) => {
      updateRoomInfo(key, room);
    });
    api.on("room_open", (e, key: string, room: RoomInfo) => {
      openRoom(key);
    });
    api.on("room_close", (e, key: string, room: RoomInfo) => {
      closeRoom(key);
    });
    api.on("room_detail", (e, key: string, data: Partial<RoomDetail>) => {
      updateDetail(key, data);
    });
    api.on(
      "room_status",
      (
        e,
        key: string,
        status: RoomStatus,
        { id, timestamp }: { id?: string; timestamp: number }
      ) => {
        updateStatus(key, status, { id, timestamp });
      }
    );
    api.on("room_stats", (e, key: string, data) => {
      updateStatsInfo(key, data);
    });
  }
}
