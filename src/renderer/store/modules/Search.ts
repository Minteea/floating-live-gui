import { makeAutoObservable } from 'mobx';
import RoomInfo from 'floating-living/src/LiveRoom/RoomInfo';

export default class StoreSearch {
  /** 搜索平台 */
  search_platform: string = '';

  /** 搜索id */
  search_id: string = '';

  /** 搜索房间信息 */
  search_room_info: RoomInfo | null = null;

  /** 更新搜索信息 */
  updateRoomInfo(r: RoomInfo | null) {
    this.search_room_info = r;
    console.log(r);
  }

  constructor() {
    makeAutoObservable(this);
  }
}
