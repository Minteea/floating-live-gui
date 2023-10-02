import { atom } from "jotai";
import { proxy } from "valtio";

export interface IStateServer {
  /** 本地服务端口 */
  port: number;
  /** 服务是否打开 */
  opened: boolean;
}

export const storeServer = {
  port: atom(8130),
  opened: atom(false),
};

export default storeServer;
