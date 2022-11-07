class Command {
  commandMap = new Map()
  constructor() {

  }
  /** 添加指令 */
  add(cmd, func) {
    this.commandMap.set(cmd, func)
  }
  addFromObj(obj) {
    for (let cmd in obj) {
      this.commandMap.set(cmd, obj[cmd])
    }
  }
  /** 执行指令 */
  do(cmd, ...args) {
    let func = this.commandMap.get(cmd)
    if (func) func(...args)
  }
}

module.exports = Command