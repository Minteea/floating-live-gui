import { ipcMain, webContents } from "electron";
import { FloatingLive } from "floating-live";

export default () => {
  return {
    name: "ipc",
    register: (ctx: FloatingLive) => {
      ipcMain.handle("connect", (e) => {
        e.sender.send("state", ctx.state.generate());
      });

      ipcMain.handle("command", async (e, command, ...args) => {
        return await ctx.command.execute(command, ...args);
      });

      ctx.on("event", (channel, ...args) => {
        webContents.getAllWebContents().forEach((e) => {
          e.send(channel, ...args);
        });
      });
    },
  };
};
