import MsgSave from "floating-live/plugin/msgSave/msgSave";
import path from "path";
import {
  FloatingLive,
  FloatingLivePlugin,
  RoomInfo,
  RoomStatus,
} from "floating-live";
import config from "../../main/config/config";
import { appDataPath, appEnv } from "../../main/appConfig";

const pluginSave: FloatingLivePlugin<{
  message: boolean;
  raw: boolean;
  path: string;
}> = () => {
  return {
    name: "save",
    register: (ctx: FloatingLive, config) => {
      let filePath = config.path || "";
      // 更新文件路径
      const updateFilePath = () => {
        messageSave.path = path.resolve(
          appEnv == "production" ? appDataPath : ".",
          filePath
        );
        rawSave.path = path.resolve(
          appEnv == "production" ? appDataPath : ".",
          filePath
        );
        messageSave.list = new Map();
        rawSave.list = new Map();
      };

      const messageSave = new MsgSave(ctx, {
        filePath,
        sliceByStatus: true,
        open: !!config.message,
      });
      const rawSave = new MsgSave(ctx, {
        filePath,
        suffix: ".raw",
        open: !!config.raw,
      });
      ctx.on("live:message", (msg) => {
        messageSave.write(msg, msg);
      });
      ctx.on("live:raw", (msg, { platform, room }) => {
        rawSave.write(msg, { platform, room });
      });
      // 直播状态改变时，更新保存信息
      ctx.on(
        "room:status",
        (
          roomKey: string,
          status: RoomStatus,
          { timestamp }: { timestamp: number }
        ) => {
          const { platform, id } = ctx.room.get(roomKey)!.info;
          const saveInfo = {
            platform,
            room: id,
            status,
            timestamp,
            statusChanged: true,
          };
          messageSave.setSaveInfo(saveInfo);
          rawSave.setSaveInfo(saveInfo);
        }
      );
      // 打开直播间时，设置保存信息
      ctx.on("room:open", (roomKey: string, roomInfo: RoomInfo) => {
        const { platform, id, status } = roomInfo;
        const saveInfo = {
          platform,
          room: id,
          status,
          timestamp: Date.now(),
          statusChanged: false,
        };
        messageSave.setSaveInfo(saveInfo);
        rawSave.setSaveInfo(saveInfo);
      });
      // 关闭直播间时，移除保存信息
      ctx.on("room:close", (roomKey: string, roomInfo: RoomInfo) => {
        messageSave.removeSaveInfo(roomKey);
        rawSave.removeSaveInfo(roomKey);
      });
      ctx.command.register("save.message", (b: boolean = true) => {
        b ? messageSave.start() : messageSave.pause();
        ctx.emit("save:message", !messageSave.paused);
      });
      ctx.command.register("save.raw", (b: boolean = true) => {
        b ? rawSave.start() : rawSave.pause();
        ctx.emit("save:raw", !rawSave.paused);
      });
      ctx.command.register("save.path", (path: string) => {
        filePath = path;
        updateFilePath();
        ctx.emit("save:path", path);
      });

      ctx.state.register("save", () => {
        return {
          message: !messageSave.paused,
          raw: !rawSave.paused,
          path: filePath,
        };
      });

      ctx.on("save:message", (val) => ctx.state.set("save.message", val));
      ctx.on("save:raw", (val) => ctx.state.set("save.raw", val));
      ctx.on("save:path", (val) => ctx.state.set("save.path", val));
    },
  };
};

export default pluginSave;
