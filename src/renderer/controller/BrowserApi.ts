export default class BrowserApi {
  listenerMap: Map<string, Array<(...args: any[]) => void>> = new Map();

  /** 添加监听 */
  on(channel: string, listener: (...args: any[]) => void) {
    let c = this.listenerMap.get(channel);
    if (!c) {
      c = [];
      this.listenerMap.set(channel, c);
    }
    c.push(listener);
  }

  /** 发送消息 */
  send(channel: string, ...args: any[]) {
    return this.sendHandler(channel, ...args);
  }

  /** 触发事件 */
  emit(channel: string, ...args: any[]) {
    this.listenerMap.get(channel)?.forEach((listener) => {
      listener(...args);
    });
  }

  /** 处理消息发送 */
  sendHandler: (channel: string, ...args: any[]) => Promise<any> =
    async () => {};
}
