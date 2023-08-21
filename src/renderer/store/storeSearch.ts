import { proxy } from "valtio";
import { RoomInfo } from "floating-live";

export interface IStateSearch {
  /** 搜索平台 */
  platform: string;
  /** 搜索id */
  id: string;
  /** 搜索房间信息 */
  roomInfo: RoomInfo | null;
}

export const storeSearch: IStateSearch = proxy({
  platform: "",
  id: "",
  roomInfo: null,
});

/** 更新搜索信息 */
export function updateSearch(key: string, r: RoomInfo | null) {
  storeSearch.roomInfo = r;
}

/** 清除搜索信息 */
export function clearSearch() {
  storeSearch.roomInfo = null;
}
