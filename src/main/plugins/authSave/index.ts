import { BasePlugin, FloatingLive, PluginContext } from "floating-live";
import keytar from "keytar";
import {
  fromString as u8FromString,
  toString as u8ToString,
} from "uint8arrays";

declare module "floating-live" {
  interface AppCommandMap {
    "auth.save": (platform: string, credentials: string) => Promise<void>;
    "auth.read": (platform: string) => Promise<void>;
    "auth.readAll": () => Promise<void>;
  }
}

interface StorageItem {
  get(name?: string): Promise<any> | any;
  set(name: string, value: any): Promise<void> | void;
}

/** 配置 */
export default class AuthSave extends BasePlugin {
  static pluginName = "authSave";
  protected storage!: StorageItem;
  init(ctx: PluginContext) {
    this.ctx = ctx;
    this.storage = ctx.call("storage.require", "auth");

    ctx.registerCommand("auth.save", async (e, platform, credentials) => {
      return this.save(platform, credentials);
    });
    ctx.registerCommand("auth.read", async (e, platform) => {
      return this.read(platform);
    });
  }
  /** 保存auth数据 */
  set(name: string, value: any) {
    return this.storage.set(name, value);
  }
  /** 写入数据 */
  async save(platform: string, credentials: string) {
    // 生成密钥
    const authToken = await generateKey();
    // 密钥储存至系统
    await keytar.setPassword(
      "FloatingLiveClient",
      `AuthToken-${platform}`,
      authToken
    );
    await this.set(platform, {
      encrypted: await encryptData(credentials, authToken),
    });
  }

  /** 读取存储数据并应用 */
  async read(platform: string) {
    const data = await this.storage.get(platform);
    const { encrypted } = data;
    // 获取
    const authToken = await keytar.getPassword(
      "FloatingLiveClient",
      `AuthToken-${platform}`
    );
    if (!authToken) {
      throw new this.Error("authSave:token_missing", {
        message: "存储密钥缺失",
      });
    }
    const cookie = await decryptData(encrypted, authToken);
    const { credentials } = await this.ctx.call("auth", platform, cookie);

    console.log("auth", data);
    // 储存更新后的cookie
    this.save(platform, credentials);
  }
}

/** 生成AES密钥 */
async function generateKey(): Promise<string> {
  const key = await crypto.subtle.generateKey(
    { name: "AES-GCM", length: 256 },
    true,
    ["encrypt", "decrypt"]
  );
  const buf = await crypto.subtle.exportKey("raw", key);
  return u8ToString(new Uint8Array(buf), "base64");
}
/** 生成随机iv值 */
function generateIv(): string {
  return u8ToString(crypto.getRandomValues(new Uint8Array(12)), "base64");
}

/** 加密
 * @returns iv值(base64) + 密文(base64)
 */
async function encryptData(data: string, keyString: string): Promise<string> {
  const iv = generateIv();
  const key = await crypto.subtle.importKey(
    "raw",
    u8FromString(keyString, "base64").buffer as ArrayBuffer,
    "AES-GCM",
    false,
    ["encrypt"]
  );
  const buf = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv: u8FromString(iv, "base64").buffer as ArrayBuffer },
    key,
    textEncoder.encode(data).buffer as ArrayBuffer
  );
  return iv + u8ToString(new Uint8Array(buf), "base64");
}

const textEncoder = new TextEncoder();
const textDecoder = new TextDecoder();

/** 解密
 * @param encrypted iv值(base64) + 密文(base64)
 */
async function decryptData(
  encrypted: string,
  keyString: string
): Promise<string> {
  const iv = encrypted.substring(0, 16);
  const secret = encrypted.substring(16);

  const key = await crypto.subtle.importKey(
    "raw",
    u8FromString(keyString, "base64").buffer as ArrayBuffer,
    "AES-GCM",
    false,
    ["decrypt"]
  );
  const buf = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv: u8FromString(iv, "base64").buffer as ArrayBuffer },
    key,
    u8FromString(secret, "base64").buffer as ArrayBuffer
  );
  return textDecoder.decode(buf);
}
