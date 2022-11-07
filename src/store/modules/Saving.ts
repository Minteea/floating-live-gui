import { makeAutoObservable } from 'mobx'

export default class StoreSaving {
  
  /** observable*/ 

  /** 记录弹幕到本地 */
  save_message: boolean = false

  /** 记录源数据到本地 */
  save_origin: boolean = false

  /** 保存路径 */
  save_path: string = ""
  
  constructor() {
    makeAutoObservable(this)
  }
}