import { makeAutoObservable } from 'mobx';
import RoomInfo from 'floating-live/src/types/room/RoomInfo';

export default class StoreSearch {
  /** 搜索平台 */
  search_platform: string = '';

  /** 搜索id */
  search_id: string = '';

  /** 搜索房间信息 */
  search_room_info: RoomInfo | null = null;

  /** 搜索房间key */
  search_room_key: string = ''

  /** 更新搜索信息 */
  updateRoomInfo(key: string, r: RoomInfo | null) {
    this.search_room_key = key
    this.search_room_info = r;
  }
  /** 清除搜索信息 */
  clear() {
    this.search_room_info = null
    this.search_room_key = ''
  }

  constructor() {
    makeAutoObservable(this);
  }
}
