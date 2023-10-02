import { FloatingLive, LiveRoom } from "floating-live";

export default () => {
  return {
    name: "search",
    register: (ctx: FloatingLive) => {
      ctx.command.register(
        "search",
        (platform: string, id: string | number) => {
          return new Promise((resolve, reject) => {
            const room = ctx.room.generate(platform, id, false) || null;
            if (room) {
              room.once("info", (info) => {
                resolve(info);
                room.destroy?.();
              });
              room.once("info_error", () => {
                resolve(room.info);
                room.destroy?.();
              });
            } else {
              resolve(null);
            }
          });
        }
      );
    },
  };
};
