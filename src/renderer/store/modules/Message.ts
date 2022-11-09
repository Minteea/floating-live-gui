import { MessageType } from 'floating-living/src/Message/MessageInterface';
import { makeAutoObservable } from 'mobx';

type MessageWithKey = MessageType & {key: string}

export default class StoreMessage {
  messageList: Array<MessageWithKey> = [];

  /** 消息显示最大限制 */
  message_max_limit: number = 50;

  pushMessage(msg: MessageType, type: string, count: number) {
    (msg as MessageWithKey)["key"] = `${type}-${count}`
    this.messageList.push(msg as MessageWithKey);
    if (this.messageList.length > this.message_max_limit) {
      this.messageList.splice(
        0,
        this.messageList.length - this.message_max_limit
      );
    }
  }

  constructor() {
    makeAutoObservable(this);
  }
}
