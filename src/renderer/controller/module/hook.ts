import FloatingController from "../Controller";
import { ControllerHookMap } from "../types/maps";

export type HookFunction<T> = (
  ctx: T
) => boolean | void | Promise<boolean | void>;

export class ModHook {
  private list = new Map<string, HookFunction<any>[]>();
  protected readonly main: FloatingController;

  constructor(main: FloatingController) {
    this.main = main;
  }
  /** 注册钩子函数 */
  register<T extends keyof ControllerHookMap>(
    name: T,
    func: HookFunction<ControllerHookMap[T]>
  ) {
    let hooks = this.list.get(name);
    if (!hooks) {
      hooks = [];
      this.list.set(name, hooks);
    }
    hooks.push(func);
  }
  /** 取消注册钩子函数 */
  unregister<T extends keyof ControllerHookMap>(
    name: T,
    func: HookFunction<ControllerHookMap[T]>
  ): void {
    let hooks = this.list.get(name);
    if (hooks) {
      const index = hooks.indexOf(func);
      index > -1 && hooks.splice(index, 1);
    }
  }
  /** 调用钩子函数 */
  async call<T extends keyof ControllerHookMap>(
    name: T,
    ctx: ControllerHookMap[T]
  ) {
    const hooks = this.list.get(name);
    if (!hooks) {
      return true;
    }
    for (const func of hooks) {
      const result = await func(ctx);
      if (result == true) {
        return true;
      } else if (result == false) {
        return false;
      }
    }
    return true;
  }
  getSnapshot() {
    const map: Record<string, number> = {};
    this.list.forEach((fnList, name) => {
      map[name] = fnList.length;
    });
    return map;
  }
}
