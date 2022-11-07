import { makeAutoObservable } from 'mobx'

export default class StoreLink {
  
  /** observable*/ 

  /** 服务连接(仅web端连接有效) */
  link: string = "ws://localhost:8130"

  /** 是否连接 */
  link_connected: boolean = false

  constructor() {
    makeAutoObservable(this)
  }
}