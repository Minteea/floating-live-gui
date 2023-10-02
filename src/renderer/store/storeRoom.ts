import { RoomInfo, RoomDetail, RoomStatsInfo } from "floating-live/src/types";
import { RoomStatus } from "floating-live/src/enum";
import { atom } from "jotai";
import { getAtom, setAtom } from ".";

export interface IStateRoom {
  /** 活跃状态 */
  active: boolean;
  /** 房间列表 */
  roomMap: Map<string, RoomInfo>;
  /** 房间列表 */
  allRooms: Array<string>;
  /** 活跃房间列表 */
  activeRooms: Array<string>;
}

/** 房间状态 */
export const storeRoom = {
  /** 房间列表 */
  list: atom<RoomInfo[]>([]),
};

/** 更新房间信息 */
export function updateRoomInfo(key: string, room: RoomInfo) {
  const list = [...getAtom(storeRoom.list)];
  const index = list.findIndex((item) => item.key == key);
  if (index == -1) return;
  list[index] = room;
  setAtom(storeRoom.list, list);
}

/** 更新直播基本信息 */
export function updateRoomDetail(key: string, detail: Partial<RoomDetail>) {
  const list = [...getAtom(storeRoom.list)];
  const room = list.find((item) => item.key == key);
  if (!room?.detail) return;
  Object.assign(room.detail, detail);
  setAtom(storeRoom.list, list);
}

/** 更新直播数据信息 */
export function updateRoomStats(key: string, stats: RoomStatsInfo) {
  const list = [...getAtom(storeRoom.list)];
  const room = list.find((item) => item.key == key);
  if (!room?.stats) return;
  Object.assign(room.stats, stats);
  setAtom(storeRoom.list, list);
}

/** 更新直播状态 */
export function updateRoomStatus(
  key: string,
  status: RoomStatus,
  timestamp: number,
  id?: string
) {
  const list = [...getAtom(storeRoom.list)];
  const room = list.find((item) => item.key == key);
  if (!room) return;
  room.liveId = id;
  room.status = status;
  room.timestamp = timestamp;
  setAtom(storeRoom.list, list);
}

/** 添加房间 */
export function roomAdd(key: string, room: RoomInfo) {
  console.log(key);
  console.log(room);
  const list = [...getAtom(storeRoom.list)];
  list.push(room);
  setAtom(storeRoom.list, list);
}

/** 移除房间 */
export function roomRemove(key: string) {
  const list = [...getAtom(storeRoom.list)];
  const index = list.findIndex((item) => item.key == key);
  if (index == -1) return;
  list.splice(index, 1);
  setAtom(storeRoom.list, list);
}

/** 打开房间 */
export function roomOpen(key: string) {
  const list = [...getAtom(storeRoom.list)];
  const room = list.find((item) => item.key == key);
  if (!room) return;
  room.opened = true;
  setAtom(storeRoom.list, list);
}

/** 关闭房间 */
export function roomClose(key: string) {
  const list = [...getAtom(storeRoom.list)];
  const room = list.find((item) => item.key == key);
  if (!room) return;
  room.opened = false;
  setAtom(storeRoom.list, list);
}
