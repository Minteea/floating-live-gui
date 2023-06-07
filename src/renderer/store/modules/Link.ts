import { makeAutoObservable } from 'mobx';

export default class StoreLink {
  /** observable */

  /** 服务连接(仅web端连接有效) */
  link: string = window.location.hostname + ":8130";

  /** 是否连接 */
  connected: boolean = false;

  constructor() {
    makeAutoObservable(this);
  }
}
