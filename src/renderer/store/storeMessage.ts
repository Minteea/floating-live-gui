import { Message } from "floating-live/src/types";
import { atom } from "jotai";
import { getAtom, setAtom } from ".";

export interface IStateMessage {
  /** 消息列表 */
  list: Array<Message.All>;
  /** 消息最大保存数量 */
  maxLimit: number;
}

export const storeMessage = {
  list: atom<Message.All[]>([]),
  maxLimit: atom(200),
};

export function messagePush(msg: Message.All) {
  const list = getAtom(storeMessage.list);
  const maxLimit = getAtom(storeMessage.maxLimit);
  list.push(msg);
  if (list.length > maxLimit) {
    list.splice(0, list.length - maxLimit);
  }
  setAtom(storeMessage.list, list);
}

export function messageClear() {
  setAtom(storeMessage.list, []);
}
