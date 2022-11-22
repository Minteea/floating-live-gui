import { makeAutoObservable } from 'mobx';

export default class StoreServer {
  /** observable */

  /** 本地服务端口 */
  port: number = 8130;

  /** 打开服务 */
  serving: boolean = true;

  constructor() {
    makeAutoObservable(this);
  }
}
