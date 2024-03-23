import Controller from "./Controller";
import StoreMessages from "./plugins/store/messages";
import StoreRooms from "./plugins/store/rooms";
import StoreValues from "./plugins/store/values";
import StoreCommands from "./plugins/store/commands";
import { IpcLink } from "./plugins/link/IpcLink";
import { WsHttpLink } from "./plugins/link/WsHttpLink";
import { MessageCount } from "./plugins/message/messageCount";
import StoreManifests from "./plugins/store/manifest";

declare global {
  interface Window {
    controller: Controller;
  }
}

export const controller = new Controller();

export const { $messages } = controller.plugin.registerSync(StoreMessages);
export const { $rooms, $openedRooms } =
  controller.plugin.registerSync(StoreRooms);
export const { $values } = controller.plugin.registerSync(StoreValues);
export const { $commands } = controller.plugin.registerSync(StoreCommands);
export const { $manifests } = controller.plugin.registerSync(StoreManifests);

controller.plugin.register(IpcLink).catch(() => console.log("不支持ipc连接"));
controller.plugin.register(WsHttpLink);
controller.plugin.register(MessageCount);

window.controller = controller;
