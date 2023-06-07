import { makeAutoObservable } from 'mobx';
import { RoomInfo, RoomViewInfo, RoomStatus, RoomStatsInfo } from 'floating-live';

export default class StoreLive {
  /** 已开始 */
  started: boolean = false;

  /** 时间戳 */
  timestamp: number = 0;

  /** 房间表 */
  roomMap: Map<string, RoomInfo> = new Map();

  constructor() {
    makeAutoObservable(this);
  }

  /** computed 房间列表属性 */
  get roomList(): Array<string> {
    return [...this.roomMap.keys()];
  }

  /** action 更新房间信息 */
  updateRoomInfo(key: string, value: RoomInfo) {
    if (!this.roomMap.has(key)) return;
    this.roomMap.set(key, value);
  }

  /** 更改直播基本信息 */
  changeViewInfo(key: string, data: Partial<RoomViewInfo>) {
    let viewInfo = this.roomMap.get(key)?.view
    if (!viewInfo) return;
    Object.assign(viewInfo, data)
  }

  /** 更改直播状态 */
  changeStatus(key: string, status: RoomStatus, {id, timestamp}: {id?: string, timestamp: number}) {
    let room = this.roomMap.get(key)
    if (!room) return;
    room.liveId = id
    room.status = status
    room.timestamp = timestamp
  }
  /** 更改直播状态 */
  changeStats(key: string, data: RoomStatsInfo) {
    let stats = this.roomMap.get(key)?.stats
    if (!stats) return;
    Object.assign(stats, data)
  }

  /** 添加房间 */
  addRoom(key: string, value: RoomInfo) {
    this.roomMap.set(key, value);
  }

  /** 移除房间 */
  removeRoom(key: string) {
    this.roomMap.delete(key);
  }

  /** 打开房间 */
  openRoom(key: string) {
    const room = this.roomMap.get(key);
    if (room) room.opening = true;
  }

  /** 关闭房间 */
  closeRoom(key: string) {
    const room = this.roomMap.get(key);
    if (room) room.opening = false;
  }

  start(timestamp?: number) {
    this.started = true;
    if (timestamp) this.timestamp = timestamp;
  }

  end(timestamp?: number) {
    this.started = false;
    if (timestamp) this.timestamp = timestamp;
  }
}
