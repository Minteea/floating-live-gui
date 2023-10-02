import { FloatingLive } from "floating-live";
import { safeStorage } from "electron";
import { authConfig } from "./authConfig";

const authSave = () => {
  return {
    name: "authSave",
    register: (ctx: FloatingLive) => {
      ctx.command.register("auth.save", (platform: string, auth: string) => {
        const a = safeStorage.encryptString(auth).toString("base64");
        authConfig.set(platform, { encryptedAuth: a });
      });
      ctx.command.register("auth.read", () => {
        const config = authConfig.get();
        for (const p in config) {
          try {
            const auth = safeStorage.decryptString(
              Buffer.from(config[p].encryptedAuth, "base64")
            );
            ctx.command.execute("auth", p, auth);
          } catch (err) {
            console.error(err);
          }
        }
      });
    },
  };
};

export default authSave;
