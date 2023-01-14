import { makeAutoObservable } from 'mobx';
import { RoomInfo, RoomBaseInfo } from 'floating-live';

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

  /** 更改直播信息 */
  changeLiveInfo(key: string, data: Partial<RoomBaseInfo>) {
    let liveInfo = this.roomMap.get(key)?.base
    if (!liveInfo) return;
    liveInfo = Object.assign(liveInfo, data)
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
