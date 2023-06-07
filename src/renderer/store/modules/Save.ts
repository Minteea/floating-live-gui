import { makeAutoObservable } from 'mobx';

export default class StoreSaving {
  /** observable */

  /** 记录弹幕到本地 */
  saveMessage: boolean = false;

  /** 记录源数据到本地 */
  saveOrigin: boolean = false;

  /** 保存路径 */
  savePath: string = '';

  constructor() {
    makeAutoObservable(this);
  }
}
