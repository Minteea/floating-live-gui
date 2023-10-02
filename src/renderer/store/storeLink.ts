import { atom } from "jotai";
import { setAtom } from ".";

export interface IStateLink {
  /** 服务连接(仅web端连接有效) */
  url: string;
  /** 是否连接到服务 */
  connected: boolean;
}

export const storeLink = {
  url: atom(window.location.hostname + ":8130"),
  connected: atom(false),
};
