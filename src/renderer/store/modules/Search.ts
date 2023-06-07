import { makeAutoObservable } from 'mobx';
import { RoomInfo } from 'floating-live';

export default class StoreSearch {
  /** 搜索平台 */
  searchPlatform: string = '';

  /** 搜索id */
  searchId: string = '';

  /** 搜索房间信息 */
  searchRoomInfo: RoomInfo | null = null;

  /** 搜索房间key */
  searchRoomKey: string = ''

  /** 更新搜索信息 */
  updateRoomInfo(key: string, r: RoomInfo | null) {
    this.searchRoomKey = key
    this.searchRoomInfo = r;
  }
  /** 清除搜索信息 */
  clear() {
    this.searchRoomInfo = null
    this.searchRoomKey = ''
  }

  constructor() {
    makeAutoObservable(this);
  }
}
