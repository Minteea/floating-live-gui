import { FloatingLive } from "floating-live";
import FloatingController from "../../Controller";

export class MessageCount {
  static pluginName = "messageCount";
  count = 0;
  constructor(main: FloatingController) {
    main.hook.register("message", ({ message }) => {
      this.count++;
      message.id = `${message.id}-${this.count}`;
    });
  }
}
