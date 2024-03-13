import { Message } from "floating-live";
import { atom } from "nanostores";
import FloatingController from "../../Controller";

declare module "../../types" {
  interface ControllerCommandMap {
    /** 清除消息 */
    "messages.clear": () => void;
  }
  interface ControllerValueMap {
    /** 设置最大消息数 */
    "messages.maxNumber": number;
  }
}

export default class StoreMessages {
  static pluginName = "messages";
  maxNumber: number = 200;
  readonly main: FloatingController;
  readonly $messages = atom<Message.All[]>([]);
  constructor(main: FloatingController) {
    this.main = main;
    this.main.value.register("messages.maxNumber", {
      get: () => this.maxNumber,
      set: (n) => {
        this.maxNumber = n;
      },
    });
    this.main.command.register("messages.clear", () => this.clear);
  }
  register() {
    this.main.on("message", (msg) => {
      const messages = this.$messages.get();
      if (messages.length > this.maxNumber) {
        messages.splice(0, messages.length - this.maxNumber);
      }
      this.$messages.set([...messages, msg]);
    });
  }
  clear() {
    this.$messages.set([]);
  }
}
