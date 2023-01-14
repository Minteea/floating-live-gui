import { MessageData } from 'floating-live';
import { makeAutoObservable } from 'mobx';

type MessageWithKey = MessageData & {key: string}

export default class StoreMessage {
  messageList: Array<MessageWithKey> = [];

  /** 消息显示最大限制 */
  message_max_limit: number = 200;

  pushMessage(msg: MessageData, type: string, count: number) {
    (msg as MessageWithKey)["key"] = `${type}-${count}`
    this.messageList.push(msg as MessageWithKey);
    if (this.messageList.length > this.message_max_limit) {
      this.messageList.splice(
        0,
        this.messageList.length - this.message_max_limit
      );
    }
  }
  clear() {
    this.messageList = []
  }

  constructor() {
    makeAutoObservable(this);
  }
}
