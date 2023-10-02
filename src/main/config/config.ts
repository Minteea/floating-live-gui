import { LowSync, JSONFileSync } from "lowdb";
import lodash from "lodash";
import { ConfigInterface } from "./ConfigInterface";
import fs from "fs-extra";
import { defaultConfig } from "./defaultConfig";
import path from "path";
import { appDataPath } from "../../main/appConfig";

class LowSyncWithLodash<T> extends LowSync<T> {
  chain: lodash.ExpChain<this["data"]> = lodash.chain(this).get("data");
}

export class Config<T extends object> {
  /** 配置文件存储路径 */
  readonly path: string;
  db: LowSyncWithLodash<T>;
  constructor(configPath: string, defaultConfig: T) {
    this.path = configPath;
    fs.ensureFileSync(configPath);
    this.db = new LowSyncWithLodash(new JSONFileSync<T>(configPath));
    try {
      this.db.read();
    } catch (err) {
      this.db.data = defaultConfig;
      this.db.write();
    }
  }
  /** 设置值 */
  public set(key: string, value: any) {
    this.db.chain.set(key, value).value();
    this.db.write();
  }
  /** 获取值 */
  public get(key?: string) {
    return key ? this.db.chain.get(key).value() : this.db.data;
  }
  /** 设置值 */
  public arrayPush(key: string, value: any) {
    this.db.chain.get(key).value().push(value);
    this.db.write();
  }
  /** 设置值 */
  public arrayRemove(
    key: string,
    predicate: (value: any, index: number) => boolean
  ) {
    (this.db.chain.get(key) as any).remove(predicate);
    this.db.write();
  }
}

export default new Config<ConfigInterface>(
  path.resolve(appDataPath, "./config/config.json"),
  defaultConfig
);
