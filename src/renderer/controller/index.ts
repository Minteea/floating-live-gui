import { FloatingLiveController } from "./Controller";
import StoreMessages from "./plugins/store/messages";
import StoreRooms from "./plugins/store/rooms";
import StoreValues from "./plugins/store/values";
import StoreCommands from "./plugins/store/commands";
import { IpcLink } from "./plugins/link/IpcLink";
import { WebLink } from "./plugins/link/WebLink";
import { MessageCount } from "./plugins/message/messageCount";
import StorePlatform from "./plugins/store/platform";

declare global {
  interface Window {
    controller: FloatingLiveController;
  }
}

export const controller = new FloatingLiveController();

export const { $messages } = controller.registerSync(StoreMessages);
export const { $rooms, $openedRooms } = controller.registerSync(StoreRooms);
export const { $values } = controller.registerSync(StoreValues);
export const { $commands, $commandNames } =
  controller.registerSync(StoreCommands);
export const { $platform } = controller.registerSync(StorePlatform);

// 移动房间位置
export const roomsMoveItem = (key: string, position: number) => {
  const arr = [...$rooms.get()];
  const index = arr.findIndex((r) => r.get().key == key);
  if (index > -1) {
    const [item] = arr.splice(index, 1);
    arr.splice(position, 0, item);
    $rooms.set(arr);
    controller.command("move", key, position);
  }
};

/Electron/.test(navigator.userAgent)
  ? controller.register(IpcLink)
  : controller.register(WebLink);

controller.register(MessageCount);

window.controller = controller;
