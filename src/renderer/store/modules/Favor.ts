import { makeAutoObservable } from 'mobx';

export default class StoreFavor {
  favorList: Array<{
    platform: string;
    id: string;
    name: string;
    avatar: string;
  }> = [];

  /** 添加收藏 */
  addFavor(r: { platform: string; id: string; name: string; avatar: string }) {
    this.favorList.push(r);
  }

  /** 移除收藏 */
  removeFavor(i: number) {
    return this.favorList.splice(i, 1);
  }

  constructor() {
    makeAutoObservable(this);
  }
}
