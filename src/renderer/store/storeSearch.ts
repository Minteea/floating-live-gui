import { RoomInfo } from "floating-live/src/types";
import { atom } from "jotai";

export interface IStateSearch {
  /** 搜索平台 */
  platform: string;
  /** 搜索id */
  id: string;
  /** 搜索房间信息 */
  result: RoomInfo | null;
}

export const storeSearch = {
  platform: atom(""),
  id: atom(""),
  result: atom<RoomInfo | null>(null),
};
