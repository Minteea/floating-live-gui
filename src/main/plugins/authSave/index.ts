import { FloatingLive } from "floating-live";
import { safeStorage } from "electron";

declare module "floating-live" {
  interface FloatingCommandMap {
    "auth.save": (platform: string, credentials: string) => void;
    "auth.read": () => void;
  }
}

interface StorageItem {
  get(name?: string): Promise<any> | any;
  set(name: string, value: any): Promise<void> | void;
}

/** 配置 */
export default class AuthSave {
  static pluginName = "authSave";
  protected readonly storage: StorageItem;
  private authData: Promise<Record<string, { encrypted: string }>>;
  readonly main: FloatingLive;
  constructor(main: FloatingLive) {
    this.main = main;
    this.storage = main.call("storage.require", "auth");
    this.authData = this.storage.get();

    main.command.register(
      "auth.save",
      (platform: string, credentials: string) => {
        const a = safeStorage.encryptString(credentials).toString("base64");
        this.set(platform, { encrypted: a });
      }
    );
  }
  async register() {
    await this.read();
  }
  /** 保存auth数据 */
  set(name: string, value: any) {
    return this.storage.set(name, value);
  }
  /** 读取存储数据并应用 */
  async read() {
    const data = await this.authData;
    for (const p in data) {
      try {
        const auth = safeStorage.decryptString(
          Buffer.from(data[p].encrypted, "base64")
        );
        console.log(auth);
        this.main.command.call("auth", p, auth);
      } catch (err) {
        console.error(err);
      }
    }
  }
}
