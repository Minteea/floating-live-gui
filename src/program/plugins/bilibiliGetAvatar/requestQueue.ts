type QueueItem = {
  func: (...args: any) => void,
  expire: number
  id?: string | number
}

export default class RequestQueue {
  /** 请求间隔 */
  interval: number
  /** 超时限制 */
  timeout: number
  list: Array<QueueItem> = []
  queueing: Set<string | number> = new Set()
  timer: NodeJS.Timeout | null = null
  constructor({interval, timeout}: {
    interval: number
    timeout: number
  }) {
    this.interval = interval
    this.timeout = timeout
  }
  public add(func: (...args: any) => void, id?: string | number) {
    // 如果存在同一id, 代表队列上已有同一请求, 故不再添加
    if (id && this.queueing.has(id)) return
    let item = {
      func,
      expire: new Date().valueOf() + this.timeout,
      id,
    }
    // 如果队列是空的，则添加之后执行check操作
    const isEmpty = !this.list.length
    this.list.push(item)
    // 添加id以防重复请求
    id && this.queueing.add(id)
    // 如果此列表已清空且没有定时器, 需要重新开始执行
    isEmpty && !this.timer && this.check()
  }
  private check() {
    // 如果发现列表已清空，则不再设置定时器
    if (this.list.length) {
      let [current] = this.list.splice(0, 1)
      if (new Date().valueOf() < current.expire) {
        // 如果未过期, 则执行当前函数并设置定时后执行下一条
        current.func()
        this.timer = setTimeout(() => {
          // 到时后清除定时器
          clearTimeout(this.timer!)
          this.timer = null
          // 执行下一条
          this.check()
        }, this.interval)
      } else {
        // 如果已过期，则不再执行该条并立即执行下一条
        this.check()
      }
      // 删除id
      current.id && this.queueing.delete(current.id)
    }
  }
}