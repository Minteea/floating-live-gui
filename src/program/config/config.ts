import { LowSync, JSONFileSync } from 'lowdb';
import lodash from 'lodash'
import { ConfigInterface } from './ConfigInterface';
import fs from 'fs-extra';

class LowSyncWithLodash<T> extends LowSync<T> {
  chain: lodash.ExpChain<this['data']> = lodash.chain(this).get('data')
}

class Config {
  /** 配置文件存储路径 */
  readonly path: string
  db: LowSyncWithLodash<ConfigInterface>
  constructor(configPath: string, defaultConfig: ConfigInterface) {
    this.path = configPath
    fs.ensureFileSync(configPath)
    this.db = new LowSyncWithLodash(new JSONFileSync<ConfigInterface>(configPath))
    try {
      this.db.read()
    } catch (err) {
      this.db.data = defaultConfig
      this.db.write()
    }
  }
  /** 设置值 */
  public set(key: string, value: any) {
    this.db.chain.set(key, value).value()
    this.db.write()
  }
  /** 获取值 */
  public get(key: string) {
    return this.db.chain.get(key).value()
  }
  /** 操作值 */
  public access(key: string, callback: (value: lodash.ExpChain<any>) => void | lodash.ExpChain<any>, write: boolean = true) {
    const value = this.db.chain.get(key)
    const returnVal = callback(value)
    write && this.db.write()
    return returnVal && returnVal.value()
  }
  public reset(defaultConfig: ConfigInterface) {
    this.db.data = defaultConfig
  }
}

export default Config