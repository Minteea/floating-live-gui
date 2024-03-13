import commandParser from "../../utils/commandParser";
import { EventEmitter } from "eventemitter3";
import { FloatingCommandMap, FloatingEventMap, Message } from "floating-live";
import { ControllerEventMap } from "./types/maps";
import { ModPlugin } from "./module/plugin";
import { ModHook } from "./module/hook";
import { ModCommand } from "./module/command";
import { ModValue } from "./module/value";
import { ControllerCommandMap } from "./types";

export interface ErrorOptions {
  /** 错误消息 */
  message?: string;
  /** 错误id */
  id?: string;
  /** 错误名称 */
  [key: string]: any;
}

export default class FloatingController extends EventEmitter {
  plugin: ModPlugin;
  hook: ModHook;
  command: ModCommand;
  value: ModValue;
  private sender?: (name: string, ...args: any[]) => Promise<any>;

  constructor() {
    super();
    this.plugin = new ModPlugin(this);
    this.hook = new ModHook(this);
    this.command = new ModCommand(this);
    this.value = new ModValue(this);
    this.init();
  }

  call<T extends keyof (ControllerCommandMap & FloatingCommandMap)>(
    name: T,
    ...args: Parameters<(ControllerCommandMap & FloatingCommandMap)[T]>
  ): T extends keyof ControllerCommandMap
    ? ReturnType<ControllerCommandMap[T]>
    : T extends keyof FloatingCommandMap
    ? Promise<Awaited<ReturnType<FloatingCommandMap[T]>>>
    : never {
    return this.command.call(name, ...args);
  }

  on<T extends keyof FloatingEventMap>(
    name: T,
    listener: FloatingEventMap[T]
  ): this;
  on<N extends keyof ControllerEventMap>(
    name: N,
    listener: ControllerEventMap[N]
  ): this;
  on(name: string, listener: (...args: any) => void): this {
    return super.on(name, listener);
  }

  emit<T extends keyof FloatingEventMap>(
    name: T,
    ...args: Parameters<FloatingEventMap[T]>
  ): boolean;
  emit<N extends keyof ControllerEventMap>(
    name: N,
    ...args: Parameters<ControllerEventMap[N]>
  ): boolean;
  emit(name: string, ...args: any[]) {
    return super.emit(name, ...args);
  }

  registerSender(sender: (name: string, ...args: any[]) => Promise<any>) {
    // 只能注册一次sender
    if (this.sender)
      this.throw({
        message: "不允许重复注册sender",
        id: "sender:register_duplicate",
      });
    this.sender = sender;
  }

  unregisterSender() {
    this.sender = undefined;
  }

  async send(name: string, ...args: any[]) {
    if (!this.sender)
      this.throw({
        message: "缺失发送函数",
        id: "controller:sender_missing",
      });
    return await this.sender?.(name, ...args);
  }

  /** @deprecated */
  exec(str: string) {
    try {
      let [cmd, ...args] = commandParser(str);
      this.call(
        cmd,
        ...(args as Parameters<
          (ControllerCommandMap & FloatingCommandMap)[any]
        >)
      );
    } catch (err) {
      console.log(`指令错误: ${str}`);
    }
  }

  /** 抛出错误 */
  throw(err: Error, options?: ErrorOptions): void;
  throw(options: ErrorOptions): void;
  throw(err: Error | ErrorOptions, options?: ErrorOptions): void {
    if (err instanceof Error) {
      throw Object.assign(err, options);
    } else {
      throw Object.assign(new Error(), err);
    }
  }

  init() {
    this.on("live:message", (message: Message.All) => {
      this.hook.call("message", { message }).then((res) => {
        if (res) {
          this.emit("message", message);
        }
      });
    });
  }

  getSnapshot() {
    return {
      value: this.value.getSnapshot(),
      command: this.command.getSnapshot(),
      hook: this.value.getSnapshot(),
    };
  }
}
