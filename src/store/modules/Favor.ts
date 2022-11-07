import { makeAutoObservable } from 'mobx'

export default class StoreFavor {

  favor_list: Array<{platform: string, id: string, name: string, avatar: string}> = []

  /** 添加收藏 */
  addFavor(r: {platform: string, id: string, name: string, avatar: string}) {
    this.favor_list.push(r)
  }
  /** 移除收藏 */
  removeFavor(i: number) {
    return this.favor_list.splice(i, 1)
  }

  constructor() {
    makeAutoObservable(this)
  }
}