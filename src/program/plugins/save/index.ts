import MsgSave from "floating-live/plugin/msgSave/msgSave";
import path from "path";
import Program from "../..";
import { RoomInfo, RoomStatus } from "floating-live";

export default () => {
  return {
    register: (ctx: Program) => {
      let filePath = ctx.config.get("save.path");
      // 更新文件路径
      const updateFilePath = () => {
        messageSave.path = path.resolve(
          ctx.env == "production" ? ctx.appDataPath : ".",
          filePath
        );
        rawSave.path = path.resolve(
          ctx.env == "production" ? ctx.appDataPath : ".",
          filePath
        );
        messageSave.list = new Map();
        rawSave.list = new Map();
      };

      const messageSave = new MsgSave(ctx, {
        filePath,
        sliceByStatus: true,
        open: ctx.config.get("save.saveMessage"),
      });
      const rawSave = new MsgSave(ctx, {
        filePath,
        suffix: ".raw",
        open: ctx.config.get("save.saveRaw"),
      });
      ctx.on("live_message", (msg) => {
        messageSave.write(msg, msg);
      });
      ctx.on("live_origin", (msg, { platform, room }) => {
        rawSave.write(msg, { platform, room });
      });
      // 直播状态改变时，更新保存信息
      ctx.on(
        "room_status",
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
      ctx.on("room_open", (roomKey: string, roomInfo: RoomInfo) => {
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
      ctx.on("room_close", (roomKey: string, roomInfo: RoomInfo) => {
        messageSave.removeSaveInfo(roomKey);
        rawSave.removeSaveInfo(roomKey);
      });
      ctx.command.register("saveMessage", (b: boolean = true) => {
        b ? messageSave.start() : messageSave.pause();
        ctx.emit("save_message", !messageSave.paused);
        ctx.config.set("save.saveMessage", b);
      });
      ctx.command.register("saveRaw", (b: boolean = true) => {
        b ? rawSave.start() : rawSave.pause();
        ctx.emit("save_origin", !rawSave.paused);
        ctx.config.set("save.saveRaw", b);
      });
      ctx.command.register("savePath", (path: string) => {
        filePath = path;
        updateFilePath();
        ctx.emit("save_path", path);
        ctx.config.set("save.path", path);
      });

      ctx.initState.register("save", () => {
        return {
          save: {
            saveMessage: !messageSave.paused,
            saveRaw: !rawSave.paused,
            path: filePath,
          },
        };
      });
    },
  };
};
