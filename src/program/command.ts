import { CommandSet, FLCommandSet } from "./CommandTypes";

export default class Command {
  commandMap: Map<string, (...args: any) => void> = new Map();

  /** 添加指令 */
  add<S extends CommandSet = FLCommandSet, K extends string = keyof S & string>(cmd: K, func: (...args: S[K]) => void) {
    this.commandMap.set(cmd, func);
  }

  addFromObj<S extends CommandSet = FLCommandSet>(obj: { [K in keyof S]?: (...args: S[K]) => void }) {
    for (const cmd in obj) {
      let func = obj[cmd]
      func ? this.commandMap.set(cmd, func) : null;
    }
  }

  /** 执行指令 */
  execute<S extends CommandSet = FLCommandSet, K extends string = keyof S & string>(cmd: K, ...args: S[K]) {
    const func = this.commandMap.get(cmd);
    if (func) func(...args);
  }
}
