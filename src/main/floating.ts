// 核心程序
import { FloatingLive, RoomInfo } from "floating-live";
import save from "../plugins/save";
import ipc from "../plugins/ipc";
import search from "../plugins/search";
import server from "../plugins/server";
import bilibiliGetAvatar from "../plugins/bilibiliGetAvatar";
import bilibili from "floating-live/plugin/bilibili";
import acfun from "floating-live/plugin/acfun";
import config from "./config/config";
import authSave from "../plugins/authSave";

// 引入程序
export const floating = new FloatingLive();

floating.on("state:set", (key, value) => {
  config.set(key, value);
});

console.log(config.get("server"));

floating.plugin.register(ipc);
floating.plugin.register(server, config.get("server") || {});

floating.plugin.register(save, config.get("save") || {});
floating.plugin.register(search);

floating.plugin.register(bilibili);
floating.plugin.register(acfun);

floating.plugin.register(bilibiliGetAvatar);

floating.plugin.register(authSave);

const list: { platform: string; id: number }[] = config.get("room.list");

list?.forEach(({ platform, id }) => {
  floating.room.add(platform, id, false);
});

floating.on("room:add", (key, { platform, id }: RoomInfo) => {
  config.arrayPush("room.list", { platform, id });
  console.log(floating.room.keys.map((k) => floating.room.get(k)));
});

floating.on("room:remove", (key) => {
  config.arrayRemove(
    "room.list",
    (room) => `${room.platform}:${room.id}` == key
  );
});
