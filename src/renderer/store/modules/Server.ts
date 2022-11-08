import { makeAutoObservable } from 'mobx';

export default class StoreServer {
  /** observable */

  /** 本地服务端口 */
  port: number = 8130;

  /** 打开弹幕数据发送服务 */
  send_message: boolean = true;

  constructor() {
    makeAutoObservable(this);
  }
}
