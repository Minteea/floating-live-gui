import { proxy } from "valtio";
import { MessageData } from "floating-live";

type MessageWithKey = MessageData & { key: string };

export interface IStateMessage {
  /** 消息列表 */
  list: Array<MessageData>;
  /** 当前房间 */
  currentRoom: string;
  /** 消息最大保存数量 */
  maxLimit: number;
}

export const storeMessage: IStateMessage = proxy({
  list: [],
  currentRoom: "",
  maxLimit: 200,
});

export function pushMessage(msg: MessageData) {
  storeMessage.list.push(msg);
  if (storeMessage.list.length > storeMessage.maxLimit) {
    storeMessage.list.splice(0, storeMessage.list.length - storeMessage.maxLimit);
  }
}

export function clearMessage() {
  storeMessage.list = [];
}
