/** 通用连接类型 */
export interface UniLink {
  on: (channel: string, func: (sender: UniSender, ...args: any[]) => void) => void
  send: (channel: string, ...args: any[]) => void
}

/** 通用连接发送类型 */
export interface UniSender {
  /** 发送源 */
  origin: any
  /** 发送源类型 */
  type: string
  /** 发送消息 */
  send: (channel: string, ...args: any[]) => void
}
