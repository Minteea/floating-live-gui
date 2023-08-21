import {
  RoomInfo,
  RoomDetail,
  RoomStatus,
  RoomStatsInfo,
} from "floating-live";
import { proxy } from "valtio";
import { proxyMap } from "valtio/utils";

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
export const storeRoom: IStateRoom = proxy({
  /** 房间Map */
  roomMap: proxyMap(),
  /** 所有房间 */
  get allRooms(): string[] {
    return [...storeRoom.roomMap.keys()];
  },
  /** 活跃房间 */
  get activeRooms(): string[] {
    return [...storeRoom.roomMap]
      .filter((item) => item[1].opening)
      .map((item) => item[0]);
  },
  /** 活跃状态 */
  get active(): boolean {
    return !!storeRoom.activeRooms.length;
  },
});

/** 更新房间信息 */
export function updateRoomInfo(key: string, value: RoomInfo) {
  if (!storeRoom.roomMap.has(key)) return;
  storeRoom.roomMap.set(key, value);
}

/** 更新直播基本信息 */
export function updateDetail(key: string, data: Partial<RoomDetail>) {
  let detail = storeRoom.roomMap.get(key)?.detail;
  if (!detail) return;
  Object.assign(detail, data);
}

/** 更新直播数据信息 */
export function updateStatsInfo(key: string, data: RoomStatsInfo) {
  let stats = storeRoom.roomMap.get(key)?.stats;
  if (!stats) return;
  Object.assign(stats, data);
}

/** 更新直播状态 */
export function updateStatus(
  key: string,
  status: RoomStatus,
  { id, timestamp }: { id?: string; timestamp: number }
) {
  let room = storeRoom.roomMap.get(key);
  if (!room) return;
  room.liveId = id;
  room.status = status;
  room.timestamp = timestamp;
}

/** 添加房间 */
export function addRoom(key: string, value: RoomInfo) {
  storeRoom.roomMap.set(key, value);
}

/** 移除房间 */
export function removeRoom(key: string) {
  storeRoom.roomMap.delete(key);
}

/** 打开房间 */
export function openRoom(key: string) {
  const room = storeRoom.roomMap.get(key);
  if (room) room.opening = true;
}

/** 关闭房间 */
export function closeRoom(key: string) {
  const room = storeRoom.roomMap.get(key);
  if (room) room.opening = false;
}
