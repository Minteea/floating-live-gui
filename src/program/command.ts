export default class Command {
  commandMap: Map<string, (...args: any[]) => void> = new Map();

  /** 添加指令 */
  add(cmd: string, func: (...args: any[]) => void) {
    this.commandMap.set(cmd, func);
  }

  addFromObj(obj: { [cmd: string]: (...args: any[]) => void }) {
    for (const cmd in obj) {
      this.commandMap.set(cmd, obj[cmd]);
    }
  }

  /** 执行指令 */
  execute(cmd: string, ...args: any[]) {
    const func = this.commandMap.get(cmd);
    if (func) func(...args);
  }
}
