import commandParser from "../utils/commandParser";
import { App, AppCommandMap, AppValueMap } from "floating-live";

export class FloatingLiveController extends App {
  protected remoteValueController: RemoteValueController;
  constructor() {
    super();
    this.remoteValueController = new RemoteValueController(this);
    console.log(this.valueManager);
    console.log(this.commandManager);
    console.log("fin");
  }
  /** @deprecated */
  exec(str: string) {
    try {
      let [cmd, ...args] = commandParser(str);
      this.call(cmd, ...(args as Parameters<AppCommandMap[any]>));
    } catch (err) {
      console.log(`指令错误: ${str}`);
    }
  }
  /** 调用远程指令 */
  remoteCall<T extends keyof AppCommandMap>(
    name: T,
    ...args: Parameters<AppCommandMap[T]>
  ): Promise<ReturnType<AppCommandMap[T]>> {
    return super.call("send", "command", name, ...args);
  }
  /** 指令控制 */
  command<T extends keyof AppCommandMap>(
    name: T,
    ...args: Parameters<AppCommandMap[T]>
  ) {
    if (this.hasCommand(name)) {
      return this.call(name, ...args);
    } else {
      return this.remoteCall(name, ...args);
    }
  }
  getValue<K extends keyof AppValueMap>(name: K) {
    return this.hasLocalValue(name)
      ? this.getLocalValue(name)
      : this.remoteValueController.get(name);
  }
  setValue<K extends keyof AppValueMap>(name: K, value: AppValueMap[K]) {
    return this.hasLocalValue(name)
      ? this.setLocalValue(name, value)
      : this.remoteValueController.set(name, value);
  }
  hasValue<K extends keyof AppValueMap>(name: K) {
    return this.hasLocalValue(name) || this.remoteValueController.has(name);
  }

  hasLocalValue<K extends keyof AppValueMap>(name: K) {
    return super.hasValue(name);
  }
  getLocalValue<K extends keyof AppValueMap>(name: K) {
    return super.getValue(name);
  }
  setLocalValue<K extends keyof AppValueMap>(name: K, value: AppValueMap[K]) {
    return super.setValue(name, value);
  }
}

class RemoteValueController {
  app: FloatingLiveController;
  /** 远程值列表 */
  list = new Map<string, any>();
  constructor(app: FloatingLiveController) {
    this.app = app;
    app.on("snapshot", ({ value }) => {
      // 通过初始化snapshot设置远程值
      if (value) {
        this.list = new Map(value.map(({ name, value }) => [name, value]));
      }
    });
    app.on("value:change", ({ name, value, remote }) => {
      // 监听远程值更新
      if (remote) {
        this.list.set(name, value);
      }
    });
    app.on("value:register", ({ name, value, remote }) => {
      // 监听远程值注册
      if (remote) {
        this.list.set(name, value);
      }
    });
    app.on("value:unregister", ({ name, remote }) => {
      // 监听远程值卸载
      if (remote) {
        this.list.delete(name);
      }
    });
  }
  get(name: string) {
    return this.list.get(name);
  }
  set(name: string, value: any) {
    this.app.remoteCall("set", name as any, value);
    return this.list.has(name);
  }
  has(name: string) {
    return this.list.has(name);
  }
}
