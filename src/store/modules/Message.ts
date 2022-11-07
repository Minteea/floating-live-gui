import { MessageType } from 'floating-living/src/Message/MessageInterface'
import { makeAutoObservable } from 'mobx'

export default class StoreMessage {
  
  messageList: Array<MessageType> = []

  private messageCount: number = 0

  /** 消息显示最大限制 */
  message_max_limit: number = 50

  /** 消息接收总数 */
  get message_receive_count() {
    return this.messageCount
  }
  
  pushMessage(msg: MessageType) {
    this.messageList.push(msg)
    this.messageCount ++
    if (this.messageList.length > this.message_max_limit) {
      this.messageList.splice(0, this.messageList.length - this.message_max_limit)
    }
  }
  
  constructor() {
    makeAutoObservable(this)
  }
}