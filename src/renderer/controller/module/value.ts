import { FloatingValueMap } from "floating-live";
import FloatingController from "../Controller";
import { ControllerValueMap } from "../types";

interface ValueConfig<T> {
  get: () => T;
  set?: (value: T) => void;
}

export class ModValue {
  private list = new Map<string, ValueConfig<any>>();
  protected readonly main: FloatingController;

  constructor(main: FloatingController) {
    this.main = main;
    const { command } = main;
    command.register("get", this.get.bind(this));
    command.register("set", this.set.bind(this));
  }
  /** 注册值 */
  register<T extends keyof ControllerValueMap>(
    name: T,
    config: ValueConfig<ControllerValueMap[T]>
  ) {
    this.list.set(name, config);
    this.main.emit("value:add", name);
    this.main.emit("value:change", name, config.get());
  }
  /** 取消注册 */
  unregister(name: string): void {
    this.list.delete(name);
    this.main.emit("value:remove", name);
  }

  /** 获取值 */
  get<N extends keyof (ControllerValueMap | FloatingValueMap)>(
    name: N
  ): ControllerValueMap[N] | Promise<FloatingValueMap[N]> {
    const valueConfig = this.list.get(name);
    if (!valueConfig) {
      return this.main.command.sendCommand("get", name).catch(() => {
        return undefined;
      }) as any;
    } else {
      return valueConfig?.get();
    }
  }

  /** 设置值 */
  set<N extends keyof (ControllerValueMap & FloatingValueMap)>(
    name: N,
    value: (ControllerValueMap & FloatingValueMap)[N]
  ): boolean | Promise<boolean> {
    const valueConfig = this.list.get(name);
    if (!valueConfig) {
      return this.main.command
        .sendCommand("set", name as any, value)
        .catch(() => {
          return false;
        });
    } else if (valueConfig.set) {
      valueConfig?.set(value);
      return true;
    } else {
      return false;
    }
  }
  /** 获取注册的所有值 */
  getSnapshot() {
    const map: Record<string, any> = {};
    this.list.forEach((config, name) => {
      map[name] = config.get();
    });
    return map;
  }

  emit<T extends keyof ControllerValueMap>(
    name: T,
    value: ControllerValueMap[T]
  ) {
    this.main.emit(`change:${name as string}`, value);
    this.main.emit("value:change", name, value);
  }
  watch<T extends keyof ControllerValueMap>(
    name: T,
    listener: (value: ControllerValueMap[T]) => void
  ) {
    this.main.on(`change:${name}`, listener);
  }
  unwatch<T extends keyof ControllerValueMap>(
    name: T,
    listener: (value: ControllerValueMap[T]) => void
  ) {
    this.main.off(`change:${name}`, listener);
  }
}
