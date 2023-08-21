import { proxy } from "valtio";

export interface IStateLink {
  /** 服务连接(仅web端连接有效) */
  url: string;
  /** 是否连接到服务 */
  connected: boolean;
}

export const storeLink: IStateLink = proxy({
  url: window.location.hostname + ":8130",
  connected: false,
});
