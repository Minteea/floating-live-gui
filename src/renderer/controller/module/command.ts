import { FloatingCommandMap } from "floating-live";
import FloatingController from "../Controller";
import { ControllerCommandMap } from "../types/maps";

type CommandFunction = (...args: any[]) => any;

export class ModCommand {
  /** 功能列表 */
  private readonly list = new Map<string, CommandFunction>();
  protected readonly main: FloatingController;

  constructor(main: FloatingController) {
    this.main = main;
  }

  /** 注册命令 */
  register<T extends keyof ControllerCommandMap>(
    name: T,
    func: ControllerCommandMap[T]
  ): void {
    this.list.set(name, func);
    this.main.emit("command:add", name, true);
  }

  /** 取消注册命令 */
  unregister(name: string): void {
    this.list.delete(name);
    this.main.emit("command:remove", name, true);
  }

  /** 调用命令 */
  call<T extends keyof (ControllerCommandMap & FloatingCommandMap)>(
    name: T,
    ...args: Parameters<(ControllerCommandMap & FloatingCommandMap)[T]>
  ): T extends keyof ControllerCommandMap
    ? ReturnType<ControllerCommandMap[T]>
    : T extends keyof FloatingCommandMap
    ? Promise<Awaited<ReturnType<FloatingCommandMap[T]>>>
    : never {
    const command = this.list.get(name);
    if (!command) {
      return this.sendCommand(name as keyof FloatingCommandMap, ...args).catch(
        (err) => {
          if (err?.id == "controller:sender_missing") {
            this.main.throw({
              message: "命令不存在",
              id: "command:call_unexist",
            });
          } else {
            this.main.throw(err);
          }
        }
      ) as any;
    } else {
      return command(...args);
    }
  }

  /** 向服务端发送命令 */
  async sendCommand<T extends keyof FloatingCommandMap>(
    name: T,
    ...args: Parameters<FloatingCommandMap[T]>
  ): Promise<Awaited<ReturnType<FloatingCommandMap[T]>>> {
    return await this.main.send("command", name, ...args);
  }

  /** 检测命令是否存在 */
  has<T extends keyof ControllerCommandMap>(name: T) {
    return this.list.has(name);
  }

  /** 获取快照 */
  getSnapshot() {
    return [...this.list].map(([key]) => key);
  }
}
